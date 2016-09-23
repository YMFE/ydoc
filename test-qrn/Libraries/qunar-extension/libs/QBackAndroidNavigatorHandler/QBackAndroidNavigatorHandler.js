/**
 * @providesModule QBackAndroidNavigatorHandler
 */

let _navigatorMaxIndex = -1;
let _currentViewSubscription = null;

module.exports = {
  setViewHandler: handler => {
    _currentViewSubscription = typeof handler === 'function' ? handler : null;
  },

  maxIndexIncrease: () => ++_navigatorMaxIndex,
  maxIndexDecrease: () => _navigatorMaxIndex--,

  handle: (nav) => () => {
    // 如果不是坠上面的 vc，那就不用管了
    if (nav.navigatorIndex !== _navigatorMaxIndex) {
      return false;
    }

    // 直接在 currentScene 上设置回调（一般会被 redux 的 Connect 组件隔断）
    var currentScene = nav._getCurrentScene();
    if (currentScene && currentScene.onBackPressed && currentScene.onBackPressed()) {
      return true;
    }

    // 调用 ext 设置的当前回调
    if (typeof _currentViewSubscription === 'function' && _currentViewSubscription()) {
      return true;
    }

    if (nav.state.presentedIndex > 0) {
      nav.pop();
      return true;
    }
    return false;
  }
};
