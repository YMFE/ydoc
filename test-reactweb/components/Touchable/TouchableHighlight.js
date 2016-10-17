/*!
 * @providesModule TouchableHighlight
 */


'use strict';

// Note (avik): add @flow when Flow supports spread properties in propTypes

var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('react');
var StyleSheet = require('StyleSheet');
var TimerMixin = require('react-timer-mixin');
var TouchableMixin = require('./Touchable').Mixin;
var TouchableWithoutFeedback = require('./TouchableWithoutFeedback');
var View = require('View');


var keyOf = require('fbjs/lib/keyOf');


var ensureComponentIsNative = require('./ensureComponentIsNative');

var ensurePositiveDelayProps = require('./ensurePositiveDelayProps');
var merge = require('merge');

type Event = Object;

var DEFAULT_PROPS = {
  activeOpacity: 0.8,
  underlayColor: 'black',
  style:{}
};

var PRESS_RETENTION_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, which allows
 * the underlay color to show through, darkening or tinting the view.  The
 * underlay comes from adding a view to the view hierarchy, which can sometimes
 * cause unwanted visual artifacts if not used correctly, for example if the
 * backgroundColor of the wrapped view isn't explicitly set to an opaque color.
 *
 * Example:
 *
 * ```
 * renderButton: function() {
 *   return (
 *     <TouchableHighlight onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('image!myButton')}
 *       />
 *     </TouchableHighlight>
 *   );
 * },
 * ```
 * > **NOTE**: TouchableHighlight supports only one child
 * >
 * > If you wish to have several child components, wrap them in a View.
 */


 /**
 * TouchableHighlight组件
 *
 * @component TouchableHighlight
 * @example ./TouchableHighlight.js[1-58]
 * @version >=0.20.0
 * @description  TouchableHighlight是一个封装了视图，能正确相应触摸操作的组件。
 *
 * ![TouchableHighlight](./images/component/TouchableHighlight.gif)
 *
 */

var TouchableHighlight = React.createClass({
  propTypes: {
    /**
     * @property TouchableWithoutFeedback.props...
     * @type object
     * @description 继承所有属于TouchableWithoutFeedback的属性。
     */
    ...TouchableWithoutFeedback.propTypes,
    

    /**
     * @property activeOpacity
     * @type number
     * @description 在触摸操作激活时，封装视图以多少透明度显示。
     */
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active.
     */
    activeOpacity: React.PropTypes.number,
    /**
     * The color of the underlay that will show through when the touch is
     * active.
     */


    /**
     * @property onShowUnderlay
     * @type function
     * @description 当底层的颜色被显示的时候调用。
     */
    /**
     * Called immediately after the underlay is shown
     */
    onShowUnderlay: React.PropTypes.func,
    /**
     * Called immediately after the underlay is hidden
     */

    /**
     * @property onHideUnderlay
     * @type function
     * @description 当底层的颜色被隐藏的时候调用.
     */
    onHideUnderlay: React.PropTypes.func,
  },

  mixins: [NativeMethodsMixin, TimerMixin, TouchableMixin],

  getDefaultProps: () => DEFAULT_PROPS,

  // Performance optimization to avoid constantly re-generating these objects.
  computeSyntheticState: function(props) {
    props.style = StyleSheet.fix(props.style || {})
    return {
      activeProps: {
        style: {
          opacity: props.activeOpacity,
        }
      },
      activeUnderlayProps: {
        style: {
          backgroundColor: props.underlayColor,
        }
      },
      underlayProps: {
        style: {
          backgroundColor: props.style.backgroundColor || null
        }
      }
    };
  },

  getInitialState: function() {
    return merge(this.touchableGetInitialState(), this.computeSyntheticState(this.props))
  },

  componentDidMount: function() {
    ensurePositiveDelayProps(this.props);
    ensureComponentIsNative(this.refs[CHILD_REF]);
  },

  componentDidUpdate: function() {
    ensureComponentIsNative(this.refs[CHILD_REF]);
  },

  componentWillReceiveProps: function(nextProps) {
    ensurePositiveDelayProps(nextProps);
    if (nextProps.activeOpacity !== this.props.activeOpacity ||
        nextProps.underlayColor !== this.props.underlayColor ||
        nextProps.style !== this.props.style) {
      this.setState(this.computeSyntheticState(nextProps));
    }
  },

  // viewConfig: {
  //   uiViewClassName: 'RCTView',
  //   validAttributes: ReactNativeViewAttributes.RCTView
  // },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._showUnderlay();
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function(e: Event) {
    if (!this._hideTimeout) {
      this._hideUnderlay();
    }
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress: function(e: Event) {
    this.clearTimeout(this._hideTimeout);
    this._showUnderlay();
    this._hideTimeout = this.setTimeout(this._hideUnderlay,
      this.props.delayPressOut || 100);
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
    return this.props.delayPressIn;
  },

  touchableGetLongPressDelayMS: function() {
    return this.props.delayLongPress;
  },

  touchableGetPressOutDelayMS: function() {
    return this.props.delayPressOut;
  },

  _showUnderlay: function() {
    if (!this.isMounted() || !this._hasPressHandler()) {
      return;
    }
    this.refs[UNDERLAY_REF].setNativeProps(this.state.activeUnderlayProps);
    this.refs[CHILD_REF].setNativeProps(this.state.activeProps);
    this.props.onShowUnderlay && this.props.onShowUnderlay();
  },

  _hideUnderlay: function() {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    if (this._hasPressHandler() && this.refs[UNDERLAY_REF]) {
      this.refs[CHILD_REF].setNativeProps(INACTIVE_CHILD_PROPS);
      this.refs[UNDERLAY_REF].setNativeProps(this.state.underlayProps);
      this.props.onHideUnderlay && this.props.onHideUnderlay();
    }
  },

  _hasPressHandler: function() {
    return !!(
      this.props.onPress ||
      this.props.onPressIn ||
      this.props.onPressOut ||
      this.props.onLongPress
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
    _style = StyleSheet.fix(_style) // 很重要！！
    return (
      <View
        accessible={true}
        accessibilityLabel={this.props.accessibilityLabel}
        accessibilityRole={this.props.accessibilityRole || this.props.accessibilityTraits || 'button'}
        hitSlop={this.props.hitSlop}
        onKeyDown={(e) => { this._onKeyEnter(e, this.touchableHandleActivePressIn) }}
        onKeyPress={(e) => { this._onKeyEnter(e, this.touchableHandlePress) }}
        onKeyUp={(e) => { this._onKeyEnter(e, this.touchableHandleActivePressOut) }}
        onLayout={this.props.onLayout}
        onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
        onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
        onResponderGrant={this.touchableHandleResponderGrant}
        onResponderMove={this.touchableHandleResponderMove}
        onResponderRelease={this.touchableHandleResponderRelease}
        onResponderTerminate={this.touchableHandleResponderTerminate}
        ref={UNDERLAY_REF}
        style={_style}
        tabIndex='0'
        testID={this.props.testID}>
        {React.cloneElement(
          React.Children.only(this.props.children),
          {
            ref: CHILD_REF,
          }
        )}
      </View>
    );
  }
});

var CHILD_REF = keyOf({childRef: null});
var UNDERLAY_REF = keyOf({underlayRef: null});
var INACTIVE_CHILD_PROPS = {
  style: StyleSheet.create({x: {opacity: 1.0}}).x,
};

var styles = StyleSheet.create({
  root: {
    cursor: 'pointer',
    userSelect: 'none'
  }
});

module.exports = TouchableHighlight;
