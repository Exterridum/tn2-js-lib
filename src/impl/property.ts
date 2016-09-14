import Property from "../api/property";
import ThingModel from "./model";
import Protocol from "../net/Protocol";
import {Resolver} from "../net/resolver";

export class ThingProperty extends ThingModel implements Property {

    getValue(protocol: Protocol) : Promise<any> {       
        return Resolver
                .resolve(protocol)
                .getProperty(this.getUriByProtocol(protocol));    
    }

    setValue(protocol: Protocol, value: any) : Promise<any> {       
        return Resolver
                .resolve(protocol)
                .setProperty(this.getUriByProtocol(protocol), {
                    value: true,
                });
    }
}