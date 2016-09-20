# Yo Changelog

History Version and release time.

### v1.8.7（2016.10.23）

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.7)

* update: `yo-datepicker`
    - 为`weeks`容器添加`relative`
    - 解决`disabled`状态被扩展覆盖的问题

### v1.8.6（2016.10.16）

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.6)

* update: `yo-btn`
    - 更新`config`对于`yo-btn`的高度和字号设置
* rename: `yo-dblist`
    - 重命名 `yo-dblist` 为 `yo-doublelist`。**业务回归请注意**

### v1.8.5 (2015.10.8)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.5)

* update: `yo-group`, `yo-dblist`
    - 调整内部实现
* update:
    - 拆分 `classes` 构造方法到各独立模块
* update: `core classes`
    - 更新弹性盒相关方法，支持 `Firefox` and `IE`
    - 新增 `align-content()`方法，用于支持多行弹性容器侧轴对齐方式
* update: `yo-datepicker`
    - 恢复该组件内部的flex布局

## v1.8.4 (2015.9.7)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.4)

* update: `yo-rating`
    - 增加 `readonly` 状态用于只读
* update: `yo-list`
    - 增加 `yo-slidermenu` 在 `yo-list` 内部使用时，有按下反馈
* update: `yo-datepicker`
    - 移除该组件内部的flex布局
* add: `kami`
    - 增加 `kami` 入口文件目录

## v1.8.3 (2015.8.20)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.3)

* update: `yo-flex`, `yo-loadtip`, `yo-dialog`, `yo-badge`
    - 调整内部实现，升级时可以不用回归
* update: `yo-tab`
    - 新增 `width` 参数用以设置tab组件宽度
* update: `fullscreen` mixin
    - 新增 `position` 参数用以定位方式，默认为 `absolute`

## v1.8.2 (2015.8.4)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.2)

* update: `yo-list`
    - 修复item底边线的问题
* update: `yo-btn`
    - 移除按钮内1px高亮定义
    - 更改 disabled 状态定义
* update: `flex` mixin方法
    - 如果横向排列时使用flex方法如下：
    ```
    @include flex(n);
    ```
    - 如果纵向排列时使用flex方法如下：
    ```
    @include flex(n, column);
    ```

## v1.8.1 (2015.7.16)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.1)

* update: `reset`
    - 新增一条重置规则
    ```
    input[type="search"]::-webkit-search-cancel-button {
        @include appearance;
    }
    ```
    用于抹平各浏览器差异，去除输入时的 `x` 按钮
* add: `yo-datepicker`
* update: `yo-list`
    - 修复item最后一根线在mate7上的重叠问题
    - 修复item底边线在QQ X5上不支持background-position取4个值的问题

## v1.8.0 (2015.6.29)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.0)

* update: `yo-header`
    - 新增 `item-ico-color` 参数用以两侧ico颜色
* add: `yo-align`
    - 新增 `yo-align` 布局方式，用于设置元素的水平及垂直对齐方式
* update: `yo-btn`
    - 新增 `width`, `height` 2个变量用于控制按钮大小
* update: `yo-list`
    - 新增 `item-border-space` 变量用于控制列表项底线距左边的间隙

## v1.7.0 (2015.6.3)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.7.0)

* update:
    - 修订了 `transition` global classes 方法
    - 给所有的 `yo-xxx` 方法增加了增量扩展的特性，当你自定义button时，可以这样写：
```
    @include yo-btn(
        $name: test,
        $border-width: .02rem
        $bgcolor: red
    ){
        // 这里可以用来增量定义当前 `yo-btn` 方法没有提供的参数扩展
        postion: absolute;
        top: 0;
        left: 0;
    }
```
* add:
    - 新增了 `calc` global classes 方法
    - 新增了 `fullscreen` global classes 方法，可传入 `z-index` 值

## v1.6.0 (2015.5.25)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.6.0)

* add:
    - 新增了 `background-clip` global classes 方法
    - 新增了 `background-origin` global classes 方法
    - 新增了 `border-radius` global classes 方法，在其内部处理了某些Android Browser上“边框+背景”，背景溢出圆角的问题
* add: `yo-panel`
    - 新增 `yo-panel`，以后会缓步替代 `yo-group`
* update: `yo-search`
    - `yo-search` 更名为 `yo-suggest`
    - 去除 `非独占` 形态下的 `取消` 按钮
    - 新增输入时loading状态
* update: `ani`
    - 新增 `rotate` 动画

## v1.5.0 (2015.4.30)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.5.0)

* update: `yo-tab`
    - 删除tab子项的:active状态
    - 选中状态只保留 `item-on` 类名，删除 `on`
