#### 简介

插件名：`globalContext`

全局工具类插件，本地存储组件。本插件提供两种版本的本地存储，请根据使用环境选择。

#### 使用方式

##### 1. 直接使用localStorage

> QApp.util.storage(key[, value])

说明：存/取/删除单条数据

* 获取数据：只有 **一个参数** 时，为`get`方法。
* 设置数据：有 **多个参数** 时，为`set`方法；第二个参数 `value` 支持任何类型的值。
* 删除数据：`value` 为 `undefined` 或 `null` 为删除操作。

> QApp.util.storage.clear();

说明：清除所有数据

##### 2. 使用globalContext

**使用场景：**

SPA/多webview项目里，数据传递、数据共享等运行时数据。

**注意事项：**

该种存取数据的方法来源于SPA项目：在一个页面中，经常有一些运行时数据来进行数据传递或共享，所以是存放在内存中的。但是，到了大客户端/独立客户端的 `多webview` 时代， webview之间无法共享内存，所以在webview之间这些运行时数据需要通过localStorage来进行中转。即：这些数据在单个webview/SPA内还是存储在内存中，而在页面之间，通过localStorage将这些数据重新同步到不同的内存中。之所以没有用localStorage来直接取代内存，是因为ls的读写是阻塞式的读写文件，对于一些存取频繁的数据进行操作，效率还是较差。

**重要：**在多webview环境时，需要在初始化的时候，通过 `QApp.util.globalContext.addLocalKeys` 来指定哪些数据是需要在webview之间传递的，本插件会自动来进行数据同步。


> QApp.util.globalContext.addLocalKeys(key)

说明：添加需要在webview之间同步的数据的key

> QApp.util.globalContext.set(key, value)

说明：设置数据

> QApp.util.globalContext.get(key)

说明：获取数据

> QApp.util.globalContext.merge(key, value)

说明：merge数据

> QApp.util.globalContext.remove(key)

说明：删除一条数据

> QApp.util.globalContext.clear(key)

说明：清空所有数据
