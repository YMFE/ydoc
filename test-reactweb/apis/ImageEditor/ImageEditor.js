/*
 * @providesModule ImageEditor
 */



/**
 * ImageEditor 接口
 * @version >= v1.4
 * @component ImageEditor
 * @example ./ImageEditor.js[1-100]
 * @description ImageEditor 提供React Native `ImageEditor` API的web实现,用来修剪图片
 *
 */

let ImageStore = require('ImageStore');

let ImageEditor = {
    /**
     * @method cropImage
     * @type function
     * @param {string} uri 图片资源地址
     * @param {Object} cropData 修剪参数
     * @param {function} success 成功回调函数
     * @param {function} failure 失败回调函数
     * @description  修剪图片，如果修剪成功，则返回成功的回调函数，该图片会自动保存在ImageStore中，并返回一个uri以供调用。修剪失败则返回失败的回调函数
     *
     * **注意** 当不再需要该图片时，请手动将其从ImageStore中删除。
     *
     * cropData 的数据结构为
     *  
     * ```javascript
     * {
     *    offset:{x:number,y:number},
     *    size:{width:number,height:number},
     *    displaySize:{width:number,height:number}, //可选
     *    resizeMode:Enum<'contain','cover','stretch'>  //可选
     * }
     * ```
     *
     */
    cropImage(uri,cropData,success,failure){
        let canvas = document.createElement('canvas');
        canvas.setAttribute('width',cropData.size.width);
        canvas.setAttribute('height',cropData.size.height);

        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = uri;
        img.onload = ()=>{
            ctx.drawImage(img, -cropData.offset.x, -cropData.offset.y, cropData.size.width, cropData.size.height);
            let base64Data = canvas.toDataURL();
            // console.log(base64Data)
            ImageStore.addImageFromBase64(base64Data,(uri)=>{
                success && success(uri);
            },(error)=>{
                failure && failure(error);
            })
            canvas = null;
        }
        
    }
}


module.exports = ImageEditor;


