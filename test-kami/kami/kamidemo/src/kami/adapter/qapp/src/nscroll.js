var _ = QApp.util,
    iScroll = _.iScroll = require('../../../scripts/iscroll/index.js');

var SCROLL_OPT = {
    scrollX: false,
    scrollY: true,
    freeScroll: false,
    mouseWheel: false,
    probeType: 3,
    preventDefault: false
};

var TOPOFFSET = {
    distance: 50,
    displayDelay: 1000,
    dragContent: 'drag to refresh',
    endContent: 'stop to refresh',
    loadContent: 'loading',
    successContent: 'success',
    failContent: 'failure'
};

var BOTTOMOFFSET = {
    distance: 50,
    displayDelay: 1000,
    loadContent: 'loading',
    endContent: 'end',
    failContent: ''
};

var DEFAULT_OPT = {
    builderNodes: true,
    template: '<div class="item"></div>',
    moreDis: 50,
    bindScrolls: {},
    scrollOpt: {},
    dataFilter: _.noop,
    changeFilter: _.noop,
    refresh: _.noop,
    topOffsetRefresh: false,
    bottomOffsetResfresh: false
};

function NScroll(el, opt) {
    var scroll = null,
        eventManager = (function () {
            var evt = function () {};
            _.extend(evt.prototype, _.custEvent);
            return new evt();
        })(),
        cur = {
            column: 0,
            row: 0
        },
        options = _.extend({}, DEFAULT_OPT, opt),
        swap = el && el.children[0],
        itemList = [],
        topScroll = options.bindScrolls.x,
        leftScroll = options.bindScrolls.y,
        refreshX = false,
        refreshY = false,
        infiniteX = false,
        infiniteY = false,
        topContainer, bottomContainer,
        topRefreshStatus, bottomRefreshStatus,
        topEndFn, bottomEndFn,
        bottomMargin = 0,
        i, j, node;

    if (!swap) {
        throw 'Dom Structure Error!';
    }

    options.scrollOpt = _.extend({}, SCROLL_OPT, options.scrollOpt);

    // 计算属性。
    if (options.scrollOpt.scrollX && options.column) {
        infiniteX = true;
        options.column.num = options.column.num || parseInt(_.size(el).width / options.column.width) + 2;
        _.css(swap, 'width', Math.max(options.column.total * options.column.width, _.size(swap.parentNode).width + 1) + 'px');
    } else {
        options.column = {
            num: 1,
            total: 1,
            width: 1
        };
    }

    if (options.scrollOpt.scrollY && options.row) {
        infiniteY = true;
        options.row.num = options.row.num || parseInt(_.size(el).height / options.row.height) + 2;
        _.css(swap, 'height', Math.max(options.row.total * options.row.height, _.size(swap.parentNode).height + 1) + 'px');
    } else {
        options.row = {
            num: 1,
            total: 1,
            height: 1
        };
    }

    function computeTranslateStyle(column, row) {
        var pos = 'translate3d(' + column * options.column.width + 'px, ' + row * options.row.height + 'px, 0)';
        return {
            transform: pos,
            '-webkit-transform': pos
        };
    }

    function computeItems(scrollX, scrollY, directionX, directionY) {
        var curColumn = 0,
            lastColumn = options.column.num - 1,
            curRow = 0,
            lastRow = options.row.num - 1,
            changeX = false,
            changeY = false,
            args = [],
            area = null;

        if (scrollX > 0) {
            scrollX = 0;
        } else if (scrollX < scroll.maxScrollX) {
            scrollX = scroll.maxScrollX;
        }

        curColumn = parseInt(Math.abs(scrollX) / options.column.width);
        lastColumn = curColumn + options.column.num - 1;

        if (cur.column !== curColumn) {
            cur.column = curColumn;
            changeX = true;
        }

        if (scrollY > 0) {
            scrollY = 0;
        } else if (scrollY < scroll.maxScrollY + bottomMargin) {
            scrollY = scroll.maxScrollY + bottomMargin;
        }

        curRow = parseInt(Math.abs(scrollY) / options.row.height);
        lastRow = curRow + options.row.num - 1;

        if (cur.row !== curRow) {
            cur.row = curRow;
            changeY = true;
        }

        if (changeX || changeY) {

            area = getShowArea();

            itemList.forEach(function(item) {
                var change = false,
                    toColumn = item.column,
                    toRow = item.row;
                if (toColumn < curColumn && toColumn + options.column.num < options.column.total) {
                    do {
                        toColumn += options.column.num;
                    } while (toColumn < curColumn);
                    if (toColumn < options.column.total) {
                        change = true;
                    }
                } else if (toColumn > lastColumn && toColumn - options.column.num > -1) {
                    change = true;
                    do {
                        toColumn -= options.column.num;
                    } while (toColumn > lastColumn);
                }
                if (toRow < curRow && toRow + options.row.num < options.row.total) {
                    do {
                        toRow += options.row.num;
                    } while (toRow < curRow);
                    if (toRow < options.row.total) {
                        change = true;
                    }
                } else if (toRow > lastRow && toRow - options.row.num > -1) {
                    change = true;
                    do {
                        toRow -= options.row.num;
                    } while (toRow > lastRow);
                }
                if (change) {
                    args.push({
                        type: 'change',
                        el: item.node,
                        from: {
                            column: item.column,
                            row: item.row
                        },
                        to: {
                            column: toColumn,
                            row: toRow
                        }
                    });
                    options.dataFilter('remove', item.node, item.column, item.row, area);
                    item.column = toColumn;
                    item.row = toRow;
                    options.dataFilter('add', item.node, toColumn, toRow, area);
                }
            });

            if (options.builderNodes) {
                args.forEach(function(item) {
                    _.css(item.el, computeTranslateStyle(item.to.column, item.to.row));
                });
            }

            options.changeFilter(args, area);
        }
    }

    function computeX(x) {
        var dis = Math.abs(x),
            num = parseInt(dis / options.column.width),
            nextX = -((dis % options.column.width > options.column.width / 2) ? num + 1 : num) * options.column.width;
        return {
            move: nextX !== x,
            x: nextX
        };
    }

    function computeY(y) {
        var dis = Math.abs(y),
            num = parseInt(dis / options.row.height),
            nextY = -((dis % options.row.height > options.row.height / 2) ? num + 1 : num) * options.row.height;
        return {
            move: nextY !== y,
            y: nextY
        };
    }


    function fixPosition() {
        var ret1 = computeX(scroll.x),
            ret2 = computeY(scroll.y);
        if (ret1.move || ret2.move) {
            if (topScroll) {
                topScroll.scrollTo(ret1.x, 0, 300, IScroll.utils.ease.circular);
            }
            if (leftScroll) {
                leftScroll.scrollTo(0, ret2.y, 300, IScroll.utils.ease.circular);
            }
            scroll.scrollTo(ret1.x, ret2.y, 300, IScroll.utils.ease.circular);
        }
    }

    function getShowArea() {
        return [cur.column, cur.row, cur.column + options.column.num - 1, cur.row + options.row.num - 1];
    }

    function inArea(column, row) {
        return (column >= cur.column && column < cur.column + options.column.num - 1 && row >= cur.row && row < cur.row + options.row.num - 1);
    }

    // 创建内部 Dom
    function buildInnerDom() {
        var args = [],
            area = getShowArea();

        if (options.builderNodes) {
            itemList.forEach(function(item) {
                _.removeNode(item.node);
            });
        }
        itemList = [];

        for (i = 0; i < options.column.num; i++) {
            for (j = 0; j < options.row.num; j++) {
                if (options.builderNodes) {
                    node = _.builder(options.template).children[0];
                    _.css(node, computeTranslateStyle(i, j));
                    swap.appendChild(node);
                }
                itemList.push({
                    column: i,
                    row: j,
                    node: node
                });
                options.dataFilter('add', node || null, i, j, area);
                args.push({
                    type: 'create',
                    el: node || null,
                    from: {

                    },
                    to: {
                        column: i,
                        row: j
                    }
                });
            }
        }
        options.changeFilter(args, area);
        eventManager.trigger('ready');
    }

    function checkRefresh(scrollX, scrollY, directionX, directionY) {
        if (refreshX) {
            if (scrollX < options.moreDis && scrollX > scroll.maxScrollX - options.moreDis) {
                refreshX = false;
            }
        } else {
            if (scrollX >= options.moreDis) {
                refreshX = true;
                eventManager.trigger('more', {
                    axis: 'x',
                    seq: 'prev'
                });
            } else if (scrollX <= scroll.maxScrollX - options.moreDis) {
                refreshX = true;
                eventManager.trigger('more', {
                    axis: 'x',
                    seq: 'next'
                });
            }
        }
        if (refreshY) {
            if (scrollY < options.moreDis && scrollY > scroll.maxScrollY - options.moreDis) {
                refreshY = false;
            }
        } else {
            if (scrollY >= options.moreDis) {
                refreshY = true;
                eventManager.trigger('more', {
                    axis: 'y',
                    seq: 'prev'
                });
            } else if (scrollY <= scroll.maxScrollY - options.moreDis) {
                refreshY = true;
                eventManager.trigger('more', {
                    axis: 'y',
                    seq: 'next'
                });
            }
        }
    }

    scroll = new iScroll(el, options.scrollOpt);

    if (infiniteX || infiniteY) {
        scroll.on('scroll', function() {
            computeItems(scroll.x, scroll.y, scroll.directionX, scroll.directionY);
        });
        scroll.on('scrollEnd', function() {
            if (topScroll && scroll.x <= 0 && scroll.x >= scroll.maxScrollX) {
                topScroll.scrollTo(scroll.x, 0);
            }
            if (leftScroll && scroll.y <= 0 && scroll.y >= scroll.maxScrollY) {
                leftScroll.scrollTo(0, scroll.y);
            }
        });
        _.delay(buildInnerDom);
    }

    scroll.on('scroll', function() {
        checkRefresh(scroll.x, scroll.y, scroll.directionX, scroll.directionY);
    });

    scroll.on('scrollEnd', function() {
        if (topScroll && scroll.x <= 0 && scroll.x >= scroll.maxScrollX) {
            topScroll.scrollTo(scroll.x, 0);
        }
        if (leftScroll && scroll.y <= 0 && scroll.y >= scroll.maxScrollY) {
            leftScroll.scrollTo(0, scroll.y);
        }
    });

    if (topScroll) {
        scroll.on('scroll', function() {
            if (scroll.x <= 0 && scroll.x >= scroll.maxScrollX) {
                topScroll.scrollTo(scroll.x, 0);
            }
        });
        topScroll.on('scroll', function() {
            if (topScroll.x <= 0 && topScroll.x >= topScroll.maxScrollX && topScroll.x >= scroll.maxScrollX) {
                scroll.scrollTo(topScroll.x, scroll.y);
                computeItems(topScroll.x, scroll.y, topScroll.directionX, 0);
            }
        });
    }

    if (leftScroll) {
        scroll.on('scroll', function() {
            if (scroll.y <= 0 && scroll.y >= scroll.maxScrollY) {
                leftScroll.scrollTo(0, scroll.y);
            }
        });
        leftScroll.on('scroll', function() {
            if (leftScroll.y <= 0 && leftScroll.y >= leftScroll.maxScrollY && leftScroll.y >= scroll.maxScrollY) {
                scroll.scrollTo(scroll.x, leftScroll.y);
                computeItems(scroll.x, leftScroll.y, 0, leftScroll.directionY);
            }
        });
    }

    if (options.topOffsetRefresh) {
        if (options.topOffsetRefresh === true) {
            options.topOffsetRefresh = {};
        }
        _.extend(true, options.topOffsetRefresh, TOPOFFSET);

        topContainer = document.createElement('div');
        topRefreshStatus = 'drag';

        _.css(topContainer, {
            position: 'absolute',
            height: options.topOffsetRefresh.distance + 'px',
            width: '100%',
            top: (-options.topOffsetRefresh.distance) + 'px'
        });
        topContainer.innerHTML = options.topOffsetRefresh.dragContent;

        topEndFn = function() {
            if (topRefreshStatus === 'waitEnd') {
                topRefreshStatus = 'startRefresh';
                topContainer.innerHTML = options.topOffsetRefresh.loadContent;
                _.css(swap, {
                    marginTop: options.topOffsetRefresh.distance + 'px'
                });
                scroll.scrollTo(scroll.x, scroll.y - options.topOffsetRefresh.distance, 0);
                options.refresh('top');
            }
        }
        _.addEvent(swap, 'touchend', topEndFn);

        scroll.on('scroll', function() {
            if (topRefreshStatus === 'drag' && scroll.y > options.topOffsetRefresh.distance) {
                topRefreshStatus = 'waitEnd';
                topContainer.innerHTML = options.topOffsetRefresh.endContent;
            }
            if (topRefreshStatus === 'waitEnd' && scroll.y <= options.topOffsetRefresh.distance) {
                topRefreshStatus = 'drag';
                topContainer.innerHTML = options.topOffsetRefresh.dragContent;
            }
        });

        _.delay(function() {
            _.insertElement(swap, topContainer, 'beforeend');
        }, 100);
    }

    if (options.bottomOffsetRefresh) {
        if (options.bottomOffsetRefresh === true) {
            options.bottomOffsetRefresh = {};
        }
        _.extend(true, options.bottomOffsetRefresh, BOTTOMOFFSET);

        bottomContainer = document.createElement('div');
        if (options.row.total * options.row.height < _.size(swap.parentNode).height + 1) {
            bottomRefreshStatus = 'none';
        } else {
            bottomRefreshStatus = 'drag';
        }

        _.css(bottomContainer, {
            position: 'absolute',
            height: options.bottomOffsetRefresh.distance + 'px',
            width: '100%',
            bottom: (-options.bottomOffsetRefresh.distance) + 'px'
        });
        bottomContainer.innerHTML = '';

        bottomEndFn = function() {
            if (bottomRefreshStatus === 'waitEnd') {
                bottomRefreshStatus = 'startRefresh';
                bottomMargin = options.bottomOffsetRefresh.distance;
                bottomContainer.innerHTML = options.bottomOffsetRefresh.loadContent;
                _.css(swap, {
                    height: (_.size(swap).height + bottomMargin) + 'px'
                });
                _.css(bottomContainer, {
                    bottom: 0
                });
                scroll.refresh();
                options.refresh('bottom');
            }
        }
        _.addEvent(swap, 'touchend', bottomEndFn);

        scroll.on('scroll', function() {
            if (bottomRefreshStatus === 'drag' && scroll.y < scroll.maxScrollY - options.bottomOffsetRefresh.distance) {
                bottomRefreshStatus = 'waitEnd';
            }
            if (bottomRefreshStatus === 'waitEnd' && scroll.y >= scroll.maxScrollY - options.bottomOffsetRefresh.distance) {
                bottomRefreshStatus = 'drag';
            }
        });

        _.delay(function() {
            _.insertElement(swap, bottomContainer, 'beforeend');
        }, 100);
    }
    eventManager.trigger('init');


    return _.extend(eventManager, {
        scroll: scroll,
        refresh: function() {
            scroll.refresh();
        },
        scrollTo: function() {
            scroll.scrollTo.apply(scroll, _.makeArray(arguments));
        },
        gotoTop: function(ret, duration) {
            duration = parseInt(duration) || 300;
            if (ret && options.topOffsetRefresh && topRefreshStatus !== 'startRefresh') {
                topRefreshStatus = 'startRefresh';
                topContainer.innerHTML = options.topOffsetRefresh.loadContent;
                _.css(swap, {
                    marginTop: options.topOffsetRefresh.distance + 'px'
                });
                _.delay(function() {
                    options.refresh('top');
                }, duration);
            }
            scroll.scrollTo(scroll.x, 0, duration);
        },
        setTopRefresh: function(ret) {
            if (options.topOffsetRefresh) {
                topContainer.innerHTML = options.topOffsetRefresh[ret ? 'successContent' : 'failContent'];
                _.delay(function() {
                    _.animate(swap, {
                        marginTop: '0'
                    }, 50, 'ease-out').done(function() {
                        topRefreshStatus = 'drag';
                        topContainer.innerHTML = options.topOffsetRefresh.dragContent;
                    });
                }, options.topOffsetRefresh.displayDelay);
                if (options.bottomOffsetRefresh && ret) {
                    if (options.row.total * options.row.height < _.size(swap.parentNode).height + 1) {
                        bottomRefreshStatus = 'none';
                    } else {
                        bottomRefreshStatus = 'drag';
                    }
                    bottomContainer.innerHTML = '';
                }
            }
        },
        setBottomRefresh: function(ret, isEnd) {
            if (options.bottomOffsetRefresh) {
                var html = ret ? '' : options.bottomOffsetRefresh.failContent;
                bottomRefreshStatus = 'drag';
                if (isEnd) {
                    bottomRefreshStatus = 'end';
                    html = options.bottomOffsetRefresh.endContent;
                }
                bottomContainer.innerHTML = html;
                if (isEnd || (!ret && options.bottomOffsetRefresh.failContent)) {
                    _.delay(function() {
                        scroll.scrollTo(scroll.x, scroll.y + bottomMargin, options.bottomOffsetRefresh.displayDelay / 2);
                    }, options.bottomOffsetRefresh.displayDelay / 2);
                    _.delay(function() {
                        _.css(swap, {
                            height: (_.size(swap).height - bottomMargin) + 'px'
                        });
                        _.css(bottomContainer, {
                            bottom: -bottomMargin + 'px'
                        });
                        bottomMargin = 0;
                        scroll.refresh();
                    }, options.bottomOffsetRefresh.displayDelay);
                } else if (!ret) {
                    _.css(swap, {
                        height: (_.size(swap).height - bottomMargin) + 'px'
                    });
                    _.css(bottomContainer, {
                        bottom: -bottomMargin + 'px'
                    });
                    bottomMargin = 0;
                    scroll.refresh();
                } else {
                    _.css(swap, {
                        height: (_.size(swap).height - bottomMargin) + 'px'
                    });
                    _.css(bottomContainer, {
                        bottom: -bottomMargin + 'px'
                    });
                    bottomMargin = 0;
                    scroll.refresh();
                    _.delay(function() {
                        scroll.scrollTo(scroll.x, scroll.y - options.bottomOffsetRefresh.distance * 2, 500);
                    });
                }
            }
        },
        fixPosition: function() {
            _.delay(fixPosition);
        },
        appendNode: function(node, column, row) {
            if (node && swap) {
                _.css(node, computeTranslateStyle(column, row));
                if (!_.contains(swap, node)) {
                    swap.appendChild(node);
                }
            }
        },
        getShowArea: getShowArea,
        checkShow: function(pointArr) {
            return pointArr.some(function(item) {
                return inArea(item[0], item[1]);
            });
        },
        resetNum: function(column, row) {
            options.column.num = column;
            options.row.num = row;
            buildInnerDom();
        },
        resetTotal: function(column, row, directionX, directionY) {
            options.column.total = column;
            options.row.total = row;
            if (options.scrollOpt.scrollX) {
                _.css(swap, 'width', Math.max(options.column.total * options.column.width, _.size(swap.parentNode).width + 1) + 'px');
            }
            if (options.scrollOpt.scrollY) {
                _.css(swap, 'height', Math.max(options.row.total * options.row.height, _.size(swap.parentNode).height + 1) + 'px');
            }
            if (options.bottomOffsetRefresh) {
                if (options.row.total * options.row.height < _.size(swap.parentNode).height + 1) {
                    bottomRefreshStatus = 'none';
                } else {
                    bottomRefreshStatus = 'drag';
                }
                bottomContainer.innerHTML = '';
            }
            _.delay(function() {
                scroll.refresh();
                computeItems(scroll.x, scroll.y, directionX || 0, directionY || 0);
            });
        },
        destroy: function() {
            eventManager.off();
            scroll.destroy();
            scroll = null;
            if (options.topOffsetRefresh) {
                _.removeEvent(swap, topEndFn);
            }
            if (options.bottomOffsetRefresh) {
                _.removeEvent(swap, bottomEndFn);
            }
            options = null;
            swap = null;
            if (leftScroll) {
                leftScroll.destroy();
            }
            leftScroll = null;
            if (topScroll) {
                topScroll.destroy();
            }
            topScroll = null;
            itemList.forEach(function(item) {
                if (item.node) {
                    _.removeNode(item.node);
                    item.node = null;
                }
            });
            itemList.length = 0;
            itemList = null;
        }
    });
}

NScroll.iScroll = iScroll;

NScroll.setTopRefreshOpt = function(newOpt) {
    _.extend(true, TOPOFFSET, newOpt);
};

NScroll.setBottomRefreshOpt = function (newOpt) {
    _.extend(true, BOTTOMOFFSET, newOpt);
};

if (typeof module != 'undefined' && module.exports) {
    module.exports = NScroll;
} else {
    window.NScroll = NScroll;
}
