'use strict'

import React, {Component, StyleSheet, View, Text, Slider} from 'qunar-react-native'
var Header = require('./Header')

class SliderExampleItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sliderValue: 0
        }
    }
    render() {
        const {step, minimumValue, maximumValue} = this.props
        var {navigator} = this.props
        return (
            <View style={{flex:1, flexDirection: 'column'}}>
                <Header navigator={navigator} title="TouchableHighlight"></Header>
                <View 
                    style={styles.innerContainer} 
                >
                    <Text style={styles.valueText}>{this.state.sliderValue}</Text>
                    <Slider
                        step={step}
                        value={this.state.sliderValue}
                        minimumValue={minimumValue}
                        maximumValue={maximumValue}
                        onValueChange={this.onValueChange.bind(this)}
                        onSlidingComplete={this.onSlidingComplete.bind(this)}
                    />
                </View>
            </View>
        )
    }
    onValueChange(v) {
        this.setState({
            sliderValue: v
        })
    }
    onSlidingComplete(v) {
        console.log(v)
    }
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,
    },
    valueText: {
        marginBottom: 12,
        textAlign: 'center',
    }
});

module.exports = SliderExampleItem;
