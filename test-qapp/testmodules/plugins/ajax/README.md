#### 简介

插件名称: `ajax` (适配 jQuery 风格，集成 jsonp 和 ajax
    
插件配置: `{Object}`

基本配置如下:

    {
        "charset": "UTF-8",
        "timeout": 30 * 1000,
        "argsType": "query",
        "method": "get",
        "isEncode": false,
        "responseType": "json",
        "withCredentials": false
    }

配置参数：

* `url`: `{String}` 请求地址。
* `bizType`: `{String}` 业务中默认参数设置。默认 `false` 。
* `charset`: `{String}` 编码。默认 `UTF-8` 。
* `timeout`: `{Number}` 请求超时时间。默认 `30 * 1000` 。
* `data`: `{Object}` 请求参数。
* `argsType`: `{String}` 请求参数类型。可选值：`query` 和 `json`。默认 `query` 。
* `method`: `{String}` 请求方式。默认 `get` 。
* `headers`: `{Object}` 请求头信息。
* `isEncode`: `{Boolean}` 否是编码。默认 `false` 。
* `dataType`: `{String}` 返回数据的数据类型。默认 `json` 。
* `cache`: `{Boolean}` 是否允许缓存。默认 `false` 。
* `withCredentials`: `{Boolean}` 是否带有验证信息。默认 `false` 。
* `jsonp`: `{String}` 为 jsonp 请求重写回调函数名对应的 key。这个值用来替代在 url 中"callback=?"的"callback"部分。
* `jsonpCallback`: `{String}` 为 jsonp 请求指定一个回调函数名。这个值将用来取代自动生成的随机函数名。
* `success`: `{Function}` 请求成功后的函数调用。
* `error`: `{Function}` 请求失败后的函数调用。
* `onAbort`: `{Function}` 取消请求后的函数调用。
* `onFail`: `{Function}` 请求失败后的函数调用。

#### 添加的方法

> QApp.ajax.setBizOptions(key, opt)

说明：设置业务的基本参数

参数：

* `key`: `{String|Object}` 业务参数关键字。当key类型为字符串时，以key-value的形式进行设置；key类型为Object时，将对象作为参数对象进行添加
* `opt`: `{String|Undefined}` 业务参数值

> QApp.ajax.addMock(key, mock)

说明：mock数据

参数：

* `key`: `{String|Object}` key类型为String时，为mock数据的关键字；key的类型为Object时，表示mock数据对象。
* `mock`: `{Object}` mock数据

> QApp.ajax.addReqFilter(filter)

说明：添加请求参数的过滤函数

参数：

* `filter`: `{Function}` 过滤函数

> QApp.ajax.removeReqFilter(filter)

说明：移除某个请求时的过滤参数

参数：

* `filter`: `{Function}` 过滤函数

> QApp.ajax.addRespFilter(filter)

说明：添加数据的过滤函数

参数：

* `filter`: `{Function}` 过滤函数

> QApp.ajax.removeRespFilter(filter)

说明：移除数据的过滤函数

参数：

* `filter`: `{Function}` 过滤函数


#### 使用示例

    // 在defineView时，plugins 内添加 ajax
    // 正常的 ajax 请求
    var ajaxDeferred = self.ajax({
        url: requestURL
    }).done(function (data) {
        // TODO
    }).fail(function () {
        // TODO
    }).all(function (){
        // TODO
    })


    // 取消
    ajaxDeferred.trans.abort()

##### 本地mock数据

`QApp-plugin-ajax` 插件提供本地 mock 数据的功能，使用方法:

    // 添加 mock 数据方式
    // QApp.ajax.addMock("key", data); or
    QApp.ajax.addMock({
        "key" : data
    });

    self.ajax({
        mockKey: "key",
        mock: true,
        url: requestURL
    }).done(function (data) {
     // TODO
    });

##### 添加过滤函数

    // 添加请求过滤函数
    QApp.ajax.addReqFilter(function(opt, deferred) {
        // 如果通过 view.ajax 方式使用 ajax，
        // 通过以下方式获取 view
        // opt.__view
    })


    // 添加数据过滤函数
    QApp.ajax.addRespFilter(function(data, err, opt, deferred) {
        if (err) {
            switch(err.type) {
                case 'Timeout':
                    // 超时
                    break;
                case 'Abort':
                    // 取消
                    break;
                case 'Fail':
                    // 失败
                    break;
                default:
                    // 其他。目前只有上面三种出错情况
            }
        }
    })
