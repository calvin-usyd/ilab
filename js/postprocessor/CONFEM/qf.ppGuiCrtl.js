/*QF.GuiCrtl = new function(){
	
  this.initGui = function() {*/
"use strict";
$(document).ready(function(){
	var 
	//qfMode = QF.ppMode()
	qfMode = QF.mode()
	;
	//var account = {
	QF.setting.output = {
		/*"contour": qfMode.initContour,
		"flux": qfMode.initFlux,
		"graph": qfMode.initGraph*/
		"ElementNo": QF.setting.elementNoVisibility,//initParticleNoGUI,
		"NodeNo": QF.setting.nodeNoVisibility
	}
	QF.setting.info = {
		nodeCount:0,
		elementCount:0
	}
	QF.setting.control = {
		scale:0,
		positionX:0,
		positionY:0,
		distantX:0,
		distantY:0
	}
	this.gui = new dat.GUI({width : 350});
	
	var meshCrtl = this.gui.addFolder( 'Mesh' );
	var infoCrtl = this.gui.addFolder( 'Info' );
	var crtlCrtl = this.gui.addFolder( 'Control' );
	
	
	
	meshCrtl.add(QF.setting.output, 'ElementNo').name('Element No').onChange(function(value){
		qfMode.toggleElementNo();
	});
	meshCrtl.add(QF.setting.output, 'NodeNo').name('Node No').onChange(function(value){
		qfMode.toggleNodeNo();
	});
	
	infoCrtl.add(QF.setting.info, 'nodeCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Nodes').listen();
	infoCrtl.add(QF.setting.info, 'elementCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Elements').listen();
	
	var update = function() {
	  requestAnimationFrame(update);
	  QF.setting.info.nodeCount = QF.setting.nodeObjArray.length;
	  QF.setting.info.elementCount = QF.setting.elementIndexArray.length;
	};

	update();
	
	crtlCrtl.add(QF.setting.control, 'scale').name('Scale').onChange(function(value){
		qfMode.toggleScale(value);
	});
	crtlCrtl.add(QF.setting.control, 'positionX').name('Position X').onChange(function(value){
		qfMode.togglePositionX(value);
	});
	crtlCrtl.add(QF.setting.control, 'positionY').name('Position Y').onChange(function(value){
		qfMode.togglePositionY(value);
	});
	/*crtlCrtl.add(QF.setting.control, 'distantX').name('Distant X').onChange(function(value){
		ppLg.reCreateMeshData(
			value, 
			QF.ppSetting.meshOption.distY
		);
	});
	crtlCrtl.add(QF.setting.control, 'distantY').name('Distant Y').onChange(function(value){
		ppLg.reCreateMeshData(
			QF.ppSetting.meshOption.distX,
			value
		);
	});*/
});