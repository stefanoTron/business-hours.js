"use strict";

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// hours and month start from 0
// date starts at 1
var utils = {
  createDate: function createDate(year, month, date, hour, minute) {
    var timeZone = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "Europe/Amsterdam";

    var newDate = _momentTimezone["default"].tz(timeZone);

    newDate.set({
      year: year,
      month: month,
      date: date,
      hour: hour,
      minute: minute
    });
    return newDate;
  },
  now: function now() {
    var timeZone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Europe/Amsterdam";
    return _momentTimezone["default"].tz(timeZone);
  }
};
module.exports = utils;