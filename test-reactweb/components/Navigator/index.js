/*
 * @providesModule Navigator
 */
var React = require('react')
var PropTypes = React.PropTypes
var Dimensions = require('Dimensions')
var InteractionMixin = require('InteractionMixin');
var Map = require('./polyfills/Map');
var NavigationContext = require('NavigationContext');
var NavigatorBreadcrumbNavigationBar = require('NavigatorBreadcrumbNavigationBar');
var NavigatorNavigationBar = require('NavigatorNavigationBar');
var NavigatorSceneConfigs = require('NavigatorSceneConfigs');
var PanResponder = require('PanResponder');
var StyleSheet = require('StyleSheet');
var Subscribable = require('./polyfills/Subscribable');
var TimerMixin = require('react-timer-mixin');
var View = require('View')
var clamp = require('./polyfills/clamp');
var flattenStyle = require('flattenStyle');
var invariant = require('fbjs/lib/invariant');
var rebound = require("rebound")
var createHistory = require('history/lib/createHashHistory');
const NativeMethodsMixin = require('NativeMethodsMixin');
var AppRegistry = require('AppRegistry')
var utils = AppRegistry.utils
var Platform = require('Platform')
var isMQQBrowser = Platform.UA.match(/MQQBrowser/g) && !Platform.UA.match(/MicroMessenger/g) 

var history = createHistory({queryKey: ''});
history._pushState = function(obj, current, stack) {
  var path = '?' + getRouteHash(current)
  history.pushState(obj, path);
}
var _unlisten;

// TODO: this is not ideal because there is no guarantee that the navigator
// is full screen, hwoever we don't have a good way to measure the actual
// size of the navigator right now, so this is the next best thing.
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;
var SCENE_DISABLED_NATIVE_PROPS = {
  pointerEvents: 'none',
  style: {
    top: SCREEN_HEIGHT,
    bottom: -SCREEN_HEIGHT,
    opacity: 0,
  },
};

/**
 * Navigator 组件
 *
 * @component Navigator
 * @version >=0.20.0
 * @example ./Navigator.js
 * @description Navigator 可以让你在应用的不同场景间进行切换。导航器建立了一个路由栈，
 * 用来弹出，推入或者替换路由状态。这样便实现了不同页面间的切换。为了使用 `Navigator`，
 * 需要提供一个或多个叫做 `route` 的对象来表示每个场景，同时要提供一个 `renderScene` 函数
 * 来使用每个 `route` 对象渲染出场景。
 *
 * 确保应用能正常响应页面刷新，需要：
 *
 * 单独使用navigator
 * ```
 * goExampleScene(exampleName) {
 *     const { navigator } = this.props
 *     if(navigator) {
 *         navigator.push({
 *             name: exampleName, // 渲染的Component name会写入到url内
 *             opts: {
 *                  param: {
 *                      page: 12
 *                  }
 *             },
 *             component: examplePages[exampleName], // 通过name来获取需要render的Component
 *         })
 *     }
 * }
 * ```
 *
 * 使用ext
 *
 * ```
 * gotoExample(exampleName) {
 *     setTimeout(function(){
 *         Ext.open('ExampleRender', {
 *             title: example.title,
 *             param: {
 *                 yourGetExampleByNameFunc(exampleName), 
 *                 name: exampleName
 *             }
 *         });
 *     });
 * }
 * ```
 *
 * ![Navigator](./images/component/Navigator.gif)
 */

function getSceneName(location) {
  var parts = [utils.parseDataFromUrl(location)]
  return parts.map(function(route) {
    return {
      name  : route.qInitView,
      hash: location.search.replace(/^\?/g, ''),
      ...route
    }
  })
}

function getRouteHash(route) {
  if (route.hash) return route.hash
  return utils.jsonToQuery({
    moduleName: AppRegistry._curMd,
    name: route.name,
    opts: {param: route.opts && route.opts.param || {}},
    // initProps: route.initProps || {}
  })
}

// styles moved to the top of the file so getDefaultProps can refer to it
var styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  defaultSceneStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  baseScene: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  disabledScene: {
    top: SCREEN_HEIGHT,
    bottom: -SCREEN_HEIGHT,
  },
  transitioner: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  }
});

var GESTURE_ACTIONS = [
  'pop',
  'jumpBack',
  'jumpForward',
];

/**
 * Use `Navigator` to transition between different scenes in your app. To
 * accomplish this, provide route objects to the navigator to identify each
 * scene, and also a `renderScene` function that the navigator can use to
 * render the scene for a given route.
 *
 * To change the animation or gesture properties of the scene, provide a
 * `configureScene` prop to get the config object for a given route. See
 * `Navigator.SceneConfigs` for default animations and more info on
 * scene config options.
 *
 * ### Basic Usage
 *
 * ```
 *   <Navigator
 *     initialRoute={{name: 'My First Scene', index: 0}}
 *     renderScene={(route, navigator) =>
 *       <MySceneComponent
 *         name={route.name}
 *         onForward={() => {
 *           let nextIndex = route.index + 1;
 *           navigator.push({
 *             name: 'Scene ' + nextIndex,
 *             index: nextIndex,
 *           });
 *         }}
 *         onBack={() => {
 *           if (route.index > 0) {
 *             navigator.pop();
 *           }
 *         }}
 *       />
 *     }
 *   />
 * ```
 *
 * ### Navigator Methods
 *
 * If you have a ref to the Navigator element, you can invoke several methods
 * on it to trigger navigation:
 *
 *  - `getCurrentRoutes()` - returns the current list of routes
 *  - `jumpBack()` - Jump backward without unmounting the current scene
 *  - `jumpForward()` - Jump forward to the next scene in the route stack
 *  - `jumpTo(route)` - Transition to an existing scene without unmounting
 *  - `push(route)` - Navigate forward to a new scene, squashing any scenes
 *     that you could `jumpForward` to
 *  - `pop()` - Transition back and unmount the current scene
 *  - `replace(route)` - Replace the current scene with a new route
 *  - `replaceAtIndex(route, index)` - Replace a scene as specified by an index
 *  - `replacePrevious(route)` - Replace the previous scene
 *  - `immediatelyResetRouteStack(routeStack)` - Reset every scene with an
 *     array of routes
 *  - `popToRoute(route)` - Pop to a particular scene, as specified by its
 *     route. All scenes after it will be unmounted
 *  - `popToTop()` - Pop to the first scene in the stack, unmounting every
 *     other scene
 *
 */
