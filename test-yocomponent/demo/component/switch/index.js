/**
 *  @author eva.li
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import Switch from '../../../component_dev/switch/src/';
import '../../../component_dev/common/touchEventSimulator';
import './main.scss';

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            switch1: true,
            switch2: false,
            switch3: true
        };
    }

    getValue(name, value){
        this.setState(function(state){
            state[name] = value;
            return state;
        })
    }
    render() {
        return (
          <Page title="Switch Demo">
            <ul className="yo-list">
              <li className="item">
                <div className="flex">默认开启</div>
                <Switch
                  checked={this.state.switch1}
                  onChange={(value) => { this.getValue('switch1', value); }}
                />
              </li>
              <li className="item">
                <div className="flex">默认关闭</div>
                <Switch
                  checked={this.state.switch2}
                  onChange={(value) => { this.getValue('switch2', value); }}
                />
              </li>
              <li className="item">
                <div className="flex">禁止操作的已开启开关</div>
                <Switch disabled />
              </li>
              <li className="item">
                <div className="flex">禁止操作的已关闭开关</div>
                <Switch disabled checked={false} />
              </li>
              <li className="item">
                <div className="flex">更改avtive颜色</div>
                <Switch
                  checked={this.state.switch3}
                  onChange={(value) => { this.getValue('switch3', value); }}
                  activeColour="#43cee6"
                  extraClass="yo-switch-blue"
                />
              </li>
            </ul>
          </Page>
        );
    }
}


ReactDOM.render(<Demo/>, document.getElementById('content'));
