static class Stim extends Entity
    {



      public Stim(Trial trial, int targetStim)
      {
       super(0,0);
       this.trial = trial;

       active = false;

       r = trial.stimR;

       repulseFactor = trial.stimRepulseFactor;

       selected = false;

       int touchR = (int)(r*trial.stimTouchFactor);

       hitBox = new GBox(-touchR,-touchR,touchR*2, touchR*2);

       position.type = KPosition.TYPE.NONE;

       heading = GameEngine.RandomFull()%360;
       speed = trial.stimSpeed;

       this.targetStim = targetStim;
       if (IsTarget())
       {
            color = trial.targetStimColor;
       }
       else
       {
            color = trial.wrongFeedbackStimColor;
       }
      }


      float speed = 5.0f;

      boolean selected = false;
      void SetSelected(boolean b)
      {
       selected = b;
      }
      void ToggleSelected()
      {
       selected = !selected;
      }
      boolean IsSelected()
      {
       return selected;
      }


      int targetStim; // 1 - is a target stim
                        // 0 - not a target stim

      boolean active;

      void SetActive(boolean b)
      {
       active = b;
      }

      void ToggleActive()
      {
       active = !active;
      }

      boolean IsTarget()
      {
       return targetStim == 1;
      }

      Trial trial;

      float heading;

      int r = 20;

      float repulseFactor = 2; // factor for the other stim to be repulsed by

      public void StartMovement()
      {

       position.velX = (float)(Math.cos(heading)*speed);
       position.velY = (float)(Math.sin(heading)*speed);
      }

      public void EndMovement()
      {
        position.velX = 0;
        position.velY = 0;
      }

      public void OnCollide(Entity e)
      {
      /* float holdVelX = position.velX;
       float holdVelY = position.velY;
       position.velX = e.position.velX;
       position.velY = e.position.velY;
          e.position.velX = holdVelX;
          e.position.velY = holdVelY;*/
      }

      public void Move(GList<Stim> stimList)
      {
       // position.Move(heading, speed);
        position.x = position.x + position.velX;
        position.y = position.y + position.velY;


        float noise = (float)(15 * Math.PI/180);

       float headingRad = (float)(Math.atan2(position.velY, position.velX));



        headingRad = headingRad + GameEngine.Random(0,2) * noise - noise;

          position.velX = (float)(Math.cos(headingRad) * speed);
          position.velY = (float)(Math.sin(headingRad) * speed);



        for (int i = 0; i < stimList.GetSize(); i++)
        {
           if (this == stimList.Get(i)){continue;}



            boolean tooClose = true;
            int timeout = 0;

            float totalRepulse = stimList.Get(i).r*stimList.Get(i).repulseFactor;

            int sign = -1;
            if (GameEngine.RandomFull()%2 == 0)
            {
             sign = 1;
            }




            while(tooClose && timeout < 100)
            {
                timeout++;
              //  if(stimList.Get(i).position.DistTo(position.x + position.velX, position.y + position.velY) <= totalRepulse)



                if (InRepulsionZone(stimList.Get(i), position.velX, position.velY))
                {

                    // update vector direction
                    headingRad = headingRad + (float)(sign * 0.05f * Math.PI);

                    position.velX = (float)(Math.cos(headingRad) * speed);
                    position.velY = (float)(Math.sin(headingRad) * speed);

                }
                else {tooClose=false;}
            }
        }





          // make sure the stim can't go outside the box
          if (position.x < trial.boxX + r)
          {
              position.x = trial.boxX + r;
              position.velX = Math.abs(position.velX);
          }
          else if (position.x > trial.boxX + trial.boxW - r)
          {
              position.x = trial.boxX + trial.boxW - r;
              position.velX = -Math.abs(position.velX);
          }

          if (position.y < trial.boxY + r)
          {
              position.y = trial.boxY + r;
              position.velY = Math.abs(position.velY);
          }
          else if (position.y > trial.boxY + trial.boxH - r)
          {
              position.y = trial.boxY + trial.boxH - r;
              position.velY = -Math.abs(position.velY);
          }


          heading = (float)(Math.atan2(position.velY, position.velX));



      }


      public boolean InRepulsionZone(Stim other)
      {
       return InRepulsionZone(other, 0,0);
      }

      public boolean InRepulsionZone(Stim other, float modX, float modY)
      {
        float x = position.x + modX;
        float y = position.y + modY;
        float r = this.r*repulseFactor;

        float x2 = other.position.x;
        float y2 = other.position.y;
        float r2 = other.r * other.repulseFactor;

        return (x2-x)*(x2-x) + (y2-y)*(y2-y) <= (r+r2)*(r+r2);
      }

      @Override
      public void Update()
      {
       super.Update();



      }




      public void Draw()
      {
        GameEngine.SetColor(color);

          float p = 1.0f; // val to scale the circle by

        if (!active)
        {
          GameEngine.SetColor(trial.inactiveColor);
            if (IsSelected())
            {
                GameEngine.SetColor(trial.stimSelectColor);
            }
        }
        else
        {

            // if both selected and active, draw a selected circle on the outer perimeter
            if (IsSelected() && trial.showAllFeedbackValues)
            {
                GameEngine.SetColor(trial.feedbackOutlineColor);
                p=1.2f;
                GameDraw.DrawCircleCenter(position.x, position.y, r*2*p,r*2*p, 0, 1, false);
            }



         // activated shows true color
         if (IsTarget())
         {
          // if its a target, show the target color
           GameEngine.SetColor(trial.targetStimColor);
         }
         else
         {
           // if it is not a target, show the wrong selection color
           GameEngine.SetColor(trial.wrongFeedbackStimColor);
         }





        }







        GameDraw.DrawCircleCenter(position.x, position.y, r*2,r*2, 0, 1, false);
        if (trial.debug_showRepulseFactor)
        {
          GameEngine.SetColor(0,0,1,.3f);
          GameDraw.DrawCircleCenter(position.x, position.y, r*2*repulseFactor,r*2*repulseFactor, 0, 1, false);
        }
        GameEngine.ResetColor();
      }





      String ExportData(int index)
      {
        return "" + index + "_" + ((int)position.x) + "_" + ((int)position.y) + "_" + targetStim;

      }

    }
