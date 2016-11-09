<?php
require 'SendEmailController.php';

class ForgotPasswordController extends PrepsController{
	
	/*
	GET /resetPassword/@id
	POST /resetPassword
		@isPost
		@forgotPass
		@newPassword
		@confirmPassword
	*/
	function resetPassword($f3){
		
		if ($f3->exists('POST.isPost')){
			$forgotPass = $f3->get('POST.forgotPass');
			$newPassword = $f3->get('POST.password');
			$confirmPassword = $f3->get('POST.confirmPassword');
			
			if(preg_match("/$newPassword/", $confirmPassword)){
				$this->users->getbyId('forgotPass', $forgotPass);
				
				if ($this->users->email != ''){
					$this->users->copyTo('POST');
					
					$crypt = \Bcrypt::instance();
					
					$f3->set('POST.password', $crypt->hash($newPassword));
					
					$f3->set('POST.forgotPass', null);
					
					$this->users->edit('forgotPass', $forgotPass);
					
					$f3->set('message', 'You have successfully set new password, please login using new password.');
					
				}else{
					$f3->set('err_message', 'Invalid forgot Password Id');
				}
			}else{
				$f3->set('err_message', 'Your confirm password is different');
			}
			
		}else{
			$forgotPass = $f3->get('PARAMS.id');
		}
		
		$f3->set('forgotPass', $forgotPass);
		
			
		$f3->set('inc', 'z_resetPassword.htm');
	}
	
	/*
	GET /forgotPassword
	POST /forgotPassword
		@isPost
		@email
	*/
	function processForgot($f3){
		
		if ($f3->exists('POST.isPost')){
			$email = $f3->get('POST.email');
			
			//$this->users->getbyId('email', $email);
			$this->users->getbyArray(array('email=?', $email));
			
			
			if ($this->users->email != ''){
				$forgotPassId = substr(hash('sha512',rand()),0,12);
				
				$this->users->copyTo('POST');
				
				$f3->set('POST.forgotPass', $forgotPassId);
				
				$this->users->editByArray(array('email=?', $email));
				
				$this->emailResetLink($f3->get('CONFIG_qMAPI'), $email, $forgotPassId);
				
				$f3->set('message', 'Please check your email!');
				
			}else{
				$f3->set('err_message', 'Invalid email!');
			}
		}
		
		$f3->set('inc', 'z_forgotPassword.htm');
		
	}
	
	private function emailResetLink($qMAPI, $toEmail, $forgotPass)
	{
		//$url = "//$_SERVER[HTTP_HOST]?id=$forgotPass";
		$url = "http://$_SERVER[HTTP_HOST]/resetPassword/$forgotPass";
		$to = $toEmail;
		$frN = 'Quantumfi Bot';
		$fr = 'no-reply@quantumfi.com.au';
		$sbj = 'Re: SET Dev forgot password';
		$msg = 'Dear user, <br/><br/>Please click the link below to reset your password: </br><a href="'.$url.'">'.$url.'</a><br/><br/>This is an auto-generated email. Please don\'t reply to this email.<br/><br/>Sincerely,<br/>SET Dev team<br/><br/>';
		
		$cnt_array = array('fr'=>$fr, 'to'=>$to, 'subject'=>$sbj, 'message'=>$msg, 'frName'=>$frN);
		$cnt_json = json_encode($cnt_array);
		
		$email = new SendEmailController();
		$email->post_json($qMAPI, $cnt_json);
		//$this->post_json($qMAPI, $cnt_json);
	}
}