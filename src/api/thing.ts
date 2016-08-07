import Protocol from "../connector/protocol";
import {TrackablePromise} from "./promise";
import Events from "./event";

interface Thing {
    // custom methods
    setProtocol(protocol: Protocol);

    addListener(event: string, listener: Events.EventListener): Thing;
    removeListener(event: string, listener: Events.EventListener): Thing;
    removeAllListeners(event: string): Thing;
    invokeAction(action: string, actionParams: any): TrackablePromise<Object>;
    getProperty(property: string): Promise<any>;
    setProperty(property: string, value: any): Promise<any>;
    getDescription(): Object;
}

export default Thing;