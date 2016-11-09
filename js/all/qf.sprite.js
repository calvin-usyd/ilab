"use strict";

QF.sprite = function(texture){
  PIXI.Sprite.call(this);
  QF.display.call(this);
  
  this.texture = texture;
}

QF.sprite.prototype = new PIXI.Sprite;
QF.sprite.prototype.constructor = QF.sprite;