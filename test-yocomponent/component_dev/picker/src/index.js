/**
 * @component Picker
 * @description Picker组件,行为和特性与iOS原生的picker完全一致
 *
 * 支持两种模式:静态模式和循环模式。
 *
 * 静态模式会完全按照传入的options渲染待选项,而循环模式会将options变成一个首尾循环的数据结构,可以无限地向上/向下滚动。
 * @author jiao.shen
 */
import PickerCore from './PickerCore';
import React, {Component, PropTypes} from 'react';
import Scroller from '../../scroller/src';
import PickerItem from './PickerItem';
import './style.scss';

const SIZE = 1000000;
const ITEM_HEIGHT = 30;

export default class Picker extends Component {

    static propTypes = {
        /**
         * @property options
         * @type array
         * @default null
         * @description picker的options,数组形式,元素的格式为{text:string,value:string}
         *
         * text为option显示的文本,value为option对应的真实值(参考网页option标签)
         *
         * text的缺省值为value,value必须传入,且只能为字符串/数字类型
         */
        options: PropTypes.arrayOf(
            PropTypes.shape(
                {
                    text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
                }
            )
        ).isRequired,
        /**
         * @property value
         * @type number/string
         * @default null
         * @description 组件的value,参考网页select标签的value属性
         *
         * value是一个严格受控属性,只能通过picker的父组件改变,你需要设置onChange属性来控制value属性的变化
         */
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        /**
         * @property onChange
         * @type function
         * @default null
         * @param value 当前的option的value
         * @description 组件划动时触发的事件回调,如果不设置这个属性,这个picker的value将无法根据picker的滚动改变。
         *
         * onChange能够接收一个参数option,为当前选中的option的数据对象。
         *
         * 如果你不重新设置value,那么组件将会回滚到之前的值。
         *
         * onChange和value的使用和网页中select对应属性的使用完全一致。
         */
        onChange: PropTypes.func,
        /**
         * @property height
         * @type number
         * @default 150
         * @description picker的高度,默认150.
         *
         * Picker组件不能自适应容器的高度,必须为Picker组件显式地指定高度。
         */
        height: PropTypes.number.isRequired,
        /**
         * @property looped
         * @type bool
         * @default true
         * @description 是否采用循环模式,默认为true
         */
        looped: PropTypes.bool,
        /**
         * @property unit
         * @type number
         * @default null
         * @description 显示在picker右侧的单位
         */
        unit: PropTypes.string,
        /**
         * @property extraClass
         * @type string
         * @default null
         * @description 附加给组件根节点的额外class
         */
        extraClass: PropTypes.string,
        /**
         * @property stopPropagation
         * @type PropTypes.bool
         * @default false
         * @description 是否阻止默认事件传播，默认为false不阻止。
         */
        stopPropagation: PropTypes.bool,
    };

    static defaultProps = {
        value: null,
        onChange: (value)=> {
        },
        height: 150,
        looped: true,
        unit: null,
        stopPropagation: false,
        extraClass: '',
    };

    constructor(props) {
        super(props);

        const {options, value, height, looped}=props;
        const infiniteSize = Math.floor((height / ITEM_HEIGHT) * 1.5);
        const size = looped ? SIZE : options.length;

        this.pickerModel = new PickerCore(
            options,
            value,
            size,
            height,
            ITEM_HEIGHT,
            looped
        );
        //因为槽的数量和组件的高度有关,因此也在state中维护
        this.state = {
            thunks: this.pickerModel.thunks,
            height: this.pickerModel.containerHeight,
            contentHeight: this.pickerModel.contentHeight,
            visibleList: this.pickerModel.visibleList,
            offsetY: this.pickerModel.offsetY
        };
    }

    componentDidMount() {
        this.refs.scroller.refresh({
            scrollerHeight: this.state.contentHeight,
            wrapperHeight: this.state.height
        });
    }

    componentWillMount() {
        this.pickerModel
            .registerEventHandler('change', visibleList=> {
                this.setState({visibleList});
            })
            .registerEventHandler('momentumStart', newY=> {
                this.refs.scroller.scrollTo(0, newY, 300);
            })
            .registerEventHandler('resetValue', (newY, needRefresh)=> {
                this.setState({offsetY: newY});

                if (needRefresh) {
                    this.refreshOffsetY(newY);
                }
            })
            .registerEventHandler('refresh', (offsetY, visibleList, options, height, contentHeight, thunks)=> {
                this.setState({offsetY, visibleList, options, height, contentHeight, thunks});
                this.refreshOffsetY(offsetY);
                //等待update结束,refresh scroller
                setTimeout(()=> {
                    this.refs.scroller.refresh({
                        scrollerHeight: contentHeight,
                        wrapperHeight: height
                    });
                }, 0);
            });
    }

