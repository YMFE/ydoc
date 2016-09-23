/**
 * @providesModule Image
 */

/* global Image */

var React = require('react');
var View = require('View');
var StyleSheet = require('StyleSheet');
var LayoutMixin = require('LayoutMixin');
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = React.PropTypes;
require('resolveAssetSource');

const RESIZE_MODE = {
    contain: 'contain',
    stretch: 'stretch',
    cover: 'cover',
    center: 'center',
    none: 'none',
    repeat: 'repeat',
};

/**
 * Image 组件
 *
 * @component Image
 * @example ./Image.js
 * @version >=0.20.0
 * @description 显示不同类型图片的 React 组件。
 *
 * ![Image](./images/component/Image.gif)
 */

function getUri(props) {
    if (typeof props !== 'object'){
        return;
    }
    let source =  props.source,
        uri;
    if (source) {
        if (typeof source === 'number') {
            // web版本打包的时候，应该打包成base64或者直接替换成{uri: 'url'}
            uri = 0;
        } else if (typeof source === 'object') {
            uri = source.uri;
        }
    }
    return uri || 'about:blank';
}

const propTypes = {
    /**
     * @property onLayout
     * @type function
     * @description 当元素挂载或者布局改变的时候调用，参数为：`{nativeEvent: {layout: {x, y, width, height}}}`.
     */
    onLayout: PropTypes.func,
    /**
     * @property onLoad
     * @type function
     * @description 成功加载完成时调用。
     */
    onLoad: PropTypes.func,
    /**
     * @property onLoadEnd
     * @type function
     * @description 加载完成后调用（无论加载成功与否）。
     */
    onLoadEnd: PropTypes.func,
    /**
     * @property onLoadStart
     * @type function
     * @description 开始加载时调用。
     */
    onLoadStart: PropTypes.func,
    /**
     * @property onError
     * @type function
     * @description 加载错误时调用，参数： {nativeEvent: {error}}
     */
    onError: PropTypes.func, // rn ios, web all
    /**
     * @property source
     * @type {{url:string}}
     * @description 图片资源的位置 (可以是 URL 也可以是本地资源).
     */
    source: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
    ]),
    /**
     * @property style
     * @type style
     * @description 组件的样式
     */
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    resizeMode: PropTypes.oneOf(Object.keys(RESIZE_MODE))
};

const defaultProps = {
    style: {},
};

var _Image = React.createClass({
    mixins: [LayoutMixin, NativeMethodsMixin],
    contextTypes: {
        isInAParentText: React.PropTypes.bool // 处理嵌套到文字内的情形
    },
    getInitialState: function () {
        return {
            source: {uri: getUri(this.props)}
        };
    },
    propTypes: propTypes,
    getDefaultProps: () => defaultProps,
    componentWillReceiveProps(props) {
        var newSource = props.source ? {uri: getUri(props)} : {}
        this.setState({
            source: {...this.state.source, ...newSource},
        });
    },
    render: function () {
        let props = this.props,
            src = this.state.source.uri || 'about:blank',
            style = StyleSheet.fix(props.style),
            resizeMode = this.props.resizeMode || style.resizeMode;
        if ((this.props.children) || resizeMode !== 'none' || !this.context.isInAParentText) {
            let backgroundImage = 'url("' + src.replace(/^http:/g, "") + '")';
            return (
                <View
                    style={[
                        styles.initial,
                        {backgroundImage},
                        resizeModeStyles[resizeMode],
                        style
                    ]}
                    data-src={src}
                >
                    {props.children || null}
                </View>
            );
        } else {
            return (
                <img
                    {...props}
                    onLoad={(e)=> this._onLoad(e)}
                    style={style}
                    src={src.replace(/^http:/g, "")}
                    loop={'infinite'}
                />
            );
        }
    },
    _onLoad: function (e) {
        var {onLoad} = this.props,
            target = e.target;
        // fix overflow bug in Chrome
        if (target) {
            setTimeout(function () {
                if (!target) return;
                var zoom = target.style.zoom;
                target.style.zoom = 1;
                if (zoom) target.style.zoom = zoom
            })
        }
        if (onLoad) onLoad.call(this, e);
    }
});


/**
 * @property Image.resizeMode
 * @type object
 * @description 这个属性挂载在 Image 上，是一个静态属性，该对象中包含三个属性，
 * 描述了三种当图片大小与容器不符时，图片的缩放方式。通常将这个属性中的值赋给组件的 resizeMode 属性
 * - cover：按原比例伸缩图片，使图片的宽高中其一恰好等于容器的宽高，另外一个超出容器。
 * - stretch：拉伸图片使其恰好铺满容器。
 * - contain：按原比例伸缩图片，使其宽高中其一恰好等于容器的宽高，另外一个小于容器。
 * - repeat: 重复图片,保持原分辨率,铺满整个区域
 *
 * ```
 * <Image resizeMode={Image.resizeMode.contain} />
 * ```
 *
 */
_Image.resizeMode = RESIZE_MODE;


_Image.getSize = function (uri, cb) {
    var img = new Image();
    img.src = uri;
    img.onload = function () {
        cb(img.width, img.height);
        img = img.onload = img.onerror = null;
    };
    img.onerror = function () {
        cb(0, 0);
        img = img.onload = img.onerror = null;
    };
};

_Image.prefetch = function(url){
    var img = new Image();
    img.src = url;
};

const styles = StyleSheet.create({
    initial: {
        backgroundColor: 'transparent',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
    }
});

const resizeModeStyles = StyleSheet.create({
    center: {
        backgroundSize: 'auto',
        backgroundPosition: 'center'
    },
    contain: {
        backgroundSize: 'contain'
    },
    cover: {
        backgroundSize: 'cover'
    },
    none: {
        backgroundSize: 'auto'
    },
    repeat: {
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        backgroundPosition: '0 0'
    },
    stretch: {
        backgroundSize: '100% 100%'
    }
});

module.exports = _Image;
