import './style.scss';
import '../../common/tapEventPluginInit';
import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const ALLOWANCE = 1;

class CarouselItem extends Component {
    static propTypes = {
        /**
         * 图片地址
         * @type PropTypes.string
         * @property img
         * @description 图片地址
         */
        img: PropTypes.string,
        /**
         * 图片加载失败时的替换图片
         * @type PropTypes.string
         * @property errorImg
         * @description 图片加载失败时的替换图片
         */
        errorImg: PropTypes.string,
        /**
         * 图片检查函数
         * @type PropTypes.func
         * @property checkImgFun
         * @description 目标图片onload时触发进行判断的函数
         * @param 图片实例
         */
        checkImgFun: PropTypes.func,
        /**
         * 当前展示的item
         * @type PropTypes.number
         * @property currentPage
         * @description 当前展示图片的索引 用于切换active样式等
         */
        currentPage: PropTypes.number,
        /**
         * item点击事件处理函数
         * @type PropTypes.func
         * @property onTap
         * @param {e} 事件对象，传入组件数据
         * @description
         */
        onTap: PropTypes.func,
        /**
         * 组件额外class
         * @property extraClass
         * @type PropTypes.string
         * @description 为组件根节点提供额外的class。
         */
        extraClass: PropTypes.string,
        /**
         * 图片加载时的loading Element
         * @type PropTypes.element
         * @property loadingEle
         * @description 图片加载中时的React节点
         */
        loadingEle: PropTypes.element,
        /**
         * 是否需要图片懒加载
         * @type PropTypes.bool
         * @property lazyload
         * @description 默认值为true,当前图片的前后两个节点图片被加载
         */
        lazyload: PropTypes.bool,
        /**
         * item是当前展示item的样式名
         * @type PropTypes.string
         * @property activeClass
         * @description 默认值为'on'
         */
        activeClass: PropTypes.string,
        /**
         * CarouselItem的总个数
         * @type PropTypes.number
         * @property pagesNum
         * @description 用于懒加载时的计算
         */
        pagesNum: PropTypes.number
    }
    static defaultProps = {
        errorImg: 'http://www.guojiawei.com/uploads/140711/1-140G1205F1S3.jpg',
        loadingEle: null,
        lazyload: true,
        activeClass: 'on',
        onTap: () => {
          console.log('响应点击事件');
        }
    }

    constructor(props) {
        super(props);
        if (props.img) {
            this.state = {
                img: 0
            };
        }
        this.handleTap = this.handleTap.bind(this);
        this.hasUnmount = false;
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    handleTap(e) {
        this.props.onTap(e);
    }

    loadImg() {
        if (!this.props.img) {
            return;
        }
        this.imgNode = new Image();
        this.imgNode.onload = ()=> {
            let imgState;
            imgState = 1;
            if (this.props.checkImgFun && !this.props.checkImgFun(this.imgNode)) {
                imgState = 2;
            }
            this.hasUnmount || this.setState({
                'img': imgState
            });
        };
        this.imgNode.onerror = ()=> {
            this.hasUnmount || this.setState({
                'img': 2
            });
        };
        this.imgNode.src = this.props.img;
    }

    lazyload(props) {
        if (this.state.img) {
            return;
        }
        if (!this.props.lazyload) {
            this.loadImg();
        } else {
            Math.abs(props.currentPage - this.props.index) <= ALLOWANCE
            || this.props.index === 1
            || this.props.index === this.props.pagesNum
                ? this.loadImg()
                : '';
        }
    }

    componentWillMount() {
        this.lazyload(this.props);
    }

    componentWillUpdate(props) {
        this.lazyload(props);
    }

    componentWillUnmount() {
        this.hasUnmount = true;
    }

    render() {
        let img = null, classList, activeClass = {};
        if (this.props.img) {
            img = this.state.img === 1
                ? <img src={this.props.img} className="img"/>
                : this.state.img === 2
                ? <img src={this.props.errorImg} className="img"/>
                : this.props.loadingEle;
        }
        activeClass[this.props.activeClass] = this.props.currentPage === this.props.index;
        if (this.props.extraClass) {
            activeClass[this.props.extraClass] = true;
        }
        classList = classnames('item', activeClass);
        return (
            <li className={classList} style={this.props.style} onTouchTap={this.handleTap}>
                {img}
            </li>
        );
    }
}

export default CarouselItem;
