var epool = epool || {};

var teamsJson = '[{"code":"AJ","name":"Ajax"},{"code":"BA","name":"Barcelona"},{"code":"JU","name":"Juventus"},{"code":"LP","name":"Liverpool"},{"code":"MC","name":"Man. City"},{"code":"MU","name":"Man. United"},{"code":"PO","name":"Porto"},{"code":"TO","name":"Tottenham"}]',
    policyJson = '[{"round":0,"point":{"w":2,"t":1,"l":0}},{"round":1,"point":{"w":2,"t":1,"l":0}},{"round":2,"point":{"w":2,"t":1,"l":0}}]',
    teamsObjects = { "AJ": "Ajax", "BA": "Barcelona", "JU": "Juventus", "LP": "Liverpool", "MC": "Man. City", "MU": "Man. United", "PO": "Porto", "TO": "Tottenham" },
    europaObjects = { "C1": "Champion", "C2": "Final 2", "C3": "Final 4", "C4": "8 teams" };

var matchesJson = '[{"teamName":"BA","round":0,"result":"w","score":2,"rival":"JU"},{"teamName":"JU","round":0,"result":"l","score":1,"rival":"BA"},{"teamName":"MC","round":2,"result":"w","score":2,"rival":"LP"},{"teamName":"LP","round":2,"result":"l","score":1,"rival":"MC"}]';

var allEntriesJson = '[]';
	
epool.teams = {};
epool.policy = {};
epool.matches = {};
epool.entries = [];
epool.entry = {
	id: 0,
	name: "",
	t0: "",
	p0: 0,
	t1: "",
	p1: 0,
	t2: "",
	p2: 0,
	t3: "",
	p3: 0,
	t4: "",
	p4: 0,
	t5: "",
	p5: 0,
	t6: "",
	p6: 0,
	t7: "",
	p7: 0,
	t8: "",
    p8: 0,
    t9: "",
    p9: 0,
	pp: 0
}
epool.currentId = 0;
epool.nextId = epool.entries.length;
epool.maxPoint = 0;
epool.ARRank = "C2";     // TO BE UPDATED
epool.CHRank = "C1";     // TO BE UPDATED
epool.chartData = [];
epool.chartNode = {
    name: "",
    point: 0
}
epool.points = [];

var log = null;

epool.init = function () {
	epool.teams = JSON.parse(teamsJson);
	epool.policy = JSON.parse(policyJson);
};

epool.loadData = function($url) {
	$.ajax({
      url: $url,
      dataType: 'json',
      cache: true,
      async: true,      // avoid XMLHttpRequest request within the main thread
      success: function (data) {
          epool.matches = data;
      },
      error: function(xhr, status, err) {
        console.error($url, status, err.toString());
      }
	});
}

epool.calc = function(team, weight) {
	var point = 0;
	//console.log("TeamCode is %s and point is %d", team, weight);
	if (!epool.isTeamExist(team)) {
		console.error(team + " is not in Final 8 teams");
		return false;
	}
	
	for (var i = 0; i < epool.matches.length; i++) { 
		if (team === epool.matches[i].teamName) {
		    if (epool.matches[i].result === 'w') {
		        point += weight * 2;
		        if (epool.matches[i].round === 2 && weight === 8) point += 10; // Champion bonus
            }
            else if (epool.matches[i].result === 'ow') {
                point += weight + 4;
            }
            else if (epool.matches[i].result === 't' || epool.matches[i].result === 'ol')
		        point += weight;
		}

	}
	
	return point;
}

epool.isTeamExist = function(team) {
	for (var i = 0; i < epool.teams.length; i++) { 
		if (team === epool.teams[i].code) {
			return true;
		}
	}
	return false;
}

epool.setLocalStorage = function(entries) {
	localStorage.setItem("entriesJson", JSON.stringify(entries));
}

epool.removeLocalStorage = function() {
	localStorage.removeItem("entriesJson");
}

