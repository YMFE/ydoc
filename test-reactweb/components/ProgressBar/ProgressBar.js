/*!
 * @providesModule ProgressBar
 */

 /**
  * @component ProgressBar
  * @version >=1.4.0
  * @example ./ProgressBar.js[1-120]
  * @description ProgressBar是React Native ProgressBarAndroid样式的web实现，和ProgressView相比，ProgressBar提供了安卓下的圆形进度条和垂直进度条。
  *
  * 不过，还是**提倡优先使用**ProgressView和Loading和QLoading，ProgressBar更多的是为了更方便的一键转换RN项目提供的接口。
  *
  * ![ProgressBar](./images/component/ProgressBar.gif)
  *
  */

'use strict';

import React,{Component} from 'react';
import View from 'View';
import StyleSheet from 'StyleSheet';
import {UIManager} from 'NativeModules';
import ColorPropType from 'ColorPropType';

const STYLE_ATTRIBUTES = [
  'Horizontal',
  'Normal',
  'Small',
  'Large',
  'Inverse',
  'SmallInverse',
  'LargeInverse',
];

const PROGESS_WIDTH = {
  Horizontal:null,
  Normal:40,
  Small:10,
  Large:60,
  Inverse:40,
  SmallInverse:10,
  LargeInverse:60,
}

const CIRCLE_COLOR = '#D1D3D7';

const styles = StyleSheet.create({
  circleProgress:{
    transformOrigin:'center center',
    transform:[{rotate:'-90deg'}],
  },
  horiProgress:{
    height:10,
    position:'relative',
  },
  horiTrack:{
      position:'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
      backgroundColor:CIRCLE_COLOR,
  },
  horiBar:{
    position:'absolute',
    top:0,
    bottom:0,
    left:0,
  }
})

const rAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };


class ProgressBar extends Component{
  constructor(props){
    super(props);
    this.state = {
      progress : this.props.progress,
    }
    this.init(props);
  }

  componentDidMount(){
    this.measureHoriProgressBar();
  }

  componentWillReceiveProps(nextProps){
    this.init(nextProps);
    this.setState({progress:nextProps.progress});
    this.measureHoriProgressBar();
  }

  init(props){
      this.indeterminate = props.styleAttr === 'Horizontal' ? false : props.indeterminate;
      this.horiWidth = this.horiWidth || 0;
      this.inverse = props.styleAttr.indexOf('Inverse') !== -1 ? -1 : 1;
      if(this.indeterminate){
          this.updateProgress();
      }
  }

  updateProgress(){
      // 在indeterminate的情况下，progress的含义略有不同，圆环先由0.2增长为0.8保持不变再慢慢减为0.2，所以Progress的取值为【0，2】为一周期，因为在0-0.2中，圆环长度为0.2，0.2-0.8圆环增长，0.8-1.2中，圆环长度Wie0.8，1.2-2中圆环减小，所以旋转角度相同的情况下,视觉速度上：圆环增长>圆环不变>圆环减小 ，所以prgress的增长量根据区间而不同。
      let progress =  this.state.progress >= 2 ? this.state.progress - 2 : this.state.progress;
      let progressAbs = 1 - Math.abs(this.state.progress - 1);

      switch(true){
        case (progressAbs <= 0.2 || progressAbs >= 0.8):
            progress += 0.006;
            break;
        case (progress > 0.2 && progress < 0.8 ):
            progress += 0.005;
            break;
        case (progress > 1.2 && progress < 1.8):
            progress += 0.008;
            break;
      }
      this.setState({progress: progress});
      rAF(() => this.updateProgress());
  }

  measureHoriProgressBar(){
    // 如果是Horizontal的话，measure dom的布局。
    if(this.props.styleAttr === 'Horizontal'){
      setTimeout(()=>{
        UIManager.measure(this.refs['horiProgressBar'],(x,y,width,height)=>{
          this.horiWidth = width;
          this.forceUpdate();
        })
      })
    }
  }

  render(){
    let progressRender,
        props = this.props;
    if(props.styleAttr !== 'Horizontal'){
      let width = PROGESS_WIDTH[props.styleAttr],     //圆环直径
          radius = width / 2,                         //圆环半径
          storkeWidth = width / 5,                    //圆环宽度
          svgWidth = width + storkeWidth,             //svg宽度
          circleOffset = svgWidth / 2,                //圆心在svg上的坐标
          circumference = Math.PI * width,            //周长
          //旋转角度：indeterminate为true时根据progress的不同而变化，inverse时取反
          transformAngle = this.inverse * (this.indeterminate ? this.state.progress * 720 - 90 : -90),
          // 半圆环长度百分比
          storkeDashPer;

          if(props.indeterminate){
              let progressAbs = 1 - Math.abs(this.state.progress - 1);
              storkeDashPer = progressAbs > 0.8 ? 0.8 : progressAbs < 0.2 ? 0.2 : progressAbs;
          }else{
              storkeDashPer = this.state.progress
          }

      progressRender = (
        <svg  width = {svgWidth} height = {svgWidth}>
          <circle
            cx = {circleOffset}
            cy= {circleOffset}
            r = {radius}
            strokeWidth = {storkeWidth}
            stroke = {CIRCLE_COLOR}
            fill = 'none'>
          </circle>
          <circle
            cx = {circleOffset}
            cy= {circleOffset}
            r = {radius}
            strokeWidth = {storkeWidth}
            stroke = {this.props.color}
            fill= 'none'
            strokeDasharray={storkeDashPer * circumference + ' ' + circumference}
            style = {{transformOrigin:'center center',transform:'rotate(' + transformAngle  + 'deg) matrix(' + this.inverse + ',0,0,1,0,0)'}}
          ></circle>
        </svg>
      )
    }else{
      // horiProgressBar
      progressRender = (
        <div ref='horiProgressBar' style={styles.horiProgress}>
          <div style = {styles.horiTrack}>
          </div>
          <div style = {StyleSheet.normalize([styles.horiBar,{backgroundColor:props.color,width:this.state.progress * this.horiWidth}])}>
          </div>
         </div>
      )
    }

    return (
        <View {...this.props}>
          {progressRender}
        </View>
    )
  }
}

ProgressBar.defaultProps = {
  styleAttr:'Normal',
  indeterminate: true,
  progress: 0,
  color:'#1ba9ba'
}

ProgressBar.propTypes = {
    ...View.propTypes,
    /**
     *
     * @property styleAttr
     * @type oneOf(['Horizontal','Normal','Small','Large','Inverse','SmallInverse','LargeInverse'])
     * @default ‘Normal’
     * @description 进度条类型
     */
    styleAttr: React.PropTypes.oneOf(STYLE_ATTRIBUTES),
    /**
     *
     * @property indeterminate
     * @type bool
     * @default true
     * @description 是否表现为不确定的进度，如果您想自己控制进度条，请设为false
     *
     * styleAttr为`Horizontal`时，该值为false。
     */
    indeterminate: React.PropTypes.bool,
    /**
     *
     * @property progress
     * @type number
     * @default 0
     * @description 进度条进度，取值为0到1.
     */
    progress:React.PropTypes.number,
    /**
     *
     * @property color
     * @type color
     * @default ‘#1ba9ba’
     * @description 进度条颜色
     */
    color:ColorPropType,
    testID: React.PropTypes.string,
}

module.exports = ProgressBar;
