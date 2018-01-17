"use strict";
$(function(){
	//ELEMENT PROPERTIES
	var
	excelHeaderPropFe=[
		//"Id",
		"Name",
		"type",
		"Property type",
		"Y.modulus",
		"Poisson ratio",
		"Area",
		"Temperature",
		"LOF",
		"Alpha",
		"Moment (RO)",
		"Moment of inertia",
		"Thickness",
		"hinge I",
		"hinge J",
		"Press X",
		"Press Y",
		"Press Z",
		"Delete"
	],
	excelColumnPropFe=[
		//{data:"propLongId",width: 100,editor: false},
		{data:"name",width: 100},
		{data:"type",width: 70},
		{data:"pType",width: 90},
		{data:"youngModulus",width: 90},
		{data:"poissonRatio",width: 90},
		{data:"area",width: 60},
		{data:"temp",width: 90},
		{data:"LOF",width: 40},
		{data:"alpha",width: 50},
		{data:"moment",width: 90},
		{data:"inertia",width: 90},
		{data:"thickness",width: 90},
		{data:"hingeI",width: 60},
		{data:"hingeJ",width: 60},
		{data:"pressX",width: 60},
		{data:"pressY",width: 60},
		{data:"pressZ",width: 60},
		{data:"delete",type:'checkbox'}
	],
	excelHeaderPropDe=[
		//"Id",
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
		//{data:"propLongId",width: 120,editor: false},
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
		//"Id",
		"Name",
		"M.Diffn.",
		"S.Storage",
		"H.Condu.",
		"Dispers.",
		"Dry Dens.",
		"Porosity",
		"D.H.Life",
		"A.Seepage",
		"T.I.Frac",
		"T.S.Rate",
		"Diffusion",
		"L.S.Coef",
		"I.D.Top",
		"I.D.Bottom",
		"Transmis.",
		"Sorption",
		"R.Seepage",
		"Delete"
	],
	excelColumnPropSpas=[
		//{data:"propLongId",width: 120,editor: false},
		//{data:"mpId",width: 30},
		{data:"name",width: 110},
		{data:"MOLECULAR_DIFFUSION",width: 60},
		{data:"SPECIFIC_STORAGE",width: 80},
		{data:"HYDRAULIC_CONDUCTIVITY",width: 70},
		{data:"DISPERSIVITY",width: 70},
		{data:"DRY_DENSITY",width: 70},
		{data:"POROSITY",width: 70},
		{data:"DECAY_HALF_LIFE",width: 70},
		{data:"ADD_SEEPAGE",width: 80},
		{data:"TRANSIENT_INSTANTANEOUS_FRACTION",width: 60},
		{data:"TRANSIENT_SORPTION_RATE",width: 70},
		{data:"DIFFUSION",width: 80},
		{data:"LINEAR_SORPTION_COEFFICIENT",width: 70},
		{data:"INTERLAYER_DISCONTINUITY_TOP",width: 60},
		{data:"INTERLAYER_DISCONTINUITY_BOTTOM",width: 80},
		{data:"TRANSMISSIVITY",width: 70},
		{data:"SORPTION",width: 60},
		{data:"REPLACE_SEEPAGE",width: 60},
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
	actionRendererNodeCons = function (instance, td, row, col, prop, value, cellProperties) {
	  var $button = $('<button class="btn btn-xs btn-default col-lg-12">');
	  $button.html('Edit');
	  $button.attr('onclick', "lgEditor.initCustomConsNode('"+row+"')");
	  $(td).empty().append($button); //empty is needed because you are rendering to an existing cell
	},
	actionRendererElemProp = function (instance, td, row, col, prop, value, cellProperties) {
	  var $button = $('<button class="btn btn-xs btn-default col-lg-12">');
	  $button.html('Edit');
	  $button.attr('onclick', "lgEditor.initCustomPropElem('"+row+"')");
	  $(td).empty().append($button); //empty is needed because you are rendering to an existing cell
	},
	colHeadersSpas=[
		'Layer ID', 
		'Type', 
		'Thickness', 
		'Material Property', 
		'Mesh Subdivision Vertical',
		'Mesh Ratio Vertical', 
		'Element Type'
	],
	colHeadersNodes=['X', 'Y', 'constraint', 'Custom Constraint', 'delete'],
	colHeadersElem=['Index', 'Property', 'Node 1', 'Node 2', 'Node 3', 'Node 4', 'Node 5', 'Node 6', 'Node 7', 'Node 8', 'Custom Property', 'delete'],
	colHeadersSpoly=['Index', 'constraint', 'property', 'mark', 'radius', 'Vertices Count', 'X', 'Y', 'delete'],
	excelColumnEditorSpas=[],/*
		{data:"layer",width: 80,type:'numeric',format:'0'},
		{data:"type",width: 100,type: 'dropdown', source:['REGULAR', 'LEAK']},
		{data:"thickness",width: 100},
		{data:"prop",width: 140, type: 'dropdown', source:_.map(QF.setting.dataPropSpas, function(o){return o.name;})},
		{data:"mSubV",width: 120},
		{data:"mRatioV",width: 120},
		{data:"eType",width: 180,type: 'dropdown', source:['3 - Linear Triangle', '4 - Quadratic Triangle', '6 - Linear Quad', '8 - Quadratic Quad']}
	],*/
	excelColumnEditorNode=[],/*
		{data:"x",width: 100,type:'numeric',format:'0.00'},
		{data:"y",width: 100,type:'numeric',format:'0.00'},
		{data:"constraint",width: 100,type: 'dropdown', source:_.map(QF.setting.dataConsNode, function(o){return o.name;})},
		{data:"customCons",renderer: actionRendererNodeCons},
		{data:"delete",type:'checkbox'}
	],*/
	excelColumnEditorElem=[],/*
		{data:"index",width: 100},
		{data:"prop",width: 100,type: 'dropdown', source:_.map(QF.setting.dataPropFe, function(o){return o.name;})},
		{data:"node1",width: 100,type: 'numeric'},
		{data:"node2",width: 100,type: 'numeric'},
		{data:"node3",width: 100,type: 'numeric'},
		{data:"node4",width: 100,type: 'numeric'},
		{data:"node5",width: 100,type: 'numeric'},
		{data:"node6",width: 100,type: 'numeric'},
		{data:"node7",width: 100,type: 'numeric'},
		{data:"node8",width: 100,type: 'numeric'},
		{data:"customProp",width: 100,renderer: actionRendererElemProp},
		{data:"delete",type:'checkbox'}
	],*/
	excelColumnEditorSpoly=[],/*
		{data:"index",width: 100},
		{data:"constraint",width: 100,type: 'dropdown', source:_.map(QF.setting.dataConsParticle, function(o){return o.name;})},
		{data:"prop",width: 100,type: 'dropdown', source:_.map(QF.setting.dataPropSpoly, function(o){return o.name;})},
		{data:"mark",width: 100},
		{data:"radius",width: 150,type:'numeric',format:'0.00'},
		{data:"numOfVertices",width: 150},
		{data:"x",width: 50,type:'numeric',format:'0.00'},
		{data:"y",width: 50,type:'numeric',format:'0.00'}
	],*/
	afterChangeEditorSpas = function(changes, source) {
		if (changes){
			QF.setting.hasChangedEditorSpas = true;
		}
	},
	afterChangeEditorN = function(changes, source) {
		if (changes){
			QF.setting.hasChangedEditorN = true;
		}
	},
	afterChangeEditorElem = function(changes, source) {
		if (changes){
			QF.setting.hasChangedEditorElem = true;
		}
	},
	afterChangeEditorSpoly = function(changes, source) {
		if (changes){
			QF.setting.hasChangedEditorSpoly = true;
		}
	};
	QF.setting.hotEditorSpas = cm.initHotExcel($('#spasE')[0], colHeadersSpas, excelColumnEditorSpas, afterChangeEditorSpas);
	QF.setting.hotEditorNode = cm.initHotExcel($('#exN')[0], colHeadersNodes, excelColumnEditorNode, afterChangeEditorN);
	QF.setting.hotEditorElem = cm.initHotExcel($('#exE')[0], colHeadersElem, excelColumnEditorElem, afterChangeEditorElem);
	QF.setting.hotEditorSpoly = cm.initHotExcel($('#spolyE')[0], colHeadersSpoly, excelColumnEditorSpoly, afterChangeEditorSpoly);
	QF.setting.actionRendererNodeCons = actionRendererNodeCons;
	QF.setting.actionRendererElemProp = actionRendererElemProp;
	
	
	
	
	
	
	
	
	
	
	
	
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
		//"Id",
		"Name",
		"transl x",
		"transl y",
		"transl z",
		"Rotate x",
		"Rotate y",
		"Rotate z",
		"temperature",
		"Load P",
		"Load Q",
		"Load R",
		"Moment",
		"Delete"
	],
	excelColumnConsNode=[
		//{data:"consLongId",width: 100,editor: false},
		{data:"name",width: 150},
		{data:"tx",width: 80},
		{data:"ty",width: 80},
		{data:"tz",width: 80},
		{data:"rx",width: 80},
		{data:"ry",width: 80},
		{data:"rz",width: 80},
		{data:"temperature",width: 80},
		{data:"lp",width: 80},
		{data:"lq",width: 80},
		{data:"lr",width: 80},
		{data:"moment",width: 80},
		{data:"delete",type:'checkbox'}
	],
	excelHeaderConsParticle=[
		//"Id",
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
		//{data:"consLongId",width: 100,editor: false},
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
