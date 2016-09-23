/*
 * @providesModule Picker
 */

var React = require('react');
var PanResponder = require('PanResponder');
var View = require('View');
var ReactDOM = require('ReactDOM');
var NativeMethodsMixin = require('NativeMethodsMixin');
var StyleSheet = require('StyleSheet');
var findIndex = require('lodash/findIndex');

const PickScroller = 'PickScroller';
const PickItem = 'PickItem';
const PickContainer = 'PickerContainer';

const PropTypes = React.PropTypes;


StyleSheet.inject(`
    .rn-picker{
        position: relative;
        overflow: hidden;
        width: 100%;
    }
    .rn-picker-scroller{
        border-width: 0;
        will-change: transform;
    }
    .rn-picker-item {
        width: 100%;
        text-align: center;
    }
    .rn-picker-mask{
        position: absolute;
        left: 0px;
        top: 0px;
        height: 100%;
        width: 100%;
        background-image: -webkit-linear-gradient(top,rgba(255, 255, 255, 0.952941), rgba(255, 255, 255, 0.6)), -webkit-linear-gradient(0deg, rgba(255, 255, 255, 0.952941), rgba(255, 255, 255, 0.6));
        background-image: linear-gradient(rgba(255, 255, 255, 0.952941), rgba(255, 255, 255, 0.6)), linear-gradient(0deg, rgba(255, 255, 255, 0.952941), rgba(255, 255, 255, 0.6));
        margin: 0px auto;
        background-repeat: no-repeat;
        background-position: left top, left bottom;
    }
    .rn-picker-window{
        width: 100%;
        position: absolute;
        left: 0px;
        top: 50%;
        z-index: 3;
        border-color: #ccc;
        border-style: solid;
        border-top-width: 1px;
        border-bottom-width: 1px;
        background-size: 100% 1px;
        background-position: top, bottom;
        background-repeat: no-repeat;
    }`
);

const styles = StyleSheet.create({
    picker: {
        height: 200,
    },
    list: {
    },
    item: {
        color: '#000',
        height: 34
    }
});

/**
 * Range 类
 *
 * @description 用来表示 Picker 的位移范围
 */
class Range{
    constructor(lowerBound = 0, upperBound = 1){
        if(this.lowerBound > this.upperBound){
            throw Error('Range.constructor: lowerBound must less than upperBound');
        }
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
    }

    /**
     * 判断一个值是否存在于 range 内
     */
    contain(n) {
        return this.lowerBound <= n && this.upperBound >= n;
    }

    /**
     * 变换一个值, 保证其在范围内
     */
    normalize(n) {
        if (this.lowerBound > n) {
            return this.lowerBound;
        } else if (this.upperBound < n) {
            return this.upperBound;
        } else {
            return n;
        }
    }
}

/**
 * Picker 组件
 *
 * @component Picker
 * @description 选择器组件, 该组件是一个受控组件,当 Picker 的值被修改后, 需要在其 onValueChange 的回调函数中修改 selectedValue 的值
 * 这样 Picker 选中的项目才会改变。否则在下一次 render 的时候时候,选中项又会回到最初的 selectedValue 对应的哪一项上。
 *
 * ![DatePicker](./images/component/DatePicker.gif)
 *
 * @example ./Picker.js
 */

