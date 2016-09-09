'use strict'

import React, {
    Component,
    StyleSheet,
    View,
    Text,
    ScrollView,
    RefreshControl,
    Button,
} from 'qunar-react-native';

const styles = StyleSheet.create({
    operationContainer: {
        paddingHorizontal: 10,
        marginBottom: 10,
        flexDirection: 'row',
        height: 30,
    },
    operationText: {
        flex: 1,
        alignSelf: 'center',
    },
    operationTextHighlight: {
        color: '#1ba9ba',
    },
    itemText: {
        padding: 5,
        color: '#fff',
        alignSelf:'flex-end',
        fontSize: 32,
        fontWeight: 'bold'
    }
});

class RefreshControlExample extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            listData: getCoupleOfRandomColor(20),
        }
    }

    onRefresh() {
        setTimeout(()=>{
            this.setState({
                listData: getCoupleOfRandomColor(20),
            });

            let _random = Math.random();
            this.refs.ScrollView.stopRefreshing({
                result: _random > 0.6 ? undefined : _random < 0.3 ? true : false,
                duration: 3000,
            });
        }, 3000);
    }

    render() {
        var listContent = this.state.listData.map((item, index)=>{
            return (
                <View style={{height: 50, backgroundColor: item}} key={index}>
                    <Text style={styles.itemText}>{index}</Text>
                </View>
            )
        })

        var refreshControl = <RefreshControl
            height={50}
            pullStartContent='自定义下拉文字'
            pullContinueContent='自定义继续拉动文字'
            refreshingContent='自定义刷新文字'
            successContent='自定义成功文字'
            failContent='自定义失败文字'
            style={{borderWidth: 2, borderColor: 'blue', height: 100}}
            iconStyle={{color: 'blue'}}
            textStyle={{color: 'blue'}}
            onRefresh={this.onRefresh.bind(this)} />

        return (
            <View style={{flex: 1, paddingTop: 10}}>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>强制刷新</Text>
                    <Button text='强制刷新' onPress={() => this.refs.ScrollView.startRefreshing()} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationTextHighlight}>- 可以自定义内容和样式</Text>
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationTextHighlight}>- 可以设置刷新结果(成功/失败/默认无)</Text>
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationTextHighlight}>- 可以设置刷新之后回到顶部是否需要动画和动画时间</Text>
                </View>
                <ScrollView
                    ref='ScrollView'
                    style={{borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ffffff'}}
                    refreshControl={refreshControl} >
                    {listContent}
                </ScrollView>
            </View>
        )
    }
}

function getCoupleOfRandomColor(num) {
    var colors = [];

    for(var i = 0; i < num; i++) {
        colors.push(getRandomColor());
    }

    return colors;
}

function getRandomColor() {
    var letters = '3456789ABC'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
}

module.exports = {
    title: 'RefreshControl',
    examples: [{
        render: () => {
            return (
                <RefreshControlExample />
            );
        },
    }]
};
