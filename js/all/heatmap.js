var HeatmapConfig = {
  defaultRadius: 40,
  defaultRenderer: 'canvas2d',
  defaultGradient: { 0.05: "rgb(0,0,255)", 0.40: "rgb(0,255,0)", 0.75: "yellow", 1.0: "rgb(255,0,0)"},
  defaultMaxOpacity: 1,
  defaultMinOpacity: 0,
  defaultBlur: .85,
  defaultXField: 'x',
  defaultYField: 'y',
  defaultValueField: 'value', 
  plugins: {}
};
'use strict';
var heatmap = (function heatmapClosure(){
	_min = 0;
	_max = 100;
	_totalColor = 10;
	_palette={};
	
	function setColorPalette(config) {
		  var gradientConfig = config.gradient || config.defaultGradient;
		  var paletteCanvas = document.createElement('canvas');
		  var paletteCtx = paletteCanvas.getContext('2d');

		  paletteCanvas.width = 256;
		  paletteCanvas.height = 1;

		  var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
		  for (var key in gradientConfig) {
			gradient.addColorStop(key, gradientConfig[key]);
		  }

		  paletteCtx.fillStyle = gradient;
		  paletteCtx.fillRect(0, 0, 256, 1);

		  _palette = paletteCtx.getImageData(0, 0, 256, 1).data;
	};
	
	function setData(min, max, totalColor){
		_min = min;
		_max = max;
		_totalColor = totalColor;
	}
	
	function renderBar(){		
		var colValArr = getColors(genBarVal());
		var colrTextArr = [];
		
		var hmTblElem = $('#heatmapTbl');
			hmTblElem.empty();
		for(var i=_totalColor+1; i>0; i--){
			var span = $('<span class="list-group-item">');
			var colrObj = colValArr[i-1];

			span.css({
				backgroundColor: colrObj.color,
				width: '100%'
			}).html(colrObj.value).appendTo(hmTblElem);
		}
	}
	
	var genBarVal = function(){
		var size=parseFloat((_max - _min) / _totalColor);
		var val = parseFloat(_min);
		var generatedArrVal=[];
		generatedArrVal.push(val);
		for(var i=0; i<_totalColor; i++){
			generatedArrVal.push((+(val+=size)));
		}
		return generatedArrVal;
	}
	
	function getColors(valueArr){
		var colorIndex, 
			r, g, b, 
			colorValArr=[], 
			val, rgbStr,
			lowerVal=Math.abs(_max-_min),
			offset = _min >= 0 ? 0 : _min;
		;
		for (var i=0; i<valueArr.length; i++){
			val = valueArr[i]-offset;
			colorIndex = (((val/lowerVal * 255) >> 0) * 4);
			r = _palette[colorIndex];
			g = _palette[colorIndex + 1];
			b = _palette[colorIndex + 2];
			rgbStr = ['rgb(', r, ',', g, ',', b,')'].join('');
			colorValArr.push({
				'value': valueArr[i], 
				'colorHex': rgb2hex(rgbStr),
				'color':rgbStr
			});
		}
		return colorValArr;
	}
	
	function rgb2hex(rgb){
	 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	 return (rgb && rgb.length === 4) ? 
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}
	
	return {
		setColorPalette:setColorPalette,
		setData:setData,
		renderBar:renderBar,
		getColors:getColors
	};
});