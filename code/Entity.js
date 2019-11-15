

/**
 * Created by Curt on 8/29/2016.
 */

Include("Tools.js");
Include("KPosition.js");
Include("KAlpha.js");
Include("Sprite.js");
Include("GColor.js");
Include("GBox.js");

class Entity
{

 constructor(im, sx, sy)
 {
  this.sprite = new Sprite(im);
  this.position = new KPosition(sx, sy);
  this.alpha = new KAlpha();
  this.color = new GColor(1,1,1);

  this.rot = 0;

  this.hitBox = new GBox(0,0,1,1);

  if (this.sprite != null)
  {
    this.hitBox.w = this.sprite.frameW;
    this.hitBox.h = this.sprite.frameH;
  }

 }



 SetSprite(setSprite)
 {
    this.sprite = setSprite;
 }

 SetHitBox(hitX, hitY, hitW, hitH)
 {
    this.hitBox = new GBox(hitX, hitY, hitW, hitH);
 }

 ExpandHitBox(sx, sy, sw, sh)
 {
    this.hitBox.x = this.hitBox.x - sx;
    this.hitBox.y = this.hitBox.y - sy;
    this.hitBox.w = this.hitBox.w + sw;
    this.hitBox.h = this.hitBox.h + sh;
 }



 Update()
 {
    this.position.Update();
    this.alpha.Update();
 }

 GetX(){return this.position.x;}
 GetY(){return this.position.y;}





 SetColor(scolor)
 {
    this.color = scolor;
 }


 Draw()
 {
  if (this.sprite != null)
  {
     this.sprite.x = this.position.x;
     this.sprite.y = this.position.y;
     this.sprite.rot = this.rot;
      GameEngine.SetColor(this.color.r, this.color.g, this.color.b, this.alpha.GetAlpha());
      this.sprite.Draw();
      
      GameEngine.ResetColor();
  }

 }


 PointCollide(tx, ty)
 {
  return this.hitBox.PointCollide(this.position.x,this.position.y, tx, ty);
 }


 SetImage(image)
 {
  this.sprite = new Sprite(image);

 }







 // static functinos for ent list

   static UpdateAll(entList)
    {
        for (i = 0; i < entList.GetSize(); i++)
        {
            entList.Get(i).Update();
        }
    }


 static DrawAll(entList)
 {
    for (i = 0; i < entList.GetSize(); i++)
    {
        entList.Get(i).Draw();
    }
 }








}
