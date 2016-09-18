import Protocol from "../net/protocol";
import Model from "./model";
import Encoding from "../encoding/encoding";

namespace Events {
    export interface Event extends Model {
        subscribe(listenerCallback: ListenerCallback, protocol: Protocol, encoding: Encoding): void;
        unsubscribe(listenerCallback: ListenerCallback, protocol:Protocol): void;
        unsubscribeAll(protocol:Protocol): void;
    }

    export type ListenerCallback = (value: any) => void;
}

export default Events;