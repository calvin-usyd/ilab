Dot.prototype = new PIXI.Graphics();
Dot.prototype.constructor = Dot;

function Dot(){
  PIXI.Graphics.call(this);
}