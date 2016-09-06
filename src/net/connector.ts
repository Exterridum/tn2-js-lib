import MessageHandler from "./handler";
import subscription from "./subscription";

interface Connector {    
    subscribe(uri: string, messageHandler: MessageHandler) : subscription;
}

export default Connector;