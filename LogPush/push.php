<?PHP
//---------------------------------------------------------------------
// FILE: push.php
// AUTHOR: Klemen Kenda
// DESCRIPTION: Archive Push script
// DATE: 01/12/2013
// HISTORY:
//---------------------------------------------------------------------

// initialization 
// DEBUG
error_reporting(E_ALL & ~E_NOTICE);
ini_set("display_errors", 1);

// get request variables
// import_request_variables("gPC");
extract($_GET); extract($_POST); extract($_COOKIE);

// includes
include("../inc/http.inc.php");
include("../inc/config.inc.php");

function pushFile($filename) {
	global $miner; 
	
	$fp = fopen("../logs_push/" . $filename, "r");
		
	while (($JSON = fgets($fp, 4000000)) !== false) {
		// echo $JSON . "\n\n";
		// create request to EnStreaM
		$url = $miner["url"] . ":" . $miner["port"] . "/enstream/add-measurement?data=" . urlencode($JSON);
		// uncomment to do the real push!
		$HTML = getURL($url);		
		echo $HTML . "\n\n";
    }
     
    fclose($fp);		
}

// get log files from the logs folder
$dp = opendir("../logs");

// scan and push all log files
while (false !== ($entry = readdir($dp))) {
	if (is_file("../logs_push/" . $entry)) {
		echo "$entry ----------------------------------------\n";
		pushFile($entry);
	}	
}

closedir($dp);

?>
