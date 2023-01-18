// POLYFILL START

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

// POLYFILL END

//scorm error handling
function killSession() {
	var errorCode = "";
	var errorString = "";
	var errorDiagnostic = "";
	var scormLogHtml = "<p style='font-size:9pt'>SCORM LOG:";
	try {
		errorCode = self.scormApi.LMSGetLastError();
	} catch (e) {
		errorCode = "Unable to access LMS error code";
	}
	try {
		errorString = self.scormApi.LMSGetErrorString(errorCode);
	} catch (e) {
		errorString = "Unable to access LMS error string";
	}
	try {
		errorDiagnostic = self.scormApi.LMSGetDiagnostic(errorCode);
	} catch (e) {
		errorDiagnostic = "Unable to access LMS error diagnostics";
	}
	errorMessage += "<br/><p style='font-size:9pt'>LMS Error Code: " + errorCode;
	errorMessage += "<br/>LMS Error Type: " + errorString;
	errorMessage += "<br/>LMS Error Diagnostic: " + errorDiagnostic + "</p>";
	try {
		var scormLog = self.scormApi.GetScormLog();
		var scormLogLength = scormLog.length;
		for (var i = 0; i < scormLogLength; i++) {
			scormLogHtml += "<br/>" + scormLog[i].command + ": " + scormLog[i].response;
		}
		scormLogHtml += "</p>";
	} catch (e) {
		scormLogHtml = "";
	}
	errorMessage += scormLogHtml;
	setTimeout(function () {
		displayFullScreenMessage(errorMessage);
	}, 1000);
}

function warnSession() {
	displayWarningMessage(self.errorMessage);
}

function displayWarningMessage(message) {
	var bodyTarget = $("body");
	var newMessageDiv = $("<div></div>")
		.css("position", "absolute")
		.css("top", "auto")
		.css("left", "0px")
		.css("right", "0px")
		.css("bottom", "0px")
		.css("font-family", "arial")
		.css("font-size", "12pt")
		.css("font-weight", "bold")
		.css("text-align", "center")
		.css("vertical-align", "middle")
		.css("z-index", "9999")
		.css("color", "#ffffff")
		.css("background-color", "#cc0000")
		.css("padding", "10px")
		.html(message)
		.hide();
	bodyTarget.append(newMessageDiv);
	newMessageDiv.show(400);
}

function displayFullScreenMessage(message) {
	var bodyTarget = $("body");
	bodyTarget.wrapInner("<div id='hideBody' />");
	var hideBody = $("#hideBody");
	hideBody.hide();
	var newMessageDiv = $("<div></div>")
		.css("position", "absolute")
		.css("top", "0px")
		.css("left", "0px")
		.css("right", "0px")
		.css("bottom", "0px")
		.css("font-family", "arial")
		.css("font-size", "12pt")
		.css("font-weight", "bold")
		.css("text-align", "left")
		.css("vertical-align", "middle")
		.css("padding", "10px")
		.html(message)
		.hide();
	bodyTarget.append(newMessageDiv);
	newMessageDiv.show(400);
}

function lmsSetValueResponse(response, key) {
	if (!((typeof response === "string" || typeof response === "boolean") && response == "true")) {
		errorMessage = "Error: The module could not set the value of " + key + " in the Learning Management System.<br><br>Please close this window and relaunch the module from the Learning Management System.";
		killSession();
	}
}
function lmsCommitResponse(response) {
	if (showWarningAfterCommitFails && !((typeof response === "string" || typeof response === "boolean") && response == "true")) {
		errorMessage = "Warning: The Learning Management System did not save your data correctly.";
		warnSession();
	}
}
function lmsFinishResponse(response) {
	if ((typeof response === "string" || typeof response === "boolean") && response == "true") {
		displayFullScreenMessage("If this window does not close automatically please close it manually.");
		if (forceCloseAfterLMSFinish) {
			top.close();
		}
	}
}

//create custom path
function updatePageInfo() {
	var p = 0;
	var pp = 0;
	var psa = [];
	var psl = 1;
	var ps = 0;
	var m = 0;
	for (var i = 0; i < scr_pages.length; i = i + 1) {
		pp = pp + 1;
		if ((scr_pages[i].type == "h1" || scr_pages[i].type == "survey" || scr_pages[i].type == "menu" || scr_pages[i].type.length == 35) && !scr_pages[i].hide) {
			if (psl > 0) {
				psa[psl] = pp;
			}
			psl = pp;
		}
	}
	if (psl > 0) {
		psa[psl] = pp;

	}
	for (var i = 0; i < scr_pages.length; i = i + 1) {
		p = p + 1;
		if ((scr_pages[i].type == "h1" || scr_pages[i].type == "survey" || scr_pages[i].type == "menu" || scr_pages[i].type.length == 35) && !scr_pages[i].hide) {
			ps = p;
			m = m + 1;
		}
		scr_pages[i].section = m;
		scr_pages[i].sectionstart = ps;
		scr_pages[i].sectionend = psa[ps];
	}
}

function updatePathAndProgress(createPath) {
	var useCreateCustomPath = (typeof createPath === "boolean") ? createPath : true;
	if(useCreateCustomPath){
		createCustomPath();
	}
	if(isScrollingSkin()){
		setProgressData();
		SKILLCASTSCROLLINGAPI.refreshMenu();
	}
	else {
		clearProgressBar();
		renderProgressBar();
		renderHBmenu();
	}
}



function createCustomPath() {
	var removeOffset = 1;
	var removeObjOffset = 1;
	var removePagesData = getDataValue('removePages');
	var removePages = function(pages) {
		var removePageArray = pages.split(","),
		removePageArrayLen = removePageArray.length,
		removePageArrayItem, removePageRange, removePageRangeStart, removePageRangeEnd,
		i, j;
		for (i = 0; i < removePageArrayLen; i++) {
			removePageArrayItem = removePageArray[i];
			removePageRange = removePageArrayItem.split("-");
			removePageRangeStart = Number(removePageRange[0]);
			if (removePageRange.length == 2) {
				removePageRangeEnd = Number(removePageRange[1]);
				for (j = removePageRangeStart; j <= removePageRangeEnd; j++) {
					scr_pages.splice(j - removeOffset, 1);
					removeOffset = removeOffset + 1;
				};
			} else {
				scr_pages.splice(removePageRangeStart - removeOffset, 1);
				removeOffset++;
			};
		};
	};
	var removeObjectivesData = getDataValue('removeObjectives');
	var setScrPagesClean = function(){
		if (typeof scr_pages_clean === "undefined") {
			scr_pages_clean = JSON.stringify(scr_pages);
		} else {
			scr_pages = JSON.parse(scr_pages_clean);
		}
	};
	var removeObjectives = function(objectives) {
		var removeObjArray = objectives.split(","),
		removePageArray = [],
		removePageArrayLen = 0,
		removePageSectionsOnlyArray = [],
		removePageSectionsOnlyArrayLen = 0,
		removeSectionsOnly = {},
		scr_pagesLen = scr_pages.length,
		i, j, r, objectiveId, scrollingSections, scrollingSectionsLen, scrollingSectionObject,
		found = false, key;
		for (i = 0; i < scr_pagesLen; i++) {
			objectiveId = scr_pages[i].objectiveId;
			scrollingSections = (scr_pages[i].hasOwnProperty("scrollingSections")) ? scr_pages[i].scrollingSections : [];
			scrollingSectionsLen = scrollingSections.length;
			if (objectiveId.length > 0 && $.inArray(objectiveId, removeObjArray) > -1) {
				removePageArray.push(i);
			}
			if(scrollingSectionsLen > 0){
				found = false;
				for(r = 0; r < scrollingSectionsLen; r++){
					scrollingSectionObject = scrollingSections[r];
					objectiveId = scrollingSectionObject.objective;
					if (objectiveId.length > 0 && $.inArray(objectiveId, removeObjArray) > -1) {j
						key = i;
						if (!found) {
							removePageSectionsOnlyArray.push(key);
						}
						if(!(typeof removeSectionsOnly[key] === 'object')) {
							removeSectionsOnly[key] = [r];
						} else {
							removeSectionsOnly[key].push(r);
						}
						found = true;
					}
				}
			}
		}
		removePageSectionsOnlyArrayLen = removePageSectionsOnlyArray.length;
		for (i = (removePageSectionsOnlyArrayLen - 1); i > -1; i--) {
			key = removePageSectionsOnlyArray[i];
			section = removeSectionsOnly[key];
			sectionLen = section.length;
			for (r = (sectionLen - 1); r > -1; r--) {
				scr_pages[key].scrollingSections.splice(section[r], 1);
			};
		}
		removePageArrayLen = removePageArray.length;
		for (i = (removePageArrayLen - 1); i > -1; i--) {
			scr_pages.splice(removePageArray[i], 1);
			removeObjOffset++;
		};
	};

	setScrPagesClean();
	if (removePagesData != "") {
		removePages(removePagesData);
	}
	if (removeObjectivesData != "") {
		removeObjectives(removeObjectivesData);
	}

	completionPage = defaultCompletionPage - removeOffset - removeObjOffset + 2;
	if (removeOffset + removeObjOffset > 2) {
		updatePageInfo();
	};
}

//connect to LMS, get suspend data
function initTracking() {
	var foundAPI = findAPI(),
		initialize,
		initializeTypeof;
	if (foundAPI) {
		initialize = self.scormApi.LMSInitialize("");
		initializeTypeof = (typeof initialize);
		if (
			(initializeTypeof === "string" && initialize.toLowerCase() === "true")
			||
			(initializeTypeof === "boolean" && initialize)
		) {
			initSession();
		} else {
			errorMessage = "Error: The module could not initialize communication with the Learning Management System.<br><br>Please close this window and relaunch the module from the Learning Management System.";
			killSession();
		};
	} else {
		errorMessage = "Error: The module could not connect to the Learning Management System.<br><br>Please close this window and relaunch the module from the Learning Management System.";
		killSession();
	};
};

function getSuspendDataPart(suspend_data, start, end) {
	var suspendDataPart = suspend_data.split(start)[1];
	if (end.length > 0) {
		suspendDataPart = suspendDataPart.split(end)[0];
	}
	return suspendDataPart;
};

function initSession() {
	lpr_data = "";
	var progress = 0;
	var lpr_completionDate = "";
	var trackingArray = new Array();
	var defTrackingArray = new Array();
	if (lpr_tracking.length > 0) {
		defTrackingArray = lpr_tracking.split(";");
	};
	var defTrackingArrayLength = defTrackingArray.length;
	var reqAct = 0;
	var reqActComp = 0;
	var dataArray = new Array();
	var sessionArray = new Array();
	var sessionTime = new Date();
	var new_status = self.scormApi.LMSGetValue("cmi.core.lesson_status");
	var new_status_start = new_status.toLowerCase().substring(0, 1);
	var scormloc = self.scormApi.LMSGetValue("cmi.core.lesson_location");
	var suspend_data = self.scormApi.LMSGetValue("cmi.suspend_data");
	var isAudioOn = true;
	var isAccessibleOn = true;
	var useURL;
	if (typeof scr_formats === "object") {
		if (typeof scr_formats.isAudioOn === "boolean") {
			isAudioOn = scr_formats.isAudioOn;
		}
		if (typeof scr_formats.isAccessibleOn === "boolean") {
			isAccessibleOn = scr_formats.isAccessibleOn;
		}
	}
	if (new_status === "" || new_status_start === "n" || new_status_start === "u") {
		new_status = "incomplete";
		if (new_status_start === "n") {
			scormloc = "0,on";
			suspend_data = "";
		}
	}
	if (suspend_data.length > 10) {
		progress = getSuspendDataPart(suspend_data, ";progress:", ";");
		var completedPart = getSuspendDataPart(suspend_data, ";Completed:", ";")
		if (completedPart.length > 0) {
			lpr_completionDate = completedPart;
		}
		var dataPart = getSuspendDataPart(suspend_data, ";Data:", "")
		if (dataPart.length > 0) {
			dataArray = dataPart.split("|");
			lpr_data = dataPart;
		}
		var trackingPart = getSuspendDataPart(suspend_data, ";Tracking:", ";progress");
		if (trackingPart.length > 0) {
			trackingArray = trackingPart.split(";");
			var trackingArrayLength = trackingArray.length;
			for (var i = 0; i < defTrackingArrayLength; i = i + 1) {
				for (var j = 0; j < trackingArrayLength; j = j + 1) {
					if (defTrackingArray[i].split("!")[2] == trackingArray[j].split("!")[2]) {
						defTrackingArray[i] = trackingArray[j];
					}
				}
			}
			if (defTrackingArrayLength > 0) {
				lpr_tracking = defTrackingArray.join(";");
			}
		}
		if (suspend_data.indexOf(";Sessions:") >= 0) {
			var sessionPart = getSuspendDataPart(suspend_data, ";Sessions:", ";");
			if (sessionPart.length > 0) {
				sessionArray = sessionPart.split("|");
			}
		}
	}
	lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.lesson_status", new_status), "cmi.core.lesson_status");
	sessionArray[sessionArray.length] = sessionTime.getTime();
	var new_data = "Version:6,0,en;Completed:" + lpr_completionDate + ";Sessions:" + sessionArray.join("|") + ";Tracking:" + lpr_tracking + ";progress:" + progress + ";Data:" + dataArray.join("|");
	lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.suspend_data", new_data), "cmi.suspend_data");
	createCustomPath();
	if (scormloc == "") {
		loc = 0;
	} else {
		scormlocArray = scormloc.split(",");
		scormlocArrayLength = scormlocArray.length;
		loc = scormlocArray[0];
		if (isNaN(loc) || loc >= scr_pages.length || typeof scr_pages[loc] !== "object" || scr_pages[loc] === null) {
			loc = 0;
		} else if (typeof modlbl_bookmark !== "undefined" && modlbl_bookmark.length > 0 && loc > 0) {
			if (!confirm(modlbl_bookmark)) {
				loc = 0;
			}
		}
		if (scormlocArrayLength > 1 && scormlocArray[1] === "off") {
			audio = "off";
		}
		if (scormlocArrayLength > 2 && scormlocArray[2] === "on") {
			acc = "on";
		}
		if (!(typeof lmsLang !== "undefined" && lang === lmsLang) && scormlocArrayLength > 3 && scormlocArray[3] !== lang) {
			lang = scormlocArray[3];
		}
	}
	if (!isAccessibleOn) {
		acc = "off";
	}
	if (!isAudioOn && acc === "off") {
		audio = "on";
	}
	useURL = scr_pages[loc].id + '-' + audio + '-' + acc + '-' + lang + '.htm';
	if (useFrameset) {
		document.getElementById("scr_frame").src = useURL;
	} else if (usePopup) {
		skillcastPopup();
	} else {
		self.location = useURL;
	}
}

function processTracking() {
	if (findAPI()) {
		try {
			suspend_data = self.scormApi.LMSGetValue("cmi.suspend_data");
			//set data list
			if (suspend_data.split(";Data:")[1].length > 0) {
				lpr_data = suspend_data.split(";Data:")[1];
			} else {
				lpr_data = "";
			};
			//set current completion date and session array
			if (suspend_data.split(";Completed:")[1].split(";")[0].length > 0) {
				lpr_completionDate = suspend_data.split(";Completed:")[1].split(";")[0];
			} else {
				lpr_completionDate = "";
			};
			lpr_sessions = suspend_data.split(";Sessions:")[1].split(";")[0];
			sessionArray = lpr_sessions.split("|");
			//set assessment list
			if (suspend_data.split(";Tracking:")[1].split(";progress")[0].length > 0) {
				lpr_tracking = suspend_data.split(";Tracking:")[1].split(";progress")[0];
			};
			//set progress measure
			progress = suspend_data.split(";progress:")[1].split(";")[0];
			createCustomPath();
			updateTracking();
		}
		catch (e) {
			var error_suspend_data = self.scormApi.LMSGetValue("cmi.suspend_data");
			errorMessage = "The Learning Management System returned invalid suspend data.<br><br>Suspend data: " + error_suspend_data + "<br><br>Please close this window to continue.";
			killSession();
		}
	} else {
		killSession();
	};
};

function getTrackingArrayChecks(){
	var returnObject = {
		updateStatus: false,
		new_status: "",
		reqAct: 0,
		reqActComp: 0,
		scoreraw: 0,
		scoremax: 0,
		scoreattempts: 0,
		trackingArray: [],
		trackingArrayLen: 0,
		trackingObject: {}
	},
	updateStatus = false,
	new_status = "",
	reqAct = 0,
	reqActComp = 0,
	scoreraw = 0,
	scoremax = 0,
	scoreattempts = 0,
	trackingObject = {},
	trackingArray = getTrackingArray(),
	trackingArrayLen = trackingArray.length,
	scr_pagesLen = scr_pages.length,
	i, j, trackingRequired,
	trackingArrayObject, trackingArrayObjectId,
	trackingArrayObjectAttempts, trackingArrayObjectAttemptsLen,
	trackingArrayObjectStatus,
	trackingArrayData, trackingArrayExempt,
	attemptLimit, checkReqActComp, isTrackingRequired, isReqActComp;

	for (i = 0; i < trackingArrayLen; i++) {
		trackingRequired = 0;
		trackingArrayObject = trackingArray[i];
		trackingArrayObjectId = trackingArrayObject.id;
		trackingArrayObjectAttempts = trackingArrayObject.attempts;
		trackingArrayObjectAttemptsLen = trackingArrayObjectAttempts.length;
		trackingArrayObjectStatus = trackingArrayObject.status;
		for (j = 0; j < scr_pagesLen; j++) {
			if (scr_pages[j].type == trackingArrayObjectId) {
				trackingRequired = scr_pages[j].required;
			}
		}
		trackingArrayData = getDataValue(trackingArrayObjectId);
		trackingArrayExempt = getDataValue("exempt-" + trackingArrayObjectId);
		isTrackingRequired = (trackingRequired == 1);
		checkReqActComp = (trackingArrayData != "x" && trackingArrayExempt != "y" && isTrackingRequired);
		isReqActComp = (trackingArrayObjectStatus == 1);
		if (checkReqActComp) {
			reqAct++;
			scoreattempts += trackingArrayObjectAttemptsLen;
			scoremax += 100;
			if (isReqActComp) {
				reqActComp++;
			} else {
				attemptLimit = getAttemptLimit(trackingArrayObjectId);
				if (attemptLimit > 0 && trackingArrayObjectAttemptsLen >= attemptLimit) {
					updateStatus = true;
					new_status = "failed";
				}
			};
			if (alwaysReportBestScore) {
				scoreraw += trackingArrayObject.score;
			} else {
				if (trackingArrayObjectAttemptsLen > 0) {
					scoreraw += trackingArrayObjectAttempts[trackingArrayObjectAttemptsLen - 1].score;
				}
			}
		};
		
		trackingObject[trackingArrayObjectId] = {
			isTrackingRequired: isTrackingRequired,
			checkReqActComp: checkReqActComp,
			isReqActComp: isReqActComp
		};
	};

	returnObject = {
		updateStatus: updateStatus,
		new_status: new_status,
		reqAct: reqAct,
		reqActComp: reqActComp,
		scoreraw: scoreraw,
		scoremax: scoremax,
		scoreattempts: scoreattempts,
		trackingArray: trackingArray,
		trackingArrayLen: trackingArrayLen,
		trackingObject: trackingObject
	};

	return returnObject;
};
function updateTracking() {
	var setThisPageNo = function(){
		var i, scr_pagesLen = scr_pages.length;
		for (i = 0; i < scr_pagesLen; i++) {
			if (scr_pages[i].id == thisPageId) {
				thisPageNo = i;
			};
		};
		nextPageNo = thisPageNo + 1;
		previousPageNo = thisPageNo - 1;
		pageEx = scr_pages[thisPageNo].pageEx;
		pageExComp = 0;
	},
	getSessionTime = function(){
		var sessionTime = new Date();
		var time_ts = Math.round((sessionTime - sessionArray[sessionArray.length - 1]) / 1000, 0);
		var time_tm = Math.floor(time_ts / 60);
		var time_h = Math.floor(time_tm / 60);
		var time_s = time_ts - (60 * time_tm);
		var time_m = time_tm - (60 * time_h);
		time_h = "0000" + time_h + "";
		time_h = time_h.substr(time_h.length - 4, 4);
		time_m = "00" + time_m + "";
		time_m = time_m.substr(time_m.length - 2, 2);
		time_s = "00" + time_s + "";
		time_s = time_s.substr(time_s.length - 2, 2);
		return time_h + ":" + time_m + ":" + time_s;
	},
	getAndSetStatusCheck = function(trackingChecks){
		var setCustomStatus = (typeof customCompletionAction === "boolean") ? customCompletionAction : false,
		updateStatus = (!setCustomStatus && progress + 1 >= completionPage && trackingChecks.reqActComp >= trackingChecks.reqAct),
		returnObject = {
			updateStatus: updateStatus,
			new_status: ""
		}; 
		if (updateStatus) {
			if (typeof trackUnassessedAsCompleted === "boolean" && trackUnassessedAsCompleted && scoremax === 0) {
				returnObject.new_status = "completed";
			} else {
				returnObject.new_status = "passed";
			}
			if (lpr_completionDate == "") {
				var d = new Date();
				lpr_completionDate = d.getTime();
			};
		};
	
		return returnObject;
	},
	updateTrackingScore = function(new_status, trackingChecks) {
		var isNewStatusPassed = (new_status == "passed"),
		trackingArrayLen = trackingChecks.trackingArrayLen,
		cmiScoreRaw = self.scormApi.LMSGetValue("cmi.core.score.raw"),
		scoremax = trackingChecks.scoremax,
		scoreraw = trackingChecks.scoreraw,
		scoreattempts = trackingChecks.scoreattempts,
		setCompletion_score = (typeof setCompletionScore === "boolean") ? setCompletionScore : true;
		if (isNewStatusPassed && trackingArrayLen == 0 && (cmiScoreRaw == "" || cmiScoreRaw == "0") && setCompletion_score) {
			setScore(100);
		}
		else if (isNewStatusPassed && scoremax > 0 && cmiScoreRaw != "" + Math.round(100 * scoreraw / scoremax, 0)) {
			setScore(Math.round(100 * scoreraw / scoremax, 0));
		}
		else if (scoremax == 100 && scoreattempts > 0 && cmiScoreRaw != "" + Math.round(100 * scoreraw / scoremax, 0)) {
			setScore(Math.round(scoreraw, 0));
		};
	};
	if (findAPI()) {
		try {
			//set current page context
			setThisPageNo();
			//set session time
			var st = getSessionTime();
			//set assessment data
			var trackingChecks = getTrackingArrayChecks();
			var new_status = (trackingChecks.updateStatus) ? trackingChecks.new_status : self.scormApi.LMSGetValue("cmi.core.lesson_status");
			var statusCheck;

			//set progress measure
			progress = Math.max(progress, thisPageNo);
			linearMaxPage = progress;

			//set status
			statusCheck = getAndSetStatusCheck(trackingChecks);
			if(statusCheck.updateStatus){
				new_status = statusCheck.new_status;
			}
		
			//update LMS training record
			setSuspendData();
			if (scormVersion == "2004") {
				var pm = Math.min(1,Math.max(0,Math.round((Number(progress)+1)*100/Number(completionPage),0))/100);
				lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.progress_measure", pm + ""), 'cmi.progress_measure');
			}
			lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.lesson_location", thisPageNo + "," + scr_audio + "," + scr_acc + "," + scr_lang), 'cmi.core.lesson_location');
			lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.lesson_status", new_status), 'cmi.core.lesson_status');
			updateTrackingScore(new_status, trackingChecks);
			lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.session_time", st + ""), 'cmi.core.session_time');
		}
		catch (e) {
			var error_suspend_data = self.scormApi.LMSGetValue("cmi.suspend_data");
			errorMessage = "Failed to update tracking data.<br><br>Please close this window to continue.";
			killSession();
		}
	} else {
		killSession();
	};
};

