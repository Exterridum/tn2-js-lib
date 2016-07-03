import Connector from 'connector'
import WebSocketSubscriber from 'ws'

const restResources = getRestResources();

class BaseRestConnector extends Connector {

    constructor(url, protocol) {
        super(url, protocol);
    }

    getModel() {
        return this._getResource("model");
    }

    getProperties() {
        return this._getResource("properties");
    }

    getProperty(property) {
        return this._getResource("property", { id: property })
    }

    setProperty(property, values) {
        return fetch(this._assembleAndProcess("property", { id: property }),
                    {
                        method: "PUT",
                        body: JSON.stringify(values)
                    }
                )
                .then((response) => response.json());
    }

    getActions() {
        return this._getResource("actions");
    }

    getAction(action) {
        return this._getResource("action", { id: action });
    }

    executeAction(action, actionData = {}) {
        return fetch(this._assembleAndProcess("executeAction", { id: action }),
                    {
                        method: "POST",
                        body: JSON.stringify(actionData)
                    }
                )
                .then((response) => response.json());
    }

    getActionExecutionStatus(action, actionId) {
        return fetch(this._assembleAndProcess("action", { id: action, actionId: actionId }))
                .then((response) => response.json());
    }

    _getResource(resourceName, params) {
        return fetch(this._assembleAndProcess(restResources.get(resourceName), params))
                .then((response) => response.json());
    }
}

export class StrictRestConnector extends BaseRestConnector {

    constructor(url) {
        super(url);
    }

    subscribe(topic, callback) {
        this._subscriber = new WebSocketSubscriber(this._url, null);
        this._subscriber.open();
        return this._subscriber.subscribe(topic, callback);
    }
}

export class QuirkRestConnector extends BaseRestConnector {

    constructor(url, subscriber) {
        super(url);
        this._subscriber = subscriber;
        this._subscriber.open();
    }

    subscribe(topic, callback, ack) {
        return this._subscriber.subscribe(topic, callback);
    }
}

function getRestResources() {
    var urlMap = new Map();
    urlMap.set("model", "/model/");
    urlMap.set("properties", "/properties/");
    urlMap.set("property", "/properties/{id}/");
    urlMap.set("actions", "/actions/");
    urlMap.set("action", "/actions/{id}/");
    urlMap.set("executeAction", "/actions/{id}/{actionId}");
    return urlMap;
}