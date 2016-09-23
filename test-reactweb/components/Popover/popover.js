import {PixelRatio, StyleSheet} from 'react-native';

module.exports.styles = StyleSheet.create({
    popover: {
        backgroundColor: '#fff',
        borderWidth: 1 / PixelRatio.get(),
        borderStyle: 'solid',
        borderColor: '#ccc',
        borderRadius: 5,
        left: 20,
        right: 20,
        position: 'absolute',
        flexDirection: 'row'
    },
    popoverLayout: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    popoverText: {
        color: '#212121',
        fontSize: 16,
        textAlign: 'center',
        alignSelf: 'center',
        flex: 1
    },
    modal: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    actionSheet: {
        left: 4,
        right: 4,
        bottom: 4,
        position: 'absolute'
    },
    actionSheetLayout: {
        flex: 1
    },
    actionSheetAction: {
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginTop: 8
    },
    actionSheetMenu: {
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    actionSheetButton: {
        height: 38,
        flex: 1,
        justifyContent: 'center'
    },
    actionSheetButtonText: {
        color: '#212121',
        textAlign: 'center'
    },
    actionSheetButtonBorder: {
        borderBottomWidth: 1 / PixelRatio.get(),
        borderStyle: 'solid',
        borderBottomColor: '#ccc'
    }
});
