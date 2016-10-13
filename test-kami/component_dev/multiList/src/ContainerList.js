/**
 * @component ContainerList
 * @version 3.0.0
 * @description 多重列表组建的内置组件，基于list组件封装
 *
 * - 支持自定义内容&列表的展示
 * - 支持异步加载时模板和加载失败没有数据情况下使用的自定义模板
 * - 该组件基于list组件扩展，list组件所有属性同样适用
 *
 * @author eva.li
 */
import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ListView from '../../list/src';
import { PlanItem } from './listItems.js';
import './style.scss';
const shallowEqual = require('../../../node_modules/fbjs/lib/shallowEqual.js');


export default class ContainerList extends Component {
    static propTypes = {
        /**
         *
         * @property onItemClick
         * @param listValue 该列表的值
         * @param itemValue 点击该项的值
         * @type PropTypes.func
         * @return 即将生效的listValue
         * @description 用户自定义的该列列表点击的事件处理函数
         */
        onItemClick: PropTypes.func,
        /**
         * @property value
         * @type PropTypes.number | PropTypes.string | PropTypes.array
         * @description listValue
         */
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.array
        ]),
        /**
         * @property valueChange
         * @type PropTypes.func
         * @param index props.index
         * @param value listValue
         * @param ds dataSource
         * @description 更新完listValue的回调函数
         */
        valueChange: PropTypes.func,
        /**
         * @property index
         * @type PropTypes.number
         * @description 多级列表中的级别
         */
        index: PropTypes.number.isRequired,
        /**
         * @property multiValue
         * @description 多级列表的value
         */
        multiValue: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.array
        ]),
        /**
         * @property defaultValue
         * @type  PropTypes.number | PropTypes.string | PropTypes.array
         * @description 该列的默认value
         */
        defaultValue: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.array
        ]),
        /**
         * @property subList
         * @type PropTypes.array
         * @description listView 的dataSource
         */
        subList: PropTypes.array,
        /**
         * @property emptyTemplate
         * @type PropTypes.element
         * @description 渲染数据为空时的替换模板
         */
        emptyTemplate: PropTypes.element,
        /**
         * @property loadingTemplate
         * @type PropTypes.element
         * @description 渲染列表正在加载时的替换模板
         */
        loadingTemplate: PropTypes.element,
        /**
         * @property dataStatus
         * @type PropTypes.boolean
         * @description 为true表示列表数据不会变化展示空模板或者是常态渲染结果, false时表示数据正在加载展示加载中模板
         */
        dataStatus: PropTypes.bool.isRequired,
        /**
         * @property renderItem
         * @type PropTypes.func
         * @param item 用于渲染该节点的数据
         * @param multiValue multiList的value
         * @param listValue 该列表的值
         * @param defaultValue 默认值
         * @param level 该列表对应multiList中的层级
         * @return PropTypes.element
         * @description renderItem返回 item节点的方法
         */
        renderItem: PropTypes.func,
        /**
         * @property renderContent
         * @type PropTypes.func
         * @return PropTypes.element
         * @description 用于自定义内容的render函数
         */
        renderContent: PropTypes.func,
        /**
         * @property containerListExtraClass
         * @type PropTypes.string
         * @description 传给该组件的样式名称 extraClass传给list组件
         */
        containerListExtraClass: PropTypes.string
    }
    static defaultProps = {
        renderItem: (props) => <PlanItem {...props} />,
        loadingTemplate: <p className="multiList-container-tip">数据加载中...</p>,
        emptyTemplate: <p className="multiList-container-tip">数据为空</p>,
        containerListExtraClass: ''
    }

    constructor(props) {
        super(props);
        this.updateItem = false;
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.updateItem =
          nextProps.value !== this.props.value || nextProps.multiValue !== this.props.multiValue;
    }

    componentDidUpdate() {
        this.updateItem = false;
    }

    handleClick(item, ds) {
        let value;
        if (this.props.onItemTap) {
            value = this.props.onItemTap(this.props.value, item.value);
        } else {
            value = item.value;
        }
        this.props.valueChange(this.props.index, value, ds);
    }
    _renderListView() {
        const {
            defaultValue,
            multiValue,
            emptyTemplate,
            loadingTemplate,
            subList,
            dataStatus
        } = this.props;
        const listValue = this.props.value;
        const level = this.props.index;
        if (dataStatus) {
            if (this.props.subList.length > 0) {
                return (
                  <ListView
                    {...this.props}
                    ref={(node) => {
                        if (node) this.listView = node;
                    }}
                    dataSource={subList}
                    renderItem={(item) => (
                        this.props.renderItem({ item, multiValue, listValue, defaultValue, level })
                    )}
                    onItemTap={(item, ds) => this.handleClick(item, ds)}
                    shouldItemUpdate={
                      (ret, prev, next) => this.updateItem || !shallowEqual(prev, next)
                    }
                  />
              );
            }
            return emptyTemplate;
        }
        return loadingTemplate;
    }

    render() {
        const classList = ['multiList-listContainer'];
        classList.push(`multiList-listContainer-${this.props.index}`);
        classList.push(this.props.containerListExtraClass);
        return (
          <div className={classList.join(' ')}>
            {this.props.renderContent ? this.props.renderContent() : this._renderListView()}
          </div>
      );
    }
}
