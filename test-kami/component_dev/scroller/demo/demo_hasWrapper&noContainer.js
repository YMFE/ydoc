'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Scroller from '../src/index';

class ScrollerDemo extends Component {
    constructor(props){
        super(props);

        this.state = {
            contentOffset: {
                x: 0,
                y: 0,
            },
            content: getRandomColors(30),
        };
    }

    render() {
        return (
            <div className="container">
                <Scroller extraClass={'scroller_wrapper'}>
                    <ul>
                    { this.state.content.map((item, index) => <li className="item" style={{backgroundColor: item}} key={index}>{index}</li>) }
                    </ul>
                </Scroller>
                <Scroller
                    extraClass={'scroller_wrapper'}
                    scrollX={true}
                    scrollY={false}
                >
                    <ul className="scroller_container_horizental">
                        { this.state.content.map((item, index) => <li className="item_vertical" style={{backgroundColor: item}} key={index}>{index}</li>) }
                    </ul>
                </Scroller>
            </div>
        );
    }
}

function getRandomColors(num) {
    var _color = [];
    for(var j = 0; j < num; j++) {
        var letters = '3456789ABC'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 10)];
        }
        _color.push(color);
    }

    return _color;
}

ReactDOM.render(<ScrollerDemo />, document.getElementById('content'));
