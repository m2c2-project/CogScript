 Color = [new GColor(0,0,0),new GColor(0,158,115),new GColor(240,228,66), new GColor(0,114,178), new GColor(213,94,0), new GColor(204,121,167)];
 TOTAL_COLORS = 6;

    class Dot
    {
     constructor(sColor, DotRadius)
     {
      this.x = 50;
      this.y = 50;
      this.r = DotRadius;

      this.lockBox = true;


      this.colorBkg = new GColor(1,1,1);


         

      this.color = sColor;
     }

     //boolean lockBox; // true when the location is locked into the box's location


      Update()
     {

     }

     Draw(noColor = false)
     {



         var borderSize = 3;

         GameEngine.SetColor(0,0,0);

         var drawX = this.x;
         var drawY = this.y;
         if (this.lockBox)
         {
          drawX = drawX + boxX;
          drawY = drawY + boxY;
         }


         GameDraw.DrawCircleCenter(drawX , drawY , this.r*2+borderSize, this.r*2+borderSize, 0,1,false); // draw outer

         if (!noColor && this.color > -1)
         {
          GameEngine.SetColor(Color[this.color]);
         }
         else
         {
          GameEngine.SetColor(this.colorBkg);
         }
          GameDraw.DrawCircleCenter(drawX , drawY , this.r*2, this.r*2, 0,1,false); // draw inner


         GameEngine.ResetColor();
     }

     PointCollide(tx, ty)
     {
         var drawX = this.x;
         var drawY = this.y;
         if (this.lockBox)
         {
             drawX = drawX + boxX;
             drawY = drawY + boxY;
         }

         var xDist = (drawX - tx)*(drawX - tx);
         var yDist = (drawY - ty)*(drawY - ty);
         var dist =  Math.sqrt(xDist+yDist);


         return dist <= this.r;


     }

  



    }




    /////////////
    // DOT PANEL
    /////////////



    
    // panel for displaying dot selections
    class DotPanel
    {

     

     constructor(sx,sy,dotRadius)
     {



         this.x = sx;
         this.y = sy;

         this.DotRadius = dotRadius;

         this.spacingX = 20;
        this.spacingY = 20;

    
         this.thickness = 4;

         this.dotList = new GList();
         for (var i = 0; i < TOTAL_COLORS; i++)
         {
             this.dotList.Add(new Dot(i, dotRadius));
         }

         this.targetW = this.spacingX*(TOTAL_COLORS+1) + this.DotRadius*2*TOTAL_COLORS;
         this.targetH = this.spacingY*2 + this.DotRadius*2;
         this.w = 1;
         this.h = 1;

         this.openSpeed = 20.0;

         this.selected = -1;

        this.totalPicks = 0;

     }




     IsOpened()
     {
      return this.w == this.targetW && this.h == this.targetH;
     }


     Update()
     {
      if (!this.IsOpened())
      {
       if (this.w < this.targetW)
       {
           if (Math.abs(this.targetW - this.w) <= this.openSpeed){this.w = this.targetW;}
           else if (this.w < this.targetW) {this.w = this.w + this.openSpeed;}
       }
       else {this.w = this.targetW;}

       if (this.h < this.targetH)
       {
           if (Math.abs(this.targetH - this.h) <= this.openSpeed){this.h = this.targetH;}
           else if (this.h < this.targetW) {this.h = this.h + this.openSpeed;}
       }
       else {this.h = this.targetH;}
      }

     }

     Draw()
     {
      GameEngine.SetColor(0,0,0);

         GameDraw.DrawBox(this.x - this.w/2, this.y - this.h/2, this.w, this.thickness);
         GameDraw.DrawBox(this.x - this.w/2, this.y - this.h/2, this.thickness,this.h);
         GameDraw.DrawBox(this.x - this.w/2, this.y - this.h/2 + this.h - this.thickness, this.w, this.thickness);
         GameDraw.DrawBox(this.x - this.w/2 + this.w - this.thickness, this.y - this.h/2, this.thickness, this.h);


       GameEngine.ResetColor();

      if (this.IsOpened())
      {
       for (var i = 0; i < this.dotList.GetSize(); i++)
       {
        this.dotList.Get(i).lockBox = false;
        this.dotList.Get(i).x = this.x - this.w/2 + this.spacingX*(i+1) + this.DotRadius*2*i + this.DotRadius;
        this.dotList.Get(i).y = this.y - this.h/2 + this.spacingY + this.DotRadius;
        this.dotList.Get(i).Draw();
       }
      }

     }



     OnTouch(tx, ty)
     {
      for (var i = 0; i < this.dotList.GetSize(); i++)
      {
       if (this.dotList.Get(i).PointCollide(tx, ty))
       {
         this.selected = i;
         this.totalPicks++;
         return;
       }


      }
     }


     GetSelected()
     {
      return this.selected;
     }




    }

