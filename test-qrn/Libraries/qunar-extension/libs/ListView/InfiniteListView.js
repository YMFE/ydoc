/**
 * @providesModule InfiniteListView
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
const SCROLLTO_DURATION = 300
const SCROLL_VIEW = 'scrollView'
const DEBUG = false
const infoLog = function(...args){
	return console.log('ILV:', ...args)
}

/**
 * 无限缓存列表
 *
 * @component InfiniteListView
 * @example ./Playground/js/Examples/InfiniteListViewExample/VariousHeight.js[1-175]
 * @version >=1.1.0
 * @description 这是一个适用于渲染数据很多时候的无限缓存列表，使用方式和接口和ListView基本一致，但性能比ListView更好。需要注意的是每行必须等高，如果不等高需要用configureRowHeight进行指定。
 *
 */

class InfiniteListView extends React.Component {
	constructor(props) {
		super(props)

		const rowsInfo = this.getRowsInfo(this.props.dataSource)

		this.keyCount = -1
		this.renderedRowIndices = []
		this.rowPositions = []
		this.delayedActions = []
		this.aboveListBottom = true // for onEndReached
		this.willUnmount = false
		this.disableOnScroll = false
		this.initialed = false
		this.isRefreshing = false

		this.scrollDirection = SCROLL_DIRECTION.DOWN
		this.windowHeight = Dimensions.get('window').height

		this.rowsHeightTotal = 0
		this.containerHeight = 0
		this.containerTop = 0
		this.commonRowHeight = -1

		this.startRenderLine = -props.scrollRenderAheadDistance
		this.endRenderLine = 0

		// insert first row
		let rows = []
		if(rowsInfo[0]) {
			rowsInfo[0].key = this.getUniqueKey()
			rows.push(rowsInfo[0])
			this.renderedRowIndices.push(0)
		}

		// if rows height setted, calculate positions
		if(props.configureRowHeight) {
			this.rowPositions = this.getRowsPosition(rowsInfo, props.configureRowHeight)
		}

		this.state = {
			rowsInfo,
			rows,

			placeholderHeight: 0,
			listOpacity: 0,

			settedScrollResponderProps: {},
		}
	}

	static DataSource = ListViewDataSource;

