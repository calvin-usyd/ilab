"use strict";

QF.display = function(){
  PIXI.Container.call(this);
  
  this.interactive = true;
  this.mousePressPoint = [0, 0];
  //this.mode=mode;
  this.uuid=guid();
  this.seqNo=1;
  this.seqNoPoint={x:0, y:0};
  this.seqNoText=new PIXI.Text("-1",{});
  this.verticesNoTextArray=[];
  
  this.physicProp={
	  mark:"0",
	  radius:"0",
	  vx:"0",
	  vy:"0",
	  vphi:"0",
	  fx:"0",
	  fy:"0",
	  fphi:"0",
	  vxTag:"0",
	  vyTag:"0",
	  vphiTag:"0",
	  fxTag:"0",
	  fyTag:"0",
	  fphiTag:"0"
  }
  
  function guid() {
	function s4() {
	return Math.floor((1 + Math.random()) * 0x10000)
	  .toString(16)
	  .substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	s4() + '-' + s4() + s4() + s4();
  }
  
  this.mousedown = this.touchstart = function(e) {
	//this.mousePressPoint[0] = e.getLocalPosition(this.parent).x - this.position.x;//v2
	//this.mousePressPoint[1] = e.getLocalPosition(this.parent).y - this.position.y;//v2
	this.mousePressPoint[0] = e.data.getLocalPosition(this.parent).x - this.position.x;//v3
	this.mousePressPoint[1] = e.data.getLocalPosition(this.parent).y - this.position.y;//v3
	
	this.dragging = true;
	this.processSelected();
	//this.processDelete();
	//processCopy(this);
	//processEdit(this);
  };
  
  
  

  
  this.mousemove = this.touchmove = function(data)
  {
	if (this.dragging){
		this.processDrag(data, this);
		this.moved = true;
	}
	
	//this.initParticleNo(data);
  }
  this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = function(data) {
    this.dragging = false;
	console.log(this);
  };
  
  this.processSelected = function(){
	//unselectAll();

	QF.setting.selectedObj[0] = {
		obj:this, 
		alpha:this.alpha
	};
	
	this.alpha = 0.4;
	
	this.dirty = true;
	this.clearDirty = true;
  }
  
  this.processDrag = function(e){
	//var position = e.getLocalPosition(this.parent);//v2
	var position = e.data.getLocalPosition(this.parent);//v3

	this.position.x = position.x - this.mousePressPoint[0];
	this.position.y = position.y - this.mousePressPoint[1];
	
  }
  
  this.toggleVerticesNo = function(thisObj, visible){
	for (var x=0; x<thisObj.verticesNoTextArray.length; x++){	
	  thisObj.verticesNoTextArray[x].visible = visible;
	}
  }
  
  this.drawSpheroRadius = function(x1, y1, x2, y2, sradius){		
	//Find 4 points perpendicular to original points:
	var perpendTop1 = {x:-1, y:-1}, 
		perpendTop2 = perpendTop1, 
		perpendBottom1 = perpendTop1, 
		perpendBottom2 = perpendTop1;
		
	var nnx = y2-y1;
	var nny = x1-x2;
	
	var norm = Math.sqrt((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1));
	var temp = sradius / norm;
	nnx = nnx*temp;
	nny = nny*temp;
	
	perpendTop1 = {x:x1+nnx, y:y1+nny};
	perpendTop2 = {x:x2+nnx, y:y2+nny};
	perpendBottom2 = {x:x2-nnx, y:y2-nny};
	perpendBottom1 = {x:x1-nnx, y:y1-nny};
	
	var sphero = new PIXI.Graphics();
	sphero.beginFill(0xddd, 0.7);
	sphero.drawCircle(x1, y1, sradius);
	sphero.drawCircle(x2, y2, sradius);
	sphero.moveTo(perpendTop1.x, perpendTop1.y);
	sphero.lineTo(perpendTop2.x, perpendTop2.y);
	sphero.lineTo(perpendBottom2.x, perpendBottom2.y);
	sphero.lineTo(perpendBottom1.x, perpendBottom1.y);
	sphero.visible=QF.setting.spheroRadiusVisibility;
	this.addChild(sphero);
	QF.setting.spheroRadiusArray.push(sphero);
  }
  /*this.toggleParticleNo = function(thisObj, visible){
	if (this.mode.particleNo){
	  thisObj.seqNoText.visible = visible;
	}
  }*/
  
  /*this.setSeqNo = function(){
	  
	var counter=1;
	
	var polygonArray = stage.children;
	
	for (var x=0; x<polygonArray.length; x++){
		if (polygonArray[x] instanceof Polygon || polygonArray[x] instanceof Circle){
			counter++;
		}
	}
	
	this.seqNo=counter;
  }*/
  
  /*this.processDelete = function(){
	if (this.mode.delP){
		if (confirm('Are you sure to delete this polygon?')){
			this.stage.removeChild(this);
		}
	}
	this.dragging = false;
  }*/
  
	/*this.unselectAll = function(){
		for (var s=0; s<QF.setting.selectedObj.length; s++){
			QF.setting.selectedObj[s].obj.alpha = QF.setting.selectedObj[s].alpha;
			
			QF.setting.selectedObj[s].obj.dirty = true;
			QF.setting.selectedObj[s].obj.clearDirty = true;
		}
		
		QF.setting.selectedObj = [];
	}*/
}

QF.display.prototype = new PIXI.Container;
QF.display.prototype.constructor = QF.display;