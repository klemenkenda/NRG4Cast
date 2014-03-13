<?PHP
//---------------------------------------------------------------------
// FILE: plugin.newsfeed.inc.php
// AUTHOR: Klemen Kenda
// DESCRIPTION: Newsfeed plugin file
// DATE: 20/02/2014
// HISTORY:
//---------------------------------------------------------------------

function pluginGetLastNews() {
	date_default_timezone_set("CET");
	$SQL = "SELECT * FROM news ORDER BY publish_date DESC, id DESC LIMIT 15";
	$result = mysql_query($SQL);
	
	$HTML = "<ul>";
	while ($line = mysql_fetch_array($result)) {
		$HTML .= "<li>" . formatDate($line["publish_date"],4) . " - <a href=\"javascript:loadNews(" . $line["id"] . ");\">" . $line["title"] . "</a></li>";
	}
	$HTML .= "</ul>";
	return $HTML;
}

function pluginGetLastTweets() {
	date_default_timezone_set("CET");
	$SQL = "SELECT * FROM tweets ORDER BY date DESC, id DESC LIMIT 15";
	$result = mysql_query($SQL);
	
	$HTML = "<ul>";
	while ($line = mysql_fetch_array($result)) {
		$HTML .= "<li>" . formatDate($line["date"],4) . " - " . "<a href=\"javascript:loadTweet(" . $line["id"] . ");\">" . $line["text"] . "</a></li>";
	}
	$HTML .= "</ul>";
	return $HTML;
}

function getNewsPositions() {
	$SQL = "SELECT * FROM news ORDER BY publish_date DESC, id DESC LIMIT 100";
	$result = mysql_query($SQL);
	
	$HTML = "[";
	while ($line = mysql_fetch_array($result)) {
		$HTML .= "{\"Name\":" . json_encode($line["title"]) . ", \"Position\": [" . $line["latitude"] . ", " . $line["longitude"] . "]},";
	}
	
	$SQL = "SELECT * FROM tweets ORDER BY date DESC, id DESC LIMIT 100";
	$result = mysql_query($SQL);
	
	while ($line = mysql_fetch_array($result)) {
		$HTML .= "{\"Name\":" . json_encode($line["text"]) . ", \"Position\": [" . $line["latitude"] . ", " . $line["longitude"] . "]},";			
	}
	
	$HTML = substr($HTML, 0, -1) . "]";
		
	return $HTML;
}

function getNews($id) {
	$SQL = "SELECT * FROM news WHERE id = $id";	
	$result = mysql_query($SQL);
	$line = mysql_fetch_array($result);	
	
	$JSON = "{\"Title\": " . json_encode($line["title"]) . ", \"Text\": " . json_encode($line["text"]) . ", \"Date\": " . json_encode($line["publish_date"]) . ", \"id\": " . json_encode($line["id"]) . "}";
	return $JSON;
}

function getTweet($id) {
	$SQL = "SELECT * FROM tweets WHERE id = $id";	
	$result = mysql_query($SQL);
	$line = mysql_fetch_array($result);	
	
	$JSON = "{\"Text\": " . json_encode($line["text"]) . ", \"User\": " . json_encode($line["user"]) . ", \"Date\": " . json_encode($line["date"]) . ", \"id\": " . json_encode($line["id"]) . "}";
	return $JSON;
}
?>
