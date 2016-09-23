## ImageUploader 图片上传API
> API兼容性：   
> QRN:v1.0.0-RC   
> iOS:80011115   
> Android:60001130   

`ImageUploader`用来上传图片，使用方法如下:
```js
import {ImageUploader} from 'qunar-react-native';

//imageUri 为image的标识，可以通过CameraRoll从图库选择或者从相机获取
var imageUri = 'ph://EE1C7799-F6E9-42A6-ADBE-88F4FB0C9236/L0/001';

//上传参数
var options = {
                serverAddress: 'http://wap.qunar.com',
                serverParams: {
                    token: token
                },
                fileKey: 'Filedata',
                maxWidth: 1200,
                maxHeight: 1200,
                quality: 90
             },;

//上传api
ImageUploader.uploadImage(imageUri,options,(responseData)=>{
	//上传成功，responseData中为上传成功后服务器返回的数据
},err=>{
	//上传失败
})
```

具体支持的上传参数中包含了图片压缩的参数，图片压缩参数均为选填，压缩图片会保持原始图片的长宽比，不填则默认传原图   

参数				|  类型	|	说明
:----			|:----:	|	:----
`serverAddress` |string	|	上传服务器地址
`serverParams`	|object	| 	上传时传给服务器的参数,可选
`fileKey`		|string	|	默认为file,可选
`maxWidth`		|number	|	图片压缩后的最大像素宽度,可选
`maxHeight`		|number	|	图片压缩后的最大像素高度,可选
`quality`		|number	|	图片压缩的质量,范围是1-100,100为不压缩,可选