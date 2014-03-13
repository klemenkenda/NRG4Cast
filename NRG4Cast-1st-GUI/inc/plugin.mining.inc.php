<?PHP
//---------------------------------------------------------------------
// FILE: plugin.mining.inc.php
// AUTHOR: Klemen Kenda
// DESCRIPTION: Mining plugin file
// DATE: 20/08/2012
// HISTORY:
//---------------------------------------------------------------------

function pluginEventPrediction() {
  global $sosid;
	// only use for landslide scenario
	if ($sosid != 1) return "";
	
	$HTML = "<div id=\"div-event-prediction\">";
  $HTML .= "<h3>Event prediction</h3>";
	$HTML .= "Date: <input type='text' id='pr-date' disabled='disabled' value='pick a date'>";
	$HTML .= "<div id=\"div-prediction-result\"></div>";
	$HTML .= "</div>";
	
	return $HTML;
}

function pluginAnomalyDetection() {
  global $sosid;
	// only use for landslide scenario
	if ($sosid != 4) return "";
	
	$HTML = "<div id=\"div-anomaly-detection\">";
  $HTML .= "<h3>Anomaly detection</h3>";
	$HTML .= "<center><form>Phenomenon: <select id=\"phenomenon\"></select></form></center>";
	$HTML .= "<center><a href=\"javascript:startADChart();\">%VAR:SHOW_AD_CHART%</a></center><br>";
	$HTML .= "<center><div style=\"height: 10px; width: 250px\"><div id=\"progressbar\" style=\"height: 100%\"></div></div></center>";
	$HTML .= "</div>";
	
	return $HTML;
}
?>
