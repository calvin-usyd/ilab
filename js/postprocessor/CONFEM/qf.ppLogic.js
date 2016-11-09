"use strict";

QF.ppLogic = function(){

var 
cm = QF.Common();
;

this.loadMeshData = function(json){
	QF.ppSetting.meshData = (json instanceof Object) ? json : JSON.parse(json);
	
	ppLg.processMeshData(QF.ppSetting.meshOption, true);
}
this.reCreateMeshData = function(distX, distY){
	lgFE.removeNodesNo();
	lgFE.removeElementObjAndNo();
	
	_.forEach(QF.setting.nodeObjArray, function(node){
		var x=node.o.graphicsData[0].shape.x;
		var y=node.o.graphicsData[0].shape.y;
		var defaultOpt = QF.ppSetting.meshOption;
		
		//console.log(x / defaultOpt.distX * distX);
		//console.log(y / defaultOpt.distY * distY);
		//console.log(y);
		node.o.removeChildren();
		node.o.refreshCoordinate({
			x:x / defaultOpt.distX * distX, 
			y:y / defaultOpt.distY * distY, 
			c:''
		});
	});
	
	ppLg.processMeshData(QF.ppSetting.meshOption, false);
}
this.processMeshData = function(opt, doCreateNodes){
	var mshArray = QF.ppSetting.meshData;
	var elements = mshArray['elements'];
	
	if (doCreateNodes){
		var nodes = mshArray['nodes'];
		for (var i=0; i<nodes.length; i++){
			var coor = toUserPoint((nodes[i][0]+opt.startX) * opt.distX, (nodes[i][1]+opt.startY) * opt.distY);
			lgFE.drawNode({x:coor.x, y:coor.y, color:'0x0000ff'});			
		}
	}
	var stop=0;
	_.forEach(elements, function(elemArr){
		/*var allNodesElem = [];
		allNodesElem = _.clone(elemArr);
		allNodesElem.push(elemArr[0]);//ADD FIRST NODE AS LAST NODE TO CLOSE ELEMENT
		console.log(allNodesElem);
		*/
		lgFE.drawElement(elemArr, true, '');
	});
}
this.loadPltData = function(json){
	var pltArray = (json instanceof Object) ? json : JSON.parse(json);
	QF.ppSetting.analysisTypes = pltArray['analysisName'];
	QF.ppSetting.analysisActive = pltArray['active'];
	QF.ppSetting.allMinMaxArr = pltArray['allMinMaxArr'];
	QF.ppSetting.analysisDatas = pltArray['analysisDataArr'];
	QF.ppSetting.analysisTimes = pltArray['analysisTime'];
	
	var selectType = $('select[name=analysisType]');
	_.forEach(QF.ppSetting.analysisTypes, function(o, i){
		var $opt = $('<option>');
		$opt.attr('value', i+3).html(o);
		
		if (QF.ppSetting.analysisActive[i] == 0){
			$opt.attr('disabled', '');
		}
		$opt.appendTo(selectType);
	});
	
	var timeHolder = $('select[name=timeStep]');
	var optDef = $('<option>');
	optDef.html('Select Time Step').appendTo(timeHolder);

	_.forEach(QF.ppSetting.analysisTimes, function(o, i){
		//var a = $('<div class="btn text-primary list-group-item">');
		var a = $('<option>');
		a
		.html(o)
		.attr('value', i)
		.appendTo(timeHolder);
	});
}
this.plotAnalysisData = function(time){
	var analysisType = cm.inSelVal('#analysisHolder', 'analysisType');
	var time = cm.inSelVal('#timeHolder', 'timeStep');
	
	var flattenData = _.flatten(QF.ppSetting.analysisDatas[time]);
	var dataArr = _.orderBy(flattenData, ['x', 'y']);
	
	//console.log(flattenData);
	//console.log(dataArr);
	var 
	zArr=[],
	xArr=[],
	yArr=[],
	uniqXArr=[],
	uniqYArr=[],
	zByXArr=[],
	xVal=null
	;
	_.forEach(dataArr, function(o){
		xArr.push(o['x']);
		yArr.push(o['y']);
		
	});
	
	uniqXArr=_.uniq(xArr);
	uniqYArr=_.uniq(yArr);
	
	_.forEach(uniqYArr, function(y){
		_.forEach(uniqXArr, function(x){
			
			var zVal = _.find(dataArr, function(o){
				return o.x == x && o.y == y;
			});
			if (typeof zVal != 'undefined'){
				console.log(zVal[analysisType]);
				zByXArr.push(zVal[analysisType]);
			}else{
				zByXArr.push(null);
			}
		});
		zArr.push(zByXArr);
		zByXArr=[];
	});
	
	/*
	_.forEach(dataArr, function(o){
		if (xVal){//HELENE
			console.log('ss');
			if (xVal == o['x']){
				yArr.push(o['y']);
				zByXArr.push(o[analysisType]);
			}else{
				zArr.push(zByXArr);
				xArr.push(o['x']);
				xVal=o['x'];
				
				zByXArr=[];
			}
		}else{
			console.log('else');
			xVal=o['x']);
		}
	});
	console.log(zArr);
	console.log(xArr);
	console.log(yArr);*/
	var data = [{
	  z: zArr,
	  x: uniqXArr,
	  y: uniqYArr,
	  connectgaps: true,
	  //type: 'heatmap',
	  type: 'contour'
	}];

	var layout = {
	  title: 'Contour Plot'
	};

	Plotly.newPlot('plotContour', data, layout);

	/*
	var min = QF.ppSetting.allMinMaxArr[time][analysisType][0];
	var max = QF.ppSetting.allMinMaxArr[time][analysisType][1];
	var xMm = max - min;
	console.log(min);
	console.log(max);
	console.log(xMm);
	function rgb(array){
	  return 'rgb('+ array.map(function(r){return Math.round(r);}).join(',') +')';
	}
	function rgbToHex(r, g, b) {
		return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
	for (var i=0; i<dataArr.length; i++){
		
		//var val = Math.abs(dataArr[i][analysisType]) * 10000;
		var val = ((dataArr[i][analysisType] - min) / xMm) * 200;
		//var val = ((dataArr[i][analysisType] / xMm) - mOd) * 1500;
		//console.log(val);
		//var col = chroma.temperature(val).hex().replace('#', '0x');
		var col = rgbToHex(val, 0, 0);
		console.log(val + ': ' +col);
		
		var coor = toUserPoint((dataArr[i][1]+60) * 10,(dataArr[i][2]+1) * 300);
		lgFE.drawNode({x:coor.x, y:coor.y, color:col});
	}*/
}
}
QF.ppLogic.prototype = new QF.ppLogic;
QF.ppLogic.prototype.constructor = QF.ppLogic;