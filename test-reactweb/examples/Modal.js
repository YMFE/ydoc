import React, { Component } from 'react';
import {
    Modal,
    StyleSheet,
    View,
    Text,
    AppRegistry,
    TouchableOpacity,
    Picker,
    Switch,
    ScrollView
} from 'react-native';


class ModalExample extends Component {
    constructor(){
        super();
        this.state = {
            visible: false,
            animation:'none',
            maskOpacity: 0.4,
            offset: 0,
            position:'center',
            closeModalAfterClickMask: true
        };
    }
    toggleModal(){
        this.setState({
            visible: !this.state.visible
        });
    }
    maskPressHandle(){
        this.setState({
            visible: !this.state.closeModalAfterClickMask
        });
    }
    render(){
        return (
            <ScrollView
                style={{flex:1}}
            >
            <View
                style={styles.container}
            >
                <Text style={styles.text}>当前动画效果：{this.state.animation}</Text>
                <Text style={styles.text}>遮罩层的透明度：{this.state.maskOpacity}</Text>
                <Text style={styles.text}>偏移量：{this.state.offset}</Text>
                <Text style={styles.text}>模态框显示位置：{this.state.position}</Text>
                <View
                    style={{flex:1,flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}
                >
                    <Text style={styles.text}>点击遮罩关闭 modal：{this.state.closeModalAfterClickMask ? 'true' : 'false'}</Text>
                    <Switch
                        value={this.state.closeModalAfterClickMask}
                        onValueChange = {(value)=>this.setState({closeModalAfterClickMask:value})}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        borderTopWidth:1,
                        borderBottomWidth: 1,
                        borderColor: '#ccc'
                    }}
                >
                    <Picker
                        style={{flex:2}}
                        selectedValue={this.state.animation}
                        onValueChange={(value)=>{
                            this.setState({animation:value})
                        }}
                    >
                        <Picker.Item label="none" value="none" />
                        <Picker.Item label="fade" value="fade" />
                        <Picker.Item label="slideFromBottom" value="slideFromBottom" />
                        <Picker.Item label="slideFromTop" value="slideFromTop" />
                        <Picker.Item label="slideFromLeft" value="slideFromLeft" />
                        <Picker.Item label="slideFromRight" value="slideFromRight" />
                    </Picker>
                    <Picker
                        style={{flex:1}}
                        selectedValue={this.state.maskOpacity}
                        onValueChange={(value)=>{
                            this.setState({maskOpacity:value})
                        }}
                    >
                        <Picker.Item label="0" value={0} />
                        <Picker.Item label="0.4" value={0.4} />
                        <Picker.Item label="0.6" value={0.6} />
                        <Picker.Item label="1" value={1} />
                    </Picker>
                    <Picker
                        style={{flex:1}}
                        selectedValue={this.state.offset}
                        onValueChange={(value)=>{
                            this.setState({offset:value})
                        }}
                    >
                        <Picker.Item label="-200" value={-200} />
                        <Picker.Item label="-100" value={-100} />
                        <Picker.Item label="0" value={0} />
                        <Picker.Item label="100" value={100} />
                        <Picker.Item label="200" value={200} />
                    </Picker>
                    <Picker
                        style={{flex:1}}
                        selectedValue={this.state.position}
                        onValueChange={(value)=>{
                            this.setState({position:value})
                        }}
                    >
                        <Picker.Item label="center" value="center" />
                        <Picker.Item label="top" value="top" />
                        <Picker.Item label="bottom" value="bottom" />
                        <Picker.Item label="left" value="left" />
                        <Picker.Item label="right" value="right" />
                    </Picker>
                </View>
                <Text
                    onPress={()=>{this.toggleModal()}}
                    style={styles.btn}
                >打开模态框</Text>
                <Modal
                    visible={this.state.visible}
                    animation={this.state.animation}
                    offset={this.state.offset}
                    position={this.state.position}
                    maskOpacity={this.state.maskOpacity}
                    onMaskPress={() => this.maskPressHandle()}
                >
                    <View
                        style={styles.dialog}
                    >
                        <Text
                            style={styles.content}
                        >
                            Modal 实例
                        </Text>
                        <TouchableOpacity
                            underlayColor="#38adff"
                            activeOpacity={0.5}
                            onPress={()=>{this.toggleModal()}}
                        >
                            <Text
                                style={styles.btn}
                            >关闭模态框</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
            </ScrollView>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 15
    },
    btn:{
        padding: 5,
        color: '#fff',
        backgroundColor: '#1f6f96',
        textAlign: 'center',
        borderRadius: 4,
        marginTop: 15,
        marginBottom: 15
    },
    dialog:{
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor:'#fff',
        width: 300,
        padding: 20,
        borderRadius: 6
    },
    text:{
        lineHeight: 30
    },
    content:{
        marginBottom: 30
    }
});

AppRegistry.registerComponent('ModalExample', () => ModalExample);
