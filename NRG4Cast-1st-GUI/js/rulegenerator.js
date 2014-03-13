// ---------------------------------------------------------------------------
// FILE: rulegenerator.js
// DESCRIPTION: QMiner GUI rulegenerator based functions
// DATE: 01/10/2013
// HISTORY:
// ---------------------------------------------------------------------------

// global variables ----------------------------------------------------------
var loadedSensorsPredict = 0;
var failedSensorsPredict = 0;
var maxSensorsPredict;
var typeSensorsPredict = 'waterflow';
var sensorValues = [];
var sensorPredictions = [];
var sensorNames = [];

// GUI functions -------------------------------------------------------------
function startADChart() {
  if (loadedSensorsPredict == 0) {
	  console.log("ADChart: start reading sensors");
  	$.ajax({
  	  url: '/xml/current-state',
  		success: loadedADChartCS
  	});		
	}
}

function loadedADChartCS(data) {
	// check errors
	handleError(data);			     			
  maxSensorsPredict = 0;
	
  sensorValues = [];
  sensorPredictions = [];
  sensorNames = [];
	
	// get typeSensorsPredict
	typeSensorsPredict = $("#phenomenon option:selected").val();
	
	console.log(typeSensorsPredict);
	
	// parse XML & create markers & create info windows
  $(data).find("node").each(function() {
    var node = $(this);
		
		// parse sensors
		i = 0;
		$(node).find("sensor").each(function() {
		  i++;
			var sensor = $(this);
			var sensorname = sensor.attr("name").split(":").join("\\colon;");
			
			if (trimUrn(sensor.attr("featureofmeasurement")) == typeSensorsPredict) {
			  maxSensorsPredict += 1;			
				console.log(sensorname);  
				$.ajax({
				  dataType: "json",
					context: { sensor : sensorname },
       	  url: '/xml/predict-anomaly-value?p=' + sensorname,
       		success: loadedADChartPredictValues,
			error: loadedADChartError
       	});			
			}									
		});
	});																							
}

function loadedADChartError() {
	//sensorNames[loadedSensorsPredict] = this.sensor.split("\\colon;").join(":");
	//sensorValues[loadedSensorsPredict] = data.value;
	// sensorPredictions[loadedSensorsPredict] = data.predicted;
	
  failedSensorsPredict += 1;
  	myValue = Math.round((loadedSensorsPredict + failedSensorsPredict) / maxSensorsPredict * 100);
	$("#progressbar").html((loadedSensorsPredict + failedSensorsPredict) + "/" + maxSensorsPredict + " - " + myValue + "%");		
	if ((loadedSensorsPredict + failedSensorsPredict) == maxSensorsPredict) {
	  loadedSensorsPredict = 0;	
		console.log("ADChart: finished reading sensors");
		addADChart();
	} 
  console.log("failed:" + failedSensorsPredict);
}

function loadedADChartPredictValues(data) {

  if (data.predicted < -500) predicted = data.value + 1
 	  else predicted = data.predicted;
  // predicted = data.predicted;

	sensorNames[loadedSensorsPredict] = this.sensor.split("\\colon;").join(":");
	sensorValues[loadedSensorsPredict] = data.value;
	sensorPredictions[loadedSensorsPredict] = predicted;
	
  loadedSensorsPredict += 1;
	myValue = Math.round((loadedSensorsPredict + failedSensorsPredict) / maxSensorsPredict * 100);
	$("#progressbar").html((loadedSensorsPredict + failedSensorsPredict) + "/" + maxSensorsPredict + " - " + myValue + "%");		
	if ((loadedSensorsPredict + failedSensorsPredict) == maxSensorsPredict) {
	  loadedSensorsPredict = 0;	
		console.log("ADChart: finished reading sensors");
		addADChart();
	} 
}

