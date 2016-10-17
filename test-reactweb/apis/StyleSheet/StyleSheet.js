/*
 *
 * @providesModule StyleSheet
 */

/**
 * StyleSheet
 *
 * @component StyleSheet
 * @example ./StyleSheet.js[1-52]
 * @description  StyleSheet提供了类似 CSS 样式表的抽象。
 *
 * #### 声明样式
 * ```
 * var styles = StyleSheet.create({});
 * ```
 *
 * StyleSheet.create()可将样式值转化为数字id，指向内部样式表，使得样式不可更改和不可见。本项目会自动抹平浏览器差异，对样式进行兼容处理。
 *
 * 将样式声明放到文件的末尾处，可保证在应用中只被创建一次。在render中直接创建样式对象，每次渲染都会被重复创建。
 *
 *
 * #### 使用样式
 * 所有核心组件都可以接受style属性。
 *
 * 可接受一个style
 * ```
 * <View style={styles.container} />
 * ```
 * 也可以以数组的形式接受多个style,最右侧优先级越高，否定值（如false，undefined，null）会被忽略。
 * ```
 * <View style={[styles.base, styles.background, this.state.active && styles.active]} />
 * ```
 * 也可在render中建立，但会重复渲染，不推荐。
 * ```
 * <Text style={{color:'red'}}>hello</Text>
 * ```
 * #### 作为参数调用
 * 你可以将样式作为参数进行传递，可使用 `View.propTypes.style` 和 `Text.propType.style` 来确保参数是style类型的。
 * ```
 * propTypes: {
 *   style: View.propTypes.style
 * }
 * ```
 *
 * 示例描述了StyleSheet应如何创建和使用。
 *
 * #### 注意事项
 * - 本组件将 React Native 中的 style 属性转换为 React web 属性，同时会兼容浏览器差异。如 flexbox 相关属性会根据浏览器所使用的flexbox规范进行兼容，增加浏览器厂商前缀等等，可放心使用。
 * - 本组件会将涉及到长度的不带单位样式值转化为rem，例如，width:10会自动变为width:'0.10 rem'。而对于那些需要保持 css 的独立性的样式值，如flex:1,则不会进行转换。
 * - 本组件几乎覆盖了 React Native 的全部style属性，除了 shadowOpacity(浏览器不支持)。
 * - 样式对象的键名应遵循驼峰风格，如borderColor，以达到最佳效果。
 *
 */


var fixStyleSheet = require('./fixStyleSheet');
var flattenStyle = require('./flattenStyle');
var suffixes = ['', '-webkit-'];
var styleToInject = [];
var injected;


const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
const absoluteFill = fixStyleSheet(absoluteFillObject);

var StyleSheet = {

   /**
   * @property hairlineWidth
   * @type static
   * @description 这一常量定义了当前平台上的最细的宽度。可以用作边框或是两个元素间的分隔线,然而，你不能把它“视为一个常量”，因为不同的平台和不同的屏幕像素密度会导致不同的结果。在web上此值为1px
   */
    hairlineWidth: 1,

    /**
     * @property flatten
     * @type function
     * @param {array} array  style数组
     * @description 将一个style数组转化为一个style对象。如果传入的是对象，则直接返回此对象，如果传入的值 == false，则返回undefined
     */
    flatten:flattenStyle,


    /**
     * @property absoluteFill
     * @type object
     * @description 一个可直接使用的绝对布局定位
     *
     * 它是由`{position:'absolute',left:0,right:0,top:0,bottom:0,}`变换过可直接使用的style，
     *
     * 可以直接`<View style={StyleSheet.absoluteFill}/>`使用
     */
    absoluteFill:absoluteFill,


    /**
     * @property absoluteFillObject
     * @type object
     * @description 一个便捷的绝对定位数组，它实际上就是`{position:'absolute',left:0,right:0,top:0,bottom:0,}`
     *
     * 你可以这样使用它：
     *
     * `const styles = StyleSheet.create({ wrapper: { ...StyleSheet.absoluteFillObject, top: 10, backgroundColor: 'transparent', }, });`
     */
    absoluteFillObject:absoluteFillObject,

    /**
     * @method create
     * @param  {object} obj 描述样式的对象
     * @return {object} stylesheet 样式表
     * @description StyleSheet的构造函数，将样式值转化为数字id，指向内部样式表，使得样式不可更改和不可见。本项目会自动抹平浏览器差异，对样式进行兼容处理。
     */
    create: function (obj) {
        for (var className in obj) {
           obj[className] = fixStyleSheet(obj[className])
        }
        return obj
    },

    // 注入页面中的样式
    inject: function(styles, ensureInject) {
        styleToInject.push(styles)
        if (ensureInject && injected) StyleSheet.initStyle()
    },

    initStyle: function() {
        if (styleToInject.length) {
            var style = document.createElement('style')
            style.innerHTML = styleToInject.join('\n')
            document.head.insertBefore(style, document.head.firstChild)
            styleToInject = []
            injected = true
        }
    },



    fix: function (style, component) {
        var style = StyleSheet.normalize(style),
            props = component && component.props
        style = fixStyleSheet(style, component)
        if (style.useFlexbox && props){
            if (props.className){
                props.className += ' rn-flex'
            } else {
                props.className =  'rn-flex'
            }
            delete style.useFlexbox
        }
        return style

    },


    /**
     * 将一个可能存在嵌套的 style 转换为一个简单对象，
     * @param {Array | Object} style 一个数组或者对象
     */
    normalize: function(style){
        if (typeof style !== 'object' || style === null){
            return {};
        }
        if (Array.isArray(style)){
            style = flattenStyle(style);
        }
        return style;
    },
    suffixStringStyle: function(str) {
        var newString = ''
        str.split(';').forEach(function(item) {
            item = item.trim()
            if (item) {
                suffixes.forEach(function(suffix) {
                    newString += suffix + item + ';'
                })
            }
        })
        return newString
    },
    fixTransform: require('./fixTransform').handle
}




module.exports = StyleSheet;
