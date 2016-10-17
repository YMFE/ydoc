import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import ActionSheet from '../../../component_dev/actionsheet/src';
import Number from '../../../component_dev/number/src';
import './style.scss';

class ActionSheetDemo extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            height: 250,
            duration: 200,
            maskOffsetX: 0,
            maskOffsetY: 0
        };
    }

    render() {
        return (
            <Page title="ActionSheet Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <ul className="yo-list">
                    <li className="item">
                        <label className="prop-name">内容高度(height):</label>
                        <Number
                            min={200}
                            max={400}
                            step={10}
                            value={this.state.height}
                            onChange={val=>this.setState({height: val})}
                        />
                    </li>
                    <li className="item">
                        <label className="prop-name">动画持续时间(duration):</label>
                        <Number
                            min={200}
                            max={1000}
                            step={100}
                            value={this.state.duration}
                            onChange={val=>this.setState({duration: val})}
                        />
                    </li>
                    <li className="item">
                        <label className="prop-name">遮罩层偏移X(maskOffset[0]):</label>
                        <Number
                            min={0}
                            max={200}
                            step={50}
                            value={this.state.maskOffsetX}
                            onChange={val=>this.setState({maskOffsetX: val})}
                        />
                    </li>
                    <li className="item">
                        <label className="prop-name">遮罩层偏移Y(maskOffset[1]):</label>
                        <Number
                            min={0}
                            max={100}
                            step={20}
                            value={this.state.maskOffsetY}
                            onChange={val=>this.setState({maskOffsetY: val})}
                        />
                    </li>
                </ul>
                <button onTouchTap={()=> {
                    this.setState({show: true})
                }} className="yo-btn yo-btn-m yo-btn-stacked">
                    打开ActionSheet
                </button>
                <ActionSheet
                    show={this.state.show}
                    height={this.state.height}
                    duration={this.state.duration}
                    maskOffset={[this.state.maskOffsetX, this.state.maskOffsetY]}
                    onMaskTap={()=> {
                        this.setState({show: false})
                    }}
                >
                    <p style={{padding: '1em'}}>
                        ActionSheet是一个容器组件,许多组件都可以和ActionSheet配合使用,例如Picker,Suggest等等.
                        把这些组件作为ActionSheet的内容即可。<br/>
                        内容区的高度并不是必须的,如果不传高度,会自适应内容的高度
                    </p>
                </ActionSheet>
            </Page>
        );
    }
}

ReactDOM.render(<ActionSheetDemo/>, document.getElementById('content'));