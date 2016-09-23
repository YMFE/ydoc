## CameraRoll 相册库和拍照API
> API兼容性：   
> QRN:v1.0.0-RC   
> iOS:80011115   
> Android:60001130   

`CameraRoll`模块提供了访问本地相册的功能，可以获取用户的相册，并支持拍照和保存照片到相册

## 引入
```js
import { CameraRoll } from 'qunar-react-native';
```
## 数据结构
`getPhotosFromGroup`方法第二个参数照片选项的参数结构参见`getPhotosParamChecker`:
```js

/**
 * Shape of the param arg for the `getPhotosFromGroup` function.
 */
var getPhotosParamChecker = createStrictShapeTypeChecker({
  /**
   *  需要获取最近照片的数目
   **/
  first: ReactPropTypes.number.isRequired,

  /**
   * 指定从哪一张照片开始获取，这个参数可以通过上次调用 getPhotosFromGroup 
   * 的返回值 getPhotosReturnChecker.edges.page_info.end_cursor获得，
   * 也可以指定任意一个获取图片的 image.uri
   */
  after: ReactPropTypes.string,
});

```
`getPhotosFromGroup`成功获取到的照片后返回的对象结构参见`getPhotosReturnChecker`:
```js
/**
 * Shape of the return value of the `getPhotosFromGroup` function.
 */
var getPhotosReturnChecker = createStrictShapeTypeChecker({
  edges: ReactPropTypes.arrayOf(createStrictShapeTypeChecker({
    node: createStrictShapeTypeChecker({
      type: ReactPropTypes.string.isRequired,
      group_name: ReactPropTypes.string.isRequired,
      image: createStrictShapeTypeChecker({
        uri: ReactPropTypes.string.isRequired,
        height: ReactPropTypes.number.isRequired,
        width: ReactPropTypes.number.isRequired,
        isStored: ReactPropTypes.bool,
      }).isRequired,
      timestamp: ReactPropTypes.number.isRequired,
      location: createStrictShapeTypeChecker({
        latitude: ReactPropTypes.number,
        longitude: ReactPropTypes.number,
        altitude: ReactPropTypes.number,
        heading: ReactPropTypes.number,
        speed: ReactPropTypes.number,
      }),
    }).isRequired,
  })).isRequired,
  page_info: createStrictShapeTypeChecker({
    has_next_page: ReactPropTypes.bool.isRequired,
    start_cursor: ReactPropTypes.string,
    end_cursor: ReactPropTypes.string,
  }).isRequired,
});

```
## API

<blockquote class="api">
<strong>CameraRoll.getPhotoGroups</strong>
<span>( callBack: function, errCallBack: function)</span>
</blockquote>
获取用户相册信息    
callBack返回相册数组,获取失败调用errCallBack


<blockquote class="api">
<strong>CameraRoll.getPhotosFromGroup</strong>
<span>( albumId: string, getPhotosParamChecker, callBack: function, errCallBack: function)</span>
</blockquote>
获取指定albumId相册中的照片        
获取成功，则callBack返回照片列表信息,否则调用errCallBack

<blockquote class="api">
<strong>CameraRoll.takePhotoAndSave</strong>
<span>( callBack: function, errCallBack: function)</span>
</blockquote>
跳转到拍照界面并拍照  
如果拍照成功，则callBack返回已保存到照片信息,否则调用errCallBack

<blockquote class="api">
<strong>CameraRoll.savePhoto</strong>
<span>(uri: string, callBack: function, errCallBack: function)</span>
</blockquote>
将内存中的照片保存到相册中（仅iOS支持）  
如果保存成功，则callBack返回保存后到uri,否则调用errCallBack


<blockquote class="api">
<strong>CameraRoll.deletePhotoInMemory</strong>
<span>( uri: string, callBack: function, errCallBack: function)</span>
</blockquote>
删除内存中的照片 （仅iOS支持）       
如果删除成功，则调用callBack,否则调用errCallBack



## 示例
```js
import { CameraRoll } from 'qunar-react-native';

/**
 * 获取相册列表
 * 成功回调中能够接收到相册列表数组
 */
CameraRoll.getPhotoGroups(albums => {
    //获取相册成功，albums为相册列表数组
    //每个相册信息为{id:相册id,name:相册名称,count:照片数量,coverImage:封面照片uri}
    albums = albums.filter((album) => album.count > 0);//过滤掉没有照片的相册
}, err => {
    console.log(err.message);
});


/**
 * 从相册中获取照片列表
 * 第一个参数为相册id，第二个参数为获取照片选项,页面下方有详细说明
 */
CameraRoll.getPhotosFromGroup(
    album.id, {first: album.count},
    albumData => {
        //照片列表，返回照片的信息
    },
    err => {
        //获取失败
        console.log(err.message);
    }
);


//拍照并存储到相册中，返回照片的信息
CameraRoll.takePhotoAndSave(
    photo => {
        //photo={uri:'ph://EE1C7799-F6E9-42A6-ADBE-88F4FB0C9236/L0/001',width:1024,heigth:2048}
        //photo.uri 	照片uri
        //photo.width	照片宽度
        //photo.height	照片高度
    }, err => {
        //失败，返回失败的原因
        console.log(err.message);
    }
);

//保存CameraView拍摄的照片到相册中(andorid暂不支持)
//CameraView.takePhoto方法获取到的照片是存储于内存中的，调用这个方法传入该uri即可将照片保存到相册中
CameraRoll.savePhoto(uri, (savedImageURI) => {
    //savedImageURI为成功保存到相册后照片的uri
}, (error) => {
	//失败，返回失败的原因
    console.log(err.message);
})

//删除CameraView拍摄的位于内存中的照片，传入CameraView获得的uri(andorid暂不支持)
CameraRoll.deletePhotoInMemory(uri, () => {
    //删除成功
}, err => {
    //删除失败
    console.log(err.message);
})
```
  