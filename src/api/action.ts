import {TrackablePromise} from "./promise";

interface Action {
    invoke(params: any): TrackablePromise<any>;
}

export default Action;