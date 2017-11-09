"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _add_days = require("date-fns/add_days");

var _add_days2 = _interopRequireDefault(_add_days);

var _is_equal = require("date-fns/is_equal");

var _is_equal2 = _interopRequireDefault(_is_equal);

var _is_before = require("date-fns/is_before");

var _is_before2 = _interopRequireDefault(_is_before);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

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

      if (_lodash2.default.isEmpty(hours)) {
        throw new Error("Hours are not set. Check your init() function.");
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
              console.error(day + "'s 'from' has not the right format. Should be ##:##");
            } else if (!_this._isHourValid(hours[index.toString()][0].to)) {
              console.error(day + "'s 'to' has not the right format. Should be ##:##");
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
      //  console.log("now: ", format(now, "DD/MM/YYYY HH:mm"));
      var isOpenNow = false;
      if (this.hours[day.toString()] === "closed") return isOpenNow;
      this.hours[day.toString()].some(function (fromTo, index) {
        var from = fromTo.from;
        var to = fromTo.to;
        var fromHours = from.substr(0, 2);
        var fromMinutes = from.substr(3, 2);
        var toHours = to.substr(0, 2);
        var toMinutes = to.substr(3, 2);
        var fromDate = (0, _set_hours2.default)((0, _set_minutes2.default)(now, fromMinutes), fromHours);
        var toDate = (0, _set_hours2.default)((0, _set_minutes2.default)(now, toMinutes), toHours);
        isOpenNow = (0, _is_within_range2.default)(now, fromDate, toDate);

        return isOpenNow;
      });
      return isOpenNow;
    }
  }, {
    key: "willBeOpenOn",
    value: function willBeOpenOn(date) {
      var day = (0, _get_day2.default)(date);
      if ((0, _is_future2.default)(date) || (0, _is_equal2.default)(new Date(), date)) {
        if (this.hours[day.toString()] !== "closed") {
          return true;
        } else {
          return false;
        }
      }
      return false;
    }
  }, {
    key: "isOpenTomorrow",
    value: function isOpenTomorrow() {
      var tomorrow = (0, _add_days2.default)(new Date(), 1);
      return this.willBeOpenOn(tomorrow);
    }
  }, {
    key: "isOpenAfterTomorrow",
    value: function isOpenAfterTomorrow() {
      var afterTomorrow = (0, _add_days2.default)(new Date(), 2);
      return this.willBeOpenOn(afterTomorrow);
    }
  }, {
    key: "nextOpeningDate",
    value: function nextOpeningDate() {
      var includeToday = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var date = (0, _add_days2.default)(new Date(), 1);
      if (includeToday) {
        date = new Date();
      }

      var nextOpeningDate = null;
      while (nextOpeningDate === null) {
        if (this.willBeOpenOn(date)) {
          nextOpeningDate = date;
        } else {
          date = (0, _add_days2.default)(date, 1);
        }
      }
      return nextOpeningDate;
    }
  }, {
    key: "nextOpeningHour",
    value: function nextOpeningHour() {
      var nextOpeningHour = this._nextOpeningHour(this.nextOpeningDate(true));
      if (nextOpeningHour === null) {
        return this._nextOpeningHour(this.nextOpeningDate(false));
      }
      return nextOpeningHour;
    }
  }, {
    key: "_nextOpeningHour",
    value: function _nextOpeningHour(nextOpeningDate) {
      var day = (0, _get_day2.default)(nextOpeningDate);
      var firstDate = null;
      this.hours[day.toString()].some(function (fromTo, index) {
        var from = fromTo.from;
        var to = fromTo.to;
        var fromHours = from.substr(0, 2);
        var fromMinutes = from.substr(3, 2);
        var toHours = to.substr(0, 2);
        var toMinutes = to.substr(3, 2);
        var fromDate = (0, _set_hours2.default)((0, _set_minutes2.default)(nextOpeningDate, fromMinutes), fromHours);

        if ((0, _is_before2.default)(new Date(), fromDate)) {
          firstDate = fromDate;
          return true;
        }
      });

      return firstDate;
    }
    //nextOpeningDateText
    //nextOpeningHourText

  }]);

  return BusinessHours;
}();

module.exports = new BusinessHours();