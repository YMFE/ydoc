import React from 'react';
import { render } from 'react-dom';
import '../../common/tapEventPluginInit';
import Carousel from '../src/';
import CarouselItem from '../src/carouselItem.js';
import Modal from '../../modal/src';
import ActionSheet from '../../actionsheet/src';
import AniInfinate from '../src/aniInfinate.js';
import AniInfinate2 from '../src/aniInfinate2.js';

const dataList = [
    {
        img:'http://gma.alicdn.com/simba/img/TB14ab1KpXXXXclXFXXSutbFXXX.jpg_q50.jpg',
        onTap: ()=>{console.log('tap listener');}
    },{
        img:'http://gw.alicdn.com/tps/TB1gQjnKVXXXXXPXXXXXXXXXXXX-1125-352.jpg_q50.jpg',
        onTap: ()=>{console.log('tap listener');}
    },{
        img:'http://gw.alicdn.com/tps/TB1ZPdILpXXXXczXXXXXXXXXXXX-1125-352.jpg_q50.jpg',
        onTap: ()=>{console.log('tap listener');}
    },{
        img:'http://gw.alicdn.com/tps/i1/TB12_iHHXXXXXaCXVXXdIns_XXX-1125-352.jpg_q50.jpg',
        onTap: ()=>{console.log('tap listener');}
    },{
        img:'http://gma.alicdn.com/simba/img/TB1CWf9KpXXXXbuXpXXSutbFXXX.jpg_q50.jpg',
        onTap: ()=>{console.log('tap listener');}
    }
];

class Container extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            infinatePage:1,
            customPageNow:1,
            fadePageNow:2,
            pageNow:1
        };
    }
    model(isShow){
        this.setState({
            showModal: isShow,
        });

    }
    updateChange(page, tag){
        let obj={};
        obj[tag] = page;
        this.setState(obj);
        console.log(`${tag} has been:${page}`);
    }
    beforeChange(page, tag){
        console.log(`${tag} will be: ${page}`);
    }
    render(){
        const data = {
            autoplay: true,
            loop: true,
            dots: false
        };
        let styleList = {
            textAlign:'center',
            backgroundColor:'green',
            height:'2em',
            lineHeight:'2em',
            margin:'3em 1em',
            color: '#fff'
        };
        let fadeCarousel = (
            <Carousel
                key={1}
                {...data}
                beforeChange={(page)=>{this.beforeChange(page,'fadePageNow')}}
                afterChange={(page)=>{this.updateChange(page,'fadePageNow')}}
                extraClass= 'yo-carousel-fade'
                defaultPage={2}
                effect={'cssAni'}
                isDrag={false}
                ref={(node) =>{
                    if(node){window.carousel = node}
                }}
            >
            {
                dataList.map((item, index)=>{
                    return (
                        <CarouselItem
                            index = {index + 1}
                            key = {index + 1}
                            currentPage={this.state.fadePageNow}
                            {...item}
                            lazyload={true}
                            activeClass={'top'}
                            pagesNum = {dataList.length}
                        ></CarouselItem>);
                    })
            }
            </Carousel>
        );
        let scrollXCarousel = (
            <Carousel
                key={3}
                {...data}
                beforeChange={(page)=>{this.beforeChange(page,'pageNow')}}
                afterChange={(page)=>{this.updateChange(page,'pageNow')}}
                dots={true}
                defaultPage={2}
                autoplay={false}
                ref={(node)=>{
                  if(node){
                    window.scrollXCarousel = node;
                  }
                }}
            >
            {
                dataList.map((item, index)=>{
                    return (
                        <CarouselItem
                            index = {index + 1}
                            key = {index + 1}
                            currentPage={this.state.pageNow}
                            {...item}
                            pagesNum = {dataList.length}
                            lazyload={false}
                        ></CarouselItem>);
                    })
            }
            </Carousel>
        );
        let customCarousel = (
            <Carousel
                key={4}
                beforeChange={(page)=>{this.beforeChange(page,'customPageNow')}}
                afterChange={(page)=>{this.updateChange(page,'customPageNow')}}
                autoplay={true}
                dots={true}
                extraClass={'yo-carousel-scale'}
            >
            {
                dataList.map((item, index)=>{
                    return (
                        <CarouselItem
                            index = {index + 1}
                            key = {index + 1}
                            currentPage = {this.state.customPageNow}
                            {...item}
                            lazyload={true}
                            extraClass ={'scale'}
                            pagesNum = {dataList.length}
                        ></CarouselItem>
                    )
                })
            }
            </Carousel>
        );

        let infinateCarousel = (
            <Carousel
                key={5}
                beforeChange={(page)=>{this.beforeChange(page,'infinatePage')}}
                afterChange={(page)=>{this.updateChange(page,'infinatePage')}}
                dots={true}
                aniObj={AniInfinate}
                autoplay={false}
                loop={false}
                defaultPage={this.state.infinatePage}
            >
            {
                dataList.map((item, index)=>{
                    return (
                        <CarouselItem
                            index = {index + 1}
                            key = {index + 1}
                            currentPage = {this.state.infinatePage}
                            {...item}
                            lazyload={false}
                            extraClass ={'scale'}
                            pagesNum = {dataList.length}
                        ></CarouselItem>
                    )
                })
            }
            </Carousel>
        );
        const verticalCarousel = (
            <Carousel
                key={6}
                beforeChange={(page)=>{this.beforeChange(page,'pageNow')}}
                afterChange={(page)=>{this.updateChange(page,'pageNow')}}
                dots={true}
                autoplay={true}
                isVertical={true}
            >
            {
                dataList.map((item, index)=>{
                    return (
                        <CarouselItem
                            index = {index + 1}
                            key = {index + 1}
                            currentPage={this.state.pageNow}
                            {...item}
                            pagesNum = {dataList.length}
                            lazyload={false}
                        ></CarouselItem>);
                    })
            }
            </Carousel>
        );
        return (
            <div>
                <h2>normal Item</h2>
                {scrollXCarousel}
                <h2>customized Item</h2>
                {customCarousel}
                <h2>custom fade Item</h2>
                {fadeCarousel}
                <h2>vertical Item</h2>
                {verticalCarousel}
                <h2>modal Item</h2>
                <div id="model" style={styleList} onTouchTap={()=>{this.model(true)}}>model</div>
                    <div>
                        <Modal
                            align="center"
                            show={this.state.showModal}
                            animation = "fade"
                            onMaskClick = {()=>{this.model(false)}}
                        >
                        {this.state.showModal ? infinateCarousel: null}
                        <span>{this.state.infinatePage}/{dataList.length}</span>
                        </Modal>
                    </div>

            </div>
        );
    }
}
render(
    <Container />,
    document.getElementById('target')
);
