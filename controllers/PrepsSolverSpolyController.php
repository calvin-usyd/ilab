<?php
class PrepsSolverSpolyController extends PrepsController{
	private $vertStr;
	private $tagsStr;
	private $parameterData;
	private $simData;
	private $solverName = "template.exe";
	
	/*
parameters.txt: - props & params
	1e4  ##ncs
	1e3  ##tcs
	0.5  ##cof
	0.0  ##cor
	400  ##ncov
	40  ##tcov
	0  ##dcov
	-9.81  ##grav
	90  ##aoiog
	5.0e-3  ##vd
	5e-5  ##ts
	1  ##dens
	viscoelastic  ##cm
	
particles.txt:
	0 60 8 318 548.1083 339 437.3811 457 345.9204 526 367.9324 591 469.6517 504 551.5181 385 554.2225 318 548.1083
	0 60 8 404 164.5917 511 46.9034 670 108.899 717 216.6989 636 401.7048 535 510.873 438 375.2906 404 164.5917
	
tags.txt: - cons
	2 1 1 1 0 0 0 0 0 0 0 0 0
	
project_parameters.txt - params
	v1  ##simulation
	gnuplot	##method
	1000  ##dLen
	0  ##lLimit
	1000  ##rLimit
	0  ##bLimit
	590  ##tLimit
	10  ##fps
	10  ##dps
	10  ##sTime
	*/
	function generateInputData($postData, $propArray, $consArray){
		$tagsStr = "";
		$vertStr = "";
		$separator = $this->separator;
		$gui = $postData['gui'];
		$particleArray = $gui['particle'];
		$solverVal = $postData['solverVal'];
		$solverParam = $solverVal['param'];
		$this->projName = Web::instance()->slug($postData['proj']);
		
		$len = count($particleArray);
		
		//USE THE FIRST PARTICLE'S PROPERTY TO SET IN parameters.txt
		//$propArray = $this->getPropertyArray($f3);
		if ($len > 0){
			$mergeParameterData = array();
			
			$propData = (array)$propArray[$particleArray[0]['p']];
			$mergeParameterData['ncs'] = $propData['ncs'];
			$mergeParameterData['tcs'] = $propData['tcs'];
			$mergeParameterData['cof'] = $propData['cof'];
			$mergeParameterData['cor'] = $propData['cor'];
			$mergeParameterData['ncov'] = $propData['ncov'];
			$mergeParameterData['tcov'] = $propData['tcov'];
			$mergeParameterData['dcov'] = $propData['dcov'];
			$mergeParameterData['grav'] = $solverParam['grav'];
			$mergeParameterData['aoiog'] = $solverParam['aoiog'];
			$mergeParameterData['vd'] = $solverParam['vd'];
			$mergeParameterData['ts'] = $solverParam['ts'];
			$mergeParameterData['density'] = $propData['density'];
			$mergeParameterData['cm'] = $solverParam['cm'];
			$this->parameterData = $mergeParameterData;
		}
		
		//START GENERATING FILES
		//$consArray = $this->getConstraintArray($f3);
		
		for ($x=$len-1; $x>=0; $x--){
			//echo json_encode(array('hi1!'));
			$particleData = $particleArray[$x]['v'];
			
			if (array_key_exists('c', $particleArray[$x])){
				$tagsData = (array)$consArray[$particleArray[$x]['c']];
				//var_dump($tagsData);
				
				//$tagsStr = $this->generateDataString($tagsData, $separator) . $newLine .  $tagsStr;
				if ($tagsData["vxTag"] == '1' || 
					$tagsData["vyTag"] == '1' ||  
					$tagsData["vphiTag"] == '1' ||  
					$tagsData["fxTag"] == '1' ||  
					$tagsData["fyTag"] == '1' ||  
					$tagsData["fphiTag"] == '1' 
				){
					$tagsStr = 	($x+1). $separator  . 
						$tagsData["vxTag"] . $separator  . 
						$tagsData["vyTag"] . $separator  . 
						$tagsData["vphiTag"] . $separator  . 
						$this->emptyToZero($tagsData["vx"]) . $separator  . 
						$this->emptyToZero($tagsData["vy"]) . $separator  . 
						$this->emptyToZero($tagsData["vphi"]) . $separator  . 
						$tagsData["fxTag"] . $separator  . 
						$tagsData["fyTag"] . $separator  . 
						$tagsData["fphiTag"] . $separator  . 
						$this->emptyToZero($tagsData["fx"]) . $separator  . 
						$this->emptyToZero($tagsData["fy"]) . $separator  . 
						$this->emptyToZero($tagsData["fphi"])  . $this->newLine .  $tagsStr;
				}
			}
			
			$vertStr = 	$particleArray[$x]["m"] . $separator  . 
						$particleArray[$x]["r"] . $separator . 
						count($particleData)/2 . $separator . 
						$this->generateDataString($particleData, $separator) . $this->newLine .  $vertStr;
		}
		$this->tagsStr = $tagsStr;
		$this->vertStr = $vertStr;
		$this->simData = $solverVal['sim'];
	}
	
