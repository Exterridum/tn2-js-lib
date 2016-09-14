import Protocol from "../net/protocol";
import {TrackablePromise} from "./promise";
import Events from "./event";

interface Thing {
    // custom methods
    setProtocol(protocol: Protocol);
    
    addListener(event: string, listener: Events.ListenerCallback): Thing;
    removeListener(event: string, listener: Events.ListenerCallback): Thing;
    removeAllListeners(event: string): Thing;
    invokeAction(action: string, actionParams: any): TrackablePromise<Object>;
    getProperty(property: string): Promise<any>;
    setProperty(property: string, value: any): Promise<any>;
    getDescription(): Object;
}

export default Thing;