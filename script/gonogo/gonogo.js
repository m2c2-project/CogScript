
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("GList.js");
Include("GMap.js");
Include("Trial.js");
Include("ZipReader.js");
Include("gonogo_generate.js");

Include("gonogo_tests.js");



function Init()
{
  curTest = new GNGTestFade();

  SetName(GetName());
 // SetUpdateLastTrial(true);

// must be here because LoadImages() is after GeneratTrials in v1.3. should change for v1.4
 /*imLetterBank = [];
 for (var i = 0; i < 26; i++)
 {
    imLetterBank.push(new GNGImage());
 }


 for (var i = 0; i < 26; i++)
 {
    if (i >= 88-65){continue;}
   goImageBank.Add(imLetterBank[i]);
 }
 noImageBank.Add(imLetterBank[88-65]);
 noImageBank.Add(imLetterBank[89-65]);
 //noImageBank.Add(imLetterBank[90-65]);*/




 imLetterBank = [];
  for (var i = 0; i < 26; i++)
  {
      var letter = "" + String.fromCharCode(65+i);
      imLetterBank[i] = GImage_Create.CreateTextImage(letter,72, true);
      imLetterBank[i].title = letter;
  }

  imCountDown = [];
  for (var i = 0; i < 10; i++)
  {
      imCountDown[i] = GImage_Create.CreateTextImage("" + (i+1), 72, true);
  }


 

}

function GetName()
{
    return cog_resource['name'];
}





// create/load images
function LoadImages()
{
  LogMan.Log("DOLPH_GNG", "start loading images");

  var imButtonStartStr = "Start";
  var imButtonTapStr = "Tap Here";
  var imCorrectStr = "Correct!";
  var imIncorrectStr = "Incorrect!";

 // var buttonColor = new GColor(136,151,160);
 var buttonColor = new GColor(170,181,187);
  var textColor = new GColor(0,0,0);

  // must use this because generate trial set is before LoadImages(). should fix in v1.4
  
  imButtonStart = GImage_Create.CreateButtonSet(imButtonStartStr, 40, true, 200, 100);
  

  imButtonTap = GImage_Create.CreateButtonSet(imButtonTapStr, 40, true, 240, 100, buttonColor, buttonColor, textColor, buttonColor);

  
  imTextPlus = GImage_Create.CreateTextImage("+",50, true);

  
  imCorrect= GImage_Create.CreateTextImage(imCorrectStr,32, true);
 
  imIncorrect = GImage_Create.CreateTextImage(imIncorrectStr,32, true);


  
  imTextReady = GImage_Create.CreateTextImage("Ready",60, true);










        var skipButtonStr = "Skip";
       

        imSkipButton = GImage_Create.CreateButtonSet(skipButtonStr, 22, true, 150, 60, buttonColor, buttonColor, textColor, buttonColor);



     LogMan.Log("DOLPH_GNG", "done loading images");



}





// --------------------------------
// Trial Functions
// --------------------------------

class GNGTrial extends Trial
{   
  
