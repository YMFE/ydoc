/**
 *
 *  @providesModule Dimensions
 */

var invariant = require('fbjs/lib/invariant')
var debounce = require('lodash/function').debounce;

var win = typeof document !== 'undefined' ? window : { screen: {} }

var dimensions = {}



/**
 * @component Dimensions
 * @description 本模块用于获取设备屏幕的宽高。初始的尺寸信息应该在runApplication之后被执行，
 * 所以它可以在任何其他的require被执行之前就可用。不过在稍后可能还会更新。
 */
class Dimensions {


  /**
   * @method get
   * @param {string} dim
   * @return {object} 返回的尺寸信息
   * @description 通过制定字符串返回对应的尺寸信息，可选的参数为 `'screen'` 或者 `'window'`。
   * 举例如下：
   *
   * ```JavaScript
   * var {height, width} = Dimensions.get('window');
   * ```
   *
   * 可以获得的信息为：
   * - fontScale: 字体的缩放量
   * - height: 高度
   * - scale: 窗口的缩放程度
   * - width: 宽度
   *
   */
  static get(dimension: string): Object {
    invariant(dimensions[dimension], 'No dimension set for key ' + dimension)
    return dimensions[dimension]
  }


  /**
   * @method set
   * @description 设置设备屏幕的大小。在 web 中，设备的宽高会固定被设置为 `window.innerWidth`
   * 和 `window.innerHeight` ,字体缩放量被设置为 1 ,设备缩放量被设置为设备的设备像素比。
   */
  static set(): void {
    dimensions.window = {
      fontScale: 1,
      height: win.innerHeight,
      scale: win.devicePixelRatio || 1,
      width: win.innerWidth
    }

    dimensions.screen = {
      fontScale: 1,
      height: win.screen.height,
      scale: win.devicePixelRatio || 1,
      width: win.screen.width
    }
  }
}

Dimensions.set()
if(typeof document !== 'undefined'){
  window.addEventListener('resize', debounce(Dimensions.set, 50))
}

module.exports = Dimensions
