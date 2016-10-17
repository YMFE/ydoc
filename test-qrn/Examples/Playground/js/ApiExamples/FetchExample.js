import {
    Component,
    View,
    Text,
    QLoading,
    TouchableOpacity
} from 'qunar-react-native'

import '@qnpm/react-native-ext-fetch';
const cf = Ext.utils.fetch;

class FetchExample extends QComponent {
    styles = styles;
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            text: '接收中……'
        }
    }

    componentWillMount() {
        this.fetch = cf('http://www.gutenberg.org/cache/epub/100/pg100.txt')
            .then(res => res.text())
            .then(text => {
                this.setState({text: text.length});
            })
            .catch(err => {
                console.log(err);
                this.setState({text: '中止接收'});
            })
            .finally(() => {
                this.setState({loading: false});
            });
    }

    abortFetch() {
        this.fetch.cancel();
    }

    render() {
        return (
            <View class="container">
                <TouchableOpacity
                    onPress="abortFetch"
                    class="button">
                    <Text>点击中止请求</Text>
                </TouchableOpacity>
                {this.state.loading && <QLoading/>}
                <Text class="section">接收的文件的字数：{this.state.text}</Text>
            </View>
        )
    }
}

const styles = {
    button: {
        padding: 10,
        backgroundColor: '#f6f7f8',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "#ccc",
    },
    container: {
        margin: 10,
    },
    section: {
        marginVertical: 10,
    }
}

module.exports = {
    title: 'Fetch',
    scroll: true,
    examples: [{
        render: function() {
            return (
                <FetchExample />
            );
        }
    }]
};
