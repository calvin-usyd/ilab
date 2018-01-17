<?php
class PrepsPostPaisopController extends PrepsController
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
			//$choppedStr = $this->getChoppedStr($content, 'NUMBER OF NODAL POINTS   =');
			//$nodeCount = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\n')));
			
			$choppedStr = $this->getChoppedStr($content, 'Z\n\n');
			//$nodePointStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\n COMPLETE NODAL POINT DATA\n')));
			//$nodePointArr = explode('\n  ', $nodePointStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'Z\n\n');
			$nodePointStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\nNUMBER OF SHELL ELEMENTS')));
			$nodePointArr = explode('\n  ', $nodePointStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'P\n\n');
			$memberStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\nELMT')));
			$memberArr = explode('\n ', $memberStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'Z-PRESS\n');
			$memberPropPressStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n NUMBER OF EQUATIONS')));
			$memberPropPressArr = explode('\n ', $memberPropPressStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'NUMBER OF EQUATIONS =');
			$numEqStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n BANDWIDTH')));
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'BANDWIDTH =');
			$bandwidthStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\nCONCENTRATED NODAL FORCES')));
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'Z-FORCE\n\n');
			$nodeForceStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\nNODAL DISPLACEMENTS AND ROTATIONS')));
			$nodeForceArr = explode('\n ', $nodeForceStr);
			
			$choppedStr = $this->getChoppedStr($choppedStr, 'ZZ\n\n');
			$nodeDispRotaStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\n\nSTRESS RESULTANTS')));
			$nodeDispRotaArr = explode('\n ', $nodeDispRotaStr);
			
			for($x=0, $len=count($memberArr); $x<$len; $x++){
				$choppedStr = $this->getChoppedStr($choppedStr, 'NXY\n');
				//$stressResultantStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\\n-')));
				$stressResultantStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\nELT GAUSS')));
				$stressResultantArr[$x]['stress'] = explode('\n ', $stressResultantStr);
				
				$choppedStr = $this->getChoppedStr($choppedStr, 'QYY\n');
				$stressResultantStr = trim(substr($choppedStr, 0, strpos($choppedStr, '\nELMT ')));
				$stressResultantArr[$x]['moment'] = explode('\n ', $stressResultantStr);
				
				$choppedStr = $this->getChoppedStr($choppedStr, 'SEQUI\n');
				$chopPos = strpos($choppedStr, '\n\n ELMT ');
				$stressResultantStr = ($chopPos > 0) ? substr($choppedStr, 0, $chopPos) : substr($choppedStr, 0);
				$stressResultantArr[$x]['shear'] = explode(($x<9) ? '\n ' : '\n', trim($stressResultantStr));
			}
			
			$msg = array(
				'nodePointArr'=>$nodePointArr,
				'nodeForceArr'=>$nodeForceArr,
				'nodeDispRotaArr'=>$nodeDispRotaArr,
				'memberArr'=>$memberArr,
				'memberPropPressArr'=>$memberPropPressArr,
				//'numEqStr'=>$numEqStr,
				//'bandwidthStr'=>$bandwidthStr,
				'stressResultantArr'=>$stressResultantArr
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