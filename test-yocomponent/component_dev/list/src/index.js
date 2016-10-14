/**
 * @component List
 * @example ./list/base/index.js[1-63]
 * @version 3.0.0
 * @description 列表组件,继承了Scroller的特性,有下拉刷新和加载更多功能
 *
 * - 实现了无穷模式,在数据源较大时能够提升滚动的性能并避免内存溢出
 * - 无穷模式支持给定高度(所有列表项的高度已知)和不给定高度(完全不提供列表项的高度)两种模式。
 * - 实现了列表项独特的手势系统
 * - 实现了列表内图片的懒加载(需要用LazyImage组件替换<img/>)
 *
 * 使用列表组件实现的组件:Grouplist,Calendar,SwipeMenuList
 *
 * 特别感谢大明哥和她的不定高无穷列表的实现思路
 * @author jiao.shen
 */
import ListModel from './ListCore';
import React, {Component, PropTypes} from 'react';
import Scroller from '../../scroller/src';
import ListItem from './ListItem';
import LazyImage from '../../lazyimage/src';
import "../../common/tapEventPluginInit";
import "./style.scss";
import {TAP_DELAY} from './gesture';

const defaultProps = {
    infinite: false,
    offsetY: 0,
    infiniteSize: 12,
    itemActiveClass: 'item-light',
    onScroll() {
    },
    onInfiniteAppend() {
    },
    renderItem(item) {
        return item.text;
    },
    extraClass: '',
    containerExtraClass: '',
    groupTitleExtraClass: '',
    offsetY: 0,
    usePullRefresh: false,
    onRefresh() {
    },
    useLoadMore: false,
    onLoad() {
    },
    onItemTap() {
    },
    shouldItemUpdate: null,
    itemExtraClass() {
        return 'item'
    },
    onItemTouchStart() {
    },
    enabled: true,
    directionLockThreshold: 50
};

