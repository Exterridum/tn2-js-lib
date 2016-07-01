"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datasource = function () {
    function Datasource() {
        _classCallCheck(this, Datasource);
    }

    _createClass(Datasource, [{
        key: "constructur",
        value: function constructur(connection) {
            this._connection = connection;
        }
    }, {
        key: "getModel",
        value: function getModel() {}
    }, {
        key: "getProperties",
        value: function getProperties() {}
    }, {
        key: "getActions",
        value: function getActions() {}
    }, {
        key: "publish",
        value: function publish(endpoint, value) {}
    }, {
        key: "subscribe",
        value: function subscribe(endpoint) {}
    }]);

    return Datasource;
}();

var QuirkDatasource = exports.QuirkDatasource = function (_Datasource) {
    _inherits(QuirkDatasource, _Datasource);

    function QuirkDatasource() {
        _classCallCheck(this, QuirkDatasource);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(QuirkDatasource).apply(this, arguments));
    }

    return QuirkDatasource;
}(Datasource);

var StrictDatasource = exports.StrictDatasource = function (_Datasource2) {
    _inherits(StrictDatasource, _Datasource2);

    function StrictDatasource() {
        _classCallCheck(this, StrictDatasource);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StrictDatasource).apply(this, arguments));
    }

    return StrictDatasource;
}(Datasource);
"use strict";

Object.defineProperty(exports, "__esModule", {
                          value: true
});
var HTTP_PROTOCOL = exports.HTTP_PROTOCOL = "http";
var HTTPS_PROTOCOL = exports.HTTPS_PROTOCOL = "https";
var WS_PROTOCOL = exports.WS_PROTOCOL = "ws";
var WSS_PROTOCOL = exports.WSS_PROTOCOL = "wss";
var MQTT_PROTOCL = exports.MQTT_PROTOCL = "mqtt";

var PROTOCOLS = exports.PROTOCOLS = [HTTP_PROTOCOL, HTTPS_PROTOCOL, WS_PROTOCOL, WSS_PROTOCOL, MQTT_PROTOCL];

