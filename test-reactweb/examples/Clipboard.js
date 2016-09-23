'use strict';
var React = require('qunar-react-native');
var {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Clipboard
} = React;

var ClipboardExample = React.createClass({
    getInitialState:function(){
        return {
            content:''
        };
    },
    render:function(){
        return (
            <View>
                <Text
                    style={styles.btn}
                    onPress={()=>{
                        Clipboard.setString('Hello World!');
                        Clipboard.getString().then(str => {
                            this.setState({
                                content:str
                            });
                        });
                    }}>
                    Tap to put "Hello World" in the clipboard
                </Text>
                <Text style={styles.row}>
                    Clipboard content:{this.state.content}
                </Text>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    btn:{
        padding:10,
        backgroundColor:'#ccc',
        marginBottom:10
    },
    row:{
        padding:10
    }
});

AppRegistry.registerComponent('ClipboardExample', () => ClipboardExample);
