<?php
class PrepsSolverMatrusController extends PrepsController{
	
	function generateInputData($postData, $propArray, $consArray, $user){
		
		$tagsStr = "";
		$vertStr = "";
		$separator = $this->separator;
		$gui = $postData['gui'];
		$particleArray = $gui['particle'];
		$solverVal = $postData['solverVal'];
		$solverParam = $solverVal['param'];
		$projectName = Web::instance()->slug($postData['proj']);
		
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
			$parameterData = $mergeParameterData;
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
			//echo json_encode(array('hi!'));
		    //die();
		}
		
		//echo json_encode($particleArray);die();
		$this->generateFile($user, "particles.txt", $vertStr, $projectName);
		$this->generateFile($user, "tags.txt", $tagsStr, $projectName);
		$this->generateFile($user, "parameters.txt", $this->generateDataStringWithLabel($parameterData, $this->newLine), $projectName);
		$this->generateFile($user, "project_parameters.txt", $this->generateDataStringWithLabel($solverVal['sim'], $this->newLine), $projectName);
		
	}
	
	private function generateFile($user, $filename, $data, $projectName){
		$path = 'data/'.$user.'/'.Web::instance()->slug($projectName).'/';
		
		if (!file_exists($path)) {
			mkdir($path, 0755, true);
		}
		
		file_put_contents($path.$filename, $data);
	}
	
	private function emptyToZero($val){
		return $val == '' ? 0 : $val;
	}
	
	//josy0414637372
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