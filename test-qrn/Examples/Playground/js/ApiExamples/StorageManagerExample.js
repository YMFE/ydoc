'use strict';

import React, {Alert,QStorageManager,QStatusBar, StyleSheet, Text, TouchableHighlight,NativeModules, View, Component} from 'qunar-react-native';


class StorageManagerEx extends Component{

  render() {
    var SaveDateValue = 'ss';
    return (
      <View style={styles.container}>
        <Text
          style={styles.button}
          onPress={()=> {
            QStorageManager.saveData('hotel','manager',{value:SaveDateValue},()=>{
              Alert.alert('保存成功');
            },(err)=>{
              Alert.alert(JSON.stringify(err.message));
            })
          }
          }
        > saveData
        </Text>
        <Text
          style={styles.button}
          onPress={()=> {
            QStorageManager.removeData('hotel','manager')
          }
          }
        > remove
        </Text>
        <Text
          style={styles.button}
          onPress={()=> {
            QStorageManager.getData('hotel','manager','string',(data)=>{
              Alert.alert(JSON.stringify(data));
            },(err)=>{
              Alert.alert(JSON.stringify(err.message));
            })
          }
          }
        > getData
        </Text>
      </View>
          );
        }
}

var styles;
styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0D0D0'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'red',
    height: 200

  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  button: {
    height: 30,
    width: 80,
    borderWidth: 3,
    borderColor: '#f099f0',
    borderRadius: 3,
    textAlign: 'center',
    justifyContent: 'center',

  },
  button2: {
    marginBottom: 10,
    fontWeight: '500',
  }
});


module.exports = {
    title: 'StorageManager',
    scroll: true,
    examples: [{
                       render: function() {
                           return (
                               <StorageManagerEx />
                           );
                       }
                   }]
};
