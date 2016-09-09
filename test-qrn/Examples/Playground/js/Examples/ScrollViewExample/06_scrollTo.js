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
    Toast,
} from 'qunar-react-native';

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
    itemText: {
        padding: 5,
        color: '#fff',
        alignSelf:'flex-end',
        fontSize: 32,
        fontWeight: 'bold'
    }
});

class ScrollViewExample extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            qrn: true,
            animated: true,
            data: getCoupleOfRandomColor(50),
        }
    }

    switch(prop) {
        this.setState({
            [prop]: !this.state[prop],
        })
    }

    render() {

        let ScrollViewComponent = (this.state.qrn ? ScrollView : ReactOrigin.ScrollView);
        let content = this.state.data.map((item, index)=>{
            return (
                <View style={{height: 50, backgroundColor: item}} key={index}>
                    <Text style={styles.itemText}>{index}</Text>
                </View>
            )
        })

        return (
            <View style={{flex:1, paddingTop: 5}}>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>scrollTo可以滚动到某一个位置，scrollTo默认是带动画的。通过onScrollAnimationEnd可以监听到滚动动画结束的事件。</Text>
                    <Button text='滚动' onPress={() => this.refs.scrollView.scrollTo({y: Math.random()*2000, animated: this.state.animated})} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>当前scrollTo<Text style={styles.operationTextHighlight}>{this.state.animated ? '带动画' : '不带动画'}</Text> （默认是带动画的，通过onScrollAnimationEnd可以监听到滚动动画结束的事件。如果不带动画，onScrollAnimationEnd则无法监听到结束事件。）</Text>
                    <Button text='切换' onPress={() => this.switch('animated')} />
                </View>
                <ScrollViewComponent ref="scrollView"
                    onScrollAnimationEnd={()=>Toast.show('滚动结束了', 1000, Toast.BOTTOM)}>
                    {content}
                </ScrollViewComponent>
            </View>
        )
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

module.exports = {
    title: 'scrollTo',
    examples: [{
        render: () => {
            return (
                <ScrollViewExample />
            );
        },
    }]
};
