import {StyleSheet} from 'react-native'

module.exports = StyleSheet.create({
	container: {
		position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1, 
    },
    mask: {
        flex: 1,
        backgroundColor: 'black',
        opacity: .8,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    toolTipPannel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolTip: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 3,
    },
    content: {
        color: '#fff',
        lineHeight: 18,
        fontSize: 16,
    }
})