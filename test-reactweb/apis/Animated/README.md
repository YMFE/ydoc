# 动画

Animated 用于创建动画，最基本的用法是创建一个 `Animated.Value` ，并将其绑定到组件的一个或多个样式上。而后通过动画函数来驱动它，比如使用 `Animated.timing`，下面是一个例子，实现文字的渐显。

```javascript
import React,{Component} from 'react';
import {
    AppRegistry,
    Animated,
    Easing,
    View,
    StyleSheet,
    Text
} from 'react-native';

class AnimatedExample extends Component {
    constructor() {
        super();
        this.state = {
            fadeInOpacity: new Animated.Value(0) // 初始值
        };
    }

    componentDidMount() {
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 1, // 目标值
            duration: 2500, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start();
    }

    render() {
        return (
            <Animated.View style={[styles.demo, {
                    opacity: this.state.fadeInOpacity
                }]}>
                <Text style={styles.text}>悄悄的，我出现了</Text>
            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
    demo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 30
    }
});

AppRegistry.registerComponent('app', () => AnimatedExample);
```

需要注意的是只有那些声明为可动画的组件才可以关联动画。Animated 中包含 `View`、`Text` 和 `Image` 这三个组件默认情况下是可动画的。注意上面的例子，使用的这三个组件的时候是采用这样的方式： `<Animated.View>...</Animated.View>`。如果你想让其他组件可以动画，可以看看 `createAnimatedComponent`。

一个 `Animated.Value` 可以驱动任意多的样式属性，每个属性可以配置不同的插值函数。插值函数可以把一个输入范围根据配置信息映射到另外一个范围。映射关系可以是线性、二次、指数等等。

举个例子，可以在当 `Animated.Value` 从 0 变化到 1 的时候将字体透明度从 0 变化到 1，然后将字体大小从 10 变化到 20 。具体的写法，可以是下面这样：

```javascript
class AnimatedExample extends Component {
    constructor() {
        super();
        this.state = {
            fadeInOpacity: new Animated.Value(0) // 初始值
        };
    }

    componentDidMount() {
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 1, // 目标值
            duration: 2500, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start();
    }

    render() {
        return (
            <Animated.View style={styles.demo}>
                <Animated.Text style={[styles.text,{
                    opacity: this.state.fadeInOpacity,
                    fontSize:this.state.fadeInOpacity.interpolate({
                        inputRange:[0,1],
                        outputRange:[10,30]
                    })
                }]}>悄悄的，我出现了</Animated.Text>
            </Animated.View>
        );
    }
}
```

动画还可以更加复杂，通过使用 `sequence`,`parallel` 可以当多个动画序列执行，或者让多个动画同时执行。不一定非要把 `toValue` 设置为一个固定值，你也可以把它设置为另外一个动态变化的值，来实现多个动画的联动。

`Animated.ValueXY` 可以用于处理 2D 的动画，并且还有一些辅助功能帮组实现常见交互。

下面是一个使用 `Animated.ValueXY` 的例子:

```javascript
class AnimatedExample extends Component {
    constructor() {
        super();
        this.state = {
            fadeAnim: new Animated.ValueXY(0,0), // 初始值
        };
    }

    componentDidMount() {
        Animated.timing(this.state.fadeAnim, {
            toValue: {x:100,y:100}, // 目标值
            duration: 2500, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start();
    }

    render() {
        return (
            <View style={styles.demo}>
                <Animated.Text style={[styles.text,{
                    width:this.state.fadeAnim.x,
                    height:this.state.fadeAnim.y
                }]}></Animated.Text>
            </View>
        );
    }
}
```



## 方法

### decay

```
static decay(value: AnimatedValue | AnimatedValueXY, config: DecayAnimationConfig)
```
推动一个值以一个初始的速度和一个衰减系数逐渐变为0。

### timing

```
static timing(value: AnimatedValue | AnimatedValueXY, config: TimingAnimationConfig)
```
推动一个值按照一个过渡曲线而随时间变化。Easing模块定义了一大堆曲线，你也可以使用你自己的函数。

### spring

```
static spring(value: AnimatedValue | AnimatedValueXY, config: SpringAnimationConfig)
```
产生一个基于Rebound和Origami实现的Spring动画。它会在toValue值更新的同时跟踪当前的速度状态，以确保动画连贯。可以链式调用。

### add

```
static add(a: Animated, b: Animated)
```
将两个动画值相加计算，创建一个新的动画值。

### multiply

```
static multiply(a: Animated, b: Animated)
```
将两个动画值相乘计算，创建一个新的动画值。

### delay

```
static delay(time: number)
```
在指定的延迟之后开始动画。

### sequence

