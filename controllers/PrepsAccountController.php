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
		$ctrlMap = $f3->get('CONFIG_SOLVER');
		$solver = new $ctrlMap[$f3->get('PARAMS.solverType')]($f3);
		$msg = $solver->solve(strtolower($f3->get('POST.p')));
		$this->echoJson(array("message", $msg));
	}
	
	public function output($f3){
		$ctrlMap = $f3->get('CONFIG_POSTP');
		$postP = new $ctrlMap[$f3->get('PARAMS.solverType')]($f3);
		$output = $postP->getOutput($f3);
		$this->echoJson($output);
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
			$this->echoJson(array('fail', 'uploaded file exceeds the upload_max_filesize'));
			
		}elseif ($err == UPLOAD_ERR_FORM_SIZE){
			$this->echoJson(array('fail', 'uploaded file exceeds the MAX_FILE_SIZE'));
			
		}elseif ($err == UPLOAD_ERR_PARTIAL){
			$this->echoJson(array('fail', 'uploaded file was only partially uploaded'));
			
		}elseif ($err == UPLOAD_ERR_NO_FILE){
			$this->echoJson(array('fail', 'No file was uploaded'));
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
		$this->echoJson($fileArr);
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
		$this->echoJson($msg);
	}
	
	public function profileView($f3){
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$this->echoJson(array('warning','Your session has expired! Please go to "Account" -> "Activate Session" to activate your session again!'));
		}
		
		$user = $this->users->getById('username', $f3->get('SESSION.user'));
		$this->echoJson(array(
			'username'=>$this->users->username,
			'email'=>$this->users->email
		));
	}
	
	public function stopExe($f3){
		$output = exec('exit 1');
		var_dump($output);
	}
	
	//Generate Result using Gnuplot JS (Runs in client)
	public function result($f3){
		$f3->set('microtime', microtime());
		$f3->set('project', $f3->get('PARAMS.projName'));
		$params = explode('_', $f3->get('PARAMS.params'));
		$solver = $params[0];
		$htm = $solver;
		
		if ($solver == 'SPOLY'){
			$f3->set('simulation', $params[1]);
			
		}elseif ($solver == 'PATRUS' || $solver == 'PAFRAM'){
			$htm = 'PA';
			$f3->set('solver', $solver);
		}
		$f3->set('projNameSlug', $f3->get('PARAMS.projName'));
		$f3->set('projName', str_replace( '-', ' ', $f3->get('PARAMS.projName')));
		echo Template::instance()->render('postProcessor'.$htm.'.htm');
	}
			
	public function getGnuplotInsContent($f3){
		$projName = $f3->get('PARAMS.projName') . '/';
		
		$simu = 'pics_' . $f3->get('PARAMS.simulation');

		$path = 'data/public/' . $projName . $simu;
		$this->echoJson(file_get_contents( $path . '/' . $f3->get('PARAMS.insFileName')));
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
			));
		}
		$this->echoJson($processedResult);
	}
	
	public function loadProj($f3){
		$result = $this->proj->getById('username', $f3->get('SESSION.user'));
		$processedResult = array();
		
		foreach($result as $rec){
			array_push($processedResult, array('value'=>$rec['name'], 'name'=>str_replace('-', ' ', $rec['name'])));
		}
		$this->echoJson($processedResult);
	}
	
	public function save($f3){
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$this->echoJson(array('warning','Your session has expired! Please go to "Account" -> "Activate Session" to activate your session again!'));
		}
		$postData = json_decode($f3->get('BODY'),true);
		//var_dump($postData);
		//$parameterData = $postData['spoly']['param'];
		//$simulationData = $postData['spoly']['sim'];
		$projectName = Web::instance()->slug($postData['proj']);
		$solverType = $postData['solverType'];
		$solverVal = $postData['solverVal'];
		$gui = $postData['gui'];
		
		//SAVE EVERYTHING INTO DB
		$this->saveToProject($f3, $projectName, $solverType, $solverVal, $gui);
		
		//$propArray = $this->getPropertyArray($f3);
		//$consArray = $this->getConstraintArray($f3);
		$ctrlMap = $f3->get('CONFIG_SOLVER');
		$solver = new $ctrlMap[$solverType]($f3);
		$solver->generateInputData($postData);
		$solver->saveInputData();
		$this->echoJson(array('success','The project "'.str_replace('-', ' ', $projectName).'" has been saved!'));
	}
	
	//private function saveToProject($f3, $name, $param, $sim, $nodesArray, $elementsArray, $particleArray){
	private function saveToProject($f3, $name, $solverType, $solverVal, $gui){
		$this->proj->getById('name', $name);
		
		$f3->set('POST.solverType', json_encode($solverType));
		$f3->set('POST.solverVal', json_encode($solverVal));
		$f3->set('POST.gui', json_encode($gui));
		
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