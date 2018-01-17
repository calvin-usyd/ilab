"use strict";
$(document).ready(function(){
	var qfMode = QF.mode();
	QF.setting.output = {
		"ElementNo": QF.setting.elementNoVisibility,//initParticleNoGUI,
		"NodeNo": QF.setting.nodeNoVisibility,
		"toggleExternalForce": false,
		"displacement": false,
		"amplifyDisplacementY": 1,
		"refreshModel":function(){location.reload()},
		"showInput":function(){ppLg.showData('input.txt')},
		"showOutput":function(){ppLg.showData('output.txt')},
		"showGraph":function(){ppLg.showData('GRAPH')}
	}
	QF.setting.info = {
		nodeCount:0,
		elementCount:0
	}
	this.gui = new dat.GUI({width : 350});	
	var meshCrtl = this.gui.addFolder( 'Mesh' );
	var infoCrtl = this.gui.addFolder( 'Info' );
		
	meshCrtl.add(QF.setting.output, 'ElementNo').name('Element No').onChange(function(value){
		qfMode.toggleElementNo();
		renderer.render(stage);
	});
	meshCrtl.add(QF.setting.output, 'NodeNo').name('Node No').onChange(function(value){
		qfMode.toggleNodeNo();
		renderer.render(stage);
	});
	meshCrtl.add(QF.setting.output, 'toggleExternalForce').name('External Force').onChange(function(value){
		qfMode.toggleLoadText();
		renderer.render(stage);
	});
	meshCrtl.add(QF.setting.output, 'displacement').name('Displacement').onChange(function(value){
		ppLg.toggleView('displacement');
	});
	meshCrtl.add(QF.setting.output, 'amplifyDisplacementY', {'x1':1, 'x2':2, 'x4':4, 'x6':6, 'x8':8}).name('Amplify Displacement').onChange(function(value){
		ppLg.loadModelDispAmplifer(value);
	});
	meshCrtl.add(QF.setting.output, 'showInput').name('Show Raw Input');
	meshCrtl.add(QF.setting.output, 'showOutput').name('Show Raw Output');
	meshCrtl.add(QF.setting.output, 'showGraph').name('Show Raw Graph');
	meshCrtl.add(QF.setting.output, 'refreshModel').name('Refresh Model');
	
	infoCrtl.add(QF.setting.info, 'nodeCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Nodes').listen();
	infoCrtl.add(QF.setting.info, 'elementCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Elements').listen();
	
	meshCrtl.open();
	infoCrtl.open();
});