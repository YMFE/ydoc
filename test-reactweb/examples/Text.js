'use strict';

var React = require('qunar-react-native');
var {
    Text,
    View,
    StyleSheet,
    AppRegistry,
} = React;
var Header = require('./Header');


var Example1 = React.createClass({
    render(){
        return(
            <View>
                <Text style={styles.subtitle}>文本样式</Text>
                <View style={styles.textContainer}>
                    <Text style={{fontWeight:'bolder'}}>
                        bolder
                        <Text style={{color:'#f00'}}>
                            color
                        </Text>
                    </Text>
                </View>
            </View>
        )
    }
});
 
var Example2 = React.createClass({
   render(){
        return(
            <View>
                <Text style={styles.subtitle}>文本Press</Text>
                <View style={styles.textContainer}>
                    <Text
                        onPress={()=>{console.log('onPress')}}
                    >
                        text
                    </Text>
                </View>
            </View>
        )
    } 
});

var Example3 = React.createClass({
   render(){
        return(
            <View>
                <Text style={styles.subtitle}>12px下的字体</Text>
                <View style={styles.textContainer}>
                    <View style={styles.textCell}>
                        <Text style={styles.mdText}>
                            你好hello12px
                        </Text>
                    </View>
                    <View style={styles.textCell}>
                        <Text style={styles.smText}>
                            你好hello10px
                        </Text>
                    </View>
                    <View style={styles.textCell}>
                        <Text style={styles.xsText}>
                            你好hello8px
                        </Text>
                    </View>
                </View>
            </View>
        )
    } 
})


var Demo = React.createClass({
    render(){
        return(
            <View>
                <Header navigator={navigator} title="Text"></Header>
                <View>
                    <Example1/>
                    <Example2/>
                    <Example3/>
                </View>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    subtitle:{
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        backgroundColor: '#f6f7f8',
    },
    textContainer:{
        padding:10,
        flex:1,
        flexDirection:'row',
    },
    textCell:{
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#000',
        borderWidth:1,
        margin:10,
    },
    mdText:{
        fontSize:12,
    },
    smText:{
        fontSize:10,
    },
    xsText:{
        fontSize:8,
    }
});


AppRegistry.registerComponent('AwesomeProject', () => Demo);

module.exports = Demo;
