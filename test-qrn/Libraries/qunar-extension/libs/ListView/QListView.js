/**
 * @providesModule QListView
 * @flow
 */
'use strict';

import React, {Component, ScrollView, View, Dimensions} from 'qunar-react-native'
import {ScrollView as ScrollViewOrigin} from 'react-native'
import ListViewDataSource from 'ListViewDataSource'
import StaticRenderer from 'StaticRenderer'

var RCTUIManger = require('NativeModules').UIManager

const ROW_TYPES = {
	ROW: 'row',
	SECTION_HEADER: 'sectionHeader',
}
const SCROLL_DIRECTION = {
	UP: 'up',
	DOWN: 'down',
}
const INITIAL_VACANCY_HEIGHT = 0
const SCROLL_VIEW = 'scrollView'

/**
 * 高效数据列表
 *
 * @component ListView
 * @example ./Playground/js/Examples/ListViewExample/RefreshControl.js[1-191]
 * @version >=v1.0.0
 * @description 最基本的使用方式就是创建一个ListView.DataSource数据源，然后给它传递一个普通的数据数组，再使用数据源来实例化一个ListView组件，并且定义它的renderRow回调函数，这个函数会接受数组中的每个数据作为参数，返回一个可渲染的组件（作为listview的每一行）。
 *
 * 注：该版本暂时不支持renderSectionHeader和scrollTo。
 *
 * #### 与官方ListView性能对比(官方已开启removeClippedSubviews)
 *
 * ##### 图文列表200行 iPhone5C IOS9.3.2
 *
 * | 使用组件 | 渲染前内存 | 渲染后内存 | 平均帧数 |
 * | --------| --------- | --------- | ------- |
 * | QRN ListView | 50.21MB | 64.27MB | 30~50fps |
 * | 官方 ListView | 51.33MB | 84.28MB | 10~30fps |
 *
 * ![ListView](./images/component/ListView/QListView_200_rows_1.png)
 * ![ListView](./images/component/ListView/ListView_200_rows_1.png)
 *
 * ##### 图文列表500行 iPhone5C IOS9.3.2
 *
 * | 使用组件 | 渲染前内存 | 渲染后内存 | 平均帧数 |
 * | --------| --------- | --------- | ------- |
 * | QRN ListView | 50.39MB | 67.86MB | 20~40fps |
 * | 官方 ListView | 50.18MB | 133.40MB | 5~20fps |
 *
 * ![ListView](./images/component/ListView/QListView_500_rows_1.png)
 * ![ListView](./images/component/ListView/ListView_500_rows_1.png)
 */
class ListView extends React.Component {
	constructor(props) {
		super(props)

		const rowsInfo = this.getRowsInfo(this.props.dataSource)
		this.keyCount = -1
		this.visibleRows = {} // for onChangeVisibleRows
		this.aboveListBottom = true // for onEndReached
		this.visibleSectionIds = [] // for stickyHeaderIndices
		this.disableOnScroll = false
		this.willUnmount = false

		this.scrollDirection = SCROLL_DIRECTION.DOWN
		this.windowHeight = Dimensions.get('window').height

		this.rowsHeightTotal = 0
		this.containerHeight = 0
		this.containerTop = 0
		this.commonRowHeight = -1

		// insert first row
		let rows = []
		for(let i = 0; i < props.initialListSize; i++){
			if(rowsInfo[i]){
				rowsInfo[i].key = this.getUniqueKey()
				rows.push(rowsInfo[i])
			}
		}

		this.state = {
			rowsInfo,
			rows,

			startRenderLine: -props.scrollRenderAheadDistance,
			endRenderLine: 0,

			topPlaceholderHeight: 0,
			bottomPlaceholderHeight: 0,
			separatorHeight: 0,

			listOpacity: 0,
			settedScrollResponderProps: {},
		}
	}

	static DataSource = ListViewDataSource;

