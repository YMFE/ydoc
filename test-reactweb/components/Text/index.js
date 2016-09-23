/*!
 *参考Libraries/Components/Text/Text.js及
 *https://github.com/taobaofed/react-web/blob/master/Libraries/View/Text.web.js
 * @providesModule Text
 */

var React = require('react')
var StyleSheet = require('StyleSheet')
var NativeMethodsMixin = require('NativeMethodsMixin')
var Touchable = require('Touchable');
var PropTypes = React.PropTypes
var PRESS_RECT_OFFSET = {top: 20, left: 20, right: 20, bottom: 30}


/**
 * Text组件
 *
 * @component Text
 * @version >=v1.4.0
 * @example ./Text.js[1-76]
 * @description  Text是一个用于显示文本的React组件。
 *
 * ![Text](./images/component/Text.gif)
 *
 */


 StyleSheet.inject(`


 .rn-text > .rn-view{
    display:inline-block;
 }

 .rn-text > .rn-text {
      display:inline;
 }


 `);

var Text = React.createClass({
    mixins: [NativeMethodsMixin, Touchable.Mixin],
    propTypes: {
        /**
         * @property style
         * @type object或array
         * @default {
         *     outline: 'none',
         *     fontSize: 14
         *  }
         * @description Text组件的样式
         */
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    },
    contextTypes: {
        isInAParentText: React.PropTypes.bool
    },
    childContextTypes: {
        isInAParentText: React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            style: {
                outline: 'none',
                fontSize: 14
            },
            allowFontScaling: true,
        }
    },
    getInitialState: function() {
        return {
            ...Touchable.Mixin.touchableGetInitialState(),
            isHighlighted: false,
        }
    },
    getChildContext: function() {
        return {isInAParentText: true}
    },
    /**
     * @property onPress
     * @type function
     * @description 触摸Text组件时调用的函数。
     */

    /**
     * @property suppressHighlighting
     * @type bool
     * @default false
     * @description 按下Text组件时视觉效果，如果为true，则无视觉效果。
     */
    onStartShouldSetResponder: function(e) {
        let shouldSetFromProps = this.props.onStartShouldSetResponder &&
            this.props.onStartShouldSetResponder();
        return shouldSetFromProps || !!this.props.onPress;
    },

    /*
     * Returns true to allow responder termination
     */
    handleResponderTerminationRequest: function(e) {
        // Allow touchable or props.onResponderTerminationRequest to deny
        // the request
        let allowTermination = this.touchableHandleResponderTerminationRequest();
        if (allowTermination && this.props.onResponderTerminationRequest) {
            allowTermination = this.props.onResponderTerminationRequest();
        }
        return allowTermination;
    },

    handleResponderGrant: function(e, dispatchID) {
        this.touchableHandleResponderGrant(e, dispatchID);
        this.props.onResponderGrant &&
            this.props.onResponderGrant.apply(this, arguments);
    },

    handleResponderMove: function(e) {
        this.touchableHandleResponderMove(e);
        this.props.onResponderMove &&
            this.props.onResponderMove.apply(this, arguments);
    },

    handleResponderRelease: function(e) {
        this.touchableHandleResponderRelease(e);
        this.props.onResponderRelease &&
            this.props.onResponderRelease.apply(this, arguments);
    },

    handleResponderTerminate: function(e) {
        this.touchableHandleResponderTerminate(e);
        this.props.onResponderTerminate &&
            this.props.onResponderTerminate.apply(this, arguments);
    },

    touchableHandleActivePressIn: function(e) {
        if (this.props.suppressHighlighting || !this.props.onPress) {
            return;
        }
        this.setState({
            isHighlighted: true,
        });
    },

    touchableHandleActivePressOut: function(e) {
        if (this.props.suppressHighlighting || !this.props.onPress) {
            return;
        }
        this.setState({
            isHighlighted: false,
        });
    },

    touchableHandlePress: function(e) {
        this.props.onPress && this.props.onPress();
    },

    render: function() {
        var children = [],
            props = {...this.props}
        // 处理嵌套
        if(!(typeof props.children in {'number': '', 'string': ''})){
            var content = '',
                _children = props.children || []
            if (!_children.join) _children = [_children]
            _children.forEach(function(child){
                if (typeof child === 'string' || typeof child === 'number') {
                    content += child.toString()
                } else {
                  if (content) children.push(content)
                  children.push(child)
                  content = ''
                }
            })
            if (content) {
                if (children.length) {
                    children.push(content)
                } else {
                    children = content // 修复只有一个文本节点的时候多出一个span嵌套的bug
                }
            }
        } else {
            children = props.children
        }
        props.isHighlighted = this.state.isHighlighted
        props.onStartShouldSetResponder = this.onStartShouldSetResponder
        props.onResponderTerminationRequest = this.handleResponderTerminationRequest
        props.onResponderGrant = this.handleResponderGrant
        props.onResponderMove = this.handleResponderMove
        props.onResponderRelease = this.handleResponderRelease
        props.onResponderTerminate = this.handleResponderTerminate
        props.style = StyleSheet.fix(props.style, this)
        // 处理字体小于12px
        // 后面再判断支持不支持
        var fsize = parseFloat(props.style.fontSize),
            content = children
        if (fsize < 0.12) {
            fsize = parseFloat((fsize / 0.12).toFixed(2));
            var hackStyle = StyleSheet.fix({fontSize: 12, display: 'inline-block', transform:[{scale:fsize}]});
            content = <span style={hackStyle}>{children}</span>
        }
        return (
            <div className='rn-text'  {...props}>
                {content}
            </div>
        )
    }
})

module.exports = Text
