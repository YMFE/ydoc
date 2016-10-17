var React = require('qunar-react-native');
var {
    Animated,
    Easing,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Navigator,
    AppRegistry
} = React;

var Header = React.createClass({
    render() {
        const {goBack, title, navigator} = this.props

        return (
            <View style={styles.header}>
                {
                    navigator
                    ? <TouchableOpacity onPress={() => this.goBack()} style={styles.headerReturn}>
                        <Text style={styles.headerReturnText}>返回</Text>
                    </TouchableOpacity>
                    : null
                }
                <Text style={styles.headerText}>{title || 'WuKong UI'}</Text>
            </View>
        )
    },
    goBack() {
        const { navigator } = this.props
        if(navigator) {
            navigator.pop()
        }
    }
})

var styles = StyleSheet.create({
    header: {
        position: 'relative',
        padding: 8,
        backgroundColor: '#fff',
        textAlign: 'center', // 这个似乎应该用align-items来处理
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bolder',
    },
    headerReturn: {
        position: 'absolute',
        left: 10,
        top: 10,
    },
    headerReturnText: {
        fontSize: 14,
        color: '#666',
    },
})

module.exports = Header
