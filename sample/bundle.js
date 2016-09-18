(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tno = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_1 = require("./model");
var ThingAction = (function (_super) {
    __extends(ThingAction, _super);
    function ThingAction() {
        _super.apply(this, arguments);
    }
    ThingAction.prototype.invoke = function (params) {
        return null;
    };
    return ThingAction;
}(model_1["default"]));
exports.ThingAction = ThingAction;
},{"./model":4}],2:[function(require,module,exports){
"use strict";
var protocol_1 = require("../net/protocol");
var event_1 = require("./event");
var action_1 = require("./action");
var property_1 = require("./property");
var ThingDescription = (function () {
    function ThingDescription(description) {
        this.description = description;
        this.events = new Map();
        this.actions = new Map();
        this.properties = new Map();
        this.parse("events", "name", this.events, event_1.ThingEvent);
        this.parse("actions", "name", this.actions, action_1.ThingAction);
        this.parse("properties", "name", this.properties, property_1.ThingProperty);
        this.uris = this.getUrisMap(description.uris);
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
    ThingDescription.prototype.getUrisMap = function (hrefs) {
        var result = new Map();
        if (!hrefs) {
            return result;
        }
        for (var _i = 0, hrefs_1 = hrefs; _i < hrefs_1.length; _i++) {
            var href = hrefs_1[_i];
            var splitHref = href.split(":");
            console.log(splitHref);
            if (splitHref.length < 2) {
                continue;
            }
            var protocolStr = splitHref[0];
            for (var p in protocol_1["default"]) {
                if (p.toLowerCase() == protocolStr.toLowerCase()) {
                    var protocol = protocol_1["default"][p];
                    result.set(protocol_1["default"][protocol + ""], href);
                    break;
                }
            }
        }
        return result;
    };
    return ThingDescription;
}());
exports.__esModule = true;
exports["default"] = ThingDescription;
},{"../net/protocol":8,"./action":1,"./event":3,"./property":5}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var resolver_1 = require("../net/resolver");
var model_1 = require("./model");
var ThingEvent = (function (_super) {
    __extends(ThingEvent, _super);
    function ThingEvent() {
        _super.apply(this, arguments);
        this.callbacks = new Set();
        this.subscriptions = new Map();
    }
    ThingEvent.prototype.subscribe = function (listenerCallback, protocol) {
        this.callbacks.add(listenerCallback);
        if (this.subscriptions.has(protocol)) {
            resolver_1.Resolver.resolve(protocol).subscribe("", this.handler);
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
        }
    };
    ThingEvent.prototype.handler = function (message) {
        this.callbacks.forEach(function (value, callback) {
            callback(message);
        });
    };
    return ThingEvent;
}(model_1["default"]));
exports.ThingEvent = ThingEvent;
},{"../net/resolver":9,"./model":4}],4:[function(require,module,exports){
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
        return null;
    };
    return ThingModel;
}());
exports.__esModule = true;
exports["default"] = ThingModel;
},{}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_1 = require("./model");
var ThingProperty = (function (_super) {
    __extends(ThingProperty, _super);
    function ThingProperty() {
        _super.apply(this, arguments);
    }
    ThingProperty.prototype.getValue = function () {
        return new Promise(function (resolve, reject) {
        });
    };
    ThingProperty.prototype.setValue = function (value) {
        return new Promise(function (resolve, reject) {
        });
    };
    return ThingProperty;
}(model_1["default"]));
exports.ThingProperty = ThingProperty;
},{"./model":4}],6:[function(require,module,exports){
"use strict";
var WebThing = (function () {
    function WebThing(description) {
        this.description = description;
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
        return a.invoke(actionParams);
    };
    WebThing.prototype.getProperty = function (property) {
        return this.description.getProperty(property).getValue();
    };
    WebThing.prototype.setProperty = function (property, value) {
        return this.description.getProperty(property).setValue(value);
    };
    WebThing.prototype.getDescription = function () {
        return this.description;
    };
    return WebThing;
}());
exports.__esModule = true;
exports["default"] = WebThing;
},{}],7:[function(require,module,exports){
/// <reference path="../../node_modules/@types/es6-promise/index.d.ts"/>
/// <reference path="../../node_modules/@types/es6-collections/index.d.ts"/>
/// <reference path="../../node_modules/@types/whatwg-fetch/index.d.ts"/>
"use strict";
var thing_1 = require("./thing");
var description_1 = require("./description");
var WebOfThings = (function () {
    function WebOfThings() {
    }
    WebOfThings.prototype.discover = function (type) {
        return null;
    };
    WebOfThings.prototype.consumeDescription = function (description) {
        return new Promise(function (resolve, reject) {
            var d = new description_1["default"](description);
            resolve(new thing_1["default"](d));
        });
    };
    WebOfThings.prototype.consumeDescriptionUri = function (uri) {
        return fetch(uri).then(function (result) {
            return result.json();
        }).then(function (description) {
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
},{"./description":2,"./thing":6}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
"use strict";
var protocol_1 = require("./protocol");
var ws_1 = require("./ws");
var ProtocolResolver = (function () {
    function ProtocolResolver() {
        this.connectors = new Map();
        var wsConnector = new ws_1.WsConnector();
        this.connectors.set(protocol_1["default"].WS, wsConnector);
        this.connectors.set(protocol_1["default"].WSS, wsConnector);
    }
    ProtocolResolver.prototype.resolve = function (protocol) {
        var connector = this.connectors.get(protocol);
        if (connector == null) {
            throw new TypeError();
        }
        return connector;
    };
    return ProtocolResolver;
}());
exports.Resolver = new ProtocolResolver();
},{"./protocol":8,"./ws":10}],10:[function(require,module,exports){
"use strict";
var WsConnector = (function () {
    function WsConnector() {
    }
    WsConnector.prototype.subscribe = function (url, handler) {
        return new WsSubscription(url, handler);
    };
    return WsConnector;
}());
exports.WsConnector = WsConnector;
var WsSubscription = (function () {
    function WsSubscription(url, handler) {
        this.url = url;
        this.handler = handler;
        this.init();
    }
    WsSubscription.prototype.close = function () {
        this.ws.close();
    };
    WsSubscription.prototype.init = function () {
        var ws = new WebSocket(this.url);
        ws.onopen = this.handleOpen;
        ws.onclose = this.handleClose;
        ws.onmessage = this.handleOpen;
        this.ws = ws;
    };
    WsSubscription.prototype.handleOpen = function () {
        this.open = true;
    };
    WsSubscription.prototype.handleClose = function () {
        this.open = false;
    };
    WsSubscription.prototype.executeCallback = function (message) {
        this.handler(message);
    };
    return WsSubscription;
}());
},{}],11:[function(require,module,exports){
"use strict";
var wot_1 = require("../impl/wot");
exports.Wot = new wot_1["default"]();
},{"../impl/wot":7}]},{},[11])(11)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbXBsL2FjdGlvbi50cyIsImltcGwvZGVzY3JpcHRpb24udHMiLCJpbXBsL2V2ZW50LnRzIiwiaW1wbC9tb2RlbC50cyIsImltcGwvcHJvcGVydHkudHMiLCJpbXBsL3RoaW5nLnRzIiwiaW1wbC93b3QudHMiLCJuZXQvcHJvdG9jb2wudHMiLCJuZXQvcmVzb2x2ZXIudHMiLCJuZXQvd3MudHMiLCJ3b3QvbGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQ0Esc0JBQXVCLFNBQVMsQ0FBQyxDQUFBO0FBR2pDO0lBQWlDLCtCQUFVO0lBQTNDO1FBQWlDLDhCQUFVO0lBSzNDLENBQUM7SUFIRyw0QkFBTSxHQUFOLFVBQU8sTUFBVTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FMQSxBQUtDLENBTGdDLGtCQUFVLEdBSzFDO0FBTFksbUJBQVcsY0FLdkIsQ0FBQTs7O0FDUkQseUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFLdkMsc0JBQXlCLFNBQVMsQ0FBQyxDQUFBO0FBQ25DLHVCQUEwQixVQUFVLENBQUMsQ0FBQTtBQUNyQyx5QkFBNEIsWUFBWSxDQUFDLENBQUE7QUFFekM7SUFRSSwwQkFBb0IsV0FBZ0I7UUFBaEIsZ0JBQVcsR0FBWCxXQUFXLENBQUs7UUFONUIsV0FBTSxHQUF1QixJQUFJLEdBQUcsRUFBaUIsQ0FBQztRQUN0RCxZQUFPLEdBQXdCLElBQUksR0FBRyxFQUFrQixDQUFDO1FBQ3pELGVBQVUsR0FBMEIsSUFBSSxHQUFHLEVBQW9CLENBQUM7UUFLcEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsa0JBQVUsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLENB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R0FBTDtRQUNJLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVPLDZCQUFJLEdBQVo7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUM5QixFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDL0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUdPLG1DQUFVLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVPLG9DQUFXLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVPLHdDQUFlLEdBQXZCLFVBQXdCLE9BQVk7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQWxDQSxBQWtDQyxJQUFBOzs7QUM3Q0Qsb0JBQXdCLGFBRXhCLENBQUMsQ0FGb0M7QUFFeEIsV0FBRyxHQUFHLElBQUksZ0JBQVcsRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FwaS9hY3Rpb25cIjtcclxuaW1wb3J0IFRoaW5nTW9kZWwgZnJvbSBcIi4vbW9kZWxcIjtcclxuaW1wb3J0IHtUcmFja2FibGVQcm9taXNlfSBmcm9tIFwiLi4vYXBpL3Byb21pc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaGluZ0FjdGlvbiBleHRlbmRzIFRoaW5nTW9kZWwgaW1wbGVtZW50cyBBY3Rpb24ge1xyXG4gICAgXHJcbiAgICBpbnZva2UocGFyYW1zOmFueSk6IFRyYWNrYWJsZVByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IERlc2NyaXB0aW9uIGZyb20gXCIuLi9hcGkvZGVzY3JpcHRpb25cIjtcclxuaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9uZXQvcHJvdG9jb2xcIjtcclxuaW1wb3J0IE1vZGVsIGZyb20gXCIuLi9hcGkvTW9kZWxcIjtcclxuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYXBpL2FjdGlvblwiO1xyXG5pbXBvcnQgRXZlbnRzIGZyb20gXCIuLi9hcGkvZXZlbnRcIjtcclxuaW1wb3J0IFByb3BlcnR5IGZyb20gXCIuLi9hcGkvcHJvcGVydHlcIjtcclxuaW1wb3J0IHtUaGluZ0V2ZW50fSBmcm9tIFwiLi9ldmVudFwiO1xyXG5pbXBvcnQge1RoaW5nQWN0aW9ufSBmcm9tIFwiLi9hY3Rpb25cIjtcclxuaW1wb3J0IHtUaGluZ1Byb3BlcnR5fSBmcm9tIFwiLi9wcm9wZXJ0eVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhpbmdEZXNjcmlwdGlvbiBpbXBsZW1lbnRzIERlc2NyaXB0aW9uIHtcclxuXHJcbiAgICBwcml2YXRlIGV2ZW50czogTWFwPHN0cmluZywgRXZlbnQ+ID0gbmV3IE1hcDxzdHJpbmcsIEV2ZW50PigpO1xyXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBNYXA8c3RyaW5nLCBBY3Rpb24+ID0gbmV3IE1hcDxzdHJpbmcsIEFjdGlvbj4oKTtcclxuICAgIHByaXZhdGUgcHJvcGVydGllczogTWFwPHN0cmluZywgUHJvcGVydHk+ID0gbmV3IE1hcDxzdHJpbmcsIFByb3BlcnR5PigpO1xyXG5cclxuICAgIHByaXZhdGUgdXJpczpNYXA8UHJvdG9jb2wsIHN0cmluZz47XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBkZXNjcmlwdGlvbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZShcImV2ZW50c1wiLCBcIm5hbWVcIiwgdGhpcy5ldmVudHMsIFRoaW5nRXZlbnQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMucGFyc2UoXCJhY3Rpb25zXCIsIFwibmFtZVwiLCB0aGlzLmFjdGlvbnMsIFRoaW5nQWN0aW9uKTsgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnBhcnNlKFwicHJvcGVydGllc1wiLCBcIm5hbWVcIiwgdGhpcy5wcm9wZXJ0aWVzLCBUaGluZ1Byb3BlcnR5KTtcclxuICAgICAgICB0aGlzLnVyaXMgPSB0aGlzLmdldFVyaXNNYXAoZGVzY3JpcHRpb24udXJpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXZlbnQoZXZlbnQ6c3RyaW5nKTpFdmVudHMuRXZlbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChcImV2ZW50c1wiLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWN0aW9uKGFjdGlvbjpzdHJpbmcpOkFjdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwiYWN0aW9uc1wiLCBhY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByb3BlcnR5KHByb3BlcnR5OnN0cmluZyk6UHJvcGVydHkgeyAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwicHJvcGVydGllc1wiLCBwcm9wZXJ0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmF3RGVzY3JpcHRpb24oKTpPYmplY3Qge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0KG1hcCwgbmFtZSk6YW55IHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzW21hcF0uZ2V0KG5hbWUpO1xyXG4gICAgICAgIGlmKHZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlPFY+KHByb3BlcnR5OiBzdHJpbmcsIGtleVByb3BlcnR5OiBzdHJpbmcsIG1hcDogYW55LCBvYmo6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMuZGVzY3JpcHRpb25bcHJvcGVydHldO1xyXG4gICAgICAgIGlmKHByb3BzKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgcCBvZiBwcm9wcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluc3RhbmNlID0gbmV3IG9iaihwKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXRpYWxpemUocCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBtYXAuc2V0KHBba2V5UHJvcGVydHldLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0VXJpc01hcChocmVmczogQXJyYXk8c3RyaW5nPik6IE1hcDxQcm90b2NvbCwgc3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXA8UHJvdG9jb2wsIHN0cmluZz4oKTtcclxuICAgICAgICBpZighaHJlZnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcihsZXQgaHJlZiBvZiBocmVmcykge1xyXG4gICAgICAgICAgICBsZXQgc3BsaXRIcmVmID0gaHJlZi5zcGxpdChcIjpcIik7IGNvbnNvbGUubG9nKHNwbGl0SHJlZik7XHJcbiAgICAgICAgICAgIGlmKHNwbGl0SHJlZi5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBwcm90b2NvbFN0ciA9IHNwbGl0SHJlZlswXTsgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IobGV0IHAgaW4gUHJvdG9jb2wpIHtcclxuICAgICAgICAgICAgICAgIGlmKHAudG9Mb3dlckNhc2UoKSA9PSBwcm90b2NvbFN0ci50b0xvd2VyQ2FzZSgpKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm90b2NvbCA9IFByb3RvY29sW3BdICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNldChQcm90b2NvbFtwcm90b2NvbCArIFwiXCJdLCBocmVmKTsgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgRXZlbnRzIGZyb20gXCIuLi9hcGkvZXZlbnRcIjtcclxuaW1wb3J0IFByb3RvY29sIGZyb20gXCIuLi9uZXQvcHJvdG9jb2xcIjtcclxuaW1wb3J0IFN1YnNjcmlwdGlvbiBmcm9tIFwiLi4vbmV0L3N1YnNjcmlwdGlvblwiO1xyXG5pbXBvcnQge1Jlc29sdmVyfSBmcm9tIFwiLi4vbmV0L3Jlc29sdmVyXCI7XHJcbmltcG9ydCBUaGluZ01vZGVsIGZyb20gXCIuL21vZGVsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhpbmdFdmVudCBleHRlbmRzIFRoaW5nTW9kZWwgaW1wbGVtZW50cyBFdmVudHMuRXZlbnQge1xyXG5cclxuICAgIHByaXZhdGUgY2FsbGJhY2tzOiBTZXQ8RXZlbnRzLkxpc3RlbmVyQ2FsbGJhY2s+ID0gXHJcbiAgICAgICAgICAgICAgICBuZXcgU2V0PEV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrPigpOyAgICAgICAgICAgICAgICBcclxuICAgXHJcbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IE1hcDxQcm90b2NvbCwgU3Vic2NyaXB0aW9uPiA9XHJcbiAgICAgICAgICAgICAgICBuZXcgTWFwPFByb3RvY29sLCBTdWJzY3JpcHRpb24+KCk7XHJcblxyXG4gICAgc3Vic2NyaWJlKGxpc3RlbmVyQ2FsbGJhY2sgOkV2ZW50cy5MaXN0ZW5lckNhbGxiYWNrLCBwcm90b2NvbDpQcm90b2NvbCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFja3MuYWRkKGxpc3RlbmVyQ2FsbGJhY2spO1xyXG5cclxuICAgICAgICBpZiggdGhpcy5zdWJzY3JpcHRpb25zLmhhcyhwcm90b2NvbCkpIHtcclxuICAgICAgICAgICAgUmVzb2x2ZXIucmVzb2x2ZShwcm90b2NvbCkuc3Vic2NyaWJlKFwiXCIsIHRoaXMuaGFuZGxlcik7XHJcbiAgICAgICAgfSBcclxuICAgIH1cclxuXHJcbiAgICB1bnN1YnNjcmliZShsaXN0ZW5lckNhbGxiYWNrIDpFdmVudHMuTGlzdGVuZXJDYWxsYmFjaywgcHJvdG9jb2w6UHJvdG9jb2wpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLmRlbGV0ZShsaXN0ZW5lckNhbGxiYWNrKTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLmNhbGxiYWNrcy5zaXplICE9IDApIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9ICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLmZpbmRBbmRDbG9zZShwcm90b2NvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zdWJzY3JpYmVBbGwocHJvdG9jb2w6UHJvdG9jb2wpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gbmV3IFNldDxFdmVudHMuTGlzdGVuZXJDYWxsYmFjaz4oKTsgICAgICBcclxuICAgICAgICB0aGlzLmZpbmRBbmRDbG9zZShwcm90b2NvbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaW5kQW5kQ2xvc2UocHJvdG9jb2w6UHJvdG9jb2wpIHtcclxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpcHRpb25zLmdldChwcm90b2NvbCk7ICAgICAgICBcclxuICAgICAgICBpZihzdWJzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmNsb3NlKCk7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlcihtZXNzYWdlOiBhbnkpIHtcclxuICAgICAgIHRoaXMuY2FsbGJhY2tzLmZvckVhY2goKHZhbHVlOiBhbnksIGNhbGxiYWNrOiBFdmVudHMuTGlzdGVuZXJDYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhtZXNzYWdlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCBNb2RlbCBmcm9tIFwiLi4vYXBpL21vZGVsXCI7XHJcbmltcG9ydCBEZXNjcmlwdGlvbiBmcm9tIFwiLi4vYXBpL2Rlc2NyaXB0aW9uXCI7XHJcbmltcG9ydCBQcm90b2NvbCBmcm9tIFwiLi4vbmV0L1Byb3RvY29sXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBUaGluZ01vZGVsIGltcGxlbWVudHMgTW9kZWwge1xyXG5cclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdHlwZTogYW55O1xyXG4gICAgcHVibGljIGhyZWZzOiBBcnJheTxzdHJpbmc+OyAgIFxyXG4gICAgcHJpdmF0ZSBkZXNjcmlwdGlvbjogRGVzY3JpcHRpb247XHJcbiAgICBwdWJsaWMgdXJpczogTWFwPFByb3RvY29sLCBzdHJpbmc+O1xyXG5cclxuICAgIGluaXRpYWxpemUobW9kZWw6IGFueSwgZGVzY3JpcHRpb246IERlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICB0aGlzLnR5cGUgPSBtb2RlbFtcIkB0eXBlXCJdO1xyXG4gICAgICAgIHRoaXMuaHJlZnMgPSBtb2RlbC5ocmVmcztcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB9XHJcbiAgXHJcbiAgICBnZXRVcmlCeVByb3RvY29sKHByb3RvY29sOiBQcm90b2NvbCkgOnN0cmluZyB7ICAgICAgIFxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUaGluZ01vZGVsO1xyXG4iLCJpbXBvcnQgUHJvcGVydHkgZnJvbSBcIi4uL2FwaS9wcm9wZXJ0eVwiO1xyXG5pbXBvcnQgVGhpbmdNb2RlbCBmcm9tIFwiLi9tb2RlbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRoaW5nUHJvcGVydHkgZXh0ZW5kcyBUaGluZ01vZGVsIGltcGxlbWVudHMgUHJvcGVydHkge1xyXG4gXHJcblxyXG4gICAgZ2V0VmFsdWUoKTogUHJvbWlzZTxhbnk+IHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VmFsdWUodmFsdWU6IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgVGhpbmcgZnJvbSBcIi4uL2FwaS90aGluZ1wiO1xyXG5pbXBvcnQgUHJvdG9jb2wgZnJvbSBcIi4uL25ldC9wcm90b2NvbFwiXHJcbmltcG9ydCB7VHJhY2thYmxlUHJvbWlzZX0gZnJvbSBcIi4uL2FwaS9wcm9taXNlXCI7XHJcbmltcG9ydCBFdmVudHMgZnJvbSBcIi4uL2FwaS9ldmVudFwiO1xyXG5pbXBvcnQgRGVzY3JpcHRpb24gZnJvbSBcIi4uL2FwaS9kZXNjcmlwdGlvblwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViVGhpbmcgaW1wbGVtZW50cyBUaGluZyB7XHJcblxyXG4gICAgcHJpdmF0ZSBwcm90b2NvbDogUHJvdG9jb2w7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBkZXNjcmlwdGlvbjogRGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgfVxyXG4gICBcclxuICAgIHNldFByb3RvY29sKHByb3RvY29sOiBQcm90b2NvbCkge1xyXG4gICAgICAgdGhpcy5wcm90b2NvbCA9IHByb3RvY29sO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3RlbmVyKGV2ZW50OnN0cmluZywgZXZlbnRMaXN0ZW5lcjpFdmVudHMuTGlzdGVuZXJDYWxsYmFjayk6IFRoaW5nIHtcclxuICAgICAgICBsZXQgZSA9IHRoaXMuZGVzY3JpcHRpb24uZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIGUuc3Vic2NyaWJlKGV2ZW50TGlzdGVuZXIsIHRoaXMucHJvdG9jb2wpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW1vdmVMaXN0ZW5lcihldmVudDpzdHJpbmcsIGV2ZW50TGlzdGVuZXI6RXZlbnRzLkxpc3RlbmVyQ2FsbGJhY2spOiBUaGluZyB7XHJcbiAgICAgICAgbGV0IGUgPSB0aGlzLmRlc2NyaXB0aW9uLmdldEV2ZW50KGV2ZW50KTtcclxuICAgICAgICBlLnVuc3Vic2NyaWJlKGV2ZW50TGlzdGVuZXIsIHRoaXMucHJvdG9jb2wpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQ6IHN0cmluZyk6IFRoaW5nIHtcclxuICAgICAgICBsZXQgZSA9IHRoaXMuZGVzY3JpcHRpb24uZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIGUudW5zdWJzY3JpYmVBbGwodGhpcy5wcm90b2NvbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW52b2tlQWN0aW9uKGFjdGlvbjpzdHJpbmcsIGFjdGlvblBhcmFtczphbnkpOlRyYWNrYWJsZVByb21pc2U8T2JqZWN0PiB7XHJcbiAgICAgICAgbGV0IGEgPSB0aGlzLmRlc2NyaXB0aW9uLmdldEFjdGlvbihhY3Rpb24pOyAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGEuaW52b2tlKGFjdGlvblBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvcGVydHkocHJvcGVydHk6c3RyaW5nKTpQcm9taXNlPGFueT4geyAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24uZ2V0UHJvcGVydHkocHJvcGVydHkpLmdldFZhbHVlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJvcGVydHkocHJvcGVydHk6c3RyaW5nLCB2YWx1ZTphbnkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbi5nZXRQcm9wZXJ0eShwcm9wZXJ0eSkuc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2NyaXB0aW9uKCk6T2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbjtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL2VzNi1wcm9taXNlL2luZGV4LmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL2VzNi1jb2xsZWN0aW9ucy9pbmRleC5kLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy93aGF0d2ctZmV0Y2gvaW5kZXguZC50c1wiLz5cclxuXHJcbmltcG9ydCBUaGluZ3MgZnJvbSBcIi4uL2FwaS93b3RcIjtcclxuaW1wb3J0IFRoaW5nIGZyb20gXCIuLi9hcGkvdGhpbmdcIlxyXG5pbXBvcnQgV2ViVGhpbmcgZnJvbSBcIi4vdGhpbmdcIjtcclxuaW1wb3J0IFRoaW5nRGVzY3JpcHRpb24gZnJvbSBcIi4vZGVzY3JpcHRpb25cIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYk9mVGhpbmdzIGltcGxlbWVudHMgVGhpbmdzIHtcclxuXHJcbiAgICBkaXNjb3Zlcih0eXBlOiBzdHJpbmcpOiBQcm9taXNlPEFycmF5PFRoaW5nPj4ge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN1bWVEZXNjcmlwdGlvbihkZXNjcmlwdGlvbjogYW55KTogUHJvbWlzZTxUaGluZz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkID0gbmV3IFRoaW5nRGVzY3JpcHRpb24oZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICByZXNvbHZlKG5ldyBXZWJUaGluZyhkKSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdW1lRGVzY3JpcHRpb25VcmkodXJpOiBzdHJpbmcpOiBQcm9taXNlPFRoaW5nPiB7ICAgICAgICBcclxuICAgICAgICByZXR1cm4gZmV0Y2godXJpKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgfSkudGhlbigoZGVzY3JpcHRpb24pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZCA9IG5ldyBUaGluZ0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFdlYlRoaW5nKGQpKSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfSBcclxufSIsImVudW0gUHJvdG9jb2wge1xyXG4gICAgSFRUUCxcclxuICAgIEhUVFBTLFxyXG4gICAgQ09BUCxcclxuICAgIFdTLFxyXG4gICAgV1NTXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb3RvY29sOyIsImltcG9ydCBQcm90b2NvbCBmcm9tIFwiLi9wcm90b2NvbFwiO1xyXG5pbXBvcnQgQ29ubmVjdG9yIGZyb20gXCIuL2Nvbm5lY3RvclwiO1xyXG5pbXBvcnQge1dzQ29ubmVjdG9yfSBmcm9tIFwiLi93c1wiO1xyXG5cclxuY2xhc3MgUHJvdG9jb2xSZXNvbHZlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBjb25uZWN0b3JzOiBNYXA8UHJvdG9jb2wsIENvbm5lY3Rvcj47XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdG9ycyA9IG5ldyBNYXA8UHJvdG9jb2wsIENvbm5lY3Rvcj4oKTtcclxuICAgICAgICBsZXQgd3NDb25uZWN0b3IgPSBuZXcgV3NDb25uZWN0b3IoKTsgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb25uZWN0b3JzLnNldChQcm90b2NvbC5XUywgd3NDb25uZWN0b3IpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdG9ycy5zZXQoUHJvdG9jb2wuV1NTLCB3c0Nvbm5lY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZShwcm90b2NvbDogUHJvdG9jb2wpOiBDb25uZWN0b3Ige1xyXG4gICAgICAgIGxldCBjb25uZWN0b3IgPSB0aGlzLmNvbm5lY3RvcnMuZ2V0KHByb3RvY29sKTsgXHJcbiAgICAgICAgaWYoY29ubmVjdG9yID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29ubmVjdG9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgUmVzb2x2ZXIgPSBuZXcgUHJvdG9jb2xSZXNvbHZlcigpOyAiLCJpbXBvcnQgQ29ubmVjdG9yIGZyb20gXCIuL2Nvbm5lY3RvclwiO1xyXG5pbXBvcnQgTWVzc2FnZUhhbmRsZXIgZnJvbSBcIi4vaGFuZGxlclwiO1xyXG5pbXBvcnQgU3Vic2NyaXB0aW9uIGZyb20gXCIuL3N1YnNjcmlwdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdzQ29ubmVjdG9yIGltcGxlbWVudHMgQ29ubmVjdG9yIHtcclxuICAgXHJcbiAgICBzdWJzY3JpYmUodXJsOiBzdHJpbmcsIGhhbmRsZXI6IE1lc3NhZ2VIYW5kbGVyKSA6U3Vic2NyaXB0aW9uIHtcclxuICAgICAgICByZXR1cm4gbmV3IFdzU3Vic2NyaXB0aW9uKHVybCwgaGFuZGxlcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFdzU3Vic2NyaXB0aW9uIGltcGxlbWVudHMgU3Vic2NyaXB0aW9uIHtcclxuXHJcbiAgICBwcml2YXRlIHdzOiBXZWJTb2NrZXQ7ICAgIFxyXG4gICAgcHJpdmF0ZSBvcGVuOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdXJsOiBzdHJpbmcsIFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBoYW5kbGVyOiBNZXNzYWdlSGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMud3MuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSB7ICAgIFxyXG4gICAgICAgIGxldCB3cyA9IG5ldyBXZWJTb2NrZXQodGhpcy51cmwpO1xyXG4gICAgICAgIHdzLm9ub3BlbiA9IHRoaXMuaGFuZGxlT3BlbjtcclxuICAgICAgICB3cy5vbmNsb3NlID0gdGhpcy5oYW5kbGVDbG9zZTtcclxuICAgICAgICB3cy5vbm1lc3NhZ2UgPSB0aGlzLmhhbmRsZU9wZW47XHJcbiAgICAgICAgdGhpcy53cyA9IHdzO1xyXG4gICAgfVxyXG4gXHJcbiAgXHJcbiAgICBwcml2YXRlIGhhbmRsZU9wZW4oKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZUNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMub3BlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGV4ZWN1dGVDYWxsYmFjayhtZXNzYWdlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZXIobWVzc2FnZSk7ICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCBXZWJPZlRoaW5ncyBmcm9tIFwiLi4vaW1wbC93b3RcIlxyXG5cclxuZXhwb3J0IGNvbnN0IFdvdCA9IG5ldyBXZWJPZlRoaW5ncygpOyJdfQ==
