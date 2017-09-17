/**
 * @component Touchable
 * @version 3.0.0
 * @description `Touchable` 组件是一个"虚拟"组件，它不会真的在文档中创建一个 `dom` 节点作为根节点，而是返回它唯一的子组件的一个克隆，并给它绑定一些手势事件。
 * 除了能给 `dom` 绑定 `tap` 事件之外，它还解决了一些移动端的手势"顽疾"，例如触摸反馈和滚动/触摸的冲突问题。在需要绑定 `tap` 事件的情况下，应该优先使用 `Touchable`，
 * 而不是直接把 `tap` 事件回调绑定给 `dom`。
 *
 * @author authorName
 * @demo http://ued.qunar.com/
 * @example
 * hysdk.checkJsApi({
 *    jsApiList: ['chooseImage'], // 需要检测的JS接口列表
 *    success: function(res) {
 *        // 以键值对的形式返回，可用的api值true，不可用为false
 *        // res: {"chooseImage": true}
 *    },
 *    fail: function() {}
 * });
 * @instructions {instruInfo: ./touchable.md}{instruUrl: index.html}
 */
import React, { Component, PropTypes } from 'react';
import gesture from './gesture';

export default class Touchable extends Component {

    static propTypes = {
        /**
         * @property touchClass
         * @type String
         * @default null
         * @param {DOMElement} target tap事件的target <3.0.0>
         * @example
         * hysdk.checkJsApi({
         *    jsApiList: ['chooseImage'], // 需要检测的JS接口列表
         *    success: function(res) {
         *        // 以键值对的形式返回，可用的api值true，不可用为false
         *        // res: {"chooseImage": true}
         *    },
         *    fail: function() {}
         * });
         * console.log(yes);
         * @description 触摸Touchable时附加的className，可以用来实现Native常见的触摸反馈功能(例如给触摸区域添加深色背景或者改变透明度等等)。
         */
        touchClass: PropTypes.string,
        /**
         * @event onTap
         * @type Function
         * @default null
         * @example
         * hysdk.checkJsApi({
         *    jsApiList: ['chooseImage'], // 需要检测的JS接口列表
         *    success: function(res) {
         *        // 以键值对的形式返回，可用的api值true，不可用为false
         *        // res: {"chooseImage": true}
         *    },
         *    fail: function() {}
         * });
         * @param {DOMElement} target tap事件的target <3.0.0>
         * @description 给Touchable绑定的onTap事件。
         */
        onTap: PropTypes.func,
        /**
         * @method disabled
         * @type Bool
         * @default false
         * @param {DOMElement} target tap事件的target <3.0.0>
         * @example
         * hysdk.checkJsApi({
         *    jsApiList: ['chooseImage'], // 需要检测的JS接口列表
         *    success: function(res) {
         *        // 以键值对的形式返回，可用的api值true，不可用为false
         *        // res: {"chooseImage": true}
         *    },
         *    fail: function() {}
         * });
         * @description Touchable是否处于可点击状态，如果设为true，那么onTap事件回调和触摸反馈效果都不可用。
         * @version 3.0.7
         */
        disabled: PropTypes.bool,
        /**
         * @skip 给List定制的属性
         */
        onTouchStart: PropTypes.func,
        /**
         * @skip 内部使用标志
         */
        internalUse: PropTypes.bool,
        children: PropTypes.object
    };

    static defaultProps = {
        onTouchStart: () => {
        },
        touchClass: null,
        onTap: () => {
        },
        internalUse: false,
        disabled: false
    };

    static contextTypes = {
        scroller: PropTypes.object,
        swipeMenuList: PropTypes.object
    };

    render() {
        return React.cloneElement(onlyChild, { onTouchStart, onTouchMove });
    }
}
