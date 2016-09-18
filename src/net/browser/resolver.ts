import Protocol from "../protocol";
import Connector from "../connector";
import {WsConnector} from "./ws";
import {HttpConnector} from "./http";
import {ProtocolResolver} from "../resolver";
import Encoding from "../../encoding/encoding";
import Encoder from "../../encoding/encoder";
import JsonEncoder from "../../encoding/json";
import XmlEncoder from "../../encoding/xml";

export default class BrowserProtocolResolver implements ProtocolResolver {

    private connectors: Map<Protocol, Connector>;
    private encoders: Map<Encoding, Encoder>;

    constructor() {
        this.iniConnectors();
        this.iniEncoders();
    }

    private iniConnectors() : void {
        this.connectors = new Map<Protocol, Connector>();
        let wsConnector = new WsConnector();
        this.connectors.set(Protocol.WS, wsConnector);
        this.connectors.set(Protocol.WSS, wsConnector);
        let httpConnector = new HttpConnector();
        this.connectors.set(Protocol.HTTP, httpConnector);
        this.connectors.set(Protocol.HTTPS, httpConnector);
    }

    private iniEncoders() : void {
        this.encoders = new Map<Encoding, Encoder>();
        this.encoders.set(Encoding.JSON, new JsonEncoder());
    }

    resolve(protocol: Protocol, encoding: Encoding): Connector {
        let connector = this.connectors.get(protocol); 
        if(connector == null) {
            throw new TypeError("connector not found");
        }
        let encoder = this.encoders.get(encoding);
        if(encoder == null) {
            throw new TypeError("encoder not found");
        }
        connector.setEncoder(encoder);
        return connector;
    }
}