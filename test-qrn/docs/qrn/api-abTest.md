## ABTest  获取ABTest所需信息

> API兼容性：   
> QRN:v1.0.0      
> iOS:80011117   
> Android:60001134   

`ABTest` 获取ABTest所需信息，[点击查看ABTest Wiki](http://wiki.corp.qunar.com/pages/viewpage.action?pageId=114429300)

## 引入
```js
import {ABTest} from 'qunar-react-native';
```

## 数据结构
```js
获取到的ABTestInfo
ABTestInfo = {
	ab_type: ab_type,      //策略类型
	ab_achieve: ab_achieve  //策略信息
}
```
## API

<blockquote class="api">
<strong>ABTest.abTest</strong>
<span>(abId: string, simpleName: string, callBack: function, errCallBack: function)</span>
</blockquote>
获取ABTest相关的信息
abId 为


## 示例
```js
import {ABTest} from 'qunar-react-native';

var abId = 'id'; //实验ID
var simpleName = 'vcName'; //使用该策略信息的来源(e.g. : vc name or class name),用于记录Log.

ABTest.abTest(abId, simpleName, 
	(ABTestInfo)=>{
		//获取成功的回调
		ABTestInfo.ab_type;  //策略类型
		ABTestInfo.ab_achieve;  //策略信息
	},(err)=>{
		//获取失败的回调
		console.log(err.message);
	});
```
