import React, { Component } from 'react';
import ReactDom from 'react-dom';
import '../../common/tapEventPluginInit';
import DateTimePicker from '../src';

class DateTimePickerDemo extends Component {

    constructor(props) {
        super(props);
        const { range, value, dateOrTime, unitsInline, unitsAside } = props;
        this.numStrMaps = (value, level) => {
                return value;
                switch (level) {
                    case 0: return `high${value}`;
                    case 1: return `mid${value}`;
                    case 2: return `low${value}`;
                    default: return value;
                }
        };
        this.state = {
            range,
            value,
            height: 150,
            dateOrTime,
            loopedValue: 1,
            // loopedList: [false, false, false],
            loopedList: [true, true, true],
            unitsInline,
            unitsAside,
        };
    }

    render() {
        return (
          <div>
            <DateTimePicker
              height={this.state.height}
              start={this.state.start}
              end={this.state.end}
              value={this.state.value}
              unitsAside={this.state.unitsAside}
              unitsInline={this.state.unitsInline}
              dateOrTime={this.state.dateOrTime}
              loopedList={this.state.loopedList}
              onChange={(value, item) => {
                  console.log('---onchange value =', value);
                  this.setState({ value });
              }}
              format={this.numStrMaps}
              pickerExtraClass={this.props.pickerExtraClass}
              extraClass={this.props.extraClass}
            />
          </div>
        );
    }
}

let time = { hours: 3, mins: 41, secs: 59, range: [[3, 40, 45], [16, 58, 57]] };
let date = { year: 2000, month: 9, day: 30, range: [[2000, 7, 23], [2016, 9, 10]] };

ReactDom.render(
  <div>
    <DateTimePickerDemo
      range= {['3-40', '16-58']}
      value={'3-41'}
      unitsInline={['时', '分']}
      dateOrTime={"time"}
      extraClass={"test"}
    />
    <DateTimePickerDemo
      range={['2000-07-28', '2016-09-10']}
      value={'2000-9-30'}
      unitsAside={['年', '月', '日']}
      unitsInline={['年', '月', '日']}
      dateOrTime={"date"}
    />
    <DateTimePickerDemo
      range= {['3-40', '16-58']}
      value={'3:41'}
      unitsAside={['时', '分']}
      dateOrTime={"time"}
    />
    <DateTimePickerDemo
      range={['2000-07-23', '2016-09-10']}
      value={'2000-9-30'}
      unitsInline={['年', '月', '日']}
      dateOrTime={"date"}
      pickerExtraClass={['datetimepicker-hidden', '', '']}
    />
    <DateTimePickerDemo
      range={['2000-07', '2016-09']}
      value={'2000-9'}
      unitsInline={['年', '月', '日']}
      dateOrTime={"date"}
    />
    <DateTimePickerDemo
      range= {['3-40-45', '16-58-57']}
      value={'3-41-59'}
      unitsAside={['时', '分', '秒']}
      dateOrTime={"time"}
    />
  </div>,
document.getElementById('content'));


/*
ReactDom.render(
    <div>
        <DateTimePickerDemo
            high={2000}
            middle={7}
            low={11}
            dateOrTime={"date"}
            range={date.range}
        />
        <DateTimePickerDemo
            high={3}
            middle={41}
            low={59}
            dateOrTime={"time"}
            range={time.range}
        />
    </div>,
document.getElementById('content'));
*/
