/// <reference path="../../node_modules/@types/es6-promise/index.d.ts"/>
/// <reference path="../../node_modules/@types/es6-collections/index.d.ts"/>
/// <reference path="../../node_modules/@types/whatwg-fetch/index.d.ts"/>

import Things from "../api/wot";
import Thing from "../api/thing"
import WebThing from "./thing";
import ThingDescription from "./description";

export default class WebOfThings implements Things {

    discover(type: string): Promise<Array<Thing>> {
        return null;
    }

    consumeDescription(description: any): Promise<Thing> {
        return new Promise((resolve, reject) => {
            let d = new ThingDescription(description);
            resolve(new WebThing(d))
        });
    }

    consumeDescriptionUri(uri: string): Promise<Thing> {        
        return fetch(uri).then((result) => {
            return result.json();
        }).then((description) => {
            return new Promise((resolve) => {
                let d = new ThingDescription(description);
                resolve(new WebThing(d))                
            })
        })
    } 
}