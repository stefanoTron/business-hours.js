"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _momentTimezone = require("moment-timezone");

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _utils = require("./utils");

var _utils2 = _interopRequireDefault(_utils);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
    key: "_getISOWeekDayName",
    value: function _getISOWeekDayName(isoDay) {
      return weekdays[isoDay - 1];
    }
  }, {
    key: "init",
    value: function init(hours) {
      var _this = this;

      if (_lodash2.default.isEmpty(hours)) {
        throw new Error("Hours are not set. Check your init() function.");
      }

      weekdays.forEach(function (day, index) {
        if (!hours.hasOwnProperty(day)) {
          throw new Error(day + " is missing from config");
        } else {
          if (hours[day] !== "closed") {
            if (!hours[day][0].hasOwnProperty("from")) {
              console.error(day + " is missing 'from' in config");
            } else if (!hours[day][0].hasOwnProperty("to")) {
              console.error(day + " is missing 'to' in config");
            } else if (!_this._isHourValid(hours[day][0].from)) {
              console.error(day + "'s 'from' has not the right format. Should be ##:##");
            } else if (!_this._isHourValid(hours[day][0].to)) {
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
      var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _utils2.default.now(this.hours.timeZone);

      return !this.isOpenNow(now);
    }
  }, {
    key: "isOpenNow",
    value: function isOpenNow() {
      var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _utils2.default.now(this.hours.timeZone);

      var day = this._getISOWeekDayName(now.isoWeekday());
      if (this.isOnHoliday(now)) {
        return false;
      }
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
        var fromDate = now.clone();
        fromDate.set({
          hour: fromHours,
          minute: fromMinutes
        });
        var toDate = now.clone();
        toDate.set({
          hour: toHours,
          minute: toMinutes
        });
        isOpenNow = now.isBetween(fromDate, toDate);

        return isOpenNow;
      });
      return isOpenNow;
    }
  }, {
    key: "willBeOpenOn",
    value: function willBeOpenOn(date) {
      var day = this._getISOWeekDayName(date.isoWeekday());
      var now = _utils2.default.now(this.hours.timeZone);
      if (now.isBefore(date) || now.isSame(date)) {
        if (this.hours[day] !== "closed" && !this.isOnHoliday(date)) {
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
      var tomorrow = _utils2.default.now(this.hours.timeZone).add(1, "days");
      return this.willBeOpenOn(tomorrow);
    }
  }, {
    key: "isOpenAfterTomorrow",
    value: function isOpenAfterTomorrow() {
      var afterTomorrow = _utils2.default.now(this.hours.timeZone).add(2, "days");
      return this.willBeOpenOn(afterTomorrow);
    }
  }, {
    key: "nextOpeningDate",
    value: function nextOpeningDate() {
      var includeToday = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var date = _utils2.default.now(this.hours.timeZone);

      if (!includeToday) {
        date.add(1, "days");
      }

      var nextOpeningDate = null;
      while (nextOpeningDate === null) {
        if (this.willBeOpenOn(date)) {
          nextOpeningDate = date;
        } else {
          date.add(1, "days");
        }
      }
      return nextOpeningDate.hours(0).minutes(0).seconds(0);
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
      var _this2 = this;

      var day = this._getISOWeekDayName(nextOpeningDate.isoWeekday());
      var firstDate = null;
      this.hours[day].some(function (fromTo, index) {
        var from = fromTo.from;
        var to = fromTo.to;
        var fromHours = from.substr(0, 2);
        var fromMinutes = from.substr(3, 2);
        var toHours = to.substr(0, 2);
        var toMinutes = to.substr(3, 2);

        var fromDate = nextOpeningDate.hours(fromHours).minutes(fromMinutes).seconds(0);

        if (_utils2.default.now(_this2.hours.timeZone).isBefore(fromDate)) {
          firstDate = fromDate;
          return true;
        }
      });

      return firstDate;
    }
    //nextOpeningDateText
    //nextOpeningHourText

  }, {
    key: "isOnHoliday",
    value: function isOnHoliday() {
      var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _utils2.default.now(this.hours.timeZone);
      var callback = arguments[1];

      if (_lodash2.default.isEmpty(this.hours)) {
        throw new Error("Hours are not set. Check your init() function or configuration.");
      }
      if (_lodash2.default.isEmpty(this.hours.holidays)) {
        this.hours.holidays = [];
      }
      for (var i = 0; i < this.hours.holidays.length; i++) {
        if (this.hours.holidays[i].indexOf("-") > -1) {
          var dates = this.hours.holidays[i].split("-");
          var beginDate = (0, _momentTimezone2.default)(dates[0]);
          var endDate = (0, _momentTimezone2.default)(dates[1]);
          if (now.isBetween(beginDate, endDate)) {
            typeof callback === "function" && callback();
            return true;
          }
        } else {
          var holidayDate = (0, _momentTimezone2.default)(this.hours.holidays[i]);
          if (now.isSame(holidayDate, "day")) {
            typeof callback === "function" && callback();
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: "isOnHolidayInDays",
    value: function isOnHolidayInDays() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (!_lodash2.default.isInteger(x)) {
        throw new Error("isOnHolidayInDays(:int) only accepts integers.");
      }
      var futureDate = _utils2.default.now(this.hours.timeZone).add(x, "days");

      return this.isOnHoliday(futureDate);
    }
  }]);

  return BusinessHours;
}();

module.exports = new BusinessHours();