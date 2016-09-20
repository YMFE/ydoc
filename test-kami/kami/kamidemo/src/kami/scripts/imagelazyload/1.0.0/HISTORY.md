# 历史记录

---


## 0.0.1

`add` 图片懒加载组件，支持普通window.onscroll和类似于iscroll的滚动方式

`add` autoStoreSrc 设置，如果为`true`则自动拆掉dom中src并缓存到data-src中，如果为`false`则是用户自己将链接预写在data-src里面。

`modify` lazyload 方法增加itemoffset参数，用于传入img的偏移

`delate` 去掉事件绑定时的计时器，便于及时触发lazyload

`add` refresh 容器中的img标签

## 0.0.2

`add` lazyload()不传参数情况下默认使用上次调用的translateY值进行计算

`modify` img在可视区域内的计算方式

`add` unloadImg ｜ errorImg ｜loadingClass 属性 分别设置为加载状态下默认图片，加载时的样式 和加载失败时候的图片

`add` checkout 函数判断imgsrc是否生效 并做逻辑判断

`add` 增加图片加载效果 默认为fade. 使用 effect:extra 并且写入 effectclasslist 来自定义出场动画

`fixed` 对img数组为空进行判断

`add` scanandload 函数 兼顾scan and lazyload 传参方式和lazyload一致

`add` effext 动画效果设置 支持 none extra 和 default(默认) extra 的时候需要配合使用effectclasslist 添加类名数组来实现动画效果 具体可以参考pagelistImglazyload demo 

## 1.0.0

发布稳定版本