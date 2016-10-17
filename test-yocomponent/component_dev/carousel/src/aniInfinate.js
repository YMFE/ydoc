/**
 * infinateAni
 * @description
 * 该动画适用于图片查看器情景，即图片数两较多的情况下
 *
 */
import React from 'react';
//30度的tan值
const ALLOWANCE = 0.57;
const AniInfinate = {
    handleData({
        pageNow
    }, children) {
        if (pageNow === 1) {
            // debugger
        }
        let newChildren = [];
        for (let i = pageNow - 2; i < pageNow + 1; i++) {
            //当前页面为最后一页时children[pageNow]为空
            //当为首页时children[pageNow-2]为空
            if (!children[i]) {
                continue
            }
            newChildren.push(React.cloneElement(children[i], {
                style: {
                    webkitTransform: `translate(${i * 100}%, 0) translateZ(0)`,
                    transform: `translate(${i * 100}%, 0) translateZ(0)`,
                    position: 'absolute',
                    left: 0,
                },
                // currentPage:pageNow,
            }));
        }
        //计算dom更新算法
        newChildren.sort((prev, next) => {
            if (prev.key % 3 === 0) return true;
            if (next.key % 3 === 0) return false;
            return prev.key % 3 - next.key % 3;
        });
        //用于撑起容器高度的当前元素
        newChildren.unshift(React.cloneElement(children[pageNow - 1], {
            key: 0,
            currentPage: pageNow,
            style: {
                visibility: 'hidden',
            },
        }))
        return newChildren;
    },
    touchstart() {},
    // touchend(aniObj) {
    //     const {
    //         touchstartLocation,
    //         touchendLocation,
    //         pagesNum,
    //         pageNow,
    //         loop
    //     } = aniObj;
    //     let locatinoChange = touchstartLocation[0] - touchendLocation[0],
    //         change;
    //     change = locatinoChange > 0 ? pageNow + 1 : pageNow - 1;
    //     return this._checkAni(aniObj, change);
    // },
    touchmove(aniObj) {
        const {
            touchmoveLocation,
            touchstartLocation,
            stageDOM,
            containerDOM,
            speed,
            pageNow
        } = aniObj;
        const unit = stageDOM.clientWidth;
        let change = (touchstartLocation[0] - touchmoveLocation[0]) / unit + (pageNow - 1);
        let translateX = -change * 100;
        console.log('move' + translateX);
        this._addCss({
            dom: containerDOM,
            speed,
            translateX,
            reset: true
        });
    },
    touchcancel() {},
    touchend(aniObj) {
        const {
            touchendLocation,
            touchstartLocation,
            containerDOM,
            speed,
            pageNow
        } = aniObj;
        let changeX = touchstartLocation[0] - touchendLocation[0];
        let changeY = touchendLocation[1] - touchstartLocation[1];
        const tan = Math.abs(changeX) / Math.abs(changeY);
        let change;
        if (tan < ALLOWANCE) {
            change = pageNow - 1;
        } else {
            change = changeX > 0 ? pageNow : pageNow - 2;
            if (!aniObj.loop) {
                let min = 0;
                let max = aniObj.pagesNum - 1;
                change = change < min ? min : change > max ? max : change;
            }
        }
        let translateX = -change * 100;
        this._addCss({
            dom: containerDOM,
            speed,
            translateX
        });
        return this.checkAni(aniObj, change + 1);
    },
    checkAni(aniObj, num) {
        const {
            loop,
            pagesNum,
            containerDOM,
            speed
        } = aniObj;
        if (!loop) {
            num < 1 ? num = 1 : '';
            num > pagesNum ? num = pagesNum : '';
        } else {
            num < 1 ? num = pagesNum : '';
            num > pagesNum ? num = 1 : '';
        }
        this._addCss({
            dom: containerDOM,
            reset: false,
            translateX: -(num - 1) * 100,
            speed
        });
        return num;
    },
    next(aniObj) {
        return this.checkAni(aniObj, aniObj.pageNow + 1);
    },
    arrive(aniObj, num) {
        return this.checkAni(aniObj, num);
    },
    prev(aniObj) {
        return this.checkAni(aniObj, aniObj.pageNow - 1);
    },
    _addCss({
        dom,
        speed,
        translateX,
        reset
    }) {
        if (reset) {
          dom.style.webkitTransition = 'none';
          dom.style.transition = 'none';
        } else {
          dom.style.webkitTransition = '';
          dom.style.transition = '';
            // dom.style.webkitTransition = `-webkit-transform ${speed}s ease-in-out`;
            // dom.style.transition = `transform ${speed}s ease-in-out`;
            // dom.style.transition = `transform ${speed}s ease-in-out`;
        }
        dom.style.webkitTransform = `translate(${translateX}%, 0) translateZ(0)`;
        dom.style.transform = `translate(${translateX}%, 0) translateZ(0)`;
    }
};

export default AniInfinate;
