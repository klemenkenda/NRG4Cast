// ---------------------------------------------------------------------------
// FILE: videk.js
// DESCRIPTION: Main QMiner GUI code
// DATE: 01/06/2013
// HISTORY:
// ---------------------------------------------------------------------------

// global variables
var marker;
var markers = [];
var sensormarkers = [];
var sensorphenomenon = [];
var sensoruid = [];
var predictionData = [];
var chartDates = [];
var infowindow = new google.maps.InfoWindow();
var geocoder;
var map;
var markerCluster;
var clusters = new Array();
var clusterXML;
var startupInterval;
var curLoc = 0;
var eventTime = "2012-05-28 00:00:00";
var chartNum = 0;
var chartMax = 3;
var currentChartData;
var seriesNum;
var selectedMarkerOverlay;
var changedMarkerI = 1;
var predictionMode = 0;
var data;
var chart;
var datasetarray = [];

// SUPPORT FUNCTIONS ---------------------------------------------------------

function gup(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function lZ(myStr) {
  outStr = myStr;
  if (myStr.length == 1) {
	  outStr = "0" + myStr;
  }
	return outStr;
}

function mysqlTimeStampToDate(timestamp) {
  var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
  var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
  return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
}

function addDays(myDate,days) {
 	return new Date(myDate.getTime() + days*24*60*60*1000);
}

function mysqlDateStr(myDate) {		 
  return myDate.getFullYear() + "-" + lZ((myDate.getMonth() + 1) + "") + "-" + lZ(myDate.getDate() + "");
}

function getClientWidth() {
  return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
}
  
function getClientHeight() {
  return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
}

// LOADED DATA FUNCTIONS -----------------------------------------------------

function handleError(data) {
  $(data).find("error").each(function() {
	  $sError = $(this);
		errorMessage = $sError.text();
		alert(errorMessage);
	}); 
}

function loadedClusters(data) {			
  // check errors
	handleError(data);
	// set global variable
	clusterXML = data;
	// start form HTML
  var HTML = "<form><select onChange='javascript:gotoCluster(this.options[this.selectedIndex].value);'>";
	HTML += "<option>" + getTranslation("CHOOSE_SITE") + "</option>";
	
	// parse XML
	var i = 0;						
	$(data).find("cluster").each(function() {
	  var cluster = $(this);
		// ignore virtual clusters
		if (cluster.attr("place") != "") {	
  		clusters[i] = new Array(3);
  		clusters[i][0] = cluster.attr("place");
  		clusters[i][1] = cluster.attr("latitude");
  		clusters[i][2] = cluster.attr("longitude");														
  		i++;
		}								
	});
		
	// create options
	for (i = 0; i < clusters.length; i++) {						
		HTML += "<option value=\"" + i + "\">" + clusters[i][0] + "</option>";
	}
	
	// finish HTML & update widget
	HTML += "</select></form>";
	$("#div-select").html(HTML);
}

function selectSensor(id) {
  $("#ch-sensor").val(id);
}

function onSensorChange(id) {
  // clear last marker 
	markers[changedMarkerI].setIcon("http://www.google.com/mapfiles/marker.png");

	// create marker	
	markerLatLng = sensormarkers[id].position;	  		
	
	for (i = 1; i < markers.length; i++) {
	  if ((markerLatLng.lat() == markers[i].position.lat()) &&
		   (markerLatLng.lng() == markers[i].position.lng()))
			 markerI = i;
	}
	
	markers[markerI].setIcon("http://www.google.com/mapfiles/dd-start.png");
	changedMarkerI = markerI;

/*		
  // create marker	
	if (selectedMarkerOverlay == null) {	  	
		selectedMarkerOverlay = new google.maps.Marker({	
  	  position: markerLatLng,
			icon: "http://maps.google.com/mapfiles/arrow.png",			
  	});		
	} else {
	  selectedMarkerOverlay.position = markerLatLng;
	}
	
	selectedMarkerOverlay.setMap(map);
*/
	
	map.panTo(markerLatLng);
}

// current state
function loadedData(data) {
	// check errors
	handleError(data);			     			

	// parse XML & create markers & create info windows
  $(data).find("node").each(function() {
    var node = $(this);
		var nodeName = node.attr("name");
		var lat = parseFloat(node.attr("latitude"));
		lat += Math.random() / 5000;
		var lng = parseFloat(node.attr("longitude"));
		lng += Math.random() / 5000;
		var markerLatLng = new google.maps.LatLng(lat, lng);
		
		// create marker		
		var the_marker = new google.maps.Marker({
	    position: markerLatLng,
			title: nodeName,
			map: map,
			clickable: true
		});
							  		  	
		var iwHTML = "<b>" + getTranslation("NODE") + " (" + node.attr("id") + "): " + nodeName + "</b><br>";
			
		var tempHTML = "<br><table>";
		var measurementTime;
		var measurementDate;					
		var firstMeasurementTime;
			
		// parse virtual sensors
		var i = 0;	
		$(node).find("virtualsensor").each(function() {
			i++;
			var virtualsensor = $(this);
			var keyname = "FTR_" + virtualsensor.attr("name").toUpperCase();
				
			// TODO: debug comfort level operator in miner
			if (keyname != "FTR_COMFORT-LEVEL") {
				tempHTML += "<tr><td>" + getTranslation(keyname) + ": </td>";
				tempHTML += "<td>" + virtualsensor.attr("value") + "</td>";
					
				tempHTML += "<td></td>";
				tempHTML += "</tr>";
			}
		});
			
		// parse sensors
		i = 0;
		camera = 0;		
		jsonsensors = [];
		$(node).find("sensor").each(function() {
		  i++;
			var sensor = $(this);
			var keyname = "FTR_" + trimUrn(sensor.attr("featureofmeasurement")).toUpperCase(); 
				
			// measurementTime = sensor.attr("measurementtime");
			measurementTime = eventTime;												
			measurementDate = mysqlTimeStampToDate(measurementTime);
				
			if (i == 1) firstMeasurementTime = measurementTime;
				
			toDayStr = mysqlDateStr(measurementDate);
			toWeekStr = mysqlDateStr(addDays(measurementDate, -6));
			toMonthStr = mysqlDateStr(addDays(measurementDate, - measurementDate.getDate() + 1));						
			toYearStr = toDayStr;
			
			toDayOpenFuncStr = "javascript:openChart('day', " + sensor.attr("id") + ", '" + toDayStr + "');";
			toWeekOpenFuncStr = "javascript:openChart('week', " + sensor.attr("id") + ", '" + toWeekStr + "');";
			toMonthOpenFuncStr = "javascript:openChart('month', " + sensor.attr("id") + ", '" + toMonthStr + "');";
			toYearOpenFuncStr = "javascript:openChart('year', " + sensor.attr("id") + ", '" + toYearStr + "');";
			
														
		  tempHTML += "<tr><td>(" + sensor.attr("id")  + ") " + getTranslation(keyname) + ": </td>";
			tempHTML += "<td id='td-values-" + sensor.attr("name").split(":").join("-") + "' class='td-measurement'></td><td>" + sensor.attr("unitofmeasurement") + "</td>";
			tempHTML += "<td><a href=\"javascript:selectSensor(" + sensor.attr("id") + ")\">" + getTranslation("SELECT_SENSOR") + "</a></td>";			
			if (keyname == "FTR_CAMERA") camera = 1;
			tempHTML += "</tr>";
			
			the_marker.set(getTranslation(keyname), 1);
			sensormarkers[sensor.attr("id")] = the_marker;
			sensoruid[sensor.attr("id")] = sensor.attr("name");
			jsonsensors.push(sensor.attr("name"));			
			sensorphenomenon.push(sensor.attr("featureofmeasurement"));
		});
			
		tempHTML += "</table>";			
		// iwHTML += "<span class=\"span-time\"><b>" + getTranslation("LAST_MEASUREMENT") + ":</b> " + firstMeasurementTime + "<span>";			
		iwHTML += tempHTML;
		
		var iwContent;
		iwContent = "<div class='div-iw'>" + iwHTML + "</div>";
		var nodeid = node.attr("id");
		// if ((nodeid >= 4) && (nodeid <= 9) && (nodeid != 8)) iwContent = iwContent + "<div class='div-metadata-iw'>LED power consumption: 37,2 W<br>Dimmed LED power consumption (from 23:00 to 04:45): 31,8 W<br>Electricity saving: 1kWh/month [<a href='/sl/electricity-saving.html' target='_new'>more</a>]</div>";	
		// if (camera == 1) iwContent = iwContent + "<div class='div-picture-iw'><img src=\"/slike/camera.php?id=" + node.attr("id") + "\"></div>";
		
		var infowindow = new google.maps.InfoWindow({
      content: iwContent					
    });
		
		// filter out inactive nodes
		// if (firstMeasurementTime != "N/A") {
		with ({ sensors: jsonsensors, data : null }) {				
      google.maps.event.addListener(the_marker, 'click', function() {
        infowindow.open(map, the_marker);
				// adding the triger for a JSON call on measurement/prediction
				for(i = 0; i < sensors.length; i++) {
				  sensors[i] = sensors[i].split(':').join('\\colon;')					
  				$.ajax({
					  dataType: "json",
						context: { sensor : sensors[i] },
        	  url: '/xml/predict-anomaly-value?p=' + sensors[i],
        		success: loadedPredictValues
        	});				  
				}
      });  
		}
  	markers.push(the_marker);
		// } else {
		//  the_marker.visible = false;
		//	the_marker.setMap(null);			
		// }					
	});																				
	
	populatePhenomenonSelection();
	// markerCluster = new MarkerClusterer(map, markers, {maxZoom: 15});
} // loadedData  			

// current state
function loadedNodes(data) {
	// TODO: automatically set center of the map and zoom according to the clusters	
	// initialize Google maps
	var latlng = new google.maps.LatLng(45.0, 13);
	var myOptions = {
		zoom: 4,
		center: latlng,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, position: google.maps.ControlPosition.RIGHT_BOTTOM},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};	
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);  
	 	
	console.log(data);
	nodes = JSON.parse(data);
	for (i = 0; i < nodes.length; i++) {
		console.log(nodes[i].Name);
		console.log(nodes[i].Position[0]);
		// create marker	
		var markerLatLng = new google.maps.LatLng(nodes[i].Position[0], nodes[i].Position[1]);	
		var the_marker = new google.maps.Marker({
			position: markerLatLng,
			title: nodes[i].Name,
			map: map,
			clickable: true
		});  
		the_marker.setMap(map);
	}
	
	google.maps.event.addListener(map, 'dragend', function() {
    // updateCurrentLocation(map.getCenter());
  	// updatePanoramio();
 	});

}


