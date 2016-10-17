/**
 * Created by Ellery1 on 16/9/8.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page';
import List from '../../../../component_dev/list/src';
import SwipeMenu from '../../../../component_dev/swipeMenu/src';
import {getRandomDataSource} from '../common/baseUtils';
import './style.scss';
import '../../../../component_dev/common/touchEventSimulator';

class UseWithSwipeMenuDemo extends Component {

    constructor() {
        super();
        this.ds = getRandomDataSource(100).map((item, i)=>({
            ...item,
            id: i,
            randomHeight: parseInt(10 + Math.random() * 40, 10)
        }));
        this.swipMenuList = [];
        this.state = {
            dataSource: this.ds,
            openIndex: -1
        }
    }

    deleteItem(index, i) {
        this.ds = this.ds.filter((item, i)=>item.id !== index);
        this.setState({
            dataSource: this.ds
        });
        this.swipMenuList[i].close(true);
    }

    disableSwipeMenu(index) {
        this.shouldUpdate = true;
        this.setState({openIndex: index});
    }

    enableSwipeMenu(index) {
        if (this.state.openIndex === index) {
            this.shouldUpdate = true;
            this.setState({openIndex: -1});
        }
    }

    componentDidMount() {
        this.shouldUpdate = false;
    }

    componentDidUpdate() {
        this.shouldUpdate = false;
    }

    render() {
        const self = this;
        this.shouldUpdate = true;
        return (
            <Page title="List:与SwipeMenu一起使用">
                <List
                    dataSource={this.state.dataSource}
                    infinite={true}
                    infiniteSize={20}
                    shouldItemUpdate={ret=> {
                        if (this.shouldUpdate) {
                            ret = true;
                        }
                        return ret;
                    }}
                    renderItem={(item, i)=> {
                        return (
                            <SwipeMenu
                                ref={component=> {
                                    if (component) {
                                        this.swipMenuList[i] = component;
                                    }
                                }}
                                disabled={this.state.openIndex !== -1 && i !== this.state.openIndex}
                                onOpen={()=> {
                                    this.disableSwipeMenu(i);
                                }}
                                onClose={()=> {
                                    this.enableSwipeMenu(i);
                                }}
                                action={[
                                    {
                                        content: '删除',
                                        tap(){
                                            self.deleteItem(item.id, i);
                                        }
                                    }
                                ]}
                            >
                                <div style={{height: item.randomHeight}}>
                                    {'item:' + item.id + ' 向左划试试'}
                                </div>
                            </SwipeMenu>
                        );
                    }}
                    itemExtraClass="item item-wrap no-padding block"
                    itemActiveClass={null}
                    onItemTap={()=> {
                        const swipeMenu = this.swipMenuList[this.state.openIndex];
                        if (swipeMenu) swipeMenu.close();
                        this.shouldUpdate = true;
                        this.setState({openIndex: -1});
                    }}
                />
            </Page>
        );
    }
}

ReactDOM.render(<UseWithSwipeMenuDemo/>, document.getElementById('content'));