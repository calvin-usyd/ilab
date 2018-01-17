"use strict";

$(function(){
	var
	excelHeaderNodesForce=[
		"Node index",
		"Forces X",
		"Forces Y"
	],
	excelColumnNodesForce=[
		{data:"nodeIndex",width: 5,editor: false},
		{data:"nForceX",width: 5,editor: false},
		{data:"nForceY",width: 5,editor: false}
	],
	excelHeaderElementsForce=[
		"Element Index",
		"Forces"
	],
	excelColumnElementsForce=[
		{data:"memberIndex",width: 10,editor: false},
		{data:"membersForce",width: 15,editor: false}
	],
	excelHeaderElementsCons=[
		"Element Index",
		"Area",
		"Young Modulus",
		"Temperature",
		"Lack Of Fit",
		"Thermal Expansion",
		"Weight/unit length"
	],
	excelColumnElementsCons=[
		{data:"memberIndex",width: 10,editor: false},
		{data:"area",width: 10,editor: false},
		{data:"youngModulus",width: 10,editor: false},
		{data:"temp",width: 10,editor: false},
		{data:"LOF",width: 10,editor: false},
		{data:"alpha",width: 10,editor: false},
		{data:"ro",width: 10,editor: false}
	],
	excelHeaderDisplacement=[
		"Nodes Index",
		"Displacements X",
		"Displacements Y"
	],
	excelColumnDisplacement=[
		{data:"nodeIndex",width: 10,editor: false},
		{data:"dispX",width: 15,editor: false},
		{data:"dispY",width: 15,editor: false}
	];
	QF.setting.hotNodesForce = cm.initHotExcel($('#hotNodesForce')[0], excelHeaderNodesForce, excelColumnNodesForce);
	QF.setting.hotElemForce = cm.initHotExcel($('#hotElemForce')[0], excelHeaderElementsForce, excelColumnElementsForce);
	QF.setting.hotElemCons = cm.initHotExcel($('#hotElemCons')[0], excelHeaderElementsCons, excelColumnElementsCons);
	QF.setting.hotDisplacement = cm.initHotExcel($('#hotDisplacement')[0], excelHeaderDisplacement, excelColumnDisplacement);
});
