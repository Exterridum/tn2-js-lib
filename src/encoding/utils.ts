import Encoding from "./encoding";
import {CommonUtils} from "../common/utils";

export default class EncodingUtils {

    public static getEncodings(encodings: Array<string>) : Set<Encoding> {
        let result = new Set<Encoding>();

        for(let e of encodings) {
            let encoding = Encoding[e.toUpperCase()];
            if(CommonUtils.exists(encoding)) {
                result.add(encoding);
            }
        }
        return result;
    }
}