/**
 * @author eva.li
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../common/page';
import Carousel from '../../../component_dev/carousel/src';
import CarouselItem from '../../../component_dev/carousel/src/carouselItem.js';
import Scroller from '../../../component_dev/scroller/src/';
import testData from './testData.js';
import './main.scss';
import '../../../component_dev/common/touchEventSimulator';
// const defaultSetting = {
// };
class Menu extends Component {

    constructor() {
        super();
        this.state = {
            pageNow: 1
        };
    }
    updateChange(pageNow) {
        this.setState({
            pageNow
        });
    }
    render() {
        return (
          <Page title="Carousel Demo" onLeftPress={()=>location.href = '../index/index.html'} extraClass={"yo-flex"}>
          {/*<Scroller simple extraClass={"flex"}>*/}
          <Carousel
              pageNow={this.state.pageNow}
              afterChange={(page)=>{
                  this.updateChange(page);
              }}
              isDrag={false}
          >
          {
            testData.map((item, index)=>{
              return (
                <CarouselItem
                    index = {index + 1}
                    key = {index + 1}
                    currentPage={this.state.pageNow}
                    {...item}
                    lazyload={true}
                    pagesNum = {testData.length}
                >
                </CarouselItem>);
            })
          }
          </Carousel>
          <h3>功能展示</h3>
            <ul className="yo-list">
              <li className="item"><a href="./control/index.html">基础用法展示</a></li>
              <li className="item"><a href="./personal/index.html">扩展以及自定义动画</a></li>
              <li className="item"><a href="./usageScenario/index.html">使用场景展示</a></li>
            </ul>
          {/*</Scroller>*/}
          </Page>
        );
    }
}

ReactDOM.render(<Menu/>, document.getElementById('content'));
