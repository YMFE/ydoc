import {Dimensions} from 'react-native';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default {
    fade: {
        show: [
            {
                style: 'opacity',
                toValue: 1,
                duration: 200
            }
        ],
        hide: [
            {
                style: 'opacity',
                toValue: 0,
                duration: 200
            }
        ]
    },
    slideFromBottom: {
        show: [
            {
                style: 'translateY',
                toValue: 0,
                duration: 200
            }
        ],
        hide: [
            {
                style: 'translateY',
                toValue: screenHeight,
                duration: 200
            }
        ]
    },
    slideFromTop: {
        show: [
            {
                style: 'translateY',
                toValue: 0,
                duration: 200
            }
        ],
        hide: [
            {
                style: 'translateY',
                toValue: -screenHeight,
                duration: 200
            }
        ]
    },
    slideFromLeft: {
        show: [
            {
                style: 'translateX',
                toValue: 0,
                duration: 200
            }
        ],
        hide: [
            {
                style: 'translateX',
                toValue: -screenWidth,
                duration: 200
            }
        ]
    },
    slideFromRight: {
        show: [
            {
                style: 'translateX',
                toValue: 0,
                duration: 200
            }
        ],
        hide: [
            {
                style: 'translateX',
                toValue: screenWidth,
                duration: 200
            }
        ]
    }
};
