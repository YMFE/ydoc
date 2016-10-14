/**
 * @component Range
 */
import React, { Component, PropTypes } from 'react';
import './style.scss';
import Slider from './Slider';
import RangingSection from './RangingSection';
import RangeCore from './RangeCore';

const propTypes = {
    /**
     * 单个滑块
     *
     * @property single
     * @type PropTypes.bool
     * @description 受控属性：是否只使用一个滑块
     * @default false
     */
    single: PropTypes.bool,
    /**
     * 禁用滑块
     *
     * @property disable
     * @type PropTypes.bool
     * @description 受控属性：禁止滑块滑动，不触发滑动事件
     * @default false
     */
    disable: PropTypes.bool,
    /**
     * 滑块最右边表示的值
     *
     * @property max
     * @type PropTypes.number
     * @description 受控属性：滑块滑到最右边应该表示的值
     * @default 100
     */
    max: PropTypes.number,
    /**
     * 滑块最左边表示的值
     *
     * @property min
     * @type PropTypes.number
     * @description 受控属性：滑块滑到最左边应该表示的值
     * @default 0
     */
    min: PropTypes.number,
    /**
     * 滑动步长
     *
     * @property step
     * @type PropTypes.number
     * @description 受控属性：滑块单方向滑动一次后的最小步长,注意，步长设置为0,表示不设置步长。
     * @default 25
     */
    step: PropTypes.number,
    /**
     * 滑块默认区间
     *
     * @property value
     * @type PropTypes.arrayOf(PropTypes.number)
     * @description 受控属性：滑块初始化时默认选中的区间范围
     * @default [0, 100]
     */
    value: PropTypes.arrayOf(PropTypes.number),
    /**
     * 趋势阈值
     *
     * @property round
     * @type PropTypes.number
     * @description 受控属性：滑块在当前滑动的方向上，累积滑动多大一段距离后，才判定应该到达该方向的下一个停驻点。默认为1/4的间距，也就是如果累积滑动了1/4间距后，即到达该方向上的一下个停驻点。
     * @default 1/4
     */
    round: PropTypes.number,
    /**
     * 滑块刻度标签
     *
     * @property scale
     * @type PropTypes.array
     * @description 受控属性：滑块滑到某一刻度时所展示的刻度信息, 数据驱动，如果不需要标签，请不要设置该属性，以免不需要的标签显示出来
     */
    scale: PropTypes.array,
    /**
     * 滑块刻度标签位置
     *
     * @property scale
     * @type PropTypes.oneOf(['up', 'down']),
     * @description 受控属性：滑块在轨道线的上边显示，还是下边
     * @default 'up'
     */
    scalePosition: PropTypes.oneOf(['up', 'down']),
    /**
     * 自适应屏幕
     *
     * @property resize
     * @type PropTypes.bool
     * @description 受控属性：组件外传入该属性，在componentDidUptated函数中如果检测到属性变化时，会调用自适应屏幕的函数，以适应屏幕旋转的情况，
        该属性需外部手动更改并传入。
     * @default false
     */
    resize: PropTypes.bool,
    /**
     * 支持小数
     * @skip
     * @property decimalNum
     * @type PropTypes.number
     * @description 受控属性：默认使用了Math.round来格式数据，如需展示小数，令decimalNum=x（x为非零正数）,即可取消round调用，显示X位小数点
     * @default 0
     */
    decimalNum: PropTypes.number,
    /**
     * touchStart 回调函数
     *
     * @property onSliderTouchStart
     * @type function
     * @description 触发touchStart事件后，在事件结束前进行调用的函数，该函数有2个参数，onSliderTouchStart(event, currSlider)，函数内的this代表range组件本身。
     * @param {PropTypes.object} event 事件对象
     * @param {PropTypes.object} currSlider 当前鼠标拖动的滑块组件
     * @default null
     */
    onSliderTouchStart: PropTypes.func,
    /**
     * touchMove 回调函数
     *
     * @property onTouchMove
     * @type function
     * @description 触发touchMove事件后，在事件结束前进行调用的函数，该函数有3个参数，onTouchMove(value, event, currSlider)，函数内的this代表range组件本身。
     * @param {PropTypes.array} value 为当前滑块range所映射的区间范围，注意，此值默认小数，请自行根据需要转换格式（parseInt, parseFloat, toString, toFixed(num)...），存在小数运算，故存在些许误差。
     * @param {PropTypes.object} event 事件对象
     * @param {PropTypes.object} currSlider 当前鼠标拖动的滑块组件
     * @default null
     */
    onSliderTouchMove: PropTypes.func,
    /**
     * touchEnd 回调函数
     *
     * @property onSliderTouchEnd
     * @type function
     * @description 触发touchEnd事件后，在事件结束前进行调用的函数，该函数有3个参数，onSliderTouchEnd(value, event, currSlider)，event即事件对象，函数内的this代表range组件本身。
     * @param {PropTypes.array} value 为当前滑块range所映射的区间范围，注意，此值默认小数，请自行根据需要转换格式（parseInt, parseFloat, toString, toFixed(num)...），存在小数运算，故存在些许误差。
     * @param {PropTypes.object} event 事件对象
     * @param {PropTypes.object} currSlider 当前鼠标拖动的滑块组件
     * @default null
     */
    onSliderTouchEnd: PropTypes.func,
    /**
     * onChange 回调函数
     *
     * @property onChange
     * @type function
     * @description 当滑动滑块后，滑块在停下时会通过调用上级的 onChange 回调函数，以来在上一层组件中调用 setState 来更新当前组件的状态。
     * @param {PropTypes.object} stateData 待更新的state数据
     * @default stateData => {}
     */
    onChange: PropTypes.func,
    /**
     * 组件额外类
     *
     * @property extraClass
     * @type PropTypes.string
     * @description 受控属性：扩展range组件样式所需添加的额外的类
     */
    extraClass: PropTypes.string,
};

