forceCloseAfterLMSFinish = false;   scormMode = "live";   scormLog = [];   errorMode = "response";      scormLocal = [];   function setLocalEntry(p,v) {    var scormLocalLength = scormLocal.length;    var index = scormLocalLength;    for(var i=0; i<scormLocalLength; i++) {     if(scormLocal[i].nam === p) {      index = i;      break;     };    };    scormLocal[index] = {     "nam":p,     "val":v    };    return "true";   };   function getLocalEntry(p) {    var scormLocalLength = scormLocal.length;    var v = "undefined";    for(var i=0; i<scormLocalLength; i++) {     if(scormLocal[i].nam === p) {      v = scormLocal[i].val;      break;     };    };    return v;   };      function checkLastError() {    var errorCode = scormApi.LMSGetLastError();    if(errorCode == "" || errorCode == "0" || errorCode == 0) {     return "true";    } else {     return "false";    }   };   function cleanReturnVal(v) {    if(v == "true" || v === true) {     return "true";    } else {     return "false";    }   };      function tryAPI(win) {    var findAPITries = 0;    while ( (win.API == null) && (win.parent != null) && (win.parent != win) ) {      findAPITries++;     if (findAPITries > 10) {      return null;     }     win = win.parent;    }    return win.API;   };   function getAPI() {    var theAPI = tryAPI(parent);    if ( (theAPI == null) && (opener != null) && (typeof(opener) != "undefined") ) {     theAPI = tryAPI(opener);    }    return theAPI;   };   function findAPI() {    self.scorm12Api = getAPI();    if(self.scorm12Api == null) {     return false;    }    return true;   };   self.scormApi = {    LMSInitialize: function(p) {     var returnVal = cleanReturnVal(scorm12Api.LMSInitialize(p));     scormLog.push({      "command":"LMSInitialize",      "response":returnVal     });     if(errorMode === "check") {      returnVal = checkLastError();     }     var lesson_mode = scormApi.LMSGetValue("cmi.core.lesson_mode");     if(lesson_mode === "review" || lesson_mode === "browse") {      scormMode = "local";     } else {      scormApi.LMSSetValue("cmi.core.exit","suspend");     }     return returnVal;    },    LMSCommit: function(p) {     if(scormMode === "local") {      var returnVal = "true";     } else {      var returnVal = cleanReturnVal(scorm12Api.LMSCommit(p));      scormLog.push({       "command":"LMSCommit",       "response":returnVal      });      if(errorMode === "check") {       returnVal = checkLastError();      }     }     return returnVal;    },    LMSFinish: function(p) {     if(scormMode !== "local") {      scormApi.LMSSetValue("cmi.core.exit","suspend");     }     var returnVal = cleanReturnVal(scorm12Api.LMSFinish(p));     scormLog.push({      "command":"LMSFinish",      "response":returnVal     });     return returnVal;    },    LMSGetValue: function(p) {     var getFromLms = true;     if(scormMode === "local" || scormMode === "module") {      var returnVal = getLocalEntry(p);      if(returnVal !== "undefined") {       getFromLms = false;      }     }     if(getFromLms) {      var returnVal = scorm12Api.LMSGetValue(p);      scormLog.push({       "command":"LMSGetValue(" + p + ")",       "response":returnVal      });     }     return returnVal;    },    LMSSetValue: function(p,v) {     var returnVal = "false";     if(scormMode === "local" || scormMode === "module") {      returnVal = setLocalEntry(p,v);     }     if(scormMode !== "local" || p === "cmi.core.session_time") {      returnVal = cleanReturnVal(scorm12Api.LMSSetValue(p,v));      scormLog.push({       "command":"LMSSetValue(" + p + "," + v + ")",       "response":returnVal      });      if(errorMode === "check") {       returnVal = checkLastError();      }     }     return returnVal;    },    LMSGetLastError: function() {     return scorm12Api.LMSGetLastError();    },    LMSGetErrorString: function(p) {     return scorm12Api.LMSGetErrorString(p);    },    LMSGetDiagnostic: function(p) {     return scorm12Api.LMSGetDiagnostic(p);    },    GetScormLog: function() {     return scormLog;    },    scr_setScormVersion: function(v) {     if(typeof scorm12Api.scr_setScormVersion === "function") {      return scorm12Api.scr_setScormVersion(v);     }    },    scr_getScormId: function() {     if(typeof scorm12Api.scr_getScormId === "function") {      return scorm12Api.scr_getScormId();     }    },    scr_getAjaxUrl: function() {     if(typeof scorm12Api.scr_getAjaxUrl === "function") {      return scorm12Api.scr_getAjaxUrl();     }    },     scr_openSco: function(scoId,container) {     if(typeof scorm12Api.scr_openSco === "function") {      return scorm12Api.scr_openSco(scoId,container);     }    },    scr_getState: function() {     if(typeof scorm12Api.scr_getState === "function") {      return scorm12Api.scr_getState();     }    },    scr_setSessionValue: function(nam,val) {     if(typeof scorm12Api.scr_setSessionValue === "function") {      return scorm12Api.scr_setSessionValue(nam,val);     }    },    scr_getSessionValue: function(nam) {     if(typeof scorm12Api.scr_getSessionValue === "function") {      return scorm12Api.scr_getSessionValue(nam);     }    },    scr_scoSetting: function() {     if(typeof scorm12Api.scr_scoSetting === "function") {      return scorm12Api.scr_scoSetting();     }    }      };