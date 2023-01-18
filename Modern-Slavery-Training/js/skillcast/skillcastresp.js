var bIsMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

/**
  * A simple JS library that detects mobile devices
  * this is accessble via isMobileObj which will return an object with the following structure
  *
  * {
  *  apple: { phone: false, ipod: false, tablet: true, device: true },
  *  amazon: { ... },
  *  android: {... },
  *  windows: { ... },
  *  other: { blackberry: false, blackberry10: false, opera: false, firefox: false, chrome: false, device: false },
  *  any: true,
  *  phone: false,
  *  tablet true
  * }
**/
!function(e){var n=/iPhone/i,t=/iPod/i,r=/iPad/i,a=/\bAndroid(?:.+)Mobile\b/i,p=/Android/i,l=/\bAndroid(?:.+)SD4930UR\b/i,b=/\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i,f=/Windows Phone/i,u=/\bWindows(?:.+)ARM\b/i,c=/BlackBerry/i,s=/BB10/i,v=/Opera Mini/i,h=/\b(CriOS|Chrome)(?:.+)Mobile/i,w=/\Mobile(?:.+)Firefox\b/i;function m(e,i){return e.test(i)}function i(e){var i=e||("undefined"!=typeof navigator?navigator.userAgent:""),o=i.split("[FBAN");void 0!==o[1]&&(i=o[0]),void 0!==(o=i.split("Twitter"))[1]&&(i=o[0]);var d={apple:{phone:m(n,i),ipod:m(t,i),tablet:!m(n,i)&&m(r,i),device:m(n,i)||m(t,i)||m(r,i)},amazon:{phone:m(l,i),tablet:!m(l,i)&&m(b,i),device:m(l,i)||m(b,i)},android:{phone:m(l,i)||m(a,i),tablet:!m(l,i)&&!m(a,i)&&(m(b,i)||m(p,i)),device:m(l,i)||m(b,i)||m(a,i)||m(p,i)},windows:{phone:m(f,i),tablet:m(u,i),device:m(f,i)||m(u,i)},other:{blackberry:m(c,i),blackberry10:m(s,i),opera:m(v,i),firefox:m(w,i),chrome:m(h,i),device:m(c,i)||m(s,i)||m(v,i)||m(w,i)||m(h,i)}};return d.any=d.apple.device||d.android.device||d.windows.device||d.other.device,d.phone=d.apple.phone||d.android.phone||d.windows.phone,d.tablet=d.apple.tablet||d.android.tablet||d.windows.tablet,d}"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=i:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=i():"function"==typeof define&&define.amd?define([],e.isMobileObj=i()):e.isMobileObj=i()}(this);

// POLYFILLS START

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement /*, fromIndex*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.includes called on null or undefined');
    }
    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) { k = 0; }
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
        (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function (fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this === null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (elt /*, from*/) {
    var len = this.length >>> 0;
    var from = Number(arguments[1]) || 0;
    from = (from < 0)
      ? Math.ceil(from)
      : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++) {
      if (from in this &&
        this[from] === elt)
        return from;
    }
    return -1;
  };
};

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

function defineProperties(obj, properties) {
  function convertToDescriptor(desc) {
    function hasProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    function isCallable(v) {
      // NB: modify as necessary if other values than functions are callable.
      return typeof v === "function";
    }

    if (typeof desc !== "object" || desc === null)
      throw new TypeError("bad desc");

    var d = {};

    if (hasProperty(desc, "enumerable"))
      d.enumerable = !!desc.enumerable;
    if (hasProperty(desc, "configurable"))
      d.configurable = !!desc.configurable;
    if (hasProperty(desc, "value"))
      d.value = desc.value;
    if (hasProperty(desc, "writable"))
      d.writable = !!desc.writable;
    if (hasProperty(desc, "get")) {
      var g = desc.get;

      if (!isCallable(g) && typeof g !== "undefined")
        throw new TypeError("bad get");
      d.get = g;
    }
    if (hasProperty(desc, "set")) {
      var s = desc.set;
      if (!isCallable(s) && typeof s !== "undefined")
        throw new TypeError("bad set");
      d.set = s;
    }

    if (("get" in d || "set" in d) && ("value" in d || "writable" in d))
      throw new TypeError("identity-confused descriptor");

    return d;
  }

  if (typeof obj !== "object" || obj === null)
    throw new TypeError("bad obj");

  properties = Object(properties);

  var keys = Object.keys(properties);
  var descs = [];

  for (var i = 0; i < keys.length; i++)
    descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);

  for (var i = 0; i < descs.length; i++)
    Object.defineProperty(obj, descs[i][0], descs[i][1]);

  return obj;

}

// add String.includes
if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

