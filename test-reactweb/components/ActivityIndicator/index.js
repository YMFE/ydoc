/*
 * @providesModule ActivityIndicator
 */

const React = require('react');
const ReactDOM = require('react-dom');
const StyleSheet = require('StyleSheet');
const View = require('View');
const { Component, PropTypes } = React;
const Spinner = require('./spin');

const propTypes = {
    /**
     * @property animating
     * @type bool
     * @description 表示是否要显示指示器，默认为true，表示显示。
     */
    animating: PropTypes.bool,
    /**
     * @property color
     * @type string
     * @description 滚轮的前景颜色（默认为灰色）。
     */
    color: PropTypes.string,
    /**
     * @property hidesWhenStopped
     * @type bool
     * @description 在没有动画的时候，是否要隐藏指示器（默认为true）。
     */
    hidesWhenStopped: PropTypes.bool,
    /**
     * @property size
     * @type enum('small', 'large')
     * @description 指示器的大小。small的高度为20，large为36。
     */
    size: PropTypes.oneOf(['small', 'large'])
};

const defaultProps = {
    animating: true,
    color: '#ccc',
    hidesWhenStopped: true,
    size: 'large'
};

/**
 * ActivityIndicator 组件
 *
 * @component ActivityIndicator
 * @example ./ActivityIndicator.js
 * @description 显示一个圆形的正在加载的指示器
 *
 * ![ActivityIndicator](./images/component/ActivityIndicator.gif)
 */

class ActivityIndicator extends Component {
    constructor() {
        super();
        this.state = {};
        this.spinMounted = false;
    }
    componentDidMount(){
        this._mountSpin();
    }
    componentDidUpdate(){
        this._mountSpin();
    }
    _mountSpin(){
        let props = this.props;
        let indicatorDOM = ReactDOM.findDOMNode(this.indicator);
        if (this.spinMounted) {
            indicatorDOM.removeChild(indicatorDOM.firstElementChild);
            this.spinMounted = false;
        }

        if (props.animating || !props.hidesWhenStopped) {
            new Spinner({
                color: props.color,
                lines: 11,
                length: 6,
                width: 3,
                radius: 6,
                corners: 1,
                speed: props.animating ? 1 : 0,
                scale: props.size === 'small' ? 0.7 : 1
            }).spin(indicatorDOM);
            this.spinMounted = true;
        }
    }
    render(){
        return (
            <View style={[styles.container, this.props.style]}>
                <View ref={ref => { this.indicator = ref; }}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        padding: 8
    }
});

ActivityIndicator.propTypes = propTypes;
ActivityIndicator.defaultProps = defaultProps;

module.exports = ActivityIndicator;
