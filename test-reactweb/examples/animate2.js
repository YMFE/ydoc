
var React = require('qunar-react-native');
var {
    Animated,
    Easing,
    View,
    StyleSheet,
    Text,
    AppRegistry
} = React;
var Header = require('./Header')
 
var Demo = React.createClass({
    getInitialState() {
        return {
            fadeInOpacity: new Animated.Value(0), // 初始值
            rotation: new Animated.Value(0),
            fontSize: new Animated.Value(0),
            imgSource: 'http://simg2.qunarzz.com/hotel/homesearch/sleeper_circle.png',
        };
    },
    componentDidMount() {
        var timing = Animated.timing;
        Animated.parallel(['fadeInOpacity', 'rotation', 'fontSize'].map(property => {
                return timing(this.state[property], {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear
            });
        })).start();
    },
    render() {
        var {navigator} = this.props
        return (
            <View 
                style={{flex: 1, flexDirection: 'column'}}
            >
                <Header navigator={navigator} title="animate2"></Header>
                <Animated.View style={[styles.demo, {
                    opacity: this.state.fadeInOpacity.interpolate({
                        inputRange: [0,1],
                        outputRange: [0,1]
                    }),
                    transform: [{
                        rotateZ: this.state.rotation.interpolate({
                                inputRange: [0,1],
                                outputRange: ['0deg', '360deg']
                            })
                    }]
                  }]}
                >
                    <Text>我擦嘞</Text>
                </Animated.View>
                <View 
                    style={styles.demo}
                >
                    <Text 
                        style={[{transform: [{
                            rotateZ: "270deg"
                        }, {scale: 1.4}]}]}
                    >axibu</Text>
                </View>
                <View 
                    style={styles.demo}
                >
                    <Text>文字内
                        <Animated.Image 
                            style={[styles.img, {
                            zIndex: 3, opacity: this.state.fadeInOpacity }]}
                            resizeMode={"stretch"} 
                            source={{uri: this.state.imgSource}}
                        >
                        </Animated.Image>图片
                    </Text>
                </View>
                <View 
                    style={styles.demo}
                >
                    <Animated.Text style={[{}, {
                        paddingHorizontal: 10,
                        fontSize: this.state.fontSize.interpolate({
                            inputRange: [0,1],
                            outputRange: [12,26]
                        }),
                        opacity: this.state.fadeInOpacity.interpolate({
                            inputRange: [0,1],
                            outputRange: [0,1]
                        }),
                        transform: [{
                            rotateZ: this.state.rotation.interpolate({
                                inputRange: [0,1],
                                outputRange: ['0deg', '360deg']
                            })
                        }, {scale: 1.5}]
                    }]}>我骑着七彩祥云出现了</Animated.Text>
                </View>
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
    img: {
        width: 100,
        height: 100,
        tintColor: "red"
    },
    text: {
        fontSize: 30
    }
});

module.exports = Demo
