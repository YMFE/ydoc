/**
 * Created by wangxiaoyu.wang on 16/8/18.
 */

var React = require('react');
var ReactDOM = require('ReactDOM')
var ReactNative = require('qunar-react-native');
var {
    AppRegistry,
    View,
    Image,
    StyleSheet,
    TouchableHighlight,
    Text,
    ImageUploader,
    Alert
} = ReactNative;


let ImageUploaderExample = React.createClass({
    render: function(){
        return (
            <View>
                <Image
                    crossOrigin="Anonymous"
                    ref="img"
                    source={{uri: 'https://avatars3.githubusercontent.com/u/1024025?v=3&s=400'}} />
                <TouchableHighlight underlayColor="#38adff" onPress={this.uploadByImg}>
                    <View style={[styles.btn]}>
                        <Text style={{color:'#fff'}}>通过 img 元素上传</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#38adff" onPress={this.uploadByUrl}>
                    <View style={[styles.btn]}>
                        <Text style={{color:'#fff'}}>通过 url 上传</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#38adff" onPress={this.uploadByFile}>
                    <View style={[styles.btn]}>
                        <Text style={{color:'#fff'}}>通过 file 上传</Text>
                    </View>
                </TouchableHighlight>
                <input type="file" style={styles.input} ref="input" onChange={this.onChange}/>
            </View>
        );
    },
    uploadByUrl: function(){
        let uri = this.refs.img.props.source.uri;
        ImageUploader.uploadImage(uri, {
            serverAddress: 'http://127.0.0.1:8080/',
            serverParams: {
                param1: 1,
                param2: 2
            },
            fileKey: 'image',
        }, function(data){
            Alert.alert('上传成功');
        }, function(err){
            Alert.alert('上传失败', err.message);
        });
    },
    uploadByImg: function(){
        let image = ReactDOM.findDOMNode(this.refs.img);
        ImageUploader.uploadImage(image, {
            serverAddress: 'http://127.0.0.1:8080/',
            fileKey: 'image',
            maxWidth: 50
        }, function(data){
            Alert.alert('上传成功');
        }, function(err){
            Alert.alert('上传失败', err.message);
        });
    },
    uploadByFile: function(){
        var input = ReactDOM.findDOMNode(this.refs.input);
        input.click();
    },
    onChange: function(){
        var files = ReactDOM.findDOMNode(this.refs.input).files;
        ImageUploader.uploadImage(files[0], {
            serverAddress: 'http://127.0.0.1:8080/',
            fileKey: 'image',
            maxWidth: 50
        }, function(data){
            Alert.alert('上传成功');
        }, function(err){
            Alert.alert('上传失败', err.message);
        });
    }
});

var styles = StyleSheet.create({
    btn:{
        backgroundColor: '#38adff',
        borderRadius: 4,
        padding:5,
        textAlign: 'center',
        marginTop: 10
    },
    input: {
        display: 'none'
    }
});

AppRegistry.registerComponent('ImageExample', () => ImageUploaderExample);