const propTypes = {
    /**
     * @property dataSource
     * @type Array
     * @default none
     * @description 组件的数据源,数组形式,内部元素必须是对象。
     *
     * 如果需要给无穷列表的项定高度,可以在对象里添加height属性(数字类型),
     *
     * 也可以通过itemHeight属性统一设置列表项的高度(见itemHeight属性的描述),
     *
     * 如果列表元素有text属性且没有传入renderItem,会直接以text的值作为listitem的内容渲染。
     */
    dataSource: PropTypes.arrayOf(PropTypes.shape({
        height: PropTypes.number,
        text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        key: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })).isRequired,
    /**
     * @property infinite
     * @type Bool
     * @default false
     * @description 是否使用无穷列表模式。
     *
     * 开启无穷列表模式后,列表中只会保留infiniteSize个节点,并随着滚动复用这些节点,以此来优化大列表的性能,但是滚动过程中会有性能损耗。
     *
     * 如果你的列表项数量不大(比如只有几十个),请不要开启无穷模式。
     */
    infinite: PropTypes.bool,
    /**
     * @property infiniteSize
     * @type Number
     * @default 12
     * @description 无穷列表模式下,保留在列表容器中列表项的个数(参见无穷列表模式的说明).
     *
     * 注意:这个值应该随着列表容器的高度和列表项高度选取一个合适的值,否则可能出现列表容器底部出现空白的情况。
     *
     * 如果这个值设置的过大,会降低列表的滚动性能,因此请根据实际情况(List容器的高度和列表项的高度)灵活配置。
     */
    infiniteSize: PropTypes.number,
    /**
     * @property itemHeight
     * @type Number
     * @default null
     * @description 无穷列表中列表项的高度。
     *
     * 如果数据源中的对象没有height属性,也没有设置itemHeight,则会使用不定高的无穷列表模式。
     *
     * 在不定高模式下,每个项的高度会在渲染进容器以后确定,因此比定高模式多一次offsetHeight的查询,性能会差一些。
     */
    itemHeight: PropTypes.number,
    /**
     * @property offsetY
     * @type Number
     * @default 0
     * @description 组件的初始位置的Y坐标。
     */
    offsetY: PropTypes.number,
    /**
     * @property onItemTap
     * @type function
     * @default null
     * @param {Object} item 列表项对应的数据对象
     * @param {Number} index 列表项在数据源中的index
     * @param {Array} dataSource 当前列表的dataSource
     * @description 点击列表项时的事件回调,接收三个参数item(列表项对应的数据对象),index(列表项在数据源中的index)以及dataSource,
     * 返回一个JSX/字符串。
     */
    onItemTap: PropTypes.func,
    /**
     * @property itemExtraClass
     * @type String/function
     * @default "item item-wrap"
     * @description 给列表项容器元素添加的class
     * @param {Object} item 列表项对应的数据对象
     * @param {Number} index 列表项在数据源中的index
     * 可以接受字符串形式。例如"custom-list-item"(会自动应用在所有列表项容器上)
     * 或者一个函数,这个函数接受参数item(列表项对应的dataSource中的数据对象),index(数据源index),
     *
     * 例:(item)=>{return item.customClassName}/'custom-item-classname'
     *
     * 注意:这个属性的值/结果会完全替换之前默认的className,而不是在后面追加className。
     */
    itemExtraClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * @skip
     * 给grouptitle定制的属性,不会向外暴露
     */
    groupTitleExtraClass: PropTypes.string,
    /**
     * @property itemActiveClass
     * @type String/function
     * @default 列表项被点击时的className
     * @param {Object} item 列表项对应的数据对象
     * @param {Number} index 列表项在数据源中的index
     * @description 使用方式与itemExtraClass一致。
     */
    itemActiveClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * @property renderItem
     * @type Function
     * @default (item)=>item.text
     * @description 定制如何根据列表项数据对象渲染列表项的函数,接收参数item(数据对象)和index(在数据源中的index),返回一个JSX。
     *
     * 如果传入字符串,则会应用于所有列表项。
     *
     * 例子:`` renderItem={(item)=><p>{item.someAttr}</p>} ``
     */
    renderItem: PropTypes.func,
    /**
     * @property onScroll
     * @type Function
     * @default null
     * @param {Number} y 当前列表的y轴偏移
     * @param {Enum {'up','down'}} direction 列表滚动的方向,向上('up')或者向下('down')
     * @description 绑定给list内部scroller的onScroll回调,在列表滚动时触发
     */
    onScroll: PropTypes.func,
    /**
     * @property onInfiniteAppend
     * @type Function
     * @default null
     * @param {Array} visibleList 当前渲染在列表容器中的数据项数组
     * @description 无穷列表中列表项update时触发的事件回调,接收参数visibleList(数组),为目前渲染在列表容器中的数据项
     */
    onInfiniteAppend: PropTypes.func,
    /**
     * @property extraClass
     * @type String
     * @default null
     * @description 组件容器元素的额外className
     */
    extraClass: PropTypes.string,
    /**
     * @property containerExtraClass
     * @type String
     * @default null
     * @description 列表容器元素额外的className(对应ul.yo-list节点)
     */
    containerExtraClass: PropTypes.string,
    /**
     * @property usePullRefresh
     * @type Bool
     * @default false
     * @description 是否使用下拉刷新,见Scroller同名属性
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
     * @param {Array} dataSource 当前的数据源
     * @default null
     * @description 下拉刷新触发的事件回调
     */
    onRefresh: PropTypes.func,
    /**
     * @property useLoadMore
     * @type Bool
     * @default false
     * @description 是否开启加载更多,见Scroller同名属性
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
     * @param {Array} dataSource 当前数据源
     * @default null
     * @description 加载更多时触发的事件回调
     */
    onLoad: PropTypes.func,
    /**
     * @property shouldItemUpdate
     * @type Function
     * @default null
     * @param {Bool} ret 列表项shouldComponentUpdate原结果
     * @param {Object} nextItem 即将传给列表项组件的item对象
     * @param {Object} nowItem 当前列表项组件对应的item对象
     * @description 绑定给列表项组件的shouldComponentUpdate,可以避免额外的render,用于提升列表的滚动性能。
     *
     * 实验表明,组件的render开销对于某些老式手机(例如三星Note2)是不能忽视的,因此list默认为所有的列表项组件配置了shouldComponentUpdate,会根据
     * item的_guid属性(List组件自己做的,不需要使用者传入)做比较决定是否需要render,这样可以最小化render的次数。
     *
     * 有些情况下,这种比较方式会阻止使用者期待触发的render,导致组件更新行为违反了使用者的意愿,这时候需要通过设置shouldItemUpdate属性改变默认的shouldComponentUpdate的返回值
     *
     * shouldItemUpdate能够接受三个参数,ret(默认的shouldComponentUpdate的return结果,布尔类型),nextItem(ListItem组件的下一个props中的item属性),
     * nowItem(ListItem当前的props的item属性),返回一个布尔值,false则会跳过render,true会继续执行render(与shouldComponentUpdate返回值的含义相同)
     */
    shouldItemUpdate: PropTypes.func,
    /**
     * @property disabled
     * @type Bool
     * @default false
     * @description 是否禁止滚动,参见Scroller的同名属性
     */
    enabled: PropTypes.bool,
    /**
     * @skip
     * @property onItemTouchStart
     * 专门给SwipeMenuList使用的属性,不向外暴露
     */
    onItemTouchStart: PropTypes.func
};

