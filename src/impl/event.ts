import Events from "../api/event";
import Protocol from "../connector/protocol";
import BaseModel from "./model";

export class ThingEvent extends BaseModel implements Events.Event {

    private listeners: Set<Events.EventListener> = new Set();

    subscribe(eventListener:Events.EventListener, protocol:Protocol) {
        this.listeners.add(eventListener);        
    }

    unsubscribe(eventListener:Events.EventListener) {
        this.listeners.delete(eventListener);
    }

    unsubscribeAll() {
    }
}

export class ThingEventListener implements Events.EventListener {

    func:Events.ListenerCallback;
    hashCode:number;

    constructor(func:Events.ListenerCallback, hashCode?:number) {
        this.func = func;
        if(this.hashCode == null) {
            this.hashCode = 0;
        }
    }
}