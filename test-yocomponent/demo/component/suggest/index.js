/**
 * Created by Ellery1 on 16/9/19.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import List from '../../../component_dev/list/src';
import '../../../component_dev/common/touchEventSimulator';

const listData = [
    {
        text: '基础用法',
        link: './base/index.html'
    },
    {
        text: '带弹层的Suggest',
        link: './use_with_actionsheet/index.html'
    },
    {
        text: '一个完整的城市选择器示例',
        link: './city_select_example/index.html'
    }
];

class SuggestDemoIndex extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <Page title="Suggest Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <List
                    dataSource={listData}
                    onItemTap={(item)=>location.href = item.link}
                />
            </Page>
        );
    }
}

ReactDOM.render(<SuggestDemoIndex/>, document.getElementById('content'));
