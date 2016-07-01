
import * as consts from "consts";

function parseUrl(urlStr) {
    if(!(url instanceof String)) {
       throw new Error("Invalid Url type");
    }

    let splitUrl = urlStr.split(":");
    if(splitUrl.length == 0 &&
       splitUrl.length > 2) {
        throw new Error("Invalid Url structure");
    }

    let protocol;
    for(let p of consts.PROTOCOLS) {
        if(p === splitUrl[0]) {
            protocol = p;
        }
    }

    if(!protocol) {
        throw new Error("Invalid protocol in Url: " + splitUrl[0]);
    }

    return {
        protocol: protocol,
        url: splitUrl[1]
    };
}

export const wot = {
    newInstance: (urlStr, mode) => {
        let [url, protocol] = parseUrl(urlStr);

        switch (mode) {
            case consts.STRICT_MODE:
                return new StrictDatasource(url, protocol);
            case consts.QUIRK_MODE:
                return new QuirkDatasource(url, protocol);
            default:
                throw new Error("Invalid mode specified: " + mode);
        }
    }
};