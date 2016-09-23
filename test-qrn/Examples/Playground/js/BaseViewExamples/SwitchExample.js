// -*- mode: web; -*-

'use strict';

import React, {Component, Switch, Text, View} from 'qunar-react-native';

const styles = {
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
};

class SwitchStateExample extends Component {
    constructor() {
        super();
        this.state = {
            vl: false,
            vr: true
        };
    }
    render() {
        return (
            <View>
                <View style={styles.switchContainer}>
                    <Switch value={this.state.vl} onValueChange={(s)=>this.setState({vl:s})} />
                    <Switch value={this.state.vr} onValueChange={(s)=>this.setState({vr:s})} />
                </View>
                <View style={styles.switchContainer}>
                    <Text>{this._t(this.state.vl)}</Text>
                    <Text>{this._t(this.state.vr)}</Text>
                </View>
            </View>
        );
    }
    _t(t) {
        return t ? '开' : '关';
    }
}

module.exports = {
    title: '<Switch>',
    examples: [
        {
            subtitle: '指定初始状态',
            render: function() {
                return (
                    <View style={styles.switchContainer}>
                        <Switch />
                        <Switch value />
                    </View>
                );
            }
        },
        {
            subtitle: '禁用',
            render: function() {
                return (
                    <View style={styles.switchContainer}>
                        <Switch disabled />
                        <Switch value disabled />
                    </View>
                );
            }
        },
        {
            subtitle: '监听状态',
            render: function() {
                return <SwitchStateExample />;
            }
        }
    ]
};
