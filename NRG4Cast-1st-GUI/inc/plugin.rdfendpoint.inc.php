<?PHP
//---------------------------------------------------------------------
// FILE: plugin.rdfendpoint.inc.php
// AUTHOR: Klemen Kenda
// DESCRIPTION: Exposing EnStreaM RDF endpoint to the outer world
// DATE: 20/04/2010
// HISTORY:
//---------------------------------------------------------------------  
  
  function pluginRDFEndpoint() {
    global $miner;
		global $port;
		global $uri;
		
		// changing miner port
		$url = $miner["base_url"] . ":" . ($port) . "/rdf-endpoint/" . $uri;
					
		$HTML = passthruHTTP($url);
		
		header('Cache-Control: no-store, no-cache, must-revalidate');     // HTTP/1.1 
    header('Cache-Control: pre-check=0, post-check=0, max-age=0');    // HTTP/1.1 
    header("Pragma: no-cache"); 
    header("Expires: 0"); 
	  header("Content-Type: text/xml");
		
		return $HTML;

  }
?>
