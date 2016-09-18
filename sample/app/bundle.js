(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tno = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var protocol_1 = require("../net/protocol");
var EnumUtils = (function () {
    function EnumUtils() {
    }
    return EnumUtils;
}());
exports.EnumUtils = EnumUtils;
var UriUtils = (function () {
    function UriUtils() {
    }
    UriUtils.getProtocolFromUri = function (href) {
        var splitHref = href.split(":");
        if (splitHref.length < 2) {
            return null;
        }
        var protocolStr = splitHref[0];
        for (var p in protocol_1["default"]) {
            if (p.toLowerCase() == protocolStr.toLowerCase()) {
                return protocol_1["default"][p];
            }
        }
    };
    UriUtils.assembleUri = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i - 0] = arguments[_i];
        }
        return null;
    };
    UriUtils.getUrisMap = function (hrefs) {
        var result = new Map();
        if (!hrefs) {
            return result;
        }
        for (var _i = 0, hrefs_1 = hrefs; _i < hrefs_1.length; _i++) {
            var href = hrefs_1[_i];
            var protocol = this.getProtocolFromUri(href);
            if (protocol != null) {
                result.set(this.getProtocolFromUri(href), href);
            }
        }
        return result;
    };
    return UriUtils;
}());
exports.UriUtils = UriUtils;
var CommonUtils = (function () {
    function CommonUtils() {
    }
    CommonUtils.exists = function (obj) {
        return obj !== undefined && obj !== null;
    };
    return CommonUtils;
}());
exports.CommonUtils = CommonUtils;
var StringUtils = (function () {
    function StringUtils() {
    }
    StringUtils.isEmpty = function (str) {
        return str === undefined || str == null || str.length == 0;
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;
},{"../net/protocol":17}],2:[function(require,module,exports){
"use strict";
var Encoding;
(function (Encoding) {
    Encoding[Encoding["JSON"] = 0] = "JSON";
    Encoding[Encoding["XML"] = 1] = "XML";
})(Encoding || (Encoding = {}));
exports.__esModule = true;
exports["default"] = Encoding;
},{}],3:[function(require,module,exports){
"use strict";
var JsonEncoder = (function () {
    function JsonEncoder() {
    }
    JsonEncoder.prototype.encode = function (data) {
        if (data) {
            return JSON.stringify(data);
        }
        return "";
    };
    JsonEncoder.prototype.decode = function (data) {
        if (data) {
            return JSON.parse(data);
        }
        return {};
    };
    return JsonEncoder;
}());
exports.__esModule = true;
exports["default"] = JsonEncoder;
},{}],4:[function(require,module,exports){
"use strict";
var encoding_1 = require("./encoding");
var utils_1 = require("../common/utils");
var EncodingUtils = (function () {
    function EncodingUtils() {
    }
    EncodingUtils.getEncodings = function (encodings) {
        var result = new Set();
        for (var _i = 0, encodings_1 = encodings; _i < encodings_1.length; _i++) {
            var e = encodings_1[_i];
            var encoding = encoding_1["default"][e.toUpperCase()];
            if (utils_1.CommonUtils.exists(encoding)) {
                result.add(encoding);
            }
        }
        return result;
    };
    return EncodingUtils;
}());
exports.__esModule = true;
exports["default"] = EncodingUtils;
},{"../common/utils":1,"./encoding":2}],5:[function(require,module,exports){
"use strict";
var XmlEncoder = (function () {
    function XmlEncoder() {
    }
    XmlEncoder.prototype.encode = function (data) {
        return null;
    };
    XmlEncoder.prototype.decode = function (data) {
        return null;
    };
    return XmlEncoder;
}());
exports.__esModule = true;
exports["default"] = XmlEncoder;
},{}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_1 = require("./model");
var resolver_1 = require("../net/resolver");
var ThingAction = (function (_super) {
    __extends(ThingAction, _super);
    function ThingAction() {
        _super.apply(this, arguments);
    }
    ThingAction.prototype.invoke = function (params, protocol, encoding) {
        resolver_1.Resolver.resolve(protocol, encoding);
        return null;
    };
    return ThingAction;
}(model_1["default"]));
exports.ThingAction = ThingAction;
},{"../net/resolver":18,"./model":9}],7:[function(require,module,exports){
"use strict";
var protocol_1 = require("../net/protocol");
var event_1 = require("./event");
var action_1 = require("./action");
var property_1 = require("./property");
var utils_1 = require("../common/utils");
var encoding_1 = require("../encoding/encoding");
var utils_2 = require("../encoding/utils");
var ThingDescription = (function () {
    function ThingDescription(description) {
        this.description = description;
        this.events = new Map();
        this.actions = new Map();
        this.properties = new Map();
        this.parse("events", "name", this.events, event_1.ThingEvent);
        this.parse("actions", "name", this.actions, action_1.ThingAction);
        this.parse("properties", "name", this.properties, property_1.ThingProperty);
        this.uris = utils_1.UriUtils.getUrisMap(description.uris);
        this.encodings = utils_2["default"].getEncodings(description.encodings);
    }
    ThingDescription.prototype.getEvent = function (event) {
        return this.get("events", event);
    };
    ThingDescription.prototype.getAction = function (action) {
        return this.get("actions", action);
    };
    ThingDescription.prototype.getProperty = function (property) {
        return this.get("properties", property);
    };
    ThingDescription.prototype.getRawDescription = function () {
        return this.description;
    };
    ThingDescription.prototype.getEncodings = function () {
        return this.encodings;
    };
    ThingDescription.prototype.getDefaultEncoding = function () {
        for (var encoding in this.encodings.values()) {
            return encoding_1["default"][encoding];
        }
        return encoding_1["default"].JSON;
    };
    ThingDescription.prototype.getDefaultProtocol = function () {
        for (var protocol in this.uris.keys()) {
            return protocol_1["default"][protocol];
        }
        return protocol_1["default"].HTTP;
    };
    ThingDescription.prototype.get = function (map, name) {
        var value = this[map].get(name);
        if (value == null) {
            throw new ReferenceError();
        }
        return value;
    };
    ThingDescription.prototype.parse = function (property, keyProperty, map, obj) {
        var props = this.description[property];
        if (props) {
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var p = props_1[_i];
                var instance = new obj(p);
                instance.initialize(p, this);
                map.set(p[keyProperty], instance);
            }
        }
    };
    return ThingDescription;
}());
exports.__esModule = true;
exports["default"] = ThingDescription;
},{"../common/utils":1,"../encoding/encoding":2,"../encoding/utils":4,"../net/protocol":17,"./action":6,"./event":8,"./property":10}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var protocol_1 = require("../net/protocol");
var resolver_1 = require("../net/resolver");
var model_1 = require("./model");
var ThingEvent = (function (_super) {
    __extends(ThingEvent, _super);
    function ThingEvent() {
        var _this = this;
        _super.apply(this, arguments);
        this.callbacks = new Set();
        this.subscriptions = new Map();
        this.handler = function (message) {
            _this.callbacks.forEach(function (value, callback) {
                callback(message);
            });
        };
    }
    ThingEvent.prototype.subscribe = function (listenerCallback, protocol, encoding) {
        var _this = this;
        this.callbacks.add(listenerCallback);
        if (!this.subscriptions.has(protocol)) {
            resolver_1.Resolver
                .resolve(protocol, encoding)
                .getEventUri(this.getUriByProtocol(protocol))
                .then(function (response) {
                var links = response.links;
                var subscription = resolver_1.Resolver
                    .resolve(protocol_1["default"].WS, encoding)
                    .subscribe(links[0]["href"], _this.handler);
                _this.subscriptions.set(protocol, subscription);
            });
        }
    };
    ThingEvent.prototype.unsubscribe = function (listenerCallback, protocol) {
        this.callbacks.delete(listenerCallback);
        if (this.callbacks.size != 0) {
            return;
        }
        this.findAndClose(protocol);
    };
    ThingEvent.prototype.unsubscribeAll = function (protocol) {
        this.callbacks = new Set();
        this.findAndClose(protocol);
    };
    ThingEvent.prototype.findAndClose = function (protocol) {
        var subscription = this.subscriptions.get(protocol);
        if (subscription) {
            subscription.close();
            this.subscriptions.delete(protocol);
        }
    };
    return ThingEvent;
}(model_1["default"]));
exports.ThingEvent = ThingEvent;
},{"../net/protocol":17,"../net/resolver":18,"./model":9}],9:[function(require,module,exports){
"use strict";
var ThingModel = (function () {
    function ThingModel() {
    }
    ThingModel.prototype.initialize = function (model, description) {
        this.name = model.name;
        this.type = model["@type"];
        this.hrefs = model.hrefs;
        this.description = description;
    };
    ThingModel.prototype.getUriByProtocol = function (protocol) {
        return this.hrefs[0];
    };
    return ThingModel;
}());
exports.__esModule = true;
exports["default"] = ThingModel;
},{}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_1 = require("./model");
var resolver_1 = require("../net/resolver");
var ThingProperty = (function (_super) {
    __extends(ThingProperty, _super);
    function ThingProperty() {
        _super.apply(this, arguments);
    }
    ThingProperty.prototype.getValue = function (protocol, encoding) {
        return resolver_1.Resolver
            .resolve(protocol, encoding)
            .getProperty(this.getUriByProtocol(protocol));
    };
    ThingProperty.prototype.setValue = function (protocol, value, encoding) {
        return resolver_1.Resolver
            .resolve(protocol, encoding)
            .setProperty(this.getUriByProtocol(protocol), {
            value: true
        });
    };
    return ThingProperty;
}(model_1["default"]));
exports.ThingProperty = ThingProperty;
},{"../net/resolver":18,"./model":9}],11:[function(require,module,exports){
"use strict";
var WebThing = (function () {
    function WebThing(description) {
        this.description = description;
        var thingDescription = description;
        this.protocol = thingDescription.getDefaultProtocol();
        this.encoding = thingDescription.getDefaultEncoding();
    }
    WebThing.prototype.setProtocol = function (protocol) {
        this.protocol = protocol;
    };
    WebThing.prototype.setEncoding = function (encoding) {
        this.encoding = encoding;
    };
    WebThing.prototype.addListener = function (event, eventListener) {
        var e = this.description.getEvent(event);
        e.subscribe(eventListener, this.protocol, this.encoding);
        return this;
    };
    WebThing.prototype.removeListener = function (event, eventListener) {
        var e = this.description.getEvent(event);
        e.unsubscribe(eventListener, this.protocol);
        return this;
    };
    WebThing.prototype.removeAllListeners = function (event) {
        var e = this.description.getEvent(event);
        e.unsubscribeAll(this.protocol);
        return this;
    };
    WebThing.prototype.invokeAction = function (action, actionParams) {
        return this.description.getAction(action)
            .invoke(actionParams, this.protocol, this.encoding);
    };
    WebThing.prototype.getProperty = function (property) {
        return this.description.getProperty(property)
            .getValue(this.protocol, this.encoding);
    };
    WebThing.prototype.setProperty = function (property, value) {
        return this.description.getProperty(property)
            .setValue(value, this.protocol, this.encoding);
    };
    WebThing.prototype.getDescription = function () {
        return this.description;
    };
    return WebThing;
}());
exports.__esModule = true;
exports["default"] = WebThing;
},{}],12:[function(require,module,exports){
"use strict";
var thing_1 = require("./thing");
var utils_1 = require("../common/utils");
var resolver_1 = require("../net/resolver");
var description_1 = require("./description");
var encoding_1 = require("../encoding/encoding");
var WebOfThings = (function () {
    function WebOfThings(discoveryUri) {
        if (discoveryUri === void 0) { discoveryUri = ""; }
        this.discoveryUri = discoveryUri;
    }
    // TODO witll be different in the future
    WebOfThings.prototype.discover = function (type) {
        var _this = this;
        if (utils_1.StringUtils.isEmpty(this.discoveryUri)) {
            throw new TypeError("no discovery uri");
        }
        var protocol = utils_1.UriUtils.getProtocolFromUri(this.discoveryUri);
        return resolver_1.Resolver
            .resolve(protocol, encoding_1["default"].JSON)
            .getLinks(this.discoveryUri)
            .then(function (response) {
            var promises = [];
            for (var _i = 0, _a = response.links; _i < _a.length; _i++) {
                var link = _a[_i];
                promises.push(_this.consumeDescriptionUri(link.href));
            }
            return Promise.all(promises);
        });
    };
    WebOfThings.prototype.consumeDescription = function (description) {
        return new Promise(function (resolve, reject) {
            var d = new description_1["default"](description);
            resolve(new thing_1["default"](d));
        });
    };
    WebOfThings.prototype.consumeDescriptionUri = function (uri) {
        var protocol = utils_1.UriUtils.getProtocolFromUri(this.discoveryUri);
        return resolver_1.Resolver
            .resolve(protocol, encoding_1["default"].JSON)
            .getThing(uri)
            .then(function (description) {
            return new Promise(function (resolve) {
                var d = new description_1["default"](description);
                resolve(new thing_1["default"](d));
            });
        });
    };
    return WebOfThings;
}());
exports.__esModule = true;
exports["default"] = WebOfThings;
},{"../common/utils":1,"../encoding/encoding":2,"../net/resolver":18,"./description":7,"./thing":11}],13:[function(require,module,exports){
/// <reference path="../../node_modules/@types/es6-promise/index.d.ts"/>
/// <reference path="../../node_modules/@types/es6-collections/index.d.ts"/>
/// <reference path="../../node_modules/@types/whatwg-fetch/index.d.ts"/>
"use strict";
var resolver_1 = require("../net/browser/resolver");
var resolver_2 = require("../net/resolver");
var wot_1 = require("../impl/wot");
resolver_2.Resolver.register(new resolver_1["default"]());
exports.Wot = new wot_1["default"]("http://tno2.net:8080/conas/dth-esp8266-1/");
},{"../impl/wot":12,"../net/browser/resolver":15,"../net/resolver":18}],14:[function(require,module,exports){
"use strict";
var HttpConnector = (function () {
    function HttpConnector() {
    }
    HttpConnector.prototype.setEncoder = function (encoder) {
        this.encoder = encoder;
    };
    HttpConnector.prototype.subscribe = function (uri, handler) {
        return null;
    };
    HttpConnector.prototype.getLinks = function (uri) {
        return this.fetchCall(uri);
    };
    HttpConnector.prototype.getThing = function (uri) {
        return this.fetchCall(uri);
    };
    HttpConnector.prototype.getProperty = function (uri) {
        return this.fetchCall(uri);
    };
    HttpConnector.prototype.setProperty = function (uri, data) {
        return this.fetchCall(uri, {
            method: "PUT",
            data: JSON.stringify(data)
        });
    };
    HttpConnector.prototype.getEventUri = function (uri) {
        return this.fetchCall(uri, {
            method: "POST"
        });
    };
    HttpConnector.prototype.fetchCall = function (uri, data) {
        if (data === void 0) { data = {}; }
        return fetch(uri, data).then(function (response) {
            return response.json();
        });
    };
    return HttpConnector;
}());
exports.HttpConnector = HttpConnector;
},{}],15:[function(require,module,exports){
"use strict";
var protocol_1 = require("../protocol");
var ws_1 = require("./ws");
var http_1 = require("./http");
var encoding_1 = require("../../encoding/encoding");
var json_1 = require("../../encoding/json");
var xml_1 = require("../../encoding/xml");
var BrowserProtocolResolver = (function () {
    function BrowserProtocolResolver() {
        this.iniConnectors();
        this.iniEncoders();
    }
    BrowserProtocolResolver.prototype.iniConnectors = function () {
        this.connectors = new Map();
        var wsConnector = new ws_1.WsConnector();
        this.connectors.set(protocol_1["default"].WS, wsConnector);
        this.connectors.set(protocol_1["default"].WSS, wsConnector);
        var httpConnector = new http_1.HttpConnector();
        this.connectors.set(protocol_1["default"].HTTP, httpConnector);
        this.connectors.set(protocol_1["default"].HTTPS, httpConnector);
    };
    BrowserProtocolResolver.prototype.iniEncoders = function () {
        this.encoders = new Map();
        this.encoders.set(encoding_1["default"].XML, new xml_1["default"]());
        this.encoders.set(encoding_1["default"].JSON, new json_1["default"]());
    };
    BrowserProtocolResolver.prototype.resolve = function (protocol, encoding) {
        var connector = this.connectors.get(protocol);
        if (connector == null) {
            throw new TypeError("connector not found");
        }
        var encoder = this.encoders.get(encoding);
        if (encoder == null) {
            throw new TypeError("encoder not found");
        }
        connector.setEncoder(encoder);
        return connector;
    };
    return BrowserProtocolResolver;
}());
exports.__esModule = true;
exports["default"] = BrowserProtocolResolver;
},{"../../encoding/encoding":2,"../../encoding/json":3,"../../encoding/xml":5,"../protocol":17,"./http":14,"./ws":16}],16:[function(require,module,exports){
"use strict";
var WsConnector = (function () {
    function WsConnector() {
    }
    WsConnector.prototype.setEncoder = function (encoder) {
        this.encoder = encoder;
    };
    WsConnector.prototype.subscribe = function (uri, handler) {
        return new WsSubscription(uri, handler);
    };
    WsConnector.prototype.getLinks = function (uri) {
        return null;
    };
    WsConnector.prototype.getThing = function (uri) {
        return null;
    };
    WsConnector.prototype.getProperty = function (uri) {
        return null;
    };
    WsConnector.prototype.setProperty = function (uri, data) {
        return null;
    };
    WsConnector.prototype.getEventUri = function (uri) {
        return null;
    };
    return WsConnector;
}());
exports.WsConnector = WsConnector;
var WsSubscription = (function () {
    function WsSubscription(url, handler) {
        var _this = this;
        this.url = url;
        this.handler = handler;
        this.handleOpen = function () {
            _this.open = true;
        };
        this.handleClose = function () {
            _this.open = false;
        };
        this.executeCallback = function (message) {
            _this.handler(message.data);
        };
        this.init();
    }
    WsSubscription.prototype.close = function () {
        this.ws.close();
    };
    WsSubscription.prototype.init = function () {
        var ws = new WebSocket(this.url);
        ws.onopen = this.handleOpen;
        ws.onclose = this.handleClose;
        ws.onmessage = this.executeCallback;
        this.ws = ws;
    };
    return WsSubscription;
}());
},{}],17:[function(require,module,exports){
"use strict";
var Protocol;
(function (Protocol) {
    Protocol[Protocol["HTTP"] = 0] = "HTTP";
    Protocol[Protocol["HTTPS"] = 1] = "HTTPS";
    Protocol[Protocol["COAP"] = 2] = "COAP";
    Protocol[Protocol["WS"] = 3] = "WS";
    Protocol[Protocol["WSS"] = 4] = "WSS";
})(Protocol || (Protocol = {}));
exports.__esModule = true;
exports["default"] = Protocol;
},{}],18:[function(require,module,exports){
"use strict";
var DefaultResolver = (function () {
    function DefaultResolver() {
    }
    DefaultResolver.prototype.resolve = function (protocol, encoding) {
        return this.resolver.resolve(protocol, encoding);
    };
    DefaultResolver.prototype.register = function (resolver) {
        this.resolver = resolver;
    };
    return DefaultResolver;
}());
exports.Resolver = new DefaultResolver();
},{}]},{},[13])(13)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb21tb24vdXRpbHMudHMiLCJlbmNvZGluZy9lbmNvZGluZy50cyIsImVuY29kaW5nL2pzb24udHMiLCJlbmNvZGluZy91dGlscy50cyIsImVuY29kaW5nL3htbC50cyIsImltcGwvYWN0aW9uLnRzIiwiaW1wbC9kZXNjcmlwdGlvbi50cyIsImltcGwvZXZlbnQudHMiLCJpbXBsL21vZGVsLnRzIiwiaW1wbC9wcm9wZXJ0eS50cyIsImltcGwvdGhpbmcudHMiLCJpbXBsL3dvdC50cyIsImxpYi93b3QtYnJvd3Nlci50cyIsIm5ldC9icm93c2VyL2h0dHAudHMiLCJuZXQvYnJvd3Nlci9yZXNvbHZlci50cyIsIm5ldC9icm93c2VyL3dzLnRzIiwibmV0L3Byb3RvY29sLnRzIiwibmV0L3Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHlCQUFxQixpQkFBaUIsQ0FBQyxDQUFBO0FBRXZDO0lBQUE7SUFFQSxDQUFDO0lBQUQsZ0JBQUM7QUFBRCxDQUZBLEFBRUMsSUFBQTtBQUZZLGlCQUFTLFlBRXJCLENBQUE7QUFFRDtJQUFBO0lBaUNBLENBQUM7SUEvQmlCLDJCQUFrQixHQUFoQyxVQUFpQyxJQUFZO1FBQ3pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsRUFBRSxDQUFBLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBUSxDQUFDLENBQUMsQ0FBQztZQUNwQixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksV0FB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QUNJLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVPLDZCQUFJLEdBQVo7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUM5QixFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQWFMLHFCQUFDO0FBQUQsQ0FqQ0EsQUFpQ0MsSUFBQTs7O0FDdkVELElBQUssUUFNSjtBQU5ELFdBQUssUUFBUTtJQUNULHVDQUFJLENBQUE7SUFDSix5Q0FBSyxDQUFBO0lBQ0wsdUNBQUksQ0FBQTtJQUNKLG1DQUFFLENBQUE7SUFDRixxQ0FBRyxDQUFBO0FBQ1AsQ0FBQyxFQU5JLFFBQVEsS0FBUixRQUFRLFFBTVo7QUFFRDtxQkFBZSxRQUFRLENBQUM7OztBQ0F4QjtJQUFBO0lBV0EsQ0FBQztJQVBHLGlDQUFPLEdBQVAsVUFBUSxRQUFrQixFQUFFLFFBQWtCO1FBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELGtDQUFRLEdBQVIsVUFBUyxRQUEwQjtRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQVhBLEFBV0MsSUFBQTtBQUVZLGdCQUFRLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9wcm90b2NvbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudW1VdGlscyB7XHJcblxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXJpVXRpbHMge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UHJvdG9jb2xGcm9tVXJpKGhyZWY6IHN0cmluZykgOiBhbnkge1xyXG4gICAgICAgIGxldCBzcGxpdEhyZWYgPSBocmVmLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICBpZihzcGxpdEhyZWYubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBsZXQgcHJvdG9jb2xTdHIgPSBzcGxpdEhyZWZbMF07ICAgICAgICAgICBcclxuICAgICAgICBmb3IobGV0IHAgaW4gUHJvdG9jb2wpIHtcclxuICAgICAgICAgICAgaWYocC50b0xvd2VyQ2FzZSgpID09IHByb3RvY29sU3RyLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm90b2NvbFtwXTtcclxuICAgICAgICAgICAgfSAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhc3NlbWJsZVVyaSguLi5wYXJ0czogc3RyaW5nW10pIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVyaXNNYXAoaHJlZnM6IEFycmF5PHN0cmluZz4pOiBNYXA8UHJvdG9jb2wsIHN0cmluZz4ge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFwPFByb3RvY29sLCBzdHJpbmc+KCk7XHJcbiAgICAgICAgaWYoIWhyZWZzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IobGV0IGhyZWYgb2YgaHJlZnMpIHtcclxuICAgICAgICAgICAgbGV0IHByb3RvY29sID0gdGhpcy5nZXRQcm90b2NvbEZyb21VcmkoaHJlZik7XHJcbiAgICAgICAgICAgIGlmKHByb3RvY29sICE9IG51bGwpIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgcmVzdWx0LnNldCh0aGlzLmdldFByb3RvY29sRnJvbVVyaShocmVmKSwgaHJlZik7XHJcbiAgICAgICAgICAgIH0gICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn0gXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tbW9uVXRpbHMge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZXhpc3RzKG9iajogYW55KSA6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBvYmogIT09IHVuZGVmaW5lZCAmJiBvYmogIT09IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdHJpbmdVdGlscyB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpc0VtcHR5KHN0cjogc3RyaW5nKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBzdHIgPT09IHVuZGVmaW5lZCB8fCBzdHIgPT0gbnVsbCB8fCBzdHIubGVuZ3RoID09IDA7IFxyXG4gICAgfVxyXG59IiwiZW51bSBFbmNvZGluZyB7XHJcbiAgICBKU09OLFxyXG4gICAgWE1MXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVuY29kaW5nOyIsImltcG9ydCBFbmNvZGVyIGZyb20gXCIuL2VuY29kZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpzb25FbmNvZGVyIGltcGxlbWVudHMgRW5jb2RlciB7XHJcblxyXG4gICAgZW5jb2RlKGRhdGE6YW55KSA6IGFueSB7XHJcbiAgICAgICAgaWYoZGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGRlY29kZShkYXRhOmFueSk6YW55IHtcclxuICAgICAgICBpZihkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgRW5jb2RpbmcgZnJvbSBcIi4vZW5jb2RpbmdcIjtcclxuaW1wb3J0IHtDb21tb25VdGlsc30gZnJvbSBcIi4uL2NvbW1vbi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5jb2RpbmdVdGlscyB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRFbmNvZGluZ3MoZW5jb2RpbmdzOiBBcnJheTxzdHJpbmc+KSA6IFNldDxFbmNvZGluZz4ge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgU2V0PEVuY29kaW5nPigpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGUgb2YgZW5jb2RpbmdzKSB7XHJcbiAgICAgICAgICAgIGxldCBlbmNvZGluZyA9IEVuY29kaW5nW2UudG9VcHBlckNhc2UoKV07XHJcbiAgICAgICAgICAgIGlmKENvbW1vblV0aWxzLmV4aXN0cyhlbmNvZGluZykpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5hZGQoZW5jb2RpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgRW5jb2RlciBmcm9tIFwiLi9lbmNvZGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBYbWxFbmNvZGVyIGltcGxlbWVudHMgRW5jb2RlcntcclxuXHJcbiAgICBlbmNvZGUoZGF0YTogYW55KTogYW55IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBkZWNvZGUoZGF0YTogYW55KTogYW55IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FwaS9hY3Rpb25cIjtcclxuaW1wb3J0IFRoaW5nTW9kZWwgZnJvbSBcIi4vbW9kZWxcIjtcclxuaW1wb3J0IHtUcmFja2FibGVQcm9taXNlfSBmcm9tIFwiLi4vYXBpL3Byb21pc2VcIjtcclxuaW1wb3J0IHtSZXNvbHZlcn0gZnJvbSBcIi4uL25ldC9yZXNvbHZlclwiO1xyXG5pbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9wcm90b2NvbFwiO1xyXG5pbXBvcnQgRW5jb2RpbmcgZnJvbSBcIi4uL2VuY29kaW5nL2VuY29kaW5nXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhpbmdBY3Rpb24gZXh0ZW5kcyBUaGluZ01vZGVsIGltcGxlbWVudHMgQWN0aW9uIHtcclxuICAgIFxyXG4gICAgaW52b2tlKHBhcmFtczphbnksIHByb3RvY29sOiBQcm90b2NvbCwgZW5jb2Rpbmc6IEVuY29kaW5nKTogVHJhY2thYmxlUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBSZXNvbHZlci5yZXNvbHZlKHByb3RvY29sLCBlbmNvZGluZyk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgRGVzY3JpcHRpb24gZnJvbSBcIi4uL2FwaS9kZXNjcmlwdGlvblwiO1xyXG5pbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9wcm90b2NvbFwiO1xyXG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hcGkvYWN0aW9uXCI7XHJcbmltcG9ydCBFdmVudHMgZnJvbSBcIi4uL2FwaS9ldmVudFwiO1xyXG5pbXBvcnQgUHJvcGVydHkgZnJvbSBcIi4uL2FwaS9wcm9wZXJ0eVwiO1xyXG5pbXBvcnQge1RoaW5nRXZlbnR9IGZyb20gXCIuL2V2ZW50XCI7XHJcbmltcG9ydCB7VGhpbmdBY3Rpb259IGZyb20gXCIuL2FjdGlvblwiO1xyXG5pbXBvcnQge1RoaW5nUHJvcGVydHl9IGZyb20gXCIuL3Byb3BlcnR5XCI7XHJcbmltcG9ydCB7VXJpVXRpbHN9IGZyb20gXCIuLi9jb21tb24vdXRpbHNcIjtcclxuaW1wb3J0IEVuY29kaW5nIGZyb20gXCIuLi9lbmNvZGluZy9lbmNvZGluZ1wiO1xyXG5pbXBvcnQgRW5jb2RpbmdVdGlscyBmcm9tIFwiLi4vZW5jb2RpbmcvdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRoaW5nRGVzY3JpcHRpb24gaW1wbGVtZW50cyBEZXNjcmlwdGlvbiB7XHJcblxyXG4gICAgcHJpdmF0ZSBldmVudHM6IE1hcDxzdHJpbmcsIEV2ZW50PiA9IG5ldyBNYXA8c3RyaW5nLCBFdmVudD4oKTtcclxuICAgIHByaXZhdGUgYWN0aW9uczogTWFwPHN0cmluZywgQWN0aW9uPiA9IG5ldyBNYXA8c3RyaW5nLCBBY3Rpb24+KCk7XHJcbiAgICBwcml2YXRlIHByb3BlcnRpZXM6IE1hcDxzdHJpbmcsIFByb3BlcnR5PiA9IG5ldyBNYXA8c3RyaW5nLCBQcm9wZXJ0eT4oKTtcclxuXHJcbiAgICBwcml2YXRlIHVyaXM6TWFwPFByb3RvY29sLCBzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBlbmNvZGluZ3M6U2V0PEVuY29kaW5nPjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlc2NyaXB0aW9uOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnBhcnNlKFwiZXZlbnRzXCIsIFwibmFtZVwiLCB0aGlzLmV2ZW50cywgVGhpbmdFdmVudCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wYXJzZShcImFjdGlvbnNcIiwgXCJuYW1lXCIsIHRoaXMuYWN0aW9ucywgVGhpbmdBY3Rpb24pOyAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMucGFyc2UoXCJwcm9wZXJ0aWVzXCIsIFwibmFtZVwiLCB0aGlzLnByb3BlcnRpZXMsIFRoaW5nUHJvcGVydHkpO1xyXG4gICAgICAgIHRoaXMudXJpcyA9IFVyaVV0aWxzLmdldFVyaXNNYXAoZGVzY3JpcHRpb24udXJpcyk7XHJcbiAgICAgICAgdGhpcy5lbmNvZGluZ3MgPSBFbmNvZGluZ1V0aWxzLmdldEVuY29kaW5ncyhkZXNjcmlwdGlvbi5lbmNvZGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV2ZW50KGV2ZW50OnN0cmluZyk6RXZlbnRzLkV2ZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoXCJldmVudHNcIiwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEFjdGlvbihhY3Rpb246c3RyaW5nKTpBY3Rpb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChcImFjdGlvbnNcIiwgYWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9wZXJ0eShwcm9wZXJ0eTpzdHJpbmcpOlByb3BlcnR5IHsgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChcInByb3BlcnRpZXNcIiwgcHJvcGVydHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhd0Rlc2NyaXB0aW9uKCk6T2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFbmNvZGluZ3MoKSA6IFNldDxFbmNvZGluZz4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kaW5ncztcclxuICAgIH1cclxuXHJcbiAgICBnZXREZWZhdWx0RW5jb2RpbmcoKSA6IEVuY29kaW5nIHtcclxuICAgICAgICBmb3IobGV0IGVuY29kaW5nIGluIHRoaXMuZW5jb2RpbmdzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmNvZGluZ1tlbmNvZGluZ107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBFbmNvZGluZy5KU09OO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlZmF1bHRQcm90b2NvbCgpIDogUHJvdG9jb2wge1xyXG4gICAgICAgIGZvcihsZXQgcHJvdG9jb2wgaW4gdGhpcy51cmlzLmtleXMoKSkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm90b2NvbFtwcm90b2NvbF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm90b2NvbC5IVFRQO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0KG1hcCwgbmFtZSk6YW55IHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzW21hcF0uZ2V0KG5hbWUpO1xyXG4gICAgICAgIGlmKHZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlPFY+KHByb3BlcnR5OiBzdHJpbmcsIGtleVByb3BlcnR5OiBzdHJpbmcsIG1hcDogYW55LCBvYmo6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMuZGVzY3JpcHRpb25bcHJvcGVydHldO1xyXG4gICAgICAgIGlmKHByb3BzKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgcCBvZiBwcm9wcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluc3RhbmNlID0gbmV3IG9iaihwKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXRpYWxpemUocCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBtYXAuc2V0KHBba2V5UHJvcGVydHldLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEV2ZW50cyBmcm9tIFwiLi4vYXBpL2V2ZW50XCI7XHJcbmltcG9ydCBQcm90b2NvbCBmcm9tIFwiLi4vbmV0L3Byb3RvY29sXCI7XHJcbmltcG9ydCBTdWJzY3JpcHRpb24gZnJvbSBcIi4uL25ldC9zdWJzY3JpcHRpb25cIjtcclxuaW1wb3J0IHtSZXNvbHZlcn0gZnJvbSBcIi4uL25ldC9yZXNvbHZlclwiO1xyXG5pbXBvcnQgVGhpbmdNb2RlbCBmcm9tIFwiLi9tb2RlbFwiO1xyXG5pbXBvcnQgRW5jb2RpbmcgZnJvbSBcIi4uL2VuY29kaW5nL2VuY29kaW5nXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhpbmdFdmVudCBleHRlbmRzIFRoaW5nTW9kZWwgaW1wbGVtZW50cyBFdmVudHMuRXZlbnQge1xyXG5cclxuICAgIHByaXZhdGUgY2FsbGJhY2tzOiBTZXQ8RXZlbnRzLkxpc3RlbmVyQ2FsbGJhY2s+ID0gXHJcbiAgICAgICAgICAgICAgICBuZXcgU2V0PEV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrPigpOyAgICAgICAgICAgICAgICBcclxuICAgXHJcbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IE1hcDxQcm90b2NvbCwgU3Vic2NyaXB0aW9uPiA9XHJcbiAgICAgICAgICAgICAgICBuZXcgTWFwPFByb3RvY29sLCBTdWJzY3JpcHRpb24+KCk7XHJcblxyXG4gICAgc3Vic2NyaWJlKGxpc3RlbmVyQ2FsbGJhY2sgOkV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrLCBwcm90b2NvbDpQcm90b2NvbCwgZW5jb2Rpbmc6IEVuY29kaW5nKTp2b2lkIHtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5hZGQobGlzdGVuZXJDYWxsYmFjayk7XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLnN1YnNjcmlwdGlvbnMuaGFzKHByb3RvY29sKSkge1xyXG4gICAgICAgICAgICBSZXNvbHZlclxyXG4gICAgICAgICAgICAgICAgLnJlc29sdmUocHJvdG9jb2wsIGVuY29kaW5nKVxyXG4gICAgICAgICAgICAgICAgLmdldEV2ZW50VXJpKHRoaXMuZ2V0VXJpQnlQcm90b2NvbChwcm90b2NvbCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGlua3MgPSByZXNwb25zZS5saW5rczsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gUmVzb2x2ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXNvbHZlKFByb3RvY29sLldTLCBlbmNvZGluZylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUobGlua3NbMF1bXCJocmVmXCJdLCB0aGlzLmhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5zZXQocHJvdG9jb2wsIHN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9IFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1bnN1YnNjcmliZShsaXN0ZW5lckNhbGxiYWNrIDpFdmVudHMuTGlzdGVuZXJDYWxsYmFjaywgcHJvdG9jb2w6UHJvdG9jb2wpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLmRlbGV0ZShsaXN0ZW5lckNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5jYWxsYmFja3Muc2l6ZSAhPSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLmZpbmRBbmRDbG9zZShwcm90b2NvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zdWJzY3JpYmVBbGwocHJvdG9jb2w6UHJvdG9jb2wpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gbmV3IFNldDxFdmVudHMuTGlzdGVuZXJDYWxsYmFjaz4oKTsgICAgICBcclxuICAgICAgICB0aGlzLmZpbmRBbmRDbG9zZShwcm90b2NvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaW5kQW5kQ2xvc2UocHJvdG9jb2w6UHJvdG9jb2wpIHtcclxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpcHRpb25zLmdldChwcm90b2NvbCk7ICAgICAgICBcclxuICAgICAgICBpZihzdWJzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kZWxldGUocHJvdG9jb2wpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZXIgPSAobWVzc2FnZTogYW55KSA9PiB7XHJcbiAgICAgICB0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKCh2YWx1ZTogYW55LCBjYWxsYmFjazogRXZlbnRzLkxpc3RlbmVyQ2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobWVzc2FnZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTW9kZWwgZnJvbSBcIi4uL2FwaS9tb2RlbFwiO1xyXG5pbXBvcnQgRGVzY3JpcHRpb24gZnJvbSBcIi4uL2FwaS9kZXNjcmlwdGlvblwiO1xyXG5pbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9Qcm90b2NvbFwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgVGhpbmdNb2RlbCBpbXBsZW1lbnRzIE1vZGVsIHtcclxuXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHR5cGU6IGFueTtcclxuICAgIHB1YmxpYyBocmVmczogQXJyYXk8c3RyaW5nPjsgICBcclxuICAgIHByaXZhdGUgZGVzY3JpcHRpb246IERlc2NyaXB0aW9uO1xyXG4gICAgcHVibGljIHVyaXM6IE1hcDxQcm90b2NvbCwgc3RyaW5nPjtcclxuXHJcbiAgICBpbml0aWFsaXplKG1vZGVsOiBhbnksIGRlc2NyaXB0aW9uOiBEZXNjcmlwdGlvbikge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG1vZGVsLm5hbWU7XHJcbiAgICAgICAgdGhpcy50eXBlID0gbW9kZWxbXCJAdHlwZVwiXTtcclxuICAgICAgICB0aGlzLmhyZWZzID0gbW9kZWwuaHJlZnM7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgZ2V0VXJpQnlQcm90b2NvbChwcm90b2NvbDogUHJvdG9jb2wpIDpzdHJpbmcgeyAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5ocmVmc1swXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGhpbmdNb2RlbDtcclxuIiwiaW1wb3J0IFByb3BlcnR5IGZyb20gXCIuLi9hcGkvcHJvcGVydHlcIjtcclxuaW1wb3J0IFRoaW5nTW9kZWwgZnJvbSBcIi4vbW9kZWxcIjtcclxuaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9uZXQvUHJvdG9jb2xcIjtcclxuaW1wb3J0IHtSZXNvbHZlcn0gZnJvbSBcIi4uL25ldC9yZXNvbHZlclwiO1xyXG5pbXBvcnQgRW5jb2RpbmcgZnJvbSBcIi4uL2VuY29kaW5nL2VuY29kaW5nXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhpbmdQcm9wZXJ0eSBleHRlbmRzIFRoaW5nTW9kZWwgaW1wbGVtZW50cyBQcm9wZXJ0eSB7XHJcblxyXG4gICAgZ2V0VmFsdWUocHJvdG9jb2w6IFByb3RvY29sLCBlbmNvZGluZzogRW5jb2RpbmcpIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gUmVzb2x2ZXJcclxuICAgICAgICAgICAgICAgIC5yZXNvbHZlKHByb3RvY29sLCBlbmNvZGluZylcclxuICAgICAgICAgICAgICAgIC5nZXRQcm9wZXJ0eSh0aGlzLmdldFVyaUJ5UHJvdG9jb2wocHJvdG9jb2wpKTsgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldFZhbHVlKHByb3RvY29sOiBQcm90b2NvbCwgdmFsdWU6IGFueSwgZW5jb2Rpbmc6IEVuY29kaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc29sdmVyXHJcbiAgICAgICAgICAgICAgICAucmVzb2x2ZShwcm90b2NvbCwgZW5jb2RpbmcpXHJcbiAgICAgICAgICAgICAgICAuc2V0UHJvcGVydHkodGhpcy5nZXRVcmlCeVByb3RvY29sKHByb3RvY29sKSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgVGhpbmcgZnJvbSBcIi4uL2FwaS90aGluZ1wiO1xyXG5pbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9wcm90b2NvbFwiXHJcbmltcG9ydCB7VHJhY2thYmxlUHJvbWlzZX0gZnJvbSBcIi4uL2FwaS9wcm9taXNlXCI7XHJcbmltcG9ydCBFdmVudHMgZnJvbSBcIi4uL2FwaS9ldmVudFwiO1xyXG5pbXBvcnQgRGVzY3JpcHRpb24gZnJvbSBcIi4uL2FwaS9kZXNjcmlwdGlvblwiO1xyXG5pbXBvcnQgRW5jb2RpbmcgZnJvbSBcIi4uL2VuY29kaW5nL2VuY29kaW5nXCI7XHJcbmltcG9ydCBUaGluZ0Rlc2NyaXB0aW9uIGZyb20gXCIuL2Rlc2NyaXB0aW9uXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJUaGluZyBpbXBsZW1lbnRzIFRoaW5nIHtcclxuXHJcbiAgICBwcml2YXRlIHByb3RvY29sOiBQcm90b2NvbDtcclxuICAgIHByaXZhdGUgZW5jb2Rpbmc6IEVuY29kaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZGVzY3JpcHRpb246IERlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgbGV0IHRoaW5nRGVzY3JpcHRpb24gPSAoPFRoaW5nRGVzY3JpcHRpb24+IGRlc2NyaXB0aW9uKTtcclxuICAgICAgICB0aGlzLnByb3RvY29sID0gdGhpbmdEZXNjcmlwdGlvbi5nZXREZWZhdWx0UHJvdG9jb2woKTtcclxuICAgICAgICB0aGlzLmVuY29kaW5nID0gdGhpbmdEZXNjcmlwdGlvbi5nZXREZWZhdWx0RW5jb2RpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQcm90b2NvbChwcm90b2NvbDogUHJvdG9jb2wpIHtcclxuICAgICAgIHRoaXMucHJvdG9jb2wgPSBwcm90b2NvbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFbmNvZGluZyhlbmNvZGluZzogRW5jb2RpbmcpIHtcclxuICAgICAgICB0aGlzLmVuY29kaW5nID0gZW5jb2Rpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXIoZXZlbnQ6c3RyaW5nLCBldmVudExpc3RlbmVyOkV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrKTogVGhpbmcge1xyXG4gICAgICAgIGxldCBlID0gdGhpcy5kZXNjcmlwdGlvbi5nZXRFdmVudChldmVudCk7XHJcbiAgICAgICAgZS5zdWJzY3JpYmUoZXZlbnRMaXN0ZW5lciwgdGhpcy5wcm90b2NvbCwgdGhpcy5lbmNvZGluZyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbW92ZUxpc3RlbmVyKGV2ZW50OnN0cmluZywgZXZlbnRMaXN0ZW5lcjpFdmVudHMuTGlzdGVuZXJDYWxsYmFjayk6IFRoaW5nIHtcclxuICAgICAgICBsZXQgZSA9IHRoaXMuZGVzY3JpcHRpb24uZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIGUudW5zdWJzY3JpYmUoZXZlbnRMaXN0ZW5lciwgdGhpcy5wcm90b2NvbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50OiBzdHJpbmcpOiBUaGluZyB7XHJcbiAgICAgICAgbGV0IGUgPSB0aGlzLmRlc2NyaXB0aW9uLmdldEV2ZW50KGV2ZW50KTtcclxuICAgICAgICBlLnVuc3Vic2NyaWJlQWxsKHRoaXMucHJvdG9jb2wpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGludm9rZUFjdGlvbihhY3Rpb246c3RyaW5nLCBhY3Rpb25QYXJhbXM6YW55KSA6IFRyYWNrYWJsZVByb21pc2U8T2JqZWN0PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24uZ2V0QWN0aW9uKGFjdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbnZva2UoYWN0aW9uUGFyYW1zLCB0aGlzLnByb3RvY29sLCB0aGlzLmVuY29kaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9wZXJ0eShwcm9wZXJ0eTpzdHJpbmcpIDogUHJvbWlzZTxhbnk+IHsgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uLmdldFByb3BlcnR5KHByb3BlcnR5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldFZhbHVlKHRoaXMucHJvdG9jb2wsIHRoaXMuZW5jb2RpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFByb3BlcnR5KHByb3BlcnR5OnN0cmluZywgdmFsdWU6YW55KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24uZ2V0UHJvcGVydHkocHJvcGVydHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodmFsdWUsIHRoaXMucHJvdG9jb2wsIHRoaXMuZW5jb2RpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2NyaXB0aW9uKCk6T2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgIH1cclxufSIsImltcG9ydCBUaGluZ3MgZnJvbSBcIi4uL2FwaS93b3RcIjtcclxuaW1wb3J0IFRoaW5nIGZyb20gXCIuLi9hcGkvdGhpbmdcIlxyXG5pbXBvcnQgV2ViVGhpbmcgZnJvbSBcIi4vdGhpbmdcIjtcclxuaW1wb3J0IHtVcmlVdGlscywgU3RyaW5nVXRpbHN9IGZyb20gXCIuLi9jb21tb24vdXRpbHNcIjtcclxuaW1wb3J0IHtSZXNvbHZlcn0gZnJvbSBcIi4uL25ldC9yZXNvbHZlclwiO1xyXG5pbXBvcnQgVGhpbmdEZXNjcmlwdGlvbiBmcm9tIFwiLi9kZXNjcmlwdGlvblwiO1xyXG5pbXBvcnQgRW5jb2RpbmcgZnJvbSBcIi4uL2VuY29kaW5nL2VuY29kaW5nXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJPZlRoaW5ncyBpbXBsZW1lbnRzIFRoaW5ncyB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZGlzY292ZXJ5VXJpOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETyB3aXRsbCBiZSBkaWZmZXJlbnQgaW4gdGhlIGZ1dHVyZVxyXG4gICAgZGlzY292ZXIodHlwZTogc3RyaW5nKSA6IFByb21pc2U8QXJyYXk8VGhpbmc+PiB7ICAgIFxyXG4gICAgICAgIGlmKFN0cmluZ1V0aWxzLmlzRW1wdHkodGhpcy5kaXNjb3ZlcnlVcmkpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJubyBkaXNjb3ZlcnkgdXJpXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHByb3RvY29sID0gVXJpVXRpbHMuZ2V0UHJvdG9jb2xGcm9tVXJpKHRoaXMuZGlzY292ZXJ5VXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb2x2ZXJcclxuICAgICAgICAgICAgLnJlc29sdmUocHJvdG9jb2wsIEVuY29kaW5nLkpTT04pXHJcbiAgICAgICAgICAgIC5nZXRMaW5rcyh0aGlzLmRpc2NvdmVyeVVyaSlcclxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgbGluayBvZiByZXNwb25zZS5saW5rcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2godGhpcy5jb25zdW1lRGVzY3JpcHRpb25VcmkobGluay5ocmVmKSk7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3VtZURlc2NyaXB0aW9uKGRlc2NyaXB0aW9uOiBhbnkpIDogUHJvbWlzZTxUaGluZz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkID0gbmV3IFRoaW5nRGVzY3JpcHRpb24oZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICByZXNvbHZlKG5ldyBXZWJUaGluZyhkKSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdW1lRGVzY3JpcHRpb25VcmkodXJpOiBzdHJpbmcpIDogUHJvbWlzZTxUaGluZz4ge1xyXG4gICAgICAgIGxldCBwcm90b2NvbCA9IFVyaVV0aWxzLmdldFByb3RvY29sRnJvbVVyaSh0aGlzLmRpc2NvdmVyeVVyaSk7XHJcblxyXG4gICAgICAgIHJldHVybiBSZXNvbHZlclxyXG4gICAgICAgICAgICAucmVzb2x2ZShwcm90b2NvbCwgRW5jb2RpbmcuSlNPTilcclxuICAgICAgICAgICAgLmdldFRoaW5nKHVyaSlcclxuICAgICAgICAgICAgLnRoZW4oKGRlc2NyaXB0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZCA9IG5ldyBUaGluZ0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBXZWJUaGluZyhkKSkgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9IFxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvZXM2LXByb21pc2UvaW5kZXguZC50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvZXM2LWNvbGxlY3Rpb25zL2luZGV4LmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL3doYXR3Zy1mZXRjaC9pbmRleC5kLnRzXCIvPlxyXG5cclxuaW1wb3J0IEJyb3dzZXJQcm90b2NvbFJlc29sdmVyIGZyb20gXCIuLi9uZXQvYnJvd3Nlci9yZXNvbHZlclwiO1xyXG5pbXBvcnQge1Jlc29sdmVyfSBmcm9tIFwiLi4vbmV0L3Jlc29sdmVyXCI7XHJcbmltcG9ydCBXZWJPZlRoaW5ncyBmcm9tIFwiLi4vaW1wbC93b3RcIlxyXG5cclxuUmVzb2x2ZXIucmVnaXN0ZXIobmV3IEJyb3dzZXJQcm90b2NvbFJlc29sdmVyKCkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdvdCA9IG5ldyBXZWJPZlRoaW5ncyhcImh0dHA6Ly90bm8yLm5ldDo4MDgwL2NvbmFzL2R0aC1lc3A4MjY2LTEvXCIpOyIsImltcG9ydCBDb25uZWN0b3IgZnJvbSBcIi4uL2Nvbm5lY3RvclwiO1xyXG5pbXBvcnQgTWVzc2FnZUhhbmRsZXIgZnJvbSBcIi4uL2hhbmRsZXJcIjtcclxuaW1wb3J0IFN1YnNjcmlwdGlvbiBmcm9tIFwiLi4vc3Vic2NyaXB0aW9uXCI7XHJcbmltcG9ydCBFbmNvZGVyIGZyb20gXCIuLi8uLi9lbmNvZGluZy9lbmNvZGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENvbm5lY3RvciBpbXBsZW1lbnRzIENvbm5lY3RvciB7XHJcblxyXG4gICAgcHJpdmF0ZSBlbmNvZGVyOiBFbmNvZGVyO1xyXG5cclxuICAgIHNldEVuY29kZXIoZW5jb2RlcjogRW5jb2Rlcikge1xyXG4gICAgICAgIHRoaXMuZW5jb2RlciA9IGVuY29kZXI7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlKHVyaTogc3RyaW5nLCBoYW5kbGVyOiBNZXNzYWdlSGFuZGxlcikgOlN1YnNjcmlwdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9ICAgICAgIFxyXG4gICAgXHJcbiAgICBnZXRMaW5rcyh1cmk6IHN0cmluZykgOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoQ2FsbCh1cmkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRoaW5nKHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hDYWxsKHVyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvcGVydHkodXJpOiBzdHJpbmcpIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaENhbGwodXJpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQcm9wZXJ0eSh1cmk6IHN0cmluZywgZGF0YTogYW55KSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hDYWxsKHVyaSwgeyBcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV2ZW50VXJpKHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hDYWxsKHVyaSwgeyBcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmV0Y2hDYWxsKHVyaTogc3RyaW5nLCBkYXRhID0ge30pIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJpLCBkYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9wcm90b2NvbFwiO1xyXG5pbXBvcnQgQ29ubmVjdG9yIGZyb20gXCIuLi9jb25uZWN0b3JcIjtcclxuaW1wb3J0IHtXc0Nvbm5lY3Rvcn0gZnJvbSBcIi4vd3NcIjtcclxuaW1wb3J0IHtIdHRwQ29ubmVjdG9yfSBmcm9tIFwiLi9odHRwXCI7XHJcbmltcG9ydCB7UmVzb2x2ZXIsIFByb3RvY29sUmVzb2x2ZXJ9IGZyb20gXCIuLi9yZXNvbHZlclwiO1xyXG5pbXBvcnQgRW5jb2RpbmcgZnJvbSBcIi4uLy4uL2VuY29kaW5nL2VuY29kaW5nXCI7XHJcbmltcG9ydCBFbmNvZGVyIGZyb20gXCIuLi8uLi9lbmNvZGluZy9lbmNvZGVyXCI7XHJcbmltcG9ydCBKc29uRW5jb2RlciBmcm9tIFwiLi4vLi4vZW5jb2RpbmcvanNvblwiO1xyXG5pbXBvcnQgWG1sRW5jb2RlciBmcm9tIFwiLi4vLi4vZW5jb2RpbmcveG1sXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcm93c2VyUHJvdG9jb2xSZXNvbHZlciBpbXBsZW1lbnRzIFByb3RvY29sUmVzb2x2ZXIge1xyXG5cclxuICAgIHByaXZhdGUgY29ubmVjdG9yczogTWFwPFByb3RvY29sLCBDb25uZWN0b3I+O1xyXG4gICAgcHJpdmF0ZSBlbmNvZGVyczogTWFwPEVuY29kaW5nLCBFbmNvZGVyPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaUNvbm5lY3RvcnMoKTtcclxuICAgICAgICB0aGlzLmluaUVuY29kZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbmlDb25uZWN0b3JzKCkgOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3RvcnMgPSBuZXcgTWFwPFByb3RvY29sLCBDb25uZWN0b3I+KCk7XHJcbiAgICAgICAgbGV0IHdzQ29ubmVjdG9yID0gbmV3IFdzQ29ubmVjdG9yKCk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0b3JzLnNldChQcm90b2NvbC5XUywgd3NDb25uZWN0b3IpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdG9ycy5zZXQoUHJvdG9jb2wuV1NTLCB3c0Nvbm5lY3Rvcik7XHJcbiAgICAgICAgbGV0IGh0dHBDb25uZWN0b3IgPSBuZXcgSHR0cENvbm5lY3RvcigpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdG9ycy5zZXQoUHJvdG9jb2wuSFRUUCwgaHR0cENvbm5lY3Rvcik7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0b3JzLnNldChQcm90b2NvbC5IVFRQUywgaHR0cENvbm5lY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbmlFbmNvZGVycygpIDogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5lbmNvZGVycyA9IG5ldyBNYXA8RW5jb2RpbmcsIEVuY29kZXI+KCk7XHJcbiAgICAgICAgdGhpcy5lbmNvZGVycy5zZXQoRW5jb2RpbmcuWE1MLCBuZXcgWG1sRW5jb2RlcigpKTtcclxuICAgICAgICB0aGlzLmVuY29kZXJzLnNldChFbmNvZGluZy5KU09OLCBuZXcgSnNvbkVuY29kZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZShwcm90b2NvbDogUHJvdG9jb2wsIGVuY29kaW5nOiBFbmNvZGluZyk6IENvbm5lY3RvciB7XHJcbiAgICAgICAgbGV0IGNvbm5lY3RvciA9IHRoaXMuY29ubmVjdG9ycy5nZXQocHJvdG9jb2wpOyBcclxuICAgICAgICBpZihjb25uZWN0b3IgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY29ubmVjdG9yIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGVuY29kZXIgPSB0aGlzLmVuY29kZXJzLmdldChlbmNvZGluZyk7XHJcbiAgICAgICAgaWYoZW5jb2RlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJlbmNvZGVyIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29ubmVjdG9yLnNldEVuY29kZXIoZW5jb2Rlcik7XHJcbiAgICAgICAgcmV0dXJuIGNvbm5lY3RvcjtcclxuICAgIH1cclxufSIsImltcG9ydCBDb25uZWN0b3IgZnJvbSBcIi4uL2Nvbm5lY3RvclwiO1xyXG5pbXBvcnQgTWVzc2FnZUhhbmRsZXIgZnJvbSBcIi4uL2hhbmRsZXJcIjtcclxuaW1wb3J0IFN1YnNjcmlwdGlvbiBmcm9tIFwiLi4vc3Vic2NyaXB0aW9uXCI7XHJcbmltcG9ydCBFbmNvZGVyIGZyb20gXCIuLi8uLi9lbmNvZGluZy9lbmNvZGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV3NDb25uZWN0b3IgaW1wbGVtZW50cyBDb25uZWN0b3Ige1xyXG5cclxuICAgIHByaXZhdGUgZW5jb2RlcjogRW5jb2RlcjtcclxuXHJcbiAgICBzZXRFbmNvZGVyKGVuY29kZXI6IEVuY29kZXIpIHtcclxuICAgICAgICB0aGlzLmVuY29kZXIgPSBlbmNvZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZSh1cmk6IHN0cmluZywgaGFuZGxlcjogTWVzc2FnZUhhbmRsZXIpIDogU3Vic2NyaXB0aW9uIHtcclxuICAgICAgICByZXR1cm4gbmV3IFdzU3Vic2NyaXB0aW9uKHVyaSwgaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGlua3ModXJpOiBzdHJpbmcpIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUaGluZyh1cmk6IHN0cmluZykgOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByb3BlcnR5KHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJvcGVydHkodXJpOiBzdHJpbmcsIGRhdGE6IGFueSkgOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV2ZW50VXJpKHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFdzU3Vic2NyaXB0aW9uIGltcGxlbWVudHMgU3Vic2NyaXB0aW9uIHtcclxuXHJcbiAgICBwcml2YXRlIHdzOiBXZWJTb2NrZXQ7ICAgIFxyXG4gICAgcHJpdmF0ZSBvcGVuOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdXJsOiBzdHJpbmcsIFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBoYW5kbGVyOiBNZXNzYWdlSGFuZGxlcikgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy53cy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdCgpIHsgICAgXHJcbiAgICAgICAgbGV0IHdzID0gbmV3IFdlYlNvY2tldCh0aGlzLnVybCk7XHJcbiAgICAgICAgd3Mub25vcGVuID0gdGhpcy5oYW5kbGVPcGVuO1xyXG4gICAgICAgIHdzLm9uY2xvc2UgPSB0aGlzLmhhbmRsZUNsb3NlO1xyXG4gICAgICAgIHdzLm9ubWVzc2FnZSA9IHRoaXMuZXhlY3V0ZUNhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMud3MgPSB3cztcclxuICAgIH1cclxuICAgXHJcbiAgICBwcml2YXRlIGhhbmRsZU9wZW4gPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vcGVuID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZUNsb3NlPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vcGVuID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgZXhlY3V0ZUNhbGxiYWNrID0gKG1lc3NhZ2U6IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcihtZXNzYWdlLmRhdGEpOyAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJlbnVtIFByb3RvY29sIHtcclxuICAgIEhUVFAsXHJcbiAgICBIVFRQUyxcclxuICAgIENPQVAsXHJcbiAgICBXUyxcclxuICAgIFdTU1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm90b2NvbDsiLCJpbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4vcHJvdG9jb2xcIjtcclxuaW1wb3J0IENvbm5lY3RvciBmcm9tIFwiLi9jb25uZWN0b3JcIjtcclxuaW1wb3J0IEVuY29kaW5nIGZyb20gXCIuLi9lbmNvZGluZy9lbmNvZGluZ1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQcm90b2NvbFJlc29sdmVyIHtcclxuICAgIHJlc29sdmUocHJvdG9jb2w6IFByb3RvY29sLCBlbmNvZGluZzogRW5jb2RpbmcpOiBDb25uZWN0b3I7XHJcbn1cclxuXHJcbmNsYXNzIERlZmF1bHRSZXNvbHZlciBpbXBsZW1lbnRzIFByb3RvY29sUmVzb2x2ZXIge1xyXG5cclxuICAgIHByaXZhdGUgcmVzb2x2ZXI6IFByb3RvY29sUmVzb2x2ZXI7XHJcblxyXG4gICAgcmVzb2x2ZShwcm90b2NvbDogUHJvdG9jb2wsIGVuY29kaW5nOiBFbmNvZGluZykgOiBDb25uZWN0b3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc29sdmVyLnJlc29sdmUocHJvdG9jb2wsIGVuY29kaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlcihyZXNvbHZlcjogUHJvdG9jb2xSZXNvbHZlcikge1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSByZXNvbHZlcjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFJlc29sdmVyID0gbmV3IERlZmF1bHRSZXNvbHZlcigpO1xyXG4iXX0=
