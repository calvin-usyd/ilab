"use strict";

QF.ppLogic = function(){

var 
cm = QF.Common();
;
this.loadGraph = function(json){
	var data = cm.getJsonObj(json);
	cm.hideProgress();
	if (data[0] == 'Danger'){
		alert(data[1]);
		return;
	}
	var 
	nodeCount = data.nodeCount,
	memberCount = data.memberCount,
	nodePointArr = ppLg.processStr2Arr(data.nodePointArr),
	memberArr = ppLg.processStr2Arr(data.memberArr),
	nodeForceArr = ppLg.processStr2Arr(data.nodeForceArr),
	memberForceArr = ppLg.processStr2Arr(data.memberForceArr),
	dispArr = ppLg.processStr2Arr(data.dispArr)
	;
	console.log(data);
	var newNodeCoor = ppLg.getNewNodeDisp(nodePointArr, dispArr, nodeForceArr);
	var memberForceColr = ppLg.getMemberColr(memberForceArr, memberCount);
	ppLg.drawGraph(newNodeCoor, memberArr, memberForceColr);
	//ppLg.genForceArrow(nodeForceArr, newNodeCoor);
}
this.genForceArrow = function(nodeForceArr, newNodeCoor){
	var nodeInd, forces, nodeCoor, nodeOArr;
	var lineG, arrowR, arrowL, arrowDest, arrowTriangleLen=5;
	var scale=100;
	if (nodeForceArr[0] > 10000){
		scale=2000;
	}
	_.forEach(nodeForceArr, function(nForceO){
		nodeInd = nForceO[0];
		forces = {x:ppLg.noNotation(nForceO[1]), y:ppLg.noNotation(nForceO[2])};
		nodeCoor = _.find(newNodeCoor, function(o){return o.i==nodeInd;});
		arrowDest = {x:nodeCoor.x + forces.x, y:nodeCoor.y + forces.y/scale};
		arrowR = {x:arrowDest.x+arrowTriangleLen, y:arrowDest.y+arrowTriangleLen}
		arrowL = {x:arrowDest.x-arrowTriangleLen, y:arrowDest.y+arrowTriangleLen}
		
		var lineG = new PIXI.Graphics();
		lineG.lineStyle(5, 0x00ffff, 1);
		
		lineG.moveTo(nodeCoor.x, nodeCoor.y);
		lineG.lineTo(arrowDest.x, arrowDest.y);
		lineG.lineTo(arrowR.x, arrowR.y);		
		lineG.lineTo(arrowL.x, arrowL.y);
		lineG.lineTo(arrowDest.x, arrowDest.y);
		
		lineG.position.set(nodeCoor.x, nodeCoor.y);
		lineG.pivot.set(nodeCoor.x, nodeCoor.y);
		if (forces.y < 0){
			lineG.rotation =  Math.PI;
		}
		if (forces.x < 0){
			lineG.rotation =  -Math.PI/2;			
		}else if (forces.x > 0){
			lineG.rotation =  Math.PI/2;			
		}
		stage.addChild(lineG);
	});
}
this.getMemberColr = function(memberForceArr, memberCount){
	var memberForceMapped = _.map(memberForceArr, function(m){
		return ppLg.noNotation(m[1]);
	});
	var memberForceSorted = _.sortBy(memberForceMapped);
	var hm = heatmap();
	hm.setColorPalette(HeatmapConfig);
	hm.setData(memberForceSorted[0], memberForceSorted[memberCount-1], 15);
	hm.renderBar();
	return hm.getColors(memberForceMapped);
}
this.drawGraph = function(newNodeCoor, memberArr, memberForceColr){
	_.forEach(newNodeCoor, function(node){
		lgFE.drawNode(node);		
	});
	_.forEach(memberArr, function(member, ind){
		lgFE.drawElement([member[1], member[2]], false, {color:memberForceColr[ind].colorHex});
	});
}
this.getNewNodeDisp = function(nodePointArr, dispArr, nodeForceArr){
	var usrP = cm.toUserPointY(QF.setting.canv.height);
	var scale = 1;
	var lp=0, lq=0;
	if (nodePointArr[0].x > 5000 || nodePointArr[0].y > 5000 || nodePointArr[1].x > 5000 || nodePointArr[1].y > 5000 ){
		scale = 10;
	}
	return _.map(nodePointArr, function(nodeO, ind){
		var forceObj = _.flatten(_.filter(nodeForceArr, function(o){
			return o[0] === nodeO[0];
		}));
		lp=0, lq=0;
		if (forceObj.length > 0){
			lp = ppLg.noNotation(forceObj[1]);
			lq = ppLg.noNotation(forceObj[2]);
		}
		return { 
			x:(nodeO[3]/scale + ppLg.noNotation(dispArr[nodeO[0]-1][1])), 
			y:usrP(nodeO[4]/scale + ppLg.noNotation(dispArr[nodeO[0]-1][2])),
			constraint:{lp:lp, lq:lq, rx: nodeO[1], ry:nodeO[2], rz:0},
			i:nodeO[0]
		};		
	});
}
this.processStr2Arr = function(arr){
	return _.map(arr, function(str){
		return _.map(_.remove(_.split(str, ' '), function(data){
			return data!='';			
		}), function(d){
			return d;
		});
	});
}
this.noNotation = function(s){
	var nNum=0;
	if (s.match(/^[-+]?[0-9]\.[0-9]+D[-+]?[0-9][0-9]*$/)) {
		s=s.replace('D', 'e');
	}
	if (s.match(/^[-+]?[0-9]\.[0-9]+e[-+]?[0-9][0-9]*$/)) {
	  nNum = (+s).toFixed(ppLg.getPrecision(s));
	  return parseFloat(nNum);
	}
	return parseFloat(s);
}
this.getPrecision = function(scinum) {
  var arr = new Array();
  // Get the exponent after 'e', make it absolute.  
  arr = scinum.split('e');
  var exponent = Math.abs(arr[1]);

  // Add to it the number of digits between the '.' and the 'e'
  // to give our required precision.
  var precision = new Number(exponent);
  arr = arr[0].split('.');
  precision += arr[1].length;
  
  return precision>20?20:precision;
}
}
QF.ppLogic.prototype = new QF.ppLogic;
QF.ppLogic.prototype.constructor = QF.ppLogic;