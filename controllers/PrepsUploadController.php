<?php
class PrepsUploadController extends PrepsController
{	
	function afterroute($f3) { 
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
    }
 
	public function imageList($f3){
		function getAllImages($img){
			return array("id"=>$img['imgLongId'], "url"=>$img['url']);
		}
		
		$maps = array_map("getAllImages",   $this->image->getById('username', $f3->get('SESSION.user'))   );
		//echo $this->db->log();
		echo json_encode($maps);
		
		die();
	}
	
	public function imageUpload($f3){
		$images = $this->image->getById('username', $f3->get('SESSION.user'));
		
		//MAX TOTAL UPLOAD IS VALIDATED
		if (count($images) < $f3->get('imageUploadLimit')){
			$longId = $this->genLongId();
			$user = $f3->get('SESSION.user');
			//$user = 'calvin';
			//var_dump($_FILES);
			$err = $_FILES['fileToUpload']['error'];
			//RENAME FILE
			if ($err == 0){
				$newN = $user .'-'. $longId.'.jpg';
				$_FILES['fileToUpload']['name'] = $newN;
				$f3->set('POST.url', $f3->get('UPLOADS') . $newN);

				//ADD
				$f3->set('POST.imgLongId', $longId);
				$f3->set('POST.username', $user);
				$this->image->reset();//AVOID DATA BEING UPDATED INSTEAD OF ADDED BECAUSE THERE WAS A SELECT PREVIOUSLY
				$this->image->add();
				
				$this->processUpload($f3);
				$this->imageList($f3);
				
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
			
		}else{
			echo json_encode(array('fail', 'Max total upload is '. $f3->get('imageUploadLimit')));
			die();
		}
	}
	
	public function imageDelete($f3){
		$this->image->delete('imgLongId', $f3->get('POST.imgLongId'));
		unlink($f3->get('UPLOADS') . $f3->get('SESSION.user') . '-' . $f3->get('POST.imgLongId').'.jpg');
		$this->imageList($f3);
	}	
}