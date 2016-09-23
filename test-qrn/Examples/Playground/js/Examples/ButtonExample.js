'use strict'

import React, {Component, StyleSheet, View, Text, Button, Image, ScrollView} from 'qunar-react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});

module.exports = {
    title: 'Button',
    scroll: true,
    examples: [{
        subtitle: 'Default settings(abled & disabled)',
        render: () => {
            return (
                <View style={styles.container}>
                    <Button />
                    <Button disabled/>
                </View>
            );
        },
    }, {
        subtitle: 'Custom Style(default / actived / disabled)',
        render: () => {
            return (
                <View style={styles.container}>
                    <Button
                        style={{backgroundColor: 'yellow'}}
                        activedStyle={{backgroundColor: 'red', opacity: 1}}
                        disabledStyle={{backgroundColor: 'grey'}}
                    />
                    <Button disabled
                        style={{backgroundColor: 'yellow'}}
                        activedStyle={{backgroundColor: 'red', opacity: 1}}
                        disabledStyle={{backgroundColor: 'grey'}}
                    />
                </View>
            );
        },
    }, {
        subtitle: 'Custom Text && TextStyle(default / actived / disabled)',
        render: () => {
            return (
                <View style={styles.container}>
                    <Button
                        text="你点我呀"
                        activedText="你点我了"
                        disabledText="你点不到我"
                        textStyle={{color:'green'}}
                        activedTextStyle={{color:'red',fontSize:20}}
                        disabledTextStyle={{color:'black'}}
                    />
                    <Button disabled
                        text="你点我呀"
                        activedText="你点我了"
                        disabledText="你点不到我"
                        textStyle={{color:'green'}}
                        activedTextStyle={{color:'red',fontSize:20}}
                        disabledTextStyle={{color:'black'}}
                    />
                </View>
            );
        },
    }, {
        subtitle: 'Tap event can be detected',
        render: () => {
            return (
                <View>
                    <View style={styles.container}>
                        <Button
                            onPress={()=>alert('onPress')}
                            onLongPress={()=>alert('onLongPress')}
                            onPressIn={()=>console.log('onPressIn')}
                            onPressOut={()=>console.log('onPressOut')}
                        />
                        <Button disabled
                            onPress={()=>alert('onPress')}
                            onLongPress={()=>alert('onLongPress')}
                            onPressIn={()=>console.log('onPressIn')}
                            onPressOut={()=>console.log('onPressOut')}
                        />
                    </View>
                </View>
            );
        },
    }]
};
