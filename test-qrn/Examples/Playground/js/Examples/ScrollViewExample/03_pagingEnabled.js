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
    Dimensions,
    Button,
} from 'qunar-react-native';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

import ReactOrigin from 'react-native';

const styles = StyleSheet.create({
    operationContainer: {
        paddingBottom: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
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

        let ScrollViewComponent = this.state.qrn ? ScrollView : ReactOrigin.ScrollView;

        const scrollItemStyle = {
            height: 200,
            alignItems: 'center',
            justifyContent: 'center',
        }, scrollItemTextStyle = {
            color: '#fff',
            fontSize: 30,
        }

        return (
            <View style={{flex:1, paddingTop: 5}}>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>当前: <Text style={styles.operationTextHighlight}>{this.state.qrn ? 'QRN' : 'RN'}</Text> 的ScrollView
                    </Text>
                    <Button text='切换' onPress={() => this.switch('qrn')} />
                </View>
                <View style={{height: 200}}>
                    <ScrollViewComponent
                        pagingEnabled={true}
                        onScrollAnimationEnd={(e) => console.log('onScrollAnimationEnd', e)}
                    >
                        {
                            new Array(15).fill('').map((item, index) =>
                                <View key={index} style={[scrollItemStyle, {backgroundColor: getRandomColor()}]}>
                                    <Text style={[scrollItemTextStyle]}>纵向滚动{index}</Text>
                                </View>
                            )
                        }
                    </ScrollViewComponent>
                </View>
                <View style={{height: 200}}>
                    <ScrollViewComponent
                        horizontal={true}
                        pagingEnabled={true}
                        onScrollAnimationEnd={(e) => console.log('onScrollAnimationEnd', e)}>
                        {
                            new Array(15).fill('').map((item, index) =>
                                <View key={index} style={[scrollItemStyle, {width: windowWidth, backgroundColor: getRandomColor()}]}>
                                    <Text style={[scrollItemTextStyle]}>横向滚动{index}</Text>
                                </View>
                            )
                        }
                    </ScrollViewComponent>
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
    title: 'PagingEnabled ScrollView',
    examples: [{
        render: () => {
            return (
                <ScrollViewExample />
            );
        },
    }]
};
