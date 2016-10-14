/**
 * @author zongze.li
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import './main.scss';
import DateTimePicker from '../../../component_dev/datetimepicker/src';

import '../../../component_dev/common/touchEventSimulator';

class Menu extends Component {

    constructor() {
        super();
        this.state = {
            pageNow: 1,
            value: '2000-9-30',
        };
    }
    updateChange(pageNow) {
        this.setState({
            pageNow
        });
    }
    render() {
        return (
            <Page title="DateTimePicker Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <DateTimePicker
                    range={['2000-07-28', '2016-09-10']}
                    value={this.state.value}
                    unitsAside={['年', '月', '日']}
                    unitsInline={['年', '月', '日']}
                    dateOrTime={"date"}
                    onChange={value => {
                        console.log('value', value);
                        this.setState({ value })
                    }}
                />
                <h3>功能展示</h3>
                <ul className="yo-list">
                    <li className="item"><a href="./controlAttrs/index.html">受控属性总览</a></li>
                    <li className="item"><a href="./example/index.html">使用场景展示</a></li>
                </ul>
            </Page>
        );
    }
}

ReactDOM.render(<Menu/>, document.getElementById('content'));
