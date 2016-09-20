/**
 * Imagelazyload 图片懒加载组件
 * 
 * @author eva.li<eva.li@qunar.com>
 * @class Imagelazyload
 * @constructor
 * @extends Base
 * @category tool
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/imagelazyload/index.html
 */

var $ = require('../../../util/1.0.0/index.js'),
	Base = require('../../../base/1.0.0/index.js');

var Imagelazyload = Base.extend({
	/**
	 * @property {String} container 容器
	 * @property {Number} offset 相对容器计算高度差值，默认为0
	 * @property {Number} target 懒加载元素选择器，默认为img
	 * @property {Boolean} vertical 是否为垂直，默认为true
	 * @property {Boolean} iscroll 是否为iscroll模式
	 * @property {Boolean} autoStoreSrc 是否自动拆出src
	 * @property {String} unloadImg 未加载时占位图片，无默认值
	 * @property {String} unloadImg 加载错误的替换图片，无默认值
	 * @property {String} loadClass 加载图片的时候样式，无默认值
	 * @property {String} effect 加载动画可选none(不需要动画),extra(自定义动画配置effectclasslist相配合）,其他为渐现
	 * @property {Array} effectclasslist 自定义动画样式数组
	 * @memberOf Imagelazyload
	 */
	options: {
		container: 'body',
		offset: 0,
		target: 'img',
		vertical: true,
		iscroll: true,
		autoStoreSrc: true,
		unloadImg: '',
		errorImg: '',
		loadClass: '',
		effect: 'none', //设置为extra 支持用户扩展效果
		effectclasslist: [] //用户扩展效果样式名称
	},
	/**
	 * 对于传入的数据进行格式化和初始化
	 * @private
	 * @function _formatParam 
	 * @memberOf Imagelazyload
	 */
	_formatParam: function() {
		var self = this;
		//对传入的参数进行格式化处理
		for (var key in this.options) {
			switch (key) {
				case 'offset':
					this.set(key, parseInt(this.get(key), 10));
					break;
				case 'vertical':
					this.set(key, Boolean(this.get(key)));
					break;
				default:
					break;
			}
		}
		//根据方向 设置不同的判断函数
		if (Boolean(self.get('vertical'))) {
			this.judge = function(imgItem, scroll, itemY) {
				var result,
					scroll = scroll || 0,
					itemY = itemY || 0,
					standard = window.scrollY + document.documentElement.clientHeight + self.get('offset') - scroll;
				//TODO对于绑定事件进行判断 如果是scroll 逻辑不变 如果是 touchend或是 transitionend 则设置图片加载区间 
				// var beginLine = this.container.offset().top - scroll;
				// 	deadLine = this.container.offset().top + this.container.offset().height - scroll;
				this.getOffset(imgItem) + itemY < standard ? result = true : result = false;
				// $(imgItem).offset().top + itemY < deadLine ? result = true : result = false;

				return result;
			}
		} else {
			this.judge = function(imgItem, scroll, itemX) {
				var result,
					scroll = scroll || 0,
					itemX = itemX || 0,
					standard = window.scrollX + document.documentElement.clientWidth + self.get('offset') - scroll;
				this.getOffset(imgItem, 'left') + itemX < standard ? result = true : result = false;
				return result;
			}
		}
		//根据传入的动画状态设置不同的动画类名
		switch (self.get('effect')) {
			case 'none':
				this.aniClassList = [];
				break;
			case 'extra':
				this.aniClassList = self.get('effectclasslist');
				break;
			default:
				this.aniClassList = ['ani', 'fade-in'];
		}
	},
	/**
	 * 绑定滚动事件
	 * @private
	 * @function _bindEvent
	 * @memberOf Imagelazyload
	 */
	_bindEvent: function() {
		var self = this;
		this.scrollEvent = function() {
			self.lazyload();
		};
		$(window).on('scroll', this.scrollEvent);
	},
	/**
	 * 接班事件
	 * @private
	 * @function _unbindEvent
	 * @memberOf Imagelazyload
	 */
	_unbindEvent: function() {
		var self = this;
		$(window).off('scroll', this.scrollEvent);
	},
	/**
	 * 扫描符合描述的元素节点
	 * @function scan
	 * @memberOf  Imagelazyload
	 */
	scan: function() {
		var self = this;
		self.list = $(self.get('container')).find(self.get('target')).not('[data-complete = true]');
		// console.log(self.list);
		if (self.get('autoStoreSrc')) {
			self.list.each(function(index, item) {
				var $item = $(item),
					href = $(item).attr('src');
				$item.data('src', href);
				$item.attr('src', self.get('unloadImg'));
			})
		}
		return self;
	},
	/**
	 * 执行懒加载
	 * @function lazyload
	 * @param  {Number} iscrool 滚动位置
	 * @param  {Number} itemoffset 偏差
	 * @memberOf Imagelazyload
	 */
	lazyload: function(iscroll, itemoffset) {
		var self = this;
		// 首次调用iscroll设置为1 为了防止与reload触发iscroll=0 时相混淆
		//支出组建内部缓存上次记载滚动位置
		self.iscroll = iscroll || self.iscroll || 1;
		//如果iscroll==0 则不执行 lazyload
		if (!!self.list.length && self.iscroll) {
			for (var i = 0, len = self.list.length; i < len; i++) {
				item = self.list[i];
				if (self.judge(item, self.iscroll, itemoffset)) {
					self._checkout(item);
					//对于图片大小为0的图片进行提示
					if (item.height === 0 && item.width === 0) {
						console.warn(item, '该图片大小为0，请核实')
					}
				} else {
					self.list = self.list.slice(i);
					break;
				}
				i == len - 1 ? self.list = [] : '';
			}
		}
	},
	/**
	 * 快速扫描并且加载
	 * @function scanandload
	 * @param  {Number} iscroll 滚动位置
	 * @memberOf Imagelazyload
	 */
	scanandload: function(iscroll) {
		this.scan().lazyload(iscroll);
	},
	/**
	 * 重新扫描未添加到队列中的节点
	 * @function refresh
	 * @memberOf Imagelazyload
	 */
	refresh: function() {
		var container = this.get('container'),
			list = $(this.get('container')).find(this.get('target'));
		if (this.get('autoStoreSrc')) {
			list.attr('data-src', '');
		} else {
			list.attr('src', this.get('unloadImg'));
		}
		list.attr('data-complete', false);
		this.scan().lazyload();
	},
	/**
	 * 初始化函数
	 * @private
	 * @function initialize
	 * @memberOf Imagelazyload
	 */
	initialize: function(config) {
		Imagelazyload.superClass.initialize.call(this, config);
		this.container = $(this.get('container'));
		this._formatParam();
		this.scan();
		this.lazyload();
		this.get('iscroll') ? ' ' : this._bindEvent();
	},
	/**
	 * 销毁组件
	 * @function destory
	 * @memberOf destory
	 */
	destroy: function() {
		this.get('iscroll') ? ' ' : this._unbindEvent();
		Imagelazyload.superClass.destroy.call(this);
	},
	/**
	 * 判断图片是否合法
	 * @private
	 * @function _checkout
	 * @param {Dom} imgDom 图片Dom节点
	 * @memberOf Imagelazyload
	 */
	//判断图片链接是否可用
	_checkout: function(item) {
		var self = this,
			$item = $(item);
		var itemSrc = $item.data('src'),
			img = new Image();
		$item.addClass(self.get('loadClass'));

		img.onerror = function(err) {
			if (self.get('errorImg')) {
				$item.attr('src', self.get('errorImg'));
			}
			$item.removeClass(self.get('loadClass'));
			$item.data('complete', true);
			$item.trigger('error', err);
			img = null;
		};
		img.onload = function() {
			$item.removeClass(self.get('loadClass'));
			self._effect($item);
			$item.attr('src', $item.data('src'));
			$item.data('complete', true);
			img = null;
		};
		img.src = itemSrc;
	},
	/**
	 * 动画效果处理函数
	 * @private
	 * @param  {Dom} 图片节点
	 * @memberOf Imagelazyload
	 */
	_effect: function($item) {
		var self = this;
		self.aniClassList.length && $.each(self.aniClassList, function(index, item) {
			$item.addClass(item);
		});
	},
	//zepto对于 offsetTop计算不准确 
	//TODO加上translateY值
	/**
	 * 内置计算图片offset函数
	 * @private
	 * @function getOffset
	 * @param  {Dom} 图片节点
	 * @param  {String}计算内容 top或者left,默认值为top
	 * @memberOf Imagelazyload
	 */
	getOffset: function(item, type) {
		var measure = type || 'top';
		if (measure == 'left') {
			var currentEle = item,
				offset = 0;
			while (currentEle && currentEle.offsetParent != document.body) {
				offset += currentEle.offsetLeft;
				currentEle = currentEle.offsetParent;
			}
			return offset;
		} else {
			var currentEle = item,
				offset = 0;
			while (currentEle && currentEle.offsetParent != document.body) {
				offset += currentEle.offsetTop;
				currentEle = currentEle.offsetParent;
			}
			return offset;
		}
	}

})
module.exports = Imagelazyload;