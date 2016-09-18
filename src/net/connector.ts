import MessageHandler from "./handler";
import Subscription from "./subscription";
import Encoder from "../encoding/encoder";

interface Connector {

    setEncoder(encoder: Encoder);

    subscribe(uri: string, messageHandler: MessageHandler) : Subscription;   
    getLinks(uri: string) : Promise<any>; 
    getThing(uri: string) : Promise<any>;
    getEventUri(uri: string) : Promise<any>;
    getProperty(uri: string) : Promise<any>;    
    setProperty(uri: string, data?: any) : Promise<any>;
}

export default Connector;

abstract class BaseConnector {

}