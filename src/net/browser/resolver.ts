import Protocol from "../protocol";
import Connector from "../connector";
import {WsConnector} from "./ws";
import {HttpConnector} from "./http";
import {Resolver, ProtocolResolver} from "../resolver";

export default class BrowserProtocolResolver implements ProtocolResolver {

    private connectors: Map<Protocol, Connector>;
    
    constructor() {
        this.connectors = new Map<Protocol, Connector>();
        let wsConnector = new WsConnector();       
        this.connectors.set(Protocol.WS, wsConnector);
        this.connectors.set(Protocol.WSS, wsConnector);
        let httpConnector = new HttpConnector();        
        this.connectors.set(Protocol.HTTP, httpConnector);        
        this.connectors.set(Protocol.HTTPS, httpConnector);
    }

    resolve(protocol: Protocol): Connector {
        let connector = this.connectors.get(protocol); 
        if(connector == null) {
            throw new TypeError("connector not found");
        }
        return connector;
    }
}