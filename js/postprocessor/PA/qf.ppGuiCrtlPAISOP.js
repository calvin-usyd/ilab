"use strict";
$(document).ready(function(){
	var ppLg = new QF.ppLogic();
	ppLg.loadAll();
	
	QF.setting={};
	QF.setting.output = {
		"ElementNo": false,//initParticleNoGUI,
		"NodeNo": false,
		"displacement": false,
		"amplifyDisplacement": 1,
		"stressResultant": 'none',
		"dof": 'none',
		"forces": 'none',
		"refreshGraph":function(){location.reload()},
		"showInput":function(){ppLg.showData('input.txt')},
		"showOutput":function(){ppLg.showData('output.txt')},
		"showGraph":function(){ppLg.showData('GRAPH')}
		//"fitModelToScreen":lg.fitModelToScreen
	}
	QF.setting.info = {
		nodeCount:0,
		elementCount:0
	}
	this.gui = new dat.GUI({width : 350});	
	var meshCrtl = this.gui.addFolder( 'Mesh' );
	var infoCrtl = this.gui.addFolder( 'Info' );
	var stressOption = {
		'- None -':'none', 
		'Force X':'stressX', 
		'Force Y':'stressY', 
		'Force XY':'stressXY', 
		'Moment X':'momentX', 
		'Moment Y':'momentY', 
		'Moment XY':'momentXY' 
	}
	var dofOption = {
		'- None -':'none', 
		'Translational X':'transX',
		'Translational Y':'transY',
		'Translational Z':'transZ',
		'Rotational X':'rotatX',
		'Rotational Y':'rotatY',
		'Rotational Z':'rotatZ'
	}
	var exForces = {
		'- None -':'none', 
		'Nodal Forces':'nodalForces',
		'Element Presses':'elemPresses'		
	}
		
	meshCrtl.add(QF.setting.output, 'ElementNo').name('Element No').onChange(function(value){
		ppLg.toggleElementNo();
	});
	meshCrtl.add(QF.setting.output, 'NodeNo').name('Node No').onChange(function(value){
		ppLg.toggleNodeNo();
	});
	meshCrtl.add(QF.setting.output, 'displacement').name('Displacement & Rotation').listen().onChange(function(){
		if(QF.setting.toggledDisp){	
			QF.setting.output.displacement=true;	
			QF.setting.toggledDisp=false;
		}
		if (QF.setting.output.dof !== 'none'){
			QF.setting.output.dof = 'none';
			QF.setting.toggledDof=true;
			ppLg.toggleDof('none');
		}
		ppLg.toggleDisplacement();
	});
	meshCrtl.add(QF.setting.output, 'amplifyDisplacement', {'x1':1, 'x2':2, 'x4':4, 'x6':6, 'x8':8}).name('Amplify Displacement').onChange(function(value){
		if (QF.setting.output.displacement){
			QF.setting.output.displacement = false;
			QF.setting.toggledDisp=true;
		}
		if (QF.setting.output.dof !== 'none'){
			QF.setting.output.dof = 'none';
			QF.setting.toggledDof=true;
			ppLg.toggleDof('none');
			
		}
		ppLg.loadModelDispAmplifier(value);
	});
	meshCrtl.add(QF.setting.output, 'forces', exForces).name('External Force').onChange(function(value){
		ppLg.toggleExternalForces(value);
	});
	meshCrtl.add(QF.setting.output, 'stressResultant', stressOption).name('Stress Resultant').onChange(function(value){
		ppLg.toggleResultant(value);
	});
	meshCrtl.add(QF.setting.output, 'dof', dofOption).name('Degree of Freedom (Fixed)').listen().onChange(function(value){
		if (QF.setting.output.displacement){
			QF.setting.output.displacement = false;
			QF.setting.toggledDisp=true;
			ppLg.toggleDisplacement();
		}
		if(QF.setting.toggledDof){	
			//QF.setting.output.dof=value;	
			QF.setting.toggledDof=false;
		}
		ppLg.toggleDof(value);
	});
	/*meshCrtl.add(QF.setting.output, 'bcTranslational').name('translational DOF').onChange(function(value){
		ppLg.toggleBoundaryCondition('translational');
	});
	meshCrtl.add(QF.setting.output, 'bcRotational').name('Rotational DOF').onChange(function(value){
		ppLg.toggleBoundaryCondition('rotational');
	});*/
	meshCrtl.add(QF.setting.output, 'showInput').name('Show Raw Input');
	meshCrtl.add(QF.setting.output, 'showOutput').name('Show Raw Output');
	meshCrtl.add(QF.setting.output, 'showGraph').name('Show Raw Graph');
	meshCrtl.add(QF.setting.output, 'refreshGraph').name('Refresh Graph');
	//meshCrtl.add(QF.setting.output, 'fitModelToScreen').name('Fit Model To Screen');
	
	infoCrtl.add(QF.setting.info, 'nodeCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Nodes').listen();
	infoCrtl.add(QF.setting.info, 'elementCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Elements').listen();
	
	meshCrtl.open();
	infoCrtl.open();
	
	var update = function() {
	  requestAnimationFrame(update);
	  //QF.setting.info.nodeCount = QF.setting.nodeObjArray.length;
	  //QF.setting.info.elementCount = QF.setting.elementIndexArray.length;
	};

	update();
});