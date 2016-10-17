'use strict';

var React = require('qunar-react-native');
var {
    Animated,
    Easing,
    View,
    StyleSheet,
    Text,
    Image,
    AppRegistry,
    ViewPager  
} = React;
 
var Demo = React.createClass({
    getInitialState() {
        return {
        };
    },
    componentDidMount() {
       
    },
    render() {
        var state = this.state,
            {navigator} = this.props
        return (
            <View 
                style={{flex: 1, flexDirection: 'column'}}
            >
                <ViewPager
                    style={styles.viewPager} 
                    initialPage={0} 
                >
                    <View style={styles.pageStyle}>
                        <Text>First page</Text>
                    </View>
                    <View style={styles.pageStyle}>
                        <Text>Second page</Text>
                    </View>
                </ViewPager>
            </View>
        );
    }
});
var styles = StyleSheet.create({
    demo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightBlue',
    },
    viewPager: {
        flex: 1
    },
    text: {
        fontSize: 30
    },
    img: {
        width: 100,
        height: 100,
        tintColor: "red"
    },
    imgCover: {
        width: 50,
        height: 100,
        tintColor: "red"
    },
    pageStyle: {
        alignItems: 'center',
        padding: 20,
        flex: 1,
        backgroundColor: 'lightBlue'
    }
});


AppRegistry.registerComponent('AwesomeProject', () => Demo)

module.exports = Demo
