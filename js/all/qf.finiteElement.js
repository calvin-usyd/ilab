"use strict";

QF.finiteElement = function(){
  //PIXI.DisplayObjectContainer.call(this);
  PIXI.Container.call(this);
  this.interactive = true;
  
  this.setPositionAt = function(x, y){
	
	this.position.x = x - this.position.x;
	this.position.y = y - this.position.y;
  }
}

QF.finiteElement.prototype = new PIXI.Graphics;
QF.finiteElement.prototype.constructor = QF.finiteElement;