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
}