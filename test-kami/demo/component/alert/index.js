/**
 * Created by qingguo.xu on 16/9/12.
 */
'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page.js';
import Alert from '../../../component/alert';
import '../../../component_dev/common/touchEventSimulator';

class Demo extends Component {
    handleClick(content, title = "") {
        Alert(content, title).then(
            (res) => console.log('resolve ' + res)
        )
    }

    render() {
        return (
            <Page title="Alert Demo" onLeftPress={()=> {
                location.href = '../index/index.html'
            }}>
                <button onClick={()=>this.handleClick('content', 'title')}
                        className="yo-btn yo-btn-m yo-btn-stacked demo">normal alert
                </button>
                <button onClick={()=>this.handleClick('content without title')}
                        className="yo-btn yo-btn-m yo-btn-stacked demo">noTitle alert
                </button>
            </Page>
        );
    }
}

ReactDOM.render(<Demo/>, document.getElementById('content'))

