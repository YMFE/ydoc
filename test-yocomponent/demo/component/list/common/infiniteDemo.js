/**
 * Created by Ellery1 on 16/9/6.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page';
import List from '../../../../component_dev/list/src';
import DemoModel from './demoModel';
import DemoListItem from './demoListItem';
import './infiniteDemo.scss';

export default  class InfiniteDemo extends Component {

    constructor() {
        super();
        this.model = new DemoModel(10);
        this.state = {
            dataSource: this.model.dataSource,
            useLoadMore: true
        };
    }

    fetch() {
        const ret = this.model.fetch(10);

        if (!ret.allLoaded) {
            this.setState({
                dataSource: ret.ds
            });
        }
        else {
            this.setState({
                dataSource: ret.ds,
                useLoadMore: false
            });
        }

        return ret.allLoaded;
    }

    refresh() {
        this.setState({
            dataSource: this.model.refresh(),
            useLoadMore: true
        });
    }

    render() {
        const {itemHeight, isHeightFixed}=this.props;

        return (
            <Page
                title={isHeightFixed ? 'List: Infinite模式(确定高度)' : 'List: Infinite模式(不指定高度)'}
                onLeftPress={()=>location.href="../index.html"}
            >
                <List
                    ref="list"
                    dataSource={this.state.dataSource}
                    renderItem={item=><DemoListItem isHeightFixed={isHeightFixed} item={item}/>}
                    itemHeight={isHeightFixed ? itemHeight : null}
                    infiniteSize={5}
                    infinite={true}
                    usePullRefresh={true}
                    onRefresh={()=> {
                        setTimeout(()=> {
                            this.refresh();
                            this.refs.list.stopRefreshing(true);
                        }, 500);
                    }}
                    useLoadMore={this.state.useLoadMore}
                    onLoad={()=> {
                        setTimeout(()=> {
                            this.refs.list.stopLoading(!this.fetch());
                        }, 500);
                    }}
                    itemExtraClass={"demo-list-item"}
                    itemActiveClass={"demo-item-active"}
                    onListItemUpdate={(item)=> {
                        console.log('updating:' + item._index);
                    }}
                />
            </Page>
        );
    }
}
