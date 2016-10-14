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

        xList.reduce((prevX, currX)=> {
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

let currValue = {
        'btnLeft': 60,
        'btnRight': 240
    };

let minValue = 0,
    maxValue = 300,
    rangeLength = 300,
    singleSlider = true,
    valueList = [60, 240],
    selfError = 1/4,
    step = 60;
    // 它会停在60的倍数上

let _ = new RangeCore(step, rangeLength, singleSlider, [minValue, maxValue], valueList, selfError);

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

test(`定位测试：滑块会停在step(60)的整数倍数上`, t => {
    t.truthy(Utils.truely([
        [moveTo([0]), 0],
        [moveTo([60]), 60],
        [moveTo([120]), 120],
        [moveTo([180]), 180],
        [moveTo([240]), 240],
        [moveTo([300]), 300]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：请检查step的处理过程`);
})

test(`左边界测试：滑块会停在step(60)的整数倍数上：
    左边界能准确停在最小值上，并在小于最小值时强制设为最小值（此时不会滑动）`, t => {
    t.truthy(Utils.truely([
        [moveTo([60]), 60],
        [moveTo([60, 59]), 60],
        [moveTo([0, -10]), 0],
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：请检查左边界值小值是否设置错误`);
})

test(`右边界测试：滑块会停在step(60)的整数倍数上：
    右边界能准确停在最大值上，并在大于最大值时强制设为最大值（此时不会滑动）`, t => {
    t.truthy(Utils.truely([
        [moveTo([240]), 240],
        [moveTo([240, 241]), 240],
        [moveTo([300, 310]), 300]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：请检查右边界最大值是否设置错误`);
})

test(`右边单向测试：简单的向右单向手势测试：滑块会根据当前手指滑动的方向趋势,并且朝某个方向滑动了1/4个step距离时，
    在touch结束时沿该方向滑到最近的一个step刻度位置，不及1/4的step距离时会无视滑动方向而没到最近的刻度点`, t => {
    t.truthy(Utils.truely([
        [moveTo([0]), 0],
        [moveTo([0, 1]), 0],
        [moveTo([60, 70]), 60],
        [moveTo([120, 140]), 180],
        [moveTo([180, 210]), 240],
        [moveTo([240, 241]), 240],
        [moveTo([240, 255]), 240],
        [moveTo([240, 256]), 300]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：请检查与方向算子touchMoveLength * diffMovingX相关的逻辑`);
})

test(`左边单向测试：简单的向左单向手势测试：滑块会根据当前手指滑动的方向趋势，并且朝某个方向滑动了1/4个step距离时，
    在touch结束时沿该方向滑到最近的一个step刻度位置,不及1/4的step距离时会无视滑动方向而没到最近的刻度点`, t => {
    t.truthy(Utils.truely([
        [moveTo([300]), 300],
        [moveTo([300, 285]), 300],
        [moveTo([300, 284]), 240],
        [moveTo([240, 224]), 180],
        [moveTo([180, 164]), 120],
        [moveTo([120, 80]), 60],
        [moveTo([60, 45]), 60],
        [moveTo([60, 44]), 0]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：请检查与方向算子touchMoveLength * diffMovingX相关的逻辑`);
})

test(`右边扰动测试：复杂的扰动手势测试，在touchStart位置的右边扰动：无论手指如何左右滑动，
    函数能准确地判断出最后touch时刻的滑动方向趋势，以及是否在此方向上滑动了1/4个step的距离，以两者为依据，如果滑动距离小于1/4个step，则滑到最近的一个step刻度位置，否则没到该方向上的最近一个点`, t => {
    t.truthy(Utils.truely([
        [moveTo([180]), 180],
        [moveTo([180, 270, 260, 280, 250]), 240],
        [moveTo([180, 250, 249, 250, 249, 250]), 240],
        [moveTo([180, 250, 249, 250, 249, 250, 249]), 240],
        [moveTo([180, 350, 310, 350]), 300],
        [moveTo([180, 350, 310, 350, 299, 274, 275, 274]), 240],
        [moveTo([180, 350, 310, 350, 299, 274, 275, 274, 275]), 300]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：右边扰动出错，请检查与方向算子touchMoveLength * diffMovingX相关的逻辑`);
})

test(`左边扰动测试：复杂扰动测试，在touchStart位置的左边扰动：无论手指如何左右滑动，
    函数能准确地判断出最后touch时刻的滑动方向趋势，以及是否在此方向上滑动了1/4个step的距离，以两者为依据，如果滑动距离小于1/4个step，则滑到最近的一个step刻度位置，否则没到该方向上的最近一个点`, t => {
    t.truthy(Utils.truely([
        [moveTo([180]), 180],
        [moveTo([180, 70, 60, 80, 50]), 60],
        [moveTo([180, 70, 60, 80, 50, 100]), 120],
        [moveTo([180, 121, 119, 121]), 120],
        [moveTo([180, 121, 119, 121, 119]), 120],
        [moveTo([180, 50, 10, -50, -40]), 0],
        [moveTo([180, 50, 10, -50, -40, 10, 9, 15]), 0],
        [moveTo([180, 50, 10, -50, -40, 10, 9, 16]), 60]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：左边扰动出错，请检查与方向算子touchMoveLength * diffMovingX相关的逻辑`);
})

test(`两边扰动测试：复杂扰动测试，在touchStart位置的两边扰动：无论手指如何左右滑动，
    函数能准确地判断出最后touch时刻的滑动方向趋势,以及是否在此方向上滑动了1/4个step的距离，以两者为依据，如果滑动距离小于1/4个step，则滑到最近的一个step刻度位置，否则没到该方向上的最近一个点`, t => {
    t.truthy(Utils.truely([
        [moveTo([180]), 180],
        [moveTo([180, 164, 196, 194, 196]), 240],
        [moveTo([180, 164, 196, 194, 196, 194]), 180],
        [moveTo([180, 140, 170, 210, 170]), 180],
        [moveTo([180, 140, 170, 210, 170, 195]), 180],
        [moveTo([180, 140, 170, 210, 170, 196]), 240]
    ], curCmp => curCmp[0] === curCmp[1]),
    `   失败：两边扰动出错，请检查与方向算子touchMoveLength * diffMovingX相关的逻辑`);
})

