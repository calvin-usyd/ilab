"use strict";
			
QF.mode = function(){
var cm = QF.Common();

return Object.freeze({
	//COMMON
	toggleScale : function(val){
		stage.scale.x=stage.scale.y=val;
	},
	togglePositionX : function(val){
		stage.position.x=val;
	},
	togglePositionY : function(val){
		stage.position.y=val;
	},
	initUndoGUI : function(){
		QF.setting.snapGrid = !QF.setting.snapGrid;
	},
	initMoveGUI : function(){
		QF.setting.move = !QF.setting.move;
	},
	initEditGUI : function(){
		QF.setting.snapGrid = !QF.setting.snapGrid;
	},
	toggleSnapGrid : function(){
		QF.setting.snapGrid = !QF.setting.snapGrid;
	},
	toggleGridGUI : function(){
		QF.setting.gridVisibility = !QF.setting.gridVisibility;
		gridG.visible = QF.setting.gridVisibility;
	},
	toggleAxesGUI : function(){
		QF.setting.axesVisibility = !QF.setting.axesVisibility;
		var v = QF.setting.axesVisibility;
		axesX.visible = v;
		axesY.visible = v;
		rulerX.visible = v;
		rulerY.visible = v;
		rulerBigX.visible = v;
		rulerBigY.visible = v;
		for (var i=0, tLen=QF.setting.rulerText.length; i<tLen; ++i){
			QF.setting.rulerText[i].visible = v;
		}
	},
	/*initDelSelected : function(){
		QF.setting.spheroRadiusVisibility = !QF.setting.spheroRadiusVisibility;
		lg.delSelected();
	},*/
	initSelectArea : function(){
		this.initToggleDraw('isSelect');
	},
	initToggleDraw : function(settingIsTrue){
		if (!QF.setting[settingIsTrue]){
			QF.setting.isFESpas = false;
			QF.setting.isFE = false;
			QF.setting.isDE = false;
			QF.setting.isSelect = false;
		}
		QF.setting[settingIsTrue] = !QF.setting[settingIsTrue];
	},
	initNewImageGUI : function(){
		cm.popUp('#modalImage');
		$.ajax({
			url:QF.setting.serv_imageList,
			success:lg.loadImageList
		});
	},
	setUnitConversion : function(v){
		QF.setting.unitVal=v;
		initRulerText();		
		usrP = cm.toMapPoint(canv.height, QF.setting.rulerOffset, QF.setting.unitVal);
	},
	
	
	
	
	
	
	//ALL ELEMENT
	toggleDrawFeSpas : function(){
		this.initToggleDraw('isFESpas');
	},
	toggleDrawFe : function(){
		this.initToggleDraw('isFE');
	},
	toggleDrawDe : function(){
		this.initToggleDraw('isDE');
	},
	initElemProp : function(){
		cm.popUp('#modalElemProp');
		//$.post(
		/*$.ajax({
			url:QF.setting.serv_propList,
			success:lg.loadPropList
		});*/
	},
	initElemCons : function(){
		cm.popUp('#modalElemCons');
		//lg.loadSpasCons();
	},
	initEditor : function(){
		lgEditor.loadEditor();
		cm.popUp('#modalEditor');
	},
	
	
	
	//DISCRETE ELEMENT
	initIncrementGUI : function(){
		//cm.popUp('#increment');
		cm.popUp('#modalCopy');
	},
	/*completePolygon : function(){
		lg.drawPolygon();
	},
	completeLine : function(){
		lg.drawLine();
	},
	toggleDrawLine : function(){
		this.initToggleDraw('drawLine');
	},
	toggleDrawCircle : function(){
		this.initToggleDraw('drawCircle');
	},
	toggleDrawPolygon : function(){
		this.initToggleDraw('drawPolygon');
	},*/
	toggleSpheroRadius : function(){
		this.initToggleDraw('spheroRadiusVisibility');
		lg.toggleSpheroRadius();
	},
	toggleVerticesNo : function(){
		QF.setting.verticesNoVisibility=!QF.setting.verticesNoVisibility
		lg.toggleVerticesNo();
	},	
	toggleParticleNo : function(){
		QF.setting.particleNoVisibility=!QF.setting.particleNoVisibility
		lg.toggleParticleNo();
	},	
	
	
	
	
	
	
	
	
	
	
	
	
	//FINITE ELEMENT
	toggleDrawNode : function(){
		this.initToggleDraw('isNode');
	},
	initExtrude : function(){
		if(cm.hasSelected()){
			cm.popUp('#modalExtrude');
		}
	},
	initElement : function(val){
		cm.popUp('#modal' + val);
	},
	toggleNodeNo : function(){
		QF.setting.nodeNoVisibility=!QF.setting.nodeNoVisibility;
		lgFE.toggleNodeNo();
	},	
	toggleElementNo : function(){
		QF.setting.elementNoVisibility=!QF.setting.elementNoVisibility;
		lgFE.toggleElementNo();
	},
	toggleLoadText : function(){
		QF.setting.loadTextVisibility=!QF.setting.loadTextVisibility;
		lgFE.toggleLoadText();
	},
	toggleBoundaryCondition : function(){
		QF.setting.bcTextVisibility=!QF.setting.bcTextVisibility;
		lgFE.toggleBoundaryCondition();
	},
	setNodesAttr : function(){
		cm.popUp('#modalNodesAttr');
	},
	setElementAttr : function(type){
		var 
			elemAttr = QF.setting.elemAttr[type]
			,elemAttrVal = QF.setting.elemAttrVal[type]
			,props = elemAttr.geo.props
			,id = '#modalElemAttr'
			,i
		;
		
		$(id + ' input[name=type]').val(type);
		
		if (typeof elemAttrVal !== 'undefined'){
			$(id + ' input[name=youngModulus]').val(elemAttrVal.youngModulus);
			$(id + ' input[name=poissonRatio]').val(elemAttrVal.poissonRatio);
			$(id + ' input[name=area]').val(elemAttrVal.area);
			$(id + ' input[name=temp]').val(elemAttrVal.temp);
			$(id + ' input[name=LOF]').val(elemAttrVal.LOF);
			$(id + ' input[name=alpha]').val(elemAttrVal.alpha);
			$(id + ' input[name=ro]').val(elemAttrVal.ro);
			$(id + ' input[name=moment]').val(elemAttrVal.moment);
			$(id + ' input[name=thickness]').val(elemAttrVal.thickness);
			
		}else{
			$(id + ' input[name=youngModulus]').val('');
			$(id + ' input[name=poissonRatio]').val('');
			$(id + ' input[name=area]').val('');
			$(id + ' input[name=temp]').val('');
			$(id + ' input[name=LOF]').val('');
			$(id + ' input[name=alpha]').val('');
			$(id + ' input[name=ro]').val('');
			$(id + ' input[name=moment]').val('');
			$(id + ' input[name=thickness]').val('');
			
		}
		
		if (elemAttr.geo.exists){
			$(id + ' #fieldsetGeo').removeClass('hide');
			var hasArea = false
				,hasMoment = false
				,hasThickness = false
			;
			
			for (i=0; i<props.length; i++){
				if (props[i] == 'area'){
					$(id + ' .fgArea').removeClass('hide');
					hasArea = true;
					
				}else if (props[i] == 'momentInertia'){
					$(id + ' .fgMoment').removeClass('hide');
					hasMoment = true;
					
				}else if (props[i] == 'thickness'){
					$(id + ' .fgThickness').removeClass('hide');
					hasThickness = true;
				}
			}
			
			if (!hasArea){
				if (!$(id + ' .fgArea').hasClass('hide')){
					$(id + ' .fgArea').addClass('hide');
				}
			}
			if (!hasMoment){
				if (!$(id + ' .fgMoment').hasClass('hide')){
					$(id + ' .fgMoment').addClass('hide');
				}
			}
			if (!hasThickness){
				if (!$(id + ' .fgThickness').hasClass('hide')){
					$(id + ' .fgThickness').addClass('hide');
				}
			}
		}else{
			if (!$(id + ' #fieldsetGeo').hasClass('hide')){
				$(id + ' #fieldsetGeo').addClass('hide');
			}
		}
		
		popUp(modalElemAttr);
	},
	/*setConstraint : function(){
		$('#modalConstraint').modal().draggable({
		  handle: ".modal-header"
		});
	},
	setRestraint : function(){
		$('#modalRestraint').modal().draggable({
		  handle: ".modal-header"
		});
	},
	setTemparature : function(){
		$('#modalTemparature').modal().draggable({
		  handle: ".modal-header"
		});
	},
	setLoad : function(){
		$('#modalLoad').modal().draggable({
		  handle: ".modal-header"
		});
	},
	setMaterial : function(){
		$('#modalMaterial').modal().draggable({
		  handle: ".modal-header"
		});
	},*/
	initSubdivide : function(){
		cm.popUp('#modalSubdivide');
	},
	
	//PATRUS
	initForce : function(){
		if(cm.hasSelected()){
			var id="modalForce";
			var fc = QF.setting.selectedObj.obj.force;
			var fX='',fY='';
			if (fc){
				fX=fc.x;
				fY=fc.y;
			}
			cm.inValSet(id, 'forceX', fX);
			cm.inValSet(id, 'forceY', fY);
			cm.popUp('#modalForce');
		}
	},
	
	
	//SOLVER
	initSpoly : function(){
		var 
		id = '#modalSolverSpoly',
		sSpoly = QF.setting.solverSpoly,
		param = sSpoly.param,
		sim = sSpoly.sim
		;
		
		if (param && sim){
			cm.inValSet(id, 'grav', param.grav);
			cm.inValSet(id, 'aoiog', param.aoiog);
			cm.inValSet(id, 'vd', param.vd);
			cm.inValSet(id, 'ts', param.ts);
			cm.inValSet(id, 'cm', param.cm);
			
			cm.inValSet(id, 'simulationName', sim.simulationName);
			cm.selValSet(id, 'graphicalOutput', sim.graphicalOutput);
			cm.inValSet(id, 'framePerSecond', sim.framePerSecond);
			cm.inValSet(id, 'dataPerSecond', sim.dataPerSecond);
			cm.inValSet(id, 'simulationTime', sim.simulationTime);
			cm.inValSet(id, 'domainLength', sim.domainLength);
			cm.inValSet(id, 'leftLimit', sim.leftLimit);
			cm.inValSet(id, 'rightLimit', sim.rightLimit);
			cm.inValSet(id, 'bottomLimit', sim.bottomLimit);
			cm.inValSet(id, 'topLimit', sim.topLimit);
		}
		cm.popUp('#modalSolverSpoly');
	},
	initMatrus : function(){
		alert('Únder development!');
		//cm.popUp('#modalSolverPatrus');		
	},
	initPatrus : function(){
		QF.setting.solverType = 'PATRUS';
		cm.popUp('#modalSolverPatrus');		
	},
	initSpas : function(){
		cm.popUp('#modalSolverSpas');		
	},
	
	
	
	
	//FILE
	initNewProj : function(){
		location.reload();
	},
	initSaveData : function(){
		cm.popUp('#modalSaveProject');
	},
	initRunExe : function(){
		cm.popUp('#modalRunSolver');
	},
	initFiles : function(){
		var pName = $('#projName').attr('data');
		
		if (pName == '' || typeof pName == "undefined"){
			alert('Please select project first!');
			return;
		}
		$.ajax({
			url: QF.setting.serv_pfileList + pName,
			dataType: 'json',
			success: lgProj.successLoadFileList
		});
		cm.popUp('#modalFiles');
	},
	initSelectProj : function(){
		$.ajax({
			url: QF.setting.serv_pList,
			dataType: 'json',
			success: lgProj.successLoadProjList
		});
		cm.popUp('#modalSelectProject');
	},
	initSimulation : function(){
		//alert('Under construction!');
		var sT = QF.setting.solverType;
		var param = '';
		
		if (sT == 'SPOLY'){
			param = QF.setting.solverSpoly.sim.simulationName;
			
		}else if(sT == 'CONFEM' || sT == 'PATRUS'){
			param = '';

		}else{
			alert('Please open saved project or save the solver information before proceeding to see the output!');
			return;
		}
		//window.open(QF.setting.serv_result[sT] + $('#projName').attr('data')+'/'+param, '_blank');
		window.open(QF.setting.serv_result + $('#projName').attr('data') + '/' + sT + '_' + param, '_blank');
	},
	initExe : function(){
		var pName = $('#projName').attr('data');
		var username = $('#usernameId').attr('content');
		
		if (pName == '' || typeof pName === 'undefined'){
			alert('Please save the project or select from existing projects before executing the process!');
		}else{
			var sT = QF.setting.solverType;
			var sol = sT;
			/*if (sT = 'SPOLY'){
				sol = sT;
			}else if (sT = 'PATRUS'){
				sol = sT;
				
			}else */
			if (sT == 'CONFEM'){
				sol = username +'/'+ sT;
			}
			cm.loadProgress();
			if (QF.setting.useExternalServer){
				$.post(
					QF.setting.serv_exe[sT],
					{p:pName},
					function(json){
						if (json.length == 2){
							alert(json[1])
						}
						cm.hideProgress();
					},
					"json"					
				);
			}else{
				window.open(QF.setting.serv_exe[sT] + pName + '&u=' + username +'&s=' + sol + '&' + (new Date()).getMilliseconds(), '_blank', 'menubar=0,toolbar=0,location=0,fullscreen=yes');
			}
		}
	},
	initProfile : function(){
		var id = '#modalProfile';
		
		cm.inValSet(id, 'currentPassword', '');
		cm.inValSet(id, 'newPassword', '');
		
		$.ajax({
			url:QF.setting.serv_profileView,
			dataType: 'json',
			success: function(json){
				cm.inValSet(id, 'username', json['username']);
				cm.inValSet(id, 'email', json['email']);
			}
		});
		cm.popUp(id);
	},
	initSession : function(){
		cm.popUp('#modalSession');
	},
	logout : function(){
		window.location='/logout';
	}
});
}
