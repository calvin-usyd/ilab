var canv = QF.setting.canv;
var grid = QF.setting.grid;
var cm = QF.Common();
var renderer;

var stage = new PIXI.Stage(0xffffff, true)
	,gridG = new PIXI.Graphics()
	,axesX = new PIXI.Graphics()
	,axesY = new PIXI.Graphics()
	,rulerX = new PIXI.Graphics()
	,rulerY = new PIXI.Graphics()
	,rulerBigX = new PIXI.Graphics()
	,rulerBigY = new PIXI.Graphics()
	,selectArea = new PIXI.Graphics()
	,lgSelect = new QF.LogicSelect()
	,lg = new QF.Logic()
	,usrP = cm.toUserPointY(canv.height)
	,coord = {
		x:0,
		y:0
	};
;
function initRenderer(){
	// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
	renderer = new PIXI.WebGLRenderer(canv.width, canv.height);

	document.body.appendChild(renderer.view);	
}

function initStats(){
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
}

initDomainLenGUI = function(value){
	domainLenG.x=value;
}
initLLimitGUI = function(value){
	leftLimG.x=value;
}
initRLimitGUI = function(value){
	rightLimG.x=value;
}
initBLimitGUI = function(value){
	bottomLimG.y=usrP(value);
}
initTopLimitGUI = function(value){
	topLimG.y=usrP(value);
}
function initSelectArea(){
	stage.addChild(selectArea);
}
function initDomainLength(){
	//len = canv.width-120;
	//len = 200;
	domainLenG = new PIXI.Graphics();
	domainLenG.lineStyle(2, 0x00ffff, 1);
	domainLenG.moveTo( 0, 0 );
	domainLenG.lineTo( 0, canv.height);
	stage.addChild(domainLenG);
}
function initRightLim(){
	//right = canv.width-100;
	rightLimG = new PIXI.Graphics();
	rightLimG.lineStyle(2, 0xff0000, 1);
	rightLimG.moveTo( 0, 0 );
	rightLimG.lineTo( 0, canv.height);
	stage.addChild(rightLimG);
}
function initLeftLim(){
	//left = 25;
	leftLimG = new PIXI.Graphics();
	leftLimG.lineStyle(2, 0xff0000, 1);
	leftLimG.moveTo( 0, 0 );
	leftLimG.lineTo( 0, canv.height);
	stage.addChild(leftLimG);
}
function initBottomLim(){
	//bottom = canv.height-120;
	bottomLimG = new PIXI.Graphics();
	bottomLimG.lineStyle(2, 0xff0000, 1);
	bottomLimG.moveTo( 0, 0 );
	bottomLimG.lineTo( canv.width, 0);
	stage.addChild(bottomLimG);
}
function initTopLim(){
	//topLim = 125;
	topLimG = new PIXI.Graphics();
	topLimG.lineStyle(2, 0xff0000, 1);
	topLimG.moveTo( 0, 0 );
	topLimG.lineTo( canv.width, 0);
	stage.addChild(topLimG);
}
function initRulerY(){
	rulerY = new PIXI.Graphics();
	rulerY.lineStyle(1, 0x000, 1);
	
	for (var y=canv.height; y>0; y-=5){
		rulerY.moveTo(0, y);
		rulerY.lineTo(5, y);
	}
	
	var counterY = 0;
	rulerBigY = new PIXI.Graphics();
	rulerBigY.lineStyle(1, 0x000, 1);
	
	for (var y=canv.height; y>0; y-=20){
		rulerBigY.moveTo(0, y);
		rulerBigY.lineTo(10, y);
	}
	
	for (var y=grid.height; y>0; y-=40){
		var text = new PIXI.Text(counterY)
		text.position.x = 15;
		text.position.y = y - 7;
		text.setStyle({font:"9px Arial", fill:"black"});
		text.cacheAsBitmap = true;
		
		counterY += 40;
		stage.addChild(text);
		QF.setting.rulerText.push(text);
	}
	
	stage.addChild(rulerY);
	stage.addChild(rulerBigY);
}
function initRulerX(){
	rulerX = new PIXI.Graphics();
	rulerX.lineStyle(1, 0x000, 1);
	
	for (var x=0; x<canv.width; x+=5){
		rulerX.moveTo(x, 0);
		rulerX.lineTo(x, 5);
	}
	
	rulerBigX = new PIXI.Graphics();
	rulerBigX.lineStyle(1, 0x000, 1);
	
	for (var x=0; x<canv.width; x+=20){
		rulerBigX.moveTo(x, 0);
		rulerBigX.lineTo(x, 10);
	}
	
	for (var x=0; x<canv.width; x+=40){
		var text = new PIXI.Text(x);
		text.position.x = x - 2;
		text.position.y = 15;
		text.setStyle({font:"9px Arial", fill:"black"});
		text.cacheAsBitmap = true;//Is it really improving performance??
		stage.addChild(text);
		QF.setting.rulerText.push(text);
	}
	
	stage.addChild(rulerX);
	stage.addChild(rulerBigX);
}
function initAxes(){
	var arrowLen = 20;
	
	//X axes
	axesY = new PIXI.Graphics();
	axesY.lineStyle(2, 0xcccccc, 1);
	
	axesY.moveTo( 0, canv.height);
	
	axesY.lineTo(0, 0);
	
	axesY.lineTo(arrowLen, arrowLen);
	
	stage.addChild(axesY);
	
	//console.log(axesY);
	//Y axes
	axesX = new PIXI.Graphics();
	axesX.lineStyle(2, 0xcccccc, 1);
	
	axesX.moveTo( 0, canv.height );
	
	axesX.lineTo(canv.width, canv.height);
	
	axesX.lineTo(canv.width-arrowLen, canv.height-arrowLen);
	
	stage.addChild(axesX);
}

