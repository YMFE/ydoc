var React = require('qunar-react-native');
var {
  StyleSheet,
  View
} = React;

var styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
  },
  border1: {
    borderWidth: 10,
    borderColor: 'brown',
  },
  borderRadius: {
    borderWidth: 10,
    borderRadius: 10,
    borderColor: 'cyan',
  },
  border2: {
    borderWidth: 10,
    borderTopColor: 'red',
    borderRightColor: 'yellow',
    borderBottomColor: 'green',
    borderLeftColor: 'blue',
  },
  border3: {
    borderColor: 'purple',
    borderTopWidth: 10,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderLeftWidth: 40,
  },
  border4: {
    borderTopWidth: 10,
    borderTopColor: 'red',
    borderRightWidth: 20,
    borderRightColor: 'yellow',
    borderBottomWidth: 30,
    borderBottomColor: 'green',
    borderLeftWidth: 40,
    borderLeftColor: 'blue',
  },
  border5: {
    borderRadius: 50,
    borderTopWidth: 10,
    borderTopColor: 'red',
    borderRightWidth: 20,
    borderRightColor: 'yellow',
    borderBottomWidth: 30,
    borderBottomColor: 'green',
    borderLeftWidth: 40,
    borderLeftColor: 'blue',
  },
  border6: {
    borderTopWidth: 10,
    borderTopColor: 'red',
    borderRightWidth: 20,
    borderRightColor: 'yellow',
    borderBottomWidth: 30,
    borderBottomColor: 'green',
    borderLeftWidth: 40,
    borderLeftColor: 'blue',

    borderTopLeftRadius: 100,
  },
  border7: {
    borderWidth: 10,
    borderColor: '#f007',
    borderRadius: 30,
    overflow: 'hidden',
  },
  border7_inner: {
    backgroundColor: 'blue',
    width: 100,
    height: 100
  },
  border8: {
    width: 60,
    height: 60,
    borderColor: 'black',
    marginRight: 10,
    backgroundColor: 'lightgrey',
  },
});

exports.title = 'Border';
exports.scroll = true;
exports.description = 'Demonstrates some of the border styles available to Views.';
exports.examples = [
  {
    subtitle: 'Equal-Width / Same-Color',
    description: 'borderWidth & borderColor',
    render() {
      return <View style={[styles.box, styles.border1]} />;
    }
  },
  {
    subtitle: 'Equal-Width / Same-Color',
    description: 'borderWidth & borderColor & borderRadius',
    render() {
      return <View style={[styles.box, styles.borderRadius]} />;
    }
  },
  {
    subtitle: 'Equal-Width Borders',
    description: 'borderWidth & border*Color',
    render() {
      return <View style={[styles.box, styles.border2]} />;
    }
  },
  {
    subtitle: 'Same-Color Borders',
    description: 'border*Width & borderColor',
    render() {
      return <View style={[styles.box, styles.border3]} />;
    }
  },
  {
    subtitle: 'Custom Borders',
    description: 'border*Width & border*Color',
    render() {
      return <View style={[styles.box, styles.border4]} />;
    }
  },
  {
    subtitle: 'Custom Borders',
    description: 'border*Width & border*Color',
    platform: 'ios',
    render() {
      return <View style={[styles.box, styles.border5]} />;
    }
  },
  {
    subtitle: 'Custom Borders',
    description: 'border*Width & border*Color',
    platform: 'ios',
    render() {
      return <View style={[styles.box, styles.border6]} />;
    }
  },
  {
    subtitle: 'Custom Borders',
    description: 'borderRadius & clipping',
    platform: 'ios',
    render() {
      return (
        <View style={[styles.box, styles.border7]}>
          <View style={styles.border7_inner} />
        </View>
      );
    }
  },
  {
    subtitle: 'Single Borders',
    description: 'top, left, bottom right',
    render() {
      return (
        <View style={{flexDirection: 'row'}}>
          <View style={[styles.box, styles.border8, {borderTopWidth: 5}]} />
          <View style={[styles.box, styles.border8, {borderLeftWidth: 5}]} />
          <View style={[styles.box, styles.border8, {borderBottomWidth: 5}]} />
          <View style={[styles.box, styles.border8, {borderRightWidth: 5}]} />
        </View>
      );
    }
  },
];
