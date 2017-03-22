"use strict";


QF.LogicSelect = function(){
	this.processSelected = function(mousePos){
		var child, gdata, points, sh, containPoint;
		
		for (var c=0; c<stage.children.length; ++c){
			containPoint = false
			child = stage.children[c];
			gdata = child.graphicsData;
	
			if (child instanceof QF.Element || child instanceof Polygon){
				points = gdata[0].points;
				
				if (this.containsIntersect(selectArea, points[0], points[1])){
					containPoint = true;
				}
			}else if (child instanceof QF.Node || child instanceof Circle){
				sh = gdata[0].shape;
				
				if (this.containsIntersect(selectArea, sh.x, sh.y)){
					containPoint = true;
				}
			}
			
			if (containPoint){
				QF.setting.selectedObj.push({
					obj:child, 
					alpha:child.alpha
				});
				
				if (child.alpha + QF.setting.offsetAlpha > 1){
					child.alpha = child.alpha - QF.setting.offsetAlpha;
					
				}else{
					child.alpha = child.alpha + QF.setting.offsetAlpha;
				}
				
				child.dirty = true;
				child.clearDirty = true;
			}
		}
		console.log(QF.setting.selectedObj);
		selectArea.visible = false;
		QF.setting.startSelection = false;
		//QF.setting.isSelect = false;
		QF.setting.selectionStartPoint = {'x':0, 'y':0};
	}
	
	this.selectMultiple = function(mousePos){
		var pt = QF.setting.selectionStartPoint;
		
		selectArea.clear();
		selectArea.visible = true;
		selectArea.beginFill(0x0000ff, 0.3);
		var newPoint = {x1:pt.x, y1:pt.y, x2:mousePos.x - pt.x, y2:mousePos.y - pt.y};
		
		if (newPoint.x2 < 0){
			 newPoint.x1 = newPoint.x1 + newPoint.x2,
			 newPoint.x2 = - newPoint.x2
		}
		selectArea.drawRect(newPoint.x1, newPoint.y1, newPoint.x2, newPoint.y2);
	}
	
	this.unselectAll = function(){
		for (var s=0; s<QF.setting.selectedObj.length; s++){
			QF.setting.selectedObj[s].obj.alpha = QF.setting.selectedObj[s].alpha;
			QF.setting.selectedObj[s].obj.dirty = true;
			QF.setting.selectedObj[s].obj.clearDirty = true;
		}
		
		QF.setting.selectedObj = [];
	}
	
	this.containsIntersect = function(selectArea, x, y){
		if(selectArea.width <= 0 || selectArea.height <= 0)
			return false;
 
		var x1 = selectArea.graphicsData[0].shape.x;
		
		if(x >= x1 && x <= x1 + selectArea.graphicsData[0].shape.width)
		{
			var y1 = selectArea.graphicsData[0].shape.y;
	 
			if(y >= y1 && y <= y1 + selectArea.graphicsData[0].shape.height)
			{
				return true;
			}
		}

		return false;
	}
}

QF.LogicSelect.prototype = new QF.LogicSelect;
QF.LogicSelect.prototype.constructor = QF.LogicSelect;