export default class List extends Component {

    static childContextTypes = {
        scroller: PropTypes.object
    };

    getChildContext() {
        return {scroller: this};
    }

    constructor(props) {
        super(props);
        const {
            dataSource,
            offsetY,
            itemHeight,
            infinite,
            isHeightFixed,
            infiniteSize
        }=props;

        this.childLazyImages = [];

        this.listModel = new ListModel(
            dataSource,
            offsetY,
            infinite,
            itemHeight,
            infiniteSize
        );
        this.state = {
            visibleList: this.listModel.visibleList,
            totalHeight: this.listModel.totalHeight
        };
    }

    /**
     * @param nextProps
     * dataSource,infiniteSize是根据初始值计算出来的状态,在这里需要进行reset
     * 其他属性不需要reset
     */
    componentWillReceiveProps(nextProps) {
        const {dataSource, infiniteSize, offsetY}=nextProps;
        this.listModel.refresh(dataSource, true, infiniteSize);

        setTimeout(()=> {
            if (this.props.offsetY !== offsetY) {
                this.scrollTo(offsetY, 0);
            }
            this.tryLoadLazyImages(this.listModel.offsetY);
        }, 0);
    }

    /**
     * @method refresh
     * @description 刷新列表,应该在列表容器高度发生改变时调用
     */
    refresh() {
        this.scroller.refresh({scrollerHeight: this.state.totalHeight}, true);
    }

    /**
     * @method scrollTo
     * @param {Number} y 要滚动到的目标y坐标
     * @param {Number} [time] 动画时间,默认为0。
     * (在开启了无穷模式的情况下,为了提高滚动的性能,不管time传入什么值都会被重设为0.因为快速滚过很长的距离在无穷模式下会带来巨大的性能损耗)
     * @description 让List滚动到某个位置
     */
    static INFINITE_SCROLLTO_WITH_ANIMATION_DISTANCE = 2000;

    scrollTo(offsetY, time = 0) {
        if (this.scroller) {
            //考虑到infinite的渲染机制,滚动一个过长的距离会触发大量的dom更新,性能会很差
            //因此当当前offetY大于一定数值时就将time设为0,2000是个magic number,凭感觉设的
            time = this.listModel.infinite && this.listModel.offsetY > List.INFINITE_SCROLLTO_WITH_ANIMATION_DISTANCE
                ? 0 : time;
            this.scroller.scrollTo(0, offsetY, time);
            this.onScroll(-offsetY, true);
        }
    }

    /**
     * @skip
     * @method stopAnimate
     * @description 立刻停止滚动。
     */
    stopAnimate() {
        if (this.scroller) {
            this.scroller.stopAnimate();
        }
    }

    /**
     * @method stopRefreshing
     * @param {Bool} [successed]  下拉刷新是否成功,默认为false
     * @description 中止下拉刷新过程。在列表发生下拉刷新之后你应该调用这个方法去中止它(比如服务器响应已经返回的时候),否则刷新不会自动终止。
     */
    stopRefreshing(successed) {
        if (this.scroller) {
            this.scroller.stopRefreshing(successed);
        }
    }

    /**
     * @method stopLoading
     * @param {Bool} [successed]  加载更多是否成功,默认为false
     * @description 中止加载更多过程,使用方式和场景与stopRefreshing一致。
     */
    stopLoading(successed) {
        if (this.scroller) {
            this.scroller.stopLoading(successed);
        }
    }