    constructor(params, tnum, image, type, lastTrial, useImages)
    {
        super(params);

        this.num = tnum;
        this.image = image;
        this.type = type;
        this.lastTrial = lastTrial;
        this.useImages = useImages;
     
        // SkipButtonEnabled - not enabled
        // FadeTime - time to fade in the image of the stim (default: 0ms)
        // ShowFullTime - time to show the full stim after it has completely faded in (default: 1000) 
        // FeedbackTime - time to display the feedback text (default: 0ms)
        // AdvanceAfterTap - automatically go to the next trial after the button has been pressed (default: false)
        // ImageVisibiltyRequiredPerc - percentage of the image that must be faded in for the button press to count for this image's trial (default: 40)
        // ButtonShowPress - ms to show the button lit up after a press (default: 50ms)
        // FixationTime - ms to show the fixation image in between trials (default: 0ms)
        // BetweenTrialDelay - ms to show a blank screen between trials (default: 0ms)
        // RequireCorrect - [NOT WORKING, MESSAGE BOX CHANGE NEEDED IN ENGINE] true: requires the response to be correct before moving to the next trial; false: any response continues to the next trial (default: false)
        // 


        this.skipButtonEnabled = params.GetBool("SkipButtonEnabled", false);


        this.FadeTime = params.GetInt("FadeTime", 0);
        this.ShowFullTime = params.GetInt("ShowFullTime", 1000);

        this.FeedbackTime = params.GetInt("FeedbackTime", 0);

        this.AfterTapDelay = 10;//GVars.ReadMapInt(varMap, "AfterTapDelay", 200);
        // only use if AdvanceAfterTap is on


        this.AdvanceAfterTap = params.GetBool("AdvanceAfterTap", false);

        this.ImageVisibilityRequiredPerc = params.GetInt("ImageVisibilityRequiredPerc", 40);


        var buttonShowPress = this.AfterTapDelay;

        if (!this.AdvanceAfterTap)
        {
          this.AfterTapDelay = 0;
          this.buttonShowPress = params.GetInt("ButtonShowPress", 50);
        }


        this.isLastTrial = false;


        this.exportMap = new GMap();


        this.FixationTime = params.GetInt("FixationTime", 0); // no fixation time in fading

        //this.StartDelay = params.GetInt("StartFixationTime", 0);//3000); // not implemented
        //this.ShowStartCountDown = params.GetInt("ShowCountDown", 1); // not implemented


        this.requireCorrect = params.GetBool("RequireCorrect", false);

        this.betweenTrialDelay = params.GetInt("BetweenTrialDelay", 0);






        this.responseTime = -1;
        this.response = 0;

        this.responseAssignCode = "NA";



        this.phase = 0;

        this.failedAttempts = 0;


        
        this.letter = "NA";
        if (!this.useImages)
        {
          // find the matching letter
          for (var i = 0; i < imLetterBank.length; i++)
          {
            if (this.image == imLetterBank[i])
            {
              // add 65 as the starting characte code
              this.letter = String.fromCharCode(65+i);
              
            }
          }
        }

    }

// run at the start of each trial
Start()
{
  
  this.phase = 0;

  this.response = 0;
  this.responseTime = -1;
  this.responseAssignCode = "NA";

  this.letterMoveY = -50;

  this.fixationTrigger = CreateTrigger(this.FixationTime);
  this.fadeTrigger = CreateTrigger(this.FadeTime);
  this.showFullTrigger = CreateTrigger(this.ShowFullTime);
  this.feedbackTrigger = CreateTrigger(this.FeedbackTime);
  this.trialDelayTrigger = CreateTrigger(this.betweenTrialDelay);

  this.holdTime = -1;
// hold time is the time used for RT calc
  if (this.FixationTime <= 0)
  {


    this.phase = 2;
  }

  if (this.betweenTrialDelay > 0)
  {
    this.phase = -2;
  }


  if (this.skipButtonEnabled)
  {
    this.skipButton = new GButton(imSkipButton, GameEngine.GetWidth()-imSkipButton.Get(0).w-10, 10 );
  }

  //var buttonShowPress = this.AfterTapDelay;
  
 // use buttonShowPress for button delay?

  this.tapButton = new GButton(imButtonTap, (GameEngine.GetWidth() - imButtonTap.Get(0).w)/2, GameEngine.GetHeight() - imButtonTap.Get(0).h*2, 100);

  

  this.tapButton.SetPressBorder(100);


  // if the button from the previous trial was pressed, set this trial's button to also be pressed
  // this is to prevent the button tap effect from being turned off when the trial switches
  if (this.lastTrial != null)
  {
    if (this.lastTrial.tapButton.pressed)
    {
      this.tapButton.pressed = true;
      this.tapButton.onPressTime = this.lastTrial.tapButton.onPressTime;
    }
  }

   
}

LoadImages()
{

}





Update()
{
  super.Update();

  // phase -1 is for waiting for the message boxes to end

  if (this.phase == -2) // between trial delay
  {
    this.trialDelayTrigger.TriggerStart();
    if (this.trialDelayTrigger.Check())
    {
      this.phase = 0;

    }
  }

  if (this.phase == 0)
  {
    //this.phase = 2;
    this.fixationTrigger.TriggerStart();
      // fixation phase
      if (this.fixationTrigger.Check())
      {
        this.fadeTrigger.TriggerStart();
        this.phase = 2;
        if (this.fadeTime <= 0)
        { // for a trial that does not fade, skip to "show full" time
            this.phase = 3; 
            this.showFullTrigger.TriggerStart(); 
            this.holdTime = KTime.GetMilliTime();
        }
      }

  }

  else if (this.phase == 2) // fade in time
  {
     if (this.holdTime < 0){this.holdTime = KTime.GetMilliTime();}

     this.fadeTrigger.TriggerStart();
     if (this.fadeTrigger.Check())
     {
      this.phase = 3;
      this.showFullTrigger.TriggerStart();
     }

  }
  else if (this.phase == 3) // show full time (wait for touch)
  {
    this.showFullTrigger.TriggerStart();

    //GameTest_CreateTouch( this.tapButton.kpos.x + 50, this.tapButton.kpos.y + 50);
  
    
      if (this.showFullTrigger.Check())
      {
        //LogMan.Log("DOLPH_GNG", "phase 3 activated:" + this.num);
          if (this.response == 0 && this.type == 1)
          {
           // no response, but it was a Go trial
           if (this.requireCorrect)
           {
          //  LogMan.Log("DOLPH_GNG", "phase 3 require correct");
            this.phase = -1;
            this.failedAttempts++;

              // var msgText = "You must press the button when you see a " + goObjectName[0] + " picture!";

              var msgText = "Incorrect, try again!";

             GameEngine.MessageBox(msgText);

              return;


           }
          }

          if (this.FeedbackTime > 0)
          {
            this.phase = 8; // go to feedback time
          }
          else
          {
            
            this.phase = 4;
          }
      }
  }
  else if (this.phase == 4)
  {
   // showing is complete

   //Game_TakeScreenshot("GNG"); // for DEBUGGING ONLY!

   

   this.SaveExportData();

   if (this.lastTrial != null)
   {
    this.lastTrial.ExportData();
   }
   if (this.isLastTrial)
   {
    this.ExportData();
   }

   this.CallEndTrial(false);

  }

  // feedback phase
  else if (this.phase == 8)
  {
    this.feedbackTrigger.TriggerStart();

    if (this.feedbackTrigger.Check())
    {
      this.phase = 4;
    }

  }

  this.tapButton.Update();


  // continue to update the last trial's button
  if (this.lastTrial != null)
  {
    this.lastTrial.tapButton.Update();

  }

 


  if (this.skipButton != null)
  {
    this.skipButton.Update();
  }



}

Draw()
{
 
  super.Draw();

  if (this.phase == -2)
  {
   // tapButton.Draw();
    return;
  }
  //   GameEngine.SetColor(1,0,0);
  //GameDraw.DrawText("trial:" + (int)(KTime.GetMilliTime()-holdTime), 50, 50);

  GameEngine.ResetColor();
  GameDraw.DrawBox(0,0,GameEngine.GetWidth(), GameEngine.GetHeight());

  if (this.phase == 0)
  {
      GameEngine.SetColor(0,0,0);


      GameDraw.DrawImage(imTextPlus, (GameEngine.GetWidth() - imTextPlus.w)/2, (GameEngine.GetHeight() - imTextPlus.h)/2 + this.letterMoveY );

      GameEngine.ResetColor();

  }
  else if (this.phase >= 1)
  {
      //GameEngine.SetColor(0,0,0);]



     var a = this.GetFadePerc();

      if (a > 1){a = 1;}
      if (a < 0){a = 0;}

      if (this.FixationTime > 0)
      {
         // if there was fixation time, draw the fixation image
         if (this.useImages){GameEngine.SetColor(1,1,1,1-a);}
         else{GameEngine.SetColor(0,0,0,1-a);}
         GameDraw.DrawImage(imTextPlus, (GameEngine.GetWidth() - imTextPlus.w)/2, (GameEngine.GetHeight()- imTextPlus.w)/2 + this.letterMoveY);


      }
      else if (this.lastTrial != null)
      {
        // if a last trial exists, draw its image
          
          if (this.useImages){GameEngine.SetColor(1,1,1,1-a);}
          else{GameEngine.SetColor(0,0,0,1-a);}
          GameDraw.DrawImage(this.lastTrial.image, (GameEngine.GetWidth() - this.lastTrial.image.w)/2, (GameEngine.GetHeight()- this.lastTrial.image.h)/2 + this.letterMoveY);
      }
      else
      {
        // if no last trial exists, draw the default image (blank if no default image)
        if (this.imDefault != null)
        {
          if (this.useImages){GameEngine.SetColor(1,1,1,1-a);}
          else{GameEngine.SetColor(0,0,0,1-a);}
          GameDraw.DrawImage(this.imDefault, (GameEngine.GetWidth() - this.imDefault.w)/2, (GameEngine.GetHeight() - imDefault.h)/2 + this.letterMoveY);
        }
      }

      if (this.useImages){GameEngine.SetColor(1,1,1,a);}
      else{GameEngine.SetColor(0,0,0,a);}
      GameDraw.DrawImage(this.image, (GameEngine.GetWidth() - this.image.w)/2, (GameEngine.GetHeight() - this.image.h)/2 + this.letterMoveY);

      GameEngine.ResetColor();




      this.tapButton.Draw();

      // draw last button so pressing down animation carries over to new trial
      if (this.lastTrial != null && this.lastTrial.tapButton.IsPressed())
      {
        this.lastTrial.tapButton.Draw();
      }
  }


  // feedback phase
  if (this.phase == 8)
  {
      GameEngine.SetColor(0,0,0);

      var imFeedback = imCorrect;

      if (!this.IsResponseCorrect()){imFeedback = imIncorrect;}

      GameDraw.DrawImage(imFeedback, imFeedback.GetCenterX(), (GameEngine.GetHeight() - this.image.h)/2 +  this.image.h + this.letterMoveY + 10);

      GameEngine.ResetColor();

  }

/*
  GameEngine.SetColor(1,0,0);
  GameDraw.DrawText("phase:" + phase, 5,5);
  GameDraw.DrawText("response:" + response, 5,25);
  GameDraw.DrawText("failedAttempts:" + failedAttempts, 5,45);
  GameDraw.DrawText("holdTime:" + holdTime, 5,65);*/


  if (this.skipButton != null)
  {
    this.skipButton.Draw();
  }


}

IsResponseCorrect()
{
  if (this.type == this.response)
  {
    return true;
  }

  return false;

}



GetFadePerc()
{
           if (this.FadeTime <= 0){return 1;}

           if (this.fadeTrigger.GetStartTime() < 0){return 0;}

           var r = (KTime.GetMilliTime() - this.fadeTrigger.GetStartTime())*1.0/this.FadeTime;
           if (r > 1){r = 1;}
           else if (r < 0){r = 0;}
           return r;
 }


