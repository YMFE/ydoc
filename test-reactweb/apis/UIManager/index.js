/*!
 * @providesModule UIManager
 */


 /**
 * NativeModules.UIManager
 *
 * @component NativeModules.UIManager
 * @version >=v1.4.0
 * @description UIManager提供了操纵视图的API。根据NativeModules.UIManager调用UIManager。
 *
 *
 */


var CSSPropertyOperations = require('react/lib/CSSPropertyOperations')
var flattenStyle =  require('flattenStyle')
var processTransform = require('processTransform')

var _measureLayout = function(node, relativeToNativeNode, callback)  {
  var relativeNode = relativeToNativeNode || node.parentNode
  var relativeRect = relativeNode.getBoundingClientRect()
  // getBoundingClientRect会返回小数，在浏览器会有问题，因此做一个四舍五入
  var layout = node.getBoundingClientRect(),
    height = Math.round(layout.height),
    left = Math.round(layout.left),
    top = Math.round(layout.top),
    width = Math.round(layout.width)
  var x = left - relativeRect.left
  var y = top - relativeRect.top
  callback(x, y, width, height, left, top)
}

const UIManager = {
  /**
   * @method NativeModules.UIManager.blur
   * @param {object} node 元素节点
   * @description 触发元素节点的blur()方法
   */ 
  blur(node) {
    try { node.blur() } catch (err) {}
  },

  /**
   * @method NativeModules.UIManager.focus
   * @param {object} node 元素节点
   * @description 触发元素节点的focus()方法
   */ 
  focus(node) {
    try { node.focus() } catch (err) {/*console.log(node)*/}
  },

  /**
   * @method NativeModules.UIManager.measure
   * @param {object} node 元素节点
   * @param {function} callback 回调方法
   * @description 计算指定节点相对于父节点显示的位置和尺寸，通过一个异步回调返回计算的结果。如果成功，回调函数会被调用，并带有以下参数：
   * - x
   * - y
   * - width
   * - height
   * - left
   * - top
   */
  measure(node, callback) {
    if(!node) return
    _measureLayout(node, null, callback)
  },

  /**
   * @method NativeModules.UIManager.measureInWindow
   * @param {object} node 元素节点
   * @param {function} callback 回调方法
   * @description 计算指定节点在屏幕上显示的位置和尺寸，通过一个异步回调返回计算的结果。参数为`left,top,width,height`。
   */
  measureInWindow(node, callback) {
    const { height, left, top, width } = node.getBoundingClientRect()
    callback(left, top, width, height)
  },



  /**
   * @method NativeModules.UIManager.measureLayout
   * @param {object} node 元素节点
   * @param {object} relativeToNativeNode 指定祖先节点，不存在则默认为父节点。
   * @param {function} onFail 获取失败的回调函数
   * @param {function} onSuccess 获取成功的回调函数
   * @description 计算指定节点相对于指定祖先节点在屏幕上显示的位置和尺寸，通过一个异步回调返回计算的结果。如果成功，调用获取成功的回调函数，参数和`measure`callback函数相同。获取失败则调用失败的回调函数。
   */
  measureLayout(node, relativeToNativeNode, onFail, onSuccess) {
    const relativeTo = relativeToNativeNode || node.parentNode
   
    _measureLayout(node, relativeTo, onSuccess)
  },

  /**
   * @method NativeModules.UIManager.updateView
   * @param {object} node 元素节点
   * @param {object} props props对象
   * @description 根据props对象刷新视图。
   */
  updateView(node, props) {
    for (const prop in props) {
      let nativeProp
      const value = props[prop]

      switch (prop) {
        case 'style':
          // convert styles to DOM-styles
          CSSPropertyOperations.setValueForStyles(node, processTransform(flattenStyle(value)))
          break
        case 'class':
        case 'className':
          nativeProp = 'class'
          // prevent class names managed by React Native from being replaced
          const className = node.getAttribute(nativeProp) + ' ' + value
          node.setAttribute(nativeProp, className)
          break
        case 'text':
        case 'value':
          // native platforms use `text` prop to replace text input value
          node.value = value
          break
        default:
          node.setAttribute(prop, value)
      }
    }
  }
}

module.exports = UIManager