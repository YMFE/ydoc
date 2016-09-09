## Toast 自动消失的信息提示框
> API兼容性：   
> QRN:v1.0.0-RC   
> iOS:80011115   
> Android:60001130   

`Toast`是一个简短的信息提示框，可以在一定的时间内进行显示，一段时间后自动消失。   
可以定制显示的位置和持续的时间，效果如下图所示： 
<div align="middle">
<img src="images/api-toast.png" width="400"   />
</div>
使用方法如下:
```js
import {Toast} from 'qunar-react-native';

//显示的内容
var message = '提示的内容';	

//持续时间,可以使用默认的时间Toast.SHORT、Toast.LONG
//iOS 中 SHORT 对应 0.4s, LONG对应 1s
//Android 中 SHORT 对应 2s, LONG对应 3.5s
//也可以直接给出数字,单位为ms,比如800表示0.8s (Android不支持直接设置时间)
var duration = Toast.SHORT;	

/**
 *	显示的位置 (Android这个参数暂不生效)
 *	可以使用默认的位置Toast.TOP、Toast.BOTTON和Toast.MIDDLE
 *	也可以直接指定距离屏幕顶端的偏移量,如200表示Toast中心距离屏幕顶端200px
 *	为了美观Toast和屏幕边缘会有一个距离，上图中就是Toast.TOP的例子
 */
var offSet = Toast.MIDDLE;	//显示的位置，也可以使用Toast.TOP、Toast.BOTTON

//显示
Toast.show(message, duration, offSet);

//v1.3.0开始支持下面简化的调用方法，显示在屏幕中间~
Toast.show(message)
```