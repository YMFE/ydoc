/**
 * Created by qingguo.xu on 16/9/13.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page.js';
import Number from '../../../component_dev/number/src/';
import Dialog from '../../../component_dev/dialog/src/';
import Picker from '../../../component_dev/picker/src/';
import ActionSheet from '../../../component_dev/actionsheet/src/';
import '../../../component_dev/common/touchEventSimulator';
import '../carousel/main.scss';
import './style.scss';

class Demo extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            title: 'title',
            content: 'content',
            okText: '确定',
            cancelText: '取消',
            position: 'center',
            animation: 'fade',
            contentOffsetY: 0,
            pickerShow1: false,
            pickerShow2: false,
        };
    }

    /**
     * @property change
     * @param e {Object} 事件对象
     * @param key {String}
     * @description onChange事件回调, 更新dialog的state
     */
    change(e, key) {
        this.state[key] = e.target.value;
        this.setState(this.state)
    }

    render() {
        return (
            <Page title="Dialog Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <h3>受控属性</h3>
                <ul className="yo-list">
                    <li className="item">
                        <div className="mark flex">title</div>
                        <input className="demo-input" value={this.state.title} onChange={e => this.change(e, 'title')}/>
                    </li>
                    <li className="item">
                        <div className="mark flex">content</div>
                        <input className="demo-input" value={this.state.content} onChange={e => this.change(e, 'content')}/>
                    </li>
                    <li className="item">
                        <div className="mark flex">okText</div>
                        <input className="demo-input" value={this.state.okText} onChange={e => this.change(e, 'okText')}/>
                    </li>
                    <li className="item">
                        <div className="mark flex">cancelText</div>
                        <input className="demo-input" value={this.state.cancelText} onChange={e => this.change(e, 'cancelText')}/>
                    </li>
                    <li className="item">
                        <div className="mark flex">Y轴偏移量(contentOffsetY)</div>
                        <Number
                            min={-10}
                            value={this.state.contentOffsetY}
                            max={100}
                            step={10}
                            onChange={val => this.setState({contentOffsetY: val})}
                        />
                    </li>
                    <li className="item">
                        <div className="mark flex">dialog显示位置</div>
                        <button className="yo-btn yo-btn-demo" onClick={() => this.setState({pickerShow1: true})}>{this.state.position}</button>
                    </li>
                    <li className="item">
                        <div className="mark flex">dialog显隐动画</div>
                        <button className="yo-btn yo-btn-demo" onClick={() => this.setState({pickerShow2: true})}>{this.state.animation ? 'fade' : 'none'}</button>
                    </li>
                </ul>
                <ActionSheet
                    show={this.state.pickerShow1}
                    height={150}
                    onMaskClick={()=>this.setState({pickerShow1: false})}
                >
                    <Picker
                        options={[{ value: 'top', text: 'top' }, { value: 'center', text: 'center' }, {
                            value: 'bottom',
                            text: 'bottom'
                        }]}
                        value={this.state.position}
                        looped={false}
                        onChange={val => {
                            this.setState({ position: val.value })
                        }}
                    />
                </ActionSheet>
                <ActionSheet
                    show={this.state.pickerShow2}
                    height={150}
                    onMaskClick={()=>this.setState({pickerShow2: false})}
                >
                    <Picker
                        options={[{ value: false, text: 'none' }, { value: 'fade', text: 'fade' }]}
                        value={this.state.animation}
                        looped={false}
                        onChange={val => {
                            this.setState({ animation: val.value })
                        }}
                    />
                </ActionSheet>
                <button className="yo-btn yo-btn-demo yo-btn-stacked btn-margin" onClick={()=>this.setState({ show: true })}>查看效果
                </button>
                <Dialog
                    show={this.state.show}
                    effect={this.state.animation}
                    title={this.state.title}
                    content={this.state.content}
                    contentOffset={[0, this.state.contentOffsetY]}
                    align={this.state.position}
                    okText={this.state.okText}
                    cancelText={this.state.cancelText}
                    onOk={() => {this.setState({ show: false })}}
                    onCancel={() => {this.setState({ show: false })}}
                />
            </Page>
        )
    }
}

ReactDOM.render(<Demo/>, document.getElementById('content'));