/**
 * @component Confirm
 * @version 3.0.0
 * @description
 * API形式,单一模式,多个Confirm组件共用同一个Div容器
 *
 * API返回Promise实例, 确定取消按钮分别对应resolve、reject
 *
 * 复用Dialog组件
 * @author qingguo.xu
 */

import Dialog from '../../dialog/src';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

let that = null;
let container = document.createElement('div');
document.body.appendChild(container);

class ConfirmReact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            title: '',
            content: '',
            onOk: () => {
            },
            onCancel: () => {
            }
        };
        that = this;
    }

    componentWillUnmount() {
        document.body.removeChild(container);
    }

    render() {
        let {show, title, content, onOk, onCancel} = this.state;
        return (
            <Dialog show={show} title={title} content={content} onOk={onOk.bind(this)}
                    onCancel={onCancel ? onCancel.bind(this) : false}/>
        )
    }
}

ReactDOM.render(<ConfirmReact/>, container);

/**
 * @method Confirm
 * @param content {String}
 * @param title {String}
 * @param cancel {Boolean} 是否有取消按钮
 * @returns {Promise} 返回一个Promise实例对象
 * @constructor Confirm 组件单例的构造函数
 */
export default function Confirm(content = '', title = '', cancel = true) {
    return new Promise((resolve, reject) => {
        function okBtn() {
            resolve(true);
            that.setState({show: false});
        }

        function cancelBtn() {
            reject(false);
            that.setState({show: false});
        }

        cancelBtn = cancel ? cancelBtn : false;
        that.setState({show: true, title: title, content: content, onOk: okBtn, onCancel: cancelBtn});
    })
}
