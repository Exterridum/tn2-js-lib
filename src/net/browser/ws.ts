import Connector from "../connector";
import MessageHandler from "../handler";
import Subscription from "../subscription";

export class WsConnector implements Connector {

    subscribe(uri: string, handler: MessageHandler) : Subscription {
        return new WsSubscription(uri, handler);
    }

    getLinks(uri: string) : Promise<any> {
        return null;
    }

    getThing(uri: string) : Promise<any> {
        return null;
    }

    getProperty(uri: string) : Promise<any> {
        return null;
    }

    setProperty(uri: string, data: any) : Promise<any> {
        return null;
    }

    getEventUri(uri: string) : Promise<any> {
        return null;
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
        ws.onmessage = this.executeCallback;
        this.ws = ws;
    }
   
    private handleOpen = () => {
        this.open = true;
    }

    private handleClose= () => {
        this.open = false;
    }
    
    private executeCallback = (message: any) => {
        this.handler(message.data);        
    }
}