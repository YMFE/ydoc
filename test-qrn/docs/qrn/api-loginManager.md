## LoginManager 用户登录状态和登陆跳转API

> API兼容性：    
> QRN:v1.0.0-RC     
> iOS:80011115   
> Android:60001130   

`LoginManager`用来获取用户是否登录的状态和登录信息，如果没有登录，还可以跳转到登录页面

## 引入
```js
import { LoginManager } from 'qunar-react-native';
```
## 数据结构
```js
用户信息userData
userData = {
	userName: string, //用户名
	userID: string, //用户Qunar唯一标识
	userEmail: string, //用户Email，已经做过展示加密处理  
	userNickname: string, //用户的昵称
	userAvatar: string, //头像url
	userUserID: string, //用户UUID
}
```
## API

<blockquote class="api">
<strong>LoginManager.getLoginInfo</strong>
<span>( callBack: function, errCallBack: function)</span>
</blockquote>
获取用户登录状态   
如果用户已经登录，则callBack返回用户信息,否则调用errCallBack


<blockquote class="api">
<strong>LoginManager.login</strong>
<span>( callBack: function, errCallBack: function)</span>
</blockquote>
跳转到登录界面  
如果用户登录成功，则callBack返回用户信息,否则调用errCallBack



## 示例

```js
import {LoginManager, Alert } from 'qunar-react-native';

//获取用户登录状态
LoginManager.getLoginInfo((userData) => {
    //已经登陆，返回用户信息userData
}, (error) => {
    //如果用户没有登录，则跳转到用户登录界面
	LoginManager.login((userData) => {
    	//登录成功，返回用户信息userData
	}, (error) => {
    	//登录失败
	});
});


```
 
