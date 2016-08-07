export class ThingDescription {

    constructor(description) {
        this._description = description;
        this._uris = this._parseUris(description);
        this._properties = this._parseProperties(description);
        this._events = this._parseEvents(description);
        this._actions = this._parseActions(description);
    }
    
    _parseProperties(description) {
        return ThingDescription
            .parse(description, "properties", "name", ThingProperty)
    }

    _parseEvents(description) {
        return ThingDescription
                .parse(description, "events", "name", ThingEvent)
    }

    _parseActions(description) {
        return ThingDescription
            .parse(description, "actions", "name", ThingAction);
    }

    _parseUrs(description) {
        let uriMap = new Map();
        for(let uri of description.uris) {

        }
        return uriMap;
    }

    getUri() {

    }

    getUrisByProtocol(protocol) {
        return this._uris.get(protocol);
    }

    getEvent(event) {
        return this._events.get(event);
    }

    getProperty(property) {
        return this._properties.get(property);
    }

    getAction(action) {
        return this._actions.get(action);
    }
    
    get urls() {
        return this._urls;
    }

    get events() {
        return this._events;
    }

    get properties() {
        return this._properties;
    }

    get actions() {
        return this._actions;
    }

    static parse(description, property, keyProperty, obj) {
        let map = new Map();
        let props = description[property];
        if(events) {
            for(let p of props) {
                map.set(p[keyProperty], new obj(p[keyProperty]));
            }
        }
        return map;
    }
}