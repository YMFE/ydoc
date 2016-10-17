constructor(props) {
  super(props);
  this.state = {
    currentAppState: AppState.currentState,
  };
}
componentDidMount() {
  AppState.addEventListener('change', this._handleAppStateChange);
}
componentWillUnmount() {
  AppState.removeEventListener('change', this._handleAppStateChange);
}
_handleAppStateChange(currentAppState) {
  this.setState({ currentAppState, });
}
render() {
  return (
    <Text>Current state is: {this.state.currentAppState}</Text>
  );
}

// 这个例子会显示：`Current state is：active`，因为在 web 应用的状态一直是 `active`,
// 就算在 Android 或者 iOS 中，当用户看到这段话的时候，应用自然也是处在 `active` 状态的。
