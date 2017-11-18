import moment from "moment-timezone";

// hours and month start from 0
// date starts at 1
var utils = {
  createDate(year, month, date, hour, minute, timeZone = "Europe/Amsterdam") {
    let newDate = moment.tz(timeZone);
    newDate.set({
      year: year,
      month: month,
      date: date,
      hour: hour,
      minute: minute
    });

    return newDate;
  },

  now(timeZone = "Europe/Amsterdam") {
    return moment.tz(timeZone);
  }
};

module.exports = utils;
