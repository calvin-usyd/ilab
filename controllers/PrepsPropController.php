<?php
class PrepsPropController extends PrepsController
{	
	function afterroute($f3) { 
		if (!$f3->exists('SESSION.user') || $f3->get('SESSION.user') == ''){
			$f3->reroute('/login');
		}
    }
 
	public function listProp($f3){
		//$prop = $this->prop->all();
		$prop = $this->prop->getById('username', $f3->get('SESSION.user'));
		
		function getAllProperties($prop){
			return array("propLongId"=>$prop['propLongId'], "type"=>$prop['elementType'], "prop"=>$prop['properties']);
		}
		
		$propMaps = array_map("getAllProperties", $prop);
		//var_dump($prop);
		//var_dump($propMaps);
		echo json_encode(array('propMaps'=>$propMaps));
		
		die();
	}
	
	public function editProp($f3){
		$postData = json_decode($f3->get('BODY'),true);
		
		foreach($postData as $data){
			if (!empty($postData['propLongId'])){
				$this->set('propLongId', $postData['propLongId']);
				$this->set('properties', $postData['prop']);
				$this->prop->reset();
				$this->prop->edit($postData['propLongId']);
			}
		}
		$msg = array('success','Data successfully updated!');
		
		echo json_encode($msg);
		die();
	}
	
	/*
	{
	"fe":{"property":{"ym":"1000"}},
	"de":{"property":{"el":"1000"}}
	}
	*/
	public function saveProp($f3){
		$postData = json_decode($f3->get('BODY'),true);
		//var_dump( $postData);
		foreach($postData as $key => $val){			
			if (!empty($val)){
				$f3->set('POST.propLongId', $this->genLongId());
				$f3->set('POST.elementType', $key);
				$f3->set('POST.properties', json_encode($val));
				$f3->set('POST.username', $f3->get('SESSION.user'));
				$this->prop->add();
				$this->prop->reset();
			}
		}
		
		$this->listProp($f3);
		
		echo json_encode(array('success','Data successfully saved!'));
		
		die();
	}
	/*
	{
	 {"propLongId":"1", "type":"beam", "property":{"ym":"1000","type":"truss"}},		-->EDIT	(IF propLongId IN DB)
	 {"propLongId":"null", "type":"plate", "property":{"ym":"1000","type":"stress"}},	-->ADD	(IF propLongId NOT IN DB)
	 {"propLongId":"3", "type":"spoly", "property":{"ncs":"100","density":"100"}},		-->ADD  (IF propLongId NOT IN DB)
	 {"propLongId":"4", "type":"", "property":""}										-->DELETE (IF propLongId IN DB)
	}
	*/
	public function saveEditPropExcel($f3){
		$postData = json_decode($f3->get('BODY'),true);
		
		foreach($postData as $val){
			$f3->set('POST.elementType', $val['type']);
			$f3->set('POST.properties', json_encode($val['property']));
			$f3->set('POST.username', $f3->get('SESSION.user'));
			
			$this->prop->getById('propLongId', $val['propLongId']);
			
			if ($this->prop->dry() && !empty($val['type'])){
				$this->prop->add();
				
			}else{
				$f3->set('POST.propLongId', $val['propLongId']);
				
				if ($val['delete']){
					$this->prop->delete('propLongId', $val['propLongId']);
				}else{
					$this->prop->edit('propLongId', $val['propLongId']);
				}
			}
			$this->prop->reset();
		}
		$this->listProp($f3);
	}
}	