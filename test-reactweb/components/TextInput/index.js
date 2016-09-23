/*!
 * @providesModule TextInput
 */

var React = require('react')
var View = require('View')
var Text = require('Text')
var PropTypes = React.PropTypes
var NativeMethodsMixin = require('NativeMethodsMixin')
var StyleSheet = require('StyleSheet')
var TouchableWithoutFeedback  = require('../Touchable/TouchableWithoutFeedback')
var TextInputState = require('./TextInputState');

/**
 * TextInput组件
 *
 * @component TextInput
 * @example ./TextInput.js[1-118]
 * @version >=v1.4.0
 * @description  TextInput组件是一个允许用户在应用中通过键盘输入文本的基本组件。
 *
 * **注意** 该组件是受控组件，如果提供了value属性，原生值会强制与value值保持一致。你可以通过onChangeText事件来读取用户的输入并重设value以达到更改的目的。
 *
 * ![TextInput](./images/component/TextInput.gif)
 *
 */

// 将native type转换为web input type
const typeMap = {
    'default': 'text',
    'ascii-capable': 'text',
    'numbers-and-punctuation': 'number',
    'url': 'url',
    'number-pad': 'number',
    'phone-pad': 'tel',
    'name-phone-pad': 'text',
    'email-address': 'email',
    'decimal-pad': 'number',
    'twitter': 'text',
    'web-search': 'search',
    'numeric': 'number'
};
    // 大写
const autoCapitalizer = {
    'none': function(value) {
        return value
    },
    'sentences': function(value) {
        return value.replace(/(^[a-z])|[\.\,\?\!\;\'\"。？！；][a-z]/g, function(mat) {
            return mat.toUpperCase()
        })
    },
    'words': function(value) {
        return value.replace(/(^[a-z])|[\s\.\,\?\!\;\'\"。？！；][a-z]/g, function(mat) {
            return mat.toUpperCase()
        })
    },
    'characters': function(value) {
        return value.toUpperCase()
    },
};

/**
 RN0.32
 // 暂不支持
 autoCorrect

 onContentSizeChange


 placeholderTextColor,
 returnKeyType
 selectionColor

 // ios

 selectionState:
 clearButtonMode:
 dataDetectorTypes
 enablesReturnKeyAutomatically
 keyboardAppearance


 // android
 inlineImageLeft
 inlineImagePadding

 returnKeyLabel
 underlineColorAndroid


 underlineColorAndroid


 //已支持
 autoCapitalize
 autoFocus
 `blurOnSubmit
 clearTextOnFocus
 defaultValu
 editable
 keyboardType
 maxLength
 multiline
 `numberOfLines
 onChangeText
 `onEndEditing
 onFocus

 `onLayout
 onSelectionChange
 `onSubmitEditing
 placeholder
 secureTextEntry
 selectTextOnFocus
 style
 value

 `isFocused
 `clear
 */

