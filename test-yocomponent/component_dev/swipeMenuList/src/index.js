/**
 * @component SwipeMenuList
 * @description SwipeMenuList组件,使用List实现,列表项全部为SwipeMenu。
 *
 * 它的数据源和List组件的区别在于,对于每一个数据对象,你需要定义action属性来配置每个SwipeMenu的按钮。
 *
 * 另外它以renderMenuContent属性代替了renderItem,这个新属性可以配置组件应该如何渲染SwipeMenu的内容区域。
 * @author jiao.shen
 */
import React, {Component, PropTypes} from 'react';
import List from '../../list/src';
import SwipeMenu from '../../swipeMenu/src';

const noop = ()=> {
};

export default class SwipeMenuList extends Component {

    static PropTypes = {
        /**
         * @property dataSource
         * @type Array
         * @default null
         * @description 组件数据源,数组类型,里面的元素对应着一个SwipeMenu的配置对象,需要符合如下格式:
         * ```
         * {
         *  //配置菜单的按钮
         *  action:[
         *    {
         *      content: string //按钮文本,必须
         *      tap: function //按钮的点击事件回调,接受参数item(这个配置对象的引用),index(配置对象在数据源的index)以及component(该对象对应的SwipeMenu组件的引用)
         *      className: ddd
         *    },
         *    ...
         *  ],
         *  height:number //组件高度(参考List组件的数据源中相应的属性),如果开启了infinite模式并且没有设置高度,则会使用不定高的无穷列表
         *  text:string //SwipeMenu内容区文本,可选,如果不配置renderMenuContent,则会使用这个属性作为内容区的内容
         * }
         * ```
         */
        dataSource: PropTypes.arrayOf(PropTypes.shape({
            action: PropTypes.arrayOf(PropTypes.shape({
                content: PropTypes.string.isRequired,
                tap: PropTypes.func.isRequired
            })),
            height: PropTypes.number,
            text: PropTypes.string
        })).isRequired,
        /**
         * @property renderMenuContent
         * @type function
         * @default null
         * @param {Object} item 列表项对应的数据对象
         * @param {Number} index 列表项在数据源中的index
         * @description 渲染列表项的函数,接受参数item(该项对应的数据源中的配置对象),index(配置对象在数据源中的index),返回JSX或者string
         * 作为SwipeMenu的内容
         */
        renderMenuContent: PropTypes.func,
        /**
         * @property infinite
         * @type Bool
         * @default false
         * @description 是否开启无穷列表模式,参考List同名属性
         */
        infinite: PropTypes.bool,
        /**
         * @property infiniteSize
         * @type Bool
         * @default 20
         * @description 无穷列表模式中,设置保留在容器中的列表项数量,参考List同名属性
         */
        infiniteSize: PropTypes.number,
        /**
         * @property itemHeight
         * @type Number
         * @default null
         * @description 列表项高度,参考List同名属性
         */
        itemHeight: PropTypes.number,
        /**
         * @property itemExtraClass
         * @type function
         * @default "item swipemenu-list-item"
         * @param {Object} item 列表项对应的数据对象
         * @param {Number} index 列表项在数据源中的偏移
         * @description 列表项class,可以传入函数/字符串,参考List同名属性
         */
        itemExtraClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        /**
         * @property onItemTap
         * @type function
         * @default null
         * @param {Object} item 列表项对应的数据对象
         * @param {Number} index 列表项在数据源中的偏移
         * @param {Array} dataSource 数据源
         * @description item点击事件回调,参考List同名属性。
         *
         * 注意:点击swipemenu的按钮区域不会触发这个事件
         */
        onItemTap: PropTypes.func,
        /**
         * @property extraClass
         * @type String
         * @default null
         * @description 给List容器dom添加的额外class
         */
        extraClass: PropTypes.string,
        /**
         * @property usePullRefresh
         * @type Bool
         * @default false
         * @description 是否开启下拉刷新
         */
        usePullRefresh: PropTypes.bool,
        /**
         * 下拉刷新高度
         *
         * @property pullRefreshHeight
         * @type PropTypes.number
         * @description 触发下拉刷新状态的高度（一般即为下拉刷新提示区域的高度）
         * @default 40
         */
        pullRefreshHeight: PropTypes.number,
        /**
         * 下拉刷新渲染函数
         *
         * @property renderPullRefresh
         * @type PropTypes.func
         * @returns {JSX} 用来渲染 pullRefresh 的 JSX
         * @description () => JSX
         *
         * 自定义的下拉刷新渲染函数
         */
        renderPullRefresh: PropTypes.function,
        /**
         * @property onRefresh
         * @type Function
         * @default null
         * @param {Array} dataSource 列表数据源
         * @description 下拉刷新完成回调
         */
        onRefresh: PropTypes.func,
        /**
         * @property useLoadMore
         * @type Bool
         * @default false
         * @description 是否开启加载更多
         */
        useLoadMore: PropTypes.bool,
        /**
         * 加载更多高度
         *
         * @property loadMoreHeight
         * @type PropTypes.number
         * @description 触发加载更多状态的高度（一般即为加载更多提示区域的高度）
         * @default 40
         */
        loadMoreHeight: PropTypes.number,
        /**
         * 加载更多渲染函数
         *
         * @property renderLoadMore
         * @type Function
         * @returns {JSX} 用来渲染 loadMore 的 JSX
         * @description () => JSX
         *
         * 自定义的加载更多渲染函数
         */
        renderLoadMore: PropTypes.function,
        /**
         * @property onLoad
         * @type Function
         * @default null
         * @param {Array} dataSource 列表数据源
         * @description 加载更多回调
         */
        onLoad: PropTypes.func,
        /**
         * @property offsetY
         * @type Number
         * @default 0
         * @description 列表初始Y轴偏移
         */
        offsetY: PropTypes.number,
        /**
         * @property onScroll
         * @type Function
         * @default null
         * @param {Number} offsetY y坐标
         * @description 列表滚动时触发的回调
         */
        onScroll: PropTypes.function,
        onInfiniteAppend: PropTypes.func
    };

