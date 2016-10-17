var React = require('react');
var ReactNative = require('qunar-react-native');
var {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Geolocation
} = ReactNative;


let GeolocationExample = React.createClass({
    getInitialState: function(){
        return {
            position: null,
            status: '正在获取地理位置'
        };
    },
    componentWillMount: function(){
        Geolocation.watchPosition((position) => {
            console.log(position);
            this.setState({position:position});
        },(positionError) => {
            this.setState({
                status: '获取地理位置失败, 错误原因: ' + positionError.message
            });
            console.error(positionError.message);
        }, {
            timeout: 5000,
            enableHighAccuracy: true,
        });
    },
    render: function(){
        let position = this.state.position;
        if (position){
            return (
                <View>
                    <Text>海拔: {position.coords.altitude || '未知' }</Text>
                    <Text>经度: {position.coords.longitude || '未知'}</Text>
                    <Text>纬度: {position.coords.latitude || '未知'}</Text>
                    <Text>速度: {position.coords.speed || '未知' }</Text>
                    <Text>角度: {position.coords.heading || '未知' }</Text>
                    <Text>用移动设备打开本页面四处走走看看, 地球很大的, 不要仅仅在办公桌附加走动</Text>
                </View>
            );
        } else {
            return <Text>{this.state.status}</Text>
        }
    }
});


AppRegistry.registerComponent('GeolocationExample', () => GeolocationExample);
