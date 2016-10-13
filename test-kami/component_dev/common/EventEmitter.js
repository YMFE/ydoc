'use strict';

const Apply = Function.prototype.apply;
const privateMap = new WeakMap();

// For making private properties.
function internal(obj) {
  if (!privateMap.has(obj)) {
    privateMap.set(obj, {});
  }

  return privateMap.get(obj);
}

/** Class EventEmitter for event-driven architecture. */
export default class EventEmitter {
  /**
   * Constructor.
   *
   * @constructor
   * @param {number|null} maxListeners.
   * @param {object} localConsole.
   *
   * Set private initial parameters:
   *   _events, _callbacks, _maxListeners, _console.
   *
   * @return {this}
   */
  constructor(maxListeners = null, localConsole = console) {
    const self = internal(this);

    self._events = new Set();
    self._callbacks = {};
    self._console = localConsole;
    self._maxListeners = maxListeners === null ?
      null : parseInt(maxListeners, 10);

    return this;
  }

  /**
   * Add callback to the event.
   *
   * @param {string} eventName.
   * @param {function} callback
   * @param {object|null} context - In than context will be called callback.
   * @param {number} weight - Using for sorting callbacks calls.
   *
   * @return {this}
   */
  _addCallback(eventName, callback, context, weight) {
    this._getCallbacks(eventName)
      .push({
        callback,
        context,
        weight
      });

    // Sort the array of callbacks in
    // the order of their call by "weight".
    this._getCallbacks(eventName)
      .sort((a, b) => a.weight > b.weight);

    return this;
  }

  /**
   * Get all callback for the event.
   *
   * @param {string} eventName
   *
   * @return {object|undefined}
   */
  _getCallbacks(eventName) {
    return internal(this)._callbacks[eventName];
  }

  /**
   * Get callback's index for the event.
   *
   * @param {string} eventName
   * @param {callback} callback
   *
   * @return {number|null}
   */
  _getCallbackIndex(eventName, callback) {
    return this._has(eventName) ?
      this._getCallbacks(eventName)
        .findIndex((element) => element.callback === callback) : null;
  }

  /**
   * Check if we achive maximum of listeners for the event.
   *
   * @param {string} eventName
   *
   * @return {bool}
   */
  _achieveMaxListener(eventName) {
    return (internal(this)._maxListeners !== null &&
      internal(this)._maxListeners <= this.listenersNumber(eventName));
  }

  /**
   * Check if callback is already exists for the event.
   *
   * @param {string} eventName
   * @param {function} callback
   * @param {object|null} context - In than context will be called callback.
   *
   * @return {bool}
   */
  _callbackIsExists(eventName, callback, context) {
    const callbackInd = this._getCallbackIndex(eventName, callback);
    const activeCallback = callbackInd !== -1 ?
      this._getCallbacks(eventName)[callbackInd] : void 0;

    return (callbackInd !== -1 && activeCallback &&
      activeCallback.context === context);
  }

  /**
   * Check is the event was already added.
   *
   * @param {string} eventName
   *
   * @return {bool}
   */
  _has(eventName) {
    return internal(this)._events.has(eventName);
  }

  /**
   * Add the listener.
   *
   * @param {string} eventName
   * @param {function} callback
   * @param {object|null} context - In than context will be called callback.
   * @param {number} weight - Using for sorting callbacks calls.
   *
   * @return {this}
   */
  on(eventName, callback, context = null, weight = 1) {
    /* eslint no-unused-vars: 0 */
    const self = internal(this);

    if (typeof callback !== 'function') {
      throw new TypeError(`${callback} is not a function`);
    }

    // If event wasn't added before - just add it
    // and define callbacks as an empty object.
    if (!this._has(eventName)) {
      self._events.add(eventName);
      self._callbacks[eventName] = [];
    } else {
      // Check if we reached maximum number of listeners.
      if (this._achieveMaxListener(eventName)) {
        self._console.warn(`Max listeners (${self._maxListeners})` +
          ` for event "${eventName}" is reached!`);
      }

      // Check if the same callback has already added.
      if (this._callbackIsExists(...arguments)) {
        self._console.warn(`Event "${eventName}"` +
          ` already has the callback ${callback}.`);
      }
    }

    this._addCallback(...arguments);

    return this;
  }

  /**
   * Add the listener which will be executed only once.
   *
   * @param {string} eventName
   * @param {function} callback
   * @param {object|null} context - In than context will be called callback.
   * @param {number} weight - Using for sorting callbacks calls.
   *
   * @return {this}
   */
  once(eventName, callback, context = null, weight = 1) {
    const onceCallback = (...args) => {
      this.off(eventName, onceCallback);
      return Apply.call(callback, context, args);
    };

    return this.on(eventName, onceCallback, context, weight);
  }

  /**
   * Remove an event at all or just remove selected callback from the event.
   *
   * @param {string} eventName
   * @param {function} callback
   *
   * @return {this}
   */
  off(eventName, callback = null) {
    const self = internal(this);
    let callbackInd;

    if (this._has(eventName)) {
      if (callback === null) {
        // Remove the event.
        self._events.delete(eventName);
        // Remove all listeners.
        self._callbacks[eventName] = null;
      } else {
        callbackInd = this._getCallbackIndex(eventName, callback);

        if (callbackInd !== -1) {
          self._callbacks[eventName].splice(callbackInd, 1);
          // Remove all equal callbacks.
          this.off(...arguments);
        }
      }
    }

    return this;
  }

  /**
   * Trigger the event.
   *
   * @param {string} eventName
   * @param {...args} args - All arguments which should be passed into callbacks.
   *
   * @return {this}
   */
  emit(eventName, ...args) {
    if (this._has(eventName)) {
      // All callbacks will be triggered sorter by "weight" parameter.
      this._getCallbacks(eventName)
        .forEach((element) =>
          Apply.call(element.callback, element.context, args)
        );
    }

    return this;
  }

  /**
   * Clear all events and callback links.
   *
   * @return {this}
   */
  clear() {
    const self = internal(this);

    self._events.clear();
    self._callbacks = {};

    return this;
  }

  /**
   * Returns number of listeners for the event.
   *
   * @param {string} eventName
   *
   * @return {number|null} - Number of listeners for event
   *                         or null if event isn't exists.
   */
  listenersNumber(eventName) {
    return this._has(eventName) ?
      this._getCallbacks(eventName).length : null;
  }
}
