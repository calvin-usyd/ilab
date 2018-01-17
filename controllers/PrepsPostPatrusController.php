<?php
class PrepsPostPatrusController extends PrepsController
{
	function afterroute($f3) { 
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
    }
 
	function getOutput($f3){
		$content = json_encode($this->getOutputContent($f3, 'output.txt'));
		$msg = array('code'=>'Warning', 'msg'=>'empty file!');
		
		if ( json_decode($content)[0]=='Danger'){
			$msg = json_decode($content);
			
		}elseif ($content == -1){
			$msg = array('code'=>'Danger', 'msg'=>'Session expired!');
			
		}elseif ($content != ''){
			$choppedStr = $this->getChoppedStr($content, 'NUMBER OF NODAL POINTS   =');
			//$nodeCount = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\n')));
			
			$choppedStr = $this->getChoppedStr($content, 'COMPLETE NODAL POINT DATA');
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'YY\n\n');
			$nodePointStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\n EQUATION NUMBERS')));
			$nodePointArr = explode('\n  ', $nodePointStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'NUMBER OF TRUSS MEMBERS =');
			//$memberCount = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\n')));
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'LOAD VECTORS\n');
			$memberStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\nBANDWIDTH')));
			$memberArr = explode('\n ', $memberStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'Y-FORCE\n\n');
			$nodeForceStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n SOLVE EQUATION')));
			$nodeForceArr = explode('\n ', $nodeForceStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'PRINT NODAL DISPLACEMENTS\n');
			$dispStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\nMEMBER FORCES')));
			$dispArr = explode('\n ', $dispStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'EVALUATE MEMBER FORCES\n');
			$memberForceStr = trim(substr($choppedStr, 0));
			//$memberForceStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\\n-')));
			$memberForceArr = explode('\n ', $memberForceStr);
			
			$msg = array(
				'nodePointArr'=>$nodePointArr,
				'nodeForceArr'=>$nodeForceArr,
				'nodeDispArr'=>$dispArr,
				'memberArr'=>$memberArr,
				'memberForceArr'=>$memberForceArr
			);
		}
		$this->echoJson($msg);
	}
	
	private function getPosAtEnd($data, $offsetStr){
		return strpos($data, $offsetStr) + strlen($offsetStr);
	}
	
	private function getChoppedStr($data, $offsetStr){
		$endPos = $this->getPosAtEnd($data, $offsetStr);
		return trim(substr($data, $endPos));
	}
}	