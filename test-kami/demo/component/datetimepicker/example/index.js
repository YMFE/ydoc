import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Page from '../../common/page';
import DateTimePicker from '../../../../component_dev/datetimepicker/src';
import '../../../../component_dev/common/touchEventSimulator';
import ActionSheet from '../../../../component_dev/actionsheet/src';
import Modal from '../../../../component_dev/modal/src';
import Scroller from '../../../../component_dev/scroller/src';
import AttrsLi from '../../attrsli/AttrsLi';
import '../main.scss';

class DateTimePickerExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        }
    }

    onChange(value) {
        console.log('value ', value);
        this.setState({ value });
    }
    strFormated(str) {
        const regxNum = /^(-?\d+)(\.\d+)?(e-?\+?\d+)?$/;
        return str.split(',')
            .map(str => str.trim())
            .map(str => regxNum.test(str) ? this.noZero(str)
                : (str === 'false' || str === 'true') ? str
                : `'${str}'`)
            .join(', ');
    }

    prefixInputValue(str) {
        return !Array.isArray(str) ? String(str) : `[ ${this.strFormated(String(str))} ]`;
    }

    render() {
        return (
            <div className="pickerdemo">
                <div className="h3">
                    <h4>样例{this.props.index}</h4>
                    <div className="tip">value：{this.prefixInputValue(this.state.value)}</div>
                </div>
                <DateTimePicker
                    range={this.props.range}
                    value={this.state.value}
                    unitsAside={this.props.unitsAside}
                    unitsInline={this.props.unitsInline}
                    dateOrTime={this.props.dateOrTime}
                    onChange={this.onChange.bind(this)}
                    format={this.props.format}
                />
                <ul className="yo-list">
                    {this.props.coreAttrs && this.props.coreAttrs.map(attr =>
                        <li className="item">
                            <div className="equiptent">{`关键属性：${attr} `}</div>
                            <div className="equiptent">
                                {this.prefixInputValue(this.props[attr])}
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

class DatePickerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showModal: false,
            value: '2000-9-30',

        }
    }

    onChange(value) {
        console.log('value ', value);
        this.setState({ value });
    }

    format(value, level) {
        return `${value}+level${level}`
    }

    _renderDatePicker() {
        return (
            <DateTimePicker
                start={'2000-07-28'}
                end={'2016-09-10'}
                value={this.state.value}
                unitsInline={['年', '月', '日']}
                onChange={this.onChange.bind(this)}
            />
        );
    }

    _renderSheet() {
        return (
            <ActionSheet
                height="auto"
                width="100%"
                show={this.state.show}
                onMaskTap={()=>{
                    this.setState({show: false})
            }}>
                {this._renderDatePicker()}
            </ActionSheet>
        );
    }

    _renderModal() {
        return (
            <Modal
                align="center"
                show={this.state.showModal}
                animation="fade"
                width="100%"
                height="auto"
                onMaskTap={() => {
                    this.setState({
                        showModal: false
                    });
                }}
            >
                {this._renderDatePicker()}
            </Modal>
        );
    }

    render() {
        return (
            <Page title="DateTimePicker Demo" onLeftPress={()=>location.href = '../index.html'}>
                <Scroller
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    }}
                >
                    <h3>弹框选择日期</h3>
                    <ul className="yo-list">
                        <li className="item">
                            <div className="equiptent" >actionSheet</div>
                            <div className="equiptent" ><span>{this.state.value}</span></div>
                            <div className="equiptent" >
                                <button
                                    className="yo-btn yo-btn-pri"
                                    onTouchTap={() => {
                                        this.setState({
                                            show: true
                                        });
                                    }}
                                >
                                    点击选择日期
                                </button>
                            </div>
                        </li>
                        <li className="item">
                            <div className="equiptent" >modal</div>
                            <div className="equiptent" ><span>{this.state.value}</span></div>
                            <div className="equiptent" >
                                <button
                                    className="yo-btn yo-btn-pri"
                                    onTouchTap={() => {
                                        this.setState({
                                            showModal: true
                                        });
                                    }}
                                >
                                    点击选择日期
                                </button>
                            </div>
                        </li>
                        <li>
                            <h3>样例示范</h3>
                        </li>
                        <li>
                            <DateTimePickerExample
                                range= {['3-40', '16-58']}
                                value={'3:41'}
                                unitsAside={['时', '分']}
                                dateOrTime={"time"}
                                index={"一：基础的TimePicker"}
                                coreAttrs={['dateOrTime', 'value', 'range']}
                            />
                        </li>
                        <li>
                            <DateTimePickerExample
                                range={['2000-07-23', '2016-09-10']}
                                value={'2000-9-30'}
                                unitsAside={['年', '月', '日']}
                                dateOrTime={"date"}
                                index={"二：基础的DatePicker"}
                                coreAttrs={['dateOrTime', 'value', 'range']}
                            />
                        </li>
                        <li>
                            <DateTimePickerExample
                                range={['2000-07', '2016-09']}
                                value={'2000-9'}
                                unitsInline={['年', '月', '日']}
                                dateOrTime={"date"}
                                index={"三：可自适应栏数，以省略天数"}
                                coreAttrs={['dateOrTime', 'value', 'range']}
                            />
                        </li>
                        <li>
                            <DateTimePickerExample
                                range= {['3-40-45', '16-58-57']}
                                value={'3-41-59'}
                                unitsInline={['时', '分', '秒']}
                                dateOrTime={"time"}
                                index={"四：可自适应栏数，以精确到秒"}
                                coreAttrs={[ 'dateOrTime', 'value', 'range' ]}
                            />
                        </li>
                        <li>
                            <DateTimePickerExample
                                range={['2000-07', '2016-09']}
                                value={'2000-9'}
                                index={"五：可自定format以支持非数字显示"}
                                format={this.format.bind(this)}
                                coreAttrs={['format']}
                            />
                        </li>
                    </ul>
                    <div className="pickerSheet" >
                        {this._renderSheet()}
                    </div>
                    <div className="pickerModal">
                        {this._renderModal()}
                    </div>
                </Scroller>
            </Page>
        );
    }
}

ReactDom.render(<DatePickerModal/>, document.getElementById('content'));

