'use strict';

var React = require('qunar-react-native');
var {
    View,
    StyleSheet,
    Text,
    AppRegistry
} = React;


var Demo = React.createClass({
    getInitialState() {
        console.log('xxxxxx')
        return { }
    },
    componentWillMount(){
        console.log('zzzz')
    },
    componentDidMount() {
        console.log("yyyyy")
    },
    render() {
        var aaa = 111,
            {navigator} = this.props
        return (
            <View style={[{flex: 1, flexDirection: 'column'}]}>
                {aaa}
            </View>
        );
    }
});

AppRegistry.registerComponent('AwesomeProject', () => Demo);

module.exports = Demo