```
static sequence(animations: Array<CompositeAnimation>)
```
按顺序执行一个动画数组里的动画，等待一个完成后再执行下一个。如果当前的动画被中止，后面的动画则不会继续执行。

### parallel

```
static parallel(animations: Array<CompositeAnimation>, config?: ParallelConfig)
```
同时开始一个动画数组里的全部动画。默认情况下，如果有任何一个动画停止了，其余的也会被停止。你可以通过stopTogether选项来改变这个效果。

### stagger
```
static stagger(time: number, animations: Array<CompositeAnimation>)
```
一个动画数组，里面的动画有可能会同时执行（重叠），不过会以指定的延迟来开始。用来制作拖尾效果非常合适。

### event

```
static event(argMapping: Array<Mapping>, config?: EventConfig)
```
接受一个映射的数组，对应的解开每个值，然后调用所有对应的输出的setValue方法。例如：

```javascript
onScroll={this.AnimatedEvent(
    [{nativeEvent: {contentOffset: {x: this._scrollX}}}]
    {listener},          // 可选的异步监听函数
)
...
onPanResponderMove: this.AnimatedEvent([
    null,                // 忽略原始事件
    {dx: this._panX},    // 手势状态参数
]),
```

### createAnimatedComponent

```
static createAnimatedComponent(Component: any)
```
使得任何一个React组件支持动画。用它来创建Animated.View等等。

## 属性

### Value: AnimatedValue

表示一个数值的类，用于驱动动画。通常用 `new Animated.Value(0);` 来初始化。

### ValueXY: AnimatedValueXY

表示一个2D值的类，用来驱动2D动画，例如拖动操作等。

## class AnimatedValue

用于驱动动画的标准值。一个Animated.Value可以用一种同步的方式驱动多个属性，但同时只能被一个行为所驱动。启用一个新的行为（譬如开始一个新的动画，或者运行setValue）会停止任何之前的动作。

### 方法

#### constructor(value: number)

#### setValue(value: number)

直接设置它的值。这个会停止任何正在进行的动画，然后更新所有绑定的属性。

#### setOffset(offset: number)

设置一个相对值，不论接下来的值是由 `setValue`、一个动画，还是 `Animated.event` 产生的，都会加上这个值。常用来在拖动操作一开始的时候用来记录一个修正值（譬如当前手指位置和View位置）。

#### flattenOffset()

把当前的相对值合并到值里，并且将相对值设为0。最终输出的值不会变化。常在拖动操作结束后调用。

#### addListener(callback: ValueListenerCallback)

添加一个异步监听函数，这样你就可以监听动画值的变更。这有时候很有用，因为你没办法同步的读取动画的当前值，因为有时候动画会在原生层次运行。

#### removeListener(id: string)

#### removeAllListeners()

#### stopAnimation(callback?: ?(value: number) => void)

停止任何正在运行的动画或跟踪值。`callback` 会被调用，参数是动画结束后的最终值，这个值可能会用于同步更新状态与动画位置。

#### interpolate(config: InterpolationConfigType)

在更新属性之前对值进行插值。譬如：把0-1映射到0-10。

#### animate(animation: Animation, callback: EndCallback)

一般仅供内部使用。不过有可能一个自定义的动画类会用到此方法。

#### stopTracking()

仅供内部使用。

#### track(tracking: Animated)

仅供内部使用。

## class AnimatedValueXY

用来驱动2D动画的2D值，譬如滑动操作等。API和普通的 `Animated.Value` 几乎一样，只不过是个复合结构。它实际上包含两个普通的 `Animated.Value`。

### 方法

#### constructor(valueIn?: ?{x: number | AnimatedValue; y: number | AnimatedValue})

#### setValue(value: {x: number; y: number})

#### setOffset(offset: {x: number; y: number})

#### flattenOffset()

#### stopAnimation(callback?: ?() => number)

#### addListener(callback: ValueXYListenerCallback)

#### removeListener(id: string)

#### getLayout()

将一个 `{x, y}` 组合转换为 `{left, top}` 以用于样式。例如：

```javascript
style={this.state.anim.getLayout()}
```

#### getTranslateTransform()

将一个 `{x, y}` 组合转换为一个可用的位移变换(translation transform)，例如：

```
style={{
    transform: this.state.anim.getTranslateTransform()
}}
```

## 实例

