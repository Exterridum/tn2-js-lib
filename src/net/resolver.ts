import Protocol from "./protocol";
import Connector from "./connector";
import Encoding from "../encoding/encoding";

export interface ProtocolResolver {
    resolve(protocol: Protocol, encoding: Encoding): Connector;
}

class DefaultResolver implements ProtocolResolver {

    private resolver: ProtocolResolver;

    resolve(protocol: Protocol, encoding: Encoding) : Connector {
        return this.resolver.resolve(protocol, encoding);
    }

    register(resolver: ProtocolResolver) {
        this.resolver = resolver;
    }
}

export const Resolver = new DefaultResolver();
