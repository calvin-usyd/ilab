var canv = QF.setting.canv;
var grid = QF.setting.grid;
//var cm = QF.Common();
var renderer;

var 
	stage = new PIXI.Container()//v3
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
	,lgDE = new QF.LogicDE()
	,lgFE = new QF.LogicFE()
	,lgProj = new QF.LogicProject()
	,lgEditor = new QF.LogicEditor()
	,lgCheck = new QF.LogicValidation()
	//,usrP = cm.toMapPoint(canv.height, QF.setting.rulerOffset, QF.setting.unitVal)
	,mapP = QFUtil.toMapPoint(canv.height, QF.setting.rulerOffset)
	,dynamicP = mapP
	,text0, textX, textY
	,coord = {
		x:0,
		y:0
	};
;
function initRenderer(){
	// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
	//renderer = new PIXI.WebGLRenderer(canv.width, canv.height);
	PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
	renderer = new PIXI.autoDetectRenderer(canv.width, canv.height, {backgroundColor: 0xffffff});
	renderer.view.onmousedown = function(e)
	{
		if (e.which == 1){
			lgSelect.unselectAll();
			var mp = lg.getMousePos();
			if (QF.setting.isSelect){
				QF.setting.selectionStartPoint = {x:mp.x, y:mp.y};

				QF.setting.startSelection = true;
				
			}else if (QF.setting.isFESpas){
				lgFE.drawNodeSnapGrid(mp);
				
			}else if (QF.setting.isFE){
				lgFE.drawNodeSnapGrid(mp);
				
			}else if (QF.setting.isDE){
				lgDE.drawVertices(mp);
				
			}else if (QF.setting.move){
				//lg.moveSelected(mouseData.originalEvent.offsetX, mouseData.originalEvent.offsetY );
			}
		}
	}
	renderer.view.onmousemove = function(){
		var mp = lg.getMousePos();
		mousePositionGui(mp);
		
		if (QF.setting.isSelect && QF.setting.startSelection){
			lgSelect.selectMultiple(mp);
			animate();
		}
		updateMouse();
	}

	renderer.view.onmouseup = renderer.view.onmouseupoutside = function(){
		if (QF.setting.isSelect && QF.setting.startSelection){
			lgSelect.processSelected();
		}
		animate();
	}
	document.body.appendChild(renderer.view);	
}

