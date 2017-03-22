<?php
class PrepsAccountController extends PrepsController
{	
	function afterroute($f3) { 
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
    }
	
	public function index($f3){
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
		$f3->set('microtime', microtime());
		echo Template::instance()->render('finite-element-2d.html');
	}
	
	public function solver($f3){
		$solverCtrlArr = array(
			'solve_spoly'=>(new PrepsSolverSpolyController($f3)),
			'solve_confem'=>(new PrepsSolverConfemController($f3)),
			'solve_patrus'=>(new PrepsSolverPatrusController($f3))
		);
		$solver = $solverCtrlArr[$f3->get('PARAMS.solverType')];
		$msg = $solver->solve(
			$f3->get('useExternalServer'),
			$f3->get('POST.p'),
			$f3->get('SESSION.user'),
			$this->getSsh($f3)
		);
		$this->echoJson(array("message", $msg));
	}
	
	public function projectFileUpload($f3){
		$pName = $f3->get('PARAMS.proj');
		
		$dir = 'data/'. $f3->get('SESSION.user') .'/'.$pName.'/';
		
		$f3->set('UPLOADS', $dir);
		
		$err = $_FILES['fileToUpload']['error'];
		
		if ($err == 0){			
			$this->processUpload();
			$this->projectFileList($f3);
			
		}elseif ($err == UPLOAD_ERR_INI_SIZE){
			echo json_encode(array('fail', 'uploaded file exceeds the upload_max_filesize'));
			die();
			
		}elseif ($err == UPLOAD_ERR_FORM_SIZE){
			echo json_encode(array('fail', 'uploaded file exceeds the MAX_FILE_SIZE'));
			die();
			
		}elseif ($err == UPLOAD_ERR_PARTIAL){
			echo json_encode(array('fail', 'uploaded file was only partially uploaded'));
			die();
			
		}elseif ($err == UPLOAD_ERR_NO_FILE){
			echo json_encode(array('fail', 'No file was uploaded'));
			die();
		}
		die();
	}
	
	public function projectFileList($f3){
		$pName = $f3->get('PARAMS.proj');
		
		$dir = 'data/'. $f3->get('SESSION.user') .'/'.$pName.'/';
		$fileArr = array();
		
		if (is_dir($dir)){
		  if ($dh = opendir($dir)){
			while (($file = readdir($dh)) !== false){
			  if($file !== '..' && $file !== '.' )
				array_push($fileArr, array('href'=>'/'.$dir.$file, 'name'=>$file));
			}
			closedir($dh);
		  }
		}
		echo json_encode($fileArr);
		die();
	}
	
	public function profileEdit($f3){
		if ($f3->exists('POST.email')){
			$pass = true;
			if ($f3->get('POST.changePassword') == 1){
				if ($f3->get('POST.currentPassword') != '' && $f3->get('POST.newPassword') != ''){
				
					$result = $this->users->getById('username', $f3->get('SESSION.user'));
					$validPass = 0;
					
					if (!$this->users->dry()){
						$crypt = \Bcrypt::instance();
						$validPass = $crypt->verify($f3->get('POST.currentPassword'), $this->users->password);

						if ($validPass){
							$f3->set('POST.password', $crypt->hash($f3->get('POST.newPassword')));
						}else{
							$msg = array('fail', 'Incorrect current password!');
							$pass = false;
						}	
					}
				}else{
					$msg = array('fail', 'Please fill up all the password fields or un-check "Change password" checkbox!');
					$pass = false;
				}
			}
			if ($pass){
				$this->users->reset();
				$this->users->edit('username', $f3->get('POST.username'));
				$msg = array('success', 'Profile updated successfully!');
			}
			
		}else{
			$msg = array('fail', 'Please fill up all empty fields!');
		}
		
		echo json_encode($msg);
		die();
	}
	
	public function profileView($f3){
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			echo json_encode(array('warning','Your session has expired! Please go to "Account" -> "Activate Session" to activate your session again!'));
			die();
		}
		
		$user = $this->users->getById('username', $f3->get('SESSION.user'));
		
