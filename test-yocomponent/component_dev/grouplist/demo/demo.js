import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import GroupList from '../src'
let id = -1;
const testData = new Array(100).fill(0)
    .map((item, i)=>({
        text: Math.random() * 100,
        groupKey: i < 5 ? 'notGrouped' : i % 10,
        id: ++id
    }));

class GroupListDemo extends Component {

    constructor(props) {

        super(props);
        this.state = {
            dataSource: testData,
            sort: (a, b)=>a - b,
            infinite: true
        };
    }

    deleteItem(item, ds) {

        this.setState({
            dataSource: ds.filter(it=>it._guid !== item._guid),
            sort: (a, b)=>b - a
        });
    }

    render() {

        return (
            <GroupList
                usePullRefesh={true}
                offsetY={-500}
                ref="grouplist"
                dataSource={this.state.dataSource}
                infinite={true}
                showIndexNavBar={true}
                onItemTap={(item, index, ds)=>this.deleteItem(item, ds)}
                sort={this.state.sort}
                itemExtraClass={(item, index)=>'item ' + index}
                groupTitleExtraClass={(groupKey)=> {
                    return 'group-title label ' + groupKey;
                }}
            />
        );
    }
}

ReactDOM.render(<GroupListDemo/>, document.getElementById('content'));

