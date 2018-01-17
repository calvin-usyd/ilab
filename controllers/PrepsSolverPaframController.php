<?php
class PrepsSolverPaframController extends PrepsController{
	private $contentStr = 'input file header';
	private $solverName = "PAFRAM.exe";
	
	function generateInputData($postData){
		$space = $this->separator;
		$newline = $this->newLine;
		$this->projName = Web::instance()->slug(strtolower($postData['proj']));
		$gui = $postData['gui'];
		$contentStrForce = '';
		$this->contentStr .= $this->genNodes($gui['nodes'], $contentStrForce);
		$this->contentStr .= $this->genMember($gui['members']);
		$this->contentStr .= $contentStrForce ;
		$this->contentStr .= '0 0 0 0' . $newline;
	}
	
	function saveInputData(){	
		$fn = "input.txt";
		if ($this->useExternalServer){
			$projPath = $this->externalServerDataPath . '/'. $this->user . '/'. $this->projName;
			$scp = new Net_SCP($this->ssh);
			$scp->put($fn, $this->contentStr);
			echo $this->ssh->exec("mkdir -p $projPath");
			echo $this->ssh->exec("rm -rf $projPath/*");
			echo $this->ssh->exec("mv $fn $projPath/.");
		}else{
			$this->generateFile($fn, $this->contentStr, $this->projName);			
		}
	}
	
	//function solve($useExternalServer, $projName, $user, $ssh){
	function solve($projName){
		$projPath = $this->getUserDataPath() . $projName . '/';
		$rmCmd = "rm -rf $projPath/GRAPH $projPath/output.txt";
		$xCmd = "$this->solverPath/$this->solverName $projPath";
		if (file_exists('$this->serverPath/$this->appPath/$this->solverPath/$this->solverName')) {//check if exe file exists
			//echo 'solver found!';
		}else{
			return 'solver NOT found!';
		}
		if (file_exists('$projPath')) {//check if exe file exists
			//echo 'project found!';
		}else{
			return 'project NOT found! -> $projPath';
		}
		if ($this->useExternalServer){
			echo $this->ssh->exec($rmCmd);
			return $this->ssh->exec("./". $xCmd);
		}else{
			shell_exec($rmCmd);
			$handle = shell_exec("$this->serverPath/$this->appPath/$xCmd");
			return $handle;
		}
	}
	
	private function genNodes($dataArray, &$contentStrForce){//& argument act as "pass as reference"
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . count($dataArray) . $newline;
		foreach($dataArray as $nodeInd => $data){
			//$consData = array('rx'=>0, 'ry'=>0, 'theta'=>0, 'lp'=>0, 'lq'=>0, 'moment'=>0 );
			$consData = array('tx'=>0, 'ty'=>0, 'tz'=>0, 'lp'=>0, 'lq'=>0, 'moment'=>0 );
			if (isset($data['cons'])){
				if ($data['cons'] == 'Custom'){
					$consData = $data['customCons'];				
				}else{
					$consData = $data['presetCons'];
				}
			}
			$dataStr .= 
				$nodeInd+1 . $space . 
				$consData['tx'] . $space . 
				$consData['ty'] . $space . 
				$consData['tz'] . $space . 
				$data['x'] . $space . 
				$data['y'] . $newline;
				
			if ((isset($consData['lp']) || isset($consData['lq']) || isset($consData['moment'])) && ($consData['lp'] != '' || $consData['lp'] != '' || $consData['moment'] != '')){
				$contentStrForce .= $nodeInd+1 . $space . $consData['lp'] . $space . $consData['lq'] .$space . $consData['moment'] . $newline;
			}
		}
		return $dataStr;
	}
	
	private function genMember($dataArray){
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = count($dataArray) . $newline;
		foreach($dataArray as $data){
			$propData = array('area'=>0, 'inertia'=>0, 'youngModulus'=>0, 'temp'=>0, 'LOF'=>0, 'alpha'=>0, 'pressY'=>0 , 'hingeI'=>0 , 'hingeJ'=>0 );
			if (isset($data['prop'])){
				if ($data['prop'] == 'Custom'){
					$propData = $data['customProp'];				
				}else{
					$propData = $data['presetProp'];
				}
			}
			$dataStr .= 
				$data['index'] . $space . 
				$data['node1'] . $space . 
				$data['node2'] . $space . 
				$propData['area'] . $space . 
				$propData['inertia'] . $space . 
				$propData['youngModulus'] . $space . 
				$propData['temp'] . $space . 
				$propData['LOF'] . $space . //Lack Of Fit
				$propData['alpha'] . $space . //Thermal Expansion
				$propData['pressY'] . $space . // UNIFORMLY DISTRIBUTED LOAD ACTING NORMAL TO MEMBER  I-J  (DOWNWARDS)
				$propData['hingeI'] . $space . //HINGE AT I AND/OR J  (READ  1,0  0,1  OR 1,1  AS REQUIRED)
				$propData['hingeJ'] . $newline;
		}
		return $dataStr;
	}
}