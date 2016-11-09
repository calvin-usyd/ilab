"use strict";

QF.Node = function(){
  PIXI.Graphics.call(this);
  QF.finiteElement.call(this);
  
  this.beginFill(0x0000ff);
  /*
  this.lineStyle (QF.setting.lineWidth, QF.setting.lineColor, QF.setting.lineTransparency);
  this.verticesNoTextObj={};
  
  this.toggleVerticesNo = function(visible){
	this.verticesNoTextObj.visible = visible;
  }
  */
  
  this.refreshCoordinate = function(o){
	this.clear();
	this.position.x=0;
	this.position.y=0;
	this.beginFill(0x00000ff);
	
	this.drawCircle( o.x, o.y, QF.setting.grid.size + 3);
	this.initVerticesNo();
	this.constraint=o.c;
  }
  
  this.initVerticesNo = function(){	
	var vertNoText = new PIXI.Text(QF.setting.nodeNoTextArray.length + 1,{font:"bold 5px Arial",fontSize:"10px", fill:"red"});
	//vertNoText.setStyle({font:"bold 15px Arial", fill:"red"});
	vertNoText.position.x = this.graphicsData[0].shape.x;
	vertNoText.position.y = this.graphicsData[0].shape.y;
	vertNoText.visible = QF.setting.nodeNoVisibility;
	this.addChild(vertNoText);
	QF.setting.nodeNoTextArray.push(vertNoText);
	//this.verticesNoTextObj=vertNoText;
  }
}

QF.Node.prototype = new PIXI.Graphics;
QF.Node.prototype.constructor = QF.Node;