		echo json_encode(array(
			'username'=>$this->users->username,
			'email'=>$this->users->email
		));
		die();
	}
	
	public function stopExe($f3){
		$output = exec('exit 1');
		var_dump($output);
	}
	
	//Generate Result using Gnuplot JS (Runs in client)
	public function result($f3){
		$htm = '';
		$f3->set('microtime', microtime());
		$f3->set('project', $f3->get('PARAMS.projName'));
		$params = explode('_', $f3->get('PARAMS.params'));
		$solver = $params[0];
		
		if ($solver == 'SPOLY'){
			$f3->set('simulation', $params[1]);
		}
		$f3->set('projNameSlug', $f3->get('PARAMS.projName'));
		$f3->set('projName', str_replace( '-', ' ', $f3->get('PARAMS.projName')));
		echo Template::instance()->render('postProcessor'.$solver.'.htm');
	}
	
	public function confem($f3){
		$f3->set('projName', str_replace( '-', ' ', $f3->get('PARAMS.projName')));
		$f3->set('projNameSlug', $f3->get('PARAMS.projName'));
		$htm = 'postProcessorCONFEM.htm';
		$f3->set('microtime', microtime());
		echo Template::instance()->render($htm);		
	}
	
	private function toArrayParam($path){
		$projStr = file_get_contents($path . 'parameters.txt');
		
		$dataArray = explode( $this->newLine, $projStr);
		
		$counter = 0;
		
		if (count($dataArray) == count($this->parameters)){
			$this->parameters = array(
				"ncs"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"tcs"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"cof"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"cor"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"ncov"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"tcov"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"dcov"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"grav"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"aoiog"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"vd"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"ts"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"dens"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"cm"=>explode($this->labelSeparator, $dataArray[$counter++])[0]
				//"cores"=>$dataArray[$counter++]
			);
		}
	}
	
	private function toArrayProjectParam($path){
		$projStr = file_get_contents($path . 'project_parameters.txt');
		
		$dataArray = explode( $this->newLine, $projStr);
		
		$counter = 0;
		
		if (count($dataArray) == count($this->project_parameters)){
			$this->project_parameters = array(
				"simulation"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"method"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"dLen"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"lLimit"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"rLimit"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"bLimit"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"tLimit"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"fps"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"dps"=>explode($this->labelSeparator, $dataArray[$counter++])[0],
				"sTime"=>explode($this->labelSeparator, $dataArray[$counter++])[0]	
			);
		}
	}
	
	private function toArrayParticle($path){
		$particlesStr = file_get_contents($path . 'particles.txt');
		$tagsStr = file_get_contents($path . 'tags.txt');
		
		$particleRecordsArray = explode( $this->newLine, $particlesStr);
		$tagRecordsArray = explode( $this->newLine, $tagsStr);
		
		$tempTags = array();
		
		//Convert array record into data array
		foreach($tagRecordsArray as $indexRec => $record){
			if (count($record) > 0 && !empty($record)){
				$tempTags[$record[0]] = $record;
			}
		}
		
		foreach($particleRecordsArray as $indexRec => $record){
			if (empty($record)){
				continue;
			}
			
			/*Process vertices*/
			$particleDataArray = explode( $this->separator, trim($record));
			
			$particleData = array();
			//$tagData = array();
			
			foreach($particleDataArray as $indexData => $data){
				
				if ($indexData > 2){
					$particleData[] = $data;
					
				}elseif ($indexData == 0 ){//position 2 is N=number of vertices, thus not included according to SPOLYTutorial.doc
					$this->tags['mark'] = $data;//set mark to physicProp
					
				}elseif ($indexData == 1 ){
					$this->tags['radius'] = $data;//set radius to physicProp
				}
			}
			
			/*Process tags/physicProp*/
			if (array_key_exists($indexRec+1, $tempTags)){//check if the index of the particle is in the tags/physicProp
				$tagRecord = $tempTags[$indexRec+1];
				$tagDataArray = explode( $this->separator, $tagRecord);
				
				/*foreach($tagDataArray as $indexData => $data){
					if ($indexData != 0){//skip the first index because it represent the index of the particle
						$tagData[] = $data;
					}
				}*/
				$i = 1;//skip the first index because it represent the index of the particle
				$this->tags['vxTag'] = $tagDataArray[$i++];
				$this->tags['vyTag'] = $tagDataArray[$i++];
				$this->tags['vphiTag'] = $tagDataArray[$i++];
				$this->tags['vx'] = $this->emptyToZero($tagDataArray[$i++]);
				$this->tags['vy'] = $this->emptyToZero($tagDataArray[$i++]);
				$this->tags['vphi'] = $this->emptyToZero($tagDataArray[$i++]);
				$this->tags['fxTag'] = $tagDataArray[$i++];
				$this->tags['fyTag'] = $tagDataArray[$i++];
				$this->tags['fphiTag'] = $tagDataArray[$i++];
				$this->tags['fx'] = $this->emptyToZero($tagDataArray[$i++]);
				$this->tags['fy'] = $this->emptyToZero($tagDataArray[$i++]);
				$this->tags['fphi'] = $this->emptyToZero($tagDataArray[$i++]);
				
			}else{
				$this->tags['vxTag'] = '0';
				$this->tags['vyTag'] = '0';
				$this->tags['vphiTag'] = '0';
				$this->tags['vx'] = '0';
				$this->tags['vy'] = '0';
				$this->tags['vphi'] = '0';
				$this->tags['fxTag'] = '0';
				$this->tags['fyTag'] = '0';
				$this->tags['fphiTag'] = '0';
				$this->tags['fx'] = '0';
				$this->tags['fy'] = '0';
				$this->tags['fphi'] = '0';
			}
			
			$this->particles[] = array(
				'vertices'=>$particleData,
				'physicProp'=>$this->tags
			);
		}
	}
	
	public function getGnuplotInsContent($f3){
		$projName = $f3->get('PARAMS.projName') . '/';
		
		$simu = 'pics_' . $f3->get('PARAMS.simulation');

		$path = 'data/public/' . $projName . $simu;
				
		echo json_encode(file_get_contents( $path . '/' . $f3->get('PARAMS.insFileName')));
		
		die();
	}
	
	public function deleteProj($f3){
		$u = $f3->get('SESSION.user');
		$pN = $f3->get('POST.projName');
		
		$this->proj->deleteByArray(array('name=? and username=?', $pN, $u));
		
		$path = 'data/'.$u.'/'.$pN;
		
		$this->deleteDirectory($f3, $path);
		
		$this->loadProj($f3);
	}
	
	public function loadData($f3){
		$result = $this->proj->getByArray(array('username=? and name=?', $f3->get('SESSION.user'), $f3->get('PARAMS.proj')));
		$processedResult = array();
		
		foreach($result as $rec){
			array_push($processedResult, array(
				"pName"=>$rec['name'], 
				"solverType"=>$rec['solverType'], 
				"solverVal"=>$rec['solverVal'], //previous: param, sim
				"gui"=>$rec['gui']//previous: element, particle, node
				//"node"=>$rec['node'], 
				//"element"=>$rec['element'], 
				//"particle"=>$rec['particle'], 
				//"param"=>$rec['param'],
				//"sim"=>$rec['sim']
			));
		}
		
		echo json_encode($processedResult);
		die();
		
	}
	
	public function loadProj($f3){
		$result = $this->proj->getById('username', $f3->get('SESSION.user'));
		$processedResult = array();
		
		foreach($result as $rec){
			array_push($processedResult, array('value'=>$rec['name'], 'name'=>str_replace('-', ' ', $rec['name'])));
		}
		
		echo json_encode($processedResult);
		die();
	}
	
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
	public function save($f3){
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			echo json_encode(array('warning','Your session has expired! Please go to "Account" -> "Activate Session" to activate your session again!'));
			die();
		}
		$postData = json_decode($f3->get('BODY'),true);
		//var_dump($postData);
		//$parameterData = $postData['spoly']['param'];
		//$simulationData = $postData['spoly']['sim'];
		$projectName = Web::instance()->slug($postData['proj']);
		$solverType = $postData['solverType'];
		$solverVal = $postData['solverVal'];
		$gui = $postData['gui'];
		//$nodesArray = $postData['nodes'];
		//$elementsArray = $postData['elements'];
		//$particleArray = $postData['particle'];
		
		//SAVE EVERYTHING INTO DB
		//$this->saveToProject($f3, $projectName, $solverType, $solverVal, $nodesArray, $elementsArray, $particleArray);
		$this->saveToProject($f3, $projectName, $solverType, $solverVal, $gui);
		
		$propArray = $this->getPropertyArray($f3);
		$consArray = $this->getConstraintArray($f3);
		$user =  $f3->get('SESSION.user');
		
		if ($solverType == 'SPOLY')
			$solver = new PrepsSolverSpolyController($f3);
		
		elseif ($solverType == 'PATRUS')
			$solver = new PrepsSolverPatrusController($f3);
			
		elseif ($solverType == 'MATRUS')
			$solver = new PrepsSolverMatrusController($f3);
			
		elseif ($solverType == 'CONFEM')
			$solver = new PrepsSolverConfemController($f3);
		
		$solver->generateInputData($postData, $propArray, $consArray);
		$solver->saveInputData($f3->get('useExternalServer'), $user, $this->getSsh($f3));
		
		echo json_encode(array('success','The project "'.str_replace('-', ' ', $projectName).'" has been saved!'));
		die();
	}
	
	//private function saveToProject($f3, $name, $param, $sim, $nodesArray, $elementsArray, $particleArray){
	private function saveToProject($f3, $name, $solverType, $solverVal, $gui){
		$this->proj->getById('name', $name);
		
		//$f3->set('POST.param', json_encode($param));
		//$f3->set('POST.sim', json_encode($sim));
		$f3->set('POST.solverType', json_encode($solverType));
		$f3->set('POST.solverVal', json_encode($solverVal));
		$f3->set('POST.gui', json_encode($gui));
		//$f3->set('POST.element', json_encode($elementsArray));
		//$f3->set('POST.particle', json_encode($particleArray));
		
		if ($this->proj->dry()){
			$f3->set('POST.projLongId', $this->genLongId());
			$f3->set('POST.name', $name);
			$f3->set('POST.username', $f3->get('SESSION.user'));
			$this->proj->reset();
			$this->proj->add();
			
		}else{
			$this->proj->edit('projLongId', $this->proj->projLongId);
		}
	}
	
	private function getConstraintArray($f3){
		$consArr = $this->cons->getById('username', $f3->get('SESSION.user'));
		
		$processedArr = array();
		$cons = array();
		
		foreach($consArr as $val){
			$cons = json_decode($val['cons'], true);
			
			$processedArr[$cons['name']] = $cons;
		}
		
		return $processedArr;
	}
	
	private function getPropertyArray(){
		$propArr = $this->prop->all();
		$processedArr = array();
		
		foreach($propArr as $val){
			$prop = json_decode($val['properties'], true);
			//var_dump( $prop);
			$processedArr[$prop['name']] = $prop;
		}
		
		return $processedArr;
	}
	
}	