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
        fontSize: 26,
        fontWeight: 'bold'
    }
});

class ScrollViewExample extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: getCoupleOfRandomColor(30),
            qrn: true,
            long: true,
            bounces: true,
            alwaysBounceVertical: false,
            alwaysBounceHorizontal: true,
            showsVerticalScrollIndicator: true,
            showsHorizontalScrollIndicator: true,
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
            if(index >= (this.state.long ? 30 : 3)){
                return;
            }
            return (
                <View style={{width: 50, backgroundColor: item}} key={index}>
                    <Text style={styles.itemText}>{index}</Text>
                </View>
            )
        })

        return (
            <View style={{flex:1, paddingTop: 5}}>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· <Text style={styles.operationTextHighlight}>{this.state.qrn ? 'QRN' : 'RN'}</Text> 的ScrollView
                    </Text>
                    <Button text='切换' onPress={() => this.switch('qrn')} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· bounces <Text style={styles.operationTextHighlight}>{this.state.bounces ? 'true' : 'false'}</Text></Text>
                    <Button text='切换' onPress={() => this.switch('bounces')} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· 内容长度 <Text style={styles.operationTextHighlight}>{this.state.long ? '足够' : '不够'}</Text> 滚动</Text>
                    <Button text='切换' onPress={() => this.switch('long')} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· <Text style={styles.operationTextHighlight}>{this.state.alwaysBounceVertical ? '允许(非默认)' : '不允许(默认)'}</Text> 纵向内容不足时滚动(alwaysBounceVertical)</Text>
                    <Button text='切换' onPress={() => this.switch('alwaysBounceVertical')} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· <Text style={styles.operationTextHighlight}>{this.state.alwaysBounceHorizontal ? '允许(默认)' : '不允许(非默认)'}</Text> 横向内容不足时滚动(alwaysBounceHorizontal)</Text>
                    <Button text='切换' onPress={() => this.switch('alwaysBounceHorizontal')} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· <Text style={styles.operationTextHighlight}>{this.state.showsVerticalScrollIndicator ? '显示(默认)' : '不显示(非默认)'}</Text> 纵向滚动条showsVerticalScrollIndicator（长度不够滚动不会显示）</Text>
                    <Button text='切换' onPress={() => this.switch('showsVerticalScrollIndicator')} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· <Text style={styles.operationTextHighlight}>{this.state.showsHorizontalScrollIndicator ? '显示(默认)' : '不显示(非默认)'}</Text> 横向滚动条showsHorizontalScrollIndicator（长度不够滚动不会显示）</Text>
                    <Button text='切换' onPress={() => this.switch('showsHorizontalScrollIndicator')} />
                </View>
                <ScrollViewComponent horizontal
                    bounces={this.state.bounces}
                    alwaysBounceVertical={this.state.alwaysBounceVertical}
                    alwaysBounceHorizontal={this.state.alwaysBounceHorizontal}
                    showsVerticalScrollIndicator={this.state.showsVerticalScrollIndicator}
                    showsHorizontalScrollIndicator={this.state.showsHorizontalScrollIndicator}
                    contentContainerStyle={{height: 200}}>
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
    title: '横向滚动',
    examples: [{
        render: () => {
            return (
                <ScrollViewExample />
            );
        },
    }]
};
