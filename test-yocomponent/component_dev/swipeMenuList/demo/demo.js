import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import SwipeMenuList from '../src';
import '../../common/touchEventSimulator';

function getRandomList(size) {
    return new Array(size).fill(1).map(num=>parseInt(Math.random() * 100));
}

function getRandomDataSource(size) {
    return getRandomList(size).map(num=>({text: num}));
}

class SwipeMenuListDemo extends Component {

    constructor() {
        super();
        const self = this;
        const testData = getRandomDataSource(100).map((item, i)=>({
            ...item,
            id: i,
            randomHeight: parseInt(10 + Math.random() * 40, 10),
            action: [
                {
                    content: '删除',
                    tap(item, i, swipeMenu){
                        //console.log(i,swipeMenu)
                        self.setState({
                            dataSource: self.state.dataSource.filter((it, index)=>it.id !== item.id)
                        });
                    }
                }
            ]
        }));
        this.state = {
            dataSource: testData
        };
    }

    render() {

        return (
            <SwipeMenuList
                dataSource={this.state.dataSource}
                infinite={true}
                infiniteSize={30}
            />
        );
    }
}

ReactDOM.render(<SwipeMenuListDemo/>, document.getElementById('content'));
