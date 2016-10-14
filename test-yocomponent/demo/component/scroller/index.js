/**
 * Created by Ellery1 on 16/9/6.
 */
import React, { Component } from 'react';
import Page from '../common/page';
import ReactDOM from 'react-dom';
import List from '../../../component_dev/list/src';
import '../../../component_dev/common/touchEventSimulator';

const dataSource = [
    {
        text: '基础用法',
        link: './base/index.html'
    }, {
        text: '下拉刷新 & 加载更多',
        link: './refresh&load/index.html'
    }, {
        text: '滚动特性 & 滚动事件',
        link: './scroll/index.html'
    }
];

class ScrollerIndex extends Component {

    constructor() {
        super();
    }

    render() {
        return (
          <Page title="Scroller Demo" onLeftPress={()=>location.href = '../index/index.html'}>
            <List dataSource={dataSource} onItemTap={item => location.href = item.link}/>
          </Page>
        );
    }
}

ReactDOM.render(<ScrollerIndex/>, document.getElementById('content'));
