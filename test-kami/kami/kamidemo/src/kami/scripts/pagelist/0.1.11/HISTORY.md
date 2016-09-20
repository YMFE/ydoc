# 历史记录

---


## 0.0.1
first commit

## 0.0.2
修复无限循环BUG

## 0.0.3
刷新数据和加载更多使用YO提供的样式，并且提供默认的模板

## 0.0.4
提供onReady事件，在render完成后触发

## 0.0.5
增加选项：selectedClass，可以定义选中后的样式

## 0.0.6
取消通过datasource.length与pagesize的比较来限制是否可以加载更多

## 0.1.0
优化了加载更多的交互效果，现在一拉到地步就会自动触发加载更多

## 0.1.1
优化了刷新或加载更多时的交互效果，如果刷新中或加载更多中发生了滑动，则不触发默认的滑动事件
* 刷新自动滑动到头部
* 加载更多自动向下滑动20像素
* 刷新或者加载数据时，如果data.length < pagelist.pagesize 将禁止加载更多

## 0.1.2
新增了属性：nodataViewData 和方法：reloadNodataView，允许重新渲染没有数据时显示的模板

## 0.1.3
* 调整refresh()和loadmore()两个方法的传参
* 增加了tapInterval参数，可以控制两次tap事件之间的触发间隔
* 修复了infinite: true时的闪屏问题

## 0.1.4
* fix bug: 修复了加载更多显示位置有误的问题

## 0.1.5
* infinite模式下，列表项个数不再由pagesize决定，而是由容器高度决定，默认为容器可显示的列表项+3
* fix bug: infinite模式下，列表项的自定义属性没有同步更新
* fix bug: infinite模式下，滚动容器里除了列表外其他的元素高度计算有误

## 0.1.6
* fix bug: infinite模式下，第一个item项的顶部无法点击
* fix bug: infinite模式下，加载更多操作时，用户进行了滚动操作，可能无法取到bottomElem导致报错

## 0.1.7
* fix bug: infinite模式下，没有更多数据显示位置有误

## 0.1.8
* fix bug: 刷新时，如果异步请求时间小于300毫秒，并且refreshResultDelay参数设置的时间也小于300，
可能会导致刷新后列表不会回弹到正确位置。
* 新增参数compiler，可以自定义模板编辑器，例如Hogan: compiler: Hogan.compile

## 0.1.9
* fix bug: infinite模式下，如果滚动容器里配置了data-role="extra"，滚动可能造成空白块
* fix bug: 在列表还在滚动的情况下调用pagelist.reloadData(data)，列表无法正确回滚到头部


## 0.1.11

`add` 暴露`setPageNum`方法，可以修改pageNum