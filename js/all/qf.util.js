//http://www.phpied.com/3-ways-to-define-a-javascript-class/
//function QFUtil(){}
var QFUtil = new function(){//singleton
	/*
	grid object:
	len : length of the grid; len of grid x = len of grid y
	dist: distance between each grid's dot
	example :
	var grid = {
		len:800,
		dist:15
	};
	*/
	//QFUtil.prototype.snap2Grid = function(mousePos, grid){
	this.snap2Grid = function(mousePos, grid){
		//console.log(mousePos);
		var shortestDistantX = -1, shortestDistantValueX = -1, shortestDistantY  = -1, shortestDistantValueY = -1;
    	var newDistantX, newDistantY;
	
		for(var x = 0; x < grid.width; x+=grid.distX){
			newDistantX = mousePos.x - x;
			
			if(newDistantX < 0){//change to positive if its negative
				newDistantX = -newDistantX;
			}
			
			if (shortestDistantX == -1){
				shortestDistantX = newDistantX;
			}
			if (newDistantX < shortestDistantX){
				shortestDistantX = newDistantX;
				shortestDistantValueX = x;
			}
		}
		
		for(var y = grid.height; y > 0; y-=grid.distY){
			newDistantY = mousePos.y - y;

			if(newDistantY < 0){//change to positive if its negative
				newDistantY = -newDistantY;
			}
			
			if (shortestDistantY == -1){
				shortestDistantY = newDistantY;
			}
			if (newDistantY < shortestDistantY){
				shortestDistantY = newDistantY;
				shortestDistantValueY = y;
			}
		}
		
		if (shortestDistantValueY == -1){
			shortestDistantValueY = grid.height;
		}
		
		if (shortestDistantValueX == -1){
			shortestDistantValueX = 0;
		}
		
		mousePos.x = shortestDistantValueX;
		mousePos.y = shortestDistantValueY;
		//console.log(mousePos);
		return mousePos;
	}
	
	this.queryString = function () {
	  // This function is anonymous, is executed immediately and 
	  // the return value is assigned to QueryString!
	  var query_string = {};
	  var query = window.location.search.substring(1);
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
		  query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
		  var arr = [ query_string[pair[0]], pair[1] ];
		  query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
		  query_string[pair[0]].push(pair[1]);
		}
	  } 
		return query_string;
	} ();
	
	this.removeURLParameter = function(url, parameter) {
		//prefer to use l.search if you have a location/link object
		var urlparts= url.split('?');   
		if (urlparts.length>=2) {

			var prefix= encodeURIComponent(parameter)+'=';
			var pars= urlparts[1].split(/[&;]/g);

			//reverse iteration as may be destructive
			for (var i= pars.length; i-- > 0;) {    
				//idiom for string.startsWith
				if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
					pars.splice(i, 1);
				}
			}

			url= urlparts[0]+'?'+pars.join('&');
			return url;
		} else {
			return url;
		}
	}
	
	this.loadjscssfile = function(filename, filetype){
		filename = filename + ('?' + (new Date()).getMilliseconds());

		if (filetype=="js"){ //if filename is a external JavaScript file
			var fileref=document.createElement('script')
			fileref.setAttribute("type","text/javascript")
			fileref.setAttribute("src", filename)
		}
		else if (filetype=="css"){ //if filename is an external CSS file
			var fileref=document.createElement("link")
			fileref.setAttribute("rel", "stylesheet")
			fileref.setAttribute("type", "text/css")
			fileref.setAttribute("href", filename)
		}
		if (typeof fileref!="undefined")
			document.getElementsByTagName("head")[0].appendChild(fileref)
	}
	
	this.toMapPoint = function(canvH, rOffset){	
		var system = function(x, y){//to pixel
			return {
				x:x + rOffset,
				y:canvH  - rOffset - y ,
				u:{
					x:x,
					y:y
				}
			};
		}
		var user = function(x, y){//to meter
			return {
				x:(x - rOffset),
				y:(canvH - y - rOffset) 
			};
		}
		return{system:system, user:user};
	}
	
	this.toFitPoint = function(canvH, rOffset, xMax, xMin, yMax, yMin){
		var xDiff = xMax - xMin;
		var yDiff = yMax - yMin;
		canvH = canvH - 10*rOffset;
		xDiff = (xDiff==0)?1:xDiff;
		yDiff = (yDiff==0)?1:yDiff;
		var maxDiff = xDiff > yDiff ? xDiff : yDiff;
		
		var systemCenter = function(x, y){//to pixel
			var yMaxFrC = canvH*1.5 - (canvH * yDiff/maxDiff + rOffset);//POINT START FROM CENTER
			var xStartPonit = 100;
			return {
				x: xStartPonit + canvH * (x - xMin)/maxDiff + rOffset,
				y: yMaxFrC + (canvH * (y - yMin)/maxDiff + rOffset)
			};
		}
		var system = function(x, y){//to pixel
			var yMaxFr0 = canvH + rOffset - (canvH * yDiff/maxDiff + rOffset);//POINT START FROM BOTTOM LEFT (0,0)
			return {
				x: canvH * (x - xMin)/maxDiff + rOffset,
				y: yMaxFr0 + (canvH * (y - yMin)/maxDiff + rOffset)
			};
		}
		var user = function(x, y){//to meter
			return {
				x: (x - (rOffset - (canvH / maxDiff) * xMin)) / (canvH / maxDiff),
				y: (y - (rOffset - (canvH / maxDiff) * yMin)) / (canvH / maxDiff)
			};
		}
		return{system:system, user:user, systemCenter:systemCenter};
	}
	//Pythagorean theorem
	this.distantBtwPoints = function(p1, p2){
		var diff = this.diffVectors(p1, p2);
		return this.hypotenuse(diff.x, diff.y);
	}
	this.diffVectors = function(p1, p2){
		return {x:(p2.x-p1.x), y:(p2.y-p1.y)};
	}
	this.hypotenuse = function(lenA, lenB){
		return Math.sqrt(lenA * lenA + lenB * lenB);		
	}
	this.perpendicular = function(p1, p2, thickness, direction){
		var
		diff = this.diffVectors(p1, p2),
		rot = {x:  diff.y, y: -diff.x},
		p = thickness / this.hypotenuse(diff.x, diff.y);
		
		return {
			x:rot.x*p, 
			y:rot.y*p
		};
	}
	this.slope = function(x, y){
		return y/x;
	}
	this.lineIntersect = function(line1, line2){
		var
		diff1 = this.diffVectors(line1.p1, line1.p2),
		diff2 = this.diffVectors(line2.p1, line2.p2),
		slope1 = this.slope(diff1.x, diff1.y),
		slope2 = this.slope(diff2.x, diff2.y);
		
		return (slope1 - slope2 < Number.EPSILON) ? undefined : {
			x: ( slope1*line1.p1.x - slope2*line2.p1.x + line1.p1.y ) / (slope1 - slope2),
			y: ( slope1*slope2*(line2.p1.x-line1.p1.x) + slope2*line1.p1.y - slope1*line2.p1.y) / (slope2 - slope1)
		}
	}
	this.between = function(a, b, c) {
		var eps = 0.0001;
		return (a-eps) < b && b < (c+eps);
		//return (a.toFixed(1)<b.toFixed(1) && b.toFixed(1)<c.toFixed(1));
	}
	this.segment_intersection = function(x1,y1,x2,y2, x3,y3,x4,y4) {
		var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) /
				((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
		var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) /
				((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
		if (isNaN(x)||isNaN(y)) {
			return false;
		} else {
			if (x1>=x2) {
				if (!this.between(x2, x, x1)) {return false;}
			} else {
				if (!this.between(x1, x, x2)) {return false;}
			}
			if (y1>=y2) {
				if (!this.between(y2, y, y1)) {return false;}
			} else {
				if (!this.between(y1, y, y2)) {return false;}
			}
			if (x3>=x4) {
				if (!this.between(x4, x, x3)) {return false;}
			} else {
				if (!this.between(x3, x, x4)) {return false;}
			}
			if (y3>=y4) {
				if (!this.between(y4, y, y3)) {return false;}
			} else {
				if (!this.between(y3, y, y4)) {return false;}
			}
		}
		return {x: x, y: y};
	}
	this.angleBtwPoints = function(p1, p2, type){
		var angleRad = Math.atan((p2.y-p1.y)/(p2.x-p1.x));
		if (type == 'degree') return angleRad * 180 / Math.PI;
		return angleRad;
	}
	this.pointByDistant = function(p1, distant, angleRad, canvH){
		return {
			x:p1.x + Math.cos(angleRad) * distant,
			y:canvH - (p1.y + Math.sin(angleRad) * distant)
		}
	}
}