function loadedSensors(data) {
	// check errors
	sensors = JSON.parse(data);
	console.log(sensors.length);
	for (i = 0; i < sensors.length; i++) {
		// str = trimUrn(sensors[i].str);
		str = sensors[i].str;		
		if (str.indexOf("alarm") == -1) $("<option value=\"" + sensors[i].str + "\">" + str + "</option>").appendTo("#ch-sensor");
	}
}

function loadedSensorsDataCleaning(data) {	
	// check errors
	sensors = JSON.parse(data);
	console.log(sensors.length);
	for (i = 0; i < sensors.length; i++) {
		// str = trimUrn(sensors[i].str);
		str = sensors[i].str.substring(sensors[i].str.length - 35);		
		if (str.length == 35) str = "..." + str;
		console.log(str);
		$("<option value=\"" + sensors[i].str + "\">" + str + "</option>").appendTo("#cl-sensor");
	}
}


function trimUrn(urn) {
  delimiter = 0;
	for (k = 0; k < urn.length - 5; k++) {
	  if (urn[k] == "-") delimiter = k;
	}
	return urn.substring(delimiter + 1);
}

function populatePhenomenonSelection() {
	$("#phenomenon > option").remove();
	var phenomenon = [];
	
	
  for (i = 0; i < sensorphenomenon.length; i++) {
	  var newphen = true;
				
 	  for (j = 0; j < phenomenon.length; j++) {
		  if (sensorphenomenon[i] == phenomenon[j]) newphen = false;
		}
			  
		if ((newphen == true) && (sensorphenomenon[i] != "")) {
		  phenomenon.push(sensorphenomenon[i]);
		  var trimmedphen = trimUrn(sensorphenomenon[i]);
			trimmedphen = trimUrn(sensorphenomenon[i]);
		  $("<option value=\"" + trimmedphen + "\">" + trimmedphen + "</option>").appendTo("#phenomenon");
		}
	}
}

