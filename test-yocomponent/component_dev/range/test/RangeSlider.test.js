import React, {Component, PropTypes} from 'react';
import test from 'ava';
import { shallow, mount, render } from 'enzyme';
import Slider from '../src/Slider'
import RangeSlider from '../src';
import sinon from 'sinon';
import RangeSliderDemo from '../demo/RangeSliderDemo'

const RangeSliderWithProps = <RangeSliderDemo
    singleSlider={false}
    disabled={false}
    maxValue={300}
    minValue={-300}
    valueList={[-150, 150]}
    step={150}
    tickValues={['0￥', '100￥', '200￥', '300￥', '400￥', '不限'] }
    rangeLength={300}
/>;

const SingleSliderWithProps = <RangeSliderDemo
    singleSlider={true}
    disabled={false}
    maxValue={300}
    minValue={-300}
    valueList={[-150, 150]}
    step={150}
    tickValues={['0￥', '100￥', '200￥', '300￥', '400￥', '不限'] }
    rangeLength={300}
/>;

const Utils = {};

Utils.mapValueToIndex = (value, minValue = -300, step = 150) => Math.round((value - minValue) / step);

Utils.truely = (cmpList, cmpFunc) => cmpList.every(cmpFunc);

test(`如果singleSlider为true，则只有一个滑块，反之有两个`, (t, RangeDemo = SingleSliderWithProps) => {
    const $ = mount(RangeDemo);
    t.is($.find('.thumb').length, 1, `   失败：singeSlider未生效，请检查是否更换了属性名称或者滑块css类名`);
});


test(`RangerSlider在resize属性变化时会调用fitContainerWidth函数(其内调用setState)
    来自适应容器宽度，这里检测resize属性变化后是否调用了自适应处理函数`, (t, RangeDemo = RangeSliderWithProps) => {
    const $ = mount(RangeDemo),
        rangeSlider = $.node.refs.rangeSlider,
        spy = sinon.spy(rangeSlider, 'fitContainerWidth');

    $.setState({
        resize: !$.state('resize')
    });

    t.is(spy.callCount, 1, `   失败：resize变化后，未调用fitContainerWidth函数，请检查是否重命名了函数或该属性`);
});

test(`子组件能根据父组件的valueList得到indexList(RangingSection)或者index(Slider),
    这些属性用来定位滑块，以及设置标签激活区间`, (t, RangeDemo = RangeSliderWithProps) => {
    const $ = mount(RangeDemo),
        rangeSlider = $.node.refs.rangeSlider,
        rangingSection = rangeSlider.refs.RangingSection,
        sliderLeft = rangeSlider.refs.btnLeft,
        sliderRight = rangeSlider.refs.btnRight;

    let valueList = [-300, 0],
        valueIndexes = [Utils.mapValueToIndex(-300), Utils.mapValueToIndex(0)];

    $.setState({
        valueList: valueList,
    });

    let rangingSectionIndexList = rangingSection.props.indexList,
        sliderIndexes = [sliderLeft.props.index, sliderRight.props.index];

    t.truthy(Utils.truely(rangingSectionIndexList, (cur, index) =>
            cur ===  valueIndexes[index] && cur === sliderIndexes[index]
        ), `   失败：valueList未能正确地将转换后的indexList、index传给子组件`);

});

