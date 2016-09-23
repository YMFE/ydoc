# Fetch - Ext Plugin

## 简介

基于原生 `fetch` 方法提供了便于用户使用的封装，提供了中间件、抽象请求等一系列便于用户使用的方式。

## 使用

fetch 是一个独立插件，需要单独安装。安装方式：

```js
npm install @qnpm/react-native-ext-fetch --save --registry=http://registry.npm.corp.qunar.com/
```

之后在项目中引用一下即可：

```js
import '@qnpm/react-native-ext-fetch'

// 也可以用这种方式
import cf from '@qnpm/react-native-ext-fetch'
```

之所以不叫 `fetch` 是为了和 RN 实现的原生 fetch 方法进行区分。

基本与 `fetch` 的行为相同，传入参数并返回一个 Promise 对象。使用中有微小的区别在于：

1. 原生的 `fetch` 方法，第一个参数要么为 url，要么为 Request 对象。这里我们允许只传递一个配置项，将 url 放入 `url` 参数中即可。
1. 统一使用 `body` 字段进行参数传递。在原生的 `fetch` 方法中，是不允许用户给 GET/HEADER 这两种没有请求体的请求传入 `body` 字段的，但这里为了方便使用，我们允许传入并进行正常解析。
1. 自动解析响应头的 `Content-Type` 字段，解析响应格式，目前仅支持 json。

```js
const f = React.Ext.utils.fetch;
let param = {
    page: 1,
    pageSize: 10
}

f({
    url: '/api/query',
    body: param
});

// 对比原生 fetch 的方法
fetch(`/api/query?page=${param.page}&pageSize=${param.pageSize}`);
```

## 增强

### requestType 与 responseType

支持用户传入 `requestType` 和 `responseType` 字段，前者表示请求体的格式，后者表示响应体的格式，分别会修改请求首部字段的 Content-Type 与 Accept。

这里我们根据 `requestType` 字段自动对用户传入的 body 进行转换，目前仅支持 json 和 x-www-form-urlencoded，分别对应 `'json'` 和 `'form'`。

我们还根据 `responseType` 的设定来解析响应体，它的优先级高于自动检测响应体的 Content-Type。目前仅支持 json，如果不是 json 则返回 response 对象。

这里的 body 可以直接传入普通对象，fetch 方法会自动进行 `JSON.stringify` 之类的转换。

### cache false

支持便捷设置 cache false，等于给 headers 设定 Cache-Control: no-cache。

### 中间件

支持传入一些统一处理请求数据和响应数据的中间件，中间件直接对数据对象进行操作，中间如果抛出异常，或者返回一个异常，都会被捕获，并以此为原因 reject 掉本 fetch。

```js
const f = React.Ext.utils.fetch;

// 中间件：统一处理请求参数
f.request(req => req.url = `http://uedx.qunar.com/api${req.url}`);
// 中间件：统一处理响应解决，抛出异常
f.response(res => {
    if (!res.ret) {
        throw new Error(res.errmsg || '请求错误');
    }
});

f(...).then(...).catch(...)
```

### redux 增强

redux 默认支持 promise 的中间件，当 `action.payload` 参数为 promise 对象时，`dispatch` 方法返回改 promise，且在 promise then 之后执行 `dispatch` 方法。如果该 promise 被解决，将解决的值赋给 `action.payload`；如果被拒绝，将拒绝原因赋值给 `action.payload`，使 `action.error = true`。

### promise 增强

为原生 promise 补充 `done`, `fail` 和 `always` 等常用方式。

### abort 支持

对 `fetch` 添加 `cancel` 方法。具体使用如下：

```js
const cf = Ext.utils.fetch;
const def = cf('http://hello.world.com');

def.then(res => {
    // ...do something
}).catch(err => {
    // cancel 时会进到 catch 中，cancel 传的内容就是 catch 的参数
    // 比如下面的 cancel 之后，err 就是 123
});

def.cancel(123);    
```

**注意**：仅 fetch 返回的 promise 拥有 `cancel` 方法！下面的调用就是错误的：

```js
const cf = Ext.utils.fetch;
const def = cf('http://hello.world.com')
    .then(res => {
        // ...do something
    }).catch(err => {
        // cancel 时会进到 catch 中，cancel 传的内容就是 catch 的参数
        // 比如下面的 cancel 之后，err 就是 123
    });

def.cancel(123);    
```

### timeout 支持

支持传入 timeout 时间，已毫秒为单位：

```js
const cf = Ext.utils.fetch;

cf('http://hello.world.com', { timeout: 1000 })
    .catch(err => alert(err)); // 如果请求超时，err 是 TypeError('Network request timeout')
```
