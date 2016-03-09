<?PHP
include("historicaldataport.inc.php");

// parse input
$node = $argv[1];
echo "\n\nNode: " . $node . "\n";

// create SOAP object
$HSD = new HSD();

echo "Start: listNodes\n";
$listNodes = new listNodes();
$listNodesResponse = $HSD->listNodes($listNodes);

// check if nodeId is in the list and remember the data, otherwise quit
foreach($listNodesResponse->return as $lnode) {
  if ($lnode->nodeID == $node) $node = $lnode;
}

if (is_object($node)) {
  echo "Node " . $node->nodeID . " found!\n";
} else {
  echo "Node not found!\n";
	exit();
}

echo "Start: getMeasurementsOfNode\n";
$getMoN = new getMeasurementsOfNode();
$getMoN->nodeId = $node->nodeID;
$getMoN->start_timestamp = "20131231";
$getMoN->end_timestamp = "20140211";

$getMoNResponse = $HSD->getMeasurementsOfNode($getMoN);

// parse by sensor (if multiple per node)
$measurements = $getMoNResponse->return->measurementsList;

$nodeId = $node->nodeID;
$nodeName = $node->nodeName;
$lat = $node->latitude;
$lng = $node->longitude;

// start JSON
$JSON =<<<EOF
[
   {
      "node":{
         "id":"$nodeId",
         "name":"$nodeName",
         "lat":$lat,
         "lng":$lng,
         "measurements":[
EOF;

echo $JSON;
exit();
// create JSON
foreach($measurements as $measurement) {
// 2014-01-22T16:52:00.000
  $sensorId = $measurement->sensorID;
	$val = $measurement->value;
	$timestamp = str_replace(" ", "T", $measurement->timestamp . ".000");
	$phenomenon = $measurement->phenomenon;
	$sensortype = $nodeId . "-" . $phenomenon;
	$sensortypeid = $sensortype;
	$uom = $measurement->uom;
	
  $JSON .=<<<EOF
            {
               "sensorid":"$sensorId",
               "value":$val,
               "timestamp":"$timestamp",
               "type":{
                  "id":"$sensortypeid",
                  "name":"$sensortype",
                  "phenomenon":"$phenomenon",
                  "UoM":"$uom"
               }
            }
EOF;
}

// end JSON						
$JSON .=<<<EOF

				 ]
      }
   }
]
EOF;

// send JSON request to QMiner
echo $JSON;

// repeat if there are more measurements waiting

	


?>