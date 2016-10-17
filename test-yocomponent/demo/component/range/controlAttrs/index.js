import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Page from '../../common/page';
import RangeSlider from '../../../../component_dev/range/src';
import AttrsLi from '../../attrsli/AttrsLi';
import Switch from '../../../../component_dev/switch/src';
import Number from '../../../../component_dev/number/src';
import '../main.scss';

class RangeSliderDemo extends Component {
    constructor(props) {
        super(props);
        this.value = props.value;
        this.stateProps = {
            value: this.props.value,
            max: this.props.max,
            min: this.props.min,
            step: this.props.step,
            single: this.props.single,
            scalePosition: this.props.scalePosition || 'up',
            disable: this.props.disable || false,
            resize: this.props.resize || false,
            // round: this.props.round || 1/4,
        };
        this.attrsLiData = this.getTransformData(this.stateProps);
        this.controlledAttrsData = {};
        this.state = {
            ...this.stateProps,
            attrsLiData: this.attrsLiData,
            scaleChecked: false,
            arriveround: this.stateProps.round || 1/4
        }
    }

    onChange(state) {
        console.log('--- onChange', state);
        this.setState(state);
    }

    strFormated(str) {
        const regxNum = /^(-?\d+)(\.\d+)?$/;
        return str.split(',')
            .map(str => str.trim())
            .map(str => (regxNum.test(str) || str === 'false' || str === 'true' ) ? str : `'${str}'`)
            .join(', ');
    }

    prefixInputValue(str) {
        return !Array.isArray(str) ? str : `[ ${this.strFormated(String(str))} ]`;
    }

    getTransformData(modeData) {
        return Object.entries(modeData).map(cur => ({
            text: cur[0],
            attr: cur[0],
            defaultValue: this.prefixInputValue(cur[1]),
        }));
    }

    componentDidUpdate() {
        Object.keys(this.controlledAttrsData).forEach(key => {
            this.controlledAttrsData[key] = this.state[key];
        });
    }

    _handleTouchEnd(e, that, value) {
    }

    render() {
        return (
            <div className="controlatrrs">
                <RangeSlider
                    ref="rangeSlider"
                    max={this.state.max}
                    min={this.state.min}
                    value={this.state.value}
                    step={this.state.step}
                    single={this.state.single}
                    scale={this.state.scale}
                    disable={this.state.disable}
                    // onSliderTouchMove={ () => console.log('demo touch move') }
                    onSliderTouchEnd={this._handleTouchEnd.bind(this)}
                    onChange={this.onChange.bind(this)}
                    decimalNum={this.state.decimalNum}
                    resize={this.state.resize}
                    round={this.state.round}
                    scalePosition={this.state.scalePosition}
                    extraClass={this.state.extraClass}
                />
                <div className="h3">
                <h3>受控属性</h3>
                    <button
                        className="yo-btn yo-btn-pri set-multi"
                        onClick={() => {
                            const state = {};
                            Object.keys(this.controlledAttrsData).map(key => {
                                state[key] = this.controlledAttrsData[key];
                            });
                            this.onChange(state);
                        }}
                    >
                        设置setState
                    </button>
                </div>
                <ul
                    className="yo-list"
                    ref={node => {this.attrsUl = node}}
                >
                    {this.state.attrsLiData.map((attrs, index) =>
                        <AttrsLi
                            key={`li${index + 1}`}
                            controlledAttrsData={this.controlledAttrsData}
                            curValue={this.state[attrs.attr]}
                            {...attrs}
                            onChange={this.onChange.bind(this)}
                        />
                    )}

                    <li className="item" key={`li${this.state.attrsLiData.length}`}>
                        <div className="mark flex">scale</div>
                        <div className="switch">
                            <div className="flex">默认</div>
                            <Switch
                                checked={this.state.scaleChecked}
                                onChange={bool => {
                                    const state = {
                                        scale: bool
                                            ? ['0￥', '100￥', '200￥', '300￥', '400￥', '500￥',  '600￥','不限']
                                            : undefined
                                    };
                                    this.onChange(state);
                                    this.setState({ scaleChecked: bool });
                                }}
                            />
                            <div className="flex">非默认</div>
                        </div>
                    </li>

                    <li className="item" key="li0">
                        <div className="mark flex">{'round'}</div>
                        <div className="flex">
                            <Number
                                value={this.state.arriveround}
                                min={0}
                                max={1}
                                step={0.05}
                                dotNum={2}
                                onChange={arriveround => {
                                    this.setState({
                                        arriveround: arriveround
                                    });
                                    this.onChange({ round: arriveround});
                                }}
                            />
                        </div>
                    </li>

                </ul>
            </div>
        )
    }
}

ReactDom.render(
  <Page title="Range Demo">
    <RangeSliderDemo
        single={false}
        disable={false}
        max={300}
        min={-300}
        value={[-150, 150]}
        step={150}
    />
  </Page>,
document.getElementById('content')
);
