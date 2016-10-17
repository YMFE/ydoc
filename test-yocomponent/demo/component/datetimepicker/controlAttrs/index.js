import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Page from '../../common/page';
import DateTimePicker from '../../../../component_dev/datetimepicker/src';
import AttrsLi from '../../attrsli/AttrsLi';
import Switch from '../../../../component_dev/switch/src';
import '../main.scss';

class DateTimePickerDemo extends Component {

    constructor(props) {
        super(props);
        this.$inputs = [];
        this.regxSplit = /[-: ,/_]/;
        this.inputNodes = [];
        this.controlledAttrsData = {};
        this.splitStrToArray = str => str.split(this.regxSplit).map(cur => parseInt(cur, 10));
        const {range, value, dateOrTime, unitsInline, unitsAside} = props;
        /*this.numStrMaps = (value, level) => {
         return value;
         switch (level) {
         case 0: return `high${value}`;
         case 1: return `mid${value}`;
         case 2: return `low${value}`;
         default: return value;
         }
         };*/
        this.dateProps = {
            dateOrTime: 'date',
            value: '2000-11-30',
            range: [ '2000-07-28', '2016-09-10'],
            // unitsAside: ['年', '月', '日'],
            // unitsInline: ['年', '月', '日'],
            // loop: [true, true, true],
            // height: 150,
            // disable: false,
            // extraClass: 'extraClass',
            // extraPickerClass: ['extraPickerClass1', 'extraPickerClass2', 'extraPickerClass3'],
        };
        this.timeProps = {
            dateOrTime: 'time',
            value: '3-41',
            range: ['3-41', '16-58'],
            // unitsInline: ['时', '分'],
            // unitsAside: ['时', '分'],
            // loop: [true, true],
            // height: 150,
            // disable: true,
            // extraClass: 'extraClass',
            // extraPickerClass: ['extraPickerClass1', 'extraPickerClass2', 'extraPickerClass3'],
        };
        this.timeAttrLiDatas = this.getTransformData(this.timeProps);
        this.dateAttrLiDatas = this.getTransformData(this.dateProps);
        this.state = {
            ...(dateOrTime === 'date' ? this.dateProps : this.timeProps),
            height: 150,
            loopedValue: 1,
            arriveHeight: 150,
            unitsAsideChecked: false,
            unitsInlineChecked: false,
            loopChecked: false,
            modeDatas: props.dateOrTime === 'time' ? this.timeAttrLiDatas : this.dateAttrLiDatas,
        };
    }

    strFormated(str) {
        const regxNum = /^(-?\d+)(\.\d+)?$/;
        return str.split(',')
            .map(str => str.trim())
            .map(str => (regxNum.test(str) || str === 'false' || str === 'true' ) ? str : `'${str}'`)
            .join(', ');
    }

    prefixInputValue(str) {
        return !Array.isArray(str) ? str : `[ ${this.strFormated(String(str))} ]`;
    }

    getTransformData(modeData) {
        return Object.entries(modeData).map(cur => ({
            text: cur[0],
            attr: cur[0],
            defaultValue: this.prefixInputValue(cur[1]),
        }));
    }

    onChange(state) {
        if (state.dateOrTime && state.dateOrTime !== this.state.dateOrTime) {
            console.log('--- onChange All', state);
            const modeDatas = state.dateOrTime === 'time' ? this.timeAttrLiDatas : this.dateAttrLiDatas,
                beSetProps = state.dateOrTime === 'date' ? this.dateProps : this.timeProps,
                stateData = Object.assign({}, {modeDatas}, beSetProps);
            this.setState(stateData);
            console.log('xxx stateData', stateData);

        } else {
            console.log('--- onChange', state);
            this.setState(state);
        }
    }

    componentDidUpdate() {
        Object.keys(this.controlledAttrsData).forEach(key => {
            this.controlledAttrsData[key] = this.state[key];
        });
    }

    render() {

        return (
            <div className={'datetimepicker'}>
                <DateTimePicker
                    height={parseInt(this.state.height, 10)}
                    range={this.state.range}
                    value={this.state.value}
                    unitsAside={this.state.unitsAside}
                    unitsInline={this.state.unitsInline}
                    dateOrTime={this.state.dateOrTime}
                    loop={this.state.loop}
                    onChange={(value, item) => {
                        console.log('---onchange value =', value);
                        this.setState({value});
                    }}
                    format={this.numStrMaps}
                    extraPickerClass={this.state.extraPickerClass}
                    extraClass={this.state.extraClass}
                />
                <div className="h3">
                    <h3>受控属性</h3>
                    <button
                        className="yo-btn yo-btn-pri set-multi"
                        onClick={() => {
                            const state = {};
                            Object.keys(this.controlledAttrsData).map(key => {
                                state[key] = this.controlledAttrsData[key];
                            });
                            this.onChange(state);
                        }}
                    >设置setState
                    </button>
                </div>
                <div className="control-panel">
                    <ul className="yo-list">
                        {this.state.modeDatas.map((attrs, index) =>
                            <AttrsLi
                                key={`li${index + 1}`}
                                curValue={this.state[attrs.attr]}
                                controlledAttrsData={this.controlledAttrsData}
                                {...attrs}
                                onChange={this.onChange.bind(this)}
                            />
                        )}
                        <li className="item" key={`li${this.state.modeDatas.length}`}>
                            <div className="mark flex">unitsAside</div>
                            <div className="switch">
                                <div className="flex">默认</div>
                                <Switch
                                    checked={this.state.unitsAsideChecked}
                                    onChange={bool => {
                                        const state = { unitsAside: bool ?  ['年', '月', '日'] : [] };
                                        this.onChange(state);
                                        this.setState({ unitsAsideChecked: bool });
                                    }}
                                />
                                <div className="flex">非默认</div>
                            </div>
                        </li>
                        <li className="item" key={`li${this.state.modeDatas.length + 1}`}>
                            <div className="mark flex">unitsInline</div>
                            <div className="switch">
                                <div className="flex">默认</div>
                                <Switch
                                    checked={this.state.unitsInlineChecked}
                                    onChange={bool => {
                                        const state = { unitsInline: bool ?  ['年', '月', '日'] : [] };
                                        this.onChange(state);
                                        this.setState({ unitsInlineChecked: bool });
                                    }}
                                />
                                <div className="flex">非默认</div>
                            </div>
                        </li>
                        <li className="item" key={`li${this.state.modeDatas.length + 2}`}>
                            <div className="mark flex">loop</div>
                            <div className="switch">
                                <div className="flex">默认</div>
                                <Switch
                                    checked={this.state.loopChecked}
                                    onChange={bool => {
                                        const state = { loop: bool ?  [false, true, false] : [] };
                                        this.onChange(state);
                                        this.setState({ loopChecked: bool });
                                    }}
                                />
                                <div className="flex">非默认</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

ReactDom.render(
    <Page title="DateTimePicker Demo">
        <DateTimePickerDemo
            range={['2000-07-28', '2016-09-10']}
            value={'2000-11-30'}
            unitsAside={['年', '月', '日']}
            unitsInline={['年', '月', '日']}
            dateOrTime={"date"}
        />
    </Page>,
    document.getElementById('content')
);
