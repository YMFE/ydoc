/*
 * @providesModule Toast
 */
'use strict'

var ReactNative = require('react-native')
var {View, Text, AppRegistry} = ReactNative
var {utils} = AppRegistry
var ReactDOM = require('react-dom')
var Dimensions = require('Dimensions')
var Tooltip = require('UTooltip')
var Toast = Tooltip
var height = Dimensions.get('window').height


/**
 * Toast组件
 *
 * @component Toast
 * @version >=v1.4.0
 * @example ./Toast.js[1-30]
 * @description  Toast是一个悬浮提示信息的组件。
 * 注:因为Toast的隐藏是通过改变zIndex为-1的方式，意味着您的主视图需要一个背景颜色，才能将toast隐藏在主视图下。
 *
 * ![Toast](./images/component/Toast.gif)
 *
 */

  

/**
 *
 * @method show
 * @param {string} message 提示信息内容
 * @param {number} duration 提示信息显示的时间
 * @description Toast的显示方法。
 *
 * duration也可以使用默认的时间`Toast.SHORT`(400ms)、`Toast.LONG`(1000ms)。
 *
 */
var React = require('react')
var gid
var ToastView = React.createClass({
    render: function() {
        return <Tooltip 
            {...this.props} 
            isVisible={true}
            isEffect={false}
            isAutoHide={this.props.duration}
            mask={false}
            onClose={()=>{
                utils.hideContainer(gid)
            }}
            boxStyle={{
                backgroundColor: '#666'
            }}
        >
            <Text>{this.props.message}</Text>
        </Tooltip>
    }
})
Toast.show = function(message, duration, offSet) {
    // 暂时不支持offSet
    gid = utils.gid()
    utils.render(<ToastView 
        duration={duration} 
        offSet={offSet} 
        message={message}
    />, gid)
}

Toast.SHORT = 400
Toast.LONG  = 1000
Toast.TOP   = 0
Toast.MIDDLE = height / 2
Toast.BOTTOM = height
// if(typeof document !== 'undefined'){
//     window.addEventListener('resize', function() {
//         height = Dimensions.get('window').height
//         Toast.MIDDLE = height / 2
//         Toast.BOTTOM = height
//     })
// }
module.exports = Toast
