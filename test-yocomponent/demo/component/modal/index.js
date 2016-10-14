import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import '../../../component_dev/common/tapEventPluginInit';
import Page from '../common/page';
import Scroller from '../../../component_dev/scroller/src';
import Modal from '../../../component_dev/modal/src';
import ActionSheet from '../../../component_dev/actionsheet/src';
import Picker from '../../../component_dev/picker/src';
import Number from '../../../component_dev/number/src';
import '../../../component_dev/common/touchEventSimulator';
import './style.scss';

class ModalDemo extends Component {

    constructor() {
        super();
        this.state = {
            show: false,
            align: 'center',
            animation: 'fade',
            width: 200,
            height: 200,
            offsetX: 0,
            offsetY: 0,
            maskOffsetX: 0,
            maskOffsetY: 0,
            pickerShowStatus: {
                align: false,
                ani: false,
                width: false,
                height: false
            }
        }
    }

    togglePicker(name, status) {
        this.setState({
            pickerShowStatus: Object.assign({}, this.state.pickerShowStatus, {[name]: status})
        });
    }

    render() {
        return (
            <Page title="Modal Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <Scroller extraClass="scroller">
                    <div>
                        <ul className="yo-list">
                            <li className="item">
                                <label>位置(align):</label>
                                <button onTouchTap={()=>this.togglePicker('align', true)}
                                        className="yo-btn yo-btn-pri">{this.state.align}</button>
                            </li>
                            <li className="item">
                                <label>动画(animation):</label>
                                <button onTouchTap={()=>this.togglePicker('ani', true)}
                                        className="yo-btn yo-btn-pri">{this.state.animation}</button>
                            </li>
                            <li className="item">
                                <label>内容区宽度(width,auto为自适应宽度):</label>
                                <Number
                                    min={100}
                                    max={300}
                                    step={10}
                                    value={this.state.width}
                                    inputDisable={true}
                                    onChange={value => this.setState({width: value})}
                                />
                            </li>
                            <li className="item">
                                <label>内容区高度(height,auto为自适应高度):</label>
                                <Number
                                    min={100}
                                    max={300}
                                    step={10}
                                    value={this.state.height}
                                    inputDisable={true}
                                    onChange={value => this.setState({height: value})}
                                />
                            </li>
                            <li className="item">
                                <label>内容区X轴偏移(contentOffset[0]):</label>
                                <Number
                                    min={-200}
                                    max={200}
                                    step={20}
                                    value={this.state.offsetX}
                                    inputDisable={true}
                                    onChange={value => this.setState({offsetX: value})}
                                />
                            </li>
                            <li className="item">
                                <label>内容区Y轴偏移(contentOffset[1]):</label>
                                <Number
                                    min={-200}
                                    max={200}
                                    step={20}
                                    value={this.state.offsetY}
                                    inputDisable={true}
                                    onChange={value => this.setState({offsetY: value})}
                                />
                            </li>
                            <li className="item">
                                <label>遮罩层X偏移(maskOffset[0]):</label>
                                <Number
                                    min={-200}
                                    max={200}
                                    step={20}
                                    value={this.state.maskOffsetX}
                                    inputDisable={true}
                                    onChange={value => this.setState({maskOffsetX: value})}
                                />
                            </li>
                            <li className="item">
                                <label>遮罩层Y偏移(maskOffset[1]):</label>
                                <Number
                                    min={-200}
                                    max={200}
                                    step={20}
                                    value={this.state.maskOffsetY}
                                    inputDisable={true}
                                    onChange={value => this.setState({maskOffsetY: value})}
                                />
                            </li>
                        </ul>
                        <button onTouchTap={()=>this.setState({show: true})} className="yo-btn open-modal">
                            打开弹层
                        </button>
                    </div>
                </Scroller>
                <Modal
                    onMaskTap={()=>this.setState({show: false})}
                    show={this.state.show}
                    align={this.state.align}
                    animation={this.state.animation}
                    width={this.state.width}
                    height={this.state.height}
                    contentOffset={[this.state.offsetX, this.state.offsetY]}
                    maskOffset={[this.state.maskOffsetX, this.state.maskOffsetY]}
                >
                    <div>点击蒙层以关闭Modal</div>
                </Modal>
                <ActionSheet
                    show={this.state.pickerShowStatus.align}
                    onMaskTap={()=>this.togglePicker('align', false)}
                >
                    <Picker
                        height={200}
                        options={[{value: 'top'}, {value: 'bottom'}, {value: 'center'}, {value: 'left'}, {value: 'right'}]}
                        value={this.state.align}
                        onChange={(opt)=>this.setState({align: opt.value})}
                    />
                </ActionSheet>
                <ActionSheet
                    show={this.state.pickerShowStatus.ani}
                    onMaskTap={()=>this.togglePicker('ani', false)}
                >
                    <Picker
                        options={[{value: 'fade'}, {value: 'none'}]}
                        value={this.state.animation}
                        looped={false}
                        onChange={(opt)=>this.setState({animation: opt.value})}
                    />
                </ActionSheet>
            </Page>
        );
    }
}

ReactDOM.render(<ModalDemo/>, document.getElementById('content'));