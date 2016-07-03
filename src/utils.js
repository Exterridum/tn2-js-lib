
export class CommonUtils {

    static processUrl(url, params) {
        for(let param in params) {
            url = url.replace("{" + param + "}", params[value]);
        }
        return url;
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