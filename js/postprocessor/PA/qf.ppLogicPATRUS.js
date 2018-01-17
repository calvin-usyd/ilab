"use strict";

QF.ppLogic = function(){
QF.ppLogicCommon.call(this);

this.toggleHeatmapVisibility = function(){
	$('#axialHeatmapRef').removeClass('hide');
}
this.noNotaMemberForce = function(membFoArr){
	return _.map(membFoArr, function(o){
		return {i:o[0], f:ppUtil.noNotation(o[1])};
	});
}
this.drawMemberDiagram = function(memberForceArr, newNodeCoor, memberArr){
	var mNode, node1, node2, nodeDisp1, nodeDisp2,  
	nodeCoorMap = ppLg.getNewNodeCoorMap(newNodeCoor),
	memberIndMap = ppLg.getMemberIndMap(memberArr),
	memberColr = ppLg.getMemberColr(ppLg.memberForceMappedBy(memberForceArr, 'f'), '#axialHeatmap'),
	meshElemDisp = new PIXI.Graphics();
	meshElemDisp.visible = this.dispVisibility;
	$('#axialHeatmapRef').removeClass('hide');

	_.forEach(memberForceArr, function(mF, ind){
		mNode = memberIndMap[mF.i];
		node1 = nodeCoorMap[mNode.i];
		node2 = nodeCoorMap[mNode.j];
		
		nodeDisp1 = dynamicP.systemCenter(node1.dispX, node1.dispY);
		nodeDisp2 = dynamicP.systemCenter(node2.dispX, node2.dispY);
		
		meshElemDisp.lineStyle(3, (memberColr) ? "0x"+memberColr[ind].colorHex : 0x000);
		meshElemDisp.moveTo(nodeDisp1.x, nodeDisp1.y);
		meshElemDisp.lineTo(nodeDisp2.x, nodeDisp2.y);
	});	
	stage.addChild(meshElemDisp);
	QF.ppSetting.meshDispArr.push(meshElemDisp);
}
this.getNewNodeDisp = function(nodePointArr, dispArr, nodeForceArr){
	var lp, lq, dispCoor, newO, dispX, dispY, dispO, forceObj;
	return _.map(nodePointArr, function(nodeO, ind){
		forceObj = _.flatten(_.filter(nodeForceArr, function(o){
			return o[0] === nodeO[0];
		}));
		lp=0, lq=0;
		if (forceObj.length > 0){
			lp = ppUtil.noNotation(forceObj[1]);
			lq = ppUtil.noNotation(forceObj[2]);
		}
		dispO=dispArr[nodeO[0]-1];
		dispX=0, dispY=0;
		if (typeof dispO !== "undefined"){
			dispX = (dispO[1]) === 'NaN' ? o : ppUtil.noNotation(dispO[1]);
			dispY = (dispO[2]) === 'NaN' ? o : ppUtil.noNotation(dispO[2]);
		}
		dispCoor = mapP.user(
			+nodeO[3] + dispX*QF.ppSetting.dispAmplifyY, 
			+nodeO[4] + dispY*QF.ppSetting.dispAmplifyY
		);
		newO = mapP.user(
			nodeO[3], 
			nodeO[4]
		);
		newO.dispX = dispCoor.x;
		newO.dispY = dispCoor.y;
		newO.c={lp:lp, lq:lq, rx: nodeO[1], ry:nodeO[2], rz:0};
		newO.i=nodeO[0];
		return newO;
	});
}
}
QF.ppLogic.prototype = new QF.ppLogic;
QF.ppLogic.prototype.constructor = QF.ppLogic;