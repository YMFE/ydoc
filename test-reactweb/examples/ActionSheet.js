import React, { Component } from 'react';
import {
    AppRegistry,
    ListView,
    ActionSheet,
    StyleSheet,
    Text,
    View
} from 'qunar-react-native';

var BUTTONS = [
    'Option 0',
    'Option 1',
    'Option 2',
    'Delete',
    'Cancel',
];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

class ActionSheetExample extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { clicked: 'none' };
    }

    render() {
        return (
            <View>
                <Text onPress={this.showActionSheet.bind(this)} style={styles.button}>
                    Click to show the ActionSheet
                </Text>
                <Text>
                    Clicked button: {this.state.clicked}
                </Text>
            </View>
        );
    }

    showActionSheet() {
        ActionSheet.showActionSheetWithOptions(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
            },
            (buttonIndex) => {
                this.setState({ clicked: BUTTONS[buttonIndex] });
            }
        );
    }
}

class ActionSheetTintExample extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { clicked: 'none' };
    }

    render() {
        return (
            <View>
                <Text onPress={this.showActionSheet.bind(this)} style={styles.button}>
                    Click to show the ActionSheet
                </Text>
                <Text>
                    Clicked button: {this.state.clicked}
                </Text>
            </View>
        );
    }

    showActionSheet() {
        ActionSheet.showActionSheetWithOptions(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
                tintColor: 'green',
            },
            (buttonIndex) => {
                this.setState({ clicked: BUTTONS[buttonIndex] });
            }
        );
    }
}

class ShareActionSheetExample extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { text: '' };
    }

    render() {
        return (
            <View>
                <Text onPress={this.showShareActionSheet.bind(this)} style={styles.button}>
                    Click to show the Share ActionSheet
                </Text>
                <Text>
                    {this.state.text}
                </Text>
            </View>
        );
    }

    showShareActionSheet() {
        ActionSheet.showShareActionSheetWithOptions(
            {
                url: this.props.url,
                message: 'message to go with the shared url',
                subject: 'a subject to go in the email heading',
                excludedActivityTypes: [
                    'com.apple.UIKit.activity.PostToTwitter'
                ]
            },
            (error) => alert(error),
            (success, method) => {
                var text;
                if (success) {
                    text = `Shared via ${method}`;
                } else {
                    text = 'You didn\'t share';
                }
                this.setState({text});
            }
        );
    }
}

const styles = StyleSheet.create({
    button: {
        marginBottom: 10,
        fontWeight: '500',
        backgroundColor:'#ccc',
        padding:10,
        borderRadius:5

    },
    subtitle:{
        padding:10,
        backgroundColor:'#eee',
        borderBottom:'1px solid #ccc'
    },
    content:{
        padding:10
    }
});

let examples = [
    {
        subtitle: 'Show Action Sheet',
        render: () => <ActionSheetExample />
    },
    {
        subtitle: 'Show Action Sheet with tinted buttons',
        render: () => <ActionSheetTintExample />
    },
    {
        subtitle: 'Show Share Action Sheet',
        render: () => <ShareActionSheetExample url="https://code.facebook.com" />
    },
    {
        subtitle: 'Share Local Image',
        render: () => <ShareActionSheetExample url="bunny.png" />
    },
];


var Example = React.createClass({
    getInitialState:function(){
        var ds = new ListView.DataSource({rowHasChanged:(row1,row2)=>{return row1 !== row2}});
        return {
            dataSource: ds.cloneWithRows(examples)
        }
    },
    render: function(){
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData) => {
                    return (
                        <View>
                            <Text style={styles.subtitle}>{rowData.subtitle}</Text>
                            <View style={styles.content}>{rowData.render()}</View>
                        </View>
                    )
                }}
            />
        );
    }
});

AppRegistry.registerComponent('ActionSheet', () => Example)
