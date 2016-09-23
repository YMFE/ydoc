/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule TouchableCustomFeedback
 * @noflow
 */
'use strict';

// Note (avik): add @flow when Flow supports spread properties in propTypes

var ColorPropType = require('ColorPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var StyleSheet = require('StyleSheet');
var TimerMixin = require('react-timer-mixin');
var Touchable = require('Touchable');
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');
var View = require('View');

// var ensureComponentIsNative = require('ensureComponentIsNative');
var ensurePositiveDelayProps = require('ensurePositiveDelayProps');
var keyOf = require('fbjs/lib/keyOf');
var merge = require('merge');
var onlyChild = require('react/lib/onlyChild');

type Event = Object;

var DEFAULT_PROPS = {
  // activeOpacity: 0.8,
  // underlayColor: 'black',
  disabled: false,
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
 *     <TouchableCustomFeedback onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('image!myButton')}
 *       />
 *     </TouchableCustomFeedback>
 *   );
 * },
 * ```
 * > **NOTE**: TouchableCustomFeedback supports only one child
 * >
 * > If you wish to have several child components, wrap them in a View.
 */

var TouchableCustomFeedback = React.createClass({
  propTypes: {
    ...TouchableWithoutFeedback.propTypes,
    style: View.propTypes.style,
    disabled: React.PropTypes.bool,
    defaultContent: React.PropTypes.element,
    activedContent: React.PropTypes.element,
    disabledContent: React.PropTypes.element,
    onPress: React.PropTypes.func,
    onLongPress: React.PropTypes.func,
    onPressIn: React.PropTypes.func,
    onPressOut: React.PropTypes.func,
  },

  mixins: [NativeMethodsMixin, TimerMixin, Touchable.Mixin],

  getDefaultProps: () => DEFAULT_PROPS,

  getInitialState: function() {
    return merge(this.touchableGetInitialState(), {
        actived: false,
    });
  },

  componentDidMount: function() {
    ensurePositiveDelayProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    ensurePositiveDelayProps(nextProps);
  },

  viewConfig: {
    uiViewClassName: 'RCTView',
    validAttributes: ReactNativeViewAttributes.RCTView
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function(e: Event) {
    if(this.props.disabled){
        return;
    }
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._showPressInContent();
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function(e: Event) {
    if(this.props.disabled){
      return;
    }
    if (!this._hideTimeout) {
        this._hidePressInContent();
    }
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress: function(e: Event) {
    if(this.props.disabled){
      return;
    }
    this.clearTimeout(this._hideTimeout);
    this._showPressInContent();
    this._hideTimeout = this.setTimeout(this._hidePressInContent,
      this.props.delayPressOut || 100);
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleLongPress: function(e: Event) {
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function() {
    return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
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

  _showPressInContent: function() {
    if (!this.isMounted()) {
      return;
    }

    this.setState({
      actived: true,
    });
  },

  _hidePressInContent: function() {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;

    this.setState({
      actived: false,
    });
  },

  render: function() {
    var defaultContent = this.props.defaultContent,
        activedContent = this.props.activedContent || defaultContent,
        disabledContent = this.props.disabledContent || defaultContent;

    var content = this.props.disabled ? disabledContent
                    : this.state.actived ? activedContent
                        : defaultContent;

    return (React: any).cloneElement(onlyChild(content), {
      accessible: true,
      accessibilityLabel: this.props.accessibilityLabel,
      accessibilityComponentType: this.props.accessibilityComponentType,
      accessibilityTraits: this.props.accessibilityTraits,
      testID: this.props.testID,
      onLayout: this.props.onLayout,
      onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
      onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
      onResponderGrant: this.touchableHandleResponderGrant,
      onResponderMove: this.touchableHandleResponderMove,
      onResponderRelease: this.touchableHandleResponderRelease,
      onResponderTerminate: this.touchableHandleResponderTerminate
    });
  }
});

// var CHILD_REF = keyOf({childRef: null});
// var UNDERLAY_REF = keyOf({underlayRef: null});
// var INACTIVE_CHILD_PROPS = {
//   style: StyleSheet.create({x: {opacity: 1.0}}).x,
// };
// var INACTIVE_UNDERLAY_PROPS = {
//   style: StyleSheet.create({x: {backgroundColor: 'transparent'}}).x,
// };

module.exports = TouchableCustomFeedback;