function addADChart() {
  // remove failed sensors predictions from maxValue
  maxSensorsPredict -= failedSensorsPredict;
  maxSensorsPredict 
  failedSensorsPredict = 0;
  console.log(maxSensorsPredict);
  
  // create Fusion Charts XML
	xmlChart = '<graph showAlternateHGridColor="1" divlinecolor="CCEBFF" decimalPrecision="2"';
	xmlChart +=' divLineDecimalPrecision="0" limitsDecimalPrecision="0" numdivlines="4" rotateNames="1">'; 
	
	xmlChart += '<categories>';
	
	for(i = 0; i < maxSensorsPredict; i++) {
    xmlChart += '  <category name="' + sensorNames[i].substr(sensorNames[i].length - 21) + '" xIndex="' + i + '"/>';
	}
  xmlChart += '</categories>';

	xmlChart += '<data>';

	for (i = 0; i < maxSensorsPredict; i++) {
    xmlChart += '<set name="test" open="' + sensorValues[i] + '" high="' + sensorValues[i] + '" low="' + sensorPredictions[i] + '" close="' + sensorPredictions[i] + '" xIndex="' + i + '"/>';
  }
				
	xmlChart += '</data>';
	xmlChart += '</graph>';
			
	// display chart
	divname = 'div-chart-ad';
	divnametext = 'div-chartname-ad';
	
	// remove old charts
	$("#" + divname).remove();
	$("#" + divnametext).remove();
	
	$("#div-chart-containter").prepend($('<div id="' + divname + '" />'));
	$("#div-chart-containter").prepend($('<br /><div id="' + divnametext + '" />'));
		
	
	$("#" + divnametext).html("<h3>Measured vs. predicted</h3>White bars - prediction is higher than measurement, black bars - prediction is lower than measurement.");
	
	// display chart
	$("#div-chart-ad").insertFusionCharts({
	  swfPath: "template/charts/",
		type: "Candlestick",
		data: xmlChart,
		dataFormat: "XMLData",
		width: "650",
		height: "600"
	});			
}

function loadedKeys(myData) {
	console.log("loadedKeys");
	var firstkeyid = -1;
	$(myData).find("store[id=4]").find("keys:last").find("key").each(function(i) {
	  var key = $(this);		
		var keyid = key.attr("id");
		if (firstkeyid == -1) firstkeyid = keyid;		
		var keyname = key.attr("name"); 	  
		if (keyname.substr(0, 6) != "Record")
				$("<option value=\"" + keyid + "\">" + keyname + "</option>").appendTo("#key");
	});	
	
	$.ajax({
	  url: '/xml/word-voc?p=' + firstkeyid,
	  success: loadedKeyVals
	});
}

function loadedKeyVals(myData) {
  console.log("loadedKeyVals");
	$("#value > option").remove();
	$(myData).find("word").each(function(i) {
	  var wordStr = $(this).attr("str");
		$("<option value=\"" + wordStr + "\">" + wordStr + "</option>").appendTo("#value");
	});
}

function loadedCurrentState(myData) {
  console.log("loadedCurrentState");
	
	// parse XML & create markers & create info windows
  $(myData).find("node").each(function() {
    var node = $(this);
		var nodeName = node.attr("name");
		// parse sensors
		$(node).find("sensor").each(function() {
			var sensor = $(this);
			var sensorid = sensor.attr("id");
			var sensorname = trimUrn(sensor.attr("name"));
			// sensorname = sensor.attr("name");
			var keyname = "FTR_" + sensor.attr("featureofmeasurement").toUpperCase();
			console.log(keyname);
			$("<option value=\"" + sensorid + "\">" + sensorname + "</option>").appendTo("#ch-sensor");
		});
	});
}

// generating the rule
var conditionOr = new Array();
var conditionKey = new Array();
var conditionOp = new Array();
var conditionVal = new Array();
var currentCondition = 1;
var sensorAsUrn = 0;

conditionOr[0] = false;
conditionKey[0] = "$from";
conditionOp[0] = "$eq";
conditionVal[0] = "SensorAggregate";

function splitSensorProperty(str) {
  var i;
  for (i = str.length; (i > 0) && (str[i] != "-"); i--) {}
  return str.substring(0, i);
}

