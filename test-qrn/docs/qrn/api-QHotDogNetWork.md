## QHotDogNetWork 大客户端网络请求API

> API兼容性：   
> QRN:v1.0.0-RC  
> iOS:80011115   
> Android:60001130   

`QHotDogNetWork`为JS提供了使用大客户端网络请求的api，使用方法如下:
```js
import {QHotDogNetWork} from 'qunar-react-native';

//如果需要使用APP中配置的 hotdog 地址,则 requestParam 中不设置 url 属性
var requestParam = {
	serviceType:'',  //网络请求type,serviceType和url不能同时为空
	url:'',          //网络请求url(默认为APP中设置的hotdog 地址),serviceType和url不能同时为空
	param:{},        //网络请求参数
	useCache:true,   //是否可以使用cache, true或者false
	cacheKey:'',     //cacheKey,如果useCache为true则cacheKey不能为空

	successCallback:(response)=>{},    //网络请求成功的回调
	cacheCallback:(response)=>{},      //网络请求从cache返回的回调
	failCallback:()=>{},               //网络请求失败的回调
}

//发起网络请求，返回该网络请求的requestID
var requestID = QHotDogNetWork.postRequest(requestParam);

//取消网络请求
QHotDogNetWork.cancelNetWorkTask(requestID);

```
