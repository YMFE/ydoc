## ListView

ListView 是一个核心组件，用来高效地显示纵向滚动的变化数据的列表。最基本的使用方式是创建一个 `ListView.DataSource` 数据源，并填充一组数据，用该数据源来初始化一个 `ListView` 组价，并提供一个 `renderRow` 回调函数，该函数接受数据源中的单个数据作为参数，并返回一个可渲染的组价，作为 List 的子项。

最简单的例子：

```javascript
getInitialState: function() {
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  return {
    dataSource: ds.cloneWithRows(['row 1', 'row 2']),
  };
},

render: function() {
  return (
    <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <Text>{rowData}</Text>}
    />
  );
},
```

ListView 还支持一些高级特性，包括设置分段粘性头部（滚动到一定位置，会有一项固定在顶部），列表头部和尾部，列表滚动到底部的回调（`onEndReached`）以及在视野中可见项变化时候的回调（`onChangeVisibleRows`），还有一些性能优化措施。

下面是一些性能优化措施让 ListView 在加载大量数据的时候也能平滑地滚动：

- 仅仅重新渲染变化的子项。可以提供一个 `rowHasChanged` 函数给数据源，它告诉 ListView 当数据源变化时是否需要重新渲染某一行，详细使用方法参见对 `ListView.DataSource` 的说明。
- 限制单行数据的渲染频率。默认情况下，在一次事件循环中仅重新渲染一行数据（可以使用 `pageSize` 属性来配置），这将大量的渲染工作分散为小块来处理，以减小丢帧的可能性。

#### 属性

[ScrollView Props...](http://facebook.github.io/react-native/docs/scrollview.html#props)

##### dataSource <small>ListView.DataSource</small>

一个 `ListView.DataSource` 的实例，用来给 ListView 提供数据源

##### initialListSize <small>number</small>

指定初始阶段渲染的行数。使用该属性来让首屏显示合适的行数，而不是使用很多帧才将首屏显示出来。

##### onChangeVisibleRows <small>function</small>

`(visibleRows, changedRows) => void`

当可见的行的集合变化的时候调用此回调函数。visibleRows 以 { sectionID: { rowID: true }} 的格式包含了所有可见行，而changedRows 以{ sectionID: { rowID: true | false }} 的格式包含了所有刚刚改变了可见性的行，其中如果值为true表示一个行变得可见，而为false表示行刚刚离开可视区域而变得不可见。

方法参数:

|参数名 | 类型 | 描述 | 必选 | 版本|
|:-----|:----|:----|:----|:----|
|visibleRows | object | 当前可见行|
|changedRows | object | 可见状态改变的行|

##### onEndReached <small>function</small>

当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用。原生的滚动事件会被作为参数传递。

##### onEndReachedThreshold <small>number</small>

调用 `onEndReached` 之前的临界值，单位是像素。

##### pageSize <small>number</small>

每次事件循环（每帧）渲染的行数。

##### renderFooter <small>function</small>

`() => renderable`

页头与页脚会在每次渲染过程中都重新渲染（如果提供了这些属性）。如果它们重绘的性能开销很大，可以考虑使用renderStaticHeader/renderStaticFooter。页脚会永远在列表的最底部，而页头会在最顶部。


##### renderHeader <small>function</small>
`() => renderable`

同renderFooter，渲染页尾组件。

##### renderStaticFooter <small>function</small>
`() => renderable`

只渲染一次的头部组件。

##### renderStaticHeader  <small>function</small>
`() => renderable`

只渲染一次的尾部组件。

##### renderRow  <small>function</small>
`(rowData, sectionID, rowID, highlightRow) => renderable`

从数据源(Data source)中接受一条数据，以及它和它所在section的ID。返回一个可渲染的组件来为这行数据进行渲染。默认情况下参数中的数据就是放进数据源中的数据本身，不过也可以提供一些转换器。

方法参数:

|参数名	|类型	|描述|
|:-----|:----|:----|
|rowData	|React.PropTypes.any|数据源中的数据|
|sectionID	|string	|所处section名|		
|rowID	|number	|所处section中的index|		
|highlightRow	|function	|通过调用该函数可通知ListView高亮该行|	

##### renderScrollComponent <small>function</small>
`(props) => renderable`

指定一个函数，在其中返回一个可以滚动的组件。ListView将会在该组件内部进行渲染。默认情况下会返回一个包含指定属性的ScrollView。

方法参数:

|参数名|类型|
|:----|:---|
|可滚动组件的属性|object|
	
##### renderSeparator <small>function</small>
`(sectionID, rowID, adjacentRowHighlighted) => renderable`

如果提供了此属性，一个可渲染的组件会被渲染在每一行下面，除了小节标题的前面的最后一行。

方法参数:

|参数名|类型	|描述|
|:---|:---|:----|
|sectionID|string	|所处section名|	
|rowID|number	|所处section中的index|		
|adjacentRowHighlighted|bool|邻近的行是否被高亮|	

##### scrollRenderAheadDistance <small>number</small>
当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。

##### useOriginScrollView <small>bool</small>
如果提供了此属性， 会使用原生ScrollView，配置了renderScrollComponent时不生效。

##### scrollEventThrottle <small>bool</small>
触发onScroll最小间隔毫秒数，默认值为50。

#### 方法

##### getScrollResponder
获取ScrollView，当使用原生ScrollView时(useOriginScrollView属性为true)返回滚动响应器。

##### startRefreshing
同ScrollView，当前组件有refreshControl属性，并且没有正在下拉刷新，则强制触发下拉刷新，变成正在刷新的状态。

##### stopRefreshing
同ScrollView，当前组件有refreshControl属性，并且正在下拉刷新，则停止下拉刷新的状态。

##### startLoading
同ScrollView，当前组件有loadControl属性，并且没有正在加载，则强制触发加载更多，变成正在加载更多的状态。

##### stopLoading
同ScrollView，当前组件有loadControl属性，并且正在加载，则停止加载更多的状态。

##### scrollToTop
返回顶部，可通过{animated: true}开启动画。可以参考这个例子。
