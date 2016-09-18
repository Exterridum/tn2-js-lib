import Property from "../api/property";
import ThingModel from "./model";
import Protocol from "../net/Protocol";
import {Resolver} from "../net/resolver";
import Encoding from "../encoding/encoding";

export class ThingProperty extends ThingModel implements Property {

    getValue(protocol: Protocol, encoding: Encoding) : Promise<any> {
        return Resolver
                .resolve(protocol, encoding)
                .getProperty(this.getUriByProtocol(protocol));    
    }
    
    setValue(protocol: Protocol, value: any, encoding: Encoding) : Promise<any> {
        return Resolver
                .resolve(protocol, encoding)
                .setProperty(this.getUriByProtocol(protocol), {
                    value: true,
                });
    }
}