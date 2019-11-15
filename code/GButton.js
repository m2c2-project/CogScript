
Include("Tools.js");
Include("KPosition.js");
Include("KAlpha.js");
Include("KTime.js");

class GButton
{

 

 constructor(imageList, sx, sy, sreponseTime = 200)
 {
       // imageList should be 2 images
    this.image = imageList;
    this.w = imageList.Get(0).w;
    this.h = imageList.Get(0).h;

    LogMan.Log("DOLPH_GAMESCRIPT", "test log");

     this.pressBorder = 10;// amount of space around the button that can be pressed (hit box)

     this.kpos = new KPosition(sx,sy);
     this.alpha = new KAlpha(1, 0.1);

     this.pressed = false;

     this.responseTime = sreponseTime; // time in ms to light up after pressed

     this.onPressTime = -1; // time when pressed
  
 }

 GetWidth(){return this.w;}
 GetHeight(){return this.h;}
 GetCenterX(){return this.kpos.x + this.w/2;}
 GetCenterY(){return this.kpos.y + this.h/2;}

 


 




 
 SetPressBorder(b){this.pressBorder = b;}

 IsPressed()
 {
  return this.pressed;
 }

 SetPressed(b)
 {
  this.pressed = b;
 }


 Update()
 {
  this.kpos.Update();
  this.alpha.Update();
  if (this.pressed)
  {
   if (this.responseTime > -1 && KTime.GetMilliTime() - this.onPressTime >= this.responseTime)
   {
    this.pressed = false;
   }
  }
 }

 GetPosition()
 {
  return this.kpos;
 }

 GetAlpha()
 {
  return this.alpha;
 }


 

 Draw(dx = 0, dy = 0)
 {
  GameEngine.ResetColor();
  //GameEngine.SetColor(1,1,1,alpha.GetAlpha());
  GameEngine.SetAlpha(this.alpha.GetAlpha());
  this.drawImage = this.image.Get(0);
  if (this.pressed){this.drawImage = this.image.Get(1);}
  GameDraw.DrawImage(this.drawImage, this.kpos.x+dx, this.kpos.y+dy);
  GameEngine.ResetColor();

 }

 CheckPressed(tx, ty)
 {
     
  if (this.kpos.AtTarget() && tx >= this.kpos.x - this.pressBorder && tx <= this.kpos.x + this.w + this.pressBorder &&
           ty >= this.kpos.y - this.pressBorder && ty <= this.kpos.y + this.h + this.pressBorder)
  {
    this.OnPress();
   return true;
  }

  return false;
 }

 OnPress()
 {
    this.pressed = true;
    this.onPressTime = KTime.GetMilliTime();
 }


}