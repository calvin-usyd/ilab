"use strict";
$(document).ready(function(){
	var 
		cm = new QF.Common()
	;

	$('#patrusRefreshGraphBtn').bind('click', function(){
		loadAll();
	});
	
	function loadAll(){
		cm.loadProgress();
		$.ajax({
			url:QF.ppSetting.serv_ppOutput + $('#projName').attr('data'),
			type: "GET",
			success:ppLg.loadGraph
		});
	}
	loadAll();
});
