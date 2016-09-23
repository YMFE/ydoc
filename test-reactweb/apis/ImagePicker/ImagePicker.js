/*
 * @providesModule ImagePicker
 */


/**
 * ImagePicker 接口
 * @version >= v1.4
 * @component ImagePicker
 * @example ./ImagePicker.js[1-100]
 * @description ImagePicker 提供React Native `ImagePicker` API的web实现,用来实现web与相册和摄像头的交互
 *
 *  **注:** Hy模式中，依赖于`QunarAPI.chooseImage`,H5模式中，依赖于Html接口。
 *
 */



let React = require('react-native');
let ImageStore = require('ImageStore');

let ImagePicker = {
    _input:null,
    _openSelectOrDialog(config,successCallback,cancelCallback){
        if(!this._input){
            this._input = document.createElement('input');
            this._input.setAttribute('type','file');
            this._input.setAttribute('accept','image/*');
            this._input.addEventListener('change',(event)=>{
                readBlobAsDataURL(event.target.files[0],(data)=>{
                    ImageStore.addImageFromBase64(data,(uri)=>{
                        successCallback && successCallback(uri);
                        ImageStore.removeImageForTag(uri);
                    },cancelCallback)
                })
                this._input = null;
            })
        }
        this._input.click();
    },

    /**
     * @method canRecordVideos
     * @type function
     * @param {function} callback 回调函数
     * @description  是否可以调用录像功能，返回值为false（不支持）
     */
    canRecordVideos(callback){
        callback && callback(false);
    },

    /**
     * @method canUseCamera
     * @type function
     * @param {function} callback 回调函数
     * @description  是否可以调用相机，返回值为true（支持）
     */
    canUseCamera(callback){
        callback && callback(true); 
    },

    /**
     * @method openCameraDialog
     * @type function
     * @param {object} config 配置函数
     * @param {function} successCallback 成功的回调函数，参数为`uri`,可作为Image的source调用。
     * @param {function} callback 失败的回调函数
     * @description  打开相机，拍照成功后调用successCallback
     */
    openCameraDialog(config,successCallback,cancelCallback){
        let that = this;
        QunarAPI.checkJsApi({
            jsApiList: ['chooseImage'],
            success(res){        
                if(res.chooseImage || (res.checkResult && res.checkResult.chooseImage)){
                    QunarAPI.chooseImage({
                        sourceType: ['camera'],  
                        success (res) {
                            successCallback && successCallback(res.localIds[0]);
                        },
                        fail(error){
                            error.message = error.errMsg || error.errmsg
                            cancelCallback && cancelCallback(error);
                        }
                     });
                }else{
                    that._openSelectOrDialog(config,successCallback,cancelCallback);
                }
            }
        });
    },
    /**
     * @method openSelectDialog
     * @type function
     * @param {object} config 配置函数
     * @param {function} successCallback 成功的回调函数，参数为`uri`或者是`[uris]`,可作为Image的source调用。
     * @param {function} callback 失败的回调函数
     * @description  打开相册，选择相册成功后调用successCallback
     *
     * **注意：** web模式下只能选择一张图片，Hy模式下可选择多张，为何rn保持统一，分别返回string和array，请注意兼容。
     */
    openSelectDialog(config,successCallback,cancelCallback){
        let that = this;
        QunarAPI.checkJsApi({
            jsApiList: ['chooseImage'],
            success(res){        
                if(res.chooseImage || (res.checkResult && res.checkResult.chooseImage)){
                    QunarAPI.chooseImage({
                        sourceType: ['album'],  
                        success (res) {
                            successCallback && successCallback(res.localIds);
                        },
                        fail(error){
                            error.message = error.errMsg || error.errmsg
                            cancelCallback && cancelCallback(error);
                        }
                     });
                }else{
                    that._openSelectOrDialog(config,successCallback,cancelCallback);
                }
            }
        });     
    }
}

function readBlobAsDataURL(blob, callback) {
    let reader = new FileReader();
    reader.onload = (e) => {
        callback(e.target.result);
        reader = null;
    };
    reader.readAsDataURL(blob);
}


module.exports = ImagePicker;