 OnClickDown(x,y,clickInfo)
{
  //this.CallEndTrial();
   LogMan.Log("DOLPH_SCRIPT", "touch event in script");

  var tx = x;
  var ty = y;
  
  if (this.phase < 2)
  {
     // if the phase 
    if (this.lastTrial != null)
    {
       this.lastTrial.OnClickDown(x,y,clickInfo);
    }
  }
  else
  {
    if (this.tapButton.CheckPressed(tx,ty) && this.phase >=2 && this.phase < 8)
    {
      this.AssignRT(clickInfo.GetTime());

        // response was given to this trial
        if (this.responseTime >= 0 )
        {

          if (this.AdvanceAfterTap){ this.phase = 4;}

           if (this.response == 1 && this.type == 1)
           {
            
           }
           else
           {
            if (this.requireCorrect && this.response == 1 && this.type == 0)
            {
              this.phase = -1;
              this.failedAttempts++;

            //  var msgText = "Incorrect. You should only press the button when you see " + goObjectName[1] + "!";
            /*var msgText = "Incorrect. You should only press the button when you see " + goObjectName[1] + "!";
              GameEngine.MessageBox(msgText, new KPopup.PopupResponse() {
                  @Override
                  public void OnRespond(String resp)
                  {
                      Start();
                      return;
                  }
              });*/

              var msgText = "Incorrect. Try again.";

              GameEngine.MessageBox(msgText);

              return;
            }
           }


           if (this.FeedbackTime > 0)
           {
            // go to feedback phase
            this.phase = 8;

           }

        }

    }
}

 
}






