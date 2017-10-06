import hoursJson from "./hours.json";
import setMinutes from "date-fns/set_minutes";
import setHours from "date-fns/set_hours";
import getDay from "date-fns/get_day";
import format from "date-fns/format";
import isWithinRange from "date-fns/is_within_range";
import isFuture from "date-fns/is_future";
import addDays from "date-fns/add_days";
import isEqual from "date-fns/is_equal";
import isBefore from "date-fns/is_before";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
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

  init(hours) {
    if (hours === undefined) {
      hours = hoursJson;
    }
    weekdays.forEach((day, index) => {
      if (!hours.hasOwnProperty(index.toString())) {
        throw new Error(day + " is missing from config");
      } else {
        if (hours[index.toString()] !== "closed") {
          if (!hours[index.toString()][0].hasOwnProperty("from")) {
            console.error(day + " is missing 'from' in config");
          } else if (!hours[index.toString()][0].hasOwnProperty("to")) {
            console.error(day + " is missing 'to' in config");
          } else if (!this._isHourValid(hours[index.toString()][0].from)) {
            console.error(
              day + "'s 'from1' has not the right format. Should be ##:##"
            );
          } else if (!this._isHourValid(hours[index.toString()][0].to)) {
            console.error(
              day + "'s 'to1' has not the right format. Should be ##:##"
            );
          }
        }
      }
    });

    this.hours = hours;
  }

  isClosedNow(now = new Date()) {
    return !this.isOpenNow(now);
  }

  isOpenNow(now = new Date()) {
    const day = getDay(now);
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
      const fromDate = setHours(setMinutes(now, fromMinutes), fromHours);
      const toDate = setHours(setMinutes(now, toMinutes), toHours);
      isOpenNow = isWithinRange(now, fromDate, toDate);

      );
      return isOpenNow;
    });
    return isOpenNow;
  }

  willBeOpenOn(date) {
    const day = getDay(date);
    if (isFuture(date) || isEqual(new Date(), date)) {
      if (this.hours[day.toString()] !== "closed") {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  isOpenTomorrow() {
    const tomorrow = addDays(new Date(), 1);
    return this.willBeOpenOn(tomorrow);
  }
  isOpenAfterTomorrow() {
    const afterTomorrow = addDays(new Date(), 2);
    return this.willBeOpenOn(afterTomorrow);
  }

  nextOpeningDate(includeToday = false) {
    let date = addDays(new Date(), 1);
    if (includeToday) {
      date = new Date();
    }

    let nextOpeningDate = null;
    while (nextOpeningDate === null) {
      if (this.willBeOpenOn(date)) {
        nextOpeningDate = date;
      } else {
        date = addDays(date, 1);
      }
    }
    return nextOpeningDate;
  }

  nextOpeningHour() {
    let nextOpeningHour = this._nextOpeningHour(this.nextOpeningDate(true));
    if (nextOpeningHour === null) {
      return this._nextOpeningHour(this.nextOpeningDate(false));
    }
    return nextOpeningHour;
  }
  _nextOpeningHour(nextOpeningDate) {
    const day = getDay(nextOpeningDate);
    let firstDate = null;
    this.hours[day.toString()].some((fromTo, index) => {
      const from = fromTo.from;
      const to = fromTo.to;
      const fromHours = from.substr(0, 2);
      const fromMinutes = from.substr(3, 2);
      const toHours = to.substr(0, 2);
      const toMinutes = to.substr(3, 2);
      const fromDate = setHours(
        setMinutes(nextOpeningDate, fromMinutes),
        fromHours
      );

      if (isBefore(new Date(), fromDate)) {
        firstDate = fromDate;
        return true;
      }
    });

    return firstDate;
  }
  //nextOpeningDateText
  //nextOpeningHourText
}

module.exports = new BusinessHours();
