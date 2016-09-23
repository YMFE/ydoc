'use strict'

import React, {
    Component,
    StyleSheet,
    View,
    Text,
    Navigator,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    Easing,
    Button,
} from 'qunar-react-native';

import ReactOrigin from 'react-native';

const styles = StyleSheet.create({
    operationContainer: {
        paddingBottom: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        height: 30,
    },
    operationText: {
        flex: 1,
        alignSelf: 'center',
    },
    operationTextHighlight: {
        color: '#1ba9ba',
    },
});

class ScrollViewExample extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            qrn: true,
        }
    }

    switch(prop) {
        this.setState({
            [prop]: !this.state[prop],
        })
    }

    render() {

        let ScrollViewComponent = (this.state.qrn ? ScrollView : ReactOrigin.ScrollView);
        let content = new Array(30).fill('').map((item, index) =>
            <View style={{height: 50, backgroundColor: getRandomColor()}} key={index}/>
        );

        return (
            <View style={{flex: 1, paddingTop: 5}}>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· <Text style={styles.operationTextHighlight}>{this.state.qrn ? 'QRN' : 'RN'}</Text> 的ScrollView
                    </Text>
                    <Button text='切换' onPress={() => this.switch('qrn')} />
                </View>
                <ScrollViewComponent
                    contentOffset={{x: 0, y: -50}}
                    contentInset={{top: 50, left: 0, bottom: 50, right: 0}}>
                    {content}
                </ScrollViewComponent>
                <View style={{height: 50, backgroundColor: 'black', opacity: 0.6, position: 'absolute', top: 35, left: 0, right: 0, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: '#fff', fontSize: 16, paddingHorizontal: 10}}>我是用来做遮挡的，上滑试试吧，然后下滑到顶部</Text>
                </View>
                <View style={{height: 50, backgroundColor: 'black', opacity: 0.6, position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: '#fff', fontSize: 16, paddingHorizontal: 10}}>我是用来做遮挡的，下滑试试吧，然后上滑到顶部</Text>
                </View>
            </View>
        )
    }
}

function getRandomColor() {
    var letters = '3456789ABC'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
}

module.exports = {
    title: 'ContentInset ScrollView',
    examples: [{
        render: () => {
            return (
                <ScrollViewExample />
            );
        },
    }]
};
