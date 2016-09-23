var CSSPropertyOperations = require('react/lib/CSSPropertyOperations');
var fixTransform = require('StyleSheet').fixTransform

function convertTransform(style) {
    var result = {}
    for (var k in style) {
        if (k.indexOf('transform') !== 0) {
            result[k] = style[k];
        } else {
            result['transform'] = result['transform'] || []
            if (k === 'transform') {
                result['transform'] = result['transform'].concat(style[k].join ? style[k] : [style[k]])
            } else {
                result['transform'].push({
                    matrix3d: style['transformMatrix'].join(',')
                })
            }
        }
    }
    if (result['transform']) {
        var transform = result.transform
        delete result['transform']
        fixTransform({
            transform: transform
        }, result)
    }
    return result;
}

function setNativeProps(node, props, component) {
    for (var name in props) {
        if (name === 'style') {
            CSSPropertyOperations.setValueForStyles(node, convertTransform(props[name]), component);
        } else {
            node.setAttribute(name, props[name]);
            if (node.props) node.props[name] = props[name] // 也必须更新到props上，不然input不能用
        }
    }
}

module.exports = setNativeProps;
