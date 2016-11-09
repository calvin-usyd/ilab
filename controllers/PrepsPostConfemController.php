<?php
class PrepsPostConfemController extends PrepsController
{	
	function afterroute($f3) { 
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
    }
 
	public function fixConfemCode($f3){
	//public function getPltData($f3){
		$dataStr = file_get_contents('data/calvin/confem.f');
		//mb_convert_encoding($dataStr,'UTF-8','UTF-8');
		
		if(!mb_check_encoding($dataStr, 'UTF-8')) {
			$dataStr = utf8_encode($dataStr);
		}
		$codes = explode('\r\n', json_encode($dataStr));
		$newCode='';
		
		foreach($codes as $line){
			if (strpos($line, '* ') == 0){
				echo $line . '\n';
				$line = substr_replace($line, '!', 0, 1);
			}
			if (strpos($line, '#') == 5){
				$newCode = $newCode . ' &';
				$newCode = $newCode . $this->newLine . substr_replace($line, '', 5, 1);
			}else{
				$newCode = $newCode . $this->newLine . $line;				
			}
			$newCode = str_replace('\t', ' ', $newCode);
		}
		file_put_contents('data/calvin/confem1.f', $newCode);
		//echo $newCode;
	}
	
	public function getPltData($f3){
		$user = $f3->get('SESSION.user');
		//$user = 'calvin';
		$projName = $f3->get('PARAMS.projName');
		
		$path = 'data/'.$user.'/' . $projName ;
		
		$plt = explode('\r\n', json_encode(file_get_contents($path . '/' . $projName . '.plt')));
		
		$active = trim($plt[2]);
		$activeArr = explode('  ', $active);
		$totalNodes = explode('   ', $plt[1])[1];
		$analysisName = array();
		
		for($x=3; $x<20; $x++){
			array_push($analysisName, $plt[$x]);
		}
		/*echo (float)'-9.75844e+18';
		echo "--";
		echo 0 + '-9.75844e+18';
		echo "--";
		echo sscanf('-9.75844e+18', "%f")[0];
		*/
		$nodeAndTimeCount=0;
		$totalNodeRecords=count($plt);
		$time=0;
		$nodeCoorContourArr = array();
		$allMinMaxArr = array();
		$analysisDataArr = array();
		$analysisTimeArr = array();
		$minCoor=$maxCoor=null;
		$minMaxArr = array();
		
		for($x=20; $x<$totalNodeRecords; $x++){
			if ($nodeAndTimeCount == 0){
				$time = (float)$plt[$x];
				array_push($analysisTimeArr, $time);
				
			}else{
				$filteredDataArr = array();
				$dataArr = explode('  ', str_replace('   ', '  ', str_replace('    ', '  ', trim($plt[$x]))));
				//foreach($dataArr)
				$zCounter=2;
				array_push($filteredDataArr, array(
					"n"=>(float)$dataArr[0], 
					"x"=>(float)$dataArr[1], 
					"y"=>(float)$dataArr[2],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++],
					$zCounter=>(float)$dataArr[$zCounter++]
				));
				
				/*for ($i=3; $i<count($dataArr); $i++){
					$number=(float)$dataArr[$i];
					
					//if ($i >= 0 && $i <= 2){//FIRST THREE VALUE ARE LAYER NO, X AND Y COORDINATES
						//array_push($filteredDataArr, $number);
						
					//}else
					if ($activeArr[$i-3] === "1"){
						//CALCULATE MIN & MAX
						//console.log('minCoor='.$minCoor);
						//console.log($minCoor==null);
						
						if (!isset($minMaxArr[$i][0]) && !isset($minMaxArr[$i][1])){
							$minMaxArr[$i] = array($number, $number);
						}else{
							if ($number > $minMaxArr[$i][1]){
								$$minMaxArr[$i][1] = $number;
							}else if ($number < $minMaxArr[$i][0]){
								$minMaxArr[$i][0] = $number;
							}
						}
						
						/*if ($i == 4){
							if ($minCoor==null && $maxCoor==null){
								$minCoor=$maxCoor=$number;
							}else{
								if ($number > $maxCoor){
									$maxCoor = $number;
								}else if ($number < $minCoor){
									$minCoor = $number;
								}
							}
						}/
						
						//SAVE DATA INTO ARRAY
						array_push($filteredDataArr, $number);
					}
				}*/
				array_push($nodeCoorContourArr, $filteredDataArr);
				//array_push($nodeCoorContourArr, explode('  ', str_replace('   ', '  ', str_replace('    ', '  ', trim($plt[$x])))));
			}
			
			if ($nodeAndTimeCount == $totalNodes){
				//array_push($analysisDataArr, array($time=>$nodeCoorContourArr));
				//array_push($nodeCoorContourArr, array('min'=>$minCoor, 'max'=>$maxCoor));
				array_push($allMinMaxArr, $minMaxArr);
				array_push($analysisDataArr, $nodeCoorContourArr);
				//$minCoor=$maxCoor=null;
				$minMaxArr = array();
				$nodeAndTimeCount=0;
				$nodeCoorContourArr = array();
			}else{
				$nodeAndTimeCount++;
			}
		}
		
