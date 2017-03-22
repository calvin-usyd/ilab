"use strict";

QF.display = function(){
  PIXI.DisplayObjectContainer.call(this);
  /**
  this.interactive = true;
  this.mousePressPoint = [0, 0];
  
  this.mousedown = this.touchstart = function(data) {
	this.mousePressPoint[0] = data.getLocalPosition(this.parent).x - this.position.x;
	this.mousePressPoint[1] = data.getLocalPosition(this.parent).y - this.position.y;
	this.processSelected();
	this.dragging = true;
  };**/
  
  /*this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = function(data) {
    this.dragging = false;
	this.refreshCoordinate();
  };*/
  
  /**this.mousemove = this.touchmove = function(data){
	if (this.dragging)	{
		this.processDrag(data);
		
		console.log('sss');
		this.moved = true;
	}
  }
  
  this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = function(data) {
    this.dragging = false;
	
	if (this.moved){
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
		this.updateMovedPosition(gd, x, y);
	}
  }
  
  this.refreshCoordinate = function(propArray){
	this.clear();
	this.position.x=0;
	this.position.y=0;
	this.drawCircle(parseFloat(propArray[0].toFixed(2)), parseFloat(propArray[1].toFixed(2)), parseFloat(propArray[2]));
  }
  
  this.processSelected = function(){
	lg.unselectAll();

	QF.setting.selectedObj[0] = {
		obj:this, 
		alpha:this.alpha
	};
	
	if (this.alpha + QF.setting.offsetAlpha > 1){
		this.alpha = this.alpha - QF.setting.offsetAlpha;
		
	}else{
		this.alpha = this.alpha + QF.setting.offsetAlpha;
	}
	
	this.dirty = true;
	this.clearDirty = true;
	this.showPosition();
  }
  
  this.showPosition = function(){
	$('#oPos .x').html(this.position.x);
	$('#oPos .y').html(this.position.y);
  }
  
  this.processDrag = function(data){
	var position = data.getLocalPosition(this.parent);
		
	this.position.x = position.x - this.mousePressPoint[0];
	this.position.y = position.y - this.mousePressPoint[1];
  }**/
}

QF.display.prototype = new PIXI.DisplayObjectContainer;
QF.display.prototype.constructor = QF.display;