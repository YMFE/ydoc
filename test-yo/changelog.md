## v3.0.0（开发中）

**全新架构设计**

### 新增：
* 新增 `yo-column` 横向弹性布局元件；
* `yo-actionsheet` 新增 `item-light` 重要操作状态；
* `yo-list` 增加边线右缩进的情况；
* `yo-carousel` 增加纵向的情况；

### 变更：
* 将所有的 `widget` 迁移到 `fragment` 目录下；
* 将 `yo-select` 变更为 `yo-picker`；
* 将 `yo-datepicker` 变更为 `yo-calendar`；
* 将 `yo-switchable` 变更为 `yo-carousel`；
* 将 `yo-tip` 变更为 `yo-tooltip`；
* 将 `yo-index` 并入 `yo-group`；
* 将 `yo-loading` 中的 `inner` 层级移除；
* 重构 `yo-suggest` 元件；
* 重构 `yo-search` 元件；
* 重构 `yo-range` 元件；
* 重构 `yo-rating` 元件；
* 修改 `@mixin flex` 方法纵向排版时，空间分配的bug，使用 `height: .1px` 解决；
* 修复 `yo-tab` 中间隔线 `1/3` 的编译问题；

### 删除：
* 删除 `yo-input` 元件；
* 删除 `yo-doublelist` 元件；
* 删除 `yo-score` 元件，使用 `yo-rating` 的只读状态代替；

**由于 Yo v3.0.0 引入了交互组件，并对原有结构做了大幅度的调整，所以不建议从旧版本升级，推荐在新项目和重构项目中使用**

## v2.1.3（2016.7.4）

### 新增：
* add `is-text-size-adjust` 参数
    - 为 `$setting` 添加 `is-text-size-adjust` 参数用于决定是否允许横竖屏时字号动态调整

### 变更：
* change `yo-list`：
    - 去除第一个 `.item` 的上边线；
* change `"#{}"`
    - Node-sass新版对 `"#{}"` 的处理发生变化，会将双引号保留。所以移除 `gradient`, `transition` mixin 中使用了 `"#{}"` 的双引号，改成 `#{}`

### 修复
* fix `yo-select`：
    - 修复在 `dpr=3` 时，Node-sass新版编译除法表达式出现问题。把 `1/3` 改为 `0.33333`

## v2.1.2（2016.5.23）

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v2.1.2)

### 新增：
* add `yo-search`，用以各种搜索框；
* add `yo-toolbar`，用以展示工具条；
* add `yo-card`，用以展示卡片元件；

### 变更：
* change `yo-select`，修改内部实现，精简代码层级，Kami需要重写该组件；
* change `yo-switch`：
    - 将默认宽度由`.6rem`修改为`.5rem`；
    - 移除 `$border-color`, `$checked-border-color` 参数；
    - 新增 `$follow-bgcolor` 参数用以指定跟随元素的背景色；
* change `yo-list`：
    - 移除item的opacity设定，改用z-index:0来替代；
    - 改变内部子项的边线实现方式；
    - 最后一根边线存在与否改由 `$border-width 决定`，移除 `$has-last-border` 参数；
    - 移除 `$detail-font-size`，`$detail-color`，`$info-font-size`，`$info-color` 参数，改布局交由新元件 `yo-card` 来承担；
* change `yo-dialog`：
    - 移除外边框阴影设置 `$shadow-opacity` 参数；
    - 移除 `$hd-height` 和 `hd-bgcolor` 参数；
* change `yo-switchable`：
    - 移除索引和前进后退按钮3d偏移，减少复合层的数量；
* change `yo-actionsheet`：
    - 从 widget 移到了 fragement 类别；
    - 改用absolute替代fixed，同时去除filter effect，减少复合层；
* change：
    - 将 `yo-vcode` 移到了 fragment 类别；
    - 后续计划将 widget 类别全部迁移到 fragement ，kami对应的应该是各种 fragement 的拼合文件，Yo 不直接提供某个具体的组件
* change：
    — 为 `merge-config` 和 `merge-extra` 文件添加 `!global` 关键字，解决node-sass3.4.2以上版本的编译错误

### 删除：
* 删除 `yo-popup` 组件；
* 删除 `yo-btnbar` 组件；

## v2.1.1（2016.2.19）

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v2.1.1)

### 新增：
* add: `yo-actionsheet`用于底部滑出菜单
    - 为`$z-index map`增加`actionsheet`参数，用于指定`yo-actionsheet`的层叠级别；
    - 为`yo-actionsheet`新增`$actionsheet` map，用于设置`yo-actionsheet`的基础定义；
* add: `yo-tip`方向箭头
    - 为`yo-tip`添加一个子元素用来指定箭头，top | right | bottom | left 可以确定箭头的方向，箭头的位置由业务自己计算
    - 添加`$arrow-size`参数用于指定箭头的大小
* add:
    - 为`yo-datepicker`增加“今天是节日的情况”显示规则；
    - 为`yo-datepicker`增加日期段Range选中背景显示规则；

