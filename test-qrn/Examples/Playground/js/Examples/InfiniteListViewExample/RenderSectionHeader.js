/**
 * 此样例在测试中，InfiniteListView暂时不支持Section Header
 */

'use strict'

import React, {
	Component,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	InfiniteListView,
} from 'qunar-react-native'

class InfiniteListViewExample extends Component {
    constructor(props){
        super(props)

        const ds = new InfiniteListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
        let sections = {
			part1: [],
			part2: []
		}
        for(let i = 0; i < 100; i++) {
			if(i < 3) {
				sections.part1.push(i)
			} else {
				sections.part2.push(i)
			}
        }
        this.state = {
            sections: sections,
        	dataSource: ds.cloneWithRowsAndSections(sections),
        }
    }

    backToTop() {
        this.refs.InfiniteListView.scrollToTop({animated: true})
    }

	scrollTo() {
        this.refs.InfiniteListView.scrollTo({y: 5000, animated: true})
    }

	renderSectionHeader(sectionData, sectionID) {
		return (
			<View style={{padding: 5, backgroundColor: '#09c'}}>
				<Text>sectionID</Text>
			</View>
		)
	}

    render() {
        return (
            <View style={styles.container}>
                <InfiniteListView
                    ref="InfiniteListView"
                    dataSource={this.state.dataSource}
					renderSectionHeader={() => this.renderSectionHeader()}
                    renderRow={(rowData) => <ListViewExampleRow title={rowData} text={this.state.text}/>}
                />
			<View style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: 30,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-around',
				backgroundColor: '#09c',
				opacity: 0.8,
			}}>
				<TouchableOpacity onPress={() => this.backToTop()} style={styles.operationButton}>
                    <Text style={{color: '#fff'}}>
                        back top
                    </Text>
                </TouchableOpacity>
				<TouchableOpacity onPress={() => this.scrollTo()} style={styles.operationButton}>
                    <Text style={{color: '#fff'}}>
                        scroll to
                    </Text>
                </TouchableOpacity>
			</View>

            </View>
        )
    }
}

class ListViewExampleRow extends Component {
    constructor(props){
        super(props)
    }

    render() {
        const {title, text} = this.props
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
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
	operationButton: {
		padding: 5,
		borderWidth: 1,
		borderColor: '#069',
		borderRadius: 5,
	}
})

module.exports = {
    title: 'ImageTextList',
    examples: [{
        render: () => {
            return <InfiniteListViewExample/>
        }
    }]
};