	function saveInputData(){
		$fnPart = "particles.txt";
		$fnTags = "tags.txt";
		$fnParam = "parameters.txt";
		$fnProjParam = "project_parameters.txt";
		
		if ($this->useExternalServer){
			$projPath = $this->externalServerDataPath . '/'. $this->user . '/'. $this->projName;
			$scp = new Net_SCP($this->ssh);
			$scp->put($fnPart, $this->vertStr);
			$scp->put($fnTags, $this->tagsStr);
			$scp->put($fnParam, $this->generateDataStringWithLabel($this->parameterData, $this->newLine));
			$scp->put($fnProjParam, $this->generateDataStringWithLabel($this->simData, $this->newLine));
			
			echo $this->ssh->exec("mkdir -p $projPath");
			echo $this->ssh->exec("mv $fnPart $fnTags $fnParam $fnProjParam $projPath/.");
		}else{
			$this->generateFile($fnPart, $this->vertStr, $this->projName);
			$this->generateFile($fnTags, $this->tagsStr, $this->projName);
			$this->generateFile($fnParam, $this->generateDataStringWithLabel($this->parameterData, $this->newLine), $this->projName);
			$this->generateFile($fnProjParam, $this->generateDataStringWithLabel($this->simData, $this->newLine), $this->projName);	
		}
	}
	
		//SPOLY : url+'cgi-bin/solve_spoly.py?p=',
		//CONFEM : url+'cgi-bin/solve_confem.py?p=',
		//PATRUS : url+'cgi-bin/solve_patrus.py?p='
	//function solve($useExternalServer, $projName, $user, $ssh){
	function solve($projName){
		$projPath = $this->getUserDataPath() . '/'. $projName . '/';
		$xCmd = "$this->solverPath/$this->solverName $projPath";		
		if ($this->useExternalServer){
			//$projPath = $this->externalServerDataPath . '/' . $this->user . '/'. $projName;
			//return $this->ssh->exec("./$this->solverPath/$this->solverName $projPath");
			return $this->ssh->exec($xCmd);
		}else{
			shell_exec($rmCmd);
			$handle = shell_exec("$this->serverPath/$this->appPath/$xCmd");
			echo $handle;
			return $handle;
		}
	}
	
	private function emptyToZero($val){
		return $val == '' ? 0 : $val;
	}
	
	private function generateDataString($dataArray, $separator){
		$tempData="";
		$counter=0;
		
		foreach ($dataArray as $data)
		{
			if ($counter==0){
				$tempData = $data;
				$counter++;
				
			}else{
				$tempData = $tempData . $separator . $data;
			}
		}
		return $tempData;
	}
	
	private function generateDataStringWithLabel($dataArray, $separator){
		$tempData="";
		$counter=0;
		
		foreach ($dataArray as $key => $data)
		{
			if ($counter==0){
				$tempData = str_replace('\r', '', $data) . $this->labelSeparator . $key;
				$counter++;
				
			}else{
				$tempData = $tempData . $separator . str_replace('\r', '', $data) . $this->labelSeparator . $key;
			}
		}
		return $tempData;
	}
	
}