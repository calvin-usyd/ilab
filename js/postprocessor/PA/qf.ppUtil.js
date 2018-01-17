"use strict";

QF.ppUtil = function(){

this.processStr2Arr = function(arr){
	return _.map(arr, function(str){
		return _.map(_.remove(_.split(str, ' '), function(data){
			return data!='';			
		}), function(d){
			return d;
		});
	});
}
this.noNotation = function(s){
	if (typeof s === 'undefined') return 0;
	var nNum=0;
	if (s.match(/^[-+]?[0-9]\.[0-9]+D[-+]?[0-9][0-9]*$/)) {
		s=s.replace('D', 'e');
	}
	if (s.match(/^[-+]?[0-9]\.[0-9]+e[-+]?[0-9][0-9]*$/)) {
	  nNum = (+s).toFixed(this.getPrecision(s));
	  return parseFloat(nNum);
	}
	return parseFloat(s);
}
this.getPrecision = function(scinum) {
  var arr = new Array();
  // Get the exponent after 'e', make it absolute.  
  arr = scinum.split('e');
  var exponent = Math.abs(arr[1]);

  // Add to it the number of digits between the '.' and the 'e'
  // to give our required precision.
  var precision = new Number(exponent);
  arr = arr[0].split('.');
  precision += arr[1].length;
  
  return precision>20?20:precision;
}
}
QF.ppUtil.prototype = new QF.ppUtil;
QF.ppUtil.prototype.constructor = QF.ppUtil;