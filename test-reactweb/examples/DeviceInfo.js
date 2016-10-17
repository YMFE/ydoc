var React = require('react');
var ReactNative = require('qunar-react-native');
var {
    AppRegistry,
    View,
    DeviceInfo,
    Text,
} = ReactNative;


let DeviceInfoExample = React.createClass({
    getInitialState: function(){
        return {
            info: ''
        }
    },
    componentWillMount: function(){
        setTimeout(()=>{
            let info = JSON.stringify(DeviceInfo);
            this.setState({
                info: info
            });
        }, 3000);
    },
    render: function(){
        return (
            <View>
                <Text>device information: {this.state.info}</Text>
            </View>
        );
    }
});


AppRegistry.registerComponent('DeviceInfoExample', () => DeviceInfoExample);
