/**
 * @component MultiList
 * @version 3.0.0
 * @description 多列表组件，该组件基于list组件封装，支持列表展示，支持自定义模板展示。
 *
 * - 采用树形结构datasource组织层级关系
 * - 实现了异步加载列表
 * - 支持多选&单选
 * - 支持不同级别列表的样式自定义
 *
 * @author eva.li
 *
 */

import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ContainerList from './ContainerList.js';

export default class MultiList extends Component {
    static propTypes = {
        /**
         * 原始数据用于生成列表
         * @property dataSource
         * @type PropTypes.array or PropTypes.func
         * @description
         * dataSource 是一个树形的结构，每一个层级会有defaultValue，表示默认展开该哪个item，subList为当点选该层级的时候，下一层级的内容。
         * 余下所有的属性都会被传给list组件。
         *
         * - renderItem用于表示该层级item的模板
         * - subList支持数组和返回promise的函数,返回Promise的函数的用法适用于异步加载列表。
         * - defaultValue 表示该层级的默认值
         *
         * ``
         * const dataSource = {
         *      defaultValue: 3,
         *      renderItem: parentItem,
         *      itemExtraClass: (item) => (
         *          this.state && this.state.value && this.state.value[0] === item.value ?
         *          'spread item'
         *          : 'item'
         *      ),
         *      subList: [{
         *          name: '距离我',
         *          value: 0,
         *          defaultValue: 0,
         *          subList: distanceData,
         *          onItemTap: (listValue, itemValue) => {
         *              const newlistValue = itemValue;
         *              if (itemValue !== 0) {
         *                  effect = 1;
         *              } else {
         *                  effect = -1;
         *              }
         *              return newlistValue;
         *          }
         *      }, {
         *          name: '商圈',
         *          value: 1,
         *          subList: localData,
         *          defaultValue: 0,
         *          renderItem: (p) => {
         *              if (p.item.value === 0) {
         *                  return <PlanItem {...p} effectValue={effectValue} />;
         *              }
         *              return <CheckBoxItem {...p} />;
         *          },
         *          onItemTap: (listValue, itemValue) => {
         *              let newValue;
         *              if (itemValue === 0) {
         *                  newValue = itemValue;
         *                  effect = 1;
         *              } else {
         *                  if(!(listValue instanceof Array)){ listValue = [];}
         *                  if (!~listValue.indexOf(itemValue)){
         *                      newValue = listValue.slice(0);
         *                      newValue.push(itemValue);
         *                      effect = 1;
         *                  } else {
         *                      newValue = listValue.slice(0);
         *                      newValue.splice(listValue.indexOf(itemValue), 1);
         *                      effect = 1;
         *                  }
         *                  if (newValue.length === 0) {
         *                      effect = -1;
         *                      newValue = 0;
         *                  }
         *              }
         *              return newValue;
         *          }
         *      }, {
         *          name: '热门景点',
         *          value: 3,
         *          defaultValue: '1',
         *          renderItem: parentItem,
         *          subList: touristAttraction,
         *          extraClass: 'subList',
         *          itemExtraClass: (item) => (
         *              this.state && this.state.value && this.state.value[1] === item.value ?
         *              'spread-item item'
         *              : 'item'
         *          )
         *      }]
         *  };
         * ``
         */
        dataSource: React.PropTypes.shape({
            subList: React.PropTypes.oneOfType([
                React.PropTypes.array,
                React.PropTypes.func
            ]).isRequired,
            defaultValue: React.PropTypes.oneOfType([
                React.PropTypes.array,
                React.PropTypes.string,
                React.PropTypes.number
            ])
        }),
        /**
         * @property updateDataSource
         * @type PropTypes.func
         * @param dataSource 处理好的datasource
         * @param data 异步处理后的data
         * @description 更新数据的回调函数，使用异步时必须配置，将异步函数处理结果传给的回调交由父层更新dataSource
         */
        updateDataSource: PropTypes.func,
        /**
         *
         * @property value
         * @type  PropTypes.array
         * @description mutliList的值,该值为点选的路径，及当前展开路径
         */
        value: React.PropTypes.array,
        /**
         *
         * @property updateValue
         * @type PropTypes.func.isRequired
         * @description
         * 用于更新结果的回调函数
         *
         * ``
         * 	function({level, listValue, newValue}){
         *  	level 表示层级
         *  	listValue 表示当前层级的list的value
         *  	newValue 表示更新后的multiList的value
         * 	}
         *  ``
         *
         */
        updateValue: PropTypes.func.isRequired
    }
    static defaultProps = {
        updateDataSource: () => {}
    }

