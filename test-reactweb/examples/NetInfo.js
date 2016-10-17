/**
 * Created by wangxiaoyu.wang on 16/8/18.
 */

var React = require('react');
var ReactNative = require('qunar-react-native');
var {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    NetInfo,
} = ReactNative;




let NetInfoExample = React.createClass({
    getInitialState: function(){
        return {
            online: window.navigator.onLine,
            status: 'unknown'
        }
    },
    componentWillMount: function(){
        NetInfo.addEventListener('change', (status) => {
            alert('网络状态改变了，当前的状态是：' + status);
        });
        NetInfo.fetch().then((status)=>{
            this.setState({status: status});
        });
        NetInfo.isConnected.addEventListener('change', (isConnected) => {
            this.setState({online: isConnected});
            alert('网络状态改变了，当前是否在线呢：' + isConnected);
        });
    },
    render: function(){
        return (
            <View>
                <Text style={styles.text}>当前是否在线? {this.state.online ? '是' : '否'}</Text>
                <Text style={styles.text}>当前网络状态：{this.state.status}</Text>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    text: {
        padding: 10,
        backgroundColor: '#ccc'
    }
})

AppRegistry.registerComponent('NetInfoExample', () => NetInfoExample);
