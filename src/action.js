import {BaseModel} from "./model";
import {ConnFactory} from "./connector/factory";

export class Action extends BaseModel {
    constructor(thingDescription) {
        super(thingDescription);
    }

    invoke() {
        return ConnFactory.getConnector(this.resolveUrl()).request({
            method: "POST",
            body: JSON.stringify(args)
        }).then(() => {
            return new Promise((resolve) => {
                resolve(new ActionStatus(action))
            });
        }).catch((err) => {
            return new Promise((resolve, reject) => {
                reject(err)
            });
        });
    }
}