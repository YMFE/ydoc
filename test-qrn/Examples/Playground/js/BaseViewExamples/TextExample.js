// -*- mode: web; coding: utf-8; -*-

'use strict';

import React, {Component, StyleSheet, Text, TouchableWithoutFeedback, View} from 'qunar-react-native';

var styles = StyleSheet.create({
    box: {
        backgroundColor: '#527FE4',
        borderColor: '#000033',
        borderWidth: 1,
    }
});

module.exports = {
    title: 'Text',
    scroll: true,
    examples: [
        {
            subtitle: 'INOVATION  ahhah',
            render: function() {
                return (
                    <View style={{backgroundColor: '#ffffff', padding: 5,width:300,height:80}}>
                        <Text style={{fontFamily:'qunar_react_native',fontSize:20,height:50}}>
                              {'\uf238'}自定义图标1{'\uf089'};
                          <Text style={{fontFamily:'qunar_react_native',fontSize:12,height:50}}>
                             {'\uf027'}{'\uf028'}自定义图标1
                          </Text>
                        </Text>
                    </View>
                );
            },
        },
        {
            subtitle: '中国智造',
            render: function() {
                return (
                    <View style={{backgroundColor: '#ffffff', padding: 5,width:300,height:30}}>
                        <Text style={{iconFont:'test_icon1'}}>
                            中国智造自定义图标
                        </Text>
                    </View>
                );
            },
        },
        {
            subtitle: 'Icon Font2',
            render: function() {
                return (
                    <View style={{backgroundColor: '#ffffff', padding: 5,width:300,height:30}}>
                        <Text style={{iconFont:'define'}}>
                            &#xf050;&#xf051;&#xf052;自定义图标
                        </Text>
                    </View>
                );
            },
        },
    ]
};
