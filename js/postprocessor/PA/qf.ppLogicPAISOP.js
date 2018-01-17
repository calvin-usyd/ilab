"use strict";

QF.ppLogic = function(){
var
ppUtil 	 = new QF.ppUtil(),
renderer = new THREE.WebGLRenderer(),
camera 	 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);// THREE.PerspectiveCamera(angle, ratio, near, far);

camera.position.set(30, 30, 100);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//var camera = new THREE.OrthographicCamera(-100, 100, 50, -50, 0.1, 500);
//camera.lookAt(new THREE.Vector3(20, 20, 100));

var 
scale 		  = 1,
data 		  = "",
nodeNoMeshArr =[],
elemNoMeshArr =[],
loadMeshArr	  =[],
material 	  = new THREE.LineBasicMaterial({ color: 0x0000ff }),//create a blue LineBasicMaterial
scene 	 	  = new THREE.Scene(),
loader 	 	  = new THREE.FontLoader(),
fontParameter,
fontType = [
	'helvetiker_regular.typeface.json',
	'helvetiker_bold.typeface.json',
	'optimer_regular.typeface.json',
	'optimer_bold.typeface.json',
	'gentilis_regular.typeface.json',
	'gentilis_bold.typeface.json',
	'droid/droid_sans_bold.typeface.json',
	'droid/droid_sans_mono_regular.typeface.json',
	'droid/droid_sans_regular.typeface.json',
	'droid/droid_serif_regular.typeface.json',
	'droid/droid_serif_bold.typeface.json'
];
loader.load( '/js/postprocessor/PA/fonts/'+fontType[8], function ( font ) {
	//textFont=font;
	fontParameter={
		font:font,
		size:1.4,
		height:0.4
	};
});

