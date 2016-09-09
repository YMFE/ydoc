const React = require('qunar-react-native');
const {
    Component,
    NetInfo,
    Text,
    View,
    TouchableWithoutFeedback,
} = React;

class ConnectionInfoSubscription extends Component{
    constructor(props) {
        super(props);
        this.state = {
            connectionInfoHistory: [],
        };
    }

    componentDidMount() {
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );
    }

    componentWillUnmount() {
        NetInfo.removeEventListener(
            'change',
            this._handleConnectionInfoChange
        );
    }

    _handleConnectionInfoChange = (connectionInfo) => {
        const connectionInfoHistory = this.state.connectionInfoHistory.slice();
        connectionInfoHistory.push(connectionInfo);
        this.setState({
            connectionInfoHistory,
        });
    }

    render() {
        return (
            <View>
                <Text>{JSON.stringify(this.state.connectionInfoHistory)}</Text>
            </View>
        );
    }
}

class ConnectionInfoCurrent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionInfo: null,
        };
    }

    componentDidMount() {
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );
        NetInfo.fetch().done(
            (connectionInfo) => { this.setState({connectionInfo}); }
        );
    }

    componentWillUnmount() {
        NetInfo.removeEventListener(
            'change',
            this._handleConnectionInfoChange
        );
    }

    _handleConnectionInfoChange = (connectionInfo) => {
        this.setState({
            connectionInfo,
        });
    }

    render() {
        return (
            <View>
                <Text>{this.state.connectionInfo}</Text>
            </View>
        );
    }
}

class IsConnected extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: null,
        };
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'change',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({isConnected}); }
        );
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'change',
            this._handleConnectivityChange
        );
    }

    _handleConnectivityChange = (isConnected) => {
        this.setState({
            isConnected,
        });
    }

    render() {
        return (
            <View>
                <Text>{this.state.isConnected ? 'Online' : 'Offline'}</Text>
            </View>
        );
    }
}

class IsConnectionExpensive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnectionExpensive: null,
        };
    }

    _checkIfExpensive = () => {
        NetInfo.isConnectionExpensive(
            (isConnectionExpensive) => { this.setState({isConnectionExpensive}); }
        );
    }

    render() {
        return (
            <View>
                <TouchableWithoutFeedback onPress={this._checkIfExpensive.bind(this)}>
                    <View>
                        <Text>Click to see if connection is expensive:
                            {this.state.isConnectionExpensive === true ? 'Expensive' :
                                this.state.isConnectionExpensive === false ? 'Not expensive'
                                    : 'Unknown'}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

exports.title = 'NetInfo';
exports.description = 'Monitor network status';
exports.examples = [
    {
        subtitle: 'NetInfo.isConnected',
        description: 'Asynchronously load and observe connectivity',
        render: () => <IsConnected />
    },
    {
        subtitle: 'NetInfo.update',
        description: 'Asynchronously load and observe connectionInfo',
        render: () => <ConnectionInfoCurrent />
    },
    {
        subtitle: 'NetInfo.updateHistory',
        description: 'Observed updates to connectionInfo',
        render: () => <ConnectionInfoSubscription />
    },
    {
        platform: 'android',
        subtitle: 'NetInfo.isConnectionExpensive (Android)',
        description: 'Asynchronously check isConnectionExpensive',
        render: () => <IsConnectionExpensive />
    },
];
