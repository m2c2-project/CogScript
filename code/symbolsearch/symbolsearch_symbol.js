


    // ------------------------
    // SYMBOL CLASSES
    // ------------------------

   
    Include("Sprite.js");

    class Symbol
    {


     constructor(image, stype)
     {
      this.type = stype;
      
      this.sprite = new Sprite(image, 0,0,250,250);//image.w/6,image.h/4);
      this.sprite.curFrame = this.type%6;
      this.sprite.curLayer = Math.floor(this.type/6);
      this.sprite.drawW = Symbol.W;
      this.sprite.drawH = Symbol.H;



      var c = 0.0;
      this.color = new GColor(c,c,c);
     }


     
    
     //public static final int IMAGE_W = 250;
     //public static final int IMAGE_H = 250;



 
     Draw(dx, dy)
     {

      this.sprite.x = dx;
      this.sprite.y = dy;
      GameEngine.SetColor(this.color);
    
      this.sprite.Draw();
     // GameEngine.ResetColor();



         GameEngine.ResetColor();


     }

     Update()
     {
      this.sprite.Update();
     }



    }

    Symbol.MaxType = 24;
    Symbol.W = 80;
    Symbol.H = 80;

    Symbol.LURE = 1;
    Symbol.REGULAR = 0;


    class SymbolPair
    {
      
     constructor(image, typeA, typeB, feedbackOn)
     {
      this.image = image;
      this.symbolA = new Symbol(image, typeA);
      this.symbolB = new Symbol(image, typeB);
      this.position  = new KPosition(50,50);
      this.position.SetTarget(350, 60);
      this.position.SetSpeed(30);

      this.feedbackOn = feedbackOn;

      this.drawSpacing = 5;

      this.w = Symbol.W+this.drawSpacing*2;
      this.h = Symbol.H*2+this.drawSpacing*4;

      this.selectState = 0;
     }

     
     GetWidth(){return this.w;}
     GetHeight(){return this.h;}
     GetX(){return this.position.GetX();}
     GetY(){return this.position.GetY();}

    // var selectState; // 0 - none
                      // 1 - selected no feedback
                      // 2 - selected- correct
                      // 3 - selected- incorrect

   

    SetSelectState(sState)
     {
      this.selectState = sState;
     }

     Shift(sx, sy)
     {
         this.position.x = this.position.x + sx;
         this.position.y = this.position.y + sy;
     }

     SetAtTarget()
     {
         this.position.x = this.position.targetX;
         this.position.y = this.position.targetY;
     }

     Update()
     {
      this.symbolA.Update();
      this.symbolB.Update();
         this.position.Update();
     }

     PointCollide(px, py)
     {
      if (px >= this.GetX() && px <= this.GetX()+this.GetWidth() && py >= this.GetY() && py <= this.GetY() + this.GetHeight())
      {
       return true;
      }

      return false;
     }




     Draw(dx, dy)
     {

         
      GameEngine.SetColor(0,0,0);
      var spacing = this.drawSpacing;
      if (this.feedbackOn)
      {
          if (this.selectState == 1){GameEngine.SetColor(0,0,1);}
          else if (this.selectState == 2){GameEngine.SetColor(25,194,131);} // correct
          else if (this.selectState == 3){GameEngine.SetColor(234,42,45);} // wrong
      }

      GameDraw.DrawRoundLineBox(dx + this.position.GetX(), this.position.GetY()+dy, this.GetWidth(),this.GetHeight(),0,1,false,false);
     // GameDraw.DrawBox(dx + this.position.GetX(), this.position.GetY()+dy, this.GetWidth(),this.GetHeight());  
      GameEngine.SetColor(235,238,239);
      GameDraw.DrawBox(dx + this.position.GetX(), this.position.GetY()+dy, this.GetWidth(),this.GetHeight());


      // GameEngine.SetColor(1.0,1.0,1.0);
      this.symbolA.Draw(this.position.GetX()+dx+spacing,this.position.GetY()+dy+spacing);
      this.symbolB.Draw(this.position.GetX()+dx+spacing,this.position.GetY()+dy+Symbol.H+spacing*3);
     }

     SetTarget(tx, ty)
     {
      this.position.SetTarget(tx - this.GetWidth()/2,ty - this.GetHeight()/2);
     }


     AtTarget()
     {
      return this.position.AtTarget();
     }



     CopyOne(other) // copy a SymbolPair 
     {
      if (GameEngine.RandomFull()%2 == 0)
      {
       this.symbolA = new Symbol(other.image, other.symbolA.type);
      }
      else {this.symbolB = new Symbol(other.image, other.symbolB.type);}
     }




    }