this.loadAll = function(){
	$.ajax({
		url:'/paisopOutput/' + $('#projName').attr('data'),
		type: "POST",
		success:loadGraph
	});
}
this.showData = function(fileName){
	window.open('/data/'+$('#user').attr('data')+'/'+$('#projName').attr('data')+'/'+fileName,'_blank');
}
this.toggleExternalForces = function(val){
	var arr=[];
	if (val === 'elemPresses')	    arr = QF.ppSetting.meshElemPressArr;
	else if (val === 'nodalForces') arr = QF.ppSetting.meshNodalForces;
	toggleCurrentMesh(arr);
}
this.toggleElementNo = function(){
	toggleCurrentMesh(elemNoMeshArr);
}
this.toggleNodeNo = function(){
	toggleCurrentMesh(nodeNoMeshArr);
}
this.toggleDisplacement = function(){
	toggleCurrentMesh(QF.ppSetting.meshDispContour);
}
this.loadModelDispAmplifier = function(val){
	while(scene.children.length > 0){ 
		scene.remove(scene.children[0]); 
	}
	scale = val*val*2;
	loadGraph();
}
this.toggleDof = function(val){
	var arr=[];
	if (val === 'transX')	   arr = QF.ppSetting.meshDofTrans.x;
	else if (val === 'transY') arr = QF.ppSetting.meshDofTrans.y;
	else if (val === 'transZ') arr = QF.ppSetting.meshDofTrans.z;
	else if (val === 'rotatX') arr = QF.ppSetting.meshDofRotat.x;
	else if (val === 'rotatY') arr = QF.ppSetting.meshDofRotat.y;
	else if (val === 'rotatZ') arr = QF.ppSetting.meshDofRotat.z;
	hidePrevMesh(arr, 'prevDofArr');
	toggleCurrentMesh(arr);
}
this.toggleResultant = function(val){
	var arr=[];
	if (val === 'stressX')		arr = QF.ppSetting.meshAxialContourArr3D.x;
	else if (val === 'stressY')	arr = QF.ppSetting.meshAxialContourArr3D.y;
	else if (val === 'stressXY')arr = QF.ppSetting.meshAxialContourArr3D.xy;
	else if (val === 'momentX')	arr = QF.ppSetting.meshMomentContourArr3D.x;
	else if (val === 'momentY')	arr = QF.ppSetting.meshMomentContourArr3D.y;
	else if (val === 'momentXY')arr = QF.ppSetting.meshMomentContourArr3D.xy;
	hidePrevMesh(arr, 'prevResultantArr');
	toggleCurrentMesh(arr);
}
function toggleCurrentMesh(arr){
	_.forEach(arr, function(o){
		o.visible = !o.visible;
	});
	renderer.render( scene, camera );
}
function hidePrevMesh(arr, prevMeshArr){
	var prev = QF.ppSetting[prevMeshArr];
	if(prev){
		_.forEach(prev, function(o){
			o.visible = !o.visible;
		});		
	}
	QF.ppSetting[prevMeshArr] = arr;	
}
function loadGraph(json){
	cm.loadProgress();
	if (data == '')	data = cm.getJsonObj(json);
	var
	nodePointArr 		= ppUtil.processStr2Arr(data.nodePointArr),
	nodeForceArr 		= ppUtil.processStr2Arr(data.nodeForceArr),
	nodeDispRotaArr 	= ppUtil.processStr2Arr(data.nodeDispRotaArr),
	memberArr 			= ppUtil.processStr2Arr(data.memberArr),
	memberPropPressArr 	= ppUtil.processStr2Arr(data.memberPropPressArr),
	stressResultantArr 	= resultantStr2ObjArr(data.stressResultantArr),
	newNodeArr 			= genDispNodes(nodePointArr, nodeDispRotaArr);
	
	console.log(data);
	QF.setting.info.nodeCount = nodePointArr.length;
	QF.setting.info.elementCount = memberArr.length;
	
	drawElements(memberArr, newNodeArr, memberPropPressArr);
	drawResultant(stressResultantArr);
	drawNodes(newNodeArr, nodeForceArr);
	drawDispRotatContour(newNodeArr);

	renderer.render(scene, camera);
	cm.hideProgress();
}
function resultantStr2ObjArr(stressArr){
	var 
	arr=[],
	temp=[],
	stressObjArr=[],
	momentObjArr=[],
	shearObjArr=[]
	;
	_.forEach(stressArr, function(type){
		temp = ppUtil.processStr2Arr(type['stress']);
		for(var x=0; x<4; x++){
			arr = temp[x];
			stressObjArr.push({
				elmt:arr[0], 
				gauss:arr[1], 
				gaussCoor:{
					x:arr[2],
					y:arr[3], 
					z:arr[4]
				}, 
				stress:{
					x:ppUtil.noNotation(arr[5]), 
					y:ppUtil.noNotation(arr[6]), 
					xy:ppUtil.noNotation(arr[7])
				}
			});
		}
		
		temp = ppUtil.processStr2Arr(type['moment']);
		for(var x=0; x<4; x++){
			arr = temp[x];
			momentObjArr.push({
				elmt:arr[0], 
				gauss:arr[1], 
				moment:{
					x:ppUtil.noNotation(arr[2]), 
					y:ppUtil.noNotation(arr[3]), 
					xy:ppUtil.noNotation(arr[4])
				}, 
				q:{
					x:ppUtil.noNotation(arr[5]), 
					y:ppUtil.noNotation(arr[6])
				}
			});
		}
		
		temp = ppUtil.processStr2Arr(type['shear']);
		for(var x=0; x<12; x++){
			arr = temp[x];
			shearObjArr.push({
				elmt:arr[0], 
				gauss:arr[1], 
				position:arr[2], 
				s:{
					x:ppUtil.noNotation(arr[3]), 
					y:ppUtil.noNotation(arr[4]), 
					xy:ppUtil.noNotation(arr[5]), 
					max:ppUtil.noNotation(arr[6]), 
					min:ppUtil.noNotation(arr[7]), 
					equi:ppUtil.noNotation(arr[8])
				}
			});
		}
	});
	return {
		stress : stressObjArr,
		moment : momentObjArr,
		shear : shearObjArr
	}
}
function toList(arr, type1, type2){
	return _.map(arr, function(m){
		return m[type1][type2];
	});	
}
function toList2(arr, type){
	return _.map(arr, function(m){
		return m[type];
	});	
}
function getContourColr(memberForceMapped, htmlElemId){
	var memberForceUniq = _.uniq(memberForceMapped);
	var memberForceSorted = _.sortBy(memberForceUniq);
	var min=memberForceSorted[0], max=memberForceSorted[memberForceSorted.length-1];
	var hm = heatmap();
	hm.setColorPalette(HeatmapConfig);
	hm.setData(min, max, (max==min) ? 0 : 15);
	hm.renderBarById(htmlElemId);
	return hm.getColors(memberForceUniq);
}
function drawResultant(objArr){
	var 
	contourColr = {
		stressX:getContourColr(toList(objArr.stress, 'stress','x'), '#stressXHeatMap'),
		stressY:getContourColr(toList(objArr.stress, 'stress','y'), '#stressYHeatMap'),
		stressXY:getContourColr(toList(objArr.stress, 'stress','xy'), '#stressZHeatMap'),
		momentX:getContourColr(toList(objArr.moment, 'moment','x'), '#momentXHeatMap'),
		momentY:getContourColr(toList(objArr.moment, 'moment','x'), '#momentYHeatMap'),
		momentXY:getContourColr(toList(objArr.moment, 'moment','xy'), '#momentZHeatMap')
	},
	meshStress = QF.ppSetting.meshAxialContourArr3D,
	meshMoment = QF.ppSetting.meshMomentContourArr3D,
	meshShear = QF.ppSetting.meshShearContourArr3D
	;
	drawStressResultant(objArr.stress, contourColr.stressX, 'x', meshStress);
	drawStressResultant(objArr.stress, contourColr.stressY, 'y', meshStress);
	drawStressResultant(objArr.stress, contourColr.stressXY, 'xy', meshStress);
	drawMomentResultant(objArr.moment, contourColr.momentX, 'x', meshMoment);
	drawMomentResultant(objArr.moment, contourColr.momentY, 'y', meshMoment);
	drawMomentResultant(objArr.moment, contourColr.momentXY, 'xy', meshMoment);
	//drawShearResultant(objArr.shear, meshShear);
}
function getColor4Value(arr, val){
	return parseInt("0x"+_.filter(arr, {value: val})[0].colorHex, 16);
}
function drawStressResultant(stressObjArr, contourColr, type, contourArr){
	var geometry = new THREE.CircleBufferGeometry(0.5);
	var circle, material;
	contourArr[type] = [];
	_.forEach(stressObjArr, function(o){
		material = new THREE.LineBasicMaterial({ color: getColor4Value(contourColr, o.stress[type])});
		circle = new THREE.Mesh(geometry, material);
		circle.position.set(o.gaussCoor.x , o.gaussCoor.y , o.gaussCoor.z );
		circle.visible=false;
		contourArr[type].push(circle);
		scene.add(circle);
	});
}
function drawMomentResultant(momentObjArr, contourColr, type, contourArr){
}
function drawShearResultant(shearObjArr, contourColr, type, contourArr){
}
function genDispNodes(nodeArr, nodeDispArr){
	var textMaterial = new THREE.MeshBasicMaterial({color:0xffff00});
	 return _.map(nodeArr, function(nodeO, ind){
		var 
		dispO=_.filter(nodeDispArr, function(o){return o[0] === nodeO[0];})[0],
		dispRotX=ppUtil.noNotation(dispO[1]) + ppUtil.noNotation(dispO[4]), 
		dispRotY=ppUtil.noNotation(dispO[2]) + ppUtil.noNotation(dispO[5]),
		dispRotZ=ppUtil.noNotation(dispO[3]) + ppUtil.noNotation(dispO[6]);

		var newCoor = {
			i:nodeO[0],
			dofTlansX:nodeO[1],
			dofTlansY:nodeO[2],
			dofTlansZ:nodeO[3],
			dofRotatX:nodeO[4],
			dofRotatY:nodeO[5],
			dofRotatZ:nodeO[6],
			x:(+nodeO[7] + ((dispRotX) * scale)), 
			y:(+nodeO[8] + ((dispRotY) * scale)), 
			z:(+nodeO[9] + ((dispRotZ)* scale)),
			dr:(dispRotX + dispRotY + dispRotZ)
		};
		//drawBoundaryCondition(nodeO, newCoor, textMaterial);
		return newCoor;
	});
}
function addBoundaryConditionMesh(bcText, arr, material, coor){
	var bcMesh = new THREE.Mesh( new THREE.TextGeometry(bcText, fontParameter), material);
	bcMesh.position.set(coor.x+1, coor.y-3, coor.z );
	bcMesh.visible=false;
	arr.push(bcMesh);
	scene.add(bcMesh);
}
function drawElements(elementArr, nodeArr, pressArr){
	var 
	geometry,
	nodeO,
	firstNodeO,
	line,
	centerCoor,
	offsetX = 0,
	offsetY = 0,
	offsetZ = 0,
	textMaterial = new THREE.MeshBasicMaterial({color:0xffffff});
	QF.ppSetting.meshElemPressArr=[];
	
	_.forEach(elementArr, function(nodeIndexArr, i){//[index, node1,..,nodeN]//
		geometry = new THREE.Geometry();
		//console.log(nodeIndexArr);
		_.forEach(nodeIndexArr.splice(1), function(nodeInd, k){//[node1,...,nodeN]//
			nodeO = _.filter(nodeArr, function(o){
				//return o[0] == nodeInd;
				return o.i == nodeInd;
			})[0];
			if (k==0){
				firstNodeO = nodeO;
			}
			//geometry.vertices.push(new THREE.Vector3((nodeO[8]-offsetX)*scale, (nodeO[7]-offsetY)*scale, (nodeO[6]-offsetZ)*scale));
			geometry.vertices.push(new THREE.Vector3((nodeO.x-offsetX), (nodeO.y-offsetY), (nodeO.z-offsetZ)));
		});
		geometry.vertices.push(new THREE.Vector3((firstNodeO.x-offsetX), (firstNodeO.y-offsetY), (firstNodeO.z-offsetZ)));
		line = new THREE.Line(geometry, material);
		scene.add(line);
		
		geometry.computeBoundingSphere();
		centerCoor = geometry.boundingSphere.center;
		drawElementNo(nodeIndexArr[0], centerCoor, textMaterial);
		drawElementPress(pressArr, nodeIndexArr[0], centerCoor, textMaterial);
	});
}
function drawElementPress(pressArr, elemNo, centerCoor, material){
	var pressO = _.filter(pressArr, function(o){
		return o[0] == elemNo;
	})[0];
	
	var dir = new THREE.Vector3( pressO[4], pressO[5], pressO[6]);
	dir.normalize();

	var arrowHelper = new THREE.ArrowHelper( dir, new THREE.Vector3( centerCoor.x, centerCoor.y, centerCoor.z ), 10, 0xffff00 );
	arrowHelper.visible = false;
	scene.add( arrowHelper );
	QF.ppSetting.meshElemPressArr.push(arrowHelper);
}
function drawElementNo(elemNoText, centerCoor, material){
	var elemNo = new THREE.TextGeometry(elemNoText , fontParameter);
	var elemNoMesh = new THREE.Mesh( elemNo, material );
	elemNoMesh.position.set(centerCoor.x, centerCoor.y, centerCoor.z );
	elemNoMesh.visible=false;
	elemNoMeshArr.push(elemNoMesh);
	scene.add(elemNoMesh);
}
function drawDispRotatContour(nodeArr){
	var 
	circle, material, 
	geometry = new THREE.CircleBufferGeometry(1),
	contourColr = getContourColr(toList2(nodeArr, 'dr'), '#dispRotatHeatMap');
	QF.ppSetting.meshDispContour=[];

	_.forEach(nodeArr, function(o){
		material = new THREE.LineBasicMaterial({ color: getColor4Value(contourColr, o.dr)});
		circle = new THREE.Mesh(geometry, material);
		circle.position.set(o.x, o.y, o.z );
		circle.visible = false;
		scene.add(circle);
		QF.ppSetting.meshDispContour.push(circle);
	});
}
function drawNodes(nodeArr, forceArr){
	var 
	circle, dof,
	geometry = new THREE.CircleBufferGeometry(1),
	textMaterial = new THREE.MeshBasicMaterial({color:0x00ff00}),
	dofMaterial = new THREE.MeshBasicMaterial({color:0x00f0f0});
	QF.ppSetting.meshDofTrans = {x:[], y:[], z:[]};
	QF.ppSetting.meshDofRotat = {x:[], y:[], z:[]};
	QF.ppSetting.meshNodalForces = [];
	
	_.forEach(nodeArr, function(o){
		circle = new THREE.Mesh(geometry, material);
		circle.position.set(o.x, o.y, o.z );
		scene.add(circle);
		drawNodeNo(o, textMaterial);
		drawDofNodes(o, circle, geometry, dofMaterial, dof);
		drawExternalForces(o, forceArr);
	});
}
function drawExternalForces(nodeO, forceArr){
	var forceO = _.filter(forceArr, function(o){
		return o[0] == nodeO.i;
	})[0];
	
	if (forceO){
		var dir = new THREE.Vector3( ppUtil.noNotation(forceO[1]), ppUtil.noNotation(forceO[2]), ppUtil.noNotation(forceO[3]));
		dir.normalize();

		var arrowHelper = new THREE.ArrowHelper( dir, new THREE.Vector3( nodeO.x, nodeO.y, nodeO.z ), 10, 0xffff00 );
		arrowHelper.visible = false;
		scene.add( arrowHelper );
		QF.ppSetting.meshNodalForces.push(arrowHelper);
	}
}
function drawDofNodes(o, circle, geometry, dofMaterial, dof){
	dof = initDofNodes(o, circle, geometry, dofMaterial);
	if (o.dofTlansX == 1) dof.draw('meshDofTrans', 'x');
	if (o.dofTlansY == 1) dof.draw('meshDofTrans', 'y');
	if (o.dofTlansZ == 1) dof.draw('meshDofTrans', 'z');
	if (o.dofRotatX == 1) dof.draw('meshDofRotat', 'x');
	if (o.dofRotatY == 1) dof.draw('meshDofRotat', 'y');
	if (o.dofRotatZ == 1) dof.draw('meshDofRotat', 'z');
}
function initDofNodes(nodeObj, circle, geometry, material){
	return {draw:function(type1, type2){
		circle = new THREE.Mesh(geometry, material);
		circle.position.set(nodeObj.x, nodeObj.y, nodeObj.z );
		circle.visible = false;
		scene.add(circle);
		QF.ppSetting[type1][type2].push(circle);
	}};
}
function drawNodeNo(o, material){
	var nodeNo = new THREE.TextGeometry( o.i, fontParameter);
	var nodeNoMesh = new THREE.Mesh( nodeNo,  material);
	nodeNoMesh.position.set(o.x+1, o.y-3, o.z );
	nodeNoMesh.visible=false;
	nodeNoMeshArr.push(nodeNoMesh);
	scene.add(nodeNoMesh);
}
}
QF.ppLogic.prototype = new QF.ppLogic;
QF.ppLogic.prototype.constructor = QF.ppLogic;