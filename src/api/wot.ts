import Thing from "./thing";

interface WebOfThings {
    discover(type:string): Promise<Array<Thing>>
    consumeDescription(description: any): Promise<Thing>;
    consumeDescriptionUri(uri: string): Promise<Thing>;
}

export default WebOfThings;