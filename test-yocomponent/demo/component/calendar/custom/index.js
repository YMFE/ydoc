/**
 * Created by qingguo.xu on 16/9/12.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page.js';
import Calendar from '../../../../component_dev/calendar/src/';
import '../../../../component_dev/common/touchEventSimulator';

class Demo extends Component {
    constructor() {
        super();
        this.state = {
            selectionStart: '2017-01-01',
            selectionEnd: '2017-01-10',
        }
    }

    onChange(obj) {
        const { selectionStart, selectionEnd } = obj;
        if (selectionStart === selectionEnd) {
            return;
        }
        this.setState({
            selectionStart,
            selectionEnd,
        });
    }

    render() {
        return (
            <Page title="Calendar Demo" onLeftPress={()=>location.href="../index.html"}>
                <Calendar
                    duration={['2017-01-01', '2017-12-31']}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}
                    onChange={obj => this.onChange(obj)}
                />
            </Page>
        );
    }
}

ReactDOM.render(<Demo />, document.body);