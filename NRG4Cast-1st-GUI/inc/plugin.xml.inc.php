<?PHP
//---------------------------------------------------------------------
// FILE: plugin.xml.inc.php
// AUTHOR: Klemen Kenda
// DESCRIPTION: XML plugins file
// DATE: 20/12/2010
// HISTORY:
//---------------------------------------------------------------------


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


//---------------------------------------------------------------------
// PLUGIN: PassthruXML
// Description: Reads XML from server and passes it through localhost
//---------------------------------------------------------------------

function pluginPassthruXML($mycmdid = -1, $par1 = "", $par2 = "", $par3 = "", $par4 = "") {
  global $cmdid;
	global $parameters;
	global $miner;
	
	if (!isset($cmdid)) $cmdid = 0;
	if ($mycmdid != -1) $cmdid = $mycmdid;
	
	$command = array(
	  "current-state", // 0
		"stores",				 // 1
		"word-voc?keyid=" . $par1, // 2
		"get-events",		 // 3
		"get-aggregates?sid=" . $par1 . "&sd=" . $par2 . "&type=" . $par3 . "&timespan=" . $par4, // 4
	);
	
	$url = $miner["url"] . $command[$cmdid];
	
	// echo $url;
	
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
	
	// $url = "http://localhost:9988/get-aggregates?sid=0&sd=2007-01-01&type=SUM&timespan=D";
	
	ini_set('default_socket_timeout', $old);   
  ini_set('error_reporting', 1);
	
	header('Cache-Control: no-store, no-cache, must-revalidate');     // HTTP/1.1 
  header('Cache-Control: pre-check=0, post-check=0, max-age=0');    // HTTP/1.1 
  header ("Pragma: no-cache"); 
  header("Expires: 0"); 
	header("Content-Type: text/xml");
  header("Content-Length: " . $size);
			
	$HTML = $buffer;	
	
	return $HTML;
}


function passthruCache($url) {
  $SQL = "SELECT * FROM webcache WHERE wc_url = '$url'";
	$result = mysql_query($SQL);
	
	if ($line = mysql_fetch_array($result)) {
	  $content = $line["wc_result"];
	} else {
	  $content = passthruHTTP($url);
		$SQL = "INSERT INTO webcache (wc_url, wc_result) VALUES ('$url', '" . mysql_escape_string($content) . "')";
		$result = mysql_query($SQL);
	}	
	
	return $content;
}

function simpleXMLToArray($xml, $flattenValues = true, $flattenAttributes = true, $flattenChildren = true,
  $valueKey = '@value', $attributesKey = '@attributes', $childrenKey = '@children') {

  $return = array();
  if(!($xml instanceof SimpleXMLElement)){return $return;}
  $name = $xml->getName();
  $_value = trim((string)$xml);
  if(strlen($_value)==0){$_value = null;};

  if($_value!==null){
    if(!$flattenValues){$return[$valueKey] = $_value;}
    else{$return = $_value;}
  }

  $children = array();
  $first = true;
  foreach($xml->children() as $elementName => $child){
    $value = simpleXMLToArray($child, $flattenValues, $flattenAttributes, $flattenChildren, $valueKey, $attributesKey, $childrenKey);
    if(isset($children[$elementName])){
      if($first){
        $temp = $children[$elementName];
        unset($children[$elementName]);
        $children[$elementName][] = $temp;
        $first=false;
      }
      $children[$elementName][] = $value;
    }
    else {
      $children[$elementName] = $value;
    }
  }
  if(count($children)>0){
    if(!$flattenChildren){$return[$childrenKey] = $children;}
    else{$return = array_merge($return,$children);}
  }

  $attributes = array();
  foreach($xml->attributes() as $name=>$value){
    $attributes[$name] = trim($value);
  }
  if(count($attributes)>0){
    if(!$flattenAttributes){$return[$attributesKey] = $attributes;}
    else{$return = array_merge($return, $attributes);}
  }
   
  return $return;
}

?>