var expect = require("chai").expect;
var bh = require("./index.js");
var hoursJson2 = require("./hours2.json");
var MockDate = require("mockdate");
import format from "date-fns/format";

bh.init();

describe("business-hours-js", function() {
  describe("isOpenNow", function() {
    it("outside business hours, should equal false", function() {
      expect(bh.isOpenNow(new Date(2017, 9, 1, 16, 0))).to.equal(false);
    });
    it("inside business hours, should equal true", function() {
      expect(bh.isOpenNow(new Date(2017, 9, 1, 18, 0))).to.equal(true);
    });
    it("cloded day, should equal false", function() {
      expect(bh.isOpenNow(new Date(2017, 9, 3, 18, 0))).to.equal(false);
    });
  });

  describe("isClosedNow", function() {
    it("outside business hours, should equal true", function() {
      expect(bh.isClosedNow(new Date(2017, 9, 1, 16, 0))).to.equal(true);
    });
    it("inside business hours, should equal false", function() {
      expect(bh.isClosedNow(new Date(2017, 9, 1, 18, 0))).to.equal(false);
    });
    it("cloded day, should equal true", function() {
      expect(bh.isClosedNow(new Date(2017, 9, 3, 18, 0))).to.equal(true);
    });
  });

  describe("_isHourValidHour", function() {
    it("18:00 is valid", function() {
      expect(bh._isHourValid("18:00")).to.equal(true);
    });
    it("1800 is not valid", function() {
      expect(bh._isHourValid("1800")).to.equal(false);
    });
    it("18 is not valid", function() {
      expect(bh._isHourValid("18")).to.equal(false);
    });
    it("0 is not valid", function() {
      expect(bh._isHourValid("0")).to.equal(false);
    });
    it("'closed' is valid", function() {
      expect(bh._isHourValid("closed")).to.equal(true);
    });
    it("az:00 is not valid", function() {
      expect(bh._isHourValid("az:00")).to.equal(false);
    });
  });

  describe("willBeOpenOn", function() {
    it("with future date, should be true", function() {
      expect(bh.willBeOpenOn(new Date(2019, 9, 3))).to.equal(true);
    });
    it("with future date, on closed day, should be false", function() {
      expect(bh.willBeOpenOn(new Date(2019, 9, 1))).to.equal(false);
    });
    it("with past date, should be false", function() {
      expect(bh.willBeOpenOn(new Date(2015, 9, 1))).to.equal(false);
    });
  });
  describe("isOpenTomorrow", function() {
    it("is open Tomorrow, should be true", function() {
      MockDate.set("10/1/2017");
      expect(bh.isOpenTomorrow()).to.equal(true);
      MockDate.reset();
    });

    it("is open Tomorrow, should be false", function() {
      MockDate.set("10/2/2017");
      expect(bh.isOpenTomorrow()).to.equal(false);
      MockDate.reset();
    });
  });
  describe("isOpenAfterTomorrow", function() {
    it("is open after-tomorrow, should be true", function() {
      MockDate.set("10/2/2017");
      expect(bh.isOpenAfterTomorrow()).to.equal(true);
      MockDate.reset();
    });

    it("is open after-tomorrow, should be false", function() {
      MockDate.set("10/1/2017");
      expect(bh.isOpenAfterTomorrow()).to.equal(false);
      MockDate.reset();
    });
  });
  describe("nextOpeningDate", function() {
    it("monday 2/10/2017, should return 4/10/2017", function() {
      MockDate.set("10/2/2017");
      var expectedDate = new Date(2017, 9, 4, 0, 0);
      expect(bh.nextOpeningDate().getTime()).to.equal(expectedDate.getTime());
      MockDate.reset();
    });
    it("tuesday 3/10/2017, should return 4/10/2017", function() {
      MockDate.set("10/3/2017");
      var expectedDate = new Date(2017, 9, 4, 0, 0);
      expect(bh.nextOpeningDate().getTime()).to.equal(expectedDate.getTime());
      MockDate.reset();
    });
    it("wednesday 4/10/2017, should return 5/10/2017", function() {
      MockDate.set("10/4/2017");
      var expectedDate = new Date(2017, 9, 5, 0, 0);
      expect(bh.nextOpeningDate().getTime()).to.equal(expectedDate.getTime());
      MockDate.reset();
    });
    it("sunday 8/10/2017, should return monday 9/10/2017", function() {
      MockDate.set("10/8/2017");
      var expectedDate = new Date(2017, 9, 9, 0, 0);
      expect(bh.nextOpeningDate().getTime()).to.equal(expectedDate.getTime());
      MockDate.reset();
    });
    it("monday 2/10/2017, should return monday 2/10/2017", function() {
      MockDate.set("10/2/2017");
      var expectedDate = new Date(2017, 9, 2, 0, 0);
      expect(bh.nextOpeningDate(true).getTime()).to.equal(
        expectedDate.getTime()
      );
      MockDate.reset();
    });
  });
  describe("nextOpeningHour", function() {
    it("monday 2/10/2017 6:00, should return 2/10/2017 10:00", function() {
      MockDate.set(new Date(2017, 9, 2, 6, 0));
      var expectedDate = new Date(2017, 9, 2, 10, 0);
      expect(bh.nextOpeningHour().getTime()).to.equal(expectedDate.getTime());
      MockDate.reset();
    });
    it("monday 2/10/2017 16:00, should return 2/10/2017 18:00", function() {
      MockDate.set(new Date(2017, 9, 2, 16, 0));
      var expectedDate = new Date(2017, 9, 2, 18, 0);
      expect(bh.nextOpeningHour().getTime()).to.equal(expectedDate.getTime());
      MockDate.reset();
    });
    it("sunday 1/10/2017 20:30, should return 1/10/2017 21:00", function() {
      MockDate.set(new Date(2017, 9, 1, 20, 30));
      var expectedDate = new Date(2017, 9, 1, 21, 0);
      expect(bh.nextOpeningHour().getTime()).to.equal(expectedDate.getTime());
      MockDate.reset();
    });
    it("sunday 1/10/2017 21:30, should return 2/10/2017 10:00", function() {
      MockDate.set(new Date(2017, 9, 1, 21, 30));
      var expectedDate = new Date(2017, 9, 2, 10, 0);
      expect(bh.nextOpeningHour().getTime()).to.equal(expectedDate.getTime());
      MockDate.reset();
    });
    it("tuesday(closed) 3/10/2017 18:30, should return 4/10/2017 10:00", function() {
      MockDate.set(new Date(2017, 9, 3, 18, 30));
      var expectedDate = new Date(2017, 9, 4, 10, 0);
      expect(bh.nextOpeningHour().getTime()).to.equal(expectedDate.getTime());
      MockDate.reset();
    });
  });
  //MockDate.set('1/1/2000');
  describe("init", function() {
    it("missing sunday", function() {
      expect(bh.init.bind(bh, hoursJson2)).to.throw(
        "Sunday is missing from config"
      );
    });
  });
});
