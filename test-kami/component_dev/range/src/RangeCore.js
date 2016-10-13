export default class RangeCore {

    constructor(step, rangeLength = 300, single = false, rangeValueList, valueList, round = 0.25) {
        this.BothMoved = false;
        this.bothMovingDirection = 0;
        this.separated = false;
        this.refresh(step, rangeLength, single, rangeValueList, valueList, round);
    }
    /**
     * 刷新
     * @method refresh
     * @param  {Number}  step           [description]
     * @param  {Number}  rangeLength    [description]
     * @param  {Boolean} single   [description]
     * @param  {Array}   rangeValueList [description]
     * @param  {Array}   valueList      [description]
     * @param  {Number}  round   [description]
     * @description 刷新列表,应该在列表容器高度发生改变时调用
     */
    refresh(step, rangeLength, single = false, rangeValueList, valueList, round = 0.25) {
        const rangeValueLength = rangeValueList[1] - rangeValueList[0];
        this.valueStep = step;
        if (step === 0) this.valueStep = rangeValueLength / rangeLength;
        // step 为 0 表示不设置步长 ，即为translateX步长为1px（this.step = 1）的特殊情况，
        // 此时对应的Value值步长为 rangeValueLength / rangeLength
        this.step = rangeLength / (rangeValueLength / this.valueStep) || 1;
        this.maxEndTransX = rangeLength;
        this.rateXtoValue = rangeValueLength / this.maxEndTransX;
        this.rangeValueList = rangeValueList;
        this.round = round;
        this.single = single;

        const trimedValue = this.trimedValue(valueList, rangeValueList, this.valueStep);
        this.btnLeft = {
            translateX: this.mapValueToX(trimedValue[0]),
            maxTransX: single ? this.maxEndTransX : this.maxEndTransX - this.step,
            minTransX: 0,
        };
        this.btnRight = {
            translateX: this.mapValueToX(trimedValue[1]),
            maxTransX: this.maxEndTransX,
            minTransX: single ? 0 : this.step,
        };
        this.exportedIndex = {
            btnLeft: Math.round(this.btnLeft.translateX / this.step),
            btnRight: Math.round(this.btnRight.translateX / this.step),
        };
        this.exportedValues = {
            btnLeft: trimedValue[0],
            btnRight: trimedValue[1],
        };
    }

    trimedValue(value, rangeValue) {
        const [left, right] = value.map((cur, index) => cur < rangeValue[0] ? rangeValue[0] : cur > rangeValue[1] ? rangeValue[1] : cur);
        return [this.justedValue(left), this.justedValue(right)];
    }

    justedValue(value) {
        const rangeValue = this.rangeValueList,
            step = this.valueStep;
        return Math.round((value - rangeValue[0]) / step) * step + rangeValue[0];
    }

    mapValueToX(value) {
        return Math.round((value - this.rangeValueList[0]) / this.rateXtoValue);
    }

    mapXtoValue(transX) {
        return this.rateXtoValue * transX + this.rangeValueList[0];
    }

    _cutNum(num, maxValue, minValue) {
        const fixedNum = num > maxValue ? maxValue : num < minValue ? minValue : num;
        return fixedNum;
    }

    _setLeftTransX(value) {
        const slider = this.btnLeft;
        slider.translateX = this._cutNum(value, slider.maxTransX, slider.minTransX);
    }

    _setRightTransX(value) {
        const slider = this.btnRight;
        slider.translateX = this._cutNum(value, slider.maxTransX, slider.minTransX);
    }

    _setTransX(translateX, indexStr = 'btnLeft') {
        indexStr === 'btnLeft' ? this._setLeftTransX(translateX) : this._setRightTransX(translateX);
    }

    _isBothMoving() {
        return this.btnRight.translateX - this.btnLeft.translateX < this.step;
    }

    _roundIndex(index, direction, error = this.round) {
        return direction > 0 ? Math.ceil(index - error) : Math.floor(index + error);
    }

    _roundTransX(index, direction, roundIndex = this._roundIndex.bind(this)) {
        return direction > 0 ? roundIndex(index, direction) * this.step : roundIndex(index, direction) * this.step;
    }

    _getDirectionDelta(slider) {
        if (!slider.initOnce) {
            slider.lastMoveLength = slider.moveLength;
            slider.diffOfMovingX = 0;
            slider.initOnce = true;
        } else {
            const diffOfMovingX = Math.abs(slider.moveLength) - Math.abs(slider.lastMoveLength);
            if (diffOfMovingX !== 0) slider.diffOfMovingX = diffOfMovingX;

            slider.lastMoveLength = slider.moveLength;
        }
        return slider.diffOfMovingX;
    }

    _trimTranslateX(direction, indexStr = 'btnLeft') {
        if (this.step !== 0) {
            const slider = this[indexStr],
                translateX = this._roundTransX(slider.translateX / this.step, direction);
            this._setTransX(translateX, indexStr);

            if (this[indexStr].translateX > this.maxEndTransX) {
                this[indexStr].translateX = this.maxEndTransX;
            }
        }
    }

    _dealBothMoving(indexStr, gap, moveLength, direction) {
        const theOtherIndex = indexStr === 'btnLeft' ? 'btnRight' : 'btnLeft',
            slider = this[theOtherIndex];
        if (gap < this.step) {
            this.bothMoved = true;
            this.separated = false;
            let extraTransX = (this.step - gap);
            if (moveLength < 0) {
                extraTransX = -extraTransX;
            }
            slider.translateX += extraTransX;
            this.exportedIndex[theOtherIndex] = this._roundIndex(slider.translateX / this.step, direction);
            this.exportedValues[theOtherIndex] = this.mapXtoValue(slider.translateX);
            this.bothMovingDirection = direction;
        } else if (this.bothMoved === true) {
            if (!this.separated) {
                slider.direction = this.bothMovingDirection;
                this.separated = true;
            }
        }
    }

    handleTouchStart(startX, indexStr = 'btnLeft') {
        const slider = this[indexStr];
        slider.initOnce = false;
        this.bothMoved = false;
        slider.diffOfMovingX = 0;
        slider.touchLocateMoveStartX = startX;
        slider.basic = slider.translateX;

        return this;
    }

    handleTouchMove(movingX, indexStr = 'btnLeft') {
        const slider = this[indexStr];
        slider.touchLocateMove = movingX;
        slider.moveLength = slider.touchLocateMove - slider.touchLocateMoveStartX;
        const translateX = slider.basic + slider.moveLength;

        this._setTransX(translateX, indexStr);
        const gapSection = this.btnRight.translateX - this.btnLeft.translateX,
            diffOfMovingX = this._getDirectionDelta(slider),
            moveLength = slider.moveLength,
            direction = diffOfMovingX !== 0 ? diffOfMovingX * moveLength : - moveLength;
        slider.direction = direction;
        !this.single && this._dealBothMoving(indexStr, gapSection, moveLength, direction);

        this.exportedIndex[indexStr] = this._roundIndex(slider.translateX / this.step, direction);
        this.exportedValues[indexStr] = this.mapXtoValue(slider.translateX);
        return this;
    }

    handleTouchEnd(indexStr = 'btnLeft') {
        const isRight = indexStr !== 'btnLeft',
            sliderList = this.bothMoved ? ['btnLeft', 'btnRight'] : [indexStr];

        sliderList.forEach(index => {
            this._trimTranslateX(this[index].direction, index);
        });
        if (this.btnLeft.translateX === this.btnRight.translateX) {
            const theOtherIndex = isRight ? 'btnLeft' : 'btnRight';
            this[theOtherIndex].translateX += isRight ? -this.step : this.step;
        }

        sliderList.forEach(index => {
            this.exportedIndex[index] = Math.round(this[index].translateX / this.step);
            this.exportedValues[index] = this.mapXtoValue(this[index].translateX);
        });

        this.reInit();
        return this;
    }

    recoverPrevIndexStatus(indexNum, indexStr = 'btnLeft') {
        const slider = this[indexStr];
        slider.translateX = indexNum * this.step;
        this.exportedIndex[indexStr] = indexNum;
    }

    syncFromState(indexObj) {
        Object.keys(indexObj).forEach((key) => {
            this[key].translateX = indexObj[key] * this.step;
            this.exportedIndex[key] = indexObj[key];
            this.exportedValues[key] = this.mapXtoValue(this[key].translateX);
        });
    }

    reInit() {
        ['btnLeft', 'btnRight'].forEach(indexStr => {
            this[indexStr].initOnce = false;
            this[indexStr].lastMoveLength = 0;
        });
        this.bothMoved = false;
        this.separated = false;
        this.bothMovingDirection = 0;
        delete this.btnLeft.direction;
        delete this.btnRight.direction;
        return this;
    }
}