epool.setEntryValue = function() {
	// team's name
	epool.entry.t0 = $('#sel-cat0').val();
	epool.entry.t1 = $('#sel-cat1').val();
	epool.entry.t2 = $('#sel-cat2').val();
	epool.entry.t3 = $('#sel-cat3').val();
	epool.entry.t4 = $('#sel-cat4').val();
	epool.entry.t5 = $('#sel-cat5').val();
	epool.entry.t6 = $('#sel-cat6').val();
	epool.entry.t7 = $('#sel-cat7').val();
    epool.entry.t8 = $('#sel-cat8').val();
    epool.entry.t9 = $('#sel-cat9').val();
	
	// the point relevant to team
	epool.entry.p0 = epool.calc(epool.entry.t0, 8);
	epool.entry.p1 = epool.calc(epool.entry.t1, 7);
	epool.entry.p2 = epool.calc(epool.entry.t2, 6);
	epool.entry.p3 = epool.calc(epool.entry.t3, 5);
	epool.entry.p4 = epool.calc(epool.entry.t4, 4);
	epool.entry.p5 = epool.calc(epool.entry.t5, 3);
	epool.entry.p6 = epool.calc(epool.entry.t6, 2);
	epool.entry.p7 = epool.calc(epool.entry.t7, 1);
	if (epool.entry.t8 === epool.ARRank)
        epool.entry.p8 = 10;
	else
        epool.entry.p8 = 0;
    if (epool.entry.t9 === epool.CHRank)
        epool.entry.p9 = 10;
    else
        epool.entry.p9 = 0;

	epool.entry.pp = epool.entry.p0 + epool.entry.p1 + epool.entry.p2 + epool.entry.p3 + epool.entry.p4
                   + epool.entry.p5 + epool.entry.p6 + epool.entry.p7 + epool.entry.p8 + epool.entry.p9;

    $('#cat0Point').val(epool.entry.p0);
	$('#cat1Point').val(epool.entry.p1);
	$('#cat2Point').val(epool.entry.p2);
	$('#cat3Point').val(epool.entry.p3);
	$('#cat4Point').val(epool.entry.p4);
	$('#cat5Point').val(epool.entry.p5);
	$('#cat6Point').val(epool.entry.p6);
	$('#cat7Point').val(epool.entry.p7);
    $('#cat8Point').val(epool.entry.p8);
    $('#cat9Point').val(epool.entry.p9);
	$('#totalPoint').val(epool.entry.pp);
}

epool.updateCurrentEntryFromBuffer = function(i) {
	epool.entries[i].t0 = epool.entry.t0;
	epool.entries[i].t1 = epool.entry.t1;
	epool.entries[i].t2 = epool.entry.t2;
	epool.entries[i].t3 = epool.entry.t3;
	epool.entries[i].t4 = epool.entry.t4;
	epool.entries[i].t5 = epool.entry.t5;
	epool.entries[i].t6 = epool.entry.t6;
	epool.entries[i].t7 = epool.entry.t7;
    epool.entries[i].t8 = epool.entry.t8;
    epool.entries[i].t9 = epool.entry.t9;
	
	epool.entries[i].p0 = epool.entry.p0;
	epool.entries[i].p1 = epool.entry.p1;
	epool.entries[i].p2 = epool.entry.p2;
	epool.entries[i].p3 = epool.entry.p3;
	epool.entries[i].p4 = epool.entry.p4;
	epool.entries[i].p5 = epool.entry.p5;
	epool.entries[i].p6 = epool.entry.p6;
	epool.entries[i].p7 = epool.entry.p7;
    epool.entries[i].p8 = epool.entry.p8;
    epool.entries[i].p9 = epool.entry.p9;
	epool.entries[i].pp = epool.entry.pp;
}

epool.resetEntry = function() {
	epool.entry.id = 0;
	epool.entry.name = "";
	epool.entry.t0 = "";
	epool.entry.p0 = 0;
	epool.entry.t1 = "";
	epool.entry.p1 = 0;
	epool.entry.t2 = "";
	epool.entry.p2 = 0;
	epool.entry.t3 = "";
	epool.entry.p3 = 0;
	epool.entry.t4 = "";
	epool.entry.p4 = 0;
	epool.entry.t5 = "";
    epool.entry.p5 = 0;
    epool.entry.t6 = "";
    epool.entry.p6 = 0;
    epool.entry.t7 = "";
    epool.entry.p7 = 0;
    epool.entry.t8 = "";
    epool.entry.p8 = 0;
    epool.entry.t9 = "";
    epool.entry.p9 = 0;
	epool.entry.pp = 0;
}

epool.setSelectOptions = function(entry) {
	$('#sel-cat0').val(entry.t0);
	$('#sel-cat1').val(entry.t1);
	$('#sel-cat2').val(entry.t2);
	$('#sel-cat3').val(entry.t3);
	$('#sel-cat4').val(entry.t4);
	$('#sel-cat5').val(entry.t5);
	$('#sel-cat6').val(entry.t6);
	$('#sel-cat7').val(entry.t7);
    $('#sel-cat8').val(entry.t8);
    $('#sel-cat9').val(entry.t9);
}

