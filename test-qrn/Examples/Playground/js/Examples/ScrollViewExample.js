'use strict'

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableOpacity,
    ScrollView,
} from 'qunar-react-native';

import ExampleRender from '../ExampleRender';
import styles from '../styles';

const exampleList = {
    '纵向滚动': require('./ScrollViewExample/01_vertical'),
    '横向滚动': require('./ScrollViewExample/02_horizontal'),
    '分页滚动(轮播图必备)': require('./ScrollViewExample/03_pagingEnabled'),
    'contentInset': require('./ScrollViewExample/04_contentInset'),
    '下拉刷新/加载更多': require('./ScrollViewExample/05_refreshControl&loadControl'),
    'scrollTo': require('./ScrollViewExample/06_scrollTo'),
    'KeyboardDismiss': require('./ScrollViewExample/07_keyboard'),
    'StickyHeader': require('./ScrollViewExample/08_stickyHeader'),

    // 'Vertical & Horizontal ScrollView': require('./ScrollViewExample/vertical&horizontal'),
    // 'RefreshControl & LoadControl ScrollView': require('./ScrollViewExample/refreshControl&loadControl'),
    // 'Animated ScrollView': require('./ScrollViewExample/animated'),
    // 'Sticky Header ScrollView': require('./ScrollViewExample/stickyHeader'),
    // 'Nested ScrollView': require('./ScrollViewExample/nested'),
    // 'Bounce & No Bounce ScrollView': require('./ScrollViewExample/bounce'),
    // 'ScrollTo': require('./ScrollViewExample/scrollTo'),
}

class ScrollViewList extends React.Component {

    goExampleScene(example) {
        Ext.open('ExampleRender', {
            title: example.title,
            param: {example}
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.list}>
                {
                    Object.keys(exampleList).map((exampleName, i) =>
                        <TouchableOpacity
                            key={i}
                            style={styles.listRow}
                            onPress={this.goExampleScene.bind(this, exampleList[exampleName])}>
                            <Text style={styles.listRowText}>{exampleName}</Text>
                        </TouchableOpacity>
                    )
                }
                </ScrollView>
            </View>
        )
    }
}

module.exports = {
    title: 'ScrollView',
    examples: [{
        render: () => {
            return (
                <ScrollViewList />
            );
        },
    }]
};