function loadedKeywords(data) {
  var HTML = "<font style=\"font-size: 13px\">" + getTranslation("SELECT_BY_FEATURE") + ":</font> ";
  $(data).find("keyword").each(function() {
	  var keyword = $(this);
	  var keywordName = keyword.attr("name");					
		var weight = keyword.attr("weight");
		size = Math.round(weight * 45) + 8;					
		HTML += "<font style=\"font-size: " + size + "px\"><a href=\"javascript:filterByKeyword('" + keywordName + "');\">" + keywordName + "</a></font> ";															
	});
	$("#div-keywords").html(HTML);
}

function loadedChart(myData) { 
	$('body').css('cursor', 'default');
	seriesNum = 0;
	console.log(myData);
	parsedData = JSON.parse(myData);	
	var sid = $("#ch-sensor option:selected").text();
	var sidlegend =  "..." + sid.substring(sid.length - 20);

	// Declare columns
	/*
	// OLD for GOOGLE CHARTS
	data = new google.visualization.DataTable();
	data.addColumn('datetime', 'Time');
	data.addColumn('number', sidlegend);

	for (var i = 0; i < parsedData.length; i++) {
		// transform the date into a Date object  
		var tmpArr = parsedData[i].Timestamp.split('T');
		var tmpDate = new Array(); tmpDate = tmpArr[0].split('-');
		var tmpTime = new Array(); tmpTime = tmpArr[1].split(':');
		if (tmpTime.length == 2) { tmpTime[2] = 0; }

		// Date format is Date(year, month, day, hour, minute, second)
		// note that months are zero-indexed, so January is 0 not 1                
		data.addRow([new Date(tmpDate[0], tmpDate[1] - 1, tmpDate[2],
			tmpTime[0], tmpTime[1], tmpTime[2]), parsedData[i].Val]);
	}
	data.sort(0);
	console.log(data);
	*/
	
	// PREPARE CHAP DATA
	var dataset = {
		'label': sidlegend,
		data: []
	};
	
	for (var i = 0; i < parsedData.length; i++) {
		// transform the date into a Date object  
		var tmpArr = parsedData[i].Timestamp.split('T');
		var tmpDate = new Array(); tmpDate = tmpArr[0].split('-');
		var tmpTime = new Array(); tmpTime = tmpArr[1].split(':');
		if (tmpTime.length == 2) { tmpTime[2] = 0; }

		// Date format is Date(year, month, day, hour, minute, second)
		// note that months are zero-indexed, so January is 0 not 1
		dataset.data.push({
			'date' : new Date(tmpDate[0], tmpDate[1] - 1, tmpDate[2], tmpTime[0], tmpTime[1], tmpTime[2]),
			'value': parsedData[i].Val
		});
	}
	//dataset.data.sort(0);
	// console.log(dataset.data);
	
	chartNum++;
	if (chartNum > chartMax) chartNum = 1;
	
	divname = 'div-chart-' + chartNum;
	divnametext = 'div-chartname-' + chartNum;
	
	var sid = $("#ch-sensor option:selected").text();
	
	// remove old charts
	$("#" + divname).remove();
	$("#" + divnametext).remove();
	
	$("#div-chart-containter").prepend($('<div id="' + divname + '" />'));
	$("#div-chart-containter").prepend($('<br /><div id="' + divnametext + '" />'));
		
	
	$("#" + divnametext).html("<h3>" + sid + "</h3>");
	
	var options = {
		"title": sid + " vs. time",
		"width": "960px",
		"height": "400px"
	};        
	var elementId = divnametext;
	
	// GOOGLE CHARTS
	// chart = new google.visualization.LineChart(document.getElementById(elementId));
	// chart.draw(data, options);
	
	datasetarray = [ dataset ];
	console.log(datasetarray);
	
	// CHAP
	chart = new links.Graph(document.getElementById(elementId));
	chart.draw(datasetarray, options);
}

