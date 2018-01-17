"use strict"

QF.Arrow = function(){
	PIXI.Graphics.call(this);
	this.lineStyle(4, 0x167ac6, 1);
	this.moveTo(0, 0);
	this.lineTo(40, 0);
	this.moveTo(30, 10);
	this.lineTo(40, 0);		
	this.moveTo(30, -10);
	this.lineTo(40, 0);
	
	this.setDirection = function(xLoad, yLoad){
		this.rotation = -Math.atan2(parseFloat(yLoad),parseFloat(xLoad));
	}
}

QF.Arrow.prototype = new PIXI.Graphics;
QF.Arrow.prototype.constructor = QF.Arrow;