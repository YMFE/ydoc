/**
 * @component Carousel
 * @version 3.0.0
 * @description 走马灯组件
 * 支持用户自定义动画对象，支持用户自定义css动画
 * 支持用户自定义子节点
 *
 * 默认动画：
 * 横向滚动动画
 * 为当前页加上on的
 *
 * 自定义动画对象需提供的方法：
 *
 *
 * 默认走马灯节点：
 * 支持图片lazyload 图片加载失败的替换图模板
 *
 * 查看Demo获得实例：
 * 使用自定义动画实现图片查看器
 * 内置动画配合css动画效果
 *
 * @author eva.li
 */

import './style.scss';
import React, { Component, PropTypes } from 'react';
import AniScrollX from './aniScrollx.js';
import AniCss from './aniCss.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const Dots = props => {
    let liNodes = [];
    for (let i = 0; i < props.num; i++) {
        liNodes.push(<li key={i} className={props.page === i + 1 ? 'on' : ''} />);
    }
    return (
      <ul className="index">
        {liNodes}
      </ul>
    );
};
Dots.propTypes = {
    num: PropTypes.number,
    page: PropTypes.number
};

const propTypes = {
    /**
     * @property dots
     * @type PropTypes.bool
     * @default true
     * @description 是否使用默认坐标展示，详细可以查看demo基础用法展示
     */
    dots: PropTypes.bool,
    /**
     * @property autoplay
     * @type PropTypes.bool
     * @default true
     * @description 是否自动换页
     */
    autoplay: PropTypes.bool,
    /**
     * @property loop
     * @type PropTypes.bool
     * @default true
     * @description 是否循环 循环防范受动画影响，因此循环的具体方案由动画对象提供。
     */
    loop: PropTypes.bool,
    /**
     * @property effect
     * @type PropTypes.oneOf('cssAni','scrollX')
     * @default 'scrollX'
     * @description 内置动画对象类型选项，自定义动画时不需传入
     */
    effect: PropTypes.string,
    /**
     * @property beforeChange
     * @type PropTypes.func
     * @param {num} 变化后页面索引
     * @description 页面切换前提供的回调函数，索引值在carousel.children中设置从1开始
     */
    beforeChange: PropTypes.func,
    /**
     * @property afterChange
     * @type PropTypes.func
     * @param {num} 变化后页面索引
     * @description 页面切换后提供的回调函数，索引值在carousel.children中设置从1开始
     */
    afterChange: PropTypes.func,
    /**
     * @property extraClass
     * @type PropTypes.string
     * @description 为组件根节点提供额外的class。
     */
    extraClass: PropTypes.string,
    /**
     * @property delay
     * @type PropTypes.number
     * @description 自动播放时动画间隔，单位为s，因动画的实现方式而不同。
     */
    delay: PropTypes.number,
    /**
     * @property speed
     * @type PropTypes.number
     * @description 动画播放速度，单位为s,因动画的实现方式而不同。
     */
    speed: PropTypes.number,
    /**
     * @property defaultPage
     * @type PropTypes.number
     * @description 组件渲染时起始页面
     */
    defaultPage: PropTypes.number,
    /**
     * @property aniSpeed
     * @type property.number
     * @description 如果使用css动画，该值为动画播放时间，用于在滚动循环时计算动画时机。
     */
    aniSpeed: PropTypes.number,
    /**
     * @property aniObj
     * @type property.object
     * @description 自定义动画对象，自定义动画需要提供以下方法
     *
     * - handleData（aniObj, children）用于组件渲染前对于子节点的处理
     * - touchstart(aniObj) 动画处理的touchstart事件
     * - touchmove(aniObj) 动画处理的touchmove事件
     * - touchend(aniObj) 动画处理的touchend事件
     * - touchcancel(aniObj)动画处理的touchcancel事件
     * - next(aniObj) 下一帧 需返回动画结束后的当前索引
     * - arrive（aniObj,num) 跳转
     * - prev(aniObj) 上一帧 动画结束后的当前索引
     *
     * **aniObj格式**
     *
     * ``
     * {
     * 		aniSpeed:0,
     *   	containerDOM: ul.cont, //节点
     *    delay: 1,
     *    loop: true,
     *    operationTimer: 5, //操作数动画运动的绝对值，交由动画控制
     *    pageNow: 5,
     *    speed: .5,
     *    stageDOM: div,
     *    width: 375 //这里需注意宽度在组件mount后才有
     *    touchstartLocation:e
     *    touchendLocation:e
     *    touchmoveLocation:e
     * }
     * ``
     */
    aniObj: PropTypes.object,
    /**
     * @property children
     * @type PropTypes.element
     * @description carousel的展示内容
     */
    children: PropTypes.array.isRequired
};

const defaultProps = {
    dots: true,
    autoplay: true,
    loop: true,
    effect: 'scrollX',
    delay: 1.5,
    speed: 0.5,
    defaultPage: 1,
    aniSpeed: 0,
    beforeChange() {},
    afterChange() {}
};

const ANILIST = {
    'scrollX': AniScrollX,
    'cssAni': AniCss
};

const DEFAULTANI = AniScrollX;

