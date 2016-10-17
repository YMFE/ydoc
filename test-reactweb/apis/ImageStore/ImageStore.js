/*
 * @providesModule ImageStore
 */


/**
 * ImageStore 接口
 * @version >= v1.4
 * @component ImageStore
 * @example ./ImageStore.js[1-100]
 * @description ImageStore 提供React Native `ImageStore` API的web实现
 *
 * 注意：该方法耗费内存，所以当使用完时请手动调用`removeImageForTag`方法。
 */


let ImageStore = {
    _store:{},

    /**
     * @method hasImageForTag
     * @type function
     * @param {string} uri 存储图片uri
     * @param {function} callback 回调函数，图片存在于ImageStore中，参数为1，不存在参数为0.
     * @description  检测uri是否存在于ImageStore中
     */
    hasImageForTag(uri,callback){
        callback && callback(this._store[uri] ? 1 : 0);
    },

    /**
     * @method removeImageForTag
     * @type function
     * @param {string} uri 图片uri
     * @description  从ImageStore中删除该图片
     */
    removeImageForTag(uri){
        delete this._store[uri];
    },

    /**
     * @method addImageFromBase64
     * @type function
     * @param {string} base64ImageData 图片base64格式
     * @param {function} success 成功的回调函数，参数为该图片的uri
     * @param {function} failure 失败的回调函数
     * @description  将一个base64格式的图片存储在ImageStore中，并返回该图标的uri，你可以在页面中引用并渲染该图片。
     *
     */
    addImageFromBase64(base64ImageData,success,failure){
        try{
            let imageBlob = dataURLtoBlob(base64ImageData);
            if (imageBlob === false) return failure && failure('不支持')
            let URL = window.URL || window.webkitURL;
            let imgURL = URL.createObjectURL(imageBlob);
            this._store[imgURL] = base64ImageData;
            success && success(imgURL);
        }catch(e){
            failure && failure(e);
        }
    },

    /**
     * @method getBase64ForTag
     * @type function
     * @param {string} uri 存储图片uri
     * @param {function} success 成功的回调函数，参数为存储在ImageStore中的base64位格式。
     * @param {function} failure 失败的回调函数
     * @description  通过uri得到ImageStore中与之关联的base64位格式
     */
    getBase64ForTag(uri,success,failure){
        if(this._store[uri]){
            success && success(this._store[uri])
        }else{
            failure && failure({message:'没有相关数据'})
        }
    }

}

function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','),
        mime,
        data;
    if(arr.length > 1){
        mime = arr[0].match(/:(.*?);/)[1];
        data = arr[1];
    }else{
        mime = 'image/png';
        data = arr[0];
    }
    let bstr = atob(data),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    var img = false
    try {
        img = new Blob([u8arr], {type:mime});
    } catch(e) {
        window.BlobBuilder = window.BlobBuilder || 
                             window.WebKitBlobBuilder || 
                             window.MozBlobBuilder || 
                             window.MSBlobBuilder;
        if(e.name == 'TypeError' && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(u8arr.buffer);
            img = bb.getBlob(mime);
        } else if(e.name == "InvalidStateError") {
            // InvalidStateError (tested on FF13 WinXP)
            img = new Blob( [u8arr.buffer], {type : mime});
        }
    }
    return img
}

module.exports = ImageStore;
