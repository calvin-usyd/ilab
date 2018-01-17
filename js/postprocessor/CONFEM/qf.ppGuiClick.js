"use strict";
$(document).ready(function(){
	var 
		cm = new QF.Common()
	;

	$('select[name=timeStep]').bind('change', function(){
		ppLg.plotAnalysisData();
	});
	
	$('select[name=analysisType]').bind('change', function(){
		ppLg.plotAnalysisData();
	});
});
