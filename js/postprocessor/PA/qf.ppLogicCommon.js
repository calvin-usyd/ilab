"use strict";

QF.ppLogicCommon = function(){

var data=null, dispVisibility=false;
this.loadAll = function(){
	cm.loadProgress();
	$.ajax({
		url:QF.ppSetting.url[$('#solver').attr('data')] + $('#projName').attr('data'),
		type: "POST",
		success:ppLg.loadModel
	});
}
this.loadModel = function(json){
	cm.hideProgress();
	if (data == null){
		data = cm.getJsonObj(json);
	}
	if (data[0] == 'Danger'){
		alert(data[1]);
		return;
	}
	var 
	memberArr = ppUtil.processStr2Arr(data.memberArr),
	memberForceArr = ppLg.noNotaMemberForce(ppUtil.processStr2Arr(data.memberForceArr)),
	newNodeCoor = ppLg.getNewNodeDisp(
		ppUtil.processStr2Arr(data.nodePointArr), 
		ppUtil.processStr2Arr(data.nodeDispArr), 
		ppUtil.processStr2Arr(data.nodeForceArr)
	);
	console.log(data);

	QF.ppSetting.memberCount = memberArr.length;
	ppLg.drawModel(newNodeCoor, memberArr);
	//lg.fitModelToScreenPos('center');
	ppLg.drawMemberDiagram(memberForceArr, newNodeCoor, memberArr);
	ppLg.drawSymbols(newNodeCoor);
	renderer.render(stage);
}
this.toggleView = function(type){
	var arrDiagram=[], arrContour=[];
	
	if (type === 'dof') 
		arrDiagram = QF.ppSetting.meshDofArr;
	else if (type === 'shear') {
		arrDiagram = QF.ppSetting.meshShearArr;
		arrContour = QF.ppSetting.meshShearContourArr;
	}
	else if (type === 'moment') {
		arrDiagram = QF.ppSetting.meshMomentArr;
		arrContour = QF.ppSetting.meshMomentContourArr;
	}
	else if (type === 'axial') {
		arrDiagram = QF.ppSetting.meshAxialArr;
		arrContour = QF.ppSetting.meshAxialContourArr;
	}
	else if (type === 'displacement') {
		arrContour = QF.ppSetting.meshDispArr;
		this.dispVisibility = !arrContour[0].visible;
	}
	ppLg.toggleMeshVisibility(arrDiagram);
	ppLg.toggleMeshVisibility(arrContour);
	ppLg.toggleHeatmapVisibility();
	
	renderer.render(stage);
}
this.drawModel = function(newNodeCoor, memberArr){
	var xArr=[], yArr=[], nodeO;
	_.forEach(newNodeCoor, function(o){
		xArr.push(o.x);
		yArr.push(o.y);
	});
	dynamicP = QFUtil.toFitPoint(canv.height, QF.setting.rulerOffset, _.max(xArr), _.min(xArr), _.max(yArr)*1.5, _.min(yArr));
	//QF.ppSetting.scaledCoor = lg.processModel2CancasPos();
	_.forEach(newNodeCoor, function(node){
		nodeO = dynamicP.systemCenter(node.x, node.y);
		nodeO.c = node.c;
		nodeO.i = node.i;
		lgFE.drawNode(nodeO);		
		//lgFE.drawNode(QF.ppSetting.scaledCoor);		
	});
	_.forEach(memberArr, function(member, ind){
		lgFE.drawElement([member[1], member[2]], false);
	});
	QF.setting.info.nodeCount = QF.setting.nodeObjArray.length;
	QF.setting.info.elementCount = QF.setting.elementIndexArray.length;
}
this.loadModelDispAmplifer = function(value){
	stage.removeChildren();
	lgFE.removeAllNodeObjAndNo();
	lgFE.removeAllElementObjAndNo();
//	QF.setting.nodeObjArray=[];
	//QF.setting.elementIndexArray=[];
	//QF.setting.undoArray=[];
	
	ppLg.toggleHeatmapVisibility(false);
	QF.ppSetting.meshShearArr = [];
	QF.ppSetting.meshShearContourArr = [];
	QF.ppSetting.meshMomentArr = [];
	QF.ppSetting.meshMomentContourArr = [];
	QF.ppSetting.meshAxialArr = [];
	QF.ppSetting.meshAxialContourArr = [];
	
	QF.ppSetting.dispAmplifyY = (value==1) ? value : (value*value*5);
	ppLg.loadModel();
}
this.toggleMeshVisibility = function(arr, visible){
	_.forEach(arr, function(o){
		o.visible = visible | !o.visible;
	});
}
this.memberForceMappedBy = function(arr, type){
	return _.map(arr, function(m){
		return m[type];
	});
}
this.diagramScale = function(arr, type){
	var sorted = _.sortBy(arr);
	var max = sorted[arr.length-1];
	if (sorted[0] < 0 && -sorted[0] > max){
		max = -sorted[0];
	}
	return Math.ceil(max/window.innerHeight*4);
}
this.getMemberColr = function(memberForceMapped, htmlElemId){
	var memberForceSorted = _.sortBy(memberForceMapped);
	var min=memberForceSorted[0], max=memberForceSorted[QF.ppSetting.memberCount-1];
	var hm = heatmap();
	hm.setColorPalette(HeatmapConfig);
	hm.setData(min, max, (max-min==0) ? 0 : 15);
	hm.renderBarById(htmlElemId);
	return hm.getColors(memberForceMapped);
}
this.getNewNodeCoorMap = function(newNodeArr){
	var arr=[];
	_.forEach(newNodeArr, function(nodeO){
		return arr[nodeO.i]={x:nodeO.x, y:nodeO.y, dispX:nodeO.dispX, dispY:nodeO.dispY};
	});
	return arr;
}
this.getMemberIndMap = function(memberArr){
	var arr=[];
	_.forEach(memberArr, function(memO){
		arr[memO[0]] = {i:memO[1], j:memO[2]};
	});
	return arr;
}
this.drawSymbols = function(nodeArr){
	var sym, node, len = nodeArr.length, type=$('#solver').attr('data');
	console.log(nodeArr);
	_.forEach(nodeArr, function(o, i){
		node = dynamicP.systemCenter(o.x, o.y);
		sym = new QF.Symbol();

		if(o.c.rx == 0 && o.c.ry == 1){
			sym.fixedY();
			
		}else if(o.c.rx == 1 && o.c.ry == 1){
			if (type == 'PATRUS'){
				sym.fixedXY();
			}else{
				if (i == 0){
					sym.rightWall();
					node.x = node.x-10;
					node.y = node.y+10;
				}else if(i == len-1){
					sym.leftWall();
					node.x = node.x+10;
					node.y = node.y-10;
				}
			}
		}
		if (o.c.hi == 1){
			sym.hinge();
			node.x = node.x;
			node.y = node.y;
			
		}
		sym.position.set(node.x, node.y);
		stage.addChild(sym);
	});
}
this.drawElemDisplacement = function(meshElemDisp, memberColr, nodeDisp1, nodeDisp2, ind){
	meshElemDisp.lineStyle(3, (memberColr) ? "0x"+memberColr.colorHex : 0x000);
	if (ind == 0){
		meshElemDisp.moveTo(nodeDisp1.x, nodeDisp1.y);
	}
	meshElemDisp.lineTo(nodeDisp2.x, nodeDisp2.y);
}
this.drawElemContour = function(meshElemContour, memberColr, node1, node2, ind){
	meshElemContour.lineStyle(3, (memberColr) ? "0x"+memberColr.colorHex : 0x000);
	if (ind == 0){
		meshElemContour.moveTo(node1.x, node1.y);
	}
	meshElemContour.lineTo(node2.x, node2.y);
}
this.showData = function(fileName){
	window.open('/data/'+$('#user').attr('data')+'/'+$('#projName').attr('data')+'/'+fileName,'_blank');
}
/*
this.initHotData = function(nodeForceArr, memberForceArr, memberArr, dispArr){	
	QF.setting.hotNodesForce.loadData(_.map(nodeForceArr, function(o){
		return {nodeIndex:o[0], nForceX:o[1], nForceY:o[2]};
	}));
	QF.setting.hotElemForce.loadData(_.map(memberForceArr, function(o){
		return {memberIndex:o[0], membersForce:o[1]};
	}));
	QF.setting.hotElemCons.loadData(_.map(memberArr, function(o){
		return {memberIndex:o[0], area:o[3], youngModulus:o[4], temp:o[5], LOF:o[6], alpha:o[7], ro:o[8]};
	}));
	QF.setting.hotDisplacement.loadData(_.map(dispArr, function(o){
		return {nodeIndex:o[0], dispX:o[1], dispY:o[2]};
	}));
}*/
}
QF.ppLogicCommon.prototype = new QF.ppLogicCommon;
QF.ppLogicCommon.prototype.constructor = QF.ppLogicCommon;