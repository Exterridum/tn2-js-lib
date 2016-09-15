import Protocol from "./protocol";
import Connector from "./connector";

export interface ProtocolResolver {
    resolve(protocol: Protocol): Connector;
}

class DefaultResolver implements ProtocolResolver {

    private resolver: ProtocolResolver;

    resolve(protocol: Protocol) : Connector {
        return this.resolver.resolve(protocol);
    }

    register(resolver: ProtocolResolver) {
        this.resolver = resolver;
    }
}

export const Resolver = new DefaultResolver();
