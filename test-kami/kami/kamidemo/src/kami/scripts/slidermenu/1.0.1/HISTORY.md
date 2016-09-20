# 历史记录

---


## 0.0.1

`add` 滑动menu组件


## 0.0.2

`modify` 修改组件根据最初的滑动偏移判断是否可以出发横向滚动，配合pagelist使用时，需要将slidermenu的纵向滚动锁掉，以免和pagelist冲突

## 0.0.3

`modify` 修复新节点没有initX的问题


## 0.0.4

`modify` 修复target问题，添加disable状态


## 0.0.5

`fix` 向右滑动时，滑动距离超过 `allowance` 但是无法自动滑到右侧的bug
`add` `lockY` 选项，默认为 `true`， 让用户能够设置是否需要锁定Y方向的滚动。配合pagelist组件使用需要设置为true

## 0.0.6

`add` `setOpen`方法，可以让其他组件手动的设置menu的状态
`modify` `close` menu的阈值设置为0，使触发close很容易


## 0.0.7

`add` `disable` 状态的 `get` 和 `set`方法
`modify` 当组件处于 `disabled` 状态时不允许设置组件的 `open` 状态

## 0.0.8

`fix` slidermenu的initX bugs

## 0.0.9

`fix` 修复获取transitionX获取正则问题

## 0.0.10

`fix` destroy拼写错误
`add` cancleTapBubble 设置为true后主动的禁止冒泡
`modify` 默认的组件lockY修改为false， 添加setLockY方式设置组件是否锁住
`fix` 某些android手机tranlate后不触发gpu绘制
`fix` 与pagelist的组合使用时出现的问题，目前是优先pagelist使用
`add` transtion类来实现动画


## 0.0.11
`add` 添加slidermenu的互斥逻辑
`fix` 禁止tap事件的冒泡

## 0.0.12
`add` 暴露open可监听事件

## 1.0.0

发布稳定版本

## 1.0.1

`fix` 修复 `getOpen` 方法的bug
