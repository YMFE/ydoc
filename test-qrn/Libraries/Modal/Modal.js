/**
 * @providesModule QModal
 */
'use strict';

import {
  Component,
  Animated,
  View,
  TouchableWithoutFeedback,
  PropTypes,
  Easing,
  Dimensions
} from 'react-native';
import defaultAnimation from './defaultAnimation';

const animationShape = PropTypes.shape({
  style: PropTypes.string,
  toValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  duration: PropTypes.number
});

const DEFAULT_EASING = Easing.ease;
const DEFAULT_ANIMATION = defaultAnimation;

/**
 * 模态弹层组件
 * @component Modal
 * @example ./Playground/js/Examples/ModalExample.js[1-184]
 * @version >=1.3.0
 * @description 通用的模态弹层组件,支持多种位置/动画效果
 *
 * ![Modal](./images/component-Modal.png)
 */
class Modal extends Component {

  static PropTypes = {
    /**
     * 模态层显示/隐藏属性
     *
     * @property visible
     * @type bool
     * @default false
     * @description 模态层显示/隐藏属性
     */
    visible:PropTypes.bool,
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
    * 除了使用已经实现的动画效果,你也可以自定义动画效果,这个时候应该给animation属性传入一个数组,形式为
    *
    * ```
    * [
    *    show:[
    *      {
    *        style:要绑定动画效果的css属性,必需
    *        toValue:目标值,必需
    *        duration:动画持续时间,必需
    *        easing:easing函数,默认为Easing.ease,请参考RN的Easing类
    *      },
    *      ...可以继续传入其他动画配置,这些动画会并行的执行(调用Animated.Timing)
    *    ],
    *    hide:[...和show的配置相同]
    * ]
    * ```
    *
    * 以下是fade效果的animation属性配置,可以用来参考:
    *
    * ```
    * {
    *    show:[
    *      {
    *        style:'opacity',
    *        toValue:1,
    *        duration:200
    *      }
    *    ],
    *    hide:[
    *      {
    *        style:'opacity',
    *        toValue:0,
    *        duration:200
    *      }
    *    ]
    * }
    * ```
    */
    animation: PropTypes.oneOfType([PropTypes.shape({
      show: PropTypes.arrayOf(animationShape),
      hide: PropTypes.arrayOf(animationShape)
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

  static defaultProps = {
    onShow(){
    },
    onMaskPress(){
    },
    onHide(){
    },
    animation: "none",
    visible: false,
    maskOpacity: 0.4,
    offset: 0,
    position: 'center',
    showNavBarMask: true
  };

  getInitialAnimationStateValue(visible, animation) {

    const initial = visible ? animation.show : animation.hide;

    return initial.map(animationConfig=> {

      return {
        animatedStyle: animationConfig.style,
        animationValue: new Animated.Value(animationConfig.toValue)
      }
    });
  }

  getAnimationTimingListToBeCasted(visible) {

    const animationToBeCasted = this.animation[visible ? 'show' : 'hide'];
    const longestDuration = animationToBeCasted.reduce((ret, animation)=>
        animation.duration && animation.duration > ret ? animation.duration : ret
      , 0);

    return {
      animationList: Animated.parallel(animationToBeCasted.map(animation=> {

        const stateAnimation = this.state.animationConfigs.find(config=>
          config.animatedStyle === animation.style
        );

        return Animated.timing(
          stateAnimation.animationValue,
          {
            duration: animation.duration,
            toValue: animation.toValue,
            easing: animation.easing || DEFAULT_EASING
          }
        );
      })),
      duration: longestDuration
    };
  }

  getAnimatedViewStyle() {

    if (this.animation) {

      const transformStyleNames = [
        'translateY',
        'translateX',
        'rotate',
        'perspective',
        'rotateX',
        'rotateY',
        'rotateZ',
        'scale',
        'scaleY',
        'scaleX',
        'skewX',
        'skewY'
      ];

      return this.animation ? this.state.animationConfigs.reduce((acc, config)=> {

        const styleName = config.animatedStyle,
          value = config.animationValue;

        if (transformStyleNames.indexOf(styleName) === -1) {

          acc[styleName] = value;
        }
        else {

          acc.transform.push({[styleName]: value});
        }

        return acc;
      }, {transform: []}) : null;
    }

    return null;
  }

  getAnimationConfig(animation) {

    switch (animation) {

      case 'fade':
        return DEFAULT_ANIMATION.fade;

      case 'slideFromBottom':
        return DEFAULT_ANIMATION.slideFromBottom;

      case 'slideFromTop':
        return DEFAULT_ANIMATION.slideFromTop;

      case 'slideFromLeft':
        return DEFAULT_ANIMATION.slideFromLeft;

      case 'slideFromRight':
        return DEFAULT_ANIMATION.slideFromRight;

      case "none":
        return null;

      default:
        return animation;
    }
  }

  constructor(props) {

    super(props);
    const {visible, animation}=this.props;

    this.animation = this.getAnimationConfig(animation);
    this.state = {
      visible: props.visible,
      ...animation === 'none' ? null : {
        animationConfigs: this.getInitialAnimationStateValue(visible, this.animation)
      }
    };
  }

  onShowHandler() {

    const {showNavBarMask, maskOpacity, onMaskPress}=this.props;

    if (showNavBarMask) {

      Ext.showNavigationBarMask({
        opacity: maskOpacity,
        onMaskPress
      });
    }

    this.props.onShow.call(this);
  }

  onHideHandler() {

    if (this.props.showNavBarMask) {

      Ext.hideNavigationBarMask();
    }

    this.props.onHide.call(this);
  }

  componentDidMount() {
    const { visible } = this.props;
    // 如果初始加载就是显示的，就需要直接进行遮罩
    if (visible) this.animationAndVisibleHandler(true);
  }

  componentWillReceiveProps(nextProps) {

    const visible = nextProps.visible;

    if (visible !== this.props.visible) {
      this.animationAndVisibleHandler(visible);
    }
  }

  animationAndVisibleHandler(visible) {
    if (this.animation) {

      const animationToBeCasted = this.getAnimationTimingListToBeCasted(visible);

      if (visible) {

        this.setState({visible});
        this.onShowHandler();
      }
      else {

        this.hideInterval = setTimeout(()=> {

          this.setState({visible});
          this.onHideHandler();
        }, animationToBeCasted.duration);
      }

      animationToBeCasted.animationList.start();
    }
    else {

      this.setState({visible});
      visible ? this.onShowHandler() : this.onHideHandler();
    }
  }

  componentWillUnmount() {
    // 当组件被手动移除时，需要直接进行遮罩关闭
    // TODO: 这里的问题存在于一个 QView 有多个 Modal 时
    // 由于 navBar 是单例的，这样玩儿就挂了
    this.onHideHandler();
    clearInterval(this.hideInterval);
  }

  getFlexStyles(position) {

    switch (position) {

      case 'top':
        return {
          alignItems: 'center',
          justifyContent: 'flex-start'
        };

      case 'bottom':
        return {
          alignItems: 'center',
          justifyContent: 'flex-end'
        };

      case 'left':
        return {
          alignItems: 'flex-start',
          justifyContent: 'center'
        };

      case 'right':
        return {
          alignItems: 'flex-end',
          justifyContent: 'center'
        };

      default:
        return {
          alignItems: 'center',
          justifyContent: 'center'
        };
    }
  }

  render() {

    const {visible}=this.state;
    const {maskOpacity, position, onMaskPress, offset}=this.props;
    const animatedViewStyle = this.getAnimatedViewStyle();

    return visible ? (
      <View style={styles.container}>
        <View style={[styles.contentWrap, this.getFlexStyles(position)]}>
          <TouchableWithoutFeedback onPress={onMaskPress}>
            <View style={[styles.mask, {opacity: maskOpacity}]}/>
          </TouchableWithoutFeedback>
          {this.animation ?
            <Animated.View style={[animatedViewStyle, {marginTop: offset}]}>
              {this.props.children}
            </Animated.View> :
            <View style={{marginTop: offset}}>
              {this.props.children}
            </View>}
        </View>
      </View>
    ) : null;
  };
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  contentWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mask: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  }
};

module.exports = Modal;
