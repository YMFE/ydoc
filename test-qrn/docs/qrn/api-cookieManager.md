## CookieManager 管理cookie相关的API

> API兼容性：   
> QRN:v1.0.0-RC     
> iOS:80011115   
> Android:60001130   


`CookieManager`可以用来获取、设置和删除指定的cookie，支持的api如下:

## 引入
```js
import { CookieManager } from 'qunar-react-native';
```

## 数据结构
```js
Cookie = {
    key: string, //cookie的key值
    value: string, //cookie对应该key的value值
    domain:string, //cookie的Domain值
    path:string, //cookie的Path值
    expires:string, //cookie的Expires值
    secure:string, //是否使用secure的bool值
    httpOnly:string, //是否httpOnly的bool值
}
```
## API

<blockquote class="api">
<strong>CookieManager.getCookieForKey</strong>
<span>( key:string, url: string, callBack: function, errCallBack: function)</span>
</blockquote>
根据key、和url获取指定的Cookie   
获取成功则callBack返回Cookie,否则调用errCallBack


<blockquote class="api">
<strong>CookieManager.setCookie</strong>
<span>( cookie: Cookie, callBack: function)</span>
</blockquote>
设置cookie   
如果设置完成调用callBack

<blockquote class="api">
<strong>CookieManager.removeCookieForKey</strong>
<span>( key: string, url: string, callBack: function)</span>
</blockquote>
根据key和url移除cookie    
移除完成调用callBack

<blockquote class="api">
<strong>CookieManager.removeCookie</strong>
<span>( cookie: Cookie, callBack: function)</span>
</blockquote>
移除指定的cookie, 根据cookie的key、domain和path判断需要删除的cookie      
移除完成调用callBack


## 示例
```js
import {CookieManager, Alert} from 'qunar-react-native';

//获取对应key和url的cookie信息,第一个参数为key，第二个参数为url  
CookieManager.getCookieForKey('QN1', 'http://wap.qunar.com',
    (cookie) => {
    //获取cookie成功
        Alert.alert(JSON.stringify(cookie));
    }, (error) => {
    //获取cookie失败
        Alert.alert(error.message);
    });


//设置cookie，cookie必须包含key、domain和value
var cookie = {key: 'QN1',domain: '.qunar.com',value: 'valueResult'};
CookieManager.setCookie(cookie,()=> {
	Alert.alert('设置成功');
});


//移除特定key和url的cookie,第一个参数为key,第二个参数为url
CookieManager.removeCookieForKey('QN1','http://.qunar.com',()=> {
	Alert.alert('清除成功');
});

//移除指定的cookie, 根据cookie的key、domain和path判断需要删除的cookie
var cookie2 = {key: 'QN1',domain: '.qunar.com',path: '/'};
CookieManager.removeCookie(cookie2,()=> {
	Alert.alert('删除成功');
});

```