function clearProgressBar() {
	$("#progress-bar-container").empty();
	$("#progress-tip-container").empty();
}

function renderProgressBar() {
	var drawProgressBar = function() {
		var hbno = 0;
		var scr_pagesLen = scr_pages.length;
		for (var i = 0; i < scr_pagesLen; i++) {
			hbno = i + 1;
			var scrProgressOuterId = document.getElementById('scr_progress_outer');
			var h = document.getElementById('progress-bar-container');
			var ht = document.getElementById('progress-tip-container');
			var s = document.createElement('td');
			s.id = "progbar_" + hbno;
			s.style.height = "22px";
			var hasSvgSupport = supportsSvg();
			scrProgressOuterId.setAttribute('aria-hidden', 'true');
			if (hasSvgSupport) {
				var NS = "http://www.w3.org/2000/svg";
				var svg = document.createElementNS(NS, "svg");
				var svgNS = svg.namespaceURI;
				var rect = document.createElementNS(svgNS, 'rect');
				rect.setAttribute('x', 0);
				rect.setAttribute('y', 0);
				rect.setAttribute('width', '100%');
				rect.setAttribute('height', 22);
				svg.style.width = '100%';
				svg.style.height = '22px';
				svg.style.boxSizing = 'border-box';
				svg.style.display = 'block';
				svg.appendChild(rect);
				svg.setAttribute("focusable", false);
			}
			if (hbno == 1) {
				s.style.backgroundColor = validHexCode(modprg_comp);
				s.style.cursor = "pointer";
				if (hasSvgSupport) {
					svg.setAttribute('class', 'progressBarCompFill');
					svg.style.fill = validHexCode(modprg_comp);
				};
				s.onclick = function () {
					var pNo = $(this).prop("id");
					gotoPage(pNo.split("_")[1]);
				};
				h.appendChild(s);
				if (hasSvgSupport) { document.getElementById(s.id).appendChild(svg) };
				var t = document.createElement('div');
				t.id = "progbar_" + hbno + "_tip";
				t.className = "tooltipContent";
				t.innerText = scr_pages[i].title;
				ht.appendChild(t);
				var ptt = new Spry.Widget.Tooltip("progbar_" + hbno + "_tip", "#progbar_" + hbno);
			} else if (thisPageNo + 1 >= hbno) {
				s.style.backgroundColor = validHexCode(modprg_comp);
				s.style.cursor = "pointer";
				s.style.borderLeft = "1px solid #eaeaea";
				if (hasSvgSupport) {
					svg.setAttribute('class', 'progressBarCompFill');
					svg.style.fill = validHexCode(modprg_comp);
				};
				s.onclick = function () {
					var pNo = $(this).prop("id");
					gotoPage(pNo.split("_")[1]);
				};
				h.appendChild(s);
				if (hasSvgSupport) { document.getElementById(s.id).appendChild(svg) };
				var t = document.createElement('div');
				t.id = "progbar_" + hbno + "_tip";
				t.className = "tooltipContent";
				t.innerText = scr_pages[i].title;
				ht.appendChild(t);
				var ptt = new Spry.Widget.Tooltip("progbar_" + hbno + "_tip", "#progbar_" + hbno);
			} else if (thisPageNo + 1 < hbno && progress + 1 >= hbno) {
				s.style.backgroundColor = validHexCode(modprg_visit);
				s.style.cursor = "pointer";
				s.style.borderLeft = "1px solid #eaeaea";
				if (hasSvgSupport) {
					svg.setAttribute('class', 'progressBarVisitFill');
					svg.style.fill = validHexCode(modprg_visit);
				};
				s.onclick = function () {
					var pNo = $(this).prop("id");
					gotoPage(pNo.split("_")[1]);
				};
				h.appendChild(s);
				if (hasSvgSupport) { document.getElementById(s.id).appendChild(svg) };
				var t = document.createElement('div');
				t.id = "progbar_" + hbno + "_tip";
				t.className = "tooltipContent";
				t.innerText = scr_pages[i].title;
				ht.appendChild(t);
				var ptt = new Spry.Widget.Tooltip("progbar_" + hbno + "_tip", "#progbar_" + hbno);
			} else {
				s.style.backgroundColor = validHexCode(bgcolor);
				s.style.borderLeft = "1px solid #eaeaea";
				if (hasSvgSupport) {
					svg.setAttribute('class', 'progressBarFill');
					svg.style.fill = validHexCode(bgcolor);
				};
				h.appendChild(s);
				if (hasSvgSupport) { document.getElementById(s.id).appendChild(svg) };
			}
	
		}
	};
	if(!isScrollingSkin() && (scr_acc == "off" && showProgress == "yes" && !assessmentInProgress)) {
		drawProgressBar();
	}
}

function getSectionsProgressData(pageObject, pageIndex) {
	var scrollingSections = pageObject.scrollingSections,
	scrollingSectionsLen = scrollingSections.length,
	pageId = pageObject.autoId,
	visitedKey = "sectionsVisited-" + pageId,
	visitedData = getDataValue(visitedKey).split(","),
	visitedDataLen = visitedData.length,
	visitedDataLastIndex = visitedDataLen - 1,
	visitedDataLastKey = (visitedDataLastIndex > -1) ? visitedData[visitedDataLastIndex] : "",
	progressPageSection = 0, progressPageSectionTotal = 0,
	i, scrollingSection, sectionVisted;

	for(i = 0; i < scrollingSectionsLen ; i++){
		scrollingSection = scrollingSections[i];
		autoId = scrollingSection.autoId;
		sectionVisted = (progress >= pageIndex && ($.inArray(autoId, visitedData) > -1));

		if (sectionVisted) {
			progressPageSection++;
		}
		progressPageSectionTotal++;
		scr_pages[pageIndex].scrollingSections[i].sectionVisted = sectionVisted;
	}

	return {
		progressPageSection: progressPageSection,
		progressPageSectionTotal: progressPageSectionTotal,
		visitedDataLastKey: visitedDataLastKey
	};

}

function getAssessmentProgressData(pageObject, trackingChecks) {
	var assessmentId = pageObject.type,
	assessmentData = getTracking(assessmentId),
	trackingObject = trackingChecks.trackingObject[assessmentId],
	checkReqActComp = trackingObject.checkReqActComp,
	isReqActComp = trackingObject.isReqActComp,
	isTrackingRequired = trackingObject.isTrackingRequired,
	isRequiredComp = (isTrackingRequired && checkReqActComp && isReqActComp),
	isNonRequiredComp = (!checkReqActComp && (assessmentData.attempts.length > 0 || isReqActComp)),
	isComp = (isRequiredComp || isNonRequiredComp),
	assessmentDoneOnce = false,
	questions = 0,
	questionsTotal = 0,
	i, questionsData, questionsArray,
	answersData, answersArray, answersArrayLen;

	if(isComp){
		assessmentDoneOnce = true;
		questions = 1;
		questionsTotal = 1;
	}
	else {
		questionsData = getDataValue(assessmentId);
		questionsArray = questionsData.split("!");
		questionsTotal = questionsArray.length;
		questions = 0;
		for (i = 0; i < questionsTotal; i++){
			answersData = questionsArray[i];
			answersArray = answersData.split(',');
			answersArrayLen = answersArray.length;
			if(answersArrayLen > 3){
				questions++;
			}
		}
	}

	return {
		questions: questions,
		questionsTotal: Math.max(questionsTotal, 1),
		assessmentDoneOnce: assessmentDoneOnce
	};
};

function setProgressData() {
	var pagesLen = scr_pages.length,
	trackingChecks = getTrackingArrayChecks(),
	i, pageObject, pageProgressEnd, pageComplete, pageVisted, pageCurrent, pageRevist,
	hasScrollingSections, scrollingSections, assessment,
	isPageComplete,
	sectionProgress = 0,
	pageProgress = 0,
	progressPage = 0,
	progressPageTotal = 0,
	progressPageSection = 0,
	progressAssessment = 0,
	progressAssessmentTotal = 0,
	progressPageSectionTotal = 0,
	visitedDataLastKey = "";
	
	for (i = 0; i < pagesLen; i++) {
		pageObject = scr_pages[i];
		hasScrollingSections = (pageObject.hasOwnProperty("scrollingSections") && pageObject.scrollingSections.length > 0);
		isAssessment = (pageObject.hasOwnProperty('isAssessment')) ? pageObject.isAssessment : false;
		pageProgressEnd = (progress == i);
		pageVisted = (progress >= i);
		pageCurrent = (thisPageNo == i);
		pageRevist = (pageCurrent && progress > i);
		visitedDataLastKey = "";
		
		if(hasScrollingSections){
			scrollingSections = getSectionsProgressData(pageObject, i);
			progressPageSection = scrollingSections.progressPageSection;
			progressPageSectionTotal = scrollingSections.progressPageSectionTotal;
			isPageComplete = (progressPageSection === progressPageSectionTotal);
			visitedDataLastKey = scrollingSections.visitedDataLastKey;
		}
		else if(isAssessment){
			assessment = getAssessmentProgressData(pageObject, trackingChecks);
			progressPageSection = assessment.questions;
			progressPageSectionTotal = assessment.questionsTotal;
			isPageComplete = assessment.assessmentDoneOnce;
			progressAssessmentTotal = 1;
			progressAssessment = (isPageComplete) ? 1 : 0;
		}
		else {
			isPageComplete = (thisPageNo >= i);
			progressPageSection = (isPageComplete) ? 1 : 0;
			progressPageSectionTotal = 1;
		}

		pageComplete = isPageComplete;

		sectionProgress = parseInt(((progressPageSection) / progressPageSectionTotal) * 100, 10);
		progressPage += (isAssessment) ? progressAssessment : progressPageSection;
		progressPageTotal += (isAssessment) ? progressAssessmentTotal : progressPageSectionTotal;
		scr_pages[i].pageStatus = {
			progressPageSection: progressPageSection,
			progressPageSectionTotal: progressPageSectionTotal,
			pageComplete: pageComplete,
			pageCurrent: pageCurrent,
			pageProgressEnd: pageProgressEnd,
			pageRevist: pageRevist,
			pageVisted: pageVisted,
			visitedDataLastKey: visitedDataLastKey,
			sectionProgress: sectionProgress,
			isAssessment: isAssessment
		};
	}
	pageProgress = parseInt(((progressPage) / progressPageTotal) * 100, 10);
	return pageProgress;
}


function renderHBmenu() {
	var drawHBmenu = function() {
		var hbno = 0;
		var buttonArray = [];
		var hbmenutype = "table";
		var hbmenuhtml = "";
		var hbpadding = "20px";
		var scr_pagesLen = scr_pages.length;
		var $hbtable = $("#hbtable");
		var $hbmenu = $("#hbmenu");
		var scr_pagesItem;
		var hasModMenuItemNotAvailableText = (typeof modMenuItemNotAvailableText === "string");
		var notAvailableText = function(){
			var text = (hasModMenuItemNotAvailableText) ? modMenuItemNotAvailableText : "";
			var isTextValid = (text.length > 0);
			var returnHTMLObject = "";
			if(isTextValid){
				returnHTMLObject = $("<span></span>");
				returnHTMLObject
					.addClass('sr-only')
					.html(text);
			}
			return returnHTMLObject;
		};
		var hbmenutype, fieldset, i, hbbutton, hbbutton_title, hbbutton_class, tabindex;
		if($hbtable.length !== 1) {
			hbmenutype = "buttons";
			fieldset = $("<fieldset></fieldset>");
			fieldset.prop("name", "Main Menu");
			$hbmenu.css("background-color", "#ffffff");
		}
		for (i = 0; i < scr_pagesLen; i++) {
			scr_pagesItem = scr_pages[i];
			hbno = i + 1;
			addNotAvailableText = false;
			if (scr_pagesItem.hide == false && (scr_pagesItem.type != "h2" || (scr_pagesItem.sectionstart <= thisPageNo + 1 && scr_pagesItem.sectionend > thisPageNo + 1))) {
				if (hbmenutype === "buttons") {
					hbbutton = $("<a></a>");
					hbbutton_title = scr_pagesItem.title;
					hbbutton_class = "hbbutton";
					tabindex = 0;
					if (scr_pagesItem.type == "h2") {
						hbbutton_class += " hbsubsection";
					}
					if (thisPageNo >= i) {
						if (thisPageNo == i) {
							hbbutton_class += " hbcurrent";
							hbbutton.attr('aria-current','page');
						}
						hbbutton
							.prop('href', getPageUrl(hbno - 1))
							.css('border-left-color', modprg_comp)
							.css('background-color', banner_status_color);
					} else if (progress >= i) {
						hbbutton
							.prop('href', getPageUrl(hbno - 1))
							.css('border-left-color', modprg_visit)
							.css('background-color', banner_status_color);
					} else {
						tabindex = -1;
						hbbutton
							.prop('disabled', true)
							.css('border-left-color', modprg_pend);
						addNotAvailableText = (hasModMenuItemNotAvailableText);
					}
					hbbutton
						.attr('role', "link")
						.attr('tabindex', tabindex)
						.html(hbbutton_title)
						.addClass(hbbutton_class);
					if(addNotAvailableText){
						hbbutton
							.html(hbbutton_title + " ")
							.append(notAvailableText());
					}
	
					buttonArray.push(hbbutton);
				} else {
					if (scr_pagesItem.section > 1) {
						hbmenuhtml = hbmenuhtml + '<tr><td style="height:1px;background-color:#ffffff" colspan="2"></td></tr>';
					}
					if (scr_pagesItem.type == "h2") {
						hbpadding = "40px";
					} else {
						hbpadding = "20px";
					}
					if (thisPageNo >= i) {
						hbmenuhtml = hbmenuhtml + '<tr style="cursor:pointer" onclick="gotoPage(' + hbno + ');" onmouseover="document.getElementById(\'hb' + hbno + 'link\').style.backgroundColor=\'#ffffff\';" onmouseout="document.getElementById(\'hb' + hbno + 'link\').style.backgroundColor=\'' + banner_status_color + '\';">';
						hbmenuhtml = hbmenuhtml + '<td id="hb' + hbno + 'marker" valign="middle" style="width:20px;height:30px;background-color:' + modprg_comp + ';">';
						if (thisPageNo == i) {
							hbmenuhtml = hbmenuhtml + '<img id="hb' + hbno + 'img" src="sp_images/spacer.gif" width="20" height="30" alt="Current page"></td><td id="hb' + hbno + 'link" valign="middle" style="padding-left:' + hbpadding + ';padding-right:' + hbpadding + '"><span class="leftmenucurrent">' + scr_pages[i].title + '</span></td>';
						} else {
							hbmenuhtml = hbmenuhtml + '<img id="hb' + hbno + 'img" src="sp_images/spacer.gif" width="20" height="30" alt="Completed page"></td><td id="hb' + hbno + 'link" valign="middle" style="padding-left:' + hbpadding + ';padding-right:' + hbpadding + '"><a href="javascript:gotoPage(' + hbno + ')" class="leftmenuvisited">' + scr_pages[i].title + '</a></td>';
						}
					} else if (progress >= i) {
						hbmenuhtml = hbmenuhtml + '<tr style="cursor:pointer" onclick="gotoPage(' + hbno + ');" onmouseover="document.getElementById(\'hb' + hbno + 'link\').style.backgroundColor=\'#ffffff\';" onmouseout="document.getElementById(\'hb' + hbno + 'link\').style.backgroundColor=\'' + banner_status_color + '\';">';
						hbmenuhtml = hbmenuhtml + '<tr><td id="hb' + hbno + 'marker" valign="middle" style="width:20px;height:30px;background-color:' + modprg_visit + ';">';
						hbmenuhtml = hbmenuhtml + '<img id="hb' + hbno + 'img" src="sp_images/spacer.gif" width="20" height="30" alt="Completed page"></td><td id="hb' + hbno + 'link" valign="middle" style="padding-left:' + hbpadding + ';padding-right:' + hbpadding + '"><a href="javascript:gotoPage(' + hbno + ')" class="leftmenuvisited">' + scr_pages[i].title + '</a></td>';
					} else {
						hbmenuhtml = hbmenuhtml + '<tr><td id="hb' + hbno + 'marker" valign="middle" style="width:20px;height:30px;background-color:' + modprg_pend + '">';
						hbmenuhtml = hbmenuhtml + '<img id="hb' + hbno + 'img" src="sp_images/spacer.gif" width="20" height="30" alt="Pending page"></td><td id="hb' + hbno + 'link" valign="middle" style="padding-left:' + hbpadding + ';padding-right:' + hbpadding + '"><span class="leftmenunotvisited">' + scr_pages[i].title + '</span></td>';
					}
					hbmenuhtml = hbmenuhtml + '</tr>'
				}
			}
		}
		if (buttonArray.length > 0) {
			fieldset.html(buttonArray);
			$hbmenu.html(fieldset);
		}
		if (hbmenutype === "table") {
			$hbtable.html(hbmenuhtml);
		}
	};
	if(!isScrollingSkin()){
		drawHBmenu();
	}
}



