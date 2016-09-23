'use strict'

import React, {Component, StyleSheet, View, Text, ScrollView, Tab} from 'qunar-react-native';

class TabExampleItem extends Component{

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: this.props.selectedIndex,
            value: typeof this.props.selectedIndex !== 'undefined' ? this.props.values[this.props.selectedIndex] : undefined,
        };
    }

    render() {
        const {values, tintColor, enabled, momentary, selectedIndex, tintBackgroundColor } = this.props;

        return (
            <View>
                <Tab
                    values={values}
                    tintColor={tintColor}
                    enabled={enabled}
                    momentary={momentary}
                    tintBackgroundColor={tintBackgroundColor}
                    selectedIndex={this.state.selectedIndex}
                    onChange={this._onChange.bind(this)}
                />
                <Text style={styles.text}>
                    Value: {this.state.value}  Index: {this.state.selectedIndex}
                </Text>
            </View>
        );

    }

    _onChange(event, index, value) {
        this.setState({
            selectedIndex: index,
            value: value,
        });
    }
};

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        margin: 10,
    },
});

module.exports = {
    title: 'Tab',
    scroll: true,
    examples: [{
        subtitle: 'Tab can have values',
        render: () => {
            return <TabExampleItem values={['One', 'Two']} />
        }
    }, {
        subtitle: 'Tab can have many values',
        render: () => {
            return <TabExampleItem values={['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']} />
        }
    }, {
        subtitle: 'Tab can have a pre-selected value',
        render: () => {
            return <TabExampleItem values={['One', 'Two', 'Three']} selectedIndex={2}/>
        }
    }, {
        subtitle: 'Tab can be momentary',
        render: () => {
            return <TabExampleItem values={['One', 'Two', 'Three']} momentary={true}/>
        }
    }, {
        subtitle: 'Tab can be disabled',
        render: () => {
            return <TabExampleItem values={['One', 'Two', 'Three']} selectedIndex={0} enabled={false}/>
        }
    }, {
        subtitle: 'Custom colors can be provided',
        render: () => {
            return <TabExampleItem values={['One', 'Two', 'Three']} tintColor="white" tintBackgroundColor="black" selectedIndex={0}/>
        }
    }, {
        subtitle: 'Change events can be detected',
        render: () => {
            return <TabExampleItem values={['One', 'Two', 'Three']} selectedIndex={0}/>
        }
    }],
};
