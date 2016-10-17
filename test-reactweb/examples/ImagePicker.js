/** -*- mode: web; -*-
 * @providesModule ImagePickerExample
 **/
'use strict'

import React, {AppRegistry,Component, StyleSheet, View, Text, TouchableOpacity,Image,ImagePickerIOS} from 'qunar-react-native';

var styles =StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: 'column'
    },
    base: {
        width: 314,
        height: 296,
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
        paddingRight:40,
        margin:10,
    }
});
var smallImage = 'http://s.qunarzz.com/dev_test/qunar_react_native_demo/minion.png';
 
class Example extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      uri:smallImage
    };
  }
  canRecordVideos(){
    ImagePickerIOS.canRecordVideos((data)=>{
       alert(data);
    })

  }

  canUseCamera(){
    ImagePickerIOS.canUseCamera((data)=>{
      alert(data);
    })
  }

  openSelectDialog(){
    ImagePickerIOS.openSelectDialog({},(data)=>{
      this.setState({uri:data})
      console.log(data)
    },(error)=>{
      console.log(error)
    })
  }

  openCameraDialog(){
    ImagePickerIOS.openCameraDialog({},(data)=>{
      this.setState({uri:data})
      console.log(data)
    },(error)=>{
      console.log(error)
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress = {this.canRecordVideos.bind(this)} style={styles.btn}>
            <Text style={{color:'#fff'}}>canRecordVideos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {this.canUseCamera.bind(this)} style={styles.btn}>
            <Text style={{color:'#fff'}}>canUseCamera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {this.openSelectDialog.bind(this)} style={styles.btn}>
            <Text style={{color:'#fff'}}>openSelectDialog</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {this.openCameraDialog.bind(this)} style={styles.btn}>
            <Text style={{color:'#fff'}}>openCameraDialog</Text>
        </TouchableOpacity>
        <Image
            source={{uri: this.state.uri}}
            style = {styles.base}
        />
      </View>
    );
  }
}


AppRegistry.registerComponent('Example', () => Example)