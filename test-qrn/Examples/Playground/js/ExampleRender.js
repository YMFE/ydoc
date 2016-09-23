'use strict'

import React, {Component, StyleSheet, View, Text, ScrollView} from 'qunar-react-native';

import styles from './styles';

class ExampleRender extends QView {

    constructor(props) {
        super(props);
    }

    render() {
        const { param: { example } } = this.props;
        if (!example) return null
        let content, examples = example.examples;
        let ExampleWrapper = example.scroll ? ScrollView : View;

        if(examples.length == 1 && !examples[0].subtitle) {
            content = React.cloneElement(examples[0].render());
        } else {
            content = examples.map((item, i) =>
                <View style={styles.section} key={i}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{item.subtitle}</Text>
                    </View>
                    {item.description && <View style={styles.description}>
                        <Text>{item.description}</Text>
                    </View>}
                    <View style={styles.sectionBody}>
                        {React.cloneElement(item.render())}
                    </View>
                </View>
            )
        }

        return  (
            <View style={styles.container}>
                <ExampleWrapper style={styles.wrapper}>{content}</ExampleWrapper>
            </View>
        );
    }
};

export default ExampleRender;