epool.resetSelectOptions = function() {
	$('#sel-cat0').val('ZZ');
	$('#sel-cat1').val('ZZ');
	$('#sel-cat2').val('ZZ');
	$('#sel-cat3').val('ZZ');
	$('#sel-cat4').val('ZZ');
	$('#sel-cat5').val('ZZ');
	$('#sel-cat6').val('ZZ');
	$('#sel-cat7').val('ZZ');
    $('#sel-cat8').val('ZZ');
    $('#sel-cat9').val('ZZ');
}

epool.isEntryExist = function(name) {
	for (var i = 0; i < epool.entries.length; i++) {
        if (name.toLowerCase() === epool.entries[i].name.toLowerCase()) return true;
	}
	return false;
}

epool.getMaxPoint = function() {
	for (var i = 0; i < epool.entries.length; i++) {
		if (epool.entries[i].pp > epool.maxPoint) 
			epool.maxPoint = epool.entries[i].pp;
	}
	$('#btnRank > span.badge').text(epool.maxPoint);

	return epool.maxPoint;
}

epool.updateAllEntriesValue = function() {
	for (var i = 0; i < epool.entries.length; i++) {
		epool.setSelectOptions(epool.entries[i]);
		epool.setEntryValue(); // calc points process inside
		epool.updateCurrentEntryFromBuffer(i); // write into entry array
	}
}

