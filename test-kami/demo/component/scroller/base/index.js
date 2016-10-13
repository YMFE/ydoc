import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page';
import Scroller from '../../../../component_dev/scroller/src';
import './index.scss';
import '../../../../component_dev/common/touchEventSimulator';

class ScrollerDemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: this.getRandomColors(20),
        };
    }

    getRandomColors(num) {
        const _color = [];
        for (let j = 0; j < num; j++) {
            const letters = '3456789ABC'.split('');
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 10)];
            }
            _color.push(color);
        }

        return _color;
    }

    render() {
        return (
            <Page
                title="Scroller:基础用法"
                extraClass="yo-flex"
                onLeftPress={() => { location.href = '../index.html'; }}
            >
                <div className="title">纵向滚动：</div>
                <div className="flex">
                    <Scroller extraClass="scroller">
                        <div className="yo-list">
                        {
                            this.state.dataSource.map((item, index) =>
                                <div className="item" style={{ color: item }} key={index}>
                                    <span style={{ backgroundColor: item }}>{index}</span>
                                    {Math.random()}
                                </div>
                            )
                        }
                        </div>
                    </Scroller>
                </div>
                <div className="title">横向滚动：</div>
                <div className="flex">
                    <Scroller extraClass="scroller" scrollX={true} scrollY={false}>
                        <div className="horizontal_list">
                        {
                            this.state.dataSource.map((item, index) =>
                                <div className="item" style={{ color: item }} key={index}>
                                    <div className="index" style={{ backgroundColor: item }}>{index}</div>
                                    <span className="content">{Math.random()}</span>
                                </div>
                            )
                        }
                        </div>
                    </Scroller>
                </div>

            </Page>
        );
    }
}

ReactDOM.render(<ScrollerDemo />, document.getElementById('content'));
