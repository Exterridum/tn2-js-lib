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
        e.subscribe(eventListener, this.protocol, this.encoding);
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
        return this.description.getAction(action)
                               .invoke(actionParams, this.protocol, this.encoding);
    }

    getProperty(property:string) : Promise<any> {        
        return this.description.getProperty(property)
                               .getValue(this.protocol, this.encoding);
    }

    setProperty(property:string, value:any) {
        return this.description.getProperty(property)
                               .setValue(value, this.protocol, this.encoding);
    }

    getDescription():Object {
        return this.description;
    }
}