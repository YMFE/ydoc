/**
 * Created by qingguo.xu on 16/9/14.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page.js';
import Switch from '../../../component_dev/switch/src/';
import Number from '../../../component_dev/Number/src/';
import '../../../component_dev/common/touchEventSimulator';
import '../carousel/main.scss';

class Demo extends Component {
    constructor() {
        super();
        this.state = {
            value: -1,
            step: 1,
            dotNum: 2,
            min: -1,
            max: 10,
            inputDisable: false,
            disable: false,
        };
    }

    /**
     * @property change
     * @param e {Object} 事件对象
     * @param key {String}
     * @description onChange事件回调, 更新dialog的state
     */
    change(value, key) {
        this.state[key] = value;
        this.setState(this.state)
    }

    render() {
        return (
            <Page title="Number Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <Number
                    value={this.state.value}
                    step={this.state.step}
                    dotNum={this.state.dotNum}
                    min={this.state.min}
                    max={this.state.max}
                    extraClass="center"
                    inputDisable={this.state.inputDisable}
                    disable={this.state.disable}
                    onChange={value => {this.setState({ value: value });console.log(value)}}
                />
                <h3>受控属性</h3>
                <ul className="yo-list">
                    <li className="item">
                        <div className="mark flex">步长(大于0)</div>
                        <Number
                            min={0}
                            value={this.state.step}
                            dotNum={2}
                            onChange={val => this.change(val, 'step')}
                        />
                    </li>
                    <li className="item">
                        <div className="mark flex">小数位数(0-20)</div>
                        <Number
                            min={0}
                            value={this.state.dotNum}
                            max={20}
                            onChange={val => this.change(val, 'dotNum')}
                        />
                    </li>
                    <li className="item">
                        <div className="mark flex">最小值</div>
                        <Number
                            min={-1}
                            value={this.state.min}
                            max={2}
                            onChange={val => this.change(val, 'min')}
                            inputDisable={true}
                        />
                    </li>
                    <li className="item">
                        <div className="mark flex">最大值</div>
                        <Number
                            min={10}
                            value={this.state.max}
                            max={12}
                            onChange={val => this.change(val, 'max')}
                            inputDisable={true}
                        />
                    </li>
                    <li className="item">
                        <div className="mark flex">输入框不可用</div>
                        <Switch
                            checked={this.state.inputDisable}
                            onChange={inputDisable => {
                                this.setState({
                                    inputDisable,
                                })
                            }}
                        />
                    </li>
                    <li className="item">
                        <div className="mark flex">组件不可用</div>
                        <Switch
                            checked={this.state.disable}
                            onChange={disable => {
                                this.setState({
                                    disable,
                                })
                            }}
                        />
                    </li>
                </ul>
            </Page>
        )
    }
}

ReactDOM.render(<Demo/>, document.getElementById('content'));
