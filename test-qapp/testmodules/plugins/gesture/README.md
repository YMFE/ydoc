#### 简介

插件名称: `gesture` (手势库)

#### 说明


现在支持轻触(tap)，双轻触(doubletap)，长按(press)，快滑(flick)，滑动(pan)。

扩展支持双指缩放(pinch)。

### 事件名和参数

对于每个事件，事件对象里都有以下属性：`screenX`， `screenY`， `clientX`， `clientY`， `pageX`， `pageY`。

* 轻触 ：`tap`
* 双轻触 ：`doubletap`
* 长按 ：`press`、`pressend`
* 触摸 ：`feel`
* 轻滑 ：`flick`  | 拓展属性：`offsetX`、`offsetY`、`speedX`、`speedY`、`duration`、`degree`、`directions`
* 滑动 ：`pan`、`panend` | 扩展属性：`offsetX`、`offsetY`、`degree`、`directions` | `panend` 包含扩展属性： `speedX`、`speedY`、`duration`
* 缩放 ：`pinch`、`pinchend` | 扩展属性：`scale`


### 事件触发说明：

#### tap / doubletap / press / feel 触按事件

* 用户触碰屏幕，并且位移距离小于 **10**，则会判定为触按事件。
* 用户开始触碰屏幕和结束触碰直接时差小于 **200ms** ，则会被判定为tap事件，反之被判定为press事件。
* tap和press事件 *不会被同时触发* 。
* 如果两次tap事件的时间差小于 **500ms**，则会被判定为doubletap事件。
* doubletap事件和tap事件 *会同时触发*，doubletap会在第二次tap事件 *之前* 触发。
* feel即触即触发，和tap、press并行。

#### flick / pan 滑动事件

* 用户点击屏幕，并且位移距离大于 **10**，则会判定为滑动事件。
* 用户开始触碰屏幕和结束触碰直接时差小于 **300ms** ，则会被判定为flick事件。
* flick和press事件 *会被同时触发* 。
* flick会在pressend事件 *之后* 触发。
* degree属性基准为水平向右坐标轴，顺时针方向，单位是 **角度**。
* directions为滑动方向，为一个 *数组*：
  * 元素值为：`up`、`down`、`left`、`right`；
  * 第一个元素为 **主方向**，第二个元素是 **副方向**；
  * 当实际方向与主方向的夹角小于 **15度** 时，不存在副方向。

#### pinch 缩放事件

* 用户双指点击屏幕，并且移动，直接距离变化量大于 **10**，则会判定为缩放事件。
