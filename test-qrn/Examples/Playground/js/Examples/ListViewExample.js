'use strict'

import React, {
    Component,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'qunar-react-native';

import ExampleRender from '../ExampleRender';
import styles from '../styles';

const exampleList = {
    'ImageTextList': require('./ListViewExample/ImageTextList'),
    'RefreshControl': require('./ListViewExample/RefreshControl'),
    'onEndReached': require('./ListViewExample/onEndReached'),
    'RenderSectionHeader': require('./ListViewExample/RenderSectionHeader'),
}

class ExampleList extends React.Component {

    goExampleScene(example) {
        Ext.open('ExampleRender', { param: {example} });
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
    title: 'ListView',
    examples: [{
        render: () => {
            return (
                <ExampleList />
            );
        },
    }]
};