// POLYFILLS END

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) { }
      return i > -1;
    };
}
/*POLYFILL FOR ELEMENT MATCHES>>>>>
$(document).ready(function() {
  var navButtonsParent = document.getElementById('stage_resp');
  navButtonsParent.addEventListener('click', function(e){
    if(e.target && e.target.matches('#nextButton, #nextButton>img')){
      nextPage();
    }else if(e.target && e.target.matches('#backBtn, #backBtn>img')){
      previousPage();
    }
  });
  navButtonsParent.addEventListener('keyup', function(e){
    if(e.keyCode === 32 || e.keyCode === 13){
      if(e.target && e.target.matches('#nextButton, #nextButton>img')){
      nextPage();
    }else if(e.target && e.target.matches('#backBtn, #backBtn>img')){
      previousPage();
    }
    }
  });
});
*/
var SKILLCASTAPI = SCAPI();
function SCAPI() {
  var elementLookUpArray = [],
    elementOnAddArray = [],
    currentElements = [],
    audioVideoQue = [];

  function openWindow(lnk) {
    var exech = self.screen.height - 80;
    var execw = self.screen.width - 40;
    var execx = 0;
    var execy = 0;
    var win = "w" + (new Date()).getTime();
    var execwin = window.open(lnk, win, "width=" + execw + ",height=" + exech + ",left=" + execx + ",top=" + execy + ",scrollbars=yes,resizable=yes");
  }

  function addToCurrentElems(css_id) {
    if (currentElements.indexOf(css_id) === -1) currentElements.push(css_id);
  }

  function removeFromCurrentElems(css_id) {
    if (currentElements.indexOf(css_id) > -1) currentElements.splice(currentElements.indexOf(css_id), 1);
  }

  function prefixWithHash(id_or_hex) {
    return (String(id_or_hex).charAt(0) == "#") ? id_or_hex : "#" + id_or_hex;
  }

  function elementLookUp(css_id) {
    for (var i = 0; i < elementLookUpArray.length; i++) {
      if (elementLookUpArray[i].css_id == css_id) {
        return $("#elem_" + elementLookUpArray[i].autoId);
      }
    }
    return false;
  }

  function addCssId(css_id, autoId, delay, entry, maxwidth) {
    var thisElem = new Object();
    thisElem.css_id = css_id;
    thisElem.autoId = autoId;
    thisElem.delay = delay;
    thisElem.entry = entry;
    thisElem.maxwidth = maxwidth;
    thisElem.added = false;
    elementLookUpArray[elementLookUpArray.length] = thisElem;
    addToCurrentElems(css_id);
  }

  function onAddElement(css_id, f) {
    var thisElem = new Object();
    thisElem.css_id = css_id;
    thisElem.action = f;
    elementOnAddArray[elementOnAddArray.length] = thisElem;
  }

  function isSmallScreen() {
    if ($(window).width() <= 600 || (typeof scr_acc === "string" && scr_acc === 'on')) {
      return true;
    } else {
      return false;
    }
  }

  function hideElement(css_id) {
    var elemLookUp = elementLookUpArray;
    for (var i = 0; i < elemLookUp.length; i = i + 1) {
      if (elemLookUp[i].css_id == css_id) {
        elementLookUpArray[i].added = false;
        $("#elem_" + elemLookUp[i].autoId + "_align").css("visibility", "hidden");
      }
    }
  }

  function stopAutoAndVideoChilds(elemObject) {
    $("#elem_" + elemObject.autoId).find('audio').each(function () {
      try {
        this.pause();
        this.currentTime = 0; // Reset time
      }
      catch (error) {

      }
    });
    $("#elem_" + elemObject.autoId).find('video').each(function () {
      try {
        this.pause();
        this.currentTime = 0; // Reset time
      }
      catch (error) {

      }
    });
    // Stop playing
  }

  function removeElement(css_id) {
    var elemLookUp = elementLookUpArray;
    for (var i = 0; i < elemLookUp.length; i = i + 1) {
      if (elemLookUp[i].css_id == css_id) {
        elementLookUpArray[i].added = false;
        $("#elem_" + elemLookUp[i].autoId).css("display", "none");
        removeFromCurrentElems(css_id);
        stopAutoAndVideoChilds(elemLookUp[i]);
      }
    }
    previousPageNo = thisPageNo;//global variables
  }

  function focusElement(css_id) {
    var elemLookUp = elementLookUpArray,
    elemLookUpLen = elemLookUp.length,
    elem, $thisElem, i;
    for (i = 0; i < elemLookUpLen; i++) {
      elem = elemLookUp[i];
      if (elem.css_id == css_id) {
        $thisElem = $("#elem_" + elem.autoId);
        if(!$thisElem.attr("tabindex")){
          $thisElem.attr("tabindex", "-1");
        }
        $thisElem.focus();

        break;
      }
    }
  }

  function focusElementContent(css_id) {
    var elemLookUp = elementLookUpArray;
    for (var i = 0; i < elemLookUp.length; i = i + 1) {
      if (elemLookUp[i].css_id == css_id) {
        var elem = $("#elem_" + elemLookUp[i].autoId + "_inner").find("div,p,li");
        if(elem.length > 0) {
          elem.first().attr("tabindex","-1").focus();
        }
        break;
      }
    }
  }
  function removeElementAcc(css_id) {
    var elemLookUp = elementLookUpArray;
    if (scr_acc == "on") {
      for (var i = 0; i < elemLookUp.length; i = i + 1) {
        if (elemLookUp[i].css_id == css_id) {
          $("#elem_" + elemLookUp[i].autoId).css("display", "none");
          removeFromCurrentElems(css_id);
        }
      }
      previousPageNo = thisPageNo;//global variables
    }
  }

  function addElementWithDelay(css_id, entry, delay) {
    var show_timer = setTimeout(function() {
      addElement(css_id, entry, true)
    }, delay);
  }

  function removeElementWithDelay(css_id, delay) {
    var show_timer = setTimeout(function() {
      removeElement(css_id)
    }, delay);
  }


  function addElementAndScrollToBottom(id,delay) {
    addElementWithDelay(id,1,delay);
    var temp = setTimeout(function() {
      $(window).scrollTop($(document).height());
    },delay);
  }

  function addElementAndScrollToAnchor(id,delay,anchorId) {
    addElementWithDelay(id,1,delay);
    var temp = setTimeout(function() {
      $(window).scrollTop($('#' + anchorId).offset().top);
    },delay);
  }

  // the max and min are included in the random number generated
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function addElement(css_id, entry, autoPlay) {
    var elemLookUp = elementLookUpArray;
    var elemOnAdd = elementOnAddArray;
    var elemAdded = false;
    var entryEffect = entry || -1;
    var elemLookUpLen = elemLookUp.length;
    for (var i = 0; i < elemLookUpLen; i++) {
      if (elemLookUp[i].css_id == css_id && elemLookUp[i].added == false) {
        $("#elem_" + elemLookUp[i].autoId)
          .css("display", "inline-block");
        elementLookUpArray[i].added = true;
        elemAdded = true;
        if (entryEffect >= 0) {
                    if(autoPlay && isValid(css_id)) {
                      audioReset(css_id);//combine these into a single function?
                      audioPlay(css_id);
                      audioDestroy(css_id);
                    }
          showElement(elemLookUp[i].autoId, entryEffect, elemLookUp[i].maxwidth);
        } else {
          if (elemLookUp[i].maxwidth == 0) {
            var thisWidth = (parseInt(document.getElementById("stage_resp").style.maxWidth) - 100) + "px";
          } else {
            var thisWidth = elemLookUp[i].maxwidth + "px";
          }
          $("#elem_" + elemLookUp[i].autoId + "_align").css("maxHeight","500px").css("maxWidth", thisWidth).css("left", "0px").css("visibility", "visible");
        }
      }
    }
    addToCurrentElems(css_id);
    if(elemAdded && elemOnAdd.length > 0) {
      for (var i = 0; i < elemOnAdd.length; i = i + 1) {
        if (elemOnAdd[i].css_id == css_id) {
          elemOnAdd[i].action();
        }
      }
    }
    if(autoPlay){
    } else {
          audioVideoQue.push(css_id);
        }
  }

  function focusElementTabableContent(css_id) {
    var elemLookUp = elementLookUpArray;
    for (var i = 0; i < elemLookUp.length; i = i + 1) {
      if (elemLookUp[i].css_id == css_id && elemLookUp[i].added == true) {
        $("#elem_" + elemLookUp[i].autoId).find(":focusable").first().focus();
        break;
      }
    }
  }

  function showElement(autoId, entry, maxwidth) {
    if (!(typeof scr_acc === "string" && scr_acc === 'on')) {
      var fadeInTimeOne = 600;
      var fadeInTimeTwo = 300;
      var fadeInTimeThree = 900;
      var animateOne = 600;
    } else {
      var fadeInTimeOne = 0;
      var fadeInTimeTwo = 0;
      var fadeInTimeThree = 0;
      var animateOne = 0;
    }
    if (entry == 0) {
      $("#elem_" + autoId + "_align").css("visibility", "visible").hide().fadeIn(fadeInTimeOne);
    } else if (entry == 1) {
      $("#elem_" + autoId + "_align").css("visibility", "visible").hide().fadeIn(fadeInTimeTwo);
    } else if (entry == 2) {
      $("#elem_" + autoId + "_align").css("visibility", "visible").hide().fadeIn(fadeInTimeThree);
    } else if (entry == 3) {
      if(typeof scr_lang === "string" && (scr_lang === "ar" || scr_lang === "ur")) {
        $("#elem_" + autoId + "_align").css("right", "-100%").css("visibility", "visible").animate({right : "0%"}, animateOne);
      } else {
        $("#elem_" + autoId + "_align").css("left", "-100%").css("visibility", "visible").animate({left : "0%"}, animateOne);
      }
    } else if (entry == 4) {
      if(typeof scr_lang === "string" && (scr_lang === "ar" || scr_lang === "ur")) {
        $("#elem_" + autoId + "_align").css("right", "100%").css("visibility","visible").animate({right : "0%"}, animateOne);
      } else {
        $("#elem_" + autoId + "_align").css("left", "100%").css("visibility","visible").animate({left : "0%"}, animateOne);
      }
    } else if (entry == 5) {
      $("#elem_" + autoId + "_align").css("maxHeight", "0px").css("visibility", "visible").animate({maxHeight : "500px"}, animateOne);
    } else if (entry == 6) {
      if (maxwidth > 0) {
        $("#elem_" + autoId + "_align").css("maxHeight", "0px").css("maxWidth", "0px").css("visibility", "visible").animate({maxWidth : maxwidth + "px",maxHeight : "500px"}, animateOne);
      } else {
        $("#elem_" + autoId + "_align").css("maxHeight", "0px").css("maxWidth", "0px").css("visibility", "visible").animate({maxWidth : "1150px",maxHeight : "500px"}, animateOne);
      }
    }
  }

  function getShowNext(trigger){
    var useTrigger = (typeof trigger === "boolean") ? trigger : true;
    document.getElementById("nextButton").style.visibility = "visible";
    if (useTrigger) {
      $("body").trigger("SKILLCASTAPIshowNextTrigger");
    }
    if (document.getElementById("nextButtonBot")) {
      document.getElementById("nextButtonBot").style.visibility = "visible";
    }
  }

  function showNext(trigger) {
    var isScrolling = isScrollingSkin();
    if(!isScrolling){
      getShowNext(trigger);
    }
    else {
      SKILLCASTSCROLLINGAPI.showNextOrContinue('external');
    }
  }

  function hideNext() {
    var isScrolling = isScrollingSkin();
    if(!isScrolling){
      document.getElementById("nextButton").style.visibility = "hidden";
      if (document.getElementById("nextButtonBot")) document.getElementById("nextButtonBot").style.visibility = "hidden";
    } else {
      SKILLCASTSCROLLINGAPI.hideNextOrContinue('external');
    }
  }

  function hideBack() {
    var isScrolling = isScrollingSkin();
    if(!isScrolling){
      document.getElementById("backBtn").style.visibility = "hidden";
      if (document.getElementById("backBtnTop")) document.getElementById("backBtnTop").style.visibility = "hidden";
    }
  }

  function showBack() {
    var isScrolling = isScrollingSkin();
    if(!isScrolling){
      document.getElementById("backBtn").style.visibility = "visible";
      if (document.getElementById("backBtnTop")) document.getElementById("backBtnTop").style.visibility = "visible";
    }
  }

  function showNextOnSmall() {
    if (this.isSmallScreen()) {
      SKILLCASTAPI.showNext(true);
    }
  }

  function showNextWithDelay(delay) {
    setTimeout(SKILLCASTAPI.showNext, delay);
  }

  function getPageInfo(p) {
    return self.getPageInfo(p);
  }

  function getUserInfo() {
    return self.getUserInfo();
  }

  function gotoPage(p) {
    self.gotoPage(p);
  }

  function gotoPageTitle(title) {
    self.gotoPageTitle(title);
  }

  function gotoPageId(identifier) {
    for (var i = 0; i < scr_pages.length; i = i + 1) {
      if (scr_pages[i].identifier.toLowerCase() == identifier.toLowerCase() || scr_pages[i].type == identifier) {
        gotoPage(i + 1);
      }
    }
  }

  function refreshPage() {
    self.refreshPage();
  }

  function nextPage(trigger) {
    var useTrigger = (typeof trigger === "boolean") ? trigger : true;
    if (useTrigger) {
      $("body").trigger("SKILLCASTAPIshowNextTrigger");
    }
    self.nextPage();
  }

  function previousPage() {
    self.previousPage();
  }

  function pageTitleCompleted(title) {
    return self.pageTitleCompleted(title);
  }

  function fixPositionDiv(id, placeholder) {
    if ($("#" + placeholder).offset().top > 0) {
      $("#" + id).css('position', 'fixed');
      $("#" + id).css('top', $("#" + placeholder).offset().top);
      $("#" + id).css('left', $("#" + placeholder).offset().left);
      $("#" + id).css('width', $("#" + placeholder).width());
    } else {
      setTimeout(function () {
        fixPositionDiv(id, placeholder);
      }, 100);
    }
  }

  function subSectionCompleted(identifier) {
    if (typeof identifier == 'undefined') {
      identifier = scr_pages[thisPageNo].identifier;
    }
    if (identifier.length > 0) {
      setDataValue(identifier.toLowerCase(), "y");
    }
  }
  function getSubSections(identifier) {
    if (typeof identifier == 'undefined') {
      identifier = scr_pages[thisPageNo].identifier;
    }
    var startCounting = false;
    var status = [];
    for (var i = 0; i < scr_pages.length; i = i + 1) {
      if (scr_pages[i].type == "h1") {
        if (scr_pages[i].identifier.toLowerCase() == identifier.toLowerCase()) {
          startCounting = true;
        } else {
          startCounting = false;
        }
      } else if (scr_pages[i].type == "h2" && scr_pages[i].identifier.length > 0 && startCounting) {
        status[status.length] = {
          "identifier": scr_pages[i].identifier.toLowerCase(),
          "title": scr_pages[i].title,
          "type": "page",
          "status": getDataValue(scr_pages[i].identifier)
        }
      } else if (scr_pages[i].type.length == 35 && startCounting) {
        var thisStatus = "";
        if (getTracking(scr_pages[i].type).status == 1) {
          var thisStatus = "y"
        }
        status[status.length] = {
          "identifier": scr_pages[i].type,
          "title": scr_pages[i].title,
          "type": "assessment",
          "status": thisStatus
        }
      }
    }
    return status;
  }

  function subSectionNavigation(definition) {
    var def = {
      "identifier": "",
      "buttonClass": "",
      "textClass": "",
      "buttonClassAssessment": "",
      "containerDiv": "",
      "learnMoreId": "",
      "assessmentId": "",
      "topicMenuId": "",
      "topicTitle": ""
    };
    for (var key in definition) {
      def[key] = definition[key];
    };
    var s = getSubSections(def.identifier);
    var c = 0;
    var p = 0;
    var a = 0;
    var container = document.getElementById(def.containerDiv);
    for (var i = 0; i < s.length; i = i + 1) {
      if (s[i].status == "y") {
        c = c + 1;
      } else {
        if (s[i].type == "page") {
          p = p + 1;
          var bc = document.createElement("div");
          bc.className = "contentblock25";
          var bp = document.createElement("div");
          bp.style.padding = "10px";
          var b = document.createElement("div");
          b.className = def.buttonClass;
          var bt = document.createElement("div");
          bt.className = def.textClass;
          bt.style.fontSize = "0.8em";
          bt.innerText = s[i].title;
          b.id = s[i].identifier;
          b.onclick = function () {
            gotoPageId(this.id);
          }
          b.appendChild(bt);
          bp.appendChild(b);
          bc.appendChild(bp);
          container.appendChild(bc);
        } else if (p == 0) {
          a = a + 1;
          var bc = document.createElement("div");
          bc.className = "contentblock25";
          var bp = document.createElement("div");
          bp.style.padding = "10px";
          var b = document.createElement("div");
          b.className = def.buttonClassAssessment;
          var bt = document.createElement("div");
          bt.className = def.textClass;
          bt.style.fontSize = "0.8em";
          bt.innerText = s[i].title;
          b.id = s[i].identifier;
          b.onclick = function () {
            gotoPageId(this.id);
          }
          b.appendChild(bt);
          bp.appendChild(b);
          bc.appendChild(bp);
          container.appendChild(bc);
        }
      }
    }
    if (c == s.length) {
      var t = getSections();
      for (var i = 0; i < t.length; i = i + 1) {
        if (t[i].identifier == def.identifier) {
          def.topicTitle = t[i].title;
        }
      }
      var bc = document.createElement("div");
      bc.className = "contentblock25";
      var bp = document.createElement("div");
      bp.style.padding = "10px";
      var b = document.createElement("div");
      b.className = def.buttonClass;
      var bt = document.createElement("div");
      bt.className = def.textClass;
      bt.style.fontSize = "0.8em";
      bt.innerText = def.topicTitle;
      b.id = def.identifier;
      b.onclick = function () {
        gotoPageId(this.id);
      }
      b.appendChild(bt);
      bp.appendChild(b);
      bc.appendChild(bp);
      container.appendChild(bc);
      addElement(def.topicMenuId, 1, true);
    } else if (p > 0) {
      addElement(def.learnMoreId, 1, true);
    } else if (a > 0) {
      addElement(def.assessmentId, 1, true);
    }
  }

  function getSubSectionProgress() {
    var startCounting = false;
    var subSections = 0;
    var completed = 0;
    for (var i = 0; i < scr_pages.length; i = i + 1) {
      if (scr_pages[i].type == "h1" && scr_pages[i].identifier.length > 0) {
        startCounting = true;
      } else if ((scr_pages[i].type == "h1" && scr_pages[i].identifier.length == 0) || scr_pages[i].type == "menu") {
        startCounting = false;
      } else if (scr_pages[i].type == "h2" && scr_pages[i].identifier.length > 0 && startCounting) {
        subSections = subSections + 1;
        if (getDataValue(scr_pages[i].identifier) == "y") {
          completed = completed + 1;
        }
      } else if (scr_pages[i].type.length == 35 && startCounting) {
        subSections = subSections + 1;
        if (getTracking(scr_pages[i].type).status == 1) {
          completed = completed + 1;
        }
      }
    }
    if (subSections > 0) {
      return Math.round(100 * completed / subSections);
    } else {
      return 0;
    }
  }

  function getSections() {
    startCounting = false;
    var sections = [];
    for (var i = 0; i < scr_pages.length; i = i + 1) {
      if (scr_pages[i].type == "h1") {
        if (scr_pages[i].identifier.length > 0) {
          startCounting = true;
          sections[sections.length] = {
            "identifier": scr_pages[i].identifier.toLowerCase(),
            "title": scr_pages[i].title,
            "subSections": 0,
            "completed": 0,
            "status": "y"
          };
        } else {
          startCounting = false;
        }
      } else if (scr_pages[i].type == "h2" && scr_pages[i].identifier.length > 0 && startCounting) {
        sections[sections.length - 1].subSections = sections[sections.length - 1].subSections + 1;
        if (getDataValue(scr_pages[i].identifier.toLowerCase()) == "y") {
          sections[sections.length - 1].completed = sections[sections.length - 1].completed + 1;
        }
        if (sections[sections.length - 1].completed != sections[sections.length - 1].subSections) {
          sections[sections.length - 1].status = "n";
        }
      } else if (scr_pages[i].type.length == 35 && startCounting) {
        sections[sections.length - 1].subSections = sections[sections.length - 1].subSections + 1;
        if (getTracking(scr_pages[i].type).status == 1) {
          sections[sections.length - 1].completed = sections[sections.length - 1].completed + 1;
        }
        if (sections[sections.length - 1].completed != sections[sections.length - 1].subSections) {
          sections[sections.length - 1].status = "n";
        }
      }
    }
    return sections;
  }

  function getSectionStatus(identifier) {
    var startCounting = false;
    var status = {};
    status.subSections = 0;
    status.completed = 0;
    status.status = "n";
    for (var i = 0; i < scr_pages.length; i = i + 1) {
      if (scr_pages[i].type == "h1") {
        if (scr_pages[i].identifier.toLowerCase() == identifier.toLowerCase()) {
          startCounting = true;
        } else {
          startCounting = false;
        }
      } else if (scr_pages[i].type == "h2" && scr_pages[i].identifier.length > 0 && startCounting) {
        status.subSections = status.subSections + 1;
        if (getDataValue(scr_pages[i].identifier.toLowerCase()) == "y") {
          status.completed = status.completed + 1;
        }
      } else if (scr_pages[i].type.length == 35 && startCounting) {
        status.subSections = status.subSections + 1;
        if (getTracking(scr_pages[i].type).status == 1) {
          status.completed = status.completed + 1;
        }
      }
    }
    if (status.completed == status.subSections) {
      status.status = "y";
    }
    return status;
  }

  function sectionStatusIcon(identifier, container, iconClass) {
    var c = document.getElementById(container);
    var s = getSectionStatus(identifier).status;
    var i = document.createElement("div");
    i.className = iconClass;
    if (s == "y") {
      i.className = i.className + " checkmark_completed";
      var it = document.createElement("div");
      it.className = "checkmark_tick";
      var is = document.createElement("div");
      is.className = "checkmark_stem";
      var ik = document.createElement("div");
      ik.className = "checkmark_kick";
      it.appendChild(is);
      it.appendChild(ik);
      i.appendChild(it);
    }
    c.appendChild(i);
  }

  function subSectionStatusIcon(identifier, container, iconClass) {
    var c = document.getElementById(container);
    var s = getDataValue(identifier.toLowerCase());
    if (identifier.length == 35 && s == "" && getTracking(identifier).status == 1) {
      s = "y";
    }
    var i = document.createElement("div");
    i.className = iconClass;
    if (s == "y") {
      i.className = i.className + " checkmark_completed";
      var it = document.createElement("div");
      it.className = "checkmark_tick";
      var is = document.createElement("div");
      is.className = "checkmark_stem";
      var ik = document.createElement("div");
      ik.className = "checkmark_kick";
      it.appendChild(is);
      it.appendChild(ik);
      i.appendChild(it);
    }
    c.appendChild(i);
  }

  function toolTip(definition) {
    var def = {
      "items": [],
      "entryEffect": "fade",//fade or blind
      "buttonClassOn": "",
      "showDelay": 1,
      "hideDelay": 500,
      "offsetX": 20,
      "offsetY": 20,
      "followMouse": false
    };
    var tt = [];
    var options = {};
    for (var key in definition) {
      def[key] = definition[key];
    };
    var defaultOptions = {
      offsetX: def.offsetX,
      offsetY: def.offsetY,
      useEffect: def.entryEffect,
      showDelay: def.showDelay,
      hideDelay: def.hideDelay,
      followMouse: def.followMouse
    };
    if (def.buttonClassOn.length > 0) {
      defaultOptions.hoverClass = def.buttonClassOn;
    };
    for (var i = 0; i < def.items.length; i = i + 1) {
      options = defaultOptions;
      if ("offsetX" in def.items[i]) {
        options.offsetX = def.items[i].offsetX;
      }
      if ("offsetY" in def.items[i]) {
        options.offsetY = def.items[i].offsetY;
      }
      if ("showDelay" in def.items[i]) {
        options.showDelay = def.items[i].showDelay;
      }
      if ("hideDelay" in def.items[i]) {
        options.hideDelay = def.items[i].hideDelay;
      }
      if ("followMouse" in def.items[i]) {
        options.followMouse = def.items[i].followMouse;
      }
      if ("entryEffect" in def.items[i]) {
        options.followMouse = def.items[i].entryEffect;
      }
      tt[i] = new Spry.Widget.Tooltip(def.items[i].toolTipId, "#" + def.items[i].buttonId, options);
    };
  }

  function clickToReveal(definition) {
    var def = {
      "items":[],
      "placeholder":"",
      "entryEffect":"1",
      "buttonClassOff":"custombtn",
      "buttonClassOn":"custombtn-clicked-active",
      "buttonClassClicked":"custombtn",
      "showNextOnCompletion":"true",
      "showElementOnCompletion":"",
      "completionElementEntryEffect":"1",
      "completionRequirement":"",
      "completionDelay":"500",
      "retainPopups":"false",
      "colapsePopups":"false",
      "showNextOnStart":"false",
      "showElementOnStart":"",
      "startElementEntryEffect":"1",
      "startDelay":"500",
      "focusOnContent":"true"
    }
    var buttonEvents = "";
    for (var key in definition) {
      def[key] = definition[key];
    }
    if ($.isNumeric(def.completionRequirement)) {
      def.completionRequirement = Number(def.completionRequirement);
      var completionMode = "count";
    } else {
      if (def.completionRequirement == "") {
        def.completionRequirement = def.items.length;
        var completionMode = "count";
      } else {
        var completionMode = (def.completionRequirement.includes(",")) ? "list" : "item";
      }
    }
    if (def.placeholder.length > 0 && def.showElementOnStart.length == 0) {
      def.showElementOnStart = def.placeholder;
    }
    for (var i = 0; i < def.items.length; i = i + 1) {
      $("[id=" + def.items[i].buttonId + "]").data("clicked", "false");
      $("[id=" + def.items[i].buttonId + "]").data("popup", def.items[i].elementId);
      if(def.colapsePopups == "true") {
        $("[id=" + def.items[i].buttonId + "]").attr("aria-expanded","false");
      }
      buttonEvents = "click keyup";
      if($("[id=" + def.items[i].buttonId + "]").is("button")) {
        buttonEvents = "click";
      }
      if ("buttonClassOff" in def.items[i]) {
        $("[id=" + def.items[i].buttonId + "]").prop("class", def.items[i].buttonClassOff);
      } else {
        $("[id=" + def.items[i].buttonId + "]").prop("class", def.buttonClassOff);
      }
      if ("buttonClassOn" in def.items[i]) {
        $("[id=" + def.items[i].buttonId + "]").data("buttonClassOn", def.items[i].buttonClassOn);
      } else {
        $("[id=" + def.items[i].buttonId + "]").data("buttonClassOn", def.buttonClassOn);
      }
      if ("buttonClassClicked" in def.items[i]) {
        $("[id=" + def.items[i].buttonId + "]").data("buttonClassClicked", def.items[i].buttonClassClicked);
      } else {
        $("[id=" + def.items[i].buttonId + "]").data("buttonClassClicked", def.buttonClassClicked);
      }
      if ("entryEffect" in def.items[i]) {
        $("[id=" + def.items[i].buttonId + "]").data("entryEffect", def.items[i].entryEffect);
      } else {
        $("[id=" + def.items[i].buttonId + "]").data("entryEffect", def.entryEffect);
      }
      $("[id=" + def.items[i].buttonId + "]").on(buttonEvents,function(event) {
        if (event.type == "click" || event.type == "keyup" && (event.which == 13 || event.which == 32)) {
          var clickedItems = 0;
          if (def.placeholder.length > 0) {
            removeElement(def.placeholder);
          }
          for (var j = 0; j < def.items.length; j = j + 1) {
            if (def.items[j].buttonId == $(this).prop("id")) {
              if(def.colapsePopups == "true" && $(this).prop("class") == $(this).data("buttonClassOn")) {
                removeElement($(this).data("popup"));
                $(this).prop("class",$(this).data("buttonClassClicked"));
                $(this).attr("aria-expanded","false");
              } else {
                $(this).data("clicked","true");
                clickedItems = clickedItems + 1;
                $(this).prop("class",$(this).data("buttonClassOn"));
                addElement($(this).data("popup"),$(this).data("entryEffect"), true);
                if(def.colapsePopups == "true") {
                  $(this).attr("aria-expanded","true");
                }
                if(def.focusOnContent == "true") {
                  focusElement($(this).data("popup"));
                }
              }
            } else {
              if($("[id=" + def.items[j].buttonId + "]").data("clicked") == "true") {
                clickedItems = clickedItems + 1;
                if(def.retainPopups == "false") {
                  $("[id=" + def.items[j].buttonId + "]").prop("class",$(this).data("buttonClassClicked"));
                }
              } else {
                $("[id=" + def.items[j].buttonId + "]").prop("class",$(this).data("buttonClassOff"));
              }
              if(def.retainPopups == "false") {
                removeElement(def.items[j].elementId);
                if(def.colapsePopups == "true") {
                  $("[id=" + def.items[j].buttonId + "]").attr("aria-expanded","false");
                }
              }
            }
          }
          if ((completionMode == "count" && clickedItems == def.completionRequirement) || (completionMode == "item" && $(this).prop("id") == def.completionRequirement)) {
            if (def.showNextOnCompletion == "true") {
              var showNextTimeout = setTimeout(SKILLCASTAPI.showNext, def.completionDelay);
            }
            if (def.showElementOnCompletion != "") {
              addElementWithDelay(def.showElementOnCompletion, def.completionElementEntryEffect, def.completionDelay);
            }
          } else if (completionMode == "list") {
            var bNotComplete = [],
              currClicked = [],
              completionReqArray = def.completionRequirement.split(",");
            for (var i = 0; i < def.items.length; i = i + 1) {
              if ($("[id=" + def.items[i].buttonId + "]").data("clicked") === 'true') {
                currClicked.push(def.items[i].buttonId);
              }
            }
            bNotComplete = completionReqArray.filter(function (i) { return currClicked.indexOf(i) < 0; });
            if (!bNotComplete.length) {
              if (def.showNextOnCompletion == "true") {
                var showNextTimeout = setTimeout(SKILLCASTAPI.showNext, def.completionDelay);
              }
              if (def.showElementOnCompletion != "") {
                addElementWithDelay(def.showElementOnCompletion, def.completionElementEntryEffect, def.completionDelay);
              }
            }
          }
        }
      })
    }
  }

  function accordion(definition) {
    var def = {
      "items": [],
      "behaviour": "radio",
      "border": "0px",
      "borderColor": "#000000",
      "container": "#accordion",
      "collapsible": false,
      "heightStyle": "content",
      "entryEffect": "1",
      "buttonClassOff": "custombtn",
      "buttonClassOn": "custombtn-clicked-active",
      "buttonClassClicked": "custombtn-clicked-inactive",
      "buttonClassExpandOnMobile": "narrative-large",
      "buttonSpacing": "0px",
      "contentPanelColour": "#FFFFFF",
      "showNextOnCompletion": "true",
      "showElementOnCompletion": "",
      "completionElementEntryEffect": "1",
      "completionRequirement": "",
      "completionDelay": "500",
      "showNextOnStart": "false",
      "showElementOnStart": false,
      "startElementEntryEffect": "1",
      "startDelay": "500"
    },
      oThis = this,
      borderStr = "0px";
    for (var key in definition) {
      def[key] = definition[key];
    }
    if ($.isNumeric(def.completionRequirement)) {
      def.completionRequirement = Number(def.completionRequirement);
      var completionMode = "count";
    } else {
      if (def.completionRequirement == "") {
        def.completionRequirement = def.items.length;
        var completionMode = "count";
      } else {
        var completionMode = "item";
      }
    }
    def.collapsible = def.collapsible === 'false' ? false : true;
    def.container = prefixWithHash(def.container);
    // add a check here to see if the container div is empty
    // if it is, create html strucutre to fit jquery accordion ui-accordion-content
    // else, change the selector for the headings to match the even children of the container div
    for (var i = 0; i < def.items.length; i = i + 1) {
      if (def.behaviour == "toggle") {
        $(def.container).append("<div><h3 id='" + def.items[i].tabId + "'>"
          + $("#" + this.elementLookUp(def.items[i].tabId).prop("id") + ">div>div>table>tbody>tr>td>table>tbody>tr>td").first().html()
          + "</h3><div id='accordion_panel" + i + "'>"
          + this.elementLookUp(def.items[i].elementId).html()
          + "</div></div>");
      } else {
        $(def.container).append("<h3 id='" + def.items[i].tabId + "'>"
          + $("#" + this.elementLookUp(def.items[i].tabId).prop("id") + ">div>div>table>tbody>tr>td>table>tbody>tr>td").first().html()
          + "</h3><div id='accordion_panel" + i + "'>"
          + this.elementLookUp(def.items[i].elementId).html()
          + "</div>");
      }
    }
    borderStr = (String(def.border) != "0px") ? def.border + " solid " + def.borderColor : borderStr;

    if (bIsMobile && ('expandOnMobile' in definition && definition.expandOnMobile.toString() === 'true')) {
      $(def.container + ' > h3').prop('class', def.buttonClassExpandOnMobile);
      $(def.container + ' > div').prop('class', 'accordion-body');
      $(def.container + ' > div').css('padding', '0 10px');

      if (def.showNextOnCompletion == "true") {
        var showNextTimeout = setTimeout(SKILLCASTAPI.showNext, def.completionDelay);
      }
      if (def.showElementOnCompletion != "") {
        addElementWithDelay(def.showElementOnCompletion, def.completionElementEntryEffect, def.completionDelay);
      }

      return null;
    }

    $(def.container).accordion({
      header: "h3",
      icons: false,
      collapsible: def.collapsible,
      active: false,//(def.showElementOnStart && !isNaN(Number(def.showElementOnStart))) ? Number(def.showElementOnStart)-1:def.showElementOnStart,
      heightStyle: def.heightStyle
    }).removeClass("ui-corner-all");
    $(def.container + " :header").css({
      "border": borderStr
    });
    $(def.container + " div.ui-accordion-content").css({
      "background": def.contentPanelColour,
      "padding": "0px",
      "border": borderStr
    });
    var showElemOnStart = ((def.showElementOnStart && !isNaN(Number(def.showElementOnStart)))) ? Number(def.showElementOnStart) - 1 : false;;

    for (var i = 0; i < def.items.length; i = i + 1) {
      var thisButtonHeader = $("#" + def.items[i].tabId);

      // use to remove the hover/focus states that occur as default on mouse rollover and mousedown
      thisButtonHeader.unbind("mouseenter mouseleave focusin");
      thisButtonHeader.data("clicked", "false");
      thisButtonHeader.data("popup", def.items[i].elementId);
      thisButtonHeader.css("position", "relative");
      thisButtonHeader.css("cursor", "pointer");

      if ("buttonClassOff" in def.items[i]) {
        $("#" + def.items[i].tabId + ".ui-accordion-header").prop("class", def.items[i].buttonClassOff);
      } else {
        $("#" + def.items[i].tabId + ".ui-accordion-header").prop("class", def.buttonClassOff);
      }
      if ("buttonClassOn" in def.items[i]) {
        thisButtonHeader.data("buttonClassOn", def.items[i].buttonClassOn);
      } else {
        thisButtonHeader.data("buttonClassOn", def.buttonClassOn);
      }
      if ("buttonClassClicked" in def.items[i]) {
        thisButtonHeader.data("buttonClassClicked", def.items[i].buttonClassClicked);
      } else {
        thisButtonHeader.data("buttonClassClicked", def.buttonClassClicked);
      }
      if ("entryEffect" in def.items[i]) {
        thisButtonHeader.data("entryEffect", def.items[i].entryEffect);
      } else {
        thisButtonHeader.data("entryEffect", def.entryEffect);
      }
      if ("buttonSpacing" in def.items[i]) {
        thisButtonHeader.data("buttonSpacing", def.items[i].buttonSpacing);
      } else {
        thisButtonHeader.data("buttonSpacing", def.buttonSpacing);
      }
      thisButtonHeader.css("margin", thisButtonHeader.data("buttonSpacing") + "px 0 0 0");
      $("#" + def.items[i].tabId + ".custombtn, #" + def.items[i].tabId + ".custombtn-clicked-active").css({
        "margin": thisButtonHeader.data("buttonSpacing") + "px 0 0 0"
      });
      $("#" + def.items[i].tabId + " + div").css({
        "background-color": (("contentPanelColour" in def.items[i]) ? def.items[i].contentPanelColour : def.contentPanelColour),
        "margin": "0px"
      });
      thisButtonHeader.prop("class", $("#" + def.items[i].tabId + ".ui-accordion-header").prop("class"));
      if (showElemOnStart === i) thisButtonHeader.prop("class", thisButtonHeader.data("buttonClassOn"));
      $("#" + def.items[i].tabId).on("click", function () {
        var clickedItems = 0;
        for (var j = 0; j < def.items.length; j = j + 1) {
          $(this).children().first().nextAll().empty();
          $("#" + def.items[j].tabId).removeClass('ui-state-active');
          $("#" + def.items[j].tabId).removeClass($(this).data("buttonClassOn"));
          $("#" + def.items[j].tabId).removeClass($(this).data("buttonClassClicked"));
          $("#" + def.items[j].tabId).removeClass($(this).data("buttonClassOff"));

          if (def.items[j].tabId === $(this).prop("id")) {
            $(this).data("clicked", "true");
            clickedItems = clickedItems + 1;
            $("#" + def.items[j].tabId).addClass($(this).data("buttonClassOn"));
          } else {
            if ($("#" + def.items[j].tabId).data("clicked") === "true") {
              clickedItems = clickedItems + 1;
              $("#" + def.items[j].tabId).addClass($("#" + def.items[j].tabId).data("buttonClassClicked"));
            } else {
              $("#" + def.items[j].tabId).addClass($("#" + def.items[j].tabId).data("buttonClassOff"));
            }
          }
        }
        if ((completionMode == "count" && clickedItems == def.completionRequirement) || (completionMode == "item" && $(this).prop("id") == def.completionRequirement)) {
          if (def.showNextOnCompletion == "true") {
            var showNextTimeout = setTimeout(SKILLCASTAPI.showNext, def.completionDelay);
          }
          if (def.showElementOnCompletion != "") {
            addElementWithDelay(def.showElementOnCompletion, def.completionElementEntryEffect, def.completionDelay);
          }
        }
      });
    }
    if (def.showElementOnStart && !isNaN(Number(def.showElementOnStart))) $("#" + def.items[Number(def.showElementOnStart) - 1].tabId).click();
  }

  function materialAccordion() {
    var def = {
      "autoId": "",
      "renderAccordion": "#accordion",
      "tabs": [{
          "tabTitle": "Tab",
          "popupContent": "<div style=\"padding:15px\">Popup Content</div>"
        },
        {
          "tabTitle": "Tab",
          "popupContent": "<div style=\"padding:15px\">Popup Content</div>"
        }
      ],
      "tabTitleClass": "accordionTab",
      "tabTitleClassHover": "accordionTabHover",
      "tabTitleClassActive": "accordionTabActive",
      "tabTitleClassVisited": "accordionTabVisited",
      "popupContentClass": "accordionContent",
      "completionAction": "",
      "completionTarget": "all",
      "completionDelay": 500
    },
    numberOfTabs = def.tabs.length,
    alreadyCompleted = false;

    function render(definition) {
      mergeDef(definition);
      createAccordion();
      checkAndSetCompletion();
    }

    function mergeDef(definition){
      for (var key in definition) {
        def[key] = definition[key];
      };
      numberOfTabs = def.tabs.length;
    }

    function createAccordion() {
      var renderTarget = $("[id=" + def.renderAccordion + "]"),
      renderAccordion = $('<div class="accordion"></div>'),
      tabTitleClass = def.tabTitleClass,
      popupContentClass = def.popupContentClass,
      idIndex,
      defObject,
      tabObject,
      popupObject;
      for (var i = 0; i < numberOfTabs; i++) {
        idIndex = i + 1;
        defObject = def.tabs[i];
        defObject.clicked = false;
        defObject.expanded = false;
        tabObject = createTab(tabTitleClass, idIndex, defObject);
        popupObject = createContent(popupContentClass, idIndex, defObject);
        defObject.tab = tabObject;
        defObject.popup = popupObject;

        renderAccordion.append(tabObject);
        renderAccordion.append(popupObject);
      }
      renderTarget.html(renderAccordion);
    }

    function closeTab(closeTarget) {
      var closeTargetTab = $(closeTarget.tab);
      closeTarget.expanded = false;
      if(closeTarget.clicked){
        closeTargetTab.children('button')
          .attr({
            'aria-expanded': 'false'
          });
        closeTargetTab.attr({
          'class': def.tabTitleClassVisited
        });
      }
      closeTargetTab.find('.chevron').replaceWith('<svg aria-hidden="true" class="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" class="chevronColor"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
      var closeTargetHeight = closeTarget.popup.height();
      closeTarget.popup.stop(true, false)
        .css({
          'height': closeTarget.popup.height()
        })
        .animate({
          'scrollTop': closeTargetHeight,
          'height': '0px'
        }, {
        duration: 250,
        complete: function () {
          $(this).css({
            'display': 'none',
            'max-height': '0px',
            'height': ''
          });
        }
      });
    }
    function openTab(openTarget) {
      var openTargetTab = $(openTarget.tab);
      var accordion = openTarget.tab.parent();
      $('html, body').animate({ scrollTop: accordion.offset().top - 20}, 'slow');
      openTargetTab.children('button')
      .attr({
        'aria-expanded': 'true'
      });
      openTargetTab
        .attr({'class': def.tabTitleClassActive})
        .children('svg')
        .replaceWith('<svg aria-hidden="true" class="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" class="chevronColor"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
      openTarget.popup.stop(true, false).css({
        'display': 'block'
      }).animate({
        'max-height': '1000px'
      }, {
        duration: 1000
      });
      if (def.completionAction !== "") {
        checkCompletion();
      }
    }

    function checkCompletion() {
      var clickedTabs = 0;
      for (var i = 0; i < numberOfTabs; i++) {
        if (def.tabs[i].clicked) {
          clickedTabs++;
        }
      }
      if (clickedTabs >= def.completionTarget || (def.completionTarget.toLowerCase() === "all" && clickedTabs === numberOfTabs)) {
        if(!alreadyCompleted){
          alreadyCompleted = true;
          setTimeout(function () {
            def.completionAction();
            trackCompletionById();
          }, def.completionDelay)
        }
      }
    }

    function trackCompletionById() {
        var autoId = def.autoId,
        trackCompletion = function(){
            setDataValue('tabbed' + autoId, "1");
        };
        if(autoId.length > 0){
            trackCompletion();
        }
    }

    function checkAndSetCompletion() {
        var hasTrackedCompletion = hasAlreadyCompleted(),
        setCompletion = function(){
            if(def.completionTarget.toLowerCase() === "all"){
                clickedTabs = numberOfTabs;
            } else {
                clickedTabs = def.completionTarget;
            }
            alreadyCompleted = true;
            if(typeof def.completionAction === "function") {
                def.completionAction();
            }
        };
        if(hasTrackedCompletion){
            setCompletion();
        }
    }

    function hasAlreadyCompleted() {
        var autoId = def.autoId,
        trackedCompletion = function(){
            var data = getDataValue('tabbed' + autoId);
            return (data === "1");
        };
        if(autoId.length > 0){
            return trackedCompletion();
        }
        return false;
    }

    function createTab(tabTitleClass, idIndex, defObject){
      var dt = $('<div></div>');
      var button = $('<button></button>').html(defObject.tabTitle).click(function(){
        if (defObject.expanded === false) {
          var thisIndex = idIndex - 1;
          defObject.clicked = true;
          defObject.expanded = true;
          for (var a = 0; a < numberOfTabs; a++) {
            if (a !== thisIndex) {
              closeTab(def.tabs[a]);
            }
          }
          openTab(defObject);
        } else {
          closeTab(defObject);
        }
      });
      var NS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(NS, "svg");
      var svgNS = svg.namespaceURI;
      var path1 = document.createElementNS(svgNS, 'path');
      var path2 = document.createElementNS(svgNS, 'path');
      var dtContent = [];
      dt.addClass(tabTitleClass);
      button.attr({
          'aria-controls': 'popup' + idIndex,
          'aria-expanded': 'false'
        })
        .prop({
          'type':'button',
          'id':'tab' + idIndex
        });
      dtContent.push(button);
      path1.setAttribute('d','M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z');
      path1.setAttribute('class', 'chevronColor');
      path2.setAttribute('d','M0 0h24v24H0z');
      path2.setAttribute('fill','none');
      svg.setAttribute('aria-hidden','true');
      svg.setAttribute('class','chevron');
      svg.setAttribute('viewBox','0 0 24 24');
      svg.appendChild(path1);
      svg.appendChild(path2);
      dtContent.push(svg);
      dt.html(dtContent);
      return dt;
    }

    function createContent(popupContentClass, idIndex, defObject){
      var dd = $('<div></div>')
        .attr({
          'aria-labelledby': 'tab' + idIndex
        })
        .prop({
          'id':'popup' + idIndex
        })
        .addClass(popupContentClass)
        .html(defObject.popupContent)
        .css({
          'overflow': 'hidden',
          'display': 'none',
          'max-height': '0px'
        });
      return dd;
    }

    return {
      render: render
    }
}

  function materialSlideshow() {
    var def = {
      "autoId": "",
      "renderSlideshow": "#slideshow",
      "slides": [{
          "slideTitle": "Slide",
          "slideContent": "<div style='padding:15px'>Slide Content</div>"
        },
        {
          "slideTitle": "Slide",
          "slideContent": "<div style='padding:15px'>Slide Content</div>"
        }
      ],
      "dotTooltipClass": "dotTooltip",
      "dotHoverClass": "dotHover",
      "dotActiveClass": "dotActive",
      "dotVisitedClass": "dotVisited",
      "nextEnabledClass": "nextEnabled",
      "nextDisabledClass": "nextDisabled",
      "backEnabledClass": "backEnabled",
      "backDisabledClass": "backDisabled",
      "completionAction": "",
      "completionTarget": "all",
      "completionDelay": 500,
      "lockNavigation": "n"
    },
    numberOfSlides = def.slides.length,
    onSlide = 1,
    dotsArray = [],
    slidesArray = [],
    alreadyCompleted = false;

    function render(definition) {
      mergeDef(definition);
      createSlideshow();
      checkAndSetCompletion();
    }

    function mergeDef(definition){
      for (var key in definition) {
        def[key] = definition[key];
      };
      numberOfSlides = def.slides.length;
    }

    function createSlideshow() {
      var $renderTarget = $("[id=" + def.renderSlideshow + "]"),
      $renderSlideshow = $('<div id="slideshowContainer" class="slideshowContainer"></div>'),
      $renderSlideShowNavigationContainer = $('<div class="slideShowNavigationContainer"></div>'),
      $renderNextButton = $('<button aria-label="Go to the next slide" class="slideShowNext"></button>'),
      $renderBackButton = $('<button disabled="true" aria-label="Go to the previous slide" class="slideShowBack"></button>'),
      defObject,
      idIndex,
      slideIdArray = [],
      slideContentObject;

      $renderBackButton.addClass('slideShowBackInactive').on('click', function(){
        $renderNextButton.removeClass('slideShowNextInactive').attr('disabled', false);
        if(onSlide > 1){
          var oldSlide = onSlide;
          onSlide = onSlide - 1;
          slideTransition(oldSlide, dotsArray, slidesArray);
        }
        if(onSlide === 1){
          $(this).addClass('slideShowBackInactive').attr('disabled', true);
        }
        def.slides[onSlide - 1].clicked = true;
      });

      $renderNextButton.on('click', function() {
        $renderBackButton.removeClass('slideShowBackInactive').attr('disabled', false);
        if(onSlide < numberOfSlides){
          var oldSlide = onSlide;
          onSlide = onSlide + 1;
        slideTransition(oldSlide, dotsArray, slidesArray);
        }
        def.slides[onSlide - 1].clicked = true;
        if(onSlide === numberOfSlides){
          checkCompletion();
          $(this).addClass('slideShowNextInactive').attr('disabled', true);
        }
      });

      for (var i = 0; i < numberOfSlides; i++) {
        defObject = def.slides[i];
        defObject.clicked = false;
        idIndex = i + 1;
        slideContentObject = createSlide(idIndex, defObject);
        slidesArray.push(slideContentObject);
        defObject.slide = slideContentObject;
        $renderSlideshow.append(slideContentObject);
        slideNavigationObject = createNavigation(idIndex, defObject.slideTitle, $renderNextButton, $renderBackButton, defObject);
        dotsArray.push(slideNavigationObject);
        defObject.slideNavigation = slideNavigationObject;
            $renderSlideShowNavigationContainer.append(slideNavigationObject);
        slideIdArray.push("slide" + idIndex);
      }
      def.slides[0].clicked = true;
      $renderTarget.html($renderSlideshow);
      $renderTarget.append($renderSlideShowNavigationContainer);
      $renderSlideShowNavigationContainer.prepend($renderBackButton);
      $renderSlideShowNavigationContainer.append($renderNextButton);

      window.onload = function () {
        var isIE = document.body.style.msTouchAction !== undefined || document.all && document.querySelector;
        var totalImgCount = 0;
        var totalImgLoadCount = 0;
        var ieMatchHeightTimeout;
        var matchHeightTimeout;

        if (isIE) {
          slideIdArray.forEach(function (value) {
            var $thisImg = $('#' + value + ' img');
            if ($thisImg.length) {
              totalImgCount = $thisImg.length + totalImgCount;

              $thisImg.each(function (index, elem) {
                elem.onload = function () {
                  clearTimeout(ieMatchHeightTimeout);
                  totalImgLoadCount++;
                  if (totalImgCount === totalImgLoadCount) {
                    ieMatchHeightTimeout = setTimeout(function () {
                      matchHeights(slideIdArray);
                    }, 0);
                  }
                }
              });
            }
          });
        }

        clearTimeout(matchHeightTimeout);
        matchHeightTimeout = setTimeout(function () {
          matchHeights(slideIdArray);
        }, 0);
      };

    }

    function slideTransition(oldSlide, dotsArray, slidesArray){
      for (var i = 0; i < numberOfSlides; i++) {
          var iPlusOne = i + 1;
          var $targetButton = dotsArray[i];
          var $targetSlide = slidesArray[i];
          if(iPlusOne === onSlide) {
            $targetSlide.css({'display': 'block'}).focus();
            $targetButton.removeClass('slideShowDotVisited slideShowDotNotVisited');
          } else {
            $targetSlide.css({'display': 'none'});
          }
          if(iPlusOne === oldSlide && iPlusOne !== onSlide) {
            $targetButton.addClass('slideShowDotVisited').removeClass('slideShowDotNotVisited');
          }
      }
    }

    function createSlide(idIndex, defObject){
      var $targetSlide = $('<div class="slideshowSlide" id="slide' + idIndex + '"></div>').html(defObject.slideContent).prop('tabindex', '0');
      var defObject = def.slides;
      if(idIndex > 1){
        $targetSlide.css({'display': 'none'});
      }
      return $targetSlide;
    }

    function checkCompletion() {
      var clickedDots = 0;
      for (var i = 0; i < numberOfSlides; i++) {
        if (def.slides[i].clicked) {
          clickedDots++;
        }
      }
      if (clickedDots >= def.completionTarget || (def.completionTarget.toLowerCase() === "all" && clickedDots === numberOfSlides)) {
        if(!alreadyCompleted){
          alreadyCompleted = true;
          setTimeout(function () {
            def.completionAction();
            trackCompletionById();
          }, def.completionDelay)
        }
      }
    }

    function trackCompletionById() {
        var autoId = def.autoId,
        trackCompletion = function(){
            setDataValue('tabbed' + autoId, "1");
        };
        if(autoId.length > 0){
            trackCompletion();
        }
    }

    function checkAndSetCompletion() {
        var hasTrackedCompletion = hasAlreadyCompleted(),
        setCompletion = function(){
            if(def.completionTarget.toLowerCase() === "all"){
              clickedDots = numberOfSlides;
            } else {
              clickedDots = def.completionTarget;
            }
            alreadyCompleted = true;
            if(typeof def.completionAction === "function") {
                def.completionAction();
            }  
        };
        if(hasTrackedCompletion){
            setCompletion();
        }
    }

    function hasAlreadyCompleted() {
        var autoId = def.autoId,
        trackedCompletion = function(){
            var data = getDataValue('tabbed' + autoId);
            return (data === "1");
        };
        if(autoId.length > 0){
            return trackedCompletion();
        }
        return false;
    }

    function createNavigation(clickedDot, slideTitle, $nextButton, $backButton, defObject){
      function toggleButton() {
        var oldSlide = onSlide;
        onSlide = clickedDot;
        slideTransition(oldSlide, dotsArray, slidesArray);
        defObject.clicked = true;
        checkCompletion();
        if (onSlide === 1) {
          $backButton.addClass('slideShowBackInactive').attr('disabled', true);
        } else {
          $backButton.removeClass('slideShowBackInactive').attr('disabled', false);
        }
        if (onSlide === numberOfSlides) {
          $nextButton.addClass('slideShowNextInactive').attr('disabled', true);
        } else {
          $nextButton.removeClass('slideShowNextInactive').attr('disabled', false);
        }
      }
      var $button = $('<button aria-label="' + slideTitle + '" class="slideShowDot"><div class="scaling-svg-container" id="svg_progress_dot" style="padding-bottom: 100%"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128"><g class="svg_progress_dot-clip"><g class="svg_progress_dot-2"><circle class="svg_progress_dot-3" cx="64" cy="64" r="64"/><circle class="svg_progress_dot-4" cx="64" cy="64" r="57"/></g></g></svg></div><div class="scaling-svg-container" id="svg_progress_dot_current" style="padding-bottom: 100%"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128"><g class="svg_progress_dot_current-clip"><circle class="svg-progress-dot-current-inner" cx="36" cy="36" r="36" transform="translate(28 28)"/><g class="svg-progress-dot-current-outer"><circle class="svg_progress_dot_current-4" cx="64" cy="64" r="64"/><circle class="svg_progress_dot_current-5" cx="64" cy="64" r="57"/></g></g></svg></div><div class="scaling-svg-container" id="svg_progress_dot_visited" style="padding-bottom: 100%"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128"><g class="svg_progress_dot_visited-clip"><g class="svg-progress-dot-visited"><circle class="svg_progress_dot_visited-3" cx="64" cy="64" r="64"/><circle class="svg_progress_dot_visited-4" cx="64" cy="64" r="57"/></g></g></svg></div></button>')
        .on('click', function(){
          var lockNavigation = def.lockNavigation;
          if (def.hasOwnProperty('lockNavigation')) {
            if (lockNavigation === "y" && $button.hasClass('slideShowDotVisited') || lockNavigation === "n") {
              toggleButton();
            }
          } else {
            toggleButton();
          }
        })
      if(clickedDot !== 1){
        $button.addClass('slideShowDotNotVisited')
      }
      $button.css('background', 'none');
      return $button;
    }
    return {
      render: render
    }
  }

  function imagemap(definition) {
    var def = {
      "items": [],
      "container": "#imagemap",
      "imagemap_bg_id": "",
      "type": "default",
      "entryEffect": "1",
      "buttonClassOff": "",
      "buttonClassOn": "",
      "buttonClassClicked": "",
      "contentPanelColour": "#FFFFFF",
      "showNextOnCompletion": true,
      "showElementOnCompletion": "",
      "completionElementEntryEffect": "1",
      "completionRequirement": "",
      "completionDelay": "500",
      "showNextOnStart": "false",
      "showElementOnStart": "",
      "startElementEntryEffect": "1",
      "startDelay": "500"
    },
      oThis = this;
    for (var key in definition) {
      def[key] = definition[key];
    }
    if ($.isNumeric(def.completionRequirement)) {
      def.completionRequirement = Number(def.completionRequirement);
      var completionMode = "count";
    } else {
      if (def.completionRequirement == "") {
        def.completionRequirement = def.items.length;
        var completionMode = "count";
      } else {
        var completionMode = "item";
      }
    }
    def.container = prefixWithHash(def.container);
    // build HTML structure of the imagemap, requires:
    // - def.container
    // - def.imagemap_bg_id
    // - at least 1 hotspot item

    $(def.container).append('<img id="skillcastapi_imagemap_img" src="' + this.elementLookUp(def.imagemap_bg_id).find("img").attr("src") + '" class="skillcastapi_imagemap_img">');
    if (def.items.length > 0) {
      $(def.container).append('<div class="skillcastapi_imagemap"></div>');
      for (var i = 0; i < def.items.length; i++) {
        $(".skillcastapi_imagemap").append('<div id="skillcastapi_imagemap' + i + '" class="skillcastapi_imagemap_item" style="display:block; position:absolute; z-index:10;left:' + def.items[i].left + '%; top:' + def.items[i].top + '%; width:' + def.items[i].w + '%; height:' + def.items[i].h + '%; cursor:pointer;"><img src="./sp_images/spacer.gif" style="width:100%;height:100%"></div>');
      }
    }
    $(def.container + " > img").css("width", "100%");
    for (var i = 0; i < def.items.length; i++) {
      var imapItem = $("#skillcastapi_imagemap" + i);
      imapItem.data("itemIndex", i);

      if (def.type == "sequential") imapItem.hide();

      if ("buttonClassOff" in def.items[i]) {
        $("#" + def.items[i].buttonId + ".ui-accordion-header").prop("class", def.items[i].buttonClassOff);
      } else {
        $("#" + def.items[i].buttonId + ".ui-accordion-header").prop("class", def.buttonClassOff);
      }
      if ("buttonClassOn" in def.items[i]) {
        imapItem.data("buttonClassOn", def.items[i].buttonClassOn);
      } else {
        imapItem.data("buttonClassOn", def.buttonClassOn);
      }
      if ("buttonClassClicked" in def.items[i]) {
        imapItem.data("buttonClassClicked", def.items[i].buttonClassClicked);
      } else {
        imapItem.data("buttonClassClicked", def.buttonClassClicked);
      }
      if ("entryEffect" in def.items[i]) {
        imapItem.data("entryEffect", def.items[i].entryEffect);
      } else {
        imapItem.data("entryEffect", def.entryEffect);
      }

      imapItem.on("click", function () {
        var jqThis = $(this),
          oThisItem = def.items[$(this).data("itemIndex")],
          remDelay = 0,
          addDelay = 0;
        jqThis.data("hasbeenclicked", true);
        if (oThisItem.removeonclick)
          jqThis.unbind().css("cursor", "default");
        //remove all elements defined in list of oThisItem.removelist
        if (oThisItem.removelist) {
          oThisItem.removelist = String(oThisItem.removelist).split(",");
          remDelay = oThisItem.removelistdelay;
          setTimeout(function () {
            for (var j = 0; j < oThisItem.removelist.length; j++) {
              removeElement(oThisItem.removelist[j]);
            }
          }, remDelay);
        }
        //add all elements defined in list of oThisItem.addlist
        if (oThisItem.addlist) {
          oThisItem.addlist = String(oThisItem.addlist).split(",");
          addDelay = oThisItem.addlistdelay;
          setTimeout(function () {
            for (var j = 0; j < oThisItem.addlist.length; j++) {
              addElement(oThisItem.addlist[j], 4, true);
            }

            if (def.type == "sequential" && Number(jqThis.data("itemIndex")) <= def.items.length) $("#skillcastapi_imagemap" + (Number(jqThis.data("itemIndex")) + 1)).show();
          }, addDelay);
          if (oThisItem.updatebgsourceidID != undefined) {
            if (oThisItem.updatebgdelay) {
              setTimeout(function () {
                $(def.container + " > img").attr("src", oThis.elementLookUp(oThisItem.updatebgsourceidID).find("img").attr("src"));
                $(def.container + " > img").css("width", "100%");
              }, Number(oThisItem.updatebgdelay));
            } else {
              $(def.container + " > img").attr("src", oThis.elementLookUp(oThisItem.updatebgsourceidID).find("img").attr("src"));
              $(def.container + " > img").css("width", "100%");
            }
          }
        }
        if (oThisItem.action) {
          var aAction = oThisItem.action.split(','),
            fn = SKILLCASTAPI[aAction[0]],
            args = aAction.slice(1);

          fn.apply(null, args);
        }


        if ((completionMode == "count" && $(".skillcastapi_imagemap_item:data('hasbeenclicked')").length == def.completionRequirement) || (completionMode == "item" && jqThis.prop("id") == def.completionRequirement)) {
          if (def.showNextOnCompletion) {
            var showNextTimeout = setTimeout(SKILLCASTAPI.showNext, def.completionDelay);
          }
          if (def.showElementOnCompletion != "") {
            addElementWithDelay(def.showElementOnCompletion, def.completionElementEntryEffect, def.completionDelay);
          }
        }
      })
    }
    if (def.type == "sequential") $("#skillcastapi_imagemap0").show();
  }

  function viewVideoTranscript(def) {
    $("[id=" + def.viewTranscript + "]").css("display", "none");
    $("[id=" + def.viewVideo + "]").css("display", "none");
    if (scr_audio == "on") {
      $("[id=" + def.viewTranscript + "]").css("display", "block");
      $("[id=" + def.viewTranscript + "]").on("click", function () {
        scr_audio = "off";
        refreshPage();
      });
    } else if (scr_audio == "off") {
      $("[id=" + def.viewVideo + "]").css("display", "block");
      $("[id=" + def.viewVideo + "]").on("click", function () {
        scr_audio = "on";
        refreshPage();
      });
    }
  }

  function flip(definition) {
    var def = {
      "items": [],
      "placeholder": "",
      "frontClass": "front",
      "backClass": "back",
      "showNextOnCompletion": "true",
      "showElementOnCompletion": "",
      "completionElementEntryEffect": "1",
      "completionRequirement": "",
      "completionDelay": "500",
      "showNextOnStart": "false",
      "showElementOnStart": "",
      "startElementEntryEffect": "1",
      "startDelay": "500",
      //"interaction":"click",
      "unflip": false,
      "autoUnflip": false,
      "axis": "x",
      "reverse": false,
      "speed": 500,
      "autoSize": true,
      "matchHeights": true
    }
    var h = 0;
    for (var key in definition) {
      def[key] = definition[key];
    }
    if ($.isNumeric(def.completionRequirement)) {
      def.completionRequirement = Number(def.completionRequirement);
      var completionMode = "count";
    } else {
      if (def.completionRequirement == "") {
        def.completionRequirement = def.items.length;
        var completionMode = "count";
      } else {
        var completionMode = "item";
      }
    }
    if (def.placeholder.length > 0 && def.showElementOnStart.length == 0) {
      def.showElementOnStart = def.placeholder;
    }
    if (def.matchHeights) {
      for (var i = 0; i < def.items.length; i = i + 1) {
        h = Math.max(h, $("[id=" + def.items[i].buttonId + "] ." + def.frontClass).height());
        h = Math.max(h, $("[id=" + def.items[i].buttonId + "] ." + def.backClass).height());
      }
    }
    for (var i = 0; i < def.items.length; i = i + 1) {
      var flipSettings = {
        "trigger": "manual",
        "front": "." + def.frontClass,
        "back": "." + def.backClass,
        "autoSize": def.autoSize
      };
      if ("axis" in def.items[i]) {
        flipSettings.axis = def.items[i].axis;
      } else {
        flipSettings.axis = def.axis;
      }
      if ("reverse" in def.items[i]) {
        flipSettings.reverse = def.items[i].reverse;
      } else {
        flipSettings.reverse = def.reverse;
      }
      if ("speed" in def.items[i]) {
        flipSettings.speed = def.items[i].speed;
      } else {
        flipSettings.speed = def.speed;
      }
      if (!def.matchHeights) {
        h = Math.max($("[id=" + def.items[i].buttonId + "] ." + def.frontClass).height(), $("[id=" + def.items[i].buttonId + "] ." + def.backClass).height());
      }
      $("[id=" + def.items[i].buttonId + "]").css("height", h + "px");
      $("[id=" + def.items[i].buttonId + "]").css("cursor", "pointer");
      $("[id=" + def.items[i].buttonId + "]").data("clicked", "false");
      $("[id=" + def.items[i].buttonId + "]").data("flipState", "unflipped");
      $("[id=" + def.items[i].buttonId + "]").flip(flipSettings);
      $("[id=" + def.items[i].buttonId + "]").on("click", function () {
        if (def.unflip || $(this).data("flipState") == "unflipped") {
          if ($(this).data("flipState") == "unflipped") {
            $(this).data("flipState", "flipped");
            if (!def.unflip) {
              $(this).css("cursor", "default");
            }
            $(this).flip(true);
            $(this).data("clicked", "true");
            var clickedItems = 0;
            if (def.placeholder.length > 0) {
              removeElement(def.placeholder);
            }
            for (var j = 0; j < def.items.length; j = j + 1) {
              if ($("[id=" + def.items[j].buttonId + "]").data("clicked") == "true") {
                if (def.autoUnflip && $("[id=" + def.items[j].buttonId + "]").prop("id") != $(this).prop("id") && $("[id=" + def.items[j].buttonId + "]").data("flipState") == "flipped") {
                  $("[id=" + def.items[j].buttonId + "]").flip(false);
                  $("[id=" + def.items[j].buttonId + "]").data("flipState", "unflipped");
                  $("[id=" + def.items[j].buttonId + "]").css("cursor", "pointer");
                }
                clickedItems = clickedItems + 1;
              }
            }
            if ((completionMode == "count" && clickedItems == def.completionRequirement) || (completionMode == "item" && $(this).prop("id") == def.completionRequirement)) {
              if (def.showNextOnCompletion == "true") {
                var showNextTimeout = setTimeout(SKILLCASTAPI.showNext, def.completionDelay);
              }
              if (def.showElementOnCompletion != "") {
                addElementWithDelay(def.showElementOnCompletion, def.completionElementEntryEffect, def.completionDelay);
              }
            }
          } else if ($(this).data("flipState") == "flipped") {
            $(this).data("flipState", "unflipped");
            $(this).flip(false);
          }
        }
      });
    }
  }


  function toggleLinkedResources() {
    var toggleThisDiv = $("[id=linkedResourcesListWrapper]");
    toggleThisDiv.toggle();
    return true;
  }

  function chart_bar(definition) {
    var def = {
      "items": [],
      "container": "#imagemap",
      "barPadding": 5,
      "minHeight": 600,
      "entryEffect": "1",
      "w": "100",
      "h": "100",
      "buttonClassOff": "",
      "buttonClassOn": "",
      "buttonClassClicked": "",
      "contentPanelColour": "#FFFFFF",
      "showNextOnCompletion": true,
      "showElementOnCompletion": "",
      "completionElementEntryEffect": "1",
      "completionRequirement": "",
      "completionDelay": "500",
      "showNextOnStart": "false",
      "showElementOnStart": "",
      "startElementEntryEffect": "1",
      "startDelay": "500"
    };
    for (var key in definition) {
      def[key] = definition[key];
    }
    if ($.isNumeric(def.completionRequirement)) {
      def.completionRequirement = Number(def.completionRequirement);
      var completionMode = "count";
    } else {
      if (def.completionRequirement == "") {
        def.completionRequirement = def.items.length;
        var completionMode = "count";
      } else {
        var completionMode = "item";
      }
    }
    var w = $(def.container).width(),
      h = Math.max($(def.container).height(), def.minHeight),
      svg = d3.select(def.container)
        .append("svg");
    $("svg").css({
      "display": "inline-block",
      "min-width": "100%",
      "min-height": def.minHeight + "px"
    });

    svg.selectAll("rect")
      .data(def.items)
      .enter()
      .append("rect")
      .attr("x", function (d, i) { return i * (w / def.items.length); })
      .attr("y", function (d) { return h - (d.val * 4); })
      .attr("width", function (d) { return w / def.items.length - def.barPadding })
      .attr("height", function (d) { return (d.val * 4); })
      .attr("fill", function (d) { return "rgba(0,0," + (d.val * 10) + ", 100)"; });

    svg.selectAll("text")
      .data(def.items)
      .enter()
      .append("text")
      .text(function (d) { return d.label; })
      .attr("x", function (d, i) { return i * (w / def.items.length); })
      .attr("y", function (d) { return h - (d.val * 4); })
  }

  function isValid(id) {
    var regex = new RegExp("^[0-9A-Za-z_-]+$");
    if (!regex.test(id)) {
      return false;
    } else {
      return true;
    }
  };

  function audioPlay(linkid) {
    $('audio').each(function () {
      try {
        this.pause();
      }
      catch (error) {

      }
    });
    if (scr_audio !== 'off' && isValid(linkid)) {
      $("[data-linkid=" + linkid + "]").each(function () {
        this.play(); // Start playing
      });
    }
    return;
  }
  function audioDestroy(linkid) {
    if (scr_audio !== 'off' && isValid(linkid)) {
      $("[data-linkid=" + linkid + "]").each(function () {
        this.onended = function () {
          this.remove();
        };
      });
    }
    return;
  }
  function audioStop(linkid) {
    $("[data-linkid=" + linkid + "]").each(function () {
      this.pause(); // Stop playing
    });
    return;
  }
  function audioReset(linkid) {
    if (isValid(linkid)) {
      $("[data-linkid=" + linkid + "]").each(function () {
        this.addEventListener('loadedmetadata', function () {
          this.currentTime = 0; // Reset time
        }, false);
        //this.currentTime = 0; // Stop playing
      });
    }
    return;
  }
  function audioShow(linkid) {
    var audioItem = $("[data-linkid=" + linkid + "]").parent("[class=ckeditor-html5-audio]");
    audioItem.show();
    return;
  }
  function audioHide(linkid) {
    var audioItem = $("[data-linkid=" + linkid + "]").parent("[class=ckeditor-html5-audio]");
    audioItem.hide();
    return;
  }
  function audioResetAll() {
    $('audio').each(function () {
      this.addEventListener('loadedmetadata', function () {
        this.currentTime = 0; // Reset time
      }, false);
      //this.currentTime = 0; // Stop playing
    });
    return;
  }
  function audioStopAll() {
    $('audio').each(function () {
      this.pause(); // Stop playing
    });
    return;
  }
  function removeOnEndEventsFromVidosAfterTrigged(cssIdArray) {
    var cssIdArrayLen = cssIdArray.length,
      cssId,
      item,
      test,
      videoFunction;
    for (var i = 0; i < cssIdArrayLen; i++) {
      cssId = cssIdArray[i];
      item = $("video[id=" + cssId + "]");
      item.each(function () {
        if (typeof this.onended == "function") {
          var videoFunction = this.onended;
          this.onended = function () {
            videoFunction();
            this.onended = "";
          };
        } else {
          this.addEventListener('loadedmetadata', function () {
            if (typeof this.onended == "function") {
              var videoFunction = this.onended;
              this.onended = function () {
                videoFunction();
                this.onended = "";
              };
            }
          }, false);
        }
      });
    }
    return;
  }
  function simpleSlideShow(definition) {
    var def = {
      "scenes": []
    },
      actualNext = window.nextPage,
      actualPrev = window.previousPage,
      currentScene = -1,
      scenes = [],
      changes = {},
      highestSceneVisited = -1,
      alreadyShownNext = {};

    for (var key in definition) {
      def[key] = definition[key];
    }


    function hijackedNext() {
      renderScene(1, true);
    }
    function hijackedPrev() {
      renderScene(-1, false);
    }
    // hijack buttons:
    window.nextPage = hijackedNext;
    window.previousPage = hijackedPrev;

    // render scene
    function renderScene(direction, autoPlay) {
      var newTargetScene = currentScene + direction,
        addedElements = [],
        newKey = "scene" + newTargetScene,
        nextControlVal,
        alreadyShownNextCurrent = (typeof alreadyShownNext[newKey] == "boolean" && alreadyShownNext[newKey]) ? true : false,
        useAutoPlay = (typeof autoPlay == "undefined") ? true : autoPlay,
        usePlay = (alreadyShownNextCurrent) ? false : useAutoPlay;

      // we should take a param for this render function that is -1 or +1 to denote direction of navigation
      // this applies to the direction of animation if any ( horizontal vs vertical animate ins )

      // compare the currentElements array with the value of scenes[currentScene]
      // store the result in the changes obj
      changes = compareSceneElements(def.scenes[newTargetScene].ids.split(","));
      /*
        On scene 0:
        Elements not added to scene or hidden settings set to ALL will not be included in changes.toDelete without adding
        addToCurrentElems(css_id); to the addCssId

        This is turn added ALL page elements to currentElements.
        changes.toDelete correctly removed unnecessary element when compared to target scene

        changes.toAdd was empty because there was nothing to add (currentelements has ALL elements, remember)

        to fix this, set changes to add to equal the taret scene elements
      */
      if (newTargetScene === 0) changes.toAdd = def.scenes[newTargetScene].ids.split(",");


      // delete elements
      changes.toDelete.forEach(function (css_id) {
        if (css_id !== 'simpleSlideshowIndicator') removeElement(css_id);
      });
      // add elements
      audioVideoQue = [];
      changes.toAdd.forEach(function (css_id) {
        // use inner add
        // one thing to do is to capture the dataa of this element (animate in, delay)
        addElement(css_id, 1, usePlay);
        addedElements.push(css_id);
      });
      removeOnEndEventsFromVidosAfterTrigged(addedElements);
      jQuery.Event("SKILLCASTAPIshowNextTrigger");
      $("body").on('SKILLCASTAPIshowNextTrigger', function () {
        alreadyShownNext[newKey] = true;
        $("body").unbind("SKILLCASTAPIshowNextTrigger");
        return;
      });

      // set the currentElements to the new scene
      currentElements = def.scenes[newTargetScene].ids.split(",");

      // use until fix for bug where previousPageNo is euqal to thisPageNo has been implemented
      var tempActualPrev = function () {
        gotoPage(getPageInfo().pageNo - 1);
      }

      // should expect a string from both that is "next|previous|both"
      if ('defaultNav' in def.scenes[newTargetScene]) {
        switch (def.scenes[newTargetScene].defaultNav) {
          case 'next':
            window.nextPage = actualNext;
            window.previousPage = actualPrev;
            break;
          case 'previous':
            window.previousPage = actualPrev;
            break;
          case 'both':
            window.nextPage = actualNext;
            window.previousPage = actualPrev;
            break;
          default:
            break;
        }
      }

      // set the navigaion buttons back to default at the beginning or end of the scene length
      window.previousPage = (newTargetScene === 0) ? tempActualPrev : hijackedPrev;//actualPrev:hijackedPrev;
      window.nextPage = (newTargetScene === (def.scenes.length - 1)) ? actualNext : hijackedNext;


      // correctly set the currentScene
      currentScene += direction;
      highestSceneVisited = Math.max(highestSceneVisited, currentScene);

      if (def.indicator) createIndicator(currentScene, highestSceneVisited, def.indicator);
      // set the next and previous buttons accordingly
      // use scene[newTargetScene].nextControl AND
      if ('nextControl' in def.scenes[newTargetScene]) {
        nextControlVal = def.scenes[newTargetScene].nextControl;
        if (typeof nextControlVal === "number") {
          if (nextControlVal > 0) showNextWithDelay(nextControlVal);
        } else if (typeof nextControlVal === "string" && nextControlVal === "hide") {
          if (highestSceneVisited > currentScene) {
            SKILLCASTAPI.showNext(false);
          } else {
            if (typeof alreadyShownNext[newKey] == "boolean" && alreadyShownNext[newKey]) {
              SKILLCASTAPI.showNext(false);
            } else {
              hideNext();
            }
          }
        }
      } else {
        SKILLCASTAPI.showNext(true);
      }

      if ('prevControl' in def.scenes[newTargetScene]) {
        prevControl = def.scenes[newTargetScene].prevControl;
        if (typeof prevControl === "string" && prevControl === "hide") {
          $("div#backBtn.sideNav").css("visibility", "hidden");
        } else {
          $("div#backBtn.sideNav").css("visibility", "visible");
        }
      } else {
        $("div#backBtn.sideNav").css("visibility", "visible");
      }

      setFocus(SKILLCASTAPI.focusSelector)
    }



    function jumpToScene(index) {
      currentScene = index - 1;
      renderScene(1);
    }

    function compareSceneElements(targetElems) {
      var changes = {};
      // compare currentElements to targetElems
      changes.toDelete = currentElements.filter(function (elem) {
        // return elements from currentElements that are not in the target scene
        return !(targetElems.includes(elem));
      });
      changes.toAdd = targetElems.filter(function (elem) {
        // if currentScene doesn't contain targetElement, add it
        return !currentElements.includes(elem);
      });
      return changes;
    }

    function createIndicator(currentScene, highestSceneVisited, obj) {
      if ($("#simpleSlideshowIndicator").children().length <= 0) {
        $("#simpleSlideshowIndicator").css("text-align", obj.align);
        $("#simpleSlideshowIndicator").append("<ul style='list-style-type: none;'></ul>");
        def.scenes.forEach(function (element, index, array) {
          var imgSrc = 'mcq_dot_before_e0e0e0',
            clickHandler = '';
          if (index === currentScene) {
            imgSrc = 'mcq_dot_after_333333';
          } else if (index <= highestSceneVisited) {
            imgSrc = 'mcq_dot_after_e0e0e0';
            clickHandler = 'onClick=jumpToScene(' + index + ')';
          }
          $("#simpleSlideshowIndicator ul").append("<li style='display:inline'><img " + clickHandler + "src='./sp_images/icons/" + imgSrc + ".png'/></li>")
        });
      } else {
        def.scenes.forEach(function (element, index, array) {
          var imgSrc = 'mcq_dot_before_e0e0e0',
            clickHandler = ''
          if (index === currentScene) {
            imgSrc = 'mcq_dot_after_333333';
          } else if (index <= highestSceneVisited) {
            imgSrc = 'mcq_dot_after_e0e0e0';
            $("#simpleSlideshowIndicator ul > li:nth-child(" + (index + 1) + ") > img").on("click", function () {
              jumpToScene(index);
            });

          }
          $("#simpleSlideshowIndicator ul > li:nth-child(" + (index + 1) + ") > img").attr("src", "./sp_images/icons/" + imgSrc + ".png");
        });
      }
    }
    // render first scene, current scene is set to 0, the 1 here denotes the
    //direction; 1: next button, -1: prev button navigation respectively
    renderScene(1);
  }

  /*
    this function will convert a selector 'string' to a jquery selector object
    or return a jquery | javascript selector
  */
  function convertStringToJquerySelector(selector) {
    var returnValue = (typeof selector === 'string') ? $(selector) : selector;
    return returnValue;
  }

  /*
    check tabIndex attribute
    this checks to see if there is a tabIndex on the selector provided
    it returns a false when the selector tabIndex does not exist
  */
  var checkTabIndex = function (selector) {
    var selectorTabIndex = false
    if (typeof selector.length === 'undefined' && typeof selector === 'object') {
      // hasAttributePolyfill for browsers <= ie8
      var hasAttribute = (function (prototype) {
        prototype.hasAttribute = prototype.hasAttribute || function (name) {
          return !!(this.attributes[name] &&
            this.attributes[name].specified);
        }
      })(Element.prototype);
      selectorTabIndex = selector.hasAttribute("tabindex")
    } else {
      selectorTabIndex = selector.attr('tabindex')
    }

    //make sure it returns a boolean value
    if (selectorTabIndex === 'undefined') {
      selectorTabIndex = false
    }

    return selectorTabIndex
  }

  /* this sets the tabindex of the selector */
  function setTabIndex(selector) {
    var isSet = false;
    if (typeof selector.length === 'undefined' && typeof selector === 'object') {
      selector.setAttribute('tabindex', 1)
      isSet = true
    } else {
      $(selector).attr('tabindex', 1)
      isSet = true
    }
    return isSet
  }

  /* this throws a simple alert error message */
  function throwError(message) {
    alert(message)
    return false
  }

  function setFocus(selector) {
    //set default values
    if (selector.length === 0 || typeof selector === 'undefined') {
      selector = $('#menu-btn')
    }
    var tabIndexIsSet = false;
    //this checks if the selector is an object i.e jquery || vanila javascript selector
    if (typeof selector !== "undefined" && typeof selector !== 'string') {
      selector = selector
    } else {
      //checks if it's a string and has a value
      if (typeof selector === 'string' && selector.length > 0) {
        selector = convertStringToJquerySelector(selector)
      } else {
        throwError('the selector provided is an empty string')
        return false
      }
    }
    var selectorTabIndex = checkTabIndex(selector)
    if (!selectorTabIndex) {
      tabIndexIsSet = setTabIndex(selector)
    }

    if (tabIndexIsSet || selectorTabIndex) {
      selector.focus()
    } else {
      throwError('focus not set')
      return false
    }
  }

  function resetNotebookQuestion(id) {
    document.getElementById(id + "_container").style.cursor = "pointer";
    document.getElementById(id + "_container").onclick = function () {
      document.getElementById(id + "_textarea").style.display = "block";
      document.getElementById(id + "_submit").style.display = "block";
      document.getElementById(id + "_response").style.display = "none";
      document.getElementById(id + "_instruction").style.display = "none";
      document.getElementById(id + "_container").style.cursor = "default";
      document.getElementById(id + "_container").onclick = null;
    }
  }

  function addNotebookQuestion(definition) {
    var def = {
      "id": "",
      "question": "",
      "size": "5",
      "addText": "Select this box to enter your notes",
      "updText": "Select this box to update your notes",
      "icon": "",
      "iconClass": "",
      "questionClass": "",
      "responseClass": "",
      "submitClass": "",
      "instructionClass": ""
    };
    for (var key in definition) {
      def[key] = definition[key];
    };
    if (def.id.length > 0) {
      var container = document.getElementById(def.id);
      container.id = def.id + "_container";
      container.style.cursor = "pointer";
      var response = getCommentValue(def.id);
      var questionDiv = document.createElement("div");
      if (def.questionClass.length > 0) {
        questionDiv.className = def.questionClass;
      }
      questionDiv.innerHTML = def.question;
      var responseDiv = document.createElement("div");
      if (def.responseClass.length > 0) {
        responseDiv.className = def.responseClass;
      }
      responseDiv.id = def.id + "_response";
      responseDiv.style.paddingTop = "10px";
      var textareaDiv = document.createElement("div");
      textareaDiv.id = def.id + "_textarea";
      textareaDiv.style.paddingTop = "10px";
      textareaDiv.style.display = "none";
      var textarea = document.createElement("textarea");
      textarea.id = def.id + "_input";
      textarea.style.width = "100%";
      textarea.rows = def.size;
      textarea.wrap = "soft";
      textarea.value = response;
      textareaDiv.appendChild(textarea);
      var submitDiv = document.createElement("div");
      submitDiv.id = def.id + "_submit";
      submitDiv.style.paddingTop = "10px";
      submitDiv.style.display = "none";
      var submitButton = document.createElement("input");
      if (def.submitClass.length > 0) {
        submitButton.className = def.submitClass;
      }
      submitButton.style.display = "inline-block";
      submitButton.type = "button";
      submitButton.value = "Submit";
      submitDiv.appendChild(submitButton);
      var instructionDiv = document.createElement("div");
      instructionDiv.id = def.id + "_instruction";
      instructionDiv.style.paddingTop = "10px";
      instructionDiv.style.cursor = "pointer";
      var instructionRoundel = document.createElement("div");
      if (def.iconClass.length > 0) {
        instructionRoundel.className = def.iconClass;
      }
      instructionRoundel.innerHTML = "<img src='" + def.icon + "' style='max-width:100%;max-height:100%'/>";
      instructionDiv.appendChild(instructionRoundel);
      var instructionSpan = document.createElement("div");
      instructionSpan.id = def.id + "_instructionText";
      if (def.instructionClass.length > 0) {
        instructionSpan.className = def.instructionClass;
      }
      instructionDiv.appendChild(instructionSpan);
      if (response.length > 0) {
        responseDiv.innerText = response;
        instructionSpan.innerText = def.updText;
      } else {
        instructionSpan.innerText = def.addText;
        responseDiv.style.display = "none";
      }
      container.appendChild(instructionDiv);
      container.appendChild(questionDiv);
      container.appendChild(responseDiv);
      container.appendChild(textareaDiv);
      container.appendChild(submitDiv);
      container.onclick = function () {
        document.getElementById(def.id + "_textarea").style.display = "block";
        document.getElementById(def.id + "_submit").style.display = "block";
        document.getElementById(def.id + "_response").style.display = "none";
        document.getElementById(def.id + "_instruction").style.display = "none";
        document.getElementById(def.id + "_container").style.cursor = "default";
        document.getElementById(def.id + "_container").onclick = null;
      }
      submitButton.onclick = function () {
        var response = document.getElementById(def.id + "_input").value;
        setCommentValue(def.id, def.question, response);
        document.getElementById(def.id + "_response").innerText = response;
        document.getElementById(def.id + "_textarea").style.display = "none";
        document.getElementById(def.id + "_submit").style.display = "none";
        if (response.length > 0) {
          document.getElementById(def.id + "_instructionText").innerText = def.updText;
          document.getElementById(def.id + "_response").style.display = "block";
        } else {
          document.getElementById(def.id + "_instructionText").innerText = def.addText;
          document.getElementById(def.id + "_response").style.display = "none";
        }
        document.getElementById(def.id + "_instruction").style.display = "block";
        var temp = setTimeout(function () {
          resetNotebookQuestion(def.id);
        }, 100);
      }
    }
  }

  function matchHeights(elementsArray){
    var elementsArrayLen = elementsArray.length;
    var newMinHeight = 0;
    function findHeights(){
      setHeights(0)
      var elementLookUpItem;
      var elementItem;
      var tmpMinHeight = 0;
      for(var i=0;i<elementsArrayLen;i++){
        elementLookUpItem = SKILLCASTAPI.elementLookUp(elementsArray[i]);
        if(elementLookUpItem){
          elementItem = elementLookUpItem.find('.scr_element').height();
        } else {
          elementItem = $("#" + elementsArray[i]).height();
        }
        if(elementItem > tmpMinHeight){
          tmpMinHeight = elementItem;
        }
      }
      newMinHeight = tmpMinHeight;
    }
    function setHeights(height){
      var elementLookUpItem,
      elementLookUpArrayLen = elementLookUpArray.length,
      elementsArrayItem,
      elementLookUpArrayItem,
      i, a;
      for(i=0; i < elementsArrayLen; i++){
        elementsArrayItem = elementsArray[i];
        elementLookUpItem = SKILLCASTAPI.elementLookUp(elementsArrayItem);
        if(elementLookUpItem){
          elementLookUpItem.find('.scr_element').css('min-height', height);
          for(a=0;a<elementLookUpArrayLen;a++){
            elementLookUpArrayItem = elementLookUpArray[a];
            if(elementLookUpArrayItem.css_id === elementsArrayItem && !elementLookUpArrayItem.added){
              SKILLCASTAPI.onAddElement(elementsArrayItem, function(){
                findHeights();
                setHeights(newMinHeight);
              });
              break;
            }
          }
        } else {
          elementLookUpItem = $("#" + elementsArray[i]);
          elementLookUpItem.css('min-height', height);
        }
      }
    }
    if(!SKILLCASTAPI.isSmallScreen()){
      setTimeout(function(){
        findHeights();
        setHeights(newMinHeight);
      }, 0)
    }
    $(window).resize(function() {
      if(!SKILLCASTAPI.isSmallScreen()){
        findHeights();
        setHeights(newMinHeight);
      } else {
        setHeights(0);
      }
    });
  }
  function chatMcqInit(definition) {
    var def = {
      "id": "chat",
      "congratulations": [
        "<span style=\"vertical-align:middle\">Well done! </span><img src=\"/sp_images/emoticons/1f642.png\" style=\"vertical-align:middle\"/>",
        "<span style=\"vertical-align:middle\">That's right! </span><img src=\"/sp_images/emoticons/1f44f.png\" style=\"vertical-align:middle\"/>",
        "<span style=\"vertical-align:middle\">Well done! </span><img src=\"/sp_images/emoticons/1f642.png\" style=\"vertical-align:middle\"/>",
        "<span style=\"vertical-align:middle\">You got it! </span><img src=\"/sp_images/emoticons/1f44f.png\" style=\"vertical-align:middle\"/>",
        "<span style=\"vertical-align:middle\">That's right! </span><img src=\"/sp_images/emoticons/1f642.png\" style=\"vertical-align:middle\"/>"
      ],
      "whoops": [
        "<span style=\"vertical-align:middle\">That's still not right. </span><img src=\"/sp_images/emoticons/1f641.png\" style=\"vertical-align:middle\"/>",
        "<span style=\"vertical-align:middle\">That's still not right. </span><img src=\"/sp_images/emoticons/1f625.png\" style=\"vertical-align:middle\"/>"
      ],
      "introduction": "qIntroduction",
      "questionPrefix": "q",
      "explanationPrefix": "exp",
      "passed": "qPassed",
      "failed": "qFailed",
      "progress": "qProgressPlaceholder",
      "questionClass": "scr_assessment_question",
      "completionPage": "Complete",
      "progressBarColor": "#33691e",
      "progressBarClass": "progressBarContainer",
      "progressTextClass": "narrative-large"
    }
    for (var key in definition) {
      def[key] = definition[key];
    };
    chatMcqDef = def;
    var questionCount = $("." + def.questionClass).length;
    if (getDataValue(def.id).length > 0) {
      var chatHistory = getDataValue(def.id).split(",");
    } else {
      var chatHistory = [];
    }
    var thisScore = 0;
    var bestScore = 0;
    for (var i = 0; i < chatHistory.length; i = i + 1) {
      bestScore = Math.max(bestScore, chatHistory[i]);
    }
    if (def.progress.length > 0) {
      var chatProgress = document.createElement("div");
      chatProgress.id = "chatProgress";
      document.getElementById("scr_outer_td").appendChild(chatProgress);
      var bestScoreTitle = document.createElement("div");
      bestScoreTitle.id = "bestScoreTitle";
      bestScoreTitle.className = def.progressTextClass;
      bestScoreTitle.innerText = "Your best score: " + bestScore + "/" + questionCount;
      var bestScoreBar = document.createElement("div");
      bestScoreBar.id = "bestScoreBar";
      bestScoreBar.className = def.progressBarClass;
      bestScoreBar.innerHTML = '<div style="width:' + Math.round(100 * bestScore / questionCount) + '%;border:0;height:100%;background-color:' + def.progressBarColor + '"></div>';
      chatProgress.appendChild(bestScoreTitle);
      chatProgress.appendChild(bestScoreBar);
      fixPositionDiv("chatProgress", def.progress);
    }
    document.getElementById("qStart").onclick = function () {
      document.getElementById("qStart").style.display = "none";
      addElementAndScrollToAnchor(def.questionPrefix + "1", 500, def.introduction);
      var thisScoreTitle = document.createElement("div");
      thisScoreTitle.id = "thisScoreTitle";
      thisScoreTitle.className = def.progressTextClass;
      thisScoreTitle.innerText = "This attempt: " + thisScore + "/" + questionCount;
      var thisScoreBar = document.createElement("div");
      thisScoreBar.id = "thisScoreBar";
      thisScoreBar.className = def.progressBarClass;
      thisScoreBar.innerHTML = '<div style="width:' + Math.round(100 * thisScore / questionCount) + '%;border:0;height:100%;background-color:' + def.progressBarColor + '"></div>';
      chatProgress.appendChild(thisScoreTitle);
      chatProgress.appendChild(thisScoreBar);
    }
  }

  function chatMcqQuestion(isCorrect, qNo) {
    var nextQ = qNo + 1;
    var def = chatMcqDef;
    if (isCorrect) {
      if (def.congratulations.length >= qNo) {
        var congrats = def.congratulations[qNo - 1];
      } else if (def.congratulations.length > 0) {
        var r = this.getRandomInt(1, def.congratulations.length) - 1;
        var congrats = def.congratulations[r];
      } else {
        var congrats = "";
      }
      var questionCount = $("." + def.questionClass).length;
      if (getDataValue(def.id).length > 0) {
        var chatHistory = getDataValue(def.id).split(",");
      } else {
        var chatHistory = [];
      }
      var thisScore = qNo;
      var bestScore = qNo;
      for (var i = 0; i < chatHistory.length; i = i + 1) {
        bestScore = Math.max(bestScore, chatHistory[i]);
      }
      if (congrats.length > 0) {
        document.getElementById(def.explanationPrefix + qNo).innerHTML = congrats + '<br/><br/>' + document.getElementById(def.explanationPrefix + qNo).innerHTML;
      }
      if (def.progress.length > 0) {
        document.getElementById("thisScoreTitle").innerText = "This attempt: " + thisScore + "/" + questionCount;
        document.getElementById("thisScoreBar").innerHTML = '<div style="width:' + Math.round(100 * thisScore / questionCount) + '%;border:0;height:100%;background-color:' + def.progressBarColor + '"></div>';
        document.getElementById("bestScoreTitle").innerText = "Your best score: " + bestScore + "/" + questionCount;
        document.getElementById("bestScoreBar").innerHTML = '<div style="width:' + Math.round(100 * bestScore / questionCount) + '%;border:0;height:100%;background-color:' + def.progressBarColor + '"></div>';
      }
    } else {
      if (def.whoops.length > 0) {
        var r = this.getRandomInt(1, def.whoops.length) - 1;
        var whoops = def.whoops[r];
        document.getElementById(def.explanationPrefix + qNo).innerHTML = whoops + '<br/><br/>' + document.getElementById(def.explanationPrefix + qNo).innerHTML;
      }
    };
    $(window).scrollTop($(document).height());
    if (!isCorrect) {
      addElementAndScrollToBottom(def.failed, 5000);
      chatHistory[chatHistory.length] = qNo - 1;
      setDataValue(def.id, chatHistory.join(","));
    } else if (nextQ > questionCount) {
      addElementAndScrollToBottom(def.passed, 5000);
      chatHistory[chatHistory.length] = qNo;
      if (def.completionPage.length > 0) {
        setProgress(def.completionPage);
        setCompletionStatus();
      }
      setDataValue(def.id, chatHistory.join(","));
      forceCommit();
    } else {
      addElementAndScrollToAnchor(def.questionPrefix + nextQ, 5000, def.explanationPrefix + qNo);
    }
  }

  function typewriterAction(str, pos, target, delay) {
    var t = str.substr(0, pos);
    var n = pos + 1;
    target.innerText = t;
    if (n <= str.length) {
      var temp = setTimeout(function () {
        typewriterAction(str, n, target, delay);
      }, delay);
    }
  };

  function typewriter(definition) {
    var def = {
      "container": "",
      "delay": "100",
      "startDelay": "10",
      "maintainContainerHeight": true
    };
    for (var key in definition) {
      def[key] = definition[key];
    };
    def.startDelay = Math.max(def.startDelay, 1);
    var elem = document.getElementById(def.container);
    elem.style.visibility = "hidden";
    var str = elem.innerText;
    var temp = setTimeout(function () {
      if (def.maintainContainerHeight) {
        var elemHeight = $(elem).height();
        elem.style.height = elemHeight + "px";
      }
      elem.innerHTML = "";
      elem.style.visibility = "visible";
      typewriterAction(str, 1, elem, def.delay);
    }, def.startDelay);
  };

  function bulletList(props) {
    if (props !== undefined && typeof props === 'object') {
      var $Bullets = props.bullets !== undefined && typeof props.bullets === 'object'
        ? props.bullets : null;
      var start = props.start !== undefined && typeof props.start === 'number'
        ? props.start : null;
      var count = 0;
      var skipCount = 0;
      var finalCount = 0;
      var colorObj = {};
      var colorFieldVal = props.color !== undefined && typeof props.color === 'string'
        ? props.color : null;

      var BulletBuilder = function (props) {
        var $Bullets = props.bullets !== undefined && typeof props.bullets === 'object'
          ? props.bullets : null;
        var start = props.dataStart !== undefined && typeof props.dataStart === 'number'
          ? props.dataStart : null;
        var colorProp = props.color !== undefined && typeof props.color === 'string'
          ? props.color : null;


        var calcFinalCount = function (cnt, skipCount, startCount) {
          var result = cnt - skipCount;
          var numStartCount = startCount || 0;
          result = result < 0 ? 0 : result;
          var finalResult = (function (startCnt) {
            var numResult = result;
            if (startCnt > 0) {
              numResult = startCnt + result - 1;
            }
            return numResult;
          })(numStartCount);
          return finalResult;
        };

        /**
         * arguments:  obj{ colorArr: [], selector: jquerySelector , colorClass: string}
         * we get the $selector id and do a regex to get only the index value from the id
         * we do get the remainder from index modulus length of the colorArr
         * if the modIndex === 0 then it means we have gotten to the end and
         * we set the color class = colorArr[colorArr.length - 1]
         * else we set the colorClass = colorArr[modIndex - 1].
         */
        var getMultiColorClasses = function (props) {
          var colorArr = props.colorArr;
          var $selector = props.selector;
          var id = $selector.attr('id');
          var colorClass = props.colorClass;

          if (colorClass === 'box-multicolor') {
            var id = $selector.attr('id');
            /** this regex retrieves the index and converts it to a number. */
            var index = +id.replace(/(\w+_)/gi, '');
            var modIndex = index % colorArr.length;
            if (modIndex === 0) {
              colorClass = colorArr[colorArr.length - 1];
            } else {
              colorClass = colorArr[modIndex - 1];
            }
          }
          return colorClass;
        };

        var getElementColor = function (props) {
          var color = props.color !== undefined && typeof props.color === 'string'
            ? props.color
            : null;
          var $selector = props.element !== undefined && typeof props.element === 'object'
            ? props.element
            : null;
          var colorArr = ['box-color1', 'box-color2', 'box-color3', 'box-color4'];
          var colorString;

          if (color !== null) {
            var colorClass = color.indexOf('-') !== -1 ? color : 'box-'+ color;
            colorClass = getMultiColorClasses({
              colorArr: colorArr,
              selector: $selector,
              colorClass: colorClass
            });

            var colorSelectorStr = "." + colorClass;
            var tempId = "tempColor" + Math.floor(Math.random() * 100000);

            if (colorClass !== 'box-sp_default_color' || colorClass !== 'box-multicolor') {
              $selector.append('<div id="' + tempId + '" class="tempColor ' + colorClass + ' style="width:0; height:0;"></div>');
              colorString = $(colorSelectorStr).css('background-color');
              $('#' + tempId).remove();
            }
          }
          return colorString;
        };

        if ($Bullets !== null) {
          $Bullets.each(function (index, element) {
            var $currElement = $(element);
            var $nextElement = $currElement.next("");
            var color = getElementColor({element: $currElement, color: colorProp});
            var classFound = findClass($currElement.attr("class"), " ");
            if (classFound) {
              colorObj.color = color;
            } else {
              colorObj.backgroundColor = color;
            }

            /**
             * we use the appendStyleToDom to appendStyles for the pseudoElements
             * as it's not very easy to set the pseudoElement color via javascript
            */
            appendStyleToDom($currElement, colorObj);

            if ($currElement.hasClass('none')) {
                  skipCount += 1;
            }
            finalCount = calcFinalCount(count, skipCount, start);

            cssValue =  "bullet-list-counter " + finalCount;
            if ($currElement.hasClass('none')) {
              $nextElement.css("counter-reset", cssValue);
            } else{
              $currElement.css("counter-reset", cssValue);
            }

            count += 1;
          });

        } else {
          throw "Parameter is not a Jquery object, you passed a " + typeof $bullets + "instead of an object";
        }

        return { getElementColor: getElementColor };
      }

      try {
        BulletBuilder({
          bullets: $Bullets,
          dataStart: start,
          color: colorFieldVal
        });
      } catch (e) {
        throw new Error(e);
      }

    }


    var initObj = function (props) {
      var $newStyles = props.new_styles !== undefined && typeof props.new_styles === 'number'
        ? props.new_styles : 1;
      var $bulletID = props.bulletID !== undefined && typeof props.bulletID === 'object'
        ? props.bulletID : null;
      var bullets_list_count = props.bullets_list_count !== undefined && typeof props.bullets_list_count === 'number'
        ? props.bullets_list_count : null;
      var index = props.index !== undefined && typeof props.index === 'number'
        ? props.index : null;
      var display_next = props.display_next !== undefined && typeof props.display_next === 'number'
        ? props.display_next : null;
      var $element = props.element !== undefined && typeof props.element === 'object'
        ? props.element : null;
      var startTime = props.startTime !== undefined && typeof props.startTime === 'number'
        ? props.startTime : null;
      var itemDelay = props.itemDelay !== undefined && typeof props.itemDelay === 'number'
        ? props.itemDelay : null;
      var animationType = props.animationType !== undefined && typeof props.animationType === 'string'
        ? props.animationType : null;
      var from_left = (function (animType) {
        var lCaseAnimType = animType.toLowerCase();
        var result = null;
        if (
          typeof lCaseAnimType === 'string'
          && lCaseAnimType.includes('slide')
        ) {
          result = lCaseAnimType.includes("left");
        }
        return result;
      })(animationType);

      var $direction = (function (fromLeft) {
        var $fromLeft = fromLeft;
        var result = null;
        if ($fromLeft !== null) {
          result = (!$fromLeft) ? "100%" : "-100%";
        }
        return result;
      })(from_left); // -100% goes left and +100% goes right
      var $bulletHeight = $bulletID !== null ? props.bulletID.height() + 1 : null;
      var $isElementInPage = $element !== null ? SKILLCASTAPI.isInPage($element[0]) : false;

      return {
        new_styles: $newStyles,
        bullet_id: $bulletID,
        bullets_list_count: bullets_list_count,
        index: index,
        display_next: display_next,
        from_left: from_left,
        direction: $direction,
        bullet_height: $bulletHeight,
        start_time: startTime,
        item_delay: itemDelay,
        is_element_in_page: $isElementInPage,
        element: $element
      };
    };

    /* Transition Functions */
    var fadeFunc = function (props) {
      var newStyles = props.new_styles !== undefined && typeof props.new_styles === 'number'
        ? props.new_styles : 1;
      var $bulletID = props.bullet_id !== undefined && typeof props.bullet_id === 'object'
        ? props.bullet_id : null;
      var itemDelay = props.item_delay !== undefined && typeof props.item_delay === 'number'
        ? props.item_delay : 400;
      var displayNext = props.display_next !== undefined && typeof props.display_next === 'number'
        ? props.display_next : null;
      var bulletsListCount = props.bullets_list_count !== undefined && typeof props.bullets_list_count === 'number'
        ? props.bullets_list_count : null;
      var index = props.index !== undefined && typeof props.index === 'number'
        ? props.index : null;
      var startTime = props.start_time !== undefined && typeof props.start_time === 'number'
        ? props.start_time : null;
      var id = $bulletID.attr('id');
      var tempNameSpace = {};
      var nextButtonDelay = 600;
      /**
       * duration is set to 400 if the fade case is matched on the snippets page and returns ''
       * if fade case is matched and returns either the fast or slow then duration will be set to
       * those values
      */
      var duration = (
        props.duration !== undefined
        && typeof props.duration === 'string'
        && props.duration.length > 0
      )
      ? props.duration
      : 400;
      var timeOutDelay = timeOutDelayFunc({
        startTime: startTime,
        itemDelay: itemDelay,
        index: index,
        isDelay: true
      });

      tempNameSpace['show_' + id] = setTimeout(
        function () {
          $bulletID
            .css("visibility", "visible")
            .hide()
            .fadeIn(
              duration,
              function () {
                SKILLCASTAPI
                  .bulletList()
                  .displayNextFunc(
                    displayNext,
                    bulletsListCount,
                    index,
                    nextButtonDelay
                );
              }
            )
        },
        timeOutDelay
      );

      return { new_Styles: newStyles };
    };

    var slideFunc = function (props) {
      var newStyles = props.new_styles !== undefined && typeof props.new_styles === 'number'
        ? props.new_styles : 1;
      var $bulletID = props.bullet_id !== undefined && typeof props.bullet_id === 'object'
        ? props.bullet_id : null;
      var displayNext = props.display_next !== undefined && typeof props.display_next === 'number'
        ? props.display_next : null;
      var bulletsListCount = props.bullets_list_count !== undefined && typeof props.bullets_list_count === 'number'
        ? props.bullets_list_count : null;
      var index = props.index !== undefined && typeof props.index === 'number'
        ? props.index : null;
      var startTime = props.start_time !== undefined && typeof props.start_time === 'number'
        ? props.start_time : null;
      var itemDelay = props.item_delay !== undefined && typeof props.item_delay === 'number'
          ? props.item_delay : 0;
      var id = $bulletID.attr('id');
      var tempNameSpace = {};
      var timeOutDelay = timeOutDelayFunc({
        startTime: startTime,
        itemDelay: itemDelay,
        index: index,
        isDelay: false
      });
      var thisItemDelay =  (itemDelay * index);
      var nextButtonDelay = thisItemDelay + 600;

      tempNameSpace['show_' + id] = setTimeout(
        function () {
          $bulletID
            .css("visibility", "visible")
            .animate({
              left: 0,
            },
              {
                complete: function () {
                  SKILLCASTAPI
                    .bulletList()
                    .displayNextFunc(
                      displayNext,
                      bulletsListCount,
                      index,
                      nextButtonDelay
                  );
                  clearTimeout(tempNameSpace['show_' + id]);
                }
              },
              thisItemDelay // this is the delay between bullets
            )

        },
        timeOutDelay // this is the delay at bullet start
      );

      return { new_Styles: newStyles };
    };

    var revealFromTopFunc = function (props) {
      var $bulletID = props.bullet_id !== undefined && typeof props.bullet_id === 'object'
        ? props.bullet_id : null;
      var $displayNext = props.display_next !== undefined && typeof props.display_next === 'number'
        ? props.display_next : null;
      var $bulletsListCount = props.bullets_list_count !== undefined && typeof props.bullets_list_count === 'number'
        ? props.bullets_list_count : null;
      var index = props.index !== undefined && typeof props.index === 'number'
        ? props.index : null;
      var count = props.stepCount !== undefined && typeof props.stepCount === 'number'
        ? props.stepCount : null;
      var startTime = props.start_time !== undefined && typeof props.start_time === 'number'
        ? props.start_time : null;
      var itemDelay = props.item_delay !== undefined && typeof props.item_delay === 'number'
        ? props.item_delay : null;
      var $id = $bulletID.attr('id');
      var $idString = '#' + $id;
      var tempNameSpace = {};
      var timeOutDelay = timeOutDelayFunc({
        startTime: startTime,
        itemDelay: itemDelay,
        index: index,
        isDelay: true
      });
      var thisItemDelay =  (itemDelay * index);
      var nextButtonDelay = thisItemDelay + 600;
      var transitionDuration = (Math.min(thisItemDelay, 600) / 1000)+'s';

      tempNameSpace['show_' + $id] = setTimeout(
        function () {
          $bulletID
            .children()
            .not('style, script')
            .css("visibility", "visible")
            .animate(
              {
                top: 0,
              },
              {
                step: function () {
                  /**
                   * the Step function call back allows us to be able to transition in
                   * the bullets {square, circle, ring, check ...}
                  */
                  if (count < 1) {
                    SKILLCASTAPI.appendStyleToDom('', {
                      id: $idString,
                      position: "relative",
                      top: 0 + "px",
                      transition: "top " + transitionDuration + " ease-in-out" //transition for pseudo element
                    });
                  }
                  count += 1;
                },
                complete: function () {
                  SKILLCASTAPI.bulletList().displayNextFunc(
                    $displayNext,
                    $bulletsListCount,
                    index,
                    nextButtonDelay
                  );
                  clearTimeout(tempNameSpace['show_' + $id]);
                }
              },
              thisItemDelay
            )
        },
        timeOutDelay
      );
    };

    var expandFunc = function (props) {
      var $bulletID = props.bullet_id !== undefined && typeof props.bullet_id === 'object'
        ? props.bullet_id : null;
      var id = props.id !== undefined ? props.id : null;
      var tempNameSpace = {};
      var bulletWidth = props.bullet_width !== undefined ? props.bullet_width : null;
      var borderWidth = props.border_width !== undefined ? props.border_width : null;
      var displayNext = props.display_next !== undefined && typeof props.display_next === 'number'
        ? props.display_next : null;
      var bulletsListCount = props.bullets_list_count !== undefined && typeof props.bullets_list_count === 'number'
        ? props.bullets_list_count : null;
      var index = props.index !== undefined && typeof props.index === 'number'
        ? props.index : null;
      var startTime = props.start_time !== undefined && typeof props.start_time === 'number'
        ? props.start_time : null;
      var itemDelay = props.item_delay !== undefined && typeof props.item_delay === 'number'
        ? props.item_delay : null;
      var timeOutDelay = timeOutDelayFunc({
        startTime: startTime,
        itemDelay: itemDelay,
        index: index,
        isDelay: true
      });
      var nextButtonDelay = 600;

      var $maskClassName = props.mask_class !== undefined ? props.mask_class.replace(".", "") : null;
      $bulletID.append('<div class="' + $maskClassName + '"></div>');

      var $maskClassSelector = $(props.mask_class);

      $bulletID.css({
        "overflow": "hidden",
        "opacity": 0
      });

      $maskClassSelector.css({ 'border': $borderWidth + 'px solid black' });
      tempNameSpace['show_' + id] = setTimeout(
        function () {
          $bulletID.css({
            "visibility": "visible",
            "opacity": 1,
            'transition': 'opacity 0.5s ease-out'
          });

          $maskClassSelector.css({
            'width': bulletWidth,
            'height': bulletWidth,
            'border': borderWidth + 'px solid white',
            'transform': 'scale(1, 1) translateX(-50%) translateY(-50%)',
            'border-radius': '50%',
            'opacity': 0,
            'transition': 'transform 0.5s ease-out, opacity 3s ease-out',
            'z-index': 9
          });

          SKILLCASTAPI
            .bulletList()
            .displayNextFunc(
              displayNext,
              bulletsListCount,
              index,
              nextButtonDelay
            );
        },
        timeOutDelay
      );
    };
    /* End of Transition Functions*/

    /* Utility Functions*/

    // this is for the expand function we can extend this to include the other transition functions maybe by adding a transition name
    var getBulletWidthFunc = function (props) {
      var fnName = props.transitionName !== undefined && typeof props.transitionName === 'string'
        ? props.transitionName : null;
      var $fn = props.transitionFn !== undefined && typeof props.transitionFn === 'function'
        ? props.transitionFn : null;
      var $bulletID = props.bullet_id !== undefined && typeof props.bullet_id === 'object'
        ? props.bullet_id : null;
      var bulletWidth = props.bullet_width !== undefined && typeof props.bullet_width === 'number'
        ? props.bullet_width : null;
      var transitionProps = props.transitionProps !== undefined && typeof props.transitionProps === 'object'
        ? props.transitionProps : null;
      /*
        ***********************************************************
        ** we check to see if the bullet does not have a         **
        ** width we keep checking untill we find one then we get **
        ** the max width and use that as the inner width to      **
        ** prevent a false width been returned                   **
        ***********************************************************
      */
      var $bInterval = setInterval(
        function () {
          if (bulletWidth <= 1 || bulletWidth === null) {
            bulletWidth = $bulletID.width();
          } else {
            bulletWidth = Math.max($bulletID.width(), $bulletID.innerWidth(), $bulletID.outerWidth());
            $borderWidth = bulletWidth / 2;
            if ($fn !== null && fnName === 'expand') {
              $fn({
                id: transitionProps.id,
                bullet_id: $bulletID || transitionProps.bullet_id,
                mask_class: transitionProps.mask_class,
                bullet_width: bulletWidth,
                border_width: $borderWidth,
                start_time: transitionProps.start_time,
                item_delay: transitionProps.item_delay,
                display_next: transitionProps.display_next,
                bullets_list_count: transitionProps.bullets_list_count,
                index: transitionProps.index
              });
            }
            clearInterval($bInterval);
          }
        },
        300
      );
    };

    var displayNextFunc = function (display_next, bulletsListCount, index, delay) {
      var $nextBtn = $("#nextButton");
      if (display_next) {
        var isNextBtnInPage = SKILLCASTAPI.isInPage($nextBtn[0]);
        if (isNextBtnInPage && bulletsListCount === index) {
          setTimeout(function () { SKILLCASTAPI.showNext() }, delay);
        }
      }
    };

    var timeOutDelayFunc = function(props) {
      var startTime = props.startTime;
      var defaultStartTime = 400;
      var index = props.index;
      var itemDelay = props.itemDelay;
      var timeOutDelay =  Math.max(startTime, defaultStartTime);
      var isDelay = props.isDelay;
      var thisItemDelay = itemDelay * (index - 1);

      if (isDelay) {
        timeOutDelay += thisItemDelay;
      }

      return timeOutDelay;
    };

    /*End of utility Functions*/
    return {
      initObj: initObj,
      BulletBuilder: BulletBuilder,
      displayNextFunc: displayNextFunc,
      transition: {
        fade: fadeFunc,
        slide: slideFunc,
        revealFromTop: revealFromTopFunc,
        expand: expandFunc
      },
      getBulletWidth: getBulletWidthFunc
    };
  };

  function isInPage(node) {
    var NODE = typeof node === 'object' ? node : null;

    return (NODE !== null);
  };


  function findClass(classList, delimeter) {
    var noBackgroundColorArr = ["disc", "ring", "triangle", "hyphen", "no_shape"];
    var initialClassList = classList;
    var classList = classList !== undefined && Array.isArray(classList)
      ? classList : null;
    var delimeterStr = delimeter !== undefined && typeof delimeter === 'string'
      ? delimeter : null;
    var foundClass = 0;
    if (
        classList === null
        && initialClassList.length
        && delimeterStr !== null
      ) {
      classList = initialClassList.split(delimeterStr);
    }

    for (var i = 0; i < noBackgroundColorArr.length; i += 1) {
      if (classList.indexOf(noBackgroundColorArr[i]) > -1) {
        foundClass = 1;
      }
    }

    return foundClass;
  }

  function appendStyleToDom(element, styleObj) {
    var elementId = (element !== "") ? "#" + element.attr("id") : styleObj.id;
    var cssColorRules = "";
    var cssBkgRules = "";
    var cssPosRules = "";
    var cssTopRules = "";
    var cssTransitionRules = "";
    if (styleObj.color !== "undefined" && typeof styleObj.color === "string") {
      cssColorRules = "color: " + styleObj.color + ";";
    }

    if (styleObj.backgroundColor !== "undefined" && typeof styleObj.backgroundColor === "string") {
      cssBkgRules = "background-color: " + styleObj.backgroundColor + ";";
    }

    if (styleObj.position !== "undefined" && typeof styleObj.position === "string") {
      cssPosRules = "position: " + styleObj.position + ";";
    }

    if (styleObj.top !== "undefined" && typeof styleObj.top === "string") {
      cssTopRules = "top: " + styleObj.top + ";";
    }

    if (styleObj.transition !== "undefined" && typeof styleObj.transition === "string") {
      cssTransitionRules = "transition: " + styleObj.transition + ";";
    }

    styleString = elementId + "::before {" + cssColorRules + "" + cssBkgRules + "" + cssPosRules + "" + cssTopRules + "" + cssTransitionRules + "}";
    var newStyles = $('<style>'+ styleString +'</style>');

    if (element !== "") {
      element.append(newStyles);
    } else {
      $(elementId).append(newStyles);
    }
  };

  function dragAndDrop(props) {
    /**
    * jquery-match-height master by @liabru
    * http://brm.io/jquery-match-height/
    * License: MIT
    */
    (function(c){"function"===typeof define&&define.amd?define(["jquery"],c):"undefined"!==typeof module&&module.exports?module.exports=c(require("jquery")):c(jQuery)})(function(c){var k=-1,f=-1,g=function(a){return parseFloat(a)||0},p=function(a){var b=null,d=[];c(a).each(function(){var a=c(this),e=a.offset().top-g(a.css("margin-top")),l=0<d.length?d[d.length-1]:null;null===l?d.push(a):1>=Math.floor(Math.abs(b-e))?d[d.length-1]=l.add(a):d.push(a);b=e});return d},m=function(a){var b={byRow:!0,property:"height",
    target:null,remove:!1};if("object"===typeof a)return c.extend(b,a);"boolean"===typeof a?b.byRow=a:"remove"===a&&(b.remove=!0);return b},b=c.fn.matchHeight=function(a){a=m(a);if(a.remove){var e=this;this.css(a.property,"");c.each(b._groups,function(a,b){b.elements=b.elements.not(e)});return this}if(1>=this.length&&!a.target)return this;b._groups.push({elements:this,options:a});b._apply(this,a);return this};b.version="master";b._groups=[];b._throttle=80;b._maintainScroll=!1;b._beforeUpdate=null;b._afterUpdate=
    null;b._rows=p;b._parse=g;b._parseOptions=m;b._apply=function(a,e){var d=m(e),h=c(a),f=[h],l=c(window).scrollTop(),k=c("html").outerHeight(!0),n=h.parents().filter(":hidden");n.each(function(){var a=c(this);a.data("style-cache",a.attr("style"))});n.css("display","block");d.byRow&&!d.target&&(h.each(function(){var a=c(this),b=a.css("display");"inline-block"!==b&&"flex"!==b&&"inline-flex"!==b&&(b="block");a.data("style-cache",a.attr("style"));a.css({display:b,"padding-top":"0","padding-bottom":"0",
    "margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px",overflow:"hidden"})}),f=p(h),h.each(function(){var a=c(this);a.attr("style",a.data("style-cache")||"")}));c.each(f,function(a,b){var e=c(b),f=0;if(d.target)f=d.target.outerHeight(!1);else{if(d.byRow&&1>=e.length){e.css(d.property,"");return}e.each(function(){var a=c(this),b=a.attr("style"),e=a.css("display");"inline-block"!==e&&"flex"!==e&&"inline-flex"!==e&&(e="block");e={display:e};e[d.property]=
    "";a.css(e);a.outerHeight(!1)>f&&(f=a.outerHeight(!1));b?a.attr("style",b):a.css("display","")})}e.each(function(){var a=c(this),b=0;d.target&&a.is(d.target)||("border-box"!==a.css("box-sizing")&&(b+=g(a.css("border-top-width"))+g(a.css("border-bottom-width")),b+=g(a.css("padding-top"))+g(a.css("padding-bottom"))),a.css(d.property,f-b+"px"))})});n.each(function(){var a=c(this);a.attr("style",a.data("style-cache")||null)});b._maintainScroll&&c(window).scrollTop(l/k*c("html").outerHeight(!0));return this};
    b._applyDataApi=function(){var a={};c("[data-match-height], [data-mh]").each(function(){var b=c(this),d=b.attr("data-mh")||b.attr("data-match-height");a[d]=d in a?a[d].add(b):b});c.each(a,function(){this.matchHeight(!0)})};var q=function(a){b._beforeUpdate&&b._beforeUpdate(a,b._groups);c.each(b._groups,function(){b._apply(this.elements,this.options)});b._afterUpdate&&b._afterUpdate(a,b._groups)};b._update=function(a,e){if(e&&"resize"===e.type){var d=c(window).width();if(d===k)return;k=d}a?-1===f&&
    (f=setTimeout(function(){q(e);f=-1},b._throttle)):q(e)};c(b._applyDataApi);var r=c.fn.on?"on":"bind";c(window)[r]("load",function(a){b._update(!1,a)});c(window)[r]("resize orientationchange",function(a){b._update(!0,a)})});
    var hasCompletionActionBeenCalled = false;
    var callCompletionAction = function(completionActionFunc){
        if(!hasCompletionActionBeenCalled){
            executeCompletionAction(completionActionFunc);
            hasCompletionActionBeenCalled = true;
        }
    };
    if (props !== undefined && typeof props === 'object') {
      var $dragOptionContainer = props.dragOptionContainer !== undefined && typeof props.dragOptionContainer === 'object'
        ? props.dragOptionContainer : null;
      var $dragOption = props.dragOption !== undefined && typeof props.dragOption === 'object'
        ? props.dragOption : null;
      var strAccept = props.accept !== undefined && typeof props.accept === 'string'
        ? props.accept : "";
      var $dropHeader = props.dropHeader !== undefined && typeof props.dropHeader === 'object'
        ? props.dropHeader : $('.sp_dropHeader');
      var $dropArea = props.dropArea !== undefined && typeof props.dropArea === 'object'
        ? props.dropArea : null;
      var strHoverClass = props.hoverClass !== undefined && typeof props.hoverClass === 'string'
        ? props.hoverClass : 'sp_drop_highlight';
      var $actionContainer = props.actionContainer !== undefined && typeof props.actionContainer === 'object'
        ? props.actionContainer : null;
      var $submitBtn = props.submitBtn !== undefined && typeof props.submitBtn === 'object'
        ? props.submitBtn : null;
      var $accessiblityContainer = props.accessiblityContainer !== undefined && typeof props.accessiblityContainer === 'object'
          ? props.accessiblityContainer : null;
      var accessibleBtn = props.accessibleBtn !== undefined && typeof props.accessibleBtn === 'object'
          ? props.accessibleBtn : null;
      var $mSubmitBtn = props.mobile.submitBtn !== undefined && typeof props.mobile.submitBtn === 'object'
        ? props.mobile.submitBtn : null;
      var $inputRadio = props.mobile.inputRadio !== undefined && typeof props.mobile.inputRadio === 'object'
        ? props.mobile.inputRadio : null;
      var cfCategoryObj = props.cfCategoryObj !== undefined && typeof props.cfCategoryObj === 'object'
        ? props.cfCategoryObj : null;
      var cfObjectKeys = Object.keys(cfCategoryObj);
      var $correctAnsBtn = props.correctAnsBtn !== undefined && typeof props.correctAnsBtn === 'object'
        ? props.correctAnsBtn : null;
      var $yourAnsBtn = props.yourAnsBtn !== undefined && typeof props.yourAnsBtn === 'object'
        ? props.yourAnsBtn : null;
      var $messageContainer =  props.messageContainer !== undefined && typeof props.messageContainer === 'object'
        ? props.messageContainer : null;
      var $formContainer = props.mobile.formContainer !== undefined && typeof props.mobile.formContainer === 'object'
          ? props.mobile.formContainer : null;
      var message = props.message !== undefined && typeof props.message === 'object'
        ? props.message : null;
      var mMessage = props.mobile.message !== undefined && typeof props.mobile.message === 'object'
          ? props.mobile.message : null;
      var autoId = props.autoId !== undefined && typeof props.autoId === 'string'
        ? props.autoId : '';
      var newDbCategoryObj = convertCFObj2JSObj({
        obj: {},
        cfObj: cfCategoryObj,
        cfobjKeys: cfObjectKeys
      });
      var jsCategoryObj = {};
      var mIndexArr = [];
      var wrongOptionsCount = props.wrongOptionsCount !== undefined && typeof props.wrongOptionsCount === 'number'
        ? props.wrongOptionsCount : 0;
      var completionActionFunc = props.completionAction !== undefined && props.completionAction.length
        ? props.completionAction : "";
       
    }
    var initObj = function () {
      var isMobile = bIsMobile;
      var hasTrackingData = getDragAndDropState({ autoId: autoId, isMobile: isMobile, dropHeader: $dropHeader });
      var $accessibleBtn = accessibleBtn.selector;
      var optionsArr = [];
      var selectedLen = optionsArr.length;
      var optionsLen = $dragOption.length;
      var checkedInputs = $('input[type=radio]:checked').length;

      if (!hasTrackingData) {
        if (!isMobile && scr_acc !== "on") {
          /**
            * we break out of the initObj when it's on desktop version
            * to prevent unnecessary setup of draggables and droppables
          **/
          shuffle($dragOption);
          setUPDraggables({ selector: $dragOption, zIndex: 100 });
          setUpDroppables({
            selector: {
              dropHeader: $dropHeader,
              dropArea: $dropArea,
              hoverClass: strHoverClass,
              accept: strAccept,
              optionContainer: $dragOptionContainer
            }
          });
        } else {
          $('div.sp_desktop').css('display', 'none');
          $('div.sp_mobile').css('display', 'block');
          $accessiblityContainer.addClass('sp_hidden');
          shuffle($formContainer);
          if (scr_acc !== "on") {
            $formContainer.each(function (index) {
              if (index) {
                $(this).addClass('sp_hidden');
              }
            });
          }
        }
      } else {
        if (selectedLen + checkedInputs === optionsLen || $($dragOptionContainer).children().length == 0) {
            hideOptionContainer({ optionContainer: $dragOptionContainer });
            $(".sp_action_container").removeClass("sp_hidden");
             $('#submitBtn_' + autoId).addClass('sp_hidden');
              initAnsBtns();
          if (scr_acc == "on") {
            $('.mobileAccBtn').css('display', 'block !important');
          }
        } else {
          if (!isMobile && scr_acc !== "on") {
            setUPDraggables({ selector: $dragOption, zIndex: 100 });
            setUpDroppables({
              selector: {
                dropHeader: $dropHeader,
                dropArea: $dropArea,
                hoverClass: strHoverClass,
                accept: strAccept,
                optionContainer: $dragOptionContainer
              }
            })
          } else {
            $('div.sp_desktop').css('display', 'none');
            $('div.sp_mobile').css('display', 'block');
          }
        }
      }
      
      $('#sp_desktop_'+ autoId).removeClass('sp_dragAndDropNotLoaded');
      $submitBtn.on('click', { isMobile: false }, submitEventHandler);
      $mSubmitBtn.on('click', { isMobile: true }, mSubmitEventHandler);
      $inputRadio.on('click', { isMobile: true }, inputEventHandler);
      $accessibleBtn.on(
        'click',
        {
          hasName: accessibleBtn.hasName,
          accessible: accessibleBtn.accessible,
          standard: accessibleBtn.standard
        },
        accessibiltyEventHandler
      );
    };
    initObj();

    /*
      we get the datavalue using the dragAndDropId then convert the data into an array
      by splitting the data on "-" into 2 different arrays that hold
      unique category data for each autoId.
      we then loop over this array and using the '@' symbol to split the arrayItems
      so we can get the relevant categoryIds and their options as separate arraysItems [category, optionsString]
      we store this in datArr variable.
      we then extract the category index from the dataArr[0].split('category')[1]
      we create the categoryAutoID by appending dataArr[0]+_+autoID.
      we also split the second half of the array using ',' delimeter to get the options array
      and store that in optionArr variable.
      we loop over this optionsArr variable, get each option item and addClass('sp_dropped_item),
      append that to the right category using $category.
      we compare the categoryIndex against the userCatIndex and mark each optionItem as correct or wrong.
    */
    function getDragAndDropState(props) {
      var autoID = props.autoId !== undefined && typeof props.autoId === 'string'
        ? props.autoId : null;
      var isAccessibleOn = props.isAccessibleOn !== undefined && typeof props.isAccessibleOn === 'string'
        ? props.isAccessibleOn : scr_acc;
      var isAccessibleBtn = props.isAccessibleBtn !== undefined && typeof props.isAccessibleBtn === "boolean"
        ? props.isAccessibleBtn : false;
      var $dropHeader = props.dropHeader !== undefined && typeof props.dropHeader === "object"
        ? props.dropHeader : null;
      var isMobile = props.isMobile !== undefined && typeof props.isMobile === 'boolean'
        ? props.isMobile : false;
      var dragAndDropId = "dragAndDrop_" + autoID;
      var trackingData = getDataValue(dragAndDropId);
      var categoryIndex = '';
      var categoryAutoID = '';
      var optionsArr = [];
      var selectedLen = optionsArr.length;
      var optionsLen = $dragOption.length;
      var checkedInputs = $('input[type=radio]:checked').length;
      if (trackingData.length) {
        var trackingDataArr = trackingData.split("-");
        if (isAccessibleOn === "on") {
          $accessiblityContainer.addClass('sp_hidden');
        }
        $dropHeader.matchHeight();
        $dropArea.matchHeight();

        if (selectedLen + checkedInputs === optionsLen || $($dragOptionContainer).children().length == 0) {

          $('.mobileSubmitBtn_' + autoID).prop('disabled', true).attr('aria-hidden', true);
          hideOptionContainer({ optionContainer: $dragOptionContainer });
          if (wrongOptionsCount || isAccessibleBtn) {
            showSubmitBtn();
            hideSubmitBtn({ errorCount: wrongOptionsCount });
            initAnsBtns({ useTrackingData: true, triggerSelector: $yourAnsBtn });
            $('.sp_action_container').removeClass('sp_hidden').css('visibility','visible');
            $('#submitBtn_' + autoId).addClass('sp_hidden');
          }
        }

        if (!$accessiblityContainer.hasClass('sp_hidden') && isMobileObj.any) {
          $accessiblityContainer.addClass('sp_hidden');
        }

        if (!$accessiblityContainer.hasClass('sp_hidden') && isMobileObj.any) {
          $accessiblityContainer.addClass('sp_hidden');
        }

        for (data in trackingDataArr) {
          if (typeof trackingDataArr[data] !== 'function') {
            var dataArr = trackingDataArr[data].split('@');
            var category = dataArr[0];
            var catIndex = category.replace(/(\D+)/gi, '');
            optionsArr = dataArr[1].split(',');
            categoryIndex = dataArr[0].split('category')[1];
            categoryAutoID = dataArr[0] + '_' + autoID;
            var $category = $('div[id="' + categoryAutoID + '"]');
            optionsArr = dataArr[1].split(',');
            var isCorrect = false;
            for (optionIndex in optionsArr) {
              var isCorrect = false;
              if (typeof optionsArr[optionIndex] !== 'function' && optionsArr[optionIndex].length) {
                var userCatIndex = optionsArr[optionIndex].split('_')[0];
                var labelThisCategory = $('label[ for=category' + userCatIndex + '_' + optionsArr[optionIndex] + ']').text();
                var selector = $('input[id="' + category + '_' + optionsArr[optionIndex] + '"]');
                $('form[id=' + optionsArr[optionIndex] + '] input[type=radio]').prop('disabled', true);
                selector.prop('checked', true);
                selector.parent().next('button').prop('disabled', true);

                if (catIndex === userCatIndex) {
                  isCorrect = true;
                }
                $('.correctAnswers_' + autoID).removeClass('.sp_hidden');
                if (!isCorrect) {
                  wrongOptionsCount += 1;
                } else {
                  wrongOptionsCount = 0;
                }

                showMessage({
                  selector: $('form[id=' + optionsArr[optionIndex] + '] .sp_message'),
                  errorCount: wrongOptionsCount,
                  isMobile: true,
                  correctAns: labelThisCategory
                });
              }
              if (typeof optionsArr[optionIndex] !== 'function') {
                var userCatIndex = optionsArr[optionIndex].split('_')[0];
                var thisOption = '.sp_desktop div[data-index="' + optionsArr[optionIndex] + '"]';

                $(thisOption)
                  .removeAttr('style')
                  .addClass('sp_dropped_item')
                  .detach()
                  .appendTo($category);

                  $('.sp_view_options > :last-child')
                  .fadeIn('slow')
                  .removeClass('sp_hidden');

                if (categoryIndex === userCatIndex) {
                  isCorrect = true;
                }
                $(thisOption).children('.sp_pill').children('span').addClass('sp_pull_left')

                if (isCorrect) {
                  $(thisOption).children('.sp_pill').addClass('correct');
                } else {
                  $(thisOption).children('.sp_pill').addClass('wrong');
                  wrongOptionsCount += 1;
                }
              }
            }
          }
        }
        callCompletionAction(completionActionFunc);
      }

      return trackingData.length !== 0;
    }

    function setUPDraggables (props) {
      var $selector = props.selector !== undefined && typeof props.selector === 'object'
        ? props.selector: null;
      var zIndex = props.zIndex;
      $selector.draggable({
        revert: "invalid",
        cursor: "move",
        zIndex: zIndex,
      });
      $selector
        .siblings('div')
        .not('.dragOptionContainer_'+autoId+' > :last-child')
        .addClass('sp_hidden');
      $(window).load(function(){
        $selector.draggable( "option", "cursorAt", {top: $selector.height()/2, left: $selector.width()/2 });
      })

    }

    function disableDraggables (props) {
      var $selector = props.selector !== undefined && typeof props.selector === 'object'
        ? props.selector : null;
      $selector.draggable('disable');
    }

    function setUpDroppables(props) {
      var selectorObj = props.selector !== undefined && typeof props.selector === 'object'
        ? props.selector : null;
      var $dropHeader = selectorObj.dropHeader !== undefined && typeof selectorObj.dropHeader === 'object'
        ? selectorObj.dropHeader : null;
      var $dropArea = selectorObj.dropArea !== undefined && typeof selectorObj.dropArea === 'object'
        ? selectorObj.dropArea : null;
      var hoverClass = selectorObj.hoverClass !== undefined && typeof selectorObj.hoverClass === 'string'
        ? selectorObj.hoverClass : null;
      var $accept = selectorObj.accept;
      var tolerance = selectorObj.tolerance !== undefined && typeof selectorObj.tolerance === 'string'
        ? selectorObj.tolerance : 'pointer';
      var $dragOptionContainer = selectorObj.optionContainer !== undefined && typeof selectorObj.optionContainer === 'object'
        ? selectorObj.optionContainer : null;
      $dropHeader.matchHeight();
      $dropArea.droppable({
        hoverClass: hoverClass,
        accept: $accept,
        tolerance: tolerance,
        over: function( event, ui ) {
          // we do this to reset height to auto when draggableItem is hovering
          var $item = ui.draggable;
          if ($item.hasClass('sp_dropped_item')){
            $item.css("height", "auto");
          }
        },
        drop: function(event, ui) {
          dropDraggedItem({
            item: ui.draggable,
            dropAreaId: event.target.id,
            dropAreaClass: $dropArea,
            optionContainer: $dragOptionContainer
          });
         }
      });
    }

    function disableDroppables (props) {
      var $selector = props.selector !== undefined && typeof props.selector === 'object'
        ? props.selector : null;
      $selector.droppable('disable');
    }



    function dropDraggedItem (props) {
      var $item = props.item;
      var $dropArea = props.dropAreaId;
      var $dropAreaClass= props.dropAreaClass;
      var $categoryDropArea = $('div[id="'+$dropArea+'"');
      var $optionContainer = props.optionContainer;
      var isOptionContainerEmpty = $optionContainer.children().length - 1;
      $item
        .removeAttr('style')
        .addClass('sp_dropped_item')
        .detach()
        .appendTo($categoryDropArea);

      $('.dragOptionContainer_'+autoId+' > :last-child')
      .fadeIn('slow')
      .removeClass('sp_hidden');
   
        
      $dropAreaClass.matchHeight();

      if (!isOptionContainerEmpty && !$optionContainer.children().length) {
        showSubmitBtn();
        hideOptionContainer({optionContainer: $optionContainer});        
      }
    }

    function accessibiltyEventHandler (event) {
      var accessibleBtnObj = event.data;
      $this = $(this);
      shuffle($formContainer);
      getDragAndDropState({
        autoId: autoId,
        isMobile: !$this.hasClass('on'),
        isAccessibleOn: scr_acc,
        isAccessibleBtn: true,
        dropHeader: $dropHeader
      });

      $this.toggleClass('on');
      if ($this.hasClass('on') ) {
        if (accessibleBtnObj.hasName){
          $this.children("span").text(accessibleBtnObj.standard.name);
        } else {
          $this.attr('aria-label', accessibleBtnObj.standard.ariaLabel);
        }
        $this.attr('title', accessibleBtnObj.standard.title);
        showDragAndDropMcq();
        hideDragandDropDesktop();
      } else {
        if (accessibleBtnObj.hasName){
          $this.children("span").text(accessibleBtnObj.accessible.name);
        } else {
          $this.attr('aria-label', accessibleBtnObj.accessible.ariaLabel);
        }
        $this.attr('title', accessibleBtnObj.accessible.title);
        showDragAndDropDesktop();
        hideDragAndDropMcq();
      }

      if(!isMobileObj.phone) {
        $formContainer.not(':last-child').css('border-bottom', '1px solid #dadada')
      }
    }

    function hideDragandDropDesktop() {
      $('#sp_desktop_'+ autoId).addClass('sp_hidden');
    }
    function showDragAndDropDesktop() {
      $('#sp_desktop_'+ autoId).removeClass('sp_hidden');
    }
    function hideDragAndDropMcq() {
      $('#sp_mobile_'+ autoId).addClass('sp_hidden');
    }
    function showDragAndDropMcq() {
      $('#sp_mobile_'+ autoId).removeClass('sp_hidden');
    }


    function inputEventHandler () {
      if(isMobileObj.tablet) {
        showNextMcq($(this).parents('form'));
      }
    }

    function setUpCatArr (props) {
      var catArr = props.catArr !== undefined && Array.isArray(props.catArr)
        ? props.catArr
        : [];
      var catCount = props.catCount !== undefined && typeof catCount === 'number'
        ? props.catCount
        : 0;
      var obj = props.obj !== undefined && typeof props.obj === 'object'
        ? props.obj
        : {};
      for (var category in obj) {
        catArr.push([category+ '@']);
        for (var option in obj[category]) {
          var value = typeof obj[category][option] !== 'string'
            ? ''
            : obj[category][option];
          var indexPos = value.indexOf('-');
          var nValue = indexPos !== -1 ? indexPos : value.length;
          var nIndex = indexPos !== -1 ? indexPos+1 : value.length;
          var index = value.substring(nIndex, value.length+1);
          value = value.substring(0, nValue);
          catArr[catCount].push(index);
        }
        // we subtract one from the catCount as we've just removed an item from thet CatArr
        if (catArr[catCount].length === 1) {
          catArr.pop();
          catCount -= 1;
        }
        catCount += 1;
      }
      return catArr;
    }

    function showSubmitBtn() { $actionContainer.removeClass('sp_hidden'); }

    function hideSubmitBtn(props) {
      var errorCount = props.errorCount;
      if (errorCount) {
        $submitBtn.addClass('sp_hidden');
      } else {
        $actionContainer.addClass('sp_hidden');
      }
    }

    function hideOptionContainer(props) { props.optionContainer.addClass('sp_hidden'); }

    function buildMessage(props) {
      var errorCount = props.count;
      var messageObj = props.messageObj;
      var correctAnswer = props.correctAnswer !== undefined && typeof props.correctAnswer === "string"
        ? props.correctAnswer : null;
      var message = messageObj.success;
      if (errorCount) {
        message = messageObj.error;
        if (correctAnswer !== null) {
          message = messageObj.error.replace(/(\[correctOption\])+/gi, correctAnswer);
        }
      }
      return message;
    }

    function showMessage(props) {
      var errorCount = props.errorCount;
      var $selector = props.selector;
      var isMobile = props.isMobile !== undefined && typeof props.isMobile === "boolean"
        ? props.isMobile : false;
      var correctAnswer = props.correctAns;
      var messageResult = buildMessage({count: errorCount, messageObj: message });
      $selector.removeClass('sp_hidden');
      if (errorCount) {
        $selector.addClass('wrong')
      } else {
        $selector.addClass('correct');
      }

      if(isMobile) {
        messageResult = buildMessage({count: errorCount, messageObj: mMessage, correctAnswer: correctAnswer });
      }

      if ($selector.children().length === 0) {
        $selector.append("<p class='message' role='alert'>" + messageResult + "</p>");
        $selector.focus();
        $selector.parents('form').next('form').focus();
      }

    }

    function setCategoryDataValue (identifier, catArr) {
      var id = identifier;
      var arr = catArr;
      var str = arr.join(',').replace(/@,/g, '@');
      str = str.replace(/,category+/g, '-category');
      setDataValue(id, str);
    }

    // mobile submitEventHandler
    function mSubmitEventHandler(event) {
      event.preventDefault();
      var $this = $(this);
      var isMobile = event.data.isMobile;
      var thisIndex = $this.parents('form').attr('id');
      var thisCategory = 'category'+thisIndex.split('_')[0];
      var $thisInput = $('input[name="categories_'+ thisIndex +'"]');
      var labelThisCategory = $('label[for='+thisCategory+'_'+thisIndex+']').text();
      var $thisInputChecked = $('input[name="categories_'+ thisIndex +'"]:checked');
      var $thisMessageContainer = $this.siblings('.sp_message');
      var thisInputValue = $thisInputChecked.val();
      var isCorrect = thisCategory === thisInputValue;
      var catDataStr = thisInputValue+'@'+thisIndex;
      var mCatArr = [];
      var mCatCount = 0;
      var tempArr = [];
      var optionsLen;
      var selectedOptionsLen;
      
      mIndexArr.push(catDataStr);
      jsCategoryObj = createJSCategoryObj({
        mIndexArr: mIndexArr,
        isMobile: isMobile,
        inputValue: thisInputValue,
        obj: jsCategoryObj,
        tempArr: tempArr
      });

      mCatArr = setUpCatArr({
        catArr: mCatArr,
        catCount: mCatCount,
        obj: jsCategoryObj,
      });

      if ($thisInputChecked.prop('checked') !== true){
        if(props.message.hasOwnProperty('alert')) {
          alert(message.alert);
        } else {
          alert("Please check one of the options!");
        }
        $thisInput.focus();
        return false;
      }

      setCategoryDataValue("dragAndDrop_"+autoId, mCatArr);

      if (!isCorrect) {
        wrongOptionsCount += 1;
      }

      $thisInput.each(function(index, element){
        var $thisInput = $(this);
        $thisInput.prop('disabled', true);
      });

      $this.prop('disabled', true).attr('aria-hidden', true);
      hideSubmitBtn({ errorCount: wrongOptionsCount });

      showMessage({
        selector: $thisMessageContainer,
        isMobile: true,
        errorCount: wrongOptionsCount,
        correctAns: labelThisCategory
      });

        if(isMobileObj.phone) {
            showNextMcq($('form[id="'+thisIndex+'"'));
        }
        wrongOptionsCount = 0;
        optionsLen = $dragOption.length;
        selectedOptionsLen = $('#sp_mobile_'+autoId+'').find('input[type=radio]:checked').length;
        if (optionsLen == selectedOptionsLen) {
            callCompletionAction(completionActionFunc);
        }
    }

    function showNextMcq (formSelector) {
      var $formId = formSelector;
      $formId
        .siblings('form.sp_hidden')
        .eq(0)
        .insertAfter($formId)
        .fadeIn(1000)
        .removeClass('sp_hidden')
        .css('border-bottom', '1px solid #dadada');
    }

    function submitEventHandler() {
      disableDraggables({selector: $dragOption});
      disableDroppables({selector: $dropArea});
      /*
        1.  loop through all categories and compare each option element against the
            $categoryObj.category[i]['options'] array
        2.  mark element option as correct if you can find it in the newDbCategoryObj.category[i]['options']
            array and wrong if not
        3.  add up the number of correct options and number of wrong options
        4.  display message to say all is correct if the user gets all answers right and
            if they don't display message to say how many the got wrong.
      */
     var catArr = [];
     var catCount = 0;
      jsCategoryObj = createJSCategoryObj({selector: $dropArea, obj: jsCategoryObj});
      for (category in jsCategoryObj) {
        catArr.push([category+ '@']);
        for (option in jsCategoryObj[category]) {
          var value = typeof jsCategoryObj[category][option] !== 'string'
            ? ''
            : jsCategoryObj[category][option];
          var indexPos = value.indexOf('-');
          var nValue = indexPos !== -1 ? indexPos : value.length;
          var nIndex = indexPos !== -1 ? indexPos+1 : value.length;
          var index = value.substring(nIndex, value.length+1);
          var catIndexPos = index.indexOf('_');
          var nCatIndexPos = catIndexPos !== -1 ? catIndexPos : index.length;
          var nCatIndexValue = index.substring(0, nCatIndexPos);
          value = value.substring(0, nValue);
          var isCorrect = false;
          catArr[catCount].push(index);
          if ( category.indexOf(nCatIndexValue) !== -1 ) {
            isCorrect = true;
          }
          var pillSelector = 'div[data-index="' + index + '"] > .sp_pill';
          var pillSpanSelector = strAccept + ' .sp_pill > span'
          $(pillSpanSelector).addClass('sp_pull_left');
          if (isCorrect) {
            $(pillSpanSelector).parents(pillSelector).addClass('correct');
          } else {
            wrongOptionsCount += 1;
            $(pillSpanSelector).parents(pillSelector).addClass('wrong');
          }
        }
        // we subtract one from the catCount as we've just removed an item from thet CatArr
        if (catArr[catCount].length === 1) {
          catArr.pop();
          catCount -= 1;
        }
        catCount += 1;
      }
      $dropArea.matchHeight();
      setCategoryDataValue("dragAndDrop_"+autoId, catArr);

      showMessage({
        selector: $messageContainer,
        errorCount: wrongOptionsCount
      });

      hideSubmitBtn({ errorCount: wrongOptionsCount });

      if (wrongOptionsCount) {
        initAnsBtns();
      } else {
        callCompletionAction(completionActionFunc);
      }
    }

    function initAnsBtns(props) {
      var def = props || {};
      var useTrackingData = def.useTrackingData !== undefined && typeof def.useTrackingData === 'boolean'
        ? def.useTrackingData
        : false;
      var isMobile =  def.isMobile !== undefined && typeof def.isMobile === 'boolean'
        ? def.isMobile
        : false;
      var $mCorrectAnsBtn = def.correctAnsBtn !== undefined && typeof def.correctAnsBtn === 'object'
        ? def.correctAnsBtn
        : null;
      var $mYourAnsBtn = def.yourAnsBtn !== undefined && typeof def.yourAnsBtn === 'object'
          ? def.yourAnsBtn
          : null;
      var dataIndex = def.dataIndex !== undefined && typeof def.dataIndex === 'string'
          ? def.dataIndex
          : null;
      var inputChecked = def.inputChecked !== undefined && typeof def.inputChecked === 'object'
          ? def.inputChecked
          : null;
      var $triggerSelector = def.triggerSelector !== undefined && typeof def.triggerSelector === 'object'
        ? def.triggerSelector : null;

      if(!isMobile) {
        $correctAnsBtn.removeClass('sp_hidden');
        $correctAnsBtn.on(
          'click',
          {
            useTrackingData: useTrackingData
          },
          correctAnsBtnHandler
        );

        $yourAnsBtn.on(
          'click',
          {
            useTrackingData: useTrackingData
          },
          yourAnsBtnHandler
        );

        if($triggerSelector !== null){
          $triggerSelector.trigger('click', { useTrackingData: true }, yourAnsBtnHandler);
        }

      } else {
        // we reset mobile version to default state
        if (!$mYourAnsBtn.hasClass('sp_hidden')) {
          $mYourAnsBtn.addClass('sp_hidden');
        }

        $mCorrectAnsBtn.removeClass('sp_hidden');
        $mCorrectAnsBtn.on(
          'click',
          {
            dataIndex: dataIndex,
            yourAnsBtn: $mYourAnsBtn,
            isMobile: isMobile,
            useTrackingData: useTrackingData
          },
          mCorrectAnsBtnHandler
        );

        $mYourAnsBtn.on(
          'click',
          {
            dataIndex: dataIndex,
            inputChecked: inputChecked,
            correctAnsBtn: $mCorrectAnsBtn
          },
          mYourAnsBtnEventHandler
        );
      }
    }

    // mobile correctAnswerBtn config
    function mCorrectAnsBtnHandler (event) {
      event.preventDefault();
      var $this = $(this);
      var dataIndex = event.data.dataIndex;
      var $mYourAnsBtn = event.data.yourAnsBtn;
      var catIndex;
      var correctCatIndex = dataIndex.split('_')[0];
      $mYourAnsBtn.removeClass('sp_hidden');
      $this.addClass('sp_hidden');
      for (category in newDbCategoryObj) {
        catIndex = category.replace(/(\D+)/gi, '');
        if(catIndex !== correctCatIndex) {
          $('input[id="category'+correctCatIndex+'_'+dataIndex+'"]')
            .prop('checked', true);
        }
      }
    }

    // mobile yourAnswerBtn config
    function mYourAnsBtnEventHandler (event) {
      event.preventDefault();
      var dataIndex = event.data.dataIndex;
      var $inputChecked = event.data.inputChecked;
      var $mCorrectAnsBtn = event.data.correctAnsBtn;
      var $this = $(this);
      $this.addClass('sp_hidden');
      $mCorrectAnsBtn.removeClass('sp_hidden');
      var formId = $('#'+dataIndex);
      formId.children('fieldset.correctAnswers').remove();
      formId.children('fieldset.yourAnswers').removeClass('sp_hidden');
      $inputChecked.prop('checked', true);
    }

    // correctAnsBtn config
    function correctAnsBtnHandler() {
      $yourAnsBtn.removeClass('sp_hidden');
      $correctAnsBtn.addClass('sp_hidden');
      for (category in newDbCategoryObj) {
        var categoryID = 'div[id="' + category+'_'+autoId + '"]';
        var categoryOptions = newDbCategoryObj[category];
        $(categoryID)
          .children()
          .removeClass('drag_option')
          .addClass('sp_hidden yourAnswers');
        for (options in categoryOptions) {
          var optionContainer = (function () {
            var openingDiv = '<div class="sp_view_option_container sp_dropped_item correctAnswers">';
            var closingDiv = '</div>';
            var childDiv = (
              '<div class="sp_pill correct">'
              + '<span class="sp_pull_left">' + categoryOptions[options]+ '</span>'
              + '</diV>'
            );

            if (categoryOptions[options].length && typeof categoryOptions[options] !== 'function') {
              if (options % 2) {
                return closingDiv + openingDiv + childDiv + closingDiv;
              } else {
                return openingDiv + childDiv + closingDiv;
              }
            }
          })();
          $(categoryID).append(optionContainer);
        }
      }
      $dropArea.matchHeight();
        callCompletionAction(completionActionFunc);
    }

    // yourAnsBtn config
    function yourAnsBtnHandler(event) {
      var useTrackingData = event.data.useTrackingData;
      $yourAnsBtn.addClass('sp_hidden');
      $correctAnsBtn.removeClass('sp_hidden');
      for (category in newDbCategoryObj) {
        var categoryID = 'div[id="' + category+'_'+autoId + '"]';
        if(!useTrackingData) {
          $(categoryID).children('.yourAnswers').removeClass('sp_hidden');
        } else {
          $(categoryID).children('.yourAnswers').removeClass('sp_hidden');
        }
        $(categoryID).children('.correctAnswers').remove();
      }
      $dropArea.matchHeight();
    }
  }

  function setStorageItem (props) {
    var dataKey = props.dataKey !== undefined && typeof props.dataKey === 'string'
      ? props.dataKey
      : null;
    var stringifyResult = props.data !== undefined && typeof data !== 'string' || typeof data !== 'number'
      ? JSON.stringify(props.data)
      : null;
    var storage = props.storage !== undefined && typeof props.storage === 'object'
      ? props.storage
      : localStorage;

    storage.setItem(dataKey, stringifyResult);
  }

  function getStorageItem (props) {
    var dataKey = props.dataKey !== undefined && typeof props.dataKey === 'string'
      ? props.dataKey
      : null;
    var storage = props.storage !== undefined && typeof props.storage === 'object'
      ? props.storage
      : localStorage;
    var result = storage.getItem(dataKey);
    var parsedResult = JSON.parse(result);

    return parsedResult;
  }

  function removeStorageItem (props) {
    var dataKey = props.dataKey !== undefined && typeof props.dataKey === 'string'
      ? props.dataKey
      : null;
    var storage = props.storage !== undefined && typeof props.storage === 'object'
      ? props.storage
      : localStorage;
    storage.removeItem(dataKey);
  }

  function createJSCategoryObj(props) {
    var obj = props.obj !== undefined && typeof props.obj === 'object'
      ? props.obj : {};
    var $selector = props.selector !== undefined && typeof props.selector === 'object'
      ? props.selector : null;
    var isMobile = props.isMobile !== undefined && typeof props.isMobile === 'boolean'
      ? props.isMobile : false;
    var mArr = props.mIndexArr !== undefined && Array.isArray(props.mIndexArr)
      ? props.mIndexArr : [];
    var tempArray = props.tempArr !== undefined && Array.isArray(props.tempArr)
      ? props.tempArr : [];
    var thisInputValue = props.inputValue !== undefined && typeof props.inputValue === 'string'
      ? props.inputValue : null;
    var optionExists = false;

    if(!isMobile) {
      $selector.each(function () {
        var $this = $(this);
        var $thisObjKey = $this.attr('id');
        var $thisObjKeyPos = $thisObjKey.indexOf('_');
        var n = $thisObjKeyPos !== -1 ? $thisObjKeyPos : $thisObjKey.length;
        $thisObjKey = $thisObjKey.substring(0, n);
        obj[$thisObjKey] = [];
        $this.children().each(function () {
          var $thisChild = $(this);
          var thisChildValue = 'dragOption';
          var thisChildIndex = $thisChild.data('index');
          thisChildValue = thisChildValue+"-"+thisChildIndex;
          obj[$thisObjKey].push(thisChildValue);
        })
      });
    }
    /*  we do this so that we can use this code to set session storage
      for desktop and mobile version as well as createJSObj for mobile version
    */
    if(isMobile) {
      mArr.forEach(function(element){
        if (element.indexOf(thisInputValue+'@') > -1) {
          var option = element.replace(thisInputValue+'@', '');
          if(tempArray.length > 1){
            optionExists = tempArray.indexOf('dragoption-'+option) !== -1;
          }
          if(!optionExists){
            tempArray.push('dragoption-'+option);
          }
          obj[thisInputValue] = tempArray;
        }
      });
    }

    return obj;
  }

  function executeCompletionAction (completionAction) {
    var $fn = completionAction;
    var semiColon= ';';
    if ($fn.length) {
      if($fn.indexOf(semiColon) === -1) {
        $fn = $fn+semiColon;
      }
      /*
        we use the Function constructor as this is safer than using the eval function
      */
      return Function('"use strict"; '+ $fn)();
    }
  }

  function convertCFObj2JSObj(props){
    var obj = props.obj;
    var cfObj = props.cfObj;
    var objKeys = props.cfobjKeys;
    for(key in objKeys) {
      if(typeof objKeys[key] === 'string' && objKeys[key].indexOf('category') > -1){
        obj[objKeys[key]] = cfObj[objKeys[key]]['options'];
      }
    }
    return obj;
  }

  // the max is exlucded from the random number generated
  function getRandomIntMaxExclusive(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function shuffle(selector) {
    var selectorParent = selector.parent();
    var arr = Array.prototype.slice.call(selector);
    var arrLength = arr.length;
    var i = 0;
    var newArr = [];
    var randIdx;
    var isNewIdx;
    var arrItem;

    for (i = arrLength-1; i>=0; i--) {
        isNewIdx = false;
        while (!isNewIdx) {
            randIdx = getRandomIntMaxExclusive(0, arrLength);
            arrItem = arr[randIdx];
            isNewIdx = newArr.indexOf(arrItem) === -1;
            if (isNewIdx) {
              newArr.push(arrItem);
              break;
            }
         }
    }
    selectorParent.append(newArr);
  }

  function createCertificateId(userName,userId,title) {
    var certIdPart1 = (title.length*userName.length).toString();
    var certIdPart2 = (title.length*userId.length).toString();
    var certId = "sc1-" + certIdPart1.slice(-3) + "-" + certIdPart2.slice(-3);
    return certId;
  }

  function replaceTagInString(tag,val,str) {
    var strArray = str.split("[" + tag + "]");
    if(strArray.length > 1) {
      return strArray.join(val);
    } else {
      return str;
    }
  }

  function dateToString(dateObj,mask) {
    return formatDateAsString(dateObj,mask);
  }

  function createCertificateHTML() {
    var certHTML = mod_certificate;
    var userInfo = getUserInfo();
    var userName = userInfo.name;
    var userId = userInfo.id;
    var userNameArray = userName.split(",");
    var completionDateString = userInfo.completionDate;
    var completionDateDDMMMYYYY = completionDateString;
    var score = getScore();
    var title = moduleTitleEn;
    if(userNameArray.length === 2) {
      userName = userNameArray[1].trim() + " " + userNameArray[0].trim();
    }
    if(isNaN(score)) {
      score = "-";
    } else {
      score += "%";
    }
    if(userInfo.hasOwnProperty("completionDateTime")) {
      var cDate = new Date(userInfo.completionDateTime);
      completionDateDDMMMYYYY = dateToString(cDate,"dd mmm yyyy");
    }
    certHTML = replaceTagInString("name",userName,certHTML);
    certHTML = replaceTagInString("title",title,certHTML);
    certHTML = replaceTagInString("local_title",moduleTitleLocal,certHTML);
    certHTML = replaceTagInString("user_id",userId,certHTML);
    certHTML = replaceTagInString("cert_id",createCertificateId(userName,userId,title),certHTML);
    certHTML = replaceTagInString("score",score,certHTML);
    certHTML = replaceTagInString("date",completionDateString,certHTML);
    certHTML = replaceTagInString("dateDDMMMYYYY",completionDateDDMMMYYYY,certHTML);
    return certHTML;
  }

  function printCertificate(showPrintDialog) {
    var headtag = "";
    $("head link").each(function () {
      headtag += $(this).prop("outerHTML");
    });
    $("head style").each(function () {
      headtag += $(this).prop("outerHTML");
    });
    var previewHTML = "<!DOCTYPE html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><title>Certificate</title>" + headtag + "<style type=\"text/css\" media=\"all\">@page {size: portrait} </style></head><body>";
    previewHTML += createCertificateHTML();
    previewHTML += "</body></html>";
    var xdoc = window.open("", "Certificate", "width=842,height=595,location=0,menubar=0,toolbar=0");
    xdoc.document.write(previewHTML);
    xdoc.document.close();
    xdoc.focus();
    if(typeof showPrintDialog === 'undefined' || showPrintDialog === true){
        xdoc.onload = function () {
            xdoc.print();
        };
    }
  }

  function printCertificateInline() {
    printHtml(createCertificateHTML());
  }

  function printHtml(content) {
    var newContents = document.createElement("div");
    newContents.innerHTML = content;
    document.getElementById("contentDiv").style.display = "none";
    document.getElementById("scr_body").appendChild(newContents);
    self.print();
    document.getElementById("scr_body").removeChild(newContents);
    document.getElementById("contentDiv").style.display = "block";
  }

  function capitalizeString (obj) {
    var rgx = /\s{2,}/g;
    var str = (typeof obj.str !== "undefined" && typeof obj.str === "string") ? obj.str : "";
    var argsCamelCase = (typeof obj.camelCase !== "undefined" && typeof obj.camelCase === "boolean") ? obj.camelCase : false;
    var delim = (typeof obj.delim !== "undefined" && typeof obj.delim === "string") ? obj.delim : "";
    var lCaseStr = str.toLowerCase().trim().replace(rgx,'');
    var lCaseArr = lCaseStr.split(" ");
    var lCaseArrLen = lCaseArr.length;
    var capsArr = [];
    var capsStr;
    var thisStr;
    var thisStrArr;
    var thisCapStr;
  var i = 0;

    for (; i < lCaseArrLen; i++) {
      thisStr= lCaseArr[i];
      thisStrArr = thisStr.split("");
      thisCapStr = thisStrArr[0];
      if (!delim) {
        if(!argsCamelCase || i) {
          thisCapStr = thisCapStr.toUpperCase();
        }
      }

      thisStrArr.splice(0,1, thisCapStr);
      capsArr.push(thisStrArr.join(""));
    }

  if (!delim) {
    delim = argsCamelCase ? "" : " ";
  }
  capsStr = capsArr.join(delim);

    return capsStr;
  }

  function flipCard(props) {

    var def = {
      "autoId": "",
      "cardLen": "",
      "config": "",
      "addElement": "",
      "removeElement": "",
      "nextPage": "",
      "popup": "no",
      "popup_title": "",
      "popup_body": "",
      "popup_option": "Cancel",
      "popup_width": "50%",
      "popup_delay": "1000"
    };

    var prop;
    for (prop in props) {
      def[prop] = props[prop];
    };

    var autoId = def.autoId;
    var cardLen = def.cardLen;
    var config = def.config;
    var isFlipped;
    var cardsId;
    var elementsInCards;
    var elementInCardsLen;
    var elementsWithClassLen;
    var $this;
    var flipEffect;
    var backCard;
    var textArea;
    var frontCard;
    var infoSpan;
    var accTimeOut;
    var thisIndex;
    var thisCard;
    var thisFlipEffect;
    var i;

    function checkCompletion() {
      var completed = getDataValue('completed'+autoId);
      if (completed === 'yes') {
        return true;
      }
    };

    for (i = 0; i < cardLen; i++) {
      thisIndex = i + 1;
      thisCard = "[id = card_" + thisIndex + "_" + autoId + "]";
      thisFlipEffect = config[i].flipCardAnimationOption;
      $(thisCard).on("click keypress", { flipEffect: thisFlipEffect }, function (e) {
        if (
          event.type == "click" ||
          (event.type == "keypress" && (event.which == 13 || event.which == 32))
        ) {
          $this = $(this);
          $this.toggleClass("clicked");
          flipEffect = e.data.flipEffect;
          $this.toggleClass(flipEffect);
          frontCard = $this.children('.flipCard__face--front');
          backCard = $this.children('.flipCard__face--back');
          textArea = backCard.children('.flipCard-textBack');
          textFront = frontCard.children('.flipCard-textFront');
          isFlipped = $this.hasClass('clicked');
          infoSpan = frontCard.children('.infoSpan');
          infoSpan.attr("aria-hidden", "false");
          textArea.attr("aria-hidden", "true");
          frontCard.focus();
          $this.attr("data-card", "front");
          clearTimeout(accTimeOut);
          if (!backCard.hasClass('.' + flipEffect)) {
            backCard.addClass(flipEffect);
          }
          accTimeOut = setTimeout(function () {
            if (isFlipped) {
              $this.attr("data-card", "back");
              textArea.attr("aria-hidden", "false");
              textFront.css("display", "none");
              backCard.css('backface-visibility','visible');
              backCard.css('-webkit-backface-visibility','visible');
              backCard.focus();
              infoSpan.attr("aria-hidden", "true");
            } else {
              textFront.css("display", "table-cell");
              backCard.css('backface-visibility','hidden');
              backCard.css('-webkit-backface-visibility','hidden');
            }
          }, 200);
          $this.addClass('counted' + autoId);
          cardsId = $('#cards' + autoId);
          elementsInCards = cardsId.children('div');
          elementInCardsLen = elementsInCards.length;
          elementsWithClassLen = $('.counted' + autoId).length;
          if (!checkCompletion()) {
            if (elementsWithClassLen === elementInCardsLen) {
              if (def.popup == 'no') {
                completionActions();
              } else {
                setTimeout(function(){
                  confirmPopup(autoId, def.popup_title, def.popup_body, def.popup_option, "", completionActions, def.popup_width, "center");
                },def.popup_delay)
              }
            }
          }
        }
      });
    }
    if (checkCompletion()) {
        completionActions();
    }

    function completionActions() {
      setDataValue('completed'+autoId,'yes');
      addAndRemoveFunction(def.addElement, def.removeElement, "element");
      toggleNextPage(def.nextPage);
    };
  }

  function confirmPopup(id, title, msg, firstBtn, secondBtn, callback, width, controlsPosition) {
    function getWidth() {
      var size = window.matchMedia('(max-width: 600px)');
      if (size.matches) {
        width = '95%';
      }
      return width;
    };

    var popUp_content = $('<div>').addClass('popup_dialog-ovelay').attr('id','popup_dialog'+id).append([
      $('<div>').attr('role','dialog').attr('tabindex','0').addClass('popup_dialog').css('width',getWidth()).append([
        $('<header>').append([
          $('<div>').addClass('popup_title').html(title),
          $('<span>').addClass('popup_closeBtn').html('&#10005').click(closePopup)
        ]),
        $('<div>').addClass('popup_dialog-msg').html(msg),
        $('<div>').addClass('popup_controls').css('text-align',controlsPosition).append([
          $('<button>').addClass('popup_button completionActions').html(firstBtn).click(callbackFunction),
           (secondBtn) ?
            $('<button>').addClass('popup_button cancelAction').html(secondBtn).click(closePopup) : null
        ])
      ]),
    ]);
  
    $(popUp_content).insertAfter($('#contentinner'));
    addFocusToPopup();
  
    function callbackFunction() {
      if (callback !== undefined && typeof (callback) === "function") {
        callback();
      } else {
        $(this).parents('.popup_dialog-ovelay').fadeOut(500, function () {
          $(this).remove();
        });
      }
      $(this).parents('.popup_dialog-ovelay').fadeOut(500, function () {
        $(this).remove();
      });
    };
  
    function closePopup() {
      $(this).parents('.popup_dialog-ovelay').fadeOut(500, function () {
        $(this).remove();
      });
    };
  
    function addFocusToPopup() {
      var focusableElements = 'button, span, div';
      var modal = $('#popup_dialog' + id);
      var firstFocusableElement = $(modal).find(focusableElements)[0];
      var focusableContent = $(modal).find(focusableElements);
      var lastFocusableElement = focusableContent[focusableContent.length - 1];
  
      document.addEventListener('keydown', function (e) {
        var isTabPressed = e.key === 'Tab';
        if (!isTabPressed) {
          return;
        }
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      });
      firstFocusableElement.focus();
    };
  };

  function hideMenuButton() {
    var menuBtn = $('#menu-btn');
    var menuContent = $('.responsive-menu');
    var isOpen = $(menuContent).hasClass('expand');
    menuBtn.css('visibility', 'hidden');
    if (isOpen) {
      $(menuContent).toggleClass('expand');
    }
  }

  function showMenuButton() {
    var menuBtn = $('#menu-btn');
    menuBtn.css('visibility', 'visible');
  }

  function hideResourcesButton() {
    var resourcesBtn = $('#linkedResources');
    var content = $('#linkedResourcesListWrapper');
    var isOpen = content.css('display') == 'block';
    if (isOpen) {
      content.hide();
    }
    resourcesBtn.hide();
  }

  function showResourcesButton() {
    var resourcesBtn = $('#linkedResources');
    resourcesBtn.show();
  }

  function hideSettings() {
    var languages = $('#lang');
    var audioIcon = $('#audio_icon');
    audioIcon.hide();
    languages.hide();
  }

  function showSettings() {
    var languages = $('#lang');
    var audioIcon = $('#audio_icon');
    languages.show();
    audioIcon.show();
  }

  return {
    matchHeights: matchHeights,
    openWindow: openWindow,
    elementLookUp: elementLookUp,
    addCssId: addCssId,
    onAddElement: onAddElement,
    isSmallScreen: isSmallScreen,
    hideElement: hideElement,
    focusElement: focusElement,
    removeElement: removeElement,
    removeElementAcc: removeElementAcc,
    addElementWithDelay: addElementWithDelay,
    removeElementWithDelay: removeElementWithDelay,
    addElementAndScrollToBottom: addElementAndScrollToBottom,
    addElementAndScrollToAnchor: addElementAndScrollToAnchor,
    getRandomInt: getRandomInt,
    getRandomIntMaxExclusive: getRandomIntMaxExclusive,
    addElement: addElement,
    focusElementTabableContent: focusElementTabableContent,
    showElement: showElement,
    showNext: showNext,
    hideNext: hideNext,
    showBack: showBack,
    hideBack: hideBack,
    showNextOnSmall: showNextOnSmall,
    showNextWithDelay: showNextWithDelay,
    getPageInfo: getPageInfo,
    getUserInfo: getUserInfo,
    getSections: getSections,
    getSectionStatus: getSectionStatus,
    getSubSectionProgress: getSubSectionProgress,
    sectionStatusIcon: sectionStatusIcon,
    subSectionCompleted: subSectionCompleted,
    getSubSections: getSubSections,
    subSectionNavigation: subSectionNavigation,
    subSectionStatusIcon: subSectionStatusIcon,
    gotoPage: gotoPage,
    gotoPageTitle: gotoPageTitle,
    gotoPageId: gotoPageId,
    refreshPage: refreshPage,
    nextPage: nextPage,
    previousPage: previousPage,
    pageTitleCompleted: pageTitleCompleted,
    toolTip: toolTip,
    clickToReveal: clickToReveal,
    accordion: accordion,
    imagemap: imagemap,
    viewVideoTranscript: viewVideoTranscript,
    flip: flip,
    chart_bar: chart_bar,
    bulletList: bulletList,
    isInPage: isInPage,
    appendStyleToDom: appendStyleToDom,
    simpleSlideShow: simpleSlideShow,
    audioPlay: audioPlay,
    audioReset: audioReset,
    audioStop: audioStop,
    audioResetAll: audioResetAll,
    audioStopAll: audioStopAll,
    audioShow: audioShow,
    audioHide: audioHide,
    toggleLinkedResources: toggleLinkedResources,
    addNotebookQuestion: addNotebookQuestion,
    chatMcqInit: chatMcqInit,
    chatMcqQuestion: chatMcqQuestion,
    focusSelector: '',
    typewriter: typewriter,
    arrayToNiceList: arrayToNiceList,
    findClass: findClass,
    materialAccordion: materialAccordion,
    dragAndDrop: dragAndDrop,
    setStorageItem: setStorageItem,
    getStorageItem: getStorageItem,
    removeStorageItem: removeStorageItem,
    materialSlideshow: materialSlideshow,
    printCertificate: printCertificate,
    printCertificateInline: printCertificateInline,
    printHtml: printHtml,
    dateToString: dateToString,
    capitalizeString: capitalizeString,
    flipCard: flipCard,
    hideMenuButton: hideMenuButton,
    showMenuButton: showMenuButton,
    hideResourcesButton: hideResourcesButton,
    showResourcesButton: showResourcesButton,
    showSettings: showSettings,
    hideSettings: hideSettings,
    confirmPopup: confirmPopup
  }
}
//pointers for backwards compatibility
function addCssId(css_id, autoId, delay, entry, maxwidth) {
  SKILLCASTAPI.addCssId(css_id, autoId, delay, entry, maxwidth);
}
function hideElement(css_id) {
  SKILLCASTAPI.hideElement(css_id);
}
function removeElement(css_id) {
  SKILLCASTAPI.removeElement(css_id);
}
function removeElementAcc(css_id) {
  SKILLCASTAPI.removeElementAcc(css_id);
}
function addElementWithDelay(css_id, entry, delay) {
  SKILLCASTAPI.addElementWithDelay(css_id, entry, delay);
}
function addElement(css_id, entry, autoPlay) {
  SKILLCASTAPI.addElement(css_id, (entry || -1), (autoPlay || true));
}
function showElement(autoId, entry, maxwidth) {
  SKILLCASTAPI.showElement(autoId, entry, maxwidth);
}
function showNext(trigger) {
  var isScrolling = isScrollingSkin();
  if(!isScrolling){
    SKILLCASTAPI.showNext((trigger || true));
  }
  else {
    SKILLCASTSCROLLINGAPI.showNextOrContinue('external');
  }
}
function hideNext() {
  var isScrolling = isScrollingSkin();
  if(!isScrolling){
    SKILLCASTAPI.hideNext();
  }
  else {
    SKILLCASTSCROLLINGAPI.hideNextOrContinue('external');
  }
}
function showNextOnSmall() {
  SKILLCASTAPI.showNextOnSmall();
}
function showNextWithDelay(delay) {
  SKILLCASTAPI.showNextWithDelay(delay);
}
function sp_viewtranscript(def) {
  SKILLCASTAPI.viewVideoTranscript(def);
}
function sp_clicktoreveal(def) {
  SKILLCASTAPI.clickToReveal(def);
}

function arrayToNiceList(inputArray) {
  var inputArrayLen = inputArray.length;
  var list = "";
  var sep = "";
  for(var i = 0; i < inputArrayLen; i++){
    sep = (i === 0) ? "" : ((i+1) < inputArrayLen) ? ", " : " & ";
    list += sep + inputArray[i];
  }
  return list;
}