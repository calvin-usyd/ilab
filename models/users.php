<?php
class users extends Main {
 
    public function __construct(DB\SQL $db) {
        parent::__construct($db,'preps_users', null); 
    }
}