"use strict";
			
QF.ppMode = function(){
var cm = QF.Common();

return Object.freeze({
	//COMMON
	initContour : function(){
		cm.popUp('#confemModalContour');
	},
	initFlux : function(){
		cm.popUp('#confemModalFlux');
	},
	initGraph : function(){
		cm.popUp('#confemModalGraph');
	},
	initMeshData : function(){
		$.ajax({
			url:QF.ppSetting.serv_ppMesh + $('#projName').attr('data'),
			type: "GET",
			success:ppLg.loadMeshData
		});
	},
	initPltData : function(){
		$.ajax({
			url:QF.ppSetting.serv_ppPlt + $('#projName').attr('data'),
			type: "GET",
			success:ppLg.loadPltData
		});
	}
});
}
