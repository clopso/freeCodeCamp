'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function(app) {

  let convertHandler = new ConvertHandler();

  app.route("/api/convert")
    .get(function(req, res) {
      let input = req.query.input;

      let initNum, initUnit, returnNum, returnUnit, toString;
      
      initNum = convertHandler.getNum(input);
      initUnit = convertHandler.getUnit(input);
      if(initUnit != 'invalid unit'){
        returnNum = convertHandler.convert(initNum, initUnit);
        returnUnit = convertHandler.getReturnUnit(initUnit);
        toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      }
      
      const resp = {
        initNum: initNum,
        initUnit: initUnit,
        returnNum: returnNum,
        returnUnit: returnUnit,
        string: toString
      };

      if (initNum == "invalid number" && initUnit == "invalid unit") {
        res.json("invalid number and unit");
      }
      else if (initNum == "invalid number") {
        res.json(resp.initNum);
      }
      else if (initUnit == "invalid unit") {
        res.json(resp.initUnit);
      } else {
        res.json(resp);
      }
    });
};
