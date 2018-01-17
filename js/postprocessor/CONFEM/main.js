var canv = QF.setting.canv;
var grid = QF.setting.grid;
var cm = QF.Common();
var renderer;

var 
	stage = new PIXI.Container()//v3
	,gridG = new PIXI.Graphics()
	,selectArea = new PIXI.Graphics()
	,ppMode = new QF.ppMode()
	,ppLg = new QF.ppLogic()
	,lgFE = new QF.LogicFE()
	,usrP = QFUtil.toMapPoint(canv.height, QF.setting.rulerOffset, 450, 50)
	,coord = {
		x:0,
		y:0
	};
;

stage.addChild(selectArea);

function initRenderer(){
	// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
	//renderer = new PIXI.WebGLRenderer(canv.width, canv.height);
	renderer = new PIXI.autoDetectRenderer(canv.width, canv.height, {backgroundColor: 0xffffff});
	
	document.body.appendChild(renderer.view);	
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

initRenderer();
//drawGrid("0x000000");
requestAnimationFrame(animate);
ppMode.initMeshData();
ppMode.initPltData();