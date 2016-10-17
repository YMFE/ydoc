'use strict'

import React, {Component, StyleSheet, View, Text, ProgressView} from 'qunar-react-native'
import TimerMixin from 'react-timer-mixin'

const ProgressViewExampleItem = React.createClass({
    mixins: [TimerMixin],

    getInitialState() {
        return {progress: 0};
    },

    componentDidMount() {
        this.updateProgress();
    },

    render() {
        return (
            <ProgressView progress={this.getProgress(0)} {...this.props}/>
        )
    },

    getProgress(offset) {
        var progress = this.state.progress + offset;
        return Math.sin(progress % Math.PI) % 1;
    },

    updateProgress() {
        var progress = this.state.progress + 0.01;
        this.setState({progress});
        this.requestAnimationFrame(() => this.updateProgress());
    },
})

module.exports = {
    title: 'ProgressView',
    examples: [{
        subtitle: 'Default settings',
        render: () => {
            return <ProgressViewExampleItem/>
        }
    }, {
        subtitle: 'trackTintColor: "orange", progressTintColor: "green"',
        render: () => {
            return <ProgressViewExampleItem
                trackTintColor="orange"
                progressTintColor="green"
            />
        }
    }, {
        subtitle: 'use trackImage and progressImage',
        render: () => {
            return <ProgressViewExampleItem
                trackImage={{uri: require('QImageSet').track}}
                progressImage={{uri: require('QImageSet').progress}}
            />
        }
    }]
};
