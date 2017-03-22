<?php
class PrepsSolverConfemController extends PrepsController{
	private $contentStr;
	private $solverName = "CONFEM.exe";
	
	function generateInputData($postData, $propArray, $consArray){		
		$contentStr = $this->genTitle(Web::instance()->slug($postData['proj']));
		$solver = $postData['solverVal'];
		$gui = $postData['gui'];
		//var_dump($solver);
		$contentStr = $contentStr . $this->genAnalysisType($solver['analysis']);
		$contentStr = $contentStr . $this->genGeometry($gui['geometry']);
		$contentStr = $contentStr . $this->genMaterialProperties($gui['mp']);
		$contentStr = $contentStr . $this->genBoundaryConditions($gui['boundary']);
		$contentStr = $contentStr . $this->genTime($solver['time']);
		$contentStr = $contentStr . $this->genMeshing($gui['mesh']);
		$contentStr = $contentStr . $this->genControls($solver['controls']);
		$this->contentStr = $contentStr;
		$this->projName = Web::instance()->slug($postData['proj']);
	}
	
	function saveInputData($useExternalServer, $user, $ssh){		
		$fn = "input.spa";
		$projPath = $this->solverPath . '/'. $user . '/'. $this->projName;
		if ($useExternalServer){
			$scp = new Net_SCP($ssh);
			$scp->put($fn, $this->contentStr);
			echo $ssh->exec("mkdir -p $projPath");
			echo $ssh->exec("mv $fn $projPath/.");
		}else{
			$this->generateFile($user, $this->projName . ".spa", $contentStr, $this->projName);
			$this->moveExe($user, $this->projName);		
		}
	}
	
	function solve($useExternalServer, $projName, $user, $ssh){
		$projPath = $this->solverPath . '/'. $user . '/'. $projName . '/';
		if ($useExternalServer){
			echo $ssh->exec("./$this->solverPath/$this->solverName $projPath");
		}
	}
	
	function moveExe($user, $projectName){
		$pNameSlug = Web::instance()->slug($projectName);
		$userPath = 'data/'.$user;
		$nam = $userPath . '/confem3d.nam';	
		$solver = $userPath . '/CONFEM.exe';
		if (!file_exists($solver)) {
			copy('data/CONFEM.exe', $solver);
		}
		
		$namData = $pNameSlug . $this->newLine . $userPath . '/' . $pNameSlug;
		file_put_contents($nam, $namData);
	}
	
	private function genTitle($data){
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'TITLE';
		$dataStr = $dataStr . $newline . $this->genCommentStar(1);
		$dataStr = 'TITLE ' . $data;
		
		return $dataStr;
	}
	
