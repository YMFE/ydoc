/**
 * Created by qingguo.xu on 16/9/18.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import SwipeMenu from '../../../component_dev/swipeMenu/src/';
import '../../../component_dev/common/touchEventSimulator';
import './style.scss';

class Demo extends Component {
    render() {
        const action = [
            {
                content: '详情',
                tap: () => console.log('click detail'),
            },
            {
                content: '删除',
                tap: () => console.log('click delete'),
            }
        ];
        return (
            <Page title="SwipeMenu Demo" onLeftPress={()=>location.href = "../index/index.html"}>
                <SwipeMenu
                    action={action}
                    extraClass='demo'
                >
                    <p className="swipemenu-demo-content">这是默认的swipeMenu例子(left)</p>
                </SwipeMenu>
                <SwipeMenu
                    action={action}
                    extraClass='demo' direction='right'
                >
                    <p className="swipemenu-demo-content">这是left侧action例子(right)</p>
                </SwipeMenu>
                <SwipeMenu extraClass='demo' disable>
                    <p className="swipemenu-demo-content">disable例子</p>
                </SwipeMenu>
            </Page>
        )
    }
}

ReactDOM.render(<Demo/>, document.getElementById('content'))