    constructor(props) {
        super(props);
        const {
            value
        } = props;
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.router = value instanceof Array ? value.slice(0) : Array.of(value);
    }

    componentDidMount() {
        if (this.router.join('&') !== this.props.value.join('&')) {
            this.props.updateValue({
                newValue: this.router
            });
        }
    }
    componentWillReceiveProps(nextprops) {
        const {
          value
        } = nextprops;
        this.router = value instanceof Array ? value.slice(0) : Array.of(value);
    }
    shouldComponentUpdate() {}
    componentDidUpdate() {
        if (this.router.join('&') !== this.props.value.join('&')) {
            this.props.updateValue({
                newValue: this.router
            });
        }
    }

    /**
     * @param  {Number} p 列表层级
     * @param  {Array|string} v 对应层级列表选择结果
     * @description 用于同步列表结果
     */
    updateValue(level, listValue) {
        const newValue = this.props.value
        ? this.props.value.slice(0, level)
        : Array.from(level + 1);
        newValue[level] = listValue;
        for (let i = newValue.length - 1; i >= 0; i--) {
            const item = newValue[i];
            if (item == null) {
                newValue[i] = this.router[i];
            }
        }
        this.props.updateValue({ level, listValue, newValue });
    }

    /**
     * @param  {Array} data [获取到的用于展示的数据列表内容]
     * @description 异步数据处理函数，异步数据请求结束后根据路径替换指定subList，并调用接口通知父层更新数据
     */
    _handleAjaxData(data) {
        const newDataSource = Object.assign({}, this.props.dataSource);
        let tmp = newDataSource;
        while (this.valueLink.length > 0) {
            tmp = tmp.subList[this.valueLink.shift()];
        }
        tmp.subList = data;
        this.props.updateDataSource(newDataSource, data);
    }
    /**
     * @param  {Object} listData 渲染列表的所有数据
     * @param  {Number} p          当前列表的层级
     * @description 渲染多级listView
     */
    _recursionRenderSignalList(listData, p) {
        if (listData.subList instanceof Array) {
            // let key = Number(Math.random()*1000);
            this.children.push(
              <ContainerList
                {...listData}
                key={p}
                index={p}
                value={this.props.value[p]}
                valueChange={(level, listValue) => {
                    this.updateValue(level, listValue);
                }}
                dataStatus
                multiValue={this.props.value}
              />
            );
            // 取value值
            let target = this.router[p] instanceof Array ?
                this.router[p][0] :
                this.router[p];
            // 没有值取defaultValue
            if (target == null) {
                if (listData.defaultValue != null) {
                    target = listData.defaultValue;
                    const newRouter = this.router.slice(0);
                    newRouter[p] = target;
                    this.router = newRouter;
                } else {
                    return;
                }
            }
            // const next = listData.subList.some((item, i) => {
            listData.subList.some((item, i) => {
                if (item.value === target && (item.subList || item.renderContent)) {
                    this.valueLink.push(i);
                    this._recursionRenderSignalList(item, p + 1);
                    return true;
                }
                return false;
            });
            // if (!next) {
            //     const len = this.children.length;
            //     this.children[len - 1].props.containerListExtraClass += 'last-multiList-listcontainer';
            // }
        } else if (listData.subList != null) {
          // 异步逻辑处理
            listData.subList().then((data) => {
                this._handleAjaxData(data);
            }, () => {
                this._handleAjaxData([]);
            });
            this.children.push(
              <ContainerList
                key={p}
                index={p}
                value={this.props.value[p]}
                dataStatus={false}
                multiValue={this.props.value}
              />
            );
        } else {
          // 数据为空的处理 或者使用客制化模板
            this.children.push(
              <ContainerList
                {...listData}
                key={p}
                index={p}
                value={this.props.value[p]}
                dataStatus
                multiValue={this.props.value}
              />
            );
        }
    }

    /**
     * @description 渲染多级列表的调用函数
     * @return {Array} 列表的虚拟dom树
     */
    renderList() {
        this.children = [];
        this.valueLink = [];
        this._recursionRenderSignalList(this.props.dataSource, 0);
        return this.children;
    }

    render() {
        return (
          <div className="multiList-container">
            {this.renderList()}
          </div>
        );
    }
}
