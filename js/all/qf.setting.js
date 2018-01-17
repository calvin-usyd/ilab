"use strict";

var windowPadding = {
	height: 25,
	//height: 70,
	width: 20
	//width: 0
};
//var url = '';
//var url = 'http://ilab.quantumfi.com.au/';
var url = '/';
//var minH = (window.innerHeight <= 500) ? 500 : window.innerHeight+1-windowPadding.height;
var minH = 630;

QF.setting = {
	projectArr: [],
	pName : '',
	pId : '',
	url : 'http://quantumfi.com.au/diagram-simulation/',
	serv_pData : url+'projectData/',
	serv_pList : url+'projectList/',
	serv_pfileList : url+'projectFileList/',
	serv_pFileUpload : url+'projectFileUpload/',
	serv_pDelete : url+'projectDelete/',
	serv_pSave : url+'save/',
	/*serv_exe : {
		SPOLY : url+'cgi-bin/solve_spoly.py?p=',
		CONFEM : url+'cgi-bin/solve_confem.py?p=',
		PATRUS : url+'cgi-bin/solve_patrus.py?p='
	},*/
	serv_exe : {
		SPOLY : {
			external : url+'solver/SPOLY'
			//,local: url+'cgi-bin/solve_spoly.py?p='
		},
		CONFEM : {
			external: url+'solver/CONFEM'
			//,local: url+'cgi-bin/solve_confem.py?p='
		},
		PATRUS : {
			external : url+'solver/PATRUS'
			//,local: url+'cgi-bin/solve_patrus.py?p='
		}
	},
	serv_result : url+'result/',
	/*serv_result : {
		SPOLY : url+'result/',
		CONFEM : url+'confem/'
	},*/
	serv_fList : url+'fileList/',
	
	serv_propSave : url+'propSave/',
	serv_propList : url+'propList/',
	serv_propEdit : url+'propEdit/',
	serv_propSaveEdit : url+'saveEditPropExcel/',
	
	serv_consSave : url+'consSave/',
	serv_consList : url+'consList/',
	serv_consSaveEdit : url+'saveEditConsExcel/',
	
	serv_imageList : url+'imageList/',
	serv_imageUpload : url+'imageUpload/',
	serv_imageDelete : url+'imageDelete/',
	
	serv_profileView : url+'profileView/',
	serv_profileEdit : url+'profileEdit/',
	serv_activateSession : url+'activateSession/',
	
	//SPAS
	spasEditorForm:{},
	spasConsForm:[],
	
	//All ELEMENT
	isFESpas: false,
	isFE: false,
	isDE: false,
	
	//FINITE ELEMENT
	isNode: false,
	nodeIndexArrayTemp: [],
	nodeObjArrayTemp: [],//[{x:0,y:1},..,...]
	nodeObjArray: [],//[{x:0,y:1},..,...]
	nodeNoVisibility: false,
	nodeNoTextArray: [],
	elementNoTextArray: [],
	arrowTextArray: [],
	loadTextArray: [],
	bcTextArray: [],
	loadTextVisibility: false,
	bcTextVisibility: false,
	elementNoVisibility: false,
	elementIndexArray: [],//[{type:beam2Truss, prop:prop1, nodes:[1,2,3]},...,...]
	nodesAttrVal: {},
	elemAttrVal: [],
	elemAttr: {
		'b2Truss':		{geo:{exists:true, props:['area']}},
		'b2Beam':		{geo:{exists:true, props:['area', 'momentInertia']}},
		't3PlaneStrain':{geo:{exists:false}},
		't3PlaneStress':{geo:{exists:true, props:['thickness']}},
		't3Plate':		{geo:{exists:true, props:['thickness']}},
		'q4PlaneStrain':{geo:{exists:false}},
		'q4PlaneStress':{geo:{exists:true, props:['thickness']}},
		'q4Plate':		{geo:{exists:true, props:['thickness']}}
	},
	
	
	//DISCRETE ELEMENT 
	drawLine:false,
	drawCircle:false,
	drawPolygon:false,
	spheroRadiusVisibility: false,
	particleNoVisibility: false,
	verticesNoVisibility: false,
	deObjArray: [],
	spheroRadiusArray: [],
	particleNoTextArray: [],
	verticesNoTextArray: [],
	radius: 15,
	customVerticesObject:{}, 
	customVerticesArray:[],//{x:'', y:'', r:'', m:'', c:'', p:''} r=radius, m=mark, c=constraint, p:property
	
	//Handsontable
	hotEditorSpas:{},
	hotEditorNode:{},
	hotEditorElem:{},
	hotEditorSpoly:{},
	hotPropFe:{},
	hotPropDe:{},
	modifiedRecordPropFe:[],
	modifiedRecordPropDe:[],
	modifiedRecordPropSpas:[],
	modifiedRecordConsSpas:[],
	modifiedRecordConsNode:[],
	modifiedRecordConsParticle:[],
	dataConsSpas:[],//Boundary Condition
	dataConsSpasIC:[],//Initial Condition
	dataConsNode:[],
	dataConsParticle:[],
	dataPropSpoly:[],
	dataPropSpas:[],
	dataEditorSpas:[],
	dataEditorNode:[],
	dataEditorElem:[],
	dataEditorSpoly:[],
	hasChangedEditorSpas:false,
	hasChangedEditorN:false,
	hasChangedEditorElem:false,
	hasChangedEditorSpoly:false,
	
	
	
	//GUI 
	account:{},
	files:{},
	controls:{},
	solver:{},
	info:{},
	parameter:{},
	simulation:{},
	elem:{},
	
	//SOLVER
	solverVal:{},
	solverSpoly:{
		param:{
			"grav": "-9.81",
			"aoiog": "90",
			"vd": "5.0e-3",
			"ts": "5e-5",
			"cm": "viscoelastic"
		},
		sim:{
			"simulationName": "v1",
			"graphicalOutput": "gnuplot",
			"domainLength": 1000,
			"leftLimit": 0,
			"rightLimit": 1000,
			"bottomLimit": 0,
			"topLimit": minH,
			"framePerSecond": 10,
			"dataPerSecond": 10,
			"simulationTime": 10	
		}
	},
	solverPatrus:{},
	solverSpas:{},
	/*solverSpasAnalysisCodeVal:{
		'111':'STEADY_STATE_SEEPAGE_EQUATION',
		'121':'TRANSIENT_SEEPAGE_EQUATION',
		'211':'STEADY_DIFFUSION_ADVECTION_EQUATION',
		'221':'TRANSIENT_DIFFUSION_ADVECTION_EQUATION',
		'311':'COUPLED_ALL_STEADY_SEEPAGE_DIFFUSION_ADVECTION_EQUATION',
		'321':'COUPLED_ALL_TRANSIENT_SEEPAGE_DIFFUSION_ADVECTION_EQUATION',
		'331':'COUPLED_SEEPAGE_DIFFUSION_ADVECTION_EQUATION',
		'112':'SREADY_STATE_RICHARDS_EQUATION',
		'122':'TRANSIENT_RICHARDS_EQUATION',
		'212':'STEADY_STATE_UNSATURATED_DIFFUSION_ADVECTION_EQUATION',
		'222':'TRANSIENT_UNSATURATED_DIFFUSION_ADVECTION_EQUATION',
		'312':'COUPLED_ALL_STEADY_RICHARD_DIFFUSION_ADVECTION_EQUATION',
		'322':'COUPLED_ALL_TRANSIENT_RICHARD_DIFFUSION_ADVECTION_EQUATION',
		'333':'COUPLED_RICHARD_DIFFUSION_ADVECTION_EQUATION'
	},*/
	bcType:{
		'111':'wf', '121':'wf', //wf = water flow
		'211':'cm', '221':'cm', //cm = contaminant migration
		'311':'both', '321':'both', '331':'both'
	},
	solverType:'',//1=SPOLY, 2=PAPTRUS, 3=CONFEM
	
	
	//COMMON
	//unitVal:1,
	userScreen:{},
	imageUploadLimit:4,
	imageUploaded:0,
	mouseX:0.01,
	mouseY:0.01,
	undoArray: [],
	dotArray: [],
	gridVisibility: true,
	axesVisibility: true,
	isSelect: false,
	startSelection: false,
	selectedObj: {},
	rulerText:[],
	rulerOffset:20,
	selectionStartPoint: {x:-1, y:-1},
	move: false,
	snapGrid: true,
	canv: {
		height: minH,
		width: 1208//window.innerWidth+1-windowPadding.width
	},
	grid: {
		height: minH,
		width: 1208,//window.innerWidth,
		size: 1,
		distX:20,
		distY:20
	},
	offsetAlpha: 0.7
}