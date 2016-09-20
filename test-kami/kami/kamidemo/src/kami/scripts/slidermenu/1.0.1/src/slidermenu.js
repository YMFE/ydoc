/**
 * 
 * @author  sharon.li<xuan.li@qunar.com>
 */
/**
 * 左右滑动菜单项，可做列表的删除等操作
 * 组件的模板，用户自定义模板时data-role属性是必须的，
 * data-role="slideMenuItem"是整个item节点，
 * data-role="slideMenuCnt"是指可被滑动的节点，
 * data-role="slideMenuAction"是提供操作的区域，比如删除，查看详情等
 * @author  sharon.li <xuan.li@qunar.com>
 * @class SliderMenu
 * @constructor
 * @extends Base
 * @category tool
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/slidermenu/index.html
 */

var $ = require('../../../util/1.0.0/index.js');
var Base = require('../../../base/1.0.0/index.js');

var DIRECTION = {
    LEFT: -1,
    RIGHT: 1 
};

var SliderMenu = Base.extend({

    /**
     * @property {HTMLElement} container @require组件作用的节点，节点内的列表才能左右滑动，默认body
     * @property {String} menuItemTag 默认滑动条目的data-role类型，默认slideMenuItem
     * @property {String} menuActionTag 默认滑动后出现的可操作的节点的data-role类型，默认为slideMenuAction
     * @property {String} menuContentTag 默认可滑动的节点的data-role类型，默认为slideMenuCnt
     * @property {String} unit 滑动单位
     * @property {Boolean} use3d 是否开启GPU加速，默认为true
     * @property {Boolean} cancelTapBubble 是否组织tap事件冒泡，默认为false
     * @property {Number} allowance 改变组件状态的滑动距离，默认为50
     * @property {Boolean} exclusive 是否开启同一容器内所有条目滑动互斥，默认为true
     * @property {Boolean} lockY 是否在横向滑动的时候讲禁止纵向滑动，与pagelist组合使用时，默认为false,需要设置为true
     *  
     * @memberOf SliderMenu
     */
    


    options: {
        container: document.body,
        menuItemTag: 'slideMenuItem',
        menuActionTag: 'slideMenuAction',
        menuContentTag: 'slideMenuCnt',
        direction: DIRECTION.LEFT,
        unit: 'px',//默认transform的单位
        /**
         * 用户点击组件可操作区域时触发的事件
         * @event tap
         * @param  {HTMLElement} targetEl 点击的target
         * @memberOf SliderMenu
         */
        ontap: function (targetEl) {},
        use3d: true,
        cancleTapBubble: false,
        allowance: 50,
        disabled: false,
        exclusive: true,//是否全局open互斥，默认为false不互斥
        lockY: false,
        width: null//允许滑动的宽度，如果不传则为ation节点的宽
    },
    _setX: function (el, x) {
        

        var str = 'translateX(' + x + 'px )';
        if (this.get('use3d')) {
            str += this.translatez;
        }
        el.style['-webkit-transform'] = str;
        // console.log('str=' + str);
        el.x = x;
      
    },
    
    _getX: function (el) {
        
        // debugger
        var transform = el.style['transform'] || el.style['-webkit-transform'];
        
        var match = transform.match(/translateX\(([\-\.0-9]+)px\)/);
        var y = 0;
        if (match && match.length > 1) {
            y = match[1];
        }
        y = parseInt(y, 10);
        return y;
    },
    _renderEvent: function () {
        
        var widget = this;

        this.container.on('tap', this._getTag(this.menuActionTag), function (e) {


            
            if (!!widget.cancleTapBubble) {
                e.stopPropagation();
            }
            widget.trigger('tap', e.target);

            return false;
        });
        
        this.container.on(
            'tap',
            this._getTag(this.menuContentTag),
            function (e) {
                // console.log('widget.waitingTap=' + widget.waitingTap);
                var el = this;
                if (el.isOpen || widget.waitingTap) {
                    e.stopPropagation();

                    return false;
                }
                

                
            }
        );
        

        var tag = this._getTag(this.menuContentTag);

        var start = function (e) {
            

            e.preventDefault();

            if (widget.disabled) {
                return;
            }
            
            //如果是exclusive的设置，那么先关闭其他节点
            if (widget.exclusive && widget.curEl != null) {
                widget.waitingTap = true;
                widget.closeAll();
                return;
            }
            widget.waitingTap = false;

            // e.stopPropagation();
            if (widget._isInProcess) {
                return;
            }

            // console.log('slidermenu start');


            var el = this;//e.target;

            el.countPoint = 0;
            var point = e.touches ? e.touches[0] : e;

            el.startX    = point.pageX;
            el.startY    = point.pageY;

            el.pointX = el.startX;
            el.pointY = el.startY;

            el.distX      = 0;
            el.distY      = 0;

            el.x = widget._getX(el);
            
            el.lockY = false;
            // console.log('el.x=' + el.x);

            el.endTime = el.startTime = new Date().getTime();
            el.classList.remove('transition');
            widget._isInProcess  = true;

            // console.log('start');
        };
        
 

        var move = function (e) {

            e.preventDefault();

            if (widget.disabled) {
                return;
            }
            if (!widget._isInProcess) {
                return;
            }
            // e.stopPropagation();
            // console.log('slidermenu move');

            var el = this;//e.target;
            var point = e.touches ? e.touches[0] : e;
            var deltaX = point.pageX - el.pointX;
            var deltaY = point.pageY - el.pointY;
            // console.log('deltaY=' + deltaY, 'deltaX=' + deltaX);
            el.deltaX = deltaX;            
            el.deltaY = deltaY;

            var newX = el.x + deltaX;

            el.distX += deltaX;
            el.distY += deltaY;


            var absDistX        = Math.abs(el.distX);
            var absDistY        = Math.abs(el.distY);

            //由于可能和pagelist合作时，节点没了，所以默认给initX一个初始值
            //
            //
            
            //根据最初的5像素来判断方向，如果是y方向，那么直接return不做滚动处理
            //
            if (absDistX < 30) { 
                if (absDistY > absDistX / 3) {
                
                    el.lockY = true;//是Y方向 
                }
            }
            else {
                //
            }
            //pagelist在滚动的时候如果将slidermenu设置为falseslidermenu也就不触发了
            //
            if (el.lockY || widget.lockY) {
                return;
            }
            
            // debugger
            
            
           

            var initX = el.initX === undefined ? 0 : el.initX;
            // console.log('deltaX=' + deltaX,
            //     'newX=' + newX,
            //     'el.x=' + el.x,
            //     'maxStep' + widget.direction * widget.maxSlideWidth
            // );
            if (widget.direction === DIRECTION.LEFT) {
                


                if (newX < initX && 
                    newX > initX + widget.direction * widget.maxSlideWidth) {
                    
                    widget._setX(el, newX);
                }
                else {
                    //do nothing
                }
            }
            else {
                if (newX > initX &&
                    newX < initX + widget.direction * widget.maxSlideWidth) {

                    
                    widget._setX(el, newX);
                }
                else {
                    //do nothing
                }
            }
            el.pointX = point.pageX;
            el.pointY = point.pageY;
            
        };


        var end = function (e) {
            if (widget.disabled) {
                return;
            }
            // debugger
            var el = this;//e.target;
            // if (el.lockY) {
            //     el.lockY = false;
            //     return;
            // }
            var point = e.changedTouches ? e.changedTouches[0] : e;

            el.endTime = new Date().getTime();
            //finalX是节点上的最终偏移记录和initX相对应
            el.finalX = widget._getX(el);
            el.endX = point.pageX;
            el.endY = point.pageY;

            
            

            var initX = el.initX === undefined ? widget.defaultInitX : el.initX;
            var distanceX = el.finalX - initX;
            //总的滑动方向
            var slideDirection = distanceX > 0 ? 1 : -1;
            var instanceSliderDirection = el.endX - el.startX;
            // console.log('slideDirection=%s, distanceX=%s', slideDirection, distanceX);

            // console.log('Math.abs(distanceX)=' + Math.abs(distanceX));
            // if (el.lockY) {
            //     el.lockY = false;
            //     // return;
            // }


            if (widget.direction == DIRECTION.LEFT) {//向左边滑动触发

                //如果滑动方向与允许触发的滑动方向相反，那么只要有便宜就恢复最初状态
                //方向相同根据allowance来判断设置open状态
                //
                
                if (instanceSliderDirection * widget.direction < 0) {
                    widget.setOpen(el, false);
                }
                else {
                    if (Math.abs(distanceX) > widget.allowance) {//最后做判断是否需要移动
                
                        if (slideDirection < 0) {
                            
                            widget.setOpen(el, true);
                        }
                        else {
                            widget.setOpen(el, false);
                        }
                        
                    }
                    else {//不需要动
                        
                        widget.setOpen(el, false);
                    }
                }

                
            }
            else {
                if (instanceSliderDirection * widget.direction < 0) {
                    widget.setOpen(el, false);
                }
                else {
                    if (Math.abs(distanceX) > widget.allowance) {
                        if (slideDirection < 0) {
                            widget.setOpen(el, false);
                            
                        }
                        else {
                            widget.setOpen(el, true);
                        }

                    }
                    else {
                        
                        widget.setOpen(el, false);
                    }
                }
                
            }
            el.lockY = false;
            widget._isInProcess = false;
            

        };

        this._itemTouchStart = start;
        this._itemTouchMove = move;
        this._itemTouchEnd = end;

        this.container.on('touchstart', tag, this._itemTouchStart);
        this.container.on('touchmove',  tag, this._itemTouchMove);
        this.container.on('touchend',  tag, this._itemTouchEnd);
        this.container.on('touchcancel',  tag, this._itemTouchEnd);
    },
    setLockY: function (lockY) {
        this.lockY = !!lockY;
    },
    /**
     * 设置组件的disabled状态
     * @param {Boolean} disabled 是否为disabled状态
     * @memberOf SliderMenu
     * @function setDisabled
     */
    setDisabled: function (disabled) {
        this.disabled = !!disabled;
    },
    /**
     * 返回组件是否为disabled状态
     * @function getDisabled
     * @memberOf SliderMenu
     * @return {Boolean} 组件的是否为disabled状态
     */
    getDisabled: function () {
        return this.disabled;
    },
    /**
     * 获取组件的item是否打开
     * @function getOpen
     * @memberOf SliderMenu
     * @param  {HTMLElement} el 需要判断的节点，节点需具有data-role的属性
     * @return {Boolean}    获取节点或者组件的open状态
     * @version  1.0.1
     */
    getOpen: function (el) {
        var widget = this;
        if (el === undefined) {
            
            el = widget.itemCntList[0];
        }
        var dataRole = el.getAttribute('data-role');
        if (dataRole.indexOf(widget.menuContentTag) === -1) {
            console.warn('invalid el, el data-role attribute must contain' + widget.menuContentTag);
            return;
        }
        var initX = el.initX === undefined ? widget.defaultInitX : el.initX;

        var curX = widget._getX(el);

        
        if (widget.direction === DIRECTION.LEFT) {
            if (curX <= initX + widget.direction * widget.maxSlideWidth) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (curX >= initX + widget.direction * widget.maxSlideWidth) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    /**
     * 关闭所有打开的节点
     * @memberOf SliderMenu
     * @function closeAll
     */
    closeAll: function () {
        var widget = this;
        var _itemCntList = this.container.find(this._getTag(this.menuContentTag));
        for (var i = 0; i < _itemCntList.length; i++) {
            var itemCnt = _itemCntList[i];
            
            (function (el, open) {
                widget.setOpen(el, open, true);
            } (itemCnt, false));

        }
            
    },
    /**
     * 设置当前el状态是否是打开关闭状态
     * @param {Boolean} open 是否关闭状态
     * @param {Boolean} silence 是否不触发open事件，默认为false，触发open事件
     * @memberOf SliderMenu
     * @function setOpen
     */
    setOpen: function (el, open, silence) {
        var widget = this;

        //disable state can not be set open or close;
        if (widget.disabled) {
            return;
        }
        //
        if (typeof el === 'Boolean') {
            open = el;
            el = widget.itemCntList[0];
        }

        //invalid el
        var dataRole = el.getAttribute('data-role');
        if (dataRole.indexOf(widget.menuContentTag) === -1) {
            console.log('invalid el, el data-role attribute must contain' + widget.menuContentTag);
            return;
        }
        open = !!open;
        
        var initX = el.initX === undefined ? widget.defaultInitX : el.initX;
        // var distanceX = el.finalX - el.initX;
        //总的滑动方向
        // var slideDirection = distanceX > 0 ? 1 : -1;
        var slideDirection = null;

        if (open) {

            if (widget.direction === DIRECTION.LEFT) {
                slideDirection = -1;
            }
            else {
                slideDirection = 1;
            }
            var newX = initX + slideDirection * widget.maxSlideWidth;
            el.classList.add('transition');
            widget._setX(el, newX);

            // alert(el.style.border);
            //hack 让他强制去画
            // el.style.border = '1px solid #fff';
            var a = el && el.offsetHeight;
            el.isOpen = true;

            if (widget.exclusive) {
                widget.curEl = el;    
            }
            
            // alert(newX + '|' + widget._getX(el));
        }
        else {
            
            var newX = initX;
            el.classList.add('transition');
            widget._setX(el, newX);
            // el.style.border = 'none';
            el.isOpen = false;
            if (widget.exclusive) {
                widget.curEl = null;
            }
            
        }
        if (!silence) {

            widget.trigger('open', el, open);
        }
        el.lockY = false;
    },
    _getTag: function (tag) {
        
        return '[data-role=' + tag + ']';
    },
    
    _translate : function (x, y) {
        x = (x !== undefined ? x : 0);
        y = (y !== undefined ? y : 0);
        this.x = x;
        this.y = y;
        var style = '';
        style += 'translate(' + x + this.unit + ',' + y + ')';
        if (this.use3d) {
            style += ' translateZ(0)';
        }
        return style;
    },
    
    initialize: function (config) {
        SliderMenu.superClass.initialize.call(this, config);
        this.init();
    },
    
    _destroyEvent: function () {
        this.container.off();
    },

    init: function () {
        
        if (!this._init) {
            this.container = $(this.get('container') || document.body);
            this.menuItemTag = this.get('menuItemTag') || 'slideMenuItem';
            this.menuActionTag = this.get('menuActionTag') || 'slideMenuAction';
            this.menuContentTag = this.get('menuContentTag') || 'menuContentTag';
            this.use3d = !!this.get('use3d');
            this.unit = this.get('unit') || 'px';
            this.direction = this.get('direction');
            this.translatez = 'translateZ(0px)';
            this.cancleTapBubble = !!this.get('cancleTapBubble');

            var _allowance = parseInt(this.get('allowance'), 10);
            this.allowance = _allowance.toString() == 'NaN' ? 50 : Math.abs(_allowance);
            
            this.exclusive = !!this.get('exclusive');
            this.disabled = !!this.get('disabled');
            this.lockY = !!this.get('lockY');
            this._init = true;
            this.curOpenElList = [];
        }
        
    },
    /**
     * 渲染组件，组件使用的入口
     * @function render
     * @memberOf SliderMenu
     */
    render: function () {
        
        this._initProp();
        

        this._renderEvent();
        this.trigger('ready');
    },
    _initProp: function () {
        var widget = this;
        var width = this.get('width') || null;
        this.itemActionList = this.container.find(this._getTag(this.menuActionTag));
        this.itemCntList = this.container.find(this._getTag(this.menuContentTag));
        //默认就去第一个itemList的宽度
        //所以如果当前sliderMenu的宽度不统一，那么用户可以创建多个slideMenu
        
        this.maxSlideWidth = (width == null) ? this.itemActionList.offset().width : width;
        this.itemCntList.forEach(function (item, i) {
            item.initX = widget._getX(item);
            item.setAttribute('initX', item.initX);
        });
        //取默认第一个item的translatex为默认的initX，如果传入的HTML结构中
        //每个dom节点的translateX不一样，那么要么初始化多个sliderMenu要么
        //统一所有节点的translateX
        if (this.itemCntList.length) {
            widget.defaultInitX = widget._getX(this.itemCntList[0]);
            
        }
        else {
            widget.defaultInitX = 0;
        }
    },
    /**
     * 销毁组件
     * @function destroy
     * @memberOf SliderMenu
     */
    destroy: function () {
        this._destroyEvent();
        SliderMenu.superClass.destroy.call(this);
    }
});


module.exports = SliderMenu;