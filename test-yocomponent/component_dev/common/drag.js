/**
 * Created by qingguo.xu on 16/9/13.
 */
/**
 * getClient 获取touch事件的相对坐标 [x, y]
 * @param evt {Event} Touch事件对象
 * @param arr {Array} 相对坐标值, TouchStart时的坐标, 默认为[0, 0]
 * @return {Array} 相对坐标 [x, y]
 */
const getClient = (evt, arr = [0, 0]) =>
    !!evt.touches[0] ? [evt.touches[0].clientX - arr[0], evt.touches[0].clientY - arr[1]] : [evt.changedTouches[0].clientX - arr[0], evt.changedTouches[0].clientY - arr[1]];

/**
 * setTransform 设置node元素的translate属性
 * @param node {Object} DOM节点
 * @param isPercent {Boolean} 是否转换成百分比
 * @param distanceX {Number} translateX值
 * @param distanceY {Number} translateY值
 */
export const setTransform = ({node, isPercent = false, distanceX = 0, distanceY = 0}) => {
    if (isPercent) {
        distanceX = distanceX * 100;
        distanceY = distanceY * 100;
        node.style.WebkitTransform = "translate(" + distanceX + "%, " + distanceY + "%) translateZ(0)";
        node.style.transform = "translate(" + distanceX + "%, " + distanceY + "%) translateZ(0)";
        return;
    }
    if (node) {
        node.style.WebkitTransform = "translate(" + distanceX + "px, " + distanceY + "px) translateZ(0)";
        node.style.transform = "translate(" + distanceX + "px, " + distanceY + "px) translateZ(0)";
    }
}

export default class {
    /**
     * Drag 构造函数
     * @param node {DOM} 拖动的DOM节点
     * @param aniClass {String} transition动画, start时去掉, end时加上
     * @param isPercent {Boolean} 是否转换成百分比
     * @param isVertical {Boolean} 是否竖向拖动
     */
    constructor({node, aniClass = '', isPercent = false, isVertical = false}) {
        this.start = [];
        this.move = 0;
        this.targetNode = node;
        this.aniClass = aniClass;
        this.isPercent = isPercent;
        this.isVertical = isVertical;
        this.draging = false; // 是否拖动
        this.hasDir = false; // 确定拖动距离是否满足方向
        this.isFirst = true; // 是否第一次运算
    }

    /**
     * getMove 获取当前的拖动距离
     * @returns {*|number}
     */
    getMove() {
        return this.move;
    }

    /**
     * setMove 重置当前的拖动距离
     * @param move {Number}
     */
    setMove(move) {
        this.move = move;
    }

    /**
     * refreshDrag 刷新Drag, 回到原点
     */
    refreshDrag() {
        this.move = 0;
        setTransform({node: this.targetNode, isPercent: this.isPercent});
    }

    /**
     * ensureDir 根据第一个TouchMove来判断拖动的距离是否满足拖动方向
     * @param evt {Object} 拖动事件对象
     */
    ensureDir(evt) {
        let [moveX, moveY] = getClient(evt, this.start);
        moveX = Math.abs(moveX);
        moveY = Math.abs(moveY);
        if (this.isVertical) {
            if (moveX > 5) {
                this.isFirst = false;
                return;
            }
            if (moveY > 2 * moveX) {
                this.hasDir = true;
                return;
            }
        }
        if (moveY > 5) {
            this.isFirst = false;
            return;
        }
        if (moveX > 2 * moveY) {
            this.hasDir = true;
            return;
        }
        return;
    }

    /**
     * dragStart 拖动开始函数处理
     * @param evt {Object} touchStart事件对象
     */
    dragStart(evt) {
        evt.preventDefault();
        this.draging = true;
        this.start = getClient(evt);
        this.targetNode.className = this.targetNode.className.replace(this.aniClass, '');
    }

    /**
     * dragMove 拖动过程事件处理
     * @param evt {Object} touchMove事件对象
     * @param middleWare {Function} 对拖动距离的进一步处理
     */
    dragMove(evt, middleWare) {
        evt.preventDefault();
        if (!this.draging) {
            return;
        }
        if (!this.hasDir) {
            if (this.isFirst) this.ensureDir(evt);
            return;
        }
        this.move = this.isVertical ? getClient(evt, this.start)[1] : getClient(evt, this.start)[0];
        if (!!middleWare) {
            this.move = middleWare(this.move);
        }
        this.isVertical ? setTransform({node: this.targetNode, isPercent: this.isPercent, distanceY: this.move})
            : setTransform({node: this.targetNode, isPercent: this.isPercent, distanceX: this.move});
    }

    /**
     * dragEnd 拖动结束时的事件处理
     * @param evt {Object} touchEnd事件处理
     * @param middleWare {Function}
     * @returns {*|number|Number}
     */
    dragEnd(evt, middleWare) {
        evt.preventDefault();
        this.isFirst = true;
        if (!this.draging || !this.hasDir) {
            return;
        }
        this.draging = false;
        this.hasDir = false;
        this.move = this.isVertical ? getClient(evt, this.start)[1] : getClient(evt, this.start)[0];
        if (this.targetNode.className.search(this.aniClass) == -1) {
            this.targetNode.className += this.aniClass;
        }
        if (!!middleWare) {
            this.move = middleWare(this.move);
            this.isVertical ? setTransform({node: this.targetNode, isPercent: this.isPercent, distanceY: this.move})
                : setTransform({node: this.targetNode, isPercent: this.isPercent, distanceX: this.move});
            return this.move;
        }
    }

    dragCancel(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.draging = false;
        this.hasDir = false;
        this.isFirst = true;
    }
}
