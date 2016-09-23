/** -*- mode: web; -*-
 * @providesModule ImageExample
 **/
 'use strict';
 var React = require('qunar-react-native');

var {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    Dimensions,
    Text
} = React;

var ImageExample = React.createClass({
    getInitialState: function(){
        return {
            uri : 'http://facebook.github.io/react/img/logo_og.png'
        };
    },
    render: function(){
        return (
            <View>
                <Image
                    style={styles.image}
                    source={{uri: this.state.uri}}
                    resizeMode={Image.resizeMode.cover}
                    blurRadius={10}
                />
                <Text style={{textAlign: 'center',marginTop: 10}}>cover</Text>
                <Image
                    style={styles.image}
                    source={{uri: this.state.uri}}
                    resizeMode={Image.resizeMode.stretch}
                    blurRadius={10}
                />
                <Text style={{textAlign: 'center',marginTop: 10}}>stretch</Text>
                <Image
                    style={styles.image}
                    source={{uri: this.state.uri}}
                    resizeMode={Image.resizeMode.contain}
                    blurRadius={10}
                />
                <Text style={{textAlign: 'center',marginTop: 10}}>contain</Text>
                <Image
                    style={styles.image}
                    source={{uri: this.state.uri}}
                    resizeMode={Image.resizeMode.repeat}
                    blurRadius={10}
                />
                <Text style={{textAlign: 'center',marginTop: 10}}>repeat</Text>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    image:{
        width: Dimensions.width,
        height:200,
        borderWidth: 1,
        borderColor: '#333',
        resizeMode: 'contain',
        paddingLeft: 40,
        backgroundColor: '#fff'
    }
});

AppRegistry.registerComponent('ImageExample', () => ImageExample)
