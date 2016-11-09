"use strict";

QF.shape = function(){
  PIXI.Graphics.call(this);
  QF.display.call(this);
  
  this.lineStyle (QF.setting.lineWidth, QF.setting.lineColor, QF.setting.lineTransparency);
  this.beginFill(QF.setting.BGColor, QF.setting.BGTransparency);
  
  //Pass object as argument - START//
  /*
  this.drawPreRect = function(data){
	  this.drawRect(data.x, data.y, data.width, data.height);
  }

  this.drawPreRoundedRect = function(data){
	  this.drawRoundedRect(data.x, data.y, data.width, data.height, data.radius);
  }

  this.drawPreCircle = function(data){
	  this.drawCircle(data.x, data.y, data.radius);
  }

  this.drawPreEllipse = function(data){
	  console.log(data);
	  this.drawEllipse(data.x, data.y, data.width, data.height);
  }

  this.drawPrePolygon = function(data){
	  var 
	  counter = 0,
	  points = data.points
	  ;
	  
	  for (var x=0; x<points.length/2; x++){
		if (x==0){
			this.moveTo(points[counter++], points[counter++]);
			
		}else{
			this.lineTo(points[counter++], points[counter++]);
	    }
	  }
  }
  //Pass object as argument - END//
  
  //Pass array as argument - START//
  this.drawPreBezierCurveToByArray = function(data){
	  this.bezierCurveTo(parseFloat(data[0].trim()), parseFloat(data[1].trim()), parseFloat(data[2].trim()), parseFloat(data[3].trim()), parseFloat(data[4].trim()), parseFloat(data[5].trim()));
  }

  this.drawPreQuadraticCurveToByArray = function(data){
	  this.quadraticCurveTo(parseFloat(data[0].trim()), parseFloat(data[1].trim()), parseFloat(data[2].trim()), parseFloat(data[3].trim()));
  }

  this.drawPreRecByArray = function(data){
	  this.drawRec(parseFloat(data[0].trim()), parseFloat(data[1].trim()), parseFloat(data[2].trim()), parseFloat(data[3].trim()));
  }

  this.drawPreRoundedRecByArray = function(data){
	  this.drawRoundedRec(parseFloat(data[0].trim()), parseFloat(data[1].trim()), parseFloat(data[2].trim()), parseFloat(data[3].trim()), parseFloat(data[4].trim()));
  }

  this.drawPreCircleByArray = function(data){
	  this.drawCircle(parseFloat(data[0].trim()), parseFloat(data[1].trim()), parseFloat(data[4].trim()));
  }

  this.drawPreEllipseByArray = function(data){
	  this.drawEllipse(parseFloat(data[0].trim()), parseFloat(data[1].trim()), parseFloat(data[2].trim()), parseFloat(data[3].trim()), parseFloat(data[4].trim()));
  }

  this.drawPreMoveToByArray = function(data){
	  this.moveTo(parseFloat(data[0].trim()), parseFloat(data[1].trim()));
  }

  this.drawPreLineToByArray = function(data){
	  this.lineTo(parseFloat(data[0].trim()), parseFloat(data[1].trim()));
  }*/
  //Pass array as argument - END//
}

QF.shape.prototype = new PIXI.Graphics;
QF.shape.prototype.constructor = QF.shape;