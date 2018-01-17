"use strict";

QF.LogicDE = function(){

//Discrete Element
var dot = new Dot(),
polygon = new Polygon(),
circle = new Circle();
;

this.drawDEByRightClick = function(){
	var 
	elem = new Polygon(),
	cVAObj = QF.setting.customVerticesArray,
	cVALen = cVAObj.length,
	x = cVAObj[0].x,
	y = cVAObj[0].y,
	m = cVAObj[0].m,
	r = cVAObj[0].r,
	c = cVAObj[0].c,
	p = cVAObj[0].p,
	x1 = x, y1 = y, 
	x2, y2,
	isClosed = x==cVAObj[cVALen-1].x && y==cVAObj[cVALen-1].y
	;
	
	if (cVALen == 1){
		elem = new Circle()
		elem.beginFill(0x00FF00);
		elem.drawCircle(x, y, 3);
		elem.drawSpheroRadiusCircle(x, y, r);
		
	}else if (cVALen == 2){
		x2 = cVAObj[1].x;
		y2 = cVAObj[1].y;
		
		elem.lineStyle(2, 0x00FF00, 1);
		elem.moveTo( x, y );
		elem.lineTo( x2, y2 );
		elem.drawSpheroRadius(x, y, x2, y2, r);
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
			elem.drawSpheroRadius(x1, y1, x2, y2, r);
			x1=x2;
			y1=y2;
		}
		elem.initVerticesNo();
		
		if (isClosed)	elem.drawSpheroRadius(x2, y2, x, y, r);
	}
	
	elem.mark=m;
	elem.radius=r;
	elem.constraint=c;
	elem.property=p;
	elem.initParticleNo();
	stage.addChild(elem);
	//console.log(elem);
	QF.setting.customVerticesArray = [];
	QF.setting.undoArray.push(elem);
	QF.setting.deObjArray.push(elem);
	_.forEach(QF.setting.dotArray, function(c){ stage.removeChild(c); });
	renderer.render(stage);
}
this.drawVertices = function(mousePos){
	/*mousePos = {
		x:mousePos.x-grid.distX,
		y:mousePos.y+grid.distY
	}*/	
	if (QF.setting.snapGrid){
		mousePos = QFUtil.snap2Grid(mousePos, grid);
	}
	var cva = QF.setting.customVerticesArray,
		cvo = cva[cva.length-1];

	////DRAW VERTEX IF:
	////1. NO VERTEX
	////2. CURRENT VERTEX POSITION != PREVIOUS VERTEX POSITION 
	if (typeof cvo === 'undefined' || (mousePos.x != cvo.x || mousePos.y != cvo.y )){
		this.drawDot(mousePos);
		QF.setting.customVerticesArray.push({x:mousePos.x, y:mousePos.y});
	}
}
this.drawDot = function(mousePos){
	var dot = new Dot();
	dot.beginFill(0xff00dd);
	dot.drawCircle(mousePos.x, mousePos.y, grid.size + 3);
	dot.endFill();
	stage.addChild(dot);
	
	QF.setting.dotArray.push(dot);
}
this.toggleSpheroRadius = function(){
	_.forEach(QF.setting.spheroRadiusArray, function(o){o.visible = QF.setting.spheroRadiusVisibility});
}
this.toggleVerticesNo = function(){
	_.forEach(QF.setting.verticesNoTextArray, function(o){o.visible = QF.setting.verticesNoVisibility});
}
this.toggleParticleNo = function(){
	_.forEach(QF.setting.particleNoTextArray, function(o){console.log(o); o.visible = QF.setting.particleNoVisibility});
}
}
QF.LogicDE.prototype = new QF.LogicDE;
QF.LogicDE.prototype.constructor = QF.LogicDE;