function setModNavLayout() {
	if (typeof mod_nav_layout === "undefined") {
		mod_nav_layout = "responsive";
	}
	isModNavLayout_responsive = (mod_nav_layout === "responsive");
	isModNavLayout_fixed = (mod_nav_layout === "fixed");
	isModNavLayout_scrolling = (mod_nav_layout === "scrolling");
}

//render hamburger menu and progress bar
function scr_load() {
	setModNavLayout();
	var $fixedNavProgress = $("#fixedNavProgress");
	var $pageNumberContainer = $('#page-number-container');
	var $pageNumberContainerAcc = $('#page-number-container-acc');
	var $audio = $("audio");
	var $ckeditorAudio = $("[class=ckeditor-html5-audio]");
	var $audioId = $("#audio");
	if (isModNavLayout_fixed) {
		showProgress = "no";
	}
	
	
	renderProgressBar();
	renderHBmenu();
	if (assessmentInProgress) {
		$audioId.css("display", "none");
	}
	if (scr_audio === "off") {
		$audio.each(function () {
			$(this).volume = 0.0;
			this.pause(); // Stop playing
			this.addEventListener('loadedmetadata', function () {
				this.currentTime = 0; // Reset time
			}, false);
		});
		$ckeditorAudio.each(function () {
			$(this).hide();
		});
	}
	if (isModNavLayout_fixed) {
		$fixedNavProgress.html((thisPageNo + 1) + ' ' + modlbl_page_of + ' ' + scr_pages.length);
	} else {
		$pageNumberContainer.html(modlbl_page_no + ' ' + (thisPageNo + 1) + ' ' + modlbl_page_of + ' ' + scr_pages.length + '&nbsp;');
		$pageNumberContainerAcc.html(modlbl_page_no + ' ' + (thisPageNo + 1) + ' ' + modlbl_page_of + ' ' + scr_pages.length + '&nbsp;');
	}
};

//navigation
function closeModule() {
	if (scormVersion == "moodle") {
		top.close();
	} else {
		if (useFrameset) {
			parent.finished = true;
		}
		lmsFinishResponse(self.scormApi.LMSFinish(""));
	};
};
function getPageUrl(p) {
	return scr_pages[p].id + '-' + scr_audio + '-' + scr_acc + '-' + scr_lang + '.htm';
}
function gotoPage(p) {
	self.location.href = getPageUrl(p - 1);
}
function createGotoPage(p) {
	return function () { gotoPage(p); }
}
function openPdf(path) {
	pdfWin = window.open(path, "pdfWin");
}
function refreshPage() {
	self.location.href = getPageUrl(thisPageNo);
}
function previousPage() {
	self.location.href = getPageUrl(previousPageNo);
}

function isScrollingSkin(){
	var isScrolling = (typeof isModNavLayout_scrolling === 'boolean') ? isModNavLayout_scrolling : false;
	return isScrolling;
}

function nextPage() {
	if (!isScrollingSkin()) {
		self.location.href = getPageUrl(nextPageNo);
	} else {
		SKILLCASTSCROLLINGAPI.nextSectionOrPage();
	}
}
function getPageNumber(thistitle) {
	var p = 0;
	for (var i = 0; i < scr_pages.length; i = i + 1) {
		if (scr_pages[i].title == thistitle) {
			p = i + 1;
			break;
		}
	}
	return p;
}
function getPageNumberById(identifier) {
	var p = 0;
	for (var i = 0; i < scr_pages.length; i = i + 1) {
		if (scr_pages[i].identifier == identifier) {
			p = i + 1;
			break;
		}
	}
	return p;
}
function gotoPageTitle(thistitle) {
	var p = getPageNumber(thistitle);
	if (p > 0) {
		self.location = scr_pages[p - 1].id + '-' + scr_audio + '-' + scr_acc + '-' + scr_lang + '.htm';
	}
}
function pageTitleCompleted(thistitle) {
	var p = getPageNumber(thistitle);
	if (p <= linearMaxPage) {
		return true;
	} else {
		return false;
	}
}
function getPageInfo(p) {
	var i = p || (thisPageNo + 1);
	var pp = i - 1;
	var context = scr_pages[pp];
	context.totalSections = scr_pages[scr_pages.length - 1].section;
	context.totalPages = scr_pages.length;
	context.pageNo = i;
	context.pageNoInSection = i - scr_pages[pp].sectionstart + 1;
	context.totalPagesInSection = scr_pages[pp].sectionend - scr_pages[pp].sectionstart + 1;
	return context;
}
function getUserInfo() {
	var user = new Object();
	user.name = self.scormApi.LMSGetValue("cmi.core.student_name");
	user.id = self.scormApi.LMSGetValue("cmi.core.student_id");
	user.completionTime = "";
	var cDateString = lpr_completionDate;
	if (Number(lpr_completionDate) !== NaN) {
		var cDate = new Date(Number(lpr_completionDate));
		cDateString = formatDateAsString(cDate, "dd/mm/yyyy|HH:mm");
		user.completionDateTime = cDate;
	}
	var cDateArray = cDateString.split("|");
	user.completionDate = cDateArray[0];
	if (cDateArray.length > 1) {
		user.completionTime = cDateArray[1];
	}
	return user;
}
function setProgress(thistitle) {
	linearMaxPage = getPageNumber(thistitle) - 1;
	setSuspendData();
}
function setProgressById(identifier) {
	linearMaxPage = getPageNumberById(identifier) - 1;
	setSuspendData();
}
function setCompletionStatus() {
	lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.lesson_status", "passed"), "cmi.core.lesson_status");
}
function setStatus(val) {
	lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.lesson_status", val), "cmi.core.lesson_status");
}
function setScore(score) {
	lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.score.raw", "" + score), 'cmi.core.score.raw');
	lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.score.max", "100"), 'cmi.core.score.max');
	lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.score.min", "0"), 'cmi.core.score.min');
	if (scormVersion == "2004") {
		lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.score.scaled", "" + score), 'cmi.core.score.scaled');
	}
}
function getScore() {
	var s = self.scormApi.LMSGetValue("cmi.core.score.raw");
	if (s == "") {
		return 0;
	} else {
		return Number(s);
	}
}
function forceCommit() {
	lmsCommitResponse(self.scormApi.LMSCommit(""));
}
function setBookmark(thistitle) {
	var p = getPageNumber(thistitle);
	if (p > 0) {
		var newPageNo = p - 1;
		lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.lesson_location", newPageNo + "," + scr_audio + "," + scr_acc + "," + scr_lang), 'cmi.core.lesson_location');
	};
}
function setBookmarkById(identifier) {
	var p = getPageNumberById(identifier);
	if (p > 0) {
		var newPageNo = p - 1;
		lmsSetValueResponse(self.scormApi.LMSSetValue("cmi.core.lesson_location", newPageNo + "," + scr_audio + "," + scr_acc + "," + scr_lang), 'cmi.core.lesson_location');
	};
}
function getDataArray() {
	var dataArray = new Array();
	if (lpr_data.length > 2) {
		dataArray = lpr_data.split("|");
	}
	return dataArray;
}
function getDataValue(nam) {
	var dataArray = getDataArray();
	var val = "";
	for (var i = 0; i < dataArray.length; i = i + 1) {
		if (dataArray[i].split("=")[0] == nam) {
			val = dataArray[i].split("=")[1];
		}
	}
	return val;
}
function setDataValue(nam, val) {
	var dataArray = getDataArray();
	var namExists = false;
	for (var i = 0; i < dataArray.length; i = i + 1) {
		if (dataArray[i].split("=")[0] == nam) {
			dataArray[i] = nam + "=" + val;
			namExists = true;
		}
	}
	if (!namExists) {
		dataArray[dataArray.length] = nam + "=" + val;
	}
	self.lpr_data = dataArray.join("|");
	setSuspendData();
}
function removeDataValue(nam) {
	var dataArray = getDataArray();
	for (var i = 0; i < dataArray.length; i = i + 1) {
		if (dataArray[i].split("=")[0] == nam) {
			dataArray.splice(i, 1);
		}
	}
	self.lpr_data = dataArray.join("|");
	setSuspendData();
}
function setSuspendData() {
	var new_data = "Version:6,0," + scr_lang + ";Completed:" + lpr_completionDate + ";Sessions:" + lpr_sessions + ";Tracking:" + lpr_tracking + ";progress:" + linearMaxPage + ";Data:" + lpr_data;
	var setData = self.scormApi.LMSSetValue("cmi.suspend_data", new_data);
	lmsSetValueResponse(setData, 'cmi.suspend_data');
}
function createScormIdentifier(str) {
	var id = str.replace(/[^A-Za-z0-9_]/g,'_');
	return id.substr(0,255);
}
function setObjectiveScore(title,score) {
	var scoreExist = getObjectiveScore(title) ? true : false;
	var isHigherScore = getObjectiveScore(title) <= score;
	if (!scoreExist || isHigherScore) {
		setDataValue('objectiveScore-'+title,score);
	}
}
function getObjectiveScore(title) {
	var score = getDataValue('objectiveScore-'+title);
	return Number(score);
}
function setObjective(id, score, result) {
	var n = self.scormApi.LMSGetValue("cmi.objectives._count");
	var objIndex = n;
	var objId = createScormIdentifier(id);
	for (var i = 0; i < n; i = i + 1) {
		if (self.scormApi.LMSGetValue("cmi.objectives." + i + ".id") == objId) {
			var objIndex = i;
		}
	}
	return setObjectiveN(objIndex, objId, score, result);
}
function setObjectiveN(n, id, score, result) {
	var success = false;
	if (self.scormApi.LMSSetValue("cmi.objectives." + n + ".id", id).toLowerCase() == "true") {
		if (self.scormApi.LMSSetValue("cmi.objectives." + n + ".score.raw", score + "").toLowerCase() == "true") {
			self.scormApi.LMSSetValue("cmi.objectives." + n + ".score.min", "0");
			self.scormApi.LMSSetValue("cmi.objectives." + n + ".score.max", "100");
			if (scormVersion == "2004") {
				if (self.scormApi.LMSSetValue("cmi.objectives." + n + ".success_status", result).toLowerCase() == "true") {
					self.scormApi.LMSSetValue("cmi.objectives." + n + ".completion_status", "completed");
					self.scormApi.LMSSetValue("cmi.objectives." + n + ".score.scaled", (score/100) + "");
					success = true;
				}
			} else {
				if (self.scormApi.LMSSetValue("cmi.objectives." + n + ".status", result).toLowerCase() == "true") {
					success = true;
				}
			}
		}
	}
	return success;
};


//comments
function getCommentArray() {
	var commentArray = new Array();
	if (scormVersion == "2004") {
		var commentCount = self.scormApi.LMSGetValue("cmi.comments_from_learner._count");
		if (commentCount.length > 0 && commentCount > 0) {
			for (var i = 0; i < commentCount; i = i + 1) {
				var commentString = self.scormApi.LMSGetValue("cmi.comments_from_learner." + i + ".comment");
				if (commentString.length > 0) {
					var commentObj = JSON.parse(commentString);
					commentObj.id = self.scormApi.LMSGetValue("cmi.comments_from_learner." + i + ".location");
					commentObj.timestamp = self.scormApi.LMSGetValue("cmi.comments_from_learner." + i + ".timestamp");
					commentArray[commentArray.length] = commentObj;
				}
			}
		}
	} else {
		var commentString = self.scormApi.LMSGetValue("cmi.comments");
		if (commentString.length > 0) {
			commentArray = JSON.parse(commentString);
		}
	}
	return commentArray;
}
function getCommentValue(nam) {
	var commentArray = getCommentArray();
	var val = "";
	for (var i = 0; i < commentArray.length; i = i + 1) {
		if (commentArray[i].id == nam) {
			val = commentArray[i].response;
		}
	}
	return val;
}
function setCommentValue(nam, question, response) {
	var commentArray = getCommentArray();
	var tsraw = new Date();
	var timestamp = tsraw.toISOString();
	var namExists = false;
	for (var i = 0; i < commentArray.length; i = i + 1) {
		if (commentArray[i].id == nam) {
			if (scormVersion == "2004") {
				var commentObj = {
					"question": question,
					"response": response
				};
				var commentString = JSON.stringify(commentObj);
				self.scormApi.LMSSetValue("cmi.comments_from_learner." + i + ".comment", commentString);
				self.scormApi.LMSSetValue("cmi.comments_from_learner." + i + ".timestamp", timestamp);
			} else {
				commentArray[i].question = question;
				commentArray[i].response = response;
				commentArray[i].timestamp = timestamp;
			}
			namExists = true;
		}
	}
	if (!namExists) {
		if (scormVersion == "2004") {
			var commentObj = {
				"question": question,
				"response": response
			};
			var commentString = JSON.stringify(commentObj);
			self.scormApi.LMSSetValue("cmi.comments_from_learner." + commentArray.length + ".comment", commentString);
			self.scormApi.LMSSetValue("cmi.comments_from_learner." + commentArray.length + ".timestamp", timestamp);
		} else {
			commentArray[commentArray.length] = {
				"id": nam,
				"question": question,
				"response": response,
				"timestamp": timestamp
			};
		}
	}
	if (scormVersion != "2004") {
		var commentString = JSON.stringify(commentArray);
		self.scormApi.LMSSetValue("cmi.comments", commentString);
	}
	self.scormApi.LMSCommit("");
}

//assessment
function getTrackingArray() {
	var trackingArray = new Array();
	if (lpr_tracking.length > 0) {
		for (var i = 0; i < lpr_tracking.split(";").length; i = i + 1) {
			trackingArray[i] = new Object();
			trackingArray[i].id = lpr_tracking.split(";")[i].split("!")[2];
			trackingArray[i].status = lpr_tracking.split(";")[i].split("!")[0];
			trackingArray[i].score = 0;
			trackingArray[i].attempts = new Array();
			if (lpr_tracking.split(";")[i].split("!")[1] != "nt") {
				for (var j = 0; j < lpr_tracking.split(";")[i].split("!")[1].split("|").length; j = j + 1) {
					trackingArray[i].attempts[j] = new Object();
					trackingArray[i].attempts[j].status = lpr_tracking.split(";")[i].split("!")[1].split("|")[j].split("$")[2];
					trackingArray[i].attempts[j].score = lpr_tracking.split(";")[i].split("!")[1].split("|")[j].split("$")[0];
					trackingArray[i].score = Math.max(trackingArray[i].score, trackingArray[i].attempts[j].score);
				}
			}
		}
	}
	return trackingArray;
}
function getTracking(assId) {
	var trackingArray = getTrackingArray();
	var trackingObj = new Object();
	trackingObj.id = "";
	trackingObj.status = 0;
	trackingObj.score = 0;
	trackingObj.attempts = new Array();
	for (var i = 0; i < trackingArray.length; i = i + 1) {
		if (trackingArray[i].id == assId) {
			trackingObj = trackingArray[i];
			break;
		}
	}
	trackingObj.attemptLimit = getAttemptLimit(assId);
	return trackingObj;
}
function getAttemptLimit(assId) {
	var attemptLimit = 0;
	if (getDataValue(assId + "-lim") != "") {
		attemptLimit = Number(getDataValue(assId + "-lim"));
	} else {
		for (var i = 0; i < scr_pages.length; i = i + 1) {
			if (scr_pages[i].type == assId) {
				attemptLimit = scr_pages[i].attemptLimit;
				break;
			};
		};
	};
	return attemptLimit;
}
function setTracking(assId, status, score) {
	var new_tracking = new Array();
	for (var i = 0; i < lpr_tracking.split(";").length; i = i + 1) {
		if (lpr_tracking.split(";")[i].split("!")[2] == assId) {
			if (lpr_tracking.split(";")[i].split("!")[1] == "nt") {
				new_tracking[new_tracking.length] = status + "!" + score + "$100$" + status + "!" + assId;
			} else {
				new_tracking[new_tracking.length] = Math.max(status, lpr_tracking.split(";")[i].split("!")[0]) + "!" + lpr_tracking.split(";")[i].split("!")[1] + "|" + score + "$100$" + status + "!" + assId;
			}
		} else {
			new_tracking[new_tracking.length] = lpr_tracking.split(";")[i];
		}
	}
	lpr_tracking = new_tracking.join(";")
}
function gotoQuestion(id) {
	self.location = id + '-' + scr_audio + '-' + scr_acc + '-' + scr_lang + '.htm';
}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function buildAssessment(assessmentId) {
	var aAss = new Array();
	var qNo = 0;
	var existing = getDataValue(assessmentId);
	if (existing.length > 0) {
		var aAss = existing.split("!");
		for (var j = 0; j < aAss.length; j = j + 1) {
			if (aAss[j].split(",")[2] == 0) {
				qNo = j;
				break;
			}
		}
	}
	if (qNo == 0) {
		var removeObjList = getDataValue("removeObjectives");
		var aQbt = [];
		var aQbn = aQb;
		if (removeObjList.length > 0) {
			var removeObjArray = removeObjList.split(",");
			var removeObjArrayCount = removeObjArray.length;
			var thisObjectiveId = "";
			var removeThisQb = false;
			var qbCountTemp = qbCount;
			aQbn = [];
			for (var i = 0; i < qbCountTemp; i++) {
				removeThisQb = false;
				thisObjectiveId = aQb[i].objectiveId;
				if (typeof thisObjectiveId !== "undefined" && thisObjectiveId.length > 0) {
					for (var j = 0; j < removeObjArrayCount; j++) {
						if (removeObjArray[j] === thisObjectiveId) {
							removeThisQb = true;
							break;
						}
					}
				}
				if (removeThisQb) {
					qbCount = qbCount - 1;
					if (aQb[i].permanent == "1") {
						thisPermQb--;
					} else {
						thisRandQb--;
						thisAvailQb--;
					}
				} else {
					aQbn.push(aQb[i]);
				}
			}
		}
		for (var i = 0; i < qbCount; i = i + 1) {
			if (aQbn[i].permanent == 1) {
				if (qbSort == 1) {
					thisQbPos = getRandomInt(0, aQbt.length);
					aQbt.splice(thisQbPos, 0, aQbn[i]);
				} else {
					aQbt.push(aQbn[i]);
				}
			} else if (thisRandQb > 0) {
				if (thisExclQb.indexOf(aQbn[i].id) < 0) {
					if (getRandomInt(1, thisAvailQb) <= thisRandQb) {
						if (qbSort == 1) {
							thisQbPos = getRandomInt(0, aQbt.length);
							aQbt.splice(thisQbPos, 0, aQbn[i]);
						} else {
							aQbt.push(aQbn[i]);
						}
						thisRandQb--;
					}
					thisAvailQb--;
				}
			}
		}
		var thisQStart = 0;
		for (var i = 0; i < aQbt.length; i = i + 1) {
			if (aQbt[i].count == 0) {
				var qtCount = aQbt[i].questions.length;
			} else {
				var qtCount = aQbt[i].count;
			}
			var thisQEnd = thisQStart + qtCount;
			var thisQList = new Array();
			for (var j = thisQStart; j < thisQEnd; j = j + 1) {
				thisQList[thisQList.length] = j;
			}
			var thisPermQ = 0;
			for (var j = 0; j < aQbt[i].questions.length; j = j + 1) {
				thisPermQ = thisPermQ + aQbt[i].questions[j].permanent;
			}
			var qCount = aQbt[i].questions.length;
			var thisRandQ = Math.max(0, qtCount - thisPermQ);
			var thisAvailQ = qCount - thisPermQ;
			for (var j = 0; j < aQbt[i].questions.length; j = j + 1) {
				if (aQbt[i].questions[j].permanent == 1) {
					if (aQbt[i].sort == 1) {
						thisJ = getRandomInt(0, thisQList.length - 1);
					} else {
						thisJ = 0;
					}
					var thisQNo = thisQList[thisJ];
					thisQList.splice(thisJ, 1);
					aAss[thisQNo] = aQbt[i].seqNo + "," + aQbt[i].questions[j].seqNo + ",0";
				} else if (thisRandQ > 0) {
					if (getRandomInt(1, thisAvailQ) <= thisRandQ) {
						if (aQbt[i].sort == 1) {
							thisJ = getRandomInt(0, thisQList.length - 1);
						} else {
							thisJ = 0;
						}
						thisQNo = thisQList[thisJ];
						thisQList.splice(thisJ, 1);
						aAss[thisQNo] = aQbt[i].seqNo + "," + aQbt[i].questions[j].seqNo + ",0";
						thisRandQ--;
					}
					thisAvailQ--;
				}
			}
			thisQStart = thisQEnd;
		}
		setDataValue(assessmentId, aAss.join("!"));
		var currentTime = new Date();
		setDataValue(assessmentId + "-start", getCurrentTime());
	}
	gotoQuestion(aQb[aAss[qNo].split(",")[0]].questions[aAss[qNo].split(",")[1]].id);
}
function setQuestionContext() {
	var existing = getDataValue(assessmentId);
	var $pageNumberContainer = $("#page-number-container");
	var $pageNumberContainerAcc = $("#page-number-container-acc");
	var $questionCounter = $("#questionCounter");
	aAss = existing.split("!");
	var aAssLen = aAss.length;
	for (var j = 0; j < aAssLen; j = j + 1) {
		if (aQb[aAss[j].split(",")[0]].questions[aAss[j].split(",")[1]].id == questionId) {
			qNo = j;
			break;
		}
	}
	attemptStatus = 0;
	if (isModNavLayout_fixed) {
		$pageNumberContainer.html(modlbl_q + " " + (qNo + 1) + " " + modlbl_page_of + " " + aAss.length + '&nbsp;');
		$pageNumberContainerAcc.html(modlbl_q + " " + (qNo + 1) + " " + modlbl_page_of + " " + aAss.length + '&nbsp;');
	} else {
		$questionCounter.html(modlbl_q + " " + (qNo + 1) + " " + modlbl_page_of + " " + aAss.length);
	}
}
function toggleQuestionOption(id) {
	var useHtmlInputs = useMcqHtmlInputs();
	var selectedIndex = -1;
	var optionCount = question.options.length;
	var correctOptions = question.correctOptions;
	for (var i = 0; i < optionCount; i = i + 1) {
		if (question.options[i].id == id) {
			selectedIndex = i;
		}
	}
	if (selectedIndex >= 0) {
		if (question.options[selectedIndex].s == 1) {
			question.options[selectedIndex].s = 0;
			if (useHtmlInputs) {
				document.getElementById(id + "-button").className = "assessment-option-border-ready";
			} else {
				document.getElementById(id).className = "assessment-option-border-ready";
				document.getElementById(id + "-marker").className = "assessment-option-marker-ready";
			}
		} else {
			question.options[selectedIndex].s = 1;
			if (useHtmlInputs) {
				document.getElementById(id + "-button").className = "assessment-option-border-selected";
			} else {
				document.getElementById(id).className = "assessment-option-border-selected";
				document.getElementById(id + "-marker").className = "assessment-option-marker-selected";
			}
			if (correctOptions == 1) {
				for (var i = 0; i < optionCount; i = i + 1) {
					if (question.options[i].id != id) {
						question.options[i].s = 0;
						if (useHtmlInputs) {
							document.getElementById(question.options[i].id + "-button").className = "assessment-option-border-ready";
						} else {
							document.getElementById(question.options[i].id).className = "assessment-option-border-ready";
							document.getElementById(question.options[i].id + "-marker").className = "assessment-option-marker-ready";
						}
					}
				}
			}
		}
	}
};
function addMarkerMCQ(correct) {
	var src = mcqCrossIcon;
	var alt = mcqCrossText;
	var image = document.createElement("img");
	image.className = "mcqMarkerIcon";
	if (correct) {
		src = mcqTickIcon;
		alt = mcqTickText;
	}
	image.src = src;
	image.alt = alt;
	return image;
}

