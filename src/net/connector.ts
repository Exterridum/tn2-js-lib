import MessageHandler from "./handler";
import Subscription from "./subscription";

interface Connector {    
    subscribe(uri: string, messageHandler: MessageHandler) : Subscription;   
    getLinks(uri: string) : Promise<any>; 
    getThing(uri: string) : Promise<any>;
    getEventUri(uri: string) : Promise<any>;
    getProperty(uri: string) : Promise<any>;    
    setProperty(uri: string, data?: any) : Promise<any>;
}

export default Connector;