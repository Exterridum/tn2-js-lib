

export class SimpleThingListener {

    constructor(callback) {
        this._id = null; // todo generate id
        this._callback = callback;
    }

    get id() {
        return this._id;
    }

    get callback() {
        return this._callback;
    }
}

export class ComplexThingListener {

    constructor(simpleThingListener) {
        this._simple = simpleThingListener;
    }

    open() {
        this._connection.subscribe(this._callback);
    }

    close() {
        this._connection.unSubscribe(this._callback);
    }

    set connection(connection) {
        this._connection = connection;
    }
}