function generateJSONRule() {
  var jsonStr = "{";
	var orBlock = false;
	
  for (i = 0; i < currentCondition; i++) {
	   // new OR block
	   if (conditionOr[i] == true && orBlock == false) {
		   jsonStr += "\"$or\":[";
		 }
		 
		 multipleValues = false;
		 if ((i > 0) && (conditionKey[i - 1] == conditionKey[i])) { 
		     // open last parenthesis and add a comma
			 jsonStr = jsonStr.substring(0, jsonStr.length - 2) + ", ";
			 // add [ after "Value":
			 // valuePos = strpos(jsonStr, "Value");
			 valuePos = strpos(jsonStr, conditionKey[i]);			 
			 jsonStr = jsonStr.substr(0, valuePos + conditionKey[i].length + 2) + "[" + jsonStr.substr(valuePos + conditionKey[i].length + 2);
			 multipleValues = true;			 
		 } else {
		 	 if (conditionOr[i] == true) jsonStr += "{";
		   jsonStr += "\"" + conditionKey[i] + "\":";
		 }
		 
		 if (conditionOp[i] == "$eq") {
		   if ((conditionKey[i] == "Sensor") && (sensorAsUrn == 1)) jsonStr += "\"" + splitSensorProperty(sensoruid[conditionVal[i]]) + "\""
		   else jsonStr += "\"" + conditionVal[i] + "\"";
		 } else {
			jsonStr += "{";
			jsonStr += "\"" + conditionOp[i] + "\":\"" + conditionVal[i];
			jsonStr += "\"}";
			if (multipleValues == true) jsonStr += "]";
		 }
		 
		 if (conditionOr[i] == true) jsonStr += "}";
		 
		 orBlock = conditionOr[i];
		 
		 // finish OR block
		 if (i < currentCondition && conditionOr[i + 1] == false && orBlock == true) {
		   jsonStr += "]";
		 }
		 
		 if (i != currentCondition - 1) jsonStr += ", ";		 		 
	}
	
	// end last OR block if exists
    if (orBlock == true) {
      jsonStr += "]";
	}
	
	jsonStr += "}";
	return jsonStr;
}

function deleteLastCondition() {
  if (currentCondition > 1) {
    conditionKey[currentCondition] = "";
    currentCondition--;
  }
  $("#div-conditions").html(generateJSONRule());
}

function deleteAllConditions() {
  currentCondition = 1;
	$("#div-conditions").html(generateJSONRule());
}

function addCondition() {
  conditionOr[currentCondition] = $("#or").attr("checked");
  conditionKey[currentCondition] = $("#key option:selected").text();
	conditionOp[currentCondition] = $("#op option:selected").val();
	conditionVal[currentCondition] = $("#value option:selected").text();
	currentCondition++;
	
  $("#div-conditions").html(generateJSONRule());
}

function addSuggestCondition(or, key, op, val) {
  conditionOr[currentCondition] = or;
  conditionKey[currentCondition] = key;
	conditionOp[currentCondition] = op;
	conditionVal[currentCondition] = val;
	currentCondition++;	
}

function getCKeyVal(val) {
  m = 99999;
	j = 0;
  for(i = 0; i < possibleVals.length; i++) {
	  if (m > Math.abs(val - possibleVals[i])) {
		  m = Math.abs(val - possibleVals[i]);
			j = i;
		}			
	}	
	console.log(m, j, possibleVals[j]);
	if (j == 0) return "0.0";
	
	return possibleVals[j].toFixed(1);
}

function createSuggestedRule(sensor, type, timespan, val1, val2, val3, val4, val5) {
  deleteAllConditions();
	
	// gap = getTranslation("SUGGEST_GAP");
	gap = 10.0;
	
	addSuggestCondition(false, "Sensor", "$eq", sensor);
	addSuggestCondition(false, "Type", "$eq", type);
	addSuggestCondition(false, "TimeSpan", "$eq", timespan);
	addSuggestCondition(false, "Value", "$lt", getCKeyVal(val1 + gap));
	addSuggestCondition(false, "Value", "$gt", getCKeyVal(val1 - gap));
	
	addSuggestCondition(false, "Value_1I_ago", "$lt", getCKeyVal(val2 + gap));
	addSuggestCondition(false, "Value_1I_ago", "$gt", getCKeyVal(val2 - gap));
	
	addSuggestCondition(false, "Value_2I_ago", "$lt", getCKeyVal(val3 + gap));
	addSuggestCondition(false, "Value_2I_ago", "$gt", getCKeyVal(val3 - gap));
	
	addSuggestCondition(false, "Value_3I_ago", "$lt", getCKeyVal(val4 + gap));
	addSuggestCondition(false, "Value_3I_ago", "$gt", getCKeyVal(val4 - gap));

	addSuggestCondition(false, "Value_4I_ago", "$lt", getCKeyVal(val5 + gap));
	addSuggestCondition(false, "Value_4I_ago", "$gt", getCKeyVal(val5 - gap));


	/*
	addSuggestCondition(false, "Value_2I_ago", "$lt", val3 - gap);
	addSuggestCondition(false, "Value_2I_ago", "$gt", val3 + gap);
	addSuggestCondition(false, "Value_3I_ago", "$lt", val4 - gap);
	addSuggestCondition(false, "Value_3I_ago", "$gt", val4 + gap);
	addSuggestCondition(false, "Value_4I_ago", "$lt", val5 - gap);
	addSuggestCondition(false, "Value_4I_ago", "$gt", val5 + gap);
	*/
				
	
	$("#div-conditions").html(generateJSONRule()); 
}

