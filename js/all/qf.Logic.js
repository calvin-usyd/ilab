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
		temp:prop.temp, 					LOF:prop.LOF, 						alpha:prop.alpha, ro:prop.ro,
		moment:prop.moment, 				thickness:prop.thickness, 			delete:false
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
		consLongId:o.consLongId,rx:cons.rx, 					ry:cons.ry, 		name:cons.name,
		rz:cons.rz, 			temparature:cons.temparature, 	moment:cons.moment, 
		lp:cons.lp, 			lq:cons.lq, 					delete:false
	};
}








QF.Logic = function(){

//Discrete Element
var dot = new Dot(),
polygon = new Polygon(),
circle = new Circle(),
cm = QF.Common();
;

this.drawDEByRightClick = function(){
	var 
	elem = new Polygon(),
	cVAObj = QF.setting.customVerticesArray,
	cVALen = cVAObj.length,
	x = cVAObj[0].x,
	y = cVAObj[0].y,
	m = cVAObj[0].m,
	r = cVAObj[0].r,
	c = cVAObj[0].c,
	p = cVAObj[0].p,
	x1 = x, y1 = y, 
	x2, y2,
	isClosed = x==cVAObj[cVALen-1].x && y==cVAObj[cVALen-1].y
	;
	
	if (cVALen == 1){
		elem = new Circle()
		elem.beginFill(0x00FF00);
		elem.drawCircle(x, y, 3);
		elem.drawSpheroRadiusCircle(x, y, r);
		
	}else if (cVALen == 2){
		x2 = cVAObj[1].x;
		y2 = cVAObj[1].y;
		
		elem.lineStyle(2, 0x00FF00, 1);
		elem.moveTo( x, y );
		elem.lineTo( x2, y2 );
		elem.drawSpheroRadius(x, y, x2, y2, r);
		elem.initVerticesNo();
		
	}else if (cVALen >= 3){
		////IF LAST == FIRST OF VERTEX POSITION, THEN
		if (isClosed)	elem.beginFill(0x00FF00, 0.5);//// IS CLOSED
		else			elem.lineStyle(2, 0x00FF00, 1);//// IS OPENED
		
		elem.moveTo( x1, y1 );
		for (var i=1; i < cVALen; i++){
			x2 = cVAObj[i].x;
			y2 = cVAObj[i].y;
			elem.lineTo( x2, y2 );
			elem.drawSpheroRadius(x1, y1, x2, y2, r);
			x1=x2;
			y1=y2;
		}
		elem.initVerticesNo();
		
		if (isClosed)	elem.drawSpheroRadius(x2, y2, x, y, r);
	}
	
	elem.mark=m;
	elem.radius=r;
	elem.constraint=c;
	elem.property=p;
	elem.initParticleNo();
	stage.addChild(elem);
	//console.log(elem);
	QF.setting.customVerticesArray = [];
	QF.setting.undoArray.push(elem);
	QF.setting.deObjArray.push(elem);
	_.forEach(QF.setting.dotArray, function(c){ stage.removeChild(c); });
}
this.drawVertices = function(mousePos){
	/*mousePos = {
		x:mousePos.x-grid.distX,
		y:mousePos.y+grid.distY
	}*/	
	if (QF.setting.snapGrid){
		mousePos = QFUtil.snap2Grid(mousePos, grid);
	}
	var cva = QF.setting.customVerticesArray,
		cvo = cva[cva.length-1];

	////DRAW VERTEX IF:
	////1. NO VERTEX
	////2. CURRENT VERTEX POSITION != PREVIOUS VERTEX POSITION 
	if (typeof cvo === 'undefined' || (mousePos.x != cvo.x || mousePos.y != cvo.y )){
		this.drawDot(mousePos);
		QF.setting.customVerticesArray.push({x:mousePos.x, y:mousePos.y});
	}
}
this.drawDot = function(mousePos){
	var dot = new Dot();
	dot.beginFill(0xff00dd);
	dot.drawCircle(mousePos.x, mousePos.y, grid.size + 3);
	dot.endFill();
	stage.addChild(dot);
	
	QF.setting.dotArray.push(dot);
}
this.toggleSpheroRadius = function(){
	_.forEach(QF.setting.spheroRadiusArray, function(o){o.visible = QF.setting.spheroRadiusVisibility});
}
this.toggleVerticesNo = function(){
	_.forEach(QF.setting.verticesNoTextArray, function(o){o.visible = QF.setting.verticesNoVisibility});
}
this.toggleParticleNo = function(){
	_.forEach(QF.setting.particleNoTextArray, function(o){console.log(o); o.visible = QF.setting.particleNoVisibility});
}






//All Element
this.getMergedModifiedCons = function(){
	var mergedData=[], cons, hasParticleEmpty=true, hasNodeEmpty=true;
	_.forEach(QF.setting.modifiedRecordConsNode, function(o){
		cons = {name:o.name, rx:o.rx, ry:o.ry, rz:o.rz, temparature:o.temparature, lp:o.lp, lq:o.lq, moment:o.moment};
		
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
	alert('Data successfully added/updated!');
}
this.getMergedModifiedProp = function(){
	var mergedData=[], prop;
	_.forEach(QF.setting.modifiedRecordPropFe, function(o){
		prop
		= (o.area=='' && o.moment=='' && o.poissonRatio=='' && o.thickness=='' && o.youngModulus=='' && o.pType=='')
		? ''
		: {name:o.name, area:o.area, moment:o.moment, poissonRatio:o.poissonRatio, thickness:o.thickness, youngModulus:o.youngModulus, type:o.pType};
		
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
this.copyIncrement = function(count, row, distant){
	var objs = QF.setting.selectedObj,
	len = objs.length,
	thisObj
	;
	
	/*if (len>=1){
		obj = objs[0].obj;
	}*/
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
	}
}
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
}
this.undo = function(){
	var o = QF.setting.undoArray[QF.setting.undoArray.length-1];
	lg.removeObjByType(o, true);
	QF.setting.undoArray = _.dropRight(QF.setting.undoArray);
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