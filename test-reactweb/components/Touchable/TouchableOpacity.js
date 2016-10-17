/**
 * @providesModule TouchableOpacity
 */

var Animated = require('Animated');
var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('react');
var StyleSheet = require('StyleSheet');
var TimerMixin = require('react-timer-mixin');
var Touchable = require('Touchable');
var TouchableWithoutFeedback = require('./TouchableWithoutFeedback');

var ensurePositiveDelayProps = require('./ensurePositiveDelayProps');

type Event = Object;

var PRESS_RETENTION_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 * This is done without actually changing the view hierarchy, and in general is
 * easy to add to an app without weird side-effects.
 *
 * Example:
 *
 * ```
 * renderButton: function() {
 *   return (
 *     <TouchableOpacity onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('image!myButton')}
 *       />
 *     </TouchableOpacity>
 *   );
 * },
 * ```
 */

 /**
 * TouchableOpacity组件
 *
 * @component TouchableOpacity
 * @example ./TouchableOpacity.js[1-38]
 * @version >=v1.4.0
 * @description  TouchableOpacity是一个封装视图，能够响应触摸操作，当触摸时，视图的不透明度会降低。
 *
 * ![TouchableOpacity](./images/component/TouchableOpacity.gif)
 *
 */ 
var TouchableOpacity = React.createClass({
  mixins: [TimerMixin, Touchable.Mixin, NativeMethodsMixin],

  propTypes: {
    /**
     * @property TouchableWithoutFeedback.props...
     * @type object
     * @description 继承所有属于TouchableWithoutFeedback的属性。
     */ 
    ...TouchableWithoutFeedback.propTypes,
    
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active.
     */
    /**
     * @property activeOpacity
     * @type number
     * @description 触摸操作被激活时，视图以多少不透明度显示。
     */
    activeOpacity: React.PropTypes.number,
  },

  getDefaultProps: function() {
    return {
      activeOpacity: 0.2,
      style: {},
    };
  },

  getInitialState: function() {
    return {
      ...this.touchableGetInitialState(),
      anim: new Animated.Value(1),
    };
  },

  componentDidMount: function() {
    ensurePositiveDelayProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    ensurePositiveDelayProps(nextProps);
  },

  setOpacityTo: function(value) {
    Animated.timing(
      this.state.anim,
      {toValue: value, duration: 150}
    ).start();
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._opacityActive();
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function(e: Event) {
    if (!this._hideTimeout) {
      this._opacityInactive();
    }
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress: function(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._opacityActive();
    this._hideTimeout = this.setTimeout(
      this._opacityInactive,
      this.props.delayPressOut || 100
    );
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleLongPress: function(e: Event) {
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function() {
    return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
  },

  touchableGetHitSlop: function() {
    return this.props.hitSlop;
  },

  touchableGetHighlightDelayMS: function() {
    return this.props.delayPressIn || 0;
  },

  touchableGetLongPressDelayMS: function() {
    return this.props.delayLongPress === 0 ? 0 :
      this.props.delayLongPress || 500;
  },

  touchableGetPressOutDelayMS: function() {
    return this.props.delayPressOut;
  },

  _opacityActive: function() {
    this.setOpacityTo(this.props.activeOpacity);
  },

  _opacityInactive: function() {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    var childStyle = StyleSheet.normalize(this.props.style);
    this.setOpacityTo(
      childStyle.opacity === undefined ? 1 : childStyle.opacity
    );
  },

  _onKeyEnter(e, callback) {
    var ENTER = 13
    if (e.keyCode === ENTER) {
      callback && callback(e)
    }
  },

  render: function() {
    var style = this.props.style,
      _style = [styles.root]
    if (style) {
      if (style.join) {
        _style = _style.concat(style)
      } else {
        _style.push(style)
      }
    } 
    _style.push({opacity: this.state.anim})
    _style = StyleSheet.fix(_style) // 很重要！！
    return (
      <Animated.View
        accessible={true}
        accessibilityLabel={this.props.accessibilityLabel}
        accessibilityRole={this.props.accessibilityRole || 'button'}
        style={_style}
        testID={this.props.testID}
        onLayout={this.props.onLayout}
        hitSlop={this.props.hitSlop}
        onKeyDown={(e) => { this._onKeyEnter(e, this.touchableHandleActivePressIn) }}
        onKeyPress={(e) => { this._onKeyEnter(e, this.touchableHandlePress) }}
        onKeyUp={(e) => { this._onKeyEnter(e, this.touchableHandleActivePressOut) }}
        onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
        onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
        onResponderGrant={this.touchableHandleResponderGrant}
        onResponderMove={this.touchableHandleResponderMove}
        onResponderRelease={this.touchableHandleResponderRelease}
        onResponderTerminate={this.touchableHandleResponderTerminate}
        tabIndex='0'
      >
        {this.props.children}
      </Animated.View>
    );
  },
});

var styles = StyleSheet.create({
  root: {
    cursor: 'pointer',
    userSelect: 'none'
  }
});

module.exports = TouchableOpacity;
