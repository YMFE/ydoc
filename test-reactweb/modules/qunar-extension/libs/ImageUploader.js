/*
 * @providesModule ImageUploader
 */

/*global Image, atob, Blob, FileReader*/


const querystring = require('qs');

const defaultOptions = {
    serverAddress: '',
    serverParams: {},
    fileKey: 'file',
    maxWidth: Infinity,
    maxHeight: Infinity,
    quality: 100
};


/**
 * ImageUploader 模块
 *
 * @component ImageUploader
 * @version >= v1.4
 * @example ./ImageUploader.js
 * @description ImageUploader 是一个用于图片上传的组件。在上传中的时候可以配置最大尺寸，
 * 超出尺寸的图片将会按比例进行缩放。这里是 QRN 中 ImageUploader 来 web 上的实现, 功能上和 QRN 中的 ImageUploader
 * 有很大不同, 在 touch 页面上，上传的资源仅限于 HTML 概念上的 img, 当然这个 img 可以是一个 url、一个 img 元素或者通过 input
 * 得到的 file。
 */
const ImageUploader  = {
    /**
     * 图片上传方法, 调用此方法进行图片上传
     *
     * @property uploadImage
     * @type function
     * @param {string|file|img} target 需要上传的目标, 可以是图片的 url、一个 image 元素、 一个从 input 中打开的图片 file
     * @param {object} options 上传时的配置信息
     * @param {function} onSuccess 上传成功时的回调
     * @param {function} onError 上传失败时的回调
     * @description uploadImage 是真正用来上传的图片的方法，该方法接受 4 个参数，可以参见下面的方法参数
     * 列表，于第二个参数 options 是一个对象，用来配置上传相关的信息，其中可选的配置项如下表所示：
     *
     * |参数|类型|说明|
     * |:--|:--|:---|
     * |serverAddress|string |后端提供的上传服务器地址|
     * |serverParams | object |上传时传给服务器的参数,可选|
     * |fileKey | string |该参数用于确定图片在 formData 中的键值，默认为file|
     * |maxWidth | number | 图片压缩后的最大像素宽度,可选|
     * |maxHeight | number | 图片压缩后的最大像素高度,可选|
     * |quality | number | 图片压缩的质量,范围是1-100,100为不压缩,可选|
     *
     * #### 关于跨域资源
     *
     * 可以通过 url 和 img 标签上传, 但也有一些限制, 由于 url 和 img 最终都被转换为了 formData
     * 来进行传输, 在转换为 formData 的时候需要将图片转换为 base64 再转换为 blob 进而得到 formData,
     * 这个过程中第一个步骤需要将图片绘至 canvas 中, 再使用 toDataURL 方法得到 base64, 但该方法不
     * 允许对跨域资源使用。所以关于上传的图片, 下列细节需要注意:
     *
     * + 如果是 url，需要保证该 url 对应的图片资源允许跨域。
     * + 如果是 img 元素, 需要保证该图片添加了 `crossOrigin` 属性，你需要将该属性设置为 `Anonymous` 形如这样:
     * `<img src="http://xxx.com/xxx.jpg" crossOrigin="Anonymous" >` 且保证其 src
     * 对应的图片资源允许跨域。
     * + 从 type 为 file 的 input 中打开的图片不存在跨域问题。
     */
    uploadImage: function(target, options, onSuccess, onError){
        options = {...defaultOptions ,...options};
        options.onSuccess = onSuccess;
        options.onError = onError;

        if (typeof target === 'string'){
            let image = new Image();
            image.setAttribute('crossOrigin', 'Anonymous');
            image.src = target;
            image.onload = function(){
                upload(image, options);
            };
            image.onerror = function(){
                onError && onError(new Error('图片下载失败, 请确认 url 的正确性'));
            };
        } else if (target.nodeType === 1){
            upload(target, options);
        } else {
            let r = /(jpg)|(jpeg)|(gif)|(bmp)|(png)$/i;
            if (!r.test(target.type)) {
                onError && onError(new Error('仅接受格式为: jpg | jpeg | gif | bmp | png 的图片'));
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(target);
            reader.onload = function(){
                let image = new Image();
                image.src = reader.result;
                image.onload = function(){
                    upload(image, options);
                };
            };
        }
    }
};


/**
 * 压缩图片,返回一个图片的 base64 编码
 * @param image
 * @param options - 配置信息, 包含图片的大小, 质量
 */
function imageToBase64(image, options){
    let width = options.width,
        height = options.height;
    let originWidth = image.width,
        originHeight = image.height;
    let canvasWidth, canvasHeight;
    // 图片的大小超出范围, 需要进行成比例缩放
    if (originHeight > height || originWidth > width){
        let imageAspectRatio = originWidth / originHeight,
            maxRangeAspectRatio = width / height;
        // 原图的宽高比小于最大范围的宽高比
        if (imageAspectRatio < maxRangeAspectRatio){
            canvasHeight = height;
            canvasWidth = height * imageAspectRatio;
        } else {
            canvasWidth = width;
            canvasHeight = width / imageAspectRatio;
        }
    } else {
        canvasWidth = originWidth;
        canvasHeight = originHeight;
    }

    let canvas = document.createElement('canvas'),
        cxt = canvas.getContext('2d');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    cxt.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    return canvas.toDataURL('image/jpeg', options.quality / 100);
}

/**
 *
 * @param base64 需要转化的 base64 字符串
 * @returns {Blob}
 */
function base64ToBlob(base64){
    let byteString = atob(base64.split(',')[1]),
        mimeString = base64.split(';')[0].split(':')[1];

    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
        type: mimeString
    });
}

/**
 * 上传图片
 *
 * @param image - 需要上传的图片
 * @param options - 上传需要的配置信息
 */
function upload(image, options) {
    let base64;
    try {
        base64 = imageToBase64(image, {
               width: options.maxWidth,
               height: options.maxHeight,
               opacity: options.opacity
           });
    } catch (e) {
        options.onError && options.onError(new Error('请保证图片资源的正确性'));
        return;
    }

    let blob = base64ToBlob(base64),
        formData = new FormData();
    formData.append(options.fileKey, blob);

    let url = options.serverAddress + '?' + querystring.stringify(options.serverParams);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.responseType = 'json';
    xhr.onload = function() {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
            options.onSuccess && options.onSuccess(xhr.response);
        } else {
            options.onError && options.onError(new Error('网络错误，状态码：' + xhr.status));
        }
    };
    xhr.onerror = function() {
        options.onError && options.onError(new Error('网络请求错误'));
    };
    xhr.send(formData);
}


module.exports = ImageUploader;
