/**
 * @component Suggest
 * @description Suggest组件,根据用户的输入给出输入提示并展示在输入框下方
 *
 * Suggest的内容分为两个区域,推荐区域(recommendTmpl)会在用户输入开始前渲染,可以用来给出一些热门推荐。
 *
 * 结果区域(resultTmpl)响应用户的输入,根据用户的输入给出输入提示。
 *
 * 结果区域默认以列表的形式展示输入提示,你也可以自己定制结果区域的模板。
 */
import React, {Component, PropTypes}from 'react';
import "./style.scss";
import "../../common/tapEventPluginInit";
import List from "../../list/src";
import throttle from '../../common/throttle';

export default class Suggest extends Component {

    static getResultText(result) {
        return typeof result === 'object' ?
            result.text :
            (typeof result === 'string' || typeof result === 'number') ?
                result : null;
    }

    static renderItem(result) {
        return Suggest.getResultText(result);
    }

    renderResult(results) {
        const {
            renderItem,
            onItemTap,
            noDataTmpl,
            itemActiveClass,
            recommendTmpl
        }=this.props;

        return this.state.condition ? results.length ? (
            <List
                ref={component=> {
                    this.resultList = component;
                }}
                dataSource={results}
                renderItem={renderItem}
                infinite={false}
                onItemTap={onItemTap}
                itemActiveClass={itemActiveClass}
            />
        ) : noDataTmpl : null;
    }

    constructor(props) {
        super(props);
        this.prev = null;
        this.state = {condition: props.defaultCondition, showRecommendMask: false};
        this.wrapConditionChangeHandler();
    }

    wrapConditionChangeHandler(gap = this.props.throttleGap) {
        if (gap) {
            this.onConditionChangeHandler = throttle((value)=> {
                if (value !== this.prev) {
                    this.prev = value;
                    this.props.onConditionChange(value);
                }
            }, this, gap, gap);
        }
        else {
            this.onConditionChangeHandler = (value)=> {
                if (value !== this.state.condition) {
                    this.props.onConditionChange(value);
                }
            }
        }
    }

    onConditionChange(value) {
        this.onConditionChangeHandler(value);
        this.setState({condition: value});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultCondition !== this.props.defaultCondition) {
            this.setState({condition: nextProps.defaultCondition});
        }
    }

    /**
     * @method clearInput
     * @description 清空输入框的内容
     */
    clearInput() {
        this.onConditionChange('');
    }

    getIconClass(iconName, otherClassName) {
        const {showCancelButton, inputIcon}=this.props;
        const iconClass = [
            'yo-ico',
            'yo-ico-delete',
            showCancelButton ? 'show-cancel' : ''
        ].join(' ').replace(/\s$/, '');
        return [
            iconClass,
            !inputIcon || inputIcon === 'delete' ?
                iconName === 'delete' && this.state.condition !== '' ? 'show' : '' :
                inputIcon === iconName ? 'show' : '',
            otherClassName
        ].join(' ').replace(/\s$/, '');
    }

    render() {
        const {condition}=this.state;
        const {
            results,
            extraClass,
            renderResult,
            showCancelButton,
            inputIcon,
            onIconTap,
            onCancelButtonTap,
            placeholder,
            showMask,
            maskOpacity
        }=this.props;
        const rootClass = [
            "yo-suggest",
            extraClass,
            showCancelButton ? "yo-suggest-modal" : ""
        ].join(' ');
        const realRenderResult = renderResult ? renderResult : this.renderResult.bind(this)
        const deleteIconClass = this.getIconClass('delete');
        const loadingIconClass = this.getIconClass('loading', 'rotate');
        const refreshIconClass = this.getIconClass('refresh');
        const stopIconClass = this.getIconClass('stop');
        const resultContent = realRenderResult(results);

        return (
            <div className={rootClass}>
                <div className="operate">
                    <form className="action">
                        <i className="yo-ico yo-ico-suggest">&#xf067;</i>
                        <input
                            ref={dom=>this.input = dom}
                            value={condition}
                            onChange={(evt)=> {
                                this.onConditionChange(evt.target.value)
                            }}
                            onFocus={(evt)=> {
                                this.props.onFocus(evt.target.value);
                                this.setState({showRecommendMask: true});
                            }}
                            onBlur={(evt)=> {
                                this.props.onBlur(evt.target.value);
                                this.setState({showRecommendMask: false});
                            }}
                            type="search"
                            className={"input " + (!showCancelButton ? 'nocancel' : '')}
                            id="yo-suggest-input"
                            placeholder={placeholder}
                        />
                        <i
                            className={deleteIconClass}
                            onTouchTap={()=> this.clearInput()}
                        >
                            &#xf077;
                        </i>
                        <i className={loadingIconClass}>&#xf089;</i>
                        <i
                            onTouchTap={()=>onIconTap('refresh', condition)}
                            className={refreshIconClass}
                        >
                            &#xf07a;
                        </i>
                        <i
                            onTouchTap={()=>onIconTap('stop', condition)}
                            className={stopIconClass}
                        >
                            &#xf063;
                        </i>
                    </form>
                    {showCancelButton ?
                        <span
                            className="cancel"
                            onTouchTap={evt=> {
                                onCancelButtonTap(evt)
                            }}
                        >
                            取消
                        </span> : null}
                </div>
                <div className="cont" onTouchTap={()=>this.input.blur()}>
                    <div className="recommend">
                        {this.props.recommendTmpl}
                        <div style={{
                            display: this.state.showRecommendMask && showMask ? 'block' : 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,' + maskOpacity + ')',
                            zIndex: 999
                        }}/>
                    </div>
                    <div className="result" style={{display: resultContent ? 'block' : 'none'}}>
                        {resultContent}
                    </div>
                </div>
            </div>
        );
    }
};

