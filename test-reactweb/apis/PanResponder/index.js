/**
 * 
 *  @providesModule PanResponder
 */


/**
 * PanResponder
 *
 * @component PanResponder
 * @example ./PanResponder.js[1-34]
 * @version >=v1.4.0
 * @example ./PanResponder.js[1-34]
 * @description PanResponder它提供了一个对触摸响应系统响应器的可预测的包装，提供了一个新的`gestureState`手势。
 *
 * ![PanResponder](./images/api/PanResponder.gif)
 *
 */


"use strict";
var normalizeNativeEvent = require('./normalizeNativeEvent')
var TouchHistoryMath = require('./TouchHistoryMath');

var currentCentroidXOfTouchesChangedAfter =
  TouchHistoryMath.currentCentroidXOfTouchesChangedAfter;
var currentCentroidYOfTouchesChangedAfter =
  TouchHistoryMath.currentCentroidYOfTouchesChangedAfter;
var previousCentroidXOfTouchesChangedAfter =
  TouchHistoryMath.previousCentroidXOfTouchesChangedAfter;
var previousCentroidYOfTouchesChangedAfter =
  TouchHistoryMath.previousCentroidYOfTouchesChangedAfter;
var currentCentroidX = TouchHistoryMath.currentCentroidX;
var currentCentroidY = TouchHistoryMath.currentCentroidY;
var PanResponder = {

 _initializeGestureState: function(gestureState) {
    gestureState.moveX = 0;
    gestureState.moveY = 0;
    gestureState.x0 = 0;
    gestureState.y0 = 0;
    gestureState.dx = 0;
    gestureState.dy = 0;
    gestureState.vx = 0;
    gestureState.vy = 0;
    gestureState.numberActiveTouches = 0;
    // All `gestureState` accounts for timeStamps up until:
    gestureState._accountsForMovesUpTo = 0;
  },
  _updateGestureStateOnMove: function(gestureState, touchHistory) {
    gestureState.numberActiveTouches = touchHistory.numberActiveTouches;
    gestureState.moveX = currentCentroidXOfTouchesChangedAfter(
      touchHistory,
      gestureState._accountsForMovesUpTo
    );
    gestureState.moveY = currentCentroidYOfTouchesChangedAfter(
      touchHistory,
      gestureState._accountsForMovesUpTo
    );
    var movedAfter = gestureState._accountsForMovesUpTo;
    var prevX = previousCentroidXOfTouchesChangedAfter(touchHistory, movedAfter);
    var x = currentCentroidXOfTouchesChangedAfter(touchHistory, movedAfter);
    var prevY = previousCentroidYOfTouchesChangedAfter(touchHistory, movedAfter);
    var y = currentCentroidYOfTouchesChangedAfter(touchHistory, movedAfter);
    var nextDX = gestureState.dx + (x - prevX);
    var nextDY = gestureState.dy + (y - prevY);

    // TODO: This must be filtered intelligently.
    var dt =
      (touchHistory.mostRecentTimeStamp - gestureState._accountsForMovesUpTo);
    gestureState.vx = (nextDX - gestureState.dx) / dt;
    gestureState.vy = (nextDY - gestureState.dy) / dt;

    gestureState.dx = nextDX;
    gestureState.dy = nextDY;
    gestureState._accountsForMovesUpTo = touchHistory.mostRecentTimeStamp;
  },
  /**
   * @method create
   * @param {object} config 手势配置。
   * @description 创建，生成一个新的`gestureState`对象
   *
   * 一个`gestureState`对象有如下字段
   * - `stateID`：触摸状态的ID。随机生成。
   * - `moveX`：最近一次移动时的屏幕横坐标
   * - `moveY`：最近一次移动时的屏幕纵坐标
   * - `x0`：当响应器产生时的屏幕坐标
   * - `y0`：当响应器产生时的屏幕坐标
   * - `dx`：从触摸操作开始时的累计横向路程
   * - `dy`：从触摸操作开始时的累计纵向路程
   * - `vx`：当前的横向移动速度
   * - `vy`：当前的纵向移动速度
   * - `numberActiveTouches`：当前在屏幕上的有效触摸点的数量
   *
   * 配置参数config如下
   * - `onMoveShouldSetPanResponder: (e, gestureState) => {...}`
   * - `onMoveShouldSetPanResponderCapture: (e, gestureState) => {...}`
   * - `onStartShouldSetPanResponder: (e, gestureState) => {...}`
   * - `onStartShouldSetPanResponderCapture: (e, gestureState) => {...}`
   * - `onPanResponderReject: (e, gestureState) => {...}`
   * - `onPanResponderGrant: (e, gestureState) => {...}`
   * - `onPanResponderStart: (e, gestureState) => {...}`
   * - `onPanResponderEnd: (e, gestureState) => {...}`
   * - `onPanResponderRelease: (e, gestureState) => {...}`
   * - `onPanResponderMove: (e, gestureState) => {...}`
   * - `onPanResponderTerminate: (e, gestureState) => {...}`
   * - `onPanResponderTerminationRequest: (e, gestureState) => {...}`
   * - `onShouldBlockNativeResponder: (e, gestureState) => {...}`
   */
  create: function(config) {
    var gestureState = {
      // Useful for debugging
      stateID: Math.random(),
    };
    PanResponder._initializeGestureState(gestureState);
    var panHandlers = {
      onStartShouldSetResponder: function(e) {
        return config.onStartShouldSetPanResponder === undefined ? false :
          config.onStartShouldSetPanResponder(normalizeEvent(e), gestureState);
      },
      onMoveShouldSetResponder: function(e) {
        e.preventDefault()
        return config.onMoveShouldSetPanResponder === undefined ? false :
          config.onMoveShouldSetPanResponder(normalizeEvent(e), gestureState);
      },
      onStartShouldSetResponderCapture: function(e) {
        // TODO: Actually, we should reinitialize the state any time
        // touches.length increases from 0 active to > 0 active.
        if (e.nativeEvent.touches) {
          if (e.nativeEvent.touches.length === 1) {
            PanResponder._initializeGestureState(gestureState);
          }
        }
        else if (e.nativeEvent.type === 'mousedown') {
          PanResponder._initializeGestureState(gestureState);
        }
        gestureState.numberActiveTouches = e.touchHistory.numberActiveTouches;
        return config.onStartShouldSetPanResponderCapture !== undefined ?
          config.onStartShouldSetPanResponderCapture(normalizeEvent(e), gestureState) : false;
      },

      onMoveShouldSetResponderCapture: function(e) {
        e.preventDefault()
        var touchHistory = e.touchHistory;
        // Responder system incorrectly dispatches should* to current responder
        // Filter out any touch moves past the first one - we would have
        // already processed multi-touch geometry during the first event.
        if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
          return false;
        }
        PanResponder._updateGestureStateOnMove(gestureState, touchHistory);
        return config.onMoveShouldSetPanResponderCapture ?
          config.onMoveShouldSetPanResponderCapture(normalizeEvent(e), gestureState) : false;
      },

      onResponderGrant: function(e) {
        gestureState.x0 = currentCentroidX(e.touchHistory);
        gestureState.y0 = currentCentroidY(e.touchHistory);
        gestureState.dx = 0;
        gestureState.dy = 0;
        config.onPanResponderGrant && config.onPanResponderGrant(normalizeEvent(e), gestureState);
        // TODO: t7467124 investigate if this can be removed
        return config.onShouldBlockNativeResponder === undefined ? true :
          config.onShouldBlockNativeResponder();
      },

      onResponderReject: function(e) {
        config.onPanResponderReject && config.onPanResponderReject(normalizeEvent(e), gestureState);
      },

      onResponderRelease: function(e) {
        config.onPanResponderRelease && config.onPanResponderRelease(normalizeEvent(e), gestureState);
        PanResponder._initializeGestureState(gestureState);
        panHandlers.moveShould = null
      },

      onResponderStart: function(e) {
        var touchHistory = e.touchHistory;
        gestureState.numberActiveTouches = touchHistory.numberActiveTouches;
        config.onPanResponderStart && config.onPanResponderStart(normalizeEvent(e), gestureState);
      },

      onResponderMove: function(e) {
        var touchHistory = e.touchHistory;
        // Guard against the dispatch of two touch moves when there are two
        // simultaneously changed touches.
        if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
          return;
        }
        // Filter out any touch moves past the first one - we would have
        // already processed multi-touch geometry during the first event.
        PanResponder._updateGestureStateOnMove(gestureState, touchHistory);
        config.onPanResponderMove && config.onPanResponderMove(normalizeEvent(e), gestureState);
      },

      onResponderEnd: function(e) {
        var touchHistory = e.touchHistory;
        gestureState.numberActiveTouches = touchHistory.numberActiveTouches;
        config.onPanResponderEnd && config.onPanResponderEnd(normalizeEvent(e), gestureState);
        panHandlers.moveShould = null
      },

      onResponderTerminate: function(e) {
        config.onPanResponderTerminate &&
          config.onPanResponderTerminate(e, gestureState);
        PanResponder._initializeGestureState(gestureState);
        panHandlers.moveShould = null
      },

      onResponderTerminationRequest: function(e) {
        return config.onPanResponderTerminationRequest === undefined ? true :
          config.onPanResponderTerminationRequest(normalizeEvent(e), gestureState);
      },
    };
    return {panHandlers: panHandlers};
  },
};

function normalizeEvent(e) {
  const normalizedEvent = Object.create(e);
  normalizedEvent.nativeEvent = normalizeNativeEvent(e.nativeEvent, e.type);
  return normalizedEvent;
}

module.exports = PanResponder;