	componentWillReceiveProps (nextProps) {
		// TODO 加上别的属性的检查,如renderRow....
		if (this.props.dataSource !== nextProps.dataSource) {
			let {rows} = this.state,
				newRows = [],
				rowsInfo = this.getRowsInfo(nextProps.dataSource)

			this.rowsHeightTotal = 0

			rows.forEach((row) => {
				rowsInfo.forEach((rowInfo) => {
					if(row.id === rowInfo.id) {
						// 保持原有row的状态
						rowInfo.y = row.y
						rowInfo.key = row.key
						rowInfo.height = row.height

						this.rowsHeightTotal += row.height
						newRows.push(rowInfo)
					}
				})
			})

			// if no content, insert first row
			if(rows.length === 0){
				for(let i = 0; i < this.props.initialListSize; i++){
					if(rowsInfo[i]){
						rowsInfo[i].key = this.getUniqueKey()
						newRows.push(rowsInfo[i])
					}
				}
			}

			// if insert more rows
			if(rowsInfo.length > newRows.length && this.state.bottomPlaceholderHeight === 0){
				rowsInfo[newRows.length].key = this.getUniqueKey()
				newRows.push(rowsInfo[newRows.length])
			}

			this.setState({
				rowsInfo,
				rows: newRows
			})
		}
	}

	componentDidMount() {
		// ensure screen not empty
		setTimeout(() => {
			let {listOpacity} = this.state
			if(listOpacity === 0){
				this.setState({
					listOpacity: 1
				})
			}
		}, 500)
	}

	onRowHighlighted(sectionID, rowIndex) {
		this.setState({highlightedRow: {sectionID, rowIndex}})
	}

	onLayoutContainer(event) {
		this.containerHeight = event.nativeEvent.layout.height
	}