* update: `yo-loading`
    - loading换成webfonts
    - `size` 参数改成 `ico-size`
    - `color` 参数改成 `ico-color`
    - 新增 `font-size` 参数用以控制文本大小
    - 新增 `color` 参数用以控制文本颜色
    - 新增 `content` 参数用以控制loading的形态，可传入webfonts编码
* update:
    - 删除元素 `yo-checkbox` 和 `yo-radio`，如已使用可以直接改用 `yo-checked`

## v1.4.0 (2015.4.16)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.4.0)

* update:
    - 删除了 `layout.scss`，如果当前页面需要设置root是否允许滚动，使用 `root-scroll()` 方法
    - 新增 `yo-flex` 弹性布局方法
* update: `flex` 方法
    - 删除 `flex` 方法的 `display: block` 设置，如果参与flex布局，请自行使用非inline元素
* update: `yo-badge`
    - 新增 `padding` 参数用于设置内补白
    - 新增 `border-width` 参数用于设置边框厚度
* update: `yo-btn`
    - 新增 `border-width` 参数用于设置边框厚度
* update: `yo-checked`
    - 删除 `type` 参数，不再使用该参数设置来判定使用哪个标记
    - 新增 `content` 参数用于设置标记，可以直接传字符或者iconfont
    - 新增 `font-size` 参数用于标记大小
    - 新增 `border-width` 参数用于设置边框厚度
    - 新增 `color` 参数用于未选中状态时的标记颜色
* add `background-size` 方法
* update: `yo-header`
    - 增加 `item-ico-size` 参数，用于设置两侧ico的大小
* update: `yo-list`
    - 删除 `is-outline` 参数，新增 `border-width` 参数用于设置外边框厚度
    - 增加 `on-color` 参数，用于设置列表项选中时文本色
    - 删除列表项的 `min-height` 定义
* update: `yo-search`
    - 增加 `cancel-width` 参数，用于设置取消按钮区域的宽度

## v1.3.1 (2015.3.27)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.3.1)

* update: `yo-switchable` 参数配置
* update: `yo-btn`
    - 增加 `active-bordercolor`, `active-bgcolor`, `active-color` 参数，用于设置按钮按下时的边框、背景、文本颜色；
* update: `yo-tab`
    - 删除 `is-border`, `is-item-border`, `on-bordercolor` 参数；
    - 新增 `border-width` 参数，用于设置tab的外边框厚度；
    - 新增 `radius` 参数，用于设置tab的圆角大小；
    - 新增 `item-border-height` 参数，用于设置tab子项间隔线的高度；
    - 新增 `item-bordercolor` 参数，用于设置tab子项间隔线的颜色；
* add: 新增分值元素 `yo-score`；
* add: 新增双list `yo-dblist`；
* update: 建议单选和多选都使用 `yo-checked`，后续考虑将 `yo-checkbox` 及 `yo-radio` 删除，尽量不要使用，之前使用过最好及时替换；
* update: `yo-checked`
    - 删除 `is-border` 参数，不再使用该参数来设定是否有边框，利用原有 `bordercolor` 参数，当值为 `transparent` 时，则无边框；
    - 删除 `disabled-color` 参数，Yo所有元素的禁用色都改为继承 `$base` map；
    - 增加 `radius` 参数用于设置圆角；
    - 增加 `on-bordercolor` 参数用于设置激活边框色；
    - 增加 `on-bgcolor` 参数用于设置激活背景色；
* update: yo-rating 外观
    - 增加 `url` 参数用于改变 yo-rating 的外观；

## v1.2.0 (2015.3.20)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.2.0)

* update: yo-checkbox 增加圆角参数；
* update: yo-list 增加label和item的颜色参数，字号参数；为item设定最小高度；
* update: yo-header 两侧文本色参数；
* update: yo-group 无数据状态；
* update: yo-tab 增加对ico大小，文本大小的参数配置，并删除默认的横向文本大小设定；
* update: yo-ico 删除 .eot 及 .svg 字体；
* update: yo-loadtip 增加加载失败和成功，同时增加下拉/释放图标动画；
* fixed: yo-group 滚动时顶部溢出；
* fixed: yo-switchable 在小米4上，当使用translatez/translate3d偏移时，会覆盖在其它层级比自身高的元素之上；
* add yo-rating；
* add yo-panel；
* fixed: fixed yo-switch handle bug on samsung s4；

## v1.1.0 (2015.3.12)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.1.0)

* add yo-loadtip
* update: add disabled status for yo-select
* add demo index page
* update: add border for yo-badge
* update: add width 100% for yo-switchable wrap

## v1.0.0 (2015.3.9)

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.0.0)

* 新增 widget yo-switch，并移除 element yo-switch；
* 新增 widget yo-switchable
* 修订 widget yo-select背景色问题