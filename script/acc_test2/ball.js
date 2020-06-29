class Ball
{
 constructor(sx, sy, sr)
 {
  this.x = sx;
  this.y = sy;
  this.rad = sr;
  
  this.velX = 3;
  this.velY = 0;
  
  this.r = 1;
  this.g = 0;
  this.b = 0;
 }
 
 Update()
 {
   this.x = this.x + this.velX;
   this.y = this.y + this.velY;
   
   
   if (this.x - this.r <= 0 || this.x + this.r >= GameEngine.GetWidth())
   {
    if (this.x - this.r <= 0){this.x = -this.r;}
    if (this.x + this.r >= GameEngine.GetWidth()){this.x = GameEngine.GetWidth() - this.r;}
    this.velX = this.velX * -1*1/2;
   }
   
   if (this.y - this.r <= 0 || this.y + this.r >= GameEngine.GetHeight())
   {
    if (this.y - this.r <= 0){this.y = -this.r;}
    if (this.y + this.r >= GameEngine.GetHeight()){this.y = GameEngine.GetHeight() - this.r;}
    this.velY = this.velY * -1*1/2;
   }
 
   
   
 }
 
 Draw()
 {
  GameEngine.SetColor(this.r,this.g,this.b, .5);
  GameDraw.DrawCircleCenter(this.x,this.y,this.rad*2, this.rad*2);
 }
 
 
 IsCollide(o)
 {
  var difX = this.x - o.x;
  var difY = this.y - o.y;
  
  var difR = (this.rad + o.rad);
  
  if (difX*difX + difY*difY <= difR*difR)
  {
   return true;
  }
  
 }
 
 
 OnCollide(o)
 {
    var holdVelX = this.velX;
	var holdVelY = this.velY;
	
	this.velX = o.velX;
	this.velY = o.velY;
	
	o.velX = holdVelX;
  o.velY = holdVelY;
  
  this.x = this.x + this.velX;
  this.y = this.y + this.velY;
  
	
 }
 
 
 
 


}