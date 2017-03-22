//"use strict";

var renderer
	,stage = new PIXI.Stage(0xffffff, true)
	//stage = new PIXI.Container()//v3
	,lg = new QF.Logic()
	,selectArea = new PIXI.Graphics()
	,startSelection = false
	,cm = QF.Common();
;

function initRenderer(){
	// You can use either PIXI.WebGLRenderer, PIXI.CanvasRenderer, autoDetectRecommendedRenderer, autoDetectRenderer 
	//renderer = new PIXI.autoDetectRecommendedRenderer (QF.setting.canv.width, QF.setting.canv.height);
	/**id in html element is a global variable, so do not need $('#'), e.g: canvasPPP**/
	renderer = new PIXI.WebGLRenderer(canvasPPP.width - 300, canvasPPP.height + QF.setting.extraCanvasHeight, {view: canvasPPP});

	//document.body.appendChild(renderer.view);	
}

function animate() {
	renderer.render(stage);

	requestAnimationFrame(animate);
}

function initGrid(){
	//lg.setGrid(QF.setting.grid);
	//lg.drawGrid("0x000000");
}

function initSelectionArea(){
	stage.addChild(selectArea);
}
initRenderer();
//initGrid();
initSelectionArea();
requestAnimationFrame(animate);
crtl.getFileList();