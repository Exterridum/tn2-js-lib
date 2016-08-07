import * as api from "./api";

class HttpSubscription extends api.Subscription {

    constructor(callback) {
        this._callback = callback;
        this._isRunning = true;
        this._poll();
    }

    _poll() {
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then(() => {
                if(this._isRunning) {
                    this._poll();
                }
            })
            .catch(() => {
                
            });
    }

    cancel() {
        this._isRunning = false;
    }

    get isRunning() {
        return this._isRunning;
    }
}

export default class HttpConnector extends api.Connector {

    constructor(protocol) {
        super(protocol);        
    }

    subscribe(url, callback) {
        return new HttpSubscription(url, callback);
    }

    request(url, config) {
        return fetch(url, config);
    }
}