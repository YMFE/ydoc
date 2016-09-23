// -*- mode: web; -*-

'use strict';

import React, { Component } from 'react';
import {ScrollView, StyleSheet, Text, TouchableHighlight, View, AppRegistry} from 'qunar-react-native';

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 5,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#eeeeee',
        padding: 10,
    },
    text: {
        padding: 10,
    }
});


class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: getCoupleOfRandomColor(100),
        }
    }



    render() {

        let content = this.state.data.map((item, index)=>{
            return (
                <View style={{height: 50, backgroundColor: item}} key={index}>
                    <Text style={styles.itemText}>{index}</Text>
                </View>
            )
        })
        return (
            <ScrollView
                onScroll = {(e)=>{console.info('onScroll')}}
                >
                {content}
            </ScrollView>
            
        );
    }
}

function getCoupleOfRandomColor(num) {
    var colors = [];

    for(var i = 0; i < num; i++) {
        colors.push(getRandomColor());
    }

    return colors;
}

function getRandomColor() {
    var letters = '3456789ABC'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
}


AppRegistry.registerComponent('Example', () => Example)
