<?php
class PrepsConstraintController extends PrepsController
{	
	function afterroute($f3) { 
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
    }
 
	public function listCons($f3){
		$cons = $this->cons->getById('username', $f3->get('SESSION.user'));
		
		function getAllConstraint($cons){
			return array("consLongId"=>$cons['consLongId'], "type"=>$cons['elementType'], "cons"=>$cons['cons']);
		}
		
		$consMaps = array_map("getAllConstraint", $cons);
		//var_dump($cons);
		//var_dump($consMaps);
		echo json_encode(array('constraintMaps'=>$consMaps));
		
		die();
	}
	
	public function editCons($f3){
		$postData = json_decode($f3->get('BODY'),true);
		
		foreach($postData as $data){
			if (!empty($postData['consLongId'])){
				$this->set('consLongId', $postData['consLongId']);
				$this->set('cons', $postData['cons']);
				$this->cons->reset();
				$this->cons->edit($postData['consLongId']);
			}
		}
		$msg = array('success','Data successfully updated!');
		
		echo json_encode($msg);
		die();
	}
	
	/*
	{
	"node":{"cons":{"ym":"1000"}},
	"particle":{"cons":{"el":"1000"}}
	}
	*/
	public function saveCons($f3){
		$postData = json_decode($f3->get('BODY'),true);
		//var_dump( $f3->get('POST'));
		foreach($postData as $key => $val){			
			if (!empty($val)){
				$f3->set('POST.consLongId', $this->genLongId());
				$f3->set('POST.elementType', $key);
				$f3->set('POST.cons', json_encode($val));
				$f3->set('POST.username', $f3->get('SESSION.user'));
				$this->cons->add();
				$this->cons->reset();
			}
		}
		
		$this->listCons($f3);
		
		echo json_encode(array('success','Data successfully saved!'));
		
		die();
	}
	/*
	{
	 {"consLongId":"1", "type":"node", "cons":{"x":"1000","y":"12"}},		-->EDIT	(IF ID IN DB)
	 {"consLongId":"null", "type":"node", "cons":{"x":"1000","y":"13"}},	-->ADD	(IF ID NOT IN DB)
	 {"consLongId":"3", "type":"particle", "cons":{"vx":"100","vy":"100"}},	-->ADD  (IF ID NOT IN DB)
	 {"consLongId":"4", "type":"", "cons":""}								-->DELETE (IF ID IN DB)
	}
	*/
	public function saveEditConsExcel($f3){
		$postData = json_decode($f3->get('BODY'),true);
		
		foreach($postData as $val){
			$f3->set('POST.elementType', $val['type']);
			$f3->set('POST.cons', json_encode($val['cons']));
			$f3->set('POST.username', $f3->get('SESSION.user'));
			
			$this->cons->getById('consLongId', $val['consLongId']);
			
			if ($this->cons->dry() ){
				$this->cons->add();
				
			}else{
				$f3->set('POST.consLongId', $val['consLongId']);
				
				if ($val['delete']){
					$this->cons->delete('consLongId', $val['consLongId']);
				}else{
					$this->cons->edit('consLongId', $val['consLongId']);
				}
			}
			$this->cons->reset();
		}
		$this->listCons($f3);
	}
}	