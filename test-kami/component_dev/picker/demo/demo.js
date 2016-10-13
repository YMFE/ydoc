import PickerCore from '../src/PickerCore';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../../common/tapEventPluginInit';
import Picker from '../src';
const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item=>({text: item, value: item}));
const testData2 = [1, 2, 3, 4, 5, 6].map(item=>({value: item}));

function getRandomNumber(min, max) {

    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomOptions() {

    const range = getRandomNumber(1, 15);

    return new Array(range).fill(1).map((item, i)=>({value: i}))
}

class PickerDemo extends Component {

    constructor() {

        const options = getRandomOptions();
        super();
        this.state = {
            options: options,
            height: 200,
            loopedValue: 1,
            notLoopedValue: 4,
            looped: true
        };
    }

    render() {
        return (
            <div>
                <button onTouchTap={()=> {
                    const randomOptions = getRandomOptions();
                    const randomIndex = getRandomNumber(0, randomOptions.length);
                    const value = randomOptions[getRandomNumber(0, randomOptions.length)].value;
                    const height = getRandomNumber(100, 300);
                    console.log('set value to:' + value);
                    console.log('option length:' + randomOptions.length);
                    console.log('set height to:' + height);
                    this.setState({
                        options: randomOptions,
                        notLoopedValue: value,
                        height,
                        looped: !this.state.looped
                    })
                }}>
                    change options, value and height of picker1
                </button>
                <div>
                    <Picker
                        options={this.state.options}
                        onChange={item=>this.setState({notLoopedValue: item.value})}
                        height={this.state.height}
                        value={this.state.notLoopedValue}
                        looped={this.state.looped}
                    />
                </div>
                <div style={{marginTop: 50}}>
                    <Picker
                        options={testData2}
                        onChange={item=>this.setState({loopedValue: item.value})}
                        value={this.state.loopedValue}
                        unit="haha"
                    />
                </div>
            </div>
        );
    }
}

ReactDom.render(<PickerDemo/>, document.getElementById('content'));