	onScroll(e, silent) {
		if(typeof this.props.onScroll === 'function' && silent !== true){
			this.props.onScroll(e)
		}

		if(this.disableOnScroll){
			return
		}

		const {scrollRenderAheadDistance, pageSize} = this.props
		const startRenderLine = e.nativeEvent.contentOffset.y - scrollRenderAheadDistance,
			endRenderLine = e.nativeEvent.contentOffset.y + this.containerHeight + scrollRenderAheadDistance

		this.containerTop = e.nativeEvent.contentOffset.y

		// 确定滑动方向
		if(startRenderLine > this.state.startRenderLine){
			this.scrollDirection = SCROLL_DIRECTION.DOWN
		} else{
			this.scrollDirection = SCROLL_DIRECTION.UP
		}

		let {rows, rowsInfo, separatorHeight} = this.state,
			needUpdateRows = false,
			pageCount = 0,
			spareRows = {}

		if(this.scrollDirection === SCROLL_DIRECTION.DOWN){
			for(let i = 0; i < rows.length; i++){
				let row = rows[i],
					rowType = row.recycleType || row.rowType

				// 确定上方哪些rows要移除
				if(row.y + row.height < startRenderLine && row.key){
					// sectionHeader不回收
					if(rowType !== ROW_TYPES.SECTION_HEADER){
						spareRows[rowType] ? spareRows[rowType].push(row) : spareRows[rowType] = [row]
					}
				}

				// 确定下方哪些rows要重新显示
				else if(row.y > startRenderLine && row.y + row.height < endRenderLine && !row.key){
					if(spareRows[rowType] && spareRows[rowType].length > 0 && pageCount < pageSize){
						// 展示新row
						let spareRow = spareRows[rowType].shift()
						row.key = spareRow.key
						row.shouldUpdate = true

						spareRow.key = null

						pageCount++
						needUpdateRows = true
					}
				}
			}

			// 添加rows直到超过endRenderLine
			const lastRow = rows[rows.length - 1]
			let pushingNewRow = false
			if(lastRow && lastRow.y + lastRow.height < endRenderLine){

				// 要添加pushRowNum行，才能补足高度
				const pushRowNum = Math.floor((endRenderLine - lastRow.y) / lastRow.height)
				for(let i = 1; i <= pushRowNum; i++){
					if(rowsInfo[lastRow.id + i] && pageCount < pageSize){
						let newRowId = rows[rows.length - 1].id + 1,
							row = rowsInfo[newRowId],
							rowType = row.recycleType || row.rowType

						// 如果有spare key
						if(spareRows[rowType] && spareRows[rowType].length > 0){
							let spareRow = spareRows[rowType].shift()

							row.key = spareRow.key
							row.shouldUpdate = true
							rows.push(row)

							// 隐藏行
							spareRow.key = null
						} else {
							// 没有spare key，要自己生成key
							row.key = this.getUniqueKey()
							rows.push(row)
						}

						needUpdateRows = true
						pushingNewRow = true
						pageCount++
					}
				}
			}

			// 判断是否到达底部
			const {onEndReached, onEndReachedThreshold} = this.props
			if(onEndReached){
				const containerBottom = e.nativeEvent.contentOffset.y + this.containerHeight + onEndReachedThreshold,
					lastRowPosition = lastRow.y + lastRow.height + separatorHeight

				if(containerBottom >= lastRowPosition && this.aboveListBottom && this.scrollDirection === 'down' && !pushingNewRow){
					onEndReached(e)
					this.aboveListBottom = false
				} else if(containerBottom < lastRowPosition){
					this.aboveListBottom = true
				}
			}

		} else if(this.scrollDirection === SCROLL_DIRECTION.UP){
			for(let i = rows.length - 1; i >= 0; i--){
				let row = rows[i],
					rowType = row.recycleType || row.rowType

				// 隐藏最下面的rows
				if(row.y > endRenderLine && row.key){
					spareRows[rowType] ? spareRows[rowType].push(row) : spareRows[rowType] = [row]
				}

				// 确定上方哪些rows要重新显示
				else if(row.y < endRenderLine && row.y + row.height > startRenderLine && !row.key){
					if(spareRows[rowType] && spareRows[rowType].length > 0 && pageCount < pageSize){

						let spareRow = spareRows[rowType].shift()
						row.key = this.getUniqueKey() // TODO performance problem here, use this.getUniqueKey() faster
						row.shouldUpdate = true

						// 隐藏下方row
						spareRow.key = null

						pageCount++
						needUpdateRows = true
					}
				}
			}
		}

		// 计算下补白的高度
		let bottomPlaceholderHeight = 0
		for(let i = rowsInfo.length - 1; i >= 0; i--) {
			if(!rowsInfo[i].key) {
				bottomPlaceholderHeight += rowsInfo[i].height || this.commonRowHeight
			} else if(rowsInfo[i].rowType === ROW_TYPES.ROW && rowsInfo[i].key){
				break
			}
		}

		// 计算上补白的高度
		let topPlaceholderHeight = 0
		for(let i = 0; i < rowsInfo.length; i++){
			if(!rowsInfo[i].key) {
				topPlaceholderHeight += rowsInfo[i].height || this.commonRowHeight
			} else if(rowsInfo[i].rowType === ROW_TYPES.ROW && rowsInfo[i].key){
				break
			}
		}

		if(needUpdateRows) {
			this.setState({
				startRenderLine,
				endRenderLine,
				rows,
				topPlaceholderHeight,
				bottomPlaceholderHeight,
			})
		} else {
			this.setState({
				startRenderLine,
				endRenderLine,
				topPlaceholderHeight,
				bottomPlaceholderHeight,
			})
		}
	}

	onLayoutRow(row, event) {
		let {rows, rowsInfo, listOpacity} = this.state
		const {initialListSize} = this.props

		this.rowsHeightTotal += event.nativeEvent.layout.height
		row.y = event.nativeEvent.layout.y
		row.height = event.nativeEvent.layout.height

		if(this.containerHeight === 0) {
			RCTUIManger.measure(React.findNodeHandle(this.refs[SCROLL_VIEW]), (x, y, width, height) => {
				this.containerHeight = height
				checkIfCoverScreen.bind(this)()
			})
		} else {
			checkIfCoverScreen.bind(this)()
		}

		if(this.commonRowHeight === -1){
			this.commonRowHeight = row.height
		}

		function checkIfCoverScreen() {
			const heightNotCoverScreen = this.rowsHeightTotal < this.windowHeight

			if( listOpacity === 0
				&& (rows.length >= initialListSize || !heightNotCoverScreen || rows.length === rowsInfo.length)
				&& !this.willUnmount
			) {
				this.setState({
					listOpacity: 1
				})
			}

			if(heightNotCoverScreen || rows.length < initialListSize) {
				this.getNewRowFromInfo(row.id + 1)
			}
		}
	}

