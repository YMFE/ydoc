/*
 * @providesModule CameraRoll
 */


/**
 * CameraRoll 相册库和拍照API
 *
 * @component CameraRoll
 * @description `CameraRoll`模块提供了访问本地相册的功能，是`qunar-react-native`的`CameraRoll`的web实现，仅支持部分。
 *
 *  **注意** 由于平台限制，只提供部分功能实现，本模块依赖于`ImagePicker`,可移步至ImagePicker查看。
 *
 */


let  ImagePicker = require('ImagePicker');

let e = {
    message: "暂不支持"
};

module.exports = {
  /**
   * @method getPhotoGroups
   * @type function
   * @param {function} successCallback 成功回调
   * @param {function} failCallback 失败回调
   * @description 获取相册列表的信息，目前web下无法选择相册列表，可以选择具体某一张相片，参考`ImagePicker`的`openSelectDialog`
   */
    getPhotoGroups: function(successCallback, failCallback){
      failCallback && failCallback({
          message: '暂不支持'
      });
    },
    getPhotosFromGroup: function(albumId, getPhotosParamChecker, successCallback, failCallback){
        failCallback && failCallback({
            message: '暂不支持'
        });
    },
    /**
     * @method takePhotoAndSave
     * @type function
     * @param {function} successCallback 成功回调
     * @param {function} failCallback 失败回调
     * @description 跳转到拍照界面并拍照,如果拍照成功，则callBack返回已保存到照片信息,否则调用errCallBack
     *
     * successCallback参数为`{uri:'',width:num,height:num}`,依赖于`ImagePicker.openCameraDialog`
     */
    takePhotoAndSave: function(successCallback, failCallback){
        ImagePicker.openCameraDialog({},(uri)=>{
            let image = new Image();
            image.src = uri;
            image.onload = function(){
              let photo = {
                uri:uri,
                width:image.width,
                height:image.height,
              }
              successCallback && successCallback(photo);
            }
        },failCallback);
    },
    savePhoto: function(uri, successCallback, failCallback){
        failCallback && failCallback({
            message: '暂不支持'
        });
    },
    deletePhotoInMemory: function(uri, successCallback, failCallback){
        failCallback && failCallback({
            message: '暂不支持'
        });
    },
};
