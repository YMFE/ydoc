import {PixelRatio} from 'react-native'
module.exports.styles = require('react-native').StyleSheet.create({
    dialogLayout: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    dialog: {
        backgroundColor: '#fff',
        borderWidth: 1 / PixelRatio.get(),
        borderStyle: 'solid',
        borderColor: '#ccc',
        flexDirection: 'column',
        borderRadius: 15,
        alignSelf: 'center',
        width: 280,
        overflow: 'hidden'
    },
    dialogNoModal: {
        position: 'absolute',
        marginLeft: -140
    },
    title: {
        backgroundColor: 'transparent',
        height: 44,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 16,
        marginVertical: 0,
        marginHorizontal: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleButton: {
        position: 'absolute',
        top: 0,
        height: 44,
        justifyContent: 'center'
    },
    titleLeft: {
        left: 10
    },
    titleRight: {
        right: 10
    },
    titleButtonText: {
        color: '#212121'
    },
    titleButtonClose: {},
    content: {
        flex: 1,
        padding: 10,
        overflow: 'visible'
    },
    contentText: {
        fontSize: 16
    },
    footer: {
        backgroundColor: 'transparent',
        borderTopWidth: 1 / PixelRatio.get(),
        borderStyle: 'solid',
        borderTopColor: '#ccc',
        flexDirection: 'row',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    button: {
        backgroundColor: 'transparent',
        height: 44,
        flex: 1,
        justifyContent: 'center'
    },
    buttonActive: {
        backgroundColor: '#f9f9f9'
    },
    buttonLeft: {
        borderRightWidth: 1 / PixelRatio.get(),
        borderStyle: 'solid',
        borderRightColor: '#ccc'
    },
    buttonRight: {},
    buttonText: {
        textAlign: 'center',
        color: '#00afc7',
        fontSize: 16
    },
    hidden: {
        width: 0.1,
        height: 0.1
    }
});
