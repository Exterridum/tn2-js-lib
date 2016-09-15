import Thing from "../api/thing";
import Protocol from "../net/protocol"
import {TrackablePromise} from "../api/promise";
import Events from "../api/event";
import Description from "../api/description";
import Encoding from "../encoding/encoding";
import ThingDescription from "./description";

export default class WebThing implements Thing {

    private protocol: Protocol;
    private encoding: Encoding;

    constructor(private description: Description) {
        let thingDescription = (<ThingDescription> description);
        this.protocol = thingDescription.getDefaultProtocol();
        this.encoding = thingDescription.getDefaultEncoding();
    }

    setProtocol(protocol: Protocol) {
       this.protocol = protocol;
    }
    
    setEncoding(encoding: Encoding) {
        this.encoding = encoding;
    }

    addListener(event:string, eventListener:Events.ListenerCallback): Thing {
        let e = this.description.getEvent(event);
        e.subscribe(eventListener, this.protocol);
        return this;
    }
    
    removeListener(event:string, eventListener:Events.ListenerCallback): Thing {
        let e = this.description.getEvent(event);
        e.unsubscribe(eventListener, this.protocol);
        return this;
    }

    removeAllListeners(event: string): Thing {
        let e = this.description.getEvent(event);
        e.unsubscribeAll(this.protocol);
        return this;
    }

    invokeAction(action:string, actionParams:any) : TrackablePromise<Object> {
        let a = this.description.getAction(action);        
        return a.invoke(actionParams, this.protocol);
    }

    getProperty(property:string) : Promise<any> {        
        return this.description.getProperty(property).getValue(this.protocol);
    }

    setProperty(property:string, value:any) {
        return this.description.getProperty(property).setValue(value, this.protocol);
    }

    getDescription():Object {
        return this.description;
    }
}