	onLayoutParts(e, partName) {
		this.setState({
			[partName + 'Height']: e.nativeEvent.layout.height
		})
	}

	/**
     * 获取底层滚动响应器
     *
     * @method getScrollResponder
	 * @description 获取ScrollView，当使用原生ScrollView时(useOriginScrollView属性为true)返回滚动响应器。
     * @returns {scrollResponder} ScrollView，当使用原生ScrollView时返回滚动响应器
     */
	getScrollResponder() {
		const scrollComponent = this.refs[SCROLL_VIEW]
		if (scrollComponent) {
			if(scrollComponent.getScrollResponder) {
				return scrollComponent.getScrollResponder()
			} else{
				return scrollComponent
			}
		}
	}

	setNativeProps(props: Object) {
		if (this.props.useOriginScrollView) {
			this.getScrollResponder().setNativeProps(props);
		} else {
			this.setState({
				settedScrollResponderProps: Object.assign(this.state.settedScrollResponderProps, props)
			})
		}
	}

	/**
     * 开始下拉刷新
     *
     * @method startRefreshing
     * @description 同ScrollView，当前组件有refreshControl属性，并且没有正在下拉刷新，则强制触发下拉刷新，变成正在刷新的状态。
     */
    startRefreshing(config) {
		if(this.refs[SCROLL_VIEW].startRefreshing){
			this.refs[SCROLL_VIEW].startRefreshing(config)
		}
	}

	/**
     * 停止下拉刷新
     *
     * @method stopRefreshing
     * @description 同ScrollView，当前组件有refreshControl属性，并且正在下拉刷新，则停止下拉刷新的状态。
     */
    stopRefreshing(config = {}) {
		const {refreshControl} = this.props,
			ScrollView = this.refs[SCROLL_VIEW]

		if(refreshControl){
			if(this.containerTop > this.windowHeight){
				this.scrollToTop({animated: false})
				ScrollView && ScrollView.stopRefreshing()
			} else{
				ScrollView && ScrollView.stopRefreshing()
			}
		}
	}

	/**
     * 开始加载更多
     *
     * @method startLoading
     * @description 同ScrollView，当前组件有loadControl属性，并且没有正在加载，则强制触发加载更多，变成正在加载更多的状态。
     */
    startLoading(config) {
		if(this.refs[SCROLL_VIEW].startLoading){
			this.refs[SCROLL_VIEW].startLoading(config)
		}
	}

	/**
     * 停止加载更多
     *
     * @method stopLoading
     * @description 同ScrollView，当前组件有loadControl属性，并且正在加载，则停止加载更多的状态。
     */
    stopLoading(config) {
		if(this.refs[SCROLL_VIEW].stopLoading){
			this.refs[SCROLL_VIEW].stopLoading(config)
		}
	}

	scrollTo(pos) {
		const ScrollView = this.refs[SCROLL_VIEW],
			DISTANCE = pos.y,
			TRIGGER_TIMES = 5,
			TRIGGER_START_TIME = 800,
			TRIGGER_INTERVAL = 200

		if(ScrollView){
			ScrollView.scrollTo(pos)
		}

		// 如果跳转比较远，需要重新trigger onScroll, 计算渲染哪些行
		for(let i = 1; i <= TRIGGER_TIMES; i++){
			triggerRerender.bind(this)(DISTANCE + i, TRIGGER_START_TIME + TRIGGER_INTERVAL * i)
		}

		function triggerRerender(distance, timeout) {
			setTimeout(() => {
				this.onScroll({
					nativeEvent: {
						contentOffset: {y: distance}
					}
				}, true)
			}, timeout)
		}
	}

