//(function() {
"use strict";

var 
	 shapeObj
	,dot = new PIXI.Graphics()
;

QF.Logic = function(){
	
	this.initStage = function(){
		stage = new PIXI.Stage(0xffffff, true);
		//initGrid();//From main.js
	}
	
	//KMB : Kinetic, MicroContact, Bean
	this.importKMB = function($modelStr, $setting){
	//this.importKinetic = function($modelStr){
		if ($modelStr == '') return;
		
		var modelRecArray = $modelStr.trim().split('\n'),
			centerX=0, centerY=0, velocityX=0, velocityY=0, destX=0, destY=0,
			lineG={}, arrowRX=0, arrowRY=0, arrowLX=0, arrowLY=0,
			inverseRelativeVelocitySign = -1; 
		;
		
		for (var r=0; r<modelRecArray.length; r++){
			var recordStr = modelRecArray[r].trim();
			recordStr = recordStr.replace(/   /g, ' ');
			recordStr = recordStr.replace(/  /g, ' ');
			
			var modelDataArray = recordStr.split(' ');
			
			centerX = parseFloat(modelDataArray[$setting.indexCenterX]);
			centerY = parseFloat(modelDataArray[$setting.indexCenterY]);
			
			velocityX = parseFloat(modelDataArray[$setting.indexDestX]);
			velocityY = parseFloat(modelDataArray[$setting.indexDestY]);
			
			var lineG = new PIXI.Graphics();
			lineG.lineStyle(1, 0x000, 1);
			
			//console.log(centerY);
			centerY = this.setRelativeToOriginBottomLeft(centerY);
			//console.log(centerY);
			//velocityY = this.setRelativeToOriginBottomLeft(velocityY);
			
			arrowRX = arrowLX = destX = centerX + $setting.scale * velocityX;
			arrowRY = arrowLY = destY = centerY + $setting.scale * (inverseRelativeVelocitySign * velocityY);
			
			var arrowHeadLen = 2;
			
			if (velocityY > 0){//UPWARD
				arrowRX += arrowHeadLen;	/*\*/
				arrowRY += arrowHeadLen;	/*\*/
				
				arrowLX -= arrowHeadLen;	/*/*/
				arrowLY += arrowHeadLen;	/*/*/
				
				if (velocityX > 0){
					arrowRX--;
					arrowRY++;
					
					arrowLX++;
					arrowLY--;
					
				}else if (velocityX < 0){
					arrowRX++;
					arrowRY--;
					
					arrowLX--;
					arrowLY++;
				}
				
			}else{//DOWNWARD
				arrowRX += arrowHeadLen;	/*/*/
				arrowRY -= arrowHeadLen;	/*/*/
				
				arrowLX -= arrowHeadLen;	/*\*/
				arrowLY -= arrowHeadLen;	/*\*/
				
				if (velocityX > 0){
					arrowRX--;
					arrowRY--;
					
					arrowLX++;
					arrowLY++;
					
				}else if (velocityX < 0){
					arrowRX++;
					arrowRY++;
					
					arrowLX--;
					arrowLY--;
				}
			}
			lineG.moveTo(centerX, centerY);
			lineG.lineTo(destX, destY);
			
			lineG.moveTo(arrowRX, arrowRY);
			lineG.lineTo(destX, destY);
			
			lineG.moveTo(arrowLX, arrowLY);
			lineG.lineTo(destX, destY);
			
			stage.addChild(lineG);
			//console.log(destY);
			//console.log('---');
		}
	}
	
	this.importModel = function($modelStr){
		if ($modelStr == '') return;
		//console.log($modelStr);
		//$modelStr = $("#dialogImportParticle textarea[name=particles]").val();
		
		//$modelStr = $modelStr.replace(/(?:\r\n|\r|\n)/g, ' ');
		var modelRecArray = $modelStr.trim().split('\n');
		
		var	
		  vertCounter = 1
		 ,recordArray = []
		 ,modelObjArray = []
		 ,pointArray = []
		 ,recordStr
		 ,radius
		 ,modelDataArray = []
		;
		
		//console.log(modelRecArray);
		for (var r=0; r<modelRecArray.length; r++){
			var pointArray = [];
			recordStr = modelRecArray[r].trim();
			recordStr = recordStr.replace(/   /g, ' ');
			recordStr = recordStr.replace(/  /g, ' ');
			
			modelDataArray = recordStr.split(' ');
			
			for (var d=0; d<modelDataArray.length; d++){
				if (d == 0){
					//ismark
					//recordArray['mark'] = parseInt(modelDataArray[d]);
					//mark = parseInt(modelDataArray[d]);
					
				}else if (d == 1){
					//isRadius
					//recordArray['radius'] = parseInt(modelDataArray[d]);
					radius = parseFloat(modelDataArray[d]);
					
				}else if (d == 2){
					//numOfVertices = parseInt(modelDataArray[d]);
					//recordArray['numOfVertices'] = numOfVertices;
					
				}else{
					//if (vertCounter % 2 != 0){
					pointArray.push(parseFloat(modelDataArray[d]));					
				}
			}
			
			modelObjArray.push(pointArray);
		}
		
		this.initStage();
		
		var 
		 vertices
		;
		
		for (var x=0; x<modelObjArray.length; x++){
			vertices = modelObjArray[x];
			if (vertices.length != 0){
				var shape = getShape(vertices);				
				shape.draw(vertices, radius);				
				stage.addChild(shape);
			}
		}
	}
	
	function getShape(vertices){
		console.log(vertices);
		if (vertices.length/2 == 1){
			//createCircle(vertices);
			return new QF.Circle();
			
		}else if (vertices.length/2 == 2){
			//createLine(vertices);

		}else if (vertices.length/2 > 2){
			//createPolygon(vertices);
			return new QF.Polygon();
		}
	}
	
	//System coordinate start from top left
	this.setRelativeToOriginBottomLeft = function(y){
		//return canvasPPP.height - y - QF.setting.extraCanvasHeight;//canvasPPP is the id for canvas element
		return canvasPPP.height - y //canvasPPP is the id for canvas element
	}
}

QF.Logic.prototype = new QF.Logic;
QF.Logic.prototype.constructor = QF.Logic;
//})();
var lg = new QF.Logic();