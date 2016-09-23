/**
 * @providesModule QSlider
 * @flow
 */
'use strict'

import React, {Component, StyleSheet, View, PanResponder, PixelRatio} from 'react-native'

/**
 * 滑动选择范围组件
 *
 * @component QSlider
 * @example ./Playground/js/Examples/SliderExample.js[1-65]
 * @version >=v1.0.0
 * @description 这不是一个受约束的组件。也就是说，如果你不更新值，在用户操作后，这个组件也不会还原到初始值。
 *
 * ![Slider](./images/component-Slider.png)
 */
class QSlider extends Component {
    constructor(props){
        super(props)

        this.gestrueStart = 0 // 手势开始位置
        this.state = {
            calculatedPosition: 0, // 计算位置，有可能超出trackWidth
            tempCalculatedPosition: null, // 计算位置，有可能超出trackWidth
            thumbPosition: 0, // 滑块位置
            value: props.value,
            trackWidth: 0,
            visible: 0,
        }
    }

    componentWillMount() {
        // get move start position
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => !this.props.disabled && true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => !this.props.disabled && true,
            onMoveShouldSetPanResponder: (evt, gestureState) => !this.props.disabled && true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => !this.props.disabled && true,
            onPanResponderTerminationRequest: () => false,

            // get move start position
            onPanResponderGrant: (evt, gestureState) => {
                this.gestrueStart = gestureState.x0
            },

            // get move offset and set new position
            onPanResponderMove: (evt, gestureState) => {
                const trackWidth = this.state.trackWidth,
                    setpWidth = Math.round(this.props.step / (this.props.maximumValue - this.props.minimumValue) * this.state.trackWidth)

                let moveOffset = gestureState.moveX - this.gestrueStart,
                    shouldUpdate = false

                // if step exists, calculate if thumb should move
                if(this.props.step > 0){
                    if(Math.abs(moveOffset % setpWidth) > setpWidth / 2){
                        moveOffset = Math.round(moveOffset / setpWidth) * setpWidth
                        this.gestrueStart += moveOffset
                    } else{
                        moveOffset = 0
                    }
                }

                // 这里使用calculatedPosition而不是thumbPosition，因为滑块计算位置可能超出轨道长度
                // 比如minimumValue=5，maximumValue=10，step=2时，从10向左滑，应该回到9，这时calculatedPosition为11，而thumbPosition为10
                let newPosition = this.state.calculatedPosition + moveOffset //FIXME should be this.state.calculatedPosition

                if(this.props.step > 0 ){
                    this.state.calculatedPosition = newPosition
                    shouldUpdate = true
                } else if(this.props.step === 0){
                    this.state.tempCalculatedPosition = newPosition
                    shouldUpdate = true
                }

                // garantee in track range
                if(shouldUpdate){
                    if(newPosition > trackWidth){
                        newPosition = trackWidth
                    } else if(newPosition < 0){
                        newPosition = 0
                    }

                    this.setState({
                        thumbPosition: newPosition,
                    })

                    this.convertOffsetToValue(newPosition)
                }
            },

            // decide which page to scroll to
            onPanResponderRelease: (evt, gestureState) => {
                this.state.calculatedPosition = this.state.tempCalculatedPosition ? this.state.tempCalculatedPosition : this.state.calculatedPosition
            },
        });
    }

    render() {
        const {thumbSize, maximumTrackTintColor, minimumTrackTintColor, maximumValue, minimumValue} = this.props

        const containerStyle = {
            opacity: this.state.visible,
            height: thumbSize,
        }
        const trackStyle = {
            height: thumbSize,
        }
        const activeStyle = {
            top: thumbSize / 2 - 1,
            width: this.state.thumbPosition + thumbSize / 2,
            backgroundColor: minimumTrackTintColor,
        }
        const unactiveStyle = {
            backgroundColor: maximumTrackTintColor,
        }
        const thumbStyle = {
            width: thumbSize,
            height: thumbSize,
            left: this.state.thumbPosition,
            borderRadius: thumbSize / 2,
        }

        return (
            <View style={[styles.container, containerStyle]}>
                <View style={[styles.track, trackStyle]} ref="track" onLayout={(event) => this.initLayout(event)}>
                    <View style={[styles.unactiveTrack, unactiveStyle]}></View>
                    <View style={[styles.activeTrack, activeStyle]}></View>
                    <View style={[styles.thumb, thumbStyle]}
                        {...this._panResponder.panHandlers}
                    >
                    </View>
                </View>
            </View>
        )
    }

    initLayout(e) {
        if(!this.state.visible){
            const {width} = e.nativeEvent.layout,
                trackWidth = width - this.props.thumbSize,
                initPosition = (this.state.value - this.props.minimumValue) /
                                (this.props.maximumValue - this.props.minimumValue) * trackWidth

            this.setState({
                trackWidth: trackWidth,
                thumbPosition: initPosition,
                calculatedPosition: initPosition,
                visible: 1,
            })
        }
    }

    convertOffsetToValue(offset) {
        let value = this.props.minimumValue + Math.round(offset / this.state.trackWidth * (this.props.maximumValue - this.props.minimumValue))

        const {onValueChange, onSlidingComplete} = this.props

        // fix decimal
        value = isNaN(value) ? 0 : parseFloat(value.toPrecision(10))
        if(this.props.step !== 0 && this.props.step < 1){
            const stepDecimalLen = this.props.step.toString().split('').length - 2
            value = Number(value.toFixed(stepDecimalLen))
        }

        if(value !== this.state.value && onValueChange){
            onValueChange(value)
        }

        if(value !== this.state.value && value === this.props.maximumValue && onSlidingComplete){
            onSlidingComplete(value)
        }

        this.setState({
            value: value
        })
    }
}

