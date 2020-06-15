

Include("KPosition.js"); 



// @Deprecated
class GLStimuli
{


 

        constructor(simage, sx, sy, stype)
        {
           

            this.on = false;

            this.boxThickness = 5;
            this.boxW = 125;
            this.boxH = 125;


            this.color = new GColor(1,1,1);
            this.bkgColor = new GColor(0,0,0);

            this.image = simage;
            this.state = GLStimuli.State_NONE;

            this.w = this.boxW;
            this.h = this.boxH;

           /* if (image != null)
            {
             w = image.w;
             h = image.h;
            }*/


            this.hitBox = new GBox(0,0,this.w,this.h);

            this.drawTop = true;
            this.drawBottom = true;
            this.drawLeft = true;
            this.drawRight = true;

            this.hideBackground = false;

            this.drawButtonImage = false;

     

            this.autoExpand = false;

            this.followTarget = false;

            this.type = stype;
            this.text = "";

            this.kpos = new KPosition(sx ,sy);
            this.kpos.speed = 20;




            if (this.type == GLStimuli.Type_IMAGE)
            {
                this.sprite = new Sprite(this.image);
            }


        }

        SetColor(scolor, sbkgColor)
        {
            this.color = scolor;
            this.bkgColor = sbkgColor;
        }

        SetText(sText)
        {
            this.text = new String(sText);
        }

        getText()
        {
            return this.text;
        }

        GetState()
        {
            return this.state;
        }

        SetHitBox(x, y, w, h)
        {
            this.hitBox = new GBox(x,y,w,h);
        }

        Update()
        {
            if (this.autoExpand)
            {
                if (this.w < this.boxW)
                {
                    this.w = this.w + 10;
                }
                if (h < boxH)
                {
                    this.h = this.h + 10;
                }
            }
        
            this.kpos.Update();


        }

