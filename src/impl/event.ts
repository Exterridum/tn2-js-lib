import Events from "../api/event";
import Protocol from "../net/protocol";
import Subscription from "../net/subscription";
import {Resolver} from "../net/resolver";
import ThingModel from "./model";

export class ThingEvent extends ThingModel implements Events.Event {

    private callbacks: Set<Events.ListenerCallback> = 
                new Set<Events.ListenerCallback>();                
   
    private subscriptions: Map<Protocol, Subscription> =
                new Map<Protocol, Subscription>();

    subscribe(listenerCallback :Events.ListenerCallback, protocol:Protocol):void {
        this.callbacks.add(listenerCallback);

        if(!this.subscriptions.has(protocol)) {
            Resolver
                .resolve(protocol)
                .getEventUri(this.getUriByProtocol(protocol))
                .then((response) => {            
                    let links = response.links;                                                      
                    let subscription = Resolver
                                        .resolve(Protocol.WS)
                                        .subscribe(links[0]["href"], this.handler);
                    this.subscriptions.set(protocol, subscription);
                });
        } 
    }
    
    unsubscribe(listenerCallback :Events.ListenerCallback, protocol:Protocol):void {
        this.callbacks.delete(listenerCallback);

        if(this.callbacks.size != 0) {
            return;
        }                

        this.findAndClose(protocol);
    }

    unsubscribeAll(protocol:Protocol):void {
        this.callbacks = new Set<Events.ListenerCallback>();      
        this.findAndClose(protocol);
    }

    private findAndClose(protocol:Protocol) {
        let subscription = this.subscriptions.get(protocol);        
        if(subscription) {
            subscription.close();
            this.subscriptions.delete(protocol);            
        }
    }

    private handler = (message: any) => {
       this.callbacks.forEach((value: any, callback: Events.ListenerCallback) => {
            callback(message);
        });
    }
}