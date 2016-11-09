<?php
class main extends DB\SQL\Mapper {
 
    public function all() {
        $this->load();
        return $this->query;
    }
 
    public function add() {
        $this->copyFrom('POST');
        $this->save();
    }
 
	public function getById($idCol, $id) {
        $this->load(array($idCol.'=?',$id));
		return $this->query;
    }
	
	public function getByArray($arrayPost) {
        $this->load($arrayPost);
		return $this->query;
    }
	
	public function getByArrayPage($arrayPost, $arrayPaginate) {
		$this->load($arrayPost, $arrayPaginate);
		return $this->query;
	}
	
    public function edit($idCol, $id) {
        $this->editByArray(array($idCol.'=?',$id));
    }
 
    public function editByArray($queryArray) {
        $this->load($queryArray);
        $this->copyFrom('POST');
        $this->update();
    }
 
    public function delete($idCol, $id) {
        $this->deleteByArray(array($idCol.'=?',$id));
    }
	
    public function deleteByArray($queryArray) {
        $this->load($queryArray);
        $this->erase();
    }
}