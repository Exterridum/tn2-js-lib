import Protocol from "../net/protocol";
import Model from "./model";

namespace Events {
    export interface Event extends Model {
        subscribe(listenerCallback: ListenerCallback, protocol: Protocol): void;
        unsubscribe(listenerCallback: ListenerCallback, protocol:Protocol): void;
        unsubscribeAll(protocol:Protocol): void;
    }
          
    export type ListenerCallback = (value: any) => void;
}

export default Events;