function strpos(haystack, needle, offset) {
  var i = (haystack+'').indexOf(needle, (offset || 0));
  return i === -1 ? false : i;
}

function loadedChartAdd(myData) {
	$('body').css('cursor', 'default');
	seriesNum++;
	parsedData = JSON.parse(myData);
	
	var sid = $("#ch-sensor option:selected").text();
	var sd = $("#ch-date").val();
	var sidlegend =  "..." + sid.substring(sid.length - 20);
	// var type = $("#ch-type option:selected").val();
	// var timespan = $("#ch-timespan option:selected").val();
	
	divname = 'div-chart-' + chartNum;
	divnametext = 'div-chartname-' + chartNum;
	
	// get old title
	var titletext = $("#" + divnametext).html();
	
	if (seriesNum == 1) {
	  titletext = titletext + "<p>" + getTranslation("X-AXIS-INCORRECT") + "</p>";
	}
	
	// remove old charts
	$("#" + divname).remove();		
	$("#" + divnametext).remove();	
		
	// PREPARE CHAP DATA
	var dataset = {
		'label': sidlegend,
		data: []
	};
	
	for (var i = 0; i < parsedData.length; i++) {
		// transform the date into a Date object  
		var tmpArr = parsedData[i].Timestamp.split('T');
		var tmpDate = new Array(); tmpDate = tmpArr[0].split('-');
		var tmpTime = new Array(); tmpTime = tmpArr[1].split(':');
		if (tmpTime.length == 2) { tmpTime[2] = 0; }

		// Date format is Date(year, month, day, hour, minute, second)
		// note that months are zero-indexed, so January is 0 not 1
		dataset.data.push({
			'date' : new Date(tmpDate[0], tmpDate[1] - 1, tmpDate[2], tmpTime[0], tmpTime[1], tmpTime[2]),
			'value': parsedData[i].Val
		});
	}
	//dataset.data.sort(0);
	// console.log(dataset.data);
	
	// update chart	
	var options = {
		"title": sid + " vs. time",
		"width": "960px",
		"height": "400px"
	};        
	var elementId = divnametext;
	
	// GOOGLE CHARTS
	// chart = new google.visualization.LineChart(document.getElementById(elementId));
	// chart.draw(data, options);
	
	// datasetarray.push(dataset);
	// console.log(datasetarray);
	// console.log("Test");
	// datasetarray = [ dataset ];
	datasetarray.push(dataset);
	console.log(datasetarray);
	// create holder
	$("#div-chart-containter").prepend($('<br /><div id="' + divnametext + '" />'));
	
	// CHAP
	console.log("start chart");
	var chart2 = new links.Graph(document.getElementById(elementId));
	console.log("chart done");	
	chart2.draw(datasetarray, options);
	console.log("draw done");
}

