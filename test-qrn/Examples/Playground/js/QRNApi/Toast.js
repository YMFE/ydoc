'use strict'

import React, {View, Component, Text, DeviceInfo, StyleSheet, Toast, Button, Radio, Slider, Dimensions} from 'qunar-react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
    },
    button: {
        flex: 1,
        margin: 10,
    },
    radio: {
        marginLeft: 10,
    },
    textContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    textRow: {
        flexDirection: 'row',
        padding: 5,
    },
    textLeft: {
        width: 100,
    },
    textMiddle: {
        width: 50,
    },
    textRight: {
        flex: 1
    },
})

class ToastDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: Math.floor(Math.random() * 10000) + '',
            duration: 'SHORT',
            customDuration: 1000,
            offset: 'TOP',
            customOffset: 0,
        }
    }

    showToast() {
        let duration, offset;

        duration = this.state.duration !== 'CUSTOM' ? Toast[this.state.duration] : this.state.customDuration;
        offset = this.state.offset !== 'CUSTOM' ? Toast[this.state.offset] : this.state.customOffset;

        Toast.show(this.state.message, duration, offset);
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={[styles.textContainer, {backgroundColor: '#eeeeee'}]}>
                    <Text>内容：</Text>
                    <Button style={{width: 50, marginLeft: 10}} text="重置" onPress={()=>this.setState({message: Math.floor(Math.random() * 10000) + ''})}/>
                    <Button style={{width: 50, marginLeft: 10}} text="太短" onPress={()=>this.setState({message: this.state.message + Math.floor(Math.random() * 10000)})}/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={{flex: 1}}>{this.state.message}</Text>
                </View>
                <View style={[styles.textContainer, {backgroundColor: '#eeeeee'}]}>
                    <Text>时长：  {this.state.duration !== 'CUSTOM' ? this.state.duration : this.state.customDuration} ms</Text>
                </View>
                <View style={styles.textContainer}>
                    <Radio style={{marginLeft: 10}} hasBorder checked={this.state.duration === 'SHORT'}/><Text style={{marginLeft: 5}} onPress={()=>this.setState({duration: 'SHORT'})}>SHORT</Text>
                    <Radio style={{marginLeft: 10}} hasBorder checked={this.state.duration === 'LONG'}/><Text style={{marginLeft: 5}} onPress={()=>this.setState({duration: 'LONG'})}>LONG</Text>
                    <Radio style={{marginLeft: 10}} hasBorder checked={this.state.duration === 'CUSTOM'}/><Text style={{marginLeft: 5}} onPress={()=>this.setState({duration: 'CUSTOM'})}>自定义(安卓不支持)</Text>
                </View>
                {
                    this.state.duration === 'CUSTOM' ? (
                        <View style={styles.textContainer}>
                            <View style={{flex: 1}}>
                                <Slider
                                    step={100}
                                    value={this.state.customDuration}
                                    minimumValue={100}
                                    maximumValue={5000}
                                    onValueChange={v=>this.setState({customDuration: v})}
                                />
                            </View>
                        </View>
                    ): null
                }
                <View style={[styles.textContainer, {backgroundColor: '#eeeeee'}]}>
                    <Text>位置：(安卓不支持) {this.state.offset !== 'CUSTOM' ? this.state.offset : this.state.customOffset}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Radio style={{marginLeft: 10}} hasBorder checked={this.state.offset === 'TOP'}/><Text style={{marginLeft: 5}} onPress={()=>this.setState({offset: 'TOP'})}>TOP</Text>
                    <Radio style={{marginLeft: 10}} hasBorder checked={this.state.offset === 'MIDDLE'}/><Text style={{marginLeft: 5}} onPress={()=>this.setState({offset: 'MIDDLE'})}>MIDDLE</Text>
                    <Radio style={{marginLeft: 10}} hasBorder checked={this.state.offset === 'BOTTOM'}/><Text style={{marginLeft: 5}} onPress={()=>this.setState({offset: 'BOTTOM'})}>BOTTOM</Text>
                    <Radio style={{marginLeft: 10}} hasBorder checked={this.state.offset === 'CUSTOM'}/><Text style={{marginLeft: 5}} onPress={()=>this.setState({offset: 'CUSTOM'})}>CUSTOM</Text>
                </View>
                {
                    this.state.offset === 'CUSTOM' ? (
                        <View style={styles.textContainer}>
                            <View style={{flex: 1}}>
                                <Slider
                                    step={50}
                                    value={this.state.customOffset}
                                    minimumValue={0}
                                    maximumValue={height}
                                    onValueChange={v=>this.setState({customOffset: v})}
                                />
                            </View>
                        </View>
                    ): null
                }
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} text="点击抛出一个Toast" onPress={()=>this.showToast()}/>
                </View>
            </View>
        )
    }
}

module.exports = {
    title: 'Toast',
    scroll: true,
    examples: [{
        render: () => {
            return (
                <ToastDemo />
            );
        },
    }]
};