QSlider.defaultProps = {
    thumbSize: 28,
    maximumTrackTintColor: '#b6b6b6',
    minimumTrackTintColor: '#0b6aff',
    maximumValue: 1,
    minimumValue: 0,
    step: 0,
    value: 0,
}

QSlider.propTypes = {
    /**
     * @property thumbSize
	 * @type number
	 * @description 滑块大小。
     */
    thumbSize: React.PropTypes.number,

    /**
     * @property maximumTrackTintColor
	 * @type string
	 * @description 滑块右侧轨道的颜色。默认为蓝色。
     */
    maximumTrackTintColor: React.PropTypes.string,

    /**
     * @property minimumTrackTintColor
	 * @type string
	 * @description 滑块左侧轨道的颜色。默认为蓝色。
     */
    minimumTrackTintColor: React.PropTypes.string,

    /**
     * @property maximumValue
	 * @type number
	 * @description 滑块的最大值（当滑块滑到最右端时表示的值）。默认为1。
     */
    maximumValue: React.PropTypes.number,

    /**
     * @property minimumValue
	 * @type number
	 * @description 滑块的最小值（当滑块滑到最左端时表示的值）。默认为0。
     */
    minimumValue: React.PropTypes.number,

    /**
     * @property step
	 * @type number
	 * @description 滑块的最小步长。这个值应该在0到(maximumValue - minimumValue)之间。默认值为0。
     */
    step: React.PropTypes.number,

    /**
     * @property value
	 * @type number
	 * @description 滑块的初始值。这个值应该在最小值和最大值之间。默认值是0。
     */
    value: React.PropTypes.number,

    /**
     * @property onValueChange
	 * @type function
     * @param {number} value 当前的值
	 * @description (value) => void
     *
     * 在用户拖动滑块的过程中不断调用此回调。
     */
    onValueChange: React.PropTypes.func,

    /**
     * @property onSlidingComplete
	 * @type function
     * @param {number} value 当前的值
	 * @description (value) => void
     *
     * 用户结束滑动的时候调用此回调。
     */
    onSlidingComplete: React.PropTypes.func,
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    track: {
        justifyContent: 'center',
    },
    unactiveTrack: {
        height: 2,
        borderRadius: 2,
    },
    activeTrack: {
        position: 'absolute',
        left: 0,
        width: 100,
        height: 2,
        borderRadius: 2,
    },
    thumb: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
})

module.exports = QSlider;
