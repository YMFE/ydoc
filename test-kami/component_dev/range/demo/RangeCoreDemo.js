import RangeCore from "../src/RangeCore"

Object.assign(RangeCore.prototype, {
    log() {
        if (this.debug) {
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


(()=> {
    // return;

    let rangeLeft = 60,
        rangeRight = 300,
        rangeLength = 300,
        step = 60;
    let _ = new RangeCore(step, rangeLength, [rangeLeft, rangeRight]);

// let _ = new RangeCore(60, 300, [60, 180]);
    _
    // -------------------------------------------------------------

        .handleTouchStart(rangeLeft).handleTouchMove(rangeLeft)
        .testMoving(
            // [rangeLeft, 70, -1, 10, 61 ,59, 60, 61],
            // [rangeLeft, 120, 122],
            // [rangeLeft, 70],
            [rangeLeft, 210],
            _.handleTouchMove, 'btnLeft')
        .handleTouchEnd('btnLeft')

        .reInit()

        // -----------------------------------------------------------------

        .handleTouchStart(rangeRight, 'btnRight').handleTouchMove(rangeRight, 'btnRight')
        .testMoving(
            // [60, 70, -1, 10, 61 ,59, 60, 61],
            // [rangeRight, 190, 170],
            // [rangeRight, 190, 170, 181],
            // [rangeRight, 190, 170, 179],

            // [rangeRight, 190, 170, 181, 179, 121],
            [rangeRight, 290, 300, 301],
            // [rangeRight, 170, 179],

            _.handleTouchMove, 'btnRight')
        .handleTouchEnd('btnRight')



        // ----------------------------------------------------------------------------------------------------------------------------------

        // ._setBothRange()

        // TODO: no account of bothmove

        // .reInit()
        .test(_.btnLeft.x, _.btnRight.x)

})();

(()=> {
    return;

    let rangeLeft = 0,
        rangeRight = 300,
        rangeLength = 300,
        step = 60;
    let _ = new RangeCore(step, rangeLength, [rangeLeft, rangeRight]);

// let _ = new RangeCore(60, 300, [60, 180]);
    _
        .log('--------------------------------------------------')
        // -----------------------------------------------------------------

        .handleTouchStart(rangeRight, 'btnRight').handleTouchMove(rangeRight, 'btnRight')
        .testMoving(
            // [60, 70, -1, 10, 61 ,59, 60, 61],
            // [rangeRight, 190, 170],
            // [rangeRight, 190, 170, 181],
            // [rangeRight, 190, 170, 179],

            // [rangeRight, 190, 170, 181, 179, 121],
            [rangeRight, 70],
            // [rangeRight, 170, 179],

            _.handleTouchMove, 'btnRight')
        .handleTouchEnd('btnRight')
        // .reInit()

        // -------------------------------------------------------------

        .handleTouchStart(rangeLeft).handleTouchMove(rangeLeft)
        .testMoving(
            // [rangeLeft, 70, -1, 10, 61 ,59, 60, 61],
            // [rangeLeft, 120, 122],
            // [rangeLeft, 70],
            // [rangeLeft, 10, 1],
            // 0 60
            [rangeLeft, 10, 0, -1],
            //FIXIT: error at moveLenght == 0    0 120
            _.handleTouchMove, 'btnLeft')
        .handleTouchEnd('btnLeft')

        // .reInit()

        // -----------------------------------------------------------------

        // ._setBothRange()

        // TODO: no account of bothmove

        // .reInit()
        .test(_.btnLeft.x, _.btnRight.x)

})()


