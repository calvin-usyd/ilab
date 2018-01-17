"use strict";
$(document).ready(function(){
	var qfMode = QF.mode();
	QF.setting.output = {
		"ElementNo": QF.setting.elementNoVisibility,//initParticleNoGUI,
		"NodeNo": QF.setting.nodeNoVisibility,
		"toggleExternalForce": false,
		"bcTranslational": false,
		"axial": false,
		"shear": false,
		"moment": false,
		"displacement": false,
		"amplifyDisplacementY": 1,
		"refreshModel":function(){location.reload()},
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
		
	meshCrtl.add(QF.setting.output, 'ElementNo').name('Element No').onChange(function(){
		qfMode.toggleElementNo();
		renderer.render(stage);
	});
	meshCrtl.add(QF.setting.output, 'NodeNo').name('Node No').onChange(function(){
		qfMode.toggleNodeNo();
		renderer.render(stage);
	});
	meshCrtl.add(QF.setting.output, 'toggleExternalForce').name('External Force').onChange(function(){
		qfMode.toggleLoadText();
		renderer.render(stage);
	});
	/*meshCrtl.add(QF.setting.output, 'bcTranslational').name('translational DOF').onChange(function(){
		ppLg.toggleView('translational');
	});*/
	meshCrtl.add(QF.setting.output, 'axial').name('Axial Force').listen().onChange(function(){
		if(QF.setting.toggledAxial){	
			QF.setting.output.axial=true;
			QF.setting.toggledAxial=false;
		}
		ppLg.toggleView('axial');
	});
	meshCrtl.add(QF.setting.output, 'shear').name('Shear Force').listen().onChange(function(){
		if(QF.setting.toggledShear){	
			QF.setting.output.shear=true;
			QF.setting.toggledShear=false;			
		}
		ppLg.toggleView('shear');
	});
	meshCrtl.add(QF.setting.output, 'moment').name('Bending Moment').listen().onChange(function(value){
		if(QF.setting.toggledMoment){	
			QF.setting.output.moment=true;	
			QF.setting.toggledMoment=false;
		}
		ppLg.toggleView('moment');
	});
	meshCrtl.add(QF.setting.output, 'displacement').name('Displacement').onChange(function(){
		ppLg.toggleView('displacement');
	});
	meshCrtl.add(QF.setting.output, 'amplifyDisplacementY', {'x1':1, 'x2':2, 'x4':4, 'x6':6, 'x8':8}).name('Amplify Displacement').onChange(function(value){
		QF.setting.output.axial=false;
		QF.setting.output.shear=false;
		QF.setting.output.moment=false;
		QF.setting.toggledAxial=true;
		QF.setting.toggledShear=true;
		QF.setting.toggledMoment=true;
		
		ppLg.loadModelDispAmplifer(value);
	});
	meshCrtl.add(QF.setting.output, 'showInput').name('Show Raw Input');
	meshCrtl.add(QF.setting.output, 'showOutput').name('Show Raw Output');
	meshCrtl.add(QF.setting.output, 'showGraph').name('Show Raw Graph');
	meshCrtl.add(QF.setting.output, 'refreshModel').name('Refresh Model');
	//meshCrtl.add(QF.setting.output, 'fitModelToScreen').name('Fit Model To Screen');
	
	infoCrtl.add(QF.setting.info, 'nodeCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Nodes').listen();
	infoCrtl.add(QF.setting.info, 'elementCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Elements').listen();
	
	meshCrtl.open();
	infoCrtl.open();
});