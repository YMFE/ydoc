'use strict';
var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    PickerView,
} = React;




var AA = React.createClass({
    render: function() {
var tempData =[];
tempData.push([{"value":"1","label":"Mercury"},{"value":"2","label":"Venus"},{"value":"3","label":"Earth"},{"value":"4","label":"Mars"},{"value":"5","label":"Jupiter"}]);
tempData.push([{"value":"1","label":"Mercury"},{"value":"2","label":"Venus"},{"value":"3","label":"Earth"},{"value":"4","label":"Mars"},{"value":"5","label":"Jupiter"}]);
tempData.push([{"value":"1","label":"Mercury"},{"value":"2","label":"Venus"},{"value":"3","label":"Earth"},{"value":"4","label":"Mars"},{"value":"5","label":"Jupiter"}]);
        var format = function(el){
            el.label += "!"
        }
        var change = function(v){
            console.log(v,"!!")
        }
        //95661,90a1b3,24672d
        return (
            <View className="example"  >
                <PickerView componentData={tempData}  
                  style={{backgroundColor:"#14A1B4", width:300, height:200}}
                  selectedValues={['1','2','3']}
                  onFormatLabel={format}
                  onValueChange={change}>
                </PickerView>
                
            </View>
        );
    }
});
var styles = StyleSheet.create({
parent: {
    flex:1,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: "#ddc"
},
aaa:{
    width:100,
    height:100,
    color:'green',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#a9ea00',
    lineHeight: 60
},
bbb: {
    width:100,
    height:100,
    color:'#fff',
    textAlign: 'center',
    backgroundColor: 'black',
    lineHeight: 100
},
ccc: {
    width:100,
    height:100,
    color:'blue',
    textAlign: 'center',
    backgroundColor: 'pink'
  }
});

require('react-native').AppRegistry.registerComponent('AwesomeProject', () => AA)