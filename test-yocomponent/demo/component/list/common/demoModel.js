/**
 * Created by Ellery1 on 16/9/6.
 */
import testData from './testdata.json';

export default class DemoModel {

    constructor(size) {
        this.sampleList = testData.data.commentList;
        this.init(size);
    }

    renderData(dataSource = this.dataSource) {
        return dataSource.map((item)=> {
            return {...item, key: item.imgUrl, imgUrl: 'http://himg1.qunarzz.com/imgs/' + item.imgUrl + 'a818.jpg'};
        });
    }

    init(size, doNotRenderSampleList) {
        this.size = size;
        this.dataSource = this.renderData(this.sampleList.slice(0, size));
        return this.dataSource.slice();
    }

    fetch(size) {
        const extendSize = this.size + size;

        if (extendSize <= this.sampleList.length) {
            this.dataSource = this.dataSource.concat(this.renderData(this.sampleList.slice(this.size, extendSize)));
            this.size = extendSize;
        }
        else {
            return {
                allLoaded: true,
                ds: this.dataSource.slice()
            }
        }

        return {
            allLoaded: false,
            ds: this.dataSource.slice()
        };
    }

    refresh() {
        this.sampleList = this.sampleList.reverse();
        this.dataSource = this.init(10);
        return this.dataSource.slice();
    }
}