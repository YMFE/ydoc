/**
 * switchable 轮播组件
 * @author eva.li<eva.li@qunar.com>
 * @class Switchable
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/switchable/index.html
 */

var $ = require('../../../util/1.0.0/index.js'),
    Widget = require('../../../core/1.0.0/index.js'),
    switchableStr = require('./switchable.string'),
    Template = require('../../../template/1.0.0/index.js'),
    defaultAni = require('./horizontal.js');

var DEFAULTANI = 'defaultAni';

var Switchable = Widget.extend({
    /**
     * @property {Array} datasource @require组件的数据源
     * @property {String} imgLoadErrorHtml 定义在图片加载失败的时候显示,默认值为'<p class="tip">图片加载失败!</p>'
     * @property {String} animateName 默认使用的动画名称，用于选择组建内部预定义动画,默认值为'defaultAni'
     * @property {Function} animate 用于自定义动画的构造函数,使用自定义动画是,请设置animateName为'defaultAni'
     * @property {Boolean} indcator 是否显示轮播图指示灯,默认值为true
     * @property {String} dotsActive 指示中用于标识当前页的样式,默认值为'on'
     * @property {Number} speed 动画速度单位为s,默认值.5
     * @property {Number} delay 动画延时单位为ms,默认值为2000 
     * @property {Boolean} loop 是否循环展示,默认值为true
     * @property {Boolean} auto 是自动切换,默认值为true
     * @property {Boolean} button 是否展示按键,默认值为true
     * @property {Function} judgeImgFail 自定义图片判断函数,返回Boolean值得判断结果,默认为判断图片高度&宽度不能同时为1
     * @memberOf Switchable
     */
    

    
    /**
     * 图片前进时触发的事件
     * @event beforemove
     * @memberOf Switchable
     */
    /**
     * 图片轮播后退时触发的事件
     * @event aftermove 
     * @memberOf Switchable
     */
    options: {
        //判断图片加载成功地函数
        judgeImgFail: function(img) {
            var result;
            img.naturalWidth == 1 && img.naturalHeight == 1 
            ? result = false 
            : result = true;
            return result;
        },
        //定义在图片加载失败的时候显示
        imgLoadErrorHtml: '<p class="tip">图片加载失败!</p>',
        type: 'switchable',
        //默认使用的动画名称
        animateName: DEFAULTANI,
        //用于自定义动画的对象
        animate: '',
        //是否显示图片指示
        indicator: true,
        //模板可以穿字符串以代替
        template: switchableStr,
        speed: .5,
        delay: 2000,
        loop: true,
        auto: true,
        //指示中用于标识当前页的样式
        dotsActive: 'on',
        button: true,
        datasource: [{
            img: '',
            href: '',
        }, {
            img: '',
            href: '',
        }, {
            img: '',
            href: '',
        }],
        events: {
            'touchstart': 'switchableTouchstart',
            'touchend': 'switchableTouchend',
            'touchcancel': 'switchableTouchend',
            'tap [data-role="switchable-button-l"]': 'prev',
            'tap [data-role="switchable-button-r"]': 'next'
        }
    },
    /**
     * 预处理组件数据
     * @function _testOption
     * @private
     * @memberOf Switchable
     */
    _testOption: function() {
        !parseFloat(this.get('speed')) && console.warn('speed必须输入数字,单位为秒');
        !parseInt(this.get('delay')) && console.warn('delay必须输入数字，单位为毫秒');
        !$.isFunction(this.get('judgeImgFail')) && console.warn('judgeImgFail需要时一个可以执行的函数');
    },
    /**
     * 轮播图后退
     * @function prev
     * @memberOf Switchable
     */
    prev: function() {
        var me = this;
        me._aniStyle.autoPlay && window.clearInterval(me._aniStyle.autoPlay);
        this.trigger('beforeMove', this.nowPage);
        me._aniStyle.prev();
        me._aniStyle.autoPlay && me._aniStyle.launchAuto();
    },
    /**
     * 轮播图前进
     * @function next
     * @memberOf Switchable
     */
    next: function() {
        var me = this;
        me._aniStyle.autoPlay && window.clearInterval(me._aniStyle.autoPlay);
        this.trigger('beforeMove', this.nowPage);
        me._aniStyle.next();
        me._aniStyle.autoPlay && me._aniStyle.launchAuto();
    },
    /**
     * 处理组件数据
     * @function init
     * @memberOf Switchable
     */
    init: function() {
        this._aniStyle = null;
        this._testOption();
        this.touchstartLocat = [0, 0];
        this.touchendLocat = [0, 0];
        //判断是否传了动画对象 有就替换默认的
        this.get('animate') ? defaultAni = this.get('animate') : '';
        switch (this.get('animateName')) {
            case 'defaultAni':
                this._aniStyle = defaultAni;
                break;
            default:
                alert('参数不对');
        };
    },
    /**
     * 轮播图暂停
     * @function pause
     * @memberOf Switchable
     */
    pause: function() {
        this._aniStyle.pause();
    },
    /**
     * 轮播图播放
     * @function play
     * @memberOf Switchable
     */
    play: function() {
        this._aniStyle.launchAuto();
    },
    /**
     * 解析模板
     * @private
     * @function parseTemplate
     * @memberOf Switchable
     * @param  {String} tpl 待解析的模板
     * @return {String}     解析后的模板
     */
    parseTemplate: function(tpl) {
        var data = this.get('datasource'),
            dots = this.get('indicator'),
            button = this.get('button');
        //判断动画是否有数据处理函数 有的话先执行
        if (this._aniStyle.handleData) {
            var dataSet = this._aniStyle.handleData(data);
        };
        var html = Template(tpl || switchableStr, {
            'list': dataSet || data,
            'dots': dots,
            'originData': data,
            'button': button
        });
        return html;
    },
    /**
     * 获取所需dom元素
     * @private
     * @function _initProp
     * @memberOf Switchable
     */
    _initProp: function() {
        this.imageList = this.widgetEl.find('[data-role="switchableImg"]');
        this.listItems = this.widgetEl.find('[data-role=switchableItem]');
        this.list = this.widgetEl.find('[data-role=switchableContainer]');
        this.dotsItems = this.widgetEl.find('[data-role="switchableDotsitem"]');
        this.stage = this.widgetEl.first()[0];
        this.buttonL = this.widgetEl.find('[data-role="switchable-button-l"]');
        this.buttonR = this.widgetEl.find('[data-role="switchable-button-r"]');
        this.WebkitTransitionEnd = 'webkitTransitionEnd';
    },
    /**
     * 渲染组件,同时初始化动画组件,并注册相关事件。
     * @memberOf Switchable
     * @function render
     */
    render: function() {
        var self = this;
        //将初始化后的组件渲染到页面上
        Switchable.superClass.render.call(this);
        this._initProp();
        this.imageList.on({
            'load.img': function(event) {
                self._switchableImgLoad.call(self, this);
            },
            'error': function(event) {
                self._switchableImgError.call(self, this);
            }
        });
        this._aniStyle = new this._aniStyle({
            stage: self.stage,
            container: self.list,
            items: self.listItems,
            buttonL: self.buttonL,
            buttonR: self.buttonR,
            auto: self.get('auto'),
            host: self,
            delay: self.get('delay'),
            speed: self.get('speed'),
            loop: self.get('loop'),
            delay: self.get('delay')
        })
        this.list.on({
            transitionend: function() {
                self.switchableAniEnd.call(self);
            },
            webkitTransitionEnd: function() {
                self.switchableAniEnd.call(self);
            }
        });
        //初始化指示点的展示
        this.get('indicator') && this.widgetEl.find(this.dotsItems[0]).addClass(this.get('dotsActive'));
        // this.widgetEl.on('touchend',self.switchableTouchend);
    },
    /**
     *快速到达某一帧
     * @param  {Num}
     * @function arrive
     * @memberOf Switchable
     */
    arrive: function(pageNum) {
        var num = Number(pageNum);
        num < this.get('datasource').length ? this._aniStyle.arrive(num) : console.log('跳转页面索引不合法');
    },
    /**
     * 默认绑定的事件
     * @private 
     * @function switchableTouchstart
     * @param  {event}
     * 
     */
    switchableTouchstart: function(event) {
        this._aniStyle.autoPlay && window.clearInterval(this._aniStyle.autoPlay);
        this.functionDevelop && window.clearTimeout(this.functionDevelop);
        this.touchstartLocat = [event.touches[0].clientX, event.touches[0].clientY];
    },
    /**
     * 默认绑定的事件
     * @private
     * @param  {event}
     * @memberOf Switchable
     * @function switchableTouchend
     */
    switchableTouchend: function(event) {
        var self = this;
        self.touchendLocat = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
        //事件处理
        self.functionDevelop = window.setTimeout(function() {
            self._aniStyle.gesture(self.touchstartLocat, self.touchendLocat);
        }, 0);
    },
    /**
     * 处理动画结束时的事件
     * @private
     * @function switchableAniEnd
     * @param  {event}
     * @memberOf Switchable
     */
    switchableAniEnd: function(event) {
        this._aniStyle.aniEnd();
        this.get('indicator') && this.locat();
        this.trigger('aftermove', this._aniStyle.pageShow);
    },
    /**
     * 用于指示灯的设置
     * @private
     * @function locat
     * @memberOf Switchable
     */
    locat: function() {
        this.widgetEl.find('.' + this.get('dotsActive')).removeClass(this.get('dotsActive'));
        this.widgetEl.find(this.dotsItems[this._aniStyle.pageShow]).addClass(this.get('dotsActive'));
    },
    /**
     * 处理加载图片失败的内置函数
     * @private
     * @param  {Dom} 加载失败的图片Dom元素
     * @function _switchableImgError
     * @memberOf Switchable
     */
    _switchableImgError: function(img) {
        $(img).parents('[data-role="switchableItem"]').removeClass('yo-loading').html(this.get('imgLoadErrorHtml'));
    },
    /**
     * 加载图片的函数
     * @private
     * @param  {Dom} 加载图片的Dom节点
     * @memberOf Switchable
     */
    _switchableImgLoad: function(img) {
        var thisLi = $(img).parents('[data-role="switchableItem"]');
        thisLi.removeClass('yo-loading');
        if (!this.get('judgeImgFail')(img)) {
            thisLi.html(this.get('imgLoadErrorHtml'));
        }
    },
    /**
     * 销毁组件
     * @function destory
     * @memberOf Switchable
     */
    destroy: function() {
        this.imageList.off();
        this.list.off();
        Switchable.superClass.destroy.call(this);
    }
});


module.exports = Switchable;