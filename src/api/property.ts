
interface Property {
    getValue(): Promise<any>;
    setValue(value: any): Promise<any>;
}

export default Property;
