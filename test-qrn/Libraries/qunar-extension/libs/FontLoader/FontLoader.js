/**
 * @providesModule FontLoader
 * @excludeModules QImageSet,QFontSet
 */

'use strict';

var platformFontSet = require('PlatformFontSet');
var qFontSet = require('QFontSet');
var fontSet = {...platformFontSet, ...qFontSet};

var nativeFontLoader = require('NativeModules').IconFontManager;

if(fontSet && Object.keys(fontSet).length>0){
    nativeFontLoader.performLoadFonts(fontSet);
}