	/**
	 * 返回顶部
	 *
	 * @method scrollToTop
	 * @description 返回顶部，可通过{animated: true}开启动画。可以参考这个[例子](http://gitlab.corp.qunar.com/react_native/qunar_react_native/blob/js_base_component/Examples/Playground/js/Examples/ListViewExample/ImageTextList.js)。
	 */
	scrollToTop(options={}) {
		const topPosition = this.props.refreshControl ? this.props.refreshControl.props.height : 0

		let {rows} = this.state,
			jumpIndex = 0

		if(options.animated){
			// 获取中间位置
			for(var row of rows){
				if(row.key){
					jumpIndex = Math.floor(row.id / 2)
					break
				}
			}

			// 如果超过一屏，则逐渐跳到顶部，否则平滑滚动
			if(this.containerTop > this.windowHeight) {
				this.disableOnScroll = true
				jumpTo.bind(this)(jumpIndex)
			} else {
				this.refs[SCROLL_VIEW].scrollTo({y: topPosition})
			}
		} else{
			jumpTo.bind(this)(0)
		}

		this.refs[SCROLL_VIEW].scrollTo({y: topPosition, animated: false})

		function jumpTo(index) {
			let newRows = [],
				newRowsHeight = 0
			for(var i = index; i < rows.length; i++) {
				rows[i].key = this.getUniqueKey()
				newRows.push(rows[i])
				newRowsHeight += rows[i].height || 0
				if(newRowsHeight > this.containerHeight) {
					break;
				}
			}

			this.setState({
				rows: newRows,
				topPlaceholderHeight: 0
			}, () => {
				setTimeout(() => {
					if(index > 10) {
						jumpTo.bind(this)(Math.floor(index / 2))
					} else if(index > 0) {
						jumpTo.bind(this)(0)
					} else {
						this.disableOnScroll = false
					}
				}, 200)
			})
		}
	}

	getRowsInfo(dataSource) {
		let rowsInfo = [],
			totalIndex = 0

		const sectionLength = dataSource.getSectionLengths()
		const {getRowType} = this.props

		sectionLength.forEach((rows, index)=> {
			if (this.props.renderSectionHeader) {
				rowsInfo.push({
					id: totalIndex,
					rowType: ROW_TYPES.SECTION_HEADER,
					sectionId: index,
					sectionName : dataSource.sectionIdentities[index],
					shouldUpdate: true,
					hidden: false,
				})
				totalIndex += 1
			}
			for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
				let recycleType = ''
				if(getRowType){
					const rowData = dataSource.getRowData(index, rowIndex)
					recycleType = getRowType(rowData)
				}

				rowsInfo.push({
					id: totalIndex,
					rowType: ROW_TYPES.ROW,
					recycleType: recycleType,
					sectionId: index,
					sectionName : dataSource.sectionIdentities[index],
					rowIndex: rowIndex,
					shouldUpdate: true,
					hidden: false,
				})
				totalIndex += 1
			}
		})

