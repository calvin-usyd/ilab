<?php
include('Net/SFTP.php');
include('Net/SCP.php');
include('Crypt/RSA.php');

class PrepsController {
	var $projName;
	var $solverPath = "data";

	function __construct($f3) {
		$db_option = $f3->get('db_option');
		$this->db=new DB\SQL(
			$f3->get($db_option . '_db_dns') . $f3->get($db_option . '_db_name'),
			$f3->get($db_option . '_db_user'),
			$f3->get($db_option . '_db_pass')
		);
		$this->users = new users($this->db);
		$this->prop = new prop($this->db);
		$this->cons = new constraint($this->db);
		$this->image = new images($this->db);
		$this->proj = new project($this->db);

		$this->useExternalServer = $f3->get('useExternalServer') == 1 ? true : false;
		$this->externalServerDataPath = $f3->get('externalServerDataPath');
		$this->dataPath = $f3->get('dataPath');
		$this->appPath = $f3->get('appPath')=='/'?'':$f3->get('appPath');
		$this->serverPath = $f3->get('serverPath');
		$this->user = $f3->get('SESSION.user');
		if ($this->useExternalServer){
			$this->ssh = $this->getSsh($f3);
		}
		$this->solverCtrlArr = array(
			'SPOLY'=>'PrepsSolverSpolyController',
			'CONFEM'=>'PrepsSolverConfemController',
			'PATRUS'=>'PrepsSolverPatrusController'
		);
		
		$this->newLine = "\n";
		$this->separator = " ";
		$this->labelSeparator = "  ##";
        $f3->set('year', date('Y'));
	}
	
	function afterroute($f3) {
		//echo Template::instance()->render('template.htm');
		echo Template::instance()->render('/layout.htm');
    }
	
	function genLongId(){
		return substr(hash('sha512',mt_rand()),0,12);
	}
	
	function startsWith($haystack, $needle) {
		// search backwards starting from haystack length characters from the end
		return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
	}
	
	function deleteDirectory($f3, $dir) {
		if ($this->useExternalServer){
			//$ssh = $this->getSsh($f3);
			echo $this->ssh->exec("rm -R $dir");
			return true;
			
		}else{
			if (!file_exists($dir)) {
				return true;
			}

			if (!is_dir($dir)) {
				return unlink($dir);
			}

			foreach (scandir($dir) as $item) {
				if ($item == '.' || $item == '..') {
					continue;
				}

				if (!$this->deleteDirectory($f3, $dir . DIRECTORY_SEPARATOR . $item)) {
					return false;
				}
			}

			return rmdir($dir);			
		}
	}
	public function processUpload(){
		
		$overwrite = true; // set to true, to overwrite an existing file; Default: false
		$slug = true; // rename file to filesystem-friendly version

		$a = Web::instance()->receive(function($file,$formFieldName){
			/* looks like:
			  array(5) {
				  ["name"] =>     string(19) "csshat_quittung.png"
				  ["type"] =>     string(9) "image/png"
				  ["tmp_name"] => string(14) "/tmp/php2YS85Q"
				  ["error"] =>    int(0)
				  ["size"] =>     int(172245)
				}
			*/
			
			// $file['name'] already contains the slugged name now
			// maybe you want to check the file size
			if($file['size'] > (2 * 1024 * 1024)) // if bigger than 2 MB
				return false; // this file is not valid, return false will skip moving it

			// everything went fine, hurray!
			return true; // allows the file to be moved from php tmp dir to your defined upload dir
			},
			$overwrite,
			$slug
		);
		
		$name = array_keys($a);
		//var_dump($name);
		//$name = pathinfo($name['0'], PATHINFO_BASENAME);
		return $name['0'];
		//return $name;
	}
	
	function getSsh($f3, $isSftp = false){
		$loggedIn = false;
		$serverType = $f3->get('externalServerType');
		$ipAdd = $f3->get($serverType . '_IP');
		$pass = $f3->get($serverType . '_PASS');
		$sName = $f3->get($serverType . '_sName');
		
		if ($isSftp){
			$ssh = new Net_SFTP($ipAdd);
		}else{
			$ssh = new Net_SSH2($ipAdd);
		}
		if ($f3->get($serverType . '_useKey')){
			$rsa = new Crypt_RSA();
			$rsa->setPassword($pass);
			$rsa->loadKey(file_get_contents($f3->get($this->appPath . $serverType . '_pKey')));
			$loggedIn = $ssh->login($f3->get($serverType . '_USER'), $rsa);
			
		}else{
			$loggedIn = $ssh->login($f3->get($serverType . '_USER'), $pass);
		}
		if (!$loggedIn) {
			$this->echoJson(array('Danger', 'Login Failed at external server: ' . $sName));
		}
		return $ssh;
	}
	
	function generateFile($filename, $data, $projectName){
		$path = $this->getUserDataPath() . Web::instance()->slug($projectName) . '/';
		
		if (!file_exists($path)) {
			mkdir($path, 0755, true);
		}
		file_put_contents($path.$filename, $data);
	}
	
	function getUserDataPath(){
		if ($this->user == ''){
			//return -1;
			$this->echoJson(array('Danger', 'Session Expired!'));
		}
		$path = $this->dataPath;
		
		if ($this->useExternalServer){
			$path = $this->externalServerDataPath;
		}
		return $path . '/' . $this->user . '/';
	}
	
	function getProjPathFrParam($f3){
		return $this->getUserDataPath() . strtolower($f3->get('PARAMS.projName')) . '/';
	}
	
	public function getOutputContent($f3, $file){
		$projPath = $this->getProjPathFrParam($f3);
		if ($projPath == -1){
			return -1;//'Session expired!';
		}
		if ($this->useExternalServer){
			//define('NET_SFTP_LOGGING', NET_SFTP_LOG_COMPLEX);
			$ssh = $this->getSsh($f3, true);
			return $ssh->get($projPath . $file) . '-';
			//echo $ssh->getSFTPLog();
		}
		if (file_exists($projPath . $file)){
			return file_get_contents($projPath . $file);
		}else{
			return array('Danger', 'File not found!');
		}
	}
	
	function echoJson($arr){
		echo json_encode($arr);exit();
	}
}