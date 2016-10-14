import React from 'react';
const ALLOWANCE = 0.57;
const AniScrollX = {
    handleData({
        loop,
        pageNow
    }, children) {
        const newChildren = React.Children.map(children, (item, i) => React.cloneElement(item, {
            style: {
                top: 0,
                left: `${i * 100}%`,
                position: 'absolute'

            }
        }));
        if (loop) {
            const len = children.length;
            const header = React.cloneElement(children[len - 1], {
                extraClass: children[len - 1].props.extraClass ?
                    `${children[len - 1].props.extraClass} extra-item` : 'extra-item',
                key: 0,
                index: len
            });
            const footer = React.cloneElement(children[0], {
                key: -1,
                index: 1,
                style: {
                    top: 0,
                    left: `${len * 100}%`,
                    position: 'absolute'
                }
            });
            newChildren.unshift(header);
            newChildren.push(footer);
        }
        const placeholder = React.cloneElement(children[0], {
            key: -2,
            style: {
                'z-index': -1,
                visibility: 'hidden'
            }
        });
        newChildren.push(placeholder);
        return newChildren;
    },
    touchstart() {},
    touchmove({
        touchstartLocation,
        touchmoveLocation,
        pageNow,
        containerDOM
    }) {
        const width = containerDOM.clientWidth;
        const translateX = ((touchstartLocation[0] - touchmoveLocation[0]) / width +
            pageNow -
            1
        ) * 100;
        this._addCss({
            dom: containerDOM,
            speed: 0,
            translateX: -translateX,
            reset: true
        });
    },
    touchend(aniObj) {
        const {
            touchstartLocation,
            touchendLocation,
            pageNow
        } = aniObj;
        const distanceX = touchendLocation[0] - touchstartLocation[0];
        const distanceY = touchendLocation[1] - touchstartLocation[1];
        const tan = Math.abs(distanceX) / Math.abs(distanceY);
        let newpageNow = pageNow;
        if (tan > ALLOWANCE) {
            newpageNow = distanceX > 0 ? pageNow - 1 : pageNow + 1;
        }
        return this.checkAni(aniObj, newpageNow);
    },
    checkAni(aniObj, pageNow) {
        const {
            pagesNum,
            speed,
            containerDOM,
            loop,
            aniSpeed
        } = aniObj;
        if (this.moving) window.clearInterval(this.moving);
        let translateX = -100 * (pageNow - 1);
        let newpageNow = pageNow;
        if (pageNow < 1 || pageNow > pagesNum) {
            if (loop) {
                // console.log(`checkAni 延迟处理${pageNow}`);
                this.moving = window.setTimeout(() => {
                    let translate = 0;
                    if (pageNow === 0) {
                        translate = 100 * (1 - pagesNum);
                    }
                    this._addCss({
                        dom: containerDOM,
                        reset: true,
                        translateX: translate
                    });
                    this.moving = null;
                }, (speed + aniSpeed) * 1000);
                newpageNow = pageNow === 0 ? pagesNum : 1;
            } else {
                newpageNow = pageNow < 1 ? 1 : pagesNum;
                translateX = -100 * (newpageNow - 1);
            }
        }
        this._addCss({
            dom: containerDOM,
            reset: false,
            speed,
            translateX
        });
        return newpageNow;
    },
    next(aniObj) {
        const {
            pageNow
        } = aniObj;
        const pageNext = pageNow + 1;
        return this.checkAni(aniObj, pageNext);
    },
    prev(aniObj) {
        const {
            pageNow,
            containerDOM,
            speed
        } = aniObj;
        const pageNext = pageNow - 1;
        const translateX = -100 * (pageNext - 1);
        this._addCss({
            dom: containerDOM,
            speed,
            translateX
        });
        return this.checkAni(aniObj, pageNext);
    },
    arrive(aniObj, num) {
        const translateX = -(num - 1) * 100;
        this._addCss({
            dom: aniObj.containerDOM,
            speed: 0.1,
            translateX,
            reset: true
        });
        return this.checkAni(aniObj, num);
    },
    _addCss({
        dom,
        translateX = 0,
        reset
    }) {
        //此处为Dom操作
        if (reset) {
            dom.style.webkitTransition = 'none';
            dom.style.transition = 'none';
        } else {
            dom.style.webkitTransition = '';
            dom.style.transition = '';
        }
        dom.style.webkitTransform = `translate(${translateX}%, 0) translateZ(0)`;
        dom.style.transform = `translate(${translateX}%, 0) translateZ(0)`;
    }
};

export default AniScrollX;
