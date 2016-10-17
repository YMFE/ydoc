/**
 * @providesModule FontLoader
 * @excludeModules QImageSet,QFontSet
 */

'user strict'
var fontSet = {...require('PlatformFontSet'), ...require('QFontSet')} || {}

var fontStyle = []
for (var font in fontSet) {
    fontStyle.push('@font-face{font-family:' + font + ';src:url("' + fontSet[font].replace(/^http:/g, "") + '") format("truetype")}')
}
require('StyleSheet').inject(fontStyle.join('\n'))
