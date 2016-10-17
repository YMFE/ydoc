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
            <Page title="下拉刷新 & 加载更多" onLeftPress={() => location.href="../index.html"}>
                <Scroller
                    ref="scroller"
                    usePullRefresh
                    onRefresh={() => {
                        setTimeout(() => {
                            this.setState({
                                dataSource: this.getRandomColors(20),
                            });
                            this.refs.scroller.stopRefreshing(true);
                        }, 1000);
                    }}
                    useLoadMore
                    onLoad={() => {
                        setTimeout(() => {
                            this.setState({
                                dataSource: this.state.dataSource.concat(this.getRandomColors(20)),
                            });
                            this.refs.scroller.stopLoading(true);
                        }, 1000);
                    }}
                    extraClass={'scroller'}
                >
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
            </Page>
        );
    }
}

ReactDOM.render(<ScrollerDemo />, document.getElementById('content'));
