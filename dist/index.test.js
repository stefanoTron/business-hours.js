"use strict";

var expect = require("chai").expect;

var bh = require("./index.js");

var hoursJson = require("./hours.json");

var hoursJson2 = require("./hours2.json");

var hoursJsonMissingHolidays = require("./hoursMissingHolidays.json");

var utils = require("./utils/index.js");

var MockDate = require("mockdate");

var TIMEZONE = "Europe/Luxembourg";
describe("business-hours-js", function () {
  beforeEach(function () {
    bh.init(hoursJson);
  });
  afterEach(function () {
    MockDate.reset();
  });
  describe("isOpenNow", function () {
    it("outside business hours, should equal false", function () {
      expect(bh.isOpenNow(utils.createDate(2017, 9, 1, 14, 0, TIMEZONE))).to.equal(false);
    });
    it("inside business hours, should equal true", function () {
      expect(bh.isOpenNow(utils.createDate(2017, 9, 1, 18, 0, TIMEZONE))).to.equal(true);
    });
    it("closed day, should equal false", function () {
      expect(bh.isOpenNow(utils.createDate(2017, 9, 3, 18, 0, TIMEZONE))).to.equal(false);
    });
    it("on holiday day, should equal false", function () {
      expect(bh.isOpenNow(utils.createDate(2017, 11, 9, 0, 0, TIMEZONE))).to.equal(false);
    });
    it("on holiday day (range), should equal false", function () {
      expect(bh.isOpenNow(utils.createDate(2017, 11, 24, 0, 0, TIMEZONE))).to.equal(false);
    });
  });
  describe("isClosedNow", function () {
    it("outside business hours, should equal true", function () {
      expect(bh.isClosedNow(utils.createDate(2017, 9, 1, 14, 0, TIMEZONE))).to.equal(true);
    });
    it("inside business hours, should equal false", function () {
      expect(bh.isClosedNow(utils.createDate(2017, 9, 1, 18, 0, TIMEZONE))).to.equal(false);
    });
    it("closed day, should equal true", function () {
      expect(bh.isClosedNow(utils.createDate(2017, 9, 3, 18, 0, TIMEZONE))).to.equal(true);
    });
    it("on holiday day, should equal true", function () {
      expect(bh.isClosedNow(utils.createDate(2017, 11, 9, 0, 0, TIMEZONE))).to.equal(true);
    });
    it("on holiday day (range), should equal true", function () {
      expect(bh.isClosedNow(utils.createDate(2017, 11, 24, 0, 0, TIMEZONE))).to.equal(true);
    });
  });
  describe("_isHourValidHour", function () {
    it("18:00 is valid", function () {
      expect(bh._isHourValid("18:00")).to.equal(true);
    });
    it("1800 is not valid", function () {
      expect(bh._isHourValid("1800")).to.equal(false);
    });
    it("18 is not valid", function () {
      expect(bh._isHourValid("18")).to.equal(false);
    });
    it("0 is not valid", function () {
      expect(bh._isHourValid("0")).to.equal(false);
    });
    it("'closed' is valid", function () {
      expect(bh._isHourValid("closed")).to.equal(true);
    });
    it("az:00 is not valid", function () {
      expect(bh._isHourValid("az:00")).to.equal(false);
    });
  });
  describe("willBeOpenOn", function () {
    it("with future date, should be true", function () {
      expect(bh.willBeOpenOn(utils.createDate(2021, 0, 3, 0, 0, TIMEZONE))).to.equal(true);
    });
    it("with future date, on closed day, should be false", function () {
      expect(bh.willBeOpenOn(utils.createDate(2019, 0, 1, 0, 0, TIMEZONE))).to.equal(false);
    });
    it("with past date, should be false", function () {
      expect(bh.willBeOpenOn(utils.createDate(2015, 0, 1, 0, 0, TIMEZONE))).to.equal(false);
    });
  });
  describe("isOpenTomorrow", function () {
    it("is open Tomorrow, should be true", function () {
      MockDate.set("10/1/2017");
      expect(bh.isOpenTomorrow()).to.equal(true);
      MockDate.reset();
    });
    it("is open Tomorrow, should be false", function () {
      MockDate.set("10/2/2017");
      expect(bh.isOpenTomorrow()).to.equal(false);
      MockDate.reset();
    });
  });
  describe("isOpenAfterTomorrow", function () {
    it("is open after-tomorrow, should be true", function () {
      MockDate.set("10/2/2017");
      expect(bh.isOpenAfterTomorrow()).to.equal(true);
      MockDate.reset();
    });
    it("is open after-tomorrow, should be false", function () {
      MockDate.set("10/1/2017");
      expect(bh.isOpenAfterTomorrow()).to.equal(false);
      MockDate.reset();
    });
  });
  describe("nextOpeningDate", function () {
    it("monday 2/10/2017, should return 4/10/2017", function () {
      MockDate.set("10/2/2017");
      var expectedDate = utils.createDate(2017, 9, 4, 0, 0, TIMEZONE);
      expect(bh.nextOpeningDate().isSame(expectedDate, "day")).to.equal(true);
      MockDate.reset();
    });
    it("tuesday 3/10/2017, should return 4/10/2017", function () {
      MockDate.set("10/3/2017");
      var expectedDate = utils.createDate(2017, 9, 4, 0, 0, TIMEZONE);
      expect(bh.nextOpeningDate().isSame(expectedDate, "day")).to.equal(true);
      MockDate.reset();
    });
    it("wednesday 4/10/2017, should return 5/10/2017", function () {
      MockDate.set("10/4/2017");
      var expectedDate = utils.createDate(2017, 9, 5, 0, 0, TIMEZONE);
      expect(bh.nextOpeningDate().isSame(expectedDate, "day")).to.equal(true);
      MockDate.reset();
    });
    it("sunday 8/10/2017, should return monday 9/10/2017", function () {
      MockDate.set("10/8/2017");
      var expectedDate = utils.createDate(2017, 9, 9, 0, 0, TIMEZONE);
      expect(bh.nextOpeningDate().isSame(expectedDate, "day")).to.equal(true);
      MockDate.reset();
    });
    it("monday 2/10/2017, should return monday 2/10/2017", function () {
      MockDate.set("10/2/2017");
      var expectedDate = utils.createDate(2017, 9, 2, 0, 0, TIMEZONE);
      expect(bh.nextOpeningDate(true).isSame(expectedDate, "day")).to.equal(true);
      MockDate.reset();
    });
  });
  describe("nextOpeningHour", function () {
    it("monday 2/10/2017 6:00, should return 2/10/2017 10:00", function () {
      MockDate.set(utils.createDate(2017, 9, 2, 6, 0, TIMEZONE));
      var expectedDate = utils.createDate(2017, 9, 2, 10, 0);
      expect(bh.nextOpeningHour().isSame(expectedDate, "minute")).to.equal(true);
      MockDate.reset();
    });
    it("monday 2/10/2017 16:00, should return 2/10/2017 18:00", function () {
      MockDate.set(utils.createDate(2017, 9, 2, 16, 0, TIMEZONE));
      var expectedDate = utils.createDate(2017, 9, 2, 18, 0, TIMEZONE);
      expect(bh.nextOpeningHour().isSame(expectedDate, "minute")).to.equal(true);
      MockDate.reset();
    });
    it("sunday 1/10/2017 20:30, should return 1/10/2017 21:00", function () {
      MockDate.set(utils.createDate(2017, 9, 1, 20, 30, TIMEZONE));
      var expectedDate = utils.createDate(2017, 9, 1, 21, 0, TIMEZONE);
      expect(bh.nextOpeningHour().isSame(expectedDate, "minute")).to.equal(true);
      MockDate.reset();
    });
    it("sunday 1/10/2017 21:30, should return 2/10/2017 10:00", function () {
      MockDate.set(utils.createDate(2017, 9, 1, 21, 30, TIMEZONE));
      var expectedDate = utils.createDate(2017, 9, 2, 10, 0, TIMEZONE);
      expect(bh.nextOpeningHour().isSame(expectedDate, "minute")).to.equal(true);
      MockDate.reset();
    });
    it("tuesday(closed) 3/10/2017 18:30, should return 4/10/2017 10:00", function () {
      MockDate.set(utils.createDate(2017, 9, 3, 18, 30, TIMEZONE));
      var expectedDate = utils.createDate(2017, 9, 4, 10, 0, TIMEZONE);
      expect(bh.nextOpeningHour().isSame(expectedDate, "minute")).to.equal(true);
      MockDate.reset();
    });
  });
  describe("isOnHoliday", function () {
    it("on holiday 2017/12/11", function () {
      MockDate.set(utils.createDate(2017, 11, 11, 0, 0, TIMEZONE));
      expect(bh.isOnHoliday()).to.equal(true);
    });
    it("after a holiday 2017/12/12", function () {
      MockDate.set(utils.createDate(2017, 11, 12, 0, 0, TIMEZONE));
      expect(bh.isOnHoliday()).to.equal(false);
    });
    it("before a holiday 2017/12/9", function () {
      MockDate.set(utils.createDate(2017, 11, 9, 0, 0, TIMEZONE));
      expect(bh.isOnHoliday()).to.equal(false);
    });
    it("in range 2017/12/24", function () {
      MockDate.set(utils.createDate(2017, 11, 24, 0, 0, TIMEZONE));
      expect(bh.isOnHoliday()).to.equal(true);
    });
    it("within range, with year change 2018/01/01", function () {
      MockDate.set(utils.createDate(2018, 0, 1, 0, 0, TIMEZONE));
      expect(bh.isOnHoliday()).to.equal(true);
    });
    it("outside range, with year change 2018/01/04", function () {
      MockDate.set(utils.createDate(2018, 0, 4, 0, 0, TIMEZONE));
      expect(bh.isOnHoliday()).to.equal(false);
    });
    it("missing holidays in config", function () {
      bh.init(hoursJsonMissingHolidays);
      expect(bh.isOnHoliday()).to.equal(false);
    });
  });
  describe("isOnHolidayInDays", function () {
    it("on holiday 3 days from 2017/12/08", function () {
      MockDate.set(utils.createDate(2017, 11, 8, 0, 0, TIMEZONE));
      expect(bh.isOnHolidayInDays(3)).to.equal(true);
    });
    it('Nan param "3 days"', function () {
      expect(bh.isOnHolidayInDays.bind(bh, "3 days")).to["throw"]("isOnHolidayInDays(:int) only accepts integers.");
    });
    it('NaN param "3"', function () {
      expect(bh.isOnHolidayInDays.bind(bh, "3")).to["throw"]("isOnHolidayInDays(:int) only accepts integers.");
    });
    it('NaN param "undefined", x defaults to 1', function () {
      MockDate.set(utils.createDate(2017, 11, 8, 0, 0, TIMEZONE));
      expect(bh.isOnHolidayInDays(undefined)).to.equal(false);
    });
    it('NaN param ""', function () {
      expect(bh.isOnHolidayInDays.bind(bh, "")).to["throw"]("isOnHolidayInDays(:int) only accepts integers.");
    });
  }); //MockDate.set('1/1/2000');

  describe("init", function () {
    it("missing monday", function () {
      expect(bh.init.bind(bh, hoursJson2)).to["throw"]("Monday is missing from config");
    });
    it("missing config, empty object", function () {
      expect(bh.init.bind(bh, {})).to["throw"]("Hours are not set. Check your init() function.");
    });
    it("missing config, null ", function () {
      expect(bh.init.bind(bh, null)).to["throw"]("Hours are not set. Check your init() function.");
    });
    it("missing config, undefined ", function () {
      expect(bh.init.bind(bh, undefined)).to["throw"]("Hours are not set. Check your init() function.");
    });
    it("missing config, {'a':'test'} ", function () {
      expect(bh.init.bind(bh, {
        a: "test"
      })).to["throw"]("Monday is missing from config");
    });
  });
});