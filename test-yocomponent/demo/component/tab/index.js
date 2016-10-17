/**
 * Created by zongze.li on 16/9/27.
 */
import ReactDom, {render} from 'react-dom';
import React, {Component, PropTypes} from 'react';
import Page from '../common/page';
import './main.scss';
import Tab, {TabLink} from '../../../component_dev/tab/src';
import Scroller from '../../../component_dev/scroller/src';
import TabDemo from './TabDemo';
import '../../../component_dev/common/touchEventSimulator';
let linkFunc = function (dataAttrs, evt){
    console.log('data', dataAttrs);
}

ReactDom.render(
    <Page title="Tab Demo">
        <Scroller
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }}
        >
            <div className="tabexample">
                <div className="demo">
                    <h3>样例0，组件使用代码样例</h3>
                    <Tab
                        theme="iconSingle"
                        part={false}
                    >
                        <TabLink
                            index="now"
                            icon={"\uF04a"}
                            text="定位"
                        />
                        <TabLink
                            onTouchTap={linkFunc}
                            icon={"\uf067"}
                            disabled={false}
                            text="搜索"
                        />
                        <TabLink
                            onTouchTap={linkFunc}
                            icon={"\uf2f7"}
                            text="订单"
                        />
                    </Tab>
                </div>
                <TabDemo
                    theme="iconCol"
                    coreAttrs={['theme']}
                    index={"一：主题-纵向混排"}
                />
                <TabDemo
                    theme="iconRow"
                    coreAttrs={['theme']}
                    index={"二：主题-横向混排"}
                />
                <TabDemo
                    theme="iconSingle"
                    coreAttrs={['theme']}
                    index={"三：主题-图标单排"}
                />
                <TabDemo
                    theme="iconNone"
                    part={false}
                    coreAttrs={['theme']}
                    index={"四：主题-文字单排"}
                />
                <TabDemo
                    theme="iconCol"
                    part={true}
                    coreAttrs={['part']}
                    index={"五：局部居中"}
                />
                <TabDemo
                    theme="iconSingle"
                    part={false}
                    tabLinks={[
                        {
                            icon: "\uf04a",
                            text: "定位",
                        }, {
                            icon: "./image/animal.png",
                            text: "搜索",
                        }, {
                            icon: "\uf2f7",
                            text: "订单",
                        }
                    ]}
                    index={"六：图标支持图片、iconfont"}
                    coreChild={[
                        { attrs: ['icon'], index: 0 },
                        { attrs: ['icon'], index: 1 }
                    ]}
                />
                <TabDemo
                    theme="iconCol"
                    part={false}
                    tabLinks={[
                        {
                            icon: "\uf04a",
                            text: "定位",
                        }, {
                            icon: "\uf067",
                            text: "搜索",
                            index: 'now',
                        }
                    ]}
                    index={"七：默认激活Tab项"}
                    coreChild={[
                        { attrs: ['index'], index: 1 }
                    ]}
                />
                <TabDemo
                    theme="iconCol"
                    part={false}
                    tabLinks={[
                        {
                            icon: "\uF04a",
                            text: "定位",
                            disabled: true,
                        }, {
                            icon: "\uf067",
                            text: "搜索",
                            disabled: true,
                        }
                    ]}
                    index={"八：禁用Tab项"}
                    coreChild={[
                        { attrs: ['disabled'], index: 0 },
                        { attrs: ['disabled'], index: 1 }
                    ]}
                />
            </div>
        </Scroller>
    </Page>, document.getElementById('content')
);
