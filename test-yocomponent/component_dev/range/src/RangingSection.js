import React, { Component } from 'react';

export default class RangingSection extends Component {
    constructor(props) {
        super(props);
        this.scalesNum = props.scalesNum || props.scale.length;
    }

    componentDidMount() {
        this.handleDomRuler = this.refs.ruler;
        this.handleDomFloatScale = this.refs.floatScale;
    }

    componentWillUpdate(nextProps) {
        if (nextProps.moved) {
            const that = this.props.parentComponent;
            that.toggleScales({
                btnLeft: nextProps.indexList[0],
                btnRight: nextProps.indexList[1]
            });
        }
        this.scalesNum = nextProps.scalesNum || nextProps.scale.length;
    }

    render() {
        const parent = this.props.parentComponent,
            rangeLength = parent.rangeCore ? parent.rangeCore.maxEndTransX : 300;
        let valueTag = this.props.scale.map((value, index) => {
            const props = this.props,
                liCssObj = (index === 0 || index >= this.scalesNum - 1) ? null : {
                    left: `${props.step * index * 100 / rangeLength}%`,
                };
            let activeClass = index < props.indexList[0] || index > props.indexList[1] ? '' : props.activeClass;
            if (props.single) {
                activeClass = index === props.indexList[0] ? props.activeClass : '';
            }

            return index >= this.scalesNum ? '' : (
                <li
                    style={liCssObj}
                    className={`divide ${activeClass}`}
                    key={`t${index}`}
                >
                    {value}
                </li>
            );
        });
        const translateX = parent.rangeLength ? parent.rangeCore.btnLeft.translateX : 0,
            text = parent.props.value[0],
            cssObj = {
                transform: `translateX(${translateX}px)`,
                WebkitTransform: `translateX(${translateX}px)`,
                display: parent.props.step !== 0 ? 'none' : '',
            },
            floatTag = false && (<li ref="floatScale" className="float-scale hidden" style={cssObj}>{text}</li>);
            // let floatTag = false to disable the float tip, remove false will enable it

        return (
            <ul
                ref="ruler"
                className="scale"
            >
                {valueTag}{floatTag}
            </ul>
        );
    }

}
