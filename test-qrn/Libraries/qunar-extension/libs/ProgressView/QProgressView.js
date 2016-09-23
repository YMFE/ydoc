/**
 * @providesModule QProgressView
 * @flow
 */

'use strict'

import React, {Component, StyleSheet, View, Image, Platform} from 'react-native'

const defualtTrackHeight = 2

/**
 * 进度条
 * @component ProgressView
 * @example ./Playground/js/Examples/ProgressViewExample.js[1-59]
 * @version >=v1.0.0
 * @description 渲染一个进度条
 *
 * ![ProgressView](./images/component-ProgressView.png)
 */
class ProgressView extends Component {
    constructor(props){
        super(props)

        this.state = {
            visible: false,
            trackWidth: 0,
            progressWidth: 0,
        }
    }

    componentWillReceiveProps() {
        if(this.state.visible){
            let progress = this.props.progress

            if(progress > 1) {
                progress = 1
            } else if(progress < 0){
                progress = 0
            }

            const
                trackWidth = this.state.trackWidth,
                progressNewPosition = progress * trackWidth

            this.setState({
                progressWidth: progressNewPosition,
            })
        }
    }

    render() {
        const {progress, progressImage, progressTintColor, progressViewStyle, trackImage, trackTintColor} = this.props

        const
            trackStyle = {
                backgroundColor: trackTintColor,
                borderRadius: progressViewStyle === 'bar' ? 0 : defualtTrackHeight,
            },
            progressStyle = {
                width: this.state.progressWidth,
                backgroundColor: progressTintColor,
                borderRadius: progressViewStyle === 'bar' ? 0 : defualtTrackHeight,
            },
            trackImageStyle = {
                width: this.state.trackWidth
            },
            progressImageStyle = {
                width: this.state.progressWidth
            }

        return (
            <View style={[styles.track, trackStyle]} ref="track" onLayout={(event) => this.initLayout(event)}>
                {trackImage ? <Image style={[styles.img, trackImageStyle]} source={trackImage}></Image> : null}
                <View style={[styles.progress, progressStyle]}>
                    {progressImage ? <Image style={[styles.img, progressImageStyle]} source={progressImage}></Image> : null}
                </View>
            </View>
        )
    }

    initLayout(e) {
        if(!this.state.visible){
            let progress = this.props.progress

            if(progress > 1) {
                progress = 1
            } else if(progress < 0){
                progress = 0
            }

            const
                trackWidth = e.nativeEvent.layout.width,
                progressInitPosition = progress * trackWidth

            this.setState({
                trackWidth: trackWidth,
                progressWidth: progressInitPosition,
                visible: true,
            })
        }
    }
}

ProgressView.defaultProps = {
    progress: 0,
    progressTintColor: '#0b6aff',
    trackTintColor: '#b6b6b6',
}

ProgressView.propTypes = {
    /**
     * @property progress
	 * @type number
	 * @description 当前的进度值（0到1之间）。
     */
    progress: React.PropTypes.number,

    /**
     * @property progressImage
	 * @type Image.propTypes.source
	 * @description 一个可以拉伸的图片，用于显示进度条。
     */
    progressImage: (Platform.OS === 'ios') ? Image.propTypes.source : React.PropTypes.any,

    /**
     * @property progressTintColor
	 * @type string
	 * @description 进度条本身染上的颜色。
     */
    progressTintColor: React.PropTypes.string,

    /**
     * @property progressViewStyle
	 * @type enum('default', 'bar')
	 * @description 进度条的样式。
     */
    progressViewStyle: React.PropTypes.oneOf(['default', 'bar']),

    /**
     * @property trackImage
	 * @type Image.propTypes.source
	 * @description 一个可拉伸的图片，用于显示进度条后面的轨道。
     */
    trackImage: (Platform.OS === 'ios') ? Image.propTypes.source : React.PropTypes.any,

    /**
     * @property trackTintColor
	 * @type string
	 * @description 进度条轨道染上的颜色。
     */
    trackTintColor: React.PropTypes.string,
}

const styles = StyleSheet.create({
    track: {
        alignSelf: 'stretch',
        height: defualtTrackHeight,
    },
    progress: {
        height : defualtTrackHeight,
    },
    img: {
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'stretch',
    },
})

module.exports = ProgressView
