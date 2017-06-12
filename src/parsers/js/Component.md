每个组件的代码在一个文件内，一个包含 `@component` 标签的注释块为组件说明，数个包含 `@property` 标签的注释块为配置属性，数个包含 `@method` 标签的注释块为实例方法，数个包含 `@event` 标签的注释块为监听的事件类型。

```js
/**
 * 滚动组件
 *
 * @component ScrollView
 * @examplelanguage js
 * @example ./Playground/js/Examples/ScrollViewExample/vertical&horizontal.js[1-77]
 * @version >=0.20.0
 * @foldnumber 8 代码块折叠行数
 * @description 一个包装了平台的ScrollView（滚动视图）的组件，同时还集成了触摸锁定的“响应者”系统。
 *
 * * 记住ScrollView必须有一个确定的高度才能正常工作，因为它实际上所做的就是将一系列不确定高度的子组件装进一个确定高度的容器（通过滚动操作）。
 * * 要给一个ScrollView确定一个高度的话，要么直接给它设置高度（不建议），要么确定所有的父容器都已经绑定了高度。
 * * 在视图栈的任意一个位置忘记使用{flex:1}都会导致错误，你可以使用元素查看器来查找问题的原因。
 *
 * ![ScrollView](./images/ScrollView.png)
 *
 *  @instructions {instruInfo: ./alert.md}{instruUrl: alert/index.html}
 */

// 配置

/**
 * 内容位移
 *
 * 滑块刻度标签
 * @property scaleFormat
 * @static
 * @type function/string
 * @param {Number} scale 单个标签对应的value值
 * @param {Number} index 当前标签对应的下标
 * @description 类型提示：支持数组传值；也支持用函数格式化字符串：函数有两个参数(scale, index)；
 * 受控属性：滑块滑到某一刻度时所展示的刻度文本信息。如果不需要标签，请将该属性设置为 [] 空列表来覆盖默认转换函数。
 * @returns {Boolean} 是否成功
 * @default scale => scale
 * @examplelanguage js
 * @example
 * PropTypes.arrayOf(
 *     PropTypes.shape({
 *         text: PropTypes.string.isRequired,
 *         className: PropTypes.string,
 *         onTap: PropTypes.func.isRequired,
 *   })
 * )
 *
 */

// 方法

 /**
  * @method 组件关闭,无过渡动画
  * @static
  * 返回给外部的回调函数, 为swipeMenuList特制,
  * @param isClearTransition {Boolean}
  * @description 类型提示：支持数组传值；也支持用函数格式化字符串：函数有两个参数(scale, index)；
  * 受控属性：滑块滑到某一刻度时所展示的刻度文本信息。如果不需要标签，请将该属性设置为 [] 空列表来覆盖默认转换函数。
  * @returns {Boolean} 是否成功
  * @examplelanguage js
  * @example
  * PropTypes.arrayOf(
  *     PropTypes.shape({
  *         text: PropTypes.string.isRequired,
  *         className: PropTypes.string,
  *         onTap: PropTypes.func.isRequired,
  *   })
  * )
  */

// 事件

  /**
   * @event onScroll
   * @static
   * @description 类型提示：支持数组传值；也支持用函数格式化字符串：函数有两个参数(scale, index)；
   * @param isClearTransition {Boolean}
   * @returns {Boolean} 是否成功
   * @examplelanguage js
   * @example
   * PropTypes.arrayOf(
   *     PropTypes.shape({
   *         text: PropTypes.string.isRequired,
   *         className: PropTypes.string,
   *         onTap: PropTypes.func.isRequired,
   *   })
   * )
   */
```
