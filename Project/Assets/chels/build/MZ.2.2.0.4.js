"use strict";

//******************************
//  Current
//  v2.2.0.4
//  03/23/2017
//  ECG
//******************************
//  v2.2.0.4
//  03/23/2017
//  ECG
//  Added "&" as a never allowed character
//******************************
//  v2.2.0.3
//  3/22/2017
//  ECG
//  fixed bug in setColor
// fixed bug in textElement
//******************************
//  v2.2.0.2
//  ECG
//  Added UUID and Randowm String generator
//******************************
//v.2.2.0.1
//  ECG
//Added mz_ignore_value to $mz.constants
//******************************
//v.2.2.0.0
//  ECG
//Added extended phone number 
//validation for min and max area code
//and repeating numbers
//******************************
var $mz = $mz || {};
$mz = {
  //Private Vars
  //Do not change
  _emailValidationTries: 0,
  _attemptedEmail: '',
  _absoluteMaxLength: 200,
  _emValidating: false,
  //////////
  //Public Vars
  deviceId: null,
  deviceLicenseToken: null,
  online: null,
  inputType: null,
  //////////////
  //*************         ATTENTION        ***************
  //************  ONLY MODIFY THE $mz.cfg SECTION ***************
  cfg: {
    frmElem: {
      data: {
        id: "mz_Data"
      },
      prefix: "mz_",
      fname: {
        id: "FName"
      },
      lname: {
        id: "LName"
      },
      dob: {
        month: "mz_BirthMonth",
        day: "mz_BirthDay",
        year: "mz_BirthYear"
      },
      address: {
        id: "Address"
      },
      city: {
        id: "City"
      },
      state: {
        id: "State"
      },
      zip: {
        id: "Zip"
      },
      country: {
        id: "Country"
      },
      gender: {
        id: "Gender"
      },
      county: {
        id: "County"
      },
      expiration: {
        month: "mz_ExpMonth",
        day: "mz_ExpDay",
        year: "mz_ExpYear"
      }
    },
    randomIDCharacters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*$#@!-",
    settings: {
      emailValidationTimeout: 20000,
      onload: {
        execute: [{
          "func": function func() {
            $mz.preventCopyPasteCut();
          },
          "execute": true
        }, {
          "func": function func() {
            $mz.resetDDLColorOnChange();
          },
          "execute": true
        }, {
          "func": function func() {
            $mz.addOnKeypUpValidation();
          },
          "execute": true
        }, {
          "func": function func() {
            $mz.convertEmailInputType();
          },
          "execute": true
        }]
      },
      maxAreaCode: 989,
      minAreaCode: 201
    },
    validation: {
      chars: {
        neverAllowed: [';', '=', '&'],
        zip: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        number: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        phone: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        name: ['-', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '\''],
        email: ['.', '@', '_', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        address: ['/', '#', '.', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '\''],
        letternum: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      },
      dataAttribute: {
        type: {
          //allowable values = "Name","Zip","Email","Phone","Number","Address","FreeText","State","Gender","Month","Day","Year","Exempt","LetterNum"
          //"FreeText" means all but "neverAllowed" characters are allowed
          //"Exempt" means totally ignore
          "id": "data-type",
          "default": "Name"
        },
        allowExtendedValidation: {
          "id": "data-allow-extended",
          "default": {
            "name": false,
            "email": false,
            "address": false,
            "zip": false,
            "number": false,
            "phone": true,
            "freetext": false,
            "exempt": false,
            "letternum": false
          }
        },
        allowMask: {
          "id": "data-allow-mask",
          "default": {
            "name": false,
            "email": false,
            "address": false,
            "zip": false,
            "number": false,
            "phone": false,
            "freetext": false,
            "exempt": false,
            "letternum": false
          }
        },
        allowMidSpaces: {
          "id": "data-allow-midspaces",
          "default": {
            "name": true,
            "email": false,
            "address": true,
            "zip": false,
            "number": false,
            "phone": false,
            "freetext": true,
            "exempt": true,
            "letternum": false
          }
        },
        allowMultiple: {
          "id": "data-allow-multiple",
          "default": {
            "name": false,
            "email": false,
            "address": false,
            "zip": false,
            "number": false,
            "phone": false,
            "freetext": true,
            "exempt": true,
            "letternum": false
          }
        },
        capitalize: {
          "id": "data-capitalize",
          "default": {
            "name": "first",
            "email": "none",
            "address": "first",
            "zip": "none",
            "number": "none",
            "phone": "none",
            "freetext": "none",
            "exempt": "none",
            "letternum": "none"
          } //acceptable values = first,all,none,freetext,firstword

        },
        format: {
          submit: {
            id: "data-format-submit",
            "default": {
              "phone": "##########",
              "zip": "#####"
            }
          },
          display: {
            id: "data-format-display",
            "default": {
              "phone": "##########",
              "zip": "#####"
            }
          }
        },
        invalidMessageElemId: {
          id: "data-invalid-msgelementid",
          "default": {
            "email": null
          }
        },
        jsonOverrideInvalid: {
          "id": "data-json-override-invalid",
          "default": null
        },
        //as of 11/27/2014, only used with Gender
        //this can be used to override the normal values
        //Gender is an example
        //
        //the json overide for Gender should be formatted like:
        //{"male":"MaleValHere","female":"FemaleValHere"}
        //see setGenderElem
        //accessed by $mz.cfg.validation.dataAttribute.jsonOverrideValue
        jsonOverrideValue: {
          "id": "data-json-override-value",
          "default": null
        },
        //as of 11/27/2014, only works for data-type="Phone"
        //used in conjunction with data-allow-mask
        //characters that will be automatically added to valid character list
        //found at  $mz.cfg.validation.chars for the data-type
        //accessed by $mz.cfg.validation.dataAttribute.maskCharacters
        maskCharacters: {
          "id": "data-mask-characters",
          "default": {
            "name": "",
            "email": "",
            "address": "",
            "zip": "",
            "phone": "(,),-,_, ",
            "freetext": "",
            "exempt": "",
            "letternum": "-,_"
          }
        },
        maxLength: {
          "id": "data-max-length",
          "default": {
            "name": 200,
            "email": 200,
            "address": 200,
            "zip": 5,
            "number": 10,
            "phone": 10,
            //should be length of phone number as it would appear in the data submit string
            "freetext": 200,
            "exempt": 200,
            "letternum": 6
          }
        },
        minLength: {
          "id": "data-min-length",
          "default": {
            "name": 2,
            "email": 7,
            "address": 2,
            "zip": 5,
            "number": 10,
            "phone": 10,
            "freetext": 0,
            "exempt": 0,
            "letternum": 6
          }
        },
        optional: {
          "id": "data-optional",
          "default": false
        },
        removeMaskOnSubmit: {
          "id": "data-onsubmit-remove-mask",
          "default": true
        },
        validateOnKeyUp: {
          "id": "data-validate-onkeyup",
          "default": {
            "name": true,
            "email": true,
            "address": true,
            "zip": true,
            "number": true,
            "phone": true,
            "freetext": true,
            "exempt": false,
            "letternum": true
          }
        },
        validateOnline: {
          "id": "data-validate-online",
          "default": false
        },
        validateOnlineMaxTries: {
          "id": "data-validate-online-maxtries",
          "default": {
            "email": 1
          }
        }
      },
      color: {
        valid: {
          background: {
            hex: "#ffffff",
            rgb: "rgb(255,255,255)"
          },
          border: {
            hex: "#ffffff",
            rgb: "rgb(255,255,255)"
          }
        },
        invalid: {
          background: {
            hex: "#FFFF00",
            rgb: "rgb(255,255,0)"
          },
          border: {
            hex: "#FF0000",
            rgb: "rgb(255,0,0)"
          }
        }
      }
    }
  },
  //*************         ATTENTION        ***************
  //************  DO NOT MODIFY BELOW THIS LINE ***************
  constants: {
    'JSON_BASE_URL': 'https://api.smartactivator.com/',
    ios: "iOS",
    android: "Android",
    windows: "Windows",
    mz_ignore_value: "MZ-IGNORE-RESULT-MZ"
  },
  addOnKeypUpValidation: function addOnKeypUpValidation() {
    var controls = document.getElementsByTagName("input");

    var addEventFunction = function addEventFunction(e) {
      $mz.validate.onkeyup(this);
    };

    var attachEventFunction = function attachEventFunction() {
      $mz.validate.onkeyup(this);
    };

    for (var i = 0; i < controls.length; i++) {
      if ($mz.validate.getValidationType(controls[i]).toLowerCase() !== "exempt" && $mz.validate.getValidateOnKeyUp(controls[i]) && (controls[i].type.toLowerCase() === "text" || controls[i].type.toLowerCase() === "tel" || controls[i].type.toLowerCase() === "email" || controls[i].type.toLowerCase() === "number" || controls[i].type.toLowerCase() === "hidden")) {
        $mz.attachEvent(controls[i], "keyup", addEventFunction, attachEventFunction);
      }
    }

    var controls2 = document.getElementsByTagName("textarea");

    for (var j = 0; j < controls2.length; j++) {
      $mz.attachEvent(controls2[j], "keyup", addEventFunction, attachEventFunction);
    }
  },
  attachEvent: function attachEvent(obj, eventName, addEventFunction, attachEventFunction) {
    if (obj.addEventListener) {
      obj.addEventListener(eventName, addEventFunction, false);
    } else if (obj.attachEvent) {
      obj.attachEvent('on' + eventName, attachEventFunction);
    }
  },
  capitalize: {
    all: function all(val) {
      val = val.toUpperCase();
      return val;
    },
    first: function first(val) {
      //val = val.toLowerCase();
      var s = val.split(' ');
      var nuStr = '';

      for (var i = 0; i < s.length; i++) {
        nuStr += s[i].substring(0, 1).toUpperCase();

        if (s[i].length > 1) {
          nuStr += s[i].substring(1);
        }

        if (s.length > 1 && i < s.length - 1) {
          nuStr += " ";
        }
      }

      val = nuStr;
      s = val.split('-');
      nuStr = '';

      for (var i = 0; i < s.length; i++) {
        nuStr += s[i].substring(0, 1).toUpperCase();

        if (s[i].length > 1) {
          nuStr += s[i].substring(1);
        }

        if (s.length > 1 && i < s.length - 1) {
          nuStr += "-";
        }
      }

      return nuStr;
    },
    firstword: function firstword(val) {
      var nuStr = val;

      if (val.trim() !== "") {
        var prefix = '';

        for (var i = 0; i < val.length; i++) {
          if ($mz.isLetter(val[i], 1)) {
            var first = val.substring(i, i + 1).toUpperCase();
            nuStr = prefix + first + val.substring(i + 1, val.length).toLowerCase();
            break;
          } else {
            prefix += val[i];
          }
        }
      }

      return nuStr;
    },
    freetext: function freetext(val) {
      return val;
    },
    none: function none(val) {
      val = val.toLowerCase();
      return val;
    }
  },
  convertEmailInputType: function convertEmailInputType() {
    if ($mz.util.os().toLowerCase() === "android") {
      var controls = document.getElementsByTagName("input");

      for (var i = 0; i < controls.length; i++) {
        if (controls[i].type.toLowerCase() === "email") {
          controls[i].type = 'text';
        }
      }
    }
  },
  escapeCodes: [{
    code: '&#13;',
    value: '\r'
  }, {
    code: '&#10;',
    value: '\n'
  }, {
    code: '&amp;',
    value: '&'
  }, {
    code: '&gt;',
    value: '>'
  }, {
    code: '&lt;',
    value: '<'
  }, {
    code: '&apos;',
    value: "'"
  }, {
    code: '&#39;',
    value: "'"
  }, {
    code: '&#38;',
    value: '&'
  }, {
    code: '&#62;',
    value: '>'
  }, {
    code: '&#60;',
    value: '<'
  }],
  find: function find(id) {
    return document.getElementById(id);
  },
  getCursorPosition: function getCursorPosition(obj) {
    //This will not work on HTML elements of type='email'
    //Those types must be converted to type='text'
    //There are other types that will not work either
    var cursorPos = 0; // IE Support 

    if (document.selection) {
      obj.focus();
      var sel = document.selection.createRange();
      sel.moveStart('character', -obj.value.length);
      cursorPos = sel.text.length;
    } else if (obj.selectionStart || obj.selectionStart === '0 ') cursorPos = obj.selectionStart;

    return cursorPos;
  },
  getRandomString: function getRandomString(len) {
    if (typeof len === "undefined" || len === null) {
      len = 20;
    }

    var text = "";
    var charset = $mz.cfg.randomIDCharacters;

    for (var i = 0; i < len; i++) {
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return text;
  },
  getUniqueGUID: function getUniqueGUID() {
    var UUID = function () {
      var self = {};
      var lut = [];

      for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + i.toString(16);
      }

      self.generate = function () {
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
      };

      return self;
    }();

    return UUID.generate();
  },
  hexToRGB: function hexToRGB(hex) {
    var bigint = parseInt(hex, 16);
    var r = bigint >> 16 & 255;
    var g = bigint >> 8 & 255;
    var b = bigint & 255;
    return r + ", " + g + ", " + b;
  },
  isAllTheSame: function isAllTheSame(val) {
    val = val.toString();

    for (var i = 1; i < val.length; i++) {
      if (val[i] !== val[i - 1]) {
        return false;
      }
    }

    return true;
  },
  isLetter: function isLetter(val) {
    if (typeof val !== "undefined" && val !== null) {
      return /^[a-zA-Z]*$/.test(val);
    }

    return false;
  },
  isNumeric: function isNumeric(val, len) {
    if (typeof val !== "undefined" && val !== null) {
      if (val.replace(' ', '').length === len && !isNaN(val) && isFinite(val)) {
        return true;
      }
    }

    return false;
  },
  onload: function onload() {
    var funcs = $mz.cfg.settings.onload.execute;

    for (var i = 0; i < funcs.length; i++) {
      if (funcs[i].execute === true) {
        funcs[i].func();
      }
    }
  },
  padLeft: function padLeft(str, ch, len) {
    var s = '';

    if (typeof str !== "undefined" && str !== null) {
      s = str.toString(), ch = ch || '0';

      while (s.length < len) {
        s = ch + s;
      }
    }

    return s;
  },
  preventCopyPasteCut: function preventCopyPasteCut() {
    var controls = document.getElementsByTagName("*");

    var addEventFunction = function addEventFunction(e) {
      e.preventDefault();
    };

    var attachEventFunction = function attachEventFunction() {
      return false;
    };

    for (var i = 0; i < controls.length; i++) {
      if ($mz.validate.getValidationType(controls[i]).toLowerCase() !== "exempt") {
        $mz.attachEvent(controls[i], "copy", addEventFunction, attachEventFunction);
        $mz.attachEvent(controls[i], "paste", addEventFunction, attachEventFunction);
        $mz.attachEvent(controls[i], "cut", addEventFunction, attachEventFunction);
      }
    }
  },
  resetDDLColorOnChange: function resetDDLColorOnChange() {
    var controls = document.getElementsByTagName("select");

    var addEventFunction = function addEventFunction(e) {
      this.style.backgroundColor = $mz.cfg.validation.color.valid.background.hex;
    };

    var attachEventFunction = function attachEventFunction() {
      this.style.backgroundColor = $mz.cfg.validation.color.valid.background.hex;
    };

    for (var i = 0; i < controls.length; i++) {
      if (controls[i].type === "select-one" && controls[i].id.toLowerCase().indexOf('emaildomain') == -1) {
        $mz.attachEvent(controls[i], "change", addEventFunction, attachEventFunction);
      }
    }
  },
  setCursorPosition: function setCursorPosition(obj, pos) {
    try {
      if (obj.setSelectionRange) {
        obj.focus();
        obj.setSelectionRange(pos, pos);
      } else if (obj.createTextRange) {
        var range = obj.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.Select();
      }
    } catch (e) {}
  },
  setElement: function setElement(id, val) {
    var obj = $mz.find(id);

    if (typeof obj !== "undefined" && obj !== null) {
      var type = $mz.validate.getValidationType(obj).toLowerCase();

      if ((obj.type.toLowerCase() === "text" || obj.type.toLowerCase() === "textarea" || obj.type.toLowerCase() === "tel" || obj.type.toLowerCase() === "email" || obj.type.toLowerCase() === "number" || obj.type.toLowerCase() === "hidden") && (type === "name" || type === "city" || type === "address" || type === "email" || type === "phone" || type === "number" || type === "exempt" || type === "freetext")) {
        $mz.validate.setTextElem(obj, val);
      } else if (type === "zip") {
        $mz.validate.setZipElem(obj, val);
      } else if (obj.type === "select-one" && type === "state") {
        $mz.validate.setStateElem(obj, val);
      } else if (obj.type === "select-one" && type === "gender") {
        $mz.validate.setGenderElem(obj, val);
      } else if (obj.type === "select-one" && (type === "month" || type === "day" || type === "year")) {
        $mz.validate.setElemValue(obj, val);
      } else if (obj.type === "select-one") {
        $mz.validate.setElemValue(obj, val);
      } else if (obj.type === "checkbox") {
        $mz.validate.setCheckBox(obj, val);
      }
    }
  },
  unescape: function unescape(data) {
    var escCodes = $mz.escapeCodes;

    for (var i = 0; i < escCodes.length; i++) {
      data = data.replace(escCodes[i].code, escCodes[i].value);
    }

    return data;
  },
  util: {
    online: function online() {
      if (typeof $mz.online !== "undefined" && $mz.online !== null && $mz.online.toLowerCase().trim() === "online") {
        return true;
      }

      return false;
    },
    deviceId: function deviceId() {
      if (typeof $mz.deviceId !== "undefined" && $mz.deviceId !== null && $mz.deviceId.toLowerCase().indexOf("{") === -1) {
        return $mz.deviceId;
      }

      return null;
    },
    deviceLicenseToken: function deviceLicenseToken() {
      if (typeof $mz.deviceLicenseToken !== "undefined" && $mz.deviceLicenseToken !== null && $mz.deviceLicenseToken.toLowerCase().indexOf("{") === -1) {
        return $mz.deviceLicenseToken;
      }

      return null;
    },
    os: function os() {
      if (navigator.appVersion.toLowerCase().indexOf("android") > -1 || navigator.appVersion.toLowerCase().indexOf("linux") > -1) {
        return $mz.constants.android;
      } else if (navigator.appVersion.toLowerCase().indexOf("ipad") > -1 || navigator.appVersion.toLowerCase().indexOf("iphone") > -1 || navigator.appVersion.toLowerCase().indexOf("mac") > -1) {
        return $mz.constants.ios;
      } else if (navigator.appVersion.toLowerCase().indexOf("windows") > -1) {
        return $mz.constants.windows;
      }

      return null;
    },
    callService: function callService(args) {
      try {
        $.ajax({
          url: args.url,
          type: args.type,
          data: args.data,
          dataType: args.dataType,
          header: args.header,
          beforeSend: args.beforeSendCallback,
          error: function error(b) {
            if ('json' === args.dataType) console.log("ERROR: " + JSON.stringify(b));else console.log("ERROR: " + b);
            if (undefined !== args.onError) args.onError(b);
          },
          success: function success(c) {
            if (undefined !== args.onSuccess) args.onSuccess(c);
          },
          timeout: args.timeout
        });
      } // try
      catch (error) {
        console.log(error.message);
        args.callback({
          result: false,
          data: null
        });
      }
    },
    distance: function distance(lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var radlon1 = Math.PI * lon1 / 180;
      var radlon2 = Math.PI * lon2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;

      if (unit === "K") {
        dist = dist * 1.609344;
      }

      if (unit === "N") {
        dist = dist * 0.8684;
      }

      return dist.toFixed(1);
    },
    getServiceError: function getServiceError(response) {
      try {
        if (0 < response.responseText.length) {
          var jsonResponse = jQuery.parseJSON(response.responseText);
          return jsonResponse.status;
        } else return response.status;
      } catch (e) {
        console.log(e.message);
      }

      return 0;
    }
  },
  validate: {
    address: function address(obj) {
      num = /[0-9]/;
      letter = /[A-Za-z]/;
      var val = obj.value.trim();
      var addresslength = val.length;
      var spaces = 0;
      var thespace = " ";

      for (i = 0; i < addresslength; i++) {
        if (val[i] === thespace) {
          spaces++;
        }
      }

      if (spaces < 1 || addresslength < 4 || !num.test(val) || !letter.test(val)) {
        return false;
      }

      return true;
    },
    ageRange: function ageRange(dob, minAge, maxAge) {
      var today = new Date();
      var birthDate = new Date(dob);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
        age--;
      }

      if (age > maxAge) return "Over";else if (age >= minAge && age <= maxAge) return "In";else return "Under";
    },
    capitalize: function capitalize(obj) {
      if (obj.value.trim() !== "" && $mz.validate.getValidationType(obj).toLowerCase() !== "exempt") {
        var capitalize = $mz.validate.getCapitalize(obj).toLowerCase().trim();
        val = $mz.capitalize[capitalize](obj.value); //var pos = $mz.getCursorPosition(obj);

        $mz.validate.setElemValue(obj, val); // $mz.setCursorPosition(obj, pos)
      }
    },
    date: {
      dropdowns: function dropdowns(objMon, objDay, objYr) {
        var setColor = $mz.validate.setColor;
        setColor(objMon, true); //objMon.style.backgroundColor = $mz.cfg.validation.color.valid.background.hex;

        setColor(objDay, true); //objDay.style.backgroundColor = $mz.cfg.validation.color.valid.background.hex;

        setColor(objYr, true); //objYr.style.backgroundColor = $mz.cfg.validation.color.valid.background.hex;

        var mon = $mz.validate.element(objMon);
        var day = $mz.validate.element(objDay);
        var yr = $mz.validate.element(objYr);

        if (!mon || !day || !yr) {
          return false;
        } else {
          var dt = $mz.padLeft(objMon.options[objMon.selectedIndex].value, '0', 2) + "/" + $mz.padLeft(objDay.options[objDay.selectedIndex].value, '0', 2) + "/" + objYr.options[objYr.selectedIndex].value;
          var isValid = $mz.validate.date.string(dt);

          if (!isValid) {
            setColor(objDay, false); //objDay.style.backgroundColor = $mz.cfg.validation.color.invalid.background.hex;
          }

          return isValid;
        }
      },
      string: function string(dateStr) {
        try {
          //string should be a MM/dd/yyyy format
          var p = dateStr.split('/');

          if (p.length === 3) {
            var m = parseInt(p[0]);
            var d = parseInt(p[1]);
            var y = parseInt(p[2]);
            var leapYr = y % 4 === 0 ? true : false;

            if (!leapYr && d > 28 && m === 2) {
              return false;
            } else if (leapYr && d > 29 && m === 2) {
              return false;
            } else if (d > 30 && (m === 4 || m === 6 || m === 9 || m === 11)) {
              return false;
            }

            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      },
      twoDates: function twoDates(lesserDate, greaterDate, allowEqualTo) {
        //dates should be a MM/dd/yyyy format
        try {
          var p1 = lesserDate.split('/');
          var p2 = greaterDate.split('/');
          var allowEqual = typeof allowEqualTo === "undefined" || allowEqualTo === null ? true : allowEqualTo;

          if (p1.length === 3 && p2.length === 3) {
            var m1 = parseInt(p1[0]);
            var d1 = parseInt(p1[1]);
            var y1 = parseInt(p1[2]);
            var m2 = parseInt(p2[0]);
            var d2 = parseInt(p2[1]);
            var y2 = parseInt(p2[2]);
            var date1 = new Date(y1, m1 - 1, d1, 0, 0, 0, 0);
            var date2 = new Date(y2, m2 - 1, d2, 0, 0, 0, 0);

            if (allowEqual) {
              return date1 <= date2;
            }

            return date1 < date2;
          }
        } catch (e) {
          return false;
        }
      }
    },
    dropdownElement: function dropdownElement(obj) {
      var valid = true;
      var optional = $mz.validate.getOptional(obj);

      if (!optional && typeof obj.selectedIndex !== "undefined" && obj.options[obj.selectedIndex].value === "") {
        valid = false;
      }

      return valid;
    },
    element: function element(obj, trimVal) {
      var validElem = true;
      trimVal = trimVal === null ? false : trimVal;

      if (obj.type.toLowerCase() === "text" || obj.type.toLowerCase() === "textarea" || obj.type.toLowerCase() === "tel" || obj.type.toLowerCase() === "email" || obj.type.toLowerCase() === "number") {
        validElem = $mz.validate.textElement(obj, trimVal);
      } else if (obj.type.toLowerCase() === "select-one") {
        validElem = $mz.validate.dropdownElement(obj);
      }

      $mz.validate.setColor(obj, validElem); //obj.style.backgroundColor = validElem ? $mz.cfg.validation.color.valid.background.hex : $mz.cfg.validation.color.invalid.background.hex;

      return validElem;
    },
    email: function email(obj) {
      var regEx = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(aero|coop|info|museum|name))$/; //could just do the split and not check for multiple
      //but might need to in future

      if ($mz.validate.getAllowMultiple(obj)) {
        var emails = obj.value.split(',');

        for (var i = 0; i < emails.length; i++) {
          if (!regEx.test(emails[i])) {
            return false;
          }
        }
      } else if (!regEx.test(obj.value)) {
        return false;
      }

      return true;
    },
    emailByOnlineService: function emailByOnlineService(obj, callback) {
      if ($mz._emValidating === false) {
        //console.log("Validating Email: " + obj.value);
        $mz._emValidating = true;
        var online = $mz.util.online();
        var os = $mz.util.os();
        var optional = $mz.validate.getOptional(obj);
        var val = obj.value.trim();

        if (optional && val === '' || !online || os === null || os === $mz.constants.ios && $mz.util.deviceLicenseToken() === null || os === $mz.constants.android && $mz.util.deviceId() === null || os === $mz.constants.windows && $mz.util.deviceLicenseToken() === null) {
          callback(true);
          $mz._emValidating = false;
        } else if (!optional && val === '') {
          callback(false);
          $mz._emValidating = false;
        } else {
          var validateOnline = online ? $mz.validate.getValidateOnline(obj) : false;

          if (validateOnline) {
            var validate = function validate(i) {
              if (i < s.length) {
                $mz.validate._emailOnline(s[i], function (valid) {
                  if (!valid) {
                    isValid = false;
                  }

                  i++;
                  validate(i);
                });
              } else {
                callback(isValid);
                $mz._emValidating = false;
              }
            };

            var isValid = true;
            var s = val.split(',');
            var attemptedTries = $mz._emailValidationTries;
            var maxTries = $mz.validate.getValidateOnlineMaxTries(obj);

            if (val !== $mz._attemptedEmail || attemptedTries < maxTries) {
              if (val !== $mz._attemptedEmail) {
                $mz._emailValidationTries = 0;
              }

              $mz._attemptedEmail = val;
              validate(0);
            } else {
              callback(true);
              $mz._emValidating = false;
            }
          } else {
            callback(true);
            $mz._emValidating = false;
          }
        }
      } else {//console.log("Not Validating Email: " + obj.value);
      }
    },
    _emailOnline: function _emailOnline(email, callback) {
      //TODO
      if (typeof $ !== "undefined" && $ !== null) {
        var error = function error(response) {
          //onError({ error: util.getServiceError(response) });
          //console.log($mz.util.getServiceError(response));
          //console.log("error Callback");
          //console.log(response.statusText);
          //console.log(response.responseText);
          callback(true);
          return;
        };

        var success = function success(response) {
          //console.log(response.status);
          //console.log(response.validation);
          //if (0 === response.status && response.validation.toLowerCase()==="valid") {
          if (response.validation.toLowerCase() === "invalid") {
            $mz._emailValidationTries++;
            callback(false);
            return;
          }

          callback(true);
        };

        var setHeader = function setHeader(xhr) {
          // var info = config.licenseInfo();
          //alert($mz.util.os());
          if (info.token !== null && ($mz.util.os() === $mz.constants.ios || $mz.util.os() === $mz.constants.windows)) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + info.token);
          }
        };

        try {
          var info = {
            "token": $mz.util.deviceLicenseToken()
          };
          var data = $mz.util.os() === $mz.constants.android ? {
            emailAddress: email,
            deviceId: $mz.util.deviceId()
          } : {
            emailAddress: email
          };
          var serviceArgs = {
            url: $mz.constants.JSON_BASE_URL + "consumer/validateemail",
            type: "POST",
            data: data,
            dataType: "json",
            beforeSendCallback: setHeader,
            onSuccess: success,
            onError: error,
            timeout: $mz.cfg.settings.emailValidationTimeout
          }; //alert(JSON.stringify(serviceArgs));

          $mz.util.callService(serviceArgs);
        } catch (e) {
          console.log(e.message);
          callback(true);
        }
      } else {
        console.log("No $");
        callback(true);
      }
    },
    getAllowExtendedValidation: function getAllowExtendedValidation(obj) {
      return $mz.validate.getDataAttr(obj, "allowExtendedValidation");
    },
    getAllowMask: function getAllowMask(obj) {
      return $mz.validate.getDataAttr(obj, "allowMask");
    },
    getAllowMidSpaces: function getAllowMidSpaces(obj) {
      return $mz.validate.getDataAttr(obj, "allowMidSpaces");
    },
    getAllowMultiple: function getAllowMultiple(obj) {
      return $mz.validate.getDataAttr(obj, "allowMultiple");
    },
    getCapitalize: function getCapitalize(obj) {
      return $mz.validate.getDataAttr(obj, "capitalize");
    },
    getDataAttr: function getDataAttr(obj, attr) {
      var dataAttribute = $mz.cfg.validation.dataAttribute;
      var output = obj.getAttribute(dataAttribute[attr].id);

      if (output === null && typeof dataAttribute[attr]["default"] !== "undefined") {
        var type = $mz.validate.getValidationType(obj);

        if (dataAttribute[attr]["default"] !== null && typeof dataAttribute[attr]["default"][type.toLowerCase()] !== "undefined") {
          output = dataAttribute[attr]["default"][type.toLowerCase()];
        } else {
          output = dataAttribute[attr]["default"];
        }
      }

      if (output !== null && typeof output === "string") {
        output = output.toLowerCase() === "true" ? true : output.toLowerCase() === "false" ? false : output;
      }

      return output;
    },
    getInvalidMsgElemId: function getInvalidMsgElemId(obj) {
      return $mz.validate.getDataAttr(obj, "invalidMessageElemId");
    },
    getJSONOverrideInvalid: function getJSONOverrideInvalid(obj) {
      return $mz.validate.getDataAttr(obj, "jsonOverrideInvalid");
    },
    getJSONOverrideValue: function getJSONOverrideValue(obj) {
      return $mz.validate.getDataAttr(obj, "jsonOverrideValue");
    },
    getMaskCharacters: function getMaskCharacters(obj) {
      return $mz.validate.getDataAttr(obj, "maskCharacters");
    },
    getMaxLength: function getMaxLength(obj) {
      return $mz.validate.getDataAttr(obj, "maxLength");
    },
    getMinLength: function getMinLength(obj) {
      return $mz.validate.getDataAttr(obj, "minLength");
    },
    getOptional: function getOptional(obj) {
      return $mz.validate.getDataAttr(obj, "optional");
    },
    getRemoveMask: function getRemoveMask(obj) {
      return $mz.validate.getDataAttr(obj, "removeMaskOnSubmit");
    },
    getValidateOnKeyUp: function getValidateOnKeyUp(obj) {
      return $mz.validate.getDataAttr(obj, "validateOnKeyUp");
    },
    getValidateOnline: function getValidateOnline(obj) {
      return $mz.validate.getDataAttr(obj, "validateOnline");
    },
    getValidateOnlineMaxTries: function getValidateOnlineMaxTries(obj) {
      return $mz.validate.getDataAttr(obj, "validateOnlineMaxTries");
    },
    getValidationType: function getValidationType(obj) {
      var dataAttribute = $mz.cfg.validation.dataAttribute;
      var output = obj.getAttribute(dataAttribute.type.id);

      if (output === null) {
        output = dataAttribute.type["default"];
      }

      return output;
    },
    getValidValue: function getValidValue(obj, val, type) {
      type = typeof type === "undefined" || type === null ? $mz.validate.getValidationType(obj).toLowerCase() : type;

      if (typeof val === "undefined" || val === null) {
        val = obj.value;
      }

      var maxLength = $mz.validate.getMaxLength(obj);
      var allowMultiple = $mz.validate.getAllowMultiple(obj);

      if (allowMultiple) {
        maxLength = $mz._absoluteMaxLength;
        var vals = val.split(',');
        var nuVal = [];

        for (var i = 0; i < vals.length; i++) {
          nuVal.push($mz.validate._getValidValue(obj, vals[i], type));
        }

        val = '';

        for (var i = 0; i < nuVal.length; i++) {
          val += nuVal[i];

          if (i < nuVal.length - 1) {
            val += ",";
          }
        }
      } else {
        val = $mz.validate._getValidValue(obj, val, type);
        return val;
      }

      val = val.substring(0, maxLength);
      return val;
    },
    _getValidValue: function _getValidValue(obj, val, type) {
      try {
        type = typeof type === "undefined" || type === null ? $mz.validate.getValidationType(obj).toLowerCase() : type;
        var maxLength = $mz.validate.getMaxLength(obj); //var allowMultiple = $mz.validate.getAllowMultiple(obj);
        //if (allowMultiple) {
        //    maxLength = $mz._absoluteMaxLength;
        //}

        if (typeof val === "undefined" || val === null) {
          val = obj.value;
        }

        if (type === "exempt") {
          val = val.substring(0, maxLength);
          return val;
        }

        if (type === "freetext") {
          val = $mz.validate.removeNeverAllowed(val);
          val = val.substring(0, maxLength);
          return val;
        }

        var charArr = $mz.cfg.validation.chars[type.toLowerCase()];
        var validCharArr = new Array(charArr.length);

        for (var e = 0; e < charArr.length; e++) {
          validCharArr[e] = charArr[e];
        }

        var allowMidSpaces = $mz.validate.getAllowMidSpaces(obj);
        var allowMask = $mz.validate.getAllowMask(obj);

        if (allowMask) {
          var sChr = $mz.validate.getMaskCharacters(obj).split(',');
          maxLength += sChr.length;

          for (var i = 0; i < sChr.length; i++) {
            if (sChr[i] === " ") {
              allowMidSpaces = true;
            }

            validCharArr.push(sChr[i]);
          }
        } //no leading space


        while (val.indexOf(' ') === 0) {
          val = val.substr(1);
        } //remove double or greater spacing


        while (val.indexOf('  ') > 0) {
          val = val.replace('  ', ' ');
        }

        var found = false;
        var chr = '';
        var str = val;
        var iMax = str.length;

        for (var i = 0; i < iMax; i++) {
          found = false;
          chr = str.charAt(i);

          if (i === 0 && chr === ' ') {
            val = val.trim();
          }

          for (var j = 0; j < validCharArr.length; j++) {
            if (chr === validCharArr[j]) {
              found = true;
              break;
            }
          }

          if (!found && allowMidSpaces && chr !== ' ') {
            while (val.indexOf(chr) > -1) {
              val = val.replace(chr, '');
            } // val = val.replace(hr, '');

          } else if (!found && !allowMidSpaces) {
            while (val.indexOf(chr) > -1) {
              val = val.replace(chr, '');
            }
          }
        }

        if (!allowMidSpaces || type === "email") {
          while (val.indexOf(' ') > 0) {
            val = val.replace(' ', '');
          } // val = val.replace(' ', '');

        }

        if (type === "email") {
          val = val.trim();
        }

        val = val.substring(0, maxLength); // alert("'" + val + "'");
      } catch (e) {
        alert(e.message);
      }

      return val;
    },
    onkeyup: function onkeyup(obj) {
      try {
        var type = $mz.validate.getValidationType(obj).toLowerCase();

        if (type !== "exempt") {
          var elemType = "text";

          if (obj.type.toLowerCase() === "email") {
            elemType = "email";
            obj.type = "text";
          }

          var pos = $mz.getCursorPosition(obj);
          var objVal = $mz.validate.getValidValue(obj);

          if (objVal === obj.value) {
            // obj.value = objVal.replace("'", "`");
            $mz.validate.setColor(obj, true); //obj.style.backgroundColor = $mz.cfg.validation.color.valid.background.hex;

            if (type === "email") {
              var alertElem = $mz.validate.getInvalidMsgElemId(obj);

              if (alertElem !== null) {
                $mz.find(alertElem).style.display = "none";
              }
            }
          } else {
            obj.value = objVal; //.replace("'","`");

            pos--;
          }

          $mz.validate.capitalize(obj);
          $mz.setCursorPosition(obj, pos);

          if (elemType === "email") {
            obj.type = "email";
          }
        }
      } catch (e) {
        alert(e.message);
      }
    },
    onsubmit: function onsubmit(containerName, callback) {
      var validate = $mz.validate;
      var valid = true;
      var validElem = true;
      var elems = $mz.find(containerName).elements;
      var color = $mz.cfg.validation.color;
      var emailIndex = -1;

      function validateObj(i) {
        if (i < elems.length) {
          var type = $mz.validate.getValidationType(elems[i]).toLowerCase();

          if (type !== "exempt") {
            validElem = validate.element(elems[i]);

            if (type === "email" && validElem && elems[i].value !== "") {
              var validateEmailCallBack = function validateEmailCallBack(isvalid) {
                if (alertElem !== null) {
                  $mz.find(alertElem).style.display = isvalid ? "none" : "inline";
                }

                valid = valid ? isvalid : valid;
                $mz.validate.setColor(elems[emailIndex], isvalid); // elems[emailIndex].style.backgroundColor = isvalid ? $mz.cfg.validation.color.valid.background.hex : $mz.cfg.validation.color.invalid.background.hex;

                i++;
                validateObj(i);
                return valid;
              };

              emailIndex = i;
              var alertElem = validate.getInvalidMsgElemId(elems[emailIndex]);
              alertElem = typeof alertElem !== "undefined" && alertElem !== null && alertElem.trim() !== "" ? alertElem : null;

              if (alertElem !== null) {
                $mz.find(alertElem).style.display = "none";
              }

              validate.emailByOnlineService(elems[emailIndex], validateEmailCallBack);
            } else {
              valid = valid ? validElem : valid; // elems[i].style.backgroundColor = validElem ? color.valid.background.hex : color.invalid.background.hex;

              i++;
              validateObj(i);
              return valid;
            }
          } else {
            i++;
            validateObj(i);
            return valid;
          }
        } else {
          if (typeof callback !== "undefined" && callback !== null) {
            callback(valid);
          } else {
            return valid;
          }
        }
      }

      return validateObj(0);
    },
    phone: function phone(obj) {
      var validate = $mz.validate;
      var val = validate.removeMask(obj);
      var numbers = val.split(',');
      var valid = true;
      var minLength = validate.getMinLength(obj);
      var maxLength = validate.getMaxLength(obj);

      for (var i = 0; i < numbers.length; i++) {
        if (!$mz.isNumeric(numbers[i], minLength) || !$mz.isNumeric(numbers[i], maxLength)) {
          return false;
        } else if (validate.getAllowExtendedValidation(obj) && !validate.phoneNumber(numbers[i])) {
          return false;
        }
      }

      return valid;
    },
    phoneNumber: function phoneNumber(val) {
      //Area code (first three digits) cannot be less than 201 or greater than 989
      //Cannot have all repeating numeric digits
      //Starting at 4th character cannot have all repeating numeric digits.
      //Cannot equal "1234567890", this is covered by the area code rule
      var f3 = parseInt(val.substring(0, 3));
      return f3 >= $mz.cfg.settings.minAreaCode & f3 <= $mz.cfg.settings.maxAreaCode & !$mz.isAllTheSame(val) & !$mz.isAllTheSame(val.substring(3));
    },
    radioButtonGroup: function radioButtonGroup(grpName) {
      var elems = document.getElementsByName(grpName);

      for (var i = 0; i < elems.length; i++) {
        if (elems[i].checked) return true;
      }

      return false;
    },
    removeNeverAllowed: function removeNeverAllowed(val) {
      var arr = $mz.cfg.validation.chars.neverAllowed;

      if (typeof arr !== "undefined" && arr !== null) {
        for (var i = 0; i < arr.length; i++) {
          //replace not replace all instances when set
          //like val.replace(arr[i], '');
          //have to use a while loop
          while (val.indexOf(arr[i]) > -1) {
            val = val.replace(arr[i], '');
          }
        }
      }

      return val;
    },
    removeMask: function removeMask(obj) {
      var val; // = obj.value;

      try {
        var maskedtextbox = $(obj).data("kendoMaskedTextBox");

        if (typeof maskedtextbox !== "undefined" && maskedtextbox !== null) {
          var raw = maskedtextbox.raw();
          val = raw;
          return val;
        }
      } catch (e) {}

      val = obj.value;
      var maskChrs = $mz.validate.getMaskCharacters(obj).split(',');

      for (var i = 0; i < maskChrs.length; i++) {
        while (val.indexOf(maskChrs[i]) > -1) {
          val = val.replace(maskChrs[i], '');
        }
      }

      return val;
    },
    removeDataTagAndNull: function removeDataTagAndNull(containerName) {
      var elems = $mz.find(containerName).elements;
      var type = '';

      for (var i = 0; i < elems.length; i++) {
        type = elems[i].type.toLowerCase();

        if (type === "text" || type === "tel" || type === "hidden" || type === "textarea" || type === "number" || type === "email" || type === "hidden") {
          var val = elems[i].value.trim();

          if (val.indexOf('{') > -1 && val.indexOf('}') > -1 || val.toLowerCase() === 'ull' || val.toLowerCase() === 'null' || val.toLowerCase() === 'undefined') {
            elems[i].value = '';
          }
        }
      }
    },
    setCheckBox: function setCheckBox(obj, val) {
      if (val.toString().toLowerCase() === "yes" || val.toString().toLowerCase() === "true") {
        obj.checked = true;
      } else {
        obj.checked = false;
      }
    },
    setColor: function setColor(obj, valid) {
      var override = $mz.validate.getJSONOverrideInvalid(obj);

      if (override === null) {
        obj.style.backgroundColor = valid ? $mz.cfg.validation.color.valid.background.hex : $mz.cfg.validation.color.invalid.background.hex;
        return;
      }

      override = override.replace(/'/g, '"');
      override = JSON.parse(override); // var elem = $mz.find(override.elemId);

      var invalidcss = override.invalidcss;
      var validcss = override.validcss;
      var property = override.property;
      obj.style[property] = valid ? validcss : invalidcss;
    },
    setCountryElem: function setCountryElem(id, val) {},
    setCountyElem: function setCountyElem(id, val) {},
    setDateElems: function setDateElems(jsonObj, vals) {
      //Expected date format = MMDDYYYY        
      if ($mz.isNumeric(vals, 8)) {
        var moElem = $mz.find(jsonObj.month);
        var dyElem = $mz.find(jsonObj.day);
        var yrElem = $mz.find(jsonObj.year);
        var mo = vals.substring(0, 2);
        var dy = vals.substring(2, 4);
        var yr = vals.substring(4, 8);
        $mz.validate.setElemValue(moElem, mo);
        $mz.validate.setElemValue(dyElem, dy);

        if (yr === "2099" && yrElem.id === $mz.cfg.frmElem.expiration.year) {
          //never expires
          var has2099 = false;

          for (var i = 0; i < yrElem.options.length; i++) {
            if (yrElem.options[i].value === "2099") {
              has2099 = true;
            }
          }

          if (!has2099) {
            var opt = document.createElement("option");
            opt.text = "2099";
            opt.value = "2099";
            yrElem.insertBefore(opt, ddl.childNodes[2]);
            yrElem.selectedIndex = 0;
          }
        }

        $mz.validate.setElemValue(yrElem, yr);
      }
    },
    setElemValue: function setElemValue(obj, val) {
      //could differentiate here with
      //elem.tagName to extend the code
      //for different element types
      try {
        if (typeof obj !== "undefined" && obj !== null && typeof val !== "undefined" && val !== null) {
          obj.value = val;
        }
      } catch (e) {}
    },
    setGenderElem: function setGenderElem(obj, val) {
      try {
        val = val.toLowerCase();
        var male = 1;
        var female = 2;
        var override = $mz.validate.getJSONOverrideValue(obj);

        if (typeof override !== "undefined" && override !== null) {
          //the json overide should be formatted like:
          //{"male":"MaleValHere","female":"FemaleValHere"}
          //the json override value is what is returned
          //jsonObj = JSON.stringify(jsonObj);
          override = override.replace(/'/g, '"');
          override = JSON.parse(override);
          male = override.male;
          female = override.female;
        }

        val = val === "m" || val === "male" || val === "1" ? male : val === "f" || val === "female" || val === "2" ? female : '';
        $mz.validate.setElemValue(obj, val);
      } catch (e) {
        var s = e.message;
      }
    },
    setStateElem: function setStateElem(obj, val) {
      if (typeof obj !== "undefined" && obj !== null && typeof val !== "undefined" && val !== null) {
        val = val.toUpperCase();
        var sts = [];
        sts["AL"] = "1";
        sts["AK"] = "2";
        sts["AZ"] = "3";
        sts["AR"] = "4";
        sts["CA"] = "5";
        sts["CO"] = "6";
        sts["CT"] = "7";
        sts["DE"] = "8";
        sts["FL"] = "9";
        sts["GA"] = "10";
        sts["HI"] = "11";
        sts["ID"] = "12";
        sts["IL"] = "13";
        sts["IN"] = "14";
        sts["IA"] = "15";
        sts["KS"] = "16";
        sts["KY"] = "17";
        sts["LA"] = "18";
        sts["ME"] = "19";
        sts["MD"] = "20";
        sts["MA"] = "21";
        sts["MI"] = "22";
        sts["MN"] = "23";
        sts["MS"] = "24";
        sts["MO"] = "25";
        sts["MT"] = "26";
        sts["NE"] = "27";
        sts["NV"] = "28";
        sts["NH"] = "29";
        sts["NJ"] = "30";
        sts["NM"] = "31";
        sts["NY"] = "32";
        sts["NC"] = "33";
        sts["ND"] = "34";
        sts["OH"] = "35";
        sts["OK"] = "36";
        sts["OR"] = "37";
        sts["PA"] = "38";
        sts["RI"] = "39";
        sts["SC"] = "40";
        sts["SD"] = "41";
        sts["TN"] = "42";
        sts["TX"] = "43";
        sts["UT"] = "44";
        sts["VT"] = "45";
        sts["VA"] = "46";
        sts["WA"] = "47";
        sts["WV"] = "48";
        sts["WI"] = "49";
        sts["WY"] = "50";
        sts["DC"] = "51";
        sts["AB"] = "52";
        sts["BC"] = "53";
        sts["MB"] = "54";
        sts["NB"] = "55";
        sts["NL"] = "56";
        sts["NS"] = "57";
        sts["NT"] = "58";
        sts["NU"] = "59";
        sts["ON"] = "60";
        sts["PE"] = "61";
        sts["QC"] = "62";
        sts["SK"] = "63";
        sts["YT"] = "64";

        try {
          $mz.validate.setElemValue(obj, sts[val]);
        } catch (e) {//val may be invalid
        }
      }
    },
    setTextElem: function setTextElem(obj, val) {
      if (typeof obj !== "undefined" && obj !== null && $mz.validate.getValidationType(obj).toLowerCase() !== "exempt") {
        var maxLength = $mz.validate.getMaxLength(obj);
        val = val.substring(0, maxLength);
        var valCk = $mz.validate.getValidValue(obj, val);

        if (valCk === val) {
          obj.value = val;
          $mz.validate.capitalize(obj);
        }
      } else {
        obj.value = val;
      }
    },
    setZipElem: function setZipElem(obj, val) {
      var maxLength = $mz.validate.getMaxLength(obj);
      var val = val.substring(0, maxLength);

      if ($mz.isNumeric(val, maxLength)) {
        $mz.validate.setTextElem(obj, val);
      }
    },
    textElement: function textElement(obj, trimVal) {
      var valid = true;

      if (obj.type.toLowerCase() === "text" || obj.type.toLowerCase() === "textarea" || obj.type.toLowerCase() === "tel" || obj.type.toLowerCase() === "email" || obj.type.toLowerCase() === "number" || obj.type.toLowerCase() === "hidden") {
        var validate = $mz.validate;
        var type = validate.getValidationType(obj).toLowerCase();

        if (type !== "exempt") {
          //if (trimVal !== null && trimVal) {
          //    obj.value = objVal;
          //}
          var optional = validate.getOptional(obj);
          var allowMask = validate.getAllowMask(obj) & validate.getRemoveMask(obj);
          var objVal = allowMask ? validate.removeMask(obj) : obj.value; //if (objVal.trim() !== "" && !validate.getAllowMultiple(obj) && !validate.getAllowMask(obj)) {

          if (objVal.trim() !== "" && !validate.getAllowMultiple(obj)) {
            valid = obj.value === validate.getValidValue(obj) && objVal.length <= validate.getMaxLength(obj) && objVal.length >= validate.getMinLength(obj);
          } else if (!optional && objVal.trim() === "") {
            valid = false;
          }

          if (valid && objVal.trim() !== "") {
            if (type === "email") {
              valid = validate.email(obj);
            } else if (type === "address") {
              valid = validate.address(obj);
            } else if (type === "phone") {
              valid = validate.phone(obj);
            }
          }
        }
      }

      return valid;
    },
    zip: function zip(obj) {
      var validate = $mz.validate;
      var val = obj.value;
      var valid = $mz.isNumeric(val, validate.getMinLength(obj));
      valid = valid ? $mz.isNumeric(val, validate.getMaxLength(obj)) : valid;
      return valid;
    }
  }
};
$mz.deviceLicenseToken = "{DEVICELICENSETOKEN}";
$mz.deviceId = "{DEVICEID}";
$mz.online = "{ONLINE}";