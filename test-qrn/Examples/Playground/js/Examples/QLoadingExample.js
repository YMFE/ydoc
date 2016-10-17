'use strict'

import React, {QLoading, View} from 'qunar-react-native';

module.exports = {
    title: 'QLoading',
    scroll: true,
    examples: [{
        subtitle: 'Default settings',
        render: () => {
            return <QLoading/>
        },
    }, {
        subtitle: 'Custom Width',
        render: () => {
            return (
                <View style={{flexDirection:'row'}}>
                    <QLoading style={{width: 100, borderWidth: 1, borderColor: '#1ba9ba'}}/>
                    <QLoading style={{width: 150, borderWidth: 1, borderColor: '#1ba9ba'}}/>
                </View>
            );
        },
    }, {
        subtitle: 'Custom Text',
        render: () => {
            return (
                <View style={{flexDirection:'row'}}>
                    <QLoading text='loading...'/>
                </View>
            );
        },
    }, {
        subtitle: 'Hide Text',
        render: () => {
            return (
                <View style={{flexDirection:'row'}}>
                    <QLoading hideText />
                </View>
            );
        },
    }],
};
