每个组件的代码在一个文件内，一个包含 `@component` 标签的注释块为组件说明，数个包含 `@property` 标签的注释块为配置属性，数个包含 `@method` 标签的注释块为实例方法。

```js
/**
 * 滚动组件
 *
 * @component ScrollView
 * @example ./Playground/js/Examples/ScrollViewExample/vertical&horizontal.js[1-77]
 * @version >=0.20.0
 * @description 一个包装了平台的ScrollView（滚动视图）的组件，同时还集成了触摸锁定的“响应者”系统。
 *
 * * 记住ScrollView必须有一个确定的高度才能正常工作，因为它实际上所做的就是将一系列不确定高度的子组件装进一个确定高度的容器（通过滚动操作）。
 * * 要给一个ScrollView确定一个高度的话，要么直接给它设置高度（不建议），要么确定所有的父容器都已经绑定了高度。
 * * 在视图栈的任意一个位置忘记使用{flex:1}都会导致错误，你可以使用元素查看器来查找问题的原因。
 *
 * ![ScrollView](./images/ScrollView.png)
 */

/**
 * 内容位移
 *
 * @property contentInset
 * @type EdgeInsetsPropType
 * @default {top: 0, left: 0, bottom: 0, right: 0}
 * @description 内容范围相对滚动视图边缘的坐标。
 */

/**
 * 滚动到
 *
 * @method scrollTo
 * @param {PointPropType{x:x,y:y}} offset 滚动到的位置
 * @description 滚动到某一位置，如果只在某一方向滚动，可以只传{x: x}或{y: y}。
 */
```

#### 参数说明

同上