 //Assigns RT based on given instructions
        /*
        RESPONSE ASSIGNMENT ALGORITHM (also see source of link above):

                ImageN --> image for current trial: currently transitioning in, i.e. becoming more visible
                ImageN-1 --> image for previous trial: currently transitioning out, i.e. becoming less visible

                When participant makes a response...
                IF ImageN > 80% visible THEN assign RT to current trial
                IF ImageN < 40% visible THEN assign RT to previous trial

                IF ImageN >= 40% visible AND ImageN <= 80% visible THEN:
                <1> IF  RT assigned to previous trial, but no RT assigned to current trial, THEN assign RT to current trial ELSE
                <2> IF RT assigned to current trial, but no RT assigned to previous trial, THEN assign RT to previous trial ELSE
                <3> if RT assigned to current and previous trial THEN ignore response.  ELSE
                <4> If RT NOT assigned to current trial and RT NOT assigned to previous trial THEN:
                <<4a>> IF the current trial is a mountain and previous trial is a city THEN assign RT to previous trial ELSE
                <<4b>> IF previous trial is a mountain(NoGo) and current trial is a city(Go) THEN assign RT to current trial ELSE
                <<4c>> IF previous and current trial are both mountain(NoGo) or both city(Go) THEN:
                <<<4c1>>> IF imageN > 60% THEN assign RT to current trial
                <<<4c2>>> IF imageN <= 60% THEN assign RT to previous trial
         */

