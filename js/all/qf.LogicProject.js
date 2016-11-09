"use strict";

QF.LogicProject = function(){
this.getGuiDataBySolverType = function(){
	var sTy = QF.setting.solverType;
	var proccessedObjArray=[];
	
	if (sTy == 'SPOLY'){
		var valArray=[];
		var proccessedParticleObjArray=[];

		_.forEach(QF.setting.deObjArray, function(o){
			if (o instanceof Polygon){
				valArray = o.graphicsData[0].shape.points;
			}else if (o instanceof Circle){
				var val = o.graphicsData[0].shape;
				valArray = [val.x, val.y];
			}
			proccessedParticleObjArray.push({m:o.mark, r:o.radius, v:valArray, c:o.constraint, p:o.property});
		});
		
		proccessedObjArray = {
			param: QF.setting.parameter,
			sim: QF.setting.simulation,
			particle: proccessedParticleObjArray
		}

	}else if (sTy == 'CONFEM'){
		//QF.setting.nodeObjArray
		//QF.setting.elementIndexArray
		var 
		mPropArrData = [],
		mPropSetArrData = [],
		layerArrData = [],
		meshArrData = []
		;
		
		var filteredEmptyEditorSpas = _.filter(QF.setting.dataEditorSpas, function(n) {
		  return (n.layer !== "" && typeof n.layer !== 'undefined' );
		});
		_.forEach(filteredEmptyEditorSpas, function(o){
			layerArrData.push({layer:o.layer, thickness:o.thickness, incLeftHeight:(o.incLeftHeight) ? o.incLeftHeight : 0, incLeftWidth:(o.incLeftWidth)?o.incLeftWidth:1, incRightHeight:(o.incRightHeight)?o.incRightHeight:0, incRightWidth:(o.incRightWidth)?o.incRightWidth:1});
			meshArrData.push({layer:o.layer, mSubV:o.mSubV, mRatioV:o.mRatioV, eType:o.eType.split(' - ')[0]});
			mPropArrData.push({layer:o.layer, type:(o.type=='REGULAR')?'':o.type, prop:o.prop});
			_.forEach(QF.setting.dataPropSpas, function(prop){
				if (prop.mpId == o.layer){
					mPropSetArrData.push(prop);
				}
			});
			QF.setting.dataPropSpas
		});
		
		proccessedObjArray = {
			geometry:{
				layers:{
					DIMENSION_X:QF.setting.spasEditorForm['layerDimension'],
					layerArr:layerArrData,
				},
				leaks:{
					LEAKS_2D: '3 0.3'
				},
				inclinations:{
					SYMMETRY_X : '',
					MOVE_ORIGIN_OF_AXES : '0 4.752',
					LOWERMOST_SURFACE_BASE_INCLINATIONS: '0.0 0.0'
				}
			},
			mesh:{
				meshAll:QF.setting.spasEditorForm,
				meshArr:meshArrData
			},
			boundary:{
				boundAll:QF.setting.spasConsForm,
				boundArr:QF.setting.dataConsSpas,
				boundICArr:QF.setting.dataConsSpasIC
			},
			mp:{
				MPSet: mPropSetArrData,
				MPLayer: mPropArrData
			}
		}
	}
	console.log(proccessedObjArray);
	return proccessedObjArray;
}
this.successLoadProjData = function(json){
	//var data = json[0];
	var data = (json instanceof Object) ? json : JSON.parse(json);
	data = data[0];
	
	var gui = JSON.parse(data['gui']);
	var sTy = JSON.parse(data['solverType']);
	QF.setting.solverVal = JSON.parse(data['solverVal']);
	//var particle = JSON.parse(data['particle']);
	//var node = JSON.parse(data['node']);
	//var element = JSON.parse(data['element']);
	//var param = JSON.parse(data['param']);
	//var sim = JSON.parse(data['sim']);
	var pName = cm.replaceAll(data['pName'], '-', ' ');
	
	//DESTROY ALL OBJECTS
	stage.removeChildren();
	initAxes();
	initRulerX();
	initRulerY();
	drawGrid("0x000000");
	initDomainLength();
	initLeftLim();
	initRightLim();
	initBottomLim();
	initTopLim();
	
	QF.setting.solverType = sTy;
		
	console.log(sTy);
	if (sTy == 'SPOLY'){
		//C: LOAD PARTICLES
		QF.setting.verticesNoTextArray=[];
		QF.setting.spheroRadiusArray=[];
		QF.setting.particleNoTextArray=[];
		QF.setting.deObjArray=[];
		_.forEach(gui['particle'], function(o){
			var vArr = [];
			for(var x=0, len=o['v'].length; x<len; x+=2){
				vArr.push({x:o['v'][x], y:o['v'][x+1], r:o['r'], m:o['m'], c:o['c'], p:o['p']});
			};
			QF.setting.customVerticesArray = vArr;
			lg.drawDEByRightClick();
		});

		//E: LOAD SOLVER
		/*QF.setting.solverSpoly = {
			param: solverVal['param'],
			sim: solverVal['sim']
		};*/
	}else if (sTy == 'CONFEM'){
		var layers = gui['geometry']['layers'];
		var meshArr = gui['mesh']['meshArr'];
		var MPLayer = gui['mp']['MPLayer'];
		var mesh=0, mProp=0, editorId='#spasEditorForm';
		
		//EDITOR
		QF.setting.spasEditorForm = gui['mesh']['meshAll'];
		QF.setting.spasEditorForm.layerDimension = layers['DIMENSION_X'];
		cm.inValSet(editorId,'layerDimension', QF.setting.spasEditorForm.layerDimension);
		cm.inValSet(editorId,'horizontalSubdivision', QF.setting.spasEditorForm['horizontalSubdivision']);
		cm.inValSet(editorId,'horizontalRatio', QF.setting.spasEditorForm['horizontalRatio']);
		cm.inValSet(editorId,'allLayersSubdivision', QF.setting.spasEditorForm['allLayersSubdivision']);
		cm.inValSet(editorId,'allLayersRatio', QF.setting.spasEditorForm['allLayersRatio']);
		cm.inValSet(editorId,'verticalSubdivision', QF.setting.spasEditorForm['verticalSubdivision']);
		cm.inValSet(editorId,'verticalRatio', QF.setting.spasEditorForm['verticalRatio']);
		
		_.forEach(layers['layerArr'], function(o, i){
			mesh = meshArr[i];
			mProp = MPLayer[i];
			//console.log('type='+o.type);
			QF.setting.dataEditorSpas.push({
				layer:o.layer, type:(typeof o.type=='undefined')?'REGULAR':o.type, thickness:o.thickness, 
				//incLeftHeight:o.incLeftHeight, incLeftWidth:o.incLeftWidth, 
				//incRightHeight:o.incRightHeight, incRightWidth:o.incRightWidth, 
				//mSubH:mesh.mSubH, 
				//mRatioH:mesh.mRatioH, 
				mSubV:mesh.mSubV, 
				mRatioV:mesh.mRatioV, 
				eType:mesh.eType, prop:mProp.prop
			});
		});
		
		//CONSTRAINT
		var consId="#spasCons";
		QF.setting.dataConsSpasIC = gui['boundary']['boundICArr'];
		QF.setting.dataConsSpas = gui['boundary']['boundArr'];
		QF.setting.spasConsForm = gui['boundary']['boundAll'];
		
		//var topAll = QF.setting.spasConsForm['SPECIFIED_TOTAL_HEAD_AT_TOP_ALL_SURFACE'].split(' ');
		//var bottomAll = QF.setting.spasConsForm['SPECIFIED_DARCY_VELOCITY_AT_BOTTOM_ALL_SURFACE'].split(' ');
		//var conentration = QF.setting.spasConsForm['SPECIFIED_CONCENTRATION_AT_TOP_ALL_SURFACE'].split(' ');
		//var massFlux = QF.setting.spasConsForm['SPECIFIED_MASS_FLUX_AT_BOTTOM_ALL_SURFACE'].split(' ');
		
		_.forEach(QF.setting.spasConsForm, function(consObj){
			cm.inValSet(consId,consObj.typeName, consObj.type);
			cm.inValSet(consId,consObj.name, consObj.val);	
		});
		//cm.inValSet(id,'topAllBCType', topAll[0]);
		//cm.inValSet(id,'topAll', topAll[1]);
		//cm.inValSet(id,'bottomAllBCType', bottomAll[0]);
		//cm.inValSet(id,'bottomAll', bottomAll[1]);
		
		//cm.inValSet(id,'concentrationTopAll1', conentration[0]);
		//cm.inValSet(id,'concentrationTopAll2', conentration[1]);
		//cm.inValSet(id,'massFluxBottomAll1', massFlux[0]);
		//cm.inValSet(id,'massFluxBottomAll2', massFlux[1]);
		
		//SOLVER
		var analysisArr = QF.setting.solverVal['analysis'].split('');
		var time = QF.setting.solverVal['time'];
		var solverId = '#modalSolverSpas';
		
		cm.inCheckSet(solverId, 'problemType1', analysisArr[0]);
		cm.inCheckSet(solverId, 'problemType2', analysisArr[1]);
		cm.inCheckSet(solverId, 'problemType3', analysisArr[2]);
		
		cm.inValSet(solverId, 'timeStationList', time['TIME_STATIONS_LIST']);
		cm.inValSet(solverId, 'timeStart', time['TIME_START']);
		cm.inValSet(solverId, 'timeEnd', time['TIME_END']);
		cm.inValSet(solverId, 'timeStationNumber', time['TIME_STATIONS_NUMBER']);
		cm.inValSet(solverId, 'timeStep', time['OUTPUT_FREQUENCY_IN_TIME']);
		
		//GUI
		lgEditor.genSpasGui();
		
	}else{	
		//A: LOAD NODES
		/*QF.setting.nodeNoTextArray=[];
		QF.setting.nodeObjArray=[]
		_.forEach(node, function(n){
			lg.drawNode(n);
		});
		
		//B: LOAD ELEMENTS
		_.forEach(QF.setting.elementNoTextArray, function(o){
			stage.removeChild(o);
		});
		QF.setting.elementIndexArray = [];
		QF.setting.elementNoTextArray = [];
		if (node.length > 0){
			_.forEach(element, function(e){
				var nodeIndexArr = [];
				_.forEach(e['nodes'], function(eN){
					nodeIndexArr.push(eN);
				});
				//lg.drawElement(_.tail(nodeIndexArr), e['prop']);//Tail remove the first element (index)
				lg.drawElement(nodeIndexArr, e['prop']);//Tail remove the first element (index)
			});
		}*/
	}
	
	//D: LOAD PROJECT TITLE
	$('#htmlTitle').html(pName + ' | iLab');
	cm.inValSet('#modalSaveProject','projectName', pName);
	$('#projName').attr('data', data['pName']).html(pName);
	
	/*
	//E: LOAD SIMULATIONS
	if (sim)
		QF.setting.simulation = sim;
	*/
}
this.successLoadFileList = function(data){
	var filesHolder = $('#filesHolder');
	filesHolder.empty();
	
	var data = (data instanceof Object) ? data : JSON.parse(data);
	
	$(data).each(function(index, value){
		var aLink = $('<a class="btn btn-lg btn-link">');
		aLink
		.attr('href', value.href)
		.attr('target', '_blank')
		.html(value.name)
		.appendTo(filesHolder);
		
	});
}
this.successLoadProjList = function(data){
	var $loadContainer = $('#modalSelectProject tbody');
	$loadContainer.empty();
	
	$(data).each(function(index, value){
		//var pName = value.match(/([^\/]*)\/*$/)[1];
		var span = $('<span>');
		var btn = $('<div class="btn">');
		var tr = $('<tr>');
		var td = $('<td>');
		td.html(index + 1).appendTo(tr);
		
		td = $('<td>');
		td.html(value['name']).appendTo(tr);
		
		td = $('<td>');
		span.addClass('glyphicon glyphicon-download');
		btn.addClass('btn-info').attr('onclick', 'loadProject("'+value['value']+'")').attr('data-dismiss', 'modal').html(span).appendTo(td);
		td.html(btn).appendTo(tr);
		
		td = $('<td>');
		span = $('<span>');
		span.addClass('glyphicon glyphicon-trash');
		btn = $('<div class="btn">');
		btn.addClass('btn-danger').attr('onclick', 'deleteProject("'+value['value']+'")').html(span).appendTo(td);
		td.html(btn).appendTo(tr);
		
		tr.appendTo($loadContainer);
		/*
		$('<option>')
		.attr('value', value['value'])
		.html(value['name'])
		.appendTo($loadContainer);
		*/
	});
}
}
QF.LogicProject.prototype = new QF.LogicProject;
QF.LogicProject.prototype.constructor = QF.LogicProject;