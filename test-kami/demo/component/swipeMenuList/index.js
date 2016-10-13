import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import SwipeMenuList from '../../../component_dev/swipeMenuList/src';
import Page from '../common/page';
import ToolTip from '../../../component_dev/tooltip/src';
import {getRandomDataSource} from '../list/common/baseUtils';
import '../../../component_dev/common/touchEventSimulator';
import './style.scss';

class SwipeMenuListDemo extends Component {

    static guid = -1;

    append(origDs = this.state.dataSource) {
        this.setState({
            dataSource: origDs.concat(this.renderDataSource(getRandomDataSource(20)))
        });
    }

    refresh() {
        this.setState({dataSource: this.renderDataSource(getRandomDataSource(20))})
    }

    deleteItem(item) {
        const newDataSource = this.state.dataSource.filter((it, index)=>it.key !== item.key);

        if (newDataSource.length < this.page * 20) {
            this.append(newDataSource);
        }
        else {
            this.setState({
                dataSource: newDataSource
            });
        }
    }

    renderDataSource(ds) {
        const self = this;
        return ds.map((item, i)=> {
            return {
                ...item,
                key: ++SwipeMenuListDemo.guid,
                randomHeight: parseInt(10 + Math.random() * 40, 10),
                action: [
                    {
                        content: '点我',
                        tap(item, i,swipeMenu){
                            ToolTip.show(item.text, 1000);
                            swipeMenu.close();
                        }
                    },
                    {
                        content: '删除',
                        tap(item, i, swipeMenu){
                            self.deleteItem(item);
                        }
                    }
                ]
            };
        });
    }

    constructor() {
        super();
        const self = this;
        const testData = this.renderDataSource(getRandomDataSource(20));
        this.page = 1;
        this.state = {
            dataSource: testData
        };
    }

    render() {
        return (
            <Page title="SwipeMenuList Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <SwipeMenuList
                    offsetY={-100}
                    ref="swipemenulist"
                    dataSource={this.state.dataSource}
                    infinite={true}
                    infiniteSize={30}
                    renderMenuContent={(item, i)=>(
                        <div style={{height: item.randomHeight}}>
                            {'第' + i + '个item:' + item.text}
                        </div>
                    )}
                    usePullRefresh={true}
                    onRefresh={()=> {
                        setTimeout(()=> {
                            this.refresh();
                            this.refs.swipemenulist.stopRefreshing(true);
                        }, 500);
                    }}
                    useLoadMore={true}
                    onLoad={()=> {
                        setTimeout(()=> {
                            this.append();
                            ++this.page;
                            this.refs.swipemenulist.stopLoading(true);
                        }, 500);
                    }}
                />
            </Page>
        );
    }
}

ReactDOM.render(<SwipeMenuListDemo/>, document.getElementById('content'));