         // these rules create an odd response time because the current trial must have at least 40% of the image showing before a response can be made
         // this means a response can never be lower than ~400 ms (when the fade time 1000ms) because a response is only accepted when 40% fade is in (ie 400ms)
         AssignRT(clickTime)
         {
            LogMan.Log("DOLPH_GNG", "assign RT");
 
             var rTime = clickTime;
 
 
               var fade  = this.GetFadePerc();
              /* var lastFade = -1;
               if (this.lastTrial != null)
               {
              
                 lastFade = this.lastTrial.GetFadePerc();
               }*/
 
               if (this.FadeTime <= 0)
               {
                   this.SetResponse(rTime, "0");
                   return;
               }
 
 
               var minAlphaReq = this.ImageVisibilityRequiredPerc*1.0/100;
 
      
 
 
               // v# represents the response type given by the algorithm
 
               // check to see which trial we are assigning this tap to
               if (fade > .8 || this.lastTrial == null)
               {
                   // v0
                   this.SetResponse(rTime, "0");
               }
               else if (fade < minAlphaReq)
               {
                   // v0
                   this.lastTrial.SetResponse(rTime, "0");
 
               }
               else if (fade >= minAlphaReq && fade <= .8)
               {
                 if (this.lastTrial.responseTime >= 0 && this.responseTime < 0)
                 {
                  // v1
                  this.SetResponse(rTime, "1");
 
                 }
                 else if (this.responseTime >= 0 && this.lastTrial.responseTime < 0)
                 {
                  //v2
                  this.lastTrial.SetResponse(rTime, "2");
                 }
                 else if (this.responseTime >= 0 && this.lastTrial.responseTime >= 0)
                 {
                  // v3
                  // ignore response
 
                 }
                 else if (this.responseTime < 0 && this.lastTrial.responseTime < 0)
                 {
                   // v 4 (with sub versions)
 
                   if (this.type == 0 && this.lastTrial.type == 1)
                   {
                     // v4a
                     this.lastTrial.SetResponse(rTime, "4a");
                   }
                   else if (this.lastTrial.type == 0 && this.type == 1)
                   {
                      //v4b
                      this.SetResponse(this.rTime, "4b");
                   }
                   else if (this.lastTrial.type == 1 && this.type == 1 || this.lastTrial.type == 0 && this.type == 0)
                   {
                     //v4c
                       if (fade > .6){this.SetResponse(rTime, "4c1");} // v4c1
                       else{this.lastTrial.SetResponse(rTime, "4c2");} // v4c2
 
                   }

                   
 
 
 
 
                 }

                 
 

           }

           LogMan.Log("DOLPH_GNG", "assign RT current:" + this.responseAssignCode);
          if (this.lastTrial != null)
          {
           LogMan.Log("DOLPH_GNG", "assign RT last:" + this.lastTrial.responseAssignCode);
          }
         }
 

