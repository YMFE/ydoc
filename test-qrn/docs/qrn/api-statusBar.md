## QStatusBar 设置状态栏

> API兼容性：   
> QRN:v1.0.0   
> iOS:80011117   
> Android:60001134   

`QStatusBar`用来控制状态栏的效果     

`QStatusBar`仅支持设置`qunar-react-native`统一封装的QRCTViewController或者Activity
## 引入

``` js
import { QStatusBar } from 'qunar-react-native';
```

## API

<blockquote class="api">
<strong>QStatusBar.setHidden</strong>
<span>(hidden:bool, callBack: function, errCallBack: function)</span>
</blockquote>
设置是否隐藏导航栏，hidden为true时隐藏   
设置成功则调用callBack，设置失败则调用errCallBack


<blockquote class="api">
<strong>QStatusBar.setStyle</strong>
<span>(style:string, callBack: function, errCallBack: function)</span>
</blockquote>
设置导航栏样式（仅iOS支持）style为'light'或者'default'   
设置成功则调用callBack，设置失败则调用errCallBack



## 示例
```js
'use strict';

import {
    QStatusBar,
    Platform
} from 'qunar-react-native';

//如果需要在页面一进入的时候就设置的话可以在页面的 render() 方法中调用下面的设置
var isIOS = Platform.OS === 'ios';

//隐藏状态栏
QStatusBar.setHidden(true,
    () => {
        //隐藏成功
    }, (error) => {
        console.log(error.message);
    });

//隐藏状态栏
QStatusBar.setHidden(false,
    () => {
        //显示成功
    }, (error) => {
        console.log(error.message);
    });

//设置iOS状态栏颜色为白色
if (isIOS) {
    QStatusBar.setStyle('light',
        () => {
          //设置成功
        }, (error) => {
            console.log(JSON.stringify(error));
        });
}

//设置iOS状态栏颜色为默认黑色
if (isIOS) {
    QStatusBar.setStyle('default',
        () => {
          //设置成功
        }, (error) => {
            console.log(JSON.stringify(error));
        });
}



```
