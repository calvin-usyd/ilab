"use strict";

QF.LogicEditor = function(){
this.genSpasGui = function(){
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
		/*incLeftNode1 = 0,
		incLeftNode2 = 0,
		incLeftNode3 = 0,
		incLeftNode4 = 0,
		incRightNode1 = 0,
		incRightNode2 = 0,
		incRightNode3 = 0,
		incRightNode4 = 0,*/
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
			
			/*iRWidth = parseInt(layerObj.incRightWidth);
			iRHeight = parseInt(layerObj.incRightHeight);
			incRightNode1 = {x:mainNode2.x, y:mainNode2.y};
			incRightNode2 = {x:mainNode2.x + iRWidth, y:mainNode2.y - iRHeight};
			incRightNode3 = {x:mainNode2.x + iRWidth, y:mainNode2.y - iRHeight + thickness};
			incRightNode4 = {x:mainNode3.x, y:mainNode3.y};

			iLWidth = parseInt(layerObj.incLeftWidth);
			iLHeight = parseInt(layerObj.incLeftHeight);
			incLeftNode1 = {x:mainNode1.x, y:mainNode1.y};
			incLeftNode2 = {x:mainNode4.x, y:mainNode4.y};
			incLeftNode3 = {x:mainNode4.x - iLWidth, y:mainNode4.y - iLHeight};
			incLeftNode4 = {x:mainNode1.x - iLWidth, y:mainNode4.y - iLHeight - thickness};
			console.log({mainNode1, mainNode2, mainNode3, mainNode4});
			console.log({incRightNode1, incRightNode2, incRightNode3, incRightNode4});
			console.log({incLeftNode1, incLeftNode2, incLeftNode3, incLeftNode4});*/
			
			//At bottom most layer, the inclination layer Y same as main layer y
			if (currentLayer == filteredEmptyEditorSpas.length-1){
				//console.log('isBottomMostLayer');
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
					
					/*var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(incRightNode2);
					nodeObj.x = incRightNode2.x;
					nodeObj.y = incRightNode2.y;
					
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(incRightNode3);
					nodeObj.x = incRightNode3.x;
					nodeObj.y = incRightNode3.y;
					
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(incLeftNode3);
					nodeObj.x = incLeftNode3.x;
					nodeObj.y = incLeftNode3.y;
					
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(incLeftNode4);
					nodeObj.x = incLeftNode4.x;
					nodeObj.y = incLeftNode4.y;*/
				}else{
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(mainNode3);
					nodeObj.x = mainNode3.x;
					nodeObj.y = mainNode3.y;
					
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(mainNode4);
					nodeObj.x = mainNode4.x;
					nodeObj.y = mainNode4.y;
					
					/*var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(incRightNode3);
					nodeObj.x = incRightNode3.x;
					nodeObj.y = incRightNode3.y;
					
					var nodeObj = QF.setting.nodeObjArray[nIndex++];
					nodeObj.o.refreshCoordinate(incLeftNode3);
					nodeObj.x = incLeftNode3.x;
					nodeObj.y = incLeftNode3.y;*/
					
				}
			}

			if (currentLayer >= totalLayersCreated){
				lgFE.drawNode(mainNode1);
				lgFE.drawNode(mainNode2);
				lgFE.drawNode(mainNode3);
				lgFE.drawNode(mainNode4);
				lgFE.drawFEByRightClick();
				
				//Inclination Right
				/*lgFE.drawNode(incRightNode1);
				lgFE.drawNode(incRightNode2);
				lgFE.drawNode(incRightNode3);
				lgFE.drawNode(incRightNode4);
				lgFE.drawFEByRightClick();
				
				//Inclination Left
				lgFE.drawNode(incLeftNode1);
				lgFE.drawNode(incLeftNode2);
				lgFE.drawNode(incLeftNode3);
				lgFE.drawNode(incLeftNode4);
				lgFE.drawFEByRightClick();
				console.log(QF.setting.elementIndexArray);*/
				
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
					//n5=o.node5,
					arr=[n1, n2, n3, n4, n1],
					filteredArray
					;
					
					filteredArray = _.filter(arr, function(n) {
					  return (n != "" && typeof n !== 'undefined');
					});
					
					if (filteredArray.length > 0){
						lgFE.drawElement(filteredArray, prop);
					}
				});
				console.log(QF.setting.elementIndexArray);
			}
			startX = lastX;
			startY = lastY;
			currentLayer++;
		}
	});
}
this.processSavedEditor = function(){
	var systemY = cm.toUserPointY(QF.setting.canv.height);
	
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
	
	if (QF.setting.nodeObjArray.length > 0){
		lgFE.removeNodesNo();
		lgFE.removeElementObjAndNo();
	}
	
	lgEditor.genSpasGui();
	
	var DES = QF.setting.dataEditorSpas;
	//QF.setting.dataEditorSpas.push({layer:DES[DES.length-1].layer+1,thickness:'1', type:'REGULAR', prop:'1', mSubV:'6', mRatioV:'1',eType:'8 - Quadratic Quad'});
	QF.setting.dataEditorSpas.push({layer:''});	
	
	//NODES EDITOR
	if (QF.setting.hasChangedEditorN){
		var nIndex=0, doRecreateNode=false;
		
		if (QF.setting.nodeObjArray.length != QF.setting.dataEditorNode.length){
			doRecreateNode = true;
		}
		//REBUILD NODES
		//QF.setting.nodeNoTextArray=[];
		_.forEach(QF.setting.dataEditorNode, function(o){
			var 
			c=o.constraint,
			x=o.x,
			y=systemY(o.y),
			node=QF.setting.nodeObjArray[nIndex]
			;
			
			//NEW DATA ADDED
			if (doRecreateNode){
				lgFE.drawNode({x:x, y:y});
			}else{
				//EXISTING DATA UPDATED
				node.o.removeChildren();
				/*_.forEach(node.o.children, function(o){
					node.o.removeChild(o);
				});*/
				
				node.o.refreshCoordinate({x:x, y:y, c:c});
				node.x=x;
				node.y=y;
				nIndex++;
			}
		});
	}
		
	if (QF.setting.hasChangedEditorN || QF.setting.hasChangedEditorElem){
		//DESTROY ALL ELEMENTS
		lgFE.removeElementObjAndNo();
		
		//REBUILD ELEMENTS
		_.forEach(QF.setting.dataEditorElem, function(o){
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
				lgFE.drawElement(filteredArray, prop);
			}
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
		x, y
		
		_.forEach(QF.setting.dataEditorSpoly, function(o, k){
			x=o.x;
			y=systemY(o.y);			
			
			if (o.index !== ''){
				ind=o.index;
				mrk=o.mark;
				rad=o.radius;
				con=o.constraint;
				prop=o.prop;
				vCount=(o.numOfVertices-1) + k;
			}
			
			deAttr.push({x:x, y:y, r:rad, m:mrk, c:con, p:prop});
			
			if (k==vCount){
				var deObj = QF.setting.deObjArray[ind];
				
				if (typeof deObj === 'undefined'){
					QF.setting.customVerticesArray=deAttr;
					lg.drawDEByRightClick();//IS ADDED NEW DATA
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
	var userY = cm.toUserPointY(QF.setting.canv.height);
	var excelEditorDe=[];
	//EDITOR ELEMENT
	var excelEditorElem=_.map(QF.setting.elementIndexArray, function(o, k){
		return {index:k, prop:o.prop, node1:o.nodes[0], node2:o.nodes[1], node3:o.nodes[2], node4:o.nodes[3], node5:o.nodes[4]};
	});
	
	if (excelEditorElem.length == 0){
		excelEditorElem=[{index:'', prop:'', node1:'', node2:'', node3:'', node4:'', node5:''}];
	}
	QF.setting.dataEditorElem=excelEditorElem;
	QF.setting.hotEditorElem.loadData(excelEditorElem);
	
	//EDITOR SPOLY
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
		console.log(pts);
		excelEditorDe.push({index:k, constraint:o.constraint, prop:o.property, mark:o.mark, radius:o.radius, numOfVertices:len/2, x:pts[0], y:userY(pts[1])});
			
		for (var x=2; x<len; x+=2){
			excelEditorDe.push({index:'', constraint:'', prop:'', mark:'', radius:'', numOfVertices:'', x:pts[x], y:userY(pts[x+1])});
		}
	});
	if (excelEditorDe.length == 0){
		excelEditorDe=[{index:'', constraint:'', prop:'', mark:'', radius:'', numOfVertices:'', x:'', y:''}];
	}
	QF.setting.dataEditorSpoly=excelEditorDe;
	QF.setting.hotEditorSpoly.loadData(excelEditorDe);
	
	//EDITOR NODE
	var excelEditorNode = _.map(QF.setting.nodeObjArray, function(o){
		return {x:o.x, y:userY(o.y), constraint:o.o.constraint};
	});
	if (excelEditorNode.length == 0){
		excelEditorNode=[{x:'', y:'', constraint:''}];
	}
	QF.setting.dataEditorNode=excelEditorNode;
	QF.setting.hotEditorNode.loadData(excelEditorNode);
	
	//EDITOR SPAS
	if (QF.setting.dataEditorSpas.length == 0){
		QF.setting.dataEditorSpas=[{layer:1,thickness:'1', type:'REGULAR', prop:'1', mSubV:'6', mRatioV:'1',eType:'8 - Quadratic Quad'}];
	}
	QF.setting.hotEditorSpas.loadData(QF.setting.dataEditorSpas);
}
}
QF.LogicEditor.prototype = new QF.LogicEditor;
QF.LogicEditor.prototype.constructor = QF.LogicEditor;