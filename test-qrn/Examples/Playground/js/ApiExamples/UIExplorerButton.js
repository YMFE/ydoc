var React = require('qunar-react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
} = React;

var UIExplorerButton = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
  },
  render: function() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={styles.button}
        underlayColor="grey">
        <Text>
          {this.props.children}
        </Text>
      </TouchableHighlight>
    );
  },
});

var styles = StyleSheet.create({
  button: {
    borderColor: '#696969',
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d3d3d3',
  },
});

module.exports = UIExplorerButton;
