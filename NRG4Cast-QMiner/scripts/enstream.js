// ---------------------------------------------------------------------------
// FILE: enstream.js
// AUTHOR: Klemen Kenda (IJS)
// DATE: 2013-06-01
// DESCRIPTION:
//   JS part of the EnStreaM engine, utilizing a simple Event Detection
//   Service.
// ---------------------------------------------------------------------------
// HISTORY:
// ---------------------------------------------------------------------------

// function definitions ------------------------------------------------------

// ---------------------------------------------------------------------------
// FUNCTION: onRequest - get-nodes
// DESCRIPTION: Get nodes.
// ---------------------------------------------------------------------------
http.onRequest("get-nodes", function(query, response) {	
	var str;
	var recSet = qm.store("Node").recs;
	
	str = "[";
	for(var i = 0; i < recSet.length; i++) {
	  str += '{';
	  str += '"Name": "' + recSet[i].Name + '",\n';
	  str += '"Position": [' + recSet[i].Position + ']\n';
	  str += '}';
	  if (i != recSet.length - 1) str += ',';
	}
	str += "]";
	
	response.send(str);
});

// ---------------------------------------------------------------------------
// FUNCTION: onGet - get-measurements
// DESCRIPTION: Get measurements.
// ---------------------------------------------------------------------------

http.onRequest("get-measurement", function(query, response) {
	var sensorname = query.name;	
	var dateStr = query.startdate;
	var endDateStr = query.enddate;

		// enter fake sensor aggregate to enter the correct time stamps
	var t = dateStr.split('-');
	var tEnd = endDateStr.split('-');
	var newDate = new Date(t[0], t[1]-1, t[2]);
	var endDate = new Date(tEnd[0], tEnd[1]-1, tEnd[2]);
	
	// insert timestamps into index (insert aggregate)
	var startDateRequest = '[{"node":{"id":"virtual-node","name":"virtual-node","lat":0,"lng":0,"measurements":[{"sensorid":"virtual-node-request","value":1.0,"timestamp":"' + dateStr + 'T00:00:00.000","type":{"id":"0","name":"virtual-request","phenomenon":"request","UoM":"r"}}]}}]';
	var endDateRequest = '[{"node":{"id":"virtual-node","name":"virtual-node","lat":0,"lng":0,"measurements":[{"sensorid":"virtual-node-request","value":1.0,"timestamp":"' + endDateStr + 'T00:00:00.000","type":{"id":"0","name":"virtual-request","phenomenon":"request","UoM":"r"}}]}}]';
	addMeasurement(JSON.parse(startDateRequest));
	addMeasurement(JSON.parse(endDateRequest));
	
	// ms since 1. 1. 1970 0:00:00
	// var zeroTime = 11644473600000;
	var zeroTime = 11644477200000;
	// add unix time * 1000 to get a QMiner timestamp
	// and prepare query via timestamp	
	// prepare timestamps
	var startts = zeroTime + newDate.getTime();
	var endts = zeroTime + endDate.getTime();
	
	var measuredRSet = qm.search({
		"$join": {
			"$name": "hasMeasurement",
			"$query": {
				"$from": "Sensor",
				"Name": sensorname				
			}
		},
		"Timestamp": [{"$gt":String(startts)}, {"$lt":String(endts)}]
	});	
	
	// "Timestamp": [{"$gt":String(startts)}, {"$lt":String(endts)}]	
	str = "[";
	for (var i = 0; i < measuredRSet.length; i++) {
		str += '{"Val":' + measuredRSet[i].Val + ', "Timestamp": "' + measuredRSet[i].Timestamp + '"}';
		if (i != measuredRSet.length - 1) str += ',';
	}
	str += "]";
	
	response.send(str);
});

// ---------------------------------------------------------------------------
// FUNCTION: onRequest - get-aggregates
// DESCRIPTION: Get aggregates.
// ---------------------------------------------------------------------------

