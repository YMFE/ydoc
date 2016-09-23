'use strict'

import React, {
    Component,
    StyleSheet,
    View,
    Text,
    ScrollView,
    LoadControl,
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
            noMore: false,
            listData: getCoupleOfRandomColor(20),
        }
    }

    onLoad() {
        setTimeout(()=>{
            this.setState({
                listData: this.state.listData.concat(getCoupleOfRandomColor(20)),
            });
            this.refs.ScrollView.stopLoading();
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

        var loadControl = <LoadControl
            height={50}
            noMore={this.state.noMore}
            noticeContent='自定义提示文本'
            loadingContent='自定义加载文字'
            noMoreContent='自定义没有更多文字'
            style={{borderWidth: 2, borderColor: 'blue', height: 100}}
            textStyle={{color: 'blue'}}
            iconStyle={{color: 'blue'}}
            onLoad={this.onLoad.bind(this)} />

        return (
            <View style={{flex: 1, paddingTop: 10}}>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>强制加载</Text>
                    <Button text='强制加载' onPress={() => this.refs.ScrollView.startLoading()} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>设置是否有更多内容</Text>
                    <Button text='设置' onPress={() => this.setState({noMore: !this.state.noMore})} />
                </View>
                <ScrollView
                    ref='ScrollView'
                    style={{borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ffffff'}}
                    loadControl={loadControl} >
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
    title: 'LoadControl',
    examples: [{
        render: () => {
            return (
                <RefreshControlExample />
            );
        },
    }]
};
