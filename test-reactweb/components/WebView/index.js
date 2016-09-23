/**
 * @providesModule WebView
 */

const React = require('react');
const ReactDOM = require('react-dom');
const StyleSheet = require('StyleSheet');
const View = require('View');
const { Component, PropTypes } = React;
const fetch = require('fetch');
const WebViewState = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    ERROR: 'ERROR'
};

const defaultProps = {
    automaticallyAdjustContentInsets: true,
    decelerationRate:0.998,
    contentInset: {top: 0, left: 0, bottom: 0, right: 0},
    mediaPlaybackRequiresUserAction: true,
    javaScriptEnabled: true,
    bounces: true,
    scrollEnabled: true
};

const propTypes = {
    ...View.propTypes,
    html: function(){
        return Error('`html` props has deprecated, Use the `source` prop instead.');
    },

    url: function(){
        return Error('`url` props has deprecated, Use the `source` prop instead.');
    },

    /**
     * @property source
     * @type {uri: string, method: string, headers: object, body: string}, {html: string, baseUrl: string}
     * @description 在WebView中载入一段静态的html代码或是一个url（还可以附带一些header选项）。
     *
     *
     * 通过网络加载页面，可以指定一个包含下列参数的对象
     *
     * - url：需要加载的页面的 url
     * - method：指定 HTTP 方法（使用什么方法加载页面），默认为 GET
     * - headers：一个对象，用来指定 HTTP 头部信息
     * - body：HTTP 请求的 body
     *
     * 通过一个静态的 html 字符串加载页面，可以指定一个包含下列参数的对象
     *
     * - html：html 字符串
     * - baseUrl：页面中的链接如果是相对链接，该参数则指定其 base url。
     */
    source: PropTypes.oneOfType([
        PropTypes.shape({
            /*
             * The URI to load in the `WebView`. Can be a local or remote file.
             */
            uri: PropTypes.string,
            /*
             * The HTTP Method to use. Defaults to GET if not specified.
             * NOTE: On Android, only GET and POST are supported.
             */
            method: PropTypes.string,
            /*
             * Additional HTTP headers to send with the request.
             * NOTE: On Android, this can only be used with GET requests.
             */
            headers: PropTypes.object,
            /*
             * The HTTP body to send with the request. This must be a valid
             * UTF-8 string, and will be sent exactly as specified, with no
             * additional encoding (e.g. URL-escaping or base64) applied.
             * NOTE: On Android, this can only be used with POST requests.
             */
            body: PropTypes.string,
        }),
        PropTypes.shape({
            /*
             * A static HTML page to display in the WebView.
             */
            html: PropTypes.string,
            /*
             * The base URL to be used for any relative links in the HTML.
             */
            baseUrl: PropTypes.string,
        }),
        /*
         * Used internally by packager.
         */
        PropTypes.number,
    ]),

    /**
     * @property renderError
     * @type function
     * @description 设置一个函数，返回一个视图用于显示错误。
     */
    renderError: PropTypes.func, // view to show if there's an error
    /**
     * @property renderLoading
     * @type function
     * @description 设置一个函数，返回一个加载指示器。
     */
    renderLoading: PropTypes.func,
    /**
     * @property renderLoading
     * @type function
     * @description 设置一个函数，加载成功时调用。
     */
    onLoad: PropTypes.func,
    /**
     * @property onLoadEnd
     * @type function
     * @description 设置一个函数，加载结束时（无论成功或失败）调用。
     */
    onLoadEnd: PropTypes.func,
    /**
     * @property onLoadStart
     * @type function
     * @description 设置一个函数，加载开始时调用。
     */
    onLoadStart: PropTypes.func,
    /**
     * @property onError
     * @type function
     * @description 设置一个函数，加载失败时调用。
     */
    onError: PropTypes.func,

    bounces: PropTypes.bool,
    /**
     * A floating-point number that determines how quickly the scroll view
     * decelerates after the user lifts their finger. You may also use the
     * string shortcuts `"normal"` and `"fast"` which match the underlying iOS
     * settings for `UIScrollViewDecelerationRateNormal` and
     * `UIScrollViewDecelerationRateFast` respectively:
     *
     *   - normal: 0.998
     *   - fast: 0.99 (the default for iOS web view)
     * @platform ios
     */
    decelerationRate: 0.998,
    /**
     * Boolean value that determines whether scrolling is enabled in the
     * `WebView`. The default value is `true`.
     * @platform ios
     */
    scrollEnabled: PropTypes.bool,
    /**
     * Controls whether to adjust the content inset for web views that are
     * placed behind a navigation bar, tab bar, or toolbar. The default value
     * is `true`.
     */
    automaticallyAdjustContentInsets: PropTypes.bool,
    /**
     * The amount by which the web view content is inset from the edges of
     * the scroll view. Defaults to {top: 0, left: 0, bottom: 0, right: 0}.
     */
    contentInset: PropTypes.object,
    /**
     * @property onNavigationStateChange
     * @type function
     * @description 一个将在 webview 开始加载和加载结束的时候调用的函数。
     */
    onNavigationStateChange: PropTypes.func,
    /**
     * @property startInLoadingState
     * @type boolean
     * @description 一个布尔值表示是否强制展示 loading 页面
     */
    startInLoadingState: PropTypes.bool,
    /**
     * The style to apply to the `WebView`.
     */
    style: View.propTypes.style,

    /**
     * Determines the types of data converted to clickable URLs in the web view’s content.
     * By default only phone numbers are detected.
     *
     * You can provide one type or an array of many types.
     *
     * Possible values for `dataDetectorTypes` are:
     *
     * - `'phoneNumber'`
     * - `'link'`
     * - `'address'`
     * - `'calendarEvent'`
     * - `'none'`
     * - `'all'`
     *
     * @platform ios
     */
    // dataDetectorTypes: PropTypes.oneOfType([
    //     PropTypes.oneOf(DataDetectorTypes),
    //     PropTypes.arrayOf(PropTypes.oneOf(DataDetectorTypes)),
    // ]),

    /**
     * @property javaScriptEnabled
     * @type bool
     * @description 一个布尔值，表示在 webView 是否允许执行 javaScript。
     */
    javaScriptEnabled: PropTypes.bool,

    /**
     * Boolean value to control whether DOM Storage is enabled. Used only in
     * Android.
     * @platform android
     */
    domStorageEnabled: PropTypes.bool,

    /**
     * @property injectedJavaScript
     * @type string
     * @description 一段将在页面加载成功后被注入的 js 脚本，不包含 `<script>` 标签。
     */
    injectedJavaScript: PropTypes.string,

    /**
     * Sets the user-agent for the `WebView`.
     * @platform android
     */
    userAgent: PropTypes.string,

    /**
     * Boolean that controls whether the web content is scaled to fit
     * the view and enables the user to change the scale. The default value
     * is `true`.
     */
    scalesPageToFit: PropTypes.bool,

    /**
     * Function that allows custom handling of any web view requests. Return
     * `true` from the function to continue loading the request and `false`
     * to stop loading.
     * @platform ios
     */
    onShouldStartLoadWithRequest: PropTypes.func,

    /**
     * Boolean that determines whether HTML5 videos play inline or use the
     * native full-screen controller. The default value is `false`.
     *
     * **NOTE** : In order for video to play inline, not only does this
     * property need to be set to `true`, but the video element in the HTML
     * document must also include the `webkit-playsinline` attribute.
     * @platform ios
     */
    allowsInlineMediaPlayback: PropTypes.bool,

    /**
     * Boolean that determines whether HTML5 audio and video requires the user
     * to tap them before they start playing. The default value is `true`.
     */
    mediaPlaybackRequiresUserAction: PropTypes.bool,
};