class Carousel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.dragDom = null;
        this.dragEvt = null;
    }

    componentWillMount() {
        this.ani = Object.assign({}, this.props.aniObj || ANILIST[this.props.effect] || DEFAULTANI);
        this.aniObj = {
            delay: this.props.delay,
            speed: this.props.speed,
            pageNow: 1,
            pagesNum: this.props.children.length,
            aniSpeed: this.props.aniSpeed,
            loop: this.props.loop,
            operationTimer: 0,
            touchstartLocation: {},
            touchendLocation: {}
        };
    }

    componentDidMount() {
        this.aniObj.stageDOM = this.widgetDOM.parentNode;
        this.aniObj.containerDOM = this.widgetDOM.querySelector('.cont');
        this.arrive(this.props.defaultPage);
        this.launchAuto();
        this.aniObj.width = this.widgetDOM.clientWidth;
    }

    componentWillReceiveProps(props) {
        this.aniObj.delay = props.delay;
        this.aniObj.speed = props.speed;
        this.aniObj.pagesNum = props.children.length;
        this.aniObj.aniSpeed = props.aniSpeed;
        this.aniObj.loop = props.loop;
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.page !== this.state.page) {
            this.props.beforeChange(nextState.page);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.aniObj.stageWidth = this.widgetDOM.clientWidth;
        if (prevState.page !== this.state.page) {
            this.props.afterChange(this.state.page);
        }
        if (prevProps.autoplay !== this.props.autoplay || prevProps.loop !== this.props.loop) {
            this.pause();
            this.play();
        }
    }

    componentWillUnmount() {
        this.pause();
    }
    /**
     * @description 到达方法
     * @method arrive
     * @param  {number} num 到达的页数
     */
    arrive(num) {
        this.aniObj.operationTimer = num - 1;
        this.pause();
        if (num > 0 && num <= React.Children.count(this.props.children)) {
            const page = this.ani.arrive(this.aniObj, num);
            this.setState({
                page
            });
            this.aniObj.pageNow = page;
        }
        this.play();
    }

    launchAuto() {
        this.autoplay && window.clearInterval(this.autoplay);
        if (this.props.autoplay &&
            (this.props.loop || this.aniObj.pageNow < this.aniObj.pagesNum)
        ) {
            this.autoplay = window.setInterval(() => {
                this.next();
            }, this.props.delay * 1000);
        }
    }

    format(children) {
        return this.ani.handleData(this.aniObj, children);
    }

    // getEndX(distanceX) {
    //     let pageNow = this.aniObj.pageNow;
    //     if (Math.abs(distanceX) < 40) {
    //         return -(pageNow - 1);
    //     }
    //     if (distanceX > 0) {
    //         pageNow = pageNow - 2;
    //         this.aniObj.operationTimer --;
    //     } else {
    //         this.aniObj.operationTimer ++;
    //     }
    //     return -pageNow;
    // }
    /**
     * @method play
     * @description 播放动画
     */
    play() {
        this.launchAuto();
    }

    /**
     * @method pause
     * @description 暂停动画
     */
    pause() {
        this.autoplay && window.clearInterval(this.autoplay);
    }
    /**
     * @method prev
     * @description 播放上一页
     */
    prev() {
        this.aniObj.operationTimer --;
        const page = this.ani.prev(this.aniObj);
        this.setState({ page });
        this.aniObj.pageNow = page;
    }
    /**
     * @method next
     * @description 播放下一页
     */
    next() {
        this.aniObj.operationTimer ++;
        const page = this.ani.next(this.aniObj);
        this.setState({ page });
        this.aniObj.pageNow = page;
        if (page >= this.aniObj.pagesNum && !this.props.loop) {
            this.pause();
        }
    }

    handleTouchStart(e) {
        e.preventDefault();
        e.stopPropagation();
        this.pause();
        this.aniObj.touchstartList = e.touches[0];
        this.aniObj.touchstartLocation = [e.touches[0].clientX, e.touches[0].clientY];
        this.ani.touchstart(this.aniObj);
    }
    handleTouchMove(e) {
        e.preventDefault();
        e.stopPropagation();
        this.aniObj.touchmoveList = e.touches[0];
        this.aniObj.touchmoveLocation = [e.touches[0].clientX, e.touches[0].clientY];

        this.ani.touchmove(this.aniObj);
    }
    handleTouchEnd(e) {
        e.preventDefault();
        e.stopPropagation();
        this.aniObj.touchendList = e.touches.length > 0 ?
        e.touches[0]
        : this.aniObj.touchmoveList;
        this.aniObj.touchendLocation = [
            this.aniObj.touchendList.clientX,
            this.aniObj.touchendList.clientY
        ];
        this.aniObj.pageNow = this.ani.touchend(this.aniObj);
        this.setState({
            page: this.aniObj.pageNow
        });
        this.play();
    }
    handleTouchCancle(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.ani.touchcancel) {
            this.ani.touchcancel(this.aniObj);
            return;
        }
        this.aniObj.touchendList = this.aniObj.touchmoveList;
        this.aniObj.touchendLocation = [
            this.aniObj.touchendList.clientX,
            this.aniObj.touchendList.clientY
        ];
        this.aniObj.pageNow = this.ani.touchend(this.aniObj);
        this.setState({
            page: this.aniObj.pageNow
        });
    }
    render() {
        const classList = ['yo-carousel'];
        if (this.props.extraClass != null) classList.push(this.props.extraClass)
        let children = this.format(this.props.children);
        return (
            <div
              className={classList.join(' ')}
              ref={(node) => {
                  if (node) {
                      this.widgetDOM = node;
                  }
              }}
              onTouchStart={evt => {
                  this.handleTouchStart(evt);
                }
              }
              onTouchMove={evt => {
                  this.handleTouchMove(evt);
                }
              }
              onTouchEnd={evt => {
                  this.handleTouchEnd(evt);
                }
              }
              onTouchCancel={evt => {
                  // this.dragEvt.dragCancel(evt)
                  this.handleTouchCancle(evt);
                }
              }
            >
              <ul
                className={'cont'}
              >
                {children}
              </ul>
              {this.props.dots ? <Dots num={this.aniObj.pagesNum} page={this.state.page}/> : ''}
            </div>
        );
    }

}

Carousel.propTypes = propTypes;
Carousel.defaultProps = defaultProps;

export default Carousel;
