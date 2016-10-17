/*
 * @providesModule ViewPager
 * https://github.com/taobaofed/react-web/blob/master/Libraries/ViewPager/ViewPager.web.js
 */

var React = require('react')
var View = require('View')
var PropTypes = React.PropTypes
var Animated = require('Animated')
var StyleSheet = require('StyleSheet')
var Dimensions = require('Dimensions')
var deviceSize = Dimensions.get('window')
var PanResponder = require('PanResponder')
var NativeMethodsMixin = require('NativeMethodsMixin')
var VIEWPAGER_REF = 'viewpager'


/** 
 * ViewPager组件
 *
 * @component ViewPager
 * @example ./ViewPager.js[1-77] 
 * @version >=v1.4.0
 * @description  一个子视图之间可滑动的翻页容器组件
 *
 * ![ViewPager](./images/component/ViewPager.gif)
 *
 */

var ViewPager = React.createClass({
    propTypes: {
        /**
         * @property initialPage
         * @type number
         * @default 0  
         * @description 初始化时选中的页的下标。
         */ 
        initialPage: PropTypes.number,

        /**
         * @property onPageScroll
         * @type function 
         * @param {object} [event] 事件
         * @description 切换页面时执行的回调函数
         */
        onPageScroll: PropTypes.func,

        /**
         * @property onPageSelected
         * @type function 
         * @param {object} [event] 事件
         * @description 切换页面完成后执行的回调函数
         */
        onPageSelected: PropTypes.func,

        /**
         * @property keyboardDismissMode
         * @type enum
         * @default 'none' 
         * @description 滑动时是否显示键盘
         * - 'none': 滑动时键盘不消失
         * - 'on-drag': 滑动时键盘消失
         */ 
        keyboardDismissMode: PropTypes.oneOf([
            'none', // default
            'on-drag'
        ])
    },
    mixins: [NativeMethodsMixin],
    getDefaultProps: function() {
        return {
            initialPage: 0
        }
    },
    getInitialState: function() {
        return {
            selectedPage: this.props.initialPage,
            pageWidth: deviceSize.width,
            pageCount: this.props.children.length,
            offsetLeft: new Animated.Value(0)
        }
    },
    componentWillMount: function() {
        this._panResponder = PanResponder.create({
            onStartShouldSetResponder: () => true,
            onMoveShouldSetPanResponder: this._shouldSetPanResponder,
            onPanResponderGrant: () => {},
            onPanResponderMove: this._panResponderMove,
            onPanResponderTerminationRequest: () => true,
            onPanResponderRelease: this._panResponderRelease,
            onPanResponderTerminate: () => {}
        })
    },
    componentDidMount: function() {
        this.setPage(this.state.selectedPage)
    },
    getInnerViewNode: function() {
        return this.refs[VIEWPAGER_REF].childNodes[0]
    },
    _childrenWithOverridenStyle: function() {
        return React.Children.map(this.props.children, function(child) {
            var style = StyleSheet.fix([child.props.style, {
                width: deviceSize.width
            }])
            return React.cloneElement(child, {...child.props, style: style, collapsable: false})
        })
    },
    render: function() {
        var children = this._childrenWithOverridenStyle()

        var {
            offsetLeft,
            pageWidth,
            pageCount
        } = this.state
        var width = pageWidth * pageCount
        var count = pageCount - 1

        var translateX = offsetLeft.interpolate({
            inputRange: [0, count],
            outputRange: [0, -(pageWidth * count)],
            extrapolate: 'clamp'
        })

        return (
            <View 
                ref={VIEWPAGER_REF} 
                style={this.props.style} 
                {...this._panResponder.panHandlers} 
            >
                <Animated.View 
                    style = {
                        {
                            width: width,
                            position: 'absolute',
                            top: 0,
                            left: translateX,
                            bottom: 0,
                            flexDirection: 'row'
                        }
                    }
                > 
                {children} 
                </Animated.View>
            </View>
        )
    },
    _onPageScroll: function(event) {
        if (this.props.onPageScroll) {
            this.props.onPageScroll(event)
        }
        if (this.props.keyboardDismissMode === 'on-drag') {
            dismissKeyboard()
        }
    },
    _shouldSetPanResponder: function() {
        if (this._scrolling) {
            this.state.offsetLeft.stopAnimation(() => {
                this._scrolling = false
            })
            return false
        }

        return true
    },
    _panResponderMove: function(ev, {dx}) {
        var val = this.state.selectedPage + dx / this.state.pageWidth * -1
        this.state.offsetLeft.setValue(val)
    },
    _panResponderRelease: function(ev, {dx}) {
        var {
            selectedPage,
            pageWidth
        } = this.state
        var range = Math.abs(dx) / pageWidth
        var threshold = 1 / 5

        if (range > threshold) {
            if (dx > 0) {
                selectedPage -= 1
            } else {
                selectedPage += 1
            }
        }
        this.setPage(selectedPage)
    },
    setPage: function(index) {
        if (index < 0) {
            index = 0
        } else if (index >= this.state.pageCount) {
            index = this.state.pageCount - 1
        }

        this._scrolling = true

        Animated.spring(this.state.offsetLeft, {
            toValue: index,
            bounciness: 0,
            restSpeedThreshold: 1
        }).start(() => {

            this._onPageScroll({
                nativeEvent: {
                    position: index,
                    offset: 0
                }
            })

            this._scrolling = false

            this.setState({
                selectedPage: index
            }, () => {
                this.props.onPageSelected && this.props.onPageSelected({
                    nativeEvent: {
                        position: index
                    }
                })
            })
        })
    }
})

module.exports = ViewPager