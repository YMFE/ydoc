import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
    AppRegistry
} from 'react-native';

const TimerMixin = require('react-timer-mixin');

const ToggleAnimatingActivityIndicator = React.createClass({
    mixins: [TimerMixin],

    getInitialState() {
        return {
            animating: true,
        };
    },

    setToggleTimeout() {
        this.setTimeout(() => {
            // this.setState({animating: !this.state.animating});
            this.setToggleTimeout();
        }, 2000);
    },

    componentDidMount() {
        this.setToggleTimeout();
    },

    render() {
        return (
            <ActivityIndicator
                animating={this.state.animating}
                style={[styles.centering, styles.gray]}
                color="#333"
                hidesWhenStopped={true}
                size="large"
            />
        );
    }
});

const styles = StyleSheet.create({
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 8,
    },
});

AppRegistry.registerComponent('app', () => ToggleAnimatingActivityIndicator);
