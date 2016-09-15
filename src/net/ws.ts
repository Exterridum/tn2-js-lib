import Connector from "./connector";
import MessageHandler from "./handler";
import Subscription from "./subscription";

export class WsConnector implements Connector {
   
    subscribe(url: string, handler: MessageHandler) :Subscription {
        return new WsSubscription(url, handler);
    }
}

class WsSubscription implements Subscription {

    private ws: WebSocket;    
    private open: boolean;

    constructor(private url: string, 
                private handler: MessageHandler) {
        this.init();
    }

    close() {
        this.ws.close();
    }

    private init() {    
        let ws = new WebSocket(this.url);
        ws.onopen = this.handleOpen;
        ws.onclose = this.handleClose;
        ws.onmessage = this.handleOpen;
        this.ws = ws;
    }
 
  
    private handleOpen() {
        this.open = true;
    }

    private handleClose() {
        this.open = false;
    }
    
    private executeCallback(message: any) {
        this.handler(message);        
    }
}