    static defaultProps = {
        renderMenuContent(item, index){
            return item.text;
        },
        infinite: false,
        infiniteSize: 20,
        itemHeight: null,
        itemExtraClass: 'item swipemenu-list-item',
        extraClass: '',
        onItemTap: noop,
        usePullRefresh: false,
        onRefresh: noop,
        useLoadMore: false,
        onLoad: noop,
        offsetY: 0,
        onInfiniteAppend: noop
    };

    /**
     * 在一个菜单被打开/关闭时触发,改变openIndex
     * @param index
     */
    updateOpenIndex(index) {
        //保存当前的openIndex
        this.cachedOpenIndex = this.openIndex;
        //更新openIndex
        //此时this.cachedOpenIndex!==this.openIndex
        this.openIndex = index;
        this.setState({openIndex: index});
    }

    constructor(props) {
        super(props);
        this.swipeMenuList = [];
        //当前打开的菜单index
        this.openIndex = -1;
        //之前打开菜单的index,用来判断菜单的打开/关闭状态是否有变化
        this.cachedOpenIndex = -1;
        this.state = {
            dataSource: this.ds,
            openIndex: this.openIndex
        };
    }

    /**
     * 在render结束时重置缓存的上一个打开菜单的index,此时this.cachedOpenIndex===this.openIndex
     */
    componentDidUpdate() {
        this.cachedOpenIndex = this.openIndex;
    }

    componentWillReceiveProps() {
        this.openIndex = -1;
        if (this.props.infinite) {
            this.swipeMenuList.forEach(swipeMenu=>swipeMenu.close(true));
        }
    }

    /**
     * @description 滚动到某个位置
     * @method scrollTo
     * @param {Number} y y坐标
     * @param {Number} time 动画持续时间
     */
    scrollTo(y, time) {
        if (this.list) this.list.scrollTo.call(this.list, y, time);
    }

    /**
     * @description 停止下拉刷新
     * @method stopRefreshing
     * @param {Bool} success  刷新成功/刷新失败
     */
    stopRefreshing(success) {
        if (this.list) this.list.stopRefreshing(success);
    }

    /**
     * @method startRefreshing
     * @description 模拟下拉刷新
     */
    startRefreshing() {
        if (this.list) this.list.startRefreshing();
    }

    /**
     * @description 停止加载更多
     * @method stopLoading
     * @param {Bool} success 加载成功/加载失败
     */
    stopLoading(success) {
        if (this.list) this.list.stopLoading(success);
    }

    /**
     * 关闭打开的菜单
     * 解锁Scroller
     */
    closeAll(i) {
        const swipeMenu = this.swipeMenuList[this.openIndex];
        if (swipeMenu) {
            if (i !== this.openIndex) {
                swipeMenu.close();
            }
            //等待关闭动画结束再enable其他的swipemenu
            setTimeout(()=> {
                this.updateOpenIndex(-1);
            }, 500);
        }
    }

    render() {
        const {
            dataSource,
            renderMenuContent,
            itemExtraClass,
            onItemTap,
            usePullRefresh,
            onRefresh,
            useLoadMore,
            onLoad,
            offsetY
        }=this.props;

        return (
            <List
                {...this.props}
                //如果有菜单被打开,锁定滚动
                enabled={this.openIndex === -1}
                directionLockThreshold={5}
                ref={list=> {
                    if (list) this.list = list;
                }}
                //根据菜单打开/关闭状态是否有变化,决定是否需要render列表项
                shouldItemUpdate={ret=> {
                    if (this.props.infinite) {
                        return ret || this.cachedOpenIndex !== this.openIndex;
                    }
                    return true;
                }}
                //渲染列表项
                renderItem={(item, i)=> {
                    let action = item.action;
                    //重新包装action 菜单配置对象的tap方法,使其能够接收item,i,component为参数
                    action.forEach(actionObj=> {
                        const origTap = actionObj.tap;
                        // 以包裹后的tap方法替换原有tap方法,为了tap能够拿到参数
                        // binded标志可以防止重复绑定
                        if (!origTap.binded) {
                            actionObj.tap = (component)=> {
                                origTap(item, i, component);
                            };
                            actionObj.tap.binded = true;
                        }
                    });
                    return (
                        <SwipeMenu
                            ref={component=> {
                                if (component) {
                                    this.swipeMenuList[i] = component;
                                }
                            }}
                            disable={this.openIndex !== -1 && i !== this.openIndex}
                            onOpen={()=>this.updateOpenIndex(i)}
                            onClose={()=>this.updateOpenIndex(-1)}
                            action={action}
                            extraClass="swipemenu-list-menu"
                        >
                            {renderMenuContent(item, i)}
                        </SwipeMenu>
                    );
                }}
                itemActiveClass={null}
                onItemTap={(item, i, ds, target)=> {
                    //只有在内容区域的点击才触发onItemTap
                    if (target.className.search('front') !== -1) {
                        this.props.onItemTap(item, i, ds);
                    }
                }}
                onItemTouchStart={(item, i, evt)=> {
                    //在列表项touchstart时关闭打开的菜单并解锁滚动
                    if (evt.target.className.search('front') !== -1) {
                        this.closeAll(i, evt);
                    }
                }}
            />
        );
    }
}