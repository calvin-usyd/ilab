<?php
class PrepsSolverPatrusController extends PrepsController{
	private $contentStr = 'input file header';
	private $solverName = "PATRUS_v1.exe";
	
	function generateInputData($postData, $propArray, $consArray){
		$space = $this->separator;
		$newline = $this->newLine;
		$this->projName = Web::instance()->slug($postData['proj']);		
		$gui = $postData['gui'];
		$contentStrForce = '';
		$this->contentStr .= $this->genNodes($gui['nodes'], $contentStrForce, $consArray);
		$this->contentStr .= $this->genMember($gui['members'], $propArray);
		$this->contentStr .= $contentStrForce ;
		$this->contentStr .= '0' . $space . '0' . $space . '0' . $newline;
	}
	
	function saveInputData($useExternalServer, $user, $ssh){		
		$fn = "input.txt";
		$projPath = $this->solverPath . '/'. $user . '/'. $this->projName;
		if ($useExternalServer){
			$scp = new Net_SCP($ssh);
			$scp->put($fn, $this->contentStr);
			echo $ssh->exec("mkdir -p $projPath");
			echo $ssh->exec("rm -rf $projPath/*");
			echo $ssh->exec("mv $fn $projPath/.");
		}else{
			$this->generateFile($user, $fn, $contentStr, $this->projName);			
		}
	}
	
	function solve($useExternalServer, $projName, $user, $ssh){
		$projPath = $this->solverPath . '/'. $user . '/'. $projName . '/';
		if ($useExternalServer){
			echo $ssh->exec("rm -rf $projPath/GRAPH $projPath/output.txt ");
			return $ssh->exec("./$this->solverPath/$this->solverName $projPath");
		}
	}
	
	private function genNodes($dataArray, &$contentStrForce, $consArray){//& argument act as "pass as reference"
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . count($dataArray) . $newline;
		foreach($dataArray as $nodeInd => $data){
			$consData = array('rx'=>0, 'ry'=>0, 'lp'=>0, 'lq'=>0 );
			if (isset($data['constraint'])){
				$consData = (array)$consArray[$data['constraint']];
			}
			$dataStr .= 
				$nodeInd+1 . $space . 
				$consData['rx'] . $space . 
				$consData['ry'] . $space . 
				$data['x'] . $space . 
				$data['y'] . $newline;
				
			if ((isset($consData['lp']) || isset($consData['lq'])) && ($consData['lp'] != '' || $consData['lp'] != '')){
				$contentStrForce .= $nodeInd+1 . $space . $consData['lp'] . $space . $consData['lq'] . $newline;
			}
		}
		return $dataStr;
	}
	
	private function genMember($dataArray, $propArray){
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = count($dataArray) . $newline;
		foreach($dataArray as $data){
			$propData = array('area'=>0, 'eYoung'=>0, 'temp'=>0, 'LOF'=>0, 'alpha'=>0, 'ro'=>0 );
			if (isset($data['prop'])){
				$propData = (array)$propArray[$data['prop']];
			}
			$dataStr .= 
				$data['index']+1 . $space . 
				$data['node1'] . $space . 
				$data['node2'] . $space . 
				$propData['area'] . $space . 
				$propData['youngModulus'] . $space . 
				$propData['temp'] . $space . 
				$propData['LOF'] . $space . //Lack Of Fit
				$propData['alpha'] . $space . //Thermal Expansion
				$propData['ro'] . $newline; //Weight/unit length
		}
		return $dataStr;
	}
}