/**
 * Created by Ellery1 on 16/9/12.
 */
import '../../../component_dev/common/touchEventSimulator';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import Grouplist from '../../../component_dev/grouplist/src';
import ToolTip from '../../../component_dev/tooltip/src';
import {getRandomDataSource} from '../list/common/baseUtils';
import './style.scss';

const DIGIT_TO_CHN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
class GrouplistDemo extends Component {

    static guid = -1;

    constructor() {
        super();
        this.state = {
            dataSource: this.renderDataSource(getRandomDataSource(500))
        };
    }

    renderDataSource(dataSource) {
        return dataSource.map((item, index)=> {
            return {
                groupKey: index < 5 ? 'notGrouped' : parseInt(item.text / 10, 10),
                text: index < 5 ? ('没有被分组的元素' + item.text) : item.text,
                key: ++GrouplistDemo.guid
            };
        });
    }

    render() {
        return (
            <Page title='Grouplist Demo' onLeftPress={()=>location.href = '../index/index.html'}>
                <Grouplist
                    ref='grouplist'
                    dataSource={this.state.dataSource}
                    offsetY={-220}
                    infinite={true}
                    itemHeight={44}
                    //注意:没有指定高度的无穷分组列表无法使用indexNavBar,这个属性设置为true也不会生效
                    showIndexNavBar={true}
                    //同上
                    renderIndexNavBarItem={(groupKey)=>DIGIT_TO_CHN[groupKey]}
                    onIndexNavBarItemHover={(groupKey)=> {
                        ToolTip.show(DIGIT_TO_CHN[groupKey], 2000);
                    }}
                    renderGroupItem={(item, index)=><div>{index + ':' + item.text}</div>}
                    renderGroupTitle={(groupKey)=>DIGIT_TO_CHN[groupKey]}
                    groupTitleExtraClass={title=>'group-title label demo-group-title'}
                    onItemTap={(item, index)=>ToolTip.show('tapping:' + item.text, 2000)}
                    sort={(a, b)=> {
                        return a - b;
                    }}
                    usePullRefresh={true}
                    onRefresh={()=> {
                        setTimeout(()=> {
                            this.setState({dataSource: this.renderDataSource(getRandomDataSource(500))})
                            this.refs.grouplist.stopRefreshing(true);
                        }, 500);
                    }}
                />
            </Page>
        );
    }
}

ReactDOM.render(<GrouplistDemo/>, document.getElementById('content'));