function loadedQuery(myData) {
  console.log("loadedQuery");
	console.log(myData);
	var HTML = "<h2>" + getTranslation("RESULTS") + "</h2>";		
	
	$(myData).find("record").each(function() {
	  var record = $(this);
		var sensorid;
		var eventtime;
		$(record).find("field[name='AggregateSensorUId']").each(function() {
		  sensorid = $(this).attr("text");
		});
		$(record).find("field[name='AggregateTime']").each(function() {
		  eventtime = $(this).attr("text");
		});
		HTML += eventtime + " @ sensor " + sensorid + "<br>";
	});
	
	$("#div-results").html(HTML);
}

function executeQuery() {
  var queryStr = generateJSONRule();
	var url = "/proxy.php?cmd=op-search&p=q=" + escape(queryStr);
	console.log(url);
	$.ajax({
	  url: url,
		success: loadedQuery
	});
}

function xml_to_string(xml_node)  {
  if (xml_node.xml)
    return xml_node.xml;
  else if (XMLSerializer) {
    var xml_serializer = new XMLSerializer();
    return xml_serializer.serializeToString(xml_node);
  } else {
    alert("ERROR: Extremely old browser");
    return "";
  }
}

function getRuleML() {
  var queryStr = generateJSONRule();	
	var eventStr = $("#eventname").val();
	
	var url = "/proxy.php?cmd=ruleml&p=event=" + escape(eventStr) + "|q=" + escape(queryStr); 
	console.log(eventStr);
	window.open(url);
}

function exportEPS() {
  // include sensor URN (instead of internal EnStreaM id) in the JSON
  sensorAsUrn = 1;
  var queryStr = generateJSONRule();	
  sensorAsUrn = 0;
  var eventStr = $("#eventname").val();
	
  var url = "/en/registerjson.html?jsonStm=" + queryStr + "&eventType=" + eventStr; 
  console.log(url);
  
  $.ajax({
	 url: url,
	 success: successExportEPS
  });  
}

function successExportEPS(data) {	

  alert("Rule was registered successfully!");	
  /*
  if (data == 1) alert("Rule was registered successfully!");
  else {
    alert("Error! Rule was not registered!");
    console.log("EPS failiure trace:\n" + data);
  }
  */
	
}

function getRDFData() {
  var queryStr = generateJSONRule();	
	var url = "/proxy.php?cmd=rdf&p=json=" + escape(queryStr);
	window.open(url);	
}

$("#key").live('change', function() {
   console.log($(this).val());
	 $.ajax({
	   url: '/xml/word-voc?p=' + $(this).val(),
		 success: loadedKeyVals
	 });
});	

function selectDate(date) {
  $("#ch-date").val(date);
	$("#pr-date").val(date);
	$.ajax({
	  url: '/xml/predict-event?p=' + date,		
		dataType: 'json', 	
		success: loadedPredictEvents
	});
}

// --------------------------------------------------------------------------
// function: suggestRule
// --------------------------------------------------------------------------

function suggestRule(date, lat, lng) {
  // query for aggregates (SUM for all timespans for landslide scenario)
  		
	// display last 5 aggregates
	
	// add update with similar events (*)
	
	// add update with other sensors
	
	// show dialog
	// create HTML with contents
	HTML = getTranslation("SUGGEST_RULE_CLICK");
	HTML += "<table class='table-suggest-rule' id='table-suggest-rule'";
	HTML += "  <tr><td>Aggregate</td><td>x(t)</td><td>x(t - 1I)</td><td>x(t - 2I)</td><td>x(t - 3I)</td><td>x(t - 4I)</td></tr>";
	/*
	HTML += "  <tr><td><a href='#'>precipitation - SUM[D]</a></td><td>0.0</td><td>0.0</td><td>6.2</td><td>0.8</td><td>0</td></tr>";
  HTML += "  <tr><td><a href='#'>precipitation - SUM[3D]</a></td><td>0.4</td><td>6.2</td><td>0.8</td><td>0.0</td><td>0.4</td></tr>";
	HTML += "  <tr><td><a href='#'>precipitation - SUM[W]</a></td><td>7.4</td><td>0.4</td><td>8.8</td><td>23.8</td><td>38.2</td></tr>";
	HTML += "  <tr><td><a href='#'>precipitation - SUM[M]</a></td><td>19.6</td><td>83.4</td><td>78.9</td><td>73.8</td><td>34.0</td></tr>";
	HTML += "</table>";
  */	
	
  $("body").append("<div id='div-suggest-rule' title='" + getTranslation("SUGGEST_RULE").toUpperCase() + "'>" + HTML + "</div>");
  $("#div-suggest-rule").dialog({
	  width: 600,
		height: 300,
		close: function() {
			$('#div-suggest-rule').remove();
		}
	});
	
	console.log(date);
	
	// poll possible aggregates
	var observedProperty = "precipitation";
    var sid = 1;
	var sd = date;	
	var type = "SUM";
	var timespans = new Array("M", "W", "3D", "D");	
	
	for(i = 0; i < timespans.length; i++) { 
	  timespan = timespans[i];
  	myUrl = "/xml/get-aggregates?p=" + sid + ":" + sd + ":" + type + ":" + timespan;
  	console.log(myUrl);
  		
  	$.ajax({
		  context: { sensor: sid, type : type, timespan : timespan, observedProperty : observedProperty },
  	  url: myUrl,
  		success: loadedSuggestRuleData,
  		dataType: "xml",
  	});
	};
	
	// get possible values from vocabulary
	$.ajax({
	  url: '/xml/word-voc?p=34',
	  success: loadedValueVals
	});
}

