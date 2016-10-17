'use strict';

var React = require('qunar-react-native');
var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} = React;
  
class AwesomeProject extends Component {
  render() {
    var {navigator} = this.props
    return (
      <view style={styles.container}>
        <Text>
           TouchableOpacity实例
        </Text>
        <TouchableOpacity underlayColor="#38adff" activeOpacity={0.5} >
           <View 
               style={{width: 100, height: 30, alignItem: 'center', flex: 1}}
           >
            <Text >点击改变透明度</Text>
           </View>
        </TouchableOpacity>
      </view>
    );
  }
}
var styles =StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'column'
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);


  
module.exports = AwesomeProject
