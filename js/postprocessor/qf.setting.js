"use strict";
var QF = {};

QF.setting = {
	pName : '',
	pId : '',
	url : '//ilab.quantumfi.net/',
	serv_pppData : 'pppData/',
	serv_pppList : 'pppFList/',
	serv_pppExport : 'pppExport/',
	
	lineWidth : 2,
	lineColor : 222,
	lineTransparency : 0.2,
	BGTransparency : 0.2,
	BGColor : 333,
	roundedRad : 5,
	
	extraCanvasHeight : 400,
	
	modeComplexPolygon: false,
	/*modePolygon: false,
	modeCircle: false,
	modeRect: false,
	modeRoundRect: false,
	modeEllipse: false,
	modeText: false,*/
	
	isNewShape: false,
	startDraw: false,
	
	/*operEdit: false,
	operCopy: false,
	operRotate: false,
	operDel: false,
	operDelAll: false,
	operMove: false,
	operZoom: false,*/
	operSnap: true,
	operToggleGrid: false,
	selectMultiple: false,
	
	customVerticesArray: [],
	undoArray: [],
	redoArray: [],
	selectedObj: [],
	newShapeObj: {},
	selectionStartPoint: {'x':0, 'y':0},
	typeShapeMap: {'0':'Polygon', '1':'Rect', '2':'Circle', '3':'Ellipse', '4':'RoundedRect'},//Important: Type=>defined by PIXI, Shape=>follow class name
	funcShapeMap: {'0':'Polygon', '1':'Rect', '2':'Circle', '3':'Ellipse', '4':'RoundedRect'},//Important: func=>defined by PIXI, Shape=>follow class name
	canv: {
		height: window.innerHeight,
		width: window.innerWidth
	},
	grid: {
		height: window.innerHeight,
		width: window.innerWidth,
		dist: 20
	},
	offsetAlpha: 0.3
}


QF.setting.initEndDraw = function(){
	QF.setting.startDraw = false;
	QF.setting.customVerticesArray = [];
}
QF.setting.initNewDraw = function(){
	QF.setting.startDraw = true;
	QF.setting.isNewShape = true;
	QF.setting.customVerticesArray = [];
}
