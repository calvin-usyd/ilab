"use strict";

QF.Element = function(){
PIXI.Graphics.call(this);
QF.finiteElement.call(this);

this.lineStyle(3, 0x00dddd, 1);
this.mark;
this.initElementNo = function(nodeIndexArray){
	var elemNoPost;
	var nodeLen = nodeIndexArray.length;
	
	if (nodeLen == 2){
		elemNoPost = this.getCenterOfLine(nodeIndexArray);
		
	}else if (nodeLen == 3){
		elemNoPost = this.getCenterOfTri(nodeIndexArray);
		
	}else if (nodeLen >= 4){
		elemNoPost = this.getCenterOfRec(nodeIndexArray);
		
	}
	var elemNoText = new PIXI.Text(QF.setting.elementNoTextArray.length + 1,{font:" Arial", fontSize:"10px", fill:"black"});
	//elemNoText.setStyle({font:" 14px Arial", fill:"black"});
	elemNoText.position.x = elemNoPost.x;
	elemNoText.position.y = elemNoPost.y;
	elemNoText.visible = QF.setting.elementNoVisibility;
	this.addChild(elemNoText);
	QF.setting.elementNoTextArray.push(elemNoText);
}
this.getCenterOfLine = function(nodeIndexArray){
	var post = QF.setting.nodeObjArray,
	x1 = post[nodeIndexArray[0]-1].x, 
	y1 = post[nodeIndexArray[0]-1].y,
	x2 = post[nodeIndexArray[1]-1].x, 
	y2 = post[nodeIndexArray[1]-1].y;
	
	var centroidX = (x1 + x2) / 2;
	var centroidY = (y1 + y2) / 2;
	
	return {x: centroidX, y:centroidY};
}
this.getCenterOfRec = function(nodeIndexArray){
	var post = QF.setting.nodeObjArray,
	x1 = post[nodeIndexArray[0]-1].x, 
	y1 = post[nodeIndexArray[0]-1].y,
	x2 = post[nodeIndexArray[2]-1].x, 
	y2 = post[nodeIndexArray[2]-1].y;
	
	var centroidX = (x1 + x2) / 2;
	var centroidY = (y1 + y2) / 2;
	
	return {x: centroidX, y:centroidY};
}
this.getCenterOfTri = function(nodeIndexArray){
	var post = QF.setting.nodeObjArray,
	x1 = post[nodeIndexArray[0]-1].x, 
	y1 = post[nodeIndexArray[0]-1].y,
	x2 = post[nodeIndexArray[1]-1].x, 
	y2 = post[nodeIndexArray[1]-1].y,
	x3 = post[nodeIndexArray[2]-1].x, 
	y3 = post[nodeIndexArray[2]-1].y;
	
	var lineCenter = {x: (x2 + x1)/2, y: (y2 + y1)/2};
	var centroid = {
		x: x3 + 2/3 * (lineCenter.x - x3),
		y: y3 + 2/3 * (lineCenter.y - y3)
	};
	
	return centroid;
}
}

QF.Element.prototype = new PIXI.Graphics;
QF.Element.prototype.constructor = QF.Element;