	private function genAnalysisType($data){
		$analysisCodeVal = array(
			'111'=>'STEADY_STATE_SEEPAGE_EQUATION',
			'121'=>'TRANSIENT_SEEPAGE_EQUATION',
			'211'=>'STEADY_DIFFUSION_ADVECTION_EQUATION',
			'221'=>'TRANSIENT_DIFFUSION_ADVECTION_EQUATION',
			'311'=>'COUPLED_ALL_STEADY_SEEPAGE_DIFFUSION_ADVECTION_EQUATION',
			'321'=>'COUPLED_ALL_TRANSIENT_SEEPAGE_DIFFUSION_ADVECTION_EQUATION',
			'331'=>'COUPLED_SEEPAGE_DIFFUSION_ADVECTION_EQUATION',
			'112'=>'SREADY_STATE_RICHARDS_EQUATION',
			'122'=>'TRANSIENT_RICHARDS_EQUATION',
			'212'=>'STEADY_STATE_UNSATURATED_DIFFUSION_ADVECTION_EQUATION',
			'222'=>'TRANSIENT_UNSATURATED_DIFFUSION_ADVECTION_EQUATION',
			'312'=>'COUPLED_ALL_STEADY_RICHARD_DIFFUSION_ADVECTION_EQUATION',
			'322'=>'COUPLED_ALL_TRANSIENT_RICHARD_DIFFUSION_ADVECTION_EQUATION',
			'333'=>'COUPLED_RICHARD_DIFFUSION_ADVECTION_EQUATION'
		);
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'ANALYSIS TYPE';
		$dataStr = $dataStr . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $analysisCodeVal[$data];
		return $dataStr;
	}
	/*
	data = {
		'DIMENSION_X':'100',
		'LAYERS':{
			'1':{
				'thickness':'1.0',
				inclinationLeft:'0.0',
				inclinationRight:'0.0'
			},
			'2':{
				...
			}
		}		
	}
	*/
	private function genGeometry($data){
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'GEOMETRY';
		$dataStr = $dataStr . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'Layers';
		$dataStr = $dataStr . $newline . 'DIMENSION_X' . $space . $data['layers']['DIMENSION_X'];
		
		foreach($data['layers']['layerArr'] as $layVal){
			if (!isset($layVal['incLeftHeight'])){
				
			}
			if ($layVal['layer'])
				$dataStr = $dataStr . $newline . "LAYER" . $space . $layVal['layer'] . $space . $layVal['thickness'] . $space . $layVal['incLeftHeight']/$layVal['incLeftWidth'] . $space . $layVal['incRightHeight']/$layVal['incRightWidth'];
				//$dataStr = $dataStr . $newline . "LAYER" . $space . $layVal['layer'] . $space . $layVal['thickness'] . $space . $layVal['incLeftHeight']/$layVal['incLeftWidth'] . $space . $layVal['incRightHeight']/$layVal['incRightWidth'];
		}
		
		$dataStr = $dataStr . $newline . $newline . $this->genCommentStar(1) . $space . 'Leaks';
		foreach($data['leaks'] as $leakInd => $leakVal){
			$dataStr = $dataStr . $newline . $leakInd . $space . $leakVal;
		}
		
		$dataStr = $dataStr . $newline . $newline . $this->genCommentStar(1) . $space . 'Inclinations';
		foreach($data['inclinations'] as $incInd => $incVal){
			$dataStr = $dataStr . $newline . $incInd . $space . $incVal;
		}
		
		return $dataStr;
	}
	/*
	data : {
		MPSet:{
			[MPSET_MOLECULAR_DIFFUSION: '1 0.01',
			...
			MPSET_TRANSIENT_SORPTION_RATE: '1 0.2'],
			[MPSET_MOLECULAR_DIFFUSION: '1 0.01',
			...
			MPSET_TRANSIENT_SORPTION_RATE: '1 0.2'],
		},
		MPLayer:{
			1:'2',
			2:'2'
		}
	}
	*/
	private function genMaterialProperties($data){
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'MATERIAL PROPERTIES';
		$dataStr = $dataStr . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'Physical constants';
		$dataStr = $dataStr . $newline . 'WATER_DENSITY' . $space . '1000';
		$dataStr = $dataStr . $newline . 'GRAVITATIONAL_ACCELERATION' . $space . '9.756E+15';
		
		foreach($data['MPSet'] as $MPInd => $MPSetVal){
			$dataStr = $dataStr . $newline ;
			$mpId = $MPSetVal['mpId'];
			foreach($MPSetVal as $MPKey => $MPVal){
				if ($MPKey == 'name'){
					$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . $MPVal;
				}
				if ($MPKey != 'propLongId' && $MPKey != 'type' && $MPKey != 'name' && $MPKey != 'mpId' && $MPKey != 'delete' && !empty($MPVal)){
					$dataStr = $dataStr . $newline . 'MPSET_'.$MPKey . $space . $mpId . $space . $MPVal;
				}
			}
		}
		
		$dataStr = $dataStr . $newline . $newline . $this->genCommentStar(1) . $space . 'Material Property Set Numbers';
		
		foreach($data['MPLayer'] as $MPLayerVal){
			if ($MPLayerVal['layer']){
				$commandStr = ($MPLayerVal['type'] == 'LEAK') ? '_'.$MPLayerVal['type'] : '';
				
				$dataStr = $dataStr . $newline . 'LAYER'.$commandStr.'_TAKES_MATERIAL_PROPERTIES_SET' . $space . $MPLayerVal['layer'] . $space . $MPLayerVal['prop'];
			}
		}
		
		return $dataStr;
	}
	
