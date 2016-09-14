(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tno = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var protocol_1 = require("../net/protocol");
var UriUtils = (function () {
    function UriUtils() {
    }
    UriUtils.getProtocolFromUri = function (href) {
        var splitHref = href.split(":");
        console.log(splitHref);
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
var StringUtils = (function () {
    function StringUtils() {
    }
    StringUtils.isEmpty = function (str) {
        return str === undefined || str == null || str.length == 0;
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;
},{"../net/protocol":13}],2:[function(require,module,exports){
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
},{"../net/resolver":14,"./model":5}],3:[function(require,module,exports){
"use strict";
var event_1 = require("./event");
var action_1 = require("./action");
var property_1 = require("./property");
var utils_1 = require("../common/utils");
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
},{"../common/utils":1,"./action":2,"./event":4,"./property":6}],4:[function(require,module,exports){
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
                    .subscribe(links[0].href, _this.handler);
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
},{"../net/protocol":13,"../net/resolver":14,"./model":5}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"../net/resolver":14,"./model":5}],7:[function(require,module,exports){
"use strict";
var protocol_1 = require("../net/protocol");
var WebThing = (function () {
    function WebThing(description) {
        this.description = description;
        this.protocol = protocol_1["default"].HTTP;
    }
    WebThing.prototype.setProtocol = function (protocol) {
        this.protocol = protocol;
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
},{"../net/protocol":13}],8:[function(require,module,exports){
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
},{"../common/utils":1,"../net/resolver":14,"./description":3,"./thing":7}],9:[function(require,module,exports){
/// <reference path="../../node_modules/@types/es6-promise/index.d.ts"/>
/// <reference path="../../node_modules/@types/es6-collections/index.d.ts"/>
/// <reference path="../../node_modules/@types/whatwg-fetch/index.d.ts"/>
"use strict";
var resolver_1 = require("../net/browser/resolver");
var resolver_2 = require("../net/resolver");
var wot_1 = require("../impl/wot");
resolver_2.Resolver.register(new resolver_1["default"]());
exports.Wot = new wot_1["default"]("http://tno2.net:8080/conas/dth-esp8266-1/");
},{"../impl/wot":8,"../net/browser/resolver":11,"../net/resolver":14}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
            throw new TypeError();
        }
        return connector;
    };
    return BrowserProtocolResolver;
}());
exports.__esModule = true;
exports["default"] = BrowserProtocolResolver;
},{"../protocol":13,"./http":10,"./ws":12}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}]},{},[9])(9)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb21tb24vdXRpbHMudHMiLCJpbXBsL2FjdGlvbi50cyIsImltcGwvZGVzY3JpcHRpb24udHMiLCJpbXBsL2V2ZW50LnRzIiwiaW1wbC9tb2RlbC50cyIsImltcGwvcHJvcGVydHkudHMiLCJpbXBsL3RoaW5nLnRzIiwiaW1wbC93b3QudHMiLCJsaWIvd290LWJyb3dzZXIudHMiLCJuZXQvYnJvd3Nlci9odHRwLnRzIiwibmV0L2Jyb3dzZXIvcmVzb2x2ZXIudHMiLCJuZXQvYnJvd3Nlci93cy50cyIsIm5ldC9wcm90b2NvbC50cyIsIm5ldC9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSx5QkFBcUIsaUJBQWlCLENBQUMsQ0FBQTtBQUV2QztJQUFBO0lBNkJBLENBQUM7SUEzQmlCLDJCQUFrQixHQUFoQyxVQUFpQyxJQUFZO1FBQ3pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELEVBQUUsQ0FBQSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxJQUFJLFdBQVcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQVEsQ0FBQyxDQUFDLENBQUM7WUFDcEIsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxxQkFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVhLG1C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QUM7SUFDN0IsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0FYQSxBQVdDLElBQUE7QUFFWSxnQkFBUSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9uZXQvcHJvdG9jb2xcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVcmlVdGlscyB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRQcm90b2NvbEZyb21VcmkoaHJlZjogc3RyaW5nKSA6IGFueSB7XHJcbiAgICAgICAgbGV0IHNwbGl0SHJlZiA9IGhyZWYuc3BsaXQoXCI6XCIpOyBjb25zb2xlLmxvZyhzcGxpdEhyZWYpO1xyXG4gICAgICAgIGlmKHNwbGl0SHJlZi5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGxldCBwcm90b2NvbFN0ciA9IHNwbGl0SHJlZlswXTsgICAgICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgcCBpbiBQcm90b2NvbCkge1xyXG4gICAgICAgICAgICBpZihwLnRvTG93ZXJDYXNlKCkgPT0gcHJvdG9jb2xTdHIudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb3RvY29sW3BdO1xyXG4gICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVyaXNNYXAoaHJlZnM6IEFycmF5PHN0cmluZz4pOiBNYXA8UHJvdG9jb2wsIHN0cmluZz4ge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFwPFByb3RvY29sLCBzdHJpbmc+KCk7XHJcbiAgICAgICAgaWYoIWhyZWZzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IobGV0IGhyZWYgb2YgaHJlZnMpIHtcclxuICAgICAgICAgICAgbGV0IHByb3RvY29sID0gdGhpcy5nZXRQcm90b2NvbEZyb21VcmkoaHJlZik7XHJcbiAgICAgICAgICAgIGlmKHByb3RvY29sICE9IG51bGwpIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgcmVzdWx0LnNldCh0aGlzLmdldFByb3RvY29sRnJvbVVyaShocmVmKSwgaHJlZik7XHJcbiAgICAgICAgICAgIH0gICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn0gXHJcblxyXG5leHBvcnQgY2xhc3MgU3RyaW5nVXRpbHMge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaXNFbXB0eShzdHI6IHN0cmluZykgOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gc3RyID09PSB1bmRlZmluZWQgfHwgc3RyID09IG51bGwgfHwgc3RyLmxlbmd0aCA9PSAwOyBcclxuICAgIH1cclxufSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FwaS9hY3Rpb25cIjtcclxuaW1wb3J0IFRoaW5nTW9kZWwgZnJvbSBcIi4vbW9kZWxcIjtcclxuaW1wb3J0IHtUcmFja2FibGVQcm9taXNlfSBmcm9tIFwiLi4vYXBpL3Byb21pc2VcIjtcclxuaW1wb3J0IHtSZXNvbHZlcn0gZnJvbSBcIi4uL25ldC9yZXNvbHZlclwiO1xyXG5pbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9wcm90b2NvbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRoaW5nQWN0aW9uIGV4dGVuZHMgVGhpbmdNb2RlbCBpbXBsZW1lbnRzIEFjdGlvbiB7XHJcbiAgICBcclxuICAgIGludm9rZShwYXJhbXM6YW55LCBwcm90b2NvbDogUHJvdG9jb2wpOiBUcmFja2FibGVQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIFJlc29sdmVyLnJlc29sdmUocHJvdG9jb2wpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IERlc2NyaXB0aW9uIGZyb20gXCIuLi9hcGkvZGVzY3JpcHRpb25cIjtcclxuaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9uZXQvcHJvdG9jb2xcIjtcclxuaW1wb3J0IE1vZGVsIGZyb20gXCIuLi9hcGkvTW9kZWxcIjtcclxuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYXBpL2FjdGlvblwiO1xyXG5pbXBvcnQgRXZlbnRzIGZyb20gXCIuLi9hcGkvZXZlbnRcIjtcclxuaW1wb3J0IFByb3BlcnR5IGZyb20gXCIuLi9hcGkvcHJvcGVydHlcIjtcclxuaW1wb3J0IHtUaGluZ0V2ZW50fSBmcm9tIFwiLi9ldmVudFwiO1xyXG5pbXBvcnQge1RoaW5nQWN0aW9ufSBmcm9tIFwiLi9hY3Rpb25cIjtcclxuaW1wb3J0IHtUaGluZ1Byb3BlcnR5fSBmcm9tIFwiLi9wcm9wZXJ0eVwiO1xyXG5pbXBvcnQge1VyaVV0aWxzfSBmcm9tIFwiLi4vY29tbW9uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaGluZ0Rlc2NyaXB0aW9uIGltcGxlbWVudHMgRGVzY3JpcHRpb24ge1xyXG5cclxuICAgIHByaXZhdGUgZXZlbnRzOiBNYXA8c3RyaW5nLCBFdmVudD4gPSBuZXcgTWFwPHN0cmluZywgRXZlbnQ+KCk7XHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IE1hcDxzdHJpbmcsIEFjdGlvbj4gPSBuZXcgTWFwPHN0cmluZywgQWN0aW9uPigpO1xyXG4gICAgcHJpdmF0ZSBwcm9wZXJ0aWVzOiBNYXA8c3RyaW5nLCBQcm9wZXJ0eT4gPSBuZXcgTWFwPHN0cmluZywgUHJvcGVydHk+KCk7XHJcblxyXG4gICAgcHJpdmF0ZSB1cmlzOk1hcDxQcm90b2NvbCwgc3RyaW5nPjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlc2NyaXB0aW9uOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnBhcnNlKFwiZXZlbnRzXCIsIFwibmFtZVwiLCB0aGlzLmV2ZW50cywgVGhpbmdFdmVudCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wYXJzZShcImFjdGlvbnNcIiwgXCJuYW1lXCIsIHRoaXMuYWN0aW9ucywgVGhpbmdBY3Rpb24pOyAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMucGFyc2UoXCJwcm9wZXJ0aWVzXCIsIFwibmFtZVwiLCB0aGlzLnByb3BlcnRpZXMsIFRoaW5nUHJvcGVydHkpO1xyXG4gICAgICAgIHRoaXMudXJpcyA9IFVyaVV0aWxzLmdldFVyaXNNYXAoZGVzY3JpcHRpb24udXJpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXZlbnQoZXZlbnQ6c3RyaW5nKTpFdmVudHMuRXZlbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChcImV2ZW50c1wiLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWN0aW9uKGFjdGlvbjpzdHJpbmcpOkFjdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwiYWN0aW9uc1wiLCBhY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByb3BlcnR5KHByb3BlcnR5OnN0cmluZyk6UHJvcGVydHkgeyAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwicHJvcGVydGllc1wiLCBwcm9wZXJ0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmF3RGVzY3JpcHRpb24oKTpPYmplY3Qge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0KG1hcCwgbmFtZSk6YW55IHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzW21hcF0uZ2V0KG5hbWUpO1xyXG4gICAgICAgIGlmKHZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlPFY+KHByb3BlcnR5OiBzdHJpbmcsIGtleVByb3BlcnR5OiBzdHJpbmcsIG1hcDogYW55LCBvYmo6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMuZGVzY3JpcHRpb25bcHJvcGVydHldO1xyXG4gICAgICAgIGlmKHByb3BzKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgcCBvZiBwcm9wcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluc3RhbmNlID0gbmV3IG9iaihwKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXRpYWxpemUocCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBtYXAuc2V0KHBba2V5UHJvcGVydHldLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEV2ZW50cyBmcm9tIFwiLi4vYXBpL2V2ZW50XCI7XHJcbmltcG9ydCBQcm90b2NvbCBmcm9tIFwiLi4vbmV0L3Byb3RvY29sXCI7XHJcbmltcG9ydCBTdWJzY3JpcHRpb24gZnJvbSBcIi4uL25ldC9zdWJzY3JpcHRpb25cIjtcclxuaW1wb3J0IHtSZXNvbHZlcn0gZnJvbSBcIi4uL25ldC9yZXNvbHZlclwiO1xyXG5pbXBvcnQgVGhpbmdNb2RlbCBmcm9tIFwiLi9tb2RlbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRoaW5nRXZlbnQgZXh0ZW5kcyBUaGluZ01vZGVsIGltcGxlbWVudHMgRXZlbnRzLkV2ZW50IHtcclxuXHJcbiAgICBwcml2YXRlIGNhbGxiYWNrczogU2V0PEV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrPiA9IFxyXG4gICAgICAgICAgICAgICAgbmV3IFNldDxFdmVudHMuTGlzdGVuZXJDYWxsYmFjaz4oKTsgICAgICAgICAgICAgICAgXHJcbiAgIFxyXG4gICAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBNYXA8UHJvdG9jb2wsIFN1YnNjcmlwdGlvbj4gPVxyXG4gICAgICAgICAgICAgICAgbmV3IE1hcDxQcm90b2NvbCwgU3Vic2NyaXB0aW9uPigpO1xyXG5cclxuICAgIHN1YnNjcmliZShsaXN0ZW5lckNhbGxiYWNrIDpFdmVudHMuTGlzdGVuZXJDYWxsYmFjaywgcHJvdG9jb2w6UHJvdG9jb2wpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLmFkZChsaXN0ZW5lckNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMuc3Vic2NyaXB0aW9ucy5oYXMocHJvdG9jb2wpKSB7XHJcbiAgICAgICAgICAgIFJlc29sdmVyXHJcbiAgICAgICAgICAgICAgICAucmVzb2x2ZShwcm90b2NvbClcclxuICAgICAgICAgICAgICAgIC5nZXRFdmVudFVyaSh0aGlzLmdldFVyaUJ5UHJvdG9jb2wocHJvdG9jb2wpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmtzID0gcmVzcG9uc2UubGlua3M7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IFJlc29sdmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVzb2x2ZShQcm90b2NvbC5XUylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUobGlua3NbMF0uaHJlZiwgdGhpcy5oYW5kbGVyKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5zZXQocHJvdG9jb2wsIHN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIHVuc3Vic2NyaWJlKGxpc3RlbmVyQ2FsbGJhY2sgOkV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrLCBwcm90b2NvbDpQcm90b2NvbCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFja3MuZGVsZXRlKGxpc3RlbmVyQ2FsbGJhY2spO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRoaXMuY2FsbGJhY2tzLnNpemUgIT0gMCkgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuZmluZEFuZENsb3NlKHByb3RvY29sKTtcclxuICAgIH1cclxuXHJcbiAgICB1bnN1YnNjcmliZUFsbChwcm90b2NvbDpQcm90b2NvbCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBuZXcgU2V0PEV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrPigpOyAgICAgIFxyXG4gICAgICAgIHRoaXMuZmluZEFuZENsb3NlKHByb3RvY29sKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbmRBbmRDbG9zZShwcm90b2NvbDpQcm90b2NvbCkge1xyXG4gICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmlwdGlvbnMuZ2V0KHByb3RvY29sKTsgICAgICAgIFxyXG4gICAgICAgIGlmKHN1YnNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICBzdWJzY3JpcHRpb24uY2xvc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRlbGV0ZShwcm90b2NvbCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlciA9IChtZXNzYWdlOiBhbnkpID0+IHtcclxuICAgICAgIHRoaXMuY2FsbGJhY2tzLmZvckVhY2goKHZhbHVlOiBhbnksIGNhbGxiYWNrOiBFdmVudHMuTGlzdGVuZXJDYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhtZXNzYWdlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCBNb2RlbCBmcm9tIFwiLi4vYXBpL21vZGVsXCI7XHJcbmltcG9ydCBEZXNjcmlwdGlvbiBmcm9tIFwiLi4vYXBpL2Rlc2NyaXB0aW9uXCI7XHJcbmltcG9ydCBQcm90b2NvbCBmcm9tIFwiLi4vbmV0L1Byb3RvY29sXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBUaGluZ01vZGVsIGltcGxlbWVudHMgTW9kZWwge1xyXG5cclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdHlwZTogYW55O1xyXG4gICAgcHVibGljIGhyZWZzOiBBcnJheTxzdHJpbmc+OyAgIFxyXG4gICAgcHJpdmF0ZSBkZXNjcmlwdGlvbjogRGVzY3JpcHRpb247XHJcbiAgICBwdWJsaWMgdXJpczogTWFwPFByb3RvY29sLCBzdHJpbmc+O1xyXG5cclxuICAgIGluaXRpYWxpemUobW9kZWw6IGFueSwgZGVzY3JpcHRpb246IERlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICB0aGlzLnR5cGUgPSBtb2RlbFtcIkB0eXBlXCJdO1xyXG4gICAgICAgIHRoaXMuaHJlZnMgPSBtb2RlbC5ocmVmcztcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB9XHJcbiAgXHJcbiAgICBnZXRVcmlCeVByb3RvY29sKHByb3RvY29sOiBQcm90b2NvbCkgOnN0cmluZyB7ICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmhyZWZzWzBdO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUaGluZ01vZGVsO1xyXG4iLCJpbXBvcnQgUHJvcGVydHkgZnJvbSBcIi4uL2FwaS9wcm9wZXJ0eVwiO1xyXG5pbXBvcnQgVGhpbmdNb2RlbCBmcm9tIFwiLi9tb2RlbFwiO1xyXG5pbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9Qcm90b2NvbFwiO1xyXG5pbXBvcnQge1Jlc29sdmVyfSBmcm9tIFwiLi4vbmV0L3Jlc29sdmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhpbmdQcm9wZXJ0eSBleHRlbmRzIFRoaW5nTW9kZWwgaW1wbGVtZW50cyBQcm9wZXJ0eSB7XHJcblxyXG4gICAgZ2V0VmFsdWUocHJvdG9jb2w6IFByb3RvY29sKSA6IFByb21pc2U8YW55PiB7ICAgICAgIFxyXG4gICAgICAgIHJldHVybiBSZXNvbHZlclxyXG4gICAgICAgICAgICAgICAgLnJlc29sdmUocHJvdG9jb2wpXHJcbiAgICAgICAgICAgICAgICAuZ2V0UHJvcGVydHkodGhpcy5nZXRVcmlCeVByb3RvY29sKHByb3RvY29sKSk7ICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHByb3RvY29sOiBQcm90b2NvbCwgdmFsdWU6IGFueSkgOiBQcm9taXNlPGFueT4geyAgICAgICBcclxuICAgICAgICByZXR1cm4gUmVzb2x2ZXJcclxuICAgICAgICAgICAgICAgIC5yZXNvbHZlKHByb3RvY29sKVxyXG4gICAgICAgICAgICAgICAgLnNldFByb3BlcnR5KHRoaXMuZ2V0VXJpQnlQcm90b2NvbChwcm90b2NvbCksIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFRoaW5nIGZyb20gXCIuLi9hcGkvdGhpbmdcIjtcclxuaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9uZXQvcHJvdG9jb2xcIlxyXG5pbXBvcnQge1RyYWNrYWJsZVByb21pc2V9IGZyb20gXCIuLi9hcGkvcHJvbWlzZVwiO1xyXG5pbXBvcnQgRXZlbnRzIGZyb20gXCIuLi9hcGkvZXZlbnRcIjtcclxuaW1wb3J0IERlc2NyaXB0aW9uIGZyb20gXCIuLi9hcGkvZGVzY3JpcHRpb25cIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlRoaW5nIGltcGxlbWVudHMgVGhpbmcge1xyXG5cclxuICAgIHByaXZhdGUgcHJvdG9jb2w6IFByb3RvY29sO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZGVzY3JpcHRpb246IERlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5wcm90b2NvbCA9IFByb3RvY29sLkhUVFA7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgc2V0UHJvdG9jb2wocHJvdG9jb2w6IFByb3RvY29sKSB7XHJcbiAgICAgICB0aGlzLnByb3RvY29sID0gcHJvdG9jb2w7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXIoZXZlbnQ6c3RyaW5nLCBldmVudExpc3RlbmVyOkV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrKTogVGhpbmcge1xyXG4gICAgICAgIGxldCBlID0gdGhpcy5kZXNjcmlwdGlvbi5nZXRFdmVudChldmVudCk7XHJcbiAgICAgICAgZS5zdWJzY3JpYmUoZXZlbnRMaXN0ZW5lciwgdGhpcy5wcm90b2NvbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbW92ZUxpc3RlbmVyKGV2ZW50OnN0cmluZywgZXZlbnRMaXN0ZW5lcjpFdmVudHMuTGlzdGVuZXJDYWxsYmFjayk6IFRoaW5nIHtcclxuICAgICAgICBsZXQgZSA9IHRoaXMuZGVzY3JpcHRpb24uZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIGUudW5zdWJzY3JpYmUoZXZlbnRMaXN0ZW5lciwgdGhpcy5wcm90b2NvbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50OiBzdHJpbmcpOiBUaGluZyB7XHJcbiAgICAgICAgbGV0IGUgPSB0aGlzLmRlc2NyaXB0aW9uLmdldEV2ZW50KGV2ZW50KTtcclxuICAgICAgICBlLnVuc3Vic2NyaWJlQWxsKHRoaXMucHJvdG9jb2wpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGludm9rZUFjdGlvbihhY3Rpb246c3RyaW5nLCBhY3Rpb25QYXJhbXM6YW55KSA6IFRyYWNrYWJsZVByb21pc2U8T2JqZWN0PiB7XHJcbiAgICAgICAgbGV0IGEgPSB0aGlzLmRlc2NyaXB0aW9uLmdldEFjdGlvbihhY3Rpb24pOyAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGEuaW52b2tlKGFjdGlvblBhcmFtcywgdGhpcy5wcm90b2NvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvcGVydHkocHJvcGVydHk6c3RyaW5nKSA6IFByb21pc2U8YW55PiB7ICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbi5nZXRQcm9wZXJ0eShwcm9wZXJ0eSkuZ2V0VmFsdWUodGhpcy5wcm90b2NvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJvcGVydHkocHJvcGVydHk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbi5nZXRQcm9wZXJ0eShwcm9wZXJ0eSkuc2V0VmFsdWUodmFsdWUsIHRoaXMucHJvdG9jb2wpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2NyaXB0aW9uKCk6T2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgIH1cclxufSIsImltcG9ydCBUaGluZ3MgZnJvbSBcIi4uL2FwaS93b3RcIjtcclxuaW1wb3J0IFRoaW5nIGZyb20gXCIuLi9hcGkvdGhpbmdcIlxyXG5pbXBvcnQgV2ViVGhpbmcgZnJvbSBcIi4vdGhpbmdcIjtcclxuaW1wb3J0IHtVcmlVdGlscywgU3RyaW5nVXRpbHN9IGZyb20gXCIuLi9jb21tb24vdXRpbHNcIjtcclxuaW1wb3J0IHtSZXNvbHZlcn0gZnJvbSBcIi4uL25ldC9yZXNvbHZlclwiO1xyXG5pbXBvcnQgVGhpbmdEZXNjcmlwdGlvbiBmcm9tIFwiLi9kZXNjcmlwdGlvblwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViT2ZUaGluZ3MgaW1wbGVtZW50cyBUaGluZ3Mge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRpc2NvdmVyeVVyaTogc3RyaW5nID0gXCJcIikge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE8gd2l0bGwgYmUgZGlmZmVyZW50IGluIHRoZSBmdXR1cmVcclxuICAgIGRpc2NvdmVyKHR5cGU6IHN0cmluZykgOiBQcm9taXNlPEFycmF5PFRoaW5nPj4geyAgICBcclxuICAgICAgICBpZihTdHJpbmdVdGlscy5pc0VtcHR5KHRoaXMuZGlzY292ZXJ5VXJpKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm8gZGlzY292ZXJ5IHVyaVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwcm90b2NvbCA9IFVyaVV0aWxzLmdldFByb3RvY29sRnJvbVVyaSh0aGlzLmRpc2NvdmVyeVVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc29sdmVyXHJcbiAgICAgICAgICAgIC5yZXNvbHZlKHByb3RvY29sKVxyXG4gICAgICAgICAgICAuZ2V0TGlua3ModGhpcy5kaXNjb3ZlcnlVcmkpXHJcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb21pc2VzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGxpbmsgb2YgcmVzcG9uc2UubGlua3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMuY29uc3VtZURlc2NyaXB0aW9uVXJpKGxpbmsuaHJlZikpO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN1bWVEZXNjcmlwdGlvbihkZXNjcmlwdGlvbjogYW55KSA6IFByb21pc2U8VGhpbmc+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBUaGluZ0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShuZXcgV2ViVGhpbmcoZCkpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3VtZURlc2NyaXB0aW9uVXJpKHVyaTogc3RyaW5nKSA6IFByb21pc2U8VGhpbmc+IHtcclxuICAgICAgICBsZXQgcHJvdG9jb2wgPSBVcmlVdGlscy5nZXRQcm90b2NvbEZyb21VcmkodGhpcy5kaXNjb3ZlcnlVcmkpO1xyXG5cclxuICAgICAgICByZXR1cm4gUmVzb2x2ZXJcclxuICAgICAgICAgICAgLnJlc29sdmUocHJvdG9jb2wpXHJcbiAgICAgICAgICAgIC5nZXRUaGluZyh1cmkpXHJcbiAgICAgICAgICAgIC50aGVuKChkZXNjcmlwdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGQgPSBuZXcgVGhpbmdEZXNjcmlwdGlvbihkZXNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgV2ViVGhpbmcoZCkpICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfSBcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL2VzNi1wcm9taXNlL2luZGV4LmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL2VzNi1jb2xsZWN0aW9ucy9pbmRleC5kLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy93aGF0d2ctZmV0Y2gvaW5kZXguZC50c1wiLz5cclxuXHJcbmltcG9ydCBCcm93c2VyUHJvdG9jb2xSZXNvbHZlciBmcm9tIFwiLi4vbmV0L2Jyb3dzZXIvcmVzb2x2ZXJcIjtcclxuaW1wb3J0IHsgUmVzb2x2ZXIgfSBmcm9tIFwiLi4vbmV0L3Jlc29sdmVyXCI7XHJcbmltcG9ydCBXZWJPZlRoaW5ncyBmcm9tIFwiLi4vaW1wbC93b3RcIlxyXG5cclxuUmVzb2x2ZXIucmVnaXN0ZXIobmV3IEJyb3dzZXJQcm90b2NvbFJlc29sdmVyKCkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IFdvdCA9IG5ldyBXZWJPZlRoaW5ncyhcImh0dHA6Ly90bm8yLm5ldDo4MDgwL2NvbmFzL2R0aC1lc3A4MjY2LTEvXCIpOyIsImltcG9ydCBDb25uZWN0b3IgZnJvbSBcIi4uL2Nvbm5lY3RvclwiO1xyXG5pbXBvcnQgTWVzc2FnZUhhbmRsZXIgZnJvbSBcIi4uL2hhbmRsZXJcIjtcclxuaW1wb3J0IFN1YnNjcmlwdGlvbiBmcm9tIFwiLi4vc3Vic2NyaXB0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENvbm5lY3RvciBpbXBsZW1lbnRzIENvbm5lY3RvciB7XHJcbiAgIFxyXG4gICAgc3Vic2NyaWJlKHVyaTogc3RyaW5nLCBoYW5kbGVyOiBNZXNzYWdlSGFuZGxlcikgOlN1YnNjcmlwdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9ICAgICAgIFxyXG4gICAgXHJcbiAgICBnZXRMaW5rcyh1cmk6IHN0cmluZykgOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoQ2FsbCh1cmkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRoaW5nKHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hDYWxsKHVyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvcGVydHkodXJpOiBzdHJpbmcpIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaENhbGwodXJpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQcm9wZXJ0eSh1cmk6IHN0cmluZywgZGF0YTogYW55KSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hDYWxsKHVyaSwgeyBcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV2ZW50VXJpKHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hDYWxsKHVyaSwgeyBcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmV0Y2hDYWxsKHVyaTogc3RyaW5nLCBkYXRhID0ge30pIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJpLCBkYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9wcm90b2NvbFwiO1xyXG5pbXBvcnQgQ29ubmVjdG9yIGZyb20gXCIuLi9jb25uZWN0b3JcIjtcclxuaW1wb3J0IHtXc0Nvbm5lY3Rvcn0gZnJvbSBcIi4vd3NcIjtcclxuaW1wb3J0IHtIdHRwQ29ubmVjdG9yfSBmcm9tIFwiLi9odHRwXCI7XHJcbmltcG9ydCB7UmVzb2x2ZXIsIFByb3RvY29sUmVzb2x2ZXJ9IGZyb20gXCIuLi9yZXNvbHZlclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJvd3NlclByb3RvY29sUmVzb2x2ZXIgaW1wbGVtZW50cyBQcm90b2NvbFJlc29sdmVyIHtcclxuXHJcbiAgICBwcml2YXRlIGNvbm5lY3RvcnM6IE1hcDxQcm90b2NvbCwgQ29ubmVjdG9yPjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0b3JzID0gbmV3IE1hcDxQcm90b2NvbCwgQ29ubmVjdG9yPigpO1xyXG4gICAgICAgIGxldCB3c0Nvbm5lY3RvciA9IG5ldyBXc0Nvbm5lY3RvcigpOyAgICAgICBcclxuICAgICAgICB0aGlzLmNvbm5lY3RvcnMuc2V0KFByb3RvY29sLldTLCB3c0Nvbm5lY3Rvcik7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0b3JzLnNldChQcm90b2NvbC5XU1MsIHdzQ29ubmVjdG9yKTtcclxuICAgICAgICBsZXQgaHR0cENvbm5lY3RvciA9IG5ldyBIdHRwQ29ubmVjdG9yKCk7ICAgICAgICBcclxuICAgICAgICB0aGlzLmNvbm5lY3RvcnMuc2V0KFByb3RvY29sLkhUVFAsIGh0dHBDb25uZWN0b3IpOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb25uZWN0b3JzLnNldChQcm90b2NvbC5IVFRQUywgaHR0cENvbm5lY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZShwcm90b2NvbDogUHJvdG9jb2wpOiBDb25uZWN0b3Ige1xyXG4gICAgICAgIGxldCBjb25uZWN0b3IgPSB0aGlzLmNvbm5lY3RvcnMuZ2V0KHByb3RvY29sKTsgXHJcbiAgICAgICAgaWYoY29ubmVjdG9yID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29ubmVjdG9yO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENvbm5lY3RvciBmcm9tIFwiLi4vY29ubmVjdG9yXCI7XHJcbmltcG9ydCBNZXNzYWdlSGFuZGxlciBmcm9tIFwiLi4vaGFuZGxlclwiO1xyXG5pbXBvcnQgU3Vic2NyaXB0aW9uIGZyb20gXCIuLi9zdWJzY3JpcHRpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXc0Nvbm5lY3RvciBpbXBsZW1lbnRzIENvbm5lY3RvciB7XHJcblxyXG4gICAgc3Vic2NyaWJlKHVyaTogc3RyaW5nLCBoYW5kbGVyOiBNZXNzYWdlSGFuZGxlcikgOlN1YnNjcmlwdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBXc1N1YnNjcmlwdGlvbih1cmksIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExpbmtzKHVyaTogc3RyaW5nKSA6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGhpbmcodXJpOiBzdHJpbmcpIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9wZXJ0eSh1cmk6IHN0cmluZykgOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFByb3BlcnR5KHVyaTogc3RyaW5nLCBkYXRhOiBhbnkpIDogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFdmVudFVyaSh1cmk6IHN0cmluZykgOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBXc1N1YnNjcmlwdGlvbiBpbXBsZW1lbnRzIFN1YnNjcmlwdGlvbiB7XHJcblxyXG4gICAgcHJpdmF0ZSB3czogV2ViU29ja2V0OyAgICBcclxuICAgIHByaXZhdGUgb3BlbjogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHVybDogc3RyaW5nLCBcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgaGFuZGxlcjogTWVzc2FnZUhhbmRsZXIpIHsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMud3MuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSB7ICAgIFxyXG4gICAgICAgIGxldCB3cyA9IG5ldyBXZWJTb2NrZXQodGhpcy51cmwpO1xyXG4gICAgICAgIHdzLm9ub3BlbiA9IHRoaXMuaGFuZGxlT3BlbjtcclxuICAgICAgICB3cy5vbmNsb3NlID0gdGhpcy5oYW5kbGVDbG9zZTtcclxuICAgICAgICB3cy5vbm1lc3NhZ2UgPSB0aGlzLmV4ZWN1dGVDYWxsYmFjaztcclxuICAgICAgICB0aGlzLndzID0gd3M7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgcHJpdmF0ZSBoYW5kbGVPcGVuID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMub3BlbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVDbG9zZT0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMub3BlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGV4ZWN1dGVDYWxsYmFjayA9IChtZXNzYWdlOiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLmhhbmRsZXIobWVzc2FnZS5kYXRhKTsgICAgICAgIFxyXG4gICAgfVxyXG59IiwiZW51bSBQcm90b2NvbCB7XHJcbiAgICBIVFRQLFxyXG4gICAgSFRUUFMsXHJcbiAgICBDT0FQLFxyXG4gICAgV1MsXHJcbiAgICBXU1NcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvdG9jb2w7IiwiaW1wb3J0IFByb3RvY29sIGZyb20gXCIuL3Byb3RvY29sXCI7XHJcbmltcG9ydCBDb25uZWN0b3IgZnJvbSBcIi4vY29ubmVjdG9yXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFByb3RvY29sUmVzb2x2ZXIge1xyXG4gICAgcmVzb2x2ZShwcm90b2NvbDogUHJvdG9jb2wpOiBDb25uZWN0b3I7XHJcbn1cclxuXHJcbmNsYXNzIERlZmF1bHRSZXNvbHZlciBpbXBsZW1lbnRzIFByb3RvY29sUmVzb2x2ZXIge1xyXG5cclxuICAgIHByaXZhdGUgcmVzb2x2ZXI6IFByb3RvY29sUmVzb2x2ZXI7XHJcblxyXG4gICAgcmVzb2x2ZShwcm90b2NvbDogUHJvdG9jb2wpIDogQ29ubmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlci5yZXNvbHZlKHByb3RvY29sKTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlcihyZXNvbHZlcjogUHJvdG9jb2xSZXNvbHZlcikge1xyXG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSByZXNvbHZlcjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFJlc29sdmVyID0gbmV3IERlZmF1bHRSZXNvbHZlcigpOyJdfQ==