var predictionFailed;
var predictionSuccess;
var predictionMax = 20;

function addPredictionToChartStart() {
  // reset array
	var predictionData = [];
	
	// read parameters
	var sid = $("#ch-sensor option:selected").val();
 	var sd = $("#ch-date").val();
	
	// get sensor unique id	
	var sensorname = sensoruid[sid].split(":").join("\\colon;");
	console.log(sensorname);	
	
	predictionFailed = 0;
	predictionSuccess = 0;
	
	console.log("PChart: start reading sensor predictions");
	if (chartNum == 0) {
	  // show dialog
		$("body").append("<div id='div-add-series-dialog' title=" + getTranslation("MESSAGE") + ">" + getTranslation("NO-CHART-YET-PREDICTION") + "</div>");
		$("#div-add-series-dialog").dialog({
		  modal: true,
			buttons: {
			  Ok: function() {
				  $(this).dialog("close");
					$("#div-add-series-dialog").remove();
				}
			}
		});
	} else {
	  sdate = mysqlTimeStampToDate(chartDates[0] + " 00:00:00");	
	  sdate = addDays(sdate, -1);
 		mysqlDate = mysqlDateStr(sdate);
		$.ajax({		  
  			dataType: "json",
  			context: { newdate: sdate, id: 0 },
        url: '/xml/predict-value?p=' + sensorname + ":" + mysqlDate,
        success: loadedPChartSuccess,
  			error: loadedPChartError
    });			
			
  	for (i = 0; i < predictionMax - 1; i++) {
  	  sdate = addDays(sdate, 1);
  		mysqlDate = mysqlDateStr(sdate);
  		console.log('/xml/predict-value?p=' + sensorname + ":" + chartDates[i]);
  	  $.ajax({		  
  			dataType: "json",
  			context: { newdate: sdate, id: i + 1 },
        url: '/xml/predict-value?p=' + sensorname + ":" + chartDates[i],
        success: loadedPChartSuccess,
  			error: loadedPChartError
      });			
  	}
	}	
}
            
function String2XML(text){
  if (window.ActiveXObject){
    var doc=new ActiveXObject('Microsoft.XMLDOM');
    doc.async='false';
    doc.loadXML(text);
  } else {
    var parser=new DOMParser();
    var doc=parser.parseFromString(text,'text/xml');
  }
  return doc;
}
						
function addPChart() {
  $("#progressbarprediction").html("");
	
	if (predictionFailed > 20) {
	  // show dialog
		$("body").append("<div id='div-add-series-dialog' title=" + getTranslation("MESSAGE") + ">" + getTranslation("PREDICTION-ERRORS") + "</div>");
		$("#div-add-series-dialog").dialog({
		  modal: true,
			buttons: {
			  Ok: function() {
				  $(this).dialog("close");
					$("#div-add-series-dialog").remove();
				}
			}
		});
	} else {
	  // create myXMLData
		myXMLData = "<graph><dataset seriesName=\"Value\" color=\"00ccff\">";		
		for (i = 0; i < predictionMax; i++) {
		  myXMLData += "<set value=\"" + predictionData[i] + "\"/>";
		}		
		myXMLData += "</dataset></graph>";
		
		// convert string to XML Object
		myXML = String2XML(myXMLData);
		
		// add series to chart
		predictionMode = 1;
		loadedChartAdd(myXML);
		predictionMode = 0;
	
	}	
}

