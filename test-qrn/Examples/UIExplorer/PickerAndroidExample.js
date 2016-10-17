/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  View,
  StyleSheet,
} = React;

var tempData =[];
tempData.push([{"value":"1","label":"Mercury"},{"value":"2","label":"Venus"},{"value":"3","label":"Earth"},{"value":"4","label":"Mars"},{"value":"5","label":"Jupiter"}]);
tempData.push([{"value":"1","label":"Mercury"},{"value":"2","label":"Venus"},{"value":"3","label":"Earth"},{"value":"4","label":"Mars"},{"value":"5","label":"Jupiter"}]);
tempData.push([{"value":"1","label":"Mercury"},{"value":"2","label":"Venus"},{"value":"3","label":"Earth"},{"value":"4","label":"Mars"},{"value":"5","label":"Jupiter"}]);

var tmpSelectedIndexes=[1,2,3];
var PickerAndroid=require('./PickerAndroid');
var TimePickerAndroid=require('./TimePickerAndroid')

var QAndroidPicker =React.createClass( {
   getInitialState: function() {
      return {
        pickerData: tempData,
        pickSelectedIndexes: tmpSelectedIndexes,
      };
    },

  render() {
  return(
     <View>
      <PickerAndroid styles={styles.container} cyclic={true} sound={false} componentData={this.state.pickerData} textSize={19} selectedIndexes={this.state.pickSelectedIndexes} onChange={(data)=>this.pickerSelect(data)}/>
      <TimePickerAndroid mode='ALL' minuteInterval={5} sound={true} minimumDate={new Date(2006,4,3,23,19)} cyclic={true} maximumDate={new Date(2026,0,12,22,56)} date={new Date(2006,4,3,23,20)} />
     </View>
  )
  },

  pickerSelect(data) {
           var newIndex = data.select;
           var newSelectIndexes = [newIndex,newIndex,newIndex];
           this.setState({pickerData:tempData,pickSelectedIndexes:newSelectIndexes});
  },

  timePickerSelect(data){
        var year=data.year;
        var month=data.month;
        var day=data.day;
        var hour=data.hour;
        var min=data.min;
        console.log(year,month,day,hour,min)
  }
});

var styles = StyleSheet.create({
     container: {
         flex: 1,
         justifyContent: 'center',
         backgroundColor: '#F5FCFF',
     },
});

exports.displayName = (undefined: ?string);
exports.title = '<PickerAndroid>';
exports.description = '自定义 anroid picker';
exports.examples = [
{
  title: '<PickerAndroid>',
  render: function(): ReactElement {
    return <QAndroidPicker />;
  },
}];