	componentWillReceiveProps (nextProps) {
		// TODO 加上别的属性的检查,如renderRow....
		if (this.props.dataSource !== nextProps.dataSource) {
			let {rows, rowsInfo} = this.state,
				newRows = [],
				nextRowsInfo = this.getRowsInfo(nextProps.dataSource)

			this.rowsHeightTotal = 0
			this.renderedRowIndices = []

			rows.forEach((row) => {
				nextRowsInfo.forEach((rowInfo) => {
					if(row.rowIndex === rowInfo.rowIndex) {
						row.shouldUpdate = true

						// 保持原有row的状态
						this.rowsHeightTotal += row.height
						newRows.push(Object.assign({}, row))
						this.renderedRowIndices[row.rowIndex] = row.id
					}
				})
			})

			// change undefined to -1
			for(let i = 0, len = this.renderedRowIndices.length; i < len; i++) {
				if (typeof this.renderedRowIndices[i] === 'undefined') {
					this.renderedRowIndices[i] = -1
				}
			}

			// if no content, insert first row
			// because commonRowHeight unknown, just render one row first
			if(newRows.length === 0 && nextRowsInfo[0]) {
				nextRowsInfo[0].key = this.getUniqueKey()
				newRows.push(nextRowsInfo[0])
				this.renderedRowIndices.push(0)
			} else if(nextRowsInfo.length > rowsInfo.length && rowsInfo.length === this.renderedRowIndices.length) {
				const addedRowInfo = nextRowsInfo[rowsInfo.length]
				newRows.push(Object.assign(addedRowInfo, {
					id: newRows.length,
					key: this.getUniqueKey(),
				}))
				this.renderedRowIndices.push(newRows.length - 1)

				this.initialed = false
			}

			// if rows height setted, recalculate positions
			if(nextProps.configureRowHeight) {
				this.rowPositions = this.getRowsPosition(nextRowsInfo, nextProps.configureRowHeight)
			}

			this.setState({
				rowsInfo: nextRowsInfo,
				rows: newRows,
				placeholderHeight: this._calculatePlaceholderHeight.bind(this)(nextRowsInfo.length),
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
		}, 1000)
	}

	onRowHighlighted(sectionID, rowIndex) {
		this.setState({highlightedRow: {sectionID, rowIndex}})
	}

	onLayoutContainer(event) {
		this.containerHeight = event.nativeEvent.layout.height
	}

	onScroll(e) {
		if(typeof this.props.onScroll === 'function') {
			this.props.onScroll(e)
		}

		// DEBUG && infoLog('current top position', e.nativeEvent.contentOffset.y);

		const {scrollRenderAheadDistance, pageSize} = this.props
		const startRenderLine = e.nativeEvent.contentOffset.y - scrollRenderAheadDistance,
			endRenderLine = e.nativeEvent.contentOffset.y + this.containerHeight + scrollRenderAheadDistance

		this.containerTop = e.nativeEvent.contentOffset.y

		// 确定滑动方向
		if(startRenderLine > this.startRenderLine){
			this.scrollDirection = SCROLL_DIRECTION.DOWN
		} else{
			this.scrollDirection = SCROLL_DIRECTION.UP
		}

		this.startRenderLine = startRenderLine
		this.endRenderLine = endRenderLine

		let {rows, rowsInfo} = this.state,
			needUpdateRows = false,
			pageCount = 0,
			spareRowPool = []

		if(this.disableOnScroll) {
			return
		}

		if(this.scrollDirection === SCROLL_DIRECTION.DOWN){
			let stopSearchIndex = -1

			// collect spare rows from the top
			for(let i = 0; i < this.renderedRowIndices.length; i++){
				let rowIndex = this.renderedRowIndices[i],
					row = rows[rowIndex]

				if(row){
                    if(row.y + row.height < startRenderLine){
    					stopSearchIndex = i
    					spareRowPool ? spareRowPool.push(row) : spareRowPool = [row]
    				}
                }
			}

			// 确定下方哪些行要重新显示
			if(spareRowPool && spareRowPool.length >= pageSize) {
				for(let i = stopSearchIndex; i <= this.renderedRowIndices.length; i++){
					let rowIndex = this.renderedRowIndices[i],
						row = rows[rowIndex],
						rowPos = this.commonRowHeight * i

					if(rowPos > startRenderLine && rowPos < endRenderLine && this.renderedRowIndices[i] === -1 ){
						DEBUG && infoLog('replacing' , i, ', spareRowPool length', spareRowPool.length)
						if(spareRowPool.length > 0){
							let spareRow = spareRowPool.shift()

							spareRow.shouldUpdate = true
							spareRow.y = rowPos
							spareRow.rowIndex = i

							const spareRowPos = this.renderedRowIndices.indexOf(spareRow.id)
							if(spareRowPos > i){
								this.renderedRowIndices[i] = (this.renderedRowIndices.splice(spareRowPos, 1)[0])
							} else{
								this.renderedRowIndices[i] = (this.renderedRowIndices.splice(spareRowPos, 1, -1)[0])
							}
							DEBUG && infoLog(this.renderedRowIndices.slice(0))

							needUpdateRows = true
						}
					}
				}
			}

			// 添加rows直到超过endRenderLine
			let lastRowIndex, lastRow

			for(let i = this.renderedRowIndices.length - 1; i > 0; i--){
				lastRowIndex = this.renderedRowIndices[i]
				lastRow = rows[lastRowIndex]

				if(lastRow && lastRow.y > startRenderLine && lastRow.y < endRenderLine){
					break
				}
			}

			let pushingNewRow = false
			if(lastRow && spareRowPool
				&& lastRow.y + lastRow.height < endRenderLine
				&& spareRowPool.length >= pageSize
				&& this.initialed ){
				for(let i = 1; i <= pageSize; i++){
					let newRowId = this.renderedRowIndices.length - 1 + i
					if(rowsInfo[newRowId]){
						let row = rowsInfo[newRowId]

						// 如果有spare key
						if(spareRowPool && spareRowPool.length > 0){
							let spareRow = spareRowPool.shift()

							// 更改spareRow位置和内容
							spareRow.y = typeof this.rowPositions[row.id] !== 'undefined'
                                            ? this.rowPositions[row.id]
                                            : row.id * this.commonRowHeight
							spareRow.shouldUpdate = true
							spareRow.rowIndex = row.rowIndex

							const spareRowPos = this.renderedRowIndices.indexOf(spareRow.id)
							this.renderedRowIndices.push(this.renderedRowIndices.splice(spareRowPos, 1, -1)[0])

							DEBUG && infoLog(this.renderedRowIndices.slice(0));
						}

						needUpdateRows = true
						pushingNewRow = true
					}
				}
			}

			// 判断是否到达底部
			const {onEndReached, onEndReachedThreshold} = this.props
			if(onEndReached){
				const containerBottom = e.nativeEvent.contentOffset.y + this.containerHeight + onEndReachedThreshold,
					lastRowPosition = lastRow.y + lastRow.height

				if(containerBottom >= lastRowPosition && this.aboveListBottom && this.scrollDirection === 'down' && !pushingNewRow){
					onEndReached(e)
					this.aboveListBottom = false
				} else if(containerBottom < lastRowPosition){
					this.aboveListBottom = true
				}
			}

		} else if(this.scrollDirection === SCROLL_DIRECTION.UP){
			let stopSearchIndex = -1

			// 隐藏最下面的rows
			for(let i = this.renderedRowIndices.length - 1; i >= 0; i--){
				let rowIndex = this.renderedRowIndices[i],
					row = rows[rowIndex]

				if(row){
                    if(row.y > endRenderLine) {
    					stopSearchIndex = i
    					spareRowPool ? spareRowPool.push(row) : spareRowPool = [row]
    				}
                }
			}

			// 确定上方哪些rows要重新显示
			if(spareRowPool && spareRowPool.length >= pageSize) {
				for(let i = stopSearchIndex; i >= 0; i--){
					let rowIndex = this.renderedRowIndices[i],
						row = rows[rowIndex],
						rowPos = typeof this.rowPositions[i] !== 'undefined'
                                        ? this.rowPositions[i]
                                        : i * this.commonRowHeight

					if(rowPos < endRenderLine && this.renderedRowIndices[i] === -1){
						if(spareRowPool && spareRowPool.length > 0){
							let spareRow = spareRowPool.shift()

							spareRow.shouldUpdate = true
							spareRow.y = rowPos
							spareRow.rowIndex = i

							const spareRowPos = this.renderedRowIndices.indexOf(spareRow.id)
							this.renderedRowIndices[i] = (this.renderedRowIndices.splice(spareRowPos, 1)[0])
							DEBUG && infoLog(this.renderedRowIndices.slice(0));

							needUpdateRows = true
						} else {
							break
						}
					}
				}
			}
		}

		if(needUpdateRows) {
			this.setState({
				rows,
			})
		}
	}

	onLayoutRow(row, event) {
		let {rows, rowsInfo, listOpacity} = this.state
		const {initialListSize, scrollRenderAheadDistance, refreshControl} = this.props

		this.rowsHeightTotal += event.nativeEvent.layout.height
		row.height = event.nativeEvent.layout.height

		if(this.commonRowHeight === -1){
			this.commonRowHeight = row.height
		}

		let currentY = typeof this.rowPositions[row.rowIndex] !== 'undefined'
            ? this.rowPositions[row.rowIndex]
            : row.rowIndex * this.commonRowHeight

		row.shouldUpdate = !(currentY === row.y && (1 / currentY) === (1 / row.y)) // 区分+0/-0
		row.y = currentY

		if(this.containerHeight === 0) {
			RCTUIManger.measure(React.findNodeHandle(this.refs[SCROLL_VIEW]), (x, y, width, height) => {
				this.containerHeight = height
				checkIfCoverScreen.bind(this)()
			})
		} else {
			checkIfCoverScreen.bind(this)()
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

			if( heightNotCoverScreen
				|| rows.length < initialListSize
				|| row.y + row.height < this.containerHeight + scrollRenderAheadDistance * 2
			) {
				if(!this.initialed){
					const placeholderHeight = this._calculatePlaceholderHeight.bind(this)(row.rowIndex + 1)

					this.setState({
						placeholderHeight
					})
				}

				if(rows.length < initialListSize){
					for(let i = rows.length; i < initialListSize; i++){
						this.getNewRowFromInfo(i)
					}
				} else {
					this.getNewRowFromInfo(row.rowIndex + 1)
				}
			} else {
				const placeholderHeight = this._calculatePlaceholderHeight.bind(this)(rowsInfo.length)

				this.setState({
					placeholderHeight
				})
				this.initialed = true

				for(let i = 0, len = this.delayedActions.length; i < len; i++){
					this.delayedActions[i]()
				}
				this.delayedActions = []
			}
		}
	}

	_calculatePlaceholderHeight(rowsNum) {
		const {configureRowHeight} = this.props

		if(configureRowHeight){
			return this.rowPositions[rowsNum]
		} else {
			return this.commonRowHeight * rowsNum
		}
	}

	/**
     * 开始下拉刷新
     *
     * @method startRefreshing
     * @description 同ScrollView，当前组件有refreshControl属性，并且没有正在下拉刷新，则强制触发下拉刷新，变成正在刷新的状态。
     */
    startRefreshing(config = {}) {
		const {refreshControl} = this.props,
			ScrollView = this.refs[SCROLL_VIEW]

		this.scrollTo({y: refreshControl.props.height, silent: true})
		ScrollView && ScrollView.startRefreshing && ScrollView.startRefreshing()
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

		if(this.isRefreshing === true){
			this.scrollTo({y: refreshControl.props.height, silent: true})
			this.isRefreshing = false
		}
		ScrollView && ScrollView.stopRefreshing && ScrollView.stopRefreshing({animated: true})
	}

	/**
     * 开始加载更多
     *
     * @method startLoading
     * @description 同ScrollView，当前组件有loadControl属性，并且没有正在加载，则强制触发加载更多，变成正在加载更多的状态。
     */
    startLoading(config = {}) {
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
    stopLoading(config = {}) {
		if(this.refs[SCROLL_VIEW].stopLoading){
			this.refs[SCROLL_VIEW].stopLoading(config)
		}
	}

	/**
     * 滚动到指定位置
     *
     * @method scrollTo
     * @description 同ScrollView ScrollTo。
     */
	scrollTo(config = {}) {
		if(!this.initialed){
			this.delayedActions.push(() => this.scrollTo(config, config.silent))
			return
		}

		this.disableOnScroll = true

		const ScrollView = this.refs[SCROLL_VIEW]
		if(ScrollView && !config.silent){
			ScrollView.scrollTo(config)
		}

		const {scrollRenderAheadDistance} = this.props
		let {rowsInfo, rows} = this.state

		const beginRenderLine = config.y - scrollRenderAheadDistance > 0
								? config.y - scrollRenderAheadDistance
								: 0,
			endRenderLine = config.y + this.containerHeight + scrollRenderAheadDistance,
			beginRowIndex = Math.floor(beginRenderLine / this.commonRowHeight),
			endRowIndex = Math.ceil(endRenderLine / this.commonRowHeight)

		// collect spare rows
		let spareRowPool = []
		for(let rowItem of rows){
			if(rowItem.y < beginRenderLine || rowItem.y > endRenderLine){
				spareRowPool.push(rowItem)
			}
		}

		// if scroll direction is upwards, use bottom spare rows first
		if(config.y < this.containerTop){
			spareRowPool.reverse()
		}

		// generate new rows
		this.renderedRowIndices = []

		for(let i = 0; i < beginRowIndex; i++){
			this.renderedRowIndices.push(-1)
		}

		for(let i = 0, len = rows.length; i < len; i++){
			const newIndex = i + beginRowIndex

			rows[i].rowIndex = newIndex
			rows[i].y = newIndex * this.commonRowHeight
			rows[i].shouldUpdate = true
			this.renderedRowIndices.push(i)
		}

		this.setState({
			rows
		}, () => {
			setTimeout(() => {
				this.disableOnScroll = false
			}, 500)
		})
	}

	/**
	 * 滚动到指定行
	 *
	 * @method scrollToIndex
	 * @description 第一个参数为目标index，第二个参数为configs对象，里面可配置animated: bool。
	 */
	scrollToIndex(index, configs) {
		if(index < 0 || index > this.state.rowsInfo.length) {
			return
		}

		let positionY
		if(this.rowPositions[index]) {
			positionY = this.rowPositions[index]
		} else {
			positionY = index * this.commonRowHeight
		}
		this.scrollTo(Object.assign(configs, {y: positionY}))
	}

	/**
     * 回到顶部
     *
     * @method scrollToTop
	 * @description 立即回到顶部，相当于scrollTo({y: 0})
     */
	scrollToTop(configs = {}){
		const {refreshControl} = this.props,
			topPosition = refreshControl ? refreshControl.props.height : 0

		this.scrollTo(Object.assign(configs, {y: topPosition}))
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

	getRowsInfo(dataSource) {
		let rowsInfo = [],
			totalIndex = 0

		const sectionLength = dataSource.getSectionLengths()

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
				rowsInfo.push({
					id: totalIndex,
					rowType: ROW_TYPES.ROW,
					sectionId: index,
					sectionName : dataSource.sectionIdentities[index],
					rowIndex: rowIndex,
					shouldUpdate: true,
					hidden: false,
					rowData: dataSource.getRowData(index, rowIndex)
				})
				totalIndex += 1
			}
		})

		return rowsInfo
	}

