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
    RefreshControl
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
    },
    listIndex: {
        backgroundColor: '#1ba9ba',
        color: '#ffffff',
        padding: 5,
        fontSize: 14,
    },
    listItem: {
        padding: 10,
        fontSize: 16,
    }
});

function getRandomList() {
    let list = [];

    for(let i = 0; i < 26; i++) {
        list.push({
            type: 'index',
            content: String.fromCharCode(65 + i),
        });
        var randomItems = Math.random() * 5 + 1;

        for(let j = 0; j < randomItems; j++) {
            list.push({
                type: 'item',
                content: String.fromCharCode(65 + i) + j,
            })
        }
    }
    return list;
}

class ScrollViewExample extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            qrn: true,
            list: getRandomList(),
        };
    }

    switch(prop) {
        this.setState({
            [prop]: !this.state[prop],
        });
    }

    render() {
        let ScrollViewComponent = (this.state.qrn ? ScrollView : ReactOrigin.ScrollView);

        let content = [],
            stickyHeaderIndices = [];

        for(let i = 0, len = this.state.list.length; i < len; i++) {
            let item = this.state.list[i];

            if(item.type == 'index') {
                let index = i;
                stickyHeaderIndices.push(index);
            }

            content.push(item.type == 'index' ?
                (<View key={i}><Text style={styles.listIndex}>{item.content}</Text></View>) :
                    (<View key={i}><Text style={styles.listItem}>{item.content}</Text></View>));
        }

        return (
            <View style={{flex:1, paddingTop: 5}}>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· <Text style={styles.operationTextHighlight}>{this.state.qrn ? 'QRN' : 'RN'}</Text> 的ScrollView
                    </Text>
                    <Button text='切换' onPress={() => this.switch('qrn')} />
                </View>
                <View style={styles.operationContainer}>
                    <Text style={styles.operationText}>· 随机设置内容</Text>
                    <Button text='设置' onPress={() => this.setState({list: getRandomList()})} />
                </View>
                <ScrollViewComponent stickyHeaderIndices={stickyHeaderIndices}>
                    {content}
                </ScrollViewComponent>
            </View>
        )
    }
}

module.exports = {
    title: 'StickyHeader ScrollView',
    examples: [{
        render: () => {
            return (
                <ScrollViewExample />
            );
        },
    }]
};
