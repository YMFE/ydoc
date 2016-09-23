'use strict';

var React = require('qunar-react-native');
var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

  
class AwesomeProject extends Component {
   _login(){
       console.log('login')
   }
   render() {
    var {navigator} = this.props
    return (
        <View style={{flex:1, flexDirection: 'column'}}>
            <View 
                style={styles.innerContainer} 
            >
                <TouchableHighlight underlayColor="#38adff" onPress={this._login}>
                    <View style={[styles.btn, styles.center]}>
                        <Text style={{color:'#fff'}}>登录</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View> 
    );
  }
}
var styles =StyleSheet.create({
    innerContainer: {
        flex: 1,
    },
    center:{
        alignItems:'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    btn:{     
        height:35, 
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#38adff',
        borderRadius: 4,
        paddingBottom:10,
        paddingTop:10,
        paddingLeft:40,
        paddingRight:40
    }
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject)

module.exports = AwesomeProject
