import React, {Component, PropTypes} from 'react';
import RangeSlider from '../../../component_dev/range/src';

export default class RangeSliderDemo extends Component {
    static defaultProps = {
        coreAttrs : []
    };

    constructor(props) {
        super(props);
        console.log('props', props);
        this.state = {
            disable: props.disable,
            resize: false,
            value: props.value,
        }
    }

    onChange(stateData) {
        console.log(stateData.value);
        this.setState(stateData);
    }

    strFormated(str) {
        const regxNum = /^(-?\d+)(\.\d+)?(e-?\+?\d+)?$/;
        return str.split(',')
            .map(str => str.trim())
            .map(str => regxNum.test(str) ? this.noZero(str)
                : (str === 'false' || str === 'true') ? str
                : `'${str}'`)
            .join(', ');
    }

    noZero(num) {
        return parseFloat(parseFloat(num).toFixed(2));
    }

    prefixInputValue(str, single) {
        if (single) return this.noZero(str[0]);
        return !Array.isArray(str) ? String(str) : `[ ${this.strFormated(String(str))} ]`;
    }

    render() {
        const single = this.props.single;
        return (
          <div className="demo">
            <div className="h3">
              <h3>样例{this.props.index}</h3>
              <div className="tip">value：{this.prefixInputValue(this.state.value, single)}</div>
            </div>
            <RangeSlider
                ref="rangeSlider"
                max={this.props.max}
                min={this.props.min}
                value={this.state.value}
                step={this.props.step}
                single={this.props.single}
                scale={this.props.scale}
                disable={this.state.disable}
                onSliderTouchMove={(value, evt, that) =>
                    console.log('demo touch move', this.noZero(value[0]), this.noZero(value[1]))
                }
                onSliderTouchEnd={() => console.log('demo touch end')}
                onChange={this.onChange.bind(this)}
                resize={this.state.resize}
                round={this.props.round}
                scalePosition={this.props.scalePosition}
                activeClass={this.props.activeClass}
                extraSliderClass={this.props.extraSliderClass}
                extraTickBarClass={this.props.extraTickBarClass}
                extraClass={this.props.extraClass}

            />
            {this.props.coreAttrs.map(attr =>
              <li className="item">
                <div className="mark flex h4">{`关键属性：${attr} `}</div>
                <div className="flex">
                  {this.prefixInputValue(this.props[attr])}
                </div>
              </li>
            )}

          </div>
        )
    }
}
