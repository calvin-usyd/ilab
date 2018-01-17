"use strict";
var 
prop,
cons
;
var filterSpoly = function(o){
	if (o.type == 'spoly'){
		prop = JSON.parse(o.prop);
		if (prop instanceof Object) 
			QF.setting.dataPropSpoly.push({
				propLongId:o.propLongId, 	name:prop.name, 	type:o.type, 	
				ncs:prop.ncs, 				tcs:prop.tcs, 		cof:prop.cof, 		
				cor:prop.cor, 				ncov:prop.ncov, 	tcov:prop.tcov, 
				dcov:prop.dcov, 			density:prop.density, delete:false
			});			
	}
	if (o.type == 'spas'){
		prop = JSON.parse(o.prop);
		if (prop instanceof Object) 
			QF.setting.dataPropSpas.push({
				propLongId:o.propLongId, 	name:prop.name, 	type:o.type, 	mpId:prop.mpId,
				MOLECULAR_DIFFUSION:prop.MOLECULAR_DIFFUSION, 	SPECIFIC_STORAGE:prop.SPECIFIC_STORAGE, 		HYDRAULIC_CONDUCTIVITY:prop.HYDRAULIC_CONDUCTIVITY, 		
				DISPERSIVITY:prop.DISPERSIVITY, 				DRY_DENSITY:prop.DRY_DENSITY, 	POROSITY:prop.POROSITY, 
				DECAY_HALF_LIFE:prop.DECAY_HALF_LIFE, 			ADD_SEEPAGE:prop.ADD_SEEPAGE, 	TRANSIENT_INSTANTANEOUS_FRACTION:prop.TRANSIENT_INSTANTANEOUS_FRACTION, 
				TRANSIENT_SORPTION_RATE:prop.TRANSIENT_SORPTION_RATE,DIFFUSION:prop.DIFFUSION,	LINEAR_SORPTION_COEFFICIENT:prop.LINEAR_SORPTION_COEFFICIENT,
				TRANSMISSIVITY:prop.TRANSMISSIVITY, 			SORPTION:prop.SORPTION,			REPLACE_SEEPAGE:prop.REPLACE_SEEPAGE, 
				MASS_INTERLAYER_DISCONTINUITY_TOP:prop.MASS_INTERLAYER_DISCONTINUITY_TOP, 		MASS_INTERLAYER_DISCONTINUITY_BOTTOM:prop.MASS_INTERLAYER_DISCONTINUITY_BOTTOM,
				delete:false
			});			
	}
	return (o.type !== 'spoly' && o.type !== 'spas');
}
var mapProp = function(o){
	prop = JSON.parse(o.prop);
	return {
		propLongId:o.propLongId, 			name:prop.name,						type:o.type, 	pType:prop.type, 
		youngModulus:prop.youngModulus, 	poissonRatio:prop.poissonRatio, 	area:prop.area, 
		temp:prop.temp, 					LOF:prop.LOF, 						alpha:prop.alpha, 
		inertia:prop.inertia, 				thickness:prop.thickness, 			moment:prop.moment,
		hingeI:prop.hingeI, 				hingeJ:prop.hingeJ, 				delete:false,
		pressX:prop.pressX, 				pressY:prop.pressY, 				pressZ:prop.pressZ
	};
}
var filterParticleCons = function(o){
	if (o.type == 'particle'){
		cons = JSON.parse(o.cons);
		if (cons instanceof Object) 
			QF.setting.dataConsParticle.push({	
				consLongId:o.consLongId, 		
				vxTag:cons.vxTag, 	vy:cons.vy, 	vyTag:cons.vyTag,	vx:cons.vx, 	vphiTag:cons.vphiTag, 	vphi:cons.vphi,	name:cons.name,
				fxTag:cons.fxTag, 	fy:cons.fy, 	fyTag:cons.fyTag, 	fx:cons.fx, 	fphiTag:cons.fphiTag, 	fphi:cons.fphi, delete:false
			});			
	}
	return (o.type !== 'particle');	
}
var mapNodeCons = function(o){
	cons = JSON.parse(o.cons);
	return {
		consLongId:o.consLongId,	name:cons.name, moment:cons.moment||0, temperature:cons.temperature||0, 	
		tx:cons.tx||0, 				ty:cons.ty||0,		tz:cons.tz||0,
		rx:cons.rx||0, 				ry:cons.ry||0,		rz:cons.rz||0,
		lp:cons.lp||0, 				lq:cons.lq||0, 		lr:cons.lr||0,			delete:false
	};
}



