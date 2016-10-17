// -*- mode: web; -*-

'use strict';

import React, {
    Component,
    Image,
    MapView,
    PropTypes,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'qunar-react-native';

var regionText = {
    latitude: '0',
    longitude: '0',
    latitudeDelta: '0',
    longitudeDelta: '0',
};

class MapRegionInput extends Component {

    constructor() {
        super();

        this._change = this._change.bind(this);

        this.state =  {
            region: {
                latitude: 0,
                longitude: 0,
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            region: nextProps.region || this.getInitialState().region
        });
    }

    render() {
        var region = this.state.region || this.getInitialState().region;
        return (
            <View>
                <View style={styles.row}>
                    <Text>
                        {'Latitude'}
                    </Text>
                    <TextInput
                        value={'' + region.latitude}
                        style={styles.textInput}
                        onChange={this._onChangeLatitude}
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text>
                        {'Longitude'}
                    </Text>
                    <TextInput
                        value={'' + region.longitude}
                        style={styles.textInput}
                        onChange={this._onChangeLongitude}
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text>
                        {'Latitude delta'}
                    </Text>
                    <TextInput
                        value={
                            region.latitudeDelta == null ? '' : String(region.latitudeDelta)
                              }
                        style={styles.textInput}
                        onChange={this._onChangeLatitudeDelta}
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.row}>
                    <Text>
                        {'Longitude delta'}
                    </Text>
                    <TextInput
                        value={
                            region.longitudeDelta == null ? '' : String(region.longitudeDelta)
                              }
                        style={styles.textInput}
                        onChange={this._onChangeLongitudeDelta}
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.changeButton}>
                    <Text onPress={this._change}>
                        {'Change'}
                    </Text>
                </View>
            </View>
        );
    }

    _onChangeLatitude(e) {
        regionText.latitude = e.nativeEvent.text;
    }

    _onChangeLongitude(e) {
        regionText.longitude = e.nativeEvent.text;
    }

    _onChangeLatitudeDelta(e) {
        regionText.latitudeDelta = e.nativeEvent.text;
    }

    _onChangeLongitudeDelta(e) {
        regionText.longitudeDelta = e.nativeEvent.text;
    }

    _change() {
        this.setState({
            region: {
                latitude: parseFloat(regionText.latitude),
                longitude: parseFloat(regionText.longitude),
                latitudeDelta: parseFloat(regionText.latitudeDelta),
                longitudeDelta: parseFloat(regionText.longitudeDelta),
            },
        });
        this.props.onChange(this.state.region);
    }
}

MapRegionInput.propTypes = {
    region: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        latitudeDelta: PropTypes.number,
        longitudeDelta: PropTypes.number,
    }),
    onChange: PropTypes.func.isRequired,
};

class MapViewExample extends Component {

    constructor() {
        super();

        this._onRegionChange = this._onRegionChange.bind(this);
        this._getAnnotations = this._getAnnotations.bind(this);
        this._onRegionChangeComplete = this._onRegionChangeComplete.bind(this);
        this._onRegionInputChanged = this._onRegionInputChanged.bind(this);

        this.state = {
            isFirstLoad: true,
            mapRegion: undefined,
            mapRegionInput: undefined,
            annotations: [],
        };
    }

    render() {
        return (
            <View>
                <MapView
                    style={styles.map}
                    onRegionChange={this._onRegionChange}
                    onRegionChangeComplete={this._onRegionChangeComplete}
                    region={this.state.mapRegion}
                    annotations={this.state.annotations}
                />
                <MapRegionInput
                    onChange={this._onRegionInputChanged}
                    region={this.state.mapRegionInput}
                />
            </View>
        );
    }

    _getAnnotations(region) {
        return [{
            longitude: region.longitude,
            latitude: region.latitude,
            title: 'You Are Here',
        }];
    }

    _onRegionChange(region) {
        this.setState({
            mapRegionInput: region,
        });
    }

    _onRegionChangeComplete(region) {
        if (this.state.isFirstLoad) {
            this.setState({
                mapRegionInput: region,
                annotations: this._getAnnotations(region),
                isFirstLoad: false,
            });
        }
    }

    _onRegionInputChanged(region) {
        this.setState({
            mapRegion: region,
            mapRegionInput: region,
            annotations: this._getAnnotations(region),
        });
    }

}

class AnnotationExample extends Component {

