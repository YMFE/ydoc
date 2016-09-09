### 简介

插件名称: `basic`

基础插件组，主要用于视图的展现效果，
通过 open 和 show 中配置 ani 使用，
其中包括 dialog, actionSheet, popup 三个动画插件。

PS: **moveEnter** 插件放到 `QApp` 核心包内，作为默认效果。

### MoveEnter 插件说明

插件名称: `moveEnter`

插件配置：`{Object}`

基本配置如下:

```
{
    "autoHide": true,
    "position": "right",
    "distance": 0,
    "duration": 300
}
```

配置参数：

* `autoHide`: `{Boolean}` 是否自动隐藏。 默认 `true` 。
* `position`: `{String}` 从何方移入。 默认 `right` 。可能的值 `right` | `left`
* `distance`: `{Number}` 移入距离。 默认 `0`。 （如果为 `0`， 自动获取视图的对应尺寸作为 `distance`， 当 `App` 的 `type` 为 `mobile` 时，默认全屏尺寸）
* `duration`: `{Number}` 动画效果时长。 默认 `300`。

#### 重写或添加的方法

重写 `show` 和 `hide` 方法，两个方法均没参数。

### Dialog 插件说明

插件名称: `dialog`

插件配置：`{Object}`

基本配置如下:

```
{
    "autoHide": false,
    "maskColor": "#000",
    "maskOpacity": "0.4",
    "duration": 200,
    "width": 0,
    "height": 0
}
```

配置参数：

* `autoHide`: `{Boolean}` 是否自动隐藏。 默认 `false` 。
* `maskColor`: `{String}` 蒙层颜色。 默认 `#CCC` 。
* `maskOpacity`: `{String}` 蒙层透明度。 默认 `0.5`。
* `duration`: `{Number}` 动画效果时长。 默认 `300`。
* `width`: `{Number}` `dialog` 宽度。 默认 `0`。（如果为 `0`， 自动获取视图的宽度）
* `height`: `{Number}` `dialog` 高度。 默认 `0`。（如果为 `0`， 自动获取视图的高度）

#### 重写或添加的方法

重写 `show` 和 `hide` 方法，两个方法均没参数。

### Popup 插件说明

插件名称: `popup`

插件配置：`{Object}`

基本配置如下:

```
{
  "autoHide": true,
  "autoDirection": true,
  "direction": "right",
  "duration": 100,
  "width": 0,
  "height": 0,
  "position": "center"
}
```

配置参数：

* `autoHide`: `{Boolean}` 是否自动隐藏。 默认 `true` 。
* `autoDirection`: `{Boolean}` 自动选择方向。 默认 `true` 。
* `direction`: `{String}` 从何方移入。 默认 `right` 。可能的值 `right` | `left` | `top` | `bottom`
* `duration`: `{Number}` 动画效果时长。 默认 `100`。
* `width`: `{Number}` `popup` 宽度。 默认 `0`。
* `height`: `{Number}` `popup` 高度。 默认 `0`。
* `position`: `{String}` 上下显示时的居中情况。 默认 `center` 。可能的值 `center` | `right` | `left`

#### 重写或添加的方法

重写 `show` 和 `hide` 方法，`show`方法有参数，要指定显示时相对应的 `element`。

### ActionSheet 插件说明

插件名称: `actionSheet`

插件配置：`{Object}`

基本配置如下:

```
{
  "autoHide": true,
  "distance": 0,
  "duration": 200,
  "showMask": true,
  "maskColor": "#000",
  "maskOpacity": "0.4"
}
```

配置参数：

* `autoHide`: `{Boolean}` 是否自动隐藏。 默认 `false` 。
* `distance`: `{Number}` 移入距离。 默认 `0`。
* `duration`: `{Number}` 动画效果时长。 默认 `200`。
* `showMask`: `{Booleamn}` 是否显示蒙层。 默认 `true`。
* `maskColor`: `{String}` 蒙层颜色。 默认 `#000` 。
* `maskOpacity`: `{String}` 蒙层透明度。 默认 `0.4`。

#### 重写或添加的方法

重写 `show` 和 `hide` 方法，两个方法均没参数。

添加 `refresh` 方法，在 view 高度发生变化时刷新 view。
