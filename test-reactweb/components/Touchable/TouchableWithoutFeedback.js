/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule TouchableWithoutFeedback
 */
'use strict';
//var EdgeInsetsPropType = require('../StyleSheet/EdgeInsetsPropType');

var React = require('react');
var TimerMixin = require('react-timer-mixin');
var TouchableMixin = require('Touchable').Mixin;
var View = require('View');
var StyleSheet = require('StyleSheet');
var ensurePositiveDelayProps = require('./ensurePositiveDelayProps');

type Event = Object;

var PRESS_RETENTION_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

/**
 * Do not use unless you have a very good reason. All the elements that
 * respond to press should have a visual feedback when touched. This is
 * one of the primary reason a "web" app doesn't feel "native".
 *
 * > **NOTE**: TouchableWithoutFeedback supports only one child
 * >
 * > If you wish to have several child components, wrap them in a View.
 */

/**
 * TouchableWithoutFeedback组件
 *
 * @component TouchableWithoutFeedback
 * @example ./TouchableWithoutFeedback.js[1-60]
 * @version >=v1.4.0
 * @description  TouchableWithoutFeedback是一个无触摸操作反馈的组件。除非有足够的理由，否则应该尽量避免使用此组件。
 *
 * ![TouchableWithoutFeedback](./images/component/TouchableWithoutFeedback.gif)
 *
 */
var TouchableWithoutFeedback = React.createClass({
  mixins: [TimerMixin, TouchableMixin],

  propTypes: {
    /**
     * @property accessible
     * @type bool 
     * @description 是否启用无障碍功能，当此属性为true时，则启用。
     */ 
    accessible: React.PropTypes.bool,

    /**
     * @property disabled
     * @type bool 
     * @description 是否禁止组件交互，如果设为true，则禁止。
     */ 
    /**
     * If true, disable all interactions for this component.
     */
    disabled: React.PropTypes.bool,
    

    /**
     * @property onPress
     * @type function 
     * @param {object} [event] 
     * @description 当触摸操作结束时调用此回调函数，如果被取消了则不调用
     */ 
     /**
     * Called when the touch is released, but not if cancelled (e.g. by a scroll
     * that steals the responder lock).
     */
    onPress: React.PropTypes.func,

    /**
     * @property onPressIn
     * @type function 
     * @param {object} [event] 
     * @description 
     */ 
    onPressIn: React.PropTypes.func,

    /**
     * @property onPressOut
     * @type function 
     * @param {object} [event] 
     * @description 
     */ 
    onPressOut: React.PropTypes.func,


    /**
     * @property onLayout
     * @type function
     * @description 当组件挂载或者布局变化的时候调用，参数为：{nativeEvent: { layout: {x, y, width, height}}}。
     */
    /**
     * Invoked on mount and layout changes with
     *
     *   `{nativeEvent: {layout: {x, y, width, height}}}`
     */
    onLayout: React.PropTypes.func,


    /**
     * @property onLongPress
     * @type function 
     * @param {object} [event] 
     * @description 长按时调用此回调函数
     */ 
    onLongPress: React.PropTypes.func,


    /**
     * @property delayPressIn
     * @type number 
     * @description 从触摸操作开始到onPressIn被调用的延迟,单位是毫秒。
     */
    /**
     * Delay in ms, from the start of the touch, before onPressIn is called.
     */
    delayPressIn: React.PropTypes.number,


    /**
     * @property delayPressOut
     * @type number 
     * @description 从触摸操作开始到onPressOut被调用的延迟,单位是毫秒。
     */
    /**
     * Delay in ms, from the release of the touch, before onPressOut is called.
     */
    delayPressOut: React.PropTypes.number,
    


    /**
     * @property delayPressOut
     * @type number 
     * @description 从onPressIn开始，到onLongPress被调用的延迟。单位是毫秒。
     */
    /**
     * Delay in ms, from onPressIn, before onLongPress is called.
     */
    delayLongPress: React.PropTypes.number,
    /**
     * When the scroll view is disabled, this defines how far your touch may
     * move off of the button, before deactivating the button. Once deactivated,
     * try moving it back and you'll see that the button is once again
     * reactivated! Move it back and forth several times while the scroll view
     * is disabled. Ensure you pass in a constant to reduce memory allocations.
     */
  //  pressRetentionOffset: EdgeInsetsPropType,
    /**
     * This defines how far your touch can start away from the button. This is
     * added to `pressRetentionOffset` when moving off of the button.
     * ** NOTE **
     * The touch area never extends past the parent view bounds and the Z-index
     * of sibling views always takes precedence if a touch hits two overlapping
     * views.
     */
  //  hitSlop: EdgeInsetsPropType,
  },

  getInitialState: function() {
    return this.touchableGetInitialState();
  },

  componentDidMount: function() {
    ensurePositiveDelayProps(this.props);
  },

  componentWillReceiveProps: function(nextProps: Object) {
    ensurePositiveDelayProps(nextProps);
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandlePress: function(e: Event) {
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleActivePressIn: function(e: Event) {
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function(e: Event) {
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandleLongPress: function(e: Event) {
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function(): typeof PRESS_RETENTION_OFFSET {
    return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
  },

  touchableGetHitSlop: function(): ?Object {
    return this.props.hitSlop;
  },

  touchableGetHighlightDelayMS: function(): number {
    return this.props.delayPressIn || 0;
  },

  touchableGetLongPressDelayMS: function(): number {
    return this.props.delayLongPress === 0 ? 0 :
      this.props.delayLongPress || 500;
  },

  touchableGetPressOutDelayMS: function(): number {
    return this.props.delayPressOut || 0;
  },

  render: function(): ReactElement {
    return React.cloneElement(React.Children.only(this.props.children), {
      accessible: this.props.accessible !== false,
      accessibilityLabel: this.props.accessibilityLabel,
      accessibilityRole: this.props.accessibilityRole,
      testID: this.props.testID,
      onLayout: this.props.onLayout,
      hitSlop: this.props.hitSlop,
      onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
      onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
      onResponderGrant: this.touchableHandleResponderGrant,
      onResponderMove: this.touchableHandleResponderMove,
      onResponderRelease: this.touchableHandleResponderRelease,
      onResponderTerminate: this.touchableHandleResponderTerminate,
      tabIndex: '0'
    })
  }
});
var fixStyle = {
  flex: 1,
}
module.exports = TouchableWithoutFeedback;