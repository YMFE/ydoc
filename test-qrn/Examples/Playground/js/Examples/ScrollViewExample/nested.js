'use strict'

import React, {Component, View, Text, ScrollView, TouchableOpacity} from 'qunar-react-native';

class ScrollViewExample extends Component {

    constructor(props) {
        super(props);

        this.state = {
            type: 0,
        }
    }

    changeType() {
        this.setState({
            type: this.state.type == 4 ? 0 : (this.state.type + 1),
        })
    }

    render() {

        let content, title;

        switch(this.state.type) {
            case 1:
                content =(
                    <View style={{height: 200, width: 200}}>
                        <ScrollView  xxx="out">
                            <View style={{height: 300, width: 200, backgroundColor: 'blue'}}>
                                <Text>fajkdjflksfasdfasdfasdfasdfasdfasdfasdfdsfasfdafdasfasdfsafsafasdfasdfajfklfasdfasfasfasdfasdfasfd</Text>
                                <View style={{height: 100, width: 100, left: 50, top: 50}}>
                                <ScrollView xxx="inner">
                                    <View style={{height: 200, width:100, backgroundColor: 'yellow'}}>
                                        <Text>fajkdjflksfasdfasdfasdfasdfasdfasdfasdfdsfasfdafdasfasdfsafsafasdfasdfajfklfasdfasfasfasdfasdfasfd</Text>
                                    </View>
                                </ScrollView>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                );
                title = 'Vertical'
                break;
            case 2:
                content =(
                    <View style={{height: 200, width: 200}}>
                        <ScrollView  xxx="out" horizontal={true}>
                            <View style={{height: 200, width: 300, backgroundColor: 'blue'}}>
                                <Text>fajkdjflksfasdfasdfasdfasdfasdfasdfasdfdsfasfdafdasfasdfsafsafasdfasdfajfklfasdfasfasfasdfasdfasfd</Text>
                                <View style={{height: 100, width: 100, left: 50, top: 50}}>
                                <ScrollView xxx="inner" horizontal={true}>
                                    <View style={{height: 100, width:200, backgroundColor: 'yellow'}}>
                                        <Text>fajkdjflksfasdfasdfasdfasdfasdfasdfasdfdsfasfdafdasfasdfsafsafasdfasdfajfklfasdfasfasfasdfasdfasfd</Text>
                                    </View>
                                </ScrollView>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                );
                title = 'Horizontal'
                break;
            case 3:
                content =(
                    <View style={{height: 200, width: 200}}>
                        <ScrollView  xxx="out" horizontal={true}>
                            <View style={{height: 200, width: 300, backgroundColor: 'blue'}}>
                                <Text>fajk</Text>
                                <View style={{height: 100, width: 100, left: 50, top: 50}}>
                                <ScrollView xxx="inner">
                                    <View style={{height: 200, width:100, backgroundColor: 'yellow'}}>
                                        <Text>fajkdjflksfasdfasdfasdfasdfasdfasdfasdfdsfasfdafdasfasdfsafsafasdfasdfajfklfasdfasfasfasdfasdfasfd</Text>
                                    </View>
                                </ScrollView>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                );
                title = 'Horizontal -> Vertical'
                break;
            case 4:
                content =(
                    <View style={{height: 200, width: 200}}>
                        <ScrollView  xxx="out">
                            <View style={{height: 300, width: 200, backgroundColor: 'blue'}}>
                                <Text>fajkdjflksfasdfasdfasdfasdfasdfasdfasdfdsfasfdafdasfasdfsafsafasdfasdfajfklfasdfasfasfasdfasdfasfd</Text>
                                <View style={{height: 100, width: 100, left: 50, top: 50}}>
                                <ScrollView xxx="inner" horizontal={true}>
                                    <View style={{height: 100, width:200, backgroundColor: 'yellow'}}>
                                        <Text>fajkdjflksfasdfasdfasdfasdfasdfasdfasdfdsfasfdafdasfasdfsafsafasdfasdfajfklfasdfasfasfasdfasdfasfd</Text>
                                    </View>
                                </ScrollView>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                );
                title = 'Vertical -> Horizontal'
                break;
            default:
                content =(
                    <View style={{height: 200, width: 200}}>
                        <ScrollView  xxx="out" horizontal={true}>
                            <View style={{height: 300, width: 300, backgroundColor: 'blue'}}>
                                <Text>fajkdjflksfasdfasdfasdfasdfasdfasdfasdfdsfasfdafdasfasdfsafsafasdfasdfajfklfasdfasfasfasdfasdfasfd</Text>
                                <View style={{height: 100, width: 100, left: 50, top: 50}}>
                                <ScrollView xxx="inner" horizontal={true}>
                                    <View style={{height: 200, width:200, backgroundColor: 'yellow'}} >
                                        <Text>fajkdjflksfasdfasdfasdfasdfasdfasdfasdfdsfasfdafdasfasdfsafsafasdfasdfajfklfasdfasfasfasdfasdfasfd</Text>
                                    </View>
                                </ScrollView>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                );
                title = 'Horizontal & Vertical'
        }

        return (
            <View style={{flex: 1}}>
                <TouchableOpacity onPress={() => this.changeType()} style={{margin: 10, padding: 10, borderWidth: 1, borderColor: '#eeeeee', borderRadius: 5, backgroundColor: '#ffffff', alignItems: 'center'}}>
                    <Text>{title}</Text>
                </TouchableOpacity>
                <View style={{flex: 1}}>
                    {content}
                </View>
            </View>
        )
    }
}

module.exports = {
    title: 'Nested ScrollView',
    examples: [{
        render: () => <ScrollViewExample />,
    }]
};
