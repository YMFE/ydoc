var React = require('qunar-react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var UIExplorerTitle = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.props.title}
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 10,
    marginBottom: 0,
    height: 45,
    padding: 10,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 19,
    fontWeight: '500',
  },
});

module.exports = UIExplorerTitle;