var Picker = React.createClass({
    mixins: [NativeMethodsMixin],
    getDefaultProps: function(){
        return {
            style: {}
        };
    },
    propTypes: {
        /**
         * @property onValueChange
         * @type function
         * @description 当某项被选中时被调用，调用时传入以下参数：
         * - itemValue：表示选中项的值
         * - itemPosition：选中项的索引
         */
        onValueChange: PropTypes.func,
        /**
         * @property selectedValue
         * @type any
         * @description 与该值匹配的项默认会被选中
         */
        selectedValue: PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        /**
         * @property itemStyle
         * @type style
         * @description Picker 中的每一项的样式
         */
        itemStyle: View.propTypes.style
    },
    getInitialState: function(){
        let props = this.props;

        // 防止因为没有选项, 而出错
        let children = props.children || [];
        let items = children.map(el => el.props);

        // 当前选中的项目
        let selectedIndex = findIndex(items, {value:  props.selectedValue});
        selectedIndex =  selectedIndex === -1 ? 0 : selectedIndex;

        this.containerHeight = styleToNumber(this.props.style.height || styles.picker.height);
        this.itemHeight = styleToNumber((this.props.itemStyle && this.props.itemStyle.height) || styles.item.height);
        this.scrollerHeight = this.itemHeight * items.length;

        this.translateRange = new Range(0, this.scrollerHeight - this.itemHeight);
        this.translateOffset =  Math.floor((this.containerHeight - this.itemHeight) / 2);
        this.translateY = selectedIndex * this.itemHeight;

        // 在惯性滚动的时候记录终点位置
        this.targetTranslateY = 0;
        // 表示是否正在进行惯性滚动,用于在惯性滚动中触摸屏幕后打断滚动
        this.moving = false;

        this.transformKey =  'transform' in document.body.style ? 'transform' : 'webkitTransform';

        return {
            selectedIndex: selectedIndex,
            items: items
        };
    },
    componentWillMount: function(){

        this.responder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: (evt) => {
                let {pageX, pageY} = evt.nativeEvent;
                if(this.moving){
                    this.moving = false;
                }
                this.lastTouchPoint = {x: pageX, y: pageY};
            },
            onPanResponderMove: (evt) => {
                let {pageX, pageY} = evt.nativeEvent;
                // x, y 方向移动的距离
                let deltaX = this.lastTouchPoint.x - pageX,
                    deltaY =  this.lastTouchPoint.y - pageY;

                this.lastTouchPoint = {x: pageX, y: pageY};
                if(Math.abs(deltaY) > Math.abs(deltaX)){
                    let targetTranslateY = this.translateY + deltaY;
                    if(this.translateRange.contain(targetTranslateY)){
                       this.scroll(targetTranslateY);
                    }
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                let vy = gestureState.vy,
                    sign = vy > 0 ? -1 : 1,
                    targetTranslateY;

                vy = Math.abs(vy);

                if(vy > 0.2){
                    let distance = sign * this.getRotateDistance(vy);

                    targetTranslateY = this.translateY + distance;
                }else{
                    targetTranslateY = this.translateY;
                }
                // 得到 itemHeight 的整数倍的移动距离, 使得时总是不偏不倚地在适当的位置上
                targetTranslateY = Math.round(targetTranslateY / this.itemHeight) * this.itemHeight;
                this.scroll(targetTranslateY , 'animated');
            }
        });
    },
    componentDidMount: function(){
        this.scroll(this.translateY);
    },
    componentWillReceiveProps: function(props){
        let children = props.children || [];
        let items = children.map(el => el.props);
        let selectedIndex = findIndex(items, {value:  props.selectedValue});
        selectedIndex =  selectedIndex === -1 ? 0 : selectedIndex;

        this.containerHeight = styleToNumber(props.style.height || styles.picker.height);
        this.itemHeight = styleToNumber((props.itemStyle && props.itemStyle.height) || styles.item.height);
        this.scrollerHeight = this.itemHeight * items.length;

        this.translateRange = new Range(0, this.scrollerHeight - this.itemHeight);
        this.translateOffset = Math.floor((this.containerHeight - this.itemHeight) / 2);

        if(!this.moving){
            this.translateY = selectedIndex * this.itemHeight;
        }

        this.setState({
            items: items,
            selectedIndex: selectedIndex
        });
    },
    componentDidUpdate: function(){
        if(!this.moving){
            this.scroll(this.translateY);
        }
    },
    /**
     * 滚动 Picker
     *
     * @param translateY 目标位移
     * @param animated 是否需要动画
     */
    scroll: function(translateY, animated){
        if(!animated) {
            this.translateY = translateY;
            ReactDOM.findDOMNode(this.refs[PickScroller]).style[this.transformKey] = 'translateY(' + (this.translateOffset - this.translateY) + 'px)';
        }else{
            this.targetTranslateY = this.translateRange.normalize(translateY);
            // 开始惯性滚动
            this.moving = true;
            requestAnimationFrame(this.animate);
        }
    },
    /**
     * scroll 方法调用此方法实现动画效果
     */
    animate: function(){
        if(this.moving === false){
            return;
        }

        let nearlyAtTarget = Math.abs(this.translateY - this.targetTranslateY) < 0.5;

        if(nearlyAtTarget){
            this.scroll(this.translateY);
            let targetItemIndex = Math.round(this.targetTranslateY / this.itemHeight);
            this.moving = false;
            this.props.onValueChange && this.props.onValueChange(this.state.items[targetItemIndex].value, targetItemIndex);
            return;
        }
        // 一个慢慢逼近的过程, 实际效果就是缓缓减速到达目的地
        // 修改这里的参数可以改变滚动速度
        let newTranslateY =  this.translateY + (this.targetTranslateY - this.translateY) / 6;

        this.scroll(newTranslateY);

        requestAnimationFrame(this.animate);
    },
    render: function() {
        var props = this.props;
        let itemStyle = Object.assign(styles.item, props.itemStyle);
        let items = this.state.items.map((item, i) => {
            return (
                <View
                    className="rn-picker-item"
                    style={[itemStyle, {
                        lineHeight: itemStyle.height
                    }]}
                    key={'item' + i}
                    ref={PickItem + i}
                >
                    {item.label}
                </View>
            );
        });

        return (
            <View
                className="rn-picker"
                ref={PickContainer}
                style={[styles.picker, props.style]}
                {...this.responder.panHandlers}
            >
                <View
                    ref={PickScroller}
                    className="noflexbox rn-picker-scroller"
                    style={styles.list}
                >
                    {items}
                </View>
                <View
                    className="rn-picker-mask"
                    style={{
                        backgroundSize: `100% ${(this.containerHeight - this.itemHeight) / 200}rem`
                    }}
                />
                <View
                    className="rn-picker-window"
                    style={{
                        height: this.itemHeight,
                        marginTop: -this.itemHeight / 2
                    }}
                />
            </View>
        );
    },
    /**
     * 通过速度计算出惯性滚动的距离
     *
     * @param v 速度
     * @returns {number} 距离
     */
    getRotateDistance: function(v){
        let distance = 0,
            duration = 16, // 每一帧的时长 16 ms
            k = 0.9; // 减速比例
        while(v > 0.002){
            distance += v * duration;
            v = v * k;
        }
        return distance;
    }
});

function styleToNumber(v) {
    return (v + '').indexOf('rem') !== -1 ? parseFloat(v) * 100 : parseInt(v, 10);
}

Picker.Item = React.createClass({
    propTypes: {
        value: PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).required, // string or integer basically
        label: PropTypes.string.required
    },
    render: function() {
        return null;
    }
});

module.exports = Picker;
