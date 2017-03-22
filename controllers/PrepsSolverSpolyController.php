<?php
class PrepsSolverSpolyController extends PrepsController{
	private $vertStr;
	private $tagsStr;
	private $parameterData;
	private $simData;
	private $solverName = "template.exe";
	
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
	
	function saveInputData($useExternalServer, $user, $ssh){		
		$fnPart = "particles.txt";
		$fnTags = "tags.txt";
		$fnParam = "parameters.txt";
		$fnProjParam = "project_parameters.txt";
		
		$projPath = $this->solverPath . '/'. $user . '/'. $this->projName;
		if ($useExternalServer){
			$scp = new Net_SCP($ssh);
			$scp->put($fnPart, $this->vertStr);
			$scp->put($fnTags, $this->tagsStr);
			$scp->put($fnParam, $this->generateDataStringWithLabel($this->parameterData, $this->newLine));
			$scp->put($fnProjParam, $this->generateDataStringWithLabel($this->simData, $this->newLine));
			
			echo $ssh->exec("mkdir -p $projPath");
			echo $ssh->exec("mv $fnPart $fnTags $fnParam $fnProjParam $projPath/.");
		}else{
			$this->generateFile($user, $fnPart, $this->vertStr, $this->projName);
			$this->generateFile($user, $fnTags, $this->tagsStr, $this->projName);
			$this->generateFile($user, $fnParam, $this->generateDataStringWithLabel($this->parameterData, $this->newLine), $this->projName);
			$this->generateFile($user, $fnProjParam, $this->generateDataStringWithLabel($this->simData, $this->newLine), $this->projName);	
		}
	}
	
	function solve($useExternalServer, $projName, $user, $ssh){
		$projPath = 'data/'. $user . '/'. $projName;
		if ($useExternalServer){
			echo $ssh->exec("./$this->solverPath/$this->solverName $projPath");
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