var possibleVals = [];

function compare(a,b){
  return a-b;
}

function loadedValueVals(myData) {
  console.log("loadedValueVals");	
	console.log(myData);
	$(myData).find("word").each(function(i) {
	  var wordStr = $(this).attr("str");
		possibleVals.push(parseFloat(wordStr));
	});
	possibleVals.sort(compare);
	console.log(possibleVals);
}

function loadedSuggestRuleData(myData) {
	var values = [];
  $(myData).find("set").each(function(index) {
	  if (index > 14) {
		  values[19 - index] = $(this).attr("value");
		};
	});
	
	$("#table-suggest-rule tr:last").after('<tr>' + 
	  "<td>" + 
		"<a href=\"javascript:createSuggestedRule(" + this.sensor + ", '" + this.type + "','" + this.timespan + "'," + values[0] + "," + values[1] + "," + values[2] + "," + values[3] + "," + values[4] + ")\">" +
		this.observedProperty + " - " + this.type + "[" + this.timespan + "]" + "</a></td>" +
		"<td>" + values[0] + "1</td>" +
		"<td>" + values[1] + "</td>" +
		"<td>" + values[2] + "</td>" +
		"<td>" + values[3] + "</td>" +
		"<td>" + values[4] + "</td>" +								  
	  "</tr>"
	);	
}


var eventMarker = new Array();

function showOnMap(id, nodeName, lat, lng) {
	var markerLatLng = new google.maps.LatLng(lat, lng);
	
	// create marker	
	if (eventMarker[id] == null) {	  	
		eventMarker[id] = new google.maps.Marker({	
  	  position: markerLatLng,
  	  title: nodeName,
			icon: "http://labs.google.com/ridefinder/images/mm_20_green.png"
  	});		
	}
	
	map.panTo(markerLatLng);
  	
	if (eventMarker[id].getMap() != null) eventMarker[id].setMap(null);
	else eventMarker[id].setMap(map);
}

function loadedEvents(myData) {
  console.log("loadedEvents");
	var HTML = "<h2>" + getTranslation("EVENTS") + "</h2><ul>";
	
	$(myData).find("event").each(function() {
	  var event = $(this);
		console.log($(this));
		var eventTime = event.attr("timestamp");
		var eventDate = eventTime.substr(0, 10);
		HTML += "<li><a href=\"javascript:selectDate('" + eventDate + "');\">" + event.attr("name") + "</a>";
		HTML += " [ <a href=\"javascript:showOnMap(" + event.attr("id") + ", '" + escape(event.attr("name")) + "', " + event.attr("latitude") + ", " + event.attr("longitude") + ");\">" + getTranslation("SHOW") + "</a> ";
		HTML += " | <a href=\"javascript:suggestRule('" + eventDate + "', " + event.attr("latitude") + ", " + event.attr("longitude") + ");\">" + getTranslation("SUGGEST_RULE") + "</a>&nbsp;]<br>";
		HTML += "<font style=\"font-size: 10px\">" + eventTime + "</font></li>";
	});
	
	HTML += "</ul>";
	
	$("#div-events").html(HTML);
}

