var React = require('react');
var ReactNative = require('qunar-react-native');
var {
    AppRegistry,
    View,
    Text,
    QHotDogNetWork
} = ReactNative;


let QHotDogNetWorkExample = React.createClass({
    getInitialState: function(){
        return {
            name: '',
            watchers: 0,
            forks: 0,
            stargazersCount: 0
        };
    },
    componentWillMount: function(){
        let id = QHotDogNetWork.postRequest({
            url: 'https://api.github.com/repos/facebook/react',
            successCallback: (data) => {
                this.setState({
                    name: data.name,
                    watchers: data.watchers,
                    forks: data.forks,
                    stargazersCount: data.stargazers_count
                });
            },
            failCallback: (err) => {
                console.log(err);
            }
        });
        setTimeout(()=>{
            // 两秒内网络请求没有完成，就取消请求
            QHotDogNetWork.cancelNetWorkTask(id);
        }, 2000);

    },
    render: function(){
        return (
            <View>
                <Text>name: {this.state.name}</Text>
                <Text>watch: {this.state.watchers}</Text>
                <Text>star: {this.state.stargazersCount}</Text>
                <Text>folk: {this.state.forks}</Text>
            </View>
        );
    }
});

AppRegistry.registerComponent('QHotDogNetWorkExample', () => QHotDogNetWorkExample);
