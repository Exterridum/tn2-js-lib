import Protocol from "../net/Protocol";

interface Property {
    getValue(protocol: Protocol): Promise<any>;
    setValue(protocol: Protocol, value: any): Promise<any>;
}

export default Property;