function inspect(obj, maxLevels, level)
{
  var str = '', type, msg;

    // Start Input Validations
    // Don't touch, we start iterating at level zero
    if(level == null)  level = 0;

    // At least you want to show the first level
    if(maxLevels == null) maxLevels = 1;
    if(maxLevels < 1)     
        return '<font color="red">Error: Levels number must be > 0</font>';

    // We start with a non null object
    if(obj == null)
    return '<font color="red">Error: Object <b>NULL</b></font>';
    // End Input Validations

    // Each Iteration must be indented
    str += '<ul>';

    // Start iterations for all objects in obj
    for(property in obj)
    {
      try
      {
          // Show "property" and "type property"
          type =  typeof(obj[property]);
          str += '<li>(' + type + ') ' + property + 
                 ( (obj[property]==null)?(': <b>null</b>'):('')) + '</li>';

          // We keep iterating if this property is an Object, non null
          // and we are inside the required number of levels
          if((type == 'object') && (obj[property] != null) && (level+1 < maxLevels))
          str += inspect(obj[property], maxLevels, level+1);
      }
      catch(err)
      {
        // Is there some properties in obj we can't access? Print it red.
        if(typeof(err) == 'string') msg = err;
        else if(err.message)        msg = err.message;
        else if(err.description)    msg = err.description;
        else                        msg = 'Unknown';

        str += '<li><font color="red">(Error) ' + property + ': ' + msg +'</font></li>';
      }
    }

      // Close indent
      str += '</ul>';

    return str;
}

function loadedPredictEvents(myData) {
  console.log("loadedPrediction");
	$("#div-prediction-result").text(" " + myData[0].event + " probability is " + myData[0].probability + ".");	  
}

function loadEvents() {  
  $("#ta-loadevents").text("date;precday;name;long;lat;volume");
  $("#div-loadevents").dialog('open');
};

function sendEventsSuccess(data) {  
	$.ajax({
	  url: '/xml/get-events',
		success: loadedEvents
	});
}

function sendEvents() {
  console.log("Events sent for saving.");
  myData = $("#ta-loadevents").val();	
	$.post('/xml/add-events', { p : myData }, sendEventsSuccess);		
}

function exportStreamReasoner() {
  var queryStr = generateJSONRule();	
	var eventStr = $("#eventname").find("option:selected").text();
	// val();
		
	// var url = "/proxy.php?cmd=datalog&p=event=" + escape(eventStr) + "|q=" + escape(queryStr);
	var url = "/en/iris.html?event=" + escape(eventStr) + "&query=" + escape(queryStr);
	console.log(url);
	
	$.ajax({
	  url: url,
		success: loadedIrisResults
	});
}

function loadedIrisResults(myData) {
  console.log(myData);
  $("#ta-loadevents").text(myData);
	$("#div-loadevents").dialog('open');
}

function loadedEventTypes(myData) {
  $(myData).find("uri").each(function() {
	  var event = $(this);
		console.log($(this).text());
		
	  var eventTypeVal = $(this).text();
		var eventType = eventTypeVal.substring(strpos(eventTypeVal, "#", 0) + 1);
		$("<option value=\"" + eventTypeVal + "\">" + eventType + "</option>").appendTo("#eventname");	
			
	});
}

$(function() {	
	
	$("#ch-date-start").datepicker({		
	  showOn: "button",
		// buttonImage: "images/calendar.gif",
		changeMonth: true,
		changeYear: true,
		dateFormat: "yy-mm-dd"
	});
	
	$("#ch-date-end").datepicker({		
	  showOn: "button",
		// buttonImage: "images/calendar.gif",
		changeMonth: true,
		changeYear: true,
		dateFormat: "yy-mm-dd"
	});
	
	$("#pr-date").datepicker({		
	  showOn: "button",
		// buttonImage: "images/calendar.gif",	
		changeMonth: true,
		changeYear: true,		
		dateFormat: "yy-mm-dd"
	});
	
	$("#pr-date").change(function() {	 
	  $.ajax({
		  url: '/xml/predict-event?p=' + $(this).val(),		
			dataType: 'json', 	
			success: loadedPredictEvents
		});
	});
	
	$("#sosid").change(function() {
	  // set cookie
		setCookie("sosid", $(this).val(), 100);		
		
		// reload page
		location.reload();
	});
	
	$("#div-loadevents").dialog({
	  autoOpen: false,
		width: 650,
		minHeight: 300,
		modal: true,
			buttons: {
				Ok: function() {
				  sendEvents();
					$( this ).dialog( "close" );
				}
			}
	});
	
});