
const MESSAGE_TYPE = {
    ACK, 0,
    DATA: 1
};

export class WebSocketSubscriber {

    constructor(url, mode) {
        this._url = url;
        this._mode = mode;
        this._open = false;
        this._subscriptions = new Map();
    }

    subscribe(topic, callback) {
        let callbacks = this._subscriptions.get(topic);
        if(!callbacks) {
            callbacks = [];
            this._subscriptions.set(topic, callbacks);
        }
        callbacks.push(callback);
/*
        return new Promise((resolve, reject) => {
            resolve.()
        })*/
    }

    open() {
        let ws = new WebSocket(conf);
        ws.onopen = this._handleOpen;
        ws.onclose = this._handleClose;
        ws.onmessage = this._handleMessage;
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

    }

    _handleDataMessage(message) {
        let callbacks = this._subscriptions.get(message.topic);

        if(callbacks) {
            for(let callback of callbacks) {
                callback(message);
            }
        }
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

}

class SubscriptionWrapper {

    constructor() {

    }
}