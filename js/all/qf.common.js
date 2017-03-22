"use strict";
			
QF.Common = function(){
	var refreshIntervalId;
return Object.freeze({
	popUp : function(modalId){
		$(modalId).modal().draggable({
		  handle: ".modal-header"
		});
		
		$(modalId).on('shown.bs.modal', function() {
			$(document).off('focusin.bs.modal');
		});
	},
	hasSelected : function(){
		if(QF.setting.selectedObj.length > 0){
			return true;
		}else{
			alert('Please select node or element!');
			return false;
		}
	},
	inValEmpty : function(id, nameArray){
		for (var x=0, len=nameArray.length; x<len; ++x){
			$(id + ' input[name='+nameArray[x]+']').val('');
		}
	},
	selValSet : function(id, name, val){
		return $(id + ' select[name='+name+']').val(val);
	},
	inValSet : function(id, name, v){
		return $(id + ' input[name='+name+']').val(v);
	},
	inVal : function(id, name){
		return $(id + ' input[name='+name+']').val();
	},
	inSelVal : function(id, name){
		return $(id + ' select[name='+name+']').val();
	},
	inCheckSet : function(id, name, v){
		return $(id + ' input[name='+name+'][value='+v+']').prop('checked', true);
	},
	inCheckVal : function(id, name){
		return $(id + ' input[name='+name+']:checked').val();
	},
	inCheckVal : function(id, name, defaultVal){
		var val = $(id + ' input[name='+name+']:checked').val();
		if (val) return val;
		else return defaultVal;
	},
	inUnCheckVal : function(id, nameArray){
		for (var x=0, len=nameArray.length; x<len; ++x){
			$(id + ' input[name='+nameArray[x]+']').prop('checked', false);
		}
	},
	initHotExcel: function(container, colHeaders, columns, afterChange, nestedHeaders){
		return new Handsontable(container, {
			stretchH: "all",
			//width: 1506,
			//height: 441,
			//autoWrapRow: true,
			sortIndicator: true,
			//columnSorting: true,//SORTING DISABLED COZ CHANGES' INDEX ARE WRONG AFTER SORT (UNLESS THE DATAARRAY WAS SORTED TOO TO MATCH THE INDEX)
			search: true,
			rowHeaders: true,
			/*contextMenu: true,
			contextMenuCopyPaste: {
			  swfPath: '//quantumfi.com.au/shared/ZeroClipboard.swf'
			},*/
			colHeaders: colHeaders,
			nestedHeaders: nestedHeaders,
			columns: columns,
			afterChange: afterChange
		});
	},
	toMapPoint: function(canvH, rOffset, ratio){
		var system = function(x, y){//to pixel
			return {
				x:x * ratio + rOffset,
				y:canvH  - rOffset - y * ratio 
			};
		}
		var user = function(x, y){//to meter
			return {
				x:(x - rOffset) / ratio,
				y:(canvH - y - rOffset) / ratio
			};
		}
		return{system:system, user:user};
	},
	replaceAll: function(target, search, replacement) {
		return target.replace(new RegExp(search, 'g'), replacement);
	},
	getJsonObj: function(json){
		return (json instanceof Object) ? json : JSON.parse(json);
	},
	loadProgress: function(){
		var $progressHolder;
		if ($('body').has('#progressHolder').length == 1){
			$progressHolder = $('#progressHolder');
			$progressHolder.removeClass('hide');
		}else{
			$progressHolder = $('<div id="progressHolder">');
			$progressHolder.prependTo($('body'));
		}
		$progressHolder.css({
			height: $(document).height(),
			'background-color': 'rgba(0, 0, 0, 0.38)',
			'z-index': '1060',
			position: 'absolute',
			width: '100%'
		});
		$progressHolder.html('<div class="row"><p class="text-center pleaseWaitText" style="color:#fff">Please wait...!</p><div class="progress progress-striped active col-lg-6 col-lg-offset-3"><div class="progress-bar" style="width: 25%"></div></div></div>');
		
		var val=20;
		refreshIntervalId = setInterval(function(){
			$('.progress-bar').css('width', (val+=5)+"%");
		}, 500);
		console.log('load progress: '+refreshIntervalId);
	},
	hideProgress: function(){
		console.log('hide progress: '+refreshIntervalId);
		var $progressHolder = $('#progressHolder');
		$progressHolder.addClass('hide');
		clearInterval(refreshIntervalId);
	}
});
}