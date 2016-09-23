/**
 * 动画
 *
 * @method QApp.util.animate
 * @category Util-Fn
 * @param {Element} el 执行动画的元素
 * @param {Object} props 更改的属性
 * @param {Number} [duration] 持续时间
 * @param {String} [ease] 动画曲线
 * @param {Number} [delay] 延迟时间
 * @return {Deferred} Deferred对象
 * @example
 *     // 修改 ele 的 transform 属性，实现动画（推荐）
 *     var ele_transform = document.createElement("div");
 *     QApp.util.animate(ele_transform, {transform: "translate(50%, 0)"}, 500);
 *
 *     // 修改 ele 的 left，实现动画
 *     var ele_left = document.createElement("div");
 *     QApp.util.animate(ele_left, {left: "50%", position: "absolute"}, 500);
 */
var _animate = (function () {
    var DURATION = 200,
        TIMEOUT_DELAY = 25,
        EASE = 'linear';

    var transitionProperty, transitionDuration, transitionTiming, transitionDelay;

    transitionProperty = prefix + 'transition-property';
    transitionDuration = prefix + 'transition-duration';
    transitionDelay = prefix + 'transition-delay';
    transitionTiming = prefix + 'transition-timing-function';

    function setParentStyle(el) {
        var parentNode = el.parentNode;
        if (parentNode) {
            _css(parentNode, {
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden'
            });
        }
    }

    function resetParentStyle(el) {
        var parentNode = el.parentNode;
        _removeStyle(parentNode, ['transform-style', 'backface-visibility']);
    }

    return function (el, props, duration, ease, delay) {
        var argsLength = arguments.length,
            endEvent = eventPrefix + 'TransitionEnd',
            cssValues = {},
            cssProperties = [],
            transforms = '';

        if (argsLength < 3) {
            duration = DURATION;
        }

        if (argsLength < 4) {
            ease = EASE;
        }

        if (argsLength < 5) {
            delay = 0;
        }

        _each(props, function (key, value) {
            if (supportedTransforms.test(key)) {
                transforms += key + '(' + value + ') ';
            } else {
                cssValues[key] = value;
            }
            cssProperties.push(_dasherize(key));
        });

        if (transforms) {
            cssValues[transformAttr] = transforms;
            cssProperties.push(transformAttr);
        }

        if (duration > 0) {
            cssValues[transitionProperty] = cssProperties.join(', ');
            cssValues[transitionDuration] = duration / 1000 + 's';
            cssValues[transitionDelay] = delay / 1000 + 's';
            cssValues[transitionTiming] = ease;
        }

        var that = new Deferred();
        var fired = FALSE;

        function callback(event) {
            if (event) {
                if (event.target !== el) {
                    return;
                }
            }
            _removeEvent(el, endEvent, callback);
            fired = TRUE;
            _delay(function () {
                if (transforms) {
                    resetParentStyle(el);
                }
                _removeStyle(el, 'transition');
                that.resolve();
            });
        }

        if (duration > 0) {
            _addEvent(el, endEvent, callback, FALSE);

            // 兼容不支持的情况
            _delay(function () {
                if (!fired) {
                    callback();
                }
            }, duration + delay + TIMEOUT_DELAY * 2);
        }

        _delay(function () {
            if (transforms) {
                setParentStyle(el);
            }

            _css(el, cssValues);

            that.notify('start');
        }, TIMEOUT_DELAY);

        if (duration <= 0) {
            _delay(callback);
        }

        return that;
    };
})();
