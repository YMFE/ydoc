/**
 * @component LazyImage
 * @author jiao.shen
 * @description 懒加载图片组件,只能在List中使用。
 *
 * 使用这个组件代替img标签后,会延迟加载这个图片,直到List组件的滚动使得该图片位于可视区域之内。
 */
import React, {Component, PropTypes} from 'react';

export default class extends Component {
    static contextTypes = {
        //从父组件context接收的属性
        //list组件实例的引用
        scroller: PropTypes.object,
        //listitem的offsetY(infinite模式下)
        offsetY: PropTypes.number,
        //listitem实例的引用
        itemRef: PropTypes.object
    };

    static PropTypes = {
        /**
         * @property defaultImage
         * @type String
         * @default null
         * @description 默认图片,在原图片还没有完成加载时展示
         */
        defaultImage: PropTypes.string,
        /**
         * @property src
         * @type String
         * @default null
         * @description 图片src,必需
         */
        src: PropTypes.string.isRequired,
        /**
         * @property className
         * @type String
         * @default null
         * @description 给img标签加的类名
         */
        className: PropTypes.string,
        /**
         * @property width
         * @type Number
         * @default null
         * @description 图片宽度
         */
        width: PropTypes.number,
        /**
         * @property height
         * @type Number
         * @default null
         * @description 图片高度
         */
        height: PropTypes.number,
        /**
         * @property customAttr
         * @type Object
         * @default null
         * @description 附加给img dom节点的自定义属性,属性名需要以data-开头
         */
        customAttr: PropTypes.object,
        /**
         * @property style
         * @type Object
         * @default null
         * @description 附加给img dom节点的style
         */
        style: PropTypes.object
    };

    static defaultProps = {
        defaultImage: null,
        src: null,
        className: null,
        width: null,
        height: null,
        customAttr: {},
        style: null
    };

    constructor(props) {
        super(props);
        const {defaultImage}=props;
        //0->等待load,1->loading,2->loaded
        this.loading = 0;
        this.state = {
            src: defaultImage,
        };
    }

    load() {
        if (this.loading === 0) {
            const {src}=this.props,
                tmpImg = new Image();
            this.loading = 1;
            tmpImg.onload = ()=> {
                this.loading = 2;
                this.setState({src, loaded: true});
            };
            tmpImg.src = src;
        }
    }

    //父组件render时,需要重置这个组件的loaded状态和context
    componentWillReceiveProps(nextProps, nextContext) {
        this.loading = 0;
        this.offsetY = nextContext.offsetY;
        this.itemRef = nextContext.itemRef;
        this.offsetTop = null;
        this.setState({src: nextProps.defaultImage});
    }

    componentDidMount() {
        this.offsetY = this.context.offsetY;
        this.itemRef = this.context.itemRef;
        const scroller = this.context.scroller;
        if (scroller) {
            scroller.childLazyImages.push(this);
        }
    }

    componentWillUnmount() {
        const scroller = this.context.scroller;
        if (scroller) {
            scroller.childLazyImages.splice(scroller.childLazyImages.findIndex(this), 1);
        }
    }

    render() {
        const {defaultImage, width, height, style, className, customAttr}=this.props;

        return (
            <img
                ref={img=> {
                    if (img) this.img = img
                }}
                src={this.state.src}
                width={width}
                style={style}
                height={height}
                className={className}
                {...customAttr}
            />
        );
    }
}