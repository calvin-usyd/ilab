"use strict";

QF.Polygon = function(){
  QF.shape.call(this);
  
  /*this.initCopyNewPosition = function(graphicsData, newXPosition, newYPosition){
	var 
		centerX = 0
		,centerY = 0
		,len = 0
		,centerCount=0
	;
		console.log('sss4');
	for (var g=0; g<graphicsData.length; g++){
		var 
			tempArray = []
			,counter = 0
			,propArray = graphicsData[g].shape.points
			,posX=0
			,posY=0
		;
		
		console.log(graphicsData[g].shape);
		if (propArray){
			for (var i=0; i<propArray.length/2; i++){
				posX = propArray[counter++];
				posY = propArray[counter++];
				
				tempArray[tempArray.length] = {
					'x':posX + newXPosition,
					'y':posY + newYPosition
				}
				
				if (centerCount != 1){
					centerX += posX;
					centerY += posY;
					len=propArray.length/2;
				}
			}
		}
		centerCount=1;
		this.refreshCoordinate(tempArray);
	}
	console.log(centerX / len);
	this.position.set(centerX / len, centerY / len);
	this.pivot.set(centerX / len, centerY / len);
  }*/
  
  this.refreshCoordinate = function(customVerticesArray){
		
	if (QF.setting.modeComplexPolygon){
		this.clear();
		this.lineStyle (QF.setting.lineWidth, QF.setting.lineColor, QF.setting.lineTransparency);
		this.beginFill(QF.setting.BGColor, QF.setting.BGTransparency);
	}
	
	var 
	  pX = 0
	 ,pY = 0
	 ,count = 0
	 ,len = customVerticesArray.length / 2
	;
	
	for (var i=0; i<len; i++){
		pX = customVerticesArray[count++];
		pY = customVerticesArray[count++];
		
		pY = lg.setRelativeToOriginBottomLeft(pY);
		
		if (i == 0){
			this.moveTo( pX, pY );
			
		}else{
			this.lineTo( pX, pY );
		}
		//centerX += customVerticesArray[i].x;
		//centerY += customVerticesArray[i].y;
	}
	//this.position.set(centerX / len, centerY / len);
	//this.pivot.set(centerX / len, centerY / len);
  }
  /*
  this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = function(data) {
    this.dragging = false;
	
		console.log('sss2');
	if (this.moved && this.graphicsData){
		this.moved = false;
		
		var 
			x=this.position.x, 
			y=this.position.y, 
			gd=this.graphicsData,
			fc=this.fillColor,
			fa=this.fillAlpha,
			lw=this.lineWidth,
			lc=this.lineColor,
			la=this.lineAlpha
		;
		this.clear();
		this.position.x=0;
		this.position.y=0;
		this.lineStyle(lw, lc, la);
		this.beginFill(fc, fa);
		this.initCopyNewPosition(gd, x, y);
	}
  }
  
  this.showPosition = function(){
	if (this.graphicsData.length > 0){
		var pt = this.graphicsData[0].points;
		$('#oPos .x').html(pt[0]);
		$('#oPos .y').html(pt[1]);
    }
  }*/
  
  this.draw = function(customVerticesArray, radius){
	this.refreshCoordinate(customVerticesArray);
  }
  
  this.clone = function(){
    return new QF.Polygon();
  };
}
QF.Polygon.prototype = new QF.shape;
QF.Polygon.prototype.constructor = QF.Polygon;
