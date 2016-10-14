import React, {Component, PropTypes} from 'react';
import test from 'ava';
import { shallow, mount, render } from 'enzyme';
import Slider from '../src/Slider'
import RangeSlider from '../src';
import RangeSliderDemo from '../demo/RangeSliderDemo'

const RangeSliderWithProps = <RangeSliderDemo
    singleSlider={false}
    disabled={false}
    maxValue={300}
    minValue={-300}
    valueList={[-150, 150]}
    step={150}
    tickValues={['0￥', '100￥', '200￥', '300￥', '400￥', '500￥', '不限'] }
/>;

const Utils = {};

Utils.mapValueToIndex = (value, minValue = -300, step = 150) => Math.round((value - minValue) / step);

Utils.truely = (cmpList, cmpFunc) => cmpList.every(cmpFunc);

test(`RangingSection组件能根据indexList属性准确地设定高亮激活的区间`,
    (t, RangeDemo = RangeSliderWithProps) => {
    const $ = mount(RangeDemo);
    let valueList = [-150, 150],
        valueIndexes = [Utils.mapValueToIndex(-150), Utils.mapValueToIndex(150)],
        ticks =  $.find(".divide").nodes,
        activeIndexList;

    activeIndexList = Array.prototype.reduce.call(ticks, (acc, cur, index) =>
        cur.classList.contains('active-color') && valueIndexes.indexOf(index) !== -1
            ? cur = acc.concat(index) : cur = acc
    , []);

    t.truthy(Utils.truely(valueIndexes, (cur, index) => cur === activeIndexList[index]
        ), `   失败：RangingSection未能正确地根据indexList来高亮对应的标签（尺度、刻度、提示）`);
});

test(`RangingSection组件,在indexList属性变化，也能根据indexList属性准确地设定高亮激活的区间`,
    (t, RangeDemo = RangeSliderWithProps) => {
    const $ = mount(RangeDemo);
    let valueList = [0, 150],
        valueIndexes = [Utils.mapValueToIndex(0), Utils.mapValueToIndex(150)],
        ticks =  $.find(".divide").nodes,
        activeIndexList;

    $.setState({
        valueList: valueList
    });
    activeIndexList = Array.prototype.reduce.call(ticks, (acc, cur, index) =>
        cur.classList.contains('active-color') && valueIndexes.indexOf(index) !== -1
            ? cur = acc.concat(index) : cur = acc
    , []);

    t.truthy(Utils.truely(valueIndexes, (cur, index) => cur === activeIndexList[index]
        ), `   失败：RangingSection未能正确地根据变化后的indexList来高亮对应的标签（尺度、刻度、提示）`);
});
