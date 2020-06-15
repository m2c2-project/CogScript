 Include("Entity.js");
 
 
 class Stim extends Entity
    {



      constructor(trial, targetStim)
      {
       super(0,0);
       this.trial = trial;

       this.active = false;

       this.r = trial.stimR;

       this.repulseFactor = trial.stimRepulseFactor;

       this.selected = false;

       var touchR = Math.floor(this.r*this.trial.stimTouchFactor);

       this.hitBox = new GBox(-touchR,-touchR,touchR*2, touchR*2);

       this.position.type = KPosition.TYPE.NONE;

       this.heading = GameEngine.RandomFull()%360;
       this.speed = trial.stimSpeed;

       this.targetStim = targetStim;
       if (this.IsTarget())
       {
        this.color = trial.targetStimColor;
       }
       else
       {
        this.color = trial.wrongFeedbackStimColor;
       }
      }


     

      SetSelected(b)
      {
       this.selected = b;
      }
      ToggleSelected()
      {
        this.selected = !this.selected;
      }
      IsSelected()
      {
       return this.selected;
      }


      //int targetStim; // 1 - is a target stim
                        // 0 - not a target stim

     

      SetActive(b)
      {
        this.active = b;
      }

      ToggleActive()
      {
        this.active = !this.active;
      }

      IsTarget()
      {
       return this.targetStim == 1;
      }

      

      //float repulseFactor = 2; // factor for the other stim to be repulsed by

      StartMovement()
      {

        this.position.velX = (Math.cos(this.heading)*this.speed);
        this.position.velY = (Math.sin(this.heading)*this.speed);
      }

      EndMovement()
      {
        this.position.velX = 0;
        this.position.velY = 0;
      }

     

      Move(stimList)
      {
       // position.Move(heading, speed);
        this.position.x = this.position.x + this.position.velX;
        this.position.y = this.position.y + this.position.velY;


        var noise = (15.0 * Math.PI/180);

       var headingRad = (Math.atan2(this.position.velY, this.position.velX));



        headingRad = headingRad + GameEngine.Random(0,2) * noise - noise;

        this.position.velX = (Math.cos(headingRad) * this.speed);
        this.position.velY = (Math.sin(headingRad) * this.speed);



        for (var i = 0; i < stimList.GetSize(); i++)
        {
           if (this == stimList.Get(i)){continue;}



            var tooClose = true;
            var timeout = 0;

            var totalRepulse = stimList.Get(i).r*stimList.Get(i).repulseFactor;

            var sign = -1;
            if (GameEngine.RandomFull()%2 == 0)
            {
             sign = 1;
            }




            while(tooClose && timeout < 100)
            {
                timeout++;
              //  if(stimList.Get(i).position.DistTo(position.x + position.velX, position.y + position.velY) <= totalRepulse)



                if (this.InRepulsionZone(stimList.Get(i), this.position.velX, this.position.velY))
                {

                    // update vector direction
                    headingRad = headingRad + (sign * 0.05 * Math.PI);

                    this.position.velX = (Math.cos(headingRad) * this.speed);
                    this.position.velY = (Math.sin(headingRad) * this.speed);

                }
                else {tooClose=false;}
            }
        }





          // make sure the stim can't go outside the box
          if (this.position.x < this.trial.boxX + this.r)
          {
            this.position.x = this.trial.boxX + this.r;
            this.position.velX = Math.abs(this.position.velX);
          }
          else if (this.position.x > this.trial.boxX + this.trial.boxW - this.r)
          {
            this.position.x = this.trial.boxX + this.trial.boxW - this.r;
            this.position.velX = -Math.abs(this.position.velX);
          }

          if (this.position.y < this.trial.boxY + this.r)
          {
            this.position.y = this.trial.boxY + this.r;
            this.position.velY = Math.abs(this.position.velY);
          }
          else if (this.position.y > this.trial.boxY + this.trial.boxH - this.r)
          {
            this.position.y = this.trial.boxY + this.trial.boxH - this.r;
            this.position.velY = -Math.abs(this.position.velY);
          }


          this.heading = (Math.atan2(this.position.velY, this.position.velX));



      }


      

      InRepulsionZone(other, modX = 0, modY = 0)
      {
        var x = this.position.x + modX;
        var y = this.position.y + modY;
        var r = this.r*this.repulseFactor;

        var x2 = other.position.x;
        var y2 = other.position.y;
        var r2 = other.r * other.repulseFactor;

        return (x2-x)*(x2-x) + (y2-y)*(y2-y) <= (r+r2)*(r+r2);
      }

    




      Draw()
      {
        GameEngine.SetColor(this.color);

          var p = 1.0; // val to scale the circle by

        if (!this.active)
        {
          GameEngine.SetColor(this.trial.inactiveColor);
            if (this.IsSelected())
            {
                GameEngine.SetColor(this.trial.stimSelectColor);
            }
        }
        else
        {

            // if both selected and active, draw a selected circle on the outer perimeter
            if (this.IsSelected() && this.trial.showAllFeedbackValues)
            {
                GameEngine.SetColor(this.trial.feedbackOutlineColor);
                p=1.2;
                GameDraw.DrawCircleCenter(this.position.x, this.position.y, this.r*2*p,this.r*2*p, 0, 1, false);
            }



         // activated shows true color
         if (this.IsTarget())
         {
          // if its a target, show the target color
           GameEngine.SetColor(this.trial.targetStimColor);
         }
         else
         {
           // if it is not a target, show the wrong selection color
           GameEngine.SetColor(this.trial.wrongFeedbackStimColor);
         }





        }







        GameDraw.DrawCircleCenter(this.position.x, this.position.y, this.r*2,this.r*2, 0, 1, false);
        if (this.trial.debug_showRepulseFactor)
        {
          GameEngine.SetColor(0,0,1,.3);
          GameDraw.DrawCircleCenter(this.position.x, this.position.y, this.r*2*this.repulseFactor,this.r*2*this.repulseFactor, 0, 1, false);
        }
        GameEngine.ResetColor();
      }




      ExportData(index)
      {
        return "" + index + "_" + Math.floor(this.position.x) + "_" + Math.floor(this.position.y) + "_" + this.targetStim;

      }

    }
