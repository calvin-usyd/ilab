Circle.prototype = new PIXI.Graphics();
Circle.prototype.constructor = Circle;

function Circle(){
  PIXI.Graphics.call(this);
  QF.display.call(this);
  
  
  this.drawSpheroRadiusCircle = function(x, y, sradius){
	var sphero = new PIXI.Graphics();
	sphero.beginFill(0xddd, 0.6);
	sphero.drawCircle(x, y, sradius);
	sphero.visible=QF.setting.spheroRadiusVisibility;
	this.addChild(sphero);
	QF.setting.spheroRadiusArray.push(sphero);
  }
  this.initCopyNewPosition = function(propArray, newXPosition, newYPosition, rad, mark, cons, prop){
	this.refreshCoordinate({x:propArray.x + newXPosition, y:propArray.y + newYPosition, r:rad, m:mark, c:cons, p:prop});
  }
  this.refreshCoordinate = function(obj){
	this.clear();
	this.position.x=0;
	this.position.y=0;
	//obj=obj[0];
	this.beginFill(0x00FF00);
	this.drawCircle(obj.x, obj.y, 3);
	this.drawSpheroRadiusCircle(obj.x, obj.y, obj.r);
	this.mark=obj.m;
	this.radius=obj.r;
	this.constraint=obj.c;
	this.property=obj.p;
	this.initParticleNo();
  }
  /*
  this.initCopyNewPosition = function(propArray, newXPosition, newYPosition){
	this.refreshCoordinate([propArray.x + newXPosition, propArray.y + newYPosition, propArray.radius]);
  }
  this.refreshCoordinate = function(propArray){
	this.clear();
	this.position.x=0;
	this.position.y=0;
	this.beginFill(0x00FF00);
	this.drawCircle(parseFloat(propArray.x.toFixed(2)), parseFloat(propArray.y.toFixed(2)), parseFloat(propArray.r));
	this.mark=propArray.m;
	this.radius=propArray.r;
	this.constraint=propArray.c;
  }
  
  this.mouseup = this.mouseupoutside =
    this.touchend = this.touchendoutside = function(data) {
    this.dragging = false;
	if (this.moved){
		
		this.moved = false;
		//console.log(this.moved);
		var circleShape = this.graphicsData[0].shape;
		var deltaX = this.position.x;
		var deltaY = this.position.y;
		
		var position = data.getLocalPosition(this.parent);
		
		this.refreshCoordinate([this.graphicsData[0].shape.x + this.position.x, this.graphicsData[0].shape.y + this.position.y, circleShape.radius]);
		//this.refreshCoordinate(this.mousePressPoint[0], this.mousePressPoint[1], circleShape.radius);
	}
  };*/
  
  this.initParticleNo = function(){
	/*if (this.seqNoText.text == -1){
		var circleShape = this.graphicsData[0].shape;
		
		var lowestX=0, lowestY=0, highestX=0, highestY=0;
		var textHeight = 15;
		
		this.seqNoPoint.x = circleShape.x;
		this.seqNoPoint.y = circleShape.y;
		
		this.seqNoText = new PIXI.Text(this.seqNo,{});
		this.seqNoText.setStyle({font:"bold 20px Arial", fill:"purple"});
		this.seqNoText.position.x = this.seqNoPoint.x;
		this.seqNoText.position.y = this.seqNoPoint.y;
		
		this.seqNoText.visible = false;
		this.addChild(this.seqNoText);
	}*/
	var circleShape = this.graphicsData[0].shape;
	var seqNoText = new PIXI.Text(QF.setting.particleNoTextArray.length + 1,{font:"bold 20px Arial", fill:"purple"});
	//seqNoText.setStyle({font:"bold 20px Arial", fill:"purple"});
	seqNoText.position.x = circleShape.x;
	seqNoText.position.y = circleShape.y;
	seqNoText.visible = QF.setting.particleNoVisibility;
	
	this.addChild(seqNoText);
	
	QF.setting.particleNoTextArray.push(seqNoText);
  }
  
  this.clone = function(){
	  return new Circle();
  }
}