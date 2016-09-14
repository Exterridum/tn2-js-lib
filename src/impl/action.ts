import Action from "../api/action";
import ThingModel from "./model";
import {TrackablePromise} from "../api/promise";
import {Resolver} from "../net/resolver";
import Protocol from "../net/protocol";

export class ThingAction extends ThingModel implements Action {
    
    invoke(params:any, protocol: Protocol): TrackablePromise<any> {
        Resolver.resolve(protocol);
        return null;
    }
}