import * as factory from "./connector/factory"

class WebOfThings {

    constructor() {
        this._things = new Map();
    }

    discover(type, filter = {}) {
    }

    consumeDescription(description = {}) {
        
    }

    consumeDescriptionUri(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                    return response.json();
                })
                .then((description) => {

                }).catch((err) => {
                throw new Error(err);
            });

            this._things.put(uri, thing);

            resolve(new Thing(protocol, url));
        });
    }
}

export default new WebOfThings();