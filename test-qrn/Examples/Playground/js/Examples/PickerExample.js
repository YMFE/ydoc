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
import React, {Component, StyleSheet, View, Text, PickerView,TimePickerView} from 'qunar-react-native'

var tempData =[];
tempData.push([{"value":"1","label":"Mercury"},{"value":"2","label":"Venus"},{"value":"3","label":"Earth"},{"value":"4","label":"Mars"},{"value":"5","label":"Jupiter"}]);
tempData.push([{"value":"1","label":"Mercury"},{"value":"2","label":"Venus"},{"value":"3","label":"Earth"},{"value":"4","label":"Mars"},{"value":"5","label":"Jupiter"}]);
tempData.push([{"value":"1","label":"Mercury"},{"value":"2","label":"Venus"},{"value":"3","label":"Earth"},{"value":"4","label":"Mars"},{"value":"5","label":"Jupiter"}]);

var tmpSelectedIndexes=[1,2,3];


var QPicker = React.createClass({
    getInitialState() {
        return {
            componentData: tempData,
            selectedIndexes: tmpSelectedIndexes
        };
    },
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.container}>
                  <PickerView cyclic={ true } sound={false }
                  componentData={this .state.componentData} textSize={ 19 }
                  selectedIndexes={this .state.selectedIndexes}
                  onChange={(data)=>this .pickerSelect(data)} />
                </View>
                <View style={styles.container}>
                  <TimePickerView mode='ALL' minuteInterval={5} sound={true}
                  minimumDate={new Date(1990,0,1,0,0)} cyclic={true}
                  maximumDate={new Date(2100,0,1,0,0)} date={new Date()} />
                </View>
            </View>
        );
    },

    pickerSelect(data) {
         var newIndex = data.select;
         var newSelectIndexes = [newIndex,newIndex,newIndex];
         this.setState({componentData:tempData,selectedIndexes:newSelectIndexes});
    },

    timePickerSelect(data){
        var year=data.year;
        var month=data.month;
        var day=data.day;
        var hour=data.hour;
        var min=data.min;
        console.log(year,month,day,hour,min)
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

module.exports = {
    name: 'QPicker',
    title: 'QPicker',
    scroll: true,
    examples: [{
        subtitle: 'subtitle1',
        render: () => {
            return <QPicker/>
        }
    },]
}
