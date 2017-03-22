var canv = QF.setting.canv;
var grid = QF.setting.grid;
var cm = QF.Common();
var renderer;

var 
	stage = new PIXI.Container()//v3
	,gridG = new PIXI.Graphics()
	,selectArea = new PIXI.Graphics()
	,ppLg = new QF.ppLogic()
	,lgFE = new QF.LogicFE()
	,usrP = cm.toUserPointY(canv.height)
	,coord = {
		x:0,
		y:0
	};
;

stage.addChild(selectArea);

function initRenderer(){
	// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
	//renderer = new PIXI.WebGLRenderer(canv.width, canv.height);
	renderer = new PIXI.autoDetectRenderer(canv.width/1.1, canv.height*1.5, {backgroundColor: 0xffffff});
	//renderer = new PIXI.autoDetectRenderer(canv.width/2, canv.height, document.getElementById('canvas'));
	
	document.getElementById('canvas').appendChild(renderer.view);	
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
//drawGrid("0x000000");
requestAnimationFrame(animate);