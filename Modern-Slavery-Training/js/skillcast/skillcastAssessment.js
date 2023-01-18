function scr_assessment(assessmentId, assessmentElementId, def, settings, aQb, useDocumentReady) {
	var useDocumentOnReady = (typeof useDocumentReady === "boolean") ? useDocumentReady : false;
	var assessmentElement;
	var thisPageContext = SKILLCASTAPI.getPageInfo();
	var showImmediateFeedback = (def.showImmediateFeedback == 1);
	var showLives = (def.showLives >= 1);
	var showObjectives = (def.showObjectives == 1);
	var showPreviousBest = (def.showPreviousBest == 1);
	var totalLives = 0;
	var numberOfLives = (typeof def.numberOfLives === "undefined") ? 0 : Number(def.numberOfLives);
	var loseLifeType = "na";
	var showSummaryFeedback = (typeof def.showSummaryFeedback === "undefined") ? 0 : Number(def.showSummaryFeedback)
	var showPeerComparison = (Number(def.showPeerComparison) === 1);
	var leaderBoardPlaces = (typeof def.leaderBoardPlaces === "undefined") ? 0 : Number(def.leaderBoardPlaces);
	var peerStatsObj = {};
	var showAllFeedback = (def.showAllFeedback == 1);
	var showExplanationInFeedback = (typeof def.showExplanationInFeedback === "undefined") ? 0 : Number(def.showExplanationInFeedback);
	var showSolutionInFeedback = (typeof def.showSolutionInFeedback === "undefined") ? 0 : Number(def.showSolutionInFeedback);
	var scrollToExplanation = (def.scrollToExplanation == 1);
	var exemptOnFail = (def.isPreTest == 1 || def.exemptOnFail == 1);
	var completeOnPass = (def.isPreTest == 1 || def.completeOnPass == 1);
	var removeObjectivePass = (typeof def.removeObjectivePass === "undefined") ? ((def.isPreTest == 1) ? "Assessment" : "") : def.removeObjectivePass;
	var removeObjectiveFail = (typeof def.removeObjectiveFail === "undefined") ? "" : def.removeObjectiveFail;
	var addObjectivePass = (typeof def.addObjectivePass === "undefined") ? "" : def.addObjectivePass;
	var addObjectiveFail = (typeof def.addObjectiveFail === "undefined") ? "" : def.addObjectiveFail;
	var nextButtonPass = (typeof def.nextButtonPass === "undefined") ? "_next" : def.nextButtonPass;
	var nextButtonFail = (typeof def.nextButtonFail === "undefined") ? "" : def.nextButtonFail;
	var showIntroPage = (def.showIntroPage == 1);
	var showSummaryPage = (def.showSummaryPage == 1);
	var dontShowIntroUponRevisiting = (def.hasOwnProperty("dontShowIntroUponRevisiting") && def.dontShowIntroUponRevisiting == 1);
	var coolingOffDays = 0;
	var scoreThresholdArray = [];
	var scoreThresholdArrayLen = 0;
	var retakeAfterPass = (def.retakeAfterPass == 1);
	var setDataVarAny = (def.hasOwnProperty("setDataVarAny")) ? def.setDataVarAny : "";
	var setDataVarPassed = (def.hasOwnProperty("setDataVarPassed")) ? def.setDataVarPassed : "";
	var setDataVarFailed = (def.hasOwnProperty("setDataVarFailed")) ? def.setDataVarFailed : "";
	var setDataValAny = (def.hasOwnProperty("setDataValAny")) ? def.setDataValAny : "";
	var setDataValPassed = (def.hasOwnProperty("setDataValPassed")) ? def.setDataValPassed : "";
	var setDataValFailed = (def.hasOwnProperty("setDataValFailed")) ? def.setDataValFailed : "";
	var removeDataAny = (def.hasOwnProperty("removeDataAny")) ? def.removeDataAny : ""; 
	var removeDataPassed = (def.hasOwnProperty("removeDataPassed")) ? def.removeDataPassed : ""; 
	var removeDataFailed = (def.hasOwnProperty("removeDataFailed")) ? def.removeDataFailed : ""; 
	var groupQuestionBanks = (def.groupQuestionBanks == 1);
	var oneClickResponse = (def.oneClickResponse == 1);
	var hideSubmitButton = (Number(def.hideSubmitButton) === 1);
	var showPoints = (def.showPoints == 1);
	var questionPoints = Number(def.questionPoints);
	var betWonPoints = Number(def.betWonPoints);
	var betLostPoints = Number(def.betLostPoints);
	var passMark = Number(def.passmark);
	var trackBetAsWeight = (def.trackBetAsWeight == 1);
	var trackObjectivesScores = (def.hasOwnProperty("trackObjectivesScores") && def.trackObjectivesScores == 1);
	var trackEachAttempt = (def.hasOwnProperty("trackEachAttempt") && def.trackEachAttempt == 1);
	var pointsHistory = getDataValue(assessmentId + "-points");
	var pointsHistoryArray = (pointsHistory.length > 0) ? pointsHistory.split("!") : [];
	var questionTimeLimit = (def.hasOwnProperty("questionTimeLimit")) ? Number(def.questionTimeLimit) : "";
	var questionStyle = (def.showCards == 1) ? "card" : "plain";
	var isScorm2004 = (scormVersion == "2004");
	var aAss = [];
	var aAssLen = 0;
	var qNo = 0;
	var assessmentStarted = false;
	var gotoSummary = false;
	var useUniqueInteractionId = false;
	var currentQuestionBank = "";
	var question = {};
	var questionContainer;
	var statusBar;
	var questionBankContainer;
	var currentLifeIcon;
	var pointsContainer;
	var questionCardDeck;
	var questionCard;
	var btnTextTimeOut;
	var resizeTimeOut;
	var timerInterval;
	var matchCardTimeOut;
	var objectiveCount = scr_objectives.length;
	var objectiveArray = [];
	var scrollingSkin = (mod_nav_layout == "scrolling");
	var hideMenuButton = (def.hideMenuButton == 1);
	var hideResourcesButton = (def.hideResourcesButton == 1);
	var hideSettingsButton = (def.hideSettingsButton == 1);
	var hideAnyMenu = (hideMenuButton || hideResourcesButton || hideSettingsButton);
	var scormObjectiveName = (typeof def.scormObjectiveName === "undefined") ? 0 : Number(def.scormObjectiveName);
	
	var closeModuleButtonShow = (def.hasOwnProperty("closeModuleButtonShow")) ? def.closeModuleButtonShow : "0";
	var closeModuleButtonClass = (def.hasOwnProperty("closeModuleButtonClass")) ? def.closeModuleButtonClass : "custombtn";
	var closeModuleButtonPosition = (def.hasOwnProperty("closeModuleButtonPosition")) ? def.closeModuleButtonPosition : "4";
	var addCloseModuleButton = (closeModuleButtonShow == "1");
	var closeModuleButtonTag = "[closeButton]";
	var closeModuleButtonInlineReplaced = false;
	
	var remainingTime = questionTimeLimit;
	var timeBasedPoints = (typeof def.timeBasedPoints === "undefined") ? 0 : Number(def.timeBasedPoints);
	var questionTimer = (typeof def.questionTimer === "undefined") ? 0 : Number(def.questionTimer);
	var summaryPercentageScore = (typeof def.summaryPercentageScore === "undefined") ? 0 : Number(def.summaryPercentageScore);
	var scoreTracking = (typeof def.scoreTracking === "undefined") ? 0 : Number(def.scoreTracking);
	var totalScore = 0;
	
	var getCloseButton = function() {
		var $button = $("<button></button>")
			.prop("type","button")
			.addClass(closeModuleButtonClass)
			.html(closeModuleButtonDisplay)
			.on('touchend click', closeButtonAction);
		return $button;
	};
	var getCloseButtonText = function() {
		var buttonText = '<button type="button" class="' + closeModuleButtonClass + '" onClick="closeButtonAction();">' + closeModuleButtonDisplay + '</button>';
		return buttonText;
	};

	var replaceCloseButtonTag = function(message){
		var $button = getCloseButtonText();
		var newMessage = message.replace(closeModuleButtonTag, $button);
		return newMessage;
	};

	var replaceWithCloseButton = function(message){
		var tagFound = (message.indexOf(closeModuleButtonTag) > -1);
		var newMessage = (tagFound) ? replaceCloseButtonTag(message) : message;
		var updateReplacedGlobal = (!closeModuleButtonInlineReplaced && tagFound);
		if(updateReplacedGlobal){
			closeModuleButtonInlineReplaced = tagFound;
		}
		return newMessage;
	};

	var passMessageText  = replaceWithCloseButton(def.pass);
	var failMessageText  = replaceWithCloseButton(def.fail);

	var closeModuleButtonShow = (!closeModuleButtonInlineReplaced && addCloseModuleButton);

	var addCloseButtonToPositionTop = ((closeModuleButtonPosition == "1" || closeModuleButtonPosition == "2" || closeModuleButtonPosition == "3"));
	var addCloseButtonToPositionBottom = ((closeModuleButtonPosition == "4" || closeModuleButtonPosition == "5" || closeModuleButtonPosition == "6"));
	var addCloseButtonToPositionLeft = ((closeModuleButtonPosition == "1" || closeModuleButtonPosition == "4"));
	var addCloseButtonToPositionRight = ((closeModuleButtonPosition == "3" || closeModuleButtonPosition == "6"));

	var appendButton = function(className, content, container){
		var $div = $("<div></div>").addClass(className).html(content);
		$(container).append($div);
	}

	var addCloseButtonToContainer = function(container){
		var $button = getCloseButton();
		var blockClass = (addCloseButtonToPositionLeft) ? "assessment-block-button-left" : (addCloseButtonToPositionRight) ? "assessment-block-button-right" : "assessment-block-button-center";
		var divClass = "assessment-block-button " + blockClass;
		appendButton(divClass, $button, container);
	};

	if (def.hasOwnProperty("coolingOffDays")) {
		coolingOffDays = Number(def.coolingOffDays);
	}

	if (def.hasOwnProperty("scoreThresholds") && def.scoreThresholds.length > 0) {
		scoreThresholdArray = def.scoreThresholds.split(",");
		scoreThresholdArrayLen = scoreThresholdArray.length;
	}

	if (settings.hasOwnProperty("useUniqueInteractionId")) {
		useUniqueInteractionId = settings.useUniqueInteractionId;
	}

	if (showLives) {
		if (def.showLives == 1) {
			loseLifeType = "answer";
		} else {
			loseLifeType = "bet";
		}
	}

	var getRemoveObjectivesObject = function () {
		var removeObjList = getDataValue("removeObjectives"),
		removeObjArray = removeObjList.split(","),
		returnObject = {
			"data": [],
			"length": 0,
			"removed": {}
		},
		removed = {},
		data = [];
		$.each(removeObjArray, function() {
			var key;
			if(this.length > 0){
				key = "_" + this;
				removed[key] = true;
				data.push(this)
			}
		});
		returnObject.data = data;
		returnObject.removed = removed;
		returnObject.length = data.length;
		return returnObject;
	}

	var checkExisting = function () {
		var existing = getDataValue(assessmentId),
		removeObjectivesObject = getRemoveObjectivesObject(),
		setQuestionNo = true,
		questionSplit,
		questionStatus,
		questionNotAnswered,
		notAnsweredCount = 0,
		setQuestionNoNow,
		questionBankIndex,
		questionIndex,
		isValidQuestion,
		isQuestionDefined = function(qbi, qi){
			var questionBankLength = aQb.length,
			questionBankObject, questionBankQuestions, questionBankQuestionsLength;
			if(questionBankLength <= qbi){
				return false; // Question Bank Removed
			}
			questionBankObject = aQb[qbi];
			questionBankQuestions = questionBankObject.questions;
			questionBankQuestionsLength = questionBankQuestions.length
			if(questionBankQuestionsLength <= qi){
				return false; // Question Removed
			}
			return true;
		},
		isObjectiveValid = function(id) {
			var objectiveId = id.trim(),
			checkIdValid = (objectiveId.length > 0),
			removed, key, isRemoved;
			if(!checkIdValid){
				return true; // Has no Objective set
			}
			removed = removeObjectivesObject.removed;
			key = "_" + objectiveId;
			isRemoved = (removed.hasOwnProperty(key));
			return (!isRemoved);
		},
		isQuestionValid = function(qbi, qi){
			var is_question_defined = isQuestionDefined(qbi, qi),
			questionBankObject, questionBankObjectiveId,
			is_question_bank_objective_valid;
			if(!is_question_defined){
				return false; // Question Bank or Question Removed
			}
			questionBankObject = aQb[qbi];
			questionBankObjectiveId = questionBankObject.objectiveId;
			is_question_bank_objective_valid = isObjectiveValid(questionBankObjectiveId);
			if(!is_question_bank_objective_valid){
				return false; // Question Bank Objective Removed
			}
			return true;
		},
		errorCount = 0;
		if (existing.length > 0) {
			aAss = existing.split("!");
			aAssLen = aAss.length;
			for (var j = 0; j < aAssLen; j++) {
				questionSplit = aAss[j].split(",");
				questionBankIndex = questionSplit[0];
				questionIndex = questionSplit[1];
				isValidQuestion = isQuestionValid(questionBankIndex, questionIndex);
				questionStatus = questionSplit[2];
				questionNotAnswered = (questionStatus == 0);
				setQuestionNoNow = (questionNotAnswered && setQuestionNo);
				if (setQuestionNoNow) {
					qNo = j;
					setQuestionNo = false;
				}
				if(questionNotAnswered){
					notAnsweredCount++;
				}
				if(!isValidQuestion){
					errorCount++;
				}
			};
		}
		if(errorCount > 0){
			removeDataValue(assessmentId);
			qNo = 0;
		}
		assessmentStarted = (notAnsweredCount > 0);
	};

	var unlockAssessment = function () {
		var fn;
		if (hideAnyMenu) {
			if (hideMenuButton) {
				fn = (scrollingSkin) ? SKILLCASTSCROLLINGAPI.showMenuButton : SKILLCASTAPI.showMenuButton;
				fn();
			}
			if (hideResourcesButton) {
				fn = (scrollingSkin) ? SKILLCASTSCROLLINGAPI.showResourcesButton : SKILLCASTAPI.showResourcesButton;
				fn();
			}
			if (hideSettingsButton) {
				fn = (scrollingSkin) ? SKILLCASTSCROLLINGAPI.showSettingsButton : SKILLCASTAPI.showSettings;
				fn();
			}
		}
	};

	var lockAssessment = function () {
		var fn;
		checkExisting();
		if(assessmentStarted && hideAnyMenu){
			if(hideMenuButton){
				fn = (scrollingSkin) ? SKILLCASTSCROLLINGAPI.hideMenuButton : SKILLCASTAPI.hideMenuButton;
				fn();
			}
			if(hideResourcesButton){
				fn = (scrollingSkin) ? SKILLCASTSCROLLINGAPI.hideResourcesButton : SKILLCASTAPI.hideResourcesButton;
				fn();
			}
			if(hideSettingsButton){
				fn = (scrollingSkin) ? SKILLCASTSCROLLINGAPI.hideSettingsButton : SKILLCASTAPI.hideSettings;
				fn();
			}
		}
	};

	var removeObjectiveBanks = function () {
		var aQbn = aQb;
		if (objectiveCount > 0) {
			var removeObjList = getDataValue("removeObjectives");
			if (removeObjList.length > 0) {
				var removeObjArray = removeObjList.split(",");
				var removeObjArrayCount = removeObjArray.length;
				var thisObjectiveId = "";
				var keepThisQb = true;
				var qbCountTemp = aQb.length;
				aQbn = [];
				for (var i = 0; i < qbCountTemp; i++) {
					keepThisQb = true;
					thisObjectiveId = aQb[i].objectiveId.trim();
					if (typeof thisObjectiveId !== "undefined" && thisObjectiveId.length > 0) {
						for (var j = 0; j < removeObjArrayCount; j++) {
							if (removeObjArray[j] === thisObjectiveId) {
								keepThisQb = false;
								break;
							}
						};
					}
					if (keepThisQb) {
						aQbn.push(aQb[i]);
					}
				};
			}
		}
		return aQbn;
	};

	var getPermCount = function (arr) {
		var count = 0;
		var arrLen = arr.length;
		for (var i = 0; i < arrLen; i++) {
			count += Number(arr[i].permanent);
		};
		return count;
	};

	var selectQuestionBanks = function (allQuestionBanks) {
		var useQuestionBanks = [];
		var qbCount = allQuestionBanks.length;
		var useQbCount = (def.qbtCount > 0) ? Math.min(def.qbtCount, qbCount) : qbCount;
		var permanentQbCount = getPermCount(allQuestionBanks);
		var randomQbCount = Math.max(0, useQbCount - permanentQbCount);
		var availableQbCount = qbCount - permanentQbCount;
		var thisQbPos = 0;
		for (var i = 0; i < qbCount; i = i + 1) {
			if (allQuestionBanks[i].permanent == 1) {
				if (def.qbSort == 1 && useQuestionBanks.length > 0) {
					thisQbPos = getRandomInt(0, useQuestionBanks.length);
					useQuestionBanks.splice(thisQbPos, 0, allQuestionBanks[i]);
				} else {
					useQuestionBanks.push(allQuestionBanks[i]);
				}
			} else if (randomQbCount > 0) {
				if (getRandomInt(1, availableQbCount) <= randomQbCount) {
					if (def.qbSort == 1 && useQuestionBanks.length > 0) {
						thisQbPos = getRandomInt(0, useQuestionBanks.length);
						useQuestionBanks.splice(thisQbPos, 0, allQuestionBanks[i]);
					} else {
						useQuestionBanks.push(allQuestionBanks[i]);
					}
					randomQbCount--;
				}
				availableQbCount--;
			}
		};
		return useQuestionBanks;
	};

	var selectQuestions = function (useQuestionBanks) {
		var assessmentArray = [];
		var questionIndexArray = [];
		var permanentQuestionCount = 0;
		var totalQuestionCount = 0;
		var randomQuestionCount = 0;
		var availableQuestionCount = 0;
		var i = 0;
		var j = 0;
		var bank = {};
		var bankQuestions = [];
		var bankStartPos = 0;
		var useQuestionBanksLength = useQuestionBanks.length;
		for (i = 0; i < useQuestionBanksLength; i++) {
			bank = useQuestionBanks[i];
			bankQuestions = bank.questions;
			bankStartPos = assessmentArray.length;
			totalQuestionCount = bankQuestions.length;
			useQuestionCount = (bank.count == 0) ? totalQuestionCount : Math.min(bank.count, totalQuestionCount);
			questionIndexArray = [];
			for (j = 0; j < useQuestionCount; j++) {
				questionIndexArray.push(j);
			}
			permanentQuestionCount = getPermCount(bankQuestions);
			randomQuestionCount = Math.max(0, useQuestionCount - permanentQuestionCount);
			availableQuestionCount = totalQuestionCount - permanentQuestionCount;
			for (j = 0; j < totalQuestionCount; j++) {
				assessmentArrayItem = (bank.seqNo - 1) + "," + (bankQuestions[j].seqNo - 1) + ",0";
				if (groupQuestionBanks) {
					thisQPos = getRandomInt(bankStartPos, assessmentArray.length);
				} else {
					thisQPos = getRandomInt(0, assessmentArray.length);
				}
				if (bankQuestions[j].permanent == 1) {
					if (bank.sort == 1 && thisQPos < assessmentArray.length) {
						assessmentArray.splice(thisQPos, 0, assessmentArrayItem);
					} else {
						assessmentArray.push(assessmentArrayItem);
					}
				} else if (randomQuestionCount > 0) {
					if (getRandomInt(1, availableQuestionCount) <= randomQuestionCount) {
						if (bank.sort == 1 && thisQPos < assessmentArray.length) {
							assessmentArray.splice(thisQPos, 0, assessmentArrayItem);
						} else {
							assessmentArray.push(assessmentArrayItem);
						}
						randomQuestionCount--;
					}
					availableQuestionCount--;
				}
			};
		};
		return assessmentArray;
	};

	var getLives = function () {
		var livesLost = 0;
		var livesRemaining = totalLives;
		var i = 0;
		var aAssItem = [];
		for (i = 0; i < aAssLen; i++) {
			aAssItem = aAss[i].split(",");
			if (aAssItem[2] == 1) {
				if (loseLifeType === "answer" || (aAssItem.length >= 5 && aAssItem[4] == 1)) {
					livesLost++;
					livesRemaining--;
				}
			}
		}
		return {
			"total": totalLives,
			"lost": livesLost,
			"remaining": livesRemaining
		}
	};

	

	var assessmentStatus = function () {
		var answered = 0;
		var i = 0;
		var aAssItem = [];
		for (i = 0; i < aAssLen; i++) {
			aAssItem = aAss[i].split(",");
			if (aAssItem[2] > 0) {
				answered++;
			}
		}
		return {
			"answered": answered,
			"numerOfQuestions": aAssLen
		};
	};

	var getAttemptStatus = function () {
		var correct = 0;
		var answered = 0;
		var correctToPass = Math.ceil(aAssLen * passMark / 100);
		var incorrectToFail = aAssLen - correctToPass + 1;
		var i = 0;
		var aAssItem = [];
		for (i = 0; i < aAssLen; i++) {
			aAssItem = aAss[i].split(",");
			if (aAssItem[2] > 0) {
				answered++;
				if (aAssItem[2] == 2) {
					correct++;
				}
			}
		}

		if (correct >= correctToPass) {
			return "passed";
		} else if (answered - correct >= incorrectToFail) {
			return "failed";
		} else {
			return "pending";
		}
	};

	var displayLives = function () {
		var lives = getLives();
		var livesDiv = document.createElement("div");
		var lifeIcon;
		var i = 0;
		var livesLost = lives.lost;
		var livesRemaining = lives.remaining;
		var totalLives = livesLost + livesRemaining;

		livesDiv.className = "assessment-lives";
		livesDiv.title = 'Lives';
		for (i = 1; i <= livesLost; i++) {
			lifeIcon = document.createElement("img");
			lifeIcon.src = settings.mcqLifeLostIcon;
			lifeIcon.style.height = "100%";
			lifeIcon.setAttribute("aria-hidden", "true");
			livesDiv.appendChild(lifeIcon);
		};
		for (i = 1; i <= livesRemaining; i++) {
			lifeIcon = document.createElement("img");
			lifeIcon.src = settings.mcqLifeIcon;
			lifeIcon.style.height = "100%";
			if (i === 1) {
				currentLifeIcon = lifeIcon;
				lifeIcon.alt = settings.modlbl_livesAltText.split("[X]").join(livesRemaining).split("[Y]").join(totalLives);
			} else {
				lifeIcon.setAttribute("aria-hidden", "true");
			}
			livesDiv.appendChild(lifeIcon);
		};
		return livesDiv;
	};

	var getPoints = function () {
		var points = 0;
		var i = 0;
		var aAssItem = [];
		var isBet = false;
		var correct, incorrect;

		for (i = 0; i < aAssLen; i++) {
			aAssItem = aAss[i].split(",");
			isBet = false;
			correct = aAssItem[2] == 2;
			incorrect = aAssItem[2] == 1;
			if (aAssItem.length >= 5 && aAssItem[4] == 1) {
				isBet = true;
			}
			if (correct) {
				points += questionPoints;
				if (isBet) {
					points += betWonPoints;
				}
			} else if (incorrect && isBet) {
				points += betLostPoints;
			}
			if (timeBasedPoints > 0 && correct) {
				points += timeBasedPoints * remainingTime / questionTimeLimit;
			} 
		};
		return points;
	};

	var displayPoints = function () {
		var points = getPoints();
		var pointsDiv = document.createElement("div");
		pointsDiv.className = "assessment-points";
		pointsDiv.innerText = settings.modlbl_ass_score + " " + points;
		pointsContainer = pointsDiv;
		return pointsDiv;
	};

	var addMarker = function (correct) {
		var src = settings.mcqCrossIcon;
		var alt = settings.mcqCrossText;
		var image = document.createElement("img");
		image.className = "mcqMarkerIcon";
		image.style.verticalAlign = "middle";
		if (correct) {
			src = settings.mcqTickIcon;
			alt = settings.mcqTickText;
		}
		image.src = src;
		image.alt = alt;
		return image;
	};

	var createAssessment = function () {
		aAss = [];
		aAssLen = 0;
		qNo = 0;
		currentQuestionBank = "";
		gotoSummary = false;
		question = {};
		checkExisting();
		if (qNo === 0) {
			var allQuestionBanks = removeObjectiveBanks();
			var useQuestionBanks = selectQuestionBanks(allQuestionBanks);
			aAss = selectQuestions(useQuestionBanks);
			aAssLen = aAss.length;
			setDataValue(assessmentId, aAss.join("!"));
			setDataValue(assessmentId + "-start", getCurrentTime());
		}
		if (numberOfLives === 0) {
			totalLives = aAssLen - Math.ceil(aAssLen * passMark / 100) + 1;
		} else {
			totalLives = numberOfLives;
		}
		$(".title-td").css("display", "none");
		assessmentElement.innerHTML = "";
		statusBar = scr_createDiv("assessment-status-bar", "", assessmentElement);
		questionBankContainer = scr_createDiv("", "", assessmentElement);
		$("#scr_progress_outer").css("display", "none");
		SKILLCASTAPI.hideBack();
		prepareQuestion();
		lockAssessment();
	};

	var prepareQuestion = function () {
		var aAssItem = aAss[qNo].split(",");
		var qb = aAssItem[0];
		var q = aAssItem[1];
		var qStatus = aAssItem[2];
		var bank = aQb[qb];
		var i = 0;
		var caseStudyClassName = "";
		var questionClassName = "";
		var questionCounterText = settings.modlbl_q + " " + (qNo + 1) + " " + settings.modlbl_page_of + " " + aAssLen;
		var questionCounterH1 = document.createElement('div');
		var statsContainer;
		var classesArr = ["questionCorrect", "questionPartial", "questionIncorrect"];
		questionCounterH1.innerHTML = questionCounterText;
		questionCounterH1.className = "assessment-question-counter";

		SKILLCASTAPI.hideNext();
		statusBar.innerHTML = "";
		statusBar.appendChild(questionCounterH1);
		statsContainer = scr_createDiv("assessment-stats-container", "", statusBar);
		if (showPoints) {
			statsContainer.appendChild(displayPoints());
		}
		if (showLives) {
			statsContainer.appendChild(displayLives());
		}
		question = JSON.parse(JSON.stringify(bank.questions[q]));
		question.optionCount = question.options.length;
		question.correctOptions = 0;
		question.currentAnswer = false;
		question.currentResponse = [];
		question.currentResponseIndex = [];
		question.currentResponseCount = 0;
		question.attemptsUsed = 0;
		for (i = 0; i < question.optionCount; i++) {
			question.correctOptions += Number(question.options[i].c);
		}

		question.optionType = (oneClickResponse && question.correctOptions === 1) ? "button" : "radio";

		if (qStatus > 0) {
			question.currentAnswer = true;
			question.currentResponse = aAssItem[3].split("*");
			question.currentResponseCount = currentResponse.length;
		}

		if (currentQuestionBank !== bank.id) {
			questionBankContainer.innerHTML = "";
			if (bank.caseStudy.length > 10) {
				if (bank.caseStudyWidth < 100) {
					caseStudyClassName = "assessment-align-top contentblock" + bank.caseStudyWidth;
					questionClassName = "assessment-align-top contentblock" + (100 - bank.caseStudyWidth);
				}
				var caseStudyContainer = scr_createDiv(caseStudyClassName, "", questionBankContainer);
				var caseStudyDiv = scr_createDiv("assessment-block", bank.caseStudy, caseStudyContainer);
			}
			if (questionStyle === "card") {
				
				questionClassName = (questionClassName.length) ? questionClassName : 'contentblock50 assessment-card-align-center';
				var questionCardContainer = scr_createDiv(questionClassName, "", questionBankContainer);
				questionCardContainer.style.textAlign = "center";
				questionCardDeck = createCardDeck();
				questionCardContainer.appendChild(questionCardDeck);
				questionCard = createCardQuestion("front");
				questionCardDeck.children[0].appendChild(questionCard);
				
				matchCardHeights({ element: questionCardDeck.children[0].children[1], cardImg: questionCardDeck.children[0].children[0] });
				if (qNo > 1) {
					setFocus({ element: caseStudyDiv });
				}
			} else {
				questionContainer = scr_createDiv(questionClassName, "", questionBankContainer);
			}
			currentQuestionBank = bank.id;
			createQuestion();
			if (questionStyle !== "card") {
				createTimeLimit('.questionContainerDiv');
			}
		} else {
			if (questionStyle === "card") {
				var newQuestionCard = createCardQuestion("back");
				questionCard.style.zIndex = "2";
				questionCardDeck.children[0].appendChild(newQuestionCard);
				createQuestion();
				$(questionCard).animate({ left: "3000px", right: "-3000px" }, 1000, function () {
					questionCardDeck.children[0].removeChild(questionCard);
					questionCard = newQuestionCard;
					setFocus({ element: questionCardContainer });
					createTimeLimit('.questionContainerDiv');
				});
			} else {
				questionContainer.innerHTML = "";
				createQuestion();
				createTimeLimit('.questionContainerDiv');
			}
		}
			$.each(classesArr, function (index, value) {
				if ($(assessmentElement).hasClass(value)) {
					$(assessmentElement).removeClass(value);
				}
			});
	};

	var createCardDeck = function () {
		var parentContainer = document.createElement("div");
		parentContainer.className = "assessment-card-deck-container";
		var cardContainer = document.createElement("div");
		var cardImg = document.createElement("img");
		cardContainer.className = "assessment-card-deck";
		cardContainer.style.position = "relative";
		cardImg.className = "assessment-card-image";
		cardImg.alt = "Click to access questions";
		cardImg.src = settings.mcqPlayingCard;
		cardImg.tabIndex = 0;
		cardImg.setAttribute("role", "button");
		cardImg.onclick = function (evt) {
			createTimeLimit('.questionContainerDiv');
			var thisClass = this.getAttribute('class');
			if (thisClass.indexOf('slide-down') === -1) {
				this.setAttribute('class', thisClass + ' slide-down');
				setTimeout(function () { cardImg.style.display = 'none'; }, 1000)
			}
		};
		cardContainer.appendChild(cardImg);
		parentContainer.appendChild(cardContainer);
		return parentContainer;
	};

	var createCardQuestion = function (face) {
		var cardContainer = document.createElement("div");
		cardContainer.className = "assessment-card-container";
		questionContainer = document.createElement("div");
		questionContainer.className = "assessment-card-question";
		cardContainer.style.display = "inline-block";
		if (face !== "front") {
			cardContainer.style.visibility = 'visible';
		}
		cardContainer.appendChild(questionContainer);
		return cardContainer;
	};

	function formatTime(time) {
		var minutes = Math.floor(time / 60);
		var seconds = time % 60;
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		return minutes + ":" + seconds;
	};

	function onTimesUp() {
		clearInterval(timerInterval);
		submitQuestionResponse(1, [0], 0);
		if (showImmediateFeedback) {
			$('.assessment-continue').remove();
			$('input[id^="scrq_option"]').prop('disabled',true);
		}
	};

	function createCountdownDonut(elementId, randomid) {
		var countdown;
		if (questionTimer == '0') {
			countdown = document.getElementById(elementId).innerHTML =
			"<div class='base-timer'>" +
			"<svg class='base-timer__svg' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>" +
			"<g class='base-timer__circle'>" +
			"<circle class='base-timer__path-elapsed' cx='50' cy='50' r='45'></circle>" +
			"<path id='base-timer-path-remaining" + randomid + "' class='base-timer__path-remaining green_Countdown' stroke-dasharray='283' d='M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0' ></path>" +
			"</g></svg>" +
			"<span id='base-timer-label" + randomid + "' class='base-timer__label'>" + formatTime(questionTimeLimit) + "</span></div>";
		} else {
			countdown = document.getElementById(elementId).innerHTML = 
			"<div class='timer'><div class='base-timer__path-remaining green_Countdown' id='base-timer-path-remaining" + randomid + "'><span id='base-timer-label" + randomid + "' class='base-timer__label'>" + formatTime(questionTimeLimit) + "</span><div></div>";
		} 
		return countdown;
	};

	function createTimeLimit(container) {
		var randomID = Math.random().toString(36).substr(2, 9);
		if (questionTimeLimit > 0) {
			var styles = (questionTimer == '0') ? {'float':'right','padding':'1em 2em'} : {'padding':'0.5em', 'text-align':'right'};
			var countDown = $('<div>').attr('id','countDown').css(styles);
			$(container).prepend(countDown);
			createCountdownDonut('countDown',randomID);
			startTimer(randomID);
		}
	};

	function startTimer(randomid) {
		var timePassed = 0;
		var baseTimerColor, circleDasharray, rawTimeFraction, timeLeft;
		timerInterval = setInterval(function () {
			timePassed = timePassed += 1;
			timeLeft = questionTimeLimit - timePassed;
			rawTimeFraction = timeLeft / questionTimeLimit;
			circleDasharray = ((rawTimeFraction - (1 / questionTimeLimit) * (1 - rawTimeFraction)) * 283).toFixed(0) + " 283";
			baseTimerColor = document.getElementById("base-timer-path-remaining" + randomid);
			document.getElementById("base-timer-label" + randomid).innerHTML = formatTime(timeLeft);
			if (questionTimer == '0') {
				baseTimerColor.setAttribute("stroke-dasharray", circleDasharray);
			} 
			if (timeLeft <= questionTimeLimit / 4) {
				baseTimerColor.setAttribute('class', 'base-timer__path-remaining  red_Countdown');
			} else if (timeLeft <= questionTimeLimit / 2) {
				baseTimerColor.setAttribute('class', 'base-timer__path-remaining  orange_Countdown');
			}
			
			if (timeLeft === 0) {
				onTimesUp();
			}
			remainingTime = timeLeft;
		}, 1000);
	};

	var createQuestion = function () {
		var optionContainer = [];
		var i = 0;
		var randomArray = [];
		var randomNumber = 0;
		var randomIndex = 0;
		var questionDiv = scr_createDiv("assessment-block questionContainerDiv", "", questionContainer);
		var questionQuestion = scr_createDiv("assessmentQuestion", question.content, questionDiv);
		questionQuestion.setAttribute("id","questionID_"+getPageInfo().autoId);
		var questionOptionsDiv = scr_createDiv("", "", questionDiv);
		var questionOptions = (question.optionType === "button") ? document.createElement("div") : document.createElement("fieldset");
		var questionSubmit = scr_createDiv("assessment-continue", "", questionDiv);
		if (betWonPoints > 0) {
			question.betDiv = scr_createDiv("", "", questionDiv);
		}

		question.resultDiv = scr_createDiv("assessment-result", "", questionDiv);
		question.explanationDiv = scr_createDiv("", "", questionDiv);
		question.questionDesc = $(questionQuestion).text().substr(0, 250);
		questionOptionsDiv.appendChild(questionOptions);

		if (question.optionType !== "button" && !hideSubmitButton) {
			createSubmitButton(questionSubmit);
		}
		for (i = 0; i < question.optionCount; i++) {
			optionContainer[i] = createOption(i);
			if (question.itemSort === "prescribed") {
				questionOptions.appendChild(optionContainer[i]);
			} else {
				randomArray[i] = i;
			}
		};
		if (question.itemSort === "random") {
			for (i = 0; i < question.optionCount; i++) {
				randomNumber = getRandomInt(1, randomArray.length) - 1;
				randomIndex = randomArray[randomNumber];
				questionOptions.appendChild(optionContainer[randomIndex]);
				randomArray.splice(randomNumber, 1);
			};
		}
		if (question.currentAnswer) {
			for (i = 0; i < question.currentResponseCount; i++) {
				toggleOption(question.options[question.currentResponse[i] - 1].id);
			}
			question.attemptsUsed = question.attempts - 1;
		}
		if (questionTimeLimit > 0 && questionTimer == '0') {
			$(questionQuestion).css({'min-height':'8rem','width':'85%'});
		}
		$('html').animate({ scrollTop: 0 }, 500);
	
	};
	
	var createSubmitButton = function (buttonContainer) {
		question.submitButton = document.createElement("input");
		question.submitButton.type = "button";
		question.submitButton.setAttribute("aria-label",settings.modlbl_submitAlt);
		question.submitButton.onclick = submitResponse;
		question.submitButton.value = settings.modlbl_submit;
		buttonContainer.appendChild(question.submitButton);

		return buttonContainer;
	};

	var createOption = function (optionIndex) {
		var option = question.options[optionIndex];
		var optionHtml = (question.optionType === "button") ? createOptionButton(option) : createOptionInput(option, question.correctOptions);
		var optionContainer = optionHtml.optionContainer;
		var optionContent = optionHtml.optionContent;
		question.options[optionIndex].button = optionHtml.optionBorder;
		question.options[optionIndex].marker = optionHtml.optionMarker;
		question.options[optionIndex].input = optionHtml.optionInput;
		question.options[optionIndex].input.name = question.id + "_options";
		question.options[optionIndex].input.id = option.id;
		if (!question.currentAnswer) {
			question.options[optionIndex].button.style.cursor = "pointer";
			question.options[optionIndex].input.onclick = function () {
				toggleOption(optionIndex);
			};
		}
		question.options[optionIndex].optionDesc = $(optionContent).text().split(",").join(" ").split(" ").join("_").substr(0, 250);
		return optionContainer;
	};

	var createOptionInput = function (option, correctOptions) {
		var optionContainer = document.createElement('label');
		var optionTable = scr_createDiv("scr_layout_table", "", optionContainer);
		var optionRow = scr_createDiv("scr_layout_row", "", optionTable);
		var optionInputContainer = scr_createDiv("scr_layout_cell assessment-option-input", "", optionRow);
		var optionButton = scr_createDiv("scr_layout_cell assessment-option-button", "", optionRow);
		var optionBorder = scr_createDiv("assessment-option-border-ready", "", optionButton);
		var optionButtonTable = scr_createDiv("scr_layout_table", "", optionBorder);
		var optionButtonRow = scr_createDiv("scr_layout_row", "", optionButtonTable);
		var optionContent = scr_createDiv("scr_layout_cell assessment-option-content", option.content, optionButtonRow);
		var optionMarker = scr_createDiv("scr_layout_cell assessment-option-marker", "", optionButtonRow);
		var assessmentQuestionDiv = document.querySelector(".assessmentQuestion");
		var ariaLabelText = option.content.replace(/(<([^>]+)>)/ig, "");
		optionContainer.setAttribute("for", option.id);
		if ("width" in option && option.width < 100) {
			optionContainer.className = "assessment-inline-button contentblock" + option.width;
		}
		optionInput = document.createElement('input');
		optionInput.setAttribute("aria-required",true);
		optionInput.setAttribute("aria-label",ariaLabelText);
		optionInput.setAttribute("aria-describedby",assessmentQuestionDiv.id);
		if (correctOptions === 1) {
			optionInput.type = "radio";
			optionInput.setAttribute("role","radio");
		} else {
			optionInput.type = "checkbox";
			optionInput.setAttribute("role","checkbox");
		}
		optionInputContainer.appendChild(optionInput);
		return {
			"optionContainer": optionContainer,
			"optionBorder": optionBorder,
			"optionMarker": optionMarker,
			"optionInput": optionInput,
			"optionContent": optionContent
		};
	};

	var createOptionButton = function (option) {
		var optionContainer = document.createElement('button');
		var optionBorder = scr_createDiv("assessment-option-border-ready", "", optionContainer);
		var optionButtonTable = scr_createDiv("scr_layout_table", "", optionBorder);
		var optionButtonRow = scr_createDiv("scr_layout_row", "", optionButtonTable);
		var optionContent = scr_createDiv("scr_layout_cell assessment-option-content", option.content, optionButtonRow);
		var optionMarker = scr_createDiv("scr_layout_cell assessment-option-marker", "", optionButtonRow);
		if ("width" in option && option.width < 100) {
			optionContainer.className = "assessment-inline-button contentblock" + option.width;
		}
		optionContainer.style.border = 0;
		optionContainer.style.margin = 0;
		optionContainer.style.padding = 0;
		optionContainer.style.backgroundColor = "transparent";
		return {
			"optionContainer": optionContainer,
			"optionBorder": optionBorder,
			"optionMarker": optionMarker,
			"optionInput": optionContainer,
			"optionContent": optionContent
		};
	};

	var toggleOption = function (optionIndex) {
		var betContainer = document.querySelector('#betContainer');
		if (question.options[optionIndex].s == 1) {
			if (question.correctOptions > 1) {
				question.options[optionIndex].s = 0;
				question.options[optionIndex].button.className = "assessment-option-border-ready";
			}
		} else {
			question.options[optionIndex].s = 1;
			question.options[optionIndex].button.className = "assessment-option-border-selected";
			if (question.correctOptions === 1) {
				for (var i = 0; i < question.optionCount; i++) {
					if (i !== optionIndex) {
						question.options[i].s = 0;
						question.options[i].button.className = "assessment-option-border-ready";
					}
				};
			}
		}

		if (question.optionType === "button") {
			submitResponse();
		}

		if (!document.body.contains(betContainer) && hideSubmitButton) {
			showBet(question.optionType);
		}

	};

	var submitResponse = function () {
		clearInterval(timerInterval);
		var selectedOptionCount = 0;
		var allAttemptsUsed;
		var score = 2;
		var partial = 0;
		var result = "correct";
		var correct = [];
		var correctText = [];
		var response = [];
		var responseText = [];
		var thisOption;
		var i;
		var optionCount = question.optionCount;
		var interactionType = "choice";
		var thisTracking = getTracking(assessmentId);
		var attemptCount = thisTracking.attempts.length;
		var interactionId = question.id;

		if (useUniqueInteractionId) {
			interactionId = "a" + (attemptCount + 1) + "-" + interactionId;
		}
		for (i = 0; i < optionCount; i++) {
			thisOption = question.options[i];
			selectedOptionCount += Number(thisOption.s);
		}
		if (selectedOptionCount > 0) {
			for (i = 0; i < optionCount; i++) {
				thisOption = question.options[i];
				thisOption.button.style.cursor = "default";
				thisOption.input.onclick = null;
				if (question.optionType === "radio") {
					thisOption.input.disabled = "true";
				}
			}
			if ("submitButton" in question) {
				question.submitButton.style.display = "none";
			}
			if (betWonPoints > 0 && !question.hasOwnProperty("bet") && !hideSubmitButton) {
				showBet(question.optionType);
			} else {
				question.attemptsUsed++;
				allAttemptsUsed = (question.attemptsUsed >= question.attempts);
				for (i = 0; i < question.optionCount; i++) {
					thisOption = question.options[i];
					if (thisOption.c == 1) {
						correct.push(i + 1);
						if (isScorm2004) {
							correctText.push(thisOption.optionDesc);
						}
					}
					if (thisOption.s == 1) {
						response.push(i + 1);
						if (isScorm2004) {
							responseText.push(thisOption.optionDesc);
						}
					}
					if (thisOption.s != thisOption.c) {
						score = 1;
						result = (isScorm2004) ? "incorrect" : "wrong";
					} else if (showImmediateFeedback && thisOption.c == 1) {
						partial++;
					}
				};
				if (score === 2 || allAttemptsUsed) {
					if (trackScormInteractions) {
						if (showPoints && betWonPoints > 0) {
							if (trackBetAsWeight) {
								interactionType = "bet";
								result += "," + (question.bet + 1);

							} else {
								if (score === 2) {
									result = questionPoints + (betWonPoints * question.bet);
								} else {
									result = betLostPoints * question.bet;
								}
							}
						}
						if (isScorm2004) {
							setInteraction(interactionId, interactionType, correctText.join(","), responseText.join(","), result, question.questionDesc);
						} else {
							setInteraction(interactionId, interactionType, correct.join(","), response.join(","), result, question.questionDesc);
						}
					}
					submitQuestionResponse(score, response, partial);
					
					if (scrollingSkin) {
						updatePathAndProgress(false);
					}
				} else {
					for (i = 0; i < question.optionCount; i++) {
						thisOption = question.options[i];
						thisOption.button.style.cursor = "pointer";
						thisOption.input.onclick = (function (optionIndex) {
							return function () {
								toggleOption(optionIndex);
							};
						})(i);
						if (question.optionType === "radio") {
							thisOption.input.removeAttribute("disabled");
						}
					}
					if ("submitButton" in question) {
						question.submitButton.style.display = "block";
					}
					if ("modlbl_question_tryagain" in settings) {
						question.resultDiv.innerText = modlbl_question_tryagain;
					} else {
						question.resultDiv.innerText = modlbl_question_incorrect;
					}
				}
			}
		}
	};

	var showBet = function (optionType) {
		var betContainer;
		var yesButton;
		var noButton;
		if (optionType === 'radio' && hideSubmitButton) {
			betContainer = document.createElement('fieldset');
			yesButton = createBetInput(settings.modlbl_bet_yes, settings.mcqBetIcon, 'btn_yes');
			noButton = createBetInput(settings.modlbl_bet_no, settings.mcqNoBetIcon, 'btn_no');
		} else {
			betContainer = document.createElement("div");
			yesButton = createBetButton(settings.modlbl_bet_yes, settings.mcqBetIcon);
			noButton = createBetButton(settings.modlbl_bet_no, settings.mcqNoBetIcon);
		}
		betContainer.setAttribute('id', 'betContainer');
		var betText = scr_createDiv("assessment-bet-question", settings.modlbl_bet_question, betContainer);
		var betOptions = scr_createDiv("", "", betContainer);
		var assessmentBetContinue = scr_createDiv("assessment-bet-continue", "", betContainer);

		yesButton.onclick = function () {
			betButtonsClickHandler(this, assessmentBetContinue, 1);
		};

		noButton.onclick = function () {
			betButtonsClickHandler(this, assessmentBetContinue, 0);
		};
		
		betOptions.appendChild(yesButton);
		betOptions.appendChild(noButton);
		question.betDiv.appendChild(betContainer);
		btnTextTimeOut = elementTimeOutFocus({ element: betText });
	};

	var betButtonsClickHandler = function ($this, betContinue, betValue) {
		var $that = $this;
		var assessmentBetContinue = betContinue;
		var btnSelector = document.querySelector('input[type=button]');
		var checkBtnExists = assessmentBetContinue.contains(btnSelector);
		setBetValue(betValue);
		if (hideSubmitButton) {
			walkTheDOM($that, toggleHighLightRadioDiv);
			if (!checkBtnExists) {
				createSubmitButton(assessmentBetContinue);
			}
		}
	};

	var toggleHighLightRadioDiv = function (currentNode) {
		var currentRadioId;
		var currentRadioDivId;
		var parentElement;
		var parentElementSibling;
		var hasClass = false;
		if (!!currentNode.name && currentNode.name === 'betInput') {
			currentNode.checked = true;
			currentRadioId = currentNode.id;
			currentRadioDivId = currentRadioId + "_border";
			parentElement = $("#" + currentRadioId).parents("label").get(0);
			parentElementSibling = (currentRadioId === "btn_yes") ? parentElement.nextSibling : parentElement.previousSibling;
			document.getElementById(currentRadioDivId).className += " assessment-bet-border-selected";
			hasClass = parentElementSibling.querySelector(".assessment-bet-border-selected");
			if (hasClass) {
				parentElementSibling.querySelector(".assessment-bet-border-selected").className = "assessment-bet-border";
			}
		}
	};

	var walkTheDOM = function (node, func) {
		func(node);
		node = node.firstChild;
		while (node) {
			walkTheDOM(node, func);
			node = node.nextSibling;
		}
	};

	var createBetButton = function (label, icon) {
		var optionContainer = document.createElement('button');
		optionContainer.className = "assessment-inline-button contentblock50";
		optionContainer.style.border = 0;
		optionContainer.style.margin = 0;
		optionContainer.style.padding = 0;
		optionContainer.style.backgroundColor = "transparent";

		createBetButtonInnerHTML(optionContainer, icon, label);
		return optionContainer;
	};

	var createBetInput = function (label, icon, id) {
		var optionContainer = document.createElement('label');
		optionContainer.setAttribute("for", id);
		optionContainer.className = "assessment-inline-button contentblock50";

		var optionTable = scr_createDiv("scr_layout_table", "", optionContainer);
		var optionBetRow = scr_createDiv("scr_layout_row", "", optionTable);
		var optionBetInputContainer = scr_createDiv("scr_layout_cell assessment-option-input", "", optionBetRow);
		var optionBetInput = document.createElement('input');
		optionBetInput.type = "radio";
		optionBetInput.name = "betInput";
		optionBetInput.id = id;
		optionBetInputContainer.appendChild(optionBetInput);

		var optionBetButton = scr_createDiv("scr_layout_cell assessment-option-button", "", optionBetRow);
		createBetButtonInnerHTML(optionBetButton, icon, label, id + "_border");

		optionBetRow.insertBefore(optionBetInputContainer, optionBetButton);

		return optionContainer;
	};

	var createBetButtonInnerHTML = function (betContainer, icon, btnLabel, id) {
		var optionBetContainer = betContainer;
		var label = btnLabel;
		var optionBorder = scr_createDiv("assessment-bet-border", "", optionBetContainer);
		if (id) { optionBorder.id = id };
		var optionButtonTable = scr_createDiv("scr_layout_table", "", optionBorder);
		var optionButtonRow = scr_createDiv("scr_layout_row", "", optionButtonTable);
		var optionMarker = scr_createDiv("scr_layout_cell assessment-bet-marker", "", optionButtonRow);
		var optionContent = scr_createDiv("scr_layout_cell assessment-bet-content", label, optionButtonRow);
		createOptionMarker(optionMarker, icon);
	};

	var createOptionMarker = function (thisOptMarker, thisIcon) {
		var optionMarker = thisOptMarker;
		var icon = thisIcon;
		var marker = document.createElement("img");
		marker.src = icon;
		marker.style.width = "100%";
		marker.style.height = "100%"; // we specify the height because of issues with IE<10 
		optionMarker.appendChild(marker);
	};

	var setBetValue = function (betValue) {
		question.bet = betValue;
		if (!hideSubmitButton) { submitResponse(); }
		clearTimeout(btnTextTimeOut);
	};

	var submitQuestionResponse = function (score, response, partial) {
		var i = 0;
		var nextQuestionNo = qNo + 1;
		var thisOption;
		var result = "";
		var resultText = "";
		var resultClass = "";
		var showSolution = showSolutionInFeedback == 1 || (showSolutionInFeedback == 2 && score == 2);
		
		aAss[qNo] = aAss[qNo].split(",")[0] + "," + aAss[qNo].split(",")[1] + "," + score + "," + response.join("*");
		if ("bet" in question) {
			aAss[qNo] = aAss[qNo] + "," + question.bet;
			question.betDiv.style.display = "none";
		}
		if (nextQuestionNo === aAssLen) {
			gotoSummary = true;
		} else if (showLives) {
			if (getLives().remaining === 0) {
				gotoSummary = true;
			}
		}
		if (gotoSummary) {
			saveAssessmentAttempt();
		} else {
			setDataValue(assessmentId, aAss.join("!"));
			forceCommit();
		}


		if (showImmediateFeedback) {
			for (i = 0; i < question.optionCount; i++) {
				thisOption = question.options[i];
				if (thisOption.s != thisOption.c) {
					if (thisOption.c == 1) {
						thisOption.button.className = "assessment-option-border-notselected assessment-option-border-notselected-correct";
						if (showSolutionInFeedback == 1) {
							thisOption.marker.appendChild(addMarker(true));
						} 
					} else {
						if (showSolutionInFeedback == 1) {
							thisOption.marker.appendChild(addMarker(false));
							thisOption.button.className = "assessment-option-border-incorrect assessment-option-border-selected-incorrect";
						}
					}
				} else {
					if (thisOption.c == 1) {
						if (showSolution) {
							thisOption.button.className = "assessment-option-border-correct assessment-option-border-selected-correct";
							thisOption.marker.appendChild(addMarker(true));
						}
					} else {
						thisOption.button.className = "assessment-option-border-notselected assessment-option-border-notselected-incorrect";
						if (showSolution) {
							thisOption.marker.appendChild(addMarker(false));
						} 
					}
			  }
			}
			if (score === 2) {
				result = "correct";
				resultText = settings.modlbl_question_correct;
				resultClass = "questionCorrect";
			} else if (partial > 0 && "modlbl_question_partial" in settings && settings.modlbl_question_partial.length > 0) {
				result = "partial";
				resultText = settings.modlbl_question_partial;
				resultClass = "questionPartial";
			} else {
				result = "incorrect";
				resultText = settings.modlbl_question_incorrect;
				resultClass = "questionIncorrect";
			}
			if (showPoints) {
				if ("bet" in question && question.bet == 1) {
					if (result === "correct") {
						if (timeBasedPoints > 0) {
							resultText += " +" + ((questionPoints + betWonPoints) + timeBasedPoints * remainingTime / questionTimeLimit);
						} else {
							resultText += " +" + (questionPoints + betWonPoints);
						}
					} else {
						resultText += " " + betLostPoints;
					}
				} else if (result === "correct") {
					if (timeBasedPoints > 0) {
						resultText += " +" + (questionPoints + timeBasedPoints * remainingTime / questionTimeLimit);
					} else {
						resultText += " +" + questionPoints;
					}
				}
				pointsContainer.innerText = settings.modlbl_ass_score + " " + getPoints();
			}
			if (showLives && score === 1 && (loseLifeType === "answer" || (loseLifeType === "bet" && "bet" in question && question.bet == 1))) {
				currentLifeIcon.src = settings.mcqLifeCutIcon;
				resultText = "<img src='" + settings.mcqLifeCutIcon + "' style='width:30px;vertical-align:middle'/> " + resultText;
			}
			if (showSolution) {
				scr_createDiv("assessment-points-result", resultText, question.resultDiv);
			}

			if(showExplanationInFeedback == 1 || (showExplanationInFeedback == 2 && score == 2)) {
				question.explanationDiv.innerHTML = question.explanation;
				if (scrollToExplanation) {
					$('html').animate({
						scrollTop: $(question.explanationDiv).offset().top
					}, 2000);
				}
			}

			$(assessmentElement).addClass(resultClass);
			setFocus({ element: question.resultDiv });
			nextPage = function () {
				continueAssessment();
			};
			SKILLCASTAPI.showNext();
		} else {
			continueAssessment();
		}
	};

	function addFunction (addVal) {
		var j;
		var addArray = [];
		var addArrayLength = 0;
		
		if(addVal.length > 0) {
			addArray = addVal.toString().split(",");
			addArrayLength = addArray.length;
			for (j = 0; j < addArrayLength; j++) {
				addObjective(addArray[j]);
			}
		}
	};

	function removeFunction (removeVal) {
		var j;
		var removeArray = [];
		var removeArrayLength = 0;
		
		if(removeVal.length > 0) {
			removeArray = removeVal.toString().split(",");
			removeArrayLength = removeArray.length;
			for (j = 0; j < removeArrayLength; j++) {
				removeObjective(removeArray[j]);
			}
		}
	};

	function formatNo(value, padding) {
		var zeroes = new Array(padding+1).join("0");
		return (zeroes + value).slice(-padding);
	};

	var getTotalScore = function () {
		var i = 0;
		var thisResponse = [];
		var isCorrect;
		totalScore = 0;
		for (i = 0; i < aAssLen; i++) {
			thisResponse = aAss[i].split(",");
			isCorrect = thisResponse[2] == 2
			if (thisResponse.length >= 3 && isCorrect) {
				totalScore++;
			}
		};
		return totalScore;
	};

	var getAvailablePoints = function () {
		var i = 0;
		var availablePoints = 0;

		for (i = 0; i < aAssLen; i++) {
			thisResponse = aAss[i].split(",");
			if (questionPoints > 0) {
				availablePoints += questionPoints;
				if (betWonPoints > 0) {
					availablePoints += betWonPoints;
				}
			}
		};
		return availablePoints;
	};

	var getAvailableBonusPoints = function () {
		var i = 0;
		var bonusPoints = 0;

		for (i = 0; i < aAssLen; i++) {
			if (timeBasedPoints > 0) {
				bonusPoints += timeBasedPoints;
			}
		};
		return bonusPoints;
	};

	var setPercentageScore = function() {
		var percentageScore = 0;
		var totalAvailablePoints = getAvailablePoints() + getAvailableBonusPoints();
		if (scoreTracking == 0 && showPoints) {
			percentageScore = Math.round(100 * getPoints() / totalAvailablePoints, 0);
		} else {
			percentageScore = Math.round(100 * getTotalScore() / aAssLen, 0);
		}
		return percentageScore;
	};

	var scormObjective = function() {
		var name;
		if (scormObjectiveName == 1) {
			name = scr_pages[thisPageNo].title;
		} else {
			name = "P" + getPageInfo().pageNo;
		}
		return name;
	}();

	var saveAssessmentAttempt = function () {
		var i = 0;
		var attemptStatus = 0;
		var assTracking;
		var assessmentTime;
		var processObjectiveUpdates = false;
		var objectiveArray = getObjectiveArray();
		var objectiveArrayLen = objectiveArray.length;
		var objectiveStatus;
		var attempScore;
		var assTrackingAttemptsLen;
		var eachAttemptObjectiveName;
		var percentageScore = setPercentageScore();

		function setDataValueFunction(string) {
			var textInBracket =  string.match(/\[([^\[\]]*)\]/g) ? string.replace( /(^.*\[|\].*$)/g, '' ) : "";
			var variableInBracket = eval(textInBracket);
			var newVar = variableInBracket == undefined ? "" : variableInBracket;
			var updatedVar = isNaN(newVar) ? newVar : formatNo(newVar,3);
			var simpleString = string == undefined ? "" : string.replace(/ *\[[^\]]*]/, '');
			var result =  simpleString + updatedVar;
			return result;
		};
		
		var setStatusBasedOnLives = (passMark == -1) && (getLives().total > getLives().lost);
		var passMarkMoreThan0 = (percentageScore >= passMark) && (passMark >= 0); 
		
		if (setDataVarAny.length) {
			setDataValue(setDataValueFunction(setDataVarAny),setDataValueFunction(setDataValAny));
		}
		if (removeDataAny.length) {
			removeDataValue(setDataValueFunction(removeDataAny));
		}
		if (passMarkMoreThan0 || setStatusBasedOnLives) {
			attemptStatus = 1;
			if (setDataVarPassed.length) {
				setDataValue(setDataValueFunction(setDataVarPassed),setDataValueFunction(setDataValPassed));
			}
			if (removeDataPassed.length) {
				removeDataValue(setDataValueFunction(removeDataPassed));
			}
		} else {
			if (setDataVarFailed.length) {
				setDataValue(setDataValueFunction(setDataVarFailed),setDataValueFunction(setDataValFailed));
			}
			if (removeDataFailed.length) { 
				removeDataValue(setDataValueFunction(removeDataFailed));
			}
		}

		setTracking(assessmentId, attemptStatus, percentageScore);
		if (questionPoints > 0) {
			pointsHistoryArray.push(getPoints() + "," + getAvailablePoints());
			setDataValue(assessmentId + "-points", pointsHistoryArray.join("!"));
		}
		if(attemptStatus == 1) {
			if(completeOnPass) {
				setCompletionStatus();
			}
		} else {
			if(exemptOnFail) {
				setDataValue("exempt-" + assessmentId,"y");
			}
		}

		assTracking = getTracking(assessmentId);
		setDataValue(scr_pages[thisPageNo].title,assTracking.score);
		if(removeObjectivePass.length > 0 && assTracking.status == 1) {
			removeFunction(removeObjectivePass);
			processObjectiveUpdates = true;
		}
		if(removeObjectiveFail.length > 0 && assTracking.status == 0 && assTracking.attemptLimit > 0 && assTracking.attempts.length >= assTracking.attemptLimit) {
			removeFunction(removeObjectiveFail);
			processObjectiveUpdates = true;
		}
		if (addObjectivePass.length > 0 && assTracking.status == 1) {
			addFunction(addObjectivePass);
			processObjectiveUpdates = true;
		}
		if (addObjectiveFail.length > 0 && assTracking.status == 0 && assTracking.attemptLimit > 0 && assTracking.attempts.length >= assTracking.attemptLimit) {
			addFunction(addObjectiveFail);
			processObjectiveUpdates = true;
		}
		for(i=0; i<objectiveArrayLen; i++) {
			objectiveStatus = "Completed";
			if(objectiveArray[i].mastery > 0) {
				if(objectiveArray[i].percentageScore >= objectiveArray[i].mastery) {
					objectiveStatus = "Passed";
					removeObjective(objectiveArray[i].title);
					processObjectiveUpdates = true;
				} else {
					objectiveStatus = "Failed";
				}
			}
			if(trackObjectivesScores) {
				setObjective(scormObjective + " " + objectiveArray[i].title, objectiveArray[i].percentageScore, objectiveStatus);
			}
		}
		
		if(typeof trackScormObjectives !== 'undefined' && trackScormObjectives) {
				assStatus = (assTracking.status == 1) ? "passed" : "failed";
				setObjective(scormObjective, assTracking.score, assStatus);
		}

		if (trackEachAttempt) {
			assTrackingAttemptsLen = assTracking.attempts.length;
			assStatus = (assTracking.attempts[assTrackingAttemptsLen - 1].status == 1) ? "passed" : "failed";
			attempScore = assTracking.attempts[assTrackingAttemptsLen - 1].score;
			eachAttemptObjectiveName = scormObjective + " attempt: " + assTrackingAttemptsLen;
			setObjective(eachAttemptObjectiveName, attempScore, assStatus);
		} 

		if (coolingOffDays > 0) {
			assessmentTime = new Date();
			setDataValue(assessmentId + "-time", assessmentTime.getTime());
		}
		//call functions in skillcastrespcore to save data to LMS
		if(processObjectiveUpdates) {
			updatePathAndProgress(true);
		}
		removeDataValue(assessmentId);
		updateTracking();
		forceCommit();
	};

	var continueAssessment = function () {
		if (gotoSummary) {
			if (showPeerComparison) {
				var ajaxUrl = self.scormApi.scr_getAjaxUrl() + Math.random();
				requestData({
					url: ajaxUrl,
					data: {
						"targetService": "moduleServices",
						"targetMethod": "setPeerComparison",
						"assessmentId": assessmentId,
						"score": getPointsStats().score
					},
					dataType: "json",
					cache: false,
					successCallBack: createFeedback,
					errorCallBack: createFeedback
				});

			} else {
				createFeedback();
			}
		} else {
			qNo++;
			prepareQuestion();
		}
	};

	var requestData = function (props) {
		var propsObj = (typeof props !== "undefined" && typeof props === "object")
			? props : {};
		var ajaxUrl = (typeof propsObj.url !== "undefined" && typeof propsObj.url === "string")
			? propsObj.url : null;
		var method = (typeof propsObj.method !== "undefined" && typeof propsObj.method === "string")
			? propsObj.method : "POST";
		var dataObj = (typeof propsObj.data !== "undefined" && typeof propsObj.data === "object")
			? propsObj.data : {};
		var dataType = (typeof propsObj.data !== "undefined" && typeof propsObj.dataType === "string")
			? propsObj.dataType : "json";
		var cache = (typeof propsObj.cache !== "undefined" && typeof propsObj.cache === "boolean")
			? propsObj.cache : false;
		var successCallBack = (typeof propsObj.successCallBack !== "undefined" && typeof propsObj.successCallBack === "function")
			? propsObj.successCallBack : function () { };
		var errorCallBack = (typeof propsObj.errorCallBack !== "undefined" && typeof propsObj.errorCallBack === "function")
			? propsObj.errorCallBack : function () { };

		$.ajax({
			method: method,
			url: ajaxUrl,
			data: dataObj,
			dataType: dataType,
			cache: cache,
			success: function (result) { successCallBack(result); },
			error: function (xhr, status, error) {
				var errMsg = status + ': ' + error;
				errorCallBack({ error: errMsg, status: xhr.status })
			}
		});
	};
	
	var createStartAssessmentBtn = function (container,name,value) {
		var startButton = document.createElement("input");
		startButton.className = "bigbutton assessmentButton";
		startButton.onclick = createAssessment;
		startButton.value = value;
		startButton.type = 'button';
		startButton.name = name;
		container.appendChild(startButton);
	};

	var showBackButton = function() {
		if (document.getElementById('backBtn')) {
			document.getElementById('backBtn').style.visibility = "visible";
		}
		if (document.getElementById('backBtnTop')) {
			document.getElementById('backBtnTop').style.visibility = "visible";
		}
	};

	var createIntro = function () {
		if (showIntroPage) {
			var thisTracking = getTracking(assessmentId);
			var thisScore = "-";
			var attemptLimit = def.attemptLimit;
			var attemptCount = thisTracking.attempts.length;
			var container = document.createElement("div");
			var introDiv;
			var navDiv;
			var statsContainerDiv;
			var statsDiv;
			var buttonContainerDiv;
			var now = new Date();
			var lastAttempt = Number(getDataValue(assessmentId + "-time"));
			var millisecondsInDay = 86400000;
			var nextAttempt = new Date(lastAttempt + (coolingOffDays + 1) * millisecondsInDay);
			var allowRetake = false;
			var threshold;
			var feedbackDiv;
			var thresholdDiv;
			var pageTitle = $('.title-bar');

			pageTitle.addClass('assessment-title');
			
			var createContent = function() {
				navDiv = scr_createDiv("assessment-block", "", container);
				statsContainerDiv = scr_createDiv("contentblock40", "", navDiv);
				statsDiv = scr_createDiv("assessment-analytics", "", statsContainerDiv);
				buttonContainerDiv = scr_createDiv("contentblock40", "", navDiv);
			};

			var createMessage = function() {
				if (dontShowIntroUponRevisiting) {
					if ((attemptCount >= attemptLimit) && (attemptLimit != 0) || thisTracking.status == '1') {

						if(closeModuleButtonShow && addCloseButtonToPositionTop){
							addCloseButtonToContainer(container);
						}

						if (thisTracking.status == '1') {
							introDiv = scr_createDiv("assessment-block", passMessageText.replace('[retryDate]',nextAttempt.toDateString()), container);
						} else {
							introDiv = scr_createDiv("assessment-block", failMessageText.replace('[retryDate]',nextAttempt.toDateString()), container);
						}

						if(closeModuleButtonShow && addCloseButtonToPositionBottom){
							addCloseButtonToContainer(container);
						}

					} else {
						if (attemptCount > 0) {
							introDiv = scr_createDiv("assessment-block", def.retry.replace('[retryDate]',nextAttempt.toDateString()), container);
						} else {
							introDiv = scr_createDiv("assessment-block", def.introduction, container);
						}
					 }
				} else {
					introDiv = scr_createDiv("assessment-block", def.introduction, container);
				}
			};

			createMessage();
			createContent();

			if (thisTracking.attemptLimit > attemptLimit && attemptLimit > 0) {
				attemptLimit = thisTracking.attemptLimit;
			}

			if (
				(attemptLimit == 0 || attemptCount < attemptLimit)
				&& (thisTracking.status == 0 || retakeAfterPass)
				&& (coolingOffDays == 0 || lastAttempt === "" || now.getTime() - lastAttempt > coolingOffDays * millisecondsInDay)
			) {
				allowRetake = true;
				createStartAssessmentBtn(buttonContainerDiv,"",settings.modlbl_ass);
			}
			if (thisPageContext.pageNo > 1) {
				showBackButton();
			}
			if (attemptCount > 0) {
				thisScore = thisTracking.score + "%";
				showNextButton(thisTracking);
			}
			if (showPoints || passMark == -1) {
				buttonContainerDiv.style.textAlign = "center";
				buttonContainerDiv.style.width = "100%";
				statsContainerDiv.style.display = "none";
			} else {
				if (passMark >= 0) {
					scr_createDiv("assessmentScoreItem assessmentBestScore", settings.modlbl_best + ': ' + thisScore, statsDiv);
					scr_createDiv("assessmentScoreItem assessmentPassmark", settings.modlbl_pass + ': ' + passMark, statsDiv);
				}
				if (attemptLimit > 0) {
					scr_createDiv("assessmentScoreItem assessmentAttempts", settings.modlbl_att + ': ' + attemptCount, statsDiv);
					scr_createDiv("assessmentScoreItem assessmentMaxAttempts", settings.modlbl_max + ': ' + attemptLimit, statsDiv);
				}
				if (coolingOffDays > 0) {
					if (lastAttempt !== "" && (now.getTime() - lastAttempt) < coolingOffDays * millisecondsInDay) {
						scr_createDiv("assessmentScoreItem assessmentMaxAttempts", settings.modlbl_cooloff + ': ' + nextAttempt.toDateString(), statsDiv);
					}
				}
			}
			assessmentElement.innerHTML = "";
			assessmentElement.appendChild(container);
			if (allowRetake) {
				feedbackDiv = document.getElementById("feedbackRetry");
			} else {
				feedbackDiv = document.getElementById("feedbackLocked");
			}
			if (feedbackDiv !== null) {
				feedbackDiv.style.display = "block";
			}
			if (attemptCount > 0 && scoreThresholdArrayLen > 0) {
				for (var i = 0; i < scoreThresholdArrayLen; i++) {
					threshold = scoreThresholdArray[i];
					if (Number(thisTracking.score) >= Number(threshold)) {
						thresholdDiv = document.getElementById("feedback" + threshold);
						if (thresholdDiv !== null) {
							thresholdDiv.style.display = "block";
						}
						break;
					}
				};
			}
		} else {
			createAssessment();
		}
	};

	var getPointsStats = function () {
		var pointsArrayLen = pointsHistoryArray.length;
		var thisAttemptItem = pointsHistoryArray[pointsArrayLen - 1];
		var thisAttempt = thisAttemptItem.split(",");
		var thisScore = 0;
		var score = Number(thisAttempt[0]);
		var maximum = Number(thisAttempt[1]);
		var bestScore = 0;
		var bestMaximum = maximum;
		var maxScore = maximum + getAvailableBonusPoints();
		var percentageScore = 100 * (score / maxScore);
		for (var i = 0; i < pointsArrayLen - 1; i++) {
			thisAttemptItem = pointsHistoryArray[i];
			thisAttempt = thisAttemptItem.split(",");
			thisScore = Number(thisAttempt[0]);
			if (thisScore > bestScore) {
				bestScore = thisScore;
				bestMaximum = Number(thisAttempt[1]);
			}
		};
		var bestPercentageScore = 100 * (bestScore / (bestMaximum + getAvailableBonusPoints()));
		return {
			"attempts": pointsArrayLen,
			"score": score,
			"maximum": maximum,
			"percentageScore": percentageScore,
			"bestScore": bestScore,
			"bestMaximum": bestMaximum,
			"bestPercentageScore": bestPercentageScore
		};
	};

	var getObjectiveArray = function () {
		var i = 0;
		var j = 0;
		var thisResponse = [];
		var objectiveId = "";
		var objectiveCorrect = 0;
		var objectiveTotal = 0;
		var objectivePoints = 0;
		var objectiveAvailablePoints = 0;
		var livesLost = 0;
		var objectiveArray = [];
		var percentageScore;
		for (i = 0; i < objectiveCount; i++) {
			objectiveCorrect = 0;
			objectiveTotal = 0;
			objectiveAvailablePoints = 0;
			objectivePoints = 0;
			livesLost = 0;
			objectiveId = scr_objectives[i].id;
			for (j = 0; j < aAssLen; j++) {
				thisResponse = aAss[j].split(",");
				if (thisResponse[2] > 0 && aQb[thisResponse[0]].questions[thisResponse[1]].objectiveId == objectiveId) {
					objectiveTotal++;
					if (questionPoints > 0) {
						objectiveAvailablePoints += questionPoints;
						if (betWonPoints > 0) {
							objectiveAvailablePoints += betWonPoints;
						}
					}
					if (thisResponse[2] == 2) {
						objectiveCorrect++;
						if (questionPoints > 0) {
							objectivePoints += questionPoints;
							if (betWonPoints > 0 && thisResponse.length >= 5 && thisResponse[4] == 1) {
								objectivePoints += betWonPoints;
							}
						}
					} else {
						if (betLostPoints < 0 && thisResponse.length >= 5 && thisResponse[4] == 1) {
							objectivePoints += betLostPoints;
						}
						if (showLives && (loseLifeType === "answer" || (thisResponse.length >= 5 && thisResponse[4] == 1))) {
							livesLost++;
						}
					}
				}
			};
			if (objectiveTotal > 0) {
				if(objectiveAvailablePoints === 0) {
					objectiveAvailablePoints = objectiveTotal;
					objectivePoints = objectiveCorrect;
				}
				percentageScore = (100 * objectivePoints / objectiveAvailablePoints);
				objectiveArray.push({
					"title": scr_objectives[i].title,
					"description": scr_objectives[i].hasOwnProperty("description") ? scr_objectives[i].description : scr_objectives[i].title,
					"mastery": scr_objectives[i].mastery,
					"correct": objectiveCorrect,
					"total": objectiveTotal,
					"score": objectivePoints,
					"maxScore": objectiveAvailablePoints,
					"percentageScore": percentageScore,
					"livesLost": livesLost
				});
				setObjectiveScore(scr_objectives[i].title, percentageScore);	
			}
		};

		return objectiveArray;
	};

	var getAccessibleScoreTxt = function (props) {
		var score = props.score;
		var percentageScore = props.percentageScore;
		var argShowPoints = props.showPoints;
		var argLabel = props.label;
		var hiddenText = buildVisuallyHiddenElementString(argLabel);
		var scoreText = (argShowPoints) ? score : percentageScore;
		var accessibleText = hiddenText + scoreText;

		return accessibleText;
	};

	var createPillComponent = function (props) {
		var propsObj = (typeof props === "object") ? props : {};
		var argShowPoints = (typeof propsObj.showPoints !== "undefined" && typeof propsObj.showPoints === "boolean")
			? propsObj.showPoints
			: false;
		var argScoreContainer = (typeof propsObj.statsScoreContainer !== "undefined") ? propsObj.statsScoreContainer : null;
		var argScoreType = (typeof propsObj.scoreType !== "undefined") ? propsObj.scoreType : null;
		var argScore = (typeof propsObj.score !== "undefined") ? propsObj.score : null;
		var argMaxScore = (typeof propsObj.maxScore !== "undefined") ? propsObj.maxScore : null;
		var argPassMark = (typeof propsObj.passMark !== "undefined") ? propsObj.passMark : null;
		var argPercentageScore = (typeof propsObj.percentageScore !== "undefined") ? propsObj.percentageScore : null;
		var accessibleScoreText = getAccessibleScoreTxt({
			score: argScore,
			percentageScore: Math.round(argPercentageScore, 0) + '%',
			label: settings.modlbl_score,
			showPoints: argShowPoints
		});
		var accessibleMaxScoreText = getAccessibleScoreTxt({
			score: argMaxScore,
			percentageScore: argPassMark + '%',
			label: settings.modlbl_score_max,
			showPoints: argShowPoints
		});
		var argPlayers = (typeof propsObj.players !== "undefined" && typeof propsObj.players === "number")
			? propsObj.players
			: null;
		var argPosition = (typeof propsObj.position !== "undefined" && typeof propsObj.position === "number")
			? propsObj.position
			: null;
		var isNotMaxScoreType = (argScoreType !== "maxScore");
		var isNotNullScore = (argScore !== null);
		var isNotNullPlayers = (argPlayers !== null);
		var isNotNullPosition = (argPosition !== null);
		var accessibleText = (isNotMaxScoreType && isNotNullScore) ? accessibleScoreText : accessibleMaxScoreText;
		var isNotTotal = (argScoreType.indexOf("Players") < 0);
		var argFillType = isNotTotal ? "fill" : "empty";
		var defaultClassName = (typeof propsObj.defaultClassName === "undefined")
			? "assessmentPill " + argFillType + " assessmentScoreText "
			: propsObj.defaultClassName;
		var argClassName = (argScoreType === "score") ? defaultClassName : defaultClassName + "maxScore";
		var argUserIconClass = (typeof propsObj.userIcon !== "undefined" && typeof propsObj.userIcon === "string") ? propsObj.userIcon : null;
		var isNotNullIconClass = (argUserIconClass !== null);
		var pillElement;
		var pillElementText = accessibleText;
		var userIconContainer;
		var userIcon;
		var i = 0;

		if (isNotNullIconClass) {
			argUserIconClass = "assessmentIcon " + argUserIconClass;
			userIconContainer = createStatsContainer(argUserIconClass);
			setStatState(argScore, argPercentageScore, userIconContainer, argPassMark);
			userIcon = createStatsContainer("", "i");
			userIconContainer.appendChild(userIcon);
			argScoreContainer.appendChild(userIconContainer);
		}

		if (isNotNullPlayers && isNotNullPosition) {
			for (; i < argPlayers; i++) {
				if (i === 0) {
					scr_createDiv(argClassName, argPosition, argScoreContainer);
					scr_createDiv("assessmentScoreText nopadding assessmentScoreTextColor", modlbl_page_of, argScoreContainer);
				}
				if (i === argPlayers - 1) {
					pillElementText = argPlayers;
				}
			}
		} else if (isNotNullPlayers) {
			pillElementText = argPlayers;
		}

		pillElement = scr_createDiv(argClassName, pillElementText, argScoreContainer);

		if (isNotMaxScoreType && isNotNullScore && isNotTotal) {
			setStatState(argScore, argPercentageScore, pillElement, argPassMark);
		}

		return pillElement;
	};

	var createAttemptsElement = function (props) {
		var propsObj = (typeof props === "object") ? props : {};
		var defaultClassName = (typeof propsObj.defaultClassName !== "undefined" && typeof propsObj.defaultClassName === "string")
			? propsObj.defaultClassName
			: "assessmentAttempts";
		var argsAttemptLbl = (typeof propsObj.attemptLbl !== "undefined" && typeof propsObj.attemptLbl === "string")
			? propsObj.attemptLbl
			: null;
		var argsLblMax = (typeof propsObj.attemptLblMax !== "undefined" && typeof propsObj.attemptLblMax === "string")
			? propsObj.attemptLblMax
			: null;
		var argsAttemptsUsed = (typeof propsObj.attemptsUsed !== "undefined" && typeof propsObj.attemptsUsed === "number")
			? propsObj.attemptsUsed
			: null;
		var argsAttemptsLimit = (typeof propsObj.attemptsLimit !== "undefined" && typeof propsObj.attemptsLimit === "number")
			? propsObj.attemptsLimit
			: null;
		var argsStatsResultContainer = (typeof propsObj.statsResultContainer !== "undefined" && typeof propsObj.statsResultContainer === "object")
			? propsObj.statsResultContainer
			: null;
		var i = 1;
		var j = 1;
		var argsAttemptsContainer;
		var argsIcon;
		var argsAttemptLeft = argsAttemptsLimit - argsAttemptsUsed;
		var accessibleAttemptsText = buildVisuallyHiddenElementString(argsAttemptsUsed + modlbl_page_of + argsAttemptsLimit);
		var argsAttemptLblElement = document.createElement("div");
		argsAttemptLblElement.innerHTML = argsAttemptLbl + accessibleAttemptsText;
		argsAttemptLblElement.className = "assessmentAttemptsHeader";
		argsStatsResultContainer.appendChild(argsAttemptLblElement);

		for (; i <= argsAttemptsUsed; i++) {
			argsAttemptsContainer = createStatsContainer(defaultClassName + " cross");
			argsIcon = createStatsContainer("", "i");
			argsAttemptsContainer.appendChild(argsIcon);
			argsStatsResultContainer.appendChild(argsAttemptsContainer);
		}

		for (; j <= argsAttemptLeft; j++) {
			argsAttemptsContainer = createStatsContainer(defaultClassName + " circle");
			argsIcon = createStatsContainer("", "i");
			argsAttemptsContainer.appendChild(argsIcon);
			argsStatsResultContainer.appendChild(argsAttemptsContainer);
		}
		return argsStatsResultContainer;
	};

	var createStatsContainer = function (className, htmlElement) {
		var argsClassName = className;
		var argsClassNameLen = argsClassName.length;
		var argsHtmlElement = (typeof htmlElement !== "undefined" && typeof htmlElement === "string") ? htmlElement : "div";
		var statsContainer = document.createElement(argsHtmlElement);
		if (typeof argsClassName !== "undefined" && argsClassNameLen) {
			statsContainer.className = argsClassName;
		}
		return statsContainer;
	};



	var buildStatsComponent = function (statsInitObj) {
		var statsInit = function (props) {
			var propsObj = (typeof props !== "undefined" && typeof props === "object") ? props : {};
			var statsContainer = createStatsContainer("assessmentStats");
			var statScoreContainer = createStatsContainer("assessmentScoreContainer");
			var statsBarContainer = createStatsContainer("assessmentScoreBar");
			var argsMaxScore = (typeof (propsObj.maxScore) !== "undefined" && typeof propsObj.maxScore === "number") ? propsObj.maxScore : null;
			var argsPassMark = (typeof (propsObj.passMark) !== "undefined" && typeof propsObj.passMark === "number") ? propsObj.passMark : null;
			var argsPercentageScore = (propsObj.percentageScore !== null) ? propsObj.percentageScore : null;
			var argsScore = (typeof (propsObj.score) !== "undefined" && typeof propsObj.score === "number" !== null) ? propsObj.score : null;
			var argScoreType = propsObj.scoreType;
			var argsUserIcon = (typeof propsObj.userIcon !== "undefined" && typeof propsObj.userIcon === "string")
				? propsObj.userIcon
				: null;
			var argsPlayers = (typeof propsObj.players !== "undefined" && typeof propsObj.players === "number")
				? propsObj.players
				: null;
			var argsPosition = (typeof propsObj.players !== "undefined" && typeof propsObj.position === "number")
				? propsObj.position
				: null;
			var argShowPoints = (typeof propsObj.showPoints !== "undefined" && typeof propsObj.showPoints === "boolean")
				? propsObj.showPoints
				: false;
			return {
				statsContainer: statsContainer,
				statsScoreContainer: statScoreContainer,
				statsBarContainer: statsBarContainer,
				score: argsScore,
				percentageScore: argsPercentageScore,
				maxScore: argsMaxScore,
				passMark: argsPassMark,
				scoreType: argScoreType,
				userIcon: argsUserIcon,
				players: argsPlayers,
				position: argsPosition,
				showPoints: argShowPoints
			};
		};

		var thisInitObj = statsInit(statsInitObj);
		var statsContainer = thisInitObj.statsContainer;
		var statScoreContainer = thisInitObj.statsScoreContainer;
		var progressBarContainer = thisInitObj.statsBarContainer;
		var score = thisInitObj.score;
		var percentageScore = thisInitObj.percentageScore;
		var maxScore = thisInitObj.maxScore;
		var passMark = thisInitObj.passMark;
		var scoreType = thisInitObj.scoreType;
		var userIcon = thisInitObj.userIcon;
		var players = thisInitObj.players;
		var position = thisInitObj.position;
		var scoreTypeArr = ["learningObjectives"];
		var showBestScoreProgress = ((thisInitObj.scoreType == 'bestScore') && (summaryPercentageScore == 0));
		var correctResponsesProgressBar = (summaryPercentageScore == 1) && (thisInitObj.scoreType == 'correctResponses');
		var shouldAppendProgressBar = (scoreTypeArr.indexOf(scoreType) !== -1);
		
		var showPts = thisInitObj.showPoints;
		var scorePillComponent = createPillComponent({
			score: score,
			maxScore: maxScore,
			percentageScore: percentageScore,
			scoreType: scoreType,
			statsScoreContainer: statScoreContainer,
			passMark: passMark,
			userIcon: userIcon,
			players: players,
			position: position,
			showPoints: showPts
		});
		var progressBarComponent = createStatsBar(score, percentageScore, progressBarContainer, passMark);
		statScoreContainer.appendChild(scorePillComponent);
		if (shouldAppendProgressBar || correctResponsesProgressBar || showBestScoreProgress) {
			statScoreContainer.appendChild(progressBarComponent);
		}
		statsContainer.appendChild(statScoreContainer);
		return statsContainer;
	};

	var setStatState = function (score, percentageScore, element, passMark) {
		var argElement = element;
		var argScore = score;
		var argPercentageScore = percentageScore;
		var argPassMark = passMark;
		var elementClassName = element.className;
		var isIconClass = (elementClassName.indexOf("assessmentIcon") !== -1);
    	var colorString = "assessmentAmber";

		var getIconClass = function (props) {
			var propObj = props;
			var argColor = propObj.color;
			var argBool = propObj.bool;
			var iconClass = propObj.elemClassName + " " + argColor + " " + argColor+"Border";
			if (argBool) {
				iconClass = propObj.elemClassName + " " + argColor + "Color";
			}
			return iconClass;
		};

		if (argScore <= 0) {
			colorString = "assessmentRed";
		} else if (argPercentageScore >= argPassMark) {
			colorString = "assessmentGreen";
		}
		argElement.className = getIconClass({
			elemClassName: elementClassName,
			bool: isIconClass,
			color: colorString
		});
	};

	var createStatsBar = function (score, percentageScore, container, passMark) {
		var progressBarContainer = container;
		var progressBar = scr_createDiv("assessmentScoreValue", "", progressBarContainer);
		var argPassMark = passMark;
		var argScore = score;
		var argPercentageScore = percentageScore;
		var statsBarTimeOut;
		clearTimeout(statsBarTimeOut);
		statsBarTimeOut = setTimeout(function () {
			progressBar.style.width = argPercentageScore + "%";
		}, 400);
		setStatState(argScore, argPercentageScore, progressBar, argPassMark);
		return progressBarContainer;
	};

	var setObjectiveStyles = function (props) {
		var argQuestions = props.questions;
		var argCorrect = props.correct;

		argQuestions.style.width = "50%";
		argCorrect.style.width = "50%";
	};


	var createObjectiveFeedback = function (props) {
		var objectiveArr = props.objectiveArr;
		var objectivesDiv = props.objectivesDiv;
		var objectiveArrLen = objectiveArr.length;
		var lblContainerArr = props.lblContainerArr;
		var statsContainer = scr_createDiv("contentRow", "", objectivesDiv);
		var objectiveArrayItem;
		var arrItemAcessibleTxt;
		var percentageScore;
		var statsRow;
		var stats;
		var spacer;
		var i = 0;

		var createObjectiveColumns = function (lblArr) {
			var scorelblContainer = lblArr[0];
			var lblContainer = lblArr[1];
			var statsLabelContainer = (typeof lblContainer !== "undefined" && typeof lblContainer === "object")
				? lblContainer
				: document.createElement("div");
			scr_createDiv("assessmentObjectiveLabel", settings.modlbl_obj_score, scorelblContainer);
			scr_createDiv("spacerObjective", "&nbsp;", scorelblContainer);
			var questions = scr_createDiv("assessmentObjectiveLabel", settings.modlbl_obj_questions, statsLabelContainer);
			var correct = scr_createDiv("assessmentObjectiveLabel", settings.modlbl_obj_correct, statsLabelContainer);
			setObjectiveStyles({ questions: questions, correct: correct });
			return statsLabelContainer;
		};

		createObjectiveColumns(lblContainerArr);

		for (; i < objectiveArrLen; i++) {
			objectiveArrayItem = objectiveArr[i];
			statsRow = scr_createDiv("", "", statsContainer);
			stats = scr_createDiv("contentblock75", "", statsRow);
			arrItemAcessibleTxt = buildVisuallyHiddenElementString(settings.modlbl_obj) + objectiveArrayItem.description;
			scr_createDiv("assessmentObjectiveLabel", arrItemAcessibleTxt, stats);
			percentageScore = getPercentageScore({ score: objectiveArrayItem.score, maxScore: objectiveArrayItem.maxScore });
			
			stats.appendChild(buildStatsComponent({
				score: objectiveArrayItem.score,
				percentageScore: percentageScore,
				maxScore: objectiveArrayItem.maxScore,
				passMark: passMark,
				scoreType: "learningObjectives",
				showPoints: showPoints
			}));

			stats = scr_createDiv("contentblock25", "", statsRow);
			spacer = scr_createDiv("assessmentObjectiveLabel", "&nbsp;", stats);
			spacer.setAttribute("aria-hidden", "true");
			stats.appendChild(createObjQuestionStats({
				correct: objectiveArrayItem.correct,
				total: objectiveArrayItem.total,
				livesLost: objectiveArrayItem.livesLost
			}));
		}
	};

	var createObjQuestionStats = function (props) {
		var argTotal = props.total;
		var argLivesLost = props.livesLost;
		var argCorrect = props.correct;
		var statsBarContainer = createStatsContainer("assessmentStats");
		var qAccessibleText = buildVisuallyHiddenElementString(settings.modlbl_obj_questions) + argTotal;
		var questionsText = scr_createDiv("assessmentObjectiveLabel", qAccessibleText, statsBarContainer);
		var cAccessibleText = buildVisuallyHiddenElementString(settings.modlbl_question_correct) + argCorrect;
		var correctText = scr_createDiv("assessmentObjectiveLabel", cAccessibleText + " ", statsBarContainer);
		var i;
		var lifeIcon;

		setObjectiveStyles({ questions: questionsText, correct: correctText });

		if (showLives) {
			for (i = 0; i < argLivesLost; i++) {
				lifeIcon = document.createElement("img");
				lifeIcon.src = settings.mcqLifeCutIcon;
				lifeIcon.style.width = "20px";
				lifeIcon.style.height = "20px"; // we specify the height because of issues with IE<10
				correctText.appendChild(lifeIcon);
			}
		}
		questionsText.style.color = "inherit";
		correctText.style.color = "inherit";

		return statsBarContainer;
	};

	var numberIsFinite = function (num) {
		if (Number.isFinite === undefined) {
			Number.isFinite = function (value) {
				return typeof value === 'number' && isFinite(value);
			}
		}
		return Number.isFinite(num);
	};

	var getPercentageScore = function (props) {
		var propsObj = (typeof props !== "undefined" && typeof props === "object")
			? props
			: {score: null, maxScore: null};
		var score = (typeof propsObj.score !== "undefined" && typeof propsObj.score === "number")
			? propsObj.score : Number(propsObj.score);
		var maxScore = (typeof propsObj.maxScore !== "undefined" && typeof propsObj.maxScore === "number")
			? propsObj.maxScore
			: Number(propsObj.maxScore);
		var result = Math.round(100 * score / maxScore, 0);
		if (!numberIsFinite(result)) { result = 0; }
		return result;
	};

	var createLeaderBoard = function (lbInitObj) {
		var statsInit = function (props) {
			var argsObj = (typeof props !== "undefined" && typeof props === "object") ? props : {};
			var peerStatsObj = (typeof argsObj.peerStats !== "undefined" && typeof argsObj.peerStats === "object")
				? argsObj.peerStats
				: null;
			var argsLbArr = (typeof peerStatsObj.leaderBoard !== "undefined" && Array.isArray(peerStatsObj.leaderBoard))
				? peerStatsObj.leaderBoard
				: [];
			var argsLbArrCount = argsLbArr.length;
			var divisor = 10;
			var minCount = 10;
			var showLeaderBoard = argsLbArrCount < minCount ? false : true;
			var argsParentWrapper = (typeof argsObj.parentWrapper !== "undefined" && typeof argsObj.parentWrapper === "object")
				? argsObj.parentWrapper
				: null;
			var argsMaximum = (typeof argsObj.maxScore !== "undefined" && typeof argsObj.maxScore === "number")
				? argsObj.maxScore
				: null;
			var argsShowPoints = (typeof argsObj.showPoints !== "undefined" && typeof argsObj.showPoints === "boolean")
				? argsObj.showPoints
				: null;
			var argsPassMark = (typeof argsObj.passMark !== "undefined" && typeof argsObj.passMark === "number")
				? argsObj.passMark
				: null;
			var argsContainer = (typeof argsObj.container !== "undefined" && typeof argsObj.container === "object")
				? argsObj.container
				: null;
			var argsAssElement = (typeof argsObj.assElement !== "undefined" && typeof argsObj.assElement === "object")
				? argsObj.assElement
				: null;
			if (!showLeaderBoard) {
				try {
					throw "error: leaderBoard count is less than 10";
				} catch (e) {
					return {
						showLb: false
					};
				}
			}

			var lbParentWrapper = scr_createDiv("assessment-block nopadding", "", argsParentWrapper);
			var lbWrapper = scr_createDiv("assessmentLeaderBoard assessment-analytics", "", lbParentWrapper);
			var lbPaddingDiv = scr_createDiv("mediumElevation", "", lbWrapper);
			var lbContainer = scr_createDiv("assessment-analytics", "", lbPaddingDiv);
			var assessmentSection = scr_createDiv("assessmentSection", "Leader Board", lbPaddingDiv);

			var liWrapper = function (props) {
				var propsObj = props;
				var argShowPoints = propsObj.showPoints;
				var argMaxScore = propsObj.maxScore
				var argPercentageScore = propsObj.percentageScore;
				var argScore = propsObj.score;
				var argPlayer = propsObj.player;
				var argPassMark = propsObj.passMark;
				var hasScore = (typeof argScore !== "undefined" && typeof argScore === "number");
				var classAttr = (hasScore) ? 'assessmentInnerLi' : "";
				var listScore = document.createElement('li');
				var listPlayer = document.createElement('li');
				var listPlayerText = document.createTextNode(argPlayer);
				var listContainer = propsObj.listContainer;
				var statScoreContainer = document.createElement('div');
				var pillElement = createPillComponent({
					score: argScore,
					maxScore: argMaxScore,
					percentageScore: argPercentageScore,
					scoreType: "score",
					statsScoreContainer: statScoreContainer,
					passMark: argPassMark,
					showPoints: argShowPoints
				});

				listScore.className = classAttr;
				listPlayer.className = classAttr + " truncate";
				listPlayer.appendChild(listPlayerText);

				if (hasScore) {
					listScore.appendChild(pillElement)
				}
				listContainer.appendChild(listScore);
				listContainer.appendChild(listPlayer);

				return listContainer;
			};

			return {
				peerStats: peerStatsObj,
				lbArr: argsLbArr,
				lbArrCount: argsLbArrCount,
				lbArrHasItems: argsLbArrCount > 0,
				lbParentWrapper: lbParentWrapper,
				lbWrapper: lbWrapper,
				lbPaddingDiv: lbPaddingDiv,
				lbContainer: lbContainer,
				showLb: showLeaderBoard,
				divisor: divisor,
				assSection: assessmentSection,
				assElement: argsAssElement,
				container: argsContainer,
				maxScore: argsMaximum,
				showPts: argsShowPoints,
				passMark: argsPassMark,
				liWrapper: liWrapper,
				prevScore: 0,
				currScore: 0,
				counterReset: 0,
				currPlayerClass: 'assessmentCurrentPlayer'
			};
		};

		var initObj = statsInit(lbInitObj);
		if (typeof initObj.showLb === "boolean" && !initObj.showLb) { return initObj.showLb; }
		var assElement = initObj.assElement;
		var assContainer = initObj.container;
		var argsPassMark = initObj.passMark;
		var argsMaxScore = initObj.maxScore;
		var argsShowPoints = initObj.showPts;
		var lbParentWrapper = initObj.lbParentWrapper;
		var lbWrapper = initObj.lbWrapper;
		var lbPaddingDiv = initObj.lbPaddingDiv;
		var lbContainer = initObj.lbContainer;
		var lbOL;
		var lbLI;
		var lbUL;
		var lbChunkArr = chunkArray(initObj.lbArr, initObj.divisor);
		var lbChunkArrLen = lbChunkArr.length;
		var thisArr = [];
		var thisArrLen = thisArr.length;
		var prevArr = [];
		var prevArrLen = prevArr.length;
		var prevChunkCount;
		var prevScore = initObj.prevScore;
		var currScore = initObj.currScore;
		var currPlayer;
		var currPercentageScore;
		var counterReset = initObj.counterReset;
		var currPlayerClass = initObj.currPlayerClass;
		var i = 0;
		var index;

		if (initObj.lbArrHasItems > 0) {
			lbContainer.style.position = "relative";
			lbContainer.style.overflowX = "auto";
			lbContainer.style.overflowY = "hidden";

			for (; i < lbChunkArrLen; i++) {
				lbOL = document.createElement('ol');
				lbOL.className = 'assessmentOlLeaderBoard';
				lbOL.style.position = "absolute";
				thisArr = lbChunkArr[i];
				thisArrLen = thisArr.length;
				prevChunkCount = prevArrLen * i;

				for (index = 0; index < thisArrLen; index++) {
					lbLI = document.createElement('li');
					currPlayerClass = (Number(thisArr[index].isCurrentPlayer)) ? initObj.currPlayerClass : '';
					lbLI.className = currPlayerClass;
					lbUL = document.createElement('ul');
					lbUL.className = 'assessmentInnerUl';
					currScore = Number(thisArr[index].score);
					lbLI.className = currPlayerClass;

					if (currScore === prevScore) {
						lbLI.className = currPlayerClass + ' assNoResetCount';
						// if this is not the first item with the same score increment counterReset
						if (index) { counterReset++; }
					} else {
						counterReset = prevChunkCount + index;
					}

					lbLI.style.counterReset = 'leaderboard-counter ' + counterReset;
					currPlayer = thisArr[index].player;
					currPercentageScore = getPercentageScore({ score: currScore, maxScore: argsMaxScore });
					initObj.liWrapper({
						score: currScore,
						player: currPlayer,
						listContainer: lbUL,
						percentageScore: currPercentageScore,
						maxScore: argsMaxScore,
						passMark: argsPassMark,
						showPoints: argsShowPoints
					});

					lbLI.appendChild(lbUL);
					lbOL.appendChild(lbLI);
					prevScore = currScore;
				}

				lbContainer.appendChild(lbOL);
				lbPaddingDiv.appendChild(lbContainer);
				lbWrapper.appendChild(lbPaddingDiv);
				lbParentWrapper.appendChild(lbWrapper);
				assContainer.appendChild(lbParentWrapper);
				assElement.appendChild(assContainer);
				prevArr = thisArr;
				prevArrLen = prevArr.length;
			}

			leaderBoardSetStyles({
				leaderBoardOL: '.' + lbOL.className,
				leaderBoardContainer: lbContainer
			});
		}
	};

	var getElementComputedStyle = function (styleObj) {
		var $element = styleObj.element;
		var cssProp = styleObj.cssProp;
		var CompStyle = window.getComputedStyle($element, null);

		return CompStyle.getPropertyValue(cssProp);
	};

	var leaderBoardSetStyles = function (props) {
		var propsObj = props;
		var LBOLCLASS = propsObj.leaderBoardOL;
		var argsLBContainer = propsObj.leaderBoardContainer;
		var $LBOL = document.querySelectorAll(LBOLCLASS);

		$LBOL.forEach(function (element, index, array) {
			element.style.left = element.offsetWidth * index + "px";
			if (!index) {
				element.style.left = getElementComputedStyle({ element: argsLBContainer, cssProp: "padding-left" });
				argsLBContainer.style.minHeight = (function () {
					var lbOLHeight = element.offsetHeight;
					var pTop = parseInt(getElementComputedStyle({ element: argsLBContainer, cssProp: "padding-top" }), 10);
					var pBottom = parseInt(getElementComputedStyle({ element: argsLBContainer, cssProp: "padding-bottom" }), 10);

					return lbOLHeight + pTop + pBottom + "px";
				})();
			}
		})
	};

	var createFeedback = function (peerStatsObj) {
		if (showSummaryPage) {
			updatePathAndProgress(false);
			var thisTracking = getTracking(assessmentId);
			var bestScore = thisTracking.score;
			var attemptsUsed = thisTracking.attempts.length;
			var thisScore = thisTracking.attempts[attemptsUsed - 1].score;
			var container = document.createElement("div");
			var textContainerDiv = scr_createDiv("assessment-block nopadding", "", container);
			var maxBonusPoints = getAvailableBonusPoints();
			var attemptLimit = def.attemptLimit;
			var passedOfFailed = ((attemptsUsed >= attemptLimit) && (attemptLimit != 0) || thisTracking.status == '1');
			if(passedOfFailed && closeModuleButtonShow && addCloseButtonToPositionTop){
				addCloseButtonToContainer(textContainerDiv);
			}

			var textDiv = scr_createDiv("assessment-analytics", "", textContainerDiv);

			if(passedOfFailed && closeModuleButtonShow && addCloseButtonToPositionBottom){
				addCloseButtonToContainer(textContainerDiv);
			}
			var navDiv = scr_createDiv("assessment-block nopadding", "", container);
			var statsContainerDiv = scr_createDiv("assessment-analytics", "", navDiv);
			var statsDiv = scr_createDiv("contentblock50 vAlignTop", "", statsContainerDiv);
			var otherPlayersDiv = scr_createDiv("contentblock50 vAlignTop", "", statsContainerDiv);
			var buttonContainerDiv = scr_createDiv("", "", navDiv);
			var objectiveArray = getObjectiveArray();
			var objectiveArrLen = objectiveArray.length;
			var objectivesContainerDiv;
			var objectivesDiv;
			var objectivesRow;
			var objectivesTitle;
			var detailContainerDiv;
			var stats;
			var statsLabelContainer;
			var detailDiv;
			var aAssItem;
			var pointsStats;
			var i;
			var allowRetake = true;
			var feedbackDiv;
			var thresholdDiv;
			var threshold = 100;
			var statsResultContainer;
			var peerStatsArray = [];
			var peerStatsCount;
			var prefix = "assessment";
			var peerClassName;
			var peerLblPrefix = 'modlbl_peer_';
			var peerLblSuffix;
			var percentageScore;
			var assessmentSection;
			var assessmentIconUsers;
			var now = new Date();
			var lastAttempt = Number(getDataValue(assessmentId + "-time"));
			var millisecondsInDay = 86400000;
			var nextAttempt = new Date(lastAttempt + (coolingOffDays + 1) * millisecondsInDay);
			var passText = passMessageText.replace('[retryDate]',nextAttempt.toDateString());
			var failText = failMessageText.replace('[retryDate]',nextAttempt.toDateString());
			var retryText = def.retry.replace('[retryDate]',nextAttempt.toDateString());
			var correctResponses = getTotalScore() + ' / ' + aAssLen;
			var percentageScoreCorrectResponses = Number(100 * getTotalScore() / aAssLen);

			if ((thisScore >= passMark && !retakeAfterPass && passMark >= 0) || (def.attemptLimit > 0 && attemptsUsed >= def.attemptLimit)) {
				allowRetake = false;
			}
			if ((thisScore >= passMark && passMark >= 0) || (passMark == -1 && (getLives().lost < getLives().total))) {
				textDiv.innerHTML = passText;
			} else if (attemptLimit > 0 && attemptsUsed >= attemptLimit) {
				textDiv.innerHTML = failText;
			} else {
				textDiv.innerHTML = retryText;
			}

			if (allowRetake && coolingOffDays == 0) {
				createStartAssessmentBtn(buttonContainerDiv,"retry button",settings.modlbl_retry);
				buttonContainerDiv.className = "assessmentButtonContainer";
				statsContainerDiv.appendChild(buttonContainerDiv);
			}
			
			if(showPoints) {
				pointsStats = getPointsStats();
				statsLabelContainer = scr_createDiv("assessmentSection", "<span>" + settings.modlbl_score + "</span>", statsDiv);
				statsLabelContainer.appendChild(buildStatsComponent({
					score: pointsStats.score,
					percentageScore: pointsStats.percentageScore,
					passMark: passMark,
					scoreType: "score",
					userIcon: "user",
					showPoints: showPoints
				}));

				if (showPreviousBest && pointsStats.attempts > 1) {
					stats = scr_createDiv("assessmentBestScore", settings.modlbl_best, statsDiv);
					statsDiv.appendChild(buildStatsComponent({
						score: pointsStats.bestScore,
						percentageScore: pointsStats.bestPercentageScore,
						passMark: passMark,
						scoreType: "bestScore",
						showPoints: showPoints
					}));
				}

				stats = scr_createDiv("assessmentMaxScore", settings.modlbl_score_max, statsDiv);
				statsDiv.appendChild(buildStatsComponent({
					maxScore: pointsStats.maximum,
					passMark: passMark,
					scoreType: "maxScore",
					showPoints: showPoints
				}));

				if (timeBasedPoints > 0) {
					stats = scr_createDiv("assessmentMaxScore", settings.modlbl_bonus_max, statsDiv);
					statsDiv.appendChild(buildStatsComponent({
						maxScore: maxBonusPoints,
						passMark: passMark,
						scoreType: "maxBonus",
						showPoints: showPoints
					}));
				}

				if (summaryPercentageScore == 1) {
					stats = scr_createDiv("assessmentMaxScore", settings.modlbl_your_responses, statsDiv);
					statsDiv.appendChild(buildStatsComponent({
						score: correctResponses,
						passMark: passMark,
						scoreType: "correctResponses",
						percentageScore: percentageScoreCorrectResponses,
						showPoints: showPoints
					}));
				}


				if (showPeerComparison) {
					if (peerStatsObj.hasOwnProperty('error')) {
						stats = scr_createDiv("assessmentError", peerStatsObj.error, statsDiv);
						stats.style.color = "#990000";

					}

					if (peerStatsObj.hasOwnProperty("position")) {
						stats = scr_createDiv("assessmentRankPlayers", settings.modlbl_peer_rank, statsDiv);
						statsDiv.appendChild(buildStatsComponent({
							scoreType: "rankPlayers",
							position: Number(peerStatsObj.position),
							players: Number(peerStatsObj.players),
							showPoints: showPoints
						}));
					}
				}

				if (attemptLimit > 0) {
					statsResultContainer = createStatsContainer("assessment-stats-result-container");
					stats = createAttemptsElement({
						statsResultContainer: statsResultContainer,
						attemptsUsed: attemptsUsed,
						attemptsLimit: Number(attemptLimit),
						attemptLbl: settings.modlbl_att,
						attemptLblMax: settings.modlbl_max
					});
					statsDiv.appendChild(statsResultContainer);
				}

				if (showPeerComparison) {
					if (peerStatsObj.hasOwnProperty("statistics")) {
						i = 0;
						peerStatsArray = peerStatsObj.statistics;
						peerStatsCount = peerStatsArray.length;
						prefix = "assessment";
						assessmentSection = scr_createDiv("assessmentSection", "<span>" + settings.modlbl_peer_otherPlayers + "</span>", otherPlayersDiv);
						stats = scr_createDiv("assessmentStats", "", assessmentSection);
						assessmentIconUsers = scr_createDiv("assessmentIcon users", "<i></i>", stats);
						assessmentSection.style.marginBottom = "10px";
						assessmentIconUsers.style.marginTop = "10px";
						otherPlayersDiv.appendChild(assessmentSection);

						if (peerStatsCount > 0) {
							for (; i < peerStatsCount; i++) {
								peerClassName = prefix + peerStatsArray[i].label.split(" ").join("");
								peerLblSuffix = SKILLCASTAPI.capitalizeString({ str: peerStatsArray[i].label, camelCase: true });
								stats = scr_createDiv(peerClassName, settings[peerLblPrefix + peerLblSuffix], otherPlayersDiv);
								percentageScore = getPercentageScore({ score: peerStatsArray[i].points, maxScore: pointsStats.bestMaximum });

								otherPlayersDiv.appendChild(buildStatsComponent({
									score: peerStatsArray[i].points,
									percentageScore: percentageScore,
									passMark: passMark,
									scoreType: "bestScore",
									showPoints: showPoints
								}));
							};

							stats = scr_createDiv("assessmentTotalPlayers", settings.modlbl_peer_totalPlayers, otherPlayersDiv);
							otherPlayersDiv.appendChild(buildStatsComponent({
								scoreType: "totalPlayers",
								players: Number(peerStatsObj.players),
								showPoints: showPoints
							}));
						}
					}

					if (peerStatsObj.hasOwnProperty("leaderBoard")) {
						createLeaderBoard({
							peerStats: peerStatsObj,
							parentWrapper: statsDiv,
							maxScore: pointsStats.maximum,
							passMark: passMark,
							showPoints: showPoints,
							container: container,
							assElement: assessmentElement
						});
					}
				}
			} else {
				if (passMark >= 0) {
					scr_createDiv("assessmentScore", settings.modlbl_score + ": " + thisScore + "%", statsDiv);
					scr_createDiv("assessmentBestScore", settings.modlbl_best + ": " + bestScore + "%", statsDiv);
					scr_createDiv("assessmentPassmark", settings.modlbl_pass + ": " + passMark + "%", statsDiv);
				}
				if (attemptLimit > 0) {
					scr_createDiv("assessmentAttempts", settings.modlbl_att + ": " + attemptsUsed, statsDiv);
					scr_createDiv("assessmentMaxAttempts", settings.modlbl_max + ": " + attemptLimit, statsDiv);
				}
				if (coolingOffDays > 0) {
					if (lastAttempt !== "" && (now.getTime() - lastAttempt) < coolingOffDays * millisecondsInDay) {
						scr_createDiv("assessmentScoreItem", settings.modlbl_cooloff + ": " + nextAttempt.toDateString(), statsDiv);
					}
				}
			}

			if (showObjectives && objectiveArrLen > 0) {
				objectivesContainerDiv = scr_createDiv("assessment-block nopadding", "", container);
				objectivesPaddingDiv = scr_createDiv("assessment-objective-analytics", "", objectivesContainerDiv);
				objectivesPaddingDiv = scr_createDiv("mediumElevation", "", objectivesPaddingDiv);
				objectivesTitle = scr_createDiv("assessmentSection", settings.modlbl_obj, objectivesPaddingDiv);
				objectivesDiv = scr_createDiv("assessment-objective-analytics", "", objectivesPaddingDiv);
				objectivesRow = scr_createDiv("contentRow", "", objectivesDiv); // class, content, container
				stats = scr_createDiv("contentblock75", "", objectivesRow);
				statsLabelContainer = scr_createDiv("contentblock25", "", objectivesRow);

				createObjectiveFeedback({ objectiveArr: objectiveArray, objectivesDiv: objectivesDiv, lblContainerArr: [stats, statsLabelContainer] });
			}
			if (showSummaryFeedback == 2 || showSummaryFeedback == 1 && thisScore >= passMark && passMark >= 0) {
				detailContainerDiv = scr_createDiv("assessment-block nopadding", "", container);
				detailDiv = scr_createDiv("fullheight80 assessment-container", "", detailContainerDiv);
				detailDiv.style.overflowY = "scroll";
				for (var i = 0; i < aAssLen; i = i + 1) {
					aAssItem = aAss[i].split(",");
					if (showAllFeedback || aAssItem[2] == 1) {
							renderSolution(aAssItem, detailDiv);
							
						
					}
				}
			}
			SKILLCASTAPI.hideNext();
			showNextButton(thisTracking);
			SKILLCASTAPI.showBack();
			$("#scr_progress_outer").css("display", "block");
			$(".title-td").css("display", "block");
			assessmentElement.innerHTML = "";
			assessmentElement.appendChild(container);
			if (allowRetake) {
				feedbackDiv = document.getElementById("feedbackRetry");
			} else {
				feedbackDiv = document.getElementById("feedbackLocked");
			}
			if (feedbackDiv !== null) {
				feedbackDiv.style.display = "block";
			}
			if (scoreThresholdArrayLen > 0) {
				for (var i = 0; i < scoreThresholdArrayLen; i++) {
					threshold = scoreThresholdArray[i];
					if (thisScore >= Number(threshold)) {
						thresholdDiv = document.getElementById("feedback" + threshold);
						if (thresholdDiv !== null) {
							thresholdDiv.style.display = "block";
						}
						break;
					}
				};
			}
			unlockAssessment();
		} else {
			SKILLCASTAPI.gotoPage(thisPageNo + 2);
		}
	};

	function showNextButton(thisTracking) {
		if(thisTracking.status == 1) {
			if(nextButtonPass == "_next" && thisPageContext.pageNo < thisPageContext.totalPages) {
				nextPage = function() {
					SKILLCASTAPI.gotoPage(thisPageContext.pageNo+1);
				}
				SKILLCASTAPI.showNext();
			} else if(nextButtonPass.length > 0) {
				nextPage = function() {
					SKILLCASTAPI.gotoPageId(nextButtonPass);							
				}
				SKILLCASTAPI.showNext();						
			}
		} else if(thisTracking.attemptLimit > 0 && thisTracking.attempts.length >= thisTracking.attemptLimit) {
			if(nextButtonFail === "_next" && thisPageContext.pageNo < thisPageContext.totalPages) {
				nextPage = function() {
					SKILLCASTAPI.gotoPage(thisPageContext.pageNo+1);
				}
				SKILLCASTAPI.showNext();
			} else if(nextButtonFail.length > 0) {
				nextPage = function() {
					SKILLCASTAPI.gotoPageId(nextButtonFail);							
				}
				SKILLCASTAPI.showNext();						
			}					
		}		
	};
	
	function renderSolution(aAssItem,detailDiv) {
		var qb = aAssItem[0];
		var q = aAssItem[1];
		var qStatus = aAssItem[2];
		var response = (aAssItem.length >= 4) ? aAssItem[3].split("*") : [];
		var responseNo = response.map(Number);
		var solution = document.createElement("div");
		var question = aQb[qb].questions[q];
		var optionCount = question.options.length;
		var questionDiv = scr_createDiv("", question.content, solution);
		var optionsDiv = scr_createDiv("", "", solution);
		var i = 0;
		var selected = false;
		var correct = false;
		var borderClass = 'assessment-option-border-ready';
		var optionHtml = {};
		var explanationDiv;
		var showSolution = (showSolutionInFeedback == 1 || (qStatus == 2 && showSolutionInFeedback == 2));
		var showExplanation = showExplanationInFeedback == 1 || (showExplanationInFeedback == 2 && qStatus == 2);
		if (showExplanation) {
			explanationDiv = scr_createDiv("", question.explanation, solution);
		} 
		for (i = 0; i < optionCount; i++) {
			selected = (responseNo.indexOf(i + 1) >= 0);
			correct = (question.options[i].c == 1) ? true : false;
			if (selected) {
				if (showSolution) {
					if (correct) {
						borderClass = 'assessment-option-border-correct assessment-option-border-correct-selected';
					} else {
						borderClass = 'assessment-option-border-incorrect assessment-option-border-incorrect-selected';
					}
				} else {
					borderClass = 'assessment-option-border-selected';
				}
			} else {
				if (showSolution) {
					if (correct) {
						borderClass = 'assessment-option-border-notselected assessment-option-border-correct-notselected';
					} else {
						borderClass = 'assessment-option-border-notselected assessment-option-border-incorrect-notselected';
					}
				} else {
					borderClass = 'assessment-option-border-notselected';
				}
			}
			optionHtml = createOptionButton(question.options[i], question.correctOptions);
			optionHtml.optionBorder.className = borderClass;
			if (selected) {
				optionHtml.optionMarker.checked = true;
			}
			if (showSolution) {
				optionHtml.optionMarker.appendChild(addMarker(correct));
			}
			optionsDiv.appendChild(optionHtml.optionContainer);
		}
		
		detailDiv.appendChild(solution);
	};

	function elementTimeOutFocus(props) {
		var element = props.element;
		var delay = props.delay || 0;
		var tabIDX = props.tabIDX || -1;
		var thisTimeOut;
		if (element !== undefined) {
			thisTimeOut = setTimeout(function () {
				setFocus({
					element: element,
					tabIDX: tabIDX
				});
			}, delay);
		}
		return thisTimeOut;
	};

	function setFocus(props) {
		var element = props.element;
		var tabIDX = props.tabIDX || -1;
		if (element !== undefined) {
			element.tabIndex = tabIDX;
			element.focus();
		}
	};

	function buildVisuallyHiddenElementString(label) {
		return "<span class='visually-hidden'>" + label + " &nbsp;</span>";
	};

	function matchCardHeights(props) {
		var element = props.element;
		var cardImg = props.cardImg;
		clearTimeout(matchCardTimeOut);
		matchCardTimeOut = setTimeout(function () {
			var elementHeight = Math.max(element.clientHeight, element.offsetHeight);
			cardImg.style.height = elementHeight + 'px';
		}, 0);
	}

	function chunkArray(arr, chunkSize) {
		var argChunkSize = chunkSize;
		var arrJSON = JSON.stringify(arr);
		var tempArr = JSON.parse(arrJSON);
		var resultArr = [];
		while (tempArr.length) {
			resultArr.push(tempArr.splice(0, argChunkSize));
		}
		return resultArr;
	};

	function resizeFunction(event) {
		var element = event.data.element;
		var cardImg = event.data.cardImg;
		var leaderBoard = event.data.leaderBoard;
		var delay = event.data.delay || 100;
		var $element = document.querySelector(element);
		var $cardImg = document.querySelector(cardImg);
		var $leaderBoard = document.querySelectorAll(leaderBoard);
		var existsOnPage = $element !== null || $cardImg !== null;

		clearTimeout(resizeTimeOut);
		if (existsOnPage) {
			resizeTimeOut = setTimeout(function () {
				matchCardHeights({ element: $element, cardImg: $cardImg });
			}, delay);
		}

		if ($leaderBoard !== null && $leaderBoard.length) {
			resizeTimeOut = setTimeout(function () {
				leaderBoardSetStyles({
					leaderBoardOL: leaderBoard,
					leaderBoardContainer: $leaderBoard[0].parentNode
				});
			}, delay);
		}
	};

	$(window).on(
		"resize",
		{
			element: ".assessment-card-container",
			cardImg: ".assessment-card-image",
			leaderBoard: ".assessmentOlLeaderBoard"
		},
		resizeFunction
	);

	function setAssessmentElement(id) {
		assessmentElement = document.getElementById(assessmentElementId);
	};


	function createIntroOnLoad(){
		if(useDocumentOnReady){
			$(document).ready(function(){
				setAssessmentElement(assessmentElementId);
				createIntro();
				lockAssessment();
			});
		} else {
			setAssessmentElement(assessmentElementId);
			lockAssessment();
		}
	};

	function assessmentConfig(){
		return {
			"assessmentId": assessmentId,
			"assessmentElementId": assessmentElementId,
			"def": def,
			"settings": settings,
			"aQb" : aQb
		};
	};

	createIntroOnLoad();
	return {
		"createIntro": createIntro,
		"assessmentConfig": assessmentConfig,
		"assessmentStatus": assessmentStatus
	};
};