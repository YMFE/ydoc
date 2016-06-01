每个代码块可以用这样一个注释块。

对于方法可以使用下面注释形式：

```js
/**
 * 打开
 *
 * @method XXX.router.open
 * @alias XXX.open
 * @category Router
 * @version 1.0.0
 * @param {String} name 视图名 <1.0.0>
 * @returns {Object} 东西
 * @example
 * XXX.open('view', {
 *     param: {
 *         x: 1,
 *         y: 2
 *     },
 *     ani: 'moveEnter',
 * });
 * @description
 * *open* 主要用于切换视图，类似于PC端的跳转，近似于App上的切换视图操作。
 */
```

对于属性可以使用下面注释形式：

```js
/**
 * iOS 设备嗅探
 *
 * @property XXX.sniff.ios
 * @type {Boolean}
 * @category Sniff
 */
```
