(function () {

    var display = 'display',
        visibility = 'visibility';

    // 0 => 无动画
    // 1 => translate3d
    // 2 => translate + translateZ
    // 3 => 使用 left/top 形式
    var transType = (function() {

        var ua = navigator.userAgent.toLowerCase();

        // ios 和 安卓上的微信 使用 translate3d
        if (_sniff.ios || (_sniff.android && ua.indexOf('micromessenger') > -1)) {
            return 1;
        }

        // 其他安卓设备 使用 translate + translateZ
        return 2;

        // 无动画
        //return 0;

    })();

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

    // 统一逻辑
    function commonHandle(name, view, opt) {
        view.on('loadEnd', function () {
            _attr(view.root, 'qapp-ani', name);
            _css(view.root, visibility, 'hidden');
        });

        view.on('beforeHide', function () {
            _blur(view.root);
        });

        view.on('destroy', function () {
            view.show = NULL;
            view.hide = NULL;
        });
    }

    /* ================================== MoveEnter 插件 ================================== */

    var MIN_GAP = 10;

    var DEFAULT_OPT = {
        position: 'right',
        distance: 0,
        duration: 200,
        zIndex: 0
    };

    var queue = {},
        moving = FALSE;

    function findViewIndex(curQueue, view) {
        var curIndex = -1,
            i, len;
        for (i = 0, len = curQueue.length; i < len; i++) {
            if (curQueue[i].view === view) {
                curIndex = i;
                break;
            }
        }
        return curIndex;
    }

    function animateQueue(curQueue, curIndex, duration, horizontal, root) {
        var dis = 0;
        return _parallel(curQueue.map(function (item, index) {
            if (index < curIndex) {
                item.view.trigger('beforeHide');
                return _animate(item.view.root, horizontal ? getTranslate3dStyle(item.translate, 0, 0) : getTranslate3dStyle(0, item.translate, 0), duration);
            } else {
                dis += item.distance;
                return _animate(item.view.root, horizontal ? getTranslate3dStyle(dis, 0, 0) : getTranslate3dStyle(0, dis, 0), duration);
            }
        }));
    }

    QApp.addPlugin('moveEnter', DEFAULT_OPT, function (view, opt, config) {

        var startCss = {
                position: 'absolute',
                top: 0,
                zIndex: opt.zIndex || _getZIndex()
            },
            simpleShow = config.type.indexOf && config.type.indexOf('pad') === -1,
            horizontal = opt.position === 'right' || opt.position === 'left',
            orientationNum = (opt.position === 'right' || opt.position === 'bottom') ? -1 : 1,
            realDistance,
            simpleMoving = FALSE,
            curQueue,
            panStart = FALSE,
            panMove = FALSE;

        if (opt.panBack === UNDEFINED) {
            opt.panBack = config.type === 'app';
        }

        if (simpleShow) {
            opt.distance = horizontal ? origin.rootWidth : origin.rootHeight;
        }
        realDistance = orientationNum * opt.distance;

        if (!config.animate) {
            opt.duration = 0;
        }

        if (simpleShow) {
            curQueue = [];
            startCss.width = '100%';
            startCss.height = '100%';
        } else {
            if (!queue[opt.position]) {
                queue[opt.position] = [];
            }
            curQueue = queue[opt.position];
            startCss[horizontal ? 'height' : 'width'] = '100%';
        }

        if (opt.panBack && simpleShow && (opt.position === 'right' || opt.position === 'left')) {

            var checkMove = function (e) {
                if (~e.directions.indexOf(opt.position)) {
                    return (e.clientX - e.offsetX < MIN_GAP);
                }
                return FALSE;
            };

            var executePan = function(e) {
                if (panMove) {
                    _css(view.root, getTranslate3dStyle(e.offsetX, 0, 0));
                } else if (!panStart) {
                    panStart = TRUE;
                    panMove = checkMove(e);
                }
            };

            var executePanEnd = function (e) {
                if (panMove) {
                    panMove = FALSE;
                    if (Math.abs(e.offsetX) > Math.abs(opt.distance) / 2) {
                        view.hide();
                    } else {
                        _animate(view.root, getTranslate3dStyle(0, 0, 0), opt.duration / 2).done();
                    }
                }
                panStart = FALSE;
            };

            view.on('show', function () {
                _addEvent(view.root, 'pan', executePan);
                _addEvent(view.root, 'panend', executePanEnd);
            });

            view.on('hide', function () {
                _removeEvent(view.root, 'pan', executePan);
                _removeEvent(view.root, 'panend', executePanEnd);
            });

            view.on('rendered', function () {
                var div = doc.createElement('div');
                div.className = "touch-opacity";
                _css(div, {
                    position: 'absolute',
                    zIndex: '9999',
                    width: getSizeValue(MIN_GAP),
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0)'
                });

                _css(div, opt.position === 'right' ? 'left' : 'right', '0');

                _addClass(view.root, 'shadow');
                view.root.appendChild(div);
            });
        }

        view.on('loaded', function () {
            if (!opt.distance) {
                opt.distance = _size(view.root)[horizontal ? 'width' : 'height'];
            }
            if (simpleShow) {
                if (transType === 3) {
                    if (opt.position === 'bottom') {
                        startCss.top = getSizeValue(origin.rootHeight);
                    } else {
                        startCss[opt.position] = getSizeValue(-opt.distance);
                    }
                } else {
                    if (opt.position === 'bottom') {
                        startCss.top = getSizeValue(origin.rootHeight - opt.distance);
                    } else {
                        startCss[opt.position] = getSizeValue(0);
                    }
                    _extend(startCss, horizontal ? getTranslate3dStyle(-orientationNum * opt.distance, 0, 0) : getTranslate3dStyle(0, -orientationNum * opt.distance, 0));
                }
            } else {
                if (opt.position !== 'bottom') {
                    startCss[opt.position] = getSizeValue(-opt.distance);
                } else {
                    startCss.top = getSizeValue(origin.rootHeight);
                }
            }
            _css(view.root, startCss);
        });

        commonHandle('moveEnter', view, opt);

        view.show = function (preventAnimate) {
            _blur();
            if (!moving) {
                moving = TRUE;
                simpleMoving = TRUE;
                var curIndex = findViewIndex(curQueue, view);
                if (~curIndex) {
                    animateQueue(curQueue, curIndex, (preventAnimate === TRUE || view.preventAnimate) ? 0 : opt.duration, horizontal).done(function () {
                        curQueue.splice(0, curIndex).forEach(function (item) {
                            item.view.trigger('hide');
                        });
                        moving = FALSE;
                        simpleMoving = FALSE;
                        view.trigger('refresh');
                    });
                } else {
                    view.once('completed', function () {
                        resetDisplay(view.root);
                        resetVisibility(view.root);
                        view.trigger('beforeShow');
                        curQueue.unshift({
                            view: view,
                            distance: simpleShow ? 0 : realDistance,
                            translate: simpleShow ? -realDistance : 0
                        });
                        _delay(function() {
                            animateQueue(curQueue, 0, (preventAnimate === TRUE || view.preventAnimate) ? 0 : opt.duration, horizontal, view.root).done(function () {
                                moving = FALSE;
                                simpleMoving = FALSE;
                                _removeStyle(view.root, 'transform');
                                view.trigger('show');
                            });
                        });
                    });
                    view.renderTo(QApp.root);
                }
            }
            return view;
        };

        view.hide = function (preventAnimate) {
            if ((!moving || (simpleShow && !simpleMoving)) && view.isShow) {
                moving = TRUE;
                var curIndex = findViewIndex(curQueue, view);
                animateQueue(curQueue, curIndex + 1, (preventAnimate === TRUE || view.preventAnimate) ? 0 : opt.duration, horizontal).done(function () {
                    curQueue.splice(0, curIndex + 1).forEach(function (item) {
                        item.view.trigger('hide');
                    });
                    moving = FALSE;
                });
            }
            return view;
        };

        view.on('destroy', function () {
            startCss = NULL;
            curQueue = NULL;
            view = NULL;
        });

        return {
            setOption: function (newOpt) {
                opt = _extend({}, DEFAULT_OPT, newOpt);
            }
        };
    });
})();