    /**
     * 如果仅仅是value发生了改变,其他属性都没有改变,只调用setValue
     * 这样可以跳过一些复杂的计算过程
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        const {value, options, height, looped} = nextProps;

        if (options === this.props.options
            && height === this.state.height
            && looped === this.props.looped) {
            if (this.props.value !== value) {
                this.pickerModel.setValue(value, true);
            }
        }
        else {
            this.pickerModel.refresh(options, value, height, looped, true);
        }
    }

    /**
     * 根据当前的y重新计算visibleList
     * @param y
     */
    refreshOffsetY(y) {
        this.refs.scroller.scrollTo(0, y);
        this.props.looped && this.pickerModel.onScrollTo(y);
    }

    /**
     * 滚动停止时,校正位置(需要正好卡到某个option处)并触发onChange
     * 然后验证外部组件是否重置了value,如果没有,回滚到之前的option
     * @param evt
     */
    onScrollTerminate(evt) {
        //console.log('term')
        const currentY = evt.contentOffset.y,
            destination = this.pickerModel.getScrollDestination(currentY);

        //滚动停止时再次校验是否滚到了正确的位置
        //因为用户可能在惯性滑动时再次点击,终止惯性滚动,所以可能滑不到正确位置
        if (currentY !== destination.y) {
            this.pickerModel.onMomentumStart(currentY);
            return;
        }
        //此处检验是否value真的发生了变化,这样可以减少很多onChange引起的render
        const lastStateY = this.state.offsetY,
            lastItem = this.pickerModel.getScrollDestination(lastStateY).item,
            selectedItem = destination.item;
        this.pickerModel.offsetY = currentY;
        if (selectedItem.value !== lastItem.value) {
            this.props.onChange(selectedItem);
        }
        //在用户重设value之后验证value是否已经改变
        //如果没有改变,回滚到上一个状态的offsety
        setTimeout(()=> {
            if (this.state.offsetY === lastStateY) {
                this.pickerModel.offsetY = lastStateY;
                this.refreshOffsetY(lastStateY);
            }
        }, 0);
        //重置isScrolling
        //放在timeout里是为了让tap先触发
        //200毫秒的延迟是为了防止使用者频繁点击导致错乱
        setTimeout(()=> {
            this.isScrolling = false;
        }, 200);
    }

    render() {
        const itemHeight = ITEM_HEIGHT;
        const {extraClass, unit}=this.props;
        const looped = this.pickerModel.looped;
        const {visibleList, offsetY, height, contentHeight, thunks}=this.state;
        const self = this;
        const loopHandlers = {
            onScroll: evt=> {
                this.pickerModel.onScrollTo(evt.contentOffset.y);
                this.isScrolling = true;
            }
        };

        return (
            <div className={"yo-picker " + extraClass} style={{height: height}}>
                <span className="mask"/>
                <Scroller
                    style={{
                        width: "100%"
                    }}
                    contentOffset={{x: 0, y: offsetY}}
                    ref="scroller"
                    stopPropagation={this.props.stopPropagation}
                    wrapper={{clientWidth: 0, clientHeight: height}}
                    useTransition={true}
                    {...looped ? loopHandlers : null}
                    autoRefresh={false}
                    onScrollEnd={evt=> {
                        this.onScrollTerminate(evt);
                    }}
                    //scrollCancel对应着两种情况:1.在滚动过程中tap中断滚动,2.静止时tap,只有第一种情况
                    //才应该执行onScrollTerminate回调,在第二种情况会执行option的onOptionTap回调(直接滚动到目标option)
                    //因此此处必须加上isScrolling的判断
                    onScrollCancel={evt=> {
                        if (this.isScrolling) {
                            this.onScrollTerminate(evt);
                        }
                    }}
                    onMomentumScrollBegin={evt=>this.pickerModel.onMomentumStart(evt.param.targetY)}
                    deceleration={0.001}
                    bounceTime={looped ? 600 : 200}
                >
                    <ul
                        className="list"
                        style={{
                            width: "100%",
                            height: contentHeight
                        }}
                    >
                        {looped ?
                            thunks.map((_, order)=> {
                                const ele = visibleList.find(item=>item.order === order);
                                return ele ? (
                                    <PickerItem
                                        onOptionTap={(ele)=> {
                                            if (!this.isScrolling) {
                                                this.refs.scroller.scrollTo(0, this.pickerModel.getPositionByOpt(ele), 300);
                                            }
                                        }}
                                        ele={ele}
                                        itemHeight={itemHeight}
                                        key={order}
                                        order={order}
                                    />
                                ) : null;
                            }) :
                            visibleList.map((item, i)=> {
                                return (
                                    <PickerItem
                                        onOptionTap={(ele)=> {
                                            if (!this.isScrolling) {
                                                this.refs.scroller.scrollTo(0, this.pickerModel.getPositionByOpt(ele), 300);
                                            }
                                        }}
                                        ele={item}
                                        itemHeight={itemHeight}
                                        key={'notLooped_' + i}
                                        notLooped={true}
                                    />
                                );
                            })}
                    </ul>
                </Scroller>
                {unit ? <span className="yo-select-item-tag unit">{unit}</span> : null}
            </div>
        );
    }
}
