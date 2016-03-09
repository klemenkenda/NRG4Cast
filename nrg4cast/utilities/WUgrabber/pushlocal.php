<?PHP
// Grabber from weather underground
include("inc/http.inc.php");
include("inc/config.inc.php");

function createMeasurement($place, $ts, $phen, $val, $par, $uom) {
	$measurement = array();
	
	$measurement["phenomenon"] = $phen;
	$measurement["sensortype"] = "WU-" . $phen;
	$measurement["sensorID"] = "WU-" . $place["place"] . "-" . $measurement["sensortype"];
	$measurement["timestamp"] = $ts;
	$measurement["uom"] = $uom;	
	// value
	if (isset($val[$par])) $measurement["value"] = $val[$par];
	else $measurement["value"] = $val["avg"]; 
	
	return $measurement;
}

function makeJSON($place, $ts, $t, $h, $p, $w, $c, $wd, $par) {
		// set node parameters
		$nodeId = "WU-" . $place["place"];
		$nodeName = $nodeId;
		$lat = $place["lat"];
		$lng = $place["lng"];
		
		// start JSON
    $JSON =<<<EOF
[
   {
      "node":{
         "id":"$nodeId",
         "name":"$nodeName",
         "lat":$lat,
         "lng":$lng,
         "measurements":[
EOF;
		$measurements = array();
		// create masurements
		$measurements[0] = createMeasurement($place, $ts, "temperature", $t, $par, "deg C");
		$measurements[1] = createMeasurement($place, $ts, "humidity", $h, $par, "%");
		$measurements[2] = createMeasurement($place, $ts, "pressure", $p, $par, "mbar");		
		$measurements[3] = createMeasurement($place, $ts, "windspeed", $w, $par, "m/s");
		$measurements[4] = createMeasurement($place, $ts, "cloudcover", $c, $par, "%");
		$measurements[5] = createMeasurement($place, $ts, "winddirection", $wd, $par, "deg");				

    // create JSON
		$i = 0;
    foreach($measurements as $measurement) {
			if ($i != 0) $JSON .= ",\n";
			$i++;
    	// 2014-01-22T16:52:00.000
    	$sensorId = $measurement["sensorID"];
    	$val = $measurement["value"];
    	$timestamp = str_replace(" ", "T", $measurement["timestamp"] . ".000");
			$phenomenon = $measurement["phenomenon"];
    	$sensortype = $measurement["sensortype"];
    	$sensortypeid = $measurement["sensortype"];
    	$uom = $measurement["uom"];
	
  	$JSON .=<<<EOF
            {
               "sensorid":"$sensorId",
               "value":$val,
               "timestamp":"$timestamp",
               "type":{
                  "id":"$sensortypeid",
                  "name":"$sensortype",
                  "phenomenon":"$phenomenon",
                  "UoM":"$uom"
               }
            }
EOF;
}

		// end JSON						
		$JSON .=<<<EOF

         ]
      }
   }
]
EOF;
		$JSON = preg_replace('/\s+/', '', $JSON);
		return $JSON;
}

function lz($a) {
  if (strlen($a) == 1) return "0" . $a;
	return $a;
}

foreach($node as $place) {
	// save csv
	$fp = fopen($place["place"] . ".csv", "r");
	$src = fread($fp, 1000000);

	$lines = explode("\n", $src);
	foreach ($lines as $line) {
		// CET [0],Max TemperatureC,Mean TemperatureC,Min TemperatureC,
		// Dew PointC,MeanDew PointC,Min DewpointC,
		// Max Humidity[7], Mean Humidity, Min Humidity, 
		// Max Sea Level PressurehPa[10], Mean Sea Level PressurehPa, Min Sea Level PressurehPa, 
		// Max VisibilityKm [13], Mean VisibilityKm, Min VisibilitykM, 
		// Max Wind SpeedKm/h[16], Mean Wind SpeedKm/h, Max Gust SpeedKm/h,
		// Precipitationmm[19], CloudCover[20], Events,WindDirDegrees[22]
		$meas = explode(",", $line);
		// print_r($meas);
		// exit();
		$date = $meas[0];
		$datestr = explode("-", $date);
		$date = $datestr[0] . "-" . lz($datestr[1]) . "-" . lz($datestr[2]);
		if ($meas[1] != "") {
   		$t["max"] = $meas[1]; $t["avg"] = $meas[2]; $t["min"] = $meas[3];
   		$h["max"] = $meas[7]; $h["avg"] = $meas[8]; $h["min"] = $meas[9];
   		$p["max"] = $meas[10]; $p["avg"] = $meas[11]; $p["min"] = $meas[12];
			// last value if it does not exist
   		if ($meas[17] != "") $w["avg"] = $meas[17];
   		if ($meas[20] != "") $c["avg"] = $meas[20];
   		if ($meas[22] != "") $wd["avg"] = $meas[22];
    		
   		$t["last"] = 3 * $t["avg"] - $t["max"] - $t["min"];
   		$h["last"] = 3 * $h["avg"] - $h["max"] - $h["min"];
   		$p["last"] = 3 * $p["avg"] - $p["max"] - $p["min"];				
		
			$ts = $date . " 06:00:00";
			$JSON = makeJSON($place, $ts, $t, $h, $p, $w, $c, $wd, "min");
			// create request to EnStreaM
			$url = $miner["url"] . ":" . $miner["port"] . "/enstream/add-measurement?data=" . urlencode($JSON);
			$HTML = getURL($url);		
			echo $HTML . "\n\n";


			$ts = $date . " 14:00:00";
			$JSON =  makeJSON($place, $ts, $t, $h, $p, $w, $c, $wd, "max");
			// create request to EnStreaM
			$url = $miner["url"] . ":" . $miner["port"] . "/enstream/add-measurement?data=" . urlencode($JSON);
			$HTML = getURL($url);		
			echo $HTML . "\n\n";
			
			
			$ts = $date . " 22:00:00";
			$JSON = makeJSON($place, $ts, $t, $h, $p, $w, $c, $wd, "last");
			// create request to EnStreaM
			$url = $miner["url"] . ":" . $miner["port"] . "/enstream/add-measurement?data=" . urlencode($JSON);
			$HTML = getURL($url);		
			echo $HTML . "\n\n";			
		  }
	}

	fclose($fp);	
}

?>