```javascript
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} = ReactNative;
var UIExplorerButton = require('./UIExplorerButton');

exports.framework = 'React';
exports.title = 'Animated - Examples';
exports.description = 'Animated provides a powerful ' +
  'and easy-to-use API for building modern, ' +
  'interactive user experiences.';

exports.examples = [
  {
    title: 'FadeInView',
    description: 'Uses a simple timing animation to ' +
      'bring opacity from 0 to 1 when the component ' +
      'mounts.',
    render: function() {
      class FadeInView extends React.Component {
        state: any;

        constructor(props) {
          super(props);
          this.state = {
            fadeAnim: new Animated.Value(0), // opacity 0
          };
        }
        componentDidMount() {
          Animated.timing(       // Uses easing functions
            this.state.fadeAnim, // The value to drive
            {
              toValue: 1,        // Target
              duration: 2000,    // Configuration
            },
          ).start();             // Don't forget start!
        }
        render() {
          return (
            <Animated.View   // Special animatable View
              style={{
                opacity: this.state.fadeAnim,  // Binds
              }}>
              {this.props.children}
            </Animated.View>
          );
        }
      }
      class FadeInExample extends React.Component {
        state: any;

        constructor(props) {
          super(props);
          this.state = {
            show: true,
          };
        }
        render() {
          return (
            <View>
              <UIExplorerButton onPress={() => {
                  this.setState((state) => (
                    {show: !state.show}
                  ));
                }}>
                Press to {this.state.show ?
                  'Hide' : 'Show'}
              </UIExplorerButton>
              {this.state.show && <FadeInView>
                <View style={styles.content}>
                  <Text>FadeInView</Text>
                </View>
              </FadeInView>}
            </View>
          );
        }
      }
      return <FadeInExample />;
    },
  },
  {
    title: 'Transform Bounce',
    description: 'One `Animated.Value` is driven by a ' +
      'spring with custom constants and mapped to an ' +
      'ordered set of transforms.  Each transform has ' +
      'an interpolation to convert the value into the ' +
      'right range and units.',
    render: function() {
      this.anim = this.anim || new Animated.Value(0);
      return (
        <View>
          <UIExplorerButton onPress={() => {
            Animated.spring(this.anim, {
              toValue: 0,   // Returns to the start
              velocity: 3,  // Velocity makes it move
              tension: -10, // Slow
              friction: 1,  // Oscillate a lot
            }).start(); }}>
            Press to Fling it!
          </UIExplorerButton>
          <Animated.View
            style={[styles.content, {
              transform: [   // Array order matters
                {scale: this.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 4],
                })},
                {translateX: this.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 500],
                })},
                {rotate: this.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    '0deg', '360deg' // 'deg' or 'rad'
                  ],
                })},
              ]}
            ]}>
            <Text>Transforms!</Text>
          </Animated.View>
        </View>
      );
    },
  },
  {
    title: 'Composite Animations with Easing',
    description: 'Sequence, parallel, delay, and ' +
      'stagger with different easing functions.',
    render: function() {
      this.anims = this.anims || [1,2,3].map(
        () => new Animated.Value(0)
      );
      return (
        <View>
          <UIExplorerButton onPress={() => {
            var timing = Animated.timing;
            Animated.sequence([ // One after the other
              timing(this.anims[0], {
                toValue: 200,
                easing: Easing.linear,
              }),
              Animated.delay(400), // Use with sequence
              timing(this.anims[0], {
                toValue: 0,
                easing: Easing.elastic(2), // Springy
              }),
              Animated.delay(400),
              Animated.stagger(200,
                this.anims.map((anim) => timing(
                  anim, {toValue: 200}
                )).concat(
                this.anims.map((anim) => timing(
                  anim, {toValue: 0}
                ))),
              ),
              Animated.delay(400),
              Animated.parallel([
                Easing.inOut(Easing.quad), // Symmetric
                Easing.back(1.5),  // Goes backwards first
                Easing.ease        // Default bezier
              ].map((easing, ii) => (
                timing(this.anims[ii], {
                  toValue: 320, easing, duration: 3000,
                })
              ))),
              Animated.delay(400),
              Animated.stagger(200,
                this.anims.map((anim) => timing(anim, {
                  toValue: 0,
                  easing: Easing.bounce, // Like a ball
                  duration: 2000,
                })),
              ),
            ]).start(); }}>
            Press to Animate
          </UIExplorerButton>
          {['Composite', 'Easing', 'Animations!'].map(
            (text, ii) => (
              <Animated.View
                key={text}
                style={[styles.content, {
                  left: this.anims[ii]
                }]}>
                <Text>{text}</Text>
              </Animated.View>
            )
          )}
        </View>
      );
    },
  },
  {
    title: 'Continuous Interactions',
    description: 'Gesture events, chaining, 2D ' +
      'values, interrupting and transitioning ' +
      'animations, etc.',
    render: () => (
      <Text>Checkout the Gratuitous Animation App!</Text>
    ),
  }
];

var styles = StyleSheet.create({
  content: {
    backgroundColor: 'deepskyblue',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});
```
