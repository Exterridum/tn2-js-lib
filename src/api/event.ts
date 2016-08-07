import Protocol from "../connector/protocol";
import Model from "./model";

namespace Events {
    export interface Event extends Model {
        subscribe(eventListener: EventListener, protocol: Protocol);
        unsubscribe(eventListener: EventListener);
        unsubscribeAll();
    }

    export interface EventListener {
        func: ListenerCallback;
        hashCode: number;
    }
    
    export type ListenerCallback = (value: any) => void;
}

export default Events;