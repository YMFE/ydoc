var checkContains = function (list, el) {
    for (var i = 0, len = list.length; i < len; i += 1) {
        if (_contains(list[i], el)) {
            return TRUE;
        }
    }
    return FALSE;
};

function _delegatedEvent(actEl, expEls, tag) {
    if (!expEls) {
        expEls = [];
    }
    expEls = [].concat(expEls);
    var evtList = {},
        bindEvent = function (evt) {
            var el = evt.target,
                type = evt.type;
            doDelegated(el, type, evt);
        },
        actionTag = tag || 'action-type';

    function doDelegated(el, type, evt) {
        var actionType = NULL;

        function checkBuble() {
            var tg = el,
                data = _dataSet(tg);
            if (evtList[type] && evtList[type][actionType]) {
                return evtList[type][actionType]({
                    'evt': evt,
                    'el': tg,
                    'box': actEl,
                    'data': data
                }, data);
            } else {
                return TRUE;
            }
        }

        if (checkContains(expEls, el)) {
            return FALSE;
        } else if (!_contains(actEl, el)) {
            return FALSE;
        } else {
            while (el && el !== actEl) {
                if (el.nodeType === 1) {
                    actionType = el.getAttribute(actionTag);
                    if (actionType && checkBuble() === FALSE) {
                        break;
                    }
                }
                el = el.parentNode;
            }

        }
    }

    var that = {};

    that.add = function (funcName, evtType, process, useCapture) {
        if (!evtList[evtType]) {
            evtList[evtType] = {};
            _addEvent(actEl, evtType, bindEvent, !!useCapture);
        }
        var ns = evtList[evtType];
        ns[funcName] = process;
    };

    that.remove = function (funcName, evtType) {
        if (evtList[evtType]) {
            delete evtList[evtType][funcName];
            if (_isEmptyObject(evtList[evtType])) {
                delete evtList[evtType];
                _removeEvent(actEl, evtType, bindEvent);
            }
        }
    };

    that.pushExcept = function (el) {
        expEls.push(el);
    };

    that.removeExcept = function (el) {
        if (!el) {
            expEls = [];
        } else {
            for (var i = 0, len = expEls.length; i < len; i += 1) {
                if (expEls[i] === el) {
                    expEls.splice(i, 1);
                }
            }
        }

    };

    that.clearExcept = function () {
        expEls = [];
    };

    that.fireAction = function (actionType, evtType, evt, params) {
        var data = {};
        if (params && params.data) {
            data = params.data;
        }
        if (evtList[evtType] && evtList[evtType][actionType]) {
            evtList[evtType][actionType]({
                'evt': evt,
                'el': NULL,
                'box': actEl,
                'data': data,
                'fireFrom': 'fireAction'
            }, data);
        }
    };

    that.fireInject = function (dom, evtType, evt) {
        var actionType = dom.getAttribute(actionTag),
            dataSet = _dataSet(dom);
        if (actionType && evtList[evtType] && evtList[evtType][actionType]) {
            evtList[evtType][actionType]({
                'evt': evt,
                'el': dom,
                'box': actEl,
                'data': dataSet,
                'fireFrom': 'fireInject'
            }, dataSet);
        }
    };


    that.fireDom = function (dom, evtType, evt) {
        doDelegated(dom, evtType, evt || {});
    };

    that.destroy = function () {
        for (var k in evtList) {
            for (var l in evtList[k]) {
                delete evtList[k][l];
            }
            delete evtList[k];
            _removeEvent(actEl, k, bindEvent);
        }
    };

    return that;
}