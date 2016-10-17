'use strict'

import React, {View, Component, Text, DeviceInfo, StyleSheet} from 'qunar-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 5,
    },
    textRow: {
        flexDirection: 'row',
        padding: 5,
    },
    textLeft: {
        width: 100,
    },
    textRight: {
        flex: 1
    },
});

class DeviceInfoDemo extends Component {
    render() {
        let content = [],
            counter = 0;

        DeviceInfo.vid = null;

        const keys = {
            'isIOS': 'boolean',
            'isAndroid': 'boolean',
            'vid': 'string',
            'pid': 'string',
            'cid': 'string',
            'uid': 'string',
            'sid': 'string',
            'gid': 'string',
            'mac': 'string',
            'model': 'string',
            'manufacturer': 'string',
            'platform': 'string',
            'osVersion': 'string',
            'scheme': 'string',
            'qrn_version': 'string',
            'releaseType': 'string',
        };

        for(let prop in keys) {
            let checked = false;

            if(typeof DeviceInfo[prop] !== 'undefined' && typeof DeviceInfo[prop] === keys[prop]) {
                checked = true;
            }

            let _backgroundColor = checked ? (counter % 2 == 1 ? '#ffffff' : '#eeeeee') : '#f9f2f4',
                _fontColor = checked ? '#333333' : '#c7254e';

            content.push(
                <View key={counter} style={[styles.textRow, {backgroundColor: _backgroundColor}]}>
                    <View style={styles.textLeft}><Text style={{color: _fontColor}}>{prop}</Text></View>
                    <View style={styles.textRight}><Text style={{color: _fontColor}}>{DeviceInfo[prop]+''}</Text></View>
                </View>);

            counter++;
        }

        return (
            <View style={styles.container}>
                {content}
            </View>
        )
    }
}

module.exports = {
    title: 'DeviceInfo',
    scroll: true,
    examples: [{
        render: () => {
            return (
                <DeviceInfoDemo />
            );
        },
    }]
};