    constructor() {
        super();
        this.state = {
            isFirstLoad: true,
            annotations: [],
            mapRegion: undefined,
        };
    }

    render() {
        if (this.state.isFirstLoad) {
            var onRegionChangeComplete = (region) => {
                this.setState({
                    isFirstLoad: false,
                    annotations: [{
                        longitude: region.longitude,
                        latitude: region.latitude,
                        ...this.props.annotation,
                    }],
                });
            };
        }

        return (
            <MapView
                style={styles.map}
                onRegionChangeComplete={onRegionChangeComplete}
                region={this.state.mapRegion}
                annotations={this.state.annotations}
            />
        );
    }
}

var styles = StyleSheet.create({
    map: {
        height: 150,
        margin: 10,
        borderWidth: 1,
        borderColor: '#000000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textInput: {
        width: 150,
        height: 20,
        borderWidth: 0.5,
        borderColor: '#aaaaaa',
        fontSize: 13,
        padding: 4,
    },
    changeButton: {
        alignSelf: 'center',
        marginTop: 5,
        padding: 3,
        borderWidth: 0.5,
        borderColor: '#777777',
    },
});

module.exports = {
    title: '<MapView>',
    description: 'Base component to display maps',
    scroll: true,
    examples: [
        {
            subtitle: 'Map',
            render() {
                return <MapViewExample />;
            }
        },
        {
            subtitle: 'showsUserLocation + followUserLocation',
            render() {
                return (
                    <MapView
                        style={styles.map}
                        showsUserLocation={true}
                        followUserLocation={true}
                    />
                );
            }
        },
        {
            subtitle: 'Callout example',
            render() {
                return <AnnotationExample style={styles.map} annotation={{
                        title: 'More Info...',
                        rightCalloutView: (
                            <TouchableOpacity
            onPress={() => {
                    alert('You Are Here');
                }}>
                                <Image
              style={{width:30, height:30}}
              source={{uri: require('QImageSet').uie_thumb_selected}}
                     />
                            </TouchableOpacity>
                        ),
                    }}/>;
            }
        },
        {
            subtitle: 'Annotation focus example',
            render() {
                return <AnnotationExample style={styles.map} annotation={{
                        title: 'More Info...',
                        onFocus: () => {
                            alert('Annotation gets focus');
                        },
                        onBlur: () => {
                            alert('Annotation lost focus');
                        }
                    }}/>;
            }
        },
        {
            subtitle: 'Draggable pin',
            render() {
                return <AnnotationExample style={styles.map} annotation={{
                        draggable: true,
                        onDragStateChange: (event) => {
                            console.log('Drag state: ' + event.state);
                        },
                    }}/>;
            }
        },
        {
            subtitle: 'Custom pin color',
            render() {
                return <AnnotationExample style={styles.map} annotation={{
                        title: 'You Are Purple',
                        tintColor: MapView.PinColors.PURPLE,
                    }}/>;
            }
        },
        {
            subtitle: 'Custom pin image',
            render() {
                return <AnnotationExample style={styles.map} annotation={{
                        title: 'Thumbs Up!',
                        image: {uri: require('QImageSet').uie_thumb_big},//require('./Images/uie_thumb_big.png'),
                    }}/>;
            }
        },
        {
            subtitle: 'Custom pin view',
            render() {
                return <AnnotationExample style={styles.map} annotation={{
                        title: 'Thumbs Up!',
                        view: <View style={{
                                alignItems: 'center',
                            }}>
                            <Text style={{fontWeight: 'bold', color: '#f007'}}>
                                        Thumbs Up!
                            </Text>
                            <Image
            style={{width: 90, height: 65, resizeMode: 'cover'}}
            source={{uri: require('QImageSet').uie_thumb_big}}
                   />
                        </View>,
                    }}/>;
            }
        },
        {
            subtitle: 'Custom overlay',
            render() {
                return <MapView
                           style={styles.map}
                           region={{
                                   latitude: 39.06,
                                   longitude: -95.22,
                               }}
                           overlays={[{
                                   coordinates:[
                                       {latitude: 32.47, longitude: -107.85},
                                       {latitude: 45.13, longitude: -94.48},
                                       {latitude: 39.27, longitude: -83.25},
                                       {latitude: 32.47, longitude: -107.85},
                                   ],
                                   strokeColor: '#f007',
                                   lineWidth: 3,
                               }]}
                       />;
            }
        },
    ]};
