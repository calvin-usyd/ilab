<?php
//require_once "PasswordHash.php";

class PrepsFrontPageController extends PrepsController{
	
	function index($f3){
		$f3->set('inc', 'login.htm');
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