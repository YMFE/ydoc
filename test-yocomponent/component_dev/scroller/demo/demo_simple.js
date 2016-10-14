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
            <div>
                <Scroller simple={true} extraClass="scroller_wrapper">
                    { this.state.content.map((item, index) => <div className="item" style={{backgroundColor: item}} key={index}>{index}</div>) }
                </Scroller>
                <Scroller simple={true} extraClass="scroller_wrapper" scrollX={true} scrollY={false}>
                    { this.state.content.map((item, index) => <div className="item_vertical" style={{backgroundColor: item}} key={index}>{index}</div>) }
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
