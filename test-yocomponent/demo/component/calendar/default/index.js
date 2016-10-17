import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page.js';
import Calendar from '../../../../component_dev/calendar/src/'
import '../../../../component_dev/common/touchEventSimulator';
import '../../../../component_dev/common/touchEventSimulator';

class Demo extends Component {
    constructor() {
        super();
        this.state = {
            selectionStart: '',
            selectionEnd: '',
        };
    }

    onChange(obj) {
        const {selectionStart, selectionEnd} = obj;
        this.setState({
            selectionStart,
            selectionEnd,
        });
    }

    render() {
        return (
            <Page title="Calendar Demo" onLeftPress={()=>location.href="../index.html"}>
                <Calendar
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}
                    onChange={obj => this.onChange(obj)}
                />
            </Page>
        );
    }
}

ReactDOM.render(<Demo />, document.body);
