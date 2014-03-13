<?php
//---------------------------------------------------------------------
// FILE: ogsa.inc.php
// AUTHOR: Klemen Kenda
// DATE: 30/05/2012
// DESCRIPTION:
//   OGSA WSDL service SOAP access class
//---------------------------------------------------------------------

class stringArray{
    var $item;
    //string
}
class queryNTUAMeteoHumidity{
    var $query;
    //string
}
class queryNTUAMeteoHumidityResponse{
    var $return;
    //resultData
}
class resultData{
    var $columnLabels;
    //string
    var $columnUnits;
    //string
    var $moreData;
    //boolean
    var $valuesList;
    //stringArray
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
class querySIGITResource{
}
class querySIGITResourceResponse{
    var $return;
    //resultData
}
class queryPrices{
    var $energy;
    //string
    var $area;
    //string
    var $before2007;
    //boolean
    var $query;
    //string
}
class queryPricesResponse{
    var $return;
    //resultData
}
class queryNTUATotalElectricityConsumptionWithTimeInterval{
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryNTUATotalElectricityConsumptionWithTimeIntervalResponse{
    var $return;
    //resultData
}
class querySICEEResource{
}
class querySICEEResourceResponse{
    var $return;
    //resultData
}
class queryCSIWeatherWithTimeInterval{
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryCSIWeatherWithTimeIntervalResponse{
    var $return;
    //resultData
}
class querySIGITResourceWithTimeInterval{
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class querySIGITResourceWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryNTUASensorDataWithTimeInterval{
    var $sensorId;
    //int
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryNTUASensorDataWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryNTUAMeteoWindDirectionWithTimeInterval{
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryNTUAMeteoWindDirectionWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryNTUAMeteoWindDirection{
    var $query;
    //string
}
class queryNTUAMeteoWindDirectionResponse{
    var $return;
    //resultData
}
class queryNTUAMeteoPressureWithTimeInterval{
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryNTUAMeteoPressureWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryNTUAMeteoTemp{
    var $query;
    //string
}
class queryNTUAMeteoTempResponse{
    var $return;
    //resultData
}
class queryNTUAMeteoHumidityWithTimeInterval{
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryNTUAMeteoHumidityWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryENERCADResourceWithTimeInterval{
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryENERCADResourceWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryNTUATotalElectricityConsumption{
    var $query;
    //string
}
class queryNTUATotalElectricityConsumptionResponse{
    var $return;
    //resultData
}
class getResourceIds{
}
class getResourceIdsResponse{
    var $return;
    //resourceInfo
}
class resourceInfo{
    var $resourceId;
    //string
}
class queryNTUAMeteoRain{
    var $query;
    //string
}
class queryNTUAMeteoRainResponse{
    var $return;
    //resultData
}
class queryNTUAMeteoRainWithTimeInterval{
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryNTUAMeteoRainWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryNTUAMeteoPressure{
    var $query;
    //string
}
class queryNTUAMeteoPressureResponse{
    var $return;
    //resultData
}
class queryNTUATotalGasConsumptionWithTimeInterval{
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryNTUATotalGasConsumptionWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryCSIWeather{
    var $query;
    //string
}
class queryCSIWeatherResponse{
    var $return;
    //resultData
}
class querySICEEResourceWithTimeInterval{
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class querySICEEResourceWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryNTUATotalGasConsumption{
    var $query;
    //string
}
class queryNTUATotalGasConsumptionResponse{
    var $return;
    //resultData
}
class queryNTUAMeteoTempWithTimeInterval{
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryNTUAMeteoTempWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryENERCADResource{
}
class queryENERCADResourceResponse{
    var $return;
    //resultData
}
class queryPricesWithTimeInterval{
    var $energy;
    //string
    var $area;
    //string
    var $before2007;
    //boolean
    var $query;
    //string
    var $timeInterval;
    //int
    var $moreData;
    //boolean
}
class queryPricesWithTimeIntervalResponse{
    var $return;
    //resultData
}
class queryNTUASensorData{
    var $query;
    //string
    var $sensorId;
    //int
}
class queryNTUASensorDataResponse{
    var $return;
    //resultData
}
class OGSA
{
    var $soapClient;
    
    private static $classmap = array('stringArray'=>'stringArray'
    ,'queryNTUAMeteoHumidity'=>'queryNTUAMeteoHumidity'
    ,'queryNTUAMeteoHumidityResponse'=>'queryNTUAMeteoHumidityResponse'
    ,'resultData'=>'resultData'
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
    ,'querySIGITResource'=>'querySIGITResource'
    ,'querySIGITResourceResponse'=>'querySIGITResourceResponse'
    ,'queryPrices'=>'queryPrices'
    ,'queryPricesResponse'=>'queryPricesResponse'
    ,'queryNTUATotalElectricityConsumptionWithTimeInterval'=>'queryNTUATotalElectricityConsumptionWithTimeInterval'
    ,'queryNTUATotalElectricityConsumptionWithTimeIntervalResponse'=>'queryNTUATotalElectricityConsumptionWithTimeIntervalResponse'
    ,'querySICEEResource'=>'querySICEEResource'
    ,'querySICEEResourceResponse'=>'querySICEEResourceResponse'
    ,'queryCSIWeatherWithTimeInterval'=>'queryCSIWeatherWithTimeInterval'
    ,'queryCSIWeatherWithTimeIntervalResponse'=>'queryCSIWeatherWithTimeIntervalResponse'
    ,'querySIGITResourceWithTimeInterval'=>'querySIGITResourceWithTimeInterval'
    ,'querySIGITResourceWithTimeIntervalResponse'=>'querySIGITResourceWithTimeIntervalResponse'
    ,'queryNTUASensorDataWithTimeInterval'=>'queryNTUASensorDataWithTimeInterval'
    ,'queryNTUASensorDataWithTimeIntervalResponse'=>'queryNTUASensorDataWithTimeIntervalResponse'
    ,'queryNTUAMeteoWindDirectionWithTimeInterval'=>'queryNTUAMeteoWindDirectionWithTimeInterval'
    ,'queryNTUAMeteoWindDirectionWithTimeIntervalResponse'=>'queryNTUAMeteoWindDirectionWithTimeIntervalResponse'
    ,'queryNTUAMeteoWindDirection'=>'queryNTUAMeteoWindDirection'
    ,'queryNTUAMeteoWindDirectionResponse'=>'queryNTUAMeteoWindDirectionResponse'
    ,'queryNTUAMeteoPressureWithTimeInterval'=>'queryNTUAMeteoPressureWithTimeInterval'
    ,'queryNTUAMeteoPressureWithTimeIntervalResponse'=>'queryNTUAMeteoPressureWithTimeIntervalResponse'
    ,'queryNTUAMeteoTemp'=>'queryNTUAMeteoTemp'
    ,'queryNTUAMeteoTempResponse'=>'queryNTUAMeteoTempResponse'
    ,'queryNTUAMeteoHumidityWithTimeInterval'=>'queryNTUAMeteoHumidityWithTimeInterval'
    ,'queryNTUAMeteoHumidityWithTimeIntervalResponse'=>'queryNTUAMeteoHumidityWithTimeIntervalResponse'
    ,'queryENERCADResourceWithTimeInterval'=>'queryENERCADResourceWithTimeInterval'
    ,'queryENERCADResourceWithTimeIntervalResponse'=>'queryENERCADResourceWithTimeIntervalResponse'
    ,'queryNTUATotalElectricityConsumption'=>'queryNTUATotalElectricityConsumption'
    ,'queryNTUATotalElectricityConsumptionResponse'=>'queryNTUATotalElectricityConsumptionResponse'
    ,'getResourceIds'=>'getResourceIds'
    ,'getResourceIdsResponse'=>'getResourceIdsResponse'
    ,'resourceInfo'=>'resourceInfo'
    ,'queryNTUAMeteoRain'=>'queryNTUAMeteoRain'
    ,'queryNTUAMeteoRainResponse'=>'queryNTUAMeteoRainResponse'
    ,'queryNTUAMeteoRainWithTimeInterval'=>'queryNTUAMeteoRainWithTimeInterval'
    ,'queryNTUAMeteoRainWithTimeIntervalResponse'=>'queryNTUAMeteoRainWithTimeIntervalResponse'
    ,'queryNTUAMeteoPressure'=>'queryNTUAMeteoPressure'
    ,'queryNTUAMeteoPressureResponse'=>'queryNTUAMeteoPressureResponse'
    ,'queryNTUATotalGasConsumptionWithTimeInterval'=>'queryNTUATotalGasConsumptionWithTimeInterval'
    ,'queryNTUATotalGasConsumptionWithTimeIntervalResponse'=>'queryNTUATotalGasConsumptionWithTimeIntervalResponse'
    ,'queryCSIWeather'=>'queryCSIWeather'
    ,'queryCSIWeatherResponse'=>'queryCSIWeatherResponse'
    ,'querySICEEResourceWithTimeInterval'=>'querySICEEResourceWithTimeInterval'
    ,'querySICEEResourceWithTimeIntervalResponse'=>'querySICEEResourceWithTimeIntervalResponse'
    ,'queryNTUATotalGasConsumption'=>'queryNTUATotalGasConsumption'
    ,'queryNTUATotalGasConsumptionResponse'=>'queryNTUATotalGasConsumptionResponse'
    ,'queryNTUAMeteoTempWithTimeInterval'=>'queryNTUAMeteoTempWithTimeInterval'
    ,'queryNTUAMeteoTempWithTimeIntervalResponse'=>'queryNTUAMeteoTempWithTimeIntervalResponse'
    ,'queryENERCADResource'=>'queryENERCADResource'
    ,'queryENERCADResourceResponse'=>'queryENERCADResourceResponse'
    ,'queryPricesWithTimeInterval'=>'queryPricesWithTimeInterval'
    ,'queryPricesWithTimeIntervalResponse'=>'queryPricesWithTimeIntervalResponse'
    ,'queryNTUASensorData'=>'queryNTUASensorData'
    ,'queryNTUASensorDataResponse'=>'queryNTUASensorDataResponse'
    
    );
    
    function __construct($url='http://83.212.123.209:8080/NRG4CASTServices/services/Nrg4CastServicesPort?wsdl')
    {
        $this->soapClient = new SoapClient($url,array("classmap"=>self::$classmap,"trace" => true,"exceptions" => true));
    }
    
    function queryNTUAMeteoHumidity($queryNTUAMeteoHumidity)
    {
        
        $queryNTUAMeteoHumidityResponse = $this->soapClient->queryNTUAMeteoHumidity($queryNTUAMeteoHumidity);
        return $queryNTUAMeteoHumidityResponse;
        
    }
    function queryPrices($queryPrices)
    {
        
        $queryPricesResponse = $this->soapClient->queryPrices($queryPrices);
        return $queryPricesResponse;
        
    }
    function querySIGITResource($querySIGITResource)
    {
        
        $querySIGITResourceResponse = $this->soapClient->querySIGITResource($querySIGITResource);
        return $querySIGITResourceResponse;
        
    }
    function queryNTUATotalElectricityConsumptionWithTimeInterval($queryNTUATotalElectricityConsumptionWithTimeInterval)
    {
        
        $queryNTUATotalElectricityConsumptionWithTimeIntervalResponse = $this->soapClient->queryNTUATotalElectricityConsumptionWithTimeInterval($queryNTUATotalElectricityConsumptionWithTimeInterval);
        return $queryNTUATotalElectricityConsumptionWithTimeIntervalResponse;
        
    }
    function querySICEEResource($querySICEEResource)
    {
        
        $querySICEEResourceResponse = $this->soapClient->querySICEEResource($querySICEEResource);
        return $querySICEEResourceResponse;
        
    }
    function queryCSIWeatherWithTimeInterval($queryCSIWeatherWithTimeInterval)
    {
        
        $queryCSIWeatherWithTimeIntervalResponse = $this->soapClient->queryCSIWeatherWithTimeInterval($queryCSIWeatherWithTimeInterval);
        return $queryCSIWeatherWithTimeIntervalResponse;
        
    }
    function queryNTUAMeteoPressureWithTimeInterval($queryNTUAMeteoPressureWithTimeInterval)
    {
        
        $queryNTUAMeteoPressureWithTimeIntervalResponse = $this->soapClient->queryNTUAMeteoPressureWithTimeInterval($queryNTUAMeteoPressureWithTimeInterval);
        return $queryNTUAMeteoPressureWithTimeIntervalResponse;
        
    }
    function queryNTUAMeteoWindDirection($queryNTUAMeteoWindDirection)
    {
        
        $queryNTUAMeteoWindDirectionResponse = $this->soapClient->queryNTUAMeteoWindDirection($queryNTUAMeteoWindDirection);
        return $queryNTUAMeteoWindDirectionResponse;
        
    }
    function queryNTUAMeteoWindDirectionWithTimeInterval($queryNTUAMeteoWindDirectionWithTimeInterval)
    {
        
        $queryNTUAMeteoWindDirectionWithTimeIntervalResponse = $this->soapClient->queryNTUAMeteoWindDirectionWithTimeInterval($queryNTUAMeteoWindDirectionWithTimeInterval);
        return $queryNTUAMeteoWindDirectionWithTimeIntervalResponse;
        
    }
    function queryNTUASensorDataWithTimeInterval($queryNTUASensorDataWithTimeInterval)
    {
        
        $queryNTUASensorDataWithTimeIntervalResponse = $this->soapClient->queryNTUASensorDataWithTimeInterval($queryNTUASensorDataWithTimeInterval);
        return $queryNTUASensorDataWithTimeIntervalResponse;
        
    }
    function querySIGITResourceWithTimeInterval($querySIGITResourceWithTimeInterval)
    {
        
        $querySIGITResourceWithTimeIntervalResponse = $this->soapClient->querySIGITResourceWithTimeInterval($querySIGITResourceWithTimeInterval);
        return $querySIGITResourceWithTimeIntervalResponse;
        
    }
    function queryNTUAMeteoTemp($queryNTUAMeteoTemp)
    {
        
        $queryNTUAMeteoTempResponse = $this->soapClient->queryNTUAMeteoTemp($queryNTUAMeteoTemp);
        return $queryNTUAMeteoTempResponse;
        
    }
    function queryNTUAMeteoHumidityWithTimeInterval($queryNTUAMeteoHumidityWithTimeInterval)
    {
        
        $queryNTUAMeteoHumidityWithTimeIntervalResponse = $this->soapClient->queryNTUAMeteoHumidityWithTimeInterval($queryNTUAMeteoHumidityWithTimeInterval);
        return $queryNTUAMeteoHumidityWithTimeIntervalResponse;
        
    }
    function queryENERCADResourceWithTimeInterval($queryENERCADResourceWithTimeInterval)
    {
        
        $queryENERCADResourceWithTimeIntervalResponse = $this->soapClient->queryENERCADResourceWithTimeInterval($queryENERCADResourceWithTimeInterval);
        return $queryENERCADResourceWithTimeIntervalResponse;
        
    }
    function queryNTUATotalElectricityConsumption($queryNTUATotalElectricityConsumption)
    {
        
        $queryNTUATotalElectricityConsumptionResponse = $this->soapClient->queryNTUATotalElectricityConsumption($queryNTUATotalElectricityConsumption);
        return $queryNTUATotalElectricityConsumptionResponse;
        
    }
    function getResourceIds($getResourceIds)
    {
        
        $getResourceIdsResponse = $this->soapClient->getResourceIds($getResourceIds);
        return $getResourceIdsResponse;
        
    }
    function queryNTUAMeteoRain($queryNTUAMeteoRain)
    {
        
        $queryNTUAMeteoRainResponse = $this->soapClient->queryNTUAMeteoRain($queryNTUAMeteoRain);
        return $queryNTUAMeteoRainResponse;
        
    }
    function queryNTUAMeteoPressure($queryNTUAMeteoPressure)
    {
        
        $queryNTUAMeteoPressureResponse = $this->soapClient->queryNTUAMeteoPressure($queryNTUAMeteoPressure);
        return $queryNTUAMeteoPressureResponse;
        
    }
    function queryNTUAMeteoRainWithTimeInterval($queryNTUAMeteoRainWithTimeInterval)
    {
        
        $queryNTUAMeteoRainWithTimeIntervalResponse = $this->soapClient->queryNTUAMeteoRainWithTimeInterval($queryNTUAMeteoRainWithTimeInterval);
        return $queryNTUAMeteoRainWithTimeIntervalResponse;
        
    }
    function queryNTUATotalGasConsumptionWithTimeInterval($queryNTUATotalGasConsumptionWithTimeInterval)
    {
        
        $queryNTUATotalGasConsumptionWithTimeIntervalResponse = $this->soapClient->queryNTUATotalGasConsumptionWithTimeInterval($queryNTUATotalGasConsumptionWithTimeInterval);
        return $queryNTUATotalGasConsumptionWithTimeIntervalResponse;
        
    }
    function queryCSIWeather($queryCSIWeather)
    {
        
        $queryCSIWeatherResponse = $this->soapClient->queryCSIWeather($queryCSIWeather);
        return $queryCSIWeatherResponse;
        
    }
    function queryENERCADResource($queryENERCADResource)
    {
        
        $queryENERCADResourceResponse = $this->soapClient->queryENERCADResource($queryENERCADResource);
        return $queryENERCADResourceResponse;
        
    }
    function queryNTUAMeteoTempWithTimeInterval($queryNTUAMeteoTempWithTimeInterval)
    {
        
        $queryNTUAMeteoTempWithTimeIntervalResponse = $this->soapClient->queryNTUAMeteoTempWithTimeInterval($queryNTUAMeteoTempWithTimeInterval);
        return $queryNTUAMeteoTempWithTimeIntervalResponse;
        
    }
    function queryNTUATotalGasConsumption($queryNTUATotalGasConsumption)
    {
        
        $queryNTUATotalGasConsumptionResponse = $this->soapClient->queryNTUATotalGasConsumption($queryNTUATotalGasConsumption);
        return $queryNTUATotalGasConsumptionResponse;
        
    }
    function querySICEEResourceWithTimeInterval($querySICEEResourceWithTimeInterval)
    {
        
        $querySICEEResourceWithTimeIntervalResponse = $this->soapClient->querySICEEResourceWithTimeInterval($querySICEEResourceWithTimeInterval);
        return $querySICEEResourceWithTimeIntervalResponse;
        
    }
    function queryNTUASensorData($queryNTUASensorData)
    {
        
        $queryNTUASensorDataResponse = $this->soapClient->queryNTUASensorData($queryNTUASensorData);
        return $queryNTUASensorDataResponse;
        
    }
    function queryPricesWithTimeInterval($queryPricesWithTimeInterval)
    {
        
        $queryPricesWithTimeIntervalResponse = $this->soapClient->queryPricesWithTimeInterval($queryPricesWithTimeInterval);
        return $queryPricesWithTimeIntervalResponse;
        
    }
}


?>
