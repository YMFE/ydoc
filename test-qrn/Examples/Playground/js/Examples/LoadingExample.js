'use strict'

import React, {Component, StyleSheet, View, Text, Image, ScrollView, Loading} from 'qunar-react-native';

class LoadingExample extends Component {

    constructor(props) {
        super(props);

        this.state = {
            animating: true,
        };
    }

    componentDidMount() {
        this.timer = setInterval(
            () => {
                this.setState({animating: !this.state.animating});
            }, 3000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <View style={styles.loadingContainer}>
                <Loading animating={this.state.animating} hidesWhenStopped={true}/>
                <Loading animating={this.state.animating} hidesWhenStopped={false}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});

module.exports = {
    title: 'Loading',
    scroll: true,
    examples: [{
        subtitle: 'Default settings',
        render: () => {
            return <Loading />
        },
    }, {
        subtitle: 'Custom Size',
        render: () => {
            return (
                <View style={styles.loadingContainer}>
                    <Loading size={18}/>
                    <Loading size={24}/>
                    <Loading size={30}/>
                </View>
            );
        },
    }, {
        subtitle: 'Custom Color',
        render: () => {
            return (
                <View style={styles.loadingContainer}>
                    <Loading color='#aa0000'/>
                    <Loading color='#00aa00'/>
                    <Loading color='#0000aa'/>
                </View>
            );
        },
    }, {
        subtitle: 'Start/Stop(hidesWhenStopped:true | false)',
        render: () => {
            return <LoadingExample />
        },
    }, {
        subtitle: 'Custom Icon',
        render: () => {
            return (
                <View style={styles.loadingContainer}>
                    <Loading content='A'/>
                    <Loading content='B'/>
                    <Loading content='C'/>
                </View>
            );
        },
    }, {
        subtitle: 'Custom Content',
        render: () => {
            return (
                <View style={styles.loadingContainer}>
                    <Loading speed={2000} contentRender={() => <Image style={{width:30, height: 30}} source={{uri: require('QImageSet').loading}} />}/>
                </View>
            );
        }
    }]
};
