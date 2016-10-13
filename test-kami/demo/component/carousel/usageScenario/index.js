/**
 * @author eva.li
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from '../../common/page';
import Carousel from '../../../../component_dev/carousel/src';
import Modal from '../../../../component_dev/modal/src';
import CarouselItem from '../../../../component_dev/carousel/src/carouselItem.js';
import AniInfinate from '../../../../component_dev/carousel/src/aniInfinate.js';
import testData from '.././testData.js';
import '../../../../component_dev/common/touchEventSimulator';
import '../main.scss';
class Menu extends Component {

    constructor() {
        super();
        this.state = {
            showModal: false,
            modalCarouselpage: 1,
            pageNow: 1
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
            autoplay
            isDrag
            dots={false}
            afterChange={(page) => { this.updateChange(page); }}
          >
          {
              testData.map((item, index) => (
                <CarouselItem
                  index={index + 1}
                  key={index + 1}
                  currentPage={this.state.pageNow}
                  {...item}
                  pagesNum={testData.length}
                />
                ))
          }
          </Carousel>
      );
    }
    _renderCarousel2() {
        return (
          <Carousel
            autoplay={false}
            dots={false}
            loop={false}
            aniObj={AniInfinate}
            extraClass="modal-carousel"
            afterChange={(page) => {
                this.setState({
                    modalCarouselpage: page
                });
            }}
          >
         {
            testData.map((item, index) => (
              <CarouselItem
                {...item}
                key={index + 1}
                currentPage={this.state.modalCarouselpage}
                pagesNum={testData.length}
                lazyload={false}
              />
            ))
          }
          </Carousel>);
    }
    render() {
        return (
          <Page title="Carousel Demo" onLeftPress={()=>location.href="../index.html"}>
            <h4>默认banner展示</h4>
            {this._renderCarousel()}
            <h4>图片查看器</h4>
            <ul className="yo-list">
              <li className="item">

                <button
                  className="yo-btn yo-btn-pri"
                  onTouchTap={() => {
                      this.setState({
                          showModal: true
                      });
                  }}
                >
                点击查看
                </button>
              </li>
            </ul>
            <div>
              <Modal
                align="center"
                show={this.state.showModal}
                animation="fade"
                onMaskClick={() => {
                    this.setState({
                        showModal: false
                    });
                }}
              >
              {this.state.showModal ? this._renderCarousel2() : null}
                <span>{this.state.modalCarouselpage}/{testData.length}</span>
              </Modal>
            </div>
          </Page>
        );
    }
}

ReactDOM.render(<Menu />, document.getElementById('content'));
