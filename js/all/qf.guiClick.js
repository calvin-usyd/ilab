"use strict";
$(document).ready(function(){
	var lg = new QF.Logic(),
		lgEditor = new QF.LogicEditor(),
		cm = new QF.Common(),
		qfMode = QF.mode()
	;
	
	function formpostcompleted(json){
		if (json[1])
			alert(json[1]);
	}
	
	//COMMON
	//LOAD ELEMENT PROPERTIES ON SOFTWARE STARTUP
	$.ajax({
		url:QF.setting.serv_propList,
		success:lg.loadPropList
	});

	//LOAD ELEMENT CONSTRAINT ON SOFTWARE STARTUP
	$.ajax({
		url:QF.setting.serv_consList,
		success:lg.loadConsList
	});

	/*$('#propertyNameSearchForm input[name=propertyName]').keyup(function(event){
		var keyVal = cm.inVal('#propertyNameSearchForm', 'propertyName');
		
		var filteredPropName = _.filter(QF.setting.dataPropSpoly, function(v){
			if (typeof v.name  === "undefined"){
				return false;
			}
			
			return v.name.indexOf(keyVal) > -1;
		});
		
		var holder = $('#propertyNameSearchResult').empty();
		_.every(filteredPropName, function(v){
			$('<div>').html(v.name).appendTo(holder);
			return true;
		});
	});*/
	
	function consPropNameKeyup(formId, inputName, dataArray, holderId){
		$(formId + ' input[name='+inputName+']').keyup(function(event){
			var keyVal = cm.inVal(formId, inputName);
			
			var filteredName = _.filter(QF.setting[dataArray], function(v){
				if (typeof v.name  === "undefined"){
					return false;
				}
				
				return v.name.indexOf(keyVal) > -1;
			});
			
			var holder = $(holderId).empty();
			_.every(filteredName, function(v){
				$('<div>').html(v.name).appendTo(holder);
				return true;
			});
		});
	}
	consPropNameKeyup('#spolyPropertyNameSearchForm', 'propertyName',  'dataPropSpoly', '#spolyPropertyNameSearchResult');
	consPropNameKeyup('#spolyConstraintNameSearchForm', 'constraintName', 'dataConsParticle', '#spolyConstraintNameSearchResult');
	consPropNameKeyup('#fePropertyNameSearchForm', 'propertyName', 'dataPropFe', '#fePropertyNameSearchResult');
	consPropNameKeyup('#feConstraintNameSearchForm', 'constraintName', 'dataConsNode', '#feConstraintNameSearchResult');
	
	
	$('#spasConsTab').bind('click', function(){
		if (typeof QF.setting.solverVal.analysis === 'undefined'){
			alert('Please save CONFEM solver information before proceed!');
		}
	});
	
	$('#modalProfileBtn').bind('click', function(){
		var id = '#modalProfile';
		var postData = {
			/*fname:cm.inVal(id, 'fname'),
			mname:cm.inVal(id, 'mname'),
			lname:cm.inVal(id, 'lname'),*/
			username:cm.inVal(id, 'username'),
			email:cm.inVal(id, 'email'),
			changePassword:cm.inVal(id, 'changePassword'),
			currentPassword:cm.inVal(id, 'currentPassword'),
			newPassword:cm.inVal(id, 'newPassword')
		};
		console.log(postData);
		$.post(
			QF.setting.serv_profileEdit,
			postData,
			formpostcompleted,
			"json"
		);
		
	});
	
	$('#modalProfile input[name=changePassword]').bind('click', function(){
		var id = '#modalProfile';
		var oldP = $('#modalProfile input[name=currentPassword]');
		var newP = $('#modalProfile input[name=newPassword]');
		
		if (cm.inCheckVal(id, 'changePassword') == '1'){
			oldP.removeAttr('disabled');
			newP.removeAttr('disabled');
		}else{
			oldP.attr('disabled', '');
			newP.attr('disabled', '');
			
			oldP.val('');
			newP.val('');
		}
	});
	
	$('#modalSessionBtn').bind('click', function(){
		var id = '#modalSession';
		var postData = {
			cred:cm.inVal(id, 'cred'),
			password:cm.inVal(id, 'password')
		};
		
		$.post(
			QF.setting.serv_activateSession,
			postData,
			formpostcompleted,
			"json"
		);
	});
	/*
	$('#modalSelectProjectBtn').bind('click', function(){
		$.ajax({
			url: QF.setting.serv_pData + cm.inSelVal('#modalSelectProject', 'projectName'),
			dataType: 'json',
			success: lg.successLoadProjData
		});
	});*/
	
	$('#modalSaveProjectBtn').bind('click', function(){
		var proccessedNodeObjArray=[];
		//var proccessedElemObjArray=[];
		//var proccessedParticleObjArray=[];
		//var valArray=[];
		var projName=cm.inVal('#modalSaveProject','projectName').trim();
		
		if (projName == '') {
			alert('Project name cannot be empty!');
			return;
		}
		
		$('#htmlTitle').html(projName + ' | iLab');
		$('#projName').attr('data', cm.replaceAll(projName, ' ', '-'));
		
		/*_.forEach(QF.setting.nodeObjArray, function(o){
			proccessedNodeObjArray.push({x:o.x, y:o.y, c:o.constraint});
		});*/
		
		if (QF.setting.solverType == ''){
			alert('Please set and save the solver setting before save this project!');
			return;
		}
		
		var mergedObj = {
			proj: projName,
			solverType: QF.setting.solverType,
			solverVal: QF.setting.solverVal,
			gui: lgProj.getGuiDataBySolverType()
			//nodes: proccessedNodeObjArray,
			//elements: QF.setting.elementIndexArray
		}
		var mergedJson = JSON.stringify(mergedObj);
		//console.log(mergedObj);
		//console.log(mergedJson);
		$.post(
			QF.setting.serv_pSave,
			mergedJson,
			formpostcompleted,
			"json"
		);
	});
	
	function processParticleConsAdd(){
		var hasConEmpty=true,
		id='#particleCons',
		postData = {particle:{
			name:cm.inVal(id,'name','0')
			,vxTag:cm.inCheckVal(id,'vxTag','0')
			,vyTag:cm.inCheckVal(id,'vyTag','0')
			,vphiTag:cm.inCheckVal(id,'vphiTag','0')
			,fxTag:cm.inCheckVal(id,'fxTag','0')
			,fyTag:cm.inCheckVal(id,'fyTag','0')
			,fphiTag:cm.inCheckVal(id,'fphiTag','0')
			,vx:cm.inVal(id,'vx')
			,vy:cm.inVal(id,'vy')
			,vphi:cm.inVal(id,'vphi')
			,fx:cm.inVal(id,'fx')
			,fy:cm.inVal(id,'fy')
			,fphi:cm.inVal(id,'fphi')
		}};
		_.forEach(postData.particle, function(v){
			if (v!=='' && typeof v !== 'undefined'){
				hasConEmpty = false;
			}
		});
		//console.log(postData);
		//console.log(JSON.stringify(postData));
		if (!hasConEmpty){
			$.post(
				QF.setting.serv_consSave,
				JSON.stringify(postData),
				//postData,
				lg.loadConsList,
				"json"
			);
			cm.inValEmpty(id, ['name', 'vx', 'vy', 'vphi', 'fx', 'fy', 'fphi']);
			cm.inUnCheckVal(id, ['vxTag', 'vyTag', 'vphiTag', 'fxTag', 'fyTag', 'fphiTag']);
		}
	}
	
	function processNodeConsAdd(){
	//$('#nodeConsAddBtn').bind('click', function(){
		var hasConEmpty=true,
		id='#nodeCons',
		postData = {node:{
			name:cm.inVal(id,'name')
			,rx:cm.inVal(id,'x')
			,ry:cm.inVal(id,'y')
			,rz:cm.inVal(id,'z')
			,temparature:cm.inVal(id,'temparature')
			,moment:cm.inVal(id,'moment')
			,lp:cm.inVal(id,'p')
			,lq:cm.inVal(id,'q')
		}};
		_.forEach(postData.node, function(v){
			if (v!=='' && typeof v !== 'undefined'){
				hasConEmpty = false;
			}
		});
		if (!hasConEmpty){
			$.post(
				QF.setting.serv_consSave,
				JSON.stringify(postData),
				lg.loadConsListWithAlert,
				"json"
			);
			cm.inValEmpty(id, ['name','x', 'y', 'z', 'temparature', 'moment', 'p', 'q']);
		}
	};
	
	$('#spasConsBtn').bind('click', function(){
		var id="#spasCons";
		var spasConsArr=[];
		var topAll = cm.inVal(id, 'topAll');
		var topAllBCType = cm.inSelVal(id, 'topAllBCType');
		
		var bottomAll = cm.inVal(id, 'bottomAll');
		var bottomAllBCType = cm.inSelVal(id, 'bottomAllBCType');
		
		//var topAll2 = cm.inVal(id, 'topAll2');
		//var topAllBCType2 = inSelVal.inVal(id, 'topAllBCType2');
		
		//var bottomAll2 = cm.inVal(id, 'bottomAll2');
		//var bottomAllBCType2 = inSelVal.inVal(id, 'bottomAllBCType2');
		
		if (topAll != ''){
			spasConsArr.push({name:'topAll', typeName:'topAllBCType', type:topAllBCType, cmd:'SPECIFIED_'+topAllBCType+'_AT_TOP_ALL_SURFACE', val:topAll});
		}
		if (bottomAll != ''){
			spasConsArr.push({name:'bottomAll', typeName:'bottomAllBCType', type:bottomAllBCType, cmd:'SPECIFIED_'+bottomAllBCType+'_AT_BOTTOM_ALL_SURFACE', val:bottomAll});
		}
		/*if (topAll2 != ''){
			spasConsArr.push({type:'SPECIFIED_'+topAllBCType2+'_AT_TOP_ALL_SURFACE', val:topAll2});
		}
		if (bottomAll2 != ''){
			spasConsArr.push({type:'SPECIFIED_'+bottomAllBCType2+'_AT_BOTTOM_ALL_SURFACE', val:bottomAll2});
		}*/
		QF.setting.spasConsForm = spasConsArr;
		/*QF.setting.spasConsForm = {
			'SPECIFIED_TOTAL_HEAD_AT_TOP_ALL_SURFACE':cm.inVal(id, 'totalHeadTopAll1') + ' ' + cm.inVal(id, 'totalHeadTopAll2'),
			'SPECIFIED_DARCY_VELOCITY_AT_BOTTOM_ALL_SURFACE':cm.inVal(id, 'DarcyVelocityBottomAll1') + ' ' + cm.inVal(id, 'DarcyVelocityBottomAll2'),
			'SPECIFIED_CONCENTRATION_AT_TOP_ALL_SURFACE':cm.inVal(id, 'concentrationTopAll1') + ' ' + cm.inVal(id, 'concentrationTopAll2'),
			'SPECIFIED_MASS_FLUX_AT_BOTTOM_ALL_SURFACE':cm.inVal(id, 'massFluxBottomAll1') + ' ' + cm.inVal(id, 'massFluxBottomAll2')			
		};*/
	});
	
	$('#particleConsAddBtn, #nodeConsAddBtn').bind('click', function(){
		processParticleConsAdd();
		processNodeConsAdd();
	});
	
	$('#particleConsListBtn, #modalNodeConsListBtn').bind('click', function(){
		$.post(
			QF.setting.serv_consSaveEdit,
			JSON.stringify(lg.getMergedModifiedCons()),
			lg.loadConsListWithAlert,
			"json"
		);
	});
	
	$('img .loadToCanvas').bind('click', function(){
		console.log(this);
	});
	
	
	$('#uploadFileBtn').bind('click', function(){
		var pName = $('#projName').attr('data');
		if (pName == '' || typeof pName == "undefined"){
			alert('Please select project first!');
			return;
		}
		$.ajax({
			url: QF.setting.serv_pFileUpload + pName,
			type: "POST",
			data: new FormData($("#fileForm")[0]),
			contentType: false,
			cache: false,
			processData:false,
			success:lgProj.successLoadFileList
		});		
	});
	
	$('#uploadFileBtn').bind('click', function(){
		if (QF.setting.imageUploaded >= QF.setting.imageUploadLimit){
			alert('Total upload allowed is ' + QF.setting.imageUploadLimit);
			return;
		}
		$.ajax({
			url: QF.setting.serv_imageUpload,
			type: "POST",
			data: new FormData($("#imageForm")[0]),
			contentType: false,
			cache: false,
			processData:false,
			success:lg.loadImageList
		});
	});
	
	$('#modalCopyBtn').bind('click', function(){
		var id='#modalCopy';
		
		lg.copyIncrement(
			parseInt(cm.inVal(id, 'copyCount')),
			parseInt(cm.inVal(id, 'copyRow')),
			parseFloat(cm.inVal(id, 'copyDistant'))
		);
	});
	
	$('#modalEditorBtn').bind('click', function(){
		if (QF.setting.verticesNoVisibility) qfMode.toggleVerticesNo();
		if (QF.setting.spheroRadiusVisibility) qfMode.toggleSpheroRadius();
		if (QF.setting.particleNoVisibility) qfMode.toggleParticleNo();
		
		QF.setting.controls['VerticesNo'] = QF.setting.verticesNoVisibility;
		QF.setting.controls['Spheroradius'] = QF.setting.spheroRadiusVisibility;
		QF.setting.controls['ParticleNo'] = QF.setting.particleNoVisibility;
		
		lgEditor.processSavedEditor();	
		//lg.genSpasCons();
	});
	
	$('#modalElemPropEditBtn').bind('click', function(){
		$.post(
			QF.setting.serv_propSaveEdit,
			JSON.stringify(lg.getMergedModifiedProp()),
			lg.loadPropListWithAlert,
			"json"
		);
	});
	
	$('.modalSpasPropBtn').bind('click', function(){
		var id="#spasProp";
		var spasProp = {
			mpId: cm.inVal(id,'mpId'),
			name: cm.inVal(id,'name'),
			MOLECULAR_DIFFUSION: cm.inVal(id,'MOLECULAR_DIFFUSION'),
			SPECIFIC_STORAGE: cm.inVal(id,'SPECIFIC_STORAGE'),
			HYDRAULIC_CONDUCTIVITY: cm.inVal(id,'HYDRAULIC_CONDUCTIVITY_Kxx')+' '+cm.inVal(id,'HYDRAULIC_CONDUCTIVITY_Kxy')+' '+cm.inVal(id,'HYDRAULIC_CONDUCTIVITY_Kyy'),
			DISPERSIVITY:cm.inVal(id,'DISPERSIVITY1')+' '+cm.inVal(id,'DISPERSIVITY2'),
			DRY_DENSITY: cm.inVal(id,'DRY_DENSITY'),
			POROSITY: cm.inVal(id,'POROSITY'),
			DECAY_HALF_LIFE:cm.inVal(id,'DECAY_HALF_LIFE'),
			ADD_SEEPAGE:cm.inVal(id,'ADD_SEEPAGE1')+' '+cm.inVal(id,'ADD_SEEPAGE2'),
			TRANSIENT_INSTANTANEOUS_FRACTION:cm.inVal(id,'TRANSIENT_INSTANTANEOUS_FRACTION'),
			TRANSIENT_SORPTION_RATE:cm.inVal(id,'TRANSIENT_SORPTION_RATE'),
			DIFFUSION:cm.inVal(id,'DIFFUSION'),
			LINEAR_SORPTION_COEFFICIENT:cm.inVal(id,'LINEAR_SORPTION_COEFFICIENT'),
			TRANSMISSIVITY:cm.inVal(id,'TRANSMISSIVITY1')+' '+cm.inVal(id,'TRANSMISSIVITY2')+' '+cm.inVal(id,'TRANSMISSIVITY3'),
			SORPTION:cm.inVal(id,'SORPTION'),
			REPLACE_SEEPAGE:cm.inVal(id,'REPLACE_SEEPAGE1')+' '+cm.inVal(id,'REPLACE_SEEPAGE2'),
			MASS_INTERLAYER_DISCONTINUITY_TOP:cm.inVal(id,'MASS_INTERLAYER_DISCONTINUITY_TOP'),
			MASS_INTERLAYER_DISCONTINUITY_BOTTOM:cm.inVal(id,'MASS_INTERLAYER_DISCONTINUITY_BOTTOM')
		}
		$.post(
			QF.setting.serv_propSave,
			JSON.stringify({
				spas:spasProp
			}),
			lg.loadPropListWithAlert,
			"json"
		);
		
		cm.inValEmpty(id, [
			'id','name','MOLECULAR_DIFFUSION','SPECIFIC_STORAGE', 'HYDRAULIC_CONDUCTIVITY_Kxx','HYDRAULIC_CONDUCTIVITY_Kxy','HYDRAULIC_CONDUCTIVITY_Kyy',
			'DISPERSIVITY','DRY_DENSITY', 'POROSITY','DECAY_HALF_LIFE','ADD_SEEPAGE','TRANSIENT_INSTANTANEOUS_FRACTION','TRANSIENT_SORPTION_RATE',
			'DIFFUSION','LINEAR_SORPTION_COEFFICIENT','TRANSMISSIVITY1','TRANSMISSIVITY2','TRANSMISSIVITY3','SORPTION','REPLACE_SEEPAGE1','REPLACE_SEEPAGE2',
			'MASS_INTERLAYER_DISCONTINUITY_TOP','MASS_INTERLAYER_DISCONTINUITY_BOTTOM'
		]);
	});
	
	$('.modalElemPropBtn').bind('click', function(){
		var id='#beamProp'
			,nameB = cm.inVal(id,'name')
			,ym = cm.inVal(id,'youngModulus')
			,pr = cm.inVal(id,'poissonRatio')
			,a = cm.inVal(id,'area')
			,mi = cm.inVal(id,'moment')
			,ty = cm.inSelVal(id, 'type')
			,beamProp={}
		;
		if (ym!='' || pr!='' || a!='' || mi!='' ){
			beamProp={name:nameB, youngModulus:ym, poissonRatio:pr, area:a, moment:mi, type:ty};
			cm.inValEmpty(id, ['name','youngModulus', 'poissonRatio','area','moment']);
		}
		
		var 
		id='#plateProp'
		,nameP = cm.inVal(id,'name')
		,ym = cm.inVal(id,'youngModulus')
		,pr = cm.inVal(id,'poissonRatio')
		,th = cm.inVal(id,'thickness')
		,ty = cm.inSelVal(id, 'type')
		,plateProp=''
		;
		if (ym!='' || pr!=''|| th!=''){
			plateProp={name:nameP, youngModulus:ym, poissonRatio:pr, thickness:th, type:ty};
			cm.inValEmpty(id, ['name','youngModulus', 'poissonRatio','thickness']);
		}
		
		id='#spolyProp';
		var nameS = cm.inVal(id,'name')
			,ncs = cm.inVal(id,'ncs')
			,tcs = cm.inVal(id,'tcs')
			,cof = cm.inVal(id,'cof')
			,cor = cm.inVal(id,'cor')
			,ncov = cm.inVal(id,'ncov')
			,tcov = cm.inVal(id,'tcov')
			,dcov = cm.inVal(id,'dcov')
			,density = cm.inVal(id,'density')
			,spolyProp=''
		;
		if (ncs!=''||tcs!=''||cof!=''||ncov!=''||tcov!=''||dcov!=''||density!=''||cor!=''){
			spolyProp={name:nameS, ncs:ncs, tcs:tcs, cof:cof, cor:cor, ncov:ncov, tcov:tcov, dcov:dcov, density:density};
			cm.inValEmpty(id, ['name', 'ncs', 'tcs', 'cof', 'cor', 'ncov', 'tcov', 'dcov', 'density']);
		}
		
		$.post(
			QF.setting.serv_propSave,
			JSON.stringify({
				beam:beamProp,
				plate:plateProp,
				spoly:spolyProp
			}),
			lg.loadPropListWithAlert,
			"json"
		);
	});
	
	
	$('#beamProp select[name=type]').bind('change', function(){
		var 
		id='#beamProp',
		ty=cm.inSelVal(id, 'type')
		;
		if (ty == 'truss'){
			$(id + ' .inertia').addClass('hide');
			$(id + ' input[name=moment]').val('');
			
		}else{
			$(id + ' .inertia').removeClass('hide');
		}
	});
	
	$('#plateProp select[name=type]').bind('change', function(){
		var 
		id='#plateProp',
		ty=cm.inSelVal(id, 'type')
		;
		if (ty == 'strain'){
			$(id + ' .geometric').addClass('hide');
			$(id + ' input[name=thickness]').val('');
			
		}else{
			$(id + ' .geometric').removeClass('hide');
		}
	});
	
	//DISCRETE ELEMENT
	$('#modalSetAttrDEBtn').bind('click', function(){
		var id = '#modalSetAttrDE'
			,mark = parseInt(cm.inCheckVal(id,'mark'))
			,sphe = parseFloat(cm.inVal(id,'spheroradius'))
		;
		var vArr = QF.setting.customVerticesArray;
		vArr[0] = {x:vArr[0].x, y:vArr[0].y, m:mark, r:sphe, p:QF.setting.dataPropSpoly[0].name};
		
		lg.drawDEByRightClick();
	});
	
	//FINITE ELEMENT
	$('#modalSubdivideBtn').bind('click', function(){
		var id = '#modalSubdivide'
			,subX = parseInt(cm.inVal(id,'subDivideX'))
			,subY = parseInt(cm.inVal(id,'subDivideY'))
		;
		lgFE.processSubdivision(subX, subY);
	});
	
	$('#modalNodesAttrBtn').bind('click', function(){
		var id='#modalNodesAttr'
			,rx = $(id + ' input[name=restraintX]').val()
			,ry = $(id + ' input[name=restraintY]').val()
			,rz = $(id + ' input[name=restraintZrotation]').val()
			,t = $(id + ' input[name=temparature]').val()
			,lp = $(id + ' input[name=loadP]').val()
			,lq = $(id + ' input[name=loadQ]').val()
		;
		QF.setting.nodesAttrVal = {restraintX:rx, restraintY:ry, restraintZrotation:rz, temparature:t, loadP:lp, loadQ:lq};
	});
	
	$('#modalElemAttrBtn').bind('click', function(){
		var id='#modalElemAttr'
			,ym = $(id + ' input[name=youngModulus]').val()
			,pr = $(id + ' input[name=poissonRatio]').val()
			,a = $(id + ' input[name=area]').val()
			,mi = $(id + ' input[name=moment]').val()
			,th = $(id + ' input[name=thickness]').val()
			,ty = $(id + ' input[name=type]').val()
		;
		if ( $(id + ' #fieldsetGeo').hasClass('hide') ) {mi = th = a = '';}
		else{
			if ($(id + ' .fgMoment').hasClass('hide')) mi = '';
			if ($(id + ' .fgThickness').hasClass('hide'))th = '';
			if ($(id + ' .fgArea').hasClass('hide'))a = '';
		}
		QF.setting.elemAttrVal[ty] = {youngModulus:ym, poissonRatio:pr, area:a, moment:mi, thickness:th};
	});
	
	
	$('#modalExtrudeBtn').bind('click', function(){
		var id = '#modalExtrude',
			exX = parseFloat(cm.inVal(id,'extrudeX')),
			exY = parseFloat(cm.inVal(id,'extrudeY')),
			leaveOri = cm.inCheckVal(id,'extrudeLeave');
			
		lg.processExtrusion(exX, exY, leaveOri);
	});
	
	//SOLVER
	$('#modalSolverSpolyBtn').bind('click', function(){
		QF.setting.solverType = 'SPOLY';
		var id="#modalSolverSpoly";
		
		QF.setting.solverSpoly = {
			'param':{
				grav:cm.inVal(id, 'grav'),
				aoiog:cm.inVal(id, 'aoiog'),
				vd:cm.inVal(id, 'vd'),
				ts:cm.inVal(id, 'ts'),
				cm:cm.inVal(id, 'cm')
			},
			'sim':{
				simulationName:cm.inVal(id, 'simulationName'),
				graphicalOutput:cm.inSelVal(id, 'graphicalOutput'),
				framePerSecond:cm.inVal(id, 'framePerSecond'),
				dataPerSecond:cm.inVal(id, 'dataPerSecond'),
				simulationTime:cm.inVal(id, 'simulationTime'),
				domainLength:cm.inVal(id, 'domainLength'),
				leftLimit:cm.inVal(id, 'leftLimit'),
				rightLimit:cm.inVal(id, 'rightLimit'),
				bottomLimit:cm.inVal(id, 'bottomLimit'),
				topLimit:cm.inVal(id, 'topLimit')				
			}
		}
		console.log(QF.setting.solverSpoly);
		QF.setting.solverVal = QF.setting.solverSpoly;
	});
	$('#modalSolverPatrusBtn').bind('click', function(){
		QF.setting.solverType = 'PATRUS';
		var id="#modalSolverPatrus";
		
		QF.setting.solverPatrus = {};
		QF.setting.solverVal = QF.setting.solverPatrus;
	});
	$('#modalSolverSpasBtn').bind('click', function(){
		QF.setting.solverType = 'CONFEM';
		var id="#modalSolverSpas";
		
		var analysisCode = cm.inCheckVal(id, 'problemType1') + cm.inCheckVal(id, 'problemType2') + cm.inCheckVal(id, 'problemType3');
	
		QF.setting.solverSpas = {
			//'analysis':QF.setting.solverSpasAnalysisCodeVal[analysisCode],
			'analysis':analysisCode,
			'time':{
				TIME_STATIONS_LIST: cm.replaceAll(cm.inVal(id, 'timeStationList'), ',', ' '),
				TIME_START: cm.inVal(id, 'timeStart'),
				TIME_END: cm.inVal(id, 'timeEnd'),
				TIME_STATIONS_NUMBER: cm.inVal(id, 'timeStationNumber'),
				OUTPUT_FREQUENCY_IN_TIME: cm.inVal(id, 'timeStep'),
				specifyTimeStations: cm.inCheckVal(id, 'specifyTimeStations'),
				specifyTimeInterval: cm.inCheckVal(id, 'specifyTimeInterval'),
				timeTypeRadio: cm.inCheckVal(id, 'timeTypeRadio')
			},
			'controls':{
				assembly: ['LAPACK_SOLVER', 'REAL_VALUED_SOLVER_ON'],
				PECLET_NUMBER_LIMIT: 30,
				NON_LINEAR_SORPTION_ITERATION_PARAMETERS: [10, 0.0001]				
			}
		};
		QF.setting.solverVal = QF.setting.solverSpas;
	});
	
	$('#modalSolverSpas input[name=problemType1]').bind('click', function(){
		if ($('#coupledAnalyses').is(':checked')){
			$('#mixProblemType2').removeAttr('disabled');
		}else{
			$('#mixProblemType2').attr('disabled', '');
			$('#mixProblemType2').prop('checked', false);
			$('#unsaturated').removeAttr('disabled');
		}
	});
	
	$('#modalSolverSpas input[name=problemType2]').bind('click', function(){
		if ($('#mixProblemType2').is(':checked')){
			$('#unsaturated').attr('disabled', '');
			$('#unsaturated').prop('checked', false);
		}else{
			$('#unsaturated').removeAttr('disabled');
		}
	});
	
	$('input[name=allLayersSubdivision]').bind('click', function(){
		if($('input[name=allLayersSubdivision]').is(':checked')){
			//$('input[name=horizontalSubdivision]').removeAttr('disabled');
			$('input[name=verticalSubdivision]').removeAttr('disabled');
			
		}else{
			//$('input[name=horizontalSubdivision]').attr('disabled', '');
			$('input[name=verticalSubdivision]').attr('disabled', '');
		}
	});
	
	$('input[name=allLayersRatio]').bind('click', function(){
		if($('input[name=allLayersRatio]').is(':checked')){
			//$('input[name=horizontalRatio]').removeAttr('disabled');
			$('input[name=verticalRatio]').removeAttr('disabled');
			
		}else{
			//$('input[name=horizontalRatio]').attr('disabled', '');
			$('input[name=verticalRatio]').attr('disabled', '');
		}
	});
});

function loadProject(projName){
	$.ajax({
		url: QF.setting.serv_pData + projName,
		dataType: 'json',
		async: true,
		success: lgProj.successLoadProjData
	});
}

function deleteProject(projName){
	if (confirm('Are you sure to delete this project?')){
	  $.post(
		QF.setting.serv_pDelete,
		{projName:projName},
		lgProj.successLoadProjList,
		"json"
	  );
	}
}

function loadToCanvas(id, postX, postY){
	var texture = PIXI.Texture.fromImage($('#'+id).attr('src'));
	// create a new Sprite using the texture
	var imgS = new QF.sprite(texture);
 
	// center the sprites anchor point
	imgS.anchor.x = 0.5;
	imgS.anchor.y = 0.5;
 
	if (typeof postX === 'undefined'){
		// move the sprite t the center of the screen
		postX = canv.width / 2;
		postY = canv.height / 2;
	}
	
	imgS.position.x = postX;
	imgS.position.y = postY;
	
	stage.addChild(imgS);
}

function deleteImg(id){
	$.post(
		QF.setting.serv_imageDelete,
		{imgLongId:id},
		lg.loadImageList,
		"json"
	);
}