<?php
class PrepsPostPaframController extends PrepsController
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
			$choppedStr = $this->getChoppedStr($content, 'YY\n\n');
			//$nodePointStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\n COMPLETE NODAL POINT DATA')));
			//$nodePointArr = explode('\n  ', $nodePointStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'YY\n\n');
			$nodePointStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\n EQUATION NUMBERS')));
			$nodePointArr = explode('\\n', $nodePointStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'THETA');
			$nodeEqNoStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\nNUMBER OF FRAME MEMBERS')));
			$nodeEqNoArr = explode('\n ', $nodeEqNoStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'HINGI HINGJ\n\n');
			$memberFrameStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\n D.O.F.')));
			$memberFrameArr = explode('\n', $memberFrameStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'D.O.F. =');
			$dofStr = trim(substr($choppedStr, 0, strpos($choppedStr, 'BANDWIDTH')));
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'BANDWIDTH =');
			$bandwidthStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\n CONCENTRATED NODAL FORCES')));
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'MOMENT\n\n');
			$chopPos = strpos($choppedStr, '\n\n NODAL DISPLACEMENTS');
			$chopSubStr = ($chopPos > 0) ? substr($choppedStr, 0, $chopPos) : substr($choppedStr, 0);
			$nodeForceStr = trim($chopSubStr);
			$nodeForceArr = explode('\n ', $nodeForceStr);
			
			$nodeDispArr=array();
			$memberForceArr = array();
			if ($chopPos > 0){
				$choppedStr = $this->getChoppedStr($choppedStr, 'ROTATION\n\n');
				$chopPos = strpos($choppedStr, '\n\n MEMBER FORCES');
				$chopSubStr = ($chopPos > 0) ? substr($choppedStr, 0, $chopPos) : substr($choppedStr, 0);
				$nodeDispStr = trim($chopSubStr);
				$nodeDispArr = explode('\n ', $nodeDispStr);
				
				if ($chopPos > 0){
					$choppedStr = $this->getChoppedStr($choppedStr, 'MB\n\n');
					//$memberForceStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n')));
					$memberForceStr = trim(substr($choppedStr, 0));
					$memberForceArr = explode('\n ', $memberForceStr);
				}
			}
			$msg = array(
				//'nodeEqNoArr'=>$nodeEqNoArr, 
				'nodePointArr'=>$nodePointArr, 
				'nodeForceArr'=>$nodeForceArr,
				'nodeDispArr'=>$nodeDispArr,
				'memberArr'=>$memberFrameArr,
				'memberForceArr'=>$memberForceArr
				//'dofStr'=>$dofStr,
				//'bandwidthStr'=>$bandwidthStr
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