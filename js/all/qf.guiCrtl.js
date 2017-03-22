/*QF.GuiCrtl = new function(){
	
  this.initGui = function() {*/
"use strict";
$(document).ready(function(){
	var 
	qfMode = QF.mode(),
	lg = new QF.Logic()
	;
	//var account = {
	QF.setting.account = {
		"profile": qfMode.initProfile,
		"session": qfMode.initSession,
		"logout": qfMode.logout
	}
	//var files = {
	QF.setting.files = {
		"New": qfMode.initNewProj,
		//"Import": qfMode.initImportModelGUI,
		"Save": qfMode.initSaveData,
		"Process": qfMode.initExe,
		"Open": qfMode.initSelectProj,
		"Output": qfMode.initSimulation,
		"Files": qfMode.initFiles
	}
	//var controls = {
	QF.setting.controls = {
		//DEM
		"Spheroradius": QF.setting.spheroRadiusVisibility,
		"ParticleNo": QF.setting.particleNoVisibility,//initParticleNoGUI,
		"VerticesNo": QF.setting.verticesNoVisibility,//initVerticesNoGUI,
		"CopyByIncrement": qfMode.initIncrementGUI,
		//FEM
		"ElementNo": QF.setting.elementNoVisibility,//initParticleNoGUI,
		"NodeNo": QF.setting.nodeNoVisibility,
		"loadText": QF.setting.loadTextVisibility,
		"bcText": QF.setting.bcTextVisibility,
		"subdivide": qfMode.initSubdivide,
		"extrude": qfMode.initExtrude,
		//Common
		"select": QF.setting.isSelect, 
		"delete": lg.deleteObj,
		//"Edit": qfMode.initEditGUI,
		//"Move": qfMode.initMoveGUI,
		"UndoCreation": lg.undo,
		"scaleUp": lg.scaleUp,
		"scaleDown": lg.scaleDown,
		"moveUp": lg.moveUp,
		"moveDown": lg.moveDown,
		"moveRight": lg.moveRight,
		"moveLeft": lg.moveLeft,
		"image": qfMode.initNewImageGUI,
		"Snap grid": QF.setting.snapGrid,
		"Toggle grid": QF.setting.gridVisibility,
		"Toggle axes": QF.setting.axesVisibility,
		"unit":1
	}
	QF.setting.solver = {
		"SPOLY":qfMode.initSpoly,
		"PATRUS":qfMode.initPatrus,
		"MATRUS":qfMode.initMatrus,
		"CONFEM":qfMode.initSpas
	}
	//var info = {
	QF.setting.info = {
		mouseX:QF.setting.mouseX,
		mouseY:QF.setting.mouseY,
		nodeCount:0,
		elementCount:0,
		vertexCount:0,
		particleCount:0
	}
	QF.setting.elem = {
		de:QF.setting.isDE,
		fe:QF.setting.isFE,
		feSpas:QF.setting.isFESpas,
		prop:qfMode.initElemProp,
		cons:qfMode.initElemCons,
		editor: qfMode.initEditor
	}
	this.gui = new dat.GUI({
		width : 350,
		//autoPlace: false
	});
	var guiObj = this.gui;
	var fileGuiCrtl = this.gui.addFolder( 'Project' );
	var elemGuiCrtl = this.gui.addFolder( 'Element' );
	var operGuiCrtl = this.gui.addFolder( 'Operation' );
	var solverCrtl = this.gui.addFolder( 'Solver' );
	var infoCrtl = this.gui.addFolder( 'Info' );
	var accountCrtl = this.gui.addFolder( 'Account' );
	
	
	
	
	//Account
	accountCrtl.add(QF.setting.account, 'profile').name('<span class="glyphicon menuIcon glyphicon-user"></span> Profile');
	accountCrtl.add(QF.setting.account, 'session').name('<span class="glyphicon menuIcon glyphicon-log-in"></span> Activate Session');
	accountCrtl.add(QF.setting.account, 'logout').name('<span class="glyphicon menuIcon glyphicon-log-out"></span> Logout');
	
	//Info
	infoCrtl.add(QF.setting.info, 'mouseX').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> X').listen();
	infoCrtl.add(QF.setting.info, 'mouseY').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Y').listen();
	infoCrtl.add(QF.setting.info, 'nodeCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Nodes').listen();
	infoCrtl.add(QF.setting.info, 'elementCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Elements').listen();
	infoCrtl.add(QF.setting.info, 'vertexCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Vertices').listen();
	infoCrtl.add(QF.setting.info, 'particleCount').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span> Particles').listen();
	
	var update = function() {
	  requestAnimationFrame(update);
	  QF.setting.info.mouseX = (QF.setting.mouseX / QF.setting.unitVal).toFixed(2);
	  QF.setting.info.mouseY = QF.setting.mouseY / QF.setting.unitVal;
	  QF.setting.info.nodeCount = QF.setting.nodeObjArray.length;
	  QF.setting.info.elementCount = QF.setting.elementIndexArray.length;
	  QF.setting.info.vertexCount = QF.setting.verticesNoTextArray.length;
	  QF.setting.info.particleCount = QF.setting.particleNoTextArray.length;
	};

	update();
	
	
	
	//Finite element Gui
	elemGuiCrtl.add(QF.setting.elem, 'feSpas').name('<span class="glyphicon menuIcon glyphicon-unchecked"></span> Spas').listen().onChange(function(){
		qfMode.toggleDrawFeSpas();
		initToggleMode(QF.setting.elem, 'feSpas', QF.setting.isFESpas);
	});
	elemGuiCrtl.add(QF.setting.elem, 'fe').name('<span class="glyphicon menuIcon glyphicon-unchecked"></span> Finite Element').listen().onChange(function(){
		qfMode.toggleDrawFe();
		initToggleMode(QF.setting.elem, 'fe', QF.setting.isFE);
	});
	elemGuiCrtl.add(QF.setting.elem, 'de').name('<span class="glyphicon menuIcon glyphicon-tree-deciduous"></span> Discrete Element').listen().onChange(function(){
		qfMode.toggleDrawDe();
		initToggleMode(QF.setting.elem, 'de', QF.setting.isDE);
	});
	elemGuiCrtl.add(QF.setting.elem, 'prop').name('<span class="glyphicon menuIcon glyphicon-tasks"></span> Properties');
	//elemGuiCrtl.add(QF.setting.elem, 'cons').name('<span class="glyphicon menuIcon glyphicon-indent-left"></span> Constraint');
	elemGuiCrtl.add(QF.setting.elem, 'cons').name('<span class="glyphicon menuIcon glyphicon-step-forward rotate270"></span> Constraint');
	elemGuiCrtl.add(QF.setting.elem, 'editor').name('<span class="glyphicon menuIcon glyphicon-list-alt"></span> Editor');
	
	
	
	solverCrtl.add(QF.setting.solver, 'SPOLY').name('<span class="glyphicon menuIcon glyphicon-link text-success"></span> SPOLY');
	solverCrtl.add(QF.setting.solver, 'PATRUS').name('<span class="glyphicon menuIcon glyphicon-link text-warning"></span> PATRUS');
	solverCrtl.add(QF.setting.solver, 'CONFEM').name('<span class="glyphicon menuIcon glyphicon-link text-danger"></span> CONFEM');
	
	
	//Operation Gui
	//Operation For Discrete Element
	operGuiCrtl.add(QF.setting.controls, 'CopyByIncrement').name('<span class="glyphicon menuIcon de">DE</span> Copy');
	operGuiCrtl.add(QF.setting.controls, 'ParticleNo').name('<span class="glyphicon menuIcon de">DE</span> Particle No.').listen().onChange(function(value){
		qfMode.toggleParticleNo();
		QF.setting.controls['ParticleNo'] = QF.setting.particleNoVisibility;
	});
	operGuiCrtl.add(QF.setting.controls, 'VerticesNo').name('<span class="glyphicon menuIcon de">DE</span> Vertices No.').listen().onChange(function(value){
		qfMode.toggleVerticesNo();
		QF.setting.controls['VerticesNo'] = QF.setting.verticesNoVisibility;
	});
	operGuiCrtl.add(QF.setting.controls, 'Spheroradius').name('<span class="glyphicon menuIcon de">DE</span> Spheroradius').listen().onChange(function(value){
		qfMode.toggleSpheroRadius();
		initToggleMode(QF.setting.controls, 'Spheroradius', QF.setting.spheroRadiusVisibility);
	});
	
	//Operation For Finite Element
	//operGuiCrtl.add(QF.setting.controls, 'force').name('<span class="glyphicon menuIcon fe">FE</span> Force');
	operGuiCrtl.add(QF.setting.controls, 'subdivide').name('<span class="glyphicon menuIcon fe">FE</span> Subdivide');
	operGuiCrtl.add(QF.setting.controls, 'extrude').name('<span class="glyphicon menuIcon fe">FE</span> Extrude');
	operGuiCrtl.add(QF.setting.controls, 'NodeNo').name('<span class="glyphicon menuIcon fe">FE</span> Node No.').onChange(function(value){
		qfMode.toggleNodeNo();
	});
	operGuiCrtl.add(QF.setting.controls, 'ElementNo').name('<span class="glyphicon menuIcon fe">FE</span> Element No.').onChange(function(value){
		qfMode.toggleElementNo();
	});
	operGuiCrtl.add(QF.setting.controls, 'loadText').name('<span class="glyphicon menuIcon fe">FE</span> Load').onChange(function(value){
		qfMode.toggleLoadText();
	});
	operGuiCrtl.add(QF.setting.controls, 'bcText').name('<span class="glyphicon menuIcon fe">FE</span> Boundary Conditions').onChange(function(value){
		qfMode.toggleBoundaryCondition();
	});
	operGuiCrtl.add(QF.setting.controls, 'unit').name('<span class="glyphicon menuIcon glyphicon-info-sign"></span>1 Meter = pixel').onChange(function(value){
		qfMode.setUnitConversion(value);
	});
	operGuiCrtl.add(QF.setting.controls, 'Snap grid').name('<span class="glyphicon menuIcon glyphicon-resize-small"></span> Snap grid').onChange(function(value){
		qfMode.toggleSnapGrid();
	});
	operGuiCrtl.add(QF.setting.controls, 'Toggle grid').name('<span class="glyphicon menuIcon glyphicon-eye-open"></span> Toggle grid').onChange(function(value){
		qfMode.toggleGridGUI();
	});
	operGuiCrtl.add(QF.setting.controls, 'Toggle axes').name('<span class="glyphicon menuIcon glyphicon-eye-open"></span> Toggle axes').onChange(function(value){
		qfMode.toggleAxesGUI();
	});
	operGuiCrtl.add(QF.setting.controls, 'select').name('<span class="glyphicon menuIcon glyphicon-screenshot"></span> Select').listen().onChange(function(value){
		qfMode.initSelectArea();
		initToggleMode(QF.setting.controls, 'select', QF.setting.isSelect);
		lgSelect.unselectAll();
	});
	operGuiCrtl.add(QF.setting.controls, 'delete').name('<span class="glyphicon menuIcon glyphicon-remove"></span> Delete selected');
	operGuiCrtl.add(QF.setting.controls, 'UndoCreation').name('<span class="glyphicon menuIcon glyphicon-share-alt rotate3d180"></span> Undo object creation');
	operGuiCrtl.add(QF.setting.controls, 'image').name('<span class="glyphicon menuIcon glyphicon-picture"></span> Add image');
	operGuiCrtl.add(QF.setting.controls, 'scaleUp').name('<span class="glyphicon menuIcon glyphicon-zoom-in"></span> Zoom in');
	operGuiCrtl.add(QF.setting.controls, 'scaleDown').name('<span class="glyphicon menuIcon glyphicon-zoom-out"></span> Zoom out');
	operGuiCrtl.add(QF.setting.controls, 'moveUp').name('<span class="glyphicon menuIcon glyphicon-arrow-up"></span> Move Up');
	operGuiCrtl.add(QF.setting.controls, 'moveDown').name('<span class="glyphicon menuIcon glyphicon-arrow-down"></span> Move Down');
	operGuiCrtl.add(QF.setting.controls, 'moveRight').name('<span class="glyphicon menuIcon glyphicon-arrow-right"></span> Move Right');
	operGuiCrtl.add(QF.setting.controls, 'moveLeft').name('<span class="glyphicon menuIcon glyphicon-arrow-left"></span> Move Left');
	
	
	
	
	
	
	//File Gui
	fileGuiCrtl.add(QF.setting.files, 'New').name('<span class="glyphicon menuIcon glyphicon-file"></span> New project');
	fileGuiCrtl.add(QF.setting.files, 'Open').name('<span class="glyphicon menuIcon glyphicon-folder-open"></span> Open project');
	fileGuiCrtl.add(QF.setting.files, 'Save').name('<span class="glyphicon menuIcon glyphicon-floppy-disk"></span> Save project');
	fileGuiCrtl.add(QF.setting.files, 'Process').name('<span class="glyphicon menuIcon glyphicon-cog"></span> Solve');
	fileGuiCrtl.add(QF.setting.files, 'Output').name('<span class="glyphicon menuIcon glyphicon-check"></span> Result');
	fileGuiCrtl.add(QF.setting.files, 'Files').name('<span class="glyphicon menuIcon glyphicon-open-file"></span> Download/Upload');
	
	elemGuiCrtl.open();
	
	function initToggleMode(attr, key, isTrue){
		if(isTrue){
			QF.setting.elem.feSpas = false;
			QF.setting.elem.fe = false;
			QF.setting.elem.de = false;
			QF.setting.controls.select = false;
		}
		attr[key] = isTrue;
	}
  //}
});