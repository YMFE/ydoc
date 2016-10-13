import React, {Component, PropTypes} from 'react';
import RangeSlider from '../src';

export default class RangeSliderDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disable: props.disable,
            resize: false,
            value: props.value,
        }
    }

    onChange(stateData) {
        console.log(stateData);
        this.setState(stateData);
    }

    render() {
        return (
            <div>
            <RangeSlider
                ref="rangeSlider"
                max={this.props.max}
                min={this.props.min}
                value={this.state.value}
                step={this.props.step}
                single={this.props.single}
                scale={this.props.scale}
                disable={this.state.disable}
                onTouchMove={() => console.log('demo touch move')}
                onTouchEnd={() => console.log('demo touch end')}
                onChange={this.onChange.bind(this)}
                decimalNum={this.props.decimalNum}
                resize={this.state.resize}
            >
            </RangeSlider>
            </div>
        )
    }
}
