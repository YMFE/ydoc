SwipeListView
=============

有滑动菜单的ListView
**Author: yuhao.ju**

![](http://7xkm02.com1.z0.glb.clouddn.com/SwipeListView.png)

Install
-------
qnpm install @qnpm/react-native-ui-swipe-listview



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
renderRow|func||Yes|(rowData, sectionID, rowID, rows) => renderable 根据数据渲染这一行
renderHiddenRow|func||Yes|(rowData, sectionID, rowID, rows) => renderable 根据数据渲染这一行背后隐藏的元素
leftOpenValue|number|0|No|该行右滑时左边的偏移量（必须为正数）
rightOpenValue|number|0|No|该行左滑时右边的偏移量（必须为负数）
closeOnScroll|bool|true|No|列表滑动时，收起打开的行
closeOnRowPress|bool|true|No|当某一行触发onPress吼，收起打开的行
disableLeftSwipe|bool|false|No|禁用左滑
disableRightSwipe|bool|false|No|禁用右滑
onRowOpen|func||No|某行打开时的回调
onRowClose|func||No|某行关闭时的回调

Example:
--------
```javascript

import React, {
	Component,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	ListView,
} from 'react-native'

import SwipeListView from '@qnpm/react-native-ui-swipe-listview'
import commonStyle from './layout/style.js'

class SwipeListViewExample extends Component {
    constructor(props){
        super(props)

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
        let rows = []
        for(let i = 0; i < 20; i++){
            rows.push(i)
        }
        this.state = {
            rows: rows,
        	dataSource: ds.cloneWithRows(rows),
        }
    }

	removeRow(rowData){
		const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
        let rows = this.state.rows
		rows = rows.filter((row) => {
			return row !== rowData
		})

        this.setState({
            rows: rows,
        	dataSource: ds.cloneWithRows(rows),
        })

		this.refs.SwipeListView.safeCloseOpenRow({animated: false})
	}

    render() {
        return (
            <View style={styles.container}>
                <SwipeListView
                    ref="SwipeListView"
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) =>
						{
							return <SwipeListViewExampleRow title={rowData}/>
						}
					}
					renderHiddenRow={ (rowData) => (
		                <TouchableOpacity style={styles.rowBack} onPress={() => this.removeRow(rowData)}>
		                    <Text style={{color: '#fff'}}>delete</Text>
		                </TouchableOpacity>
		            )}
		            rightOpenValue={-65}
					disableRightSwipe={true}
                />
            </View>
        )
    }
}


class SwipeListViewExampleRow extends Component {
    constructor(props){
        super(props)
    }

    render() {
        const {title} = this.props
        const url = 'http://placeholdit.imgix.net/~text?txtsize=33&bg=666&txtclr=fff&txt=' + title + '&w=100&h=110',
            randomText = Number(title) % 100

        return (
            <View style={styles.row}>
                <Image
                    style={[styles.rowImg]}
                    source={{uri: 'http://placeholdit.imgix.net/~text?txtsize=33&bg=666&txtclr=fff&txt=' + title + '&w=100&h=110'}}
                />
                <View style={[styles.rowContent]}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.titleText}>{title}</Text>
                    </View>
                    <View>
                        <Text style={{color: '#25a4bb'}}>{randomText}分 / {randomText}条评论</Text>
                        <Text style={[styles.alignRight, {color: 'orange'}]}>{randomText}起</Text>
                    </View>
                    <View>
                        <View style={[styles.labelWrap]}>
                            <Text style={[styles.labelText]}>label{randomText}</Text>
                            <Text style={[styles.labelText]}>label{randomText}</Text>
                            <Text style={[styles.labelText]}>label{randomText}</Text>
                        </View>
                        <Text style={[styles.alignRight]}>{randomText}折vip</Text>
                    </View>
                    <View>
                        <Text style={styles.detailText}>地点：首都机场{randomText}</Text>
                        <TouchableOpacity style={[styles.alignRight]}>
                            <Text style={[styles.button]}>预定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ...commonStyle,
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
		backgroundColor: '#fff',
    },
    rowImg: {
        flex: 1,
        height: 100,
        resizeMode: 'stretch',
    },
    rowContent: {
        flex: 3,
        padding: 7,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    detailText: {
        marginTop: 3,
        color: '#999',
        fontSize: 12,
    },
    alignRight: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    button: {
        padding: 2,
        borderRadius: 4,
        color: '#fff',
        backgroundColor: '#09c',
    },
    labelWrap: {
        flexDirection: 'row',
    },
    labelText: {
        marginRight: 3,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#09c',
    },
	rowBack: {
		flex: 1,
		width: 65,
		backgroundColor: 'red',
		alignSelf: 'flex-end',
		alignItems: 'center',
		justifyContent: 'center',
	}
})


```
