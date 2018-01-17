"use strict";

QF.ppLogic = function(){
QF.ppLogicCommon.call(this);

this.toggleHeatmapVisibility = function(hideAll){
	var aHm = $('#axialHeatmapRef'), sHm=$('#shearHeatmapRef'), mHm=$('#momentHeatmapRef');
	aHm.addClass('hide');
	sHm.addClass('hide');
	mHm.addClass('hide');

	if (typeof hideAll == 'undefined'){
		if (QF.ppSetting.meshAxialContourArr[0].visible) aHm.removeClass('hide');
		if (QF.ppSetting.meshShearContourArr[0].visible) sHm.removeClass('hide');
		if (QF.ppSetting.meshMomentContourArr[0].visible) mHm.removeClass('hide');	
	}
}
this.noNotaMemberForce = function(membFoArr){
	return _.map(membFoArr, function(o){
		return {i:o[0], f:ppUtil.noNotation(o[1]), shA:ppUtil.noNotation(o[2]), shB:ppUtil.noNotation(o[3]), mA:ppUtil.noNotation(o[4]), mB:ppUtil.noNotation(o[5])};
	});
}
this.drawMemberDiagram = function(memberForceArr, newNodeCoor, memberArr){
	var mNode, midPt, axialForce, previousShear=null, previousAxial=null, shearForce, bendingMoment, diagramShear, diagramMoment, diagramAxial, node1, node2, nodeOri1, nodeOri2, nodeDisp1, nodeDisp2;
	var meshElemContourAxial, meshElemContourShear, meshElemContourMoment, meshElemDisplacement;
	var 
	nodeCoorMap = ppLg.getNewNodeCoorMap(newNodeCoor),
	memberIndMap = ppLg.getMemberIndMap(memberArr),
	memberForceMap = {
		af:ppLg.memberForceMappedBy(memberForceArr, 'f'),
		shA:ppLg.memberForceMappedBy(memberForceArr, 'shA'),
		mA:ppLg.memberForceMappedBy(memberForceArr, 'mA'),
		mB:ppLg.memberForceMappedBy(memberForceArr, 'mB')
	},
	memberColr = {
		axial: ppLg.getMemberColr(memberForceMap.af, '#axialHeatmap'),
		shear: ppLg.getMemberColr(memberForceMap.shA, '#shearHeatmap'),
		moment: ppLg.getMemberColr(memberForceMap.mB, '#momentHeatmap')
	},
	diagramScale = {
		axial: ppLg.diagramScale(memberForceMap.af),
		shear: ppLg.diagramScale(memberForceMap.shA),
		moment: ppLg.diagramScale(memberForceMap.mB)
	};

	diagramShear = new PIXI.Graphics();
	diagramShear.lineStyle(2, 0x167ac6);
	diagramShear.visible = false;
	diagramShear.beginFill(0xff0000, 0.3)
	
	diagramMoment = new PIXI.Graphics();
	diagramMoment.lineStyle(2, 0x4caf50);
	diagramMoment.visible = false;
	diagramMoment.beginFill(0x00ff00, 0.3)
	
	diagramAxial = new PIXI.Graphics();
	diagramAxial.lineStyle(2, 0x9c27b0);
	diagramAxial.visible = false;
	diagramAxial.beginFill(0x0000ff, 0.3)

	meshElemContourAxial = new PIXI.Graphics();
	meshElemContourShear = new PIXI.Graphics();
	meshElemContourMoment = new PIXI.Graphics();
	meshElemDisplacement = new PIXI.Graphics();
	
	meshElemContourAxial.visible = false;
	meshElemContourShear.visible = false;
	meshElemContourMoment.visible = false;
	meshElemDisplacement.visible = this.dispVisibility;
	
	_.forEach(memberForceArr, function(mF, ind){
		axialForce = mF.f;//Tension in beam
		shearForce = mF.shA;
		bendingMoment = {A:mF.mA, B:mF.mB};
		
		mNode = memberIndMap[mF.i];
		node1 = nodeCoorMap[mNode.i];
		node2 = nodeCoorMap[mNode.j];
		
		nodeOri1 = dynamicP.systemCenter(node1.x, node1.y);
		nodeOri2 = dynamicP.systemCenter(node2.x, node2.y);
		nodeDisp1 = dynamicP.systemCenter(node1.dispX, node1.dispY);
		nodeDisp2 = dynamicP.systemCenter(node2.dispX, node2.dispY);
		
		ppLg.drawAxial(axialForce, diagramScale.axial, diagramAxial, nodeDisp1, nodeDisp2);
		ppLg.drawShear(shearForce, diagramScale.shear, diagramShear, nodeDisp1, nodeDisp2);
		ppLg.drawMoment(bendingMoment, diagramScale.moment, diagramMoment, nodeDisp1, nodeDisp2, ind);

		ppLg.drawElemContour(meshElemContourAxial, memberColr.axial[ind], nodeDisp1, nodeDisp2, ind);
		ppLg.drawElemContour(meshElemContourShear, memberColr.shear[ind], nodeDisp1, nodeDisp2, ind);
		ppLg.drawElemContour(meshElemContourMoment, memberColr.moment[ind], nodeDisp1, nodeDisp2, ind);
		
		ppLg.drawElemDisplacement(meshElemDisplacement, memberColr.moment[ind], nodeDisp1, nodeDisp2, ind);
	});
	stage.addChild(diagramAxial);
	stage.addChild(diagramShear);
	stage.addChild(diagramMoment);
	
	QF.ppSetting.meshAxialArr.push(diagramAxial);
	QF.ppSetting.meshShearArr.push(diagramShear);
	QF.ppSetting.meshMomentArr.push(diagramMoment);
	
	stage.addChild(meshElemContourAxial);
	stage.addChild(meshElemContourShear);
	stage.addChild(meshElemContourMoment);
	stage.addChild(meshElemDisplacement);
	
	QF.ppSetting.meshAxialContourArr.push(meshElemContourAxial);
	QF.ppSetting.meshShearContourArr.push(meshElemContourShear);
	QF.ppSetting.meshMomentContourArr.push(meshElemContourMoment);
	QF.ppSetting.meshDispArr.push(meshElemDisplacement);
}
this.drawAxial = function(axialForce, diagramScale, diagramAxial, node1, node2){
	if (axialForce != 0){
		var aFy = axialForce/diagramScale;
		var pp = QFUtil.perpendicular(node1, node2, aFy);
		diagramAxial.moveTo(node1.x, node1.y);
		diagramAxial.lineTo(node1.x + pp.x, node1.y + pp.y);
		diagramAxial.lineTo(node2.x + pp.x, node2.y + pp.y);
		diagramAxial.lineTo(node2.x, node2.y);
	}
}
this.drawMoment = function(bendingMoment, diagramScale, diagramMoment, node1, node2, ind){
	if (bendingMoment.A != 0 && bendingMoment.B != 0){
		var ppA = QFUtil.perpendicular(node1, node2, -bendingMoment.A/diagramScale);
		var ppB = QFUtil.perpendicular(node1, node2, bendingMoment.B/diagramScale);
		
		diagramMoment.moveTo(node1.x, node1.y);
		diagramMoment.lineTo(node1.x + ppA.x, node1.y + ppA.y);
		if (ind > 0 &&  ind < QF.ppSetting.memberCount-1){//Do not check for intersection for first and last member
			var line1 = {p1:node1, p2:node2 };
			var line2 = {
				p1:{x:node1.x + ppA.x, y:node1.y + ppA.y},
				p2:{x:node2.x + ppB.x, y:node2.y + ppB.y}
			};
			//var intersect = QFUtil.lineIntersect (line1, line2);
			var intersect = QFUtil.segment_intersection(line1.p1.x,line1.p1.y, line1.p2.x, line1.p2.y, line2.p1.x, line2.p1.y, line2.p2.x, line2.p2.y);
			if (intersect){
				diagramMoment.lineTo(intersect.x, intersect.y);
				diagramMoment.moveTo(intersect.x, intersect.y);				
				diagramMoment.lineTo(node2.x + ppB.x, node2.y + ppB.y);
			}else{
				diagramMoment.lineTo(node2.x + ppB.x, node2.y + ppB.y);
			}
		}else{
			diagramMoment.lineTo(node2.x + ppB.x, node2.y + ppB.y);
		}
		diagramMoment.lineTo(node2.x, node2.y);			
	}
}
this.drawShear = function(shearForce, diagramScale, diagramShear, node1, node2){
	if (shearForce.A != 0 && shearForce.B != 0){
		var sFy = shearForce/diagramScale;
		var pp = QFUtil.perpendicular(node1, node2, sFy);
		diagramShear.moveTo(node1.x, node1.y);
		diagramShear.lineTo(node1.x + pp.x, node1.y + pp.y);
		diagramShear.lineTo(node2.x + pp.x, node2.y + pp.y);
		diagramShear.lineTo(node2.x, node2.y);			
	}
}

this.getNewNodeDisp = function(nodePointArr, dispArr, nodeForceArr){
	var scale = 1.00;
	var lp, lq, mt, rotat, dispCoor, newO, dispX, dispY, dispO, forceObj;
	return _.map(nodePointArr, function(nodeO, ind){
		forceObj = _.flatten(_.filter(nodeForceArr, function(o){
			return o[0] === nodeO[0];
		}));
		lp=0, lq=0;
		if (forceObj.length > 0){
			lp = ppUtil.noNotation(forceObj[1]);
			lq = ppUtil.noNotation(forceObj[2]);
			mt = ppUtil.noNotation(forceObj[3]);//moment
		}
		dispO=dispArr[nodeO[0]-1];
		dispX=0, dispY=0, rotat=0;
		if (typeof dispO !== "undefined"){
			dispX = (dispO[1]) === 'NaN' ? o : ppUtil.noNotation(dispO[1]);
			dispY = (dispO[2]) === 'NaN' ? o : ppUtil.noNotation(dispO[2]);
			rotat = (dispO[3]) === 'NaN' ? o : ppUtil.noNotation(dispO[3]);//Don't know how to use rotation, Angle??
		}
		dispCoor = mapP.user(
			+nodeO[4] + dispX*QF.ppSetting.dispAmplifyY, 
			+nodeO[5] + dispY*QF.ppSetting.dispAmplifyY
		);
		newO = mapP.user(
			nodeO[4],
			nodeO[5]
		);
		newO.dispX = dispCoor.x;
		newO.dispY = dispCoor.y;
		newO.c={lp:lp, lq:lq, mt:mt, rx: +nodeO[1], ry:+nodeO[2], rz:+nodeO[3]};
		newO.i=nodeO[0];
		return newO;
	});
}
}
QF.ppLogic.prototype = new QF.ppLogic;
QF.ppLogic.prototype.constructor = QF.ppLogic;