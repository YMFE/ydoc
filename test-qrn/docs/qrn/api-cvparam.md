## CVParam 获取cv参数

> API兼容性：   
> QRN:v1.0.0   
> iOS:80011117   
> Android:60001134   

`CVParam`用来获取CV参数

## 引入

``` js
import { CVParam } from 'qunar-react-native';
```


## API
<blockquote class="api">
<strong>CVParam.getCVParam</strong>
<span>(vparam:object, callBack: function, errCallBack: function)</span>
</blockquote>

获取CV参数，结果由回调提供

## 示例
```js
import { CVParam } from 'qunar-react-native';

//第一个参数必须包含t参数
CVParam.getCVParam({t:'tParam'}, data=>{
	data.vParam; //v参数
	data.cParam; //c参数
}, err=>{
	
})
```
