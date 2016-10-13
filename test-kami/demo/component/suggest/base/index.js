import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page';
import Suggest from '../../../../component_dev/suggest/src';
import ToolTip from '../../../../component_dev/tooltip/src';
import {getRandomDataSource} from '../../list/common/baseUtils';

class BaseDemo extends Component {
    constructor() {
        super();
        this.state = {
            results: [],
            currentCondition: null,
            showLoadingIcon: false
        };
    }

    render() {
        return (
            <Page title="Suggest:基础用法" onLeftPress={()=>location.href="../index.html"}>
                <Suggest
                    results={this.state.results}
                    showCancelButton={false}
                    inputIcon={this.state.loading ? 'loading' : 'delete'}
                    onConditionChange={(value)=> {
                        this.setState({
                            loading: true,
                            currentCondition: value
                        });
                        setTimeout(()=> {
                            this.setState({
                                loading: false,
                                results: value ? getRandomDataSource(20) : []
                            });
                        }, 500);
                    }}
                    recommendTmpl={(
                        <p style={{padding: '1em'}}>
                            注意: 这个示例使用了节流事件(设置属性throttleGap),onConditionChange每500ms触发一次,
                            在实际开发中你应该控制用户输入字符的频率,否则可能会增加服务器的负担
                        </p>
                    )}
                    noDataTmpl={(
                        <div style={{padding: '1em'}}>
                            {!this.state.loading ? 'No result' : 'Loading...'}
                        </div>
                    )}
                    extraClass="base"
                    onItemTap={(item)=>ToolTip.show('tapping:' + item.text, 2000)}
                    throttleGap={500}
                />
            </Page>
        );
    }
}

ReactDOM.render(<BaseDemo/>, document.getElementById('content'));