        Draw()
        {

            if (!this.drawButtonImage && !this.hideBackground) // invisible background
            {

                if (this.state == GLStimuli.State_NONE)
                {
                    GameEngine.SetColor(this.color);
                }
                else if (this.state == GLStimuli.State_CENTER || !this.DrawFeedback)
                {
                    GameEngine.SetColor(0, 0, 255);
                }
                else if (this.state == GLStimuli.State_CORRECT)
                {
                    GameEngine.SetColor(0, 255, 0);
                }
                else if (this.state == GLStimuli.State_WRONG)
                {
                    GameEngine.SetColor(255, 0, 0);
                }

                //GameDraw.DrawBox(x + (boxW - w) / 2, y + (boxH - h) / 2, w, h); // draw
                // outline

                // draw outline

                if (this.drawTop){
                    GameDraw.DrawBox(this.kpos.x , this.kpos.y , this.w, this.boxThickness);}
                if (this.drawLeft){GameDraw.DrawBox(this.kpos.x , this.kpos.y , this.boxThickness, this.h);}
                if (this.drawBottom){GameDraw.DrawBox(this.kpos.x , this.kpos.y + this.h, this.w + this.boxThickness, this.boxThickness);}
                if (this.drawRight){GameDraw.DrawBox(this.kpos.x + this.w , this.kpos.y , this.boxThickness, this.h);}

                GameEngine.SetColor(this.bkgColor);

                if ((this.type == GLStimuli.Type_FULLCOLOR) && this.on)
                {
                    if (this.state == GLStimuli.State_CORRECT)
                    {
                        GameEngine.SetColor(0, 255, 0);
                    }
                    else if (this.state == GLStimuli.State_WRONG)
                    {
                        GameEngine.SetColor(0, 0, 255);
                    }
                    else
                    {
                        GameEngine.SetColor(255, 0, 0);
                    }

                    GameDraw.DrawBox(this.kpos.x + this.boxThickness + this.boxThickness/2, this.kpos.y + this.boxThickness + this.boxThickness/2, 
                        this.w - this.boxThickness*2 + this.boxThickness/2, this.h - this.boxThickness*2 + this.boxThickness/2); // draw inner
                }

                if (this.type == GLStimuli.Type_DOT && this.on)
                {

                    GameEngine.SetColor(0,0,0);
                    var borderSize = 3;
                    GameDraw.DrawCircleCenter(this.kpos.x+this.w/2+this.boxThickness/2 , this.kpos.y+this.h/2+this.boxThickness/2 , 
                                                this.w*3/4+borderSize, this.h*3/4+borderSize, 0,1,false); // draw outer

                    if (this.state == GLStimuli.State_CORRECT)
                    {
                        GameEngine.SetColor(0, 255, 0);
                    }
                    else if (this.state == GLStimuli.State_WRONG)
                    {
                        GameEngine.SetColor(0, 0, 255);
                    }
                    else
                    {

                        GameEngine.SetColor(234,42,45);
                    }

                    GameDraw.DrawCircleCenter(this.kpos.x+this.w/2+this.boxThickness/2 , this.kpos.y+this.h/2+this.boxThickness/2 , this.w*3/4, this.h*3/4, 0,1,false); // draw inner

                 //   float ovalSize = 3*1.0f/4;
                   // GameDraw.DrawCircle((int)(x+(w-w*ovalSize)/2), (int)(y+(h-h*ovalSize)/2), (int)(w*ovalSize), (int)(h*ovalSize),0,1,false);


               /* GameEngine.SetColor(0,1,0);
                GameDraw.DrawBox((int)(x+w/2), (int)(y), 2, h,0,1,false);
                GameDraw.DrawBox((int)(x), (int)(y+h/2), w, 2,0,1,false);*/
                }


                // if (type == Type_FRIBBLE){GameEngine.SetColor(255, 255, 255);}


                GameEngine.SetColor(this.color);

                if (this.type == GLStimuli.Type_FULLCOLOR && this.on)
                {
                    GameEngine.SetColor(this.bkgColor);
                }
            }
            else if (this.drawButtonImage) // button image background
            {
                GameEngine.SetColor(this.color);
                GameDraw.DrawImage(this.imButton, this.kpos.x, this.kpos.y, 0, 1.0);
                GameEngine.SetColor(0, 0, 0);
            }

            if (this.type == GLStimuli.Type_TEXT || this.type == GLStimuli.Type_FULLCOLOR)
            {
                //   GameEngine.SetTextLocation(GameEngine.TEXTLOC.CENTER);
                var textSize = this.boxH - 30;
                //  GameEngine.SetTextSize(textSize); // 70
                if (this.on)
                {
                    GameDraw.DrawText(this.text, kpos.x + w/2, kpos.y + h / 2
                            - GameEngine.GetTextSize()/2, true);
                }
                // GameEngine.ResetTextLocation();
            }
            else if ((this.type == GLStimuli.Type_IMAGE ) && this.text != "") // only
            // draw
            // image
            // if
            // there
            // is
            // text
            {

                return;
                var border = this.boxThickness;//7; // border around box from image
                this.sprite.x = this.kpos.x + border;
                this.sprite.y = this.kpos.y + border;




                {


                    //sprite.scale = (boxW - border) * 1.0f / (sprite.frameW);
                    this.sprite.drawW = this.w;
                    this.sprite.drawH = this.h;
                    var frame = (ToInt(this.text)) % (this.sprite.image.w / this.sprite.frameW);
                    this.sprite.curFrame = frame;
                    this.sprite.curLayer = (ToInt(this.text)) / (this.sprite.image.w / this.sprite.frameW);
                }


                if (this.on)
                {
                    GameEngine.SetColor(this.color);
                    this.sprite.Draw();
                }
                // GameEngine.DrawBox(x + 10, y + 10, w - 20, h - 20);
            }
            else if (this.type == GLStimuli.Type_IMAGE)
            {
                this.sprite.x = this.kpos.x + (this.boxW - this.w) / 2;
                this.sprite.y = this.kpos.y + (this.boxH - this.h) / 2;
                var border = 0;
               // sprite.scale = (w - border * 2) * 1.0f / (sprite.frameW);
               this.sprite.drawW = this.w;
               this.sprite.drawH = this.h;


               // LogMan.Log("DOLPH_DOTMEM", "frameW:"+sprite.frameW);

                if (this.on)
                {
                    GameEngine.SetColor(this.color);
                    this.sprite.Draw();
                }
            }

            GameEngine.ResetColor();
        }

        SetImage(simage)
        {
            this.image = simage;
            this.sprite = new Sprite(this.image);
        }

        pointCollide(px, py)
        {
            return (px >= this.kpos.x + this.hitBox.x && px <= this.kpos.x + this.hitBox.x + this.hitBox.w && py >= this.kpos.y + this.hitBox.y 
                           && py <= this.kpos.y + this.hitBox.y + this.hitBox.h );
        }

        Toggle()
        {
            if (this.on)
            {
                this.Deactivate();
            }
            else
            {
                this.Activate();
            }
        }

        Activate()
        {
            this.on = true;
        }

        Deactivate()
        {
            this.on = false;
        }

        isOn()
        {
            return this.on;
        }

         SetState(s)
        {
            this.state = s;
        }

        SetTarget(sx, sy)
        {
            this.kpos.SetTarget(sx,sy);
            this.followTarget = true;
        }

        AtTarget()
        {
            //return kpos.x == targetX && kpos.y == targetY;
            return this.kpos.AtTarget();
        }

    }



    GLStimuli.State_NONE = 0;
    GLStimuli.State_CENTER = 1;
    GLStimuli.State_CORRECT = 2;
    GLStimuli.State_WRONG = 3;

    GLStimuli.Type_TEXT = 0;
    GLStimuli.Type_IMAGE = 1;
    GLStimuli.Type_FULLCOLOR = 2;
    GLStimuli.Type_DOT = 3;



    class Pair
    {
        constructor(sx, sy)
        {
            this.x = sx;
            this.y = sy;
        }

     

    }

