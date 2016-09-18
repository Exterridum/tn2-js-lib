import {TrackablePromise} from "./promise";
import Protocol from "../net/protocol";
import Encoding from "../encoding/encoding";

interface Action {
    invoke(params:any, protocol: Protocol, encoding: Encoding): TrackablePromise<any>;
}

export default Action;