function loadedPChartSuccess(data) {
  predictionSuccess++;
  	
  predictionData[this.id] = data.predicted;
	
	myValue = Math.round((predictionFailed + predictionSuccess) / predictionMax * 100);
	$("#progressbarprediction").html((predictionFailed + predictionSuccess) + "/" + predictionMax + " - " + myValue + "%");		
	if ((predictionFailed + predictionSuccess) == predictionMax) {
	  loadedSensorsPredict = 0;	
		console.log("PChart: finished reading sensors");
		addPChart();
	} 
  	
	console.log("ok:" + this.id + ", " + data.predicted);
}

function loadedPChartError() {
  predictionFailed += 1;
	
  myValue = Math.round((predictionFailed + predictionSuccess) / predictionMax * 100);
	$("#progressbarprediction").html((predictionFailed + predictionSuccess) + "/" + predictionMax + " - " + myValue + "%");		
	if ((predictionFailed + predictionSuccess) == predictionMax) {
	  loadedSensorsPredict = 0;	
		console.log("PChart: finished reading sensors");
		addPChart();
	} 
  console.log("failed:" + predictionFailed);
}

function deleteLastSeriesFromChart() {
   if (chartNum == 0) {
	  // show dialog
		$("body").append("<div id='div-add-series-dialog' title=" + getTranslation("MESSAGE") + ">" + getTranslation("NO-CHART-YET") + "</div>");
		$("#div-add-series-dialog").dialog({
		  modal: true,
			buttons: {
			  Ok: function() {
				  $(this).dialog("close");
					$("#div-add-series-dialog").remove();
				}
			}
		});
	} else if (seriesNum > 0) {
		// update chart	
		var options = {			
			"width": "960px",
			"height": "400px"	
		};        
		var elementId = divnametext;
		
		datasetarray.pop();
		console.log(datasetarray);
		// create holder
		// $("#div-chart-containter").prepend($('<br /><div id="' + divnametext + '" />'));
		
		// CHAP
		console.log("start chart");
		var chart2 = new links.Graph(document.getElementById(elementId));
		console.log("chart done");	
		chart2.draw(datasetarray, options);
		console.log("draw done");

	};
}

function addSeriesToChart() {
  if (chartNum == 0) {
	  // show dialog
		$("body").append("<div id='div-add-series-dialog' title=" + getTranslation("MESSAGE") + ">" + getTranslation("NO-CHART-YET") + "</div>");
		$("#div-add-series-dialog").dialog({
		  modal: true,
			buttons: {
			  Ok: function() {
				  $(this).dialog("close");
					$("#div-add-series-dialog").remove();
				}
			}
		});
	} else {
	
    var sid = $("#ch-sensor option:selected").val();
  	var sd = $("#ch-date-start").val();
	var sde = $("#ch-date-end").val();
	var type = $("#ch-type option:selected").val();
	var timespan = $("#ch-timespan option:selected").val();
	var raw = $("#ch-raw").is(':checked');		
	
	sid = sid.replace(":", "x");
	if (raw == true) {
		myUrl = "/api/get-measurements?p=" + escape(sid) + ":" + sd + ":" + sde;
	} else {
		myUrl = "/api/get-aggregates?p=" + escape(sid) + ":" + type + ":" + timespan + ":" + sd + ":" + sde;
	}
  	$('body').css('cursor', 'wait');
	console.log(myUrl);
  		
  	$.ajax({
  	  url: myUrl,
  		success: loadedChartAdd
		});
	}
}

function loadedPredictValues(myData) {
	sensorid = this.sensor.split("\\colon;").join("-");
	$("#td-values-" + sensorid).html(myData.value + " <font color=\"#da0\">(" + myData.predicted + ")</font>");
	$("#td1").html(myData.predicted + ", " + myData.value);
}

// INTERACTION FUNCTIONS - UI ------------------------------------------------


function startupUpdate() {    
}
	
function gotoCluster(clusterid) {
	var lat = clusters[clusterid][1];
	var lng = clusters[clusterid][2];
	var latlng = new google.maps.LatLng(lat, lng);
  map.panTo(latlng);
}
		
function filterByKeyword(keywordName) {
	markerCluster.clearMarkers();
  for (var i in markers) {			  				
	  if (markers[i].get(keywordName) != 1) {
		  markers[i].visible = false;
			markers[i].setMap(null);					
		} else {
		  markers[i].visible = true;
			markers[i].setMap(map);
			var newmarkers = [];
			newmarkers.push(markers[i]);
			markerCluster.addMarkers(newmarkers);					
		}
	}
	markerCluster.redraw();
}		

