import Action from "../api/action";
import ThingModel from "./model";
import {TrackablePromise} from "../api/promise";
import {Resolver} from "../net/resolver";
import Protocol from "../net/protocol";
import Encoding from "../encoding/encoding";

export class ThingAction extends ThingModel implements Action {
    
    invoke(params:any, protocol: Protocol, encoding: Encoding): TrackablePromise<any> {
        Resolver.resolve(protocol, encoding);
        return null;
    }
}