### 变更：
* change `yo-select`，默认子项有初始高度；

## v2.1.0（2015.12.21）

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v2.1.0)

### 新增：
* add `frist($list)` function，用于取出Sass List中的第一项；
* add `last($list)` function，用于取出Sass List中的最后一项；
* add `nth-last($list, $index)` function，用于取出Sass List中的倒数第n项；
* add `remove($list, $value)` function，用于移除Sass List中的$value；
* add `slice($list, $start, $end)` function，用于取出Sass List中被选中的项；
* add `splice($list, $index, $count, $values)` function，用于移除Sass List中的项，并添加新项；
* add `$has-last-border` for `yo-list`，用于指定最后一项是否需要底边线；

### 变更：
* change `perfix` mixin 为私有`_perfix`；
* change `yofont` mixin 为私有`_yofont`；
* change `gradient` mixin 的内部实现；
* change `transition` mixin 的内部实现；
* 为 `selectlist` 添加对 `yo-checked` 的依赖；

## v2.0.0（2015.12.7）

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v2.0.0)

**请谨慎升级v2.0.0版本，因为这是大版本，涉及到很多变更**

### 新增：
* add: `yo-vcode`
    - 新增`yo-vcode`用于验证码或者密码输入组件
* add: `yo-breadcrumb`
    - 新增`yo-breadcrumb`面包屑
* add: `yo-proportion`
    - 新增`yo-proportion`用于展现占比情况
* add: `响应式断点`
    - 新增`xs, s, m, l, xl`5类响应式断点，用于支持响应式设计
* add: `global classes`
    - 新增`align`方法用于处理元素水平及垂直对齐方式，默认为居中
    - 新增`transform-style`,`perspective`,`perspective-origin`,`backface-visibility`,`flex-flow`方法
* add: `global function`
    - 新增了`function`文件，用以后续扩展Sass内置的函数

### 变更：
* (*)change: `1px边框方法`（全平台兼容）
    - 新增`border`方法用于处理retina屏1px边框，移除原`viewport scale`方案
    - 移除原始用于`1px`方案的`$setting is-ios-1pixel`设置

    > 原因：
    >
    > 1. 原方案利用viewport缩放（需引入额外的js），这会改变layout viewport尺寸，进而影响响应式设计；
    > 2. 原方案安卓未实现，因为Android4.3及以下不支持initial-scale除1之外的设置；
* (*)change: `bordercolor`变量
    - 将所有带`bordercolor`关键字的变量都重命名为`border-color`，因为早期的时候命名不严谨导致吐槽激烈，特在此大版本中全部修正
* (*)change:
    - 不再强制要求升级`Yo`时业务对比`config`和`variables`的一致性；
    - 需要注意的是`variables`中`map`使用`_`开头，而`config`中不需要`_`，例如：`$_list` -> `$list`；
    - 从`variables`中将`base map`拆分到新文件`base`，同时在`config`中新增`extra`文件用以对应该文件；
    - 用户可以在`extra`文件中配置，扩展或者新增`map`；
* change: `yo-btn`
    - 将原来统一的灰色禁用按钮更改为每个按钮的禁用外观取决于自身的本来颜色
* change: `yo-number`
    - 移除`$disabled-sign-color`参数；
    - 新增`$outer-radius`参数；
    - 新增`$outer-border-width`参数；
    - 新增`$inner-radius`参数；
    - 新增`$inner-border-width`参数；
    - 新增`$font-size`参数；
* change: `yo-flex`
    - 移除`$box`参数；
* change: `wrap` mixin
    - 新增`$is-wrap`参数（Boolean），用于指定文本遇见边界时是否换行；
* change: `yo-list`
    - 新增`$detail-font-size`参数，用于指定详情区域的字号；
    - 新增`$detail-color`参数，用于指定详情区域的文本色；
    - 新增`$info-font-size`参数，用于指定描述区域的字号；
    - 新增`$info-color`参数，用于指定描述区域的文本色；
    - 新增`$more-font-size`参数，用于指定更多区域的字号；
    - 新增`$more-color`参数，用于指定更多区域的文本色；
* update: 内部处理`yo-rating`, `yo-score`, `yo-range`在Node-Sass3.4.1-3.42下编译出错的问题

### 删除
* del: `alignment` mixin
* del: `valign` mixin

**再次重申：将你的`flex子项`设置为`非行内级元素`，Yo会缓步移除对这种内部容错的代码**

## v1.8.7（2015.10.23）

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.7)

* update: `yo-datepicker`
    - 为`weeks`容器添加`relative`
    - 解决`disabled`状态被扩展覆盖的问题

## v1.8.6（2015.10.16）

[Tagged on Github.](https://github.com/doyoe/Yo/releases/tag/v1.8.6)

* update: `yo-btn`
    - 更新`config`对于`yo-btn`的高度和字号设置
* rename: `yo-dblist`
    - 重命名 `yo-dblist` 为 `yo-doublelist`。**业务回归请注意**

## v1.8.5 (2015.10.8)

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