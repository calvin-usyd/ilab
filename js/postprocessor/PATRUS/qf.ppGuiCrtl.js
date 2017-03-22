"use strict";
$(document).ready(function(){
	var qfMode = QF.mode();
	QF.setting.output = {
		"ElementNo": QF.setting.elementNoVisibility,//initParticleNoGUI,
		"NodeNo": QF.setting.nodeNoVisibility,
		"loadText": QF.setting.loadTextVisibility,
		"bcText": QF.setting.bcTextVisibility
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
	});
	meshCrtl.add(QF.setting.output, 'NodeNo').name('Node No').onChange(function(value){
		qfMode.toggleNodeNo();
	});
	meshCrtl.add(QF.setting.output, 'loadText').name('Force').onChange(function(value){
		qfMode.toggleLoadText();
	});
	meshCrtl.add(QF.setting.output, 'bcText').name('Boundary Conditions').onChange(function(value){
		qfMode.toggleBoundaryCondition();
	});
	
	infoCrtl.add(QF.setting.info, 'nodeCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Nodes').listen();
	infoCrtl.add(QF.setting.info, 'elementCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Elements').listen();
	
	var update = function() {
	  requestAnimationFrame(update);
	  QF.setting.info.nodeCount = QF.setting.nodeObjArray.length;
	  QF.setting.info.elementCount = QF.setting.elementIndexArray.length;
	};

	update();
});