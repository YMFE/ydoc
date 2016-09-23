
var React = require('qunar-react-native');
var {
    Animated,
    Easing,
    View,
    StyleSheet,
    Text,
    Image,
    AppRegistry
} = React;
var Header = require('./Header')

var Demo = React.createClass({
    getInitialState() {
        return {
            count: 4,
            resizeMode: "cover",
            imgSource: 'http://simg2.qunarzz.com/hotel/homesearch/sleeper_circle.png',
            fadeInOpacity: new Animated.Value(0) // 初始值
        };
    },
    componentDidMount() {
        var me = this
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 1, // 目标值
            duration: 2500, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start(function (argument) {
            setTimeout(function () {
                me.setState({
                    count: 3,
                    resizeMode: "stretch",
                    imgSource: "http://source.qunar.com/site/images/wns/20150907_464x320_60.png"
                })
            }, 1500)
        });
    },
    onload: function (event) {
        console.log('img loaded')
    },
    render() {
        var state = this.state,
            {navigator} = this.props
        var four = state.count >= 4 ? (
                <View
                    style={styles.demo}
                    navigator={navigator}
                >
                    <Text>文字内
                        <Animated.Image
                            style={[styles.img, {
                            zIndex: 3, opacity: this.state.fadeInOpacity }]}
                            resizeMode={"stretch"}
                            onLoad={(event)=>this.onload(event)}
                            source={{uri: state.imgSource}}
                        >
                        </Animated.Image>图片
                    </Text>
                </View>
            ) : null
        return (
            <View
                style={{flex: 1, flexDirection: 'column'}}
            >
                <Header navigator={navigator} title="animate"></Header>
                <Animated.View style={[styles.demo, {
                        zIndex: 1,
                        opacity: this.state.fadeInOpacity
                    }]}>
                    <Text style={styles.text}>悄悄的，我出现了 - 1</Text>
                </Animated.View>
                <View
                    style={styles.demo}
                >
                    <Animated.Text style={[{color: 'red'}, {
                        zIndex: 2,
                        opacity: this.state.fadeInOpacity
                    }]}>
                        悄悄的，我出现了 - 2
                    </Animated.Text>
                </View>
                <View
                    style={styles.demo}
                >
                    <Animated.Image
                        style={[styles.imgCover, {
                        zIndex: 3, opacity: this.state.fadeInOpacity }]}
                        resizeMode={state.resizeMode}
                        onLoad={(event)=>this.onload(event)}
                        source={{uri: state.imgSource}}
                    >
                    </Animated.Image>
                </View>
                {four}
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
    }
});

module.exports = Demo
