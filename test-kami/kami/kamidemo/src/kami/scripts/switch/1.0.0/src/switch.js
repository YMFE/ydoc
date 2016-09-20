/**
 * select选择组件，不带弹出层，如果需要弹出层请参考popcalendar
 * 
 * @author eva.li<eva.li@qunar.com>
 * @class Switch
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/switch/index.html
 */


var $ = require('../../../util/1.0.0/index.js'),
	Widget = require('../../../core/1.0.0/index.js'),
	switchStr = require('./switch.string'),
	Template = require('../../../template/1.0.0/index.js');



var Switch = Widget.extend({


	/**
	 * @property {String} extraClass 组件根节点上放置的额外样式，默认为空
	 * @property {Boolean} state 当前的状态，开启还是关闭，默认为true
	 * @property {String} value 组件当前的值，如果设置了值
	 * @property {String} form 所属form的id值
	 * @property {String} name 在表单中的name
	 * @property {Boolean} disabled 是否是不可用状态
	 * @memberOf Switch
	 */
	
	
	options: {
		type: 'switch',
		template: switchStr,
		state: true,
		value: '',
		form: '',
		name: '',
		disabled: false,
		/**
		 * 值改变时触发的事件
		 * @event changevalue
		 * @param  {String} value     组件当前的值
		 * @param  {String prevValue  组件之前的值
		 * @memberOf Switch
		 */
		onchangevalue: function (value, prevValue) {

		},
		events: {
			'touchstart': 'switchtouchstart',
			'touchend': 'switchtouchend',
			'touchcancle': 'switchtouchcancle',
			'touchmove': 'switchtouchmove'
		}
	},

	/**
	 * 处理组件数据
	 * @function init
	 * @memberOf Switch
	 */

	init: function() {
		var state = this.get('state');
		this.touchLocateStart = [0, 0];
		this.touchLocateEnd = [0, 0];
		this.touchLocateMove = [0, 0];
		this.set('state', Boolean(state));
		this.disabled = !!this.get('disabled');

	},
	/**
	 * 设置组件的translateX
	 * @function _setCSS
	 * @memberOf Switch
	 * @param {String| Number} translateX 将要设置的组件的translateX
	 */

	_setCSS: function(translateX) {
		//【TODO】x没有var
		var x;
		this.get('state') ? x = this.line : x = 0;
		arguments.length ? '' : translateX = x;
		this.handle.css({
			'transform': 'translate(' + translateX + 'px, 0)',
			'-webkit-transform': 'translate(' + translateX + 'px, 0)'
		});
	},

	/**
	 * 初始化组件的属性
	 * @function _initOptions
	 * @memberOf Switch
	 */
	_initOptions: function() {
		this.container = this.widgetEl.find('[data-role="switch-container"]');
		this.checkbox = this.widgetEl.find('[data-role="switch-input"]');
		this.track = this.widgetEl.find('[data-role="switch-track"]');
		this.handle = this.widgetEl.find('[data-role="switch-handle"]');
		this.line = this.handle.width();
	},

	/**
	 * 组件toucstart事件的处理函数
	 * @function switchtouchstart
	 * @memberOf Switch
	 * @private
	 * @param  {HTMLDOMEvent} e touchstart事件对象
	 */
	switchtouchstart: function(e) {

		e.preventDefault();
		e.stopPropagation();
		if (this.disabled) {
			return;
		}
		this.touchLocateStart = [e.touches[0].clientX, e.touches[0].clientY];
	},

	/**
	 * 组件toucend事件的处理函数
	 * @function switchtouchend
	 * @memberOf Switch
	 * @private
	 * @param  {HTMLDOMEvent} e toucend事件对象
	 */
	switchtouchend: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var self = this,
			prevresult = result = this.get('state');

		if (this.disabled) {
			return;
		}
		if (this.touchmoveed) {
			this.touchLocateEnd = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
			var translateX = this.touchLocateEnd[0] - this.touchLocateStart[0] + this.line;
			if (translateX < this.line / 2) {
				result = false;
			} else {
				result = true;
			};
			this.touchmoveed = false;
		} else {
			result = !result;
		}
		if (!result == prevresult) {
			self.trigger('changevalue', result, prevresult);
			self.set('state', result);
			self.checkbox.prop('checked', result);

		}
		window.setTimeout(function() {
			self._setCSS();
		}, 0);
	},

	/**
	 * 组件touccancle事件的处理函数
	 * @function switchtouchcancle
	 * @memberOf Switch
	 * @private
	 * @param  {HTMLDOMEvent} e touccancle事件对象
	 */
	switchtouchcancle: function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (this.disabled) {
			return;
		}
		if (this.get('state')) {
			this.checkbox.prop("checked", true);
		} else {
			this.checkbox.prop("checked", false);
		}
		window.setTimeout(function() {
			this._setCSS();
		}, 0);
		this.touchmoveed = false;
	},

	/**
	 * 组件toucmove事件的处理函数
	 * @function switchtouchmove
	 * @memberOf Switch
	 * @private
	 * @param  {HTMLDOMEvent} e toucmove事件对象
	 */
	switchtouchmove: function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (this.disabled) {
			return;
		}
		this.touchLocateMove = [e.touches[0].clientX, e.touches[0].clientY];
		var translateX = this.touchLocateMove[0] - this.touchLocateStart[0] + this.line;
		if (translateX !== this.line) {
			if (translateX < 0) {
				translateX = 0;
			} else if (translateX > this.line) {
				translateX = this.line;
			}
			this._setCSS(translateX);
			this.touchmoveed = true;

		}
	},
	/**
	 * 将组件渲染到document中
	 * @function render
	 * @memberOf Switch
	 */
	render: function() {
		Switch.superClass.render.call(this);
		this._initOptions();
		this._setCSS();
		this.setDisabled(this.disabled);
		this.checkbox.prop('checked', !!this.get('state'));
	},

	/**
	 * 解析模板
	 * @function parseTemplate
	 * @memberOf Switch
	 * @private
	 * @param  {String} tpl 待解析的模板
	 * @return {String}     解析后的模板
	 */
	parseTemplate: function(tpl) {
		var str = this.get('template'),
			state = this.get('state'),
			value = this.get('value'),
			form = this.get('form'),
			name = this.get('name');

		var html = Template(tpl || str, {
			'state': state,
			'value': value,
			'form': form,
			'name': name
		});
		return html
	},

	/**
	 * 更改组件的不可操作状态
	 * @function setDisabled
	 * @memberOf Switch
	 * @param {Boolean} disabled 组件是否不可用
	 */
	setDisabled: function(disabled) {
		this.disabled = !!disabled;
		var disabledCls = this.getClassName('disabled');
		if (this.disabled) {
			this.widgetEl.addClass(disabledCls);
		} else {
			this.widgetEl.removeClass(disabledCls);
		}

		this.checkbox && this.checkbox.prop('disabled', !!disabled);
	},

	/**
	 * 更改组件的关闭打开状态
	 * @function setDisabled
	 * @memberOf Switch
	 * @param {Boolean} disabled 组件是否不可用
	 */
	setState: function(flag) {
		var prevresult = this.get('state'),
			result = Boolean(flag);
		if (!prevresult == result) {
			this.set('state', result);
			this.checkbox.prop('checked', !!this.get('state'));
			this._setCSS();
			this.trigger('changevalue', result, prevresult);
		}
	}

});

module.exports = Switch;