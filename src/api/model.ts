import Protocol from "../net/protocol";
import Description from "./description";

interface Model {
    name: string;
    hrefs: Array<string>;
    type: any;

    initialize(model: any, description: Description);
}

export default Model;