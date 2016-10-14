/**
 * Created by Ellery1 on 16/8/17.
 */
import EventEmitter from './EventEmitter';

export default class ComponentCore extends EventEmitter {

    static instanceId = -1;

    constructor(namespace) {
        super();
        this.instanceId = ++ComponentCore.instanceId;
        this.namespace = namespace;
    }

    _getEventName(eventName) {
        return 'yo/component/' + this.namespace + '/' + eventName + '/' + this.instanceId;
    }

    emitEvent(eventName, ...args) {
        this.emit(this._getEventName(eventName), ...args);
        return this;
    }

    registerEventHandler(eventName, handler) {
        this.on(this._getEventName(eventName), handler.bind(this));
        return this;
    }
}