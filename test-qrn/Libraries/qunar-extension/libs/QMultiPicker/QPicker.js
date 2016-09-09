/** -*- mode: web; -*-
  @providesModule MultiPicker
 */
 'use strict';

var React = require('react-native');
var { StyleSheet, View, NativeModules, PropTypes, requireNativeComponent} = React;
var QRCTMultiPickerConsts = NativeModules.UIManager.QRCTMultiPicker.Constants;
var QRCTMultiPickerManager = NativeModules.QRCTMultiPickerManager;
var PICKER_REF = 'picker';

var MultiPickerIOS = React.createClass({
  propTypes: {
    componentData: PropTypes.any,
    selectedIndexes: PropTypes.array,
    onChange: PropTypes.func,
    controlled:PropTypes.bool,
  },

  getInitialState() {
    return this._stateFromProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this._stateFromProps(nextProps));
  },

  // converts child PickerComponent and their Item children into state
  // that can be sent to QRCTMultiPickerIOS native class.
  _stateFromProps: function (props) {
    var componentData = props.componentData;
    var selectedIndexes = props.selectedIndexes;
    return { componentData, selectedIndexes, };
  },
  _onChange: function (event) {
    var nativeEvent = event.nativeEvent;
    // Call any change handlers on the component itself
    if (this.props.onChange) {
      this.props.onChange(nativeEvent);
    }

    if (this.props.valueChange) {
      this.props.valueChange(nativeEvent);
    }

    // Call any change handlers on the child component picker that changed
    // if it has one. Doing it this way rather than storing references
    // to child nodes and their onChage props in _stateFromProps because
    // React docs imply that may not be a good idea.
    React.Children.forEach(this.props.children, function (child, idx) {
      if (idx === nativeEvent.component && child.props.onChange) {
        child.props.onChange(nativeEvent);
      }
    });

    var nativeProps = {
      componentData: this.state.componentData,
    };

    // If we are a controlled instance, we tell the native component what
    // it's value should be after any change.
    if (this.props.controlled) {
      nativeProps.selectedIndexes = this.state.selectedIndexes;
    }

    this.refs[PICKER_REF].setNativeProps(nativeProps);
  },

  render() {
    return (
      <View style={this.props.style}>
        <QRCTMultiPickerIOS
            ref={PICKER_REF}
            style={styles.multipicker}
            selectedIndexes={this.state.selectedIndexes}
            componentData={this.state.componentData}
            onChange={this._onChange} />
      </View>
    );
  },
});

// Represents a "section" of a picker.
MultiPickerIOS.Group = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    selectedIndex: React.PropTypes.number,
    onChange: React.PropTypes.func,
  },

  render() {
    return null;
  },
});

// Represents an item in a picker section: the `value` is used for setting /
// getting selection
//
MultiPickerIOS.Item = React.createClass({
  propTypes: {
    value: React.PropTypes.any.isRequired, // string or integer basically
    label: React.PropTypes.string.isRequired, // for display
  },

  render() {
    return null;
  },
});

var styles = StyleSheet.create({
  multipicker: {
    height: QRCTMultiPickerConsts.ComponentHeight,
  },
});

var QRCTMultiPickerIOS = requireNativeComponent('QRCTMultiPicker', MultiPickerIOS);
module.exports = MultiPickerIOS;
