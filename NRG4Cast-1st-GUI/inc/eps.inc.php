<?PHP
//---------------------------------------------------------------------
// FILE: eps.inc.php
// AUTHOR: Klemen Kenda
// DATE: 15/11/2012
// DESCRIPTION:
//   EPS WSDL service SOAP access class
//---------------------------------------------------------------------

class stop{
}
class stopResponse{
    var $return;
    //string
}
class start{
}
class startResponse{
    var $return;
    //string
}
class restart{
}
class restartResponse{
    var $return;
    //string
}
class registerStatement{
    var $stm;
    //string
    var $eventType;
    //string
}
class registerStatementResponse{
    var $return;
    //boolean
}
class registerService{
    var $serviceURL;
    //string
    var $offering;
    //string
    var $observedProperty;
    //string
    var $timeUnit;
    //string
    var $numberOfTimeUnits;
    //int
}
class registerServiceResponse{
    var $return;
    //boolean
}
class registerRuleMLStatement{
    var $ruleMLStm;
    //string
}
class registerRuleMLStatementResponse{
    var $return;
    //boolean
}
class registerJSONStatement{
    var $jsonStm;
    //string
    var $eventType;
    //string
}
class registerJSONStatementResponse{
    var $return;
    //boolean
}
class EPS
{
    var $soapClient;
    
    private static $classmap = array('stop'=>'stop'
    ,'stopResponse'=>'stopResponse'
    ,'start'=>'start'
    ,'startResponse'=>'startResponse'
    ,'restart'=>'restart'
    ,'restartResponse'=>'restartResponse'
    ,'registerStatement'=>'registerStatement'
    ,'registerStatementResponse'=>'registerStatementResponse'
    ,'registerService'=>'registerService'
    ,'registerServiceResponse'=>'registerServiceResponse'
    ,'registerRuleMLStatement'=>'registerRuleMLStatement'
    ,'registerRuleMLStatementResponse'=>'registerRuleMLStatementResponse'
    ,'registerJSONStatement'=>'registerJSONStatement'
    ,'registerJSONStatementResponse'=>'registerJSONStatementResponse'
    
    );
    
    function __construct($url='http://giv-wfs.uni-muenster.de/axis2/services/EPSManager?wsdl')
    {
        $this->soapClient = new SoapClient($url,array("classmap"=>self::$classmap,"trace" => true,"exceptions" => true));
    }
    
    function registerRuleMLStatement($registerRuleMLStatement)
    {
        
        $registerRuleMLStatementResponse = $this->soapClient->registerRuleMLStatement($registerRuleMLStatement);
        return $registerRuleMLStatementResponse;
        
    }
    function registerStatement($registerStatement)
    {
        
        $registerStatementResponse = $this->soapClient->registerStatement($registerStatement);
        return $registerStatementResponse;
        
    }
    function start($start)
    {
        
        $startResponse = $this->soapClient->start($start);
        return $startResponse;
        
    }
    function registerJSONStatement($registerJSONStatement)
    {
        
        $registerJSONStatementResponse = $this->soapClient->registerJSONStatement($registerJSONStatement);
        return $registerJSONStatementResponse;
        
    }
    function restart($restart)
    {
        
        $restartResponse = $this->soapClient->restart($restart);
        return $restartResponse;
        
    }
    function stop($stop)
    {
        
        $stopResponse = $this->soapClient->stop($stop);
        return $stopResponse;
        
    }
    function registerService($registerService)
    {
        
        $registerServiceResponse = $this->soapClient->registerService($registerService);
        return $registerServiceResponse;
        
    }
    /*
	function registerRuleMLStatement($registerRuleMLStatement)
    {
        
        $registerRuleMLStatementResponse = $this->soapClient->registerRuleMLStatement($registerRuleMLStatement);
        return $registerRuleMLStatementResponse;
        
    }
    function registerStatement($registerStatement)
    {
        
        $registerStatementResponse = $this->soapClient->registerStatement($registerStatement);
        return $registerStatementResponse;
        
    }
    function start($start)
    {
        
        $startResponse = $this->soapClient->start($start);
        return $startResponse;
        
    }
    function registerJSONStatement($registerJSONStatement)
    {
        
        $registerJSONStatementResponse = $this->soapClient->registerJSONStatement($registerJSONStatement);
        return $registerJSONStatementResponse;
        
    }
    function restart($restart)
    {
        
        $restartResponse = $this->soapClient->restart($restart);
        return $restartResponse;
        
    }
    function stop($stop)
    {
        
        $stopResponse = $this->soapClient->stop($stop);
        return $stopResponse;
        
    }
    function registerService($registerService)
    {
        
        $registerServiceResponse = $this->soapClient->registerService($registerService);
        return $registerServiceResponse;
        
    }
	*/
}

?>