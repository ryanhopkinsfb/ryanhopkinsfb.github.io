
	var scormVersionNo = 1.0;
	var lpr_tracking = "0!nt!6BDEDE1D-CA8A-91B6-BA660C41B5DB7D6C";
	var completionPage = 25;
	var defaultCompletionPage = 25;
	var completionMode = 2;
	var customCompletionAction = false;
	var lpId = "6BDEBEC9-B7BE-305C-A9C719BFEE9C3EB1";
	var commentsMode = "moderated";
	var moduleTitleEn = "Modern Slavery";
	var moduleTitleLocal = "Modern Slavery";
	var mod_certificate = "";
	var setCompletionScore = true;
	var scr_pages = [];
	var scr_formats = {
		isAccessibleOn: false,
		isAudioOn: false
	};
	var trackUnassessedAsCompleted = false;
	var scr_linkedResources = [];
	
	var src_langs = [{"default":"2","english_name":"English","code":"en"}];

	//Potal Text Setting for inline module close button
	var closeModuleButtonDisplay = "Exit Module";

	

		scr_pages[0] = {
			id: "4EEC3EFF-CBBA-B196-7C171C5D3FF1EF20",
			title: "Welcome",
			autoId: "1306",
			identifier: "",
			type: "h1",
			hide: false,
			section: 1,
			sectionstart: 1,
			sectionend: 2,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1285","1372","1327"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "2"
		};
		

		scr_pages[1] = {
			id: "4EEC3F01-D898-9D65-959C626EDED40264",
			title: "What is modern slavery?",
			autoId: "1307",
			identifier: "",
			type: "h1",
			hide: false,
			section: 2,
			sectionstart: 2,
			sectionend: 6,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1332"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[2] = {
			id: "4EEC3F03-B914-8249-BBF620936390E743",
			title: "Anti-slavery laws",
			autoId: "1308",
			identifier: "",
			type: "h2",
			hide: false,
			section: 2,
			sectionstart: 2,
			sectionend: 6,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1334","1286","1333","1328"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[3] = {
			id: "4EEC3F05-99F0-5DC5-1442FB13AA9494BC",
			title: "What do you think: Who's most at risk?",
			autoId: "1309",
			identifier: "",
			type: "h2",
			hide: false,
			section: 2,
			sectionstart: 2,
			sectionend: 6,
			pageEx: "2",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1262","1263"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "N"
		};
		

		scr_pages[4] = {
			id: "4EEC3F06-CE9C-96D4-C39FFE818BBBBF77",
			title: "Case studies",
			autoId: "1310",
			identifier: "",
			type: "h2",
			hide: false,
			section: 2,
			sectionstart: 2,
			sectionend: 6,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1336","1287","1335","1329"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[5] = {
			id: "4EEC3F08-CDA0-E58E-831E7A01BB2C2870",
			title: "Our approach",
			autoId: "1303",
			identifier: "",
			type: "h1",
			hide: false,
			section: 3,
			sectionstart: 6,
			sectionend: 12,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1337","1298"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "4"
		};
		

		scr_pages[6] = {
			id: "4EEC3F0A-D947-AC99-FAC86DFD4987DCE8",
			title: "What are the risks?",
			autoId: "1311",
			identifier: "",
			type: "h2",
			hide: false,
			section: 3,
			sectionstart: 6,
			sectionend: 12,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1338","1339","1340","1341","1342"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "3"
		};
		

		scr_pages[7] = {
			id: "4EEC3F0C-098E-0400-249CBFE377A2E67E",
			title: "What do we do?",
			autoId: "1312",
			identifier: "",
			type: "h2",
			hide: false,
			section: 3,
			sectionstart: 6,
			sectionend: 12,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1343","1288","1344","1330"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[8] = {
			id: "4EEC3F0E-A032-DB99-AECC2B59F6473AB2",
			title: "You make the call: What is the level of risk?",
			autoId: "1313",
			identifier: "",
			type: "h2",
			hide: false,
			section: 3,
			sectionstart: 6,
			sectionend: 12,
			pageEx: "4",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1345","1264","1265","1266","1267"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "N"
		};
		

		scr_pages[9] = {
			id: "4EEC3F11-9DAD-97C8-DD89BAE4B4F4BD39",
			title: "Case studies in fighting modern slavery",
			autoId: "1314",
			identifier: "",
			type: "h2",
			hide: false,
			section: 3,
			sectionstart: 6,
			sectionend: 12,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1346","1289","1347","1331"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[10] = {
			id: "4EEC3F13-E6E7-76D7-E278485F7B2CD0DD",
			title: "Due diligence and training",
			autoId: "1315",
			identifier: "",
			type: "h2",
			hide: false,
			section: 3,
			sectionstart: 6,
			sectionend: 12,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1348","1349","1350","1351"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "2"
		};
		

		scr_pages[11] = {
			id: "4EEC3F15-D3ED-C6F5-E540DBD81421BE84",
			title: "What can you do?",
			autoId: "1304",
			identifier: "",
			type: "h1",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1352","1299"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "3"
		};
		

		scr_pages[12] = {
			id: "4EEC3F16-A7DB-741E-578DD549DBAF19E5",
			title: "You make the call: Is it suspicious or not?",
			autoId: "1316",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "5",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1353","1268","1269","1270","1271","1272","1354"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "N"
		};
		

		scr_pages[13] = {
			id: "4EEC3F1E-0194-5C20-7A0C26198EDE8AE1",
			title: "You make the call: Due diligence and suppliers",
			autoId: "1324",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1297"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[14] = {
			id: "4EEC3F20-F698-9363-76238DFD356D90F9",
			title: "You make the call: The discussion",
			autoId: "1317",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "1",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1366","1292","1367","1368","1293","1273"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "N"
		};
		

		scr_pages[15] = {
			id: "4EEC3F22-0735-6834-F1B01F0CA58C4E9E",
			title: "Scenario: The cleaning company",
			autoId: "1325",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "2",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1359","1283","1284"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[16] = {
			id: "4EEC3F24-095A-57BD-500F03959FF6E348",
			title: "Scenario: The hotel",
			autoId: "1318",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "2",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1355","1274","1275"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "N"
		};
		

		scr_pages[17] = {
			id: "4EEC3F26-CD21-87E5-150490096B39ECE1",
			title: "Scenario: A brand new look",
			autoId: "1319",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "2",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1294","1369","1370","1371","1295","1276","1296","1277"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "N"
		};
		

		scr_pages[18] = {
			id: "4EEC3F29-AFBE-B9ED-0EEB448E5B7E33D5",
			title: "Scenario: At the cash counter",
			autoId: "1320",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "2",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1356","1278","1279"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "N"
		};
		

		scr_pages[19] = {
			id: "4EEC3F2B-0A10-489B-46100211442AC566",
			title: "Scenario: The construction site",
			autoId: "1321",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "2",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1357","1280","1281"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "N"
		};
		

		scr_pages[20] = {
			id: "4EEC3F2D-9E96-592D-9E7A1AC157C9E7E0",
			title: "Scenario: An allegation",
			autoId: "1322",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "1",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1361","1290","1373","1360","1291","1282"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[21] = {
			id: "4EEC3F2F-945D-26FA-CF7D167511336752",
			title: "Best practice: Managing modern slavery risks",
			autoId: "1323",
			identifier: "",
			type: "h2",
			hide: false,
			section: 4,
			sectionstart: 12,
			sectionend: 23,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1358","1302","1301"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[22] = {
			id: "4EEC3F31-A3F0-948D-70A62228EF1D2DCF",
			title: "Summary",
			autoId: "1305",
			identifier: "",
			type: "h1",
			hide: false,
			section: 5,
			sectionstart: 23,
			sectionend: 25,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1365","1300"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "4"
		};
		

		scr_pages[23] = {
			id: "4EEC3F35-CAD7-AD27-7DF98A5871E7DE3E",
			title: "Affirmation",
			autoId: "1326",
			identifier: "",
			type: "h2",
			hide: false,
			section: 5,
			sectionstart: 23,
			sectionend: 25,
			pageEx: "0",
			required: 0,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: ["1362","1363","1364"],
			elementsBySection: {},
			questions: [],
			isAssessment: false,
			pageHideNextButton: "Y"
		};
		

		scr_pages[24] = {
			id: "4EEC3F36-9263-8067-FEBFA9CAC73740CE",
			title: "Assessment",
			autoId: "1374",
			identifier: "",
			type: "6BDEDE1D-CA8A-91B6-BA660C41B5DB7D6C",
			hide: false,
			section: 6,
			sectionstart: 25,
			sectionend: 25,
			pageEx: "1",
			required: 1,
			objectiveId: "                                   ",
			attemptLimit: 0,
			scrollingSections: [],
			elements: [],
			elementsBySection: {},
			questions: [],
			isAssessment: true,
			pageHideNextButton: "N"
		};
		
	var scr_objectives = [];
	
	var scr_rtquestions = {};
	
