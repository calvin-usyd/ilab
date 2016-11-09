"use strict";

QF.WuiCrtl = function(){
	
	$('#refreshList').bind('click', function(){
		getFileList();
	});
	
	$('#exportProject').unbind("click").bind('click', function(){//Add .unbind("click") IF FIRING TWICE
		var selectedModel = $('.fileByTime.btn-primary').html();
		
		if (typeof selectedModel == 'undefined'){
			alert('Please select snapshot that you wanted to export!');
		
		}else{
			$( "#dialogExport" ).dialog({
				buttons: [{
					text: "Export",
					click: function() {
						startExportProject();
						$( this ).dialog( "close" );
					}
				}]
			});
		}
	});
	
	//PPP: Post Processor Particle
	this.getPPPContent = function(fileName){
		$('.fileByTime.btn-primary').toggleClass('btn-default btn-primary');
		
		$('#'+fileName.replace('.', '')).toggleClass('btn-default btn-primary');
		
		$.ajax({
			url: QF.setting.url + QF.setting.serv_pppData + pName.innerHTML + '/' + sName.innerHTML + '/' + fileName,
			dataType: 'json',
			success: successGetPPPContent
		});
	}
	
	function successGetPPPContent(jsonData){
		
		lg.importModel(jsonData['cP']);
		
		//lg.importKMB(jsonData['bP']);
		
		if ($('input[name=toggleMicroContact]:checked').val()){
			var $settingMP = {
				indexCenterX:5, indexCenterY:6, indexDestX:2, indexDestY:3, scale:0.0005
			}
			lg.importKMB(jsonData['mP'], $settingMP);
		}
		
		if ($('input[name=toggleKinetic]:checked').val()){
			var $settingKP = {
				indexCenterX:2, indexCenterY:3, indexDestX:5, indexDestY:6, scale:0.5
			}
			lg.importKMB(jsonData['kP'], $settingKP);
		}
	}
	
	function startExportProject(){
		var postData = {
			oldProjName:pName.innerHTML, 
			oldSimulation:sName.innerHTML, 
			newProjName:$('#newPName').val(), 
			snapshotFile:$('.fileByTime.btn-primary').html()
		};
		
		$.post(
			QF.setting.url + QF.setting.serv_pppExport,
			postData,			
			successExportProject
		);
	}
	
	function successExportProject(dataJson){
		alert(dataJson[1]);
	}
	
	function getFileList(){
		$.ajax({
			url: QF.setting.url + QF.setting.serv_pppList + pName.innerHTML + '/' + sName.innerHTML,
			dataType: 'json',
			success: successGetFileList
		});
	}
	
	function successGetFileList(jsonData){
		var fileNameC = $('#ppplist');
		fileNameC.empty();
		
		$(jsonData).each(function(index, value){
			var files = $('#dummyFileElem').clone();
			files
			.removeClass('hide')
			.attr('id', value.replace('.', ''))
			.attr('onclick', "crtl.getPPPContent('"+value+"')")
			.html(value)
			;
			
			files.appendTo(fileNameC);
		});
	}
}

QF.WuiCrtl.prototype = new QF.WuiCrtl();
QF.WuiCrtl.prototype.constructor = QF.WuiCrtl;

//(new QF.WuiCrtl()).bindCrtl();
var crtl = new QF.WuiCrtl();