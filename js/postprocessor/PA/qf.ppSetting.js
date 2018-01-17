"use strict";

var minH = 630;
var url = '/';
QF.ppSetting = {
	pName : '',
	pId : '',
	hasDiagramGenerated : false,
	hotNodesForce:{},
	hotElemForce:{},
	hotElemCons:{},
	hotDisplacement:{},
	dispAmplifyY:1,
	memberCount:0,
	url:{
		PATRUS:'/patrusOutput/',
		PAFRAM:'/paframOutput/'
	},
	meshDofArr:[],
	meshShearArr:[],
	meshShearContourArr:[],
	meshMomentArr:[],
	meshMomentContourArr:[],
	meshAxialArr:[],
	meshAxialContourArr:[],
	meshDispArr:[],
	meshDofTrans:{
		x:[],
		y:[],
		z:[],
	},
	meshDofRotat:{
		x:[],
		y:[],
		z:[],
	},
	meshAxialContourArr3D: {x:[], y:[], xy:[]},
	meshMomentContourArr3D: {x:[], y:[], xy:[]},
	meshShearContourArr3D: {x:[], y:[]}
}