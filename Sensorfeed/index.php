<?PHP
// -----------------------------------------------------------------------------------
// FILE: sensorcrawler/index.php
// AUTHOR: Klemen Kenda
// DATE: 10/10/2013
// DESCRIPTION: Crawler for sensor data.
// HISTORY: 
// -----------------------------------------------------------------------------------

// initialization 
// DEBUG
error_reporting(E_ALL & ~E_NOTICE);
ini_set("display_errors", 1);

// get request variables
// import_request_variables("gPC");
extract($_GET); extract($_POST); extract($_COOKIE);

// includes
include("inc/config.inc.php");
include("inc/sql.inc.php");
include("inc/parser.weatheronline.inc.php");
include("inc/http.inc.php");

// choose source
$SQL = "SELECT * FROM sourcetype, source WHERE so_typeid = sourcetype.id ORDER BY rand() LIMIT 1";
if (isset($srcid)) $SQL = "SELECT * FROM sourcetype, source WHERE so_typeid = sourcetype.id AND source.id = $srcid";

$result = mysql_query($SQL);
$source = mysql_fetch_array($result);

// browse source
switch ($source["st_name"]) {
	case "Weather Online - Free API":
		$HTML = parseWeatherOnlineFreeAPI($source);
		break;
	case "Open Weather Map - API":
		$HTML = parseOpenWeatherMapAPI($source);
		break;
}

// display results
echo $HTML;

?>