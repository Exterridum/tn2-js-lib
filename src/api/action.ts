import {TrackablePromise} from "./promise";
import Protocol from "../net/protocol";

interface Action {
    invoke(params:any, protocol: Protocol): TrackablePromise<any>;
}

export default Action;