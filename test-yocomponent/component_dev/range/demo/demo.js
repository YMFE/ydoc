/**
 * Created by zongze.li on 16/7/19.
 */
import ReactDom, {render} from 'react-dom';
import React, {Component, PropTypes} from 'react';
import "../../common/tapEventPluginInit";
import RangeSlider, {Slider, Ruler} from '../src';
import RangeSliderDemo from '../demo/RangeSliderDemo'
let linkFunc = function (e) {
    console.log('newDef\n', e, this.props.dataAttrs);
}

let data;

ReactDom.render(
    <div>
        <RangeSliderDemo
            single={false}
            disable={false}
            max={300}
            min={-300}
            value={[-150, 150]}
            step={150}
        />
        <RangeSliderDemo
            single={false}
            disable={false}
            max={150}
            min={-150}
            value={[0, 150]}
            step={150}
            scale={['0￥', '100￥', '200￥', '300￥', '400￥', '不限'] }
        />
        <RangeSliderDemo
            single={false}
            disable={false}
            max={300}
            min={-300}
            value={[-150, 300]}
            step={150}
            scale={['0￥', '100￥', '200￥', '300￥', '400￥', '500￥',  '600￥','不限'] }
        />
        <RangeSliderDemo
            single={false}
            disable={false}
            max={450}
            min={-450}
            value={[-150, 450]}
            step={150}
            scale={['0￥', '100￥', '200￥', '300￥', '400￥', '500￥',  '600￥','不限'] }
        />
        <p>single slider</p>
        <RangeSliderDemo
            single={true}
            disable={false}
            max={200}
            min={-300}
            value={[-100, 200]}
            step={100}
            scale={['0￥', '100￥', '200￥', '300￥', '400￥', '500￥',  '600￥','不限'] }
        />
        <p> step === 0   -200 => 200</p>
        <RangeSliderDemo
            single={true}
            disable={false}
            max={200}
            min={-200}
            value={[-100, 200]}
            step={0}
            decimalNum={0}
        />
        <p>step === 0  decimalNum = 0  -0.2 => 0.2</p>
        <RangeSliderDemo
            single={true}
            disable={false}
            max={0.2}
            min={-0.2}
            value={[0, 0.2]}
            step={0}
            decimalNum={0}
        />
        <p> step === 0  decimalNum = 3  -0.2 => 0.2</p>
        <RangeSliderDemo
            single={true}
            disable={false}
            max={0.2}
            min={-0.2}
            value={[-0.1, 0.2]}
            step={0}
            decimalNum={3}
        />
        <p>step === 0   disable === true</p>
        <RangeSliderDemo
            single={true}
            disable={true}
            max={0.2}
            min={-0.2}
            value={[-0.1, 0.2]}
            step={0}
            decimalNum={3}
        />
        <p> 0 ≤ step ≤1</p>
        <RangeSliderDemo
            single={true}
            disable={false}
            max={1}
            min={-1}
            value={[-0.5, 0.5]}
            scale={['0￥', '0.10￥', '0.20￥', '0.30￥', '0.40￥', '不限']}
            step={0.3}
            decimalNum={0}
        />
        <RangeSliderDemo
            single={false}
            disable={false}
            max={0.2}
            min={-0.2}
            value={[-0.2, 0.2]}
            scale={['0￥', '0.10￥', '0.20￥', '0.30￥', '0.40￥', '不限']}
            step={0.1}
            decimalNum={3}
        />
        <p>disable</p>
        <RangeSliderDemo
            single={false}
            disable={true}
            max={300}
            min={-200}
            value={[-100, 100]}
            step={100}
            scale={['0￥', '100￥', '200￥', '300￥', '400￥', '500￥',  '600￥','不限'] }
        />
        <RangeSliderDemo
            single={true}
            disable={true}
            scale={['0￥', '100￥', '200￥', '300￥', '400￥', '不限'] }
            max={300}
            min={-200}
            value={[-100, 100]}
            step={100}
        />
    </div>,
    document.getElementById('content0')
);