    /**
     * @method startRefreshing
     * @description 模拟下拉刷新,调用这个方法后,会立刻停止当前的滚动并回到列表顶部,然后开始下拉刷新过程。
     *
     * 注意:你仍然需要手动调用stopRefreshing方法
     */
    startRefreshing() {
        if (this.scroller.isScrolling) {
            this.scroller.stopAnimate();
            this.scroller.isScrolling = false;
        }

        if (this.listModel.infinite && this.listModel.offsetY > List.INFINITE_SCROLLTO_WITH_ANIMATION_DISTANCE) {
            this.scroller.startRefreshing(0);
            this.onScroll(0, true);
        }
        else {
            this.scroller.startRefreshing();
        }
    }

    componentWillMount() {
        this.listModel
            .registerEventHandler('change', (visibleList, totalHeight)=> {
                if (this.scroller && this.listModel.infinite && totalHeight !== this.state.totalHeight) {
                    this.scroller.refresh({scrollerHeight: totalHeight}, true);
                }

                this.setState({visibleList, totalHeight});
                //在组件更新后判断是否处在合法的offsetY,如果超出了范围就调整到maxScrollY
                if (this.scroller && -this.scroller.maxScrollY < this.listModel.offsetY) {
                    this.scrollTo(this.scroller.maxScrollY, 0);
                }
                this.props.onInfiniteAppend(visibleList, totalHeight);
            })
            .registerEventHandler('scrollTo', (offsetY, time, easing)=> {
                if (this.scroller) {
                    this.scroller.scrollTo(0, offsetY, time, easing);
                }
            });
    }

    /**
     * 尝试加载处于可视区域内的lazyimage
     * @param y
     */
    tryLoadLazyImages(y) {
        if (this.childLazyImages.length && this.scroller) {
            this.childLazyImages.forEach(child=> {
                const containerBottomY = y + this.scroller.wrapper.offsetHeight;
                if (this.listModel.infinite) {
                    if (containerBottomY > child.offsetY) {
                        child.load();
                    }
                }
                else {
                    const listItemDom = child.itemRef.domNode;
                    let offsetTop = child.offsetTop;
                    if (!offsetTop) {
                        offsetTop = child.offsetTop = listItemDom.offsetTop;
                    }
                    if (listItemDom && containerBottomY > offsetTop) {
                        child.load();
                    }
                }
            });
        }
    }

    componentDidMount() {
        //在不定高模式下,需要等待所有列表项完成定位才能刷新scroller
        setTimeout(()=> {
            if (this.scroller) {
                //用来标记列表是否在滚动,和手势有关,在gesture.js中可以查到这个属性是如何被使用的
                this.scroller.isScrolling = false;
            }
            //刷新scroller,因为infinite不定高模式的totalHeight要等到item渲染完毕才能计算出来
            if (this.listModel.infinite && this.scroller) {
                this.scroller.refresh({scrollerHeight: this.listModel.totalHeight}, true);
            }
            //如果设置了offsetY,滚动到offsetY
            const {offsetY}=this.props;
            if (offsetY !== 0) {
                this.scrollTo(offsetY, 0);
            }
            //刷新lazyload图片,不然头几个item的懒加载图片都不会加载
            //加setTimeout是为了处理不定高的场景,因为不定高的列表会先把列表项渲染进容器然后再去做定位
            //所以didmount时间触发的时候,列表项还没有完成定位
            this.tryLoadLazyImages(offsetY);
        }, 0);
    }

    componentDidUpdate() {
        //infinite模式的lazyload不需要再didupdate时刷新
        //因为infinite的节点是复用的,而随着滚动会不定的render,因此会触发大量的didupdate,浪费性能
        //所以可以在receiveprops时做刷新,因为节点复用的缘故,不需要等待dom render
        if (!this.listModel.infinite) {
            this.tryLoadLazyImages(this.listModel.offsetY);
        }
    }