function disableElement(optionSelector) {
	var $selector = typeof optionSelector === "string"
		? $("#" + optionSelector)
		: $(optionSelector);
	var inputName;
	var $inputSelector;
	var $this;
	if (typeof optionSelector !== "string") {
		$selector.prop('disabled', true);
	} else {
		inputName = $selector.attr("name");
		$inputSelector = $("input[name=" + inputName + "]");
		$inputSelector.prop('disabled', true);
		$inputSelector
			.parent()
			.siblings(".scr_layout_cell")
			.children()
			.each(function () {
				$this = $(this);
				if (!$this.hasClass('assessment-option-border-selected')) {
					$this
						.removeClass('assessment-option-border-ready')
						.addClass('assessment-option-border-notselected');
				}
			});
	}
}
function gradeQuestionResponse() {
	var ariaDescribedbyVal = ["scrq_question", "scrq_answer"];
	var options = question.options;
	var optionsLen = options.length;
	var i;
	var ariaDescribedby;
	
	if ($('#scrq_explanation').text() !== '') {
		ariaDescribedbyVal.push("scrq_explanation"); 
	}
	ariaDescribedby = ariaDescribedbyVal.join(" ").toString();
	for (i = 0; i < optionsLen; i++) {
		if (options[i].s == 1) {
			$('input[id='+options[i].id+']').attr('aria-describedby', ariaDescribedby);
		}
	}
	
	if (question.options[0].hasOwnProperty("c")) {
		gradeQuestionResponseContinue();
	} else {
		if (!(question.hasOwnProperty("submitted") && question.submitted)) {
			var id = question.id;
			question.submitted = true;
			if (typeof relativePath === 'string') {
				return getQuestionAnswerJSON(id, question).success(function () {
					gradeQuestionResponseContinue();
				});
			}
			getQuestionAnswerJavaScript(id);
		}
	}
}

function getQuestionAnswerJavaScript(id) {
	var script = document.createElement('script');
	var url = "js/" + id + "-" + scr_lang + ".js"
	script.src = url;
	document.head.appendChild(script);
}

function getQuestionAnswerJSON(id, questionObject) {
	var url = relativePath + "js/" + id + "-" + scr_lang + ".json";
	var promise = $.ajax(url, {
		async: true,
		cache: false,
		method: "GET",
		dataType: "json"
	});
	promise.success(function (data) {
		var correct = data.correct;
		var correctLen = correct.length;
		questionObject.explanation = data.explanation;
		for (var i = 0; i < correctLen; i++) {
			questionObject.options[i].c = correct[i];
		}
	})
	return promise;
}

function gradeQuestionResponseContinue() {
	var useHtmlInputs = useMcqHtmlInputs();
	var selectedOptionCount = 0;
	var totalOptionCount = question.options.length;
	var thisElementWrapper = $(".assessment-container");
	var thisElementWrapperClass = "";
	var thisAnswerElement = document.getElementById("scrq_answer");
	var thisSubmitElement = document.getElementById("scrq_submit");
	var thisExplanationElement = document.getElementById("scrq_explanation");
	var thisQuestionElement = document.getElementById("scrq_question");
	var isScorm2004 = (scormVersion == "2004");
	var isImmediateFeedback = (feedback == 1 || feedback == 10);
	var allAttemptsUsed;
	var score = 2;
	var partial = 0;
	var result = "correct";
	var correct = [];
	var correctText = [];
	var response = [];
	var responseText = [];
	var thisOption;
	var thisOptionId;
	var thisOptionCorrect;
	var thisOptionSelected;
	var thisOptionText;
	var thisOptionButton;
	var i;
	var thisOptionElem;
	var thisOptionMarkerElem;
	var questionDesc;
	


	var timeLeft = getTimeLeft();
	for (i = 0; i < totalOptionCount; i++) {
		selectedOptionCount += question.options[i].s;
	}
	if (selectedOptionCount > 0 || timeLeft < 0) {
		question.attemptsUsed = question.attemptsUsed + 1;
		allAttemptsUsed = (question.attemptsUsed >= question.attempts);
		for (i = 0; i < totalOptionCount; i++) {
			thisOption = question.options[i];
			thisOptionId = thisOption.id;
			thisOptionCorrect = thisOption.c;
			thisOptionSelected = thisOption.s;
			if (isScorm2004) {
				thisOptionText = $("#" + thisOptionId).text().split(",").join(" ").split(" ").join("_").substr(0, 250);
			}
			if (thisOptionCorrect == 1) {
				correct.push(i + 1);
				if (isScorm2004) {
					correctText.push(thisOptionText);
				}
			}
			if (thisOptionSelected == 1) {
				response.push(i + 1);
				if (isScorm2004) {
					responseText.push(thisOptionText);
				}
			}
			if (thisOptionSelected != thisOptionCorrect) {
				score = 1;
				if (isScorm2004) {
					result = "incorrect";
				} else {
					result = "wrong";
				}
			} else if (isImmediateFeedback && thisOptionCorrect == 1) {
				partial++;
			}
		}
		if (score === 2 || allAttemptsUsed) {
			if (isImmediateFeedback) {
				for (i = 0; i < totalOptionCount; i++) {
					thisOption = question.options[i];
					thisOptionId = thisOption.id;
					thisOptionCorrect = thisOption.c;
					thisOptionSelected = thisOption.s;
					thisOptionElem = document.getElementById(thisOptionId);
					if (useHtmlInputs) {
						thisOptionButton = document.getElementById(thisOptionId + "-button");
					} else {
						thisOptionButton = thisOptionElem;
					}
					thisOptionMarkerElem = document.getElementById(thisOptionId + "-marker");
					thisOptionElem.style.cursor = "default";
					thisOptionElem.onclick = null;
					thisOptionElem.onkeyup = null;
					if (thisOptionSelected != thisOptionCorrect) {
						if (thisOptionCorrect == 1) {
							thisOptionButton.className = "assessment-option-border-notselected";
							disableElement(
								$(thisOptionButton)
									.parent()
									.siblings('.scr_layout_cell')
									.children()
							);
							if (useHtmlInputs) {
								thisOptionMarkerElem.appendChild(addMarkerMCQ(true));
							} else {
								thisOptionMarkerElem.className = "assessment-option-marker-notselected-correct";
							}
						} else {
							thisOptionButton.className = "assessment-option-border-incorrect";
							if (useHtmlInputs) {
								thisOptionMarkerElem.appendChild(addMarkerMCQ(false));
							} else {
								thisOptionMarkerElem.className = "assessment-option-marker-selected-incorrect";
							}
						}
					} else {
						if (thisOptionCorrect == 1) {
							thisOptionButton.className = "assessment-option-border-correct";
							if (useHtmlInputs) {
								thisOptionMarkerElem.appendChild(addMarkerMCQ(true));
							} else {
								thisOptionMarkerElem.className = "assessment-option-marker-selected-correct";
							}
						} else {
							thisOptionButton.className = "assessment-option-border-notselected";
							disableElement(
								$(thisOptionButton)
									.parent()
									.siblings('.scr_layout_cell')
									.children()
							);
							if (useHtmlInputs) {
								thisOptionMarkerElem.appendChild(addMarkerMCQ(false));
							} else {
								thisOptionMarkerElem.className = "assessment-option-marker-notselected-incorrect";
							}
						}
					}
				}
				if (score === 2) {
					thisAnswerElement.innerText = modlbl_question_correct;
					thisElementWrapperClass = "questionCorrect";
				} else if (partial > 0) {
					if (typeof modlbl_question_partial === 'undefined') {
						thisAnswerElement.innerText = modlbl_question_incorrect;
						thisElementWrapperClass = "questionIncorrect";
					} else {
						thisAnswerElement.innerText = modlbl_question_partial;
						thisElementWrapperClass = "questionPartial";
					}
				} else {
					thisAnswerElement.innerText = modlbl_question_incorrect;
					thisElementWrapperClass = "questionIncorrect";
				}

				
				thisElementWrapper.addClass(thisElementWrapperClass);

				thisExplanationElement.style.visibility = "visible";
				
				if (useHtmlInputs) {
					disableElement(document.getElementById("scrq_submit_button"));
					thisAnswerElement.tabIndex = -1;
					thisAnswerElement.focus();
					nextPage = function () {
						continueAssessment();
					};
					SKILLCASTAPI.showNext();
				} else {
					document.getElementById("scrq_continue").style.visibility = "visible";
					thisSubmitElement.style.display = "none";
					thisAnswerElement.tabIndex = 0;
					thisExplanationElement.tabIndex = 0;
				}
			}
			if (trackScormInteractions) {
				questionDesc = $(thisQuestionElement).text().split("\n").join("").trim().substr(0,255);
				if (isScorm2004) {
					setInteraction(questionId, "choice", correctText.join(","), responseText.join(","), result, questionDesc);
				} else {
					setInteraction(questionId, "choice", correct.join(","), response.join(","), result, questionDesc);
				}
			}
			submitQuestionResponse(score, response);
		} else {
			if (typeof modlbl_question_tryagain === 'undefined') {
				thisAnswerElement.innerText = modlbl_question_incorrect;
			} else {
				thisAnswerElement.innerText = modlbl_question_tryagain;
			}
			thisElementWrapper.addClass("questionIncorrect");
		}
	}
	question.submitted = false;
};
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
function setInteraction(id, type, correct, response, result, description) {
	var n = self.scormApi.LMSGetValue("cmi.interactions._count");
	description = description || id;
	return setInteractionN(n, id, type, correct, response, result, description);
};
function setInteractionN(n, id, type, correct, response, result, description) {
	var success = false;
	var weighting = "1";
	description = description || id;
	if (useDescriptionForInteractionId) {
		id = createScormIdentifier(description);
	}
	if (type === "bet") {
		type = "choice";
		var resultArray = result.split(",");
		weighting = resultArray[1];
		result = resultArray[0];
	}
	if (self.scormApi.LMSSetValue("cmi.interactions." + n + ".id", id).toLowerCase() == "true") {
		if (self.scormApi.LMSSetValue("cmi.interactions." + n + ".type", type).toLowerCase() == "true") {
			if (self.scormApi.LMSSetValue("cmi.interactions." + n + ".correct_responses.0.pattern", correct).toLowerCase() == "true") {
				if (self.scormApi.LMSSetValue("cmi.interactions." + n + ".weighting", weighting).toLowerCase() == "true") {
					if (self.scormApi.LMSSetValue("cmi.interactions." + n + ".result", result).toLowerCase() == "true") {
						if (scormVersion == "2004") {
							if (self.scormApi.LMSSetValue("cmi.interactions." + n + ".learner_response", response).toLowerCase() == "true") {
								if (self.scormApi.LMSSetValue("cmi.interactions." + n + ".description", description).toLowerCase() == "true") {
									success = true;
								}
							}
						} else {
							if (self.scormApi.LMSSetValue("cmi.interactions." + n + ".student_response", response).toLowerCase() == "true") {
								success = true;
							}
						}
					}
				}
			}
		}
	}
	return success;
};
function getInteractionResponse(id) {
	var n = self.scormApi.LMSGetValue("cmi.interactions._count");
	var v = "";
	for (var i = 0; i < n; i = i + 1) {
		if (self.scormApi.LMSGetValue('cmi.interactions.' + i + '.id') == id) {
			v = self.scormApi.LMSGetValue('cmi.interactions.' + i + '.learner_response');
		}
	}
	return v;
};

function useMcqHtmlInputs() {
	if (typeof mod_shard_mcq !== "undefined" && mod_shard_mcq === "accessible") {
		return true;
	} else {
		return false;
	}
}

