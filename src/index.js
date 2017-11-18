import moment from "moment-timezone";
import utils from "./utils";
import _ from "lodash";
const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

class BusinessHours {
  constructor() {
    this.lang = "en";
    this.hours = {};
  }

  _isHourValid(hour) {
    if (hour === "closed") return true;
    if (hour.length !== 5) return false;
    if (hour.indexOf(":") !== 2) return false;
    hour = hour.replace(":", "");
    if (isNaN(hour)) return false;
    return true;
  }
  _getISOWeekDayName(isoDay) {
    return weekdays[isoDay - 1];
  }

  init(hours) {
    if (_.isEmpty(hours)) {
      throw new Error("Hours are not set. Check your init() function.");
    }

    weekdays.forEach((day, index) => {
      if (!hours.hasOwnProperty(day)) {
        throw new Error(day + " is missing from config");
      } else {
        if (hours[day] !== "closed") {
          if (!hours[day][0].hasOwnProperty("from")) {
            console.error(day + " is missing 'from' in config");
          } else if (!hours[day][0].hasOwnProperty("to")) {
            console.error(day + " is missing 'to' in config");
          } else if (!this._isHourValid(hours[day][0].from)) {
            console.error(
              day + "'s 'from' has not the right format. Should be ##:##"
            );
          } else if (!this._isHourValid(hours[day][0].to)) {
            console.error(
              day + "'s 'to' has not the right format. Should be ##:##"
            );
          }
        }
      }
    });

    this.hours = hours;
  }

  isClosedNow(now = utils.now(this.hours.timeZone)) {
    return !this.isOpenNow(now);
  }

  isOpenNow(now = utils.now(this.hours.timeZone)) {
    const day = this._getISOWeekDayName(now.isoWeekday());
    if (this.isOnHoliday(now)) {
      return false;
    }
    //  console.log("now: ", format(now, "DD/MM/YYYY HH:mm"));
    let isOpenNow = false;
    if (this.hours[day.toString()] === "closed") return isOpenNow;
    this.hours[day.toString()].some((fromTo, index) => {
      const from = fromTo.from;
      const to = fromTo.to;
      const fromHours = from.substr(0, 2);
      const fromMinutes = from.substr(3, 2);
      const toHours = to.substr(0, 2);
      const toMinutes = to.substr(3, 2);
      let fromDate = now.clone();
      fromDate.set({
        hour: fromHours,
        minute: fromMinutes
      });
      let toDate = now.clone();
      toDate.set({
        hour: toHours,
        minute: toMinutes
      });
      isOpenNow = now.isBetween(fromDate, toDate);

      return isOpenNow;
    });
    return isOpenNow;
  }

  willBeOpenOn(date) {
    const day = this._getISOWeekDayName(date.isoWeekday());
    const now = utils.now(this.hours.timeZone);
    if (now.isBefore(date) || now.isSame(date)) {
      if (this.hours[day] !== "closed" && !this.isOnHoliday(date)) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  }

  isOpenTomorrow() {
    const tomorrow = utils.now(this.hours.timeZone).add(1, "days");
    return this.willBeOpenOn(tomorrow);
  }

  isOpenAfterTomorrow() {
    const afterTomorrow = utils.now(this.hours.timeZone).add(2, "days");
    return this.willBeOpenOn(afterTomorrow);
  }

  nextOpeningDate(includeToday = false) {
    let date = utils.now(this.hours.timeZone);

    if (!includeToday) {
      date.add(1, "days");
    }

    let nextOpeningDate = null;
    while (nextOpeningDate === null) {
      if (this.willBeOpenOn(date)) {
        nextOpeningDate = date;
      } else {
        date.add(1, "days");
      }
    }
    return nextOpeningDate
      .hours(0)
      .minutes(0)
      .seconds(0);
  }

  nextOpeningHour() {
    let nextOpeningHour = this._nextOpeningHour(this.nextOpeningDate(true));
    if (nextOpeningHour === null) {
      return this._nextOpeningHour(this.nextOpeningDate(false));
    }
    return nextOpeningHour;
  }
  _nextOpeningHour(nextOpeningDate) {
    const day = this._getISOWeekDayName(nextOpeningDate.isoWeekday());
    let firstDate = null;
    this.hours[day].some((fromTo, index) => {
      const from = fromTo.from;
      const to = fromTo.to;
      const fromHours = from.substr(0, 2);
      const fromMinutes = from.substr(3, 2);
      const toHours = to.substr(0, 2);
      const toMinutes = to.substr(3, 2);

      let fromDate = nextOpeningDate
        .hours(fromHours)
        .minutes(fromMinutes)
        .seconds(0);

      if (utils.now(this.hours.timeZone).isBefore(fromDate)) {
        firstDate = fromDate;
        return true;
      }
    });

    return firstDate;
  }
  //nextOpeningDateText
  //nextOpeningHourText

  isOnHoliday(now = utils.now(this.hours.timeZone), callback) {
    if (_.isEmpty(this.hours)) {
      throw new Error(
        "Hours are not set. Check your init() function or configuration."
      );
    }
    if (_.isEmpty(this.hours.holidays)) {
      this.hours.holidays = [];
    }
    for (let i = 0; i < this.hours.holidays.length; i++) {
      if (this.hours.holidays[i].indexOf("-") > -1) {
        let dates = this.hours.holidays[i].split("-");
        let beginDate = moment(dates[0]);
        let endDate = moment(dates[1]);
        if (now.isBetween(beginDate, endDate)) {
          typeof callback === "function" && callback();
          return true;
        }
      } else {
        let holidayDate = moment(this.hours.holidays[i]);
        if (now.isSame(holidayDate, "day")) {
          typeof callback === "function" && callback();
          return true;
        }
      }
    }
    return false;
  }

  isOnHolidayInDays(x = 1) {
    if (!_.isInteger(x)) {
      throw new Error("isOnHolidayInDays(:int) only accepts integers.");
    }
    let futureDate = utils.now(this.hours.timeZone).add(x, "days");

    return this.isOnHoliday(futureDate);
  }
}

module.exports = new BusinessHours();
