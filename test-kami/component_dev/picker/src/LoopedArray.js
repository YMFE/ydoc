/**
 * 循环数组类,接收一个数组,生成一个无限循环的数据结构
 * 拥有和数组相似的API
 */
import deepClone from '../../common/deepClone';

export default class LoopedArray {

    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * 获取循环数组中的第i项,通过模运算得到
     * @param index
     * @param dataSource
     * @returns {item}
     */
    getItem(index, dataSource = this.dataSource) {
        return deepClone(dataSource[index % dataSource.length]);
    }

    /**
     * 循环数组slice,返回一个数组
     * @param start
     * @param end
     * @returns {Array}
     */
    slice(start, end) {
        let ret = [];
        for (let i = start; i < end; i++) {
            ret.push(this.getItem(i));
        }
        return ret;
    }

    /**
     * 循环数组map,返回一个新的循环数组
     * 将operation引用于原有的getItem生成新循环数组的getItem
     * @param operation
     * @returns {LoopedArray}
     */
    map(operation) {
        const ret = new LoopedArray([]);
        ret.getItem = index=> operation(this.getItem(index), index);
        return ret;
    }

    /**
     * 循环数组右折叠(无法进行左折叠)
     * @param rightIndex
     * @param operation
     * @param acc
     * @returns {acc}
     */
    reduceRight(rightIndex, operation, acc) {
        if (rightIndex === 0) {
            return operation(this.getItem(0), acc);
        }
        else {
            return this.reduceRight(rightIndex - 1, operation, operation(this.getItem(rightIndex), acc));
        }
    }

    /**
     * 循环数组filter,返回一个数组
     * @param prediction
     * @returns {Array}
     */
    filter(prediction) {
        return new LoopedArray(this.dataSource.filter(prediction));
    }
}
