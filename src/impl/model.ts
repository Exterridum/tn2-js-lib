import Model from "../api/model";
import Protocol from "../connector/protocol";

abstract class BaseModel implements Model {
    name:string;
    hrefs:Map<Protocol, string>;
    type:String;

    getHrefByProtocol(protocol:Protocol) {
        return this.hrefs.get(protocol);
    }
}

export default BaseModel;