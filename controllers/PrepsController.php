<?php
class PrepsController {
	function __construct($f3) {
		$this->db=new DB\SQL(
			$f3->get('db_dns') . $f3->get('db_name'),
			$f3->get('db_user'),
			$f3->get('db_pass')
		);
		
		$this->fn = array(
			'particle'=>'particles.txt',
			'tags'=>'tags.txt',
			'param'=>'parameters.txt',
			'projParam'=>'project_parameters.txt');
			
		$this->users = new users($this->db);
		$this->prop = new prop($this->db);
		$this->cons = new constraint($this->db);
		$this->image = new images($this->db);
		$this->proj = new project($this->db);
        $f3->set('year', date('Y'));
		
		$this->filesName = array('particles.txt','tags.txt','parameters.txt','project_parameters.txt');
		$this->particles = array();
		$this->tags = array(
			"mark"	=>0,	"radius"=>0,
			"vx"	=>0,	"vy"	=>0,	"vphi"		=>0,
			"vxTag"	=>0,	"vyTag"	=>0,	"vphiTag"	=>0,
			"fx"	=>0,	"fy"	=>0,	"fphi"		=>0,
			"fxTag"	=>0,	"fyTag"	=>0,	"fphiTag"	=>0
			);
		$this->project_parameters = array(
			"pName"=>"MyProj-1",
			"method"=>"",
			"dLen"=>0,
			"lLimit"=>0,
			"rLimit"=>0,
			"bLimit"=>0,
			"tLimit"=>0,
			"fps"=>0,
			"dps"=>0,
			"sTime"=>0	);
		$this->parameters = array(
			"ncs"=>"",
			"tcs"=>"",
			"cof"=>"",
			"cor"=>"",
			"ncov"=>"",
			"tcov"=>"",
			"dcov"=>"",
			"grav"=>0,
			"aoiog"=>0,
			"vd"=>0,
			"ts"=>0,
			"dens"=>0,
			"cm"=>0
			);
		//$this->newLine = "\r\n";
		$this->newLine = "\n";
		$this->separator = " ";
		$this->labelSeparator = "  ##";
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
	
	function deleteDirectory($dir) {
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

			if (!$this->deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
				return false;
			}
		}

		return rmdir($dir);
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
}