import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page';
import List from '../../../../component_dev/list/src';
import ToolTip from '../../../../component_dev/tooltip/src';
import {getRandomDataSource} from '../common/baseUtils';
import '../../../../component_dev/common/touchEventSimulator';

class ListBase extends Component {

    constructor() {
        super();
        this.state = {
            dataSource: getRandomDataSource(25)
        };
    }

    refresh() {
        this.setState({dataSource: getRandomDataSource(25)});
    }

    fetch(ds) {
        this.setState({dataSource: ds.concat(getRandomDataSource(15))});
    }

    render() {
        return (
            <Page title="List:基础用法" onLeftPress={()=>location.href="../index.html"}>
                <List
                    ref="list"
                    dataSource={this.state.dataSource}
                    renderItem={(item, i)=><div>{i + ':' + item.text}</div>}
                    infinite={true}
                    infiniteSize={30}
                    usePullRefresh={true}
                    onRefresh={()=> {
                        setTimeout(()=> {
                            this.refresh();
                            this.refs.list.stopRefreshing(true);
                        }, 500);
                    }}
                    useLoadMore={true}
                    onLoad={(ds)=> {
                        setTimeout(()=> {
                            this.fetch(ds);
                            this.refs.list.stopLoading(true);
                        }, 500);
                    }}
                    extraClass="custom-container-class-name"
                    itemExtraClass={(item, i)=> {
                        return 'item ' + i;
                    }}
                    onItemTap={(item, i, ds)=> {
                        ToolTip.show('item' + i + ' clicked.', 2000);
                    }}
                />
            </Page>
        );
    }
}

ReactDOM.render(<ListBase/>, document.getElementById('content'));