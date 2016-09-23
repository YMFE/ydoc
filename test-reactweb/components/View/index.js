/*!
 *参考Libraries/Components/View/View.js及
 *https://github.com/taobaofed/react-web/blob/master/Libraries/View/View.web.js
 * @providesModule View
 */



const EdgeInsetsPropType = require('EdgeInsetsPropType');
const NativeMethodsMixin = require('react/lib/NativeMethodsMixin');
const PropTypes = require('react/lib/ReactPropTypes');
const React = require('React');
const ReactNativeStyleAttributes = require('ReactNativeStyleAttributes');
const ReactNativeViewAttributes = require('ReactNativeViewAttributes');
const StyleSheetPropType = require('StyleSheetPropType');
const UIManager = require('UIManager');
const ViewStylePropTypes = require('ViewStylePropTypes');

var LayoutMixin = require('LayoutMixin');
var StyleSheet = require('StyleSheet');

/**
 * View组件
 *
 * @component View
 * @example ./View.js[1-34]
 * @version >=v1.4.0
 * @description  View是一个支持Flexbox布局、样式、一些触摸处理、和一些无障碍功能的容器，并且它可以放到其它的视图里，也可以有任意多个任意类型的子视图。View是创建UI时最基础的组件，
 *
 * ![View](./images/component/View.gif)
 *
 */

var onEvents = {
    onAccessibilityTap: 1,

    /**
     * @property onLayout
     * @type function
     * @description 当组件挂载或者布局变化的时候调用，参数为：{nativeEvent: { layout: {x, y, width, height}}}。
     */
    onLayout: 1,
    onMagicTap: 1,
    onMoveShouldSetResponder: 1, //touchstart 2
    onMoveShouldSetResponderCapture: 1,
    onResponderGrant: 1, // 3只调一次
    onResponderMove: 1, //4
    onResponderReject: 1, //与Grant相对的
    onResponderRelease: 1, // touchend
    onResponderTerminate: 1, //被别人打断
    onResponderTerminationRequest: 1, //先于onResponderTerminate执行
    onStartShouldSetResponder: 1, //touchstart 1
    onStartShouldSetResponderCapture: 1
}

var flexStyle = `box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;`;

require('StyleSheet').inject(`
html {
    font-size: 100px;
    overflow:hidden;
    height:100%;
    font-family: "PingFang SC"
}
body {
    margin: 0;
    height:100%;
}
.rn-view,.rn-flex {
    position: relative;
    ${flexStyle}
}
.root-tag{
    height:100%;
    width:100%;
    position:relative;
    z-index:1;
}
.rn-component-root{
    height:100%;
    width:100%;
    position:absolute;
    z-index:-1;
    left:0;
    top:0;
}
.rn-root{
    position:absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    ${flexStyle}
}
div,span,img {
    border-width: 0;
    border-style: solid;
    font-size: 0.14rem;
}
span {
    box-sizing:border-box;
}
div,span,img {
    outline: none;
    -webkit-tap-highlight-color: transparent;
}
.rn-hidden {display:none;}
`);

//  对于overflow: visible的元素，居然背景色都能搞过去，真是xxx，不支持
var ronEvent = /^on[A-Z]\w+$/
var View = React.createClass({
    mixins: [LayoutMixin, NativeMethodsMixin],

    propTypes: {
        /**
         * @property style
         * @type object或array
         * @default {
         *     outline: 'none',
         *     fontSize: 14
         *  }
         * @description Text组件的样式
         */
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    },
    viewConfig: {
        uiViewClassName: 'RCTView',
        validAttributes: ReactNativeViewAttributes.RCTView
    },
    getDefaultProps: function() {
        return {
            style: {}
        }
    },
    render: function () {
        var props = this.props

        var bindTouch = false
        // 为navigator内的view准备的hack
        // if (!('onResponderTerminationRequest' in props)) {
        //     for (var i in props) {
        //         if (ronEvent.test(i)) {
        //             if (!onEvents[i]) {
        //                // delete props[i]
        //                // window.console && console.warn('View no support ' + i + ' event')
        //             } else {
        //                bindTouch = true
        //             }
        //         }

        //     }
        // }
        props.style = StyleSheet.fix(props.style, this)

        if(!props.className || props.className.indexOf('noflexbox') === -1){
            props.className = props.className ? (props.className.replace(/[\s]*rn\-view/g, '') + ' rn-view') : 'rn-view'

        }
        return (
            <div {...props}>
             {this.props.children}
            </div>
        )
    }
})

module.exports = View
