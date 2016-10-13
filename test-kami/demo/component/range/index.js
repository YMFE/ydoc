/**
 * @author zongze.li
 */
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Page from '../common/page';
import RangeSlider from '../../../component_dev/range/src';
import './main.scss';
import '../../../component_dev/common/touchEventSimulator';

class Menu extends Component {

    constructor() {
        super();
        this.state = {
            pageNow: 1,
        };
    }
    updateChange(pageNow) {
        this.setState({
            pageNow
        });
    }
    render() {
        return (
            <Page title="Range Demo" onLeftPress={()=>location.href = '../index/index.html'}>
            <RangeSlider
                value={this.state.value}
                onChange={stateData => this.setState(stateData)}
            />
            <h3>功能展示</h3>
                <ul className="yo-list">
                    <li className="item"><a href="./controlAttrs/index.html">受控属性总览</a></li>
                    <li className="item"><a href="./example/index.html">样例示范</a></li>
                </ul>
            </Page>
        );
    }
}

ReactDom.render(<Menu/>, document.getElementById('content'));
