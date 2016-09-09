var React = require('qunar-react-native');
var {
    Component,
    Clipboard,
    View,
    Text,
} = React;

class ClipboardExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'Content will appear here'
        };
    }

    async _setClipboardContent() {
        Clipboard.setString('Hello World');
        try {
            var content = await Clipboard.getString();
            this.setState({content});
        } catch (e) {
            this.setState({content: e.message});
        }
    }

    render() {
        return (
            <View>
                <Text onPress={this._setClipboardContent.bind(this)} style={{color: 'blue'}}>
                    Tap to put "Hello World" in the clipboard
                </Text>
                <Text style={{color: 'red', marginTop: 20}}>
                    {this.state.content}
                </Text>
            </View>
        );
    }
}

exports.title = 'Clipboard';
exports.description = 'Show Clipboard contents.';
exports.examples = [
    {
        title: 'Clipboard.setString() and getString()',
        render() {
            return <ClipboardExample/>;
        }
    }
];
