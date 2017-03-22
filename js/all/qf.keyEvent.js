var keyArray = [];
var keyMap = {shift:16, ctrl:17, alt:18, pageUp:33, pageDown:34, end:35, home:36, left:37, up:38, right:39, down:40, s0:48, s1:49, s2:50, s3:51, s4:52, s5:53, s6:54, s7:55, s8:56, s9:57, a:65, b:66, c:67, d:68, e:69, f:70, g:71, h:72, i:73, j:74, k:75, l:76, m:77, n:78, o:79, p:80, q:81, r:82, s:83, t:84, u:85, v:86, w:87, x:88, y:89, z:90, f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123};
var qfMode = QF.mode(),
	cm = QF.Common();

//Turn off submit on "Enter" key
$(document).ready(function(){
	$("form").bind("keypress", function (e) {
		if (e.keyCode == 13) {
			alert('Please click the button instead!');
			return false;
		}
	});
});
window.addEventListener('keydown', function(event) {
	keyArray[event.keyCode] = true;
});
window.oncontextmenu = function (){
	if (QF.setting.isFESpas){
		lgFE.drawFEByRightClick(true);
		
	}else if (QF.setting.isFE){
		lgFE.drawFEByRightClick(false);
		
	}else if (QF.setting.isDE){		
		cm.popUp('#modalSetAttrDE');
	}
    return false;     // cancel default menu
}
window.addEventListener('keyup', function(event) {
  if (keyArray[keyMap.b] && keyArray[keyMap.s2] ){
	qfMode.initElement('Beam2');
	
  }else if (keyArray[keyMap.b] && keyArray[keyMap.s3] ){
	qfMode.initElement('Beam3');
	
  }else if (keyArray[keyMap.t] && keyArray[keyMap.s3] ){
	qfMode.initElement('Tri3');
	
  }else if (keyArray[keyMap.t] && keyArray[keyMap.s6] ){
	qfMode.initElement('Tri6');
	
  }else if (keyArray[keyMap.q] && keyArray[keyMap.s4] ){
	qfMode.initElement('Quad4');
	
  }else if (keyArray[keyMap.q] && keyArray[keyMap.s8] ){
	qfMode.initElement('Quad48');
	
  }else if (keyArray[keyMap.p] && keyArray[keyMap.n] ){
	qfMode.initNewProj();
	
  }else if (keyArray[keyMap.p] && keyArray[keyMap.s] ){
	qfMode.initSaveData();
	
  }else if (keyArray[keyMap.p] && keyArray[keyMap.v] ){
	qfMode.initRunExe();
	
  }else if (keyArray[keyMap.p] && keyArray[keyMap.o] ){
	qfMode.initSelectProj();
	
  }else if (keyArray[keyMap.p] && keyArray[keyMap.r] ){
	qfMode.initSimulation();
	
  }else if (keyArray[keyMap.f] && keyArray[keyMap.n] ){
	qfMode.toggleDrawNode();
	
  }else if (keyArray[keyMap.f] && keyArray[keyMap.c] ){
	qfMode.setConstraint();
	
  }else if (keyArray[keyMap.f] && keyArray[keyMap.r] ){
	qfMode.setRestraint();
	
  }else if (keyArray[keyMap.f] && keyArray[keyMap.t] ){
	qfMode.setTemparature();
	
  }else if (keyArray[keyMap.f] && keyArray[keyMap.l] ){
	qfMode.setLoad();
	
  }else if (keyArray[keyMap.f] && keyArray[keyMap.m] ){
	qfMode.setMaterial();
	
  }else if (keyArray[keyMap.f] && keyArray[keyMap.s] ){
	qfMode.setSubdivide();
	
  }
  keyArray = [];
});