/*
 * @providesModule AppState
 */

/**
 * @component AppState
 * @example ./AppState.js
 * @description AppState 能告诉你应用当前是运行在前台还是后台，以及在状态变化时通知你。在
 *  web 端，应用的状态一直保持为 `active`。你可以使用 `AppState.currentState` 来获取当前
 * 的状态。
 *
 * 注：对于 Android 和 iOS 应用可能有下面几种状态：
 * - active - 应用正在前台运行
 * - background - 应用正在后台运行。用户既可能在别的应用中，也可能在桌面。
 * - inactive - 这是一个过渡状态，不会在正常的React Native应用中出现。
 */
var AppState = {
    addEventListener: function(argument) {},
    removeEventListener: function(argument) {},
    currentState: 'active'
}
module.exports = AppState;
