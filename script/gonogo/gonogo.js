
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("GList.js");
Include("Trial.js");
Include("gonogo_generate.js");

class GNGImage
{
   constructor()
   {
     this.image = null;
   }
}

function Init()
{
  SetName(GetName());
 // SetUpdateLastTrial(true);

 goImageBank = new GList();
 noImageBank = new GList();


// must be here because LoadImages() is after GeneratTrials in v1.3. should change for v1.4
 imLetterBank = [];
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
 //noImageBank.Add(imLetterBank[90-65]);

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

  // must use this because generate trial set is before LoadImages(). should fix in v1.4
  
  imButtonStart = GImage_Create.CreateButtonSet(imButtonStartStr, 40, true, 200, 100);
  

  imButtonTap = GImage_Create.CreateButtonSet(imButtonTapStr, 40, true, 240, 100);

  
  imTextPlus = GImage_Create.CreateTextImage("+",50, true);

  
  imCorrect= GImage_Create.CreateTextImage(imCorrectStr,32, true);
 
  imIncorrect = GImage_Create.CreateTextImage(imIncorrectStr,32, true);


  
  imTextReady = GImage_Create.CreateTextImage("Ready",60, true);



  for (var i = 0; i < 26; i++)
  {
      imLetterBank[i].image = GImage_Create.CreateTextImage("" + String.fromCharCode(65+i),72, true);
    
     //imLetterBank[i].image = GImage_Create.CreateTextImage("A",72, true);
  }

  imCountDown = [];
  for (var i = 0; i < 10; i++)
  {
      imCountDown[i] = GImage_Create.CreateTextImage("" + (i+1), 72, true);
   
  }











 // to do later: load images from zip file
 // load images in first trial? to allow different image sets at different trial sets.
 // image loader trial?

  /*zipReader.Open();

  var defFilename = fileheaderDefault + ".png";
  InputStream defIS = zipReader.GetFile(defFilename);

  if (defIS != null)
  {
    imDefault = new GImage(defIS);
    imDefault.LoadData();
    imDefault.SetFilename(defFilename);
  }

  GList<String> fileList = zipReader.GetFileList();


  // load Go images
  for (int i = 1; i < 100; i++)
  {
    String fn = fileheaderGo + i + ".png";
    InputStream is = zipReader.GetFile(fn);
    if (is == null){break;}
    goImageBank.Add(new GImage(is));
    goImageBank.GetLast().LoadData();
    goImageBank.GetLast().SetFilename(fn);
  }

  // load no go images
  for (int i = 1; i < 100; i++)
  {
      String fn = fileheaderNoGo + i + ".png";
      InputStream is = zipReader.GetFile(fn);
      if (is == null){break;}
      noImageBank.Add(new GImage(is));
      noImageBank.GetLast().LoadData();
      noImageBank.GetLast().SetFilename(fn);
  }

  zipReader.Close();

*/

        var skipButtonStr = "Skip";
       

        imSkipButton = GImage_Create.CreateButtonSet(skipButtonStr, 22, true, 150, 60);



     LogMan.Log("DOLPH_GNG", "done loading images");



}





// --------------------------------
// Trial Functions
// --------------------------------

class GNGTrial extends Trial
{   
  
