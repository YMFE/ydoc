/**
 * QApp-plugin-basic
 *
 * version: 0.1.1
 */

(function () {

    var win = window,
        doc = document,
        display = 'display',
        visibility = 'visibility';

    var origin = QApp.origin,
        _ = QApp.util,
        _extend = _.extend,
        _delay = _.delay,
        _appendNodes = _.appendNodes,
        _addClass = _.addClass,
        _addEvent = _.addEvent,
        _removeEvent = _.removeEvent,
        _removeNode = _.removeNode,
        _css = _.css,
        _removeStyle = _.removeStyle,
        _contains = _.contains,
        _animate = _.animate,
        _size = _.size,
        _position = _.position,
        _parallel = _.parallel,
        _blur = _.blur,
        _getZIndex = _.getZIndex,
        _getUniqueID = _.getUniqueID,
        _delegatedEvent = _.delegatedEvent,
        _dispatchEvent = _.dispatchEvent,
        _isFunction = _.isFunction;

    // 0 => 无动画
    // 1 => translate3d
    // 2 => translate + translateZ
    // 3 => 使用 left/top 形式
    var transType = (function() {

        var sniff = QApp.sniff,
            ua = navigator.userAgent.toLowerCase();

        // ios 和 安卓上的微信 使用 translate3d
        if (sniff.ios || (sniff.android && ua.indexOf('micromessenger') > -1)) {
            return 1;
        }

        // 其他安卓设备 使用 translate + translateZ
        return 2;

        // 无动画
        //return 0;

    })();

    function fixEvent(e) {

        if (e.pageX == null && e.clientX != null) {
            var html = document.documentElement;
            var body = document.body;

            e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || body && body.clientLeft || 0);
            e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || body && body.clientTop || 0);
        }

        return e;
    }

    function getNodeInfo(node) {
        var pos = _position(node),
            size = _size(node);
        return {
            left: pos.left,
            top: pos.top,
            right: pos.left + size.width,
            bottom: pos.top + size.height
        };
    }

    function hitTest(node, ev) {
        var info = getNodeInfo(node);

        ev = fixEvent(ev);

        return ev.pageX >= info.left && ev.pageX <= info.right && ev.pageY >= info.top && ev.pageY <= info.bottom;
    }

    function resetDisplay(node) {
        _removeStyle(node, display);
    }

    function resetVisibility(node) {
        _css(node, visibility, '');
        _removeStyle(node, visibility);
    }

    function getSizeValue(size) {
        return (~(size + '').indexOf('%') || ~(size + '').indexOf('px')) ? size : (size + 'px');
    }

    var getTranslate3dStyle = transType == 1 ? function (x, y, z) {
        return {
            translate3d: x + 'px, ' + y + 'px, ' + z + 'px'
        };
    } : function (x, y, z) {
        return {
            translate: x + 'px, ' + y + 'px',
            translateZ: z + 'px'
        };
    };

    var maskNode = null;

    function initMask() {
        if (!maskNode) {
            maskNode = doc.createElement('div');
            _css(maskNode, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: getSizeValue(origin.width),
                height: getSizeValue(origin.height)
            });
        }
        return maskNode;
    }

    /* ================================== AutoHide ================================== */
    var autoHide = (function () {
        var queue = [],
            nextView = '';

        function add(view) {
            queue.unshift(view);
        }

        function remove(view) {
            var index = queue.indexOf(view);
            if (~index) {
                queue.splice(index, 1);
            }
        }

        function Manager(view) {
            view.once('show', function () {
                add(view);
            });
            view.once('hide', function () {
                remove(view);
                view = null;
            });
        }

        Manager.setNextView = function (nView) {
            nextView = nView;
        };

        _.ready(function () {
            doc.body.addEventListener('touchstart', function (e) {
                var view = queue[0];
                if (view && view.autoHide && !(_contains(view.root, e.target) || hitTest(view.root, e)) && (!view.relyElement || !_contains(view.relyElement, e.target))) {
                    if (view.isContainer) {
                        view.decHide();
                    } else {
                        view.hide();
                    }
                }
            }, false);
        });

        return Manager;
    })();

    // 统一逻辑
    function commonHandle(name, view, opt) {
        view.on('loadEnd', function () {
            _.attr(view.root, 'qapp-ani', name);
            _.css(view.root, visibility, 'hidden');
        });

        view.on('beforeHide', function () {
            _blur(view.root);
        });

        view.on('destroy', function () {
            view.show = null;
            view.hide = null;
        });

        view.autoHide = opt.autoHide && opt.autoHide !== 'false';
        autoHide(view);
    }


    /* ================================== actionSheet 插件 ================================== */
    (function () {
        var KEYBOARD_DELAY = 500;

        var DEFAULT_OPT = {
            autoHide: true,
            distance: 0,
            duration: 200,
            showMask: true,
            maskColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 0
        };

        QApp.addPlugin(['actionSheet', 'ui.actionSheet'], DEFAULT_OPT, function (view, opt, config) {

            var startCss = {
                    position: 'absolute',
                    left: 0,
                    width: '100%'
                },
                moving = false,
                maskLayer, delay;

            if (!config.animate) {
                opt.duration = 0;
            }

            opt.zIndex = opt.zIndex || _getZIndex();

            view.on('loaded', function () {
                // 如果用户未设置或为 0
                if (!opt.distance) {
                    // 避免 qapp-view css height: 100% 的影响
                    view.root.style.height = 'auto';
                    opt.distance = _size(view.root).height;
                }
                setPos(view.root, startCss, opt)
                _addClass(view.root, 'shadow');
            });

            view.show = function (preventAnimate) {
                if (preventAnimate && preventAnimate.fromHash) {
                    preventAnimate = true;
                }
                _blur();
                autoHide.setNextView(view.name);
                if (opt.showMask) {
                    maskLayer = initMask();
                    _css(maskLayer, {
                        display: 'block',
                        backgroundColor: opt.maskColor,
                        zIndex: opt.zIndex
                    });
                    _appendNodes(doc.body, maskLayer);
                }

                if (!moving) {
                    moving = true;
                    if (view.isShow) {
                        moving = false;
                        view.trigger('refresh');
                    } else {
                        delay = _size(win).height !== origin.height ? KEYBOARD_DELAY : 0;
                        view.once('completed', function () {
                            resetDisplay(view.root);
                            resetVisibility(view.root);
                            view.trigger('beforeShow');
                            _delay(function () {
                                _animate(view.root, getTranslate3dStyle(0, 0, 0), (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration, 'ease-out', delay).done(function () {
                                    view.isShow = true;
                                    moving = false;
                                    _removeStyle(view.root, 'transform');
                                    view.trigger('show');
                                });
                            });
                        });
                        view.renderTo(doc.body);
                    }
                }
                return view;
            };

            view.hide = function (preventAnimate) {
                if (!moving && view.isShow) {
                    moving = true;
                    view.trigger('beforeHide');
                    _animate(view.root, startCss, (preventAnimate === true || view.preventAnimate) ? 0 : (opt.duration / 2), 'ease-out').done(function () {
                        view.isShow = false;
                        if (maskLayer) {
                            _css(maskLayer, display, 'none');
                            _removeNode(maskLayer);
                        }
                        moving = false;
                        view.trigger('hide');
                    });
                }
                return view;
            };
            view.refresh = function() {
                view.root.style.height = 'auto';
                opt.distance = _size(view.root).height;
                setPos(view.root, startCss, opt)
            }
            view.on('destroy', function () {
                startCss = null;
                maskLayer = null;
                view = null;
            });

            commonHandle('actionSheet', view, opt);

            return {
                setOption: function (newOpt) {
                    opt = _extend({}, opt, newOpt);
                }
            };
        });

        function setPos(root, startCss, opt) {
            _css(root, _extend(startCss, {
                top: getSizeValue(origin.height - opt.distance),
                height: getSizeValue(opt.distance),
                zIndex: opt.zIndex
            }, getTranslate3dStyle(0, opt.distance, 0)));
        }

    })();

    /* ================================== dialog 插件 ================================== */
    (function () {

        var DEFAULT_OPT = {
            autoHide: false,
            maskColor: 'rgba(0, 0, 0, .4)',
            duration: 200,
            width: 0,
            height: 0,
            zIndex: 0
        };

        QApp.addPlugin(['ui.dialog', 'dialog'], DEFAULT_OPT, function (view, opt, config) {

            var width = origin.width,
                height = origin.height,
                moving = false,
                maskLayer;

            if (!config.animate) {
                opt.duration = 0;
            }

            opt.zIndex = opt.zIndex || _getZIndex();

            view.on('loaded', function () {
                var size = _size(view.root);
                if (!opt.width) {
                    opt.width = size.width;
                }
                if (!opt.height) {
                    opt.height = size.height;
                }
                _css(view.root, _extend({
                    position: 'absolute',
                    width: getSizeValue(opt.width),
                    height: getSizeValue(opt.height),
                    zIndex: opt.zIndex,
                    display: 'none',
                    top: getSizeValue((height - opt.height) / 2),
                    left: getSizeValue((width - opt.width) / 2)
                }, getTranslate3dStyle(0, height, 0)));

                _addClass(view.root, 'shadow');
            });

            view.show = function (preventAnimate) {
                if (preventAnimate && preventAnimate.fromHash) {
                    preventAnimate = true;
                }
                autoHide.setNextView(view.name);
                maskLayer = initMask();
                _css(maskLayer, {
                    display: 'block',
                    backgroundColor: opt.maskColor,
                    zIndex: opt.zIndex
                });
                _appendNodes(doc.body, maskLayer);

                if (!moving) {
                    moving = true;
                    if (view.isShow) {
                        moving = false;
                        view.trigger('refresh');
                    } else {
                        view.once('completed', function () {
                            resetDisplay(view.root);
                            resetVisibility(view.root);
                            view.trigger('beforeShow');
                            _animate(view.root, getTranslate3dStyle(0, 0, 0), (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration).done(function () {
                                view.isShow = true;
                                moving = false;
                                _removeStyle(view.root, 'transform');
                                view.trigger('show');
                            });
                        });
                        view.renderTo(doc.body);
                    }
                }
                return view;
            };

            view.hide = function (preventAnimate) {
                if (!moving && view.isShow) {
                    moving = true;
                    view.trigger('beforeHide');
                    _animate(view.root, getTranslate3dStyle(0, height, 0), (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration).done(function () {
                        view.isShow = false;
                        if (maskLayer) {
                            _css(maskLayer, display, 'none');
                            _removeNode(maskLayer);
                        }
                        moving = false;
                        view.trigger('hide');
                    });
                }
                return view;
            };

            view.on('destroy', function () {
                maskLayer = null;
                view = null;
            });

            commonHandle('dialog', view, opt);

            return {
                setOption: function (newOpt) {
                    opt = _extend({}, opt, newOpt);
                }
            };
        });

    })();

    /* ================================== popup 插件 ================================== */

    (function () {

        var maskLayer = null,
            delegatedEvent;

        var DEFAULT_OPT = {
                autoHide: true,
                autoDirection: false,
                direction: 'right',
                duration: 200,
                width: 0,
                height: 0,
                position: 'center',
                dropDown: false,
                bgColor: 'rgba(0, 0, 0, 0.4)',
                group: false,
                item: null
            },
            startCSS = {
                opacity: 0
            },
            endCSS = {
                opacity: 1
            };

        function getPosition(el, opt, pos) {
            var top = 0,
                left = 0;

            switch (pos) {
                case 'right':
                    top = getSizeValue(_.position(el).top);
                    left = getSizeValue(_.position(el).left + _.size(el).width);
                    break;
                case 'left':
                    top = getSizeValue(_.position(el).top);
                    left = getSizeValue(_.position(el).left - parseInt(opt.width));
                    break;
                case 'bottom':
                    top = getSizeValue(_.position(el).top + _.size(el).height);
                    if (opt.position === 'left') {
                        left = getSizeValue(_.position(el).left);
                    } else if (opt.position === 'right') {
                        left = getSizeValue(_.position(el).left + _.size(el).width - opt.width);
                    } else {
                        left = getSizeValue(_.position(el).left + _.size(el).width / 2 - opt.width / 2);
                    }
                    break;
                case 'top':
                    top = getSizeValue(_.position(el).top - parseInt(opt.height));
                    if (opt.position === 'left') {
                        left = getSizeValue(_.position(el).left);
                    } else if (opt.position === 'right') {
                        left = getSizeValue(_.position(el).left + _.size(el).width - opt.width);
                    } else {
                        left = getSizeValue(_.position(el).left + _.size(el).width / 2 - opt.width / 2);
                    }
                    break;
            }
            return {
                top: top,
                left: left
            };
        }

        function fixedDirection(el, opt) {
            if (opt.autoDirection && opt.autoDirection !== 'false') {
                var direction = opt.direction,
                    elPos = _position(el),
                    elLeft = elPos.left,
                    elTop = elPos.top,
                    elSize = _size(el),
                    elWidth = elSize.width,
                    elHeight = elSize.height,
                    winWidth = origin.width,
                    winHeight = origin.height,
                    popupWidth = opt.width,
                    popupHeight = opt.height,
                    canRight = elLeft + elWidth + popupWidth <= winWidth,
                    canLeft = elLeft - popupWidth >= 0,
                    canBottom = elTop + elHeight + popupHeight <= winHeight,
                    canTop = elTop - popupHeight >= 0;
                if (direction === 'right') {
                    if (!canRight) {
                        if (canLeft) {
                            direction = 'left';
                        } else {
                            direction = 'bottom';
                        }
                    }
                } else if (direction === 'left') {
                    if (!canLeft) {
                        if (canRight) {
                            direction = 'right';
                        } else {
                            direction = 'bottom';
                        }
                    }
                }
                if (direction === 'bottom') {
                    if (!canBottom) {
                        direction = 'top';
                    }
                } else if (direction === 'top') {
                    if (!canTop) {
                        direction = 'bottom';
                    }
                }
                return direction;
            } else {
                return opt.direction;
            }
        }

        QApp.ready(function () {
            delegatedEvent = _delegatedEvent(doc.body, [], 'qapp-popup-group');
        });

        QApp.addPlugin(['popup', 'ui.popup'], DEFAULT_OPT, function (view, opt, config) {

            var moving = false,
                touchOther = false;

            if (!config.animate) {
                opt.duration = 0;
            }

            if (opt.dropDown) {
                opt.useArrow = false;
                opt.autoDirection = false;
                opt.direction = 'bottom';
                opt.dropDuration = opt.duration;
                opt.duration = 0;
            }

            opt.zIndex = opt.zIndex || _getZIndex();

            view.on('loaded', function () {
                var size = _size(view.root);
                if (!opt.width) {
                    opt.width = size.width;
                }
                if (!opt.height) {
                    opt.height = size.height;
                }
                _css(view.root, {
                    display: 'none',
                    position: 'absolute',
                    width: getSizeValue(opt.width),
                    height: getSizeValue(opt.height),
                    zIndex: opt.zIndex
                });
                _css(view.root, opt.dropDown ? endCSS : startCSS);
            });

            view.show = function (el, preventAnimate) {
                view.relyElement = el;
                autoHide.setNextView(view.name);
                if (!moving) {
                    moving = true;
                    var direction = fixedDirection(el, opt),
                        pos = getPosition(el, opt, direction);
                    if (view.isShow) {
                        resetDisplay(view.root);
                        resetVisibility(view.root);
                        _css(view.root, {
                            top: pos.top,
                            left: pos.left
                        });
                        moving = false;
                        view.trigger('refresh');
                    } else {
                        view.once('completed', function () {
                            view.trigger('beforeShow');
                            resetDisplay(view.root);
                            resetVisibility(view.root);
                            _css(view.root, {
                                top: pos.top,
                                left: pos.left
                            });
                            if (opt.dropDown) {
                                var els = view.root.childNodes,
                                    dropEl, i = -1;
                                do {
                                    i++;
                                    dropEl = els[i];
                                } while (dropEl.nodeType === 3);
                                _css(dropEl, _extend({
                                    height: getSizeValue(opt.height)
                                }, getTranslate3dStyle(0, -opt.height, 0)));
                                _css(view.root, {
                                    position: 'absolute',
                                    zIndex: opt.zIndex,
                                    width: getSizeValue(opt.width),
                                    height: getSizeValue(opt.dropDown),
                                    backgroundColor: opt.bgColor,
                                    overflow: 'hidden'
                                });
                                if (maskLayer) {
                                    _removeNode(maskLayer);
                                }
                                _delay(function () {
                                    _animate(dropEl, getTranslate3dStyle(0, 0, 0), (preventAnimate === true || view.preventAnimate) ? 0 : opt.dropDuration, 'ease-out').done(function () {
                                        view.isShow = true;
                                        moving = false;
                                        view.trigger('show');
                                    });
                                });
                            } else {
                                _animate(view.root, endCSS, (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration).done(function () {
                                    view.isShow = true;
                                    moving = false;
                                    view.trigger('show');
                                });
                            }

                        });

                        view.once('rendered', function () {
                            if (opt.group) {
                                delegatedEvent.add(opt.group, 'touchstart', function (e) {
                                    if (e.el !== opt.item) {
                                        touchOther = true;
                                    }
                                });
                            }
                            view.root.addEventListener('tap', function (e) {
                                if (view && view.root === e.target) {
                                    view.once('hide', function () {
                                        view.destroy();
                                    });
                                    view.hide();
                                    e.stopPropagation();
                                }
                            }, true);
                        });

                        view.renderTo(doc.body);
                    }
                }
                return view;
            };

            view.hide = function (preventAnimate) {
                view.relyElement = null;
                if (!moving && view.isShow) {
                    moving = true;
                    view.trigger('beforeHide');
                    if (opt.dropDown) {
                        var els = view.root.childNodes,
                            dropDuration = (preventAnimate === true || view.preventAnimate) ? 0 : opt.dropDuration,
                            dropEl, i = -1;
                        do {
                            i++;
                            dropEl = els[i];
                        } while (dropEl.nodeType === 3);
                        dropDuration /= 2;
                        if (opt.group && touchOther) {
                            _animate(dropEl, {
                                opacity: 0
                            }, dropDuration, 'ease-in').done(function () {
                                view.isShow = false;
                                moving = false;
                                view.options.destroyDom = false;
                                if (maskLayer) {
                                    _removeNode(maskLayer);
                                }
                                maskLayer = view.root;
                                _delay(function () {
                                    _animate(maskLayer, {
                                        opacity: 0
                                    }, dropDuration, 'ease-in').done(function () {
                                        _removeNode(maskLayer);
                                        maskLayer = null;
                                    });
                                }, 100);
                                delegatedEvent.remove(opt.group, 'touchstart');
                                view.trigger('hide');
                            });
                        } else {
                            _animate(dropEl, _extend({
                                opacity: 0
                            }, getTranslate3dStyle(0, -opt.height, 0)), (preventAnimate === true || view.preventAnimate) ? 0 : dropDuration, 'ease-in').done(function () {
                                view.isShow = false;
                                moving = false;
                                view.trigger('hide');
                            });
                        }
                    } else {
                        _animate(view.root, startCSS, (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration).done(function () {
                            view.isShow = false;
                            moving = false;
                            _css(view.root, display, 'none');
                            view.trigger('hide');
                        });
                    }
                }
                return view;
            };

            view.on('destroy', function () {
                view = null;
            });

            commonHandle('popup', view, opt);

            return {
                setOption: function (newOpt) {
                    opt = _extend({}, DEFAULT_OPT, newOpt);
                }
            };

        });

    })();

})();
