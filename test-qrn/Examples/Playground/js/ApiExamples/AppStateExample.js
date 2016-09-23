var React = require('qunar-react-native');
var {
    AppState,
    Component,
    Text,
    View
} = React;

class AppStateSubscription extends Component{
    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
            previousAppStates: [],
        };
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
    }

    _handleAppStateChange(appState) {
        let previousAppStates = this.state.previousAppStates.slice();
        previousAppStates.push(this.state.appState);
        this.setState({
            appState,
            previousAppStates,
        });
    }

    render() {
        return (
            <View>
                {this.props.showCurrentOnly ?
                    <Text>{this.state.appState}</Text> :
                    <Text>{JSON.stringify(this.state.previousAppStates)}</Text>
                }
            </View>
        );
    }
}

exports.title = 'AppState';
exports.description = 'app background status';
exports.examples = [
    {
        subtitle: 'AppState.currentState',
        description: '在 APP 初始化的时候是 null',
        render: () => <Text>{AppState.currentState}</Text>
    },
    {
        subtitle: '订阅 AppState',
        description: '根据当前状态改变, 所以你只能看到它被渲染为 "active"',
        render: () => <AppStateSubscription showCurrentOnly={true} />
    },
    {
        subtitle: '之前的状态列表',
        render: () => <AppStateSubscription />
    },
];