var STRICT_MODE = exports.STRICT_MODE = Symbol("strict");
var QUIRK_MODE = exports.QUIRK_MODE = Symbol("quirk");
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommonUtils = exports.CommonUtils = function () {
    function CommonUtils() {
        _classCallCheck(this, CommonUtils);
    }

    _createClass(CommonUtils, null, [{
        key: "processUrl",
        value: function processUrl(url, params) {
            for (param in params) {
                url = url.replace("{" + param + "}", params[value]);
            }
            return url;
        }
    }]);

    return CommonUtils;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wot = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _consts = require("consts");

var consts = _interopRequireWildcard(_consts);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function parseUrl(urlStr) {
    if (!(url instanceof String)) {
        throw new Error("Invalid Url type");
    }

    var splitUrl = urlStr.split(":");
    if (splitUrl.length == 0 && splitUrl.length > 2) {
        throw new Error("Invalid Url structure");
    }

    var protocol = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = consts.PROTOCOLS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            if (p === splitUrl[0]) {
                protocol = p;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    if (!protocol) {
        throw new Error("Invalid protocol in Url: " + splitUrl[0]);
    }

    return {
        protocol: protocol,
        url: splitUrl[1]
    };
}

var wot = exports.wot = {
    newInstance: function newInstance(urlStr, mode) {
        var _parseUrl = parseUrl(urlStr);

        var _parseUrl2 = _slicedToArray(_parseUrl, 2);

        var url = _parseUrl2[0];
        var protocol = _parseUrl2[1];


        switch (mode) {
            case consts.STRICT_MODE:
                return new StrictDatasource(url, protocol);
            case consts.QUIRK_MODE:
                return new QuirkDatasource(url, protocol);
            default:
                throw new Error("Invalid mode specified: " + mode);
        }
    }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Connector = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Connector = exports.Connector = function () {
    function Connector(url, protocol) {
        _classCallCheck(this, Connector);

        this._url = url;
        this._protocol = protocol;
    }

    _createClass(Connector, [{
        key: '_assembleUrl',
        value: function _assembleUrl(uri) {
            return this._url + uri;
        }
    }, {
        key: '_assembleAndProcess',
        value: function _assembleAndProcess(uri, params) {
            _utils2.default.processUrl(this._assembleUrl(uri), params);
        }
    }]);

    return Connector;
}();
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HttpRestConnector = exports.SocketRestConnector = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _connector = require('connector');

var _connector2 = _interopRequireDefault(_connector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var restResources = getRestResources();

var BaseRestConnector = function (_Connector) {
    _inherits(BaseRestConnector, _Connector);

    function BaseRestConnector(url, protocol) {
        _classCallCheck(this, BaseRestConnector);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BaseRestConnector).call(this, url, protocol));
    }

    _createClass(BaseRestConnector, [{
        key: 'getModel',
        value: function getModel() {
            return this._getResource("model");
        }
    }, {
        key: 'getProperties',
        value: function getProperties() {
            return this._getResource("properties");
        }
    }, {
        key: 'getProperty',
        value: function getProperty(property) {
            return this._getResource("property", { id: property });
        }
    }, {
        key: 'setProperty',
        value: function setProperty(property, values) {
            return fetch(this._assembleAndProcess("property", { id: property }), {
                method: "PUT",
                body: JSON.stringify(values)
            }).then(function (response) {
                return response.json();
            });
        }
    }, {
        key: 'getActions',
        value: function getActions() {
            return this._getResource("actions");
        }
    }, {
        key: 'getAction',
        value: function getAction(action) {
            return this._getResource("action", { id: action });
        }
    }, {
        key: 'executeAction',
        value: function executeAction(action) {
            var actionData = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            return fetch(this._assembleAndProcess("executeAction", { id: action }), {
                method: "POST",
                body: JSON.stringify(actionData)
            }).then(function (response) {
                return response.json();
            });
        }
    }, {
        key: 'getActionExecutionStatus',
        value: function getActionExecutionStatus(action, actionId) {
            return fetch(this._assembleAndProcess("action", { id: action, actionId: actionId })).then(function (response) {
                return response.json();
            });
        }
    }, {
        key: '_getResource',
        value: function _getResource(resourceName, params) {
            return fetch(this._assembleAndProcess(restResources.get(resourceName), params)).then(function (response) {
                return response.json();
            });
        }
    }]);

    return BaseRestConnector;
}(_connector2.default);

var SocketRestConnector = exports.SocketRestConnector = function (_BaseRestConnector) {
    _inherits(SocketRestConnector, _BaseRestConnector);

    function SocketRestConnector(url, ws) {
        _classCallCheck(this, SocketRestConnector);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SocketRestConnector).call(this, url));

        _this2._ws = ws;
        return _this2;
    }

    _createClass(SocketRestConnector, [{
        key: 'subscribe',
        value: function subscribe(topic, callback) {}
    }]);

    return SocketRestConnector;
}(BaseRestConnector);

var HttpRestConnector = exports.HttpRestConnector = function (_BaseRestConnector2) {
    _inherits(HttpRestConnector, _BaseRestConnector2);

    function HttpRestConnector(url) {
        _classCallCheck(this, HttpRestConnector);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(HttpRestConnector).call(this, url));
    }

    _createClass(HttpRestConnector, [{
        key: 'subscribe',
        value: function subscribe(topic, callback) {}
    }]);

    return HttpRestConnector;
}(BaseRestConnector);

function getRestResources() {
    var urlMap = new Map();
    urlMap.set("model", "/model/");
    urlMap.set("properties", "/properties/");
    urlMap.set("property", "/properties/{id}/");
    urlMap.set("actions", "/actions/");
    urlMap.set("action", "/actions/{id}/");
    urlMap.set("executeAction", "/actions/{id}/{actionId}");
    return urlMap;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function handleOpen() {}

function handleClose() {}

function handleMessage(message) {}

function iniWebsocket(connector, url) {
    var ws = new WebSocket(conf);
    ws.onopen = handleOpen;
    ws.onclose = handleClose;
    ws.onmessage = handleMessage;
}

var WebSocketConnection = exports.WebSocketConnection = function () {
    function WebSocketConnection(url) {
        _classCallCheck(this, WebSocketConnection);

        this._url = url;
        this._ws = ws;
        this._isOpen = true;
    }

    _createClass(WebSocketConnection, [{
        key: "_send",
        value: function _send(message) {
            if (this._isOpen) {
                this._ws.send(message);
            }
        }
    }, {
        key: "publish",
        value: function publish(endpoint, value) {
            return new Promise(function (resolve, reject) {});
        }
    }, {
        key: "subscribe",
        value: function subscribe(endpoint, callback) {
            return new Promise(function () {});
        }
    }]);

    return WebSocketConnection;
}();
//# sourceMappingURL=all.js.map
