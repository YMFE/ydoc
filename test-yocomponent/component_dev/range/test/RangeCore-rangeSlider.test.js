import test from 'ava'
import RangeCore from "../src/RangeCore"

let debug = false;

Object.assign(RangeCore.prototype, {
    log() {
        if (debug || this.debug) {
            console.log.apply(console, arguments);
        }
        return this;
    },

    test() {
        this
        // .log('btnLeft', this.btnLeft, '\nB', this.btnRight)
            .log(this)
            .log(...arguments);
        return this;
    },

    testMoving(xList, callback, sliderIndex = 'btnLeft') {
        callback = callback.bind(this);

        xList.reduce((prevX, currX) => {
            if (currX >= prevX) {
                for (let i = prevX; i <= currX; i++) {
                    callback(i, sliderIndex);
                }
            } else {
                for (let i = prevX; i >= currX; i--) {
                    callback(i, sliderIndex);
                }
            }

            return currX;
        });

        return this;
    }
});

const Utils = {};
Utils.truely = (cmpList, cmpFunc) => cmpList.every(cmpFunc);

let minValue = 0,
    maxValue = 300,
    rangeLength = 300,
    singleSlider = false,
    valueList = [60, 240],
    selfError = 1/4,
    step = 60;
    // 它会停在60的倍数上

let _ = new RangeCore(step, rangeLength, singleSlider, [minValue, maxValue], valueList, selfError),
    currValue = {
        'btnLeft': 60,
        'btnRight': 240
    };

function moveTo(valuesList, indexStr = 'btnLeft') {
    _
        .handleTouchStart(currValue[indexStr], indexStr).handleTouchMove(currValue[indexStr], indexStr)
        .testMoving(
            [currValue[indexStr]].concat(valuesList),
            _.handleTouchMove, indexStr)
        .handleTouchEnd(indexStr).reInit()
        .test(_.btnLeft.translateX, _.btnRight.translateX)

    currValue.btnLeft = _.btnLeft.translateX;
    currValue.btnRight = _.btnRight.translateX;
    return currValue[indexStr];
}

test(`边界测试：两个滑块分别具有不同的最大值、最小值`, t => {
    t.truthy(Utils.truely([
        [moveTo([-10], 'btnLeft'), 0],
        [moveTo([0], 'btnLeft'), 0],
        [moveTo([60], 'btnLeft'), 60],
        [moveTo([240], 'btnLeft'), 240],
        [moveTo([300], 'btnLeft'), 240]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：btnLeft左边滑块边界异常，请检查边界最值是否设置错误`);

     t.truthy(Utils.truely([
        [moveTo([0], 'btnRight'), 60],
        [moveTo([60], 'btnRight'), 60],
        [moveTo([240], 'btnRight'), 240],
        [moveTo([300], 'btnRight'), 300],
        [moveTo([310], 'btnLeft'), 240]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：btnRight右边滑块边界异常，请检查边界最值是否设置错误`);
})

test(`联动测试：无临时变向：滑动过程中，两滑块之间始终会保持间距不会小于step(60)，
    小于step间距会推动另一个滑块一起联动，直到滑动停止，间距大于step，或到达边界`, t => {

    t.truthy(Utils.truely([
        [moveTo([0]) + 60, moveTo([60], 'btnRight')],
        [moveTo([0, 1]) + 60, _.btnRight.translateX],
        [moveTo([60, 61]) + 60, _.btnRight.translateX],
        [moveTo([120, 121]) + 60, _.btnRight.translateX],
        [moveTo([180, 181]) + 60, _.btnRight.translateX],
        [moveTo([240, 241]) + 60, _.btnRight.translateX]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：向右推动时发生错误，请检查dealBothMove函数或者step，或者最值设置`);

    t.truthy(Utils.truely([
        [moveTo([300], 'btnRight') - 60, moveTo([240])],
        [moveTo([300, 299], 'btnRight') - 60, _.btnLeft.translateX],
        [moveTo([240, 239], 'btnRight') - 60, _.btnLeft.translateX],
        [moveTo([180, 179], 'btnRight') - 60, _.btnLeft.translateX],
        [moveTo([120, 119], 'btnRight') - 60, _.btnLeft.translateX],
        [moveTo([60, 59], 'btnRight') - 60, _.btnLeft.translateX]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：向左推动时发生错误，请检查dealBothMove函数或者step，或者最值设置`);
});

test(`联动测试：有临时变向：在bothMoving过程中，如果当前滑块临时变向，会使间距大于’最小间距step(60)‘，
    这时会只有一个滑块滑动，此时另一个滑块此前的滑动方向会被记录下来。当前滑块touch结束时，两滑块会根据各自的方向因子，并结合是否在1个step之间滑动了超过1/4的距离，以两者为依据：如果滑动距离小于1/4个step，则滑到最近的一个step刻度位置，否则没到该方向上的最近一个点`, t => {

    const init = () => moveTo([60], 'btnRight') * 0;
    // init(): 每次测试完后，将两滑块移到最左边
    // step => 60, setp * selfError => 15, 15 + 1 => 16
    t.truthy(Utils.truely([
        [init()+ moveTo([0, 60, 45]) + 60, _.btnRight.translateX],
        [init()+ moveTo([0, 60, 44]) + 120, _.btnRight.translateX],

        [init()+ moveTo([0, 120 + 15, 45]) + 120, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 15, 44]) + 180, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 15, 0, 15]) + 180, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 15, 0, 16]) + 120, _.btnRight.translateX],

        [init()+ moveTo([0, 120 + 16, 45]) + 180, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 16, 44]) + 240, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 16, 0, 15]) + 240, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 16, 0, 16]) + 180, _.btnRight.translateX],

        [init()+ moveTo([0, 120 + 16, 135]) + 120, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 16, 134, 135]) + 120, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 16, 134, 120 + 16]) + 60, _.btnRight.translateX],

        [init()+ moveTo([0, 120 + 16, 59, 240, 239]) + 60, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 16, 59, 240 -15]) + 60, _.btnRight.translateX],
        [init()+ moveTo([0, 120 + 16, 59, 240, 240 -16]) + 120, _.btnRight.translateX],

        [init()+ moveTo([0, 120 + 16, 59, 180 + 16 , 44]) + 300, _.btnRight.translateX]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：临时变向过程中出错，请检查dealBothMove函数或者step，或者最值设置`);
});