http.onRequest("get-aggregates", function(query, response) {
	var sensorname = query.sensorid;
	var aggrtype = query.aggrtype;
	var windowlen = query.windowlen;	
	var dateStr = query.startdate;
	var endDateStr = query.enddate;
	
	// enter fake sensor aggregate to enter the correct time stamps
	var t = dateStr.split('-');
	var tEnd = endDateStr.split('-');
	var newDate = new Date(t[0], t[1]-1, t[2]);
	var endDate = new Date(tEnd[0], tEnd[1]-1, tEnd[2]);
	
	// insert timestamps into index (insert aggregate)
	var startDateRequest = '[{"node":{"id":"virtual-node","name":"virtual-node","lat":0,"lng":0,"measurements":[{"sensorid":"virtual-node-request","value":1.0,"timestamp":"' + dateStr + 'T00:00:00.000","type":{"id":"0","name":"virtual-request","phenomenon":"request","UoM":"r"}}]}}]';
	var endDateRequest = '[{"node":{"id":"virtual-node","name":"virtual-node","lat":0,"lng":0,"measurements":[{"sensorid":"virtual-node-request","value":1.0,"timestamp":"' + endDateStr + 'T00:00:00.000","type":{"id":"0","name":"virtual-request","phenomenon":"request","UoM":"r"}}]}}]';
	addAggregate(JSON.parse(startDateRequest));
	addAggregate(JSON.parse(endDateRequest));
	
	// ms since 1. 1. 1970 0:00:00
	var zeroTime = 11644477200000;
	// add unix time * 1000 to get a QMiner timestamp
	// and prepare query via timestamp	
	// prepare timestamps
	var startts = zeroTime + newDate.getTime();
	var endts = zeroTime + endDate.getTime();
	
	recSet = qm.search({
		"$join": {
			"$name": "hasAggregate",
			"$query": {
				"$from": "Sensor",
				"Name": sensorname				
			}
		},
		"AggrType": aggrtype,
		"WindowLen": windowlen,
		"Timestamp": [{"$gt":String(startts)}, {"$lt":String(endts)}]		
	});
	// TODO: example of Timestamp querying
	// "Timestamp": [{"$gt":"12906705600000"}, {"$lt":"13029933780000"}]
		
	// generate JSON recordset
	str = "[";
	for (var i = 0; i < recSet.length; i++) {
		str += '{"Val":' + recSet[i].Val + ', "Timestamp": "' + recSet[i].Timestamp + '"}';
		if (i != recSet.length - 1) str += ',';
	}
	str += "]";
	
	response.send(str);
});


// ---------------------------------------------------------------------------
// FUNCTION: onGet - get-measurements
// DESCRIPTION: Get measurements.
// ---------------------------------------------------------------------------

http.onRequest("get-cleaning-sample", function(query, response) {
		
	sensorRSet = qm.search({
		"$from": "Sensor",
		"Name": query.sensorid
	});
	
	var measuredRSet = sensorRSet[0].join("hasMeasurement");
	
	// we retrieve a maximum of 1000 measurements
	samplelength = measuredRSet.length;
	if (samplelength > 500) samplelength = 500;
	
	str = "";
	for (var i = 0; i < samplelength; i++) {		
		str += measuredRSet[i].Timestamp + ";" + measuredRSet[i].Val;
		str += '\n';	
	}	
	
	response.send(str);
});

// ---------------------------------------------------------------------------
// FUNCTION: onGet - add-measurement
// DESCRIPTION: Add measurement from middle layer (JSON)
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// FUNCTION: onGet - add-measurement
// DESCRIPTION: Add measurement from middle layer (JSON)
// ---------------------------------------------------------------------------
http.onRequest("add-measurement", function (query, response) {    
	    
    // parse string parameter to JSON    
    var data = JSON.parse(query.data);	
    // add the measurement
    var str = addMeasurement(data); 
    // add to journal
    // journal("measurement").log(data);

    response.send(str);
});

function addMeasurement(data) {
    // init str
    var str = "";
	
    // parse all the records in the JSON 
    for (i = 0; i < data.length; i++) {
        // parse node	
        var node = new Object();
        node.Name = data[i].node.name;
        node.Position = new Array();
        node.Position[0] = data[i].node.lat;
        node.Position[1] = data[i].node.lng;		
        // write node to the store				
        var nodeid = qm.store("Node").add(node);
				
        // parse measurements
        var measurements = data[i].node.measurements;
				
				
        for (j = 0; j < measurements.length; j++) {						
        	// parse type
            var type = new Object();
            type.Name = measurements[j].type.name;
            type.Phenomena = measurements[j].type.phenomenon;
            type.UoM = measurements[j].type.UoM;
            // write type to the store
            var typeid = qm.store("Type").add(type);
			
            // parse sensor
            var sensor = new Object();
            sensor.Name = measurements[j].sensorid;
            sensor.NodeId = nodeid;
            sensor.TypeId = typeid;
            // write sensor to the store
            var sensorid = qm.store("Sensor").add(sensor);
			
            // parse measurement
            var measurement = new Object();
            measurement.Val = measurements[j].value;
            measurement.Timestamp = measurements[j].timestamp;

            str += measurement.Timestamp  + "#Type=" + typeid + "\n";;
			
            measurement.SensorId = sensorid;
            measurement.TypeId = typeid;
            measurement.NodeId = nodeid;
			
            var measurementJSON = '{ "Val": ' + measurements[j].value + ', "Timestamp": "' + measurements[j].timestamp + '"'; // , "TypeId": ' + typeid + ', "NodeId": ' + nodeid //
            // measurementJSON += '}';  // override without indexing
            measurementJSON += ',';
            measurementJSON += '"Sensor": {"$id": ' + sensorid + ', "Name": "' + sensor.Name + '"}}';
			
            console.say(measurementJSON);
            try {
            	var measurementObj = JSON.parse(measurementJSON);
            	// write measurement to the store
            	var measurementid = qm.store("Measurement").add(measurementObj);
            } catch (e) {
            	console.say("Parsing error: " + e);
            }
        }       
    }		
    return str;
}