		return rowsInfo
	}

	getChangedViews(newVisibleRows) {
		let changedViews = {},
			removedRows = diffRows(this.visibleRows, newVisibleRows),
			insertedRows = diffRows(newVisibleRows, this.visibleRows)

		insertedRows.forEach(function(row){
			if(!changedViews[row.section]){
				changedViews[row.section] = {}
			}
			changedViews[row.section][row.rowIndex] = true
		})
		removedRows.forEach(function(row){
			if(!changedViews[row.section]){
				changedViews[row.section] = {}
			}
			changedViews[row.section][row.rowIndex] = false
		})

		function diffRows(rowsPrev, rowsNext) {
			let changedRows = []
			Object.keys(rowsPrev).forEach(function(sectionName){
				if(!rowsNext[sectionName]){
					rowsNext[sectionName] = {}
				}

				let section = rowsPrev[sectionName]

				Object.keys(section).forEach(function(rowIndex){
					if(section[rowIndex] !== rowsNext[sectionName][rowIndex]){
						changedRows.push({
							section: sectionName,
							rowIndex: rowIndex
						})
					}
				})
			})

			return changedRows
		}

		return changedViews
	}

	getUniqueKey() {
		this.keyCount += 1
		return 'k_' + this.keyCount
	}

	getNewRowFromInfo(index) {
		let {rows, rowsInfo} = this.state

		if(rowsInfo[index]){
			let row = rowsInfo[index],
				rowExists = false

			rows.forEach((rowsItem) => {
				if(rowsItem.id === row.id){
					rowExists = true
				}
			})

			if(!rowExists){
				row.key = this.getUniqueKey()
				rows.push(row)
				this.setState({
					rows
				})
			}
		}
	}

	renderHeader(bodyComponents) {
		this.scrollViewRowIndex += 1
		return bodyComponents.push(this.props.renderHeader())
	}

	renderStaticHeader(bodyComponents) {
		this.scrollViewRowIndex += 1
		return (bodyComponents.push(
			<StaticRenderer key={'static_header'} shouldUpdate={false} render={this.props.renderStaticHeader}/>
		))
	}

	renderFooter(bodyComponents) {
		this.scrollViewRowIndex += 1
		return bodyComponents.push(this.props.renderFooter())
	}

	renderStaticFooter(bodyComponents) {
		this.scrollViewRowIndex += 1
		return (bodyComponents.push(
			<StaticRenderer key={'static_footer'} shouldUpdate={false} render={this.props.renderStaticFooter}/>
		))
	}

	renderSeparator(bodyComponents, renderIndex){
		this.scrollViewRowIndex += 1

		const {separatorHeight} = this.state
		bodyComponents.push(
			<View key={'separator__' + renderIndex}
				onLayout={separatorHeight ? null : ((e) => this.onLayoutParts(e, 'separator'))}
			>
				<StaticRenderer shouldUpdate={false} render={this.props.renderSeparator}/>
			</View>
		)
	}

	renderTopPlaceholder(bodyComponents) {
		this.scrollViewRowIndex += 1

		const {topPlaceholderHeight} = this.state
		bodyComponents.push(
			<View key="topPlaceholder" style={{height: topPlaceholderHeight}}></View>
		)
	}

	renderBottomPlaceholder(bodyComponents) {
		this.scrollViewRowIndex += 1

		const {bottomPlaceholderHeight} = this.state
		bodyComponents.push(
			<View key="bottomPlaceholder" style={{height: bottomPlaceholderHeight}}></View>
		)
	}

	renderSectionHeader(bodyComponents, row) {
		this.scrollViewRowIndex += 1

		const {dataSource, renderSectionHeader} = this.props
		const shouldTriggerOnLayoutContent = !row.height

		bodyComponents.push(
			<View key={row.key} onLayout={shouldTriggerOnLayoutContent ? this.onLayoutRow.bind(this, row) : null}>
				<StaticRenderer
					shouldUpdate={row.shouldUpdate}
					render={renderSectionHeader.bind(
						null,
						dataSource.getSectionHeaderData(row.sectionId),
						row.sectionName,
					)}
				/>
			</View>
		)
	}

	renderRow(bodyComponents, row){
		this.scrollViewRowIndex += 1

		const {dataSource, renderRow} = this.props
		const shouldTriggerOnLayoutContent = !row.height

		bodyComponents.push(
			<View key={row.key} onLayout={shouldTriggerOnLayoutContent ? this.onLayoutRow.bind(this, row) : null}>
				<View>
					<StaticRenderer
						shouldUpdate={row.shouldUpdate}
						render={renderRow.bind(
							null,
							dataSource.getRowData(row.sectionId, row.rowIndex),
							row.sectionName,
							row.rowIndex,
							this.onRowHighlighted
						)}
					/>
				</View>
			</View>
		)
	}

	render() {
		const {dataSource, onChangeVisibleRows} = this.props,
			{rows, rowsInfo, listOpacity, settedScrollResponderProps} = this.state

		let bodyComponents = [],
			stickyHeaderIndices = []

		this.scrollViewRowIndex = 0

		// render header
		this.props.renderHeader ? this.renderHeader(bodyComponents) : null
		this.props.renderStaticHeader ? this.renderStaticHeader(bodyComponents) : null

		// render topPlaceholder
		this.renderTopPlaceholder(bodyComponents)

		// render sections
		let newVisibleRows = {}
		this.visibleSectionIds = []

		for (let i = 0; i < rows.length; i++) {
			let row = rows[i],
				rowType = rows[i].rowType

			if (rowType === ROW_TYPES.SECTION_HEADER && row.key) {
				stickyHeaderIndices.push(this.scrollViewRowIndex)
				this.renderSectionHeader(bodyComponents, row)
			} else if (rowType === ROW_TYPES.ROW && row.key) {
				this.renderRow(bodyComponents, row)

				if(row.y + row.height > this.containerTop && row.y < this.containerTop + this.containerHeight){
					if(!newVisibleRows[row.sectionName]){
						newVisibleRows[row.sectionName] = {}
					}
					newVisibleRows[row.sectionName][row.rowIndex] = true
				}

				// 展示中的section，sectionHeader不要回收
				if(this.visibleSectionIds.indexOf(row.sectionId) === -1){
					this.visibleSectionIds.push(row.sectionId)
				}
			}
			row.shouldUpdate = false

			// separator
			const isNextRowSectionHeader = rows[i + 1] && rows[i + 1].rowType === ROW_TYPES.SECTION_HEADER
			if(this.props.renderSeparator && rowType === ROW_TYPES.ROW && !isNextRowSectionHeader){
				this.renderSeparator(bodyComponents, i)
			}
		}

		this.renderBottomPlaceholder(bodyComponents)

		this.props.renderFooter ? this.renderFooter(bodyComponents) : null
		this.props.renderStaticFooter ? this.renderStaticFooter(bodyComponents) : null

		// calculate changedVisibleRows
		if(onChangeVisibleRows){
			const changedViews = this.getChangedViews(newVisibleRows)
			this.visibleRows = newVisibleRows

			if(Object.keys(changedViews).length !== 0){
				onChangeVisibleRows(newVisibleRows, changedViews);
			}
		}

		let {renderScrollComponent, useOriginScrollView, scrollEventThrottle, ...props} = this.props

		if(!renderScrollComponent){
			renderScrollComponent = useOriginScrollView
								? props => <ScrollViewOrigin {...props} />
								: props => <ScrollView {...props} />
		}

		Object.assign(props, {
			ref: SCROLL_VIEW,
			scrollEventThrottle: scrollEventThrottle,
			onScroll: this.onScroll.bind(this),
			onLayout: this.onLayoutContainer.bind(this),
			stickyHeaderIndices: stickyHeaderIndices,
			bounces: true,
		}, settedScrollResponderProps)

		// FIXME android removeClippedSubviews
		if(props.removeClippedSubviews){
			delete props.removeClippedSubviews
		}

		return React.cloneElement(renderScrollComponent(props), {
			style : {
				opacity: listOpacity,
			},
		}, bodyComponents)
	}

	componentWillUnmount() {
		this.willUnmount = true
	}
}

