/**
 * 
 * 处理react native自定义的paddingHorizontal, paddingVertical, 
 * marginHorizontal, marginVertical这些样式
 */
function fixBoxName(name, value, result) {
    // 样式的顺序会决定优先级 !! - 可能会跟react-native不一致
    var padding = 'padding'
    var margin = 'margin'
    var horizontal = 'Horizontal'
    var vertical = 'Vertical'
    var type = name.indexOf(margin) === 0 ? margin : padding;
    var directionType = name.indexOf(vertical) !== -1 ? vertical : horizontal

    if (directionType === horizontal) {
        result[type + 'Left'] = result[type + 'Right'] = value
    } else if (directionType === vertical) {
        result[type + 'Top'] = result[type + 'Bottom'] = value
    }
}

module.exports = {
    names: {
        paddingHorizontal: true,
        paddingVertical: true,
        marginHorizontal: true,
        marginVertical: true
    },
    handle: fixBoxName
} 