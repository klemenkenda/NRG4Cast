<?PHP
// Grabber from weather underground
include("http.inc.php");
include("config.inc.php");

foreach($node as $place) {
	$starttime = mktime(1, 1, 1, 1, 1, 2010);	
	$oldDate = '0000/00/00';
	$CSV = "";
	
	while ($starttime < mktime(1, 1, 1, 10, 1, 2013)) {
  	$myDate = date("Y/m/d", $starttime);
		if (substr($myDate, 0, 7) != substr($oldDate, 0, 7)) {  		
			$oldDate = $myDate;
			$url = str_replace("%date%", $myDate, $place["url"]);
			echo $url . "\n";
			$dateCSV = getURL($url);		 		
			if ($myDate != "2010/01/01") {				
				$pos = strpos($dateCSV, "<br />");
				// echo $pos;
				$dateCSV = substr($dateCSV, $pos + 7); 
			}
			$dateCSV = str_replace("<br />", "", $dateCSV);		
			$CSV .= $dateCSV;
			// echo $dateCSV;
		}
		$starttime += 86400 * 20;		
	}
	
	// save csv
	$fp = fopen($place["place"] . ".csv", "x");
	fwrite($fp, $CSV);
	fclose($fp);
	
}

?>