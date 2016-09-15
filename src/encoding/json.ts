import Encoder from "./encoder";

export default class JsonEncoder implements Encoder {

    encode(data:any) : any {
        if(data) {
            return JSON.stringify(data);
        }
        return "";
    }

    decode(data:any):any {
        if(data) {
            return JSON.parse(data);
        }
        return {};
    }
}