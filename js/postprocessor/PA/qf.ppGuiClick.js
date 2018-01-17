"use strict";
$(document).ready(function(){
	$('#patrusRefreshGraphBtn').bind('click', function(){
		ppLg.loadAll();
	});
	
	ppLg.loadAll();
});
