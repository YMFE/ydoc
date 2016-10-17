/**
 * @providesModule Modal
 * @author qianjun.yang
 */

var ReactNative = require('react-native');
var React = require('react');
var PropTypes = React.PropTypes;
var {View, AppRegistry, TouchableWithoutFeedback, StyleSheet} = ReactNative;
var ReactDOM = require('ReactDOM');
var {utils} = AppRegistry;
var undefine,
    noop = function() {};


const MODAL = 'MODAL';

// 插入动画效果的 CSS
StyleSheet.inject(`
/*fade*/
@-webkit-keyframes fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
/*slideFromBottom*/
@-webkit-keyframes slideFromBottom {
  from {
    -webkit-transform: translate3d(0, 200%, 0);
    transform: translate3d(0, 200%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideFromBottom {
  from {
    -webkit-transform: translate3d(0, 200%, 0);
    transform: translate3d(0, 200%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
/*slideFromLeft*/
@-webkit-keyframes slideFromLeft {
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideFromLeft {
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
/*slideFromRight*/
@-webkit-keyframes slideFromRight {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideFromRight {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
/*slideFromTop*/
@-webkit-keyframes slideFromTop {
  from {
    -webkit-transform: translate3d(0, -200%, 0);
    transform: translate3d(0, -200%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideFromTop {
  from {
    -webkit-transform: translate3d(0, -200%, 0);
    transform: translate3d(0, -200%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes darken {
  from {
    background-color: rgba(0,0,0,0);
  }
}
@-webkit-keyframes darken {
  from {
    background-color: rgba(0,0,0,0);
  }
}

.rn-modal{
    animation: darken .3s linear;
    -webkit-animation: darken .3s linear;
}

.rn-modal-animated{
    -webkit-animation-duration: .3s;
    animation-duration: .3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    animation-play-state: paused;
    -webkit-animation-play-state: paused;
}`, 'ensureInject');// 禁选中框、高光



const propTypes = {
    /**
     * 模态层显示/隐藏属性
     *
     * @property visible
     * @type bool
     * @default false
     * @description 模态层显示/隐藏属性
     */
    visible: PropTypes.bool,
    /**
     * 模态层显示时的事件回调
     *
     * @property onShow
     * @type function
     * @default ()=>{}
     * @description 模态层显示时的时间回调
     */
    onShow: PropTypes.func,
    /**
     * 模态层隐藏时的事件回调
     *
     * @property onHide
     * @type function
     * @default ()=>{}
     * @description 模态层隐藏时的事件回调
     */
    onHide: PropTypes.func,
    /**
     * 点击遮罩层时的事件回调
     *
     * @property onMaskPress
     * @type function
     * @default ()=>{}
     * @description 点击遮罩层时的事件回调
     */
    onMaskPress: PropTypes.func,
    /**
     * 设置打开/关闭动画效果
     *
     * @property animation
     * @type string/array
     * @default "none"
     * @description 设置打开/关闭模态框时的动画效果。
     *
     * 已经实现的几种动画效果为:"fade","slideFromBottom","slideFromTop","slideFromLeft","slideFromRight"
     *
     * 目前暂时不支持自定义动画
     *
     */
    animation: PropTypes.oneOfType([PropTypes.shape({
        show: PropTypes.object,
        hide: PropTypes.object
    }), PropTypes.oneOf(['fade', 'none', 'slideFromBottom', 'slideFromLeft', 'slideFromRight', 'slideFromTop'])]),
    /**
     * 遮罩层透明度
     *
     * @property maskOpacity
     * @type number
     * @default 0.4
     * @description 遮罩层的透明度[0-1]
     */
    maskOpacity: PropTypes.number,
    /**
     * 模态层的偏移量
     *
     * @property offset
     * @type number
     * @default 0
     * @description 可以通过设置offset来使模态框向上/向下偏移,例如-100就可以让模态层向上偏移100个像素
     */
    offset: PropTypes.number,
    /**
     * 模态层位置
     *
     * @property position
     * @type string
     * @default center
     * @description 设置模态层显示的位置,共支持5种位置:center,top,bottom,left,right,默认为center
     */
    position: PropTypes.oneOf(['center', 'top', 'bottom', 'left', 'right']),
    /**
     * 是否遮盖导航条
     *
     * @property showNavBarMask
     * @type bool
     * @default true
     * @description 是否让遮罩层遮盖住导航条,只对Ext的导航条生效
     */
    showNavBarMask: PropTypes.bool
};


/**
 * Modal 组件
 *
 * @component Modal
 * @example ./Modal.js
 * @description 通用的模态弹层组件,支持多种位置/动画效果
 *
 * ![Modal](./images/component/Modal.gif)
 */

var Modal = React.createClass({
    propTypes: propTypes,
    getDefaultProps: function() {
        return {
            visible: false,
            onMaskPress: noop,
            position: 'center',
            animation: 'none',
            offset:0,
            maskOpacity: 0.3
        };
    },
    getInitialState: function() {
        this.gid = utils.gid();
        return {
            visible: this.props.visible
        };
    },
    render: function () {
        var gid = this.gid,
            props = this.props;
        if (props.visible === false) {
            utils.hideContainer(gid, null);
        } else {
            var animation = props.animation;
            // 不支持自定义动画
            if(typeof animation === 'object'){
                animation = 'none';
            }
            var ComponentToRender = (
                <TouchableWithoutFeedback
                    onPress={(e)=> e.target.className.indexOf('rn-modal') > -1 && props.onMaskPress()}
                >
                    <View
                        className="rn-modal"
                        style={[
                            modalStyles.base,
                            modalStyles[props.position],
                            {
                                backgroundColor: 'rgba(0,0,0,' + props.maskOpacity + ')'
                            }
                        ]}>
                        <View
                            ref={MODAL}
                            className={'rn-modal-animated'}
                            style={{
                                marginTop: props.offset,
                                animationName: animation
                            }} 
                        >
                            {props.children}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
            utils.render(ComponentToRender, gid, null, undefine, {
                onShow: () => {
                    setTimeout(()=>{
                        this._onShow();
                        props.onShow && props.onShow();
                    });
                },
                onHide: props.onHide
            });
        }
        return null;
    },
    _onShow: function() {
        var modal = ReactDOM.findDOMNode(this.refs[MODAL]),
            animation = this.props.animation;

        if(typeof animation === 'object'){
            console.warn('Modal 暂时不支持自定义动画');
        }
        if (modal) {
            if('animation' in modal.style){
                modal.style.animationPlayState = 'running';
            }else{
                modal.style.webkitAnimationPlayState = 'running';
            }
        }
    }
});



const modalStyles = StyleSheet.create({
    base:{
        flex: 1,
    },
    center:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    left:{
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    right:{
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    top:{
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    bottom:{
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
});

module.exports = Modal;
