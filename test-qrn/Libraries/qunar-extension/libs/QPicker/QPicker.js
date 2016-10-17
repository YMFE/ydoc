/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule QPicker
 * @flow
 */

'use strict';

var ColorPropType = require('ColorPropType');
var PickerIOS = require('PickerIOS');
var QPickerAndroid = require('QPickerAndroid');
var Platform = require('Platform');
var React = require('React');
var StyleSheet = require('StyleSheet');
var StyleSheetPropType = require('StyleSheetPropType');
var TextStylePropTypes = require('TextStylePropTypes');
var UnimplementedView = require('UnimplementedView');
var View = require('View');
var ViewStylePropTypes = require('ViewStylePropTypes');

var itemStylePropType = StyleSheetPropType(TextStylePropTypes);

var pickerStyleType = StyleSheetPropType({
  ...ViewStylePropTypes,
  color: ColorPropType,
});

/**
 * Renders the native picker component on iOS and Android. Example:
 *
 *     <QPicker
 *       selectedValue={this.state.language}
 *       onValueChange={(lang) => this.setState({language: lang})}>
 *       <QPicker.Item label="Java" value="java" />
 *       <QPicker.Item label="JavaScript" value="js" />
 *     </QPicker>
 */
class QPicker extends React.Component {
 props: {
  style?: $FlowFixMe,
  selectedValue?: any,
  onValueChange?: Function,
  itemStyle?: $FlowFixMe,
  testID?: string,
 };

 static propTypes = {
   ...View.propTypes,
   style: pickerStyleType,
   /**
    * Value matching value of one of the items. Can be a string or an integer.
    */
   selectedValue: React.PropTypes.any,
   /**
    * Callback for when an item is selected. This is called with the following parameters:
    *   - `itemValue`: the `value` prop of the item that was selected
    *   - `itemPosition`: the index of the selected item in this picker
    */
   onValueChange: React.PropTypes.func,
   /**
    * If set to false, the picker will be disabled, i.e. the user will not be able to make a
    * selection.
    * @platform android
    */
   itemStyle: itemStylePropType,
   /**
    * Used to locate this view in end-to-end tests.
    */
   testID: React.PropTypes.string,
 };

 render() {
     if (Platform.OS === 'ios') {
       // $FlowFixMe found when converting React.createClass to ES6
       return <PickerIOS {...this.props}>{this.props.children}</PickerIOS>;
     } else if (Platform.OS === 'android') {
       // $FlowFixMe found when converting React.createClass to ES6
       return <QPickerAndroid {...this.props}>{this.props.children}</QPickerAndroid>;
     } else {
       return <UnimplementedView />;
     }
 }
}

/**
 * Individual selectable item in a QPicker.
 */
// $FlowFixMe found when converting React.createClass to ES6
QPicker.Item = class extends React.Component {
 props: {
  label: string,
  value?: any,
  color?: $FlowFixMe,
  testID?: string,
 };

 static propTypes = {
   /**
    * Text to display for this item.
    */
   label: React.PropTypes.string.isRequired,
   /**
    * The value to be passed to picker's `onValueChange` callback when
    * this item is selected. Can be a string or an integer.
    */
   value: React.PropTypes.any,
   /**
    * Color of this item's text.
    * @platform android
    */
   color: ColorPropType,
   /**
    * Used to locate the item in end-to-end tests.
    */
   testID: React.PropTypes.string,
 };

 render() {
   // The items are not rendered directly
   throw null;
 }
};

module.exports = QPicker;
