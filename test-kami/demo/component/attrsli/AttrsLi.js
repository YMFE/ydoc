import React, { Component } from 'react';
import Switch from '../../../component_dev/switch/src';
import './li.scss';
import '../../../component_dev/common/touchEventSimulator';
export default class AttrsLi extends Component {
    constructor(props) {
        super(props);
        props.controlledAttrsData[props.attr] = this.format(String(props.defaultValue));
        const { defaultValue, attr } = this.props;
        const switchState = this.switchable(defaultValue);
        this.state = {
            checked: switchState && switchState[1]
        };
    }

    format(value) {
        let newValue = value,
            regxSplit = /[:,/_]/;

        if (value.indexOf('[') !== -1) {
            newValue = value.replace(/[\[\]"']/g, '').split(regxSplit).map(str => this.strToTrueType(str.trim()));
        } else if (value === 'undefined') {
            newValue = undefined;
        } else {
            newValue = this.strToTrueType(value);
        }
        return newValue;
    }

    strFormated(str) {
        const regxNum = /^(-?\d+)(\.\d+)?(e-?\+?\d+)?$/;
        return str.split(',')
            .map(str => str.trim())
            .map(str => regxNum.test(str) ? parseFloat(str).toFixed(4)
                : (str === 'false' || str === 'true') ? str
                : `'${str}'`)
            .join(', ');
    }

    prefixInputValue(str) {
        return !Array.isArray(str) ? str : `[ ${this.strFormated(String(str))} ]`;
    }

    strToTrueType(str) {
        const regxNum = /^(-?\d+)(\.\d+)?(e-?\+?\d+)?$/;
        return str === 'false' ? false : str === 'true' ? true : regxNum.test(str) ? parseFloat(str) : str;
    }

    componentDidUpdate() {
        const curValue = this.props.curValue;
        if (this.inputNode.value && this.inputNode.value !== curValue) {
            this.inputNode.value = this.prefixInputValue(curValue);
        } else if (this.inputNode.value === undefined) {
            const switchState = this.switchable(curValue);
            if (this.state.checked !== switchState[1]) {
                this.setState({ checked: curValue });
            }
        }
    }

    switchable(value) {
        const switchStateMap = {
            true: ['false', true],
            false: ['true', false],
            'up': ['down', false],
            'down': ['up', true],
            'date': ['time', false],
            'time': ['date', true],
        };
        return switchStateMap[value];
    }

    render() {
        const controlledAttrsData = this.props.controlledAttrsData;
        const { defaultValue, attr } = this.props;
        const switchState = this.switchable(defaultValue);
        return (
          <li className="item" key={this.props.key}>
              <div className="mark flex">{this.props.text}</div>
                {switchState === undefined
                  ? <div className="flex">
                    <input
                      className={"input inputText"}
                      defaultValue={defaultValue}
                      ref={node => {
                        this.inputNode = node;
                      }}
                      onKeyDown={evt => {
                        const state = {};
                        if (evt.keyCode === 13) {
                          state[this.props.attr] = this.format(this.inputNode.value);
                          this.props.onChange(state);
                        }
                      }}
                      onKeyUp={() => {
                        controlledAttrsData[this.props.attr] = this.format(this.inputNode.value);
                      }}
                    />
                  </div>
                  : <div className="switch">
                    <div className="flex">{switchState[1] ? ` ${switchState[0]} ` : ` ${defaultValue} `}</div>
                    <Switch
                      ref={node => { this.inputNode = node }}
                      checked={this.state.checked}
                      onChange={bool => {
                          const value = bool === switchState[1] ? defaultValue : this.strToTrueType(switchState[0]),
                              state = {};
                          controlledAttrsData[attr] = value;
                          state[attr] = value;
                          this.props.onChange(state);
                          this.setState({ checked: bool });
                      }}
                    />
                    <div className="flex">{!switchState[1] ? ` ${switchState[0]} ` : ` ${defaultValue} `}</div>
                  </div>
                }
          </li>
        )
  }
}
