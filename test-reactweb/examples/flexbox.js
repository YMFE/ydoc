'use strict';
var React = require('qunar-react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
} = React;
var Header = require('./Header')
var AwesomeProject = React.createClass({
    render: function() {
        var {navigator} = this.props
        return (
            <View 
                style={{flex: 1,flexDirection: 'column'}}
            >
                <Header navigator={navigator} title="hello, qreact-web list"></Header>
                <View style = {styles.parent} >
                    <Text style = {styles.aaa} >
                    11111
                    </Text>

                    <Text style = {styles.bbb} >
                    222
                    </Text>

                    <Text style = {styles.ccc} >
                    333
                    </Text>

                </View>
            </View>
        );
    }
});
var styles = StyleSheet.create({
parent: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-around",
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

module.exports = AwesomeProject