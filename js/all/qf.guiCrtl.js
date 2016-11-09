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
		"subdivide": qfMode.initSubdivide,
		"extrude": qfMode.initExtrude,
		//Common
		"select": QF.setting.isSelect, 
		"delete": lg.deleteObj,
		//"Edit": qfMode.initEditGUI,
		//"Move": qfMode.initMoveGUI,
		"UndoCreation": lg.undo,
		"image": qfMode.initNewImageGUI,
		"Snap grid": QF.setting.snapGrid,
		"Toggle grid": QF.setting.gridVisibility,
		"Toggle axes": QF.setting.axesVisibility
	}
	QF.setting.solver = {
		"SPOLY":qfMode.initSpoly,
		"PATRUS":qfMode.initPatrus,
		"CONFEM":qfMode.initSpas
	}
	//var info = {
	QF.setting.info = {
		mouseX:0,
		mouseY:0,
		nodeCount:0,
		elementCount:0,
		vertexCount:0,
		particleCount:0
	}
	//var parameter = {
	/*QF.setting.parameter = {
		"grav": "-9.81",
		"aoiog": "90",
		"vd": "5.0e-3",
		"ts": "5e-5",
		"cm": "viscoelastic"
	}
	QF.setting.simulation = {
		"simulation": "v1",
		"method": "gnuplot",
		"dLen": 1000,
		"lLimit": 0,
		"rLimit": 1000,
		"bLimit": 0,
		"tLimit": QF.setting.canv.height,
		"fps": 10,
		"dps": 10,
		"sTime": 10	
	}*/
	//var elem = {
	QF.setting.elem = {
		fe:QF.setting.isFE,
		de:QF.setting.isDE,
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
	//var paramGuiCrtl = this.gui.addFolder( 'Parameter' );
	//var simGuiCrtl = this.gui.addFolder( 'Simulation' );
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
	  QF.setting.info.mouseX = QF.setting.mouseX;
	  QF.setting.info.mouseY = QF.setting.mouseY;
	  QF.setting.info.nodeCount = QF.setting.nodeObjArray.length;
	  QF.setting.info.elementCount = QF.setting.elementIndexArray.length;
	  QF.setting.info.vertexCount = QF.setting.verticesNoTextArray.length;
	  QF.setting.info.particleCount = QF.setting.particleNoTextArray.length;
	};

	update();
	
	
	
	//Finite element Gui
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
	
	
	
	
	
	
	solverCrtl.add(QF.setting.solver, 'SPOLY');
	solverCrtl.add(QF.setting.solver, 'PATRUS');
	solverCrtl.add(QF.setting.solver, 'CONFEM');
	
	
	
	
	
	
	
	
	
	
	//Parameter Gui
	/*paramGuiCrtl.add(QF.setting.parameter, 'grav').name('<span class="glyphicon menuIcon pa">g</span> Gravity');
	paramGuiCrtl.add(QF.setting.parameter, 'aoiog').name('<span class="glyphicon menuIcon pa">&#223;</span> Angle of inclination of gravity');
	paramGuiCrtl.add(QF.setting.parameter, 'vd').name('<span class="glyphicon menuIcon pa">&#945;</span> Verlet distance');
	paramGuiCrtl.add(QF.setting.parameter, 'ts').name('<span class="glyphicon menuIcon pa">&#916;t</span> Time step');
	paramGuiCrtl.add(QF.setting.parameter, 'cm').name('<span class="glyphicon menuIcon pa">CM</span> Contact Model');
	
	
	
	
	
	
	
	//Simulation Gui
	simGuiCrtl.add(QF.setting.simulation, 'simulation').name('Simulation Name (no space)');
	simGuiCrtl.add(QF.setting.simulation, 'method', { matlab: 'matlab', gnuplot: 'gnuplot', none: 'none' }).name('Graphical output');
	simGuiCrtl.add(QF.setting.simulation, 'fps').min(0).max(256).step(1).name('Frame Per Second');
	simGuiCrtl.add(QF.setting.simulation, 'dps').min(0).max(256).step(1).name('Data Per Second');
	simGuiCrtl.add(QF.setting.simulation, 'sTime').min(0).max(256).step(1).name('Simulation Time');
	simGuiCrtl.add(QF.setting.simulation, 'dLen').min(0).max(QF.setting.canv.width).step(1).name('Domain Length').onChange(function(value){
		initDomainLenGUI(value);
	});
	simGuiCrtl.add(QF.setting.simulation, 'lLimit').min(0).max(QF.setting.canv.width).step(1).name('Left Limit').onChange(function(value){
		initLLimitGUI(value);
	});
	simGuiCrtl.add(QF.setting.simulation, 'rLimit').min(0).max(QF.setting.canv.width).step(1).name('Right Limit').onChange(function(value){
		initRLimitGUI(value);
	});
	simGuiCrtl.add(QF.setting.simulation, 'bLimit').min(0).max(QF.setting.canv.height).step(1).name('Bottom Limit').onChange(function(value){
		initBLimitGUI(value);
	});
	simGuiCrtl.add(QF.setting.simulation, 'tLimit').min(0).max(QF.setting.canv.height).step(1).name('Top Limit').onChange(function(value){
		initTopLimitGUI(value);
	});*/
	
	
	
	
	
	
	
	
	
	//Operation Gui
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
	});
	operGuiCrtl.add(QF.setting.controls, 'delete').name('<span class="glyphicon menuIcon glyphicon-remove"></span> Delete selected');
	//operGuiCrtl.add(QF.setting.controls, 'Edit').name('<span class="glyphicon menuIcon glyphicon-pencil"></span> Edit selected (E)');
	//operGuiCrtl.add(QF.setting.controls, 'Move').name('<span class="glyphicon menuIcon glyphicon-new-window"></span> Move selected (M)').onChange(function(value){
		//qfMode.toggleParticleNo();
	//});
	operGuiCrtl.add(QF.setting.controls, 'UndoCreation').name('<span class="glyphicon menuIcon glyphicon-arrow-left"></span> Undo object creation (U)');
	operGuiCrtl.add(QF.setting.controls, 'image').name('<span class="glyphicon menuIcon glyphicon-picture"></span> Add image');
	
	//Operation For Discrete Element
	operGuiCrtl.add(QF.setting.controls, 'CopyByIncrement').name('<span class="glyphicon menuIcon de">DE</span> Copy (C)');
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
	operGuiCrtl.add(QF.setting.controls, 'subdivide').name('<span class="glyphicon menuIcon fe">FE</span> Subdivide');
	operGuiCrtl.add(QF.setting.controls, 'extrude').name('<span class="glyphicon menuIcon fe">FE</span> Extrude');
	operGuiCrtl.add(QF.setting.controls, 'NodeNo').name('<span class="glyphicon menuIcon fe">FE</span> Node No.').onChange(function(value){
		qfMode.toggleNodeNo();
	});
	operGuiCrtl.add(QF.setting.controls, 'ElementNo').name('<span class="glyphicon menuIcon fe">FE</span> Element No.').onChange(function(value){
		qfMode.toggleElementNo();
	});
	
	
	
	
	
	
	
	
	
	//File Gui
	fileGuiCrtl.add(QF.setting.files, 'New').name('<span class="glyphicon menuIcon glyphicon-file"></span> New project ( <span class="text-success">p + n</span> )');
	//fileGuiCrtl.add(files, 'Import').name('<img src="/views/icon/import.jpg" width="20">Import particle');
	fileGuiCrtl.add(QF.setting.files, 'Open').name('<span class="glyphicon menuIcon glyphicon-folder-open"></span> Open project ( <span class="text-warning">p + o</span> )');
	fileGuiCrtl.add(QF.setting.files, 'Save').name('<span class="glyphicon menuIcon glyphicon-floppy-disk"></span> Save project ( <span class="text-info">p + s</span> )');
	fileGuiCrtl.add(QF.setting.files, 'Process').name('<span class="glyphicon menuIcon glyphicon-cog"></span> Solve ( <span class="text-muted">p + v</span> )');
	fileGuiCrtl.add(QF.setting.files, 'Output').name('<span class="glyphicon menuIcon glyphicon-check"></span> Result ( <span class="text-danger">p + r</span> )');
	fileGuiCrtl.add(QF.setting.files, 'Files').name('<span class="glyphicon menuIcon glyphicon-open-file"></span> Download/Upload');
	
	elemGuiCrtl.open();
	
	function initToggleMode(attr, key, isTrue){
		if(isTrue){
			QF.setting.elem.fe = false;
			QF.setting.elem.de = false;
			QF.setting.controls.select = false;
		}
		attr[key] = isTrue;
	}
  //}
});