/**
 * 列表项组件
 */
import React, {Component, PropTypes} from 'react';
import getGesture from './gesture';

export default class extends Component {

    static childContextTypes = {
        offsetY: PropTypes.number,
        itemRef: PropTypes.object
    };

    getChildContext() {
        return {offsetY: this.props.item._translateY, itemRef: this};
    }

    static defaultProps = {
        onListItemUpdate(){
        }
    };

    /**
     * key和translateY在shouldComponentUpdate中会被使用
     * 将会根据nextProps.item中对应的值,来决定是否render
     * @param props
     */
    constructor(props) {
        super(props);
        this.key = props.item.key;
        this.translateY = props.item._translateY;
    }

    /**
     * 根据之前的key和_translateY和接收到的props.item中的对应值,决定是否render
     * 使用者定义的shouldItemUpdate可以接收到shouldComponentUpdate的结果,并返回一个新的结果
     * @param nextProps
     * @returns {Bool}
     */
    shouldComponentUpdate(nextProps) {
        const {listModel, shouldItemUpdate}=nextProps;

        let ret = true;
        //当容器内部item的key和translateY发生变化时重新render
        if (listModel.infinite &&
            this.key === nextProps.item.key &&
            this.translateY === nextProps.item._translateY) {
            ret = false;
        }

        this.key = nextProps.item.key;
        this.translateY = nextProps.item._translateY;

        if (shouldItemUpdate) {
            return shouldItemUpdate(ret, nextProps.item, this.props.item);
        }

        return ret;
    }

    /**
     * 不定高模式的无穷列表需要在列表项渲染后更新它的位置信息
     */
    updateItemHeightWhenDomRendered() {
        const {item, listModel, onListItemUpdate}=this.props;

        if (!item._resolved
            && item._translateY !== undefined
            && listModel.infinite
            && !listModel.isHeightFixed) {
            listModel.resolveItem(item.key, this.domNode.offsetHeight);
        }

        onListItemUpdate(item, this.domNode);
    }

    /**
     * 不定高的核心逻辑,在dom rendered以后更新对应列表项的定位信息,并渲染出下一个未经定位的列表项,直到填满visibleList的size
     */
    componentDidMount() {
        this.updateItemHeightWhenDomRendered();
    }

    componentDidUpdate() {
        this.updateItemHeightWhenDomRendered();
    }

    render() {
        const {
            renderItem,
            item,
            onItemTap,
            i,
            listModel,
            itemActiveClass,
            itemExtraClass,
            scroller,
            onItemTouchStart
        }=this.props;
        const transform = "translate(0," + item._translateY + "px) translateZ(0px)";
        const basicProps = {
            ref: dom=>this.domNode = dom,
            style: listModel.infinite ? {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                WebkitTransform: transform,
                transform: transform,
                height: item.height
            } : null
        };
        const additionalProps = Object.assign(
            {className: itemExtraClass.call(this, item, item._index)},
            !onItemTap ? null : getGesture(
                this,
                scroller,
                itemActiveClass,
                onItemTap,
                item,
                onItemTouchStart
            )
        );
        return (
            <li {...Object.assign({}, basicProps, additionalProps)}>
                {renderItem(item, item._index == null ? i : item._index)}
            </li>
        );
    }
}
