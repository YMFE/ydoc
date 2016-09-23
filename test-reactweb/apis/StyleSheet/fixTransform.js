/* 
 * react native的transform属性对应一个对象数组
 * http://facebook.github.io/react-native/docs/transforms.html#proptypes
 *   [
 *      {scaleX: 2},
 *      {scaleY: 2}
 *   ] => scaleX(2) scaleY(2)
 */
var cssName = require('./cssName')
var fixUnit = require('./fixUnit')

function fixTransform(style, result) {
    var name = 'transform'
    var value = style[name]
    if (Array.isArray(value)) {
        var transformations = []
        value.forEach(function (transformation) {

            var key = Object.keys(transformation)[0]
            var val = transformation[key]
            // for animated value
            if (val.__getValue) {
              val = val.__getValue()
            }
            if (Array.isArray(val)) {

                var len = val.length

                if ((key === 'matrix' && len === 16) || 
                        (key === 'translate' && len === 3)) {
                    key += '3d'
                }

                val = val.map(function (v) {
                    return fixUnit(v, key)
                }).join(',')

            } else {
                val = fixUnit(val, key)
            }
            transformations.push(key + '(' + val + ')')
        });
        name = cssName(name) || name
        result[name] = transformations.join(' ')
    } else if (typeof value == 'string') {
        result[name] = value
    }
}

module.exports = {
    names: {
        transform: true
    },
    handle: fixTransform
}