function renderQuestion() {
	var useHtmlInputs = useMcqHtmlInputs();
	var optionContainer = new Array();
	var optionButton = new Array();
	var optionTable = new Array();
	var optionRow = new Array();
	var optionMarker = new Array();
	var optionContent = new Array();
	var currentAnswer = false;
	var currentResponse = [];
	var optionCount = question.options.length;
	var correctOptions = 0;
	if (question.hasOwnProperty("correctOptions")) {
		correctOptions = question.correctOptions;
	} else {
		for (var i = 0; i < optionCount; i++) {
			correctOptions += question.options[i].c;
		};
		question.correctOptions = correctOptions;
	}
	if (!("attempts" in question)) {
		question.attempts = 1;
	}
	question.attemptsUsed = 0;
	if (aAss[qNo].split(",")[2] > 0) {
		currentAnswer = true;
		currentResponse = aAss[qNo].split(",")[3].split("*");
	}
	if (useHtmlInputs) {
		var optionInputContainer = new Array();
		var optionInput = new Array();
		var optionButtonDiv = new Array();
		var optionButtonTable = new Array();
		var optionButtonRow = new Array();
	} else {
		$("#scrq_question").attr("tabindex", 0);
		$("#scrq_explanation").attr("tabindex", 0);
	}
	$("#scrq_question").html(question.content);
	$("#scrq_explanation").html(question.explanation);
	for (var i = 0; i < optionCount; i = i + 1) {
		if (useHtmlInputs) {
			optionContainer[i] = document.createElement('label');
			optionTable[i] = document.createElement('div');
			optionRow[i] = document.createElement('div');
			optionInputContainer[i] = document.createElement('div');
			optionInput[i] = document.createElement('input');
			optionButton[i] = document.createElement('div');
			optionButtonDiv[i] = document.createElement('div');
			optionButtonTable[i] = document.createElement('div');
			optionButtonRow[i] = document.createElement('div');
			optionMarker[i] = document.createElement('div');
			optionContent[i] = document.createElement('div');
			optionContainer[i].setAttribute("for", question.options[i].id);
			optionTable[i].className = "scr_layout_table";
			optionRow[i].className = "scr_layout_row";
			optionInputContainer[i].className = "scr_layout_cell";
			optionInputContainer[i].style.verticalAlign = "middle";
			optionInputContainer[i].style.width = "20px";
			optionInputContainer[i].style.textAlign = "center";
			if (correctOptions === 1) {
				optionInput[i].type = "radio";
				optionInput[i].setAttribute("role","radio");
			} else {
				optionInput[i].type = "checkbox";
				optionInput[i].setAttribute("role","checkbox");
			}
			
			optionInput[i].ariaRequired = true;
			optionInput[i].ariaLabel = question.options[i].content.replace(/(<([^>]+)>)/ig, "");
			optionInput[i].setAttribute("aria-describedby", "scrq_question");
			optionInput[i].name = question.id + "_options";
			optionInput[i].id = question.options[i].id;
			optionButton[i].className = "scr_layout_cell";
			optionButton[i].style.verticalAlign = "middle";
			optionButtonDiv[i].className = "assessment-option-border-ready";
			optionButtonDiv[i].id = question.options[i].id + "-button";
			optionButtonTable[i].className = "scr_layout_table";
			optionButtonRow[i].className = "scr_layout_row";
			optionContent[i].className = "scr_layout_cell assessment-option-content";
			optionContent[i].style.color = "inherit";
			optionContent[i].innerHTML = question.options[i].content;
			optionMarker[i].className = "scr_layout_cell";
			optionMarker[i].id = question.options[i].id + "-marker";
			optionMarker[i].style.verticalAlign = "middle";
			optionMarker[i].style.width = "20px";
			optionContainer[i].appendChild(optionTable[i]);
			optionTable[i].appendChild(optionRow[i]);
			optionRow[i].appendChild(optionInputContainer[i]);
			optionInputContainer[i].appendChild(optionInput[i]);
			optionRow[i].appendChild(optionButton[i]);
			optionButton[i].appendChild(optionButtonDiv[i]);
			optionButtonDiv[i].appendChild(optionButtonTable[i]);
			optionButtonTable[i].appendChild(optionButtonRow[i]);
			optionButtonRow[i].appendChild(optionContent[i]);
			optionButtonRow[i].appendChild(optionMarker[i]);
			if (!currentAnswer) {
				optionButtonDiv[i].style.cursor = "pointer";
				optionInput[i].onclick = function () {
					var optionId = $(this).prop("id");
					toggleQuestionOption(optionId);
				};
			}
		} else {
			optionContainer[i] = document.createElement('div');
			optionButton[i] = document.createElement('div');
			optionTable[i] = document.createElement('table');
			optionRow[i] = document.createElement('tr');
			optionMarker[i] = document.createElement('td');
			optionContent[i] = document.createElement('td');
			optionButton[i].className = "assessment-option-border-ready";
			optionMarker[i].className = "assessment-option-marker-ready";
			if (!currentAnswer) {
				optionButton[i].style.cursor = "pointer";
				optionButton[i].onclick = function () {
					var optionId = $(this).prop("id");
					toggleQuestionOption(optionId);
				};
				optionButton[i].onkeyup = function (e) {
					if (e.keyCode === 32 || e.keyCode === 13) {
						var optionId = $(this).prop("id");
						toggleQuestionOption(optionId);
					};
				};
			};
			optionButton[i].style.margin = "5px";
			optionButton[i].style.padding = "0";
			optionButton[i].id = question.options[i].id;
			optionButton[i].tabIndex = 0;
			optionTable[i].style.tableLayout = "fixed";
			optionTable[i].style.border = "0";
			optionTable[i].style.margin = "0";
			optionTable[i].style.padding = "0";
			optionTable[i].style.width = "100%";
			optionTable[i].cellPadding = "0";
			optionTable[i].cellSpacing = "0";
			optionTable[i].border = "0";
			optionMarker[i].id = question.options[i].id + "-marker";
			optionMarker[i].style.width = "20px";
			optionMarker[i].style.border = "0";
			optionMarker[i].style.margin = "0";
			optionMarker[i].style.padding = "0";
			optionContent[i].style.border = "0";
			optionContent[i].style.margin = "0";
			optionContent[i].style.padding = "0";
			optionContent[i].style.color = "inherit";
			optionContent[i].innerHTML = question.options[i].content;
			optionRow[i].appendChild(optionMarker[i]);
			optionRow[i].appendChild(optionContent[i]);
			optionTable[i].appendChild(optionRow[i]);
			optionButton[i].appendChild(optionTable[i]);
			optionContainer[i].appendChild(optionButton[i]);
		}
		if ("width" in question.options[i] && question.options[i].width < 100) {
			optionContainer[i].style.display = "inline-block";
			optionContainer[i].style.verticalAlign = "middle";
			optionContainer[i].className = "contentblock" + question.options[i].width;
		}
		if (question.itemSort == "prescribed") {
			document.getElementById("scrq_options").appendChild(optionContainer[i]);
		}
	}
	if (question.itemSort == "random") {
		var randomArray = new Array();
		for (var i = 0; i < question.options.length; i = i + 1) {
			randomArray[i] = i;
		}
		for (var i = 0; i < optionCount; i = i + 1) {
			var randomNumber = getRandomInt(1, randomArray.length) - 1;
			var randomIndex = randomArray[randomNumber];
			document.getElementById("scrq_options").appendChild(optionContainer[randomIndex]);
			randomArray.splice(randomNumber, 1);
		}
	}
	if (useHtmlInputs) {
		$("#scrq_options").wrapInner("<fieldset>");
	}
	if (currentAnswer) {
		for (var j = 0; j < currentResponse.length; j = j + 1) {
			toggleQuestionOption(question.options[currentResponse[j] - 1].id);
			disableElement(question.options[currentResponse[j] - 1].id);
		}
		disableElement(document.getElementById("scrq_submit_button"));
		nextPage = function () {
			continueAssessment();
		};
		SKILLCASTAPI.showNext();
		question.attemptsUsed = question.attempts - 1;
	}
	if (typeof timeLimit !== "undefined" && timeLimit > 0) {
		checkTimeSpent();
	}
}
function getCurrentTime() {
	var currentTime = new Date();
	return currentTime.getTime();
}
function getTimeLeft() {
	if (typeof timeLimit !== "undefined" && timeLimit > 0) {
		var startTime = Number(getDataValue(assessmentId + "-start"));
		var timeSpentMs = getCurrentTime() - startTime;
		var timeLimitMs = timeLimit * 60 * 1000;
		return timeLimitMs - timeSpentMs;
	}
	return 0;
}
function checkTimeSpent() {
	var timeLeftMs = getTimeLeft();
	if (timeLeftMs < 0) {
		gradeQuestionResponse();
	} else {
		var timeLimitRefresh = setTimeout(checkTimeSpent, 1000);
		var timeLeftMin = Math.ceil(timeLeftMs / (1000 * 60));
		document.getElementById("timeLeft").innerText = timeLeftMin;
		document.getElementById("timeLeftContainer").style.visibility = "visible";
	}
}
function submitQuestionResponse(score, response) {
	aAss[qNo] = aAss[qNo].split(",")[0] + "," + aAss[qNo].split(",")[1] + "," + score + "," + response.join("*");
	var totalQuestionCount = aAss.length;
	var timeLeft = getTimeLeft();
	if (feedback == 10 && (qNo + 1) < totalQuestionCount) {
		var incorrectResponses = 0;
		for (var i = 0; i < totalQuestionCount; i++) {
			if (aAss[i].split(",")[2] == 1) {
				incorrectResponses = incorrectResponses + 1;
			}
		}
		var maxIncorrectResponses = Math.floor((100 - passmark) * totalQuestionCount / 100) + 1;
		if (incorrectResponses >= maxIncorrectResponses) {
			aAss.splice(qNo + 1, totalQuestionCount - (qNo + 1));
			totalQuestionCount = aAss.length;
		}
	}
	if (qNo + 1 == totalQuestionCount || timeLeft < 0) {
		var ts = 0;
		attemptStatus = 1;
		var thisResponse = [];
		for (var i = 0; i < totalQuestionCount; i++) {
			thisResponse = aAss[i].split(",");
			if (thisResponse.length >= 3 && thisResponse[2] == 2) {
				ts = ts + 1;
			}
		}
		var ps = Math.round(100 * ts / totalQuestionCount, 0);
		var ss = 0;
		if (ps >= passmark) {
			ss = 1;
			attemptStatus = 2;
		}
		setTracking(assessmentId, ss, ps);
		var objectiveCount = scr_objectives.length;
		if (objectiveCount > 0) {
			for (var i = 0; i < objectiveCount; i++) {
				var objectiveCorrect = 0;
				var objectiveTotal = 0;
				for (var j = 0; j < totalQuestionCount; j = j + 1) {
					if (aQb[aAss[j].split(",")[0]].questions[aAss[j].split(",")[1]].objectiveId == scr_objectives[i].id) {
						if (aAss[j].split(",")[2] == "2") {
							objectiveCorrect++;
						}
						objectiveTotal++;
					}
				}
				if (objectiveTotal > 0) {
					var objectiveScore = Math.round(100 * objectiveCorrect / objectiveTotal);
					setDataValue(assessmentId + "-" + scr_objectives[i].id, objectiveScore);
				}
			}
		}
		if (feedback == 8) {
			if (attemptStatus == 2) {
				removeObjective("Assessment");
				setCompletionStatus();
			} else {
				setDataValue("exempt-" + assessmentId, "y");
			}
		}
		var assTracking = getTracking(assessmentId);
		setDataValue(scr_pages[thisPageNo].title, assTracking.score);
		if (typeof trackScormObjectives !== 'undefined' && trackScormObjectives) {
			if (assTracking.status == 1) {
				var assStatus = "passed";
			} else {
				var assStatus = "failed";
			}
			setObjective(scr_pages[thisPageNo].title, assTracking.score, assStatus);
		}
	}
	setDataValue(assessmentId, aAss.join("!"));
	if ((feedback != 1 && feedback != 10) || timeLeft < 0) {
		continueAssessment();
	}
}
function continueAssessment() {
	if (attemptStatus == 0) {
		gotoQuestion(aQb[aAss[qNo + 1].split(",")[0]].questions[aAss[qNo + 1].split(",")[1]].id);
	} else if (attemptStatus == 1) {
		var t = getTracking(assessmentId);
		if (t.attemptLimit > 0) {
			if (t.attempts.length >= t.attemptLimit && t.status == 0) {
				self.location = assessmentId + "-f-" + scr_audio + "-" + scr_acc + "-" + scr_lang + ".htm";
			} else {
				self.location = assessmentId + "-r-" + scr_audio + "-" + scr_acc + "-" + scr_lang + ".htm";
			};
		} else {
			self.location = assessmentId + "-r-" + scr_audio + "-" + scr_acc + "-" + scr_lang + ".htm";
		}
	} else if (attemptStatus == 2) {
		self.location = assessmentId + "-p-" + scr_audio + "-" + scr_acc + "-" + scr_lang + ".htm";
	}
}
function getObjectiveId(nam) {
	var objectiveId = "";
	var i;
	var objectivesLen = scr_objectives.length;
	for(i = 0; i < objectivesLen; i = i + 1) {
		if (scr_objectives[i].title == nam) {
			objectiveId = scr_objectives[i].id;
		}
	}
	return objectiveId;
}
function getRemoveObjectiveArray() {
	var removeObjArray = [];
	var removeObjList = getDataValue("removeObjectives");
	if (removeObjList !== "") {
		var removeObjArray = removeObjList.split(",");
	}
	return removeObjArray;
}
function removeObjective(nam) {
	var objectiveId = getObjectiveId(nam);
	var removeObjArray = getRemoveObjectiveArray();
	if (objectiveId !== "" && removeObjArray.indexOf(objectiveId) === -1) {
		removeObjArray.push(objectiveId);
		setDataValue("removeObjectives", removeObjArray.join(","));
	}
}
function checkObjective(nam) {
	var objectiveId = getObjectiveId(nam);
	var removeObjArray = getRemoveObjectiveArray();
	var objectiveStatus = "";
	if (objectiveId !== "") {
		if (removeObjArray.indexOf(objectiveId) === -1) {
			objectiveStatus = "added";
		} else {
			objectiveStatus = "removed";
		}
	}
	return objectiveStatus;
}
function addObjective(nam) {
	var objectiveId = getObjectiveId(nam);
	var removeObjArray = getRemoveObjectiveArray();
	var removeObjArrayLen = removeObjArray.length;
	var newObjArray = [];
	var i;
	if (objectiveId !== "" && removeObjArray.indexOf(objectiveId) !== -1) {
		for (i = 0; i < removeObjArrayLen; i = i + 1) {
			if (removeObjArray[i] !== objectiveId) {
				newObjArray.push(removeObjArray[i]);
			}
		}
		setDataValue("removeObjectives", newObjArray.join(","));
	}
}
function evaluateObjectives() {
	if (scr_objectives.length > 0) {
		var removeObjArray = new Array();
		for (var i = 0; i < scr_objectives.length; i = i + 1) {
			if (getDataValue(assessmentId + "-" + scr_objectives[i].id) != "" && Number(getDataValue(assessmentId + "-" + scr_objectives[i].id)) >= scr_objectives[i].mastery) {
				removeObjArray[removeObjArray.length] = scr_objectives[i].id;
			}
		}
		if (removeObjArray.length > 0) {
			setDataValue('removeObjectives', removeObjArray.join(","));
		}
	}
}
function objectivesFeedback(container) {
	var feedback = '<table cellpadding="5" cellspacing="0" border="0" width="100%">';
	if (scr_objectives.length > 0) {
		for (var i = 0; i < scr_objectives.length; i = i + 1) {
			if (getDataValue(assessmentId + "-" + scr_objectives[i].id) != "") {
				var feedback = feedback + '<tr><td align="left" valign="middle" width="50%">' + scr_objectives[i].title + '</td><td align="left" valign="middle" width="50%">' + getDataValue(assessmentId + "-" + scr_objectives[i].id) + '%</td></tr>';
			}
		}
	}
	feedback = feedback + '</table>';
	$("#" + container).html(feedback);
}
function renderSolution(qb, q, response) {
	var aQbQuestionsObject = aQb[qb].questions[q];
	var aQbQuestionsObjectOptions = aQbQuestionsObject.options;
	var aQbQuestionsObjectOptionsLen = aQbQuestionsObjectOptions.length;
	var question = '<div style="text-align:left">' + aQbQuestionsObject.content + '</div>';
	var explanation = '<div style="text-align:left">' + aQbQuestionsObject.explanation + '</div>';
	var options = "<div>";
	if (aQbQuestionsObjectOptionsLen > 0 && !(aQbQuestionsObjectOptions[0].hasOwnProperty("c"))) {
		return renderSolutionAsync(aQbQuestionsObject.id, qb, q, response)
	}
	for (var i = 0; i < aQbQuestionsObjectOptionsLen; i++) {
		var selected = 0;
		var responseLen = response.length;
		var aQbQuestionsObjectOptionsAtIndex = aQbQuestionsObjectOptions[i];
		var correct = aQbQuestionsObjectOptionsAtIndex.c;
		var borderClass, markerClass;

		for (var j = 0; j < responseLen; j++) {
			if (response[j] == i + 1) {
				selected = 1;
			}
		}
		if (feedback == 4 || feedback == 9) {
			borderClass = 'assessment-option-border-ready';
			markerClass = 'assessment-option-marker-ready';
		} else if (correct == 1 && selected == 1) {
			borderClass = 'assessment-option-border-correct';
			markerClass = 'assessment-option-marker-selected-correct';
		} else if (correct == 0 && selected == 1) {
			borderClass = 'assessment-option-border-incorrect';
			markerClass = 'assessment-option-marker-selected-incorrect';
		} else if (correct == 1 && selected == 0) {
			borderClass = 'assessment-option-border-notselected';
			markerClass = 'assessment-option-marker-notselected-correct';
		} else {
			borderClass = 'assessment-option-border-notselected';
			markerClass = 'assessment-option-marker-notselected-incorrect';
		}
		options += '<div class="' + borderClass + '" style="margin: 5px; padding: 0px;">';
		options += '<table style="margin: 0px; padding: 0px; border: 0px currentColor; border-image: none; width: 100%; table-layout: fixed;" border="0" cellspacing="0" cellpadding="0">';
		options += '<tr><td class="' + markerClass + '" style="margin: 0px; padding: 0px; border: 0px; border-image: none; width: 20px;"></td>';
		options += '<td style="margin: 0px; padding: 0px; border: 0px; border-image: none;">' + aQbQuestionsObjectOptionsAtIndex.content + '</td></tr></table></div>';
	}
	options += "</div>";
	var solution = document.createElement('div');
	if (feedback == 4) {
		solution.innerHTML = question + options;
	} else {
		solution.innerHTML = question + options + explanation;
	};
	document.getElementById('scr_feedback').appendChild(solution);
}

function renderSolutionAsync(id, qb, q, response) {
	getQuestionAnswerJSON(id, aQb[qb].questions[q]).success(function () {
		renderSolution(qb, q, response);
	})
}

