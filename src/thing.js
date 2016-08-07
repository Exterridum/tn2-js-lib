import { ThingDesription } from "./thing_description";

export class Thing {

    constructor(connector, description) {
        this._connector = connector;            
        this._description = description;
        this._thingDescription = new ThingDescription(description);
    }

    _getEvent(eventName) {
        let event = this._description.getEvent(eventName);
        if(event == null) {
            throw new Error("No event named: " + eventName);
        }
        return event;
    }

    addListener(eventName, thingListener) {
        this._getEvent(eventName).addListener(thingListener);
        return this;
    }

    removeListener(event, thingListener) {
        this._getEvent(eventName).removeListener(event, thingListener);
        return this;
    }

    removeAllListeners(eventName) {
        this._getEvent(eventName).removeAllListeners();
    }

    invokeAction(actionName, args) {
        let action = this._thingDescription.getAction(actionName);
        if(action == null) {
            throw new Error("No action named: " + eventName);
        }
        return action.invoke(args);
    }

    _getProperty(propertyName) {
        let property = this._thingDescription.getProperty(propertyName);
        if(property == null) {
            throw new Error("No property named: " + propertyName);
        }
        return property;
    }

    getProperty(propertyName) {
        this._getProperty(propertyName).getValue();
    }

    setProperty(propertyName, value) {
        this._getProperty(propertyName).setValue(value);
    }

    getDescription() {
        return this._thingDescription;
    }
}