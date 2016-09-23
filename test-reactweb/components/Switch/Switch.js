/**
 * @providesModule Switch
 */

var React = require('react')
var PropTypes = React.PropTypes
var NativeMethodsMixin = require('NativeMethodsMixin')
var StyleSheet = require('StyleSheet')
var PanResponder = require('PanResponder')
var View = require('View')

/**
 * Switch组件
 *
 * @component Switch
 * @version >=v1.4.0
 * @example ./Switch.js[1-111]
 * @description  Switch是一个可以在两个状态中进行切换的组件。
 *
 * ![Switch](./images/component/Switch.gif)
 *
 */

var Switch = React.createClass({
    propTypes: {
        /**
         * @property value
         * @type bool 
         * @default false
         * @description 表示Switch开关是否打开 
         */  
        value: PropTypes.bool,

        /**
         * @property disabled
         * @type bool 
         * @description 是否禁用该组件，如果为true，这个组件不能进行交互。 
         */
        disabled: PropTypes.bool,

        /**
         * @property onValueChange
         * @type function 
         * @param {bool} [value] 新的value值
         * @description 当值改变的时候调用此回调函数 
         */
        onValueChange: PropTypes.func,

        /**
         * @property onTintColor
         * @type string 
         * @description 开启状态时的背景颜色。
         */
        onTintColor: PropTypes.string,

        /**
         * @property thumbTintColor
         * @type string
         * @description 开关圆形按钮的背景颜色。
         */
        thumbTintColor: PropTypes.string,

        /**
         * @property tintColor
         * @type string
         * @description 关闭状态时的背景颜色。
         */
        tintColor: PropTypes.string
    },
    mixins: [NativeMethodsMixin],
    getDefaultProps: function() {
        return {
            onTintColor: '#00e158',
            thumbTintColor: '#fff',
            tintColor: '#fff'
        }
    },
    getInitialState: function() {
        return {
            value: this.props.value,
            disabled: this.props.disabled
        }
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            value: nextProps.value,
            disabled: nextProps.disabled
        });
    },
    componentWillMount:function() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: ()=>true,

            onPanResponderGrant:()=>{},
            onPanResponderRelease: this.handleClick.bind(this),
            onPanResponderTerminate: () => {},
      
        })
    },
    getStyles: function() {
        var {props} = this
        return StyleSheet.create({
            span: {
                position: 'relative',
                // display: 'inline-block', //添不添加在高级浏览器上没什么影响，但会让UC的布局失效
                margin: 2,
                height: 30,
                width: 50,
                cursor: 'pointer',
                verticalAlign: 'middle',
                borderRadius: 20,
                borderColor: '#dfdfdf',
                borderWidth: 1,
                borderStyle: 'solid',
                WebkitUserSelect: 'none',
                WebkitBoxSizing: 'content-box',
                WebkitBackfaceVisibility: 'hidden'
            },
            checkedSpan: {
                borderColor: props.onTintColor,
                backgroundColor: props.onTintColor,
                boxShadow: props.onTintColor + ' 0 0 0 16px inset',
                WebkitTransition: 'border 0.2s, box-shadow 0.2s, background-color 1s',
                transition: 'border 0.2s, box-shadow 0.2s, background-color 1s'
            },
            uncheckedSpan: {
                borderColor: '#dfdfdf',
                backgroundColor: props.tintColor,
                boxShadow: '#dfdfdf 0 0 0 0 inset',
                WebkitTransition: 'border 0.2s, box-shadow 0.2s'
            },
            disabledSpan: {
                opacity: 0.5,
                cursor: 'not-allowed',
                boxShadow: 'none'
            },
            small: {
                position: 'absolute',
                top: 0,
                width: 30,
                height: 30,
                backgroundColor: props.thumbTintColor,
                borderRadius: '100%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                WebkitTransition: '-webkit-transform 0.2s ease-in',
                transition: 'transform 0.2s ease-in'
            },
            checkedSmall: {
                WebkitTransform: 'translateX(20px)',
                transform: 'translateX(20px)'
            },
            uncheckedSmall: {
                WebkitTransform: 'translateX(0)',
                transform: 'translateX(0)'
            }
        });
    },
    handleClick: function(e) {
        if (this.state.disabled) {
            return null;
        }

        var newVal = !this.state.value;
        this.props.onValueChange && this.props.onValueChange.call(this, newVal);
        this.setState({
            value: newVal
        });

        var oldValue = this.props.value;
        setTimeout(function() {
            if (this.props.value == oldValue) {
                this.setState({
                    value: this.props.value
                });
            }
        }.bind(this), 200);
    },
    render: function() {
        var styles = this.getStyles();
        var spancss = this.state.value ? {...styles.span, ...styles.checkedSpan} : {...styles.span, ...styles.uncheckedSpan};
        var smallcss = this.state.value ? {...styles.small, ...styles.checkedSmall} : {...styles.small, ...styles.uncheckedSmall};
        spancss = this.state.disabled ? {...spancss, ...styles.disabledSpan} : spancss;

        return (
            <View
                 {...this._panResponder.panHandlers}
                style={spancss}
            >
                <View
                    style={smallcss}
                />
            </View>
        )
    }
})

module.exports = Switch
