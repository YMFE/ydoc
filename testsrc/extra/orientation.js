var supportsOrientationChange = "onorientationchange" in win,
    // orientationEvent = supportsOrientationChange ? "orientationchange" : "resize",
    orientationEvent = "resize", // 由于 orientationchange 在安卓机器上有兼容性问题，所以统一用 resize
    _orientation = _createEventManager(),
    getOrientation = function(size) {
        return size.width > size.height ? 'landscape' : 'portrait';
    };

_orientation.get = function() {
    return getOrientation(_size(win));
};

_ready(function() {
    var curSize = _size(win);
    win.addEventListener(orientationEvent, function() {
        var size = _size(win);
        if (curSize.width !== size.width && curSize.height !== size.height) {
            curSize = size;
            _orientation.trigger('change', {
                type: orientationEvent,
                width: size.width,
                height: size.height,
                orientation: getOrientation(size)
            });
        }
    });
});