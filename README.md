# business-hours.js

Handle business hours of a restaurant, office or any other business. Highly customizable with lots of features, based on moment.js.

[Demo](https://codesandbox.io/s/github/littletower/business-hours.js/tree/master/example)


[![Travis](https://img.shields.io/travis/littletower/business-hours.js.svg?style=flat-square)]()
[![Codecov](https://img.shields.io/codecov/c/github/littletower/business-hours.js.svg?style=flat-square)]()
[![npm](https://img.shields.io/npm/v/business-hours.js.svg?style=flat-square)]()

## Features

- *** all your business hours in JSON format ***

- *** split hours (eg. restaurants, from 10:00 to 14:00 and from 18:00 to 22:00) ***

- *** timezone support ***

- *** add holidays (single day or ranges) ***

- *** based on [moment.js](https://momentjs.com/) ***

- *** lightweight less than 115kB (minified + gzipped) ***



## Installation

Add the latest version of `business-hours.js` to your package.json:
```
npm install business-hours.js --save
```
or
```
yarn add business-hours.js
```

# Configuration

To get started, you'll need to define your business hours in JSON format for every weekday.

You can have 1 to N `from/to` pairs per weekday. If on a given day you are closed, instead of a `from/to` pair, just put `closed`.

In `holidays` you can define on which day the business is closed for holidays. It can be one day (YYYY/MM/DD) or a range (YYYY/MM/DD-YYYY/MM/DD).

Set the desired timezone in `timeZone`, use any `tz` timezone.

```json
"Monday": [
  {
    "from": "10:00",
    "to": "13:30"
  },
  {
    "from": "18:00",
    "to": "22:00"
  }
],
"Tuesday": "closed",
"Wednesday": [
  {
    "from": "10:00",
    "to": "13:30"
  },
  {
    "from": "18:00",
    "to": "22:00"
  }
],
"Thursday": [
  {
    "from": "10:00",
    "to": "13:30"
  },
  {
    "from": "18:00",
    "to": "22:00"
  }
],
"Friday": [
  {
    "from": "10:00",
    "to": "13:30"
  },
  {
    "from": "18:00",
    "to": "22:00"
  }
],
"Saturday": [
  {
    "from": "10:00",
    "to": "13:30"
  },
  {
    "from": "18:00",
    "to": "22:00"
  }
],
"Sunday": [
  {
    "from": "10:00",
    "to": "13:30"
  },
  {
    "from": "17:00",
    "to": "20:00"
  },
  {
    "from": "21:00",
    "to": "24:00"
  }
],
"holidays": ["2017/12/11", "2017/12/23-2018/01/02"],
"timeZone":"Europe/Amsterdam"
}
```

# Usage

First import the lib
```
import businessHours from "business-hours.js";
```
Then you have to initalize the lib with your business hours
```
businessHours.init(hoursJson);
```
`hoursJson` must be in JSON format. It could come from an external file
```
import hoursJson from "./hours.json";
```
or it could come from any other endpoint (DB, GraphQL, Firebase...), as long as it's in JSON.

# Example
To check if your business is currently open:
```
let isBusinessOpenNow = businessHours.isOpenNow(); //returns boolean value
```

Find a whole example in React here [here](example/)

# Doc

Method | Argument | Description
------ | -------- | -----------
`isOpenNow` | optional : date | Returns if your business is open or not. If an argument is provided, the method will be executed for the given date.
`isClosedNow` | optional : date | Returns if your business is closed or not. If an argument is provided, the method will be executed for the given date.
`willBeOpenOn` | date | Returns if your business will be open on given date.
`isOpenTomorrow` |  | Returns if your business is open tomorrow.
`isOpenAfterTomorrow` |  | Returns if your business is open after tomorrow.
`nextOpeningDate` | optional : boolean | Returns the next opening date. If argument is set to `true`, the next opening date could be today.
`nextOpeningHour` |  | Returns the next opening hour.
`isOnHoliday` | optional : date | Returns if your business is closed for holidays.
`isOnHolidayInDays` | integer | Returns if your business will be closed for holidays in `x` days.


# TODOs
- [ ] support after midnight hours, (eg. open from 18:00 to 03:00)
- [x] Time zones support
- [x] use ISO format for weekdays, meaning, starting the week on Monday instead of Sunday
- [x] add holidays (single day or range) in ISO (ISO 8601) format YYYY-MM-DD
- [ ] support hourly holidays, like business opens from 20:00 instead of 18:00 on a given date.
- [ ] add always closed on public holidays (country specific)
- [ ] add localized formatter to display all the business hours
