'use strict'

import React, {
    StyleSheet,
    PixelRatio,
} from 'qunar-react-native';

const styles = {
    header: {
        padding: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerReturn: {
        position: 'absolute',
        left: 12,
        top: 12,
    },
    headerReturnText: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    sectionHeader: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        backgroundColor: '#f6f7f8',
    },
    description: {
        padding: 7,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f1f1f1',
    },
    sectionBody: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    container: {
        flex: 1,
    },
    scene: {
        flex: 1,
        marginTop: 20,
        alignItems: 'stretch',
        backgroundColor: '#e9eaed',
    },
    titleContainer: {
        margin: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderRadius: 5,
        borderColor: '#1ba9ba',
        borderWidth: 1,
    },
    title: {
        fontSize: 20,
        color: '#1ba9ba',
    },
    list: {
        flex: 1,
        paddingBottom: 40,
        // backgroundColor: '#eeeeee',
        backgroundColor: '#ffffff'
    },
    noteWrap: {
        height: 50,
        paddingLeft: 21,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: '#1ba9ba',
    },
    noteWrapText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1ba9ba',
    },
    noteWrapTextIcon: {
        fontFamily: 'qunar_react_native',
        fontSize: 14,
        width: 14,
        height: 14,
        marginRight: 5,
        color: '#1ba9ba',
    },
    listRow: {
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 40,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: "#eeeeee",
        backgroundColor: '#fff',
    },
    listRowText: {
        fontSize: 16,
        color: '#444',
    },
    logo: {
        marginLeft: 10,
        marginRight: 10,
        width: 20,
        height: 20,
    },
    valueText: {
        marginBottom: 12,
        textAlign: 'center',
    },
    wrapper: {
        flex: 1,
    },
}

export default styles;