function drawGrid() {
	var size = 2000;
	var step = 100;

	var gridHelper = new THREE.GridHelper( size, step );
	scene.add( gridHelper );
}

function drawGrid(color){
	stage.removeChild(gridG);
	
	gridG = new PIXI.Graphics();
	
	var cellSize = grid.size;
	/*Max grid 5220 (2610+2610), grid will not be drawn if more than max*/
	gridG.beginFill(color);
	
	for(var x = -grid.distX; x < grid.width; x+=grid.distX){
		for(var y = grid.height; y > -grid.distY; y-=grid.distY){
			//gridG.drawRect(x, y, cellSize, cellSize);
			gridG.drawCircle(x, y, cellSize);
		}
	}
	//gridG.endFill();
	stage.addChild(gridG);
}

function animate() {
	renderer.render(stage);

	requestAnimationFrame(animate);
	//stats.update();
}

stage.mousedown = stage.touchstart = stage.tap = function(mouseData) {
	if (QF.setting.isSelect){
		lgSelect.unselectAll();
		
		QF.setting.selectionStartPoint = getMousePos(mouseData);

		QF.setting.startSelection = true;
		
	}else if (QF.setting.isFE){
		lg.drawNodeSnapGrid(getMousePos(mouseData));
		
	}else if (QF.setting.isDE){
		lg.drawVertices(getMousePos(mouseData));
		
	}else if (QF.setting.move){
		lg.moveSelected(mouseData.originalEvent.offsetX, mouseData.originalEvent.offsetY );
	}
};

stage.mousemove = function(mouseData){
	mousePositionGui(getMousePos(mouseData));
	
	if (QF.setting.isSelect && QF.setting.startSelection){
		//lgSelect.selectMultiple(mouseData.originalEvent);
		lgSelect.selectMultiple(getMousePos(mouseData));
	}
}

stage.mouseup = stage.mouseupoutside = function(){
	if (QF.setting.isSelect && QF.setting.startSelection){
		console.log(stage);
		lgSelect.processSelected();
	}
}

function mousePositionGui(newPosition) {
	coord = toUserPoint(
		newPosition.x-grid.distX, 
		newPosition.y+grid.distY
	);
	QF.setting.mouseX=coord.x.toFixed(2);
	QF.setting.mouseY=coord.y.toFixed(2);
}

function getMousePos(mouseData){
	var mD = mouseData.getLocalPosition(stage);
	
	//if (mD.y == -1) mD.y = 0;
	
	return mD;
}
//User coordinate should start from bottom left
var toUserPoint = function(x, y){
	var usrP = cm.toUserPointY(canv.height);
	var temp = coord;
	temp.x = parseInt(x);
	temp.y = usrP(y);
	return temp;
}
//System coordinate start from top left
var toSystemPoint = function(x, y){
	var temp = coord;
	temp.x = x;
	temp.y = canv.height-y-1;
	return temp;
}

initRenderer();
//initStats();
initAxes();
initRulerX();
initRulerY();
drawGrid("0x000000");
initSelectArea();
initDomainLength();
initLeftLim();
initRightLim();
initBottomLim();
initTopLim();
requestAnimationFrame(animate);
//QF.GuiCrtl.initGui();