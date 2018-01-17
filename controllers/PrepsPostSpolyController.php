<?php
class PrepsPostSpolyController extends PrepsController
{
	function afterroute($f3) { 
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
    }
 
	public function getPPPData($f3){
		
		$simu = 'pics_' . $f3->get('PARAMS.simulation') . '/';
		$fileName = $f3->get('PARAMS.filename');
		/*
		$mP = file_get_contents($path . 'mparticlet' . $fileName . '.txt');
		$bP = file_get_contents($path . 'bparticlet' . $fileName . '.txt');
		$cP = file_get_contents($path . 'cparticlet' . $fileName . '.txt');
		$kP = file_get_contents($path . 'kparticlet' . $fileName . '.txt');
		*/
		$mP = $this->getOutputContent($f3, $simu . 'mparticlet' . $fileName . '.txt');
		$bP = $this->getOutputContent($f3, $simu . 'bparticlet' . $fileName . '.txt');
		$cP = $this->getOutputContent($f3, $simu . 'cparticlet' . $fileName . '.txt');
		$kP = $this->getOutputContent($f3, $simu . 'kparticlet' . $fileName . '.txt');
		$this->echoJson(array('mP'=>$mP, 'bP'=>$bP, 'cP'=>$cP, 'kP'=>$kP));
	}
	
	public function getPPPFilesName($f3){
		//$user = $f3->get('SESSION.user');
		//$projName = $f3->get('PARAMS.projName') . '/';
		//$path = 'data/'.$user.'/' . $projName . $simu;
		$simu = 'pics_' . $f3->get('PARAMS.simulation');
		$projPath = $this->getProjPathFrParam($f3);
		$path = $projPath . $simu;
		
		if ($projPath == -1){
			$this->echoJson(array('Danger', 'Session Expired!'));
		}
		
		if ($f3->get('useExternalServer')){
			//define('NET_SFTP_LOGGING', NET_SFTP_LOG_COMPLEX);
			$ssh = $this->getSsh($f3, true);
			$f = $ssh->exec('ls ' . $path);
			$f = explode(PHP_EOL, $f);
			//echo $ssh->getSFTPLog();
		}else{
			$f = $this->getFileArray($path, 'txt', false);
		}
		$filesN = [];
		$fn = '';
		
		foreach($f as $path){
			$fn = basename($path, '.txt');
			
			if ($this->startsWith($fn, 'cparticle')){
				array_push($filesN, explode('t', str_replace('cparticle', '', $fn))[1]);
			}
		}
		sort($filesN);
		$this->echoJson($filesN);
	}
	
	public function pppExport($f3){
		$user = $f3->get('SESSION.user');
		
		$snapshotFile = 'cparticlet' . $f3->get('POST.snapshotFile') . '.txt';
		
		$newProjName = $f3->get('POST.newProjName') . '/';
		$oldProjName = $f3->get('POST.oldProjName') . '/';
		
		$oldSimulation = 'pics_' . $f3->get('POST.oldSimulation') . '/';
		
		$newPath = 'data/'.$user.'/'.$newProjName.'/';
		
		if (!file_exists($newPath)) {
			mkdir($newPath, 0755, true);
					
			$fn = array(
				'particle'=>'particles.txt',
				'tags'=>'tags.txt',
				'param'=>'parameters.txt',
				'projParam'=>'project_parameters.txt');
				
			$this->copyFile($fn['tags'], $oldProjName, $newProjName);
			$this->copyFile($fn['param'], $oldProjName, $newProjName);
			$this->copyFile($fn['projParam'], $oldProjName, $newProjName);
			
			$this->copyFile($snapshotFile, $oldProjName . $oldSimulation, $newProjName);
			
			$oldSnapshotFile = 'data/'.$user.'/' . $newProjName . $snapshotFile;
			$newSnapshotFile = 'data/'.$user.'/' . $newProjName . $fn['particle'];
			rename($oldSnapshotFile, $newSnapshotFile);
			
			$msg = array('success', 'New project created successfully!');
		
		}else{
			//throw Exception('Error: Project already exist! Please create new project using different name.');
			$msg = array('fail', 'Project already exist! Please create new project using different name.');
		}
		$this->echoJson($msg);
	}
	
	private function copyFile($filename, $oldProject, $newProject){
		$user = $f3->get('SESSION.user');
		$oldPath = 'data/'.$user.'/'.$oldProject.'/';
		$newPath = 'data/'.$user.'/'.$newProject.'/';
		
		copy($oldPath.$filename, $newPath.$filename);
	}
	
	private function getFileArray($imgPath, $fileType, $includeBeginingSlash){
		$f = array();
		
		if (is_dir($imgPath . '/')){
			$dh  = opendir($imgPath);
			
			while (false !== ($filename = readdir($dh))) {
				if ($includeBeginingSlash){
					$files[] = '/' . $imgPath . '/' . $filename;
					
				}else{
					$files[] = $imgPath . '/' . $filename;
				}
			}
			$f = preg_grep('/\.'.$fileType.'$/i', $files);
		}
		return $f;
	}
	
}	