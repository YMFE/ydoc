/**
 * Created by Ellery1 on 16/9/6.
 */
import React, {Component} from 'react';
import Page from '../common/page';
import ReactDOM from 'react-dom';
import List from '../../../component_dev/list/src';
import '../../../component_dev/common/touchEventSimulator';

const dataSource = [
    {
        text: '基础用法',
        link: './base/index.html',
        key: 0
    },
    {
        text: 'Infinite模式(指定高度)',
        link: './infinite_mode_with_height/index.html',
        key: 1
    },
    {
        text: 'Infinite模式(不指定高度)',
        link: './infinite_mode_without_height/index.html',
        key: 2
    }
];

class ListIndex extends Component {

    constructor() {

        super();
    }

    render() {

        return (
            <Page title="List Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <List
                    dataSource={dataSource}
                    onItemTap={item=>location.href = item.link}
                />
            </Page>
        );
    }
}

ReactDOM.render(<ListIndex/>, document.getElementById('content'));