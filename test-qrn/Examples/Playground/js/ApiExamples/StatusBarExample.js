// -*- mode: web; -*-

'use strict';

import React, {Alert,QStatusBar, StyleSheet, Text, TouchableHighlight,NativeModules, View, Component} from 'qunar-react-native';

var StatusBarManager=NativeModules.QRCTStatusBarManager;

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 5,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#eeeeee',
        padding: 10,
    },
    text: {
        padding: 10,
    }
});

let alertMessage = 'Credibly reintermediate next-generation potentialities after goal-oriented ' +
                   'catalysts for change. Dynamically revolutionize.';

class StatusBarExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            threeButtonValue: 'none',
            tooManyButtonValue: 'none'
        }
    }

    getConsoleButton(arr, stateKey) {
        return arr.map(key => {
            return {
                text: key,
                onPress: () => this.setState({
                    [stateKey]: key
                })
            }
        });
    }

    render() {
        let threeButtonValue = this.getConsoleButton(['乖乖站好', '啊♂', '幻想乡'], 'threeButtonValue');
        let tooMany = new Array(10).fill('').map((_, index) => 'Button ' + index);
        let tooManyButtonValue = this.getConsoleButton(tooMany, 'tooManyButtonValue');

        return (
            <View>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => QStatusBar.setHidden(true,(success)=>{console.log(success);},(fail)=>{console.log(fail);})}>
                    <View style={styles.button}>
                        <Text>setHidden(true)</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => QStatusBar.setHidden(false,(success)=>{console.log(success);},(fail)=>{console.log(fail);})}>
                    <View style={styles.button}>
                        <Text>setHidden(false)</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => QStatusBar.setTranslucent(true,(success)=>{console.log(success);},(fail)=>{console.log(fail);})}>
                    <View style={styles.button}>
                        <Text>setTranslucent(true)</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => QStatusBar.setTranslucent(false,(success)=>{console.log(success);},(fail)=>{console.log(fail);})}>
                    <View style={styles.button}>
                        <Text>setTranslucent(false)</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => QStatusBar.setColor('#7FFFD4',true,(success)=>{console.log(success);},(fail)=>{console.log(fail);})}>
                    <View style={styles.button}>
                        <Text>setColor(true)</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => QStatusBar.setColor('#8A2BE2',false,(success)=>{console.log(success);},(fail)=>{console.log(fail);})}>
                    <View style={styles.button}>
                        <Text>setColor(false)</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}


module.exports = {
    title: 'StatusBar',
    scroll: true,
    examples: [{
        render: function() {
            return (
                <StatusBarExample />
            );
        }
    }]
};
