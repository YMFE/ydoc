/**
 * Picker核心逻辑,负责管理Picker的内部状态
 */
import ComponentCore from '../../common/ComponentCore';
import LoopedArray from './LoopedArray';

export default class PickerCore extends ComponentCore {

    constructor(dataSource,
                value,
                loopedSize,
                containerHeight = 150,
                itemHeight = 30,
                looped) {
        super('picker');
        //static attributes
        //实际上这三个属性是常量
        this.guid = -1;
        this.itemHeight = itemHeight;
        this.selectionHeight = itemHeight;
        this.loopedSize = loopedSize;
        //mutable states
        //可以通过父组件render改变
        this.refresh(dataSource, value, containerHeight, looped);
    }

    /**
     * 初始化/重置组件的状态
     * @param dataSource
     * @param value
     * @param containerHeight
     * @param looped
     * @param manually
     */
    refresh(dataSource,
            value,
            containerHeight = this.containerHeight,
            looped,
            manually = false) {
        this.looped = looped;
        this.size = looped ? this.loopedSize : dataSource.length;
        this.dataSource = dataSource;
        this.containerHeight = containerHeight;
        this.middlePointY = (containerHeight - this.itemHeight) / 2;

        const visibleSize = Math.floor((this.containerHeight / this.itemHeight) * 1.5);
        //槽的数量,根据容器高度动态计算
        this.visibleSize = this.looped ? visibleSize : dataSource.length;
        //静态模式下option列表的上下补白,高度为半个容器高度
        this.contentPadding = this.looped ? 0 : this.middlePointY;
        //option列表的容器高度,循环模式下为数据源放大一百万倍乘以option高度(30)
        this.contentHeight = this.itemHeight * this.size + (this.looped ? 0 : 2 * this.contentPadding);
        this.thunks = new Array(this.visibleSize).fill(1);
        //根据数据源生成循环数组
        this.loopedSource = new LoopedArray(dataSource)
            .map((item, index)=>
                Object.assign({}, item, {
                    offset: this.contentPadding,
                    looped: this.looped,
                    index: index,
                    guid: ++this.guid,
                    order: index % this.visibleSize
                })
            );
        //根据value计算初始位置
        const initialPosition = this.getInitialPosition(value, dataSource, this.size, this.itemHeight);
        this.startIndex = initialPosition.index;
        this.offsetY = initialPosition.offsetY;
        this.visibleList = this.getVisibleList(this.offsetY);
        //如果不是通过构造函数调用(传入了manually参数),触发组件的更新
        if (manually) {
            this.emitEvent(
                'refresh',
                this.offsetY,
                this.visibleList,
                dataSource,
                this.containerHeight,
                this.contentHeight,
                this.thunks
            );
        }
    }

    /**
     * 设置value,在onChange之后外部组件重置value时调用
     * @param value
     * @param manually
     */
    setValue(value, manually) {
        const itemOnCurrentOffsetY = this.getScrollDestination(this.offsetY).item;
        let targetY = this.offsetY;
        let needRefresh = false;
        //根据value计算出新的y偏移
        if (value !== itemOnCurrentOffsetY.value) {
            needRefresh = true;
            this.offsetY = targetY = this.getInitialPosition(
                value,
                this.dataSource,
                this.size,
                this.itemHeight
            ).offsetY;
        }
        //触发组件更新
        if (manually) {
            this.emitEvent('resetValue', targetY, needRefresh);
        }
    }

    /**
     * 根据偏移y计算出容器内保留的option列表
     * @param offsetY
     * @param looped
     * @returns {Array}
     */
    getVisibleList(offsetY = this.offsetY, looped = this.looped) {
        this.startIndex = this.getStartIndex(offsetY);
        const endIndex = this.getEndIndex(this.startIndex);
        return this.loopedSource.slice(this.startIndex, endIndex);
    }

    /**
     * 绑定给Scroller的onScroll回调,根据y的变化更新容器内的visibleList
     * @param offsetY
     */
    onScrollTo(offsetY) {
        const prevStartIndex = this.startIndex;

        this.offsetY = offsetY;
        this.visibleList = this.getVisibleList(this.offsetY);

        if (prevStartIndex !== this.startIndex) {
            this.emitEvent('change', this.visibleList);
        }
    }

    /**
     * 绑定给Scroller的onMomentumStart事件回调
     * 这个事件在惯性滚动开始时触发,并会提供惯性滚动的目标Y
     * picker会根据这个Y找到离它最近的一个option,并调整滚动的目的地
     * @param targetY
     */
    onMomentumStart(targetY) {
        this.emitEvent('momentumStart', this.getScrollDestination(targetY).y);
    }

    /**
     * 根据y计算出距离y最近的option
     * @param y
     * @param itemHeight
     * @param selectionHeight
     * @param contentPadding
     * @param loopedSource
     * @param middlePointY
     * @returns {{y: number, item: Object}}
     */
    getScrollDestination(y,
                         itemHeight = this.itemHeight,
                         selectionHeight = this.selectionHeight,
                         contentPadding = this.contentPadding,
                         loopedSource = this.loopedSource,
                         middlePointY = this.middlePointY) {
        const absY = Math.abs(y),
            middle = middlePointY,
            selectionBarY = absY + middle - contentPadding,
            selectionMiddle = selectionBarY + selectionHeight / 2,
            nearest = Math.ceil(selectionMiddle / itemHeight) - 1;
        let targetY = nearest * itemHeight - middle + contentPadding;

        return {y: -targetY, item: loopedSource.getItem(nearest)};
    }

    /**
     * 根据value计算出初始的option
     * @param dataSource
     * @param size
     * @param itemHeight
     * @param value
     * @param looped
     * @param contentPadding
     * @param middlePointY
     * @returns {{offsetY: number, index: number}}
     */
    getInitialPosition(value = null,
                       dataSource = this.dataSource,
                       size = this.size,
                       itemHeight = this.itemHeight,
                       looped = this.looped,
                       contentPadding = this.contentPadding,
                       middlePointY = this.middlePointY) {
        const len = dataSource.length,
            proportion = Math.floor(size / len),
            valueIndex = dataSource.findIndex(item=>item.value === value),
            initialIndex = Math.floor(proportion / 2) * dataSource.length + (valueIndex !== -1 ? valueIndex : 0);

        return {
            offsetY: -(initialIndex * itemHeight - middlePointY + contentPadding),
            index: initialIndex
        };
    }

    getPositionByOpt(ele) {
        return -(ele.index * this.itemHeight - this.middlePointY + ele.offset);
    }

    /**
     * 获取visibleList的startIndex
     * @param offsetY
     * @param itemHeight
     * @param looped
     * @param visibleSize
     * @returns {number}
     */
    getStartIndex(offsetY,
                  itemHeight = this.itemHeight,
                  looped = this.looped,
                  visibleSize = this.visibleSize) {
        const startIndex = looped ? Math.ceil(-offsetY / itemHeight) - Math.floor(visibleSize / 3) : 0;
        return startIndex > 0 ? startIndex : 0;
    }

    /**
     * 根据startIndex获取visibleList的endIndex
     * @param startIndex
     * @returns {Number}
     */
    getEndIndex(startIndex) {
        return this.looped ? startIndex + this.visibleSize : this.size;
    }
}