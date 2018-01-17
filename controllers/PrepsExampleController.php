<?php
//require_once "PasswordHash.php";

class PrepsExampleController extends PrepsController{
	function afterroute($f3) {}
	//Generate Result using Gnuplot JS (Runs in client)
	public function result($f3){
		$f3->set('SESSION.user', 'example');
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
}