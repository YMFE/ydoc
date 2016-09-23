'use strict'

import React, {
    Component,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
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

class ScrollViewExample extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            loading: false,
            listData: getCoupleOfRandomColor(20),
            noMore: false,
        }
    }

    onRefresh() {
        this.setState({
            refreshing: true,
        });
    }

    onLoad() {
        this.setState({
            loading: true,
        });
    }

    changeRefreshState() {
        if(!this.state.refreshing) {
            this.refs.ScrollView.startRefreshing();
            this.setState({
                refreshing: true,
            })
        } else {
            this.refs.ScrollView.stopRefreshing({
                result: Math.random() > 0.5 ? true : false,
            });

            this.setState({
                refreshing: false,
                listData: getCoupleOfRandomColor(20),
            });

            if(this.state.isLoading) {
                this.refs.ScrollView.stopLoading();

                this.setState({
                    loading: false,
                });
            }
        }
    }

    changeLoadState() {
        if(!this.state.loading) {
            this.refs.ScrollView.startLoading();
            this.setState({
                loading: true,
            })
            return;
        } else {
            this.refs.ScrollView.stopLoading();

            this.setState({
                loading: false,
                listData: this.state.listData.concat(getCoupleOfRandomColor(20)),
            });

            if(this.state.refreshing){
                this.refs.ScrollView.stopRefreshing({
                    result: Math.random() > 0.5 ? true : false,
                });
                this.setState({
                    refreshing: false,
                });
            }
        }
    }

    changeNoMoreState() {
        this.setState({
            noMore: !this.state.noMore,
        })
    }

    render() {
        var listContent = this.state.listData.map((item, index)=>{
            return (
                <View style={{height: 50, backgroundColor: item}} key={index}>
                    <Text style={styles.itemText}>{index}</Text>
                </View>
            )
        })

        return (
            <View style={{flex: 1, paddingTop: 10}}>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>强制刷新：该功能会自动回到顶部，并开启刷新{this.state.refreshing ? '(正在刷新，无法强制刷新)' : ''}</Text>
                    <Button text={this.state.refreshing ? '无法刷新' : '强制刷新'} disabled={this.state.refreshing} onPress={() => this.changeRefreshState()} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>停止刷新：该功能也会自动回到顶部{!this.state.refreshing ? '(没有刷新，无法停止刷新)' : ''}</Text>
                    <Button text={this.state.refreshing ? '停止刷新' : '无法停止'} disabled={!this.state.refreshing} onPress={() => this.changeRefreshState()} />
                </View>
                <ScrollView
                    ref='ScrollView'
                    style={{borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ffffff'}}
                    refreshControl={
                        <RefreshControl onRefresh={this.onRefresh.bind(this)} />
                    }
                    loadControl={
                        <LoadControl noMore={this.state.noMore} onLoad={this.onLoad.bind(this)} onPress={()=>{
                            this.refs.ScrollView.startLoading();
                            this.setState({
                                loading: true,
                            });
                        }} />
                    }>
                    {listContent}
                </ScrollView>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>强制加载：{this.state.loading ? '(正在加载，无法强制加载)' : ''}</Text>
                    <Button text={this.state.loading ? '无法加载' : '强制加载'} disabled={this.state.loading} onPress={() => this.changeLoadState()} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>停止加载：{!this.state.loading ? '(没有加载，无法停止加载)' : ''}</Text>
                    <Button text={this.state.loading ? '停止加载' : '无法停止'} disabled={!this.state.loading} onPress={() => this.changeLoadState()} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>没有更多：此属性用来控制是否还有更多内容，没有就无法加载更多了({this.state.noMore ? '没有更多了' : '还有更多的'})</Text>
                    <Button text={this.state.noMore ? '有数据了！' : '没数据了！'} onPress={() => this.changeNoMoreState()} />
                </View>
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
    title: '下拉刷新/加载更多',
    examples: [{
        render: () => {
            return (
                <ScrollViewExample />
            );
        },
    }]
};
