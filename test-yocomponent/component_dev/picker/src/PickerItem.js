/**
 * option组件
 */
import React, {Component, PropTypes} from 'react';
import '../../common/tapEventPluginInit';

export default class extends Component {

    /**
     * option组件的render触发控制的比较苛刻,同样是为了优化低端手机的滚动性能
     * @param nextProps
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps) {
        return !!(nextProps.ele.value !== this.props.ele.value
        || nextProps.ele.text !== this.props.ele.text
        || nextProps.ele.index !== this.props.ele.index
        || nextProps.notLooped);
    }

    render() {
        const {ele, itemHeight,onOptionTap}=this.props;
        const y = ele.index * itemHeight;
        const transform = "translate(0," + (y + ele.offset) + "px) translateZ(0px)";

        return (
            <li
                onTouchTap={()=>{onOptionTap(ele)}}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: transform,
                    WebkitTransform: transform,
                    height: itemHeight,
                    width: "100%",
                }}
                className="item"
            >
                {ele.text || ele.value}
            </li>
        );
    }
}
