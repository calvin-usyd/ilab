"use strict";

QF.LogicEditor = function(){
this.resetNodeConsForm = function(id){
	cm.selValCustom(id, ['tx', 'ty', 'tz', 'rx', 'ry', 'rz'], 0);
	cm.inValCustom(id, ['temperature', 'moment', 'lp', 'lq', 'lr'], 0);
}
this.resetElemPropForm = function(id){
	cm.inValCustom(id, ['youngModulus', 'poissonRatio','area','inertia','temp', 'LOF','alpha','moment', 'pressX','pressY','pressZ'], 0);
	cm.selValCustom(id, ['hingeI', 'hingeJ'], 0);
}
this.resetSpolyPropForm = function(id){
	cm.inValCustomArr(id, ['ncs', 'tcs', 'cof', 'cor', 'ncov', 'tcov', 'dcov', 'density'], ['1e4', '1e3', '0.5', '0.0', '400', '40', '0', '1']);		
}
this.getObjbyName = function(arr, name){
	var cO;
	_.forEach(arr, function(o){
		if (o.name == name){
			cO = o;
			return false;
		}
	});
	return cO;	
}
this.getConstraintObjNode = function(consName){
	return lgEditor.getObjbyName(QF.setting.dataConsNode, consName);
}
this.getPropertyObjElem = function(propName){
	return lgEditor.getObjbyName(QF.setting.dataPropFe, propName);
}
this.initCustomConsNode = function(ind){
	if (QF.setting.hasChangedEditorN){
		alert('Please save the changes before editing custom constraint.');
		return;
	}
	var id = "#modalCustomConsNode", 
	nodeO = QF.setting.nodeObjArray[ind].o,
	consO = nodeO.customCons,
	consName = nodeO.constraint;
	
	lgEditor.resetNodeConsForm(id);
	$('#modalEditor').modal('hide');
	cm.inValSet(id, 'index', ind);
	cm.popUp(id);
	
	if (typeof consO === 'undefined'){
		if (consName !== '' && typeof consName !== 'undefined'){
			consO = lgEditor.getConstraintObjNode(consName);
		}else{
			return;
		}
	}
	cm.selValSet(id, 'tx', consO.tx);
	cm.selValSet(id, 'ty', consO.ty);
	cm.selValSet(id, 'tz', consO.tz);
	cm.selValSet(id, 'rx', consO.rx);
	cm.selValSet(id, 'ry', consO.ry);
	cm.selValSet(id, 'rz', consO.rz);
	
	cm.inValSet(id, 'name', consO.name);
	cm.inValSet(id, 'temperature', consO.temperature);
	cm.inValSet(id, 'moment', consO.moment);
	cm.inValSet(id, 'lp', consO.lp);
	cm.inValSet(id, 'lq', consO.lq);
	cm.inValSet(id, 'lr', consO.lr);
}
this.initCustomPropElem = function(ind){
	if (QF.setting.hasChangedEditorElem){
		alert('Please save the changes before editing custom property.');
		return;
	}
	var id = "#modalCustomPropElem",
	elemO = QF.setting.elementIndexArray[ind],
	propO = elemO.customProp,
	propName = elemO.prop;
	
	lgEditor.resetElemPropForm(id);
	$('#modalEditor').modal('hide');
	cm.inValSet(id, 'index', ind);
	cm.popUp(id);
	
	if (typeof propO === 'undefined'){ 
		if (typeof propName !== 'undefined' && propName !== ''){
			propO = lgEditor.getPropertyObjElem(propName);
		}else{
			return;
		}
	}
	cm.inValSet(id,'name', propO.name)
	cm.inValSet(id,'youngModulus', propO.youngModulus)
	cm.inValSet(id,'poissonRatio', propO.poissonRatio)
	cm.inValSet(id,'temp', propO.temp)
	cm.inValSet(id,'LOF', propO.LOF)
	cm.inValSet(id,'alpha', propO.alpha)
	cm.inValSet(id,'moment', propO.moment)
	cm.inValSet(id,'inertia', propO.inertia)
	cm.inSelVal(id, 'type', propO.type)
	cm.inValSet(id,'thickness', propO.thickness)
	cm.inValSet(id,'area', propO.area)
	cm.inCheckSet(id, 'hasHinge', propO.hasHinge)
	cm.inValSet(id,'pressX', propO.pressX)
	cm.inValSet(id,'pressY', propO.pressY)
	cm.inValSet(id,'pressZ', propO.pressZ)
	cm.selValSet(id, 'hingeI', propO.hingeI);
	cm.selValSet(id, 'hingeJ', propO.hingeJ);
}
this.setHotSpasSetting = function(){
	QF.setting.hotEditorSpas.updateSettings({
        columns: [
			{data:"layer",width: 80,type:'numeric',format:'0'},
			{data:"type",width: 100,type: 'dropdown', source:['REGULAR', 'LEAK']},
			{data:"thickness",width: 100},
			{data:"prop",width: 150,type: 'dropdown', source:_.map(QF.setting.dataPropSpas, function(o){return o.name;})},
			{data:"mSubV",width: 120},
			{data:"mRatioV",width: 120},
			{data:"eType",width: 180,type: 'dropdown', source:['3 - Linear Triangle', '4 - Quadratic Triangle', '6 - Linear Quad', '8 - Quadratic Quad']}
		]
	});	
}
this.setSpasExcel = function(nodes){
	var thick = nodes[2].y - nodes[1].y;
	if (thick == 0){
		thick = nodes[1].y - nodes[0].y;
	}
	QF.setting.dataEditorSpas = _.filter(QF.setting.dataEditorSpas, function(o){
		return o.layer !== '' && o.layer !== null ;
	});

	QF.setting.dataEditorSpas.push({
		layer:QF.setting.dataEditorSpas.length+1,
		thickness:Math.abs(thick), 
		type:'REGULAR', 
		prop:'', 
		mSubV:'6', 
		mRatioV:'1',
		eType:'8 - Quadratic Quad'
	});
	QF.setting.hotEditorSpas.loadData(QF.setting.dataEditorSpas);
}
this.genSpasGuifromExcel = function(){
	var filteredEmptyEditorSpas = _.filter(QF.setting.dataEditorSpas, function(n) {
	  return (n.layer !== "" && typeof n.layer !== 'undefined' );
	});
	var filteredEmptyEditorElem = _.filter(QF.setting.dataEditorElem, function(n) {
	  return (n.index !== "" && typeof n.index !== 'undefined' );
	});
	var totalPartsPerLayer = 1;//middle, left, right
	var totalLayersCreated = filteredEmptyEditorElem.length/totalPartsPerLayer;
	
	var 
		dimension = parseInt(QF.setting.spasEditorForm.layerDimension),
		iRWidth = 0,
		iRHeight = 0,
		iLWidth = 0,
		iLHeight = 0,
		startX = QF.setting.canv.width/2 - dimension/2,
		startY = QF.setting.canv.height/2,
		lastX = 0,
		lastY = 0,
		mainNode1 = 0,
		mainNode2 = 0,
		mainNode3 = 0,
		mainNode4 = 0,
		thickness = 0
	;
	var currentLayer=0;
	var startCreateElemForRefreshCoordinate=true;
	var nIndex=0;
	
	_.forEach(QF.setting.dataEditorSpas, function(layerObj){
		if (layerObj.layer != ''){
			thickness = parseInt(layerObj.thickness);
			lastX = startX;
			lastY = startY+thickness;
			
			//Main Layer
			mainNode1 = {x:startX, y:startY};
			mainNode2 = {x:startX+dimension, y:startY};
			mainNode3 = {x:startX+dimension, y:lastY};
			mainNode4 = {x:lastX, y:lastY};
			
			//At bottom most layer, the inclination layer Y same as main layer y
			if (currentLayer == filteredEmptyEditorSpas.length-1){
				//incRightNode3.y = incLeftNode3.y = mainNode3.y;
			}
			//if (doRefreshCoordinate && typeof QF.setting.nodeObjArray[nIndex] != 'undefined'){
			if (currentLayer < totalLayersCreated){
				if (currentLayer === 0){
					console.log([mainNode1, mainNode2, mainNode3, mainNode4]);
					QF.setting.nodeNoTextArray=[];
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(mainNode1);
					nodeObj.x = mainNode1.x;
					nodeObj.y = mainNode1.y;
					
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(mainNode2);
					nodeObj.x = mainNode2.x;
					nodeObj.y = mainNode2.y;
					
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(mainNode3);
					nodeObj.x = mainNode3.x;
					nodeObj.y = mainNode3.y;
					
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(mainNode4);
					nodeObj.x = mainNode4.x;
					nodeObj.y = mainNode4.y;
					
				}else{
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(mainNode3);
					nodeObj.x = mainNode3.x;
					nodeObj.y = mainNode3.y;
					
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(mainNode4);
					nodeObj.x = mainNode4.x;
					nodeObj.y = mainNode4.y;
				}
			}

			if (currentLayer >= totalLayersCreated){
				lgFE.drawNode(mainNode1);
				lgFE.drawNode(mainNode2);
				lgFE.drawNode(mainNode3);
				lgFE.drawNode(mainNode4);
				lgFE.drawFEByRightClick();			
			}

			if(startCreateElemForRefreshCoordinate && currentLayer == totalLayersCreated-1){
				startCreateElemForRefreshCoordinate=false;
				console.log('startCreateElemForRefreshCoordinate');
				//REBUILD ELEMENTS
				_.forEach(QF.setting.dataEditorElem, function(o){
					var 
					ind=o.index,
					prop=o.prop,
					n1=o.node1,
					n2=o.node2,
					n3=o.node3,
					n4=o.node4,
					arr=[n1, n2, n3, n4, n1]
					;
					if (filteredArray.length > 0){
						lgFE.drawElement(arr, true, prop);
					}
				});
			}
			startX = lastX;
			startY = lastY;
			currentLayer++;
		}
	});
}
this.processSavedEditor = function(){
	//var systemY = cm.toUserPoint(QF.setting.canv.height, QF.setting.rulerOffset, QF.setting.unitVal);
	//SPAS EDITOR
	var id="#spasEditorForm";
	QF.setting.spasEditorForm={
		layerDimension:cm.inVal(id, 'layerDimension'),
		allLayersSubdivision:cm.inCheckVal(id, 'allLayersSubdivision'),
		horizontalSubdivision:cm.inVal(id, 'horizontalSubdivision'),
		verticalSubdivision:cm.inVal(id, 'verticalSubdivision'),
		allLayersRatio:cm.inCheckVal(id, 'allLayersRatio'),
		horizontalRatio:cm.inVal(id, 'horizontalRatio'),
		verticalRatio:cm.inVal(id, 'verticalRatio')
	}
	
	//Todo: Should redraw element
	//lgEditor.genSpasGuifromExcel();
	//QF.setting.dataEditorSpas.push({layer:DES[DES.length-1].layer+1,thickness:'1', type:'REGULAR', prop:'1', mSubV:'6', mRatioV:'1',eType:'8 - Quadratic Quad'});
	var DES = QF.setting.dataEditorSpas;
	QF.setting.dataEditorSpas.push({layer:''});	
	
	//NODES EDITOR
	/*if (QF.setting.nodeObjArray.length > 0){
		if (QF.setting.hasChangedEditorN){
			lgFE.removeNodesNo();
		}
		lgFE.removeAllElementObjAndNo();
	}*/
	if (QF.setting.hasChangedEditorN){
		var mapXY;
		var nIndex=0;
		
		//REBUILD NODES
		lgFE.removeNodesNo();
		lgFE.removeAllNodeObjAndNo();
		//lgFE.removeAllElementObjAndNo();
		
		QF.setting.dataEditorNode = _.filter(QF.setting.dataEditorNode, function(o){
			return (typeof o.x!=='undefined' && typeof o.y!=='undefined' && o.x !== "" && o.y !== "" && o.x !== null && o.y !== null && !o.delete);
		});
		
		_.forEach(QF.setting.dataEditorNode, function(o){
			mapXY=mapP.system(o.x, o.y);
			mapXY.c=o.constraint;
			mapXY.u={x:o.x, y:o.y};
		    mapXY.cC = o.customCons;
		    mapXY.pC = lgEditor.getConstraintObjNode(o.constraint);
			lgFE.drawNode(mapXY);			
		});
		lg.fitModelToScreen();
	}

	if (QF.setting.hasChangedEditorN || QF.setting.hasChangedEditorElem){
		if (QF.setting.nodeObjArray.length < 2){
			alert('ERROR: Cannot create element! There must be at least 2 nodes to create an element.');
			return;
		}
		//DESTROY ALL ELEMENTS
		lgFE.removeAllElementObjAndNo();
		
		//REBUILD ELEMENTS
		console.log('processSavedEditor');
		_.forEach(QF.setting.dataEditorElem, function(o){
			lgFE.drawElement([o.node1, o.node2, o.node3, o.node4, o.node5, o.node6, o.node7, o.node8], true, o.prop);
		});
	}
	
	if (QF.setting.hasChangedEditorSpoly){
		var spolyPos=[], currentInd=0, deAttr=[], isLastRec=false;
		
		//REBUILD PARTICLES
		var 
		ind,
		mrk,
		rad,
		con,
		vCount,
		mapXY;
		console.log(_.clone(QF.setting.dataEditorSpoly));
		console.log(QF.setting.dataEditorSpoly);
		_.forEach(QF.setting.dataEditorSpoly, function(o, k){
			//x=o.x;
			//y=systemY(o.y);			
			if (o.x === null || o.y === null){
				return false;
			}
			if (o.index !== ''){
				ind=o.index;
				mrk=o.mark;
				rad=o.radius;
				con=o.constraint;
				prop=o.prop;
				vCount=(o.numOfVertices-1) + k;
			}
			mapXY = mapP.system(o.x, o.y);
			mapXY.r=rad;
			mapXY.m=mrk;
			mapXY.c=con;
			mapXY.p=prop;
			deAttr.push(mapXY);
			console.log(deAttr);
			//deAttr.push({x:x, y:y, r:rad, m:mrk, c:con, p:prop});
			
			if (k==vCount){
				var deObj = QF.setting.deObjArray[ind];
				
				if (typeof deObj === 'undefined'){
					QF.setting.customVerticesArray=deAttr;
					lgDE.drawDEByRightClick();//IS ADDED NEW DATA
				}else{
					//REMOVE ALL OLD VERTICES' NUMBER & SPHERORADIUS
					deObj.removeChildren();
					/*_.forEach(deObj.children, function(c){
						deObj.removeChild(c);
					});*/
					QF.setting.verticesNoTextArray=[];
					QF.setting.spheroRadiusArray=[];
					QF.setting.particleNoTextArray=[];
					
					deObj.refreshCoordinate(deAttr);//IS UPDATED OLD DATA
				}
				deAttr=[];
			}
			currentInd = ind;
		});
	}
	QF.setting.hasChangedEditorN = QF.setting.hasChangedEditorElem = QF.setting.hasChangedEditorSpoly = false;
}
this.loadEditor = function(){
	//hotExN.loadData(Handsontable.helper.createSpreadsheetData(2, 2));
	//var userY = cm.toUserPointY(QF.setting.canv.height, QF.setting.rulerOffset, QF.setting.unitVal);
	var excelEditorDe=[];
	//EDITOR ELEMENT
	
	QF.setting.hotEditorElem.updateSettings({
        columns: [
		{data:"index",width: 100},
		{data:"prop",width: 100,type: 'dropdown', source:_.map(QF.setting.dataPropFe, function(o){return o.name;})},
		{data:"node1",width: 100,type: 'numeric'},
		{data:"node2",width: 100,type: 'numeric'},
		{data:"node3",width: 100,type: 'numeric'},
		{data:"node4",width: 100,type: 'numeric'},
		{data:"node5",width: 100,type: 'numeric'},
		{data:"node6",width: 100,type: 'numeric'},
		{data:"node7",width: 100,type: 'numeric'},
		{data:"node8",width: 100,type: 'numeric'},
		{data:"customProp",renderer: QF.setting.actionRendererElemProp},
		{data:"delete",type:'checkbox'}
	]});
	var excelEditorElem=_.map(QF.setting.elementIndexArray, function(o, k){
		if (o.nodes[0] != null && o.nodes[1] != null){
		  return {
			  index:k+1, prop:o.prop,  presetProp:lgEditor.getPropertyObjElem(o.prop), customProp:o.customProp, delete: false, 
			  node1:o.nodes[0], node2:o.nodes[1], node3:o.nodes[2], node4:o.nodes[3], node5:o.nodes[4], node6:o.nodes[5], node7:o.nodes[6], node8:o.nodes[7]
		  };
		};
	});
	
	if (excelEditorElem.length == 0){
		excelEditorElem=[{index:'', prop:'', node1:'', node2:'', node3:'', node4:'', node5:'', node6:'', node7:'', node8:'', presetProp:'', customProp:'', delete: false}];
	}
	QF.setting.dataEditorElem=excelEditorElem;
	QF.setting.hotEditorElem.loadData(excelEditorElem);
	var mapXY;
	
	//EDITOR SPOLY
	
	QF.setting.hotEditorSpoly.updateSettings({
        columns:[
		{data:"index",width: 100},
		{data:"constraint",width: 100,type: 'dropdown', source:_.map(QF.setting.dataConsParticle, function(o){return o.name;})},
		{data:"prop",width: 100,type: 'dropdown', source:_.map(QF.setting.dataPropSpoly, function(o){return o.name;})},
		{data:"mark",width: 100},
		{data:"radius",width: 150,type:'numeric',format:'0.00'},
		{data:"numOfVertices",width: 150},
		{data:"x",width: 50,type:'numeric',format:'0.00'},
		{data:"y",width: 50,type:'numeric',format:'0.00'}
	]});
	
	_.forEach(QF.setting.deObjArray, function(o, k){
		var 
		pts,
		len=0 
		;
		
		if (o instanceof Circle){
			var circleShape = o.graphicsData[0].shape;
			pts = [circleShape.x, circleShape.y];
			
		}else if (o instanceof Polygon){
			var pointArray = o.currentPath.shape.points;
			pts = pointArray;
		}
		len=pts.length;
		mapXY = mapP.user(pts[0], pts[1]);
		//excelEditorDe.push({index:k, constraint:o.constraint, prop:o.property, mark:o.mark, radius:o.radius, numOfVertices:len/2, x:pts[0], y:userY(pts[1])});
		excelEditorDe.push({index:k, constraint:o.constraint, prop:o.property, mark:o.mark, radius:o.radius, numOfVertices:len/2, x:mapXY.x, y:mapXY.y});
			
		for (var x=2; x<len; x+=2){
			//excelEditorDe.push({index:'', constraint:'', prop:'', mark:'', radius:'', numOfVertices:'', x:pts[x], y:userY(pts[x+1])});
			mapXY = mapP.user(pts[x], pts[x+1]);
			excelEditorDe.push({index:'', constraint:'', prop:'', mark:'', radius:'', numOfVertices:'', x:mapXY.x, y:mapXY.y});
		}
	});
	if (excelEditorDe.length == 0){
		excelEditorDe=[{index:'', constraint:'', prop:'', mark:'', radius:'', numOfVertices:'', x:'', y:''}];
	}
	QF.setting.dataEditorSpoly=excelEditorDe;
	QF.setting.hotEditorSpoly.loadData(excelEditorDe);
	
	//EDITOR NODE
	
	QF.setting.hotEditorNode.updateSettings({
        columns: [
		{data:"x",width: 100,type:'numeric',format:'0.00'},
		{data:"y",width: 100,type:'numeric',format:'0.00'},
		{data:"constraint",width: 100,type: 'dropdown', source:_.map(QF.setting.dataConsNode, function(o){return o.name;})},
		{data:"customCons",renderer: QF.setting.actionRendererNodeCons},
		{data:"delete",type:'checkbox'}
	]});
	
	var excelEditorNode = _.map(QF.setting.nodeObjArray, function(o){
		//var mapO = dynamicP.user(o.x, o.y);
		//var doubleMap = mapP.user(mapO.x, mapO.y);
		//mapO.constraint = o.o.constraint;
		//mapO.delete = false;
		//mapO.u = {x:o.x, y:o.y};
		//return mapO;
		return {x:o.u.x, y:o.u.y, constraint:o.o.constraint, customCons:o.o.customCons, delete:false};
	});
	if (excelEditorNode.length == 0){
		excelEditorNode=[{x:'', y:'', constraint:'', customCons:'', pC:'', delete: false}];
	}
	QF.setting.dataEditorNode=excelEditorNode;
	QF.setting.hotEditorNode.loadData(excelEditorNode);
	
	//SPAS
	lgEditor.setHotSpasSetting();
}
}
QF.LogicEditor.prototype = new QF.LogicEditor;
QF.LogicEditor.prototype.constructor = QF.LogicEditor;