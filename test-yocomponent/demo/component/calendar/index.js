/**
 * Created by qingguo.xu on 16/9/12.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page.js';
import List from '../../../component_dev/list/src';
import "../carousel/main.scss";
import '../../../component_dev/common/touchEventSimulator';

class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Page title="Calendar Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <List
                    dataSource={[
                        {text: '基础用法展示', link: './default/index.html', key: 0},
                        {text: '自定义起始日期,入离店日期', link: './custom/index.html', key: 1},
                        {text: '只允许点击一次', link: './single/index.html', key: 2}
                    ]}
                    onItemTap={item=>location.href = item.link}
                />
            </Page>
        )
    }
}

ReactDOM.render(<Menu/>, document.getElementById('content'));