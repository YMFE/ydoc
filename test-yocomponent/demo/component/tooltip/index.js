/**
 * Created by qingguo.xu on 16/9/18.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import Number from '../../../component_dev/number/src/';
import Tooltip from '../../../component_dev/tooltip/src/';
import '../../../component_dev/common/touchEventSimulator';
import '../carousel/main.scss';
import '../dialog/style.scss';

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'tooltip demo',
            autoHideTime: 2000,
        };
    }

    change(value, key) {
        this.state[key] = value;
        this.setState(this.state);
    }

    render() {
        return (
            <Page title="Tooltip Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <ul className="yo-list">
                    <li className="item">
                        <div className="mark flex">content</div>
                        <input value={this.state.content} onChange={e => this.change(e.target.value, 'content')}/>
                    </li>
                    <li className="item">
                        <div className="mark flex">显示时间(ms)</div>
                        <Number
                            min={0}
                            value={this.state.autoHideTime}
                            step={100}
                            onChange={val => this.change(val, 'autoHideTime')}
                        />
                    </li>
                    <li className="item">
                        <div className="btn-container">
                            <button className="yo-btn yo-btn-demo"
                                    onClick={()=>Tooltip.show(this.state.content, this.state.autoHideTime)}>显示
                            </button >
                        </div>
                        <div className="btn-container">
                            <button className="yo-btn yo-btn-demo" onClick={()=>Tooltip.hide()}>隐藏</button>
                        </div>
                    </li>
                </ul>
            </Page>
        )
    }
}


ReactDOM.render(<Demo/>, document.getElementById('content'));