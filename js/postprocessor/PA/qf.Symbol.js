"use strict"

QF.Symbol = function(){
	PIXI.Graphics.call(this);
	this.lineStyle(2, 0xff00ff, 1);
	
	this.setDirection = function(xLoad, yLoad){
		this.rotation = -Math.atan2(parseFloat(yLoad),parseFloat(xLoad));
	}
	
	this.rightWall = function(){
		this.leftWall();
		this.rotation=Math.PI;		
	}
	
	//dof(x, y) = (1, 1)
	this.leftWall = function(){
		var len = 8;
		var height = 8;
		
		this.moveTo(0, 5);
		this.lineTo(0, 25);
		for (var x=2; x<20; x+=5){
			this.moveTo(4, x+4);
			this.lineTo(4+len, x+height);	
		}
		//this.position.set(50, 50);
	}
	
	//dof(x, y) = (0, 1); 0=free, 1=fixed
	this.fixedY = function(){
		this.moveTo(0, 8);
		this.lineTo(-6, 18);
		this.lineTo(6, 18);
		this.lineTo(0, 8);
		for (var x=-6; x<15; x+=7){
			this.drawCircle(x, 25, 1);
		}
	}
	this.fixedXY = function(){
		var len = 8;
		var height = 4;
		this.moveTo(0, 8);
		this.lineTo(-6, 18);
		this.lineTo(6, 18);
		this.lineTo(0, 8);
		for (var x=-6; x<9; x+=5){
			this.moveTo(x, 20);
			this.lineTo(x+height, 20+len);	
		}
	}
	this.hinge = function(){
		this.drawCircle(0, 0, 3);
	}
}

QF.Symbol.prototype = new PIXI.Graphics;
QF.Symbol.prototype.constructor = QF.Symbol;