         SetResponse(clickTime, assignCode)
         {
 
             if (this.responseTime < 0) // if the response has not yet been assigned
             {
              this.response  = 1;
              this.responseTime = clickTime-this.holdTime;
              this.responseAssignCode = assignCode;
             }
 
 
         }
 
SaveExportData()
{
    // must save values like this before exporting them because the values aren't exported until the next trial is completed. this means that the trigger values will be reset so we must save them before the trial ends.

   /* this.exportMap.Put("targetFixationTime", "" +  this.fixationTrigger.GetTargetTime());
    this.exportMap.Put("actualFixationTime", "" +  this.fixationTrigger.GetActualDisplayTime());

    this.exportMap.Put("targetFadeTime", "" +  this.fadeTrigger.GetTargetTime());
    this.exportMap.Put("actualFadeTime", "" +  this.fadeTrigger.GetActualDisplayTime());

    this.exportMap.Put("targetShowFullTime", "" +  this.showFullTrigger.GetTargetTime());
    this.exportMap.Put("actualShowFullTime", "" +  this.showFullTrigger.GetActualDisplayTime());*/

   
}

ExportData()
{
   

         // correct_response: value that the 'response' should be in order to be correct (0 - no go, 1 - go)
         // response: the actual response. (0 - no go, 1 - go)
         // responseTime: ms time for user response. 
         //                with fade (FadeTime > 0): time measured from start of fading in (image at 0% displayed) to user response time stamp. (see AssignRT algorithm to explain RT assignments for difference fade percentages.)
         //                without fade (FadeTime == 0): time measured from first frame the stim is displayed
         // responseAssignment: assignment code for response. Only applicable for trials with fade. (see AssignRT algorithm to explain RT assignments for difference fade percentages.)
         // stim: identification of stimulus image used for this trial. For letter trials, this value will be a letter. For image trials, this will be the file name of the image.

         for (var i = 0; i < this.exportMap.keyList.GetSize(); i++)
         {
            var key = this.exportMap.keyList.Get(i);
            AddResult(key, this.exportMap.Get(key));
         }


         AddResult("correct_response", "" + this.type);

         AddResult("response", "" + this.response); // 0 - no tap, 1 - tap
     
         AddResult("responseTime", "" + this.responseTime);
     
         AddResult("responseAssignment", "" + this.responseAssignCode);

  
         AddResult("stim", "" + this.image.title);


          PushExportData();


}

}