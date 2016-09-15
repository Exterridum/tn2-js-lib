import Encoding from "./encoding";
import Encoder from "./encoder";

export interface EncodingResolver {
    resolve(encoding: Encoding) ;
}

export class DefaultEncodingResolver implements EncodingResolver {

    private encoders: Map<Encoding, Encoder>;

    constructor() {

    }

    resolve(encoding:Encoding) : Encoder {
        let encoder = this.encoders.get(encoding);
        if(encoder == null) {
            throw new TypeError();
        }
        return encoder;
    }
}