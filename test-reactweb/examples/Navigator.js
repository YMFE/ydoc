'use strict';
var React = require('qunar-react-native');
var {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Navigator
} = React;


var Page = React.createClass({
    _push:function(){
        this.props.navigator.push({
            index:this.props.index + 1,
            component:Page,
            name: this.props.index + 1
        });
    },
    _pop:function(){
        this.props.navigator.pop();
    },
    _popToTop:function(){
        this.props.navigator.popToTop();
    },
    render:function(){
        return (
            <View style={styles.page}>
                <Text style={styles.btn} onPress={()=> this._push()}>push</Text>
                <Text style={styles.btn} onPress={()=> this._pop()}>pop</Text>
                <Text style={styles.btn} onPress={()=> this._popToTop()}>popToTop</Text>
            </View>
        );
    }
});


var NavigatorExample = React.createClass({
    NavigationBarRouteMapper:{
        LeftButton: function (route, navigator, index, navState) {
            return (
                <Text
                    style={{marginLeft:10}}
                    onPress={()=>{
                        navigator.jumpBack();
                    }}
                >返回</Text>
            );
        },
        RightButton: function (route, navigator, index, navState) {
            return (
                <Text
                    style={{marginRight:10}}
                    onPress={()=>{
                        navigator.jumpForward();
                    }}
                >前进</Text>
            );
        },
        Title: function (route, navigator, index, navState) {
            return (
                <Text style={styles.title}>
                    #{route.index}
                </Text>
            );
        },
    },
    render:function(){
        return (
            <Navigator
                initialRoute={{
                    index:0,
                    component:Page
                }}
                configureScene={(route,routeStack) => {
                    let configs = Object.keys(Navigator.SceneConfigs);
                    let randomConfig = configs[Math.floor(Math.random() * configs.length)];
                    console.log(randomConfig);
                    return Navigator.SceneConfigs[randomConfig];
                }}
                renderScene={(route,navigator) => {
                    let Component = route.component;
                    return <Component index={route.index} navigator={navigator} />;
                }}
                navigationBar={
                    <Navigator.NavigationBar
                        style={styles.nav}
                        routeMapper={this.NavigationBarRouteMapper}
                    />
                }
            />
        );
    }
});

var styles = StyleSheet.create({
    nav:{
        backgroundColor:'#00afc7',
        color:'#fff',
        flex:1,
        paddingLeft:10,
        paddingRight:10
    },
    btn:{
        width:120,
        textAlign:'center',
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:10,
        paddingRight:10,
        marginBottom:5,
        marginTop:5,
        backgroundColor:'#ccc',
        borderRadius:5
    },
    page:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title:{
        fontSize:20,
    }
});


AppRegistry.registerComponent('NavigatorExample', () => NavigatorExample);