const RangeSliderDefaultProps = {
    single: false,
    disable: false,
    max: 100,
    min: 0,
    step: 25,
    round: 0.25,
    value: [0, 100],
    scalePosition: 'up',
    // scale: [],
    decimalNum: 0,
    resize: false,

    onSliderTouchStart: null,
    onSliderTouchMove: null,
    onSliderTouchEnd: null,
    onChange: (value) => { console.log(value); },
    sliderExtraClass: '',
    scaleBarExtraClass: '',
    extraClass: '',
};

export default class RangeSlider extends Component {
    constructor(props) {
        super(props);
        this.transformAnimationClass = 'transform-animation';
        this.activeClass = 'active-color';
        this.handleDomList = [];
        this.step = props.step || (props.max - props.min) / 300;
        const { single, min, max, value, round } = props;
        this.rangeCore = new RangeCore(this.step, undefined, single, [min, max], value, round);
        this.refreshRangeSlider(props);
        this.state = {
            ...this.rangeCore.exportedIndex,
            stepX: this.stepX,
            moved: true,
            resize: props.resize,
            defaultScales: this.defaultScales,
            scaleGapNum: this.scaleGapNum,
        };
    }

    componentDidMount() {
        this.handleDomBtnLeft = this.refs.btnLeft.refs.sliderbutton || null;
        this.handleDomBtnRight = (!this.props.single
            ? this.refs.btnRight.refs.sliderbutton
            : this.handleDomBtnLeft);
        this.handleDomList = [this.handleDomBtnLeft, this.handleDomBtnRight];
        this.handleDomTrack = this.refs.track;
        this.handleDomRangingSection = this.refs.RangingSection.refs.ruler;
        this.handleDomFloatTick = this.refs.RangingSection.refs.floatTick;
        this.handleDomRangingScales = this.handleDomRangingSection.querySelectorAll('.divide');
        this.refreshBoth(this.props);
    }

