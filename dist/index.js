"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hours = require("./hours.json");

var _hours2 = _interopRequireDefault(_hours);

var _set_minutes = require("date-fns/set_minutes");

var _set_minutes2 = _interopRequireDefault(_set_minutes);

var _set_hours = require("date-fns/set_hours");

var _set_hours2 = _interopRequireDefault(_set_hours);

var _get_day = require("date-fns/get_day");

var _get_day2 = _interopRequireDefault(_get_day);

var _format = require("date-fns/format");

var _format2 = _interopRequireDefault(_format);

var _is_within_range = require("date-fns/is_within_range");

var _is_within_range2 = _interopRequireDefault(_is_within_range);

var _is_future = require("date-fns/is_future");

var _is_future2 = _interopRequireDefault(_is_future);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var BusinessHours = function () {
  function BusinessHours() {
    _classCallCheck(this, BusinessHours);

    this.lang = "en";
    this.hours = {};
  }

  _createClass(BusinessHours, [{
    key: "_isHourValid",
    value: function _isHourValid(hour) {
      if (hour === "closed") return true;
      if (hour.length !== 5) return false;
      if (hour.indexOf(":") !== 2) return false;
      hour = hour.replace(":", "");
      if (isNaN(hour)) return false;
      return true;
    }
  }, {
    key: "init",
    value: function init(hours) {
      var _this = this;

      if (hours === undefined) {
        hours = _hours2.default;
      }
      weekdays.forEach(function (day, index) {
        if (!hours.hasOwnProperty(index.toString())) {
          throw new Error(day + " is missing from config");
        } else {
          if (hours[index.toString()] !== "closed") {
            if (!hours[index.toString()][0].hasOwnProperty("from")) {
              console.error(day + " is missing 'from' in config");
            } else if (!hours[index.toString()][0].hasOwnProperty("to")) {
              console.error(day + " is missing 'to' in config");
            } else if (!_this._isHourValid(hours[index.toString()][0].from)) {
              console.error(day + "'s 'from1' has not the right format. Should be ##:##");
            } else if (!_this._isHourValid(hours[index.toString()][0].to)) {
              console.error(day + "'s 'to1' has not the right format. Should be ##:##");
            }
          }
        }
      });

      this.hours = hours;
    }
  }, {
    key: "isClosedNow",
    value: function isClosedNow() {
      var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

      return !this.isOpenNow(now);
    }
  }, {
    key: "isOpenNow",
    value: function isOpenNow() {
      var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

      var day = (0, _get_day2.default)(now);
      console.log("now: ", (0, _format2.default)(now, "DD/MM/YYYY HH:mm"));
      var isOpenNow = false;
      if (this.hours[day.toString()] === "closed") return isOpenNow;
      this.hours[day.toString()].forEach(function (fromTo, index) {
        var from = fromTo.from;
        var to = fromTo.to;
        var fromHours = from.substr(0, 2);
        var fromMinutes = from.substr(3, 2);
        var toHours = to.substr(0, 2);
        var toMinutes = to.substr(3, 2);
        var fromDate = (0, _set_hours2.default)((0, _set_minutes2.default)(now, fromMinutes), fromHours);
        var toDate = (0, _set_hours2.default)((0, _set_minutes2.default)(now, toMinutes), toHours);
        console.log((0, _format2.default)(fromDate, "DD/MM/YYYY HH:mm"), " - ", (0, _format2.default)(toDate, "DD/MM/YYYY HH:mm"));
        isOpenNow = (0, _is_within_range2.default)(now, fromDate, toDate);
        if (isOpenNow) return isOpenNow;
      });
      return isOpenNow;
    }
  }, {
    key: "willBeOpenOn",
    value: function willBeOpenOn(date) {
      var day = (0, _get_day2.default)(date);
      if ((0, _is_future2.default)(date)) {
        if (this.hours[day.toString()] !== "closed") {
          return true;
        } else {
          return false;
        }
      }
      return false;
    }
  }]);

  return BusinessHours;
}();
/*
function ola2() {
  console.log("ola2");
}
function ola() {
  console.log("ola");
  ola2();
  return 123;
}

function init() {

}
function getLang() {

}
module.exports = {
  all: hours,
  random: ola
};
*/


module.exports = new BusinessHours();