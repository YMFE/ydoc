import React, {Component, PropTypes} from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import Slider from '../src/Slider'
import RangeSlider from '../src';
import RangeSliderDemo from '../demo/RangeSliderDemo'
import sinon from  'sinon'

const RangeSliderWithProps = <RangeSliderDemo
    singleSlider={false}
    disabled={false}
    maxValue={300}
    minValue={-300}
    valueList={[-150, 150]}
    step={150}
    tickValues={['0￥', '100￥', '200￥', '300￥', '400￥', '500￥', '不限'] }
/>;

test(`Slider组件会在滑动的时候去掉动画类，并在touchEnd的时候加上以触发动画`,
    (t, RangeDemo = RangeSliderWithProps) => {
    const $ = mount(RangeDemo),
        $Slider =  $.find(Slider);
    $Slider.length = 1;

    let classList = $Slider.node.refs.sliderbutton.classList,
        startHasClass,
        endHasClass;
    $Slider.simulate('touchStart', {touches: [{clientX: 75}]});
    startHasClass = classList.contains('transform-animation');
    $Slider.simulate('touchEnd', {touches: [{clientX: 75}]});
    endHasClass = classList.contains('transform-animation');

    t.truthy(!startHasClass && endHasClass, `   失败：动画类名toggle过程出错，请检查toggleAnimation函数，以及动画类名是否修改过`);
});

test(`RangerSlider在setState后，其子组件Slider会调用componentWillUpdate函数作检查
    (其index属性未发生变化时，会调用recoverPrevIndexStatus函数)，这里检测
    是否调用了recoverPrevIndexStatus函数，相应的值是否正确更新`, (t, RangeDemo = RangeSliderWithProps) => {
    const $ = mount(RangeDemo),
        rangeCore = $.node.refs.rangeSlider.rangeCore,
        spy = sinon.spy(rangeCore, 'recoverPrevIndexStatus');

    // 模拟touchMove自行改变相关数据
    rangeCore.exportedValues.btnLeft = -100;
    rangeCore.btnLeft.translateX = rangeCore.mapValueToX(-100);

    $.setState({
        valueList: [-150, 150]
    });

    t.truthy(spy.called === true && rangeCore.exportedValues.btnLeft === -150 && rangeCore.btnLeft.translateX === rangeCore.mapValueToX(-150) , `   失败：未调用recoverPrevIndexStatus函数，请检查是否考虑到了这种需要自行设置css来处理的情况`);
});

