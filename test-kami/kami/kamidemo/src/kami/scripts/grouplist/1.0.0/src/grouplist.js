
/**
 * 带分组功能的滑动控件
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class Grouplist
 * @constructor
 * @extends List
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/grouplist/index.html
 */


var $ = require('../../../util/1.0.0/index.js');
var Template = require('../../../template/1.0.0/index.js');
var List = require('../../../list/1.0.0/index.js');

var ListTpl = require('./tpl/grouplist.string');
var ItemTpl = require('./tpl/grouplist-item.string');
var StickyTpl = require('./tpl/sticky.string');
var IndexlistTpl = require('./tpl/indexlist.string');

var Grouplist = List.extend({
    /**
     * @property {String} groupBy 根据数据中的哪个字段分组进行分组，必填
     * @property {Array} notgroupData 没有分组的数据，默认展示在顶部
     * @property {Array} previousData 前置分组的数据，在未分组数据和分组数据之间
     * @property {Boolean} isTransition 默认滚动的动画效果，默认为false，true使用css的transition，false使用js动画
     * @property {Boolean} lazyload 是否延迟加载数据，默认为false，开启后先加载20条，然后在加载其余数据
     * @property {String} template 组件的外层模板，自定义模板时，需要传值
     * @property {String} itemTpl 组件分组数据模板，自定义模板时，需要传值
     * @property {String} stickyTpl 磁贴字母模板
     * @property {Boolean} hasIndexList 是否显示右侧字母索引列表，默认为true
     * @property {String} indexlistTpl 右侧索引字母模板
     * @property {Function} groupTitleRender 渲染分组数据title的渲染函数，默认取第一个字符
     * @memberOf Grouplist
     */
    

    options: {
        // 分组字段，必填
        groupBy: '',
        // 没有分组数据，默认展示在顶部
        notgroupData: [],
        // 前置分组数据
        previousData: [],
        // 动画的效果，使用js动画，为了控制惯性滑动动画的每一帧以触发吸顶字母改变
        isTransition: false,
        // 延迟加载数据
        lazyload: false,

        // 组件模板
        template: ListTpl,
        // 选项模板
        itemTpl: ItemTpl,
        // 磁贴字母模板
        stickyTpl: StickyTpl,
        // 索引字母模板
        indexlistTpl: IndexlistTpl,

        //渲染title的函数
        //@version  0.0.2
        groupTitleRender: function (item, index) {
            var groupBy = this.get('groupBy') || '';
            

            return item[groupBy].charAt(0).toLocaleUpperCase();
        },

        //是否需要右侧字母等索引列表
        //@version 0.0.2
        hasIndexList: true,

        /**
         * 用户选择某项数据时触发的事件
         * @event selectitem
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf Grouplist
         */


        
        onTap: function (e) {
            var targetEl = $(e.target);
            var itemEl = this.getItemNode(targetEl);
            if (itemEl) {
                var index = itemEl.data('index');
                var preIndex = itemEl.attr('pre-index');
                var notgroupIndex = itemEl.attr('notgroup-index');
                if(preIndex) {
                    this.trigger('selectitem', this.get('previousData')[preIndex], itemEl, targetEl);
                } else if(index) {
                    this.trigger('selectitem', this.get('datasource')[index], itemEl, targetEl);
                } else if(notgroupIndex){
                    this.trigger('selectitem', this.get('notgroupData')[notgroupIndex], itemEl, targetEl);
                }
            }
        },
        onScroll: function(translateY, stopAnimate) {
            if(translateY >= 0) {
                this._stickyVisible && this._hideSticky();
                return;
            }

            var absY = Math.round(Math.abs(translateY));
            if(absY > this._titleNodesTop[0]) {
                !this._stickyVisible && this._showSticky();
                if(this._currIndex >= 0 && this._currIndex < this._length) {
                    this._changeSticky(absY, stopAnimate);
                }
            } else {
                if (this._hasSticky) {
                    this._hideSticky();    
                }
                
            }
        }
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Grouplist
     * @private
     */
    init: function () {
        this.hasIndexList = !!this.get('hasIndexList');
        this.groupTitleRender = this.get('groupTitleRender');
        if (Object.prototype.toString.call(this.groupTitleRender) !== '[object Function]') {
            console.error('invalid groupTitleRender, groupTitleRender must be function');

        }
        this.initProp();
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Grouplist
     */
    render: function() {
        Grouplist.superClass.render.call(this);
        return this;
    },


    /**
     * 销毁组件
     * @function destroy
     * @memberOf Grouplist
     */
    destroy: function () {
        if (this.hasIndexList) {
            this._indexList.off('touchstart');
            this._indexList.off('touchmove');
            this._indexList.off('touchend');
            this._indexList.off('touchcancel');
        }
        

        Grouplist.superClass.destroy.call(this);
    },

    /**
     * 初始化组件的私有参数
     * @function initProp
     * @memberOf Grouplist
     * @private
     */
    initProp: function () {
        Grouplist.superClass.initProp.call(this);

        // 列表分组标题
        this._letters = []; // 所有列表分组标题
        this._titleNodes = null; // 分组元素的DOM集合
        this._titleNodesTop = []; // 分组元素的offsetTop集合
        this._currIndex = 0; // 当前分组字母的索引
        this._nextLetterY = 0;
        this._lastLetterY = 0;
        this._length = 0;
        this._lazyData = []; // 如果启用延迟加载，延迟加载的数据

        // 磁贴效果字母
        this._hasSticky = false; //是否有磁贴，如果没有分组数据和前置数据，那么值为false，否则为true
        this._sticky = null; // 磁贴字母
        this._stickyHeight = 0;// 磁贴字母的高度，默认设置为分组字母的高度-1（为了默认显示border，移动起来没有border）
        this._stickyVisible = false; // 磁贴字母是否显示
        this._stickyTranslate = 0; // 磁贴字母translate
        this._maxIndex = -1; // 磁贴字母能显示到的最大索引

        // 索引列表
        this._indexList = null; // 索引列表
        this._indexListPos = null; // 索引列表位置信息
        this._indexListItemHeight = 0;// 索引列表选项的高度
        this._indexListData = []; // 索引列表数据源
        this._startIndex = 0; // 索引列表字母开始的索引，排除previousData引入的
        this._showLetters = []; // 索引列表显示的字母，如果没有隐藏部分索引字母，则等于this._letters
        this._lastIndex = -99;
        this._hideIndex = 999999; // 隐藏索引，索引的indexText设置为空字符串，则不显示在索引列上
    },

    /**
     * 渲染内部的select组件
     * @function initUI
     * @memberOf Grouplist
     * @private
     */
    initUI: function () {
        Grouplist.superClass.initUI.call(this);
        if (this.get('lazyload')) {
            var self = this;
            var render = Template(this.get('itemTpl'));
            setTimeout(function() {
                self._lazyData.forEach(function(item) {
                    // TODO 性能优化
                    self._itemWrap.append(render(item));
                });
                self.resize();
                self._initGroup();
            }, 0);
        } else {
            this._initGroup();
        }
    },

    /**
     * 初始化分组节点，根据配置处理索引和磁铁
     * @function _initGroup
     * @memberOf Grouplist
     * @private
     */
    _initGroup: function() {
        this._titleNodes = this.widgetEl.find('[data-role="title"]');

        var arr = this._titleNodesTop;
        this._titleNodes.each(function(index, node) {
            arr.push(node.offsetTop);
        });
        this._length = arr.length;
        

        //previousData和datasource可以生成title，如果这两项都没有
        //那么不生成磁贴
        if (this._length) {

            this._createSticky(); 
            this._hasSticky = true;
        }
        else {
            this._hasSticky = false;
        }

        if (this.hasIndexList) {

            this._createIndexlist();
        }
        
        this._getMaxIndex();

        this._length && this._switch();
    },

    /**
     * 生成列表选项Html，覆盖父类list的方法
     *
     * previousData约定了几个属性
     * 1、cls: 排序字母的样式（右边显示的索引栏）
     * 2、title:  分组的标题（列表上分组标题），如果没有配置则等于groupBy指定的字段
     * 3、flag:  item项标识，可以通过getItemByFlag(id)获取dom节点
     */
    
    /**
     * 生成列表选项Html，覆盖父类list的方法
     * @function createListItem
     * @memberOf Grouplist
     * @private
     */
    createListItem: function () {
        var self = this;
        var itemHtml = '';
        var groupBy = this.get('groupBy');
        var render = Template(this.get('itemTpl'));

        var lastPreLetter = '';
        var notgroupData = this.get('notgroupData') || [];
        var preData = this.get('previousData') || [];

        var lastLetter = '';
        var ds = this.get('datasource') || [];

        if(groupBy === null || groupBy === '') {
            console.error('options groupBy is empty!');
            return;
        }

        // 没有分组数据
        notgroupData.forEach(function(item, index) {
            var data = $.extend(true, {}, item);
            data['notgroupIndex'] = index + "";
            // 数据项
            itemHtml += render({data: data});
        });

        // 前置分组数据
        preData.forEach(function(item, index) {
            var text = item['indexText'] || item[groupBy];
            var title = item.title ? item.title : text;
            if(!lastPreLetter || title !== lastPreLetter) {
                // 分组标题
                itemHtml += render({data: {isLetter: true, text: title}});
                self._letters.push(lastPreLetter = title);
                if(text.trim()) {
                    self._indexListData.push({text: text, title: title, cls: item.indexCls});
                } else {
                    self._hideIndex = index;
                }
            }
            var data = $.extend(true, {}, item);
            data['preIndex'] = index + "";
            // 数据项
            itemHtml += render({data: data});
        });

        // 分组数据
        this._letters.length && (this._startIndex = this._letters.length);
        ds.forEach(function(item, index) {

            var text = self.groupTitleRender.call(self, item, index);
            var title = item.title ? item.title : text;
            if(!lastLetter || title !== lastLetter) {
                // 分组标题
                if(self.get('lazyload') && index > 20) {
                    self._lazyData.push({data: {isLetter: true, text: title}});
                } else {
                    itemHtml += render({data: {isLetter: true, text: title}});
                }
                self._letters.push(lastLetter = title);
                self._indexListData.push({text: text, title: title});
            }
            var data = $.extend(true, {}, item);
            data['dataIndex'] = index + "";

            if(self.get('lazyload') && index > 20) {
                self._lazyData.push({data: data});
            } else {
                // 数据项
                itemHtml += render({data: data});
            }
        });
        return itemHtml;
    },

    /**
     * 根据标记找到相应的节点
     * @function getItemByFlag
     * @param {String} flag 节点的item-flag标记
     * @memberOf Grouplist
     * @private
     */
    getItemByFlag: function (flag) {
        return this._itemWrap.find('[item-flag="' + flag + '"]');
    },

    /**
     * 创建索引字母列表
     * @function _createIndexlist
     * @memberOf Grouplist
     * @private
     */
    _createIndexlist: function () {
        var data = this._indexListData;
        if(!data.length) {
            return;
        }

        this._showLetters = this._letters.slice(0);

        var indexList = this._indexList = $(Template(this.get('indexlistTpl'), {data: data}));
        var indexItems = indexList.find('[data-role="index-item"]');
        this.widgetEl.append(indexList);
        this._indexListItemHeight = indexItems[0].clientHeight;

        // 如果索引列表高度超过了父容器高度，隐藏部分字母
        // TODO 优化隐藏算法
        var groupHeight = indexList.height();
        if(groupHeight >= this._listHeight) {
            var hideItem;
            var itemContainer = indexList.find('[data-role="index-container"]')[0];
            for(var i = this._startIndex; i < data.length; i += 3) {
                indexItems[i + 1] && (indexItems[i + 1].innerHTML = '<span class="ellipsis"></span>');
                if((hideItem = indexItems[i + 2])) {
                    var index = this._showLetters.indexOf(hideItem.getAttribute('data-title'));
                    this._showLetters.splice(index, 1);
                    itemContainer.removeChild(indexItems[i + 2]);
                }
            }
            groupHeight = indexList.height();
        }
        var groupTop = Math.round((this._listHeight - groupHeight)/2);
        indexList.css('top', groupTop + 'px');
        this._indexListPos = this._indexList[0].getBoundingClientRect();

        // 绑定事件
        var self = this;
        this._indexList.on('touchstart', function(e) {
            self._indexstart(e);
        });
        this._indexList.on('touchmove', function(e) {
            self._indexmove(e);
        });
        this._indexList.on('touchend', function(e) {
            self._indexend(e);
        });
        this._indexList.on('touchcancel', function(e) {
            self._indexend(e);
        });
    },

    /**
     * 创建顶部磁贴字母
     * @function _createSticky
     * @memberOf Grouplist
     * @private
     */
    _createSticky: function() {
        // 在列表顶部显示的字母
        this._sticky = $(Template(this.get('stickyTpl'), {letter: this._indexListData[0].title}));
        this.widgetEl.append(this._sticky);
        if(this._length) {
            this._stickyHeight = this._titleNodes.first().height() - 1;
            this._hideSticky();
        }
    },

    
    /**
     * 获取磁贴字母最大能显示的索引
     * @function _getMaxIndex
     * @memberOf Grouplist
     * @private
     */
    _getMaxIndex: function() {
        if(this._length) {
            for(var i = this._length - 1; i >= 0; i--) {
                if(this._scroller.height() - this._titleNodesTop[i] > this._listHeight) {
                    this._maxIndex = i;
                    break;
                }
            }
        }
    },

    /**
     * 根据当前的translateY改变磁贴字母
     * @function _changeSticky
     * @param {Number} currY 当前滚动容器的translateY值
     * @param {Boolean} stopAnimation 是否停止动画
     * @memberOf Grouplist
     * @private
     */
    _changeSticky: function(currY, stopAnimate) {
        var orientation = this.getOrientation();
        if(orientation == 'up') {
            this._up(currY, stopAnimate);
        } else if(orientation == 'down') {
            this._down(currY, stopAnimate);
        }
    },

    /**
     * 当前方向是向上滑动时，处理磁铁和动画
     * @function _up
     * @memberOf Grouplist
     * @param {Number} currY 当前滚动容器的translateY值
     * @param {Boolean} stopAnimation 是否停止动画
     * @private
     */
    _up: function (currY, stopAnimate) {
        var offsetY = this._lastLetterY - currY;
        if(offsetY >= 0) { // 达到可切换状态
            if(offsetY >= this._stickyHeight) { // 完成切换
                --this._currIndex;
                this._switch();
                this._setLetterY();
            } else { // 切换中
                var letterIndex = this._currIndex - 1 < 0 ? 0 : this._currIndex - 1;
                var currLetter = this._letters[letterIndex];
                if(this._sticky[0].innerText != currLetter) {
                    this._sticky[0].innerText = currLetter;
                }
                this._setLetterY(-this._stickyHeight + offsetY);
            }
        } else {
            // 向上滑动，发生在磁贴字母切换到下一个还未完成时
            if(this._stickyTranslate) {
                offsetY = this._nextLetterY - currY > 0 ? 0 : this._nextLetterY - currY;
                this._setLetterY(offsetY);
            } else if(stopAnimate) {
                if(this._letters[this._currIndex] != this._sticky.text()) {
                    this._sticky.text(this._letters[this._currIndex]);
                }
            }
        }
    },

    /**
     * 当前方向是向下滑动时，处理磁铁和动画
     * @function _down
     * @memberOf Grouplist
     * @param {Number} currY 当前滚动容器的translateY值
     * @param {Boolean} stopAnimation 是否停止动画
     * @private
     */
    _down: function(currY, stopAnimate) {
        var offsetY = currY - this._nextLetterY;
        if(offsetY >= 0) { // 达到可切换状态
            if(offsetY >= this._stickyHeight) { // 完成切换
                ++this._currIndex;
                this._switch();
                this._setLetterY();
            } else { // 切换中
                this._setLetterY(offsetY === 0 ? 0 : -offsetY);
            }
        } else {
            // 向下滑动，发生在磁贴字母切换到上一个还未完成时
            if(this._stickyTranslate) {
                offsetY = this._lastLetterY - currY;
                if(offsetY <= 0) {
                    this._setLetterY(0);
                    this._switch();
                } else {
                    this._setLetterY(offsetY - this._stickyHeight);
                }
            } else if(stopAnimate) {
                if(this._letters[this._currIndex] != this._sticky.text()) {
                    this._sticky.text(this._letters[this._currIndex]);
                }
            }
        }
    },

    /**
     * 根据当前的触摸点得坐标跳转到索引字母
     * @function _jumpTo
     * @memberOf Grouplist
     * @private
     * @param {Number} touchY 当前的触点的Y
     */
    _jumpTo: function(touchY) {

        var index = 0, groupLetter = '', clientTop = this._indexListPos.top;
        if(touchY > clientTop + this._indexListItemHeight) {
            index = Math.ceil((touchY - clientTop) / this._indexListItemHeight) - 1;
            // TODO 支持多个隐藏
            index >= this._hideIndex && index++;
            groupLetter = this._showLetters[index];
            index = this._letters.indexOf(groupLetter);
        } else {
            groupLetter = this._showLetters[index];
        }

        if(index === this._lastIndex) {
            return;
        }

        if(index < 0 || index > this._length - 1) {
            return;
        }

        var offsetTop = this._titleNodesTop[index];
        var translateY = offsetTop === 0 ? 0 : -offsetTop;
        translateY = translateY> 0 ? 0 : translateY < this._maxY ? this._maxY : translateY;

        this._scroller[0].style.webkitTransform = 'translate(0px, ' + translateY + 'px) translateZ(0)';
        this._scroller[0].style.transform = 'translate(0px, ' + translateY + 'px) translateZ(0)';
        this._translateY = translateY;
        this._lastIndex = index;

        if(offsetTop == Math.abs(translateY)) {
            this._sticky.text(groupLetter);
            this._currIndex = index;
        } else { // 分组下面的内容已经不足以满屏的处理
            groupLetter = this._letters[this._maxIndex];
            this._sticky.text(groupLetter);
            this._currIndex = this._maxIndex;
        }
        this._setLetterY();
    },

    /**
     * 设置磁贴字母的translateY
     * @function _setLetterY
     * @memberOf Grouplist
     * @private
     * @param {Number} y 当translateY便宜
     */
    _setLetterY: function(y) {
        y = y || 0;
        this._sticky[0].style.webkitTransform = 'translate(0px, ' + y + 'px) translateZ(0px)';
        this._sticky[0].style.transform = 'translate(0px, ' + y + 'px) translateZ(0px)';
        this._stickyTranslate = y;
    },

    /**
     * 索引列表touchstart事件的处理函数
     * @param  {HTMLDOMEvent} e touchstart事件对象
     * @function _indexstart
     * @memberOf Grouplist
     * @private
     */
    _indexstart: function (e) {
        e.preventDefault();
        e.stopPropagation();

        if(!this._stickyVisible) {
            this._showSticky();
        }

        var touchY = e.touches[0].clientY;
        if(this.stopAnimate()) {
            var self = this;
            // 阻止动画效果中,延迟50ms触发
            setTimeout(function() {
                self._jumpTo(touchY);
            }, 50);
        } else {
            this._jumpTo(touchY);
        }
    },

    /**
     * 索引列表touchmove事件的处理函数
     * @param  {HTMLDOMEvent} e touchmove事件对象
     * @function _indexmove
     * @memberOf Grouplist
     * @private
     */
    _indexmove: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var pos = this._indexListPos;
        var touchY = e.touches[0].clientY;

        // 滑动超出容器范围
        if(touchY <= pos.top) {
            touchY = pos.top;
        } else if (touchY >= pos.bottom) {
            touchY = pos.bottom;
        }
        this._jumpTo(touchY);
    },

    /**
     * 索引列表touchend事件的处理函数
     * @param  {HTMLDOMEvent} e touchend事件对象
     * @function _indexend
     * @memberOf Grouplist
     * @private
     */
    _indexend: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this._switch();
    },

    /**
     * 根据当前字母的索引，切换该字母上下字母的top值
     * @function _switch
     * @memberOf Grouplist
     * @private
     */
    _switch: function() {
        if(this._currIndex >= 0 && this._currIndex < this._length) {
            this._lastLetterY = this._titleNodesTop[this._currIndex];
            this._sticky.text(this._letters[this._currIndex]);
            var nextNodeTop = this._titleNodesTop[this._currIndex + 1];
            this._nextLetterY = nextNodeTop ? nextNodeTop - this._stickyHeight : 999999999;
        }
    },

    /**
     * 显示磁贴字母
     * @function _showSticky
     * @memberOf Grouplist
     * @private
     */
    _showSticky: function() {
        this._sticky.show();
        this._setLetterY();
        this._stickyVisible = true;
    },

    /**
     * 隐藏磁贴字母
     * @function _hideSticky
     * @memberOf Grouplist
     * @private
     */
    _hideSticky: function() {
        this._sticky.hide();
        this._stickyVisible = false;
        this._lastIndex = -99;
    }
});

module.exports = Grouplist;