		echo json_encode(array('active'=>$activeArr, 'analysisTime'=>$analysisTimeArr, 'analysisName'=>$analysisName, 'analysisDataArr'=>$analysisDataArr, 'allMinMaxArr'=>$allMinMaxArr));
		
		die();
	}
	
	/*
	25 E-01 = 25 * 10^(-1) = 2.5 
	25E2 = 25 * 10^2 = 2500 
	7.8E-02 = 7.8 * 10^(-2) = 0.078 
	7.8E3 = 7.8 * 10^3 = 7800 */
	public function getMeshData($f3){
		$user = $f3->get('SESSION.user');
		//$user = 'calvin';
		
		$projName = $f3->get('PARAMS.projName');
		
		$path = 'data/'.$user.'/' . $projName ;
		
		$mesh = file_get_contents($path . '/' . $projName . '.msh');
		
		$dcnStr = 'DISCONTINUOUS_NODES:';
		$dcdStr = 'DISCONTINUITY DATA';
		
		//$mesh = substr($mesh, strpos($mesh, $dcnStr) + strlen($dcnStr) , strpos($mesh, $dcdStr) - strlen($dcdStr));
		//$nodeNo = explode(' ', trim(substr($mesh, strpos('\r\n'))))[0];
		$ncStr = 'NODES COORDINATES:';
		$ciStr = 'CONNECTIVITY AND INITIAL CONDITIONS FOR EACH ELEMENT:';
		
		$mesh = substr($mesh, strpos($mesh, $ncStr) + strlen($ncStr) , strpos($mesh, $dcdStr) - strlen($dcdStr) - strpos($mesh, $ncStr));
		//$startNode =  strpos($mesh, $ncStr) + strlen($ncStr);
		$startElem = strpos($mesh, $ciStr) + strlen($ciStr);
		
		$nodes = explode('\r\n', json_encode(str_replace('   ', '  ', str_replace('      ', '  ', trim(substr($mesh, 0, strpos($mesh, $ciStr)))))));
		//$nodes = explode('\r\n', json_encode(preg_replace('/\s+/', '', (substr($mesh, 0, strpos($mesh, $ciStr))))));
		$elements = explode('\r\n', json_encode(str_replace('     ', '   ', str_replace('      ', '   ', trim(substr($mesh, $startElem))))));
		$nodesData = array();
		$elementsData = array();
		//var_dump($nodes);
		foreach($nodes as $data){
			$nodeVals = explode('  ', trim($data));
			array_push($nodesData, array((float)$nodeVals[1], (float)$nodeVals[2]));
		}
		//var_dump($nodesData);
		foreach($elements as $data){
			$elemVals = explode('   ', trim($data));
			$valCount=0;
			$newElemArr = array();
			
			foreach($elemVals as $val){
				if ($valCount >0 && $valCount <9){
					array_push($newElemArr, trim($val));
				}
				$valCount++;
			}
			array_push($elementsData, $newElemArr);
		}
		
		echo json_encode(array('nodes'=>$nodesData, 'elements'=>$elementsData));
		
		die();
	}
	
}	