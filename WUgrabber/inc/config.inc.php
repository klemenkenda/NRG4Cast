<?PHP
//---------------------------------------------------------------------
// FILE: config.inc.php
// AUTHOR: Klemen Kenda
// DESCRIPTION: EnStreamM GUI config file
// DATE: 16/12/2011
// HISTORY:
//  2012/08/31: Added resource module config, EPS and SR config, SOS
//              config
//---------------------------------------------------------------------

// mysql config -------------------------------------------------------
$mysql_user = "nrg4cast";
$mysql_pass = "electricity42";
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

// %date% - YYYY/MM/DD
$node[0]["url"] = "http://www.wunderground.com/history/airport/EDDL/%date%/MonthlyHistory.html?format=1";
$node[0]["place"] = "Duesseldorf";
$node[0]["lat"] = 51.2277411;
$node[0]["lng"] = 6.773455600000034;

$node[1]["url"] = "http://www.wunderground.com/history/airport/ETOU/%date%/MonthlyHistory.html?format=1";
$node[1]["place"] = "Wiesbaden";
$node[1]["lat"] = 50.0782184;
$node[1]["lng"] = 8.239760799999999;

$node[2]["place"] = "Hanover";
$node[2]["url"] = "http://www.wunderground.com/history/airport/EDDV/%date%/MonthlyHistory.html?format=1";
$node[2]["lat"] = 52.3758916;
$node[2]["lng"] = 9.732010400000036;

$node[3]["place"] = "Laage";
$node[3]["url"] = "http://www.wunderground.com/history/airport/ETNL/%date%/MonthlyHistory.html?format=1";
$node[3]["lat"] = 53.9235596;
$node[3]["lng"] = 12.346876199999997;

$node[4]["place"] = "Kiel";
$node[4]["url"] = "http://www.wunderground.com/history/airport/EDHK/%date%/MonthlyHistory.html?format=1";
$node[4]["lat"] = 54.3232927;
$node[4]["lng"] = 10.122765200000003;

$node[5]["place"] = "Berlin Tegel";
$node[5]["url"] = "http://www.wunderground.com/history/airport/EDDT/%date%/MonthlyHistory.html?format=1";
$node[5]["lat"] = 52.5588327;
$node[5]["lng"] = 13.28843740000002;

?>