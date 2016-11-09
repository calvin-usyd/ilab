Polygon.prototype = new PIXI.Graphics();
Polygon.prototype.constructor = Polygon;

function Polygon(){
  PIXI.Graphics.call(this);
  QF.display.call(this);

  this.initCopyNewPosition = function(propArray, newXPosition, newYPosition, rad, mark, cons, prop){
	var tempArray = [], counter = 0;
	
	for (var i=0; i<propArray.length/2; i++){
 
		pointX = propArray[counter++] + newXPosition;
		pointY = propArray[counter++] + newYPosition;
		
		tempArray.push({x:pointX, y:pointY, r:rad, m:mark, c:cons, p:prop});
	}
	
	this.refreshCoordinate(tempArray);
  }
  
  /*cVAObj=[
		{x0, y0, r, m},
		{x1, y1, r, m},
		{x.., y.., r, m}
		{xn, yn, r, m}
  ]*/
  this.refreshCoordinate = function(cVAObj){
	this.clear();
	this.position.x=0;
	this.position.y=0;
	var 
	elem = this,
	//cVAObj = pointArray,
	cVALen = cVAObj.length,
	x = cVAObj[0].x, 
	y = cVAObj[0].y,
	x1 = x, y1 = y, 
	x2, y2,
	sradius = cVAObj[0].r,
	mark = cVAObj[0].m,
	constraint = cVAObj[0].c,
	property = cVAObj[0].p,
	isClosed = x==cVAObj[cVALen-1].x && y==cVAObj[cVALen-1].y
	;
	
	if (cVALen == 2){
		x2 = cVAObj[1].x;
		y2 = cVAObj[1].y;
		
		elem.lineStyle(2, 0x00FF00, 1);
		elem.moveTo( x, y );
		elem.lineTo( x2, y2 );
		elem.drawSpheroRadius(x, y, x2, y2, sradius);
		elem.initVerticesNo();
		
	}else if (cVALen >= 3){
		////IF LAST == FIRST OF VERTEX POSITION, THEN
		if (isClosed)	elem.beginFill(0x00FF00, 0.5);//// IS CLOSED
		else			elem.lineStyle(2, 0x00FF00, 1);//// IS OPENED
		
		elem.moveTo( x1, y1 );
		for (var i=1; i < cVALen; i++){
			x2 = cVAObj[i].x;
			y2 = cVAObj[i].y;
			elem.lineTo( x2, y2 );
			elem.drawSpheroRadius(x1, y1, x2, y2, sradius);
			x1=x2;
			y1=y2;
		}
		elem.initVerticesNo();
		
		if (isClosed)	elem.drawSpheroRadius(x2, y2, x, y, sradius);
	}
	elem.mark=mark;
	elem.radius=sradius;
	elem.constraint=constraint;
	elem.property=property;
	elem.initParticleNo();
  }
  /*
  this.initCopyNewPosition = function(propArray, newXPosition, newYPosition){
	var tempArray = [], counter = 0;
	
	for (var i=0; i<propArray.length/2; i++){
 
		pointX = propArray[counter++] + newXPosition;
		pointY = propArray[counter++] + newYPosition;
		
		tempArray[tempArray.length] = pointX;
		tempArray[tempArray.length] = pointY;
	}
	
	this.refreshCoordinate(tempArray);
  }
  
  this.refreshCoordinate = function(pointArray){
	this.clear();
	this.position.x=0;
	this.position.y=0;
	this.beginFill(0x999999, 0.5);
	
	var counter = 0;
	//this.drawCircle(parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2)), parseFloat(r));
	for (var i=0; i<pointArray.length/2; i++){
		pointX = pointArray[counter++];// + thisObj.position.x;
		pointY = pointArray[counter++];// + thisObj.position.y;
		
		if (i == 0){
			this.moveTo( pointX, pointY );
		}else{
			this.lineTo( pointX, pointY );
		}
	}

  }*/
  
  this.mouseup = this.mouseupoutside =
    this.touchend = this.touchendoutside = function(data) {
    this.dragging = false;
	
	if (this.moved){
		this.moved = false;
		
		var counter=0;
		var pointX =0;
		var pointY =0;
		var userPointArray = [];
		var pointArray = this.currentPath.shape.points;
		var objDataArr = [];
		
		for (var i=0; i<pointArray.length/2; i++){
			pointX = pointArray[counter++] + this.position.x;
			pointY = pointArray[counter++] + this.position.y;
			objDataArr.push({x:pointX, y:pointY, r: this.radius, m:this.mark, c:this.constraint, p:this.property});
		}
		
		//REMOVE ALL OLD VERTICES' NUMBER & SPHERORADIUS
		this.removeChildren();
		this.refreshCoordinate(objDataArr);
	}
  };
  
  this.initVerticesNo = function(){
	var pointArray = this.currentPath.shape.points;
	var counter=0;

	for (var x=0; x < pointArray.length/2; x++){
		
		var pointX = pointArray[counter++];
		var pointY = pointArray[counter++];
		
		var vertNoText = new PIXI.Text(x,{font:"bold 20px Arial", fill:"red"});
		//vertNoText.setStyle({font:"bold 20px Arial", fill:"red"});
		vertNoText.position.x = pointX;
		vertNoText.position.y = pointY;
		vertNoText.visible = false;
		this.addChild(vertNoText);
		
		QF.setting.verticesNoTextArray.push(vertNoText);
	}
  }
  
  this.initParticleNo = function(data){
	  
	if (this.seqNoText.text == -1){
		var pointArray = this.currentPath.shape.points;
		
		var lowestX=0, lowestY=0, highestX=0, highestY=0;
		var textHeight = 15;
		
		var counter=0;
		
		for (var x=0; x < pointArray.length/2; x++){
			
			var pointX = pointArray[counter++];
			var pointY = pointArray[counter++];
			
			lowestX = pointX;
			lowestY = pointY;
			
			if (lowestX > pointX){
				lowestX = pointX;
			}
			if (lowestY > pointY){
				lowestY = pointY;
			}
			if (highestX < pointX){
				highestX = pointX;
			}
			if (highestY < pointY){
				highestY = pointY;
			}
			
			centerX = lowestX + ((highestX - lowestX) / 2) - textHeight;
			centerY = lowestY + ((highestY - lowestY) / 2) - textHeight;

		}
		
		var seqNoText = new PIXI.Text(QF.setting.particleNoTextArray.length + 1,{font:"bold 20px Arial", fill:"purple"});
		//seqNoText.setStyle({font:"bold 20px Arial", fill:"purple"});
		seqNoText.position.x = centerX;
		seqNoText.position.y = centerY;
		seqNoText.visible = QF.setting.particleNoVisibility;
		
		this.addChild(seqNoText);
		
		QF.setting.particleNoTextArray.push(seqNoText);
	}
  }
  
  this.clone = function()
  {
    return new Polygon();
  };
}