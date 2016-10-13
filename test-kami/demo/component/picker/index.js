import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import Scroller from '../../../component_dev/scroller/src';
import Picker from '../../../component_dev/picker/src';
import Switch from '../../../component_dev/switch/src';
import Number from '../../../component_dev/number/src';
import ActionSheet from '../../../component_dev/actionsheet/src';
import '../../../component_dev/common/touchEventSimulator';
const DIGIT_TO_CHN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
import './style.scss';

class PickerDemo extends Component {

    getOptions(size) {
        return new Array(size).fill(1).map((num, index)=>({value: index, text: DIGIT_TO_CHN[index]}));
    }

    constructor() {
        super();
        this.state = {
            value1: 3,
            value2: 7,
            pickerOption: this.getOptions(10),
            actionSheetPickerOption: this.getOptions(10),
            picker3Open: false,
            height: 200,
            looped: true,
            showUnit: true
        };
    }

    render() {
        return (
            <Page title="Picker Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <Scroller extraClass="scroller">
                    <ul className="yo-list">
                        <li className="item">
                            <label className="prop-name">当前选中的值(value):</label>
                            <Number
                                min={0}
                                max={9}
                                value={this.state.value1}
                                onChange={(val)=> {
                                    this.setState({value1: val})

                                }}
                                inputDisable={true}
                            />
                        </li>
                        <li className="item">
                            <label className="prop-name">循环Picker(looped):</label>
                            <Switch checked={this.state.looped} onChange={val=>this.setState({looped: val})}/>
                        </li>
                        <li className="item">
                            <label className="prop-name">组件高度(height):</label>
                            <Number
                                value={this.state.height}
                                min={100}
                                max={200}
                                step={10}
                                inputDisable={true}
                                onChange={val=>this.setState({height: val})}
                            />
                        </li>
                        <li className="item">
                            <label className="prop-name">显示单位(unit):</label>
                            <Switch checked={this.state.showUnit} onChange={val=>this.setState({showUnit: val})}/>
                        </li>
                    </ul>
                    <div className="picker-wrap">
                        <Picker
                            options={this.state.pickerOption}
                            value={this.state.value1}
                            onChange={(opt)=> {
                                this.setState({value1: opt.value});
                            }}
                            looped={this.state.looped}
                            height={this.state.height}
                            unit={this.state.showUnit ? '单位' : null}
                        />
                    </div>
                    <button
                        className="yo-btn open-modal"
                        onTouchTap={()=> {
                            this.setState({picker3Open: true})
                        }}
                    >
                        与ActionSheet一起使用,点我打开
                    </button>
                    <ActionSheet
                        show={this.state.picker3Open}
                        onMaskTap={()=> {
                            this.setState({picker3Open: false});
                        }}
                    >
                        <h4>将Picker和ActionSheet结合使用</h4>
                        <Picker
                            height={250}
                            options={this.state.actionSheetPickerOption}
                            onChange={(opt)=> {
                                this.setState({value2: opt.value});
                            }}
                            value={this.state.value2}
                            unit="数字"
                        />
                    </ActionSheet>
                </Scroller>
            </Page>
        );
    }
}

ReactDOM.render(<PickerDemo/>, document.getElementById('content'));