function getModuleInfo() {
	var info = {};
	info.lpId = lpId;
	info.commentsMode = commentsMode;
	return info;
}
function scr_createDiv(className, content, container) {
	var d = document.createElement("div");
	d.className = className;
	d.innerHTML = content;
	container.appendChild(d);
	return d;
}
function scr_deleteComment(id, container, filter) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", self.scormApi.scr_getAjaxUrl() + Math.random(), true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			scr_showComments(container, filter);
		}
	}
	xhr.send("commentId=" + id + "&targetService=comments&targetMethod=deleteComment");
}
function scr_commentResponse(id, currentStatus, container, filter) {
	var response = document.getElementById("resp" + id).value;
	var commentStatus = currentStatus;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", self.scormApi.scr_getAjaxUrl() + Math.random(), true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			scr_showComments(container, filter);
		}
	}
	xhr.send("commentId=" + id + "&response=" + escape(replaceWordChars(response)) + "&commentStatus=" + commentStatus + "&targetService=comments&targetMethod=updateComment");
}
function scr_updateComment(id, status, container, filter) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", self.scormApi.scr_getAjaxUrl() + Math.random(), true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			scr_showComments(container, filter);
		}
	}
	xhr.send("commentId=" + id + "&response=&commentStatus=" + status + "&targetService=comments&targetMethod=updateComment");
}
function scr_addComment(commentsMode, container, filter) {
	var comment = document.getElementById("newComment").value;
	var lpId = getModuleInfo().lpId;
	var pageId = getPageInfo().autoId;
	if (commentsMode == "moderated") {
		var commentStatus = 0;
		var commentType = document.getElementById("newCommentType").options[document.getElementById("newCommentType").selectedIndex].value;
	} else {
		var commentType = 2;
		var commentStatus = 1;
		if (filter == "Closed") {
			filter = "all";
		}
	}
	var xhr = new XMLHttpRequest();

	xhr.open("POST", self.scormApi.scr_getAjaxUrl() + Math.random(), true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf8");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			scr_showComments(container, filter);
		}
	}
	xhr.send("lpId=" + lpId + "&pageId=" + pageId + "&comment=" + escape(replaceWordChars(comment)) + "&commentStatus=" + commentStatus + "&commentType=" + commentType + "&targetService=comments&targetMethod=addComment");
}
function scr_toggleComments(filter, display, container) {
	if (display == "full") {
		document.getElementById(container).className = "comments-full";
		document.getElementById("commentsSpacer").style.height = "0px";
	} else if (display == "split") {
		document.getElementById(container).className = "comments-visible";
		document.getElementById("commentsSpacer").style.height = $("#" + container).height() + "px";
	} else {
		document.getElementById(container).className = "comments-hidden";
		document.getElementById("commentsSpacer").style.height = $("#" + container).height() + "px";
	}
	scr_showComments(container, filter);
}
function scr_showComments(container, commentsDisplay) {
	commentsDisplay = typeof commentsDisplay !== 'undefined' ? commentsDisplay : "all";
	var c = document.getElementById(container);
	c.innerHTML = "";
	var userId = getUserInfo().id;
	var lpId = getModuleInfo().lpId;
	var pageId = getPageInfo().autoId;
	var commentsMode = getModuleInfo().commentsMode;
	if (commentsMode == "review") {
		var statusArray = [
			{ "value": "1", "label": "Open", "count": 0 },
			{ "value": "2", "label": "Closed", "count": 0 }
		];
	} else {
		var statusArray = [
			{ "value": "1", "label": "Public", "count": 0 },
			{ "value": "-1", "label": "Private", "count": 0 }
		];
	}
	var xhr = new XMLHttpRequest();
	xhr.open("POST", self.scormApi.scr_getAjaxUrl() + Math.random(), true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var jsonObj = JSON.parse(xhr.responseText);
			var aComments = jsonObj.COMMENTS;
			var isAdmin = jsonObj.ISADMIN;
			var commentsFilter = "all";
			for (var j = 0; j < statusArray.length; j = j + 1) {
				for (var i = 0; i < aComments.length; i = i + 1) {
					if (aComments[i].APPROVED == statusArray[j].value) {
						statusArray[j].count = statusArray[j].count + 1;
					}
				}
				if (commentsDisplay == statusArray[j].label && statusArray[j].count > 0) {
					commentsFilter = statusArray[j].value;
				}
			}
			var title = scr_createDiv("comments-title", "Comments ", c);
			for (var j = 0; j < statusArray.length; j = j + 1) {
				if (statusArray[j].count > 0) {
					var subset = scr_createDiv("comments-button", statusArray[j].label + " (" + statusArray[j].count + ")", title);
					subset.dataId = container;
					subset.dataFilter = statusArray[j].label;
					if (c.className == "comments-full") {
						subset.dataDisplay = "full";
					} else {
						subset.dataDisplay = "split";
					}
					if (c.className != "comments-hidden" && commentsDisplay == statusArray[j].label) {
						subset.className = "comments-button-active";
					}
					subset.onclick = function () {
						scr_toggleComments(this.dataFilter, this.dataDisplay, this.dataId);
					}
				}
			}
			var all = scr_createDiv("comments-button", "All (" + aComments.length + ")", title);
			all.dataId = container;
			all.dataFilter = "all";
			if (c.className == "comments-full") {
				all.dataDisplay = "full";
			} else {
				all.dataDisplay = "split";
			}
			if (c.className != "comments-hidden" && commentsDisplay == "all") {
				all.className = "comments-button-active";
			}
			all.onclick = function () {
				scr_toggleComments(this.dataFilter, this.dataDisplay, this.dataId);
			}
			if (c.className != "comments-hidden") {
				var hide = scr_createDiv("comments-button", "Hide", title);
				hide.dataId = container;
				hide.dataFilter = commentsDisplay;
				hide.dataDisplay = "hide";
				hide.onclick = function () {
					scr_toggleComments(this.dataFilter, this.dataDisplay, this.dataId);
				}
				if (c.className != "comments-visible") {
					var split = scr_createDiv("comments-button", "Split screen", title);
					split.dataId = container;
					split.dataFilter = commentsDisplay;
					split.dataDisplay = "split";
					split.onclick = function () {
						scr_toggleComments(this.dataFilter, this.dataDisplay, this.dataId);
					}
				}
				if (c.className != "comments-full") {
					var full = scr_createDiv("comments-button", "Full screen", title);
					full.dataId = container;
					full.dataFilter = commentsDisplay;
					full.dataDisplay = "full";
					full.onclick = function () {
						scr_toggleComments(this.dataFilter, this.dataDisplay, this.dataId);
					}
				}
			}
			if (isAdmin) {
				var module = scr_createDiv("comments-button", "View all comments for this module", title);
				module.dataId = container;
				module.dataFilter = commentsDisplay;
				module.onclick = function () {
					if (document.getElementById(this.dataId).className != "comments-full") {
						document.getElementById(this.dataId).className = "comments-full";
						document.getElementById("commentsSpacer").style.height = "0px";
					}
					scr_showAllComments(this.dataId, this.dataFilter);
				}
			}
			for (var i = 0; i < aComments.length; i = i + 1) {
				if (commentsFilter == "all" || commentsFilter == aComments[i].APPROVED) {
					thisClass = "comments-public";
					if (aComments[i].APPROVED == 2) {
						thisClass = "comments-approved";
					} else if (aComments[i].APPROVED == 1) {
						thisClass = "comments-pending";
					} else if (aComments[i].APPROVED == -1) {
						thisClass = "comments-denied";
					}
					var outer = scr_createDiv(thisClass, "", c);
					if (aComments[i].APPROVED == 2) {
						var dateName = scr_createDiv("comments-comment", aComments[i].DATECREATED + " <b>" + aComments[i].FIRSTNAME + " " + aComments[i].LASTNAME + "</b> - " + aComments[i].COMMENT + " (closed on " + aComments[i].RESPONSEDATE + " by " + aComments[i].RFIRSTNAME + " " + aComments[i].RLASTNAME + ")", outer);
					} else {
						var dateName = scr_createDiv("comments-comment", aComments[i].DATECREATED + " <b>" + aComments[i].FIRSTNAME + " " + aComments[i].LASTNAME + "</b> - " + aComments[i].COMMENT, outer);
					}
					var respoptions = scr_createDiv("comments-subtitle", "", outer);
					if (aComments[i].RESPONSE.length > 0) {
						var reveal = scr_createDiv("comments-button", "Responses (" + aComments[i].RESPONSE.length + ")", respoptions);
						reveal.dataId = "responses" + i;
						reveal.onclick = function () {
							if (this.className == "comments-button") {
								document.getElementById(this.dataId).style.display = "block";
								this.className = "comments-button-active";
							} else {
								document.getElementById(this.dataId).style.display = "none";
								this.className = "comments-button";
							}
						}
						var responses = scr_createDiv("comments-response", "", outer);
						responses.id = "responses" + i;
						responses.style.display = "none";
						for (var j = 0; j < aComments[i].RESPONSE.length; j = j + 1) {
							var thisResp = scr_createDiv("comments-comment", aComments[i].RESPONSE[j].DATECREATED + " <b>" + aComments[i].RESPONSE[j].FIRSTNAME + " " + aComments[i].RESPONSE[j].LASTNAME + "</b> - " + aComments[i].RESPONSE[j].RESPONSE, responses);
						}
						if (aComments[i].APPROVED == 1) {
							var nextresponse = scr_createDiv("comments-comment", "", responses);
							var edit = scr_createDiv("comments-button", "Respond", nextresponse);
							edit.dataId = "edit" + i;
							edit.onclick = function () {
								if (this.className == "comments-button") {
									document.getElementById(this.dataId).style.display = "block";
									this.className = "comments-button-active";
								} else {
									document.getElementById(this.dataId).style.display = "none";
									this.className = "comments-button";
								}
							}
						}
					} else if (aComments[i].APPROVED == 1) {
						var edit = scr_createDiv("comments-button", "Respond", respoptions);
						edit.dataId = "edit" + i;
						edit.onclick = function () {
							if (this.className == "comments-button") {
								document.getElementById(this.dataId).style.display = "block";
								this.className = "comments-button-active";
							} else {
								document.getElementById(this.dataId).style.display = "none";
								this.className = "comments-button";
							}
						}
					}
					if (aComments[i].COMMENTTYPE == 2 && isAdmin) {
						if (aComments[i].APPROVED == 1) {
							var upd = scr_createDiv("comments-button", "Close", respoptions);
							upd.dataId = aComments[i].ID;
							upd.onclick = function () {
								scr_updateComment(this.dataId, 2, container, commentsDisplay);
							}
						} else if (aComments[i].APPROVED == 2) {
							var upd = scr_createDiv("comments-button", "Re-open", respoptions);
							upd.dataId = aComments[i].ID;
							upd.onclick = function () {
								scr_updateComment(this.dataId, 1, container, commentsDisplay);
							}
						}
					}
					if (aComments[i].USERID == userId) {
						var del = scr_createDiv("comments-button", "Delete", respoptions);
						del.dataId = aComments[i].ID;
						del.onclick = function () {
							scr_deleteComment(this.dataId, container, commentsDisplay);
						}
					}
					if ((aComments[i].COMMENTTYPE == 2 || aComments[i].COMMENTTYPE == 3)) {
						var respouter = scr_createDiv("comments-response", "", outer);
						respouter.style.display = "none";
						respouter.id = "edit" + i;
						var resp = scr_createDiv("comments-comment", "", respouter);
						var respinput = document.createElement("textarea");
						respinput.id = "resp" + aComments[i].ID;
						respinput.wrap = "soft";
						respinput.className = "comments-textarea";
						resp.appendChild(respinput);
						var respsub = scr_createDiv("comments-comment", "", respouter);
						respbutton = scr_createDiv("comments-button", "Submit", respsub);
						respbutton.dataId = aComments[i].ID;
						respbutton.dataType = aComments[i].COMMENTTYPE;
						respbutton.dataStatus = aComments[i].APPROVED;
						respbutton.onclick = function () {
							scr_commentResponse(this.dataId, this.dataStatus, container, commentsDisplay);
						};
					}
				}
			}
			var newtitle = scr_createDiv("comments-subtitle", "<b>Add comment</b>", c);
			var newcomment = scr_createDiv("comments-comment", "", c);
			var newinput = document.createElement("textarea");
			newinput.id = "newComment";
			newinput.wrap = "soft";
			newinput.className = "comments-textarea";
			newcomment.appendChild(newinput);
			var newsub = scr_createDiv("comments-comment", "", c);
			if (commentsMode == "moderated") {
				var newselect = document.createElement("select");
				newselect.id = "newCommentType";
				var typeArray = [
					{ "value": "1", "label": "Private" },
					{ "value": "2", "label": "Public" },
					{ "value": "3", "label": "Feedback" }
				];
				for (var j = 0; j < typeArray.length; j = j + 1) {
					var newoption = document.createElement("option");
					newoption.value = typeArray[j].value;
					newoption.innerText = typeArray[j].label;
					newselect.appendChild(newoption);
				}
				newsub.appendChild(newselect);
			}
			newbutton = scr_createDiv("comments-button", "Submit", newsub);
			newbutton.onclick = function () {
				scr_addComment(commentsMode, container, commentsDisplay);
			};
		}
	};
	xhr.send("lpId=" + lpId + "&pageId=" + pageId + "&targetService=comments&targetMethod=getCommentsJSON");
}
function scr_showAllComments(container, commentsDisplay) {
	commentsDisplay = typeof commentsDisplay !== 'undefined' ? commentsDisplay : "all";
	var c = document.getElementById(container);
	c.innerHTML = "";
	var userId = getUserInfo().id;
	var lpId = getModuleInfo().lpId;
	var pageId = getPageInfo().autoId;
	var commentsMode = getModuleInfo().commentsMode;
	if (commentsMode == "review") {
		var statusArray = [
			{ "value": "1", "label": "Open", "count": 0 },
			{ "value": "2", "label": "Closed", "count": 0 }
		];
	} else {
		var statusArray = [
			{ "value": "1", "label": "Public", "count": 0 },
			{ "value": "-1", "label": "Private", "count": 0 }
		];
	}
	var xhr = new XMLHttpRequest();
	xhr.open("POST", self.scormApi.scr_getAjaxUrl() + Math.random(), true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var jsonObj = JSON.parse(xhr.responseText);
			var aComments = jsonObj.COMMENTS;
			var isAdmin = jsonObj.ISADMIN;
			var commentsFilter = "all";
			for (var j = 0; j < statusArray.length; j = j + 1) {
				for (var i = 0; i < aComments.length; i = i + 1) {
					if (aComments[i].APPROVED == statusArray[j].value) {
						statusArray[j].count = statusArray[j].count + 1;
					}
				}
				if (commentsDisplay == statusArray[j].label && statusArray[j].count > 0) {
					commentsFilter = statusArray[j].value;
				}
			}
			var title = scr_createDiv("comments-subtitle", "Module comments ", c);
			for (var j = 0; j < statusArray.length; j = j + 1) {
				if (statusArray[j].count > 0) {
					var subset = scr_createDiv("comments-button", statusArray[j].label + " (" + statusArray[j].count + ")", title);
					subset.dataId = container;
					subset.dataFilter = statusArray[j].label;
					if (commentsDisplay == statusArray[j].label) {
						subset.className = "comments-button-active";
					}
					subset.onclick = function () {
						scr_showAllComments(this.dataId, this.dataFilter);
					}
				}
			}
			var all = scr_createDiv("comments-button", "All (" + aComments.length + ")", title);
			all.dataId = container;
			all.dataFilter = "all";
			if (commentsDisplay == "all") {
				all.className = "comments-button-active";
			}
			all.onclick = function () {
				scr_showAllComments(this.dataId, this.dataFilter);
			}
			var prnt = scr_createDiv("comments-button", "Print", title);
			prnt.dataId = container;
			prnt.onclick = function () {
				scr_printElem(this.dataId);
			}
			for (var p = 0; p < scr_pages.length; p = p + 1) {
				var comments = [];
				for (var i = 0; i < aComments.length; i = i + 1) {
					if (aComments[i].PAGEID == scr_pages[p].autoId && (commentsFilter == "all" || commentsFilter == aComments[i].APPROVED)) {
						comments[comments.length] = aComments[i];
					}
				}
				if (comments.length > 0) {
					var pagenav = scr_createDiv("comments-subtitle", "", c);
					var pagetitle = scr_createDiv("comments-title", scr_pages[p].title, pagenav);
					var pagebutton = scr_createDiv("comments-button", "View page", pagenav);
					pagebutton.dataId = p + 1;
					pagebutton.onclick = function () {
						gotoPage(this.dataId);
					}
					for (var i = 0; i < comments.length; i = i + 1) {
						thisClass = "comments-public";
						if (comments[i].APPROVED == 2) {
							thisClass = "comments-approved";
						} else if (comments[i].APPROVED == 1) {
							thisClass = "comments-pending";
						} else if (comments[i].APPROVED == -1) {
							thisClass = "comments-denied";
						}
						var outer = scr_createDiv(thisClass, "", c);
						if (comments[i].APPROVED == 2) {
							var dateName = scr_createDiv("comments-comment", comments[i].DATECREATED + " <b>" + comments[i].FIRSTNAME + " " + comments[i].LASTNAME + "</b> - " + comments[i].COMMENT + " (closed on " + comments[i].RESPONSEDATE + " by " + comments[i].RFIRSTNAME + " " + comments[i].RLASTNAME + ")", outer);
						} else {
							var dateName = scr_createDiv("comments-comment", comments[i].DATECREATED + " <b>" + comments[i].FIRSTNAME + " " + comments[i].LASTNAME + "</b> - " + comments[i].COMMENT, outer);
						}
						if (comments[i].RESPONSE.length > 0) {
							var responses = scr_createDiv("comments-response", "", outer);
							for (var j = 0; j < comments[i].RESPONSE.length; j = j + 1) {
								var thisResp = scr_createDiv("comments-comment", comments[i].RESPONSE[j].DATECREATED + " <b>" + comments[i].RESPONSE[j].FIRSTNAME + " " + comments[i].RESPONSE[j].LASTNAME + "</b> - " + comments[i].RESPONSE[j].RESPONSE, responses);
							}
						}
					}
				}
			}
		}
	};
	xhr.send("lpId=" + lpId + "&targetService=comments&targetMethod=getCommentsJSON");
}
function scr_printElem(elem) {
	var mywindow = window.open('', 'PRINT', 'height=400,width=600');
	mywindow.document.write('<html><head><title>Comments</title><style>');
	mywindow.document.write('.comments-approved {background-color:#ccff99} .comments-button, .comments-button-active {visibility:hidden}');
	mywindow.document.write('.comments-comment {text-align:left;font-size:10pt;padding:10px}');
	mywindow.document.write('.comments-denied {background-color:#ff9999}');
	mywindow.document.write('.comments-pending {background-color:#eaeaea}');
	mywindow.document.write('.comments-public {background-color:#ffcc66}');
	mywindow.document.write('.comments-response {padding-left:20px}');
	mywindow.document.write('.comments-subtitle {text-align:left;font-size:10pt;padding:10px}');
	mywindow.document.write('.comments-title {display:inline-block;text-align:left;font-weight:bold;padding:10px;vertical-align:middle;font-size:12pt}');
	mywindow.document.write('</style></head><body onload="self.print()">');
	mywindow.document.write(document.getElementById(elem).innerHTML);
	mywindow.document.write('</body></html>');
	mywindow.document.close(); // necessary for IE >= 10
	mywindow.focus(); // necessary for IE >= 10*/
	return true;
}

//regtech question functions
function getSurveyPageStatus(p) {
	var pages = scr_pages;
	var statusObj = {
		"answered": 0,
		"required": 0,
		"completed": true
	};
	var questions = pages[p].questions;
	var questionCount = questions.length;
	for (var i = 0; i < questionCount; i++) {
		var question = scr_rtquestions[questions[i]];
		if (question.required) {
			statusObj.required++;
			if (getDataValue(question.id).length > 0) {
				if (question.options[getDataValue(question.id)].detail.length > 0 && getDataValue(question.id + "-detail").length == 0) {
					statusObj.completed = false;
				} else {
					statusObj.answered++;
				}
			} else {
				statusObj.completed = false;
			};
		};
	};
	return statusObj;
};

function getSurveyStatus() {
	var statusObj = {
		"answered": 0,
		"required": 0,
		"completed": true
	};
	var pages = scr_pages;
	var pageCount = pages.length;
	for (var i = 0; i < pageCount; i++) {
		var pageStatus = getSurveyPageStatus(i);
		statusObj.required += pageStatus.required;
		statusObj.answered += pageStatus.answered;
		if (!pageStatus.completed) {
			statusObj.completed = false;
		};
	};
	return statusObj;
};

function getSurveyReview(elementId,questionClass,responseClass,containerClass) {
	var container = document.getElementById(elementId);
	var pages = scr_pages;
	var pageCount = pages.length;
	var questions, questionCount, i, j, elem, question, response, responseText, questionElem, responseElem;
	var className = (typeof containerClass !== "undefined" && containerClass.length > 0) ? containerClass : "surveyquestioncontainer";
	container.innerHTML = "";
	for(i=0; i<pageCount; i++) {
		questions = pages[i].questions;
		questionCount = questions.length;
		for(j=0; j<questionCount; j++) {
			question = scr_rtquestions[questions[j]];
			response = getDataValue(question.id);
			if (response != '') {
				elem = document.createElement("div");
				elem.className = className;
				elem.style.margin = "10px 0px 10px 0px";
				responseText = "<p>" + question.options[response].content + "</p>";
				if(question.options[response].detail.length > 0) {
					var detail = getDataValue(question.id + "-detail");
					if(detail.length > 0) {
						responseText = responseText + "<p>" + detail + "</p>";
					}
				}
				questionElem = document.createElement("div");
				questionElem.className = questionClass;
				questionElem.innerHTML = question.question;
				responseElem = document.createElement("div");
				responseElem.className = responseClass;
				responseElem.innerHTML = responseText;
				elem.appendChild(questionElem);
				elem.appendChild(responseElem);
				container.appendChild(elem);
			}
		};
	};	
};

scr_suverySubmissionPending = false;

function submitSurvey(sendEmail, submissionType, callback) {
	if(!scr_suverySubmissionPending) {
		scr_suverySubmissionPending = true;
		doSubmitSurvey(sendEmail, submissionType, callback);
	}
}

function doSubmitSurvey(sendEmail, submissionType, callback) {
	var pages = scr_pages;
	var pageCount = pages.length;
	var completed = true;
	var responses = [];
	for (var i = 0; i < pageCount; i++) {
		var questions = pages[i].questions;
		var questionCount = questions.length;
		for (var j = 0; j < questionCount; j++) {
			var question = scr_rtquestions[questions[j]];
			var response = getDataValue(question.id);
			if (response.length > 0) {
				responses.push({
					"id": question.id,
					"optionNo": question.options[response].optionNo,
					"detail": getDataValue(question.id + "-detail").split("%").join("[percent]"),
					"fileUpload": getDataValue(question.id+"-fileUpload")
				});
			} else if (question.required) {
				completed = false;
			};
		};
	};
	if (completed) {
		if (scormVersion == 0) {
			callback(responses);
		} else {
			var ajaxUrl = scormApi.scr_getAjaxUrl() + Math.random();
			var scormId = scormApi.scr_getScormId();
			$.ajax({
				type: "POST",
				url: ajaxUrl,
				data: {
					"targetService": "regTech",
					"targetMethod": "createSubmissionJSON",
					"trackingId": scormId,
					"scormVersion": scormVersionNo,
					"lang": scr_lang,
					"sendEmail": sendEmail,
					"submissionType": submissionType,
					"responses": JSON.stringify(responses)
				},
				success: function (result) {
					var response = { "error": 1 };
					try {
						response = JSON.parse(result);
					} catch (e) {
						response = { "error": 1 };
					}
					if (response.error == 0) {
						scormApi.scr_setSessionValue("alerts", response);
						for (var i = 0; i < pageCount; i++) {
							var questions = pages[i].questions;
							var questionCount = questions.length;
							for (var j = 0; j < questionCount; j++) {
								var question = scr_rtquestions[questions[j]];
								if (("preserve" in question && question.preserve == 0) || submissionType == 'anon') {
									removeDataValue(question.id);
									removeDataValue(question.id + "-detail");
									removeDataValue(question.id + "-fileUpload");
								}
							};
						};
						scr_suverySubmissionPending = false;
						callback();
					} else {
						scr_suverySubmissionPending = false;
						alert("Survey submission failed");
					}
				},
				error: function (xhr, status, error) {
					scr_suverySubmissionPending = false;
					alert("Survey submission failed");
				},
				dataType: "text"
			});
		};
	};
};

