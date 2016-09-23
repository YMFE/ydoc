/** -*- mode: web; -*-
 *
 * NativeScrollComponentMixin
 *
 * 为需要响应拖动原生组件（MapView、Picker等）提供的Mixin，防止它们在位于ScrollView中时触摸事件被ScrollView拦截
 *
 * @providesModule NativeScrollComponentMixin
 **/

'use strict';

var NativeScrollComponentMixin = {
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onResponderTerminationRequest: () => false
};

module.exports = NativeScrollComponentMixin;