function showChart() {
  var sid = $("#ch-sensor option:selected").val();
	var sd = $("#ch-date-start").val();
	var sde = $("#ch-date-end").val();
	var type = $("#ch-type option:selected").val();
	var timespan = $("#ch-timespan option:selected").val();
	var raw = $("#ch-raw").is(':checked');		
	
	sid = sid.replace(":", "x");
	if (raw == true) {
		myUrl = "/api/get-measurements?p=" + escape(sid) + ":" + sd + ":" + sde;
	} else {
		myUrl = "/api/get-aggregates?p=" + escape(sid) + ":" + type + ":" + timespan + ":" + sd + ":" + sde;
	}
	console.log(myUrl);
	$('body').css('cursor', 'wait');	
	$.ajax({
	  url: myUrl,
	  timeout: 50000,
		success: loadedChart
	});
}

function getRule() {
  if ($("#div-conditions").text() != "") alert("Rule saved to server!");
	else alert("No event defined!");
}

function getData() {
  if ($("#div-conditions").text() != "") alert("Rule saved to server!");
	else alert("No event defined!");
}


// ----------------------------------------------------------------------------
// DATA CLEANING SPECIFIC
// ----------------------------------------------------------------------------

function exportForDataCleaning() {
	$("#form-cleaning-export").attr("action", "/api/export-data-cleaning");
	$("#form-cleaning-export").attr("method", "GET");	
	
	// create data string
	sid = $("#cl-sensor").val();
	prnc_1 = $("#cl_pn_cov_1").val();
	prnc_2 = $("#cl_pn_cov_2").val();
	prnc_3 = $("#cl_pn_cov_3").val();
	mnc = $("#cl_mn_cov").val();
	ponc_1 = $("#cl_pon_cov_1").val();
	ponc_2 = $("#cl_pon_cov_2").val();
	ponc_3 = $("#cl_pon_cov_3").val();	
	gap = $("#cl_gap").val();
	
	var argstring = "sensorid=" + sid;
	argstring += "&parameters=" + prnc_1 + "," + prnc_2 + "," + prnc_3 + "," + mnc + "," + ponc_1 + "," + ponc_2 + "," + ponc_3;
	argstring += "&gap=" + gap;
	
	console.log(argstring);
	
	$.ajax({
		type: "POST",
		url: "/api/export-data-cleaning",
		data: argstring,
		success: exportForDataCleaningSuccess
	});		
}

function exportForDataCleaningSuccess(data) {
	console.log(data);
	// show dialog
	$("body").append("<div id='div-add-series-dialog' title=" + getTranslation("MESSAGE") + ">" + getTranslation("EXPORT_OK") + "</div>");
	$("#div-add-series-dialog").dialog({
		modal: true,
		buttons: {
			Ok: function() {
				$(this).dialog("close");
				$("#div-add-series-dialog").remove();
			}
		}
	});
}


function saveConfigDataCleaning() {		
	// create data string
	sid = $("#cl-sensor").val();
	prnc_1 = $("#cl_pn_cov_1").val();
	prnc_2 = $("#cl_pn_cov_2").val();
	prnc_3 = $("#cl_pn_cov_3").val();
	mnc = $("#cl_mn_cov").val();
	ponc_1 = $("#cl_pon_cov_1").val();
	ponc_2 = $("#cl_pon_cov_2").val();
	ponc_3 = $("#cl_pon_cov_3").val();	
	gap = $("#cl_gap").val();
	
	var argstring = "sensorid=" + sid;
	argstring += "&parameters=" + prnc_1 + "," + prnc_2 + "," + prnc_3 + "," + mnc + "," + ponc_1 + "," + ponc_2 + "," + ponc_3;
	argstring += "&gap=" + gap;
	
	console.log(argstring);
	
	$.ajax({
		type: "POST",
		url: "/api/save-data-cleaning",
		data: argstring,
		success: saveConfigDataCleaningSuccess
	});		
}

function saveConfigDataCleaningSuccess(data) {
	console.log(data);
	// show dialog
	$("body").append("<div id='div-add-series-dialog' title=" + getTranslation("MESSAGE") + ">" + getTranslation("SAVE_OK") + "</div>");
	$("#div-add-series-dialog").dialog({
		modal: true,
		buttons: {
			Ok: function() {
				$(this).dialog("close");
				$("#div-add-series-dialog").remove();
			}
		}
	});
}


function resetConfigDataCleaning() {		
	// create data string
	sid = $("#cl-sensor").val();
	prnc_1 = $("#cl_pn_cov_1").val();
	prnc_2 = $("#cl_pn_cov_2").val();
	prnc_3 = $("#cl_pn_cov_3").val();
	mnc = $("#cl_mn_cov").val();
	ponc_1 = $("#cl_pon_cov_1").val();
	ponc_2 = $("#cl_pon_cov_2").val();
	ponc_3 = $("#cl_pon_cov_3").val();	
	gap = $("#cl_gap").val();
	
	var argstring = "sensorid=" + sid;
	argstring += "&parameters=" + prnc_1 + "," + prnc_2 + "," + prnc_3 + "," + mnc + "," + ponc_1 + "," + ponc_2 + "," + ponc_3;
	argstring += "&gap=" + gap;
	
	console.log(argstring);
	
	$.ajax({
		type: "POST",
		url: "/api/reset-data-cleaning",
		data: argstring,
		success: resetConfigDataCleaningSuccess
	});		
}

