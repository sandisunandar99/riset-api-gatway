'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _standardAsCallback = require('standard-as-callback');

var _standardAsCallback2 = _interopRequireDefault(_standardAsCallback);

var _commands = require('./commands');

var commands = _interopRequireWildcard(_commands);

var _command = require('./command');

var _promiseContainer = require('./promise-container');

var _promiseContainer2 = _interopRequireDefault(_promiseContainer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pipeline = function () {
  function Pipeline(redis) {
    var _this = this;

    _classCallCheck(this, Pipeline);

    this.batch = [];
    this.redis = redis;
    this._transactions = 0;

    Object.keys(commands).forEach(function (command) {
      _this[command] = _this._createCommand(command);
    });
  }

  _createClass(Pipeline, [{
    key: '_createCommand',
    value: function _createCommand(commandName) {
      var _this2 = this;

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var lastArgIndex = args.length - 1;
        var callback = args[lastArgIndex];
        if (typeof callback !== 'function') {
          callback = undefined;
        } else {
          // eslint-disable-next-line no-param-reassign
          args.length = lastArgIndex;
        }
        var commandEmulator = commands[commandName].bind(_this2.redis);
        var commandArgs = (0, _command.processArguments)(args, commandName, _this2.redis);

        _this2._addTransaction(commandEmulator, commandName, commandArgs, callback);
        return _this2;
      };
    }
  }, {
    key: '_addTransaction',
    value: function _addTransaction(commandEmulator, commandName, commandArgs, callback) {
      var _this3 = this;

      var Promise = _promiseContainer2.default.get();
      this.batch.push(function () {
        return (0, _standardAsCallback2.default)(new Promise(function (resolve) {
          return resolve(_command.safelyExecuteCommand.apply(undefined, [commandEmulator, commandName, _this3.redis].concat(_toConsumableArray(commandArgs))));
        }), callback);
      });
      this._transactions += 1;
    }
  }, {
    key: 'exec',
    value: function exec(callback) {
      // eslint-disable-next-line prefer-destructuring
      var batch = this.batch;
      var Promise = _promiseContainer2.default.get();

      this.batch = [];
      return (0, _standardAsCallback2.default)(Promise.all(batch.map(function (cmd) {
        return cmd();
      })).then(function (replies) {
        return replies.map(function (reply) {
          return [null, reply];
        });
      }), callback);
    }
  }]);

  return Pipeline;
}();

exports.default = Pipeline;