Suggest.defaultProps = {
    results: [],
    onConditionChange: ()=> {
    },
    extraClass: '',
    itemActiveClass: 'item-light',
    noDataTmpl: null,
    onItemTap: (result, i, evt)=> {
        console.log(result, i, evt)
    },
    renderItem: Suggest.renderItem,
    renderResult: null,
    showCancelButton: false,
    showLoadingIcon: false,
    onFocus: ()=> {
    },
    onBlur(){
    },
    onIconTap: ()=> {
    },
    defaultCondition: '',
    placeholder: '搜索',
    inputIcon: 'delete',
    onCancelButtonTap(){
    },
    recommendTmpl: null,
    showMask: true,
    maskOpacity: 0.3,
    throttleGap: null
};

Suggest.propTypes = {
    /**
     * @property results
     * @type Array
     * @default []
     * @description 渲染在结果区的数据源,数组类型,数组元素的类型可以是字符串/数字,它们会直接作为列表项的内容;
     *
     * 也可以是对象,这个对象必须有text属性。
     */
    results: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.shape({
            text: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]).isRequired
        })
    ])),
    /**
     * @property onConditionChange
     * @type Function
     * @param {String} value 输入框当前的value
     * @default null
     * @description 输入框onChange事件回调,必需。
     *
     * 为了使组件正常工作,你必须定义这个属性,根据每次的value来更新results。
     */
    onConditionChange: PropTypes.func,
    /**
     * @property extraClass
     * @type String
     * @default null
     * @description 附加给组件根节点的额外类名
     */
    extraClass: PropTypes.string,
    itemActiveClass: PropTypes.string,
    /**
     * @property noDataTmpl
     * @type JSX
     * @default null
     * @description 没有suggest结果时的模板
     */
    noDataTmpl: PropTypes.element,
    /**
     * @property recommendTmpl
     * @type JSX
     * @default null
     * @description 推荐区域内容,在搜索条件为空时展示
     */
    recommendTmpl: PropTypes.element,
    /**
     * @property onItemTap
     * @typeFunction
     * @default ()=>{}
     * @param {Object} item 数据源中的元素
     * @param {Number} index item在数据源中的index
     * @description 点击结果项时的回调
     */
    onItemTap: PropTypes.func,
    /**
     * @property renderItem
     * @type Function
     * @default Suggest.renderItem
     * @param {Object{...,text:String}} item 结果项的数据对象
     * @description 自定义结果项的渲染方式,返回JSX或字符串。
     */
    renderItem: PropTypes.func,
    /**
     * @property renderResult
     * @type Function
     * @default null
     * @param results 结果列表
     * @description 自定义结果容器的渲染方式,返回JSX。默认会返回一个List。
     *
     * 如果不希望以List的形式展示结果,可以自行实现这个函数
     */
    renderResult: PropTypes.func,
    /**
     * @property showCancelButton
     * @type Bool
     * @default false
     * @description 是否显示取消按钮,默认不显示
     */
    showCancelButton: PropTypes.Bool,
    /**
     * @property showLoadingIcon
     * @type Bool
     * @default false
     * @description 是否显示loading图标,默认不显示
     */
    showLoadingIcon: PropTypes.Bool,
    //validation: PropTypes.string,
    /**
     * @property onCancelButtonClick
     * @typeFunction
     * @default ()=>{}
     * @description 点击取消按钮时的回调
     */
    onCancelButtonTap: PropTypes.func,
    /**
     * @property onFocus
     * @type Function
     * @default ()=>{}
     * @param condition 当前输入框的value
     * @description 输入框聚焦时的回调
     */
    onFocus: PropTypes.func,
    /**
     * @property onBlur
     * @type Function
     * @default ()=>{}
     * @param condition 当前输入框的value
     * @description 输入框失去焦点时的回调
     */
    onBlur: PropTypes.func,
    /**
     * @property defaultCondition
     * @type String
     * @default null
     * @description 展示在输入框中的默认值
     */
    defaultCondition: PropTypes.string,
    /**
     * @property placeholder
     * @type String
     * @default null
     * @description 输入框的placeholder
     */
    placeholder: PropTypes.string,
    /**
     * @property inputIcon
     * @type String
     * @default 'delete'
     * @description 展示在输入框右侧的icon,有四个icon可供选择:delete,loading,refresh和stop
     */
    inputIcon: PropTypes.oneOf(['delete', 'loading', 'refresh', 'stop']),
    /**
     * @property onIconTap
     * @type Function
     * @default ()=>{}
     * @param iconName 图标名称
     * @param condition 当前输入框的value
     * @description 点击input icon触发的回调
     */
    onIconTap: PropTypes.func,
    /**
     * @property showMask
     * @type Bool
     * @default true
     * @description 当输入框处于聚焦状态时,是否展示recommend区域的蒙层,默认展示
     */
    showMask: PropTypes.Bool,
    /**
     * @property maskOpacity
     * @type Number
     * @default 0.3
     * @description recommend区域蒙层的透明度
     */
    maskOpacity: PropTypes.number,
    /**
     * @property throttleGap
     * @type Number
     * @default 300
     * @description 设置此属性以后,文本框的onChange事件的触发频率会降低,例如设置为300会使得onChange每300毫秒触发一次.
     *
     * 通过这种方式,可以控制组件结果区域的render次数,降低和服务器交互的频率
     */
    throttleGap: PropTypes.number
};
