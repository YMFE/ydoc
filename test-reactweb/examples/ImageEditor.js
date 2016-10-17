/** -*- mode: web; -*-
 * @providesModule ImageEditorExample
 **/
'use strict';

import React, {
    Component,
    Image,
    StyleSheet,
    Text,
    View,
    ImageStore,
    ImageEditor,
    TouchableOpacity,
    AppRegistry
} from 'qunar-react-native';

var smallImage = 'http://s.qunarzz.com/dev_test/qunar_react_native_demo/minion.png';

const styles = StyleSheet.create({
    base: {
        width: 314,
        height: 296,
    },
    button:{
        width:150,
        height:40,
        backgroundColor:'#1ba9ba',
        marginBottom:10,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText:{
        color:'#fff',
    }
});


class ImageEditorExample extends Component{
    constructor(props) {
      super(props);
      this.state  = {
        uri:'',
      }
    }
    imageEditor(){
        let ImageCropData = {
            offset: {
                x: 50,
                y: 50,
            },
            size: {
                width: 150,
                height: 140,
              }
        }
        ImageEditor.cropImage(smallImage,ImageCropData,(uri)=>{
            console.log('imageEditor',uri)
            this.setState({uri:uri})
        });
    }
    render(){
        return(
            <View>
                <TouchableOpacity style={styles.button} onPress={this.imageEditor.bind(this)}>
                    <Text style={styles.buttonText}>ImageEditor</Text>
                </TouchableOpacity>
                 <Image
                    source={{uri: smallImage}}
                    style = {styles.base}
                />
                <Image
                    source={{uri: this.state.uri}}
                    style = {styles.base}
                />
            </View>

        )
    }
}

AppRegistry.registerComponent('ImageEditorExample', () => ImageEditorExample)


