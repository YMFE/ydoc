

var cssName = require('./cssName')

//补丁程序

var fixUnit = require('./fixUnit')
var fixBorder = require('./fixBorder')
var fixFlexBox = require('./fixFlexBox')
var fixTransform = require('./fixTransform')
var fixBoxShadow = require('./fixBoxShadow')
var fixPaddingMargin = require('./fixPaddingMargin')


function isValidValue(value) {
    return value !== '' && value !== null && value !== true && value !== undefined
}


function fixStyleSheet(style) {
    var result = {}

    for (var name in style) {
        var value = style[name]
        if (isValidValue(value)) {
            // 先后经过 6 个补丁程序
            // 前三个针对多个样式一起处理
            if (fixBorder.names[name] && !style.fixBorder) {
                fixBorder.handle(style, result)
                style.fixBorder = true
            } else if (fixBoxShadow.names[name]) {
                if (!style.fixBoxShadow) {
                    fixBoxShadow.handle(style, result)
                    style.fixBoxShadow = true
                }
                continue
            } else if (fixTransform.names[name] && !style.fixTransform) {
                fixTransform.handle(style, result)
                style.fixTransform = true
                continue
            }


            // 后三个针对单个样式进行处理
            if (fixFlexBox.names[name]) {
                fixFlexBox.handle(name, value, result)
            } else if (fixPaddingMargin.names[name]) {
                fixPaddingMargin.handle(name, value, result)
            } else {
                value = fixUnit(value, name)
                name = cssName(name) || name
                result[name] = value
            }
        }

    }
    return result
}

module.exports = fixStyleSheet