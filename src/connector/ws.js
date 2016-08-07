import Connector from "./api";
import { Deferred } from '../utils';

const MESSAGE_TYPE = {
    ACK: 0,
    DATA: 1
};

export class WebSocketConnector extends Connector {

    constructor(protocol, url) {
        super();
        this._url = url;
        this._open = false;
        this._subscriptions = new Map();
    }

    subscribe(topic, callback) {
        let callbacks = this._subscriptions.get(topic);
        if(!callbacks) {
            callbacks = [];
            this._subscriptions.set(topic, callbacks);
        }
        let deferred = new Deferred();
        callbacks.push(new Callback(callback, deferred));

        return deferred.promise();
    }

    open() {
        let ws = new WebSocket(conf);
        ws.onopen = this._handleOpen;
        ws.onclose = this._handleClose;
        ws.onmessage = this._executeCallback;
        this._ws = ws;
    }

    close() {
        if(this._open) {
            this._ws.close();
            this._open = false;
        }
    }

    isOpen() {
        return this._open;
    }

    _handleOpen() {
        this._open = true;
    }

    _handleClose() {
        this._open = false;
    }

    _handleAckMessage(message) {
        this._executeCallback("resolve", message);
    }

    _handleDataMessage(message) {
        this._executeCallback("call", message);
    }

    _handleMessage(rawMessage) {
        let message = JSON.stringify(rawMessage);

        switch(message.type) {
            case MESSAGE_TYPE.ACK:
                this._handleAckMessage(message);
                break;
            case MESSAGE_TYPE.DATA:
                this._handleDataMessage(message);
                break;
        }
    }

    _executeCallback(method, message) {
        let callbacks = this._subscriptions.get(message.topic);

        if(callbacks) {
            for(let callback of callbacks) {
                callback[method](message);
            }
        }
    }
}

class Callback {

    constructor(callback, deferred) {
        this._callback = callback;
        this._deferred = deferred;
    }

    call(message) {
        if(this._callback) {
            this._callback(message);
        }
    }

    resolve() {
        this._deferred.resolve();
        this._deferred = null;
    }

    get callback() {
        return this._callback;
    }

    get deferred() {
        return this._deferred;
    }
}