    componentWillReceiveProps(nextProps) {
        const { step, single, min, max, round, resize } = this.props;
        let shouldRefreshRangeCore = false;

        if (nextProps.value !== undefined) {
            const stateData = {
                btnLeft: Math.round(this.rangeCore.mapValueToX(nextProps.value[0]) / this.stepX),
                btnRight: Math.round(this.rangeCore.mapValueToX(nextProps.value[1]) / this.stepX),
                moved: true,
            };
            this.setState(stateData);
            const { btnLeft, btnRight } = stateData;
            this.rangeCore.syncFromState({ btnLeft, btnRight });
        }

        if (nextProps.round !== round
            || nextProps.max !== max
            || nextProps.min !== min
            || nextProps.single !== single
            || nextProps.step !== step
            || nextProps.resize !== resize
            ) {
            shouldRefreshRangeCore = true;
        }
        if (shouldRefreshRangeCore) {
            this.refreshBoth(nextProps);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.resize !== this.props.resize) {
            this.toggleAnimationClass('remove');
            this.refreshBoth(this.props);
        }
        this.handleDomRangingScales = this.handleDomRangingSection.querySelectorAll('.divide');
        this.handleDomBtnRight = (!this.props.single
            ? this.refs.btnRight.refs.sliderbutton
            : this.handleDomBtnLeft);
        this.handleDomList = [this.handleDomBtnLeft, this.handleDomBtnRight];
    }

    refreshBoth(props) {
        const { single, min, max, value, round } = props;
        this.refreshRangeLength();
        this.step = props.step || (max - min) / this.rangeLength;
        this.rangeCore.refresh(this.step, this.rangeLength, single, [min, max], value, round);
        this.refreshRangeSlider(props);

        this.setState(Object.assign(
            {},
            this.state,
            this.rangeCore.exportedIndex,
            {
                stepX: this.stepX,
                defaultScales: this.defaultScales,
                scaleGapNum: this.scaleGapNum,
            }
        ));
        const { btnLeft, btnRight } = this.rangeCore.exportedValues;
        this.props.onChange({ value: [btnLeft, btnRight] });
    }

    refreshRangeLength() {
        const width = this.handleDomTrack.clientWidth,
            diam = this.handleDomBtnLeft.clientWidth,
            rangeLength = width - parseInt(diam, 10) || 300;
        this.rangeLength = rangeLength;
    }

    refreshRangeSlider(props) {
        const { max, min } = props;
        const step = props.step || (max - min) / 300;
        const scaleGapNum = parseInt((max - min) / step, 10);
        const defaultScales = new Array(scaleGapNum + 1).fill(1).map((_, index) => min + index * step);

        this.stepX = this.rangeCore.step;
        this.scaleGapNum = scaleGapNum;
        this.defaultScales = defaultScales;
    }

    toggleAnimationClass(action = 'add',
            domList = this.handleDomList,
            className = this.transformAnimationClass) {
        domList.forEach((dom) => {
            if (dom) {
                action === 'add' ? dom.classList.add(className) : dom.classList.remove(className);
            }
        });

        if (this.handleDomFloatTick) {
            const floatTickClassList = this.handleDomFloatTick.classList;
            action === 'add' ? floatTickClassList.add('hidden') : floatTickClassList.remove('hidden');
        }
    }

    mapNewIndex(isMoving = false) {
        let { btnRight, btnLeft } = this.rangeCore.exportedIndex;

        if (this.props.single) {
            btnRight = btnLeft;
        }
        if (isMoving) {
            this.toggleScales({ btnLeft, btnRight });
        }
    }

    toggleScales(indexObj) {
        const scaleGapNum = this.state.scaleGapNum,
            leftIndex = indexObj.btnLeft || 0,
            scaleList = this.handleDomRangingScales,
            activeClassName = this.activeClass;
        let rightIndex = indexObj.btnRight || scaleGapNum;
        if (this.props.single) {
            rightIndex = leftIndex;
        }

        const len = scaleList.length;
        for (let i = 0; i < len; i++) {
            if ((i >= leftIndex) && (i <= rightIndex)) {
                scaleList[i].classList.add(activeClassName);
            } else {
                scaleList[i].classList.remove(activeClassName);
            }
        }
    }

