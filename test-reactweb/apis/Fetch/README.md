# Fetch API

Fetch API 旨在用来简化 HTTP 请求，它包含以下类和方法：

+ fetch 方法：用于发起 HTTP 请求
+ Request 类：用来描述请求
+ Response 类：用来表示响应
+ Headers 类：用来表示 HTTP 头部信息

## 基本用法

fetch 方法接受一个表示 url 的字符串或者 一个 Request 对象作为参数，返回 Promise 对象。请求成功后将结果封装为 Response 对象。Response 对象上具有 `json`、`text` 等方法，调用这些方法后可以获得不同类型的结果。Response 对象上的这些方法同样返回 Promise 对象。

因此基本的使用方法如下：

```javascript
// 发起请求
fetch('https://api.github.com/repos/facebook/react').then(function(res){
    // 请求成功，得到 response 对象，调用 response 对象的 json 方法并返回
    return res.json();
}).then(function(data){
    // response 对象的 json 方法执行成功，得到结果
    console.log(data)
});
```

更多高级用法和配置，详见下面介绍。

## fetch 方法

fetch 方法的第一个参数可以是 Request 对象，也可以是一个 url，第二个参数可选，包含一些配置信息。fetch 方法返回 Promise。

```
Promise fetch(String url [, Object options]);
Promise fetch(Request req [, Object options]);
```

配置信息包含下列内容：

+ method：请求的方法，如： GET、 POST
+ headers：请求头部信息，可以是一个 Headers 对象的实例，也可以是一个简单对象
+ body: 需要发送的数据，可以是 Blob, BufferSource, FormData, URLSearchParams, 或者 USVString。需要注意的是 GET 和 HEAD 方法不能包含 body。
+ mode：请求的模式，常见取值如下：
  + same-origin：只允许同源的请求，否则直接报错
  + cors：允许跨域，但要求响应中包含 `Access-Control-Allow-*` 这类表示 CORS 的头部信息，且响应中只有部分头部信息（ `Cache-Control`, `Content-Language`, `Content-Type`, `Expires`, `Last-Modified`, `Pragma`）可以读取，但响应内容可以不受限地读取。
  + no-cors：允许跨域请求那些响应中没有包含 CORS 头信息的域，但是响应内容是不可读取的。使用使用这种模式配合 ServiceWorkers 可以实现预加载一些资源。
+ credentials：表示是否发送 cookie，有三个可选值 omit, same-origin, include
  + omit：不发生 cookie
  + same-origin： 仅在同源时发生 cookie
  + include：发送 cookie
+ cache：表示处理缓存的策略，可选值为  `default`、`no-store`、`reload`、`no-cache`、`force-cache`、`only-if-cached`，关于此可以参考[https://fetch.spec.whatwg.org](https://fetch.spec.whatwg.org/#concept-request-cache-mode)
+ redirect：发生重定向时候的策略。有以下可选值：
  + follow：跟随
  + error：发生错误
  + manual：需要用户手动跟随
+ referrer： 一个字符串，可以是 no-referrer, client, 或者是一个 URL。默认值是 client。
+ integrity：包含一个用于验证子资源完整性的字符串。关于此，可以参看 [Subresource Integrity 介绍](https://imququ.com/post/subresource-integrity.html)


该函数返回一个 Promise 对象，若请求成功会用 Response 的实例作为参数调用 resolve ，若请求失败会用一个错误对象来调用 reject。


## Headers 类

Headers 类用来表示 HTTP 的头部信息，其构造函数可以接受一个表示 HTTP 头信息的对象，也可以接受一个 Headers 类的实例作为对象：

```javascript
var header = new Headers({
  'Content-Type': 'image/jpeg',
  'Accept-Charset': 'utf-8'
});

var anotherHeader = new Headers(header);
```
### Headers 实例的方法

#### append

对一个字段追加信息，如果该字段不存在，就创建一个。

```javascript
var header = new Headers();
header.append('Accept-Encoding', 'deflate');
header.append('Accept-Encoding', 'gzip');
// Accept-Encoding: ['deflate', 'gzip']
```

#### delete

删除某个字段

#### get

获得某个字段的第一个值

```javascript
var header = new Headers();
header.append('Accept-Encoding', 'deflate');
header.append('Accept-Encoding', 'gzip');

header.get('Accept-Encoding'); //=> 'deflate'
```

#### getAll

获得某个字段所有的值

```javascript
var header = new Headers();
header.append('Accept-Encoding', 'deflate');
header.append('Accept-Encoding', 'gzip');

header.getAll('Accept-Encoding'); //=> ['deflate', 'gzip']
```

#### has

判断是否存在某个字段

#### set

设置一个字段，如果该字段已经存在，那么会覆盖之前的。

#### forEach

遍历所有的字段，接受一个回调函数，和可选的第二个参数。可选的第二个参数地值作为回调函数的 this 值。

```javascript
var header = new Headers();
header.append('Accept-Encoding', 'deflate');

header.forEach(function(value, name, header){
  //...
},this);
```

## Request 类

Request 对象用于描述请求内容。构造函数接受的参数和 fetch 函数的参数形式一样，实际上 fetch 方法会使用传入的参数构造出一个 Request 对象来。

下面例子从 github 抓取到 react 的 star 数并打印出来。

```javascript
var req = new Request('https://api.github.com/repos/facebook/react',{
  method:'GET'
});

fetch(req).then(function(res){
  return res.json()
}).then(function(data){
  console.log(data.stargazers_count)
});
```

### Request 实例的属性

*以下属性均为只读属性。这些属性的意义均在上面介绍 fetch 的参数的时候有过说明。*

+ method
+ url
+ headers
+ referrer
+ referrerPolicy：处理来源信息的策略，关于此可以参见[Referrer Policy](https://w3c.github.io/webappsec-referrer-policy/)
+ mode
+ credentials
+ redirect
+ integrity
+ cache

## Response 类

Response 用来表示 HTTP 请求的响应。其构造函数形式如下：

```javascript
var res = new Response(body, init);
```

其中 body 可以是：

+ Blob
+ BufferSource
+ FormData
+ URLSearchParams
+ USVString

init 是一个对象，其中包括以下字段：

+ status：响应的状态码，比如 200，404
+ statusText：状态信息，比如 OK
+ headers: 头部信息，可以是一个对象，也可以是一个 Headers 实例

### Response 实例的属性

*以下属性均为只读属性*

+ bodyUsed：用于表示响应内容是否有被使用过
+ headers：头部信息
+ ok：表明请求是否成功，当响应的状态码是 200~299 时，该值为 true
+ status：状态码
+ statusText：状态信息
+ type：表明了响应的类型，可能是下面几种值：
  + basic： 同源
  + cors：跨域
  + error：出错
  + opaque：Request 的 mode 设置为 `no-cors` 的时候响应式不透明了，这个时候 type 为 `opaque`
+ url：响应的地址

### Response 实例的方法

+ clone：复制一个响应对象

要想从 Response 的实例中拿到最终的数据需要调用下面这些方法，这些方法都返回一个 Promise 并且使用对应的数据类型来 resolve。

+ arrayBuffer：把响应数据转化为 arrayBuffer 来 resolve
+ blob：把响应数据转换为 Blob 来 resolve
+ formData：把响应数据转化为 formData 来 resolve
+ json：把响应数据解析为对象后 resolve
+ text：把响应数据当做字符串来调用 resolve