	/*
	data : {
		'SPECIFIED_TOTAL_HEAD_AT_TOP_ALL_SURFACE': '1 2',
		...
	}
	*/
	private function genBoundaryConditions($data){
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'BOUNDARY CONDITIONS';
		$dataStr = $dataStr . $newline . $this->genCommentStar(1);
		$boundAll = $data['boundAll'];
		//$totalHeadStr = 'SPECIFIED_TOTAL_HEAD_AT_TOP_ALL_SURFACE';
		//$darcyStr = 'SPECIFIED_DARCY_VELOCITY_AT_BOTTOM_ALL_SURFACE';
		//$concentrationStr = 'SPECIFIED_CONCENTRATION_AT_TOP_ALL_SURFACE';
		//$fluxStr = 'SPECIFIED_MASS_FLUX_AT_BOTTOM_ALL_SURFACE';
		
		foreach($boundAll as $bc){
			$dataStr = $dataStr . $newline . $bc['cmd'] . $space . $bc['val'];
		}
		/*if (isset($boundAll[$totalHeadStr]) && $boundAll[$totalHeadStr] != ' '){
			$dataStr = $dataStr . $newline . $totalHeadStr . $space . $boundAll[$totalHeadStr];			
		}
		if (isset($boundAll[$darcyStr]) && $boundAll[$darcyStr] != ' '){
			$dataStr = $dataStr . $newline . $darcyStr . $space . $boundAll[$darcyStr];			
		}
		if (isset($boundAll[$concentrationStr]) && $boundAll[$concentrationStr] != ' '){
			$dataStr = $dataStr . $newline . $concentrationStr . $space . $boundAll[$concentrationStr];			
		}
		if (isset($boundAll[$fluxStr]) && $boundAll[$fluxStr] != ' '){
			$dataStr = $dataStr . $newline . $fluxStr . $space . $boundAll[$fluxStr];			
		}*/
		foreach($data['boundArr'] as $val){
			if (!empty($val['layer'])){
				$dataStr = $dataStr . $newline . 'SPECIFIED_'.$val['rightBCType'].'_ON_RIGHT_X_EDGE' . $space . $val['layer'] . $space . $val['rightBCValue'] . $space . $val['rightBCValue'];
				$dataStr = $dataStr . $newline . 'SPECIFIED_'.$val['leftBCType'].'_ON_LEFT_X_EDGE' . $space . $val['layer'] . $space . $val['leftBCValue'] . $space . $val['leftBCValue'];
			}
		}
		foreach($data['boundICArr'] as $val){
			if (!empty($val['layer'])){
				$dataStr = $dataStr . $newline . 'INITIAL_'.$val['ICType'].'_IN_LAYER' . $space . $val['layer'] . $space . $val['ICValue'];
			}
		}
		return $dataStr;
	}
	private function genTime($data){
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'TIME';
		$dataStr = $dataStr . $newline . $this->genCommentStar(1);
		
		if (isset($data['specifyTimeStations'])){
			$dataStr = $dataStr . $newline . 'TIME_STATIONS_LIST' . $space . $data['TIME_STATIONS_LIST'];
		}
		if (isset($data['specifyTimeInterval'])){
			$dataStr = $dataStr . $newline . 'TIME_START' . $space . $data['TIME_START'];
			$dataStr = $dataStr . $newline . 'TIME_END' . $space . $data['TIME_END'];
			
			if ($data['timeTypeRadio'] == 'timeStationNumberRadio'){
				$dataStr = $dataStr . $newline . 'TIME_STATIONS_NUMBER' . $space . $data['TIME_STATIONS_NUMBER'];
			}else{
				$dataStr = $dataStr . $newline . 'OUTPUT_FREQUENCY_IN_TIME' . $space . $data['OUTPUT_FREQUENCY_IN_TIME'];
			}
		}
		return $dataStr;
	}
	private function genMeshing($data){
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'MESHING';
		$dataStr = $dataStr . $newline . $this->genCommentStar(1);
		//$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'horizontal subdivisions';
		//$dataStr = $dataStr . $newline . 'MESH_HORIZONTAL' . $space . $data['MESH_HORIZONTAL'];
		//$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'vertical subdivisions';
		
		$meshAll = $data['meshAll'];
		
		if (isset($meshAll['horizontalSubdivision'])){
			$dataStr = $dataStr . $newline . 'MESH_HORIZONTAL' . $space . $meshAll['horizontalSubdivision'];
		}
		if (isset($meshAll['horizontalRatio'])){
			$dataStr = $dataStr . $newline . 'MESH_RATIO_HORIZONTAL' . $space . $meshAll['horizontalRatio'];
		}
		if (isset($meshAll['allLayersSubdivision'])){
			$dataStr = $dataStr . $newline . 'MESH_VERTICAL' . $space . $meshAll['verticalSubdivision'];
			
		}else{
			//foreach($data['MESH_VERTICAL_LAYER'] as $key => $val){
			foreach($data['meshArr'] as $val){
				if ($val['layer'])
					$dataStr = $dataStr . $newline . 'MESH_VERTICAL_LAYER' . $space . $val['layer'] . $space . $val['mSubV'];
			}
			/*foreach($data['meshArr'] as $val){
				if ($val['layer'])
					$dataStr = $dataStr . $newline . 'MESH_HORIZONTAL_LAYER' . $space . $val['layer'] . $space . $val['mSubH'];
			}*/			
		}
		
		$dataStr = $dataStr . $newline . $newline . $this->genCommentStar(1) . $space . 'refinement by skewing';
		//$dataStr = $dataStr . $newline . 'MESH_RATIO_HORIZONTAL' . $space . $data['MESH_RATIO_HORIZONTAL'];
		if (isset($meshAll['allLayersRatio'])){
			$dataStr = $dataStr . $newline . 'MESH_RATIO_VERTICAL' . $space . $meshAll['verticalRatio'];
			//$dataStr = $dataStr . $newline . 'MESH_RATIO_HORIZONTAL' . $space . $meshAll['horizontalRatio'];
			
		}else{
			//foreach($data['MESH_RATIO_VERTICAL'] as $val){
			foreach($data['meshArr'] as $val){
				if ($val['layer'])
					$dataStr = $dataStr . $newline . 'MESH_RATIO_VERTICAL' . $space . $val['layer'] . $space . $val['mRatioV'];
			}
			/*foreach($data['meshArr'] as $val){
				if ($val['layer'])
					$dataStr = $dataStr . $newline . 'MESH_RATIO_HORIZONTAL' . $space . $val['layer'] . $space . $val['mRatioH'];
			}*/
		}
		
		$dataStr = $dataStr . $newline . $newline . $this->genCommentStar(1) . $space . 'element types';
		//foreach($data['ELEMENT_TYPES_BY_LAYER'] as $val){
		foreach($data['meshArr'] as $val){
			if ($val['layer'])
				$dataStr = $dataStr . $newline . 'ELEMENT_TYPES_BY_LAYER' . $space . $val['layer'] . $space . $val['eType'];
		}

		return $dataStr;
	}
	private function genControls($data){
		$space = $this->separator;
		$newline = $this->newLine;
		$dataStr = $newline . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . $this->genCommentStar(1) . $space . 'CONTROLS';
		$dataStr = $dataStr . $newline . $this->genCommentStar(1);
		$dataStr = $dataStr . $newline . 'LAPACK_SOLVER';
		$dataStr = $dataStr . $newline . 'REAL_VALUED_SOLVER_ON';
		$dataStr = $dataStr . $newline . 'PECLET_NUMBER_LIMIT 30.0';
		$dataStr = $dataStr . $newline . 'NON_LINEAR_SORPTION_ITERATION_PARAMETERS 10 0.0001';
				
		return $dataStr;
	}
	private function genCommentStar($totalStar){
		$str = '';
		
		for ($x=0; $x<$totalStar; $x++){
			$str = $str . '*';
		}
		return $str;
	}
}