epool.quickSort = function (key, items, left, right) {
    var index;

    if (items.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;

        index = partition(key, items, left, right);

        if (left < index - 1) {
            epool.quickSort(key, items, left, index - 1);
        }

        if (index < right) {
            epool.quickSort(key, items, index, right);
        }
    }

    function swap(items, firstIndex, secondIndex) {
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    function partition(key, items, left, right) {
        var pivot = items[Math.floor((right + left) / 2)],
            i = left,
            j = right;

        while (i <= j) {
            while (items[i][key] < pivot[key]) {
                i++;
            }

            while (items[j][key] > pivot[key]) {
                j--;
            }

            if (i <= j) {
                swap(items, i, j);
                i++;
                j--;
            }
        }

        return i;
    }

    return items;
}

epool.renderEntrieSelection = function(entriesObj) {
	var s = $("#sel-entry");
	s.empty();
	for (var i = 0; i < entriesObj.length; i++) {	
		s.append($('<option>', {
            value: entriesObj[i].id,
            text:  (entriesObj[i].id + 1) + " -- " + entriesObj[i].name + "  (" + entriesObj[i].pp + ")"
        }));
	}
}

epool.updateIDinEntries = function() {
	for (var i = 0; i < epool.entries.length; i++) {	
		epool.entries[i].id = i;
	}
}

epool.rank = function() {
	// update all entries' value
	epool.updateAllEntriesValue();
	// sort 
	epool.quickSort("pp", epool.entries);
	// reverse as descending order
	epool.entries.reverse();
	// adjust the id according to rank
	epool.updateIDinEntries();
	// load entries to selection's options
	epool.renderEntrieSelection(epool.entries);
	// save entries object to local storage    		
	epool.setLocalStorage(epool.entries);
	
	// point to the first entry
	epool.setSelectOptions(epool.entries[0]);
	$("#sel-entry").trigger('change'); 
	epool.getMaxPoint();
	
	epool.points.length = 0;
	epool.chartData.length = 0;
	for (var i = 0, len = epool.entries.length; i < len; i++) {
	    var node = $.extend(true, {}, epool.chartNode);
	    node.name = epool.entries[i].name;
	    node.point = epool.entries[i].pp;
	    epool.points.push(node.point);
        epool.chartData.push(node);
	}
	epool.initChart();
}

epool.duplicateInRank = function () {
    let tc = [];
    tc.push(epool.entry.t0);

    if (tc.indexOf(epool.entry.t1) < 0) tc.push(epool.entry.t1);
    else return "Team is duplicate at rank 1 and 2."

    if (tc.indexOf(epool.entry.t2) < 0) tc.push(epool.entry.t2);
    else return "Team is duplicate at rank 3 and " + (tc.indexOf(epool.entry.t2) + 1) + ".";

    if (tc.indexOf(epool.entry.t3) < 0) tc.push(epool.entry.t3);
    else return "Team is duplicate at rank 4 and " + (tc.indexOf(epool.entry.t3) + 1) + ".";

    if (tc.indexOf(epool.entry.t4) < 0) tc.push(epool.entry.t4);
    else return "Team is duplicate at rank 5 and " + (tc.indexOf(epool.entry.t4) + 1) + ".";

    if (tc.indexOf(epool.entry.t5) < 0) tc.push(epool.entry.t5);
    else return "Team is duplicate at rank 6 and " + (tc.indexOf(epool.entry.t5) + 1) + ".";

    if (tc.indexOf(epool.entry.t6) < 0) tc.push(epool.entry.t6);
    else return "Team is duplicate at rank 7 and " + (tc.indexOf(epool.entry.t6) + 1) + ".";

    if (tc.indexOf(epool.entry.t7) < 0) tc.push(epool.entry.t7);
    else return "Team is duplicate at rank 8 and " + (tc.indexOf(epool.entry.t7) + 1) + ".";

    return false;
}

epool.isExistBlankTeam = () => {
    if (epool.entry.t0 === '') return "Rank 1 doesn't select yet!";
    if (epool.entry.t1 === '') return "Rank 2 doesn't select yet!";
    if (epool.entry.t2 === '') return "Rank 3 doesn't select yet!";
    if (epool.entry.t3 === '') return "Rank 4 doesn't select yet!";
    if (epool.entry.t4 === '') return "Rank 5 doesn't select yet!";
    if (epool.entry.t5 === '') return "Rank 6 doesn't select yet!";
    if (epool.entry.t6 === '') return "Rank 7 doesn't select yet!";
    if (epool.entry.t7 === '') return "Rank 8 doesn't select yet!";
    if (epool.entry.t8 === '') return "What is Arsenal's place?";
    if (epool.entry.t9 === '') return "What is Chelsea's place?";

    return false;
}

epool.initElementsEvent = function () {
    $('#btnCalc').on('click', function () {
        epool.setEntryValue();
    });

    $('#btnReset').on('click', function () {
        epool.resetSelectOptions();
    });

    $('#btnRank').on('click', function () {
        epool.rank();
        //M.toast({ html: 'The function is in developing, it will be released in next version' }, 2500);
    });

    $('#btnSave').on('click', function (event) {
        event.preventDefault();

        var name = $('#inputEntryName').val().trim();
        if (name !== "" && epool.isEntryExist(name) !== true && epool.entries.length < 4) {
            epool.entry.name = name;
            epool.entry.id = epool.nextId;
            epool.setEntryValue();		// set buffer entry's value

            let shtml = epool.isExistBlankTeam();
            if (shtml !== false) {
                M.toast({ html: shtml }, 4000);

                return false;
            }

            let index = epool.duplicateInRank();
            if (index !== false) {
                M.toast({ html: index }, 4000);

                return false;
            }

            if (epool.entry.t8 === "C1" && epool.entry.t9 === "C1" ) {
                M.toast({ html: "Arsenal and Chelsea can't both be Champion. " }, 4000);

                return false;
            }

            $('#yr1').text(teamsObjects[epool.entry.t0]);
            $('#yr2').text(teamsObjects[epool.entry.t1]);
            $('#yr3').text(teamsObjects[epool.entry.t2]);
            $('#yr4').text(teamsObjects[epool.entry.t3]);
            $('#yr5').text(teamsObjects[epool.entry.t4]);
            $('#yr6').text(teamsObjects[epool.entry.t5]);
            $('#yr7').text(teamsObjects[epool.entry.t6]);
            $('#yr8').text(teamsObjects[epool.entry.t7]);
            $('#yr9').text(europaObjects[epool.entry.t8]);
            $('#yra').text(europaObjects[epool.entry.t9]);

            $('#modalSubmit').modal();           
        }
        else {
            if (name === "")
                M.toast({ html: 'A name of the entry is required' }, 4000);
            else if (epool.isEntryExist(name) === true)
                M.toast({ html: 'An entry with same name is alreay exist' }, 4000);
            else if (epool.entries.length >= 4) 
                M.toast({ html: "Everyone can't have more than 4 entries." }, 4000);

            return false;
        }
    });

    $('#btnConfirm').on('click', function () {
        epool.saveToMlab(epool.entry);
    });

    //$('#btnDele').on('click', function () {
    //    if (epool.entries.length > 0) {
    //        var arrDeletedEntries = epool.entries.splice(epool.currentId, 1);

    //        if (epool.entries.length !== 0) {
    //            if (parseInt(epool.currentId) === epool.entries.length)
    //                epool.currentId = epool.currentId - 1;	// if deleted the last one, offset -1
    //            else {
    //                for (var i = epool.currentId; i < epool.entries.length; i++) {
    //                    epool.entries[i].id = i;
    //                }
    //            }

    //            // refresh the entry selection's options
    //            var s = $("#sel-entry");
    //            s.empty();
    //            for (var i = 0; i < epool.entries.length; i++) {
    //                s.append($('<option>', {
    //                    value: epool.entries[i].id,
    //                    text: epool.entries[i].name
    //                }));
    //            }

    //            // point to current entry
    //            $('#sel-entry').val(epool.currentId);
    //            $('#sel-entry').trigger('change');
    //        }
    //        else {
    //            $("#sel-entry").empty();
    //            $("#sel-entry").val('');
    //            epool.nextId = 0;
    //            epool.removeLocalStorage();
    //        }

    //        M.toast({ html: 'entry of "' + arrDeletedEntries[0].name + '" Deleted' }, 3000);
    //    }
    //    else
    //        M.toast({ html: 'You don\'t save any entry yet' }, 2500);
    //});

    $('#btnRule').on('click', function (e) {
        if ($('#ruleContent').is(":visible")) {
            $(this).text('Expand(打开)');
            $('#ruleContent').hide('fast');
        }
        else {
            $(this).text('Close(关闭)');
            $('#ruleContent').show('fast');
        }
    });
}

epool.afterEntriesLoaded = function (entriesObj) {
    for (var i = 0; i < entriesObj.length; i++) {
        epool.entries.push(entriesObj[i]);
    }
    console.log("entries # = %d", epool.entries.length);
    if (epool.entries.length > 0) {
        epool.currentId = 0;
        epool.nextId = epool.entries.length;  // will be the new entry's id

        // update all entries' value
        epool.updateAllEntriesValue();
        // sort 
        epool.quickSort("pp", epool.entries);
        // reverse as descending order
        epool.entries.reverse();
        // adjust the id according to rank
        epool.updateIDinEntries();
        // load entries to selection's options
        epool.renderEntrieSelection(epool.entries);
        // save entries object to local storage    		
        epool.setLocalStorage(epool.entries);

        // add changeListener to selection element
        $("#sel-entry").on('change', function () {
            epool.currentId = $(this).val();
            epool.setSelectOptions(epool.entries[epool.currentId]);

            $('#cat0Point').val(epool.entries[epool.currentId].p0);
            $('#cat1Point').val(epool.entries[epool.currentId].p1);
            $('#cat2Point').val(epool.entries[epool.currentId].p2);
            $('#cat3Point').val(epool.entries[epool.currentId].p3);
            $('#cat4Point').val(epool.entries[epool.currentId].p4);
            $('#cat5Point').val(epool.entries[epool.currentId].p5);
            $('#cat6Point').val(epool.entries[epool.currentId].p6);
            $('#cat7Point').val(epool.entries[epool.currentId].p7);
            $('#cat8Point').val(epool.entries[epool.currentId].p8);
            $('#cat9Point').val(epool.entries[epool.currentId].p9);
            $('#totalPoint').val(epool.entries[epool.currentId].pp);
        });

        // point to the first entry
        epool.setSelectOptions(epool.entries[0]);

        if (epool.matches.length > 0) {
            epool.getMaxPoint();
            epool.rank();
        }

    }
}

epool.initEntryLoading = function () {
    // load entries from json and push them in entry array
    var entriesObj = {};

    try {
        if (localStorage.getItem("entriesJson")) {
            entriesObj = JSON.parse(localStorage.getItem("entriesJson"));
            console.log(entriesObj);
            if (entriesObj.length === 42) {
                epool.afterEntriesLoaded(entriesObj);
            }
            else {
                let surl = 'https://api.mlab.com/api/1/databases/sfcdb/collections/clpool2019?apiKey=m1QZo1IgF6SGC5zAgYCcseYPWf5xIsRS&s={"name":1}';
                let oData = null;
                epool.myAjax(surl, '', 'GET').then((data) => {
                    entriesObj = data;
                    //console.log(entriesObj);
                    epool.afterEntriesLoaded(entriesObj);
                });
            }
        }
        else {
            //entriesObj = JSON.parse(allEntriesJson);
            //return epool.maxPoint;
            let surl = 'https://api.mlab.com/api/1/databases/sfcdb/collections/clpool2019?apiKey=m1QZo1IgF6SGC5zAgYCcseYPWf5xIsRS&s={"name":1}';
            let oData = null;
            epool.myAjax(surl, '', 'GET').then((data) => {
                entriesObj = data;
                //console.log(entriesObj);
                epool.afterEntriesLoaded(entriesObj);
            });
        }
    }
    catch (err) {
        console.warn(err);
    }
}

epool.initLog4Javascript = function () {
    log = log4javascript.getLogger("myLogger");

    var ajaxAppender = new log4javascript.AjaxAppender("log.php");
    ajaxAppender.setThreshold(log4javascript.Level.ALL);
    var ajaxLayout = new log4javascript.PatternLayout("%d{yyyy-MM-dd HH:mm:ss,SSS} [%p] - %m%n");
    ajaxAppender.setLayout(ajaxLayout);
    ajaxAppender.addHeader("Content-Type", "application/json");
    log.addAppender(ajaxAppender);

    //log.info("log4javascript initialized");
}

epool.getUrlIP = function () {
    $.getJSON('http://ip-api.com/json', function (data) {
        var ipInfo = "Access from [" + data.query + "] " + data.city + ", " + data.regionName + " " + data.country + ". ISP is " + data.isp + ", Location is " + data.lat + ", " + data.lon;
        //console.log("Access from [%s] %s, %s %s. ISP is %s, location is %f, %f", data.query, data.city, data.regionName, data.country, data.isp, data.lat, data.lon);
        //console.log(JSON.stringify(data, null, 2));
        log.debug(ipInfo);
    });
}

epool.initChart = function () {
    var x = d3.scaleLinear()
        .domain([0, d3.max(epool.points)])
        .range([0, 320]);		// fit to minimal mobile width

    d3.select(".chart")
      .selectAll("div")
      .data(epool.chartData)
      .enter().append("div")
      .style("width", function (d) { return x(d.point) + "px"; })  // x(d) ???
      .text(function (d) { return d.name + ": " + d.point; });
}

epool.myAjax = (surl, oData, way) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: surl,
            type: way,
            data: JSON.stringify(oData),
            contentType: 'application/json',
            //dataType: 'json',
            async: true,
            timeout: 5000,
            crossDomain: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            // callback handler that will be called on success
            success: function (data, textStatus, jqXHR) {
                //console.info(JSON.stringify(data, null, 2));
                resolve(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus === "timeout")
                    console.error("Timeout! network condition is bad", "error");
                else if (textStatus === "abort")
                    console.error("Request aborted", "error");
                else
                    console.error("Failed to load data", "error");

                reject(errorThrown);
            },
            complete: function (jqXHR, textStatus) {
                console.log(jqXHR.status + ", " + jqXHR.statusText);
                console.log(jqXHR.getAllResponseHeaders());
                if (textStatus !== "success") {
                    console.error("The errror status: " + textStatus);
                }
            }
        });
    });
};

