/**
 * @providesModule LayoutMixin
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var getLayout = require('./getLayout');
let fastdom = require('fastdom');
var throttle = require('lodash/throttle');


var LayoutMixin = {
    getInitialState: function () {
        this.layoutHandle = throttle(this.layoutHandle.bind(this), 100, {trailing: true});
        return {layout: {}};
    },
    unmounted: false,
    componentDidMount: function () {
        if (this.props.onLayout){
            this.layoutHandle();
        }
    },

    componentDidUpdate: function () {
        if (this.props.onLayout) {
            this.layoutHandle();
        }
    },
    componentWillUnmount: function(){
        this.unmounted = true;
    },
    layoutHandle: function () {

        if (this.props.onLayout) {
            fastdom.measure(() => {
                if (this.unmounted) {
                    return;
                }
                var domNode = ReactDOM.findDOMNode(this);
                var layout = getLayout(domNode);
                fastdom.mutate(() => {
                    var stateLayout = this.state.layout;
                    if (stateLayout.x !== layout.x || stateLayout.y !== layout.y || stateLayout.width !== layout.width || stateLayout.height !== layout.height) {
                        this.props.onLayout({nativeEvent: {layout}});
                        this.setState({layout});
                    }
                });
            });
        }
    }
};


module.exports = LayoutMixin;
