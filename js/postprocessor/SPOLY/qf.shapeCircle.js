"use strict";

QF.Circle = function(){
  QF.shape.call(this);
  
  this.initCopyNewPosition = function(graphicsData, newXPosition, newYPosition){
	for (var g=0; g<graphicsData.length; g++){
		this.refreshCoordinate(
			graphicsData[g].shape.x + newXPosition, 
			graphicsData[g].shape.y + newYPosition, 
			graphicsData[g].shape.radius);
	}
  }
  
  this.updateMovedPosition = function(graphicsData, newXPosition, newYPosition){
	  console.log(graphicsData);
	for (var g=0; g<graphicsData.length; g++){
		this.refreshCoordinate(
			newXPosition, 
			newYPosition, 
			graphicsData[g].shape.radius);
	}
  }
  
  this.refreshCoordinate = function(centerX, centerY, rad){
	this.drawCircle(parseFloat(centerX), parseFloat(centerY), parseFloat(rad));
	this.position.set(centerX, centerY);
	this.pivot.set(centerX, centerY);
  }
  
  this.draw = function(customVerticesArray, radius){
	var 
		centerX = customVerticesArray[0].toFixed(2),
		centerY = customVerticesArray[1].toFixed(2)		
	;
	
	centerY = lg.setRelativeToOriginBottomLeft(centerY);

	this.refreshCoordinate(centerX, centerY, radius);
	
	QF.setting.initEndDraw();
  }
  
  this.clone = function(){
    return new QF.Circle();
  };
}
QF.Circle.prototype = new QF.shape;
QF.Circle.prototype.constructor = QF.Circle;