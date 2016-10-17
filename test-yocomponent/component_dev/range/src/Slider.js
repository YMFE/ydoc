import React, { Component } from 'react';

export default class Slider extends Component {

    componentDidMount() {
        this.handleDom = this.refs.sliderbutton;
    }

    componentWillUpdate(nextProps) {
        const transX = this.props.index * this.props.step,
            sliderIndex = (this.props.name === 'btnLeft' ? 'btnLeft' : 'btnRight');

        if (this.props.disable) {
            this.setCssTransX([transX]);

            this.props.parentComponent.rangeCore.recoverPrevIndexStatus(this.props.index, sliderIndex);
            this.props.parentComponent.mapNewIndex();
        } else if (this.props.index === nextProps.index) {
            this.setCssTransX([transX]);
            this.props.parentComponent.rangeCore.recoverPrevIndexStatus(this.props.index, sliderIndex);
        }
    }

    setCssTransX(transXList, domList = [this.handleDom], single = false) {
        let curDoms = domList;
        if (single) {
            curDoms = [this.handleDom];
        }
        curDoms.forEach((dom, index) => {
            dom.style.WebkitTransform = `translateX(${transXList[index]}px)`;
            dom.style.transform = `translateX(${transXList[index]}px)`;
        });
    }

    _handleTouchStart(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.props.disable) {
            return;
        }
        const { rangeCore, name } = this.props;
        rangeCore.handleTouchStart(evt.touches[0].clientX, name === 'btnLeft' ? 'btnLeft' : 'btnRight');

        const that = this.props.parentComponent;
        that.toggleAnimationClass('remove');

        this.props.callbackOnTouchStart && this.props.callbackOnTouchStart(evt, this);
    }

    _handleTouchMove(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.props.disable) {
            return;
        }
        this.props.callbackOnTouchMove && this.props.callbackOnTouchMove(evt, this);
    }

    _handleTouchEnd(evt) {
        if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        }
        if (this.props.disable) {
            return;
        }
        const that = this.props.parentComponent;
        that.toggleAnimationClass('add');

        this.props.callbackOnTouchEnd && this.props.callbackOnTouchEnd(evt, this);
    }

    render() {
        let transX = this.props.index * this.props.step;
        if (this.props.parentComponent.rangeCore) {
            const max = this.props.parentComponent.rangeCore[this.props.name].max;
            transX = transX > max ? max : transX;
        }
        const cssObj = {
            transform: `translateX(${transX}px)`,
            WebkitTransform: `translateX(${transX}px)`
        };

        return (
            <span
                style={cssObj}
                ref="sliderbutton"
                className="thumb"
                onTouchStart={this._handleTouchStart.bind(this)}
                onTouchMove={this._handleTouchMove.bind(this)}
                onTouchEnd={this._handleTouchEnd.bind(this)}
            />
        );
    }
}
