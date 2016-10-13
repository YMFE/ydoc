import Calendar from '../src';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class CalendarDemo extends Component {
    constructor() {
        super();
        this.state = {
            endDate: '2017-01-01',
            checkIn: '2016-12-31',
            checkOut: '2017-01-01',
        }
    }

    onChange(obj) {
        const { checkIn, checkOut } = obj;
        this.setState({
            checkIn,
            checkOut,
        });
    }

    render() {
        return (
            <Calendar
                extraClass='demo'
                checkIn={this.state.checkIn}
                checkOut={this.state.checkOut}
                endDate={this.state.endDate}
                allowSingle={false}
                onChange={str => this.onChange(str)}
            />
        )
    }
}

ReactDOM.render(<CalendarDemo />, document.getElementById('content'));
