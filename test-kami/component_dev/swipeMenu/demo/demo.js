import SwipeMenu from '../src/';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class SwipeMenuDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    }

    render() {
        const action = [
            {
                content: '详情',
                className: 'detail',
                tap: () => console.log('click detail'),
            },
            {
                content: '删除',
                className: 'delete',
                tap: () => console.log('click delete'),
            }
        ];
        return (
            <div>
                <SwipeMenu
                    action={action}
                    extraClass='demo'
                >
                    <p>这是默认的swipeMenu例子(left)</p>
                </SwipeMenu>
                <SwipeMenu
                    action={action}
                    extraClass='demo' direction='right'
                >
                    <p>这是left侧action例子(right)</p>
                </SwipeMenu>
                <SwipeMenu extraClass='demo' disable>
                    <p>disable例子</p>
                </SwipeMenu>
            </div>
        )
    }
}

ReactDOM.render(<SwipeMenuDemo />, document.getElementById('content'));
