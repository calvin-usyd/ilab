"use strict";

var cm = QF.Common();
$(function(){
	//ELEMENT PROPERTIES
	var
	excelHeaderPropFe=[
		"Id",
		"Name",
		"type",
		"Property type",
		"Young's modulus",
		"Poisson's ratio",
		"Area",
		"Moment of inertia",
		"Thickness",
		"Delete"
	],
	excelColumnPropFe=[
		{data:"propLongId",width: 100,editor: false},
		{data:"name",width: 100},
		{data:"type",width: 100},
		{data:"pType",width: 100},
		{data:"youngModulus",width: 200},
		{data:"poissonRatio",width: 200},
		{data:"area",width: 100},
		{data:"moment",width: 200},
		{data:"thinkness",width: 100},
		{data:"delete",type:'checkbox'}
	],
	excelHeaderPropDe=[
		"Id",
		"Name",
		"N. contact stiffness",
		"T. contact stiffness",
		"Coef. of friction",
		"Coef. of rolling",
		"N. Coef. of viscosity",
		"T. Coef. of viscosity",
		"Drag Coef. of viscosity",
		"Density",
		"Delete"
	],
	excelColumnPropDe=[
		{data:"propLongId",width: 120,editor: false},
		{data:"name",width: 150},
		{data:"ncs",width: 150},
		{data:"tcs",width: 150},
		{data:"cof",width: 130},
		{data:"cor",width: 130},
		{data:"ncov",width: 140},
		{data:"tcov",width: 140},
		{data:"dcov",width: 160},
		{data:"density",width: 80},
		{data:"delete",type:'checkbox'}
	],
	excelHeaderPropSpas=[
		"Id",
		"Name",
		"Molecule Diffusion",
		"Specific Storage",
		"Hydraulic Conductivity",
		"Dispersivity",
		"Dry Density",
		"Porosity",
		"Decay Half Life",
		"Add Seepage",
		"T. Instantaneous Fraction",
		"T. Sorption Rate",
		"Diffusion",
		"L. Sorption Coefficient",
		"Interlayer D. Top",
		"Interlayer D. Bottom",
		"Transmissivity",
		"Sorption",
		"Replace Seepage",
		"Delete"
	],
	excelColumnPropSpas=[
		//{data:"propLongId",width: 120,editor: false},
		{data:"mpId",width: 50},
		{data:"name",width: 100},
		{data:"MOLECULAR_DIFFUSION",width: 150},
		{data:"SPECIFIC_STORAGE",width: 130},
		{data:"HYDRAULIC_CONDUCTIVITY",width: 150},
		{data:"DISPERSIVITY",width: 100},
		{data:"DRY_DENSITY",width: 100},
		{data:"POROSITY",width: 100},
		{data:"DECAY_HALF_LIFE",width: 120},
		{data:"ADD_SEEPAGE",width: 100},
		{data:"TRANSIENT_INSTANTANEOUS_FRACTION",width: 150},
		{data:"TRANSIENT_SORPTION_RATE",width: 150},
		{data:"DIFFUSION",width: 100},
		{data:"LINEAR_SORPTION_COEFFICIENT",width: 150},
		{data:"INTERLAYER_DISCONTINUITY_TOP",width: 150},
		{data:"INTERLAYER_DISCONTINUITY_BOTTOM",width: 150},
		{data:"TRANSMISSIVITY",width: 150},
		{data:"SORPTION",width: 150},
		{data:"REPLACE_SEEPAGE",width: 150},
		{data:"delete",type:'checkbox'}
	]
	;
	
	var afterChangePropFe = function(changes, source) {
		if (changes){
		  QF.setting.modifiedRecordPropFe.push(_.map(changes, function(change){
			return QF.setting.dataPropFe[change[0]];
		  }));
		  
		  QF.setting.modifiedRecordPropFe=_.uniq(_.flatten(QF.setting.modifiedRecordPropFe));
		  //console.log(QF.setting.modifiedRecordPropFe);
		}
	}
	var afterChangePropDe = function(changes, source) {
		if (changes){
		  QF.setting.modifiedRecordPropDe.push(_.map(changes, function(change){
			return QF.setting.dataPropSpoly[change[0]];
		  }));
		  QF.setting.modifiedRecordPropDe=_.uniq(_.flatten(QF.setting.modifiedRecordPropDe));
		}
	}
	var afterChangePropSpas = function(changes, source) {
		if (changes){
		  QF.setting.modifiedRecordPropSpas.push(_.map(changes, function(change){
			return QF.setting.dataPropSpas[change[0]];
		  }));
		  QF.setting.modifiedRecordPropSpas=_.uniq(_.flatten(QF.setting.modifiedRecordPropSpas));
		}
	}
	QF.setting.hotPropFe = cm.initHotExcel($('#hotPropFe')[0], excelHeaderPropFe, excelColumnPropFe, afterChangePropFe);
	QF.setting.hotPropDe = cm.initHotExcel($('#hotPropDe')[0], excelHeaderPropDe, excelColumnPropDe, afterChangePropDe);
	QF.setting.hotPropSpas = cm.initHotExcel($('#hotPropSpas')[0], excelHeaderPropSpas, excelColumnPropSpas, afterChangePropSpas);
	
	
	
	
	
	
	
	
	
	//ELEMENT EDITOR
	var
	colHeadersSpas=[
		'Layer ID', 
		'Type', 
		'Thickness', 
		//'Inc. Left height', 
		//'Inc. Left Width', 
		//'Inc. Right Height', 
		//'Inc. Right Width', 
		'Material Property', 
		//'mSubHorizontal', 
		'Mesh Subdivision Vertical', 
		//'mRatioHorizontal',
		'Mesh Ratio Vertical', 
		'Element Type'
	],
	colHeadersNodes=['X', 'Y', 'constraint'],
	colHeadersElem=['Index', 'Property', 'Node 1', 'Node 2', 'Node 3', 'Node 4', 'Node 5'],
	colHeadersSpoly=['Index', 'constraint', 'property', 'mark', 'radius', 'Vertices Count', 'X', 'Y'],
	excelColumnEditorSpas=[
		{data:"layer",width: 80,type:'numeric',format:'0'},
		{data:"type",width: 100,type: 'dropdown', source:['REGULAR', 'LEAK']},
		{data:"thickness",width: 100},
		//{data:"incLeftHeight",width: 140},
		//{data:"incLeftWidth",width: 140},
		//{data:"incRightHeight",width: 140},
		//{data:"incRightWidth",width: 140},
		{data:"prop",width: 140},
		//{data:"mSubH",width: 120},
		{data:"mSubV",width: 120},
		//{data:"mRatioH",width: 140},
		{data:"mRatioV",width: 120},
		{data:"eType",width: 180,type: 'dropdown', source:['3 - Linear Triangle', '4 - Quadratic Triangle', '6 - Linear Quad', '8 - Quadratic Quad']}
	],
	excelColumnEditorNode=[
		{data:"x",width: 100,type:'numeric',format:'0.00'},
		{data:"y",width: 100,type:'numeric',format:'0.00'},
		{data:"constraint",width: 100,type:'numeric',format:'0'}
	],
	excelColumnEditorElem=[
		{data:"index",width: 100},
		{data:"prop",width: 100},
		{data:"node1",width: 100,type: 'numeric'},
		{data:"node2",width: 100,type: 'numeric'},
		{data:"node3",width: 100,type: 'numeric'},
		{data:"node4",width: 100,type: 'numeric'},
		{data:"node5",width: 100,type: 'numeric'}
	],
	excelColumnEditorSpoly=[
		{data:"index",width: 100},
		{data:"constraint",width: 100},
		{data:"prop",width: 100},
		{data:"mark",width: 100},
		{data:"radius",width: 150,type:'numeric',format:'0.00'},
		{data:"numOfVertices",width: 150},
		{data:"x",width: 50,type:'numeric',format:'0.00'},
		{data:"y",width: 50,type:'numeric',format:'0.00'}
	]
	;
	var afterChangeEditorSpas = function(changes, source) {
		if (changes){
			QF.setting.hasChangedEditorSpas = true;
		}
	}
	var afterChangeEditorN = function(changes, source) {
		if (changes){
			QF.setting.hasChangedEditorN = true;
		}
	}
	var afterChangeEditorElem = function(changes, source) {
		if (changes){
			QF.setting.hasChangedEditorElem = true;
		}
	}
	var afterChangeEditorSpoly = function(changes, source) {
		if (changes){
			QF.setting.hasChangedEditorSpoly = true;
		}
	}
	QF.setting.hotEditorSpas = cm.initHotExcel($('#spasE')[0], colHeadersSpas, excelColumnEditorSpas, afterChangeEditorSpas);
	QF.setting.hotEditorNode = cm.initHotExcel($('#exN')[0], colHeadersNodes, excelColumnEditorNode, afterChangeEditorN);
	QF.setting.hotEditorElem = cm.initHotExcel($('#exE')[0], colHeadersElem, excelColumnEditorElem, afterChangeEditorElem);
	QF.setting.hotEditorSpoly = cm.initHotExcel($('#spolyE')[0], colHeadersSpoly, excelColumnEditorSpoly, afterChangeEditorSpoly);
	
	
	
	
	
	
	
	
	
	
	
	
	
	//ELEMENT CONSTRAINT
	var
	/*excelHeaderConsSpas=[
		"Layer ID",
		"Darcy Right 1",
		"Darcy Right 2",
		"Darcy Left 1",
		"Darcy Left 2"
	],*/
	/*
	excelColumnConsSpas=[
		{data:"layer",width: 150},
		{data:"darcyRight1",width: 150},
		{data:"darcyRight2",width: 150},
		{data:"darcyLeft1",width: 150},
		{data:"darcyLeft2",width: 150}	
	],*/
	excelHeaderConsNode=[
		"Id",
		"Name",
		"x",
		"y",
		"z",
		"Temparature",
		"Load P",
		"Load Q",
		"Moment",
		"Delete"
	],
	excelColumnConsNode=[
		{data:"consLongId",width: 100,editor: false},
		{data:"name",width: 150},
		{data:"rx",width: 100},
		{data:"ry",width: 100},
		{data:"rz",width: 200},
		{data:"temparature",width: 200},
		{data:"lp",width: 100},
		{data:"lq",width: 200},
		{data:"moment",width: 100},
		{data:"delete",type:'checkbox'}
	],
	excelHeaderConsParticle=[
		"Id",
		"Name",
		"vxTag",
		"Vx",
		"vyTag",
		"Vy",
		"vphiTag",
		"Vphi",
		"fxTag",
		"Fx",
		"fyTag",
		"Fy",
		"fphiTag",
		"Fphi",
		"Delete"
	],
	excelColumnConsParticle=[
		{data:"consLongId",width: 100,editor: false},
		{data:"name",width: 150},
		{data:"vxTag",width: 60},
		{data:"vx",width: 60},
		{data:"vyTag",width: 60},
		{data:"vy",width: 60},
		{data:"vphiTag",width: 60},
		{data:"vphi",width: 60},
		{data:"fxTag",width: 60},
		{data:"fx",width: 60},
		{data:"fyTag",width: 60},
		{data:"fy",width: 60},
		{data:"fphiTag",width: 60},
		{data:"fphi",width: 60},
		{data:"delete",type:'checkbox'}
	]
	;
	var afterChangeConsNode = function(changes, source) {
		if (changes){
		  QF.setting.modifiedRecordConsNode.push(_.map(changes, function(change){
			return QF.setting.dataConsNode[change[0]];
		  }));
		  
		  QF.setting.modifiedRecordConsNode=_.uniq(_.flatten(QF.setting.modifiedRecordConsNode));
		}
	}
	var afterChangeConsParticle = function(changes, source) {
		if (changes){
		  QF.setting.modifiedRecordConsParticle.push(_.map(changes, function(change){
			return QF.setting.dataConsParticle[change[0]];
		  }));
		  
		  QF.setting.modifiedRecordConsParticle=_.uniq(_.flatten(QF.setting.modifiedRecordConsParticle));
		  //console.log(QF.setting.modifiedRecordConsParticle);
		}
	}
	QF.setting.hotConsNode = cm.initHotExcel($('#hotConsNode')[0], excelHeaderConsNode, excelColumnConsNode, afterChangeConsNode);
	QF.setting.hotConsParticle = cm.initHotExcel($('#hotConsParticle')[0], excelHeaderConsParticle, excelColumnConsParticle, afterChangeConsParticle);
	
	//ELEMENT CONSTRAINT SPAS 
	
	var
	excelHeaderConsSpas=[
		"Layer ID",
		"Left Hand Side BC Type",
		"Left Hand Side BC Value",
		"Right Hand Side BC Type",
		"Right Hand Side BC Value"
	],
	excelNestedHeaderConsSpas=[//NESTED HEADER FOR PRO FEATURE ONLY
		[
			"Layer ID",
			{label:"Left Hand Side", colspan:2},
			{label:"Right Hand Side", colspan:2},
		],[
			"Layer ID",
			"BC type",
			"BC value",
			"BC type",
			"BC value"
		]
	],
	excelColumnConsSpas=[
		{data:"layer",width: 150},
		{data:"leftBCType",width: 200 ,type: 'dropdown', source:[]},
		{data:"leftBCValue",width: 150},
		{data:"rightBCType",width: 200 ,type: 'dropdown', source:[]},
		{data:"rightBCValue",width: 150}	
	],
	afterChangeConsSpas = function(changes, source) {
		/*if (changes){
		  QF.setting.modifiedRecordConsSpas.push(_.map(changes, function(change){
			return QF.setting.dataConsSpas[change[0]];
		  }));
		  
		  QF.setting.modifiedRecordConsSpas=_.uniq(_.flatten(QF.setting.modifiedRecordConsSpas));
		}*/
	},
	excelHeaderConsSpasIC=[
		"Layer ID",
		"Initial Condition Type",
		"Initial Condition Value"
	],
	excelColumnConsSpasIC=[
		{data:"layer",width: 150},
		{data:"ICType",width: 200 ,type: 'dropdown', source:QF.setting.bcTypeExcel},
		{data:"ICValue",width: 150}
	],
	afterChangeConsSpasIC = function(changes, source) {
	};
	QF.setting.hotConsSpas = cm.initHotExcel($('#hotConsSpasBC')[0], excelHeaderConsSpas, excelColumnConsSpas, afterChangeConsSpas, excelNestedHeaderConsSpas);
	QF.setting.hotConsSpasIC = cm.initHotExcel($('#hotConsSpasIC')[0], excelHeaderConsSpasIC, excelColumnConsSpasIC, afterChangeConsSpasIC);
});
