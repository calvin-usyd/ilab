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

  this.refreshConstraint = function(consName){
	if(typeof consName != 'undefined'){
		var pos = this.graphicsData[0].shape;
		var cObj={};
		if (typeof consName === "string"){
			this.constraint=consName;
			cObj = _.filter(QF.setting.dataConsNode, function(consO){
				return consO.name == consName;
			})[0];
		}
		
		//FORCE/LOAD ARROW
		if (typeof cObj !== "undefined"){
			if(cObj.lp != "0" || cObj.lq != "0"){
				var arrow = new QF.Arrow();
				arrow.position.set(pos.x, pos.y);
				arrow.setDirection(cObj.lp, cObj.lq);
				arrow.visible = QF.setting.loadTextVisibility;
				this.addChild(arrow);
				QF.setting.arrowTextArray.push(arrow);
				
				var loadText = new PIXI.Text(
					'x='+cObj.lp+
					' N\ry='+cObj.lq+' N',
					{font:"bold 5px Arial",fontSize:"10px", fill:"0x167ac6"}
				);
				loadText.position.set(pos.x + 10,pos.y - 10);
				loadText.visible = QF.setting.loadTextVisibility;
				loadText.name="loadText";
				this.addChild(loadText);
				QF.setting.loadTextArray.push(loadText);
			}

			//BOUNDARY CONDITION
			var consText = new PIXI.Text(
				'x='+cObj.rx+
				'\ny='+cObj.ry+
				'\rz='+cObj.rz, 
				{font:"bold 5px Arial",fontSize:"10px", fill:"blue"}
			);
			consText.position.set(pos.x + 10,pos.y - 10);
			consText.visible = QF.setting.bcTextVisibility;
			consText.name="consText";
			this.addChild(consText);
			QF.setting.bcTextArray.push(consText);
		}
	}
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