    movingFloatTick(indexStr) {
        const dom = this.handleDomFloatTick,
            transX = this.rangeCore[indexStr].translateX,
            value = this.rangeCore.exportedValues.btnLeft,
            decimalNum = this.props.decimalNum;
        if (transX !== undefined && dom) {
            dom.style.transform = `translateX(${transX}px)`;
            dom.style.WebkitTransform = `translateX(${transX}px)`;
            dom.innerText = !decimalNum ? parseInt(value, 10).toString() : value.toFixed(decimalNum);
        }
    }

    _handleTouchMove(evt, that) {
        this.rangeCore.handleTouchMove(evt.touches[0].clientX, that.props.name);

        const transXList = [
            this.rangeCore.btnLeft.translateX,
            this.rangeCore.btnRight.translateX
        ];
        that.setCssTransX(transXList, this.handleDomList, this.props.single);
        this.movingFloatTick(that.props.name);
        this.mapNewIndex(true);
        const { btnRight, btnLeft } = this.rangeCore.exportedValues;
        this.props.onSliderTouchMove && this.props.onSliderTouchMove([btnLeft, btnRight], evt, that);
    }

    _handleTouchEnd(evt, that) {
        this.toggleAnimationClass('add');
        this.rangeCore.handleTouchEnd(that.props.name);
        this.mapNewIndex();
        const values = this.rangeCore.exportedValues;
        this.props.onSliderTouchEnd && this.props.onSliderTouchEnd([values.btnLeft, values.btnRight], evt, that);
        this.props.onChange({ value: [values.btnLeft, values.btnRight] });
    }

    render() {
        const props = this.props,
            scale = this.props.scale || (this.state.scaleGapNum + 1 > 15 ? [] : this.state.defaultScales);
        const sliderRight = (
            <Slider
                ref="btnRight"
                name="btnRight"
                step={this.state.stepX}
                index={this.state.btnRight}
                disable={this.props.disable}
                single={this.props.single}
                callbackOnTouchStart={props.onSliderTouchStart !== null ? props.onSliderTouchStart.bind(this) : ''}
                callbackOnTouchMove={this._handleTouchMove.bind(this)}
                callbackOnTouchEnd={this._handleTouchEnd.bind(this)}
                parentComponent={this}
                rangeCore={this.rangeCore}
            />
        );

        const rangingSection = (
            <RangingSection
                ref="RangingSection"
                toggleScales={this.toggleScales.bind(this)}
                activeClass={this.activeClass}
                parentComponent={this}
                step={this.state.stepX}
                moved={this.state.moved}
                indexList={[this.state.btnLeft, this.state.btnRight]}
                single={this.props.single}
                scale={scale}
                scalesNum={this.state.scaleGapNum + 1}
                rangeCore={this.rangeCore}
            />
        );

        return (
            <div className={`yo-range ${this.props.extraClass} ${this.props.disable ? 'disable' : ''}`}>
                {props.scalePosition === 'up' ? rangingSection : false}
                <div className="track" ref="track">
                    <Slider
                        ref="btnLeft"
                        name="btnLeft"
                        step={this.state.stepX}
                        disable={this.props.disable}
                        index={this.state.btnLeft}
                        single={this.props.single}
                        callbackOnTouchStart={props.onSliderTouchStart !== null ? props.onSliderTouchStart.bind(this) : ''}
                        callbackOnTouchMove={this._handleTouchMove.bind(this)}
                        callbackOnTouchEnd={this._handleTouchEnd.bind(this)}
                        parentComponent={this}
                        rangeCore={this.rangeCore}
                    />
                    {!this.props.single ? sliderRight : false}
                </div>
                {props.scalePosition === 'down' ? rangingSection : false}
            </div>
        );
    }
}

RangeSlider.propTypes = propTypes;
RangeSlider.defaultProps = RangeSliderDefaultProps;
