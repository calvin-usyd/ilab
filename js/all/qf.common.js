"use strict";
			
QF.Common = function(){
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
	toUserPointY: function(canvH){//also used when convert to system y coordinate
		return function(y){
			return canvH-y;
		}
	},
	replaceAll: function(target, search, replacement) {
		return target.replace(new RegExp(search, 'g'), replacement);
	}
});
}