/**
 * infinateAni
 * @description
 * 该动画适用于图片查看器情景，即图片数两较多的情况下
 *
 */
import React from 'react';
const ALLOWANCE = 20;
const AniInfinate = {
    handleData({
        pageNow,
        operationTimer,
        pagesNum
    }, children) {
        let newChildren = [];
        let locatArr = Array.of(operationTimer, operationTimer + 1, operationTimer + 2);
        if (operationTimer >= 0) {
            locatArr.sort((prev, next) => prev.key % 3 - next.key % 3);
        } else if (operationTimer === -1) {
            locatArr = [0, -1, 1];
        } else {
            locatArr.sort((prev, next) => {
                if (prev.key % 3 === 0) return -1;
                if (next.key % 3 === 0) return 1;
                return prev.key % 3 - next.key % 3;
            });
        }
        newChildren = locatArr.map((item, i) => {
            let cont;
            if (item > 0) {
                cont = item % pagesNum > 0 ? item % pagesNum - 1 : pagesNum - 1;
            } else {
                cont = item % pagesNum < 0 ? item % pagesNum + pagesNum - 1 : pagesNum - 1;
            }
            return React.cloneElement(children[cont], {
                style: {
                    transform: `translate(${(locatArr[i] - 1) * 100}%, 0)`,
                    position: 'absolute',
                    left: 0
                }
            });
        });
        newChildren.unshift(React.cloneElement(children[0], {
            key: 0,
            currentPage: pageNow,
            style: {
                visibility: 'hidden'
            }
        }));
        return newChildren;
    },
    touchstart() {},
    touchmove({
        touchmoveLocation,
        touchstartLocation,
        containerDOM,
        speed,
        operationTimer
    }) {
        const translateX = (
            (touchstartLocation[0] - touchmoveLocation[0]) / containerDOM.clientWidth
            + operationTimer) * 100;
        this._addCss({
            dom: containerDOM,
            speed,
            translateX: -translateX
        });
    },
    touchend(aniObj) {
        const {
            touchendLocation,
            touchstartLocation
        } = aniObj;
        const distanceX = touchendLocation[0] - touchstartLocation[0];
        let operat;
        if (Math.abs(distanceX) > ALLOWANCE) {
            operat = distanceX > 0 ? -1 : 1;
            aniObj.operationTimer = aniObj.operationTimer + operat;
            return this.checkAni(aniObj, operat);
        }
        return this.checkAni(aniObj, 0);
    },
    checkAni(aniObj) {
        const {
            loop,
            pagesNum,
            containerDOM,
            speed,
            operationTimer
        } = aniObj;
        if (!loop) {
            if (operationTimer < 0) aniObj.operationTimer = 0 ;
            if (operationTimer >= pagesNum) aniObj.operationTimer = pagesNum - 1;
        }
        this._addCss({ dom: containerDOM, translateX: -aniObj.operationTimer * 100, speed });
        const u = aniObj.operationTimer % pagesNum;
        return u < 0 ? u + pagesNum + 1 : u + 1;
    },
    next(aniObj) {
        return this.checkAni(aniObj, aniObj.pageNow + 1);
    },
    arrive(aniObj, num) {
        return this.checkAni(aniObj, num - 1);
    },
    prev(aniObj) {
        return this.checkAni(aniObj, aniObj.pageNow - 1);
    },
    _addCss({ dom, speed, translateX }) {
        // debugger
        dom.style.webkitTransition = `-webkit-transform ${speed}s ease-in-out`;
        dom.style.transition = `transform ${speed}s ease-in-out`;
        dom.style.webkitTransform = `translate(${translateX}%,0) translateZ(0)`;
        dom.style.transform = `translate(${translateX}%,0) translateZ(0)`;
    }
};

export default AniInfinate;
