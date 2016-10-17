/**
 * @author eva.li
 */
import '../../../../component_dev/common/touchEventSimulator';
import '../main.scss';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page';
import Carousel from '../../../../component_dev/carousel/src';
import Scroller from '../../../../component_dev/scroller/src';
import Number from '../../../../component_dev/number/src';
import CarouselItem from '../../../../component_dev/carousel/src/carouselItem.js';
import testData, {testData2} from '.././testData.js';
import Switch from '../../../../component_dev/switch/src';
import '../../../../component_dev/common/touchEventSimulator';
class Menu extends Component {

    constructor() {
        super();
        this.state = {
            pageNow: 1,
            testData,
            autoplay: true,
            drag: true,
            dots: true,
            loop: true,
            delay: 1,
            speed: 0.5,
            arriveNum: 1
        };
    }

    updateChange(pageNow) {
        // debugger
        this.setState({
            pageNow
        });
    }

    _renderCarousel() {
        return (
            <Carousel
                afterChange={(page) => {
                    this.updateChange(page);
                }}
                autoplay={this.state.autoplay}
                isDrag={this.state.drag}
                ref={(node) => {
                    if (node) {
                        this.carousel = node;
                    }
                }}
                delay={this.state.delay}
                dots={this.state.dots}
                loop={this.state.loop}
                speed={this.state.speed}
            >
                {
                    this.state.testData.map((item, index) => (
                        <CarouselItem
                            index={index + 1}
                            key={index + 1}
                            currentPage={this.state.pageNow}
                            {...item}
                            lazyload
                            pagesNum={testData.length}
                        />
                    ))
                }
            </Carousel>
        );
    }

    render() {
        return (
            <Page title="Carousel Demo" onLeftPress={()=>location.href="../index.html"} extraClass={"yo-flex"}>
              <Scroller simple extraClass={"flex"}>
                {this._renderCarousel()}
                <h3>受控属性</h3>
                <ul className="yo-list">
                    <li className="item">
                        <div className="mark flex">自动播放:autoplay</div>
                        <Switch
                            checked={this.state.autoplay}
                            activeColour={"#1ba9ba"}
                            onChange={(autoplay) => {
                                this.setState({
                                    autoplay
                                });
                            }}
                        />
                    </li>
                    <li className="item">
                        <div className="mark flex">循环:loop</div>
                        <Switch
                            checked={this.state.loop}
                            activeColour={"#1ba9ba"}
                            onChange={(loop) => {
                                this.setState({
                                    loop
                                });
                            }}
                        />
                    </li>
                    <li className="item">
                        <div className="mark flex">显示页数高亮:dots</div>
                        <Switch
                            checked={this.state.dots}
                            activeColour={"#1ba9ba"}
                            onChange={(dots) => {
                                this.setState({
                                    dots
                                });
                            }}
                        />
                    </li>
                    <li className="item">
                        <div className="mark flex">切换轮播内容</div>
                        <button
                            className="yo-btn yo-btn-pri"
                            onClick={() => {
                                const newData = this.state.testData === testData ? testData2 : testData;
                                this.setState({
                                    testData: newData
                                });
                                this.carousel.arrive(1);
                            }}
                        >
                            切换
                        </button>
                    </li>
                </ul>
                <h3>实例方法</h3>
                <ul className="yo-list">
                    <li className="item">
                      <div className="btn-container">
                        <button
                            className="yo-btn yo-btn-pri"
                            onClick={() => {
                                this.setState({
                                    autoplay: false
                                });
                                this.carousel.prev();
                            }}
                        >前一页:prev
                        </button>
                      </div>
                      <div className="btn-container">
                        <button
                            className="yo-btn yo-btn-pri"
                            onClick={() => {
                                this.setState({
                                    autoplay: false
                                });
                                this.carousel.next();
                            }}
                        >
                            后一页:next
                        </button>
                      </div>
                    </li>
                    <li className="item">
                        <div className="mark flex">页面跳转:arrive</div>
                          <div style={{marginRight:'15px'}}>
                            <Number
                                value={this.state.arriveNum}
                                min={1}
                                max={5}
                                onChange={(arriveNum) => {
                                    this.setState({
                                        arriveNum: +arriveNum
                                    });
                                }}
                            />
                          </div>
                        <button
                            className="yo-btn yo-btn-pri"
                            onClick={() => {
                                this.setState({
                                    autoplay: false
                                });
                                this.carousel.arrive(this.state.arriveNum);
                            }}
                        >跳转
                        </button>
                    </li>
                </ul>
              </Scroller>
            </Page>
        );
    }
}

ReactDOM.render(<Menu />, document.getElementById('content'));
