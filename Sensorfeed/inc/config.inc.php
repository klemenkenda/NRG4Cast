<?PHP
//---------------------------------------------------------------------
// FILE: config.inc.php
// AUTHOR: Klemen Kenda
// DESCRIPTION: Sensorfeed config file
// DATE: 16/12/2013
// HISTORY:
//---------------------------------------------------------------------

// mysql config -------------------------------------------------------
$mysql_user = "user";
$mysql_pass = "pass";
$mysql_host = "localhost";
$mysql_dbase = "sensorfeed";

// miner API config ---------------------------------------------------
$miner["url"] = "http://demo.nrg4cast.org";
$miner["port"] = 80;
$miner["stream_timeout"] = 20;
$miner["socket_timeout"] = 10;

?>
