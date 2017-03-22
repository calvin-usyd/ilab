"use strict";

QF.LogicProject = function(){
this.getGuiDataBySolverType = function(){
	var sTy = QF.setting.solverType;
	var proccessedObjArray=[];
	//var userY = cm.toUserPointY(QF.setting.canv.height, QF.setting.rulerOffset, QF.setting.unitVal);
	var mapXY;
	if (sTy == 'SPOLY'){
		var valArray=[];
		var proccessedParticleObjArray=[];
		
		_.forEach(QF.setting.deObjArray, function(o){
			if (o instanceof Polygon){
				valArray = _.map(o.graphicsData[0].shape.points, function(v, i){
					if (i % 2 != 0){
						//return userY(v);
						return usrP.user(v, v).y;
					}
					return usrP.user(v, v).x;
				});
			}else if (o instanceof Circle){
				var val = o.graphicsData[0].shape;
				mapXY = usrP.user(val.x, val.y);
				valArray = [mapXY.x, mapXY.x];
			}
			proccessedParticleObjArray.push({m:o.mark, r:o.radius, v:valArray, c:o.constraint, p:o.property});
		});
		
		proccessedObjArray = {
			param: QF.setting.parameter,
			sim: QF.setting.simulation,
			particle: proccessedParticleObjArray
		}
	}else if (sTy == 'PATRUS' || sTy == 'CONFEM'){
		if (QF.setting.dataEditorNode.length == 0){
		  QF.setting.dataEditorNode = _.map(QF.setting.nodeObjArray, function(o){
			  mapXY = usrP.user(o.x, o.y);
			  mapXY.constraint == o.oconstraint;
			  return mapXY;
			//return {x:o.x, y:userY(o.y), constraint:o.o.constraint};
		  });
		}
		if (QF.setting.dataEditorElem.length == 0){
		  QF.setting.dataEditorElem=_.map(QF.setting.elementIndexArray, function(o, k){
			return {index:k, prop:o.prop, node1:o.nodes[0], node2:o.nodes[1]};
		  });
		}
		proccessedObjArray = {
			nodes: QF.setting.dataEditorNode,
			members: QF.setting.dataEditorElem
		}
	}
	if (sTy == 'CONFEM'){
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
			nodes: proccessedObjArray.nodes,
			members: proccessedObjArray.members,
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
	//FE
	QF.setting.nodeNoTextArray=[];
	QF.setting.elementIndexArray=[];
	QF.setting.elementNoTextArray=[];
	QF.setting.dataEditorElem=[];
	QF.setting.arrowTextArray=[];
	QF.setting.loadTextArray=[];
	QF.setting.bcTextArray=[];
	QF.setting.nodeObjArray=[];
	QF.setting.dataEditorNode=[];
	QF.setting.dataEditorSpas=[];
	QF.setting.hotEditorSpas.loadData([]);
	
	//DE
	QF.setting.verticesNoTextArray=[];
	QF.setting.spheroRadiusArray=[];
	QF.setting.particleNoTextArray=[];
	QF.setting.deObjArray=[];
	
	var data = (json instanceof Object) ? json : JSON.parse(json);
	data = data[0];
	
	var gui = JSON.parse(data['gui']);
	var sTy = JSON.parse(data['solverType']);
	QF.setting.solverVal = JSON.parse(data['solverVal']);
	var pName = cm.replaceAll(data['pName'], '-', ' ');
	//var userY = cm.toUserPointY(QF.setting.canv.height, QF.setting.rulerOffset, QF.setting.unitVal);
	
	//DESTROY ALL OBJECTS
	stage.removeChildren();
	initAxes();
	initRulerX();
	initRulerY();
	drawGrid("0xb4bcc2");
	initSelectArea();
	initDomainLength();
	initLeftLim();
	initRightLim();
	initBottomLim();
	initTopLim();
	initRulerText();
	
	QF.setting.solverType = sTy;
	console.log(sTy);
	if (sTy == 'CONFEM'){
		//QF.setting.isFESpas=true;
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
			QF.setting.dataEditorSpas.push({
				layer:o.layer, 
				thickness:o.thickness,
				type:(typeof o.type=='undefined')?'REGULAR':o.type, 
				prop:mProp.prop,
				mSubV:mesh.mSubV, 
				mRatioV:mesh.mRatioV, 
				eType:mesh.eType
			});
			QF.setting.hotEditorSpas.loadData(QF.setting.dataEditorSpas);
		});
		
		//CONSTRAINT
		var consId="#spasCons";
		QF.setting.dataConsSpasIC = gui['boundary']['boundICArr'];
		QF.setting.dataConsSpas = gui['boundary']['boundArr'];
		QF.setting.spasConsForm = gui['boundary']['boundAll'];
		
		_.forEach(QF.setting.spasConsForm, function(consObj){
			cm.inValSet(consId,consObj.typeName, consObj.type);
			cm.inValSet(consId,consObj.name, consObj.val);	
		});
		
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
		
	}
	var mapXY;
	if (sTy == 'SPOLY'){
		//C: LOAD PARTICLES
		_.forEach(gui['particle'], function(o){
			var vArr = [];
			for(var x=0, len=o['v'].length; x<len; x+=2){
				mapXY = usrP.system(o['v'][x], o['v'][x+1]);
				//vArr.push({x:o['v'][x], y:userY(o['v'][x+1]), r:o['r'], m:o['m'], c:o['c'], p:o['p']});
				vArr.push({x:mapXY.x, y:mapXY.y, r:o['r'], m:o['m'], c:o['c'], p:o['p']});
			};
			QF.setting.customVerticesArray = vArr;
			lg.drawDEByRightClick();
		});

		//E: LOAD SOLVER
		/*QF.setting.solverSpoly = {
			param: solverVal['param'],
			sim: solverVal['sim']
		};*/
	}else if (sTy == 'PATRUS' || sTy == 'CONFEM'){
		var nodes = gui['nodes'];
		var member = gui['members'];
		_.forEach(nodes, function(n){
			mapXY=usrP.system(n.x, n.y);
			mapXY.constraint=n.constraint;
			lgFE.drawNode(mapXY);
			/*lgFE.drawNode({
				x:n.x,
				y:userY(n.y),
				constraint:n.constraint
			});*/
		});
		
		//REBUILD ELEMENTS
		_.forEach(member, function(o){
			var 
			ind=o.index,
			prop=o.prop,
			n1=o.node1,
			n2=o.node2,
			n3=o.node3,
			n4=o.node4,
			n5=o.node5,
			arr=[n1, n2, n3, n4, n5],
			filteredArray
			;
			
			filteredArray = _.filter(arr, function(n) {
			  return (n != "" && typeof n !== 'undefined');
			});
			
			if (filteredArray.length > 0){
				lgFE.drawElement(filteredArray, false, prop);
			}
		});
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
	cm.hideProgress();
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