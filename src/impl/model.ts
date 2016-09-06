import Model from "../api/model";
import Description from "../api/description";
import Protocol from "../net/Protocol";

abstract class ThingModel implements Model {

    public name: string;
    public type: any;
    public hrefs: Array<string>;   
    private description: Description;
    public uris: Map<Protocol, string>;

    initialize(model: any, description: Description) {
        this.name = model.name;
        this.type = model["@type"];
        this.hrefs = model.hrefs;
        this.description = description;
    }
  
    getUriByProtocol(protocol: Protocol) :string {       
        return null;
    }
}

export default ThingModel;