    constructor(params, tnum, image, type, lastTrial)
    {
        super(params);

        this.num = tnum;
        this.gngimage = image;
        this.type = type;
        this.lastTrial = lastTrial;



        this.skipButtonEnabled = params.GetBool("SkipButtonEnabled", false);


        this.FadeTime = params.GetInt("FadeTime", 1000);
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





        this.FixationTime = params.GetInt("StimFixTime", 0); // no fixation time in fading

        this.StartDelay = params.GetInt("StartFixTime", 0);//3000);
        this.ShowStartCountDown = params.GetInt("ShowCountDown", 1);


        this.requireCorrect = params.GetBool("RequireCorrect", false);

        this.betweenTrialDelay = params.GetInt("BetweenTrialDelay", 0);






        this.responseTime = -1;
        this.response = 0;

        this.responseAssignCode = "NA";






   



        this.phase = 0;

        this.failedAttempts = 0;

    }

// run at the start of each trial
Start()
{
   this.image = this.gngimage.image;
  this.phase = 0;

  this.response = 0;
  this.responseTime = -1;
  this.responseAssignCode = "NA";

  this.letterMoveY = -50;


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

  this.tapButton.SetPressBorder(40);


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

  if (this.phase == -2) // between trial delay
  {
    this.trialDelayTrigger.TriggerStart();
    if (this.trialDelayTrigger.Check())
    {
      this.phase = 2;

    }
  }

  if (this.phase == 0)
  {
    this.phase = 2;

      // fixation phase
      if (KTime.GetMilliTime() - this.holdTime >= this.FixationTime)
      {
        this.fadeTrigger.TriggerStart();
        this.phase = 2;
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
  else if (this.phase == 3) // show full time
  {
      if (this.showFullTrigger.Check())
      {
          if (this.response == 0 && this.type == 1)
          {
           // no response, but it was a Go trial
           if (this.requireCorrect)
           {
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

   if (this.lastTrial != null)
   {
    this.lastTrial.ExportData();
   }
   if (this.isLastTrial)
   {
    this.ExportData();
   }
   this.CallEndTrial();

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

  GameEngine.SetColor(0,0,0);
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


      if (this.lastTrial != null)
      {
        // if a last trial exists, draw its image
          GameEngine.SetColor(1,1,1,1-a);
          GameDraw.DrawImage(this.lastTrial.image, (GameEngine.GetWidth() - this.lastTrial.image.w)/2, (GameEngine.GetHeight()- this.lastTrial.image.h)/2 + this.letterMoveY);
      }
      else
      {
        // if no last trial exists, draw the default image (blank if no default image)
        if (this.imDefault != null)
        {
          GameEngine.SetColor(1,1,1,1-a);
          GameDraw.DrawImage(this.imDefault, (GameEngine.GetWidth() - this.imDefault.w)/2, (GameEngine.GetHeight() - imDefault.h)/2 + this.letterMoveY);
        }
      }

      GameEngine.SetColor(1,1,1,a);
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

  var tx = x;
  var ty = y;

  {
    if (this.tapButton.CheckPressed(tx,ty))
    {
      this.AssignRT(clickInfo.GetTime());

        // response was given to this trial
        if (this.responseTime >= 0)
        {
           if (this.response == 1 && this.type == 1)
           {
            if (this.AdvanceAfterTap){ this.phase = 4;}
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
 
 
             var rTime = clickTime;
 
 
               var fade  = this.GetFadePerc();
               var lastFade = -1;
               if (this.lastTrial != null)
               {
                 lastFade = this.lastTrial.GetFadePerc();
               }
 
               if (this.FadeTime <= 0)
               {
                   this.SetResponse(rTime, "0");
                   return;
               }
 
 
               var minAlphaReq = this.ImageVisibilityRequiredPerc*1.0/100;
 
 
 
 
               // v# represents the response type given by the algorithm
 
               // check to see which trial we are assigning this tap to
               if (this.GetFadePerc() > .8 || this.lastTrial == null)
               {
                   // v0
                   this.SetResponse(rTime, "0");
               }
               else if (this.GetFadePerc() < minAlphaReq)
               {
                   // v0
                   this.lastTrial.SetResponse(rTime, "0");
 
               }
               else if (this.fade >= minAlphaReq && fade <= .8)
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
 


ExportData()
{
   
          //  AddResult("trial_type", "" + strType);




        // must export either image or letter depending on the stim type

          //AddResult("image", "" +  image.GetFilename());

          AddResult("targetFadeTime", "" +  this.fadeTrigger.GetTargetTime());
          AddResult("actualFadeTime", "" +  this.fadeTrigger.GetActualDisplayTime());

          AddResult("targetFullShowTime", "" +  this.showFullTrigger.GetTargetTime());
          AddResult("actualFullShowTime", "" +  this.showFullTrigger.GetActualDisplayTime());

          AddResult("correct_response", "" + this.type);

          AddResult("response", "" + this.response); // 0 - no tap, 1 - tap

          AddResult("responseTime", "" + this.responseTime);

          AddResult("responseAssignment", "" + this.responseAssignCode);


}

}