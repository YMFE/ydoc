/**
 * @author qingguo.xu
 */
'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page.js';
import Confirm from '../../../component_dev/confirm/src/';
import '../../../component_dev/common/touchEventSimulator';

class Demo extends Component {
    handleClick(content, title="") {
        Confirm(content, title).then(
            (res) => console.log('resolve ' + res),
            (res) => console.log('reject ' + res),
        )
    }
    render() {
        return (
            <Page title="Confirm Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <button onClick={()=>this.handleClick('content', 'title')} className="yo-btn yo-btn-m yo-btn-stacked demo">normal confirm</button>
                <button onClick={()=>this.handleClick('content without title')} className="yo-btn yo-btn-m yo-btn-stacked demo">noTitle confirm</button>
            </Page>
        )
    }
}

ReactDOM.render(<Demo/>, document.getElementById('content'))
