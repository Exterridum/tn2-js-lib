import Events from "./event";
import Action from "./action";
import Property from "./property";

interface Description {
    getEvent(event: string): Events.Event;
    getAction(action: string): Action;
    getProperty(property: string): Property;
    getRawDescription(): Object;   
}

export default Description;