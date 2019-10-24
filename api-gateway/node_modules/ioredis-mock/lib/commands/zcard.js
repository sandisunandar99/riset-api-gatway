'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zcard = zcard;

var _es6Map = require('es6-map');

var _es6Map2 = _interopRequireDefault(_es6Map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function zcard(key) {
  var map = this.data.get(key);
  if (!map) {
    return 0;
  }
  if (!(map instanceof _es6Map2.default)) {
    throw new Error('Key ' + key + ' does not contain a sorted set');
  }
  return this.data.get(key).size;
}