/**
 * Created by qingguo.xu on 16/9/18.
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import Popup from '../../../component_dev/popup/src/';
import '../../../component_dev/common/touchEventSimulator';


class PopupDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {show: false};
    }

    render() {
        return (
            <Page title="Popup Demo" onLeftPress={()=>location.href = '../index/index.html'}>
                <button className="yo-btn yo-btn-m yo-btn-stacked"
                        onClick={()=> this.setState({show: !this.state.show})}>toggle
                </button>
                <Popup show={this.state.show} height={200} maskOffset={[0, 86]} extraClass='demo'
                       onMaskClick={()=>this.setState({show: false})}>
                    123456
                </Popup>
            </Page>
        )
    }
}

ReactDOM.render(<PopupDemo />, document.getElementById('content'))
