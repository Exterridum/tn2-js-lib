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
},{"../net/protocol":15}],2:[function(require,module,exports){
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
},{"../common/utils":1,"./encoding":2}],4:[function(require,module,exports){
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
    ThingAction.prototype.invoke = function (params, protocol) {
        resolver_1.Resolver.resolve(protocol);
        return null;
    };
    return ThingAction;
}(model_1["default"]));
exports.ThingAction = ThingAction;
},{"../net/resolver":16,"./model":7}],5:[function(require,module,exports){
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
    ThingDescription.prototype.getDefaultEncoding = function () {
        for (var encoding in this.encodings.values()) {
            return encoding_1["default"][encoding];
        }
        throw new TypeError();
    };
    ThingDescription.prototype.getDefaultProtocol = function () {
        for (var protocol in this.uris.keys()) {
            return protocol_1["default"][protocol];
        }
        throw new TypeError();
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
},{"../common/utils":1,"../encoding/encoding":2,"../encoding/utils":3,"../net/protocol":15,"./action":4,"./event":6,"./property":8}],6:[function(require,module,exports){
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
    ThingEvent.prototype.subscribe = function (listenerCallback, protocol) {
        var _this = this;
        this.callbacks.add(listenerCallback);
        if (!this.subscriptions.has(protocol)) {
            resolver_1.Resolver
                .resolve(protocol)
                .getEventUri(this.getUriByProtocol(protocol))
                .then(function (response) {
                var links = response.links;
                var subscription = resolver_1.Resolver
                    .resolve(protocol_1["default"].WS)
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
},{"../net/protocol":15,"../net/resolver":16,"./model":7}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
    ThingProperty.prototype.getValue = function (protocol) {
        return resolver_1.Resolver
            .resolve(protocol)
            .getProperty(this.getUriByProtocol(protocol));
    };
    ThingProperty.prototype.setValue = function (protocol, value) {
        return resolver_1.Resolver
            .resolve(protocol)
            .setProperty(this.getUriByProtocol(protocol), {
            value: true
        });
    };
    return ThingProperty;
}(model_1["default"]));
exports.ThingProperty = ThingProperty;
},{"../net/resolver":16,"./model":7}],9:[function(require,module,exports){
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
        e.subscribe(eventListener, this.protocol);
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
        var a = this.description.getAction(action);
        return a.invoke(actionParams, this.protocol);
    };
    WebThing.prototype.getProperty = function (property) {
        return this.description.getProperty(property).getValue(this.protocol);
    };
    WebThing.prototype.setProperty = function (property, value) {
        return this.description.getProperty(property).setValue(value, this.protocol);
    };
    WebThing.prototype.getDescription = function () {
        return this.description;
    };
    return WebThing;
}());
exports.__esModule = true;
exports["default"] = WebThing;
},{}],10:[function(require,module,exports){
"use strict";
var thing_1 = require("./thing");
var utils_1 = require("../common/utils");
var resolver_1 = require("../net/resolver");
var description_1 = require("./description");
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
            .resolve(protocol)
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
            .resolve(protocol)
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
},{"../common/utils":1,"../net/resolver":16,"./description":5,"./thing":9}],11:[function(require,module,exports){
/// <reference path="../../node_modules/@types/es6-promise/index.d.ts"/>
/// <reference path="../../node_modules/@types/es6-collections/index.d.ts"/>
/// <reference path="../../node_modules/@types/whatwg-fetch/index.d.ts"/>
"use strict";
var resolver_1 = require("../net/browser/resolver");
var resolver_2 = require("../net/resolver");
var wot_1 = require("../impl/wot");
resolver_2.Resolver.register(new resolver_1["default"]());
exports.Wot = new wot_1["default"]("http://tno2.net:8080/conas/dth-esp8266-1/");
},{"../impl/wot":10,"../net/browser/resolver":13,"../net/resolver":16}],12:[function(require,module,exports){
"use strict";
var HttpConnector = (function () {
    function HttpConnector() {
    }
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
},{}],13:[function(require,module,exports){
"use strict";
var protocol_1 = require("../protocol");
var ws_1 = require("./ws");
var http_1 = require("./http");
var BrowserProtocolResolver = (function () {
    function BrowserProtocolResolver() {
        this.connectors = new Map();
        var wsConnector = new ws_1.WsConnector();
        this.connectors.set(protocol_1["default"].WS, wsConnector);
        this.connectors.set(protocol_1["default"].WSS, wsConnector);
        var httpConnector = new http_1.HttpConnector();
        this.connectors.set(protocol_1["default"].HTTP, httpConnector);
        this.connectors.set(protocol_1["default"].HTTPS, httpConnector);
    }
    BrowserProtocolResolver.prototype.resolve = function (protocol) {
        var connector = this.connectors.get(protocol);
        if (connector == null) {
            throw new TypeError("connector not found");
        }
        return connector;
    };
    return BrowserProtocolResolver;
}());
exports.__esModule = true;
exports["default"] = BrowserProtocolResolver;
},{"../protocol":15,"./http":12,"./ws":14}],14:[function(require,module,exports){
"use strict";
var WsConnector = (function () {
    function WsConnector() {
    }
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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
"use strict";
var DefaultResolver = (function () {
    function DefaultResolver() {
    }
    DefaultResolver.prototype.resolve = function (protocol) {
        return this.resolver.resolve(protocol);
    };
    DefaultResolver.prototype.register = function (resolver) {
        this.resolver = resolver;
    };
    return DefaultResolver;
}());
exports.Resolver = new DefaultResolver();
},{}]},{},[11])(11)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb21tb24vdXRpbHMudHMiLCJlbmNvZGluZy9lbmNvZGluZy50cyIsImVuY29kaW5nL3V0aWxzLnRzIiwiaW1wbC9hY3Rpb24udHMiLCJpbXBsL2Rlc2NyaXB0aW9uLnRzIiwiaW1wbC9ldmVudC50cyIsImltcGwvbW9kZWwudHMiLCJpbXBsL3Byb3BlcnR5LnRzIiwiaW1wbC90aGluZy50cyIsImltcGwvd290LnRzIiwibGliL3dvdC1icm93c2VyLnRzIiwibmV0L2Jyb3dzZXIvaHR0cC50cyIsIm5ldC9icm93c2VyL3Jlc29sdmVyLnRzIiwibmV0L2Jyb3dzZXIvd3MudHMiLCJuZXQvcHJvdG9jb2wudHMiLCJuZXQvcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEseUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFFdkM7SUFBQTtJQUVBLENBQUM7SUFBRCxnQkFBQztBQUFELENBRkEsQUFFQyxJQUFBO0FBRlksaUJBQVMsWUFFckIsQ0FBQTtBQUVEO0lBQUE7SUFpQ0EsQ0FBQztJQS9CaUIsMkJBQWtCLEdBQWhDLFVBQWlDLElBQVk7UUFDekMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLHFCQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM5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ZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBQcm90b2NvbCBmcm9tIFwiLi4vbmV0L3Byb3RvY29sXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRW51bVV0aWxzIHtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVcmlVdGlscyB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRQcm90b2NvbEZyb21VcmkoaHJlZjogc3RyaW5nKSA6IGFueSB7XHJcbiAgICAgICAgbGV0IHNwbGl0SHJlZiA9IGhyZWYuc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgIGlmKHNwbGl0SHJlZi5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGxldCBwcm90b2NvbFN0ciA9IHNwbGl0SHJlZlswXTsgICAgICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgcCBpbiBQcm90b2NvbCkge1xyXG4gICAgICAgICAgICBpZihwLnRvTG93ZXJDYXNlKCkgPT0gcHJvdG9jb2xTdHIudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb3RvY29sW3BdO1xyXG4gICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzc2VtYmxlVXJpKC4uLnBhcnRzOiBzdHJpbmdbXSkgOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VXJpc01hcChocmVmczogQXJyYXk8c3RyaW5nPik6IE1hcDxQcm90b2NvbCwgc3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXA8UHJvdG9jb2wsIHN0cmluZz4oKTtcclxuICAgICAgICBpZighaHJlZnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcihsZXQgaHJlZiBvZiBocmVmcykge1xyXG4gICAgICAgICAgICBsZXQgcHJvdG9jb2wgPSB0aGlzLmdldFByb3RvY29sRnJvbVVyaShocmVmKTtcclxuICAgICAgICAgICAgaWYocHJvdG9jb2wgIT0gbnVsbCkgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICByZXN1bHQuc2V0KHRoaXMuZ2V0UHJvdG9jb2xGcm9tVXJpKGhyZWYpLCBocmVmKTtcclxuICAgICAgICAgICAgfSAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufSBcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tb25VdGlscyB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBleGlzdHMob2JqOiBhbnkpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG9iaiAhPT0gdW5kZWZpbmVkICYmIG9iaiAhPT0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN0cmluZ1V0aWxzIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGlzRW1wdHkoc3RyOiBzdHJpbmcpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHN0ciA9PT0gdW5kZWZpbmVkIHx8IHN0ciA9PSBudWxsIHx8IHN0ci5sZW5ndGggPT0gMDsgXHJcbiAgICB9XHJcbn0iLCJlbnVtIEVuY29kaW5nIHtcclxuICAgIEpTT04sXHJcbiAgICBYTUxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW5jb2Rpbmc7IiwiaW1wb3J0IEVuY29kaW5nIGZyb20gXCIuL2VuY29kaW5nXCI7XHJcbmltcG9ydCB7Q29tbW9uVXRpbHN9IGZyb20gXCIuLi9jb21tb24vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuY29kaW5nVXRpbHMge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0RW5jb2RpbmdzKGVuY29kaW5nczogQXJyYXk8c3RyaW5nPikgOiBTZXQ8RW5jb2Rpbmc+IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFNldDxFbmNvZGluZz4oKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBlIG9mIGVuY29kaW5ncykge1xyXG4gICAgICAgICAgICBsZXQgZW5jb2RpbmcgPSBFbmNvZGluZ1tlLnRvVXBwZXJDYXNlKCldO1xyXG4gICAgICAgICAgICBpZihDb21tb25VdGlscy5leGlzdHMoZW5jb2RpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuYWRkKGVuY29kaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYXBpL2FjdGlvblwiO1xyXG5pbXBvcnQgVGhpbmdNb2RlbCBmcm9tIFwiLi9tb2RlbFwiO1xyXG5pbXBvcnQge1RyYWNrYWJsZVByb21pc2V9IGZyb20gXCIuLi9hcGkvcHJvbWlzZVwiO1xyXG5pbXBvcnQge1Jlc29sdmVyfSBmcm9tIFwiLi4vbmV0L3Jlc29sdmVyXCI7XHJcbmltcG9ydCBQcm90b2NvbCBmcm9tIFwiLi4vbmV0L3Byb3RvY29sXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhpbmdBY3Rpb24gZXh0ZW5kcyBUaGluZ01vZGVsIGltcGxlbWVudHMgQWN0aW9uIHtcclxuICAgIFxyXG4gICAgaW52b2tlKHBhcmFtczphbnksIHByb3RvY29sOiBQcm90b2NvbCk6IFRyYWNrYWJsZVByb21pc2U8YW55PiB7XHJcbiAgICAgICAgUmVzb2x2ZXIucmVzb2x2ZShwcm90b2NvbCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgRGVzY3JpcHRpb24gZnJvbSBcIi4uL2FwaS9kZXNjcmlwdGlvblwiO1xyXG5pbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9wcm90b2NvbFwiO1xyXG5pbXBvcnQgTW9kZWwgZnJvbSBcIi4uL2FwaS9Nb2RlbFwiO1xyXG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hcGkvYWN0aW9uXCI7XHJcbmltcG9ydCBFdmVudHMgZnJvbSBcIi4uL2FwaS9ldmVudFwiO1xyXG5pbXBvcnQgUHJvcGVydHkgZnJvbSBcIi4uL2FwaS9wcm9wZXJ0eVwiO1xyXG5pbXBvcnQge1RoaW5nRXZlbnR9IGZyb20gXCIuL2V2ZW50XCI7XHJcbmltcG9ydCB7VGhpbmdBY3Rpb259IGZyb20gXCIuL2FjdGlvblwiO1xyXG5pbXBvcnQge1RoaW5nUHJvcGVydHl9IGZyb20gXCIuL3Byb3BlcnR5XCI7XHJcbmltcG9ydCB7VXJpVXRpbHN9IGZyb20gXCIuLi9jb21tb24vdXRpbHNcIjtcclxuaW1wb3J0IEVuY29kaW5nIGZyb20gXCIuLi9lbmNvZGluZy9lbmNvZGluZ1wiO1xyXG5pbXBvcnQgRW5jb2RpbmdVdGlscyBmcm9tIFwiLi4vZW5jb2RpbmcvdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRoaW5nRGVzY3JpcHRpb24gaW1wbGVtZW50cyBEZXNjcmlwdGlvbiB7XHJcblxyXG4gICAgcHJpdmF0ZSBldmVudHM6IE1hcDxzdHJpbmcsIEV2ZW50PiA9IG5ldyBNYXA8c3RyaW5nLCBFdmVudD4oKTtcclxuICAgIHByaXZhdGUgYWN0aW9uczogTWFwPHN0cmluZywgQWN0aW9uPiA9IG5ldyBNYXA8c3RyaW5nLCBBY3Rpb24+KCk7XHJcbiAgICBwcml2YXRlIHByb3BlcnRpZXM6IE1hcDxzdHJpbmcsIFByb3BlcnR5PiA9IG5ldyBNYXA8c3RyaW5nLCBQcm9wZXJ0eT4oKTtcclxuXHJcbiAgICBwcml2YXRlIHVyaXM6TWFwPFByb3RvY29sLCBzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBlbmNvZGluZ3M6U2V0PEVuY29kaW5nPjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlc2NyaXB0aW9uOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnBhcnNlKFwiZXZlbnRzXCIsIFwibmFtZVwiLCB0aGlzLmV2ZW50cywgVGhpbmdFdmVudCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wYXJzZShcImFjdGlvbnNcIiwgXCJuYW1lXCIsIHRoaXMuYWN0aW9ucywgVGhpbmdBY3Rpb24pOyAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMucGFyc2UoXCJwcm9wZXJ0aWVzXCIsIFwibmFtZVwiLCB0aGlzLnByb3BlcnRpZXMsIFRoaW5nUHJvcGVydHkpO1xyXG4gICAgICAgIHRoaXMudXJpcyA9IFVyaVV0aWxzLmdldFVyaXNNYXAoZGVzY3JpcHRpb24udXJpcyk7XHJcbiAgICAgICAgdGhpcy5lbmNvZGluZ3MgPSBFbmNvZGluZ1V0aWxzLmdldEVuY29kaW5ncyhkZXNjcmlwdGlvbi5lbmNvZGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV2ZW50KGV2ZW50OnN0cmluZyk6RXZlbnRzLkV2ZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoXCJldmVudHNcIiwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEFjdGlvbihhY3Rpb246c3RyaW5nKTpBY3Rpb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChcImFjdGlvbnNcIiwgYWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9wZXJ0eShwcm9wZXJ0eTpzdHJpbmcpOlByb3BlcnR5IHsgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChcInByb3BlcnRpZXNcIiwgcHJvcGVydHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhd0Rlc2NyaXB0aW9uKCk6T2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXREZWZhdWx0RW5jb2RpbmcoKSA6IEVuY29kaW5nIHtcclxuICAgICAgICBmb3IobGV0IGVuY29kaW5nIGluIHRoaXMuZW5jb2RpbmdzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmNvZGluZ1tlbmNvZGluZ107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREZWZhdWx0UHJvdG9jb2woKSA6IFByb3RvY29sIHtcclxuICAgICAgICBmb3IobGV0IHByb3RvY29sIGluIHRoaXMudXJpcy5rZXlzKCkpIHtcclxuICAgICAgICAgICByZXR1cm4gUHJvdG9jb2xbcHJvdG9jb2xdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQobWFwLCBuYW1lKTphbnkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXNbbWFwXS5nZXQobmFtZSk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2U8Vj4ocHJvcGVydHk6IHN0cmluZywga2V5UHJvcGVydHk6IHN0cmluZywgbWFwOiBhbnksIG9iajogYW55KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5kZXNjcmlwdGlvbltwcm9wZXJ0eV07XHJcbiAgICAgICAgaWYocHJvcHMpIHtcclxuICAgICAgICAgICAgZm9yKGxldCBwIG9mIHByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5zdGFuY2UgPSBuZXcgb2JqKHApO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuaW5pdGlhbGl6ZShwLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIG1hcC5zZXQocFtrZXlQcm9wZXJ0eV0sIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgICAgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgRXZlbnRzIGZyb20gXCIuLi9hcGkvZXZlbnRcIjtcclxuaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9uZXQvcHJvdG9jb2xcIjtcclxuaW1wb3J0IFN1YnNjcmlwdGlvbiBmcm9tIFwiLi4vbmV0L3N1YnNjcmlwdGlvblwiO1xyXG5pbXBvcnQge1Jlc29sdmVyfSBmcm9tIFwiLi4vbmV0L3Jlc29sdmVyXCI7XHJcbmltcG9ydCBUaGluZ01vZGVsIGZyb20gXCIuL21vZGVsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhpbmdFdmVudCBleHRlbmRzIFRoaW5nTW9kZWwgaW1wbGVtZW50cyBFdmVudHMuRXZlbnQge1xyXG5cclxuICAgIHByaXZhdGUgY2FsbGJhY2tzOiBTZXQ8RXZlbnRzLkxpc3RlbmVyQ2FsbGJhY2s+ID0gXHJcbiAgICAgICAgICAgICAgICBuZXcgU2V0PEV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrPigpOyAgICAgICAgICAgICAgICBcclxuICAgXHJcbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IE1hcDxQcm90b2NvbCwgU3Vic2NyaXB0aW9uPiA9XHJcbiAgICAgICAgICAgICAgICBuZXcgTWFwPFByb3RvY29sLCBTdWJzY3JpcHRpb24+KCk7XHJcblxyXG4gICAgc3Vic2NyaWJlKGxpc3RlbmVyQ2FsbGJhY2sgOkV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrLCBwcm90b2NvbDpQcm90b2NvbCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFja3MuYWRkKGxpc3RlbmVyQ2FsbGJhY2spO1xyXG5cclxuICAgICAgICBpZighdGhpcy5zdWJzY3JpcHRpb25zLmhhcyhwcm90b2NvbCkpIHtcclxuICAgICAgICAgICAgUmVzb2x2ZXJcclxuICAgICAgICAgICAgICAgIC5yZXNvbHZlKHByb3RvY29sKVxyXG4gICAgICAgICAgICAgICAgLmdldEV2ZW50VXJpKHRoaXMuZ2V0VXJpQnlQcm90b2NvbChwcm90b2NvbCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGlua3MgPSByZXNwb25zZS5saW5rczsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gUmVzb2x2ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXNvbHZlKFByb3RvY29sLldTKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShsaW5rc1swXVtcImhyZWZcIl0sIHRoaXMuaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnNldChwcm90b2NvbCwgc3Vic2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVuc3Vic2NyaWJlKGxpc3RlbmVyQ2FsbGJhY2sgOkV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrLCBwcm90b2NvbDpQcm90b2NvbCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFja3MuZGVsZXRlKGxpc3RlbmVyQ2FsbGJhY2spO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNhbGxiYWNrcy5zaXplICE9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuZmluZEFuZENsb3NlKHByb3RvY29sKTtcclxuICAgIH1cclxuXHJcbiAgICB1bnN1YnNjcmliZUFsbChwcm90b2NvbDpQcm90b2NvbCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBuZXcgU2V0PEV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrPigpOyAgICAgIFxyXG4gICAgICAgIHRoaXMuZmluZEFuZENsb3NlKHByb3RvY29sKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbmRBbmRDbG9zZShwcm90b2NvbDpQcm90b2NvbCkge1xyXG4gICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmlwdGlvbnMuZ2V0KHByb3RvY29sKTsgICAgICAgIFxyXG4gICAgICAgIGlmKHN1YnNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICBzdWJzY3JpcHRpb24uY2xvc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRlbGV0ZShwcm90b2NvbCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlciA9IChtZXNzYWdlOiBhbnkpID0+IHtcclxuICAgICAgIHRoaXMuY2FsbGJhY2tzLmZvckVhY2goKHZhbHVlOiBhbnksIGNhbGxiYWNrOiBFdmVudHMuTGlzdGVuZXJDYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhtZXNzYWdlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCBNb2RlbCBmcm9tIFwiLi4vYXBpL21vZGVsXCI7XHJcbmltcG9ydCBEZXNjcmlwdGlvbiBmcm9tIFwiLi4vYXBpL2Rlc2NyaXB0aW9uXCI7XHJcbmltcG9ydCBQcm90b2NvbCBmcm9tIFwiLi4vbmV0L1Byb3RvY29sXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBUaGluZ01vZGVsIGltcGxlbWVudHMgTW9kZWwge1xyXG5cclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdHlwZTogYW55O1xyXG4gICAgcHVibGljIGhyZWZzOiBBcnJheTxzdHJpbmc+OyAgIFxyXG4gICAgcHJpdmF0ZSBkZXNjcmlwdGlvbjogRGVzY3JpcHRpb247XHJcbiAgICBwdWJsaWMgdXJpczogTWFwPFByb3RvY29sLCBzdHJpbmc+O1xyXG5cclxuICAgIGluaXRpYWxpemUobW9kZWw6IGFueSwgZGVzY3JpcHRpb246IERlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICB0aGlzLnR5cGUgPSBtb2RlbFtcIkB0eXBlXCJdO1xyXG4gICAgICAgIHRoaXMuaHJlZnMgPSBtb2RlbC5ocmVmcztcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB9XHJcbiAgXHJcbiAgICBnZXRVcmlCeVByb3RvY29sKHByb3RvY29sOiBQcm90b2NvbCkgOnN0cmluZyB7ICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmhyZWZzWzBdO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUaGluZ01vZGVsO1xyXG4iLCJpbXBvcnQgUHJvcGVydHkgZnJvbSBcIi4uL2FwaS9wcm9wZXJ0eVwiO1xyXG5pbXBvcnQgVGhpbmdNb2RlbCBmcm9tIFwiLi9tb2RlbFwiO1xyXG5pbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9Qcm90b2NvbFwiO1xyXG5pbXBvcnQge1Jlc29sdmVyfSBmcm9tIFwiLi4vbmV0L3Jlc29sdmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhpbmdQcm9wZXJ0eSBleHRlbmRzIFRoaW5nTW9kZWwgaW1wbGVtZW50cyBQcm9wZXJ0eSB7XHJcblxyXG4gICAgZ2V0VmFsdWUocHJvdG9jb2w6IFByb3RvY29sKSA6IFByb21pc2U8YW55PiB7ICAgICAgIFxyXG4gICAgICAgIHJldHVybiBSZXNvbHZlclxyXG4gICAgICAgICAgICAgICAgLnJlc29sdmUocHJvdG9jb2wpXHJcbiAgICAgICAgICAgICAgICAuZ2V0UHJvcGVydHkodGhpcy5nZXRVcmlCeVByb3RvY29sKHByb3RvY29sKSk7ICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHByb3RvY29sOiBQcm90b2NvbCwgdmFsdWU6IGFueSkgOiBQcm9taXNlPGFueT4geyAgICAgICBcclxuICAgICAgICByZXR1cm4gUmVzb2x2ZXJcclxuICAgICAgICAgICAgICAgIC5yZXNvbHZlKHByb3RvY29sKVxyXG4gICAgICAgICAgICAgICAgLnNldFByb3BlcnR5KHRoaXMuZ2V0VXJpQnlQcm90b2NvbChwcm90b2NvbCksIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFRoaW5nIGZyb20gXCIuLi9hcGkvdGhpbmdcIjtcclxuaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9uZXQvcHJvdG9jb2xcIlxyXG5pbXBvcnQge1RyYWNrYWJsZVByb21pc2V9IGZyb20gXCIuLi9hcGkvcHJvbWlzZVwiO1xyXG5pbXBvcnQgRXZlbnRzIGZyb20gXCIuLi9hcGkvZXZlbnRcIjtcclxuaW1wb3J0IERlc2NyaXB0aW9uIGZyb20gXCIuLi9hcGkvZGVzY3JpcHRpb25cIjtcclxuaW1wb3J0IEVuY29kaW5nIGZyb20gXCIuLi9lbmNvZGluZy9lbmNvZGluZ1wiO1xyXG5pbXBvcnQgVGhpbmdEZXNjcmlwdGlvbiBmcm9tIFwiLi9kZXNjcmlwdGlvblwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViVGhpbmcgaW1wbGVtZW50cyBUaGluZyB7XHJcblxyXG4gICAgcHJpdmF0ZSBwcm90b2NvbDogUHJvdG9jb2w7XHJcbiAgICBwcml2YXRlIGVuY29kaW5nOiBFbmNvZGluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlc2NyaXB0aW9uOiBEZXNjcmlwdGlvbikge1xyXG4gICAgICAgIGxldCB0aGluZ0Rlc2NyaXB0aW9uID0gKDxUaGluZ0Rlc2NyaXB0aW9uPiBkZXNjcmlwdGlvbik7XHJcbiAgICAgICAgdGhpcy5wcm90b2NvbCA9IHRoaW5nRGVzY3JpcHRpb24uZ2V0RGVmYXVsdFByb3RvY29sKCk7XHJcbiAgICAgICAgdGhpcy5lbmNvZGluZyA9IHRoaW5nRGVzY3JpcHRpb24uZ2V0RGVmYXVsdEVuY29kaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJvdG9jb2wocHJvdG9jb2w6IFByb3RvY29sKSB7XHJcbiAgICAgICB0aGlzLnByb3RvY29sID0gcHJvdG9jb2w7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldEVuY29kaW5nKGVuY29kaW5nOiBFbmNvZGluZykge1xyXG4gICAgICAgIHRoaXMuZW5jb2RpbmcgPSBlbmNvZGluZztcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcihldmVudDpzdHJpbmcsIGV2ZW50TGlzdGVuZXI6RXZlbnRzLkxpc3RlbmVyQ2FsbGJhY2spOiBUaGluZyB7XHJcbiAgICAgICAgbGV0IGUgPSB0aGlzLmRlc2NyaXB0aW9uLmdldEV2ZW50KGV2ZW50KTtcclxuICAgICAgICBlLnN1YnNjcmliZShldmVudExpc3RlbmVyLCB0aGlzLnByb3RvY29sKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVtb3ZlTGlzdGVuZXIoZXZlbnQ6c3RyaW5nLCBldmVudExpc3RlbmVyOkV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrKTogVGhpbmcge1xyXG4gICAgICAgIGxldCBlID0gdGhpcy5kZXNjcmlwdGlvbi5nZXRFdmVudChldmVudCk7XHJcbiAgICAgICAgZS51bnN1YnNjcmliZShldmVudExpc3RlbmVyLCB0aGlzLnByb3RvY29sKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQ6IHN0cmluZyk6IFRoaW5nIHtcclxuICAgICAgICBsZXQgZSA9IHRoaXMuZGVzY3JpcHRpb24uZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIGUudW5zdWJzY3JpYmVBbGwodGhpcy5wcm90b2NvbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW52b2tlQWN0aW9uKGFjdGlvbjpzdHJpbmcsIGFjdGlvblBhcmFtczphbnkpIDogVHJhY2thYmxlUHJvbWlzZTxPYmplY3Q+IHtcclxuICAgICAgICBsZXQgYSA9IHRoaXMuZGVzY3JpcHRpb24uZ2V0QWN0aW9uKGFjdGlvbik7ICAgICAgICBcclxuICAgICAgICByZXR1cm4gYS5pbnZva2UoYWN0aW9uUGFyYW1zLCB0aGlzLnByb3RvY29sKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9wZXJ0eShwcm9wZXJ0eTpzdHJpbmcpIDogUHJvbWlzZTxhbnk+IHsgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uLmdldFByb3BlcnR5KHByb3BlcnR5KS5nZXRWYWx1ZSh0aGlzLnByb3RvY29sKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQcm9wZXJ0eShwcm9wZXJ0eTpzdHJpbmcsIHZhbHVlOmFueSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uLmdldFByb3BlcnR5KHByb3BlcnR5KS5zZXRWYWx1ZSh2YWx1ZSwgdGhpcy5wcm90b2NvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGVzY3JpcHRpb24oKTpPYmplY3Qge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFRoaW5ncyBmcm9tIFwiLi4vYXBpL3dvdFwiO1xyXG5pbXBvcnQgVGhpbmcgZnJvbSBcIi4uL2FwaS90aGluZ1wiXHJcbmltcG9ydCBXZWJUaGluZyBmcm9tIFwiLi90aGluZ1wiO1xyXG5pbXBvcnQge1VyaVV0aWxzLCBTdHJpbmdVdGlsc30gZnJvbSBcIi4uL2NvbW1vbi91dGlsc1wiO1xyXG5pbXBvcnQge1Jlc29sdmVyfSBmcm9tIFwiLi4vbmV0L3Jlc29sdmVyXCI7XHJcbmltcG9ydCBUaGluZ0Rlc2NyaXB0aW9uIGZyb20gXCIuL2Rlc2NyaXB0aW9uXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJPZlRoaW5ncyBpbXBsZW1lbnRzIFRoaW5ncyB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZGlzY292ZXJ5VXJpOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETyB3aXRsbCBiZSBkaWZmZXJlbnQgaW4gdGhlIGZ1dHVyZVxyXG4gICAgZGlzY292ZXIodHlwZTogc3RyaW5nKSA6IFByb21pc2U8QXJyYXk8VGhpbmc+PiB7ICAgIFxyXG4gICAgICAgIGlmKFN0cmluZ1V0aWxzLmlzRW1wdHkodGhpcy5kaXNjb3ZlcnlVcmkpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJubyBkaXNjb3ZlcnkgdXJpXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHByb3RvY29sID0gVXJpVXRpbHMuZ2V0UHJvdG9jb2xGcm9tVXJpKHRoaXMuZGlzY292ZXJ5VXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb2x2ZXJcclxuICAgICAgICAgICAgLnJlc29sdmUocHJvdG9jb2wpXHJcbiAgICAgICAgICAgIC5nZXRMaW5rcyh0aGlzLmRpc2NvdmVyeVVyaSlcclxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgbGluayBvZiByZXNwb25zZS5saW5rcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2godGhpcy5jb25zdW1lRGVzY3JpcHRpb25VcmkobGluay5ocmVmKSk7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3VtZURlc2NyaXB0aW9uKGRlc2NyaXB0aW9uOiBhbnkpIDogUHJvbWlzZTxUaGluZz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkID0gbmV3IFRoaW5nRGVzY3JpcHRpb24oZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICByZXNvbHZlKG5ldyBXZWJUaGluZyhkKSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdW1lRGVzY3JpcHRpb25VcmkodXJpOiBzdHJpbmcpIDogUHJvbWlzZTxUaGluZz4ge1xyXG4gICAgICAgIGxldCBwcm90b2NvbCA9IFVyaVV0aWxzLmdldFByb3RvY29sRnJvbVVyaSh0aGlzLmRpc2NvdmVyeVVyaSk7XHJcblxyXG4gICAgICAgIHJldHVybiBSZXNvbHZlclxyXG4gICAgICAgICAgICAucmVzb2x2ZShwcm90b2NvbClcclxuICAgICAgICAgICAgLmdldFRoaW5nKHVyaSlcclxuICAgICAgICAgICAgLnRoZW4oKGRlc2NyaXB0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZCA9IG5ldyBUaGluZ0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBXZWJUaGluZyhkKSkgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9IFxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvZXM2LXByb21pc2UvaW5kZXguZC50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvZXM2LWNvbGxlY3Rpb25zL2luZGV4LmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL3doYXR3Zy1mZXRjaC9pbmRleC5kLnRzXCIvPlxyXG5cclxuaW1wb3J0IEJyb3dzZXJQcm90b2NvbFJlc29sdmVyIGZyb20gXCIuLi9uZXQvYnJvd3Nlci9yZXNvbHZlclwiO1xyXG5pbXBvcnQge1Jlc29sdmVyfSBmcm9tIFwiLi4vbmV0L3Jlc29sdmVyXCI7XHJcbmltcG9ydCBXZWJPZlRoaW5ncyBmcm9tIFwiLi4vaW1wbC93b3RcIlxyXG5cclxuUmVzb2x2ZXIucmVnaXN0ZXIobmV3IEJyb3dzZXJQcm90b2NvbFJlc29sdmVyKCkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdvdCA9IG5ldyBXZWJPZlRoaW5ncyhcImh0dHA6Ly90bm8yLm5ldDo4MDgwL2NvbmFzL2R0aC1lc3A4MjY2LTEvXCIpOyIsImltcG9ydCBDb25uZWN0b3IgZnJvbSBcIi4uL2Nvbm5lY3RvclwiO1xyXG5pbXBvcnQgTWVzc2FnZUhhbmRsZXIgZnJvbSBcIi4uL2hhbmRsZXJcIjtcclxuaW1wb3J0IFN1YnNjcmlwdGlvbiBmcm9tIFwiLi4vc3Vic2NyaXB0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENvbm5lY3RvciBpbXBsZW1lbnRzIENvbm5lY3RvciB7XHJcbiAgIFxyXG4gICAgc3Vic2NyaWJlKHVyaTogc3RyaW5nLCBoYW5kbGVyOiBNZXNzYWdlSGFuZGxlcikgOlN1YnNjcmlwdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9ICAgICAgIFxyXG4gICAgXHJcbiAgICBnZXRMaW5rcyh1cmk6IHN0cmluZykgOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoQ2FsbCh1cmkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRoaW5nKHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hDYWxsKHVyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvcGVydHkodXJpOiBzdHJpbmcpIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaENhbGwodXJpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQcm9wZXJ0eSh1cmk6IHN0cmluZywgZGF0YTogYW55KSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hDYWxsKHVyaSwgeyBcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV2ZW50VXJpKHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hDYWxsKHVyaSwgeyBcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmV0Y2hDYWxsKHVyaTogc3RyaW5nLCBkYXRhID0ge30pIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJpLCBkYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9wcm90b2NvbFwiO1xyXG5pbXBvcnQgQ29ubmVjdG9yIGZyb20gXCIuLi9jb25uZWN0b3JcIjtcclxuaW1wb3J0IHtXc0Nvbm5lY3Rvcn0gZnJvbSBcIi4vd3NcIjtcclxuaW1wb3J0IHtIdHRwQ29ubmVjdG9yfSBmcm9tIFwiLi9odHRwXCI7XHJcbmltcG9ydCB7UmVzb2x2ZXIsIFByb3RvY29sUmVzb2x2ZXJ9IGZyb20gXCIuLi9yZXNvbHZlclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJvd3NlclByb3RvY29sUmVzb2x2ZXIgaW1wbGVtZW50cyBQcm90b2NvbFJlc29sdmVyIHtcclxuXHJcbiAgICBwcml2YXRlIGNvbm5lY3RvcnM6IE1hcDxQcm90b2NvbCwgQ29ubmVjdG9yPjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0b3JzID0gbmV3IE1hcDxQcm90b2NvbCwgQ29ubmVjdG9yPigpO1xyXG4gICAgICAgIGxldCB3c0Nvbm5lY3RvciA9IG5ldyBXc0Nvbm5lY3RvcigpOyAgICAgICBcclxuICAgICAgICB0aGlzLmNvbm5lY3RvcnMuc2V0KFByb3RvY29sLldTLCB3c0Nvbm5lY3Rvcik7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0b3JzLnNldChQcm90b2NvbC5XU1MsIHdzQ29ubmVjdG9yKTtcclxuICAgICAgICBsZXQgaHR0cENvbm5lY3RvciA9IG5ldyBIdHRwQ29ubmVjdG9yKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmNvbm5lY3RvcnMuc2V0KFByb3RvY29sLkhUVFAsIGh0dHBDb25uZWN0b3IpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb25uZWN0b3JzLnNldChQcm90b2NvbC5IVFRQUywgaHR0cENvbm5lY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZShwcm90b2NvbDogUHJvdG9jb2wpOiBDb25uZWN0b3Ige1xyXG4gICAgICAgIGxldCBjb25uZWN0b3IgPSB0aGlzLmNvbm5lY3RvcnMuZ2V0KHByb3RvY29sKTsgXHJcbiAgICAgICAgaWYoY29ubmVjdG9yID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNvbm5lY3RvciBub3QgZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25uZWN0b3I7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ29ubmVjdG9yIGZyb20gXCIuLi9jb25uZWN0b3JcIjtcclxuaW1wb3J0IE1lc3NhZ2VIYW5kbGVyIGZyb20gXCIuLi9oYW5kbGVyXCI7XHJcbmltcG9ydCBTdWJzY3JpcHRpb24gZnJvbSBcIi4uL3N1YnNjcmlwdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdzQ29ubmVjdG9yIGltcGxlbWVudHMgQ29ubmVjdG9yIHtcclxuXHJcbiAgICBzdWJzY3JpYmUodXJpOiBzdHJpbmcsIGhhbmRsZXI6IE1lc3NhZ2VIYW5kbGVyKSA6IFN1YnNjcmlwdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBXc1N1YnNjcmlwdGlvbih1cmksIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExpbmtzKHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGhpbmcodXJpOiBzdHJpbmcpIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9wZXJ0eSh1cmk6IHN0cmluZykgOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFByb3BlcnR5KHVyaTogc3RyaW5nLCBkYXRhOiBhbnkpIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFdmVudFVyaSh1cmk6IHN0cmluZykgOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBXc1N1YnNjcmlwdGlvbiBpbXBsZW1lbnRzIFN1YnNjcmlwdGlvbiB7XHJcblxyXG4gICAgcHJpdmF0ZSB3czogV2ViU29ja2V0OyAgICBcclxuICAgIHByaXZhdGUgb3BlbjogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHVybDogc3RyaW5nLCBcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgaGFuZGxlcjogTWVzc2FnZUhhbmRsZXIpIHsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMud3MuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSB7ICAgIFxyXG4gICAgICAgIGxldCB3cyA9IG5ldyBXZWJTb2NrZXQodGhpcy51cmwpO1xyXG4gICAgICAgIHdzLm9ub3BlbiA9IHRoaXMuaGFuZGxlT3BlbjtcclxuICAgICAgICB3cy5vbmNsb3NlID0gdGhpcy5oYW5kbGVDbG9zZTtcclxuICAgICAgICB3cy5vbm1lc3NhZ2UgPSB0aGlzLmV4ZWN1dGVDYWxsYmFjaztcclxuICAgICAgICB0aGlzLndzID0gd3M7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgcHJpdmF0ZSBoYW5kbGVPcGVuID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMub3BlbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVDbG9zZT0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMub3BlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGV4ZWN1dGVDYWxsYmFjayA9IChtZXNzYWdlOiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLmhhbmRsZXIobWVzc2FnZS5kYXRhKTsgICAgICAgIFxyXG4gICAgfVxyXG59IiwiZW51bSBQcm90b2NvbCB7XHJcbiAgICBIVFRQLFxyXG4gICAgSFRUUFMsXHJcbiAgICBDT0FQLFxyXG4gICAgV1MsXHJcbiAgICBXU1NcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvdG9jb2w7IiwiaW1wb3J0IFByb3RvY29sIGZyb20gXCIuL3Byb3RvY29sXCI7XHJcbmltcG9ydCBDb25uZWN0b3IgZnJvbSBcIi4vY29ubmVjdG9yXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFByb3RvY29sUmVzb2x2ZXIge1xyXG4gICAgcmVzb2x2ZShwcm90b2NvbDogUHJvdG9jb2wpOiBDb25uZWN0b3I7XHJcbn1cclxuXHJcbmNsYXNzIERlZmF1bHRSZXNvbHZlciBpbXBsZW1lbnRzIFByb3RvY29sUmVzb2x2ZXIge1xyXG5cclxuICAgIHByaXZhdGUgcmVzb2x2ZXI6IFByb3RvY29sUmVzb2x2ZXI7XHJcblxyXG4gICAgcmVzb2x2ZShwcm90b2NvbDogUHJvdG9jb2wpIDogQ29ubmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlci5yZXNvbHZlKHByb3RvY29sKTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlcihyZXNvbHZlcjogUHJvdG9jb2xSZXNvbHZlcikge1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSByZXNvbHZlcjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFJlc29sdmVyID0gbmV3IERlZmF1bHRSZXNvbHZlcigpOyJdfQ==
