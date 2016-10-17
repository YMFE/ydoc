/**
 * @component Alert
 * @version 3.0.0
 * @description
 * 复用Confirm组件
 *
 * 取消Confirm组件的cancel按钮样式
 *
 * 单一模式,多个Alert组件复用同一个Div容器
 * @author qingguo.xu
 *
 */

import Confirm from '../../confirm/src';

/**
 * @method Alert
 * @param {String} content 内容
 * @param {String} title 标题
 * @constructor Alert构造函数
 */
export default function Alert(content='', title='') {
    return Confirm(content, title, false);
}
