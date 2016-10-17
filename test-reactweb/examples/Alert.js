// -*- mode: web; -*-

'use strict';

import React, {Alert, StyleSheet, Text, TouchableHighlight, View, Component, AppRegistry} from 'qunar-react-native';

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

class AlertExample extends Component {
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
        let threeButtonValue = this.getConsoleButton(['乖乖站好', '乖', '不乖'], 'threeButtonValue');
        let tooMany = new Array(10).fill('').map((_, index) => 'Button ' + index);
        let tooManyButtonValue = this.getConsoleButton(tooMany, 'tooManyButtonValue');

        return (
            <View>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => Alert.alert(
                        'Alert Title',
                        alertMessage,
                    )}>
                    <View style={styles.button}>
                        <Text>Alert with message and default button</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => Alert.alert(
                        'Alert Title',
                        alertMessage,
                        [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
                    )}>
                    <View style={styles.button}>
                        <Text>Alert with one button</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => Alert.alert(
                        'Alert Title',
                        alertMessage,
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                            {text: 'OK', onPress: () => console.log('OK Pressed!')},
                        ]
                    )}>
                    <View style={styles.button}>
                        <Text>Alert with two buttons</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => Alert.alert(
                        'Alert Title',
                        null,
                        threeButtonValue
                    )}>
                    <View style={styles.button}>
                        <Text>Alert with three buttons</Text>
                    </View>
                </TouchableHighlight>
                <View style={styles.text}>
                    <Text>You selected: {this.state.threeButtonValue}</Text>
                </View>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => Alert.alert(
                        'Foo Title',
                        alertMessage,
                        tooManyButtonValue
                    )}>
                    <View style={styles.button}>
                        <Text>Alert with too many buttons</Text>
                    </View>
                </TouchableHighlight>
                <View style={styles.text}>
                    <Text>You selected: {this.state.tooManyButtonValue}</Text>
                </View>
            </View>
        );
    }
}




AppRegistry.registerComponent('AlertExample', () => AlertExample)
