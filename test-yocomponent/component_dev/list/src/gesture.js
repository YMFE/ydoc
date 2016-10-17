/**
 * 列表项的手势处理
 * 在滚动时不会触发列表项的active
 * 在列表项active之后发生滚动会取消active状态
 */
import deepClone from '../../common/deepClone';
const TAP_SLOP = 20;
export const TAP_DELAY = 100;
/*
 * @param endPoint
 * @param startPoint
 * @returns {number}
 * 根据个点的坐标计算出位移
 */
function getDistance(endPoint, startPoint) {
    return Math.pow(endPoint.pageX - startPoint.pageX, 2) + Math.pow(endPoint.pageY - startPoint.pageY, 2);
}

/**
 * @param endPoint
 * @param startPoint
 * @returns {boolean}
 * 根据两个点的位移判断是否应该取消Tap事件的触发
 */
function onTouchMoveShouldCancelTap(endPoint, startPoint) {
    return getDistance(endPoint, startPoint) > TAP_SLOP;
}

/**
 * @param evt
 * @returns {touch/null}
 * 获取触点
 */
function getTouchPoint(evt) {
    return evt.touches.length ? {pageX: evt.touches[0].pageX, pageY: evt.touches[0].pageY} : null;
}

/**
 * @param domNode
 * @param activeClass
 * 移除item的activeClass
 */
function removeActiveClass(domNode, activeClass) {
    if (domNode && activeClass) {
        domNode.className = domNode.className.replace(" " + activeClass, '');
    }
}

/**
 * @param scroller
 * @returns {boolean}
 * 判断组件是否在滚动
 */
function isScrolling(scroller) {
    return scroller ? scroller.isScrolling : false;
}

//touchStart的位置,是否需要放弃Tap触发,Tap周期(start,move,end)是否已经结束
let startPoint, shouldAbortTap, hasComplete;

export default function (component, scroller, activeClass, onTap, item, onItemTouchStart) {
    return {
        onTouchStart(evt){
            const domNode = component.domNode;
            //如果组件正在滚动,直接放弃Tap触发
            shouldAbortTap = isScrolling(scroller);
            startPoint = getTouchPoint(evt);
            onItemTouchStart(item, item._index, evt);
            //TAP_DELAY之后再次判断是否要触发Tap,如果这段时间内出现了大的位移,if后面的逻辑就不会执行
            setTimeout(()=> {
                const className = activeClass(item, item._index);

                if (!shouldAbortTap && className) {
                    domNode.className += " " + className;
                }
            }, TAP_DELAY);
        },
        onTouchMove(evt){
            const domNode = component.domNode;
            const currentPoint = getTouchPoint(evt);
            //根据touchmove的距离判断是否要放弃tap
            if (onTouchMoveShouldCancelTap(currentPoint, startPoint)) {
                shouldAbortTap = true;
                removeActiveClass(domNode, activeClass(item, item._index));
            }
        },
        onTouchEnd(evt){
            const target = evt.target;
            const domNode = component.domNode;
            //如果需要触发tap,在TAP_DELAY之后触发onTap回调
            if (!shouldAbortTap) {
                setTimeout(()=> {
                    onTap(target);
                    removeActiveClass(domNode, activeClass(item, item._index));
                }, TAP_DELAY);
            }
        }
    };
}
