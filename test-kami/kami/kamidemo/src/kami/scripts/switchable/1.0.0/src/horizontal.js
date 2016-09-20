/**
 * switchable 轮播组件默认动画构造函数
 * @constructor
 * @namespace HorizontalAnimation
 * @author eva.li<eva.li@qunar.com>
 * @private
 */

var $ = require('../../../util/1.0.0/index.js');
var ALLOWANCE = 20;

/**
 * 动画对象构造函数
 * @param {object} 初始化对象
 */
function HorizontalAnimation(obj) {
    /**
     * @property {Dom} obj.srage 舞台元素
     * @property {Dom} obj.container switchabelContainer
     * @property {Dom} obj.items switchableItemDoms
     * @property {Dom} obj.host switchable对象
     * @poperty {Number} obj.speed 动画速度单位为s,默认值.5
     * @poperty {Number} obj.delay 动画延时单位为ms,默认值为2000 
     * @poperty {Boolean} obj.loop 是否循环展示,默认值为true
     * @poperty {Boolean} obj.auto 是自动切换,默认值为true
     * @property {Dom} obj.buttonL 左侧buttonDom节点
     * @property {Dom} obj.buttonR 右侧buttonDom节点
     */
    this.allowance = ALLOWANCE;
    this.stageDOM = obj.stage;
    this.containerDOM = obj.container;
    this.itemsDOM = obj.items;
    this.delay = obj.delay;
    this.host = obj.host;
    this.loop = obj.loop;
    this.auto = obj.auto;
    this.speed = obj.speed;
    this.translate = 0;
    this.pageShow = 0;
    this.unit = Number(obj.stage.offsetWidth);
    this.animating = false;
    this.leftBtn = obj.buttonL;
    this.rightBtn = obj.buttonR;
    this.realItemDom = obj.items.slice(1, obj.items.length - 1);
    this._launchLoop(obj.items);
    this.launchAuto();
}
/**
 * 初始化循环的内置函数
 * @function _launchLoop 
 * @private
 * @memberOf  HorizontalAnimation
 * @param  {dom} switchableItemDoms switchable的itemsDom
 */
HorizontalAnimation.prototype._launchLoop = function(items) {
    var preNode = $(this.itemsDOM[0]),
        backNode = $(this.itemsDOM[this.itemsDOM.length - 1]);
    if (this.loop) {
        preNode.css({
            'left': -this.unit + 'px',
            'position': 'absolute',
            'top': '50%',
            '-webkit-transform': 'translateY(-50%)',
            'transform': 'translateY(-50%)'
        });
        backNode.css({
            'left': this.unit * (items.length - 2) + 'px',
            'position': 'absolute',
            'top': '50%',
            '-webkit-transform': 'translateY(-50%)',
            'transform': 'translateY(-50%)'
        });
    } else {
        preNode.remove();
        backNode.remove();
        this.leftBtn.hide();
    }
}
/**
 * 开启自动切换
 * @function launchAuto
 * @memberOf HorizontalAnimation
 */
HorizontalAnimation.prototype.launchAuto = function() {
    var me = this;
    if (me.auto) {
        window.clearInterval(me.autoPlay);
        me.autoPlay = window.setInterval(function() {
            me.next();
        }, me.delay);
    }
}
/**
 * 对于动画进行临界值判断的内置函数
 * @private
 * @function _testTranslate
 * @memberOf HorizontalAnimation
 */
HorizontalAnimation.prototype._testTranslate = function() {
    if (this.translate > this.stageDOM.offsetWidth || this.translate < -this.unit * (this.realItemDom.length)) {
        this.translate = 0;
        this.pageShow = 0;
    }
}
/**
 * 设置滚动值的内置函数
 * @private
 * @function _addCss
 * @param {Dom} dom 需要滚动的Dom节点
 * @param {Number} transitionSpeed 单位为s的滚动速度
 * @param {Number} translate3dX 水平滚动距离,单位为px
 * @param {Boolean} reset 是否重置
 */