var TextInput = React.createClass({
    mixins: [NativeMethodsMixin],
    getDefaultProps: function() {
        return {
            autoCapitalize: 'none',
            autoFocus     : false,
            editable      : true,
            keyboardType  : 'default',
            // maxLength  :,
            multiline     : false,
            placeholder   : '',
            placeholderTextColor: '',
            secureTextEntry: false, // if true type to be password
            // value         : undefine, // 默认是undefine
            defaultValue  : '',
            style: {
                
            },

        }
    },

    propTypes:{
        /**
         * @property accessibilityLabel
         * @type string 
         * @description 无障碍标签。
         */ 
        accessibilityLabel:PropTypes.string,
        

        /**
         * @property autoCapitalize
         * @type string 
         * @description 控制TextInput是否要自动将特定字符切换为大写。
         * 
         * - `characters`: 所有的字符。
         * - `words`: 每个单词的第一个字符。
         * - `sentences`: 每句话的第一个字符（默认）。
         * - `none`: 不自动切换任何字符为大写。
         */
        autoCapitalize:PropTypes.oneOf(['characters','words','sentences','none']),
        
        /**
         * @property autoComplete
         * @type string 
         * @description input autoComplete属性
         */ 
        autoComplete:PropTypes.string,

        /**
         * @property autoCorrect
         * @type boolean 
         * @description 暂不支持
         */ 
        autoCorrect:PropTypes.bool,
        
        /**
         * @property autoFocus
         * @type bool 
         * @default false
         * @description  自动获取焦点，如果为true，在componentDidMount后会获得焦点。
         */ 
        autoFocus:PropTypes.bool,


        /**
         * @property blurOnSubmit
         * @type bool
         * @description 如果为true，文本框会在提交的时候失焦。对于单行输入框默认值为true，多行则为false。注意：对于多行输入框来说，如果将blurOnSubmit设为true，则在按下回车键时就会失去焦点同时触发onSubmitEditing事件，而不会换行。
         */ 
        blurOnSubmit:PropTypes.bool,

        /**
         * @property defaultValue
         * @type string 
         * @description 提供一个文本框中的初始值。当用户开始输入的时候，值就可以改变。
         *
         * 在一些简单的使用情形下，如果你不想用监听消息然后更新value属性的方法来保持属性和状态同步的时候，就可以用defaultValue来代替。
         */ 
        defaultValue:PropTypes.string,

        /**
         * @property editable
         * @type bool 
         * @default true 
         * @description 文本框是否可编辑，如果为false，文本框是不可编辑的。
         */ 
        editable:PropTypes.bool,

        /**
         * @property keyboardType
         * @type enum 
         * @default 'default' 
         * @description 决定弹出的何种软键盘
         * - 'default': 'text',
         * - 'ascii-capable': 'text',
         * - 'numbers-and-punctuation': 'number',
         * - 'url': 'url',
         * - 'number-pad': 'number',
         * - 'phone-pad': 'tel',
         * - 'name-phone-pad': 'text',
         * - 'email-address': 'email',
         * - 'decimal-pad': 'number',
         * - 'twitter': 'text',
         * - 'web-search': 'search',
         * - 'numeric': 'number'
         */ 
        keyboardType:PropTypes.oneOf(['default','ascii-capable','numbers-and-punctuation','url','number-pad','name-phone-pad','email-address','decimal-pad','twitter','web-search','numeric']),

        /**
         * @property maxLength
         * @type number  
         * @description 限制文本框中最多的字符数。
         */ 
        maxLength:PropTypes.number,

        /**
         * @property multiline
         * @type bool
         * @default false
         * @description 如果为true，文本框中可以输入多行文字。
         */
        multiline:PropTypes.bool,

        /**
         * @property numberOfLines
         * @type number
         * @description 设置输入框的行数。当multiline设置为true时使用它，可以占据对应的行数。
         */
        numberOfLines:PropTypes.number,


        /**
         * @property onBlur
         * @type function 
         * @param {object} [event] event事件
         * @description 当文本框失去焦点的时候调用此回调函数。
         */
        onBlur:PropTypes.func,


        /**
         * @property onChange
         * @type function
         * @param {object} [event] event事件
         * @description 当文本框内容变化时调用此回调函数。
         */
        onChange:PropTypes.func,

         /**
         * @property onChangeText
         * @type function
         * @param {string} [value] 改变后的文字内容
         * @description 当文本框内容变化时调用此回调函数。改变后的文字内容会作为参数传递。
         */
        onChangeText:PropTypes.func,



         /**
         * @property onEndEditing
         * @type function
         * @param {object} [event] event事件
         * @description 当文本输入结束后调用此回调函数。
         */
        onEndEditing:PropTypes.func,

        /**
         * @property onFocus
         * @type function
         * @param {object} [event] event事件
         * @description 当文本框获得焦点的时候调用此回调函数。
         */
        onFocus:PropTypes.func,

        /**
         * @property onLayout
         * @type function
         * @description 当组件挂载或者布局变化的时候调用，参数为`{x, y, width, height}`
         */
        onLayout:PropTypes.func,

        /**
         * @property onKeyDown
         * @type function
         * @param {object} [event] event事件
         * @description 当键盘按键被按下时调用此回调函数。
         */
        onKeyDown:PropTypes.func,

        /**
         * @property onKeyUp
         * @type function
         * @param {object} [event] event事件
         * @description 当在键盘按键被松开时调用此回调函数。
         */
        onKeyUp:PropTypes.func,

        /**
         * @property onKeyPress
         * @type function
         * @param {object} [event] event事件
         * @description 当键盘按键被按下并释放一个键时调用此回调函数。
         */
        onKeyPress:PropTypes.func,

        /**
         * @property onSelectionChange
         * @type function
         * @param {object} [event]
         * @description 此回调函数当软键盘的确定/提交按钮被按下的时候调用此函数。如果`multiline={true}`，此属性不可用
         */
        onSelectionChange:PropTypes.func,


        /**
         * @property onSelectionChange
         * @type function
         * @param {object} [event]
         * @description 当文本框选中状态变化时调用此回调函数。
         */
        onSubmitEditing:PropTypes.func,

        /**
         * @property placeholder
         * @type string
         * @description 如果没有任何文字输入，会显示此字符串。
         */
        placeholder:PropTypes.string,

        /**
         * @property password
         * @type bool
         * @default false
         * @description 如果是true，输入的内容为密码
         */
        password:PropTypes.bool,
        /**
         * @property secureTextEntry
         * @type bool
         * @default false
         * @description 是否启用安全输入，如果为true，文本框会遮住之前输入的文字，这样类似密码之类的敏感文字可以更加安全。默认值为false。
         */
        secureTextEntry:PropTypes.bool,
        /**
         * @property style
         * @type object
         * @default false
         * @description 样式，本组件继承了所有Text的样式
         */
        style: Text.propTypes.style,
        /**
         * @property value
         * @type string
         * @description 文本框中的文字内容。
         */
        value:PropTypes.string,
    },

    render: function() {
        var props = this.props,
            {
                accessibilityLabel,
                autoComplete,
                autoFocus,
                defaultValue,
                editable,
                keyboardType,
                maxLength,
                multiline,
                numberOfLines,
                onBlur,
                onChange,
                onKeyDown,
                onKeyUp,
                onKeyPress,
                onChangeText,
                onSelectionChange,
                placeholder,
                password,
                secureTextEntry,
                style,
                testID,
                value,
            } = props,
            input,
            propsCommon = {
                ref: 'input',
                'aria-label': accessibilityLabel,
                autoComplete: autoComplete && 'on',
                // autoFocus, // 屏蔽掉focusNode.js
                defaultValue,
                maxLength,
                onBlur: onBlur && this._onBlur,
                onFocus: this._onFocus,
                onSelect: onSelectionChange && this._onSelectionChange,
                onChange: this._onChange,
                placeholder,
                readOnly: !editable,
                testID,
                value,
                onKeyDown,
                onKeyUp,
                onKeyPress: this._onKeyPress,
            };
        if (multiline) {
            var propsMultiline = {
                ...propsCommon,
                style: StyleSheet.fix([styles.initial, props.style]),
                rows:numberOfLines
            };
            input = (
                <textarea {...propsMultiline}></textarea>
            );
        } else {
            var type = typeMap[keyboardType] || 'text'
            if (password || secureTextEntry) type = 'password'
            var propsSingleline = {
                ...propsCommon,
                style: StyleSheet.fix([styles.initial,styles.single, props.style]),
                type
            };
            input = (
                <input {...propsSingleline}/>
            )
        }
        if (!props.children){
            return(
                <TouchableWithoutFeedback 
                    onPress={this.onPress.bind(this)}
                    onLayout = {(e)=>{
                        props.onLayout && props.onLayout();
                    }}
                >
                    {input}
                </TouchableWithoutFeedback>
            )
        }
        return (
            <TouchableWithoutFeedback  
                onPress={this.onPress.bind(this)} 
                onLayout = {(e)=>{
                    props.onLayout && props.onLayout();
                }}>
                <View style={styles.inputContainer} className="TextInput">
                    {input}
                    {props.children}
                </View>
            </TouchableWithoutFeedback>
        )
    },
    

    onPress(){
        TextInputState.focus(this.refs['input'])
    },

    componentWillMount(){
        this.blurOnSubmit = this.props.blurOnSubmit ? this.props.blurOnSubmit : (this.props.multiline ? false : true);
    },

    componentDidMount() {
        var input = this.refs['input'];
        if (this.props.autoFocus) TextInputState.focus(input)
        this._lock = function(){
            this.__lock = true;
        }.bind(this)
        this._unlock = function(){
            this.__lock = false;
        }.bind(this)
        input.addEventListener('compositionstart', this._lock)
        input.addEventListener('compositionend', this._unlock)
    },

    componentWillUnmount() {
        var input = this.refs['input'];
        input.removeEventListener('compositionstart', this._lock)
        input.removeEventListener('compositionend', this._unlock)
    },

    componentWillReceiveProps(nextProps){
        this.blurOnSubmit = nextProps.blurOnSubmit ? nextProps.blurOnSubmit : (nextProps.multiline ? false : true);
    },


     /**
     * @property isFocused
     * @type function
     * @description 返回值表明当前输入框是否获得了焦点。true表示获取到焦点，false表示没有获取焦点
     */ 
    isFocused(){
        return TextInputState.currentFocus() === this.refs.input;
    },


    /**
     * @property clear
     * @type function
     * @description 清空输入框的内容
     */
    clear(){
        this.refs.input.value = '';
    },

    _onFocus: function(e) {
        var { clearTextOnFocus, onFocus, selectTextOnFocus } = this.props,
            node = this.refs['input'];
        if (!node) return // 未屏蔽focusNode.js会出现这个问题
        if (clearTextOnFocus) {
          node.value = ''
        };
        if (selectTextOnFocus) node.select && node.select();
        TextInputState.focus(node);
        if (onFocus) {
            e.nativeEvent.text = e.target.value;
            onFocus(e);
        }
    },
    _onBlur: function(e) {
        var { onBlur, onEndEditing } = this.props;
        TextInputState.blur(this.refs['input'])
        if (onBlur) {
            e.nativeEvent.text = e.target.value;
            onBlur(e);
        }
        if(onEndEditing){
            e.nativeEvent.text = e.target.value;
            onEndEditing(e);
        }
    },
    _onChange: function(e) {
        var nativeEvent = e.nativeEvent,
            {autoCapitalize} = this.props,
            target = nativeEvent.target,
            value = target.value,
            unlock = !this.__lock
        // __lock的时候才去格式化value，但是不影响onChange事件去触发suggest
        if (unlock) {
            autoCapitalize = autoCapitalizer[autoCapitalize] || autoCapitalizer['none']
            value = autoCapitalize(value)
            this.refs['input'].value = value
        }
        var { onChange, onChangeText } = this.props;
        // 传递unlock，提供较强的扩展性
        onChangeText && onChangeText(value,unlock);
        if (onChange) {
            e.nativeEvent.text = value;
            onChange(e, unlock);
        }
    },
    _onKeyPress:function(e){
        e.nativeEvent.text = e.target.value;
        this.props.onKeyPress && this.props.onKeyPress(e);
        if(e.nativeEvent.keyCode === 13){
            if(!this.props.multiline){
                this.blurOnSubmit && TextInputState.blur(this.refs['input']);
                this.props.onSubmitEditing && this.props.onSubmitEditing(e)
            }else{
                if(this.blurOnSubmit){
                    TextInputState.blur(this.refs['input']);
                    this.props.onSubmitEditing && this.props.onSubmitEditing(e)
                }
            }
        }
    },
    _onSelectionChange: function(e) {
        // console.log(e,e.nativeEvent)
        var { onSelectionChange } = this.props;
        if (onSelectionChange) {
            var { selectionDirection, selectionEnd, selectionStart } = e.target;
            e.nativeEvent = e.nativeEvent || {}
            e.nativeEvent.text = e.target.value;
            e.nativeEvent.selection = {
                start: selectionStart,
                end: selectionEnd,
                direction: selectionDirection,
            }
            var event = {
                selectionDirection,
                selectionEnd,
                selectionStart,
                nativeEvent: e.nativeEvent
            };
            onSelectionChange(event);
        }
    }
});

var styles = StyleSheet.create({
    inputContainer: {
        'font-size': '0.14rem',
    },
    initial: {
        appearance: 'none',
        backgroundColor: 'transparent',
        borderColor: 'black',
        borderWidth: 0,
        boxSizing: 'border-box',
        color: 'inherit',
        font: 'inherit',
        padding: 0,
        fontSize: 14,
        display:'block',
    },
    single:{
        height: 30,
    }
});

TextInput.TextInputState = TextInputState;
module.exports = TextInput;
