<!-- TODO: EventEmitter API -->

# EventEmitter

EventEmitter 是 RN 中事件机制的一个实现。 RN 使用它的一个实例 `RCTDeviceEventEmitter` 和 Native 传递事件。

## 引入

要接收 Native 传来的事件，使用已经创建好的实例 `RCTDeviceEventEmitter`。
``` js
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
```

## API

<blockquote class="api">
<strong>EventEmitter.addListener</strong>
<span>( eventType: String, listener: function, context: ?Object )</span>
</blockquote>

添加一个事件监听，当发送`eventType`事件时，触发`listener`。如果传入`context`参数，则在回调时将`context`绑定到`this`。

返回一个`subscription`对象，用于清除监听。

<blockquote class="api">
<strong>EventEmitter.once</strong>
<span>( eventType: String, listener: function, context: ?Object )</span>
</blockquote>

添加一个事件监听，回调一次后自动清除监听。如果传入`context`参数，则在回调时将`context`绑定到`this`。

返回一个`subscription`对象，用于清除监听。

<blockquote class="api">
<strong>EventEmitter.removeAllListeners</strong>
<span>( eventType: String )</span>
</blockquote>

清除`eventType`事件的所有监听。

为避免影响到业务其他部分的逻辑，不推荐使用此方法。

<blockquote class="api">
<strong>EventEmitter.removeCurrentListener</strong>
<span>()</span>
</blockquote>

当触发事件回调时，调用此方法清除当前正在回调的监听。

<blockquote class="api">
<strong>EventEmitter.removeSpecificListener</strong>
<span>( subscription: EmitterSubscription )</span>
</blockquote>

清除指定的监听。`subscription`参数是`addListener`或`once`的返回值表示的监听对象。

<blockquote class="api">
<strong>EventEmitter.listeners</strong>
<span>( eventType: String )</span>
</blockquote>

返回指定事件的所有监听。

<blockquote class="api">
<strong>EventEmitter.emit</strong>
<span>( eventType: String, ... )</span>
</blockquote>

发送一个事件。

## Native API


