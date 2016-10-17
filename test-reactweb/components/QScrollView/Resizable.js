var React = require('react');
var View = require('View');
var StyleSheet = require('StyleSheet')
var ReactDOM = require('ReactDOM')
var debounce = require('lodash/debounce');
var { PropTypes, Component } = React;

let fastdom = require('fastdom');


StyleSheet.inject(`

    .resize-triggers {
	    visibility: hidden;
	    opacity: 0;
	}

	.resize-triggers,
	.expand-trigger,
	.contract-trigger,
	.contract-trigger:before {
	    content: " ";
	    display: block;
	    position: absolute;
	    top: 0;
	    left: 0;
	    height: 100%;
	    width: 100%;
	    overflow: hidden;
	}



	.contract-trigger:before {
	    width: 200%;
	    height: 200%;
	}`
);



// 用于ScrollView Size改变时应用refresh函数
// 触发频率：仅当size改变时，触发onScroll函数一两次左右，所以并不是频繁触发的组件，平时scroll不会触发
class Resizable extends Component {
    static PropTypes = {
        onResize: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.r = null;
        this.lastDimensions = {
            width: 0,
            height: 0,
        };
        this.resetTriggers = debounce(this.resetTriggers.bind(this), 100, {
            trailing: true
        });

    }

    componentDidMount() {
        this.resizable = ReactDOM.findDOMNode(this.refs.resizable);
        this.contract = ReactDOM.findDOMNode(this.refs.contract);
        this.expandChild = ReactDOM.findDOMNode(this.refs.expandChild);
        this.expand = ReactDOM.findDOMNode(this.refs.expand);
        setTimeout(() => {
            this.resetTriggers();
        }, 0)

    }

    resetTriggers() {
        fastdom.measure(() => {
            var n1 = this.contract.scrollWidth,
                n2 = this.contract.scrollHeight,
                n3 = this.expand.offsetWidth + 1 + 'px',
                n4 = this.expand.offsetHeight + 1 + 'px',
                n5 = this.expand.scrollWidth,
                n6 = this.expand.scrollHeight;
            fastdom.mutate(() => {
                this.contract.scrollLeft = n1;
                this.contract.scrollTop = n2;
                this.expandChild.style.width = n3;
                this.expandChild.style.height = n4;
                this.expand.scrollLeft = n5;
                this.expand.scrollTop = n6;
            });
        });
    }

    static requestFrame(fn) {
        return requestAnimationFrame(fn);
    }

    static cancelFrame(id) {
        return cancelAnimationFrame(id);
    }

    onScroll() {
        this.resetTriggers();
        if (this.r) Resizable.cancelFrame(this.r);
        this.r = Resizable.requestFrame(function() {
            fastdom.measure(() => {
                var dimensions = this.getDimensions();
                fastdom.mutate(() => {
                    if (this.haveDimensionsChanged(dimensions)) {
                        this.lastDimensions = dimensions;
                        this.props.onResize && this.props.onResize(dimensions);
                    }
                })
            })
        }.bind(this));
    }

    getDimensions() {
        return {
            width: this.resizable.offsetWidth,
            height: this.resizable.offsetHeight
        };
    }

    haveDimensionsChanged(dimensions) {
        return dimensions.width != this.lastDimensions.width || dimensions.height != this.lastDimensions.height;
    }


    render() {
        return (
            <View {...this.props}
                ref = 'resizable'
                onScroll = {
                    this.onScroll.bind(this)
                }
            >
                {this.props.children}
            <div
                className = 'resize-triggers'
                ref = 'triggers'
            >
                <div
                    className = 'expand-trigger'
                    ref = 'expand'
                >
                    <div
                        className = 'expand-child'
                        ref = 'expandChild'>
                    </div>
                </div>
                <div
                    className='contract-trigger'
                    ref='contract'
                >
                </div>
                </div>
            </View>
        );
    }
}

module.exports = Resizable;
