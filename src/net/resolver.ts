import Protocol from "./protocol";
import Connector from "./connector";
import {WsConnector} from "./ws";

class ProtocolResolver {

    private connectors: Map<Protocol, Connector>;
    
    constructor() {
        this.connectors = new Map<Protocol, Connector>();
        let wsConnector = new WsConnector();       
        this.connectors.set(Protocol.WS, wsConnector);
        this.connectors.set(Protocol.WSS, wsConnector);
    }

    resolve(protocol: Protocol): Connector {
        let connector = this.connectors.get(protocol); 
        if(connector == null) {
            throw new TypeError();
        }
        return connector;
    }
}

export const Resolver = new ProtocolResolver(); 