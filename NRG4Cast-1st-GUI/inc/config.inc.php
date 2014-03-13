<?PHP
//---------------------------------------------------------------------
// FILE: config.inc.php
// AUTHOR: Klemen Kenda
// DESCRIPTION: QMiner GUI config file
// DATE: 16/12/2012
// HISTORY:
//---------------------------------------------------------------------

// mysql config -------------------------------------------------------
$mysql_user = "nrg4cast";
$mysql_pass = "pass";
$mysql_host = "localhost";
$mysql_dbase = "nrg4cast";

// mail config --------------------------------------------------------
$webmaster_mail = "klemen.kenda@ijs.si";

// filesystem config --------------------------------------------------
$filesystem_root = "D:\\Demos\\nrg4cast\\www\\";

// miner config -------------------------------------------------------
$miner["url"] = "http://127.0.0.1";
$miner["port"] = 9889;
$miner["stream_timeout"] = 20;
$miner["socket_timeout"] = 10;

?>
