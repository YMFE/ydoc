'use strict';

import Popup from '../src';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class PopupDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {show: false};
    }
    render() {
        return (
            <div>
                <button className="yo-btn yo-btn-m yo-btn-stacked demo-btn" onClick={()=> this.setState({show: !this.state.show})}>show</button>
                <Popup show={this.state.show} height={200} maskOffset={[36, 0]} extraClass='demo' onMaskClick={()=>this.setState({show: false})}>
                    123456
                </Popup>
            </div>
        )
    }
}

ReactDOM.render(<PopupDemo />, document.getElementById('content'))
