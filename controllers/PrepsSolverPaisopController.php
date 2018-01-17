<?php
class PrepsSolverPaisopController extends PrepsController{
	private $contentStr = 'input file header';
	private $solverName = "PAISO.exe";
	
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
		$dataStr = '';
		$counter = 0;
		foreach($dataArray as $nodeInd => $data){
		  if (isset($data['x']) && isset($data['y']) && !is_null($data['x']) && !is_null($data['y'])){
			$counter++;
			$consData = array('tx'=>0, 'ty'=>0, 'tz'=>0, 'rx'=>0, 'ry'=>0, 'rz'=>0, 'lp'=>0, 'lq'=>0 , 'lr'=>0 );
			if (isset($data['cons'])){
				if ($data['cons'] == 'Custom'){
					$consData = $data['customCons'];				
				}else{
					$consData = $data['presetCons'];
				}
			}
			$dataStr .= 
				$nodeInd+1 . $space . 
				$consData['tx'] . $space . //Translational
				$consData['ty'] . $space . 
				$consData['tz'] . $space . 
				$consData['rx'] . $space . //Rotational
				$consData['ry'] . $space . 
				$consData['rz'] . $space . 
				$data['x'] . $space . 
				$data['y'] . $space .
				$data['z'] . $newline;
				
			if (
				(isset($consData['lp']) || isset($consData['lq']) || isset($consData['lr'])) && 
				($consData['lp'] != '' && $consData['lp'] != '' && $consData['lr'] != '') &&
				($consData['lp'] != '0' && $consData['lp'] != '0' && $consData['lr'] != '0')
			){
				$contentStrForce .= $nodeInd+1 . $space . $consData['lp'] . $space . $consData['lq'] . $space . $consData['lr'] . $newline;
			}
		  }
		}
		return $newline . $counter . $newline . $dataStr;
	}
	
	private function genMember($dataArray){
		$space = $this->separator;
		$newline = $this->newLine;
		//$dataStr = count($dataArray) . $newline;
		$dataStr = '';
		$counter=0;
		foreach($dataArray as $data){
		  if (isset($data['node1']) && isset($data['node2']) && !is_null($data['node1']) && !is_null($data['node2'])){
			$counter++;
			$propData = array('thickness'=>0, 'youngModulus'=>0, 'poissonRatio'=>0, 'pressX'=>0, 'pressY'=>0, 'pressZ'=>0 );
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
				$data['node3'] . $space . 
				$data['node4'] . $space . 
				$data['node5'] . $space . 
				$data['node6'] . $space . 
				$data['node7'] . $space . 
				$data['node8'] . $space . 
				$propData['thickness'] . $space . 
				$propData['youngModulus'] . $space . 
				$propData['poissonRatio'] . $space . 
				$propData['pressX'] . $space . 
				$propData['pressY'] . $space . 
				$propData['pressZ'] . $newline; 
		  }
		}
		return $counter . $newline . $dataStr;
	}
}