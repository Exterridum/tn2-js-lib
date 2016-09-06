import Property from "../api/property";
import ThingModel from "./model";

export class ThingProperty extends ThingModel implements Property {
 

    getValue(): Promise<any> {                
        return new Promise((resolve, reject) => {

        });
    }

    setValue(value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            
        });
    }
}