    /**
     * @param item
     * @param i
     * @returns {JSX}
     * 渲染列表项容器
     */
    renderItemWrap(item, i) {
        const {
            onItemTap,
            renderItem,
            onListItemUpdate,
            groupTitleExtraClass,
            shouldItemUpdate,
            onItemTouchStart
        }=this.props;
        let {itemActiveClass, itemExtraClass} = this.props;
        let realActiveClass = itemActiveClass, realExtraClass = itemExtraClass;
        //由于itemExtraClass可以传入string或者函数,这里统一为函数
        //做法是将string转换成一个返回该string的id函数
        if (typeof itemExtraClass === 'string' || itemExtraClass === null) {
            realExtraClass = ()=>itemExtraClass;
        }
        //the same
        if (typeof itemActiveClass === 'string' || itemActiveClass === null) {
            realActiveClass = ()=>itemActiveClass;
        }

        return (
            <ListItem
                scroller={this.scroller}
                itemActiveClass={realActiveClass}
                key={this.listModel.infinite ? i : item.key}
                renderItem={renderItem}
                onItemTap={(evt)=> {
                    onItemTap(item, item._index, this.listModel.dataSource, evt);
                }}
                shouldItemUpdate={shouldItemUpdate}
                onItemTouchStart={onItemTouchStart}
                item={item}
                itemExtraClass={realExtraClass}
                groupTitleExtraClass={groupTitleExtraClass}
                i={i}
                listModel={this.listModel}
                onListItemUpdate={onListItemUpdate}
            />
        );
    }

    /**
     * @param offsetY
     * @param manually
     * 随着Scroller的滚动更新visibleList
     */
    onScroll(offsetY, manually) {
        if (this.scroller && offsetY !== this.listModel.offsetY) {
            if (!manually) {
                this.scroller.isScrolling = true;
            }
            this.listModel.onScrollTo(offsetY);
            this.props.onScroll(offsetY, this.listModel.direction);
            this.tryLoadLazyImages(offsetY);
        }
    }

    /**
     * @method getDataSource
     * @returns {Array|*|ArrayBuffer|Array.<T>|Blob|string}
     * @description 获取一份列表当前数据源的浅复制
     */
    getDataSource() {
        return this.listModel.dataSource.slice();
    }

    /**
     * 绑定给Scoller的ScrollEnd事件回调
     */
    onScrollEnd() {
        //滚动停止后重置isScrolling标志
        setTimeout(()=>this.scroller.isScrolling = false, TAP_DELAY);
    }

    render() {
        const {
            onItemTap,
            extraClass,
            containerExtraClass,
            itemActiveClass,
            infiniteSize,
            usePullRefresh,
            onRefresh,
            useLoadMore,
            onLoad,
            shouldItemUpdate,
            getItemExtraClass,
            enabled,
            directionLockThreshold,
            pullRefreshHeight,
            renderPullRefresh,
            loadMoreHeight,
            renderLoadMore
        }=this.props;
        const {infinite}=this.listModel;
        const containerClass = ['yo-list', containerExtraClass].join(' ');
        const {visibleList}=this.state;

        return (
            <Scroller
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }}
                directionLockThreshold={directionLockThreshold}
                enabled={enabled}
                extraClass={[extraClass, infinite ? 'infinite' : ''].join(' ')}
                tap={true}
                autoRefresh={!infinite}
                ref={scroller=> {
                    if (scroller) {
                        this.scroller = scroller;
                    }
                }}
                onScroll={evt=>this.onScroll(-evt.contentOffset.y)}
                deceleration={0.0020}
                onScrollEnd={()=>this.onScrollEnd()}
                usePullRefresh={usePullRefresh}
                onRefresh={()=> {
                    onRefresh(this.listModel.dataSource);
                }}
                useLoadMore={useLoadMore}
                onLoad={()=> {
                    onLoad(this.listModel.dataSource);
                }}
                pullRefreshHeight={pullRefreshHeight}
                renderPullRefresh={renderPullRefresh}
                loadMoreHeight={loadMoreHeight}
                renderLoadMore={renderLoadMore}
            >
                <ul
                    className={containerClass}
                    ref={dom=>this.listContainer = dom}
                    style={{
                        overflow: 'visible',
                        height: infinite ? null : "auto"
                    }}
                >
                    {infinite ?
                        //无穷列表模式,在列表容器内设置固定数目的槽,随着滚动不停更新这些槽内部的内容和translateY
                        new Array(infiniteSize).fill(1).map((_, i)=> {
                            const item = visibleList.find(it=>it._order === i);
                            return item ? this.renderItemWrap(item, i) : null;
                        }) :
                        //静态列表,渲染出所有的item
                        visibleList.map((item, i)=>
                            this.renderItemWrap(item, i)
                        )}
                </ul>
            </Scroller>
        );
    }
}

List.defaultProps = defaultProps;
List.propTypes = propTypes;
List.LazyImage = LazyImage;
