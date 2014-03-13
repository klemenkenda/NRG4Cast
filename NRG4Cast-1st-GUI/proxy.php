<?PHP
//---------------------------------------------------------------------
// FILE: proxy.php
// AUTHOR: Klemen Kenda
// DESCRIPTION: EnStreaM Proxy Script for underlying service.
// DATE: 11/12/2011
// HISTORY:
//--------------------------------------------------------------------- 

// DEBUG
error_reporting(E_ALL & ~E_NOTICE);
ini_set("display_errors", 1);

//---------------------------------------------------------------------
// FUNCTION: passthruXML
// Description: Reads XML from URL and passes it through localhost
//---------------------------------------------------------------------

function passthruHTTP($url) {	
	global $miner;
	
	if ($url == "") return "";
		
  $old = ini_set('default_socket_timeout', $miner["socket_timeout"]);
	ini_set('error_reporting', NULL);

  if ($fp = fopen($url, "r")) {
  	stream_set_timeout($fp, $miner["stream_timeout"]);
  	
  	ob_start();	
  	fpassthru($fp);
  	$buffer = ob_get_contents();
  	$size = ob_get_length();
  	ob_end_clean();
  
  	$info = stream_get_meta_data($fp);
  	
    fclose($fp);
  
    if ($info['timed_out']) {
      $buffer = "<error>%VAR:SERVER_TIMEOUT%</error>";
  		$size = sizeof($buffer);
    };
	} else {	
	  $buffer = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<errors><error>%VAR:SERVER_NO_CONNECTION%</error></errors>";
		$size = sizeof($buffer);
	}
	
	ini_set('default_socket_timeout', $old);   
  ini_set('error_reporting', 1);
		
	$HTML = $buffer;	
	
	return $HTML;
}


import_request_variables("gPC");
// main program ---------------------------------------------------------------
include("inc/config.inc.php");

$miner["stream_timeout"] = 200;
$miner["socket_timeout"] = 100;

$pars = str_replace("|", "&", $p);
$url = $miner["url"] . $cmd . "?" . urlencode($pars);

$url = str_replace("%3D", "=", $url);
$url = str_replace("%26", "&", $url);

$XML = passthruHTTP($url);
$size = strlen($XML);

header('Cache-Control: no-store, no-cache, must-revalidate');     // HTTP/1.1 
header('Cache-Control: pre-check=0, post-check=0, max-age=0');    // HTTP/1.1 
header ("Pragma: no-cache"); 
header("Expires: 0"); 
header("Content-Type: text/xml");
header("Content-Length: " . $size);

echo $XML;
?>