/**
 * 该样例仍在实验中
 */

'use strict'

import React, {Component, StyleSheet, View, Text, TouchableOpacity, Image, ListView} from 'qunar-react-native'

const SECTION_CITY_NUM = 4
class MailListExample extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            })
        }
    }

    componentWillMount() {
        // generate A-Z array
        let sectionKeys = []
        for(let charCode = 65; charCode <= 90; charCode++){
            sectionKeys.push(String.fromCharCode(charCode))
        }
		this.sectionKeys = sectionKeys

        // generate cities
        let cities = {}

        for(let i in sectionKeys){
            cities[sectionKeys[i]] = []
            for(let j = 0; j < SECTION_CITY_NUM; j++){
                cities[sectionKeys[i]].push(j)
            }
        }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(cities),
        })
    }

	componentDidMount() {
        setTimeout(() => {
            // this.refs.listView.scrollToIndex(51)
        }, 1000)
    }

	goSection(i) {
		this.refs.listView.scrollToIndex(i * (SECTION_CITY_NUM)) // TODO if render sectionHeader, should plus 1
	}

    render() {
        return (
            <View style={styles.container}>

                <ListView
                    ref="listView"
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />
			<View style={{position: 'absolute', top: 40, right: 10}}>
					{
						this.sectionKeys.map((city, i) => {
							return (
								<TouchableOpacity key={i} onPress={() => this.goSection(i)}
									style={{width: 20, alignItems: 'center', backgroundColor: '#fff'}}>
									<Text>{city}</Text>
								</TouchableOpacity>
							)
						})
					}
				</View>
            </View>
        )
    }

    renderRow(rowData, key, sectionID) {
        return (
            <View style={styles.sectionBodyRow}>
                <Text>{sectionID} - {rowData} - {key}</Text>
            </View>
        );
    }

    renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.sectionHeader}>
                <Text>{sectionID}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // month header
    sectionHeader: {
        overflow: 'hidden',
        padding: 5,
		height: 50,
        backgroundColor: '#ccf'
    },
    sectionBodyRow: {
        overflow: 'hidden',
		padding: 5,
		height: 49,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#aaa',
    },
})

module.exports = {
	title: 'MailList Example',
    examples: [{
        render: () => {
            return <MailListExample/>
        }
    }]
};
