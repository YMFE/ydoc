'use strict'

import React, {Component, StyleSheet, View, Text, Slider} from 'qunar-react-native'

class SliderExampleItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sliderValue: 0
        }
    }
    render() {
        const {step, minimumValue, maximumValue} = this.props

        return (
            <View>
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
    valueText: {
        marginBottom: 12,
        textAlign: 'center',
    }
});

module.exports = {
    title: 'Slider',
    examples: [{
        subtitle: 'Default settings',
        render: () => {
            return <SliderExampleItem/>
        }
    }, {
        subtitle: 'minimumValue: -1, maximumValue: 2',
        render: () => {
            return <SliderExampleItem minimumValue={0} maximumValue={24} step={1}/>
        }
    }, {
        subtitle: 'step: 0.25',
        render: () => {
            return <SliderExampleItem step={0.25}/>
        }
    }]
};
