import {BaseModel} from "./model";
import {ConnFactory} from "./connector/factory";

export class Event extends BaseModel {
    
    constructor(raw, thingDescription) {
        super(thingDescription, raw);
        this._listeners = new Map();
    }

    addListener(listener) {
        listener.setConnection(this._t.getConnection());
        listener.open();
        this._listeners.set(listener.id, listener);
    }

    removeListener(listener) {
        listener = this._listeners.get(listener.id);
        listener.close();
        this._listeners.delete(listener.id);
    }

    removeAllListeners() {
        for(let [key, value] of this._listeners) {
            value.close();
        }
        this._listeners = new Map();
    }
}