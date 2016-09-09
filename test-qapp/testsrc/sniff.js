/**
 * 环境嗅探
 *
 * @property QApp.sniff
 * @type {Object}
 * @category Sniff
 * @value {os: 'ios', ios: true, android: false, iphone: true, ipad: false, ipod: false, imobile: true, osVersion: '8.1.2', osVersionN: 8, pixelRatio: 2, retina: true, pc: false}
 */
var _sniff = (function() {

    @import "https://raw.githubusercontent.com/YMFE/ySniff/master/ySniff.js"

    return ySniff;
})();