var Navigator = React.createClass({
  mixins: [TimerMixin, InteractionMixin, Subscribable.Mixin, NativeMethodsMixin],
  propTypes: {
    /**
     * Optional function that allows configuration about scene animations and
     * gestures. Will be invoked with the route and should return a scene
     * configuration object
     *
     * ```
     * (route) => Navigator.SceneConfigs.FloatFromRight
     * ```
     */


    /**
     * @property configureScene
     * @type function
     * @description 可选的函数，用来配置场景动画和手势，
     * 调用时会传入两个参数：`route`，`routeStack`。`route` 是当前场景，
     * 而 `routeStack` 是当前能够跳转到的已挂载页面。这个函数应该返回一个一个场景配置对象。
     * ```
     * (route, routeStack) => Navigator.SceneConfigs.FloatFromRight
     * ```
     * 下列是可选的场景配置项：
     * - Navigator.SceneConfigs.PushFromRight (default)
     * - Navigator.SceneConfigs.FloatFromRight
     * - Navigator.SceneConfigs.FloatFromLeft
     * - Navigator.SceneConfigs.FloatFromBottom
     * - Navigator.SceneConfigs.FloatFromBottomAndroid
     * - Navigator.SceneConfigs.FadeAndroid
     * - Navigator.SceneConfigs.HorizontalSwipeJump
     * - Navigator.SceneConfigs.HorizontalSwipeJumpFromRight
     * - Navigator.SceneConfigs.VerticalUpSwipeJump
     * - Navigator.SceneConfigs.VerticalDownSwipeJump
     */
    configureScene: PropTypes.func,

    /**
     * Required function which renders the scene for a given route. Will be
     * invoked with the route and the navigator object
     *
     * ```
     * (route, navigator) =>
     *   <MySceneComponent title={route.title} />
     * ```
     */

     /**
      * @property renderScene
      * @type function
      * @description 必选的参数，用来使用给定的route对象渲染场景。
      * 调用时带有 `route` 和 `navigator` 对象。
      */
    renderScene: PropTypes.func.isRequired,

    /**
     * Specify a route to start on. A route is an object that the navigator
     * will use to identify each scene to render. `initialRoute` must be
     * a route in the `initialRouteStack` if both props are provided. The
     * `initialRoute` will default to the last item in the `initialRouteStack`.
     */
    /**
     * @property initialRoute
     * @type object
     * @description 设置导航器的默认 `route`。`route` 是导航器用来标示渲染场景的对象。
     * 如果 `initialRoute` 和 `initialRouteStack` 都传给了 `Navigator`，
     * 那么 `initialRoute` 必须存在于 `initialRouteStack` 中，如果只传入了
     * `initialRouteStack`，那么 `initialRoute` 将会是 `initialRouteStack` 中的
     * 最后一个对象。
     */
    initialRoute: PropTypes.object,

    /**
     * Provide a set of routes to initially mount. Required if no initialRoute
     * is provided. Otherwise, it will default to an array containing only the
     * `initialRoute`
     */


    /**
     * @property initialRouteStack
     * @type array
     * @description 一组初始阶段需要挂载的 `route`，对于 `Navigator` 组件，
     * 如果 `initialRoute` 属性没有传入，则必须传入该属性。如果这个属性没有传入，
     * 那么其默认值将是一个仅仅包含 `initialRoute` 的数组。
     */
    initialRouteStack: PropTypes.arrayOf(PropTypes.object),

    /**
     * @deprecated
     * Use `navigationContext.addListener('willfocus', callback)` instead.
     *
     * Will emit the target route upon mounting and before each nav transition
     */
    onWillFocus: PropTypes.func,

    /**
     * @deprecated
     * Use `navigationContext.addListener('didfocus', callback)` instead.
     *
     * Will be called with the new route of each scene after the transition is
     * complete or after the initial mounting
     */
    onDidFocus: PropTypes.func,

    /**
     * Optionally provide a navigation bar that persists across scene
     * transitions
     */

    /**
     * @property navigationBar
     * @type ReactNode
     * @description 页面顶部的导航条，通常是传入一个 `<Navigator.NavigationBar />` 组件。
     */
    navigationBar: PropTypes.node,

    /**
     * @property navigator
     * @type object
     * @description 可选参数，提供从父导航器获得的导航器对象。这个对象上调用下列方法：
     * - getCurrentRoutes() - 获取当前栈里的路由，也就是push进来，没有pop掉的那些。
     * - jumpBack() - 跳回之前的路由，当然前提是保留现在的，还可以再跳回来，会给你保留原样。
     * - jumpForward() - 上一个方法不是调到之前的路由了么，用这个跳回来就好了。
     * - jumpTo(route) - 跳转到已有的场景并且不卸载。
     * - push(route) - 跳转到新的场景，并且将场景入栈，你可以稍后跳转过去
     * - pop() - 跳转回去并且卸载掉当前场景
     * - replace(route) - 用一个新的路由替换掉当前场景
     * - replaceAtIndex(route, index) - 替换掉指定序列的路由场景
     * - replacePrevious(route) - 替换掉之前的场景
     * - resetTo(route) - 跳转到新的场景，并且重置整个路由栈
     * - immediatelyResetRouteStack(routeStack) - 用新的路由数组来重置路由栈
     * - popToRoute(route) - pop到路由指定的场景，在整个路由栈中，处于指定场景之后的场景将会被卸载。
     * - popToTop() - pop到栈中的第一个场景，卸载掉所有的其他场景。
     */
    navigator: PropTypes.object,

    /**
     * @property sceneStyle
     * @type style
     * @description 每个场景的容器的样式
     */
    sceneStyle: View.propTypes.style,
  },

  statics: {
    BreadcrumbNavigationBar: NavigatorBreadcrumbNavigationBar,
    NavigationBar: NavigatorNavigationBar,
    SceneConfigs: NavigatorSceneConfigs,
  },

  getDefaultProps: function() {
    return {
      configureScene: () => NavigatorSceneConfigs.PushFromRight,
      sceneStyle: styles.defaultSceneStyle,
    };
  },

  getInitialState: function() {
    this._renderedSceneMap = new Map();
    var initialRoute = this.props.initialRoute;
    var _location = history.createLocation(window.location.hash.replace(/^#/g,''));
    var sceneName = getSceneName(_location);
    var routeStack = this.props.initialRouteStack || [initialRoute];
    initialRoute.hash = getRouteHash(initialRoute)
    // url内出现的name和初始路由的name是否一致
    var sceneNameNotEqualInitialName = sceneName[0].name && sceneName[0].hash != initialRoute.hash;
    if (sceneNameNotEqualInitialName) {
      sceneName = sceneName.reverse()
      sceneName.map(function(item) {
        item.hash = item.hash.replace(/initProps=/g, 'opts=')
        if (item.name && ( item.hash !== initialRoute.hash)) {
          if (item.name === initialRoute.name) {
            initialRoute.hash = item.hash
            initialRoute.opts = item.opts
          } else {
            routeStack.push({
              name: item.name,
              qInitView: item.name,
              hash: item.hash,
              opts: {param: item.opts && item.opts.param || {}},
              // initProps: item.initProps || {}
            })
          }
        }
      })
    }
    invariant(
      routeStack.length >= 1,
      'Navigator requires props.initialRoute or props.initialRouteStack.'
    );
    var initialRouteIndex = routeStack.length - 1;
    if (!sceneNameNotEqualInitialName && this.props.initialRoute) {
      initialRouteIndex = routeStack.indexOf(this.props.initialRoute);
      invariant(
        initialRouteIndex !== -1,
        'initialRoute is not in initialRouteStack.'
      );
    }
    return {
      currentSceneName: sceneName[0].hash,
      sceneConfigStack: routeStack.map(
        (route) => this.props.configureScene(route)
      ),
      routeStack,
      presentedIndex: initialRouteIndex,
      transitionFromIndex: null,
      activeGesture: null,
      pendingGestureProgress: null,
      transitionQueue: [],
    };
  },

  componentWillMount: function() {
    // TODO(t7489503): Don't need this once ES6 Class landed.
    this.__defineGetter__('navigationContext', this._getNavigationContext);

    this._subRouteFocus = [];
    this.parentNavigator = this.props.navigator;
    this._handlers = {};
    this.springSystem = new rebound.SpringSystem();
    this.spring = this.springSystem.createSpring();
    this.spring.setRestSpeedThreshold(0.05);
    this.spring.setCurrentValue(0).setAtRest();
    this.spring.addListener({
      onSpringEndStateChange: () => {
        if (!this._interactionHandle) {
          this._interactionHandle = this.createInteractionHandle();
        }
      },
      onSpringUpdate: () => {
        this._handleSpringUpdate();
      },
      onSpringAtRest: () => {
        this._completeTransition();
      },
    });
    this.panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderRelease: this._handlePanResponderRelease,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderTerminate: this._handlePanResponderTerminate,
    });
    this._interactionHandle = null;
    this._emitWillFocus(this.state.routeStack[this.state.presentedIndex]);
    this.hashChanged = false;
  },

  componentDidMount: function() {
    var routeStack = this.state.routeStack
    this._handleSpringUpdate();
    this._emitDidFocus(routeStack[this.state.presentedIndex]);

    // NOTE: Listen for changes to the current location. The
    // listener is called once immediately.
    _unlisten = history.listen(function(location) {
      let routeStack = this.state.routeStack
      let sceneName = getSceneName(location)[0],
        {hash, moduleName, name, opts} = sceneName
      // moduleName切换
      if (moduleName !== AppRegistry._curMd) {
        if (moduleName || AppRegistry._curMd !== AppRegistry._defMd) {
          AppRegistry.unmountApplicationComponentAtRootTag() // 销毁现在的APP
          return AppRegistry.runApplication(moduleName, {
            initProps: opts
          })
        }
      }
      if (this.state.currentSceneName !== hash.replace(/initProps=/g, 'opts=')) {
        this.hashChanged = true
        var inStack = false
        for (var i in routeStack) {
          // initialRoute never pop
          if (routeStack[i].hash === hash || i == 0 && !name) {
            inStack = i
            break
          }
        }
        if (inStack !== false) {
          this._jumpN(i - this.state.presentedIndex)
          this.hashChanged = false
        } else {
          this.push({
            name: name,
            qInitView: name,
            hash: hash,
            opts: {param: opts && opts.param || {}},
            // initProps: initProps
          }, ()=>this.hashChanged = false)
        }
      }
    }.bind(this));
  },

  componentWillUnmount: function() {
    if (this._navigationContext) {
      this._navigationContext.dispose();
      this._navigationContext = null;
    }

    // When you're finished, stop the listener.
    _unlisten();

  },

  /**
   * @param {RouteStack} nextRouteStack Next route stack to reinitialize. This
   * doesn't accept stack item `id`s, which implies that all existing items are
   * destroyed, and then potentially recreated according to `routeStack`. Does
   * not animate, immediately replaces and rerenders navigation bar and stack
   * items.
   */


  immediatelyResetRouteStack: function(nextRouteStack) {
    // 精简掉
  },

  _transitionTo: function(destIndex, velocity, jumpSpringTo, cb) {
    if (destIndex === this.state.presentedIndex) {
      return;
    }
    utils.hideContainer(null, !!'force') // 销毁全局组件
    var _isMQQBrowser = isMQQBrowser && this.hashChanged
    if (this.state.transitionFromIndex !== null) {
      this.state.transitionQueue.push({
        destIndex,
        velocity,
        cb,
      });
      return;
    }
    this.state.transitionFromIndex = this.state.presentedIndex;
    this.state.presentedIndex = destIndex;
    this.state.transitionCb = cb;
    this.state.currentSceneName = this.state.routeStack[destIndex].hash;
    this._onAnimationStart();
    if (!_isMQQBrowser) {
      let sceneConfig = this.state.sceneConfigStack[this.state.transitionFromIndex] ||
        this.state.sceneConfigStack[this.state.presentedIndex];
      invariant(
        sceneConfig,
        'Cannot configure scene at index ' + this.state.transitionFromIndex
      );
      if (jumpSpringTo != null) {
        this.spring.setCurrentValue(jumpSpringTo);
      }
      this.spring.setOvershootClampingEnabled(true);
      this.spring.getSpringConfig().friction = sceneConfig.springFriction;
      this.spring.getSpringConfig().tension = sceneConfig.springTension;
      this.spring.setVelocity(velocity || sceneConfig.defaultTransitionVelocity);
      this.spring.setEndValue(1);
    } else {
      this.spring.setCurrentValue(1);
      this._completeTransition();
    }
    if (!this.hashChanged) {
      history._pushState({ index: destIndex }, this.state.routeStack[destIndex], this.state.routeStack.slice(0, destIndex));
    }
  },

  /**
   * This happens for each frame of either a gesture or a transition. If both are
   * happening, we only set values for the transition and the gesture will catch up later
   */
  _handleSpringUpdate: function() {
    // Prioritize handling transition in progress over a gesture:
    if (this.state.transitionFromIndex != null) {
      this._transitionBetween(
        this.state.transitionFromIndex,
        this.state.presentedIndex,
        this.spring.getCurrentValue()
      );
    } else if (this.state.activeGesture != null) {
      let presentedToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
      this._transitionBetween(
        this.state.presentedIndex,
        presentedToIndex,
        this.spring.getCurrentValue()
      );
    }
  },

  /**
   * This happens at the end of a transition started by transitionTo, and when the spring catches up to a pending gesture
   */
  _completeTransition: function() {
    if (this.spring.getCurrentValue() !== 1 && this.spring.getCurrentValue() !== 0) {
      // The spring has finished catching up to a gesture in progress. Remove the pending progress
      // and we will be in a normal activeGesture state
      if (this.state.pendingGestureProgress) {
        this.state.pendingGestureProgress = null;
      }
      return;
    }
    this._onAnimationEnd();
    let presentedIndex = this.state.presentedIndex;
    let didFocusRoute = this._subRouteFocus[presentedIndex] || this.state.routeStack[presentedIndex];
    this._emitDidFocus(didFocusRoute);
    this.state.transitionFromIndex = null;
    this.spring.setCurrentValue(0).setAtRest();
    this._hideScenes();
    if (this.state.transitionCb) {
      this.state.transitionCb();
      this.state.transitionCb = null;
    }
    if (this._interactionHandle) {
      this.clearInteractionHandle(this._interactionHandle);
      this._interactionHandle = null;
    }
    if (this.state.pendingGestureProgress) {
      // A transition completed, but there is already another gesture happening.
      // Enable the scene and set the spring to catch up with the new gesture
      let gestureToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
      this._enableScene(gestureToIndex);
      this.spring.setEndValue(this.state.pendingGestureProgress);
      return;
    }
    if (this.state.transitionQueue.length) {
      let queuedTransition = this.state.transitionQueue.shift();
      this._enableScene(queuedTransition.destIndex);
      this._emitWillFocus(this.state.routeStack[queuedTransition.destIndex]);
      this._transitionTo(
        queuedTransition.destIndex,
        queuedTransition.velocity,
        null,
        queuedTransition.cb
      );
    }
  },

  _emitDidFocus: function(route) {
    this.navigationContext.emit('didfocus', {route: route});

    if (this.props.onDidFocus) {
      this.props.onDidFocus(route);
    }
  },

  _emitWillFocus: function(route) {
    this.navigationContext.emit('willfocus', {route: route});

    let navBar = this._navBar;
    if (navBar && navBar.handleWillFocus) {
      navBar.handleWillFocus(route);
    }
    if (this.props.onWillFocus) {
      this.props.onWillFocus(route);
    }
  },

  /**
   * Hides all scenes that we are not currently on, gesturing to, or transitioning from
   */
  _hideScenes: function() {
    let gesturingToIndex = null;
    if (this.state.activeGesture) {
      gesturingToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    }
    for (let i = 0; i < this.state.routeStack.length; i++) {
      if (i === this.state.presentedIndex ||
          i === this.state.transitionFromIndex ||
          i === gesturingToIndex) {
        continue;
      }
      this._disableScene(i);
    }
  },

  /**
   * Push a scene off the screen, so that opacity:0 scenes will not block touches sent to the presented scenes
   */
  _disableScene: function(sceneIndex) {
    this.refs['scene_' + sceneIndex] &&
    this.refs['scene_' + sceneIndex].setNativeProps(SCENE_DISABLED_NATIVE_PROPS);
  },

  /**
   * Put the scene back into the state as defined by props.sceneStyle, so transitions can happen normally
   */
  _enableScene: function(sceneIndex) {
    // First, determine what the defined styles are for scenes in this navigator
    let sceneStyle = flattenStyle([styles.baseScene, this.props.sceneStyle]);
    // Then restore the pointer events and top value for this scene
    let enabledSceneNativeProps = {
      pointerEvents: 'auto',
      style: {
        top: sceneStyle.top,
        bottom: sceneStyle.bottom,
      },
    };
    if (sceneIndex !== this.state.transitionFromIndex &&
        sceneIndex !== this.state.presentedIndex) {
      // If we are not in a transition from this index, make sure opacity is 0
      // to prevent the enabled scene from flashing over the presented scene
      enabledSceneNativeProps.style.opacity = 0;
    }
    if (this.refs['scene_' + sceneIndex]) {
      this.refs['scene_' + sceneIndex].setNativeProps(enabledSceneNativeProps);
    } else {
      this.setState({
        currentSceneName: this.state.currentSceneName
      })
    }
  },

  _onAnimationStart: function() {
    let fromIndex = this.state.presentedIndex;
    let toIndex = this.state.presentedIndex;
    if (this.state.transitionFromIndex != null) {
      fromIndex = this.state.transitionFromIndex;
    } else if (this.state.activeGesture) {
      toIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    }
    let navBar = this._navBar;
    if (navBar && navBar.onAnimationStart) {
      navBar.onAnimationStart(fromIndex, toIndex);
    }
  },

  _onAnimationEnd: function() {
    let navBar = this._navBar;
    if (navBar && navBar.onAnimationEnd) {
      navBar.onAnimationEnd();
    }
  },

  _handleTouchStart: function() {
    this._eligibleGestures = GESTURE_ACTIONS;
  },

  _handleMoveShouldSetPanResponder: function(e, gestureState) {
    let sceneConfig = this.state.sceneConfigStack[this.state.presentedIndex];
    if (!sceneConfig) {
      return false;
    }
    this._expectingGestureGrant = this._matchGestureAction(this._eligibleGestures, sceneConfig.gestures, gestureState);
    return !!this._expectingGestureGrant;
  },

  _doesGestureOverswipe: function(gestureName) {
    let wouldOverswipeBack = this.state.presentedIndex <= 0 &&
      (gestureName === 'pop' || gestureName === 'jumpBack');
    let wouldOverswipeForward = this.state.presentedIndex >= this.state.routeStack.length - 1 &&
      gestureName === 'jumpForward';
    return wouldOverswipeForward || wouldOverswipeBack;
  },

  _handlePanResponderGrant: function(e, gestureState) {
    invariant(
      this._expectingGestureGrant,
      'Responder granted unexpectedly.'
    );
    this._attachGesture(this._expectingGestureGrant);
    this._onAnimationStart();
    this._expectingGestureGrant = null;
  },

  _deltaForGestureAction: function(gestureAction) {
    switch (gestureAction) {
      case 'pop':
      case 'jumpBack':
        return -1;
      case 'jumpForward':
        return 1;
      default:
        invariant(false, 'Unsupported gesture action ' + gestureAction);
        return;
    }
  },

  _handlePanResponderRelease: function(e, gestureState) {
    let sceneConfig = this.state.sceneConfigStack[this.state.presentedIndex];
    let releaseGestureAction = this.state.activeGesture;
    if (!releaseGestureAction) {
      // The gesture may have been detached while responder, so there is no action here
      return;
    }
    let releaseGesture = sceneConfig.gestures[releaseGestureAction];
    let destIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    if (this.spring.getCurrentValue() === 0) {
      // The spring is at zero, so the gesture is already complete
      this.spring.setCurrentValue(0).setAtRest();
      this._completeTransition();
      return;
    }
    let isTravelVertical = releaseGesture.direction === 'top-to-bottom' || releaseGesture.direction === 'bottom-to-top';
    let isTravelInverted = releaseGesture.direction === 'right-to-left' || releaseGesture.direction === 'bottom-to-top';
    let velocity, gestureDistance;
    if (isTravelVertical) {
      velocity = isTravelInverted ? -gestureState.vy : gestureState.vy;
      gestureDistance = isTravelInverted ? -gestureState.dy : gestureState.dy;
    } else {
      velocity = isTravelInverted ? -gestureState.vx : gestureState.vx;
      gestureDistance = isTravelInverted ? -gestureState.dx : gestureState.dx;
    }
    let transitionVelocity = clamp(-10, velocity, 10);
    if (Math.abs(velocity) < releaseGesture.notMoving) {
      // The gesture velocity is so slow, is "not moving"
      let hasGesturedEnoughToComplete = gestureDistance > releaseGesture.fullDistance * releaseGesture.stillCompletionRatio;
      transitionVelocity = hasGesturedEnoughToComplete ? releaseGesture.snapVelocity : -releaseGesture.snapVelocity;
    }
    if (transitionVelocity < 0 || this._doesGestureOverswipe(releaseGestureAction)) {
      // This gesture is to an overswiped region or does not have enough velocity to complete
      // If we are currently mid-transition, then this gesture was a pending gesture. Because this gesture takes no action, we can stop here
      if (this.state.transitionFromIndex == null) {
        // There is no current transition, so we need to transition back to the presented index
        let transitionBackToPresentedIndex = this.state.presentedIndex;
        // slight hack: change the presented index for a moment in order to transitionTo correctly
        this.state.presentedIndex = destIndex;
        this._transitionTo(
          transitionBackToPresentedIndex,
          - transitionVelocity,
          1 - this.spring.getCurrentValue()
        );
      }
    } else {
      // The gesture has enough velocity to complete, so we transition to the gesture's destination
      this._emitWillFocus(this.state.routeStack[destIndex]);
      this._transitionTo(
        destIndex,
        transitionVelocity,
        null,
        () => {
          if (releaseGestureAction === 'pop') {
            this._cleanScenesPastIndex(destIndex);
          }
        }
      );
    }
    this._detachGesture();
  },

  _handlePanResponderTerminate: function(e, gestureState) {
    if (this.state.activeGesture == null) {
      return;
    }
    let destIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    this._detachGesture();
    let transitionBackToPresentedIndex = this.state.presentedIndex;
    // slight hack: change the presented index for a moment in order to transitionTo correctly
    this.state.presentedIndex = destIndex;
    this._transitionTo(
      transitionBackToPresentedIndex,
      null,
      1 - this.spring.getCurrentValue()
    );
  },

  _attachGesture: function(gestureId) {
    this.state.activeGesture = gestureId;
    let gesturingToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    this._enableScene(gesturingToIndex);
  },

  _detachGesture: function() {
    this.state.activeGesture = null;
    this.state.pendingGestureProgress = null;
    this._hideScenes();
  },

  _handlePanResponderMove: function(e, gestureState) {
    let sceneConfig = this.state.sceneConfigStack[this.state.presentedIndex];
    if (this.state.activeGesture) {
      let gesture = sceneConfig.gestures[this.state.activeGesture];
      return this._moveAttachedGesture(gesture, gestureState);
    }
    let matchedGesture = this._matchGestureAction(GESTURE_ACTIONS, sceneConfig.gestures, gestureState);
    if (matchedGesture) {
      this._attachGesture(matchedGesture);
    }
  },

  _moveAttachedGesture: function(gesture, gestureState) {
    let isTravelVertical = gesture.direction === 'top-to-bottom' || gesture.direction === 'bottom-to-top';
    let isTravelInverted = gesture.direction === 'right-to-left' || gesture.direction === 'bottom-to-top';
    let distance = isTravelVertical ? gestureState.dy : gestureState.dx;
    distance = isTravelInverted ? - distance : distance;
    let gestureDetectMovement = gesture.gestureDetectMovement;
    let nextProgress = (distance - gestureDetectMovement) /
      (gesture.fullDistance - gestureDetectMovement);
    if (nextProgress < 0 && gesture.isDetachable) {
      let gesturingToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
      this._transitionBetween(this.state.presentedIndex, gesturingToIndex, 0);
      this._detachGesture();
      if (this.state.pendingGestureProgress != null) {
        this.spring.setCurrentValue(0);
      }
      return;
    }
    if (this._doesGestureOverswipe(this.state.activeGesture)) {
      let frictionConstant = gesture.overswipe.frictionConstant;
      let frictionByDistance = gesture.overswipe.frictionByDistance;
      let frictionRatio = 1 / ((frictionConstant) + (Math.abs(nextProgress) * frictionByDistance));
      nextProgress *= frictionRatio;
    }
    nextProgress = clamp(0, nextProgress, 1);
    if (this.state.transitionFromIndex != null) {
      this.state.pendingGestureProgress = nextProgress;
    } else if (this.state.pendingGestureProgress) {
      this.spring.setEndValue(nextProgress);
    } else {
      this.spring.setCurrentValue(nextProgress);
    }
  },

  _matchGestureAction: function(eligibleGestures, gestures, gestureState) {
    if (!gestures || !eligibleGestures) {
      return null;
    }
    let matchedGesture = null;
    eligibleGestures.some((gestureName, gestureIndex) => {
      let gesture = gestures[gestureName];
      if (!gesture) {
        return;
      }
      if (gesture.overswipe == null && this._doesGestureOverswipe(gestureName)) {
        // cannot swipe past first or last scene without overswiping
        return false;
      }
      let isTravelVertical = gesture.direction === 'top-to-bottom' || gesture.direction === 'bottom-to-top';
      let isTravelInverted = gesture.direction === 'right-to-left' || gesture.direction === 'bottom-to-top';
      let currentLoc = isTravelVertical ? gestureState.moveY : gestureState.moveX;
      let travelDist = isTravelVertical ? gestureState.dy : gestureState.dx;
      let oppositeAxisTravelDist =
        isTravelVertical ? gestureState.dx : gestureState.dy;
      let edgeHitWidth = gesture.edgeHitWidth;
      if (isTravelInverted) {
        currentLoc = -currentLoc;
        travelDist = -travelDist;
        oppositeAxisTravelDist = -oppositeAxisTravelDist;
        edgeHitWidth = isTravelVertical ?
          -(SCREEN_HEIGHT - edgeHitWidth) :
          -(SCREEN_WIDTH - edgeHitWidth);
      }
      let moveStartedInRegion = gesture.edgeHitWidth == null ||
        currentLoc < edgeHitWidth;
      if (!moveStartedInRegion) {
        return false;
      }
      let moveTravelledFarEnough = travelDist >= gesture.gestureDetectMovement;
      if (!moveTravelledFarEnough) {
        return false;
      }
      let directionIsCorrect = Math.abs(travelDist) > Math.abs(oppositeAxisTravelDist) * gesture.directionRatio;
      if (directionIsCorrect) {
        matchedGesture = gestureName;
        return true;
      } else {
        this._eligibleGestures = this._eligibleGestures.slice().splice(gestureIndex, 1);
      }
    });
    return matchedGesture;
  },

  _transitionSceneStyle: function(fromIndex, toIndex, progress, index) {
    let viewAtIndex = this.refs['scene_' + index];
    if (viewAtIndex === null || viewAtIndex === undefined) {
      return;
    }
    // Use toIndex animation when we move forwards. Use fromIndex when we move back
    let sceneConfigIndex = fromIndex < toIndex ? toIndex : fromIndex;
    let sceneConfig = this.state.sceneConfigStack[sceneConfigIndex];
    // this happens for overswiping when there is no scene at toIndex
    if (!sceneConfig) {
      sceneConfig = this.state.sceneConfigStack[sceneConfigIndex - 1];
    }
    let styleToUse = {};
    let useFn = index < fromIndex || index < toIndex ?
      sceneConfig.animationInterpolators.out :
      sceneConfig.animationInterpolators.into;
    let directionAdjustedProgress = fromIndex < toIndex ? progress : 1 - progress;
    let didChange = useFn(styleToUse, directionAdjustedProgress);
    if (didChange) {
      viewAtIndex.setNativeProps({style: styleToUse});
    }
  },

  _transitionBetween: function(fromIndex, toIndex, progress) {
    this._transitionSceneStyle(fromIndex, toIndex, progress, fromIndex);
    this._transitionSceneStyle(fromIndex, toIndex, progress, toIndex);
    let navBar = this._navBar;
    if (navBar && navBar.updateProgress && toIndex >= 0 && fromIndex >= 0) {
      navBar.updateProgress(progress, fromIndex, toIndex);
    }
  },

  _handleResponderTerminationRequest: function() {
    return false;
  },

  _getDestIndexWithinBounds: function(n) {
    let currentIndex = this.state.presentedIndex;
    let destIndex = currentIndex + n;
    invariant(
      destIndex >= 0,
      'Cannot jump before the first route.'
    );
    let maxIndex = this.state.routeStack.length - 1;
    invariant(
      maxIndex >= destIndex,
      'Cannot jump past the last route.'
    );
    return destIndex;
  },

  _jumpN: function(n) {
    let destIndex = this._getDestIndexWithinBounds(n);
    this._enableScene(destIndex);
    this._emitWillFocus(this.state.routeStack[destIndex]);
    this._transitionTo(destIndex);
    if (!this.hashChanged) {
      return;
    }
  },


  /**
   * jumpTo -  跳转到已有的场景并且不卸载当前页面。
   *
   * @param  {route} route description
   * @return {null}       description
   */
  jumpTo: function(route) {
    let destIndex = this.state.routeStack.indexOf(route);
    invariant(
      destIndex !== -1,
      'Cannot jump to route that is not in the route stack'
    );
    this._jumpN(destIndex - this.state.presentedIndex);
  },


  /**
   * jumpForward - description
   *
   * @return {type}  description
   */
  jumpForward: function() {
    this._jumpN(1);
  },

  jumpBack: function() {
    this._jumpN(-1);
  },


  /**
   * push - 跳转到新的页面，并将该页面入栈，之后可以再次跳转回来。
   *
   * @param  {type} route description
   * @return {null}
   */
  push: function(route, cb) {
    invariant(!!route, 'Must supply route to push');
    let activeLength = this.state.presentedIndex + 1;
    let activeStack = this.state.routeStack.slice(0, activeLength);
    let activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
    let nextStack = activeStack.concat([route]);
    route.hash = getRouteHash(route)
    let destIndex = nextStack.length - 1;
    let nextAnimationConfigStack = activeAnimationConfigStack.concat([
      this.props.configureScene(route),
    ]);
    this._emitWillFocus(nextStack[destIndex]);
    this.setState({
      routeStack: nextStack,
      sceneConfigStack: nextAnimationConfigStack,
      currentSceneName: route.hash
    }, () => {
      this._enableScene(destIndex);
      this._transitionTo(destIndex, null, null, cb);
    });
  },

  _popN: function(n) {
    if (n === 0) {
      return;
    }
    invariant(
      this.state.presentedIndex - n >= 0,
      'Cannot pop below zero'
    );
    let popIndex = this.state.presentedIndex - n;
    this._enableScene(popIndex);
    var route = this.state.routeStack[popIndex]
    this._emitWillFocus(route);
    this._transitionTo(
      popIndex,
      null, // default velocity
      null, // no spring jumping
      () => {
        this._cleanScenesPastIndex(popIndex);
      }
    );
  },

  pop: function() {
    if (this.state.transitionQueue.length) {
      // This is the workaround to prevent user from firing multiple `pop()`
      // calls that may pop the routes beyond the limit.
      // Because `this.state.presentedIndex` does not update until the
      // transition starts, we can't reliably use `this.state.presentedIndex`
      // to know whether we can safely keep popping the routes or not at this
      //  moment.
      return;
    }

    if (this.state.presentedIndex > 0) {
      this._popN(1);
    }
  },

  /**
   * Replace a route in the navigation stack.
   *
   * `index` specifies the route in the stack that should be replaced.
   * If it's negative, it counts from the back.
   */
  replaceAtIndex: function(route, index, cb) {
    invariant(!!route, 'Must supply route to replace');
    if (index < 0) {
      index += this.state.routeStack.length;
    }

    if (this.state.routeStack.length <= index) {
      return;
    }

    let nextRouteStack = this.state.routeStack.slice();
    let nextAnimationModeStack = this.state.sceneConfigStack.slice();
    nextRouteStack[index] = route;
    nextAnimationModeStack[index] = this.props.configureScene(route);

    if (index === this.state.presentedIndex) {
      this._emitWillFocus(route);
    }
    this.setState({
      routeStack: nextRouteStack,
      sceneConfigStack: nextAnimationModeStack,
    }, () => {
      if (index === this.state.presentedIndex) {
        this._emitDidFocus(route);
      }
      cb && cb();
    });
  },

  /**
   * Replaces the current scene in the stack.
   */
  replace: function(route) {
    this.replaceAtIndex(route, this.state.presentedIndex);
  },

  /**
   * Replace the current route's parent.
   */
  replacePrevious: function(route) {
    this.replaceAtIndex(route, this.state.presentedIndex - 1);
  },

  popToTop: function() {
    this.popToRoute(this.state.routeStack[0]);
  },

  popToRoute: function(route) {
    let indexOfRoute = this.state.routeStack.indexOf(route);
    invariant(
      indexOfRoute !== -1,
      'Calling popToRoute for a route that doesn\'t exist!'
    );
    let numToPop = this.state.presentedIndex - indexOfRoute;
    this._popN(numToPop);
  },

  replacePreviousAndPop: function(route) {
    if (this.state.routeStack.length < 2) {
      return;
    }
    this.replacePrevious(route);
    this.pop();
  },

  resetTo: function(route) {
    invariant(!!route, 'Must supply route to push');
    this.replaceAtIndex(route, 0, () => {
      // Do not use popToRoute here, because race conditions could prevent the
      // route from existing at this time. Instead, just go to index 0
      if (this.state.presentedIndex > 0) {
        this._popN(this.state.presentedIndex);
      }
    });
  },

  getCurrentRoutes: function() {
    // Clone before returning to avoid caller mutating the stack
    return this.state.routeStack.slice();
  },

  _cleanScenesPastIndex: function(index) {
    let newStackLength = index + 1;
    // Remove any unneeded rendered routes.
    if (newStackLength < this.state.routeStack.length) {
      this.setState({
        sceneConfigStack: this.state.sceneConfigStack.slice(0, newStackLength),
        routeStack: this.state.routeStack.slice(0, newStackLength),
      });
    }
  },

  _renderScene: function(route, i) {
    let disabledSceneStyle = null;
    let disabledScenePointerEvents = 'auto';
    if (i !== this.state.presentedIndex) {
      disabledSceneStyle = styles.disabledScene;
      disabledScenePointerEvents = 'none';
    }
    return (
      <View
        key={'scene_' + i}
        ref={'scene_' + i}
        onStartShouldSetResponderCapture={() => {
          return (this.state.transitionFromIndex != null) || (this.state.transitionFromIndex != null);
        }}
        pointerEvents={disabledScenePointerEvents}
        style={[styles.baseScene, this.props.sceneStyle, disabledSceneStyle]}>
        {this.props.renderScene(
          route,
          this
        )}
      </View>
    );
  },

  _renderNavigationBar: function() {
    if (!this.props.navigationBar) {
      return null;
    }
    return React.cloneElement(this.props.navigationBar, {
      ref: (navBar) => {
        this._navBar = navBar;
      },
      navigator: this,
      navState: this.state,
    });
  },

  render: function() {
    let newRenderedSceneMap = new Map();
    let me = this;
    let scenes = this.state.routeStack.map((route, index) => {
      let renderedScene;
      if (this._renderedSceneMap.has(route) &&
          index !== this.state.presentedIndex) {
        renderedScene = this._renderedSceneMap.get(route);
      // } else if (1 || me.state.presentedIndex - index >= 0 && me.state.presentedIndex - index <= 1) {
      } else if (1){
        renderedScene = this._renderScene(route, index);
      } else {
        return null
      }
      newRenderedSceneMap.set(route, renderedScene);
      return renderedScene;
    });
    this._renderedSceneMap = newRenderedSceneMap;
    return (
      <View style={[styles.container, this.props.style]}>
        <View
          style={styles.transitioner}
          {...this.panGesture.panHandlers}
          onTouchStart={this._handleTouchStart}
          onResponderTerminationRequest={
            this._handleResponderTerminationRequest
          }>
          {scenes}
        </View>
        {this._renderNavigationBar()}
      </View>
    );
  },

  _getNavigationContext: function() {
    if (!this._navigationContext) {
      this._navigationContext = new NavigationContext();
    }
    return this._navigationContext;
  }
});

Navigator.isReactNativeComponent = true;

module.exports = Navigator;
