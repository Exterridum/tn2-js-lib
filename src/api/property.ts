import Protocol from "../net/Protocol";
import Encoding from "../encoding/encoding";

interface Property {
    getValue(protocol: Protocol, encoding: Encoding): Promise<any>;
    setValue(protocol: Protocol, value: any, encoding: Encoding): Promise<any>;
}

export default Property;
