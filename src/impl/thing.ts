import Thing from "../api/thing";
import Protocol from "../net/protocol"
import {TrackablePromise} from "../api/promise";
import Events from "../api/event";
import Description from "../api/description";

export default class WebThing implements Thing {

    private protocol: Protocol;

    constructor(private description: Description) {
                
    }
   
    setProtocol(protocol: Protocol) {
       this.protocol = protocol;
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

    invokeAction(action:string, actionParams:any):TrackablePromise<Object> {
        let a = this.description.getAction(action);        
        return a.invoke(actionParams);
    }

    getProperty(property:string):Promise<any> {        
        return this.description.getProperty(property).getValue();
    }

    setProperty(property:string, value:any) {
        return this.description.getProperty(property).setValue(value);
    }

    getDescription():Object {
        return this.description;
    }
}