// TODO: make WindowLen and AggrType configurable from data parameter
function addAggregate(data) {
    // init str
    var str = "";
	
    // parse all the records in the JSON 
    for (i = 0; i < data.length; i++) {
        // parse node	
        var node = new Object();
        node.Name = data[i].node.name;
        node.Position = new Array();
        node.Position[0] = data[i].node.lat;
        node.Position[1] = data[i].node.lng;		
        // write node to the store				
        var nodeid = qm.store("Node").add(node);
				
        // parse measurements
        var measurements = data[i].node.measurements;
				
				
        for (j = 0; j < measurements.length; j++) {						
        	// parse type
            var type = new Object();
            type.Name = measurements[j].type.name;
            type.Phenomena = measurements[j].type.phenomenon;
            type.UoM = measurements[j].type.UoM;
            // write type to the store
            var typeid = qm.store("Type").add(type);
			
            // parse sensor
            var sensor = new Object();
            sensor.Name = measurements[j].sensorid;
            sensor.NodeId = nodeid;
            sensor.TypeId = typeid;
            // write sensor to the store
            var sensorid = qm.store("Sensor").add(sensor);
			
            // parse measurement
            var measurement = new Object();
            measurement.Val = measurements[j].value;
            measurement.Timestamp = measurements[j].timestamp;

            str += measurement.Timestamp  + "#Type=" + typeid + "\n";;
			
            measurement.SensorId = sensorid;
            measurement.TypeId = typeid;
            measurement.NodeId = nodeid;
			
            var measurementJSON = '{ "Val": ' + measurements[j].value + ', "Timestamp": "' + measurements[j].timestamp + '"'; // , "TypeId": ' + typeid + ', "NodeId": ' + nodeid //
            // measurementJSON += '}';  // override without indexing
            measurementJSON += ',"AggrType": "AVG", "WindowLen": "15",';
            measurementJSON += '"Sensor": {"$id": ' + sensorid + ', "Name": "' + sensor.Name + '"}}';
			
            // console.say(measurementJSON);
            var measurementObj = JSON.parse(measurementJSON);
            // write measurement to the store
            var measurementid = qm.store("Aggregate").add(measurementObj);
        }       
    }		
    return str;
}

// ---------------------------------------------------------------------------
// FUNCTION: EDSEngine
// DESCRIPTION: Simple Event Detection Service
// ---------------------------------------------------------------------------
function EDSEngine(measurement) {
    // console.say("Performing event detection ...");

    // extract all the related metadata
    var sensor = qm.store("Sensor")[measurement.SensorId];
    var node = qm.store("Node")[sensor.NodeId];
    var type = qm.store("Type")[sensor.TypeId];

    // get all the relevant rules
    var rules = qm.store("Rule");

	// make one compact object of all measured phenomena
	measurement.sensor = sensor;
	measurement.node = node;	
	measurement.type = type;
	
    // trigger the rule by fetchStr
    for (var i = 0; i < rules.length; i++) {
        if (EDSEvaluateRule(rules[i], measurement)) {			
            EDSTriggerAlarm(rules[i]);
        };
    }
}


