<?PHP

class listSensorsOfNodes{
    var $nodeId;
    //string
}
class listSensorsOfNodesResponse{
    var $return;
    //sensor
}
class sensor{
    var $sensorID;
    //string
    var $sensorType;
    //string
}
class ioFaultBean{
    var $message;
    //string
}
class requestExceptionFaultBean{
    var $message;
    //string
}
class dataStreamErrorFaultBean{
    var $message;
    //string
}
class tupleBinaryDataStreamParseExceptionFaultBean{
    var $message;
    //string
}
class resourceUnknownFaultBean{
    var $message;
    //string
}
class unexpectedDataValueFaultBean{
    var $message;
    //string
}
class clientExceptionFaultBean{
    var $message;
    //string
}
class timeoutExceptionFaultBean{
    var $message;
    //string
}
class unsupportedTupleTypeExceptionFaultBean{
    var $message;
    //string
}
class malformedURLFaultBean{
    var $message;
    //string
}
class malformedListBeginExceptionFaultBean{
    var $message;
    //string
}
class sqlFaultBean{
    var $message;
    //string
}
class dataSourceUsageExceptionFaultBean{
    var $message;
    //string
}
class listNodes{
}
class listNodesResponse{
    var $return;
    //node
}
class node{
    var $latitude;
    //double
    var $longitude;
    //double
    var $nodeID;
    //string
    var $nodeName;
    //string
}
class getMeasurementsOfNode{
    var $nodeId;
    //string
    var $start_timestamp;
    //string
    var $end_timestamp;
    //string
}
class getMeasurementsOfNodeResponse{
    var $return;
    //measurements
}
class measurements{
    var $measurementsList;
    //measurement
    var $moreMeasurements;
    //boolean
}
class measurement{
		var $phenomenon;
		// string
    var $sensorID;
    //string
		var $timestamp;
		// string
		var $uom;
		// string
    var $value;
    //double		

}
class HSD
{
    var $soapClient;
    
    private static $classmap = array('listSensorsOfNodes'=>'listSensorsOfNodes'
    ,'listSensorsOfNodesResponse'=>'listSensorsOfNodesResponse'
    ,'sensor'=>'sensor'
    ,'ioFaultBean'=>'ioFaultBean'
    ,'requestExceptionFaultBean'=>'requestExceptionFaultBean'
    ,'dataStreamErrorFaultBean'=>'dataStreamErrorFaultBean'
    ,'tupleBinaryDataStreamParseExceptionFaultBean'=>'tupleBinaryDataStreamParseExceptionFaultBean'
    ,'resourceUnknownFaultBean'=>'resourceUnknownFaultBean'
    ,'unexpectedDataValueFaultBean'=>'unexpectedDataValueFaultBean'
    ,'clientExceptionFaultBean'=>'clientExceptionFaultBean'
    ,'timeoutExceptionFaultBean'=>'timeoutExceptionFaultBean'
    ,'unsupportedTupleTypeExceptionFaultBean'=>'unsupportedTupleTypeExceptionFaultBean'
    ,'malformedURLFaultBean'=>'malformedURLFaultBean'
    ,'malformedListBeginExceptionFaultBean'=>'malformedListBeginExceptionFaultBean'
    ,'sqlFaultBean'=>'sqlFaultBean'
    ,'dataSourceUsageExceptionFaultBean'=>'dataSourceUsageExceptionFaultBean'
    ,'listNodes'=>'listNodes'
    ,'listNodesResponse'=>'listNodesResponse'
    ,'node'=>'node'
    ,'getMeasurementsOfNode'=>'getMeasurementsOfNode'
    ,'getMeasurementsOfNodeResponse'=>'getMeasurementsOfNodeResponse'
    ,'measurements'=>'measurements'
    ,'measurement'=>'measurement'
    
    );
    
    function __construct($url='http://83.212.123.209:8080/NRG4CASTServices/services/HistoricalSensorDataPort?wsdl')
    {
        $this->soapClient = new SoapClient($url,array("classmap"=>self::$classmap,"trace" => true,"exceptions" => true));
    }
    
    function listNodes($listNodes)
    {
        
        $listNodesResponse = $this->soapClient->listNodes($listNodes);
        return $listNodesResponse;
        
    }
    function listSensorsOfNodes($listSensorsOfNodes)
    {
        
        $listSensorsOfNodesResponse = $this->soapClient->listSensorsOfNodes($listSensorsOfNodes);
        return $listSensorsOfNodesResponse;
        
    }
    function getMeasurementsOfNode($getMeasurementsOfNode)
    {
        
        $getMeasurementsOfNodeResponse = $this->soapClient->getMeasurementsOfNode($getMeasurementsOfNode);
        return $getMeasurementsOfNodeResponse;
        
    }
}


?>