import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Suggest from '../../../../component_dev/suggest/src';
import ActionSheet from '../../../../component_dev/actionsheet/src';
import ToolTip from '../../../../component_dev/tooltip/src';
import Page from '../../common/page';
import {getRandomDataSource} from '../../list/common/baseUtils';
import './style.scss';
import '../../../../component_dev/common/touchEventSimulator';

class UseWithActionSheetDemo extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            results: [],
            defaultCondition: ''
        };
    }

    render() {
        return (
            <Page title="带弹层的Suggest" onLeftPress={()=>location.href="../index.html"}>
                <div className="container">
                    <button
                        className="yo-btn open-modal"
                        onTouchTap={()=> {
                            this.setState({show: true});
                        }}
                    >
                        与ActionSheet一起使用,点我打开
                    </button>
                    <ActionSheet
                        onMaskClick={()=> {
                            this.setState({show: false})
                        }}
                        show={this.state.show}
                        height="100%"
                        onShow={()=> {
                            setTimeout(()=> {
                                this.refs.suggest.input.focus();
                            },200);
                        }}
                    >
                        <Suggest
                            ref="suggest"
                            showMask={false}
                            showCancelButton={true}
                            onCancelButtonTap={()=> {
                                this.refs.suggest.clearInput();
                                this.setState({show: false});
                            }}
                            onConditionChange={value=> {
                                this.setState({results: value ? getRandomDataSource(10) : []});
                            }}
                            onItemTap={item=>ToolTip.show('tapping:' + item.text)}
                            defaultCondition={this.state.defaultCondition}
                            results={this.state.results}
                            recommendTmpl={<p style={{padding: '1em'}}>设置showCancelButton为true可以展示取消按钮</p>}
                            noDataTmpl={<div style={{padding: '1em'}}>No Results</div>}
                        />
                    </ActionSheet>
                </div>
            </Page>
        );
    }
}

ReactDOM.render(<UseWithActionSheetDemo/>, document.getElementById('content'));