QF.Logic = function(){

//All Element
this.getMergedModifiedCons = function(){
	var mergedData=[], cons, hasParticleEmpty=true, hasNodeEmpty=true;
	_.forEach(QF.setting.modifiedRecordConsNode, function(o){
		cons = {
			name:o.name, 
			tx:o.tx, ty:o.ty, tz:o.tz, 
			rx:o.rx, ry:o.ry, rz:o.rz, 
			temperature:o.temperature, 
			lp:o.lp, lq:o.lq,  lr:o.lr, 
			moment:o.moment
		};
		
		_.forEach(cons, function(v){
			if (v!=='' && typeof v !== 'undefined'){
				hasNodeEmpty = false;
			}
		});
		if (hasNodeEmpty){
			cons='';
		}
		mergedData.push([{
			consLongId:o.consLongId, 
			type:'node', 
			delete:o.delete, 
			cons:cons
		}]);
	});
	_.forEach(QF.setting.modifiedRecordConsParticle, function(o){
		cons = {name:o.name, vxTag:o.vxTag, vyTag:o.vyTag, vphiTag:o.vphiTag, fxTag:o.fxTag, fyTag:o.fyTag, fphiTag:o.fphiTag, vx:o.vx, vy:o.vy, vphi:o.vphi, fx:o.fx, fy:o.fy, fphi:o.fphi};
		
		_.forEach(cons, function(v){
			if (v!=='' && typeof v !== 'undefined'){
				hasParticleEmpty = false;
			}
		});
		if (hasParticleEmpty){
			cons='';
		}
		mergedData.push({
			consLongId:o.consLongId, 
			type:'particle', 
			delete:o.delete, 
			cons:cons
		});
	});
	
	QF.setting.modifiedRecordConsNode=[];
	QF.setting.modifiedRecordConsParticle=[];
	console.log(_.flatten(mergedData));
	return _.flatten(mergedData);
}
this.loadConsList = function(json){
	var consArray = (json instanceof Object) ? json : JSON.parse(json);
	QF.setting.dataConsParticle=[];
	
	QF.setting.dataConsNode = _.chain(consArray.constraintMaps).filter(filterParticleCons).map(mapNodeCons).value();
	
	QF.setting.hotConsNode.loadData(QF.setting.dataConsNode);
	QF.setting.hotConsParticle.loadData(QF.setting.dataConsParticle);
	
	_.forEach(QF.setting.nodeObjArray, function(nodeO){
		_.forEach(QF.setting.dataConsNode, function(consO){
			if(nodeO.o.constraint == consO.name){
				//REMOVE EXISTING CHILDREN
				console.log(nodeO.o.children);
				var childrenToKeep = [];
				_.forEach(nodeO.o.children, function(childO){
					if(childO.name == 'consText'){
						QF.setting.bcTextArray = _.filter(QF.setting.bcTextArray, childO);
						
					}else if (childO.name == 'loadText'){
						QF.setting.loadTextArray = _.filter(QF.setting.loadTextArray, childO);
						
					}else if (childO instanceof QF.Arrow){
						QF.setting.arrowTextArray = _.filter(QF.setting.arrowTextArray, childO);
						
					}else{
						childrenToKeep.push(childO);
					}
				});
				nodeO.o.removeChildren();
				_.forEach(childrenToKeep, function(childO){
					nodeO.o.addChild(childO);
				});
			}
		});
	});
	_.forEach(QF.setting.nodeObjArray, function(nodeO){
		nodeO.o.refreshConstraint(nodeO.o.constraint);
	});
}
this.loadSpasCons = function(){
	if (typeof QF.setting.dataConsSpasIC == 'undefined' ){
		QF.setting.dataConsSpasIC=[];
	}
	if ( QF.setting.dataConsSpasIC.length == 0){
		for (var i=0; i<5; i++){
			QF.setting.dataConsSpasIC.push({'layer':'' });
		}
	}
	if (QF.setting.dataConsSpas.length == 0){
		for (var i=0; i<5; i++){
			QF.setting.dataConsSpas.push({'layer':'' });
		}
	}
	var bcTypeExcel = [];
	var icTypeExcel = [];
	var bcTypeVal = QF.setting.bcType[QF.setting.solverVal.analysis];
	var byTypeArr = QF.setting.solverVal.analysis.split('');
	var topAllBCType = $('select[name=topAllBCType]');
	var bottomAllBCType = $('select[name=bottomAllBCType]');
	topAllBCType.empty();
	bottomAllBCType.empty();
	
	if (bcTypeVal == 'wf' || bcTypeVal == 'both'){
		var opt = $('<option selected>');
		opt
		.attr('value', 'TOTAL_HEAD')
		.html('Total Head')
		.clone().appendTo(topAllBCType)
		.clone().appendTo(bottomAllBCType);
		
		var opt = $('<option>');
		opt
		.attr('value', 'PRESSURE_HEAD')
		.html('Pressure Head')
		.clone().appendTo(topAllBCType)
		.clone().appendTo(bottomAllBCType);
		
		var opt = $('<option>');
		opt
		.attr('value', 'DARCY_VELOCITY')
		.html('Darcy Velocity')
		.clone().appendTo(topAllBCType)
		.clone().appendTo(bottomAllBCType);

		bcTypeExcel.push('TOTAL_HEAD');
		bcTypeExcel.push('PRESSURE_HEAD');
		bcTypeExcel.push('DARCY_VELOCITY');
		
		//FOR INITIAL CONDITION
		if (byTypeArr[1] == '2'  ){//2 = time dependent
			icTypeExcel.push('TOTAL_HEAD');
			icTypeExcel.push('PRESSURE_HEAD');
		}
	}
	if (bcTypeVal == 'cm' || bcTypeVal == 'both'){
		var opt = $('<option>');
		
		if (topAllBCType.find('option').length == 0){
			opt = $('<option selected>');
		}
		opt
		.attr('value', 'CONCENTRATION')
		.html('Concentration')
		.clone().appendTo(topAllBCType)
		.clone().appendTo(bottomAllBCType);
		
		var opt = $('<option>');
		opt
		.attr('value', 'MASS_FLUX')
		.html('Mass Flux')
		.clone().appendTo(topAllBCType)
		.clone().appendTo(bottomAllBCType);

		bcTypeExcel.push('CONCENTRATION');
		bcTypeExcel.push('MASS_FLUX');
		
		//FOR INITIAL CONDITION
		if (byTypeArr[1] == '2' || byTypeArr[1] == '3' ){//2 = time dependent, 3 = mixed
			icTypeExcel.push('CONCENTRATION');
		}
	}
	
	//SET ALL SURFACES FORM
	var consFormArr = QF.setting.spasConsForm; 
	var id="#spasCons";
	_.forEach(consFormArr, function(o){
		cm.selValSet(id, o.typeName, o.type);
	});
	
	//SET EXCEL CONS LAYERS DROP DOWN
	var 
	excelColumnConsSpas=[
		{data:"layer",width: 150},
		{data:"leftBCType",width: 200 ,type: 'dropdown', source:bcTypeExcel},
		{data:"leftBCValue",width: 150},
		{data:"rightBCType",width: 200 ,type: 'dropdown', source:bcTypeExcel},
		{data:"rightBCValue",width: 150}	
	],
	excelColumnConsSpasIC=[
		{data:"layer",width: 150},
		{data:"ICType",width: 200 ,type: 'dropdown', source:icTypeExcel},
		{data:"ICValue",width: 150}
	];
	QF.setting.hotConsSpas.updateSettings({
        columns: excelColumnConsSpas
    })
	QF.setting.hotConsSpasIC.updateSettings({
        columns: excelColumnConsSpasIC
    })
	QF.setting.hotConsSpas.loadData(QF.setting.dataConsSpas);
	QF.setting.hotConsSpasIC.loadData(QF.setting.dataConsSpasIC);
}
this.loadConsListWithAlert = function(json){
	lg.loadConsList(json);
	alert('Data successfully added/updated!');
}
this.loadPropList = function (json){
	var propArray;
	QF.setting.dataPropSpoly=[];
	QF.setting.dataPropSpas=[];
	
	propArray = (json instanceof Object) ? json : JSON.parse(json);
	
	QF.setting.dataPropFe = _.chain(propArray.propMaps).filter(filterSpoly).map(mapProp).value();
	QF.setting.hotPropFe.loadData(QF.setting.dataPropFe);
	QF.setting.hotPropDe.loadData(QF.setting.dataPropSpoly);
	QF.setting.hotPropSpas.loadData(QF.setting.dataPropSpas);
}
this.loadPropListWithAlert = function (json){
	lg.loadPropList(json);
	cm.hideProgress();
	alert('Data successfully added/updated!');
}
this.renderHotTab = function(containerId, hot){
	lg.renderHot(containerId, hot, 'tab');
}
this.renderHotModal = function(containerId, hot){
	lg.renderHot(containerId, hot, 'modal');	
}
this.renderHot = function(containerId, hot, type){
	$(containerId).on('shown.bs.'+type, function (e) {
		QF.setting[hot].render();
	});
}
this.getMergedModifiedProp = function(){
	var mergedData=[], prop;
	_.forEach(QF.setting.modifiedRecordPropFe, function(o){
		prop
		= (o.area=='' && o.moment=='' && o.poissonRatio=='' && o.thickness=='' && o.youngModulus=='' && o.pType=='' && o.inertia=='' && o.pressX=='' && o.pressY=='' && o.pressZ=='')
		? ''
		: {name:o.name, area:o.area, moment:o.moment, poissonRatio:o.poissonRatio, thickness:o.thickness, youngModulus:o.youngModulus, type:o.pType, inertia:o.inertia, alpha:o.alpha, LOF:o.LOF, temp:o.temp, hingeI:o.hingeI, hingeJ:o.hingeJ, pressX:o.pressX, pressY:o.pressY, pressZ:o.pressZ};
		
		mergedData.push([{
			propLongId:o.propLongId, 
			type:o.type, 
			delete:o.delete, 
			property:prop
		}]);
	});
	_.forEach(QF.setting.modifiedRecordPropDe, function(o){
		prop 
		= (o.ncs=='' && o.tcs==''&& o.cof==''&& o.cor==''&& o.ncov==''&& o.tcov==''&& o.dcov==''&& o.density=='')
		? ''
		: {name:o.name, ncs:o.ncs, tcs:o.tcs, cof:o.cof, cor:o.cor, ncov:o.ncov, tcov:o.tcov, dcov:o.dcov, density:o.density};
		
		mergedData.push({
			propLongId:o.propLongId, 
			type:o.type,
			delete:o.delete,
			property:prop
		});
	});
	
	_.forEach(QF.setting.modifiedRecordPropSpas, function(o){
		prop = {
			mpId:o.mpId, name:o.name, MOLECULAR_DIFFUSION:o.MOLECULAR_DIFFUSION, SPECIFIC_STORAGE:o.SPECIFIC_STORAGE, HYDRAULIC_CONDUCTIVITY:o.HYDRAULIC_CONDUCTIVITY, 
			DISPERSIVITY:o.DISPERSIVITY, DRY_DENSITY:o.DRY_DENSITY, POROSITY:o.POROSITY, DECAY_HALF_LIFE:o.DECAY_HALF_LIFE, ADD_SEEPAGE:o.ADD_SEEPAGE, 
			TRANSIENT_INSTANTANEOUS_FRACTION:o.TRANSIENT_INSTANTANEOUS_FRACTION, TRANSIENT_SORPTION_RATE:o.TRANSIENT_SORPTION_RATE
		};
		
		mergedData.push({
			propLongId:o.propLongId, 
			type:o.type,
			delete:o.delete,
			property:prop
		});
	});
	
	QF.setting.modifiedRecordPropFe=[];
	QF.setting.modifiedRecordPropDe=[];
	QF.setting.modifiedRecordPropSpas=[];
	console.log(_.flatten(mergedData));
	return _.flatten(mergedData);
}


//Common
this.getMousePos = function(){
	if (typeof renderer !== 'undefined')
		return renderer.plugins.interaction.mouse.global;
}
this.getMappedCoord = function(coord){
	if (typeof dynamicP !== 'undefined'){
		var mapXY = dynamicP.system(coord.x, coord.y);
		var userS = QF.setting.userScreen;

		if (typeof userS.max !== 'undefined'){
		  dynamicP = QFUtil.toFitPoint(canv.height, QF.setting.rulerOffset, userS.max.x, userS.min.x, userS.max.y, userS.min.y);
		  mapXY=dynamicP.user(coord.x, coord.y);
		  mapXY=mapP.system(mapXY.x, mapXY.y);
		}
		return mapXY;
	}
	return {x:null, y:null};
}
this.fitModelToScreen = function(){	
	lg.fitModelToScreenPos('standard');
}
this.getMaxMin = function(arr){
	var xArr=[], yArr=[];
	_.forEach(arr, function(o){
		xArr.push(o.x);
		yArr.push(o.y);
	});
	return {
		max : {x:_.max(xArr), y:_.max(yArr)},
		min : {x:_.min(xArr), y:_.min(yArr)}
	};	
}
this.processModel2CancasPos = function(){
	var pArr, xArr=[], yArr=[], clonedNodes = _.clone(QF.setting.nodeObjArray);
	_.forEach(clonedNodes, function(o){
		xArr.push(o.x);
		yArr.push(o.y);
	});
	var maxmin = {
		max : {x:_.max(xArr), y:_.max(yArr)},
		min : {x:_.min(xArr), y:_.min(yArr)}
	};
	var sizeX = maxmin.max.x - maxmin.min.x;
	var sizeY = maxmin.max.y - maxmin.min.y;
	var modelDiameter = (sizeX > sizeY) ? sizeX : sizeY;
	var canvasDiameter = (canv.width < canv.height) ? canv.width : canv.height;
	var scale = canvasDiameter / modelDiameter / QF.setting.elementIndexArray.length * 0.7;
	var previousNode = clonedNodes[0];
	var distantInModel, distantInCanvas, angleRad, scaledPointObj, scaledPointArr=[], offsetPointArr=[];
	
	_.forEach(clonedNodes, function(o){
		distantInModel = QFUtil.distantBtwPoints(previousNode, o);
		if (distantInModel == 0){
			scaledPointArr.push({x:o.x, y:canv.height-o.y, o:o.o, u:o.u});
		}else{
			distantInCanvas = distantInModel*scale;
			angleRad = QFUtil.angleBtwPoints(previousNode, o);
			scaledPointObj = QFUtil.pointByDistant(o, distantInCanvas, angleRad, canv.height);
			scaledPointObj.o = o.o;
			scaledPointObj.u = o.u;
			scaledPointArr.push(scaledPointObj);
		}
		console.log('distantInModel='+distantInModel+', distantInCanvas='+distantInCanvas+' angleRad='+angleRad);
		//console.log(distantInCanvas);
		//console.log(angleRad);
	});
	var canvasMaxmin = lg.getMaxMin(scaledPointArr);
	var offsetX = 40;
	var offsetY = 0;
	if (canvasMaxmin.max.y < canv.height && canvasMaxmin.min.y > 0){
		/*Do nothing*/
	}else{
		offsetY = 20;
		if (canvasMaxmin.max.y > canv.height){/*At the bottom of the canvas*/
			offsetY += (canvasMaxmin.max.y - canv.height);
		}
		else if (canvasMaxmin.min.y < 0){/*At the top of the canvas*/
			offsetY = -20;
			offsetY += (canvasMaxmin.min.y);
		}
	}
	offsetPointArr = _.map(scaledPointArr, function(o){
		return {
			x:o.x - canvasMaxmin.min.x + offsetX,
			y:o.y - offsetY,
			u:o.u,
			o:o.o
		};
	});	
	console.log(scaledPointArr);
	console.log(offsetPointArr);
	return offsetPointArr;
}
this.fitModelToScreenPos = function(position){
	if (QF.setting.deObjArray.length > 0){//DE
		QF.setting.verticesNoTextArray=[];
		QF.setting.spheroRadiusArray=[];
		QF.setting.particleNoTextArray=[];
	}
	if (QF.setting.nodeObjArray.length > 0){
		//REBUILD NODES
		//dynamicP = QFUtil.toFitPoint(canv.height, QF.setting.rulerOffset, QF.setting.userScreen.max.x, QF.setting.userScreen.min.x, QF.setting.userScreen.max.y, QF.setting.userScreen.min.y);
		var mapXY={};
		var offsetPointArr = lg.processModel2CancasPos();
		lgFE.removeAllNodeObjAndNo();
		_.forEach(offsetPointArr, function(o){
			/*mapXY=dynamicP.system(o.x, o.y);
			if (position === 'center'){
				mapXY=dynamicP.systemCenter(o.x, o.y);
			}*/
			mapXY.x = o.x;
			mapXY.y = o.y;
			mapXY.c=o.o.constraint;
			mapXY.u=o.u;
			lgFE.drawNode(mapXY);
		});
		
		//REBUILD ELEMENTS
		var newIndElem = [];
		var nIndexInE = lgFE.minMaxNodeIndexInElem();
		var cloneElem = _.clone(QF.setting.elementIndexArray);
		var resetIndexInE = QF.setting.nodeObjArray.length < nIndexInE.max;
		lgFE.removeAllElementObjAndNo();
		
		//RESET NODES INDEX NUMBER IN ELEMENT
		_.forEach(cloneElem, function(o){
			newIndElem = [];
			_.forEach(o.nodes, function(indVal){
				newIndElem.push((resetIndexInE) ? indVal - nIndexInE.min + 1 : indVal);
			});
			lgFE.drawElement(newIndElem, true, o.prop);
		});
		//initRulerText();
	}
	QF.setting.nodeObjArrayTemp=[];
	renderer.render(stage);
}
this.snapToPoint = function(mousePos){
	var snapP = {x:-100, y:-100};
	var xNear = false, scanDist=20;
	
	if (QF.setting.nodeObjArray.length == 0){
		return mousePos;
	}else {//if (QF.setting.isFE || QF.setting.isFESpas){
		_.forEach(QF.setting.nodeObjArray, function(o){
			
			if (o.x - mousePos.x < scanDist && o.x - mousePos.x > -scanDist){
				snapP.x = o.x;
				xNear = true;
			}
			if ((o.y - mousePos.y < scanDist && o.y - mousePos.y > -scanDist) && xNear){
				snapP.y = o.y;
				return false;//BREAK THE LOOP
			}else{
				xNear = false;
				snapP.x = -100;
				snapP.y = -100;
			}
		});
		if (snapP.x == -100 || snapP.y == -100){
			return mousePos;
		}
	}
	return snapP;
}
this.copyIncrement = function(count, row, distant){
	var objs = QF.setting.selectedObj,
	len = objs.length,
	thisObj
	;
	_.every(objs, function(o){
		if (o.obj instanceof Polygon || o.obj instanceof Circle ){
			thisObj = o.obj;
			return true;//BREAK THE LOOP
		}
	});
	
	var propArray = [];
	
	if (thisObj instanceof Circle){
		var circleShape = thisObj.graphicsData[0].shape;
		propArray = circleShape;
		
	}else if (thisObj instanceof Polygon){
		var pointArray = thisObj.currentPath.shape.points;
		propArray = pointArray;
	}
	
	var particle, tempUndoArray = [];
	
	var newXPosition =0,
		newYPosition =0;
		
	console.log(count);
	console.log(thisObj);
	for (var c=0; c<count; c++){
		
		particle = thisObj.clone();
		console.log(particle);
		newXPosition += distant;
		
		if (c % row == 0){
			newXPosition = 0;
			newYPosition += distant;
		}
		particle.initCopyNewPosition(propArray, newXPosition, newYPosition, thisObj.radius, thisObj.mark, thisObj.constraint, thisObj.property);
		stage.addChild(particle);
		QF.setting.customVerticesArray = [];
		QF.setting.deObjArray.push(particle);
		QF.setting.undoArray.push(particle);
		/*
		physicProp = thisObj.physicProp;
		physicProp.mark = '1';
		particle.physicProp = physicProp;
		
		tempUndoArray[tempUndoArray.length] = particle.uuid;
		*/
	}
	//console.log(stage);
	//undoArray[undoArray.length] = tempUndoArray;
}
this.deleteObj = function(){
	console.log(QF.setting.selectedObj);
	console.log(QF.setting.selectedObj.length);
	if (QF.setting.selectedObj.length == 0) {
		alert('No objects were selected.');
	
	}else if (confirm("Are you sure to delete selected object?")){
		_.forEach(QF.setting.selectedObj, function(o){
			lg.removeObjByType(o.obj, false);
		});		
		QF.setting.selectedObj = [];
		lg.fitModelToScreen();
	}
}/*
this.delSelected = function(){
}
this.scaleUp = function(){
	stage.scale.x+=0.2;	
	stage.scale.y+=0.2;	
}
this.scaleDown = function(){
	stage.scale.x-=0.2;
	stage.scale.y-=0.2;
}
this.moveUp = function(){
	stage.y+=10;
}
this.moveDown = function(){
	stage.y-=10;
}
this.moveRight = function(){
	stage.x-=10;
}
this.moveLeft = function(){
	stage.x+=10;
}*/
this.undo = function(){
	var o = QF.setting.undoArray[QF.setting.undoArray.length-1];
	lg.removeObjByType(o, true);
	QF.setting.undoArray = _.dropRight(QF.setting.undoArray);
	renderer.render(stage);
}
this.removeObjByType = function(o, isInOrder){
	stage.removeChild(o);
	
	if (o instanceof Polygon){
		if (isInOrder){
			var pointArray = o.currentPath.shape.points;
			QF.setting.verticesNoTextArray = _.dropRight(QF.setting.verticesNoTextArray, pointArray.length / 2);
		}else{
			QF.setting.verticesNoTextArray = _.filter(QF.setting.verticesNoTextArray, function(verticeObj){
				return verticeObj.parent !== o;
			});
		}		
	}
	if (o instanceof Circle || o instanceof Polygon){
		if (isInOrder){
			QF.setting.deObjArray = _.dropRight(QF.setting.deObjArray);
			QF.setting.particleNoTextArray = _.dropRight(QF.setting.particleNoTextArray);
		}else{
			QF.setting.particleNoTextArray = _.filter(QF.setting.particleNoTextArray, function(textObj){
				return textObj.parent!==o;
			});
			_.pull(QF.setting.deObjArray, o);
		}
	}else if (o instanceof QF.Element){
		if (isInOrder){
			QF.setting.elementIndexArray = _.dropRight(QF.setting.elementIndexArray);
			QF.setting.elementNoTextArray = _.dropRight(QF.setting.elementNoTextArray);
		}else{
			QF.setting.elementIndexArray = _.filter(QF.setting.elementIndexArray, function(elemObj){
				return elemObj.elem!==o;
			});
			QF.setting.elementNoTextArray = _.filter(QF.setting.elementNoTextArray, function(textObj){
				return textObj.parent!==o;
			});
		}
		
	}else if (o instanceof QF.Node){
		if (isInOrder){
			QF.setting.nodeObjArray = _.dropRight(QF.setting.nodeObjArray);
			QF.setting.nodeNoTextArray = _.dropRight(QF.setting.nodeNoTextArray);
		}else{
			var ind=-1;
			var nodeArr=[];
			QF.setting.nodeNoTextArray = _.filter(QF.setting.nodeNoTextArray, function(nodeTextObj){
				return nodeTextObj == o.children[0];
			});
			QF.setting.nodeObjArray = _.filter(QF.setting.nodeObjArray, function(nodeObj, nodeInd){
				if (nodeObj.o===o){
					ind = o.children[0].text;//4, 2
					return false;
				}
				return true;
			});
				console.log(ind);
			QF.setting.elementIndexArray = _.filter(QF.setting.elementIndexArray, function(elemObj, particleInd){
				nodeArr = elemObj.nodes;
				console.log(nodeArr);
				nodeArr = _.filter(nodeArr, function(nodeInd){
					return nodeInd == parseInt(ind);
				});
				console.log(nodeArr);
				if (nodeArr.length > 0){
					stage.removeChild(elemObj.elem);
					return false;					
				};
				return true;
			});
		}
	}	
}
this.moveSelected = function(x, y){
	polygon.position = {x:20, y:20};
	var children = polygon.children;
	
	for (var i=0, len=children.length; i<len; ++i){
		//children[i].position = {x:20, y:20};
	}
}
this.loadImageList = function(json){
	var imgArray = (json instanceof Object) ? json : JSON.parse(json);
	
	if (imgArray[0] == 'fail'){
		alert(imgArray[1]);
		return;
	}
	
	var imageListHolder = $('#imageListHolder');
	imageListHolder.empty();
	
	QF.setting.imageUploaded = imgArray.length;
	
	_.forEach(imgArray, function(o){
		var imgHolder = $('#imgHolder').clone();
		//imgHolder.attr('id', o.id).removeClass('hide');
		imgHolder.removeClass('hide');
		
		var img = imgHolder.find('img');
		img.attr('src', o.url).attr('id', o.id).attr('onclick', 'loadToCanvas("'+o.id+'")');
		
		var trash = imgHolder.find('.imgTrash');
		trash.attr('onclick', 'deleteImg("'+o.id+'")');
		
		imgHolder.appendTo(imageListHolder);
	});
	
}
}
QF.Logic.prototype = new QF.Logic;
QF.Logic.prototype.constructor = QF.Logic;