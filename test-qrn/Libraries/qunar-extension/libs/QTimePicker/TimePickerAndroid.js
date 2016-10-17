'use strict';


var React = require('qunar-react-native');
var {
  StyleSheet,
  View,
  PropTypes,
  Text,
  requireNativeComponent,
} = React;
var RCTTimePickerView=requireNativeComponent('RCTTimePickerView',TimePickerView);

var TimePickerView = React.createClass({
  name: 'TimePickerView',

  propTypes: {
    mode: PropTypes.oneOf([
      'datetime',
      'date',
      'month',
      'monthtime',
      'time',]),
    date:PropTypes.instanceOf(Date),
    minimumDate:PropTypes.instanceOf(Date),
    maximumDate:PropTypes.instanceOf(Date),
    minuteInterval: PropTypes.oneOf([0, 1, 2, 3, 5, 6, 10, 12, 15, 20, 30,]),
    timeZoneOffsetInMinutes: PropTypes.number,
    cyclic:PropTypes.bool,
    sound:PropTypes.bool,
    onChange: PropTypes.func,
  },

  getInitialState() {
    return this._initFromProps(this.props);
  },

  getDefaultProps() {
    return {
      mode: 'datetime',
      date: new Date(),
      minuteInterval: 1,
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this._initFromProps(nextProps));
  },

  _stateFromProps: function (props) {
    var dateArrayCur = this._verifyDateArray(props.date);
    return {dateArrayCur};
   },

  _initFromProps: function (props) {
    var dateArrayCur = this._verifyDateArray(props.date);
    var dateArrayMin = this._verifyDateArray(props.minimumDate);
    var dateArrayMax = this._verifyDateArray(props.maximumDate);
    var timeZoneOffsetInMinutes = 240;
    return {dateArrayCur,dateArrayMin,dateArrayMax,timeZoneOffsetInMinutes};
  },

  _onChange:function(event){
    var nativeEvent=event.nativeEvent;
    if (this.props.onChange) {
        var date = new Date();
        
        date.setFullYear(nativeEvent.year);
        date.setMonth(nativeEvent.month);
        date.setDate(nativeEvent.day);
        date.setHours(nativeEvent.hour);
        date.setMinutes(nativeEvent.min);

       this.props.onChange(date);
    }
  },

  _verifyDateArray(date){
    if(date === null || typeof date === 'undefined'){
      return null;
    }else{
      var dateArray = new Array(5);
      dateArray[0] = date.getFullYear();
      dateArray[1] = date.getMonth();
      dateArray[2] = date.getDate();
      dateArray[3] = date.getHours();
      dateArray[4] = date.getMinutes();
      return dateArray;
    }
  },

  render: function() {
    return (
        <RCTTimePickerView
            style={styles.picker}
            minuteInterval={this.props.minuteInterval}
            sound={this.props.sound}
            mode={this.props.mode}
            cyclic={this.props.cyclic}
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInMinutes}
            minimumDate={this.state.dateArrayMin}
            maximumDate={this.state.dateArrayMax}
            date={this.state.dateArrayCur} onChange={this._onChange}
        />
    )
  },
});

var styles = StyleSheet.create({
     picker: {
       flex:1,
       height: 200,
       width:270,
     },
  });
module.exports = TimePickerView;
