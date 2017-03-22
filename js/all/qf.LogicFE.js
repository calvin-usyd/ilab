"use strict";
QF.LogicFE = function(){

//Finite Element
this.toggleNodeNo = function (){
	_.forEach(QF.setting.nodeNoTextArray, function(n){n.visible=QF.setting.nodeNoVisibility;});
}
this.toggleElementNo = function (){
	_.forEach(QF.setting.elementNoTextArray, function(n){n.visible=QF.setting.elementNoVisibility;});
}
this.toggleLoadText = function (){
	_.forEach(QF.setting.arrowTextArray, function(n){n.visible=QF.setting.loadTextVisibility;});
	_.forEach(QF.setting.loadTextArray, function(n){n.visible=QF.setting.loadTextVisibility;});
}
this.toggleBoundaryCondition = function (){
	_.forEach(QF.setting.bcTextArray, function(n){n.visible=QF.setting.bcTextVisibility;});
}
/*
Nodes Obj cannot be removed, 
therefore use following code to update the data:
node.o.refreshCoordinate 
*/
this.removeNodeObjAndNoByIndex = function(ind){
	if (QF.setting.nodeObjArray.length-1 >= ind){
		var nodeO = QF.setting.nodeObjArray[ind].o;
		_.forEach(nodeO.children, function(childO){
			if(childO.name == 'consText'){
				QF.setting.bcTextArray = _.filter(QF.setting.bcTextArray, childO);
				
			}else if (childO.name == 'loadText'){
				QF.setting.loadTextArray = _.filter(QF.setting.loadTextArray, childO);
				
			}else if (childO instanceof QF.Arrow){
				QF.setting.arrowTextArray = _.filter(QF.setting.arrowTextArray, childO);
			}
		});
		_.pullAt(QF.setting.nodeObjArray, ind);
		_.pullAt(QF.setting.nodeNoTextArray, ind);
		nodeO.removeChildren();
		stage.removeChild(nodeO);
	}
}
this.removeNodesNo = function(){
	_.forEach(QF.setting.nodeObjArray, function(o){
		o.o.removeChildren();
	});
	QF.setting.nodeNoTextArray=[];
}
this.removeElementObjAndNo = function(elemObj){
	if (typeof elemObj === 'undefined'){
		return;
	}
	QF.setting.elementIndexArray = _.filter(QF.setting.elementIndexArray, function(o){
		return o.elem != elemObj;
	});
	_.forEach(elemObj.children, function(childO){
		QF.setting.elementNoTextArray = _.filter(QF.setting.elementNoTextArray, function(o){
			return o != childO;
		});
	});
	elemObj.removeChildren();
	stage.removeChild(elemObj);
}
this.removeAllElementObjAndNo = function(){
	//DESTROY ALL ELEMENTS
	_.forEach(stage.children, function(o){
		if (o instanceof QF.Element ){
			o.removeChildren();
			stage.removeChild(o);
		}
	});
	/*_.forEach(QF.setting.elementNoTextArray, function(o){
		stage.removeChild(o);
	});*/
	
	//RE-INIT ELEMENT INDEX
	QF.setting.elementIndexArray = [];
	QF.setting.elementNoTextArray = [];
}
/*
nodeIndexArray = [
	{x:122, y:111}, //Node 1
	{x:14, y:93},  //Node 2
	... //Node N
]
*/
this.drawFEByRightClick = function(isClosed, prop){	
	var	
	nodes = _.uniqWith(QF.setting.nodeObjArrayTemp, _.isEqual),
	nodeIndexArray = []
	;
	if (QF.setting.isFESpas){
		if (nodes.length >= 4){
			lgEditor.setSpasExcel(nodes);
		}else{
			alert('ERROR: At least 4 nodes are required to draw spas model');
			return;
		}
	}
	console.log(nodes);
	nodeIndexArray.push(this.getNodeIndex({x:nodes[0].x, y:nodes[0].y}));
	
	if (nodes.length >= 2)
		nodeIndexArray.push(this.getNodeIndex({x:nodes[1].x, y:nodes[1].y}));
	
	if (nodes.length >= 3)
		nodeIndexArray.push(this.getNodeIndex({x:nodes[2].x, y:nodes[2].y}));
	
	if (nodes.length >= 4)
		nodeIndexArray.push(this.getNodeIndex({x:nodes[3].x, y:nodes[3].y}));
	
	//if (nodes.length >= 2)
		//nodeIndexArray.push(this.getNodeIndex({x:nodes[0].x, y:nodes[0].y}));
	
	//console.log(nodeIndexArray);
	this.drawElement(nodeIndexArray, (nodes.length >= 2), prop);
}
/*
elemType: 3 nodes, 4 nodes, 6 nodes, 8 nodes
*/
this.drawElement = function(nodeIndexArray, isClosed, prop){
	//CHECK IF NODES ARE ENOUGH FOR ELEMENT
	var	highestVal = 0;
	var post = QF.setting.nodeObjArray;
	
	_.forEach(nodeIndexArray, function(v){
		highestVal = (v > highestVal) ? v : highestVal;
	});
	if (highestVal > post.length){
		alert('ERROR: Supplied nodes are not enough to create the element ' + highestVal + '!');
		return;
	}
	//console.log(nodeIndexArray);
	//console.log(post);
	var	x2 = 0, y2 = 0,
		x1 = post[nodeIndexArray[0]-1].x, 
		y1 = post[nodeIndexArray[0]-1].y,
		elem = new QF.Element(),
		elemType = nodeIndexArray.length
	;
	//INVALID ELEMENT IF HAS ONLY 1 NODE
	if (elemType == 1){
		return -1;
	}
	if (prop && prop.color) elem.lineStyle(3, '0x'+prop.color, 1);
	elem.beginFill(0x00FF00, 0.1);
	elem.initElementNo(nodeIndexArray);
	elem.moveTo( x1, y1 );
	
	if (elemType == 6 || elemType == 8){
		elemType = elemType / 2; //CORNERS AND EDGES
	}
	for (var i=1; i<elemType; i++){
		x2=post[nodeIndexArray[i]-1].x;
		y2=post[nodeIndexArray[i]-1].y;
		elem.lineTo(x2, y2);
	}
	//EXTRA NODE, ELEMENT IS CLOSED
	if(isClosed){
		elem.lineTo(x1, y1);		
	}
	stage.addChild(elem);
	
	QF.setting.undoArray.push(elem);
	QF.setting.elementIndexArray.push({elem:elem, nodes:nodeIndexArray, prop:prop});
	//QF.setting.nodeIndexArrayTemp=[];
	QF.setting.nodeObjArrayTemp=[];
	//console.log(QF.setting.elementIndexArray);
}
this.drawNodeSnapGrid = function(mousePos){
	/*mousePos = {
		x:mousePos.x-grid.distX,
		y:mousePos.y+grid.distY
	}*/
	if (QF.setting.snapGrid){
		mousePos = QFUtil.snap2Grid(mousePos, QF.setting.grid);
	}
	this.drawNode(mousePos);
}
this.drawNodeCommon = function(pos, isNewNodeObjArray){
	var nodeIndex = this.getNodeIndex(pos);
	if (nodeIndex == 0){//Do not draw node if already drawn
		var node = new QF.Node();
		if (pos.color) 	node.beginFill(pos.color);
		
		node.drawCircle(pos.x, pos.y, QF.setting.grid.size + 3);
		node.initVerticesNo();
		node.refreshConstraint(pos.constraint);
		stage.addChild(node);
		//if (isNewNodeObjArray) QF.setting.nodeObjArray.push({o:node, x:pos.x-grid.distX, y:pos.y+grid.distY});
		if (isNewNodeObjArray) QF.setting.nodeObjArray.push({o:node, x:pos.x, y:pos.y});
		QF.setting.undoArray.push(node);
	}
	QF.setting.nodeObjArrayTemp.push({x:pos.x, y:pos.y});//Used when right click
}
this.reDrawNode = function(pos){
	this.drawNodeCommon(pos, false);
}
this.drawNode = function(pos){
	this.drawNodeCommon(pos, true);
}
this.getNewNodeForSubdivideQuad = function(node1, node2, node3, node4, sectionCountX, sectionCountY, subType, isExtra){
	var boundaryLen = 2;// -1 < m < 1 , 1-(-1)=2
	var newNodeDistantX = boundaryLen / sectionCountX;
	var newNodeDistantY = boundaryLen / sectionCountY;
	var nodeValueX = -1;
	var nodeValueY = -1;
	var newNodes = [], newNodesIndex = [];
	var k1, k2, k3, k4;
	var counter=0, noSkipX=true, noSkipY=true, isQuad8=false;
	var nodesCount1 = 0;
	
	if (isExtra){
		var divideTotal = 2;
		newNodeDistantX = newNodeDistantX/divideTotal;
		newNodeDistantY = newNodeDistantY/divideTotal;
		if (subType == 'quad8'){
			nodesCount1 = sectionCountX * divideTotal + 1;
			isQuad8 = true;
		}
	}
	while(nodeValueY <= 1){
		if (isExtra && isQuad8){
			if (nodesCount1 == counter){//FOR quad8
				counter=0;
				noSkipY=!noSkipY;
				noSkipX=true;
			}
		}		
		while(nodeValueX <= 1){
			if (noSkipX){
				k1 = 1 / 4 * (1 - nodeValueX) * (1 - nodeValueY);
				k2 = 1 / 4 * (1 + nodeValueX) * (1 - nodeValueY);
				k3 = 1 / 4 * (1 + nodeValueX) * (1 + nodeValueY);
				k4 = 1 / 4 * (1 - nodeValueX) * (1 + nodeValueY);
				newNodes.push({
					x:k1 * node1.x + k2 * node2.x + k3 * node3.x + k4 * node4.x,
					y:k1 * node1.y + k2 * node2.y + k3 * node3.y + k4 * node4.y
				});
			}
			nodeValueX += newNodeDistantX;
			if (isExtra && isQuad8){
				if (!noSkipY){
					noSkipX=!noSkipX;
				}
				counter++;
			}
		}
		nodeValueX = -1;
		nodeValueY += newNodeDistantY;
	}
	return newNodes;
}
this.getNewNodeForSubdivideTri = function(node1, node2, node3, newNodeDistantX, newNodeDistantY){
	var nodeValueX = 0;
	var nodeValueY = 0;
	var newNodes = [];
	var offsetFor9Sec = 0.1;//9 sections; doesn't work without this offset, Thats mystery need to be solved.
	
	while(nodeValueY <= 1 + offsetFor9Sec){
		while(nodeValueX <= (1 - nodeValueY + offsetFor9Sec)){
			newNodes.push({
				x:(node1.x - node3.x) * nodeValueX + (node2.x - node3.x) * nodeValueY + node3.x, 
				y:(node1.y - node3.y) * nodeValueX + (node2.y - node3.y) * nodeValueY + node3.y
			});
			nodeValueX += newNodeDistantX;
		}
		nodeValueX = 0;
		nodeValueY += newNodeDistantY;
	}
	return newNodes;
}
this.subdivideTri = function(sectionCountX, sectionCountY, node1, node2, node3, subType){
	var newNodeDistantX = 1 / sectionCountX;
	var newNodeDistantY = 1 / sectionCountY;
	var newNodes=[], newExtraNodes=[];
	var newNodesIndex=[];
	var divideTotal=1;
	if (subType == 'tri6' || subType == 'quad8'){
		divideTotal=2;
	}
	if (divideTotal == 2)
		newExtraNodes = lgFE.getNewNodeForSubdivideTri(node1, node2, node3, newNodeDistantX/divideTotal, newNodeDistantY/divideTotal);
	
	newNodes = lgFE.getNewNodeForSubdivideTri(node1, node2, node3, newNodeDistantX, newNodeDistantY);
	
	_.forEach((newExtraNodes.length == 0) ? newNodes : newExtraNodes, function(o){
		lgFE.drawNode(o);
	});
	_.forEach(newNodes, function(o){
		newNodesIndex.push(lgFE.getNodeIndex(o));
	});
	
	this.createElementForTriNodes(newNodesIndex, sectionCountX);
}
this.subdivideQuad = function(sectionCountX, sectionCountY, node1, node2, node3, node4, subType){
	var newNodes=[], newExtraNodes=[], newNodesIndex=[];
	
	if (subType == 'tri6' || subType == 'quad8' || subType == 'quad9'){
		newExtraNodes = lgFE.getNewNodeForSubdivideQuad(node1, node2, node3, node4, sectionCountX, sectionCountY, subType, true);
	}
	newNodes = lgFE.getNewNodeForSubdivideQuad(node1, node2, node3, node4, sectionCountX, sectionCountY, subType, false);
	
	_.forEach((newExtraNodes.length == 0) ? newNodes : newExtraNodes, function(o){
		lgFE.drawNode(o);
	});
	_.forEach(newNodes, function(o){
		newNodesIndex.push(lgFE.getNodeIndex(o));
	});
	this.createElementForQuadNodes(newNodesIndex, sectionCountX);
}
this.getNodeIndex = function(node){
	/*var nodeObj;
	for (var i=0, lenN=QF.setting.nodeObjArray.length; i<lenN; ++i){
		nodeObj=QF.setting.nodeObjArray[i];
		if (node.x == nodeObj.x && node.y == nodeObj.y ){
			return i+1;
		}
	}*/
	//OR
	/*return _.findIndex(QF.setting.nodeObjArray, function(n){
		n.x == node.x && n.y == node.y;
	}) + 1;*/
	//OR
	var arr = _.map(QF.setting.nodeObjArray, function(o){
		return {x:o.x, y:o.y};
	});
	return _.findIndex(arr, {x:node.x, y:node.y}) + 1;
}
this.createElementForTriNodes = function(newNodes, sectionCountX){
	//Find all possible slopes, m=deltaY/deltaX
	var elemN = [],
		elemArray = [],
		skipOffset = 0,
		nodeToSkip = sectionCountX,
		thirdNode = sectionCountX+1
	;
	for (var i=0, len=newNodes.length; i<len; ++i){
		if (i == nodeToSkip){
			nodeToSkip = nodeToSkip + (sectionCountX-skipOffset);
			skipOffset++;
			thirdNode--;
			continue;
		}
		
		if (newNodes[i+1] && newNodes[i-thirdNode]){
			elemN=[];
			elemN.push(newNodes[i]);
			elemN.push(newNodes[i+1]);
			elemN.push(newNodes[i-thirdNode]);
			elemN.push(newNodes[i]);
			elemArray.push(elemN);
		}
		if (newNodes[i+1] && newNodes[i+thirdNode]){
			elemN=[];
			elemN.push(newNodes[i]);
			elemN.push(newNodes[i+1]);
			elemN.push(newNodes[i+thirdNode]);
			//elemN.push(newNodes[i]);
			elemArray.push(elemN);
		}
	}
		
		console.log(elemArray);
	for (var i=0, lenN = elemArray.length; i<lenN; ++i){
		var elemObjArray = elemArray[i];
		//console.log(elemObjArray);
		this.drawElement(elemObjArray, true, '');
	}
}
this.createElementForQuadNodes = function(newNodes, sectionCountX){
	//Find all possible slopes, m=deltaY/deltaX
	var elemN = [],
		elemArray = [],
		skipOffset = 1,
		nodeToSkip = sectionCountX,
		thirdNode = sectionCountX+2,
		FourthNode = sectionCountX+1
	;
	for (var i=0, len=newNodes.length; i<len; ++i){
		if (i == nodeToSkip){
			nodeToSkip = nodeToSkip + (sectionCountX+skipOffset);
			continue;
		}
		
		if (newNodes[i+1] && newNodes[i+thirdNode] && newNodes[i+FourthNode]){
			elemN=[];
			elemN.push(newNodes[i]);
			elemN.push(newNodes[i+1]);
			elemN.push(newNodes[i+thirdNode]);
			elemN.push(newNodes[i+FourthNode]);
			//elemN.push(newNodes[i]);
			elemArray.push(elemN);
		}
	}
	for (var i=0, lenN = elemArray.length; i<lenN; ++i){
		var elemObjArray = elemArray[i];
		this.drawElement(elemObjArray, true, '');
	}
}
this.processExtrusion = function(exX, exY, leaveOri){
	exY = -exY;	
	var selecteds = QF.setting.selectedObj,
		elementInd=-1, nodeInd=-1,
		nodeIndexArray = []
	;
	for (var i=0, len=selecteds.length; i<len; ++i){
		if (elementInd > -1 && nodeInd > -1){
			break;
		}
		if (selecteds[i].obj instanceof QF.Element){
			elementInd=i;
			
		}else if (selecteds[i].obj instanceof QF.Node){
			nodeInd=i;
		} 
	}
	
	if (elementInd > -1){//Process element is given priority
		var points = selecteds[elementInd].obj.graphicsData[0].shape.points,
			x1 = points[0],
			y1 = points[1],
			x2 = points[2],
			y2 = points[3]
		;
		
		lgFE.drawNode({x:x1+exX, y:y1+exY});
		nodeIndexArray.push(QF.setting.nodeObjArray.length);//Point 1
		
		lgFE.drawNode({x:x2+exX, y:y2+exY});
		nodeIndexArray.push(QF.setting.nodeObjArray.length);//Point 2
		
		if (leaveOri){//Leave the original nodes, and create new nodes. PROBLEM: DIFFERENT NODES HAVE SAME COORDINATE??
			lgFE.drawNode({x:x2, y:y2});
			nodeIndexArray.push(QF.setting.nodeObjArray.length);//Point 3
			
			lgFE.drawNode({x:x1, y:y1});
			nodeIndexArray.push(QF.setting.nodeObjArray.length);//Point 4

		}else{
			nodeIndexArray.push(lgFE.getNodeIndex({x:x2, y:y2}));//Point 3
			nodeIndexArray.push(lgFE.getNodeIndex({x:x1, y:y1}));//Point 4
		}
		
		nodeIndexArray.push(lgFE.getNodeIndex({x:x1+exX, y:y1+exY}));//Point 1
		
		console.log(nodeIndexArray);
		lgFE.drawElement(nodeIndexArray, false, '');
		
	}else if (nodeInd > -1){//Process node if element not found
		var shape = selecteds[nodeInd].obj.graphicsData[0].shape;
		
		nodeIndexArray.push(lgFE.getNodeIndex({x:shape.x, y:shape.y}));//Point 1
		
		lgFE.drawNode({x:shape.x+exX, y:shape.y+exY});
		nodeIndexArray.push(QF.setting.nodeObjArray.length);//Point 2
		
		lgFE.drawElement(nodeIndexArray, false, '');
	}
	QF.setting.selectedObj = {};
}
this.processSubdivision = function(subX, subY, subType){
	var selectedObj = QF.setting.selectedObj
		,objLen = selectedObj.length
		,hasElementSelected = false
		,points, n1, n2, n3, n4
	;
	if (objLen == 0){
		alert('WARNING: Please select one element!');
	}
	_.forEach(selectedObj, function(o){
		if (o.obj instanceof QF.Element){
			hasElementSelected = true;
			//REMOVE ELEMENT
			lgFE.removeElementObjAndNo(o.obj);
			points = o.obj.graphicsData[0].shape.points;
			
			if (points.length >= 8){
				n1 = {x: points[0], y:points[1]};
				n2 = {x: points[2], y:points[3]};
				n3 = {x: points[4], y:points[5]};
			}
			if (points.length == 8){//Is triangle, last point same as 1st point
				if (subType == 'quad4' || subType == 'quad8' || subType == 'quad9'){
					alert('WARNING: Triangle can only be sub-divided into tri3 or tri6!');
				}else{
					lgFE.subdivideTri(subX, subY, n1, n2, n3, subType);
				}
				
			}else if (points.length == 10){//Is rectangle
				n4 = {x: points[6], y:points[7]};
				if (subType == 'tri3' || subType == 'tri6'){
					lgFE.subdivideTri(subX, subY, n1, n2, n3, n4, subType);
					
				}else if (subType == 'quad4' || subType == 'quad8' || subType == 'quad9'){
					lgFE.subdivideQuad(subX, subY, n1, n2, n3, n4, subType);					
				}
			}
		}
	});
	if (!hasElementSelected){
		alert('WARNING: Only elements can be subdivided!');
	}
}
}
QF.LogicFE.prototype = new QF.LogicFE;
QF.LogicFE.prototype.constructor = QF.LogicFE;
