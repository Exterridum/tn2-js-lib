import HttpConnector from "./http";

export const HTTP = "http";
export const WS = "ws";

class ConnectorFactory {

    constructor() {
        this._connectors = new Map();
    }

    getConnector(protocol) {
        switch (protocol) {
            case HTTP:
                return new HttpConnector(uri);
            case WS:
                return null;
        }
    }
}

export const ConnFactory = new ConnectorFactory();