// ---------------------------------------------------------------------------
// FUNCTION: EDSEvaluateRule
// DESCRIPTION: Simple Rule Evaluation
// ---------------------------------------------------------------------------
function EDSEvaluateRule(ruleJSON, measurement) {
    
	// parse rule
    rule = JSON.parse(ruleJSON.Rule);

    var property;
    var value;
    var operator;

	// initalize result
	var result = true;
	
    for (var p in rule) {
        if (rule.hasOwnProperty(p)) {			
            property = p;
            if (typeof rule[p] == "object") {                
                for (var r in rule[p]) {
                    // parse operator
                    operator = r;
                    // parse value
                    value = rule[p][r];
                }
            } else {
                operator = "$eq";
                value = rule[p];
            }
        }			
		// console.say(property + " " + operator + " " + getValue(property, measurement) + " " + value);
		// console.say("Atom: " + EDSEvaluateAtom(property, operator, value, measurement));
		result = result && EDSEvaluateAtom(property, operator, value, measurement)	;
		// console.say("Result: " + result);
    }
        
    return result;
}

// ---------------------------------------------------------------------------
// FUNCTION: getValue
// DESCRIPTION: Get property value from a nested object
// ---------------------------------------------------------------------------
function getValue(searchproperty, obj) {
	for (var p in obj) {
        if (obj.hasOwnProperty(p)) {			
            property = p;			
            if (typeof obj[p] == "object") {                				
                var value = getValue(searchproperty, obj[p]);				
				if (value != "") return value;
            } else {					
                if (searchproperty == property) return obj[p];
            }
        }
    }
	return "";
}

// ---------------------------------------------------------------------------
// FUNCTION: EDSEvaluateAtom
// DESCRIPTION: Simple Atom Rule Evaluation
// ---------------------------------------------------------------------------
function EDSEvaluateAtom(property, operator, value, measurement) {
	// console.say("Operator:" + operator);
	if (operator == "$eq") {
		if (value == getValue(property, measurement)) return true
		else return false;
	} else if (operator == "$gt") {
		// console.say(getValue(property, measurement) + " > " + value + "?");
		if (getValue(property, measurement) > value) return true
		else return false;
	} else if (operator == "$lt") {
		if (getValue(property, measurement) < value) return true
		else return false;
	}
	// console.say("error");
	return false;
}

// ---------------------------------------------------------------------------
// FUNCTION: EDSTriggerAlarm
// DESCRIPTION: Simple Alarm Trigger
// ---------------------------------------------------------------------------
function EDSTriggerAlarm(rule) {
	var url = "http://opcomm.ijs.si/api/trigger-alarm?message=Temperature over 20deg outside!";
	console.say("Triggering alarm!");
	qm.getStr(url);
}


// initializing triggers on measurement store --------------------------------
qm.store("Measurement").addTrigger({
    onAdd: function (measurement) { EDSEngine(measurement) }
});


// definition of generic functions -------------------------------------------

// ---------------------------------------------------------------------------
// FUNCTION: onGet - add
// DESCRIPTION: Generic store add function
// ---------------------------------------------------------------------------
http.onRequest("add", function (rec, response) {
    qm.store(rec.store).add(JSON.parse(rec.data));
    response.send("OK");
});

// ---------------------------------------------------------------------------
// FUNCTION: onGet - records
// DESCRIPTION: Generic store retrieve records function
// ---------------------------------------------------------------------------
http.onRequest("records", function (query, response) {
    var recs = qm.store(query.store).recs;
    var str = "";

    if (recs.empty) str = "No records ...";

    for (var i = 0; i < recs.length; i++) {
        str += objToString(recs[i]);
        str += "\n";
    }
    response.send(str);
});

// obsolete debug stuff -----------------------------------------------------
http.onRequest("test", function(rec, response) {
		recs = qm.search({"$from":"Measurement","Timestamp":{"$lt":"13029435219000"}});
		
		var str = "";

    if (recs.empty) str = "No records ...";

    for (var i = 0; i < recs.length; i++) {
        str += objToString(recs[i]);
        str += "\n";
    }

    response.send(str);		    
});

// help functions -----------------------------------------------------------
function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}

function displayObject(recs) {
    var str = "";

    if (recs.empty) str = "No records ...";

    for (var i = 0; i < recs.length; i++) {
        str += objToString(recs[i]);
        str += "\n";
    }
	return str;
}

function lZ(myStr) {
  outStr = myStr;
  if (myStr.length == 1) {
	  outStr = "0" + myStr;
  }
	return outStr;
}

function mysqlDateStr(myDate) {		 
  return myDate.getFullYear() + "-" + lZ((myDate.getMonth() + 1) + "") + "-" + lZ(myDate.getDate() + "");
}

// importing libraries -------------------------------------------------------
import "./util.js"