epool.saveToMlab = (oData) => {
    let surl = 'https://api.mlab.com/api/1/databases/sfcdb/collections/clpool2019?apiKey=m1QZo1IgF6SGC5zAgYCcseYPWf5xIsRS';
    epool.myAjax(surl, oData, 'POST').then((data) => {
        console.log(data);
  
        if (data._id.$oid) {
            M.toast({ html: 'entry of "' + epool.entry.name + '" Saved' }, 5000);

            var newEntry = $.extend(true, {}, epool.entry);
            epool.entries.push(newEntry);
            console.log(epool.entries);

            epool.nextId = epool.entries.length;
            epool.currentId = epool.nextId - 1;

            // update Local Storage
            epool.setLocalStorage(epool.entries);

            // update entry selection's option
            $("#sel-entry").append($('<option>', {
                value: epool.entries[epool.currentId].id,
                text: epool.entries[epool.currentId].name
            }));

            // point to new entry
            $("#sel-entry").val(epool.currentId);
        }
        else {
            alert('Failure. Please submit picks again.')
        }
        
        
    });
}

$(document).ready(function () {
    //epool.initLog4Javascript();
    //epool.getUrlIP();

    epool.init();
    
    epool.initElementsEvent();

    $.getJSON('./data/matches.json').success(function(data) {
        epool.matches = data;
        return epool.matches
    }).then(function (data) {
        console.log(data);
        epool.initEntryLoading();
    });
});