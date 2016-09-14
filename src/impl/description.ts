import Description from "../api/description";
import Protocol from "../net/protocol";
import Model from "../api/Model";
import Action from "../api/action";
import Events from "../api/event";
import Property from "../api/property";
import {ThingEvent} from "./event";
import {ThingAction} from "./action";
import {ThingProperty} from "./property";
import {UriUtils} from "../common/utils";

export default class ThingDescription implements Description {

    private events: Map<string, Event> = new Map<string, Event>();
    private actions: Map<string, Action> = new Map<string, Action>();
    private properties: Map<string, Property> = new Map<string, Property>();

    private uris:Map<Protocol, string>;

    constructor(private description: any) {
        this.parse("events", "name", this.events, ThingEvent);            
        this.parse("actions", "name", this.actions, ThingAction);            
        this.parse("properties", "name", this.properties, ThingProperty);
        this.uris = UriUtils.getUrisMap(description.uris);
    }

    getEvent(event:string):Events.Event {
        return this.get("events", event);
    }

    getAction(action:string):Action {
        return this.get("actions", action);
    }

    getProperty(property:string):Property {        
        return this.get("properties", property);
    }

    getRawDescription():Object {
        return this.description;
    }

    private get(map, name):any {
        let value = this[map].get(name);
        if(value == null) {
            throw new ReferenceError();
        }
        return value;
    }

    private parse<V>(property: string, keyProperty: string, map: any, obj: any): void {
        let props = this.description[property];
        if(props) {
            for(let p of props) {
                let instance = new obj(p);
                instance.initialize(p, this);
                map.set(p[keyProperty], instance);
            }
        }       
    }
}