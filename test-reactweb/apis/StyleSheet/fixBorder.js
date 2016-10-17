/* 
 * 如果用户只是指定border某个样式,需要补上其他样式
 */


var borderNames = {
    borderColor: true,
    borderWidth: true,
    borderTopColor: true,
    borderRightColor: true,
    borderBottomColor: true,
    borderLeftColor: true,
    borderTopWidth: true,
    borderRightWidth: true,
    borderBottomWidth: true,
    borderLeftWidth: true
}

function fixBorderValue(style, result) {
    if (!style.borderStyle && !result.borderStyle) {
        result.borderStyle = 'solid'
    }

    if (!style.borderColor && !result.borderColor) {
        result.borderColor = 'black'
    }
  
}

module.exports = {
    names: borderNames,
    handle: fixBorderValue
}
