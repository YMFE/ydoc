/**
 * Created by zongze.li on 16/9/27.
 */
import ReactDom, {render} from 'react-dom';
import React, {Component, PropTypes} from 'react';
import Page from '../../common/page';
import Scroller from '../../../../component_dev/scroller/src';
import RangeSliderDemo from '../RangeSliderDemo';
import '../main.scss';

ReactDom.render(
    <Page title="Range Demo">
        <Scroller
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }}
        >
            <div className="demopage">
                <RangeSliderDemo
                    max={500}
                    min={0}
                    value={[100, 400]}
                    step={100}
                    coreAttrs={['max', 'min', 'step']}
                    index={'一：基本用法'}
                />
                <RangeSliderDemo
                    single={true}
                    max={400}
                    min={0}
                    value={[100, 300]}
                    step={100}
                    coreAttrs={['single']}
                    index={'二：单个滑块'}
                />
                <RangeSliderDemo
                    max={400}
                    min={0}
                    value={[100, 300]}
                    step={100}
                    round={1/2}
                    coreAttrs={['round']}
                    index={'三：自定义4舍5入'}
                />
                <RangeSliderDemo
                    max={500}
                    min={0}
                    value={[100, 400]}
                    step={100}
                    scale={['0￥', '100￥', '200￥', '300￥', '400￥', '不限'] }
                    coreAttrs={['scale']}
                    index={'四：自定义标签'}
                />
                <RangeSliderDemo
                    max={500}
                    min={0}
                    value={[100, 400]}
                    step={100}
                    scalePosition={'down'}
                    coreAttrs={['scalePosition']}
                    index={'五：标签可上可下'}
                />
                <RangeSliderDemo
                    single={true}
                    max={1}
                    min={-1}
                    value={[-0.5, 0.5]}
                    step={0.25}
                    coreAttrs={['max', 'min', 'step']}
                    index={'六：支持小数'}
                />
                <RangeSliderDemo
                    single={true}
                    max={300}
                    min={-200}
                    value={[-100, 0]}
                    step={0}
                    coreAttrs={['max', 'min', 'step']}
                    index={'七：step可为0'}
                />
                <RangeSliderDemo
                    disable={true}
                    max={400}
                    min={0}
                    value={[100, 300]}
                    step={100}
                    coreAttrs={['disable']}
                    index={'八：禁用'}
                />
            </div>
        </Scroller>
    </Page>,
    document.getElementById('content')
);