function initSelectArea(){
	stage.addChild(selectArea);
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
	/*rulerY = new PIXI.Graphics();
	rulerY.lineStyle(1, 0x000, 1);
	
	for (var y=canv.height; y>0; y-=5){
		rulerY.moveTo(QF.setting.rulerOffset, y);
		rulerY.lineTo(QF.setting.rulerOffset+5, y);
	}*/
	
	rulerBigY = new PIXI.Graphics();
	rulerBigY.lineStyle(1, 0x000, 1);

	//rulerBigY.moveTo(QF.setting.rulerOffset, canv.height);
	//rulerBigY.lineTo(canv.width-QF.setting.rulerOffset, canv.height);
	for (var y=canv.height; y>0; y-=20){
		rulerBigY.moveTo(QF.setting.rulerOffset, y);
		rulerBigY.lineTo(QF.setting.rulerOffset-10, y);
	}
	stage.addChild(rulerY);
	stage.addChild(rulerBigY);
}
function initRulerText(){
	stage.removeChild(text0);
	stage.removeChild(textY);
	stage.removeChild(textX);
	
	text0 = new PIXI.Text('(0, 0)', {fontFamily:"Arial", fontSize:"12px", fill:0x000000, align:'center'});
	text0.position.x = QF.setting.rulerOffset-5;
	text0.position.y = canv.height-QF.setting.rulerOffset+5;
	stage.addChild(text0);
	
	var mapXY = lg.getMappedCoord({x:canv.width-QF.setting.rulerOffset, y:0});
    textY = new PIXI.Text('y: '+mapXY.y.toFixed(2), {fontFamily:"Arial", fontSize:"12px", fill:0x000000, align:'center'});
	textY.position.x = QF.setting.rulerOffset+5;
	textY.position.y = 5;
	stage.addChild(textY);
	
	textX = new PIXI.Text('x: '+mapXY.x.toFixed(2), {fontFamily:"Arial", fontSize:"12px", fill:0x000000, align:'center'});
	textX.position.x = canv.width - QF.setting.rulerOffset-40;
	textX.position.y = canv.height-QF.setting.rulerOffset+5;
	stage.addChild(textX);
}
function initRulerText_del(){
	_.forEach(QF.setting.rulerText, function(o){
		stage.removeChild(o);
	});
	QF.setting.rulerText = [];
	var rOffset = QF.setting.rulerOffset;
	var counterY = -rOffset;
	for (var y=grid.height-2; y>0; y-=rOffset){
		var text = new PIXI.Text(counterY==0?"0":(counterY/QF.setting.unitVal).toFixed(2), {fontFamily:"Arial", fontSize:"8px", fill:0x000000, align:'center'});
		text.position.x = 15;
		text.position.y = y-6;
		stage.addChild(text);
		QF.setting.rulerText.push(text);
		counterY += rOffset;
	}
	for (var x=-rOffset; x<canv.width; x+=rOffset){
		var text = new PIXI.Text(x==0?"0":(x/QF.setting.unitVal).toFixed(2),{fontSize:"8px"});
		text.position.x = x - 2 + rOffset;
		text.position.y = 10;
		stage.addChild(text);
		QF.setting.rulerText.push(text);
	}
}
function initRulerX(){
	rulerX = new PIXI.Graphics();
	rulerX.lineStyle(1, 0x000, 1);
	
	for (var x=0; x<canv.width; x+=5){
		rulerX.moveTo(x, QF.setting.rulerOffset);
		rulerX.lineTo(x, QF.setting.rulerOffset+5);
	}
	
	rulerBigX = new PIXI.Graphics();
	rulerBigX.lineStyle(1, 0x000, 1);
	
	for (var x=0; x<canv.width; x+=20){
		rulerBigX.moveTo(x, QF.setting.rulerOffset);
		rulerBigX.lineTo(x, QF.setting.rulerOffset+10);
	}
	
	stage.addChild(rulerX);
	stage.addChild(rulerBigX);
}
function initAxes(){
	var arrowLen = 10;
	
	//Y axes
	axesY = new PIXI.Graphics();
	axesY.lineStyle(2, 0xcccccc, 1);
	
	axesY.moveTo(QF.setting.rulerOffset, canv.height-QF.setting.rulerOffset);
	
	axesY.lineTo(QF.setting.rulerOffset, 0);
	
	axesY.lineTo(arrowLen, arrowLen);
	
	stage.addChild(axesY);
	
	//console.log(axesY);
	//X axes
	axesX = new PIXI.Graphics();
	axesX.lineStyle(2, 0xcccccc, 1);
	
	axesX.moveTo( QF.setting.rulerOffset, canv.height - QF.setting.rulerOffset);
	
	axesX.lineTo(canv.width, canv.height-QF.setting.rulerOffset);
	
	axesX.lineTo(canv.width-arrowLen, canv.height-QF.setting.rulerOffset+arrowLen);
	
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
		for(var y = grid.height-1; y > -grid.distY; y-=grid.distY){
			//gridG.drawRect(x, y, cellSize, cellSize);
			gridG.drawCircle(x, y, cellSize);
		}
	}
	//gridG.endFill();
	stage.addChild(gridG);
}

function updateMouse() {
  var mapXY = lg.getMappedCoord(lg.getMousePos());
  QF.setting.info.mouseX = mapXY.x - 2*QF.setting.rulerOffset;//(QF.setting.mouseX / QF.setting.unitVal).toFixed(2);
  QF.setting.info.mouseY = mapXY.y;//QF.setting.mouseY / QF.setting.unitVal;
}
function animate() {
	renderer.render(stage);
	QF.setting.info.nodeCount = QF.setting.nodeObjArray.length;
	QF.setting.info.elementCount = QF.setting.elementIndexArray.length;
	QF.setting.info.vertexCount = QF.setting.verticesNoTextArray.length;
	QF.setting.info.particleCount = QF.setting.particleNoTextArray.length;
	//requestAnimationFrame(animate);
	//stats.update();
}

function mousePositionGui(newPosition) {
	//coord = toUserPoint(
	coord = mapP.user(
		newPosition.x, 
		newPosition.y
	);
	QF.setting.mouseX=coord.x;
	QF.setting.mouseY=coord.y;
}

//User coordinate should start from bottom left
/*var toUserPoint = function(x, y){
	//var usrP = cm.toUserPointY(canv.height);
	/*var temp = coord;
	temp.x = parseInt(x);
	temp.y = usrP(x, y);
	return temp;/
	return usrP(x, y);;
}*/
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
//initRulerX();
//initRulerY();
initRulerText();
//drawGrid("0x000000");
drawGrid("0xb4bcc2");
initSelectArea();
//initDomainLength();
//initLeftLim();
//initRightLim();
//initBottomLim();
//initTopLim();
//requestAnimationFrame(animate);
renderer.render(stage);
//QF.GuiCrtl.initGui();