function videoPlayer(props) {
	var def = {
		"id": "",
		"addElement": "",
		"nextPageAction": "",
		"autoplay": false,
		"hideControls": true,
		"fullScreen": false,
		"preserveState": true,
		"forceToWatch": false,
		"autoId": "",
		"resetOnEnd": false,
		"clickToPlay": true,
		"activeCaptions": true,
		"disablePlayBar": false
	};
	
	var prop;
	for (prop in props) {
		def[prop] = props[prop];
	};

	var allowFullScreen = def.fullScreen && !def.autoplay;
	var videoWatched, autoplay, videoEnded, data, seekTime, settings;
	var videoID = '#video' + def.id;
	var video = document.querySelector(videoID);
	var timeStarted = -1;
	var timePlayed = 0;
	var duration = 0;

	var player = new Plyr(videoID, {
		clickToPlay: def.clickToPlay,
		resetOnEnd: def.resetOnEnd,
		tooltips: { controls: true, seek: true },
		keyboard: { focused: true, global: true },
		autoplay: getAutoPlay(),
		hideControls: def.hideControls,
		controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'airplay', 'fullscreen'],
		settings: getSettingsArray(),
		captions: { active: def.activeCaptions, language: 'auto', update: true },
		seekTime: isPlayBarDisabled()
	});
	
	var playBar = $('.plyr__progress input');

	if (scr_audio == 'on') {
		$('#container'+def.autoId).fadeIn(100);
	}

	if (scr_audio == 'off') {
		completionActions();
	};
	
	player.on("ended", function () {
		videoEnded = true;
		if (allowFullScreen) {
			player.fullscreen.exit();
		}
		if (def.forceToWatch) {
			videoStoppedPlaying();
		} else {
			completionActions();
			setDataValue("video"+def.autoId, '1');
		}
	});

	player.on('play', function () {
		if (allowFullScreen) {
			player.fullscreen.enter();
		}
	});

	player.on('playing', function () {
		videoStartedPlaying();
	});

	player.on('pause', function () {
		if (def.forceToWatch) {
			videoStoppedPlaying();
		}
	});

	video.addEventListener('loadedmetadata', function(){
		duration = video.duration;
		video.playbackRate = 1
	});

	function videoStartedPlaying() {
		timeStarted = new Date().getTime() / 1000;
	};

	function videoStoppedPlaying() {
		if (timeStarted > 0) {
			var playedFor = new Date().getTime() / 1000 - timeStarted;
			timeStarted = -1;
			timePlayed += playedFor;
		}

		if (timePlayed >= duration) {
			completionActions();
			setDataValue("video"+def.autoId, '1');
		}
	};

	function getVideoWatched() {
		data = getDataValue("video" + def.autoId);
		videoWatched = (data === "1" || data === true);
		return videoWatched;
	};

	function getAutoPlay() {
		if (def.autoplay == true) {
			if (def.preserveState && getVideoWatched() || videoEnded) {
				autoplay = false;
			} else {
				autoplay = true;
			}
		}
		return autoplay;
	};

	if (def.preserveState && getVideoWatched()) {
		completionActions();
	}

	function completionActions() {
		addAndRemoveFunction(def.addElement, "", "element", "0");
		toggleNextPage(def.nextPageAction);
	};

	$('#videoBtn'+def.autoId).on('click',function(){
		$('#container'+def.autoId).fadeOut('fast');
		$('#transcript'+def.autoId).fadeIn('slow');	
		completionActions();
		player.pause();
	});

	$('#transcriptBtn'+def.autoId).on('click',function(){
		$('#container'+def.autoId).fadeIn('slow');
		$('#transcript'+def.autoId).fadeOut('fast');
		if (getAutoPlay()) {
			player.play();
		}
	})

	function isPlayBarDisabled() {
        seekTime = 10;
        if (def.disablePlayBar) {
            seekTime = 0;
        }
        return seekTime;
	}
	
	function getSettingsArray(){
		settings = ['captions', 'quality', 'speed', 'loop'];
		if (def.forceToWatch || def.disablePlayBar) {
			settings = ['captions', 'quality', 'loop'];
		}
		return settings;
	};

    if (def.disablePlayBar) {
		playBar.attr('disabled',true);
	}

};

function pointsUpdatePage(props) {
	var def = {
		"level1_removeObjective": "",
		"level1_addObjective": "",
		"level2_removeObjective": "",
		"level2_addObjective": "",
		"level3_removeObjective": "",
		"level3_addObjective": "",
		"level4_removeObjective": "",
		"level4_addObjective": "",
		"level1_nextPage": "",
		"level2_nextPage": "",
		"level3_nextPage": "",
		"level4_nextPage": "",
		"progressBarColor": "#004C93",
		"level1": "30",
		"level2": "60",
		"level3": "90",
		"passMark": "80",
		"quizID": "",
		"setObjective": "",
		"displayProgress": "Y",
		"score" : "Score: ",
		"srMessage": "",
		"level1_img": "",
		"level2_img": "",
		"level3_img": "",
		"level4_img": "",
		"displayIMG": "Y",
		"trackObjective": "N",
		"level1_addElement": "",
		"level2_addElement": "",
		"level3_addElement": "",
		"level4_addElement": "",
		"level1_setScore": "N",
		"level2_setScore": "N",
		"level3_setScore": "N",
		"level4_setScore": "N",
		"level1_setCompletion": "N",
		"level2_setCompletion": "N",
		"level3_setCompletion": "N",
		"level4_setCompletion": "N"
	}
	var prop;
	for (prop in props) {
		def[prop] = props[prop];
	};
    var pointsLevel1 = def.level1;
    var pointsLevel2 = def.level2;
    var pointsLevel3 = def.level3;

	var scoreContainer = $('.pointsUpdate-MCQscore');
	var srMessage = $('.pointsUpdate-sr-message');
	var messages = $('.pointsUpdate-messages_container');
	var starImg = $('.pointsUpdate-starContainer');
	var scoreMessage;

	if (def.displayProgress == "N" && def.displayIMG == "N") {
		messages.css('width','100%').css('padding','0');
	} else if (def.displayProgress == "N") {
		starImg.css('width','15%');
	} else if (def.displayIMG == "N") {
		messages.css('width','75%');
	}

	function getScore(sections) {
		var sectionArray = sections.split(",");
		var sectionsArrayLen = sectionArray.length;
		var total = 0;
		var maxPoints = 0;
		for (var i = 0; i < sectionsArrayLen; i++) {
		  var mcqPointsList = getDataValue("mcqtracking-" + sectionArray[i]);
		  if (mcqPointsList != "") {
			var mcqPointsArray = mcqPointsList.split(",");
			for (var j = 0; j < mcqPointsArray.length; j = j + 1) {
			  total = total + Number(mcqPointsArray[j].split(":")[1]);
			  maxPoints = maxPoints + Number(mcqPointsArray[j].split(":")[4]);
			}
		  }
		}
		var scoreObj = {};
		scoreObj.raw = total;
		scoreObj.max = maxPoints;
		scoreObj.scaled = Math.round((100 * total) / maxPoints);
		return scoreObj;
	  }

	var score = getScore(def.quizID).scaled;

	function completionActions(args) {
		var level = $('#level'+args.levelNo);
		level.css('display','block');
		addImg(args.imgs);
		toggleNextPage(args.nextPage);
		addAndRemoveFunction(args.addObjective, args.removeObjective);
		addAndRemoveFunction(args.addElement, "", "element");
		if (args.setScoreVal === 'Y') {
			setScore(score);
		}
		if (args.setCompletion === 'Y') {
			setCompletionStatus();
			updateTracking();
		}
		forceCommit();
	};
	
	function addImg(imgArr) {
		var i;
		var imageArrLen = imgArr.length;
		var index;
		for (i = imageArrLen - 1; i >= 0; i--) {
			(function (i) {
				index = i + 1;
				setTimeout(function () {
					$('img.pointsUpdate-starImage').attr('src', imgArr[i]);	
				}, 2700 / index);
			})(i);
		};
	};
	
	if (def.setObjective !== "") {
		var status;
		if (score >= def.passMark) {
		status = "passed";
		} else {
		status = "failed";
		}
	setObjective(def.setObjective, score, status);
	}

	if (def.score.includes('[percentage]')) {
		scoreMessage = def.score.replace('[percentage]', score);
	} else if (def.score.includes('[points]') || def.score.includes('[maxPoints]')) {
		scoreMessage = def.score.replace('[points]', getScore(def.quizID).raw).replace('[maxPoints]',getScore(def.quizID).max);
	} else {
		scoreMessage = def.score + getScore(def.quizID).raw + "/" + getScore(def.quizID).max;
	}
	
	$(".pointsUpdate-pbbar").animate({"height":Math.round(100*getScore(def.quizID).raw/getScore(def.quizID).max) +"%","background-color":"#"+def.progressBarColor},3000);
	scoreContainer.text(scoreMessage);
	srMessage.text(getScore(def.quizID).raw + "/" + getScore(def.quizID).max + def.srMessage);

	if (score < pointsLevel1) {
		var args = {
			"levelNo": 1,
			"nextPage": def.level1_nextPage,
			"addObjective": def.level1_addObjective,
			"removeObjective": def.level1_removeObjective,
			"addElement": def.level1_addElement,
			"setScoreVal": def.level1_setScore,
			"setCompletion": def.level1_setCompletion,
			"imgs": [def.level1_img]
		};
		completionActions(args);		
	}
	else if (score < pointsLevel2) {
		var args = {
			"levelNo": 2,
			"nextPage": def.level2_nextPage,
			"addObjective": def.level2_addObjective,
			"removeObjective": def.level2_removeObjective,
			"addElement": def.level2_addElement,
			"setScoreVal": def.level2_setScore,
			"setCompletion": def.level2_setCompletion,
			"imgs": [def.level2_img,def.level1_img]
		};
		completionActions(args);	
	} else if (score < pointsLevel3) {
		var args = {
			"levelNo": 3,
			"nextPage": def.level3_nextPage,
			"addObjective": def.level3_addObjective,
			"removeObjective": def.level3_removeObjective,
			"addElement": def.level3_addElement,
			"setScoreVal": def.level3_setScore,
			"setCompletion": def.level3_setCompletion,
			"imgs": [def.level3_img,def.level2_img,def.level1_img]
		};
		completionActions(args);
	} else {
		var args = {
			"levelNo": 4,
			"nextPage": def.level4_nextPage,
			"addObjective": def.level4_addObjective,
			"removeObjective": def.level4_removeObjective,
			"addElement": def.level4_addElement,
			"setScoreVal": def.level4_setScore,
			"setCompletion": def.level4_setCompletion,
			"imgs": [def.level4_img, def.level3_img, def.level2_img, def.level1_img]
		};
		completionActions(args);
	}
	updatePathAndProgress(true);
};

function processPageActions(props) {
	var def = {
		"hideProgressBar": "N",
		"hideMenu": "N",
		"resetBookmark": ""
	};
	var menu = $("#menu-btn");
	var progresBar = $("#scr_progress_outer");
	var scrollingSkinProgress = $("#scrollNavProgress");
	var scrollingSkinNotProgress = $("#scrollNavNotProgress")
	var prop;
	for (prop in props) {
		def[prop] = props[prop];
	};
	
	function setProgressAndBookmark() {
		if (def.resetBookmark !== "" && getPageNumberById(def.resetBookmark) !== 0) {
			setProgressById(def.resetBookmark);
			setBookmarkById(def.resetBookmark);
		} 
	};

	$(document).ready(function () {
		if (def.hideProgressBar == "Y") {
			$(progresBar).css("visibility", "hidden");
			if (isScrollingSkin()) {
				$(scrollingSkinProgress).css("visibility", "hidden");
				$(scrollingSkinNotProgress).css("visibility", "hidden");
			}
		}
		if (def.hideMenu == "Y") {
			$(menu).css("visibility", "hidden");
		}
		setProgressAndBookmark();
	})
};

function buttonElement(props) {
	var def = {
		"autoId":"",
		"removeElement":"",
		"addElement":"",
		"addObjective":"",
		"removeObjective":"",
		"nextPage":"",
		"gotoPage":"",
		"setDataVal":"",
		"setDataVariable":"",
		"pdfElement":"",
		"focusOn":"",
		"elemDelay":"0",
		"nextPageDelay":"0",
		"preserve":"no",
		"disable":"no",
		"markAsCompleted":"no",
		"scrollTo":"no",
		"popUp":"no",
		"popUp_title":"Are you sure?",
		"popUp_body":"BODY TEXT",
		"popUp_option1": "OK",
		"popUp_option2": "Cancel",
		"entry": "0",
		"imgSrc": "",
		"imgUpload": "",
		"popUpWidth": "50",
		"controlsPosition": "right",
		"classNameClicked": "",
		"closeModule": "no"
	};
	
	var prop;
	for (prop in props) {
		def[prop] = props[prop];
	};
	
	var button = document.getElementById("button" + def.autoId);
	var thisButtonID = "thisElem";
	var removeElements = def.removeElement;
	var shouldBeRemoved = def.removeElement.includes(thisButtonID);
	var clickedOn = getDataValue("btn-"+def.autoId);
	var buttonElem = $("#elem_" + def.autoId);
	var preserveOptions = def.preserve == "yes";
	var markModuleAsCompleted = def.markAsCompleted == "yes";
	var scrollToNextCheck = (mod_nav_layout == "scrolling" && def.scrollTo == "yes");
	var isImg = (def.imgSrc !== "") || (def.imgUpload !== "");
	var imgId = document.getElementById("img" + def.autoId);
	var scrollToNextCheck = (isScrollingSkin() && def.scrollTo == "yes");
	var closeModuleOnClick = def.closeModule == "yes";
	
	if (clickedOn == "yes") {
			completionActions();
			toggleNextPage(def.nextPage);
			addAndRemoveFunction(def.addElement, removeElements, "element", def.entry);
	}

	button.onclick = function () {
		if (def.popUp == 'yes') {
			SKILLCASTAPI.confirmPopup(def.autoId, def.popUp_title, def.popUp_body, def.popUp_option1, def.popUp_option2, completionFunctions, def.popUpWidth, def.controlsPosition);
		} else {
			completionFunctions();
		}
	}
	
	function completionFunctions() {
		if (preserveOptions) {
			setDataValue("btn-"+def.autoId, "yes");
		}
		addAndRemoveFunction(def.addObjective, def.removeObjective);
		updatePathAndProgress(true);
		toggleGotoPage(def.gotoPage);
		SKILLCASTAPI.focusElement(def.focusOn);
		if (def.setDataVariable.length && def.setDataVal.length) {
			setDataValue(def.setDataVariable, def.setDataVal);
		}
		if (def.pdfElement !== "") {
			getPdf(def.pdfElement);
		}
		setTimeout(function () {
			toggleNextPage(def.nextPage);
		}, def.nextPageDelay);
		setTimeout(function () {
			addAndRemoveFunction(def.addElement, removeElements, "element", def.entry);
		}, def.elemDelay);
		completionActions();

		if (scrollToNextCheck) {
			SKILLCASTSCROLLINGAPI.nextSectionCheck();
		}
		if (markModuleAsCompleted) {
			setCompletionStatus();
			updateTracking();
			forceCommit();
		}
		if (closeModuleOnClick) {
			closeModule();
		}
	}

 	function completionActions() {
		$(button).addClass(def.classNameClicked);
		if (shouldBeRemoved == true) {
			removeElements = def.removeElement.replace(thisButtonID, "");
			setTimeout(function(){
				buttonElem.remove();
			},def.elemDelay);
		}
		if (def.disable == "yes") {
			$(button).prop('disabled',true).css('cursor','not-allowed');
			if (isImg) {
				$(imgId).css('opacity','0.8');
			} else {
				$(button).css('background-color','rgba(0,0,0,0.2)');
			}
		}
	}
};

function getPdf(elem) {
	var element = SKILLCASTAPI.elementLookUp(elem);
	var htmlContent = encodeURIComponent(document.querySelector(element.selector).innerHTML);
	var pdfheader = encodeURIComponent(SKILLCASTAPI.getUserInfo().name);
	var d = new Date();
	var pdffooter = encodeURIComponent(d.toLocaleDateString());
	var xhr = new XMLHttpRequest();
	xhr.open("POST", self.scormApi.scr_getAjaxUrl() + Math.random() + "&targetService=moduleServices&targetMethod=createPdfDownload", true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var jsonObj = JSON.parse(xhr.responseText);
			if (jsonObj.ERROR == 0) {
				self.location = jsonObj.TEMPFILEURL;
			}
		}
	}
	xhr.send("html=" + htmlContent + "&pdfheader=" + pdfheader + "&pdffooter=" + pdffooter);
};

function textInputElement(props) {
	var autoId = props.autoId !== undefined && props.autoId.length
		? props.autoId : "";
	var removeElement = props.removeElement !== undefined && props.removeElement.length
		? props.removeElement : "";
	var addElement = props.addElement !== undefined && props.addElement.length
		? props.addElement : "";
	var nextPage = props.nextPage !== undefined && props.nextPage.length
		? props.nextPage : "";
	var gotoPage = props.gotoPage !== undefined && props.gotoPage.length
		? props.gotoPage : "";
	var questionId = props.questionId !== undefined && props.questionId.length
		? props.questionId : "";
	var showSubmitButton = props.showSubmitButton !== undefined && props.showSubmitButton.length
		? props.showSubmitButton : "yes";
	var index = 0;
	var textArea = document.getElementById("textArea-" + autoId);
	var questionCompleted;
	var submitBtn = document.getElementById("submitBtn-" + autoId);
	var detailId = questionId + "-detail";
	var detailValue = getDataValue(detailId);

	textArea.value = detailValue;
	textArea.onblur = function () {
		setDataValue(questionId, index);
		setDataValue(detailId, this.value);
	};

	if (showSubmitButton === "yes") {
		if (detailValue.length > 0) {
			completionActions();
		}
	
		function completionActions() {
			addAndRemoveFunction(addElement, removeElement, "element");
			toggleNextPage(nextPage);
			submitBtn.style.display = "none";
		}
	
		textArea.onfocus = function () {
			submitBtn.style.display = "block";
		};
	
		submitBtn.onclick = function () {
			var textAreaVal = textArea.value;
			questionCompleted = textAreaVal.length > 0 ? true : false;
			if (questionCompleted) {
				completionActions();
				toggleGotoPage(gotoPage);
			}
		}
	} 
};

function fileUploadElement(props) {

	var def = {
		"autoId":"",
		"removeElement":"",
		"addElement":"",
		"nextPage":"",
		"gotoPage":"",
		"questionId":"",
		"showSubmitButton":"yes"
	};
	var prop;
	for (prop in props) {
		def[prop] = props[prop];
	};

	var fileUploadElement = document.querySelector("#fileUploadElement" + def.autoId);
		fileUploadElement.style.padding = "1em 0.5em";
	var uploadForm = document.createElement("form");
	var openDeleteFileForm = document.createElement("form");
	var submitBtn = document.getElementById("submitBtn-" + def.autoId);
	var index = 0;
	var fileVal = getDataValue(def.questionId + "-fileUpload");

	fileUploadElement.appendChild(uploadForm);
	fileUploadElement.appendChild(openDeleteFileForm);

	if (fileVal == "") {
		fileUploadElement.appendChild(uploadForm);
		uploadForm.appendChild(createFileUploadForm(uplodeFileCallback));

	} else {
		fileUploadElement.appendChild(openDeleteFileForm);
		openDeleteFileForm.appendChild(createOpenFileForm(fileVal));
		openDeleteFileForm.appendChild(createDeleteFileForm(fileVal, deleteFileCallback));
	}	

	function uplodeFileCallback(file) {
		$(openDeleteFileForm).empty();
		setDataValue(def.questionId, index);
		setDataValue(def.questionId + "-fileUpload", file);
		openDeleteFileForm.appendChild(createOpenFileForm(file));
		openDeleteFileForm.appendChild(createDeleteFileForm(file,deleteFileCallback))
		openDeleteFileForm.style.display = "block";
		uploadForm.style.display = "none";
	};

	function deleteFileCallback() {
		$(uploadForm).empty();
		removeDataValue(def.questionId + "-fileUpload");
		openDeleteFileForm.style.display = "none";
		uploadForm.style.display = "block";
		uploadForm.appendChild(createFileUploadForm(uplodeFileCallback));
		if (def.showSubmitButton === "yes") {
			submitBtn.style.display = "block";
		}
	}
	
	if (def.showSubmitButton === "yes") {
		if (fileVal.length > 0) {
			completionActions();
		}
	
		function completionActions() {
			addAndRemoveFunction(def.addElement, def.removeElement, "element");
			toggleNextPage(def.nextPage);
			submitBtn.style.display = "none";
		}
	
		submitBtn.onclick = function () {
			if (getDataValue(def.questionId + "-fileUpload") !== "") {
				completionActions();
				toggleGotoPage(def.gotoPage);
			}
		}
	} 
}

