'use strict';

var React = require('qunar-react-native');
var {
  StyleSheet,
  View,
  PropTypes,
  Text,
  requireNativeComponent,
  NativeModules,
  PropTypes,
} = React;
var RCTPickerView=requireNativeComponent('RCTPickerView',PickerView);
var PickerView = React.createClass({
  name: 'PickerView',

  propTypes: {
    textSize: PropTypes.number,
    selectedIndexes:PropTypes.array,
    componentData: PropTypes.any,
    cyclic:PropTypes.bool,
    sound:PropTypes.bool,
    onChange: PropTypes.func,
  },

  getInitialState() {
    return this._stateFromProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this._stateFromProps(nextProps));
  },

  _stateFromProps: function (props) {
    var componentData = props.componentData;
    var selectedIndexes = props.selectedIndexes;
    return {componentData, selectedIndexes,};
   },

  _onChange:function(event){
    var nativeEvent=event.nativeEvent;
    if (this.props.onChange) {
       this.props.onChange(nativeEvent);
    }
  },

  render: function() {
    return (
        <RCTPickerView style={[{flex:1},styles.picker]} sound={this.props.sound} cyclic={this.props.cyclic} textSize={this.props.textSize} selectedIndexes={this.state.selectedIndexes} componentData={this.state.componentData} onChange={this._onChange}
        />
    );
  },
});

var styles = StyleSheet.create({
     picker: {
       flex:1,
       height: 200,
       width:270,
     },
  });
module.exports = PickerView;
