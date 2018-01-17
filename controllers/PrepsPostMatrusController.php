<?php
class PrepsPostSpolyController extends PrepsController
{	
	function afterroute($f3) { 
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
    }
 
	public function getPPPData($f3){
		die();
	}
	
	public function getPPPFilesName($f3){		
		die();
	}
	
	public function pppExport($f3){		
		die();
	}
}	