'use strict'

import React, {Component, StyleSheet, View, Text, TouchableOpacity} from 'qunar-react-native';
import styles from './styles';

class ExampleHeader extends Component {
    render() {
        const {goBack, title, navigator} = this.props;

        return (
            <View style={styles.header}>
                {
                    navigator
                    ? <TouchableOpacity onPress={() => this.goBack()} style={styles.headerReturn}>
                        <Text style={styles.headerReturnText}>返回</Text>
                    </TouchableOpacity>
                    : null
                }
                <Text style={styles.headerText}>{title || 'Demo'}</Text>
            </View>
        );
    }

    goBack() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }
}

export default ExampleHeader;
