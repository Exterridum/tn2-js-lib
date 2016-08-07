
export class CommonUtils {

    static processUrl(url, params) {
        for(let param in params) {
            url = url.replace("{" + param + "}", params[value]);
        }
        return url;
    }

    static parseUrl(urlStr) {
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
}

export class ArrayMap {

    constructor() {
        this._map = new Map();
    }

    get(key) {
        return this._map.get(key);
    }
            
    put(key, value) {
        let arr = this._map.get(key);
        if(arr == null) {
            arr = [];
            this._map.put(key, arr);
        }
        arr.push(value);
        return arr;
    }

    remove(key, index) {
        let arr = this._map.get(key);
        if(arr == null) {
            return null;
        }
        return arr.splice(index, 0);
    }
}

export class Deferred {

    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    promise() {
        return this._promise;
    }

    reject(data) {
        this._reject(data);
    }

    resolve(data) {
        this._resolve(data);
    }
}