function createFileUploadForm(callback) {
	var createUploadForm = document.createElement("form");
	var fileInput = document.createElement("input");
	var fileUploadBtn = document.createElement("input");
	fileInput.style.padding = "1em 0";
	fileInput.type = "file";
	fileInput.name = "newFile";
	fileInput.style.width = "100%";
	fileUploadBtn.type = "button";
	fileUploadBtn.value = "Upload";
	fileUploadBtn.onclick = function () {
		if (fileInput.value !== "") {
		var formData = new FormData(createUploadForm);
		formData.append("targetService", "regTech");
		formData.append("targetMethod", "addFileJSON");
		var xhr = new XMLHttpRequest();
		xhr.open("POST", scormApi.scr_getAjaxUrl() + Math.random(), true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var isFunction = (callback !== undefined) && (typeof callback == 'function') ? true : false;
				var data = JSON.parse(xhr.responseText);
				var fileId = data.fileId;
				if (isFunction) {
					callback(fileId);
				}
			}
		};
		xhr.send(formData);
		}
	}
	createUploadForm.appendChild(fileInput);
	createUploadForm.appendChild(fileUploadBtn);
	return createUploadForm;
};	

function createOpenFileForm(file,callback) {
	var previewBtn = document.createElement("input");
	var openFileForm = document.createElement("form");
	openFileForm.style.display = "inline-block";
	previewBtn.type = "button";
	previewBtn.value = "Open";
	previewBtn.onclick = function () {
		var formData = new FormData(openFileForm);
		formData.append("targetService", "regTech");
		formData.append("targetMethod", "getFileJSON");
		formData.append("fileId", file);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", scormApi.scr_getAjaxUrl() + Math.random(), true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var isFunction = (callback !== undefined) && (typeof callback == 'function') ? true : false;
				var data = JSON.parse(xhr.responseText);
				location.href = data;
				if (isFunction) {
					callback();
				}
			}
		};
		xhr.send(formData);
	}
	openFileForm.appendChild(previewBtn);
	return openFileForm;
};

function createDeleteFileForm(file,callback) {
	var deleteBtn = document.createElement("input");
	var deleteForm = document.createElement("form");
	deleteForm.style.display = "inline-block";
	deleteBtn.type = "button";
	deleteBtn.value = "Delete";
	deleteBtn.onclick = function () {
		var formData = new FormData(deleteForm);
		formData.append("targetService", "regTech");
		formData.append("targetMethod", "deleteFileJSON");
		formData.append("fileId", file);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", scormApi.scr_getAjaxUrl() + Math.random(), true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var isFunction = (callback !== undefined) && (typeof callback == 'function') ? true : false;
				if (isFunction) {
					callback();
				}
			}
		};
		xhr.send(formData);
	}
	deleteForm.appendChild(deleteBtn);
	return deleteForm;
};

function toggleNextPage(nextPageVal) {
	var surveyCompleted = getSurveyPageStatus(thisPageNo).completed;
	var pageHasQuestions = getPageInfo().questions.length > 0;

	if (nextPageVal === "hide") {
		SKILLCASTAPI.hideNext();
	} else {
		if (nextPageVal === "next") {
			nextPage = function () {
				SKILLCASTAPI.gotoPage(nextPageNo + 1);
			};
		} else if (nextPageVal !== "") {
			nextPage = function () {
				SKILLCASTAPI.gotoPageId(nextPageVal);
			};
		}
		if (nextPageVal !== "" || (pageHasQuestions && surveyCompleted)) {
			SKILLCASTAPI.showNext();
		} 
	}
};

function addAndRemoveFunction (addVal, removeVal, type, entry) {
	var j;
	var addArray = [];
	var removeArray = [];
	var addArrayLength = 0;
	var removeArrayLength = 0;
	var removeFn = (type === 'element') ? removeElement : removeObjective;
	var addFn = (type === 'element') ? addElement : addObjective;
	var entryEffect = (entry == undefined) ? "0" : entry;
	
	if(addVal.length > 0) {
		addArray = addVal.toString().split(",");
		addArrayLength = addArray.length;
		for (j = 0; j < addArrayLength; j++) {
			addFn(addArray[j],entryEffect);
		}
	}
	if(removeVal.length > 0) {
		removeArray = removeVal.toString().split(",");
		removeArrayLength = removeArray.length;
		for (j = 0; j < removeArrayLength; j++) {
			removeFn(removeArray[j]);
		}
	}
};
function toggleGotoPage (gotoPageVal) {
	if (gotoPageVal === "next") {
		SKILLCASTAPI.gotoPage(nextPageNo + 1);
	} else {
		if (gotoPageVal !== "") {
		SKILLCASTAPI.gotoPageId(gotoPageVal);
		}
	}
};

function createSurveyQuestion(definition, clicked, submitBtnClicked) {
	var def = {
		"inputType": "button",
		"optionContainerClass": "",
		"questionClass": "",
		"optionClass": "surveybutton",
		"optionSelectedClass": "surveybutton-selected",
		"confirmClass": "narrative",
		"detailClass": "narrative",
		"detailInputClass": "narrative",
		"detailButtonClass": "surveybutton"
	};
	for (var key in definition) {
		def[key] = definition[key];
	};
	var elem = document.getElementById(def.container);
	var questionId = def.id;
	var confirmId = questionId + "-confirm";
	var detailId = questionId + "-detail";
	var optionSelected = getDataValue(questionId);
	var optionHasBeenSelected = (optionSelected !== "");
	var optionConfirm = getDataValue(confirmId);
	var selectedOptionObj = (optionHasBeenSelected) ? def.options[optionSelected] : {};
	var detailQuestion = "";
	var detailQuestionRequired = false;
	var detailQuestionCompleted = false;
	var fileUploadQuestionRequired = false;
	var fileUploadQuestionCompleted = false;
	var questionElem = document.createElement("div");
	var optionCount = def.options.length;
	var optionElem;
	var detailElem;
	var detailValue = getDataValue(detailId);
	var detailInputTextarea;
	var detailButton;
	var fileUploadQuestion = "";
	var fileVal = getDataValue(questionId + "-fileUpload");
	var fileUploadElem;
	var openDeleteFileForm = document.createElement("div");
	var uploadForm = document.createElement("div");
	var optionClassname; 

	var toggleOptions = function (option, index, optionConfirm, questionId, confirmId) {
		if (option.options[index].confirm.length > 0 && optionConfirm === "") {
			removeDataValue(questionId);
			setDataValue(confirmId, index);
		} else {
			setDataValue(questionId, index);
			removeDataValue(confirmId);
		}
	};
	var removeCoverDiv = function() {
		$(elem).css('z-index','0').css('background-color','transparent');
		$(".coverDiv").remove();
	};
	var addCoverDiv = function() {
		if (!$('.coverDiv').length)  {
			$("<div></div>").addClass("coverDiv").insertAfter($('#contentinner'));
			setTimeout(function(){
				$(elem).css('position','relative').css('z-index','1001').css('background-color','#ffffff');
			},0)
		}	
	};
	
	function deleteFileCallback() {
		fileUploadQuestionCompleted = false;
		removeDataValue(questionId + "-fileUpload");
		$(uploadForm).empty();
		uploadForm.appendChild(createFileUploadForm(uploadFileCallback));
		openDeleteFileForm.style.display = "none";
		uploadForm.style.display = "block";
		fileUploadElem.tabIndex = "-1";
		$(fileUploadElem).focus();
		addCoverDiv();
	};

	function uploadFileCallback(file) {
		fileUploadQuestionCompleted = true;
		setDataValue(questionId + "-fileUpload", file);
		$(openDeleteFileForm).empty();
		openDeleteFileForm.appendChild(createOpenFileForm(file));
		openDeleteFileForm.appendChild(createDeleteFileForm(file,deleteFileCallback));
		openDeleteFileForm.style.display = "block";
		uploadForm.style.display = "none";
		if (!detailQuestionRequired || detailQuestionCompleted && fileUploadQuestionCompleted) {
			removeCoverDiv();
			completionActions();
		}
	};

	function completionActions() { 
		if (def.hasOwnProperty("completionFunction")) {
			def.completionFunction(optionSelected, clicked, detailValue, submitBtnClicked, def.container);
		}
		if (selectedOptionObj.hasOwnProperty("addElement") && selectedOptionObj.hasOwnProperty("removeElement")) {
			addAndRemoveFunction(selectedOptionObj.addElement, selectedOptionObj.removeElement, "element");
		}
		if (selectedOptionObj.hasOwnProperty("nextPage")) {
			toggleNextPage(selectedOptionObj.nextPage);
		}
		if (clicked) {
			if (selectedOptionObj.hasOwnProperty("addObjective") && selectedOptionObj.hasOwnProperty("removeObjective") && selectedOptionObj.addObjective.length + selectedOptionObj.removeObjective.length > 0) {
				addAndRemoveFunction(selectedOptionObj.addObjective, selectedOptionObj.removeObjective);
				createCustomPath();
				clearProgressBar();
				renderProgressBar();
				renderHBmenu();
			}
			if (selectedOptionObj.hasOwnProperty("setDataVariable") && selectedOptionObj.hasOwnProperty("setDataValue") && selectedOptionObj.setDataVariable !== "") {
				setDataValue(selectedOptionObj.setDataVariable, selectedOptionObj.setDataValue);
			}
			if(!detailQuestionRequired || submitBtnClicked) {
				if (selectedOptionObj.hasOwnProperty("gotoPage") && selectedOptionObj.gotoPage !== "") {
					toggleGotoPage(selectedOptionObj.gotoPage);
				}
			}
		}
	};
	if (detailQuestionRequired && fileUploadQuestionRequired) {
		if (detailQuestionCompleted && fileUploadQuestionCompleted) {
			removeCoverDiv();
		}
	} else {
		removeCoverDiv();
	}
	elem.innerHTML = "";
	questionElem.className = def.questionClass;
	questionElem.innerHTML = def.question;
	elem.appendChild(questionElem);
	if (def.inputType === "select") {
		var optionContainer = document.createElement("div");
		optionContainer.className = def.optionContainerClass;
		var selectElem = document.createElement("select");
		selectElem.id = "select" + questionId;
		if (optionSelected === "") {
			optionElem = document.createElement("option");
			optionElem.value = "";
			optionElem.innerHTML = "";
			selectElem.appendChild(optionElem);
		}
		for (var i = 0; i < optionCount; i++) {
			optionElem = document.createElement("option");
			optionElem.value = i;
			optionElem.innerHTML = def.options[i].content;
			if (optionHasBeenSelected && i == optionSelected) {
				optionElem.selected = true;
				if (def.options[i].detail.length > 0) {
					detailQuestion = def.options[i].detail;
				}
			}
			selectElem.appendChild(optionElem);
		}
		selectElem.onchange = (function (def, questionId) {
			return function () {
				var select = document.getElementById("select" + questionId);
				var selectValue = select.options[select.selectedIndex].value;
				setDataValue(questionId, selectValue);
				createSurveyQuestion(definition = def, clicked = true, submitBtnClicked = false);
			};
		}(def, questionId));
		optionContainer.appendChild(selectElem);
		elem.appendChild(optionContainer);
	} else { 
		if (optionConfirm !== "") {
			var confirmElem = document.createElement("div");
			confirmElem.className = def.confirmClass;
			confirmElem.innerHTML = def.options[optionConfirm].confirm;
			elem.appendChild(confirmElem);
			addCoverDiv();			
		};
		for (var i = 0; i < optionCount; i++) {
			optionClassname = (def.options[i].optionClass !== '') & (def.options[i].optionClass !== undefined) ? def.options[i].optionClass : def.optionClass;
			optionClassSelected = (def.options[i].selectedClass !== '') & (def.options[i].selectedClass !== undefined) ? def.options[i].selectedClass : def.optionSelectedClass;
			var optionContainer = document.createElement("div");
			optionContainer.className = def.optionContainerClass;
			var optionElem = document.createElement("button");
			optionElem.setAttribute("data-function", "Survey Button");
			optionElem.style.color = "#" + def.options[i].optionColor;

			if (optionHasBeenSelected && i == optionSelected) {
				optionElem.className = optionClassSelected;
				if (def.options[i].detail.length > 0) {
					detailQuestion = def.options[i].detail;
				}
				if (def.options[i].hasOwnProperty("fileUpload") && def.options[i].fileUpload.length > 0) {
					fileUploadQuestion = def.options[i].fileUpload;
				}
			} else {
				optionElem.className = optionClassname;
				optionElem.onclick = (function (def, i, questionId, confirmId, optionConfirm) {
					return function () {
						toggleOptions(def, i, optionConfirm, questionId, confirmId);
						createSurveyQuestion(definition = def, clicked = true, submitBtnClicked = false);
					};
				}(def, i, questionId, confirmId, optionConfirm));
			};
			optionElem.innerHTML = def.options[i].content;
			optionContainer.appendChild(optionElem);
			elem.appendChild(optionContainer);
		};
	}
	if (optionHasBeenSelected) {
		selectedOptionObj = def.options[optionSelected];
		if (detailQuestion !== "") {
			detailQuestionRequired = true;
			detailElem = document.createElement("div");
			detailInputTextarea = document.createElement("textarea");
			detailElem.className = def.detailClass;
			detailElem.innerHTML = detailQuestion;
			detailButton = document.createElement("button");
			detailButton.setAttribute("data-function", "Survey Detail Button")
			detailButton.className = optionClassname;
			detailButton.innerText = def.detailButtonText;
			detailButton.onclick = (function (def, i) {
				return function () {
					createSurveyQuestion(definition = def, clicked = true, submitBtnClicked = true);
				};
			}(def, i));
			detailInputTextarea.setAttribute("data-function", "Survey Detail Text");
			detailInputTextarea.rows = 5;
			detailInputTextarea.style.width = "100%";
			detailInputTextarea.wrap = "soft";
			detailInputTextarea.value = detailValue;
			detailInputTextarea.onblur = function () {
				setDataValue(detailId, this.value);
			};
			detailInputTextarea.onfocus = function () {
				detailButton.style.display = "inline";
			};
			var detailInputElem = document.createElement("div");
			detailInputElem.className = def.detailInputClass;
			detailInputElem.appendChild(detailInputTextarea);
			elem.appendChild(detailElem);
			elem.appendChild(detailInputElem);
			elem.appendChild(detailButton);
			if (detailValue !== "") {
				detailQuestionCompleted = true;
				detailButton.style.display = "none";
			} else {
				addCoverDiv();
				detailElem.tabIndex = "-1";
				$(detailElem).focus();
			};
		} 
		 if (fileUploadQuestion !== "") {
			fileUploadQuestionRequired = true;
			fileUploadElem = document.createElement("div");
			fileUploadElem.className = def.detailClass;
			fileUploadElem.innerHTML = fileUploadQuestion;
			fileUploadElem.appendChild(uploadForm);
			fileUploadElem.appendChild(openDeleteFileForm);
			uploadForm.appendChild(createFileUploadForm(uploadFileCallback));
			if (fileVal != "") {
				fileUploadQuestionCompleted = true;
				uploadForm.style.display = "none";
				openDeleteFileForm.appendChild(createOpenFileForm(fileVal))
				openDeleteFileForm.appendChild(createDeleteFileForm(fileVal,deleteFileCallback))
			} else {
				addCoverDiv();
				fileUploadElem.tabIndex = "-1";
				$(fileUploadElem).focus();
			}
			elem.appendChild(fileUploadElem);
		}
		if ((!detailQuestionRequired && !fileUploadQuestionRequired) ||
			(detailQuestionCompleted && fileUploadQuestionCompleted) ||
			(detailQuestionCompleted && !fileUploadQuestionRequired) ||
			(fileUploadQuestionCompleted && !detailQuestionRequired)) {
			completionActions();
		}
	}
};
function openPolicy(scoId, launchMode) {
	$.ajax({
		type: "POST",
		url: scormApi.scr_getAjaxUrl() + Math.random(),
		data: {
			"targetService": "moduleServices",
			"targetMethod": "getPolicyLaunchUrl",
			"scoId": scoId,
			"launchMode": launchMode
		},
		success: function (data) {
			try {
				var response = JSON.parse(data);
			} catch (e) {
				var response = { "error": 1 };
			}
			if (response.error == 0) {
				var openPolicyURL = response.url + "&lang=" + scr_lang;
				var openPolicyTarget = "scormPolicy_" + scoId;
				var openPolicyForm = $("<form></form>")
					.prop("method", "POST")
					.prop("action", openPolicyURL)
					.prop("target", openPolicyTarget)
					.hide();
				$("body").append(openPolicyForm);
				openPolicyForm.submit().remove();
			} else {
				policyWindow.close();
				alert("Unable to open policy");
			}
		},
		error: function (xhr, status, error) {
			policyWindow.close();
			alert("Unable to open policy");
		},
		dataType: "text"
	});
};

// Replaces commonly-used Windows 1252 encoded chars that do not exist in ASCII or ISO-8859-1 with ISO-8859-1 cognates.
var replaceWordChars = function (text) {
	var s = text;
	// smart single quotes and apostrophe
	s = s.replace(/[\u2018\u2019\u201A]/g, "\'");
	// smart double quotes
	s = s.replace(/[\u201C\u201D\u201E]/g, "\"");
	// ellipsis
	s = s.replace(/\u2026/g, "...");
	// dashes
	s = s.replace(/[\u2013\u2014]/g, "-");
	// circumflex
	s = s.replace(/\u02C6/g, "^");
	// open angle bracket
	s = s.replace(/\u2039/g, "<");
	// close angle bracket
	s = s.replace(/\u203A/g, ">");
	// spaces
	s = s.replace(/[\u02DC\u00A0]/g, " ");
	//bullets
	s = s.replace(/[•\t]+/g, "*");
	return s;
}

function supportsSvg() {
	var div = document.createElement('div');
	div.innerHTML = '<svg/>';
	return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
};

function validHexCode(hex) {
	var result = portalColorExists(hex) ? hex : null;
	if (result !== null) {
		if (hex.indexOf('#') === -1) {
			result = '#' + hex;
		}
	} else {
		result = 'transparent';
	};
	return result;
}

function portalColorExists(color) {
	return color.replace(/\s/g, '').length > 0;
}

function formatDateAsString(dateObj, mask) {
	var d = dateObj.getDate();
	var m = dateObj.getMonth() + 1;
	var y = dateObj.getFullYear();
	var h = dateObj.getHours();
	var n = dateObj.getMinutes();
	var s = dateObj.getSeconds();
	var dd = ("0" + d).slice(-2);
	var mm = ("0" + m).slice(-2);
	var hh = ("0" + h).slice(-2);
	var nn = ("0" + n).slice(-2);
	var ss = ("0" + s).slice(-2);
	var mmm = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var dateString = "";
	if (mask === "dd/mm/yyyy") {
		dateString += dd + "/" + mm + "/" + y;
	} else if (mask === "dd/mm/yyyy|HH:mm") {
		dateString += dd + "/" + mm + "/" + y + "|" + hh + ":" + nn;
	} else if (mask === "yyyy-mm-dd") {
		dateString += y + "-" + mm + "-" + dd;
	} else if (mask === "mmm d, yyyy") {
		dateString += mmm[m - 1] + " " + d + ", " + y;
	} else if (mask === "dd mmm yyyy") {
		dateString += dd + " " + mmm[m - 1] + " " + y;
	}
	return dateString;
};