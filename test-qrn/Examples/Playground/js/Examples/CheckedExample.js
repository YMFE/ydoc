'use strict'

import React, {Component, StyleSheet, TouchableOpacity, View, Text, Checked} from 'qunar-react-native'

// 默认checked: 单选列表
class CheckedSingleExample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: -1
        }
    }

    render() {
        const {exampleType} = this.props
        const {selectedIndex} = this.state

        const ROWS_INDEX = [0, 1, 2]
        return (
            <View>
                {
                    ROWS_INDEX.map((rowIndex) => {
                        return(
                            <TouchableOpacity
                                key={rowIndex}
                                activeOpacity={1}
                                style={styles.exampleRow}
                                onPress={() => this.setState({selectedIndex: rowIndex})}
                            >
                                <Text style={selectedIndex === rowIndex ? {color: '#1ba9ba'} : null}>选择该行控制checked</Text>
                                <Checked checked={selectedIndex === rowIndex}/>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

// checked(hasBorder={true}): 多选列表
class CheckedMultipleExample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndexes: []
        }
    }

    render() {
        const {exampleType} = this.props
        let {selectedIndexes} = this.state

        const ROWS_INDEX = [0, 1, 2]
        return (
            <View>
                {
                    ROWS_INDEX.map((rowIndex) => {
                        return(
                            <TouchableOpacity
                                key={rowIndex}
                                activeOpacity={1}
                                style={styles.exampleRow}
                                onPress={(e) => {
                                    const indexOfRowIndex = selectedIndexes.indexOf(rowIndex)
                                    if(indexOfRowIndex > -1){
                                        selectedIndexes.splice(indexOfRowIndex, 1)
                                    } else{
                                        selectedIndexes.push(rowIndex)
                                    }
                                    this.setState({selectedIndexes})
                                }}
                            >
                                <Text style={selectedIndexes.indexOf(rowIndex) > -1 ? {color: '#1ba9ba'} : null}>
                                    选择该行控制checked
                                </Text>
                                <Checked hasBorder={true} checked={selectedIndexes.indexOf(rowIndex) > -1}/>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

// 混合全选列表
class CheckedMixedExample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedAll: false,
            selectedIndexes: []
        }
    }

    render() {
        const {exampleType} = this.props
        let {selectedIndexes, selectedAll} = this.state

        const ROWS_INDEX = [0, 1, 2]
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.exampleRow}
                    onPress={() => {
                        if(selectedAll){
                            this.setState({
                                selectedAll: false,
                                selectedIndexes: [],
                            })
                        } else{
                            this.setState({
                                selectedAll: true,
                                selectedIndexes: ROWS_INDEX,
                            })
                        }
                    }}
                >
                    <Text style={selectedAll ? {color: '#1ba9ba'} : null}>
                        全选
                    </Text>
                    <Checked checked={selectedAll}/>
                </TouchableOpacity>
                {
                    ROWS_INDEX.map((rowIndex) => {
                        return(
                            <TouchableOpacity
                                key={rowIndex}
                                activeOpacity={1}
                                style={styles.exampleRow}
                                onPress={() => {
                                    const indexOfRowIndex = selectedIndexes.indexOf(rowIndex)
                                    if(indexOfRowIndex > -1){
                                        selectedIndexes.splice(indexOfRowIndex, 1)
                                    } else{
                                        selectedIndexes.push(rowIndex)
                                    }

                                    selectedAll = ROWS_INDEX.length === selectedIndexes.length

                                    this.setState({selectedIndexes, selectedAll})
                                }}
                            >
                                <Text style={selectedIndexes.indexOf(rowIndex) > -1 ? {color: '#1ba9ba'} : null}>
                                    选项{rowIndex}
                                </Text>
                                <Checked hasBorder={true} checked={selectedIndexes.indexOf(rowIndex) > -1}/>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

// onPress回调
class CheckedCallbackExample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: false
        }
    }

    render() {
        const {exampleType} = this.props
        const {selected} = this.state

        return (
            <View style={styles.exampleRow}>
                <Text style={selected ? {color: '#1ba9ba'} : null}>
                    点击Checked触发回调
                </Text>
                <Checked hasBorder={true}
                    checked={selected}
                    onPress={(e) => {this.setState({selected: !e.target.checked})}}
                />
            </View>
        )
    }
}

// 单选列表 自定义样式
class CheckedStyleExample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: -1
        }
    }

    render() {
        const {exampleType} = this.props
        const {selectedIndex} = this.state

        return (
            <View>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.exampleRow}
                    onPress={() => {this.setState({selectedIndex: 0})}}
                >
                    <Text style={selectedIndex === 0 ? {color: '#1ba9ba'} : null}>
                        hasBorder: false - 自定义样式
                    </Text>
                    <Checked hasBorder={false}
                        checked={selectedIndex === 0}
                        style={{width: 20, height: 20, fontSize: 20}}
                        uncheckStyle={{color: '#aaa'}}
                        checkStyle={{color: 'red'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.exampleRow}
                    onPress={() => {this.setState({selectedIndex: 1})}}
                >
                    <Text style={selectedIndex === 1 ? {color: '#1ba9ba'} : null}>
                        hasBorder: true - 自定义样式
                    </Text>
                    <Checked hasBorder={true}
                        style={{width: 20, height: 20, fontSize: 14, padding: 2, borderRadius: 0}}
                        checked={selectedIndex === 1}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    exampleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 2,
        paddingBottom: 2,
    }
})

module.exports = {
    title: 'Checked',
    scroll: true,
    examples: [{
        subtitle: '默认checked: 单选列表',
        render: () => {
            return <CheckedSingleExample/>
        }
    },{
        subtitle: 'checked(hasBorder={true}): 多选列表',
        render: () => {
            return <CheckedMultipleExample/>
        }
    },{
        subtitle: '混合全选列表',
        render: () => {
            return <CheckedMixedExample/>
        }
    },{
        subtitle: 'onPress回调',
        render: () => {
            return <CheckedCallbackExample/>
        }
    },{
        subtitle: '单选列表 自定义样式',
        render: () => {
            return <CheckedStyleExample/>
        }
    }]
}
