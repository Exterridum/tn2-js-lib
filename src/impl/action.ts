import Action from "../api/action";
import {TrackablePromise} from "../api/promise";

export class ThingAction implements Action {

    invoke(params:any): TrackablePromise<any> {
        return null;
    }
}
