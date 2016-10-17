/*
 * @providesModule Alert
 */
'use strict'

var AppRegistry = require('AppRegistry');
var {utils} = AppRegistry;
var Dialog = require('UDialog');
var Alert = Dialog.Alert;



/**
 * Alert 组件
 *
 * @component Alert
 * @example ./Alert.js
 * @version >=0.20.0
 * @description  启动一个带有特定标题和信息的对话框。通常传入一组按钮作为参数，
 * 点击按钮会触发 `onPress` 事件且关闭对话框。默认情况下只有一个 `Ok` 按钮。
 *
 * ![Alert](./images/component/Alert.gif)
 */


 /**
  * @method alert
  * @param  {string} title 对话框的标题
  * @param  {string} [content]  对话框的内容
  * @param  {array} [buttons]  一组 button 组件
  * @param  {string} [type] AlertType
  */
Alert.alert = function(title, content, buttons, type) {
    var props = {title, content, buttons},
        gid = utils.gid()
    utils.render(<Alert
        {...props} 
        style={{textAlign: "center"}}
        visible={true}
        onClose={()=>{
            utils.hideContainer(gid)
        }}
    />, gid)
}
const defaultButtons = [
  {
    text: '取消',
  }, 
  {
    text: '确定'
  }
]
var OriginAlert = window.alert,
  OriginPrompt = window.prompt
/**
  * @method prompt
  * @description 直接用浏览器prompt实现
  * @param  {string} title 对话框的标题
  * @param  {string} [value]  value
  * @param  {array} [buttons]  一组 button 组件【不支持自定义按钮样式，只支持回调】
  * @param  {function} [callback] 回调
  */
Alert.prompt = function(title, value, buttons, callback) {
  var tmp = OriginPrompt(title, value),
    okButton = buttons && buttons[0] && buttons[0].onPress,
    abortButton = buttons && buttons[1] && buttons[1].onPress
  // 取消
  if (tmp === null) {
    abortButton && abortButton(tmp)
  } else {
    okButton && okButton(tmp)
  }
  callback && callback(tmp)
}
window.alert = function(content) {
  Alert.alert("Alert", content, [{text:'确定',onPress:()=>true}])
}
module.exports = Alert
module.exports.OriginAlert = OriginAlert
module.exports.OriginPrompt = OriginPrompt
