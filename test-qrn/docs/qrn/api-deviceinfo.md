## DeviceInfo  设备和App信息

> API兼容性：   
> QRN:v1.0.0-RC   
> iOS:80011115   
> Android:60001130   

`DeviceInfo` 可以用来获取App的信息

## 引入
```js
import {DeviceInfo} from 'qunar-react-native';
```

## 数据结构
```js
DeviceInfo = {
	isIOS: bool, //是否是iOS
	isAndroid: bool, //是否是android
	vid: string, //app vid  
	pid: string, //app pid
	cid: string, //渠道号
	uid: string, //设备唯一号
	sid: string, //服务器下发的标示
	gid: string, //服务器为每个设备下发的唯一编号
	mac: string, //mac地址，在iOS7之前用来替代UDID，iOS7后，该接口永远返回 02:00:00:00:00:00
	model: string, //设备信息，返回为iPhone 5s (GSM)、iPhone 6 Plus等，可以用来对特定的设备优化
	manufacturer: string, //制造商信息，返回apple、huawei等
	platform: string, //手机平台，返回iOS或者android
	osVersion: string, //手机系统版本号，比如9.3等
	scheme: string, //当前APP的Scheme跳转协议头，如qunariphone、qunaraphone等
	qrn_version: sting, //Qunar React Native 版本，四月底版本为v1.0.0-RC

	//iOS:80011117 Android:60001134 新增API
	releaseType: string //Qunar React Native lib类型，Android可能为dev、beta和release，iOS可能为beta和release
}
```

## 示例
```js
import {DeviceInfo} from 'qunar-react-native';

//app平台是否是iOS或者android，返回true或者false
var isIOS = DeviceInfo.isIOS;
var isAndroid = DeviecInfo.isAndroid;


var vid = DeviceInfo.vid;	//app vid
var pid = DeviecInfo.pid;	//app pid
var cid = DeviceInfo.cid;	//渠道号
var uid = DeviceInfo.uid;	//设备唯一号
var sid = DeviceInfo.sid;	//服务器下发的标示
var gid = DeviceInfo.gid;	//服务器为每个设备下发的唯一编号

//mac地址，在iOS7之前用来替代UDID，iOS7后，该接口永远返回 02:00:00:00:00:00
var mac = DeviceInfo.mac;		

//设备信息，返回为iPhone 5s (GSM)、iPhone 6 Plus等，可以用来对特定的设备优化
var model = DeviceInfo.model;

var manufacturer = DeviceInfo.manufacturer;	//制造商信息，返回apple、huawei等
var platform = DeviceInfo.platform;			//手机平台，返回iOS或者android
var osVersion = DeviceInfo.osVersion; 		//手机系统版本号，比如9.3等

var scheme = DeviceInfo.scheme;	// 当前APP的Scheme跳转协议头，如qunariphone、qunaraphone等

var qrn_version = DeviceInfo.qrn_version; 	//Qunar React Native 版本，四月底版本为v1.0.0-RC

var releaseType = DeviceInfo.releaseType; //Qunar React Native Lib版本 线上为release
```