HorizontalAnimation.prototype._addCss = function(dom, transitionSpeed, translate3dX, reset) {
    if (reset) {
        dom.css({
            '-webkit-transition': '',
            transition: ''
        });
    } else {
        dom.css({
            '-webkit-transition': '-webkit-transform ' + transitionSpeed + 's ease-in-out',
            transition: '-webkit-transform ' + transitionSpeed + 's ease-in-out'
        });
    };
    dom.css({
        '-webkit-transform': 'translate(' + translate3dX + 'px,0)',
        transform: 'translate(' + translate3dX + 'px,0)'
    });

}
/**
 * 后退一页动画
 * @function prev
 * @memberOf HorizontalAnimation
 */
HorizontalAnimation.prototype.prev = function() {
    //当前动画停止时才能进行下一次动画
    if (!this.loop && this.pageShow == 0) {} else if (!this.animating) {
        this.animating = true;
        this.translate = this.translate + this.unit;
        this._testTranslate(this.translate);
        this._addCss(this.containerDOM, this.speed, this.translate);
        this.pageShow--;
    }
}
/**
 * 前进一页动画
 * @function next
 * @memberOf  HorizontalAnimation
 */
HorizontalAnimation.prototype.next = function() {
    if (!this.loop && this.pageShow == this.realItemDom.length - 1) {} else if (!this.animating) {
        this.animating = true;
        this.translate = this.translate - this.unit;
        this._testTranslate(this.translate);
        this._addCss(this.containerDOM, this.speed, this.translate);
        this.pageShow++;
    }
}
/**
 * 暂停动画
 * @function pause
 * @memberOf  HorizontalAnimation
 */
HorizontalAnimation.prototype.pause = function() {
    window.clearInterval(this.autoPlay);
}
/**
 * 动画结束后的调用,用于处理动画的限制
 * @function aniEnd
 * @memberOf  HorizontalAnimation
 */
HorizontalAnimation.prototype.aniEnd = function() {
    if (this.loop) {
        //循环动画
        if (this.pageShow == -1) {
            this.pageShow = this.realItemDom.length - 1;
            this.translate = -this.unit * this.pageShow;
            this._addCss(this.containerDOM, 0, this.translate, true);
        } else if (this.pageShow == this.realItemDom.length) {
            this.translate = 0;
            this._addCss(this.containerDOM, 0, this.translate, true);
            this.pageShow = 0;
        }
    } else {
        //处理非循环状态下button按钮的显示
        if (this.pageShow == this.realItemDom.length - 1) {
            this.rightBtn.hide();
            this.leftBtn.show();
        } else if (this.pageShow == 0) {
            this.leftBtn.hide();
            this.rightBtn.show();
        } else {
            this.leftBtn.show();
            this.rightBtn.show();
        }
    }
    this.animating = false;
}
/**
 * 直接到达某一页面的动画
 * @function arrive
 * @param  {Number} targetPage 目标页面的索引
 * @memberOf HorizontalAnimation
 */
HorizontalAnimation.prototype.arrive = function(targetPage) {
    window.clearInterval(this.autoPlay);
    this.translate += (this.pageShow - targetPage) * this.unit;
    this.pageShow = targetPage;
    this._addCss(this.containerDOM, this.speed, this.translate);
}
/**
 * 手势触发调用函数
 * @function gesture
 * @param  {Array} touchstartLocat touchStart时的坐标
 * @param  {Array} touchendLocat touchEnd是的坐标
 * @memberOf HorizontalAnimation
 */
HorizontalAnimation.prototype.gesture = function(touchstartLocat, touchendLocat) {
    var changeX = touchendLocat[0] - touchstartLocat[0];
    if (Math.abs(changeX) > this.allowance) {
        changeX > 0 ? this.prev() : this.next();
    }
    (this.auto) && this.launchAuto();
}
/**
 * 动画构造函数的静态方法，对数据进行处理使其满足动画需要
 * @static
 * @param  {data} 待处理的源数据
 * @return {data} 处理后返回的数据
 * @memberOf  HorizontalAnimation
 * 
 */
HorizontalAnimation.handleData = function(data) {
    var newData = data.slice(0, data.length);
    newData.unshift(data[data.length - 1]);
    newData.push(data[0]);
    return newData;
}

module.exports = HorizontalAnimation;