"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RestConnector = exports.RestConnector = function RestConnector() {
    _classCallCheck(this, RestConnector);
};

var WebSocketConnector = exports.WebSocketConnector = function WebSocketConnector() {
    _classCallCheck(this, WebSocketConnector);
};

var ConnectionApi = exports.ConnectionApi = function () {
    function ConnectionApi() {
        _classCallCheck(this, ConnectionApi);
    }

    _createClass(ConnectionApi, [{
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
        value: function subscribe(endpoint, callback) {}
    }]);

    return ConnectionApi;
}();
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Wot = undefined;

var _connection = require('connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConnectionManager = function ConnectionManager() {
    _classCallCheck(this, ConnectionManager);
};

var Wot = exports.Wot = ConnectionManager;
//# sourceMappingURL=all.js.map
