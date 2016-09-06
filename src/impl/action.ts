import Action from "../api/action";
import ThingModel from "./model";
import {TrackablePromise} from "../api/promise";

export class ThingAction extends ThingModel implements Action {
    
    invoke(params:any): TrackablePromise<any> {
        return null;
    }
}
