/**
 * @providesModule Clipboard
 */

var ReactPromise = require('ReactPromise')
require('babel-runtime/regenerator/runtime')


/**
 * Clipboard API
 *
 * @component Clipboard
 * @example ./Clipboard.js
 * @description 提供从剪切板读取和设置数据的接口, 由于 Safari 不支持 `document.execCommand("copy")` 因此,该 API 在 Safari 上不能使用。
 */
 var Clipboard = {
    __value: '',
    // must return promise

    /**
     * @method getString
     * @description 得到剪切板中的内容，这个方法返回一个 `Promise`。
     */
    getString: function() {
        return new ReactPromise(function(resolve, reject) {
            resolve(Clipboard.__value)
        })
    },

    /**
     * @method setString
     * @param  {string} text 需要写入剪切板的字符串
     * @return {boolean} isSuccess  操作是否成功
     */
    setString: function(text) {
        if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                Clipboard.__value = text;
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                require('Toast').show('复制失败')
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        } else {
            require('Toast').show('复制失败')
            return false
        }
    },
 }

 module.exports = Clipboard
