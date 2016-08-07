import Description from "../api/description";
import Action from "../api/action";
import Events from "../api/event";
import Property from "../api/property";

export class ThingDescription implements Description {

    private events: Map<String, Events.Event> = new Map();
    private actions: Map<String, Action> = new Map();
    private properties: Map<String, Property> = new Map();

    constructor(private rawDescription: Object) {
        
    }

    getEvent(event:string):Events.Event {
        return this._get("events", event);
    }

    getAction(action:string):Action {
        return this._get("actions", action);
    }

    getProperty(property:string):Property {        
        return this._get("properties", property);
    }
    
    getRawDescription():Object {
        return this.rawDescription;
    }

    _get(map, name) {
        let value = this[map].get(name);
        if(value == null) {
            throw new ReferenceError();
        }
        return value;
    }
}