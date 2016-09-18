import Things from "../api/wot";
import Thing from "../api/thing"
import WebThing from "./thing";
import {UriUtils, StringUtils} from "../common/utils";
import {Resolver} from "../net/resolver";
import ThingDescription from "./description";
import Encoding from "../encoding/encoding";

export default class WebOfThings implements Things {
    
    constructor(private discoveryUri: string = "") {
        
    }

    // TODO witll be different in the future
    discover(type: string) : Promise<Array<Thing>> {    
        if(StringUtils.isEmpty(this.discoveryUri)) {
            throw new TypeError("no discovery uri");
        }

        let protocol = UriUtils.getProtocolFromUri(this.discoveryUri);
        return Resolver
            .resolve(protocol, Encoding.JSON)
            .getLinks(this.discoveryUri)
            .then((response) => {
                let promises = [];
                for(let link of response.links) {
                    promises.push(this.consumeDescriptionUri(link.href));
                }                
                return Promise.all(promises);
            });
    }

    consumeDescription(description: any) : Promise<Thing> {
        return new Promise((resolve, reject) => {
            let d = new ThingDescription(description);
            resolve(new WebThing(d))
        });
    }

    consumeDescriptionUri(uri: string) : Promise<Thing> {
        let protocol = UriUtils.getProtocolFromUri(this.discoveryUri);

        return Resolver
            .resolve(protocol, Encoding.JSON)
            .getThing(uri)
            .then((description) => {
                return new Promise((resolve) => {
                    let d = new ThingDescription(description);
                    resolve(new WebThing(d))                
                })
        })
    } 
}