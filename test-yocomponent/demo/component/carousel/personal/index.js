/**
 * @author eva.li
 */
import '../main.scss';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page';
import Carousel from '../../../../component_dev/carousel/src';
import CarouselItem from '../../../../component_dev/carousel/src/carouselItem.js';
import Scroller from '../../../../component_dev/scroller/src/';
import testData from '.././testData.js';
import AniInfinate from '../../../../component_dev/carousel/src/aniInfinate.js';
import PersonalItem from './personalItem.js';
import '../../../../component_dev/common/touchEventSimulator';
class Menu extends Component {

    constructor() {
        super();
        this.state = {
            carousel3pageNow: 1,
            carousel4pageNow: 1
        };
    }

    _renderCarousel1() {
        return (
            <Carousel dots={false}>
                {
                    testData.map((item, index) => (
                        <PersonalItem
                            {...item}
                            key={index + 1}
                        />
                    ))
                }
            </Carousel>
        );
    }

    _renderCarousel2() {
        return (
            <Carousel
                aniObj={AniInfinate}
                loop={false}
                autoplay={false}
            >
                {
                    testData.map((item, index) => (
                        <CarouselItem
                            index={index + 1}
                            key={index + 1}
                            currentPage={this.state.infinatePage}
                            {...item}
                            lazyload={false}
                            pagesNum={testData.length}
                        />
                    ))
                }
            </Carousel>
        );
    }

    _renderCarousel3() {
        return (
            <Carousel
                key={4}
                autoplay
                afterChange={(page) => {
                    this.setState({
                        carousel3pageNow: page
                    });
                }}
                extraClass={'yo-carousel-scale'}
            >
                {testData.map((item, index) => (
                    <CarouselItem
                        index={index + 1}
                        key={index + 1}
                        currentPage={this.state.carousel3pageNow}
                        {...item}
                        lazyload
                        extraClass={'scale'}
                        pagesNum={testData.length}
                    />
                ))}
            </Carousel>
        );
    }

    _renderCarousel4() {
        return (
            <Carousel
                key={1}
                extraClass={'yo-carousel-fade'}
                effect={'cssAni'}
                isDrag={false}
                autoplay
                afterChange={(value) => {
                    this.setState({
                        carousel4pageNow: value
                    });
                }}
            >
                {
                    testData.map((item, index) => (
                        <CarouselItem
                            index={index + 1}
                            key={index + 1}
                            currentPage={this.state.carousel4pageNow}
                            {...item}
                            lazyload
                            activeClass={'top'}
                            pagesNum={testData.length}
                        />
                    ))
                }
            </Carousel>
        );
    }

    render() {
        return (
          <Page title="Carousel Demo" onLeftPress={() => { location.href = '../index.html'; } } extraClass={"yo-flex"}>
            <Scroller simple extraClass={"flex"}>
              <h4>自定义carouselItem</h4>
              {this._renderCarousel1()}
              <h4>自定义ani</h4>
              {this._renderCarousel2()}
              <h4>滚动JS动画+自定义Css动画</h4>
              {this._renderCarousel3()}
              <h4>IndexJs动画+自定义Css动画</h4>
              {this._renderCarousel4()}
            </Scroller>
          </Page>
        );
    }
}

ReactDOM.render(<Menu />, document.getElementById('content'));
