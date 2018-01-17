"use strict";

QF.LogicValidation = function(){
this.invalidProj = function(){
	var sTy = QF.setting.solverType;
	
	if (sTy == 'PATRUS' || sTy == 'PAFRAM' || sTy == 'PAISOP'){
		if (this.validateModelNodes() || this.validateModelElement()){
			return true;
		}else if (sTy == 'PATRUS' || sTy == 'PAFRAM'){
			if (this.validateNodeCountPerElem(2)){
				return true;
			}else if (sTy == 'PATRUS'){
				return this.validatePatrus();
			}else if (sTy == 'PAFRAM'){
				return this.validatePafram();
			}
		}else if (sTy == 'PAISOP'){
			if (this.validateNodeCountPerElem(8)){
				return true;
			}else {
				return this.validatePaisop();
			}
		}
	}else if (sTy == 'CONFEM') 
		return this.validateConfem();
	else if (sTy == 'SPOLY') 
		return this.validateSpoly();	
	
	return false;
}
this.validateModelNodes = function(){
	var 
	invalid = false,
	msgNCons = "Please set constraint of nodes in node editor.";
	
	if (typeof QF.setting.nodeObjArray === 'undefined' || QF.setting.nodeObjArray.length == 0){
		alert('Please create nodes.');
		invalid = true;
	}
	else if (typeof QF.setting.dataEditorNode === 'undefined' || QF.setting.dataEditorNode.length == 0){
		alert(msgNCons);
		invalid = true;
	}
	else if (!invalid){
		_.forEach(QF.setting.dataEditorNode, function(o){
			console.log(o)
			if (o.constraint == '' || typeof o.constraint == 'undefined'){
				alert(msgNCons);
				invalid = true;
				return false;
			}
		});
	}
	console.log(invalid);
	return invalid;
}
this.validateModelElement = function(){
	var 
	invalid = false,
	msgEProp = "Please set property of element in element editor.";
	
	if (typeof QF.setting.elementIndexArray === 'undefined' || QF.setting.elementIndexArray.length == 0){
		alert('Please create elements.');
		invalid = true;
	}
	else if (typeof QF.setting.dataEditorElem === 'undefined' || QF.setting.dataEditorElem.length == 0){
		alert(msgEProp);
		invalid = true;
	}
	else if (!invalid){
		_.forEach(QF.setting.dataEditorElem, function(o){
			if (o.index && (o.prop == '' || typeof o.prop == 'undefined')){
				alert(msgEProp);
				invalid = true;
				return false;
			}
		});
	}
	return invalid;
}
this.validateTotalElemAllowed = function(elemCount){
	return (QF.setting.elementIndexArray.length > elemCount);
}
this.validateNodeCountPerElem = function(nodeCount){
	var invalid = false;
	_.forEach(QF.setting.elementIndexArray, function(o){
		console.log(o.nodes);
		if (o.nodes.length !== nodeCount){
			alert(nodeCount + ' nodes must be created for each element');
			invalid = true;
			return false;
		}
	});
	return invalid;
}
this.validateConstraint = function(conArr){
	var invalid = false, consO;
	 _.forEach(QF.setting.nodeObjArray, function(o){
		 if (o.o.constraint == 'Custom'){
			 consO = o.o.customCons;
		 }else{
			 consO = lgEditor.getConstraintObjNode(o.o.constraint);
		 }
		 _.forEach(conArr, function(v){
			 if (lgCheck.invalidVal(consO[v])){
				 invalid = true;
				 return false;				 
			 }
		 });
		 if (invalid){
			 return false;//Break loop
		 }
	});
	return invalid;
}
this.validateProperty = function(propArr){
	var invalid = false, propO;
	 _.forEach(QF.setting.dataEditorElem, function(o){
		 if (o.index == null){
			 return false;
		 }else if (o.prop == 'Custom'){
			 propO = o.customProp;
		 }else{
			 propO = lgEditor.getPropertyObjElem(o.prop);
		 }
		 _.forEach(propArr, function(v){
			 if (lgCheck.invalidVal(propO[v])){
				 invalid = true;
				 return false;				 
			 }
		 });
		 if (invalid){
			 return false;//Break loop
		 }
	});
	return invalid;
}
this.validatePatrus = function(){
	var invalid = false;
	
	if (this.validateConstraint(['tx', 'ty', 'lp', 'lq'])){
		alert('Node constraint Translational X, Y and external force X, Y cannot be empty!');
		invalid = true;
		
	}else if (this.validateProperty(['area','youngModulus','temp','LOF','alpha','moment'])){
		alert('Element property area, youngModulus, temperature, lack of fit, Themal Expansion, and moment cannot be empty!');
		invalid = true;
	}
	
	return invalid;	
}
this.validatePafram = function(){
	var invalid = false;
	
	if (this.validateConstraint(['tx', 'ty', 'tz', 'lp', 'lq'])){
		alert('Node constraint Translational X, Y, theta, external force X, Y, and moment cannot be empty!');
		invalid = true;
		
	}else if (this.validateProperty(['area','inertia','youngModulus','temp','LOF','alpha','pressY','hingeI','hingeJ'])){
		alert('Element property area, inertia, youngModulus, temperature, lack of fit, Themal Expansion, uniform distributed load (Press Y), and hinge I, J cannot be empty!');
		invalid = true;
	}
	return invalid;	
}
this.validatePaisop = function(){
	var invalid = false;
	
	if (this.validateConstraint(['tx', 'ty', 'tz', 'rx', 'ry', 'rz', 'lp', 'lq', 'lr'])){
		alert('Node constraint Translational X, Y and external force X, Y cannot be empty!');
		invalid = true;
		
	}else if (this.validateProperty(['thickness','youngModulus','poissonRatio','pressX','pressY','pressZ'])){
		alert('Element property thickness, youngModulus, poisson ratio, press X, Y, Z cannot be empty!');
		invalid = true;
	}
	return invalid;
}
this.validateSpoly = function(){
	var invalid = false;
	if (typeof QF.setting.deObjArray === 'undefined' || QF.setting.deObjArray.length == 0){
		alert("Please create particle.");
		invalid = true;
	}
	if (!invalid){
		_.forEach(QF.setting.deObjArray, function(o){
			if (o.constraint == '' || o.property === '' || typeof o.constraint == 'undefined' || typeof o.property === 'undefined'){
				alert("Please set all constraint and property of the particle in SPOLY editor.");
				invalid = true;
				return false;
			}
		});
	}
	return invalid;
}
this.validateConfem = function(){
	var invalid = false;
	if (typeof QF.setting.spasConsForm === 'undefined' || QF.setting.spasConsForm.length == 0){
		alert("Please set left, right boundary condition and initial condition in SPAS element constraint.");
		invalid = true;
	}
	/*else if (typeof QF.setting.spasEditorForm === 'undefined' || QF.setting.spasEditorForm.length == 0){
		alert("Please set element constraint for SPAS");
		invalid = true;
	}
	else if (typeof QF.setting.dataConsSpas === 'undefined' || QF.setting.dataConsSpas.length == 0){
		alert("Please set boundary condition for SPAS from element constraint");
		invalid = true;
	}
	else if (typeof QF.setting.dataConsSpasIC === 'undefined' || QF.setting.dataConsSpasIC.length == 0){
		alert("Please set initial condition for SPAS from element constraint");
		invalid = true;
	}*/
	else if (typeof QF.setting.dataEditorSpas === 'undefined' || QF.setting.dataEditorSpas.length == 0){
		alert("Please set division and property for SPAS from element editor");
		invalid = true;
	}
	if (!invalid){
		_.forEach(QF.setting.dataEditorSpas, function(o){
			if (o.layer > 0 && o.prop === ''){
				alert("Please set property for SPAS from element editor.");
				invalid = true;
				return false;
			}
		});
	}
	return invalid;
}
this.invalidVal = function(val){
	return (val === '' || val === null || typeof val === 'undefined');
}
}
QF.LogicValidation.prototype = new QF.LogicValidation;
QF.LogicValidation.prototype.constructor = QF.LogicValidation;