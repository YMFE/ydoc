import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page';
import Switch from '../../../../component_dev/switch/src';
import Modal from '../../../../component_dev/modal/src';
import Scroller from '../../../../component_dev/scroller/src';
import './index.scss';
import '../../../../component_dev/common/touchEventSimulator';

class ScrollerDemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: this.getRandomColors(20),
            scrollevent: false,
            enabled: true,
            bounce: true,
            momentum: true,
            showOnScrollNotice: false,
            showScrollToNotice: false,
            offsetX: null,
            offsetY: null,
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
            <Page title="滚动特性 & 滚动事件" extraClass="yo-flex" onLeftPress={()=>location.href="../index.html"}>
                <div className="yo-list operator">
                    <div className="item">
                        <p className="flex">允许滚动</p>
                        <Switch
                            checked={this.state.enabled}
                            onChange={(value) => {
                                this.setState({ enabled: value });
                            }}
                        />
                    </div>
                    <div className="item">
                        <p className="flex">弹性滚动</p>
                        <Switch
                            checked={this.state.bounce}
                            onChange={(value) => {
                                this.setState({ bounce: value });
                            }}
                        />
                    </div>
                    <div className="item">
                        <p className="flex">惯性滚动</p>
                        <Switch
                            checked={this.state.momentum}
                            onChange={(value) => {
                                this.setState({ momentum: value });
                            }}
                        />
                    </div>
                    <div className="item">
                        <p className="flex">监听滚动事件
                            <i
                                className="yo-ico yo-icon-red"
                                onTouchTap={() => {
                                    this.setState({
                                        showOnScrollNotice: true,
                                    });
                                }}
                            >&#xf067;</i>
                        </p>
                        <Switch
                            checked={this.state.scrollevent}
                            onChange={(value) => {
                                this.setState({ scrollevent: value });
                            }}
                        />
                    </div>
                    <div className="item">
                        <p className="flex">滚动到某一位置
                            <i
                                className="yo-ico yo-icon-red"
                                onTouchTap={() => {
                                    this.setState({
                                        showScrollToNotice: true,
                                    });
                                }}
                            >&#xf067;</i>
                        </p>
                        <div
                            className="yo-btn yo-btn-s yo-btn-light"
                            onTouchTap={() => {
                                this.refs.scroller.scrollTo(0, - Math.random() * 500, 600);
                            }}
                        >滚动</div>
                    </div>
                </div>
                <div className="yo-tooltip yo-tooltip-notice">
                    <div> x: {this.state.offsetX} y: {this.state.offsetY}</div>
                </div>
                <Scroller
                    ref="scroller"
                    bounce={this.state.bounce}
                    enabled={this.state.enabled}
                    momentum={this.state.momentum}
                    onScroll={this.state.scrollevent ? (evt) => this.setState({
                        offsetX: evt.contentOffset.x,
                        offsetY: parseInt(evt.contentOffset.y, 10),
                    }) : null}
                    extraClass={'flex'}
                >
                    <div className="yo-list">
                    {
                        this.state.dataSource.map((item, index) =>
                            <div className="item" style={{ color: item }} key={index}>
                                <span style={{ backgroundColor: item }}>{index}</span>
                                {item}
                            </div>
                        )
                    }
                    </div>
                </Scroller>
                <Modal
                    contentExtraClass="modal-container"
                    onMaskTap={() => this.setState({ showOnScrollNotice: false })}
                    show={this.state.showOnScrollNotice}
                >
                    <p>Scroller 提供了 onScroll 回调来监听滚动事件。一旦设置了这个回调，会将 useTransition 属性强制设置为 false，会由此带来一定的性能牺牲。</p>
                </Modal>
                <Modal
                    contentExtraClass="modal-container"
                    onMaskTap={() => this.setState({ showScrollToNotice: false })}
                    show={this.state.showScrollToNotice}
                >
                    <p>Scroller 提供了 scrollTo 方法来滚动到某一位置。scrollTo 方法不仅可以配置滚动位置，还可以配置动画时间和动画函数。</p>
                </Modal>
            </Page>
        );
    }
}

ReactDOM.render(<ScrollerDemo />, document.getElementById('content'));
