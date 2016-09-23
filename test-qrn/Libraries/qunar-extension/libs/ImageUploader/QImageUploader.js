// -*- mode: web; -*-

var QRCTImageUploader = require('NativeModules').QRCTImageUploader;

class QImageUploader {

    /**
       uploadImage

       @description upload image identified by `uri` to a server.

       @param uri: string
         the uri of the image.
       
       @param options: object {
         // server address. [required]
         serverAddress: string,
         
         // additional HTTP form params to post. [optional]
         serverParams: object,
         
         // form key corresponding the image file in the http form. [optional]
         fileKey: string,
         
         // max image width. defaults to 0, indicating full resolution. [optional]
         maxWidth: number,
         
         // max image height. defaults to 0, indicating full resolution. [optional]
         maxHeight: number,
         
         // image compression quality. should be in (0, 100]. [optional]
         quality: number
       }

       @param callback: function(response: string)
         success callback. `response` is all output from the server.
         you may use `JSON.stringify` to parse this data if the server outputs a JSON.

       @param errorCallback: function(error: nativeError)
         error callback.
     */
    static uploadImage(uri, options, callback, errorCallback) {
        var _options = options || {};
        var _callback = callback || (()=>{});
        var _errorCallback = errorCallback || (()=>{});
        
        QRCTImageUploader.uploadImage(uri, _options, _callback, _errorCallback);
    }
}

module.exports = QImageUploader;
