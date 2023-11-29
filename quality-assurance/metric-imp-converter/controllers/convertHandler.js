function ConvertHandler() {
  this.count = function(str, char) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === char) {
        count++;
      }
    }
    return count;
  }

  this.getNum = function(input) {
    let str = input.match(/[a-z]+|[^a-z]+/gi)[0];
    let opQnt = this.count(str, '/');

    if (!str.match(/[0-9]/g)) {
      str = 1;
    }

    if (opQnt > 1) {
      return 'invalid number';
    }
    else if (opQnt === 1) {
      let arr = str.split('/');
      let n1 = arr[0];
      let n2 = arr[1];
      return parseFloat(n1) / parseFloat(n2);
    }

    return str;
  };

  this.getUnit = function(input) {
    const unitsArr = ["km", "mi", "lbs", "kg", "gal", "l"];
    let str = input.match(/[a-z]+|[^a-z]+/gi);
    let unit = str[str.length - 1]

    unit = unit.toLowerCase()

    if (unitsArr.indexOf(unit) === -1) {
      return 'invalid unit';
    }

    if (unit === 'l') {
      return unit.toUpperCase();
    }

    return unit;
  };

  this.getReturnUnit = function(initUnit) {
    let convertUnit;

    initUnit = initUnit.toLowerCase()
    switch (initUnit) {
      case 'km':
        convertUnit = 'mi';
        break;
      case 'mi':
        convertUnit = 'km';
        break;
      case 'lbs':
        convertUnit = 'kg';
        break;
      case 'kg':
        convertUnit = 'lbs';
        break;
      case 'l':
        convertUnit = 'gal';
        break;
      case 'gal':
        convertUnit = 'L';
        break;
      default:
        convertUnit = 'invalid unit';
        break;
    }

    return convertUnit;
  };

  this.spellOutUnit = function(unit) {
    let spellStr;

    if (unit == undefined || unit == "invalid unit") {
      spellStr = "invalid unit";
    }
    else {
      const unitsDict = {
        kg: "kilograms",
        lbs: "pounds",
        mi: "miles",
        l: "liters",
        gal: "gallons",
        km: "kilometers"
      }
      spellStr = unitsDict[unit.toLowerCase()];
    }


    return spellStr;
  };

  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch (initUnit.toLowerCase()) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'l':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      default:
        result = 'invalid number';
        break;
    }

    if(result != 'invalid number'){
      result = Math.round(result * 1e5) / 1e5
    }
    
    return result;
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let str;

    if (initNum === undefined || initUnit === undefined) {
      return str;
    }

    initUnit = this.spellOutUnit(initUnit);
    returnUnit = this.spellOutUnit(returnUnit);
    str = initNum + " " + initUnit + " converts to " + returnNum + " " + returnUnit;

    return str;
  };

}

module.exports = ConvertHandler;
