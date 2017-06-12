每个代码块可以用这样一个注释块。

``` css
/**
 * @module fragment
 * @method yo-list
 * @version 1.0.0
 * @foldnumber 8 代码块折叠行数
 * @description 构造列表的自定义使用方法
 * @demo http://doyoe.github.io/Yo/demo/fragment/yo-list.html
 * @examplelanguage css
 * @example ./examples/fragment/yo-list.sccs[5-48]
 * @param {Color} $on-color 子项选中文本色 {add:1.4.0}
 * @param {Boolean} $has-last-border 是否有最后一根底边线，改由`border-width`参数控制 {add:2.1.0}{del:2.1.3}
 * @param {Color} $item-bordercolor 子项边框色 <1.2.0,2.0.0>
 * @param {Color} $item-border-color 子项边框色 <2.0.0>
 * @skip
 */
```
#### 标签说明

* `module`: 模块名（分类）
* `method`: 方法名
* `static`: 标识静态属性/方法
* `version`: 版本
* `demo`: demo 地址
* `example`: example 代码，文件路径[起始位置-结束位置] 或者直接写 源代码
* `examplelanguage`: 配置example的高亮语法
* `param`: 参数，格式为：{类型} 名称 描述
* `skip`: 跳过此注释块
