

export class BaseModel {

    constructor(raw, thingDescription) {
        this._name = raw.name;
        this._hrefs = raw.hrefs;
        this._t = thingDescription;
    }
    
    resolveUrl() {
        return this._t.getUri() +
               "/" +
               this.getHref();
    }

    getHref() {
        return this._hrefs[0];
    }

    get thingDescription() {
        return this._t;
    }

    get name() {
        return this._name;
    }
    
    get hrefs() {
        return this._hrefs;
    }
}