ListView.propTypes = {
	...ScrollView.propTypes,
	/**
     * @property dataSource
	 * @type ListViewDataSource
	 * @description 源数据。
     */
	dataSource: React.PropTypes.instanceOf(ListViewDataSource).isRequired,

	/**
     * @property initialListSize
	 * @type number
	 * @description 指定在组件刚挂载的时候渲染多少行数据。用这个属性来确保首屏显示合适数量的数据，而不是花费太多帧逐步显示出来。
     */
	initialListSize: React.PropTypes.number,

	/**
     * @property onChangeVisibleRows
	 * @type function
	 * @param {object} visibleRows 当前可见行
	 * @param {object} changedRows 可见状态改变的行
	 * @description (visibleRows, changedRows) => void
	 *
	 * 当可见的行的集合变化的时候调用此回调函数。visibleRows 以 { sectionID: { rowID: true }}的格式包含了所有可见行，而changedRows 以{ sectionID: { rowID: true | false }}的格式包含了所有刚刚改变了可见性的行，其中如果值为true表示一个行变得可见，而为false表示行刚刚离开可视区域而变得不可见。
     */
	onChangeVisibleRows: React.PropTypes.func,

	/**
     * @property onEndReached
	 * @type function
	 * @description
	 *
	 * 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用。原生的滚动事件会被作为参数传递。
     */
	onEndReached: React.PropTypes.func,

	/**
     * @property onEndReachedThreshold
	 * @type number
	 * @description 调用onEndReached之前的临界值，单位是像素。
     */
	onEndReachedThreshold: React.PropTypes.number,

	/**
     * @property pageSize
	 * @type number
	 * @description 每次事件循环（每帧）渲染的行数。
     */
	pageSize: React.PropTypes.number,

	/**
     * @property renderFooter
	 * @type function
	 * @returns {renderable} 页头组件
	 * @description () => renderable
	 *
	 * 页头与页脚会在每次渲染过程中都重新渲染（如果提供了这些属性）。如果它们重绘的性能开销很大，可以考虑使用renderStaticHeader/renderStaticFooter。页脚会永远在列表的最底部，而页头会在最顶部。
     */
	 renderHeader: React.PropTypes.func,

	/**
     * @property renderHeader
	 * @type function
	 * @returns {renderable} 页尾组件
	 * @description () => renderable
	 *
	 * 同renderFooter，渲染页尾组件。
     */
	 renderFooter: React.PropTypes.func,

	/**
     * @property renderStaticFooter
	 * @type function
	 * @returns {renderable} 页头组件
	 * @description () => renderable
	 *
	 * 只渲染一次的头部组件。
     */
	 renderStaticHeader: React.PropTypes.func,

	/**
     * @property renderStaticHeader
	 * @type function
	 * @returns {renderable} 页尾组件
	 * @description () => renderable
	 *
	 * 只渲染一次的尾部组件。
     */
	 renderStaticFooter: React.PropTypes.func,

	/**
     * @property renderRow
	 * @type function
	 * @param {React.PropTypes.any} rowData 数据源中的数据
     * @param {string} sectionID 所处section名
     * @param {number} rowID 所处section中的index
     * @param {function} highlightRow 通过调用该函数可通知ListView高亮该行
     * @returns {renderable} 每行渲染组件
	 * @description (rowData, sectionID, rowID, highlightRow) => renderable
	 *
	 * 从数据源(Data source)中接受一条数据，以及它和它所在section的ID。返回一个可渲染的组件来为这行数据进行渲染。默认情况下参数中的数据就是放进数据源中的数据本身，不过也可以提供一些转换器。
     */
	renderRow: React.PropTypes.func.isRequired,

	/**
     * @property renderScrollComponent
	 * @type function
	 * @param {object} 可滚动组件的属性
	 * @returns {renderable} 可滚动组件
	 * @description (props) => renderable
	 *
	 * 指定一个函数，在其中返回一个可以滚动的组件。ListView将会在该组件内部进行渲染。默认情况下会返回一个包含指定属性的ScrollView。
     */
	renderScrollComponent: React.PropTypes.func,

	/**
     * @property renderSeparator
	 * @type function
	 * @param {string} sectionID 所处section名
	 * @param {number} rowID 所处section中的index
	 * @param {bool} adjacentRowHighlighted 邻近的行是否被高亮
	 * @returns {renderable} 分隔组件
	 * @description (sectionID, rowID, adjacentRowHighlighted) => renderable
	 *
	 * 如果提供了此属性，一个可渲染的组件会被渲染在每一行下面，除了小节标题的前面的最后一行。
     */
	renderSeparator: React.PropTypes.func,

	getRowType: React.PropTypes.func,

	/**
     * @property scrollRenderAheadDistance
	 * @type number
	 * @description 当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
     */
	scrollRenderAheadDistance: React.PropTypes.number,

	/**
     * @property useOriginScrollView
	 * @type bool
	 * @description 如果提供了此属性， 会使用原生ScrollView，配置了renderScrollComponent时不生效。
     */
	useOriginScrollView: React.PropTypes.bool,

	/**
     * @property scrollEventThrottle
	 * @type bool
	 * @description 触发onScroll最小间隔毫秒数，默认值为50。
     */
	scrollEventThrottle: React.PropTypes.number,
}

ListView.defaultProps = {
	scrollRenderAheadDistance: 500,
	onEndReachedThreshold: 0,
	pageSize: 10,
	initialListSize: 10,
	useOriginScrollView: false,
	scrollEventThrottle: 50,
}

module.exports = ListView;
