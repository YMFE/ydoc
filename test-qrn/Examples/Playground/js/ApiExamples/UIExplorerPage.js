var React = require('qunar-react-native');
var {
  ScrollView,
  StyleSheet,
  View,
} = React;

var UIExplorerTitle = require('./UIExplorerTitle');

var UIExplorerPage = React.createClass({

  propTypes: {
    keyboardShouldPersistTaps: React.PropTypes.bool,
    noScroll: React.PropTypes.bool,
    noSpacer: React.PropTypes.bool,
  },

  render: function() {
    var ContentWrapper;
    var wrapperProps = {};
    if (this.props.noScroll) {
      ContentWrapper = View;
    } else {
      ContentWrapper = ScrollView;
      wrapperProps.automaticallyAdjustContentInsets = !this.props.title;
      wrapperProps.keyboardShouldPersistTaps = true;
      wrapperProps.keyboardDismissMode = 'interactive';
    }
    var title = this.props.title ?
      <UIExplorerTitle title={this.props.title} /> :
      null;
    var spacer = this.props.noSpacer ? null : <View style={styles.spacer} />;
    return (
      <View style={styles.container}>
        {title}
        <ContentWrapper
          style={styles.wrapper}
          {...wrapperProps}>
            {this.props.children}
            {spacer}
        </ContentWrapper>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#e9eaed',
    flex: 1,
  },
  spacer: {
    height: 270,
  },
  wrapper: {
    flex: 1,
    paddingTop: 10,
  },
});

module.exports = UIExplorerPage;
