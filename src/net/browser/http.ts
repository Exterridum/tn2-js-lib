import Connector from "../connector";
import MessageHandler from "../handler";
import Subscription from "../subscription";
import Encoder from "../../encoding/encoder";

export class HttpConnector implements Connector {

    private encoder: Encoder;

    setEncoder(encoder: Encoder) {
        this.encoder = encoder;
    }

    subscribe(uri: string, handler: MessageHandler) :Subscription {
        return null;
    }       
    
    getLinks(uri: string) : Promise<any> {
        return this.fetchCall(uri);
    }

    getThing(uri: string) : Promise<any> {
        return this.fetchCall(uri);
    }

    getProperty(uri: string) : Promise<any> {
        return this.fetchCall(uri);
    }

    setProperty(uri: string, data: any) : Promise<any> {
        return this.fetchCall(uri, { 
            method: "PUT",
            data: JSON.stringify(data)
        });
    }

    getEventUri(uri: string) : Promise<any> {
        return this.fetchCall(uri, { 
            method: "POST"
        });
    }

    private fetchCall(uri: string, data = {}) : Promise<any> {
        return fetch(uri, data).then((response) => {
            return response.json();
        });
    }
}