function resetConfigDataCleaningSuccess(data) {
	console.log(data);
	// show dialog
	$("body").append("<div id='div-add-series-dialog' title=" + getTranslation("MESSAGE") + ">" + getTranslation("RESET_OK") + "</div>");
	$("#div-add-series-dialog").dialog({
		modal: true,
		buttons: {
			Ok: function() {
				$(this).dialog("close");
				$("#div-add-series-dialog").remove();
			}
		}
	});
}

function executeDataCleaning() {			
	$.ajax({
		type: "POST",
		url: "/api/execute-data-cleaning",		
		success: executeDataCleaningSuccess
	});		
}

function executeDataCleaningSuccess(data) {
	console.log(data);
	lines = data.split("\n");
	console.log(lines.length);
		
	var meas = {
		'label': 'Measurement',
		data: []
	};
	var min = {
		'label': 'Cleaning MIN',
		data: []
	};
	var max = {
		'label': 'Cleaning MAX',
		data: []
	};
	
	// cut the initalization phase in the beginning
	var starti = 0;
	if (lines.length > 10) starti = 10;
	
	for (var i = starti; i < lines.length - 1; i++) {
		// transform the date into a Date object
		var tmpLine = lines[i].split(";");
		var tmpArr = tmpLine[0].split('T');
		var tmpDate = new Array(); tmpDate = tmpArr[0].split('-');
		var tmpTime = new Array(); tmpTime = tmpArr[1].split(':');
		if (tmpTime.length == 2) { tmpTime[2] = 0; }

		// Date format is Date(year, month, day, hour, minute, second)
		// note that months are zero-indexed, so January is 0 not 1
		var measDate = new Date(tmpDate[0], tmpDate[1] - 1, tmpDate[2], tmpTime[0], tmpTime[1], tmpTime[2]);
		meas.data.push({
			'date' : measDate,
			'value': tmpLine[1]
		});
		min.data.push({
			'date' : measDate,
			'value': tmpLine[2]
		});
		max.data.push({
			'date' : measDate,
			'value': tmpLine[3]
		});
	}
	
	chartNum++;
	if (chartNum > chartMax) chartNum = 1;
	
	divname = 'div-chart-' + chartNum;
	divnametext = 'div-chartname-' + chartNum;
	
	// remove old charts
	$("#" + divname).remove();
	$("#" + divnametext).remove();
	
	$("#div-chart-containter").prepend($('<div id="' + divname + '" />'));
	$("#div-chart-containter").prepend($('<br /><div id="' + divnametext + '" />'));
	
	var options = {		
		"width": "960px",
		"height": "400px"
	};        
	var elementId = divnametext;
	
	datasetarray = [ meas, min, max ];
	console.log(datasetarray);
	
	// CHAP
	chart = new links.Graph(document.getElementById(elementId));
	chart.draw(datasetarray, options);
	
}
// ----------------------------------------------------------------------------
// MAIN PROGRAM
// ----------------------------------------------------------------------------

// read input parameters
var debug = gup('debug');

// main function				  		
$(function() {
  // set new event date
  nowDate = new Date();
	nowDate.setDate(nowDate.getDate() + 1);
  startDate = new Date();
  startDate.setDate(nowDate.getDate() - 7);
  eventTime = mysqlDateStr(nowDate) + " 00:00:00";
  $("#ch-date-start").val(mysqlDateStr(startDate));
  $("#ch-date-end").val(mysqlDateStr(nowDate));
	
	
	// initialize nodes	
	$.ajax({
	  url: '/api/get-sensors',
		success: loadedSensors,
		error: function() { alert("Connection problem to EnStreaM ..."); }
	});
	
	$.ajax({
	  url: '/api/get-nodes',
	  success: loadedNodes
	});
	  
	$.ajax({
	  url: '/api/get-sensors',
	  success: loadedSensorsDataCleaning
	});		
	
	$("#div-overlay").click(function() {
	  $("#div-chart").css("display", "none");
		$(this).fadeOut();		
	});
	
	$("#ch-sensor").change(function() {	 
	  onSensorChange($(this).val());
	});
		
});
