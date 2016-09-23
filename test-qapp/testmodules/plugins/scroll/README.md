#### 简介

插件名：`scroll` （同时包含`scroll`组件）

说明：滚动插件，对 `iScroll` 进行封装，包含 `nScroll` 和 `avalon.iscroll`，并包括 `scroll` 组件。

`QApp` 中滚动依赖库为 `iScroll`， 版本是 `probe` `5.1.3` 版，文档 [iscrolljs.com](http://iscrolljs.com/)。

希望使用 `scroll` 的同学可以了解一下 `iscroll`，这个组件是世界上**最好**的前端滚动组件，**没有之一**。

这里列一下 `iscroll` 必须 `注意` 的问题：（一般情况）

* 滚动的父容器，同时也是 `iScroll` 配置的第一个参数 `el`，此元素必须是 `可单独计算高度` 的，也就是不依赖于内部元素的。（当然你横向滚动时，需要的是宽度）
* 父容器应该是 `overflow:hidden` 的，这样可以显示成内部区域可滚动。
* 父容器需包含一个子节点`container`用来滚动，**这是 `iScroll` 约定的**，这个节点的`size`是滚动计算的依据。

对于目前业务中的可动态加载的大列表，进行了优化，添加了懒加载功能。
使用的是基于`iscroll`自己编写的`nscroll`组件。

#### 如何使用

最常用的方式是通过组件的方式。

开发者可以用在父容器上添加 `qapp-widget="scroll"` 的方式使用，此时父容器需要定高。

#### 有关Avalon

由于业务中多使用 `avalon` ，所以自己额外开发了`avalon.iscroll`组件。

对于`avalon.iscroll`的说明如下：

* 添加 `ms-iscroll` 命令， 值为 `id, opt`, 和`avalon.oniui`类似。

如果使用加载功能：

* `dom` 需要结构与 `iscroll` 相同，因此，孙子节点应该是`ms-repeat`元素。
* 因为要计算位置，所以每个元素的初始位置都应该是`(0, 0)`，不论怎么实现（`absolute`或使用`margin`进行偏移）。
* 在定义`vm`时，如果是循环元素是`list`，那么需要用户主动添加僵尸元素`list$`。
