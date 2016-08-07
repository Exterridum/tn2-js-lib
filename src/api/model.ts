import Protocol from "../connector/protocol";

interface Model {
    name: string;
    hrefs: Map<Protocol, string>;
    type: String;

    getHrefByProtocol(protocol:Protocol);
}

export default Model;