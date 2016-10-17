// get element x, y
function getCumulativeOffset(obj) {
    var left = obj.offsetLeft,
        top = obj.offsetTop;

    obj = obj.offsetParent;
    while (obj){
        left += obj.offsetLeft;
        top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return {
        x: left,
        y: top
    };
}

// this functions returns the x, y, width and height of a given dom node
function getLayout(element) {
    var rect = getCumulativeOffset(element);
    return {
        x: rect.x,
        y: rect.y,
        width: element.offsetWidth,
        height: element.offsetHeight
    };
}

module.exports = getLayout;
