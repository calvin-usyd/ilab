<?php
class PrepsPostSpolyController extends PrepsController
{	
	function afterroute($f3) { 
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
    }
 
	public function getPPPData($f3){
		$user = $f3->get('SESSION.user');
		$fileName = $f3->get('PARAMS.filename');
		
		$projName = $f3->get('PARAMS.projName') . '/';
		
		$simu = 'pics_' . $f3->get('PARAMS.simulation') . '/';

		$path = 'data/'.$user.'/' . $projName . $simu;
		
		$mP = file_get_contents($path . 'mparticlet' . $fileName . '.txt');
		$bP = file_get_contents($path . 'bparticlet' . $fileName . '.txt');
		$cP = file_get_contents($path . 'cparticlet' . $fileName . '.txt');
		$kP = file_get_contents($path . 'kparticlet' . $fileName . '.txt');
		
		echo json_encode(array('mP'=>$mP, 'bP'=>$bP, 'cP'=>$cP, 'kP'=>$kP));
		
		die();
	}
	
	public function getPPPFilesName($f3){
		$user = $f3->get('SESSION.user');
		$projName = $f3->get('PARAMS.projName') . '/';
		
		$simu = 'pics_' . $f3->get('PARAMS.simulation');

		$path = 'data/'.$user.'/' . $projName . $simu;
		
		$f = $this->getFileArray($path, 'txt', false);
		
		$filesN = [];
		$fn = '';
		
		foreach($f as $path){
			$fn = basename($path, '.txt');
			
			if ($this->startsWith($fn, 'cparticle')){
				;
				array_push($filesN, explode('t', str_replace('cparticle', '', $fn))[1]);
			}
		}
		
		sort($filesN);
		
		echo json_encode($filesN);
		
		die();
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
			
			$this->copyFile($this->fn['tags'], $oldProjName, $newProjName);
			$this->copyFile($this->fn['param'], $oldProjName, $newProjName);
			$this->copyFile($this->fn['projParam'], $oldProjName, $newProjName);
			
			$this->copyFile($snapshotFile, $oldProjName . $oldSimulation, $newProjName);
			
			$oldSnapshotFile = 'data/'.$user.'/' . $newProjName . $snapshotFile;
			$newSnapshotFile = 'data/'.$user.'/' . $newProjName . $this->fn['particle'];
			rename($oldSnapshotFile, $newSnapshotFile);
			
			$msg = array('success', 'New project created successfully!');
		
		}else{
			//throw Exception('Error: Project already exist! Please create new project using different name.');
			$msg = array('fail', 'Project already exist! Please create new project using different name.');
		}
		
		json_encode($msg);
		
		die();
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