	getRowsPosition(rowsInfo, configureRowHeight) {
		let renderedRowsHeight = 0,
			rowPositions = [0]

		for(let i = 0, len = rowsInfo.length; i < len; i++){
			renderedRowsHeight += configureRowHeight(rowsInfo[i].rowData, i) || 0
			rowPositions[i + 1] = renderedRowsHeight
		}

		return rowPositions
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
				this.renderedRowIndices.push(row.id)
				this.setState({
					rows
				})
			}
		}
	}

	renderHeader() {
		this.scrollViewRowIndex += 1
		return this.props.renderHeader()
	}

	renderFooter() {
		this.scrollViewRowIndex += 1
		return this.props.renderFooter()
	}

	renderStaticHeader() {
		this.scrollViewRowIndex += 1
		return (
			<StaticRenderer shouldUpdate={false} render={
				this.props.renderStaticHeader
			}/>
		)
	}

	renderStaticFooter() {
		this.scrollViewRowIndex += 1
		return (
			<StaticRenderer shouldUpdate={false} render={
				this.props.renderStaticFooter
			}/>
		)
	}

	renderSectionHeader(row) {
		this.scrollViewRowIndex += 1

		const {dataSource, renderSectionHeader} = this.props
		const shouldTriggerOnLayoutContent = !row.height

		return (
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

	renderRow(row){
		this.scrollViewRowIndex += 1

		const {dataSource, renderRow, refreshControl} = this.props
		const shouldTriggerOnLayoutContent = typeof row.height === 'undefined'

		row.rowData = row.shouldUpdate ? dataSource.getRowData(row.sectionId, row.rowIndex) : row.rowData

		let positionY
		if(this.rowPositions[row.rowIndex]){
			positionY = this.rowPositions[row.rowIndex]
		} else {
			positionY = row.rowIndex * this.commonRowHeight
		}

		if(typeof row.rowData !== 'undefined'){
			return (
				<StaticRenderer
					key={row.key}
					shouldUpdate={row.shouldUpdate}
					render={
						() => {return (
							<View
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									transform: [{
										translateY: positionY,
									}]
								}}
								onLayout={shouldTriggerOnLayoutContent ? this.onLayoutRow.bind(this, row) : null}>
								{
									renderRow.bind(
										null,
										row.rowData,
										row.sectionName,
										row.rowIndex,
										this.onRowHighlighted
									)()
								}
							</View>
						)}
					}
				/>
			)
		}

	}

	render() {
		const {dataSource, onChangeVisibleRows, refreshControl, configureRowHeight} = this.props,
			{rows, rowsInfo, listOpacity, placeholderHeight, settedScrollResponderProps} = this.state

		this.scrollViewRowIndex = 0

		const renderHeaderFunc = this.props.renderStaticHeader || this.props.renderHeader,
			header = renderHeaderFunc && renderHeaderFunc()
		const renderFooterFunc = this.props.renderStaticFooter || this.props.renderFooter,
			footer = renderFooterFunc && renderFooterFunc()

		// render content
		let stickyHeaderIndices = []

		const bodyComponents = (
			<View style={{height: placeholderHeight}}>
			{
				rows.map((row, i) => {
					let rowType = rows[i].rowType

					if (rowType === ROW_TYPES.SECTION_HEADER && row.key) {
						stickyHeaderIndices.push(this.scrollViewRowIndex)
						return this.renderSectionHeader(row)
					} else if (rowType === ROW_TYPES.ROW && row.key) {
						return this.renderRow(row)
					}
				})
			}
			</View>
		)

		rows.map((row, i) => {
			row.shouldUpdate = false
		})

		let {renderScrollComponent, useOriginScrollView, scrollEventThrottle, ...props} = this.props

		if(!renderScrollComponent) {
			renderScrollComponent = useOriginScrollView
								? props => <ScrollViewOrigin {...props} />
								: props => <ScrollView {...props} />
		}

		Object.assign(props, {
			ref: SCROLL_VIEW,
			onScroll: this.onScroll.bind(this),
			onLayout: this.onLayoutContainer.bind(this),
			scrollEventThrottle: scrollEventThrottle,
			stickyHeaderIndices: stickyHeaderIndices,
			refreshControl: refreshControl,
			onRefresh: refreshControl ? () => {this.isRefreshing = true} : null
		}, settedScrollResponderProps)

		// FIXME android removeClippedSubviews
		if(props.removeClippedSubviews){
			delete props.removeClippedSubviews
		}

		return React.cloneElement(renderScrollComponent(props), {
			style : {
				opacity: listOpacity,
			},
		}, header, bodyComponents, footer)
	}

	componentWillUnmount() {
		this.willUnmount = true
	}
}

InfiniteListView.propTypes = {
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
     * @property onEndReached
	 * @type function
	 * @description 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用。原生的滚动事件会被作为参数传递。
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
     * @param {function} highlightRow 通过调用该函数可通知InfiniteListView高亮该行
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
	 * 指定一个函数，在其中返回一个可以滚动的组件。InfiniteListView将会在该组件内部进行渲染。默认情况下会返回一个包含指定属性的ScrollView。
     */
	renderScrollComponent: React.PropTypes.func,

	/**
     * @property scrollRenderAheadDistance
	 * @type number
	 * @description 当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行。
     */
	scrollRenderAheadDistance: React.PropTypes.number,

	/**
     * @property useOriginScrollView
	 * @type bool
	 * @description 如果提供了此属性，会使用原生ScrollView，配置了renderScrollComponent时不生效。
     */
	useOriginScrollView: React.PropTypes.bool,

	/**
     * @property scrollEventThrottle
	 * @type React.PropTypes.number
	 * @description 触发onScroll最小间隔毫秒数，默认值为50。
     */
	scrollEventThrottle: React.PropTypes.number,

	/**
	 * @property configureRowHeight
	 * @type React.PropTypes.func
	 * @description (rowData, rowID) => number 指定每一行的高度。
	 */
	configureRowHeight: React.PropTypes.func
}

InfiniteListView.defaultProps = {
	scrollRenderAheadDistance: 500,
	onEndReachedThreshold: 0,
	pageSize: 1,
	initialListSize: 5,
	useOriginScrollView: false,
	scrollEventThrottle: 16,
}

module.exports = InfiniteListView;