/**
 * WebView 组件
 *
 * @component WbView
 * @example ./WebView.js
 * @description 创建一个原生的WebView，可以用于访问一个网页。
 *
 * ![WebView](./images/component/WebView.gif)
 *
 * ## 关于 WebView 的一些注意事项
 *
 * 在 web 上 WebView 是采用 iframe 模拟实现的，因此在功能上存在一些局限，具体表现在以下方面：
 * - iframe 如果加载的是跨域的文档，就不能直接去操作其中的 dom 元素，这导致如同注入 JavaScript、前进、后退等功能无法实现。
 * - 如果 source 中提供了 headers 或者 不同于 GET 的 method，以及 method 为 GET 且提供了 headers，这样是不能直接将
 * uri 设置为 iframe 的 src 的，而是使用了 fetch 来加载文档，然后将内容通过 `URL.createObjectURL` 得到一个 url
 * 并设置为 iframe 的 src。这里存在跨域限制，要确保资源能够被成功加载。
 */

class WebView extends Component {
    constructor(props){
        super(props);
        this.state = {
            viewState: WebViewState.IDLE,
            startInLoadingState: true,
            src: '',
            sandbox: ''
        };
        this.history = [];
        this.index = -1;
    }

    componentWillMount() {
        this._updateState(this.props);
        this.updateWebView();
    }
    componentDidMount() {
        this.bindEventForIframe();
    }
    componentWillReceiveProps(nextProps){
        this._updateState(nextProps);
        this.updateWebView();
    }
    shouldComponentUpdate(nextProps, nextState){
        if((nextState.src !== this.state.src) && nextState.src){
            this.index += 1;
            this.history = this.history.slice(0, this.index);
            this.history.push({
                url: nextState.src
            });
        }
        return true;
    }
    componentDidUpdate(){
        this.bindEventForIframe();
    }
    _updateState(props){
        if(props.javaScriptEnabled === false){
            // remove allow-scripts from sandbox
            var sandbox = ['allow-forms', 'allow-modals', 'allow-orientation-lock', 'allow-pointer-lock', 'allow-popups',
                'allow-popups-to-escape-sandbox', 'allow-same-origin', 'allow-top-navigation'].join(' ');
            this.setState({sandbox: sandbox});
        }
        if (props.startInLoadingState) {
            this.setState({viewState: WebViewState.LOADING});
        }
        var source = props.source;
        if (source && source.uri && (!source.method || source.method.toUpperCase() === 'GET') && !source.headers){
            this.setState({src: source.uri});
        }
    }
    updateWebView(){
        var source = this.props.source;
        if(source.uri){
            if((source.method && source.method.toUpperCase() !== 'GET') || source.headers){
                fetch(source.uri, {
                    method: source.method || 'GET',
                    headers: source.headers || {},
                    body: source.body
                }).then(res => res.text()).then(text => {
                    var url = this.contentToURL(text);
                    this.setState({src: url});
                }).catch( () => {
                    this._error();
                });
            }
        } else if (source.html) {
            var url = this.contentToURL(source.html);
            this.setState({src: url});
        }
    }
    _error(){
        this.props.onLoadStart && this.props.onLoadStart();
        this.props.onError && this.props.onError();
        this.props.onLoadEnd && this.props.onLoadEnd();
    }
    contentToURL(content){
        var url;
        var blob = new Blob([content], {type: 'text/html'});
        var URL = window.URL || window.webkitURL;
        if (!URL) {
            this._error(new Error('当前浏览器不支持 WebView'));
        }
        url = URL.createObjectURL(blob);
        return url;
    }
    bindEventForIframe(iframe){
        var iframe = ReactDOM.findDOMNode(this.iframe);
        this.props.onLoadStart && this.props.onLoadStart();
        this._onNavigationStateChange();
        iframe.onload = (event) => {
            this.props.onLoad && this.props.onLoad(event);
            this.props.onLoadEnd && this.props.onLoadEnd(event);
            this.setState({
                viewState: WebViewState.IDLE
            });
            this._onNavigationStateChange();
        };
        iframe.onerror = (event) => {
            this.injectContentBeforeLoaded();
            this.props.onError && this.props.onError(event);
            this.props.onLoadEnd && this.props.onLoadEnd(event);
            this.setState({
                viewState: WebViewState.ERROR
            });
            this._onNavigationStateChange();
        };
    }
    injectContentBeforeLoaded(){
        var iframe = ReactDOM.findDOMNode(this.iframe);
        var props = this.props;
        if(props.source.baseUrl){
            var base = document.createElement('base');
            base.setAttribute('href', props.source.baseUrl);
            try {
                iframe.contentWindow.document.head.appendChild(base);
            } catch (e) {}
        }
        if(props.injectedJavaScript){
            var script = document.createElement('script');
            script.innerHTML = props.injectedJavaScript;
            try {
                iframe.contentWindow.document.body.appendChild(script);
            } catch (e) {}
        }
    }
    goBack(){
        var iframe = ReactDOM.findDOMNode(this.iframe);
        iframe.contentWindow.history.go(-1);
        if(this.index > 0){
            this.index -= 1;
        }
    }
    goForward(){
        var iframe = ReactDOM.findDOMNode(this.iframe);
        iframe.contentWindow.history.go(1);
        if(this.index < this.history.length - 1){
            this.index += 1;
        }
    }
    _onNavigationStateChange(){
        try {
            var iframe = ReactDOM.findDOMNode(this.iframe);
            this.props.onNavigationStateChange && this.props.onNavigationStateChange({
                canGoBack: this.index > 0,
                canGoForward: this.index < this.history.length - 1,
                url: this.state.src,
                title: iframe.contentWindow.title,
                loading: this.state.viewState === WebViewState.LOADING
            });
        } catch (e) {}
    }
    reload(){
        var iframe = ReactDOM.findDOMNode(this.iframe);
        try {
            iframe.contentWindow.location.refresh();
        } catch (e) {
            var src = iframe.src;
            iframe.src = '';
            iframe.src = src;
        }
    }
    render() {
        var otherView;
        if(this.state.viewState === WebViewState.LOADING){
            otherView = this.props.renderLoading && this.props.renderLoading();
        } else if (this.state.viewState === WebViewState.ERROR){
            otherView = this.props.renderError && this.props.renderError();
        }
        return (
            <View
                style={styles.container}
            >
                <View
                    style={[styles.container,
                        this.state.viewState !== WebViewState.IDLE && {display: 'none'}
                    ]}
                >
                    <iframe
                        src={this.state.src}
                        ref={ref => {this.iframe = ref;}}
                        style={{...styles.webView, ...this.props.style}}
                    ></iframe>
                </View>
                {otherView}
            </View>
        );
    }
}

WebView.propTypes = propTypes;
WebView.defaultProps = defaultProps;


var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 2,
    },
    errorTextTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10,
    },
    hidden: {
        height: 0,
        flex: 0, // disable 'flex:1' when hiding a View
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    webView: {
        flex: 1,
        backgroundColor: '#ffffff',
        border: 0,
    }
});

module.exports = WebView;
