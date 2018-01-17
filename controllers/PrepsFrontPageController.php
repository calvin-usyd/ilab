<?php
//require_once "PasswordHash.php";

class PrepsFrontPageController extends PrepsController{
	function index($f3){
		if ($f3->exists('SESSION.user') || $f3->get('SESSION.user') != ''){
			$f3->reroute('/workspace');
		}else{
			$f3->set('inc', 'login.htm');
		}
		$privatekey ='';
		/*WORKING - START
		*/
		/*$rsa = new Crypt_RSA();
		$rsa->setPassword('fernandoilab2020');
		$rsa->loadKey($privatekey);

		$ssh = new Net_SSH2('115.146.94.238');
		if (!$ssh->login('calvin', $rsa)) {
			exit('Login Failed');
		}*/
		//WORKING - END

		/*echo $ssh->read('/.*@.*[$|#]/', NET_SSH2_READ_REGEX);
		$ssh->write("sudo -i\n");
		echo $ssh->read('[prompt]');*/
		//$ssh->setTimeout(1);
		//$output = $ssh->read('/.*@.*[$|#]|.*[pP]assword.*/', NET_SSH2_READ_REGEX);
		//if (preg_match('/.*[pP]assword.*/', $output)) {
			//$ssh->write("C@lvin85\n");
			//echo $ssh->read('/.*@.*[$|#]/', NET_SSH2_READ_REGEX);
		//}
		//$ssh->write("/var/www/html/ilab/data/template.exe /var/www/html/ilab/data/calvin/spoly\n");
		//echo $ssh->exec('/var/www/html/ilab/data/template.exe /var/www/html/ilab/data/calvin/spoly');
		//echo $ssh->exec('cd ../; pwd');
		//echo $ssh->exec('cd /var/www/html/ilab/data; pwd; ./template.exe calvin/spoly');
		//echo $ssh->exec('pwd');
		//echo $ssh->exec('cd solver');
		//echo $ssh->exec('ls');
		//echo $ssh->exec('pwd');
		
		//WORKING : //echo $ssh->exec('solver/template.exe solver/calvin/spoly');
		
		//echo $ssh->exec('./template.exe calvin/spoly');
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

	private function validateLogin($f3){
		if ($f3->exists('POST.cred') && $f3->exists('POST.password')){
			$cred = $f3->get('POST.cred');
			
			$result = $this->users->getByArray(array('username=? or email=?', $cred, $cred));
			$validPass = 0;
			
			if (count($result) > 0){
				$crypt = \Bcrypt::instance();
				$validPass = $crypt->verify($f3->get('POST.password'), $result[0]['password']);			
			}
			
			if ($validPass){
				$f3->set('SESSION.user', $result[0]['username']);
				
				return true;
				
			}else{
				$f3->set('err_message', 'Invalid access credential. please try again!');
			}
		}
		return false;
		
	}
	
	function activateSession($f3){
		if ($this->validateLogin($f3)){
			$msg = array('success', 'Session activated successfully!');
		}else{
			$msg = array('fail', $f3->get('err_messaage'));
		}
		echo json_encode($msg);
		die();
	}
	
	function login($f3){
		if ($this->validateLogin($f3)){
			$f3->reroute('/workspace');
		}
		$f3->set('inc', 'login.htm');
	}
	
	function logout($f3){
		$f3->clear('SESSION');
		$f3->clear('COOKIE');
		
		$f3->set('SESSION.user',null);
		
		$f3->reroute('/');
	}
	
	function register($f3){
		if ($f3->exists('POST.username') && 
			$f3->exists('POST.email') && 
			$f3->exists('POST.password')
		){
			$result = $this->users->getByArray(array('username=? or email=?', $f3->get('POST.username'), $f3->get('POST.email')));
			
			if (count($result) > 0){
				$f3->set('err_message', 'Your username or email has been taken, please try again.');
				
			}else{
				$crypt = \Bcrypt::instance();
				
				$f3->set('POST.password', $crypt->hash($f3->get('POST.password')));
				
				$this->users->add();

				$f3->set('SESSION.user', $f3->get('POST.username'));
				
				$f3->reroute('/workspace');
			}
		}
		
		$f3->set('inc', 'register.htm');
	}
}