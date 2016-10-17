var fixUnit = require('./fixUnit')

var array = ['shadowOffset', 'shadowRadius', 'shadowColor']
function fixBoxShadow(style, result) {
    var value = []
    delete style['shadowOpacity'] //浏览器不支持
    array.forEach(function (name, index) {
        var v = style[name]           
        if(!!v){
            if(name === 'shadowOffset'){
                value[0] = fixUnit(v.width || 0, 'width')
                value[1] = fixUnit(v.height || 0, 'height')
            }else{
                value.push(fixUnit(v, name))
            }
            delete style[name]
        }
    })
    result.textShadow = value.join(' ')
}

module.exports = {
    names: {
        shadowOffset: true,
        shadowRadius: true,
        shadowColor: true,
        shadowOpacity: true
    },
    handle:fixBoxShadow
}