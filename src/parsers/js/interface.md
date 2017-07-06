每个代码块可以用这样一个注释块。

对于方法可以使用下面注释形式：

```js
/**
 * 注释头部可以直接编写描述
 *
 * @interface /qhot/v2/addModule  接口名称
 * @method GET 请求的方法
 * @category 接口分类
 * @foldnumber 3 需要在配置文件中配置foldnumber，默认折叠6行，可以在这里自定义配置行数
 * @param {String} name name描述 <1.0.0>
 * @param  {String} [age] age描述 <1.0.0, 2.1.2>
 * @examplelanguage js
 * @example ./test.json[1-12] // 返回示例
 * @description
 * *斜体* 额外说明的描述文字
 *
 */
```
