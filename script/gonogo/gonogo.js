
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("GList.js");
Include("Trial.js");


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



 imLetterBank = [];
 for (var i = 0; i < 26; i++)
 {
    imLetterBank.push(new GNGImage());
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

  // must use this because generate trial set is before LoadImages(). should fix in v1.4
  
  imButtonStart = GImage_Create.CreateButtonSet(imButtonStartStr, 40, true, 200, 100);
  

  imButtonTap = GImage_Create.CreateButtonSet(imButtonTapStr, 40, true, 240, 100);

  
  imTextPlus = GImage_Create.CreateTextImage("+",50, true);

  
  imCorrect= GImage_Create.CreateTextImage(imCorrectStr,32, true);
 
  imIncorrect = GImage_Create.CreateTextImage(imIncorrectStr,32, true);


  
  imTextReady = GImage_Create.CreateTextImage("Ready",60, true);



  for (var i = 0; i < 26; i++)
  {
    //  imLetterBank[i] = GImage_Create.CreateTextImage("" + String.fromCharCode(65+i),72, true);
    
     imLetterBank[i].image = GImage_Create.CreateTextImage("A",72, true);
  }

  imCountDown = [];
  for (var i = 0; i < 10; i++)
  {
      imCountDown[i] = GImage_Create.CreateTextImage("" + (i+1), 72, true);
   
  }








 
  goImageBank.Add(imLetterBank[0]);
  noImageBank.Add(imLetterBank[1]);


 // to do later: load images from zip file
 // load images in first trial? to allow different image sets at different trial sets.
 // image loader trial?
/*
  zipReader.Open();

  String defFilename = fileheaderDefault + ".png";
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


function GenerateTrialSet()
{


  var params = CopyParams();

  

 for (var i = 0; i < 3; i++)
 {
  var lastTrial = null;
  lastTrial = new GNGTrial(params, i, imLetterBank[0], 1, lastTrial);
  AddTrial(lastTrial);
 }
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

  var buttonShowPress = this.AfterTapDelay;

  this.tapButton = new GButton(imButtonTap, (GameEngine.GetWidth() - imButtonTap.Get(0).w)/2, GameEngine.GetWidth() - imButtonTap.Get(0).h*2, buttonShowPress);

  this.tapButton.SetPressBorder(40);

   
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
   this.complete = true;

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


      GameDraw.DrawImage(imTextPlus, (GameEngine.GetWidth() - imTextPlus.w)/2, (GameEngine.GetWidth() - imTextPlus.h)/2 + this.letterMoveY );

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
          GameDraw.DrawImage(this.lastTrial.image, (GameEngine.GetWidth() - this.image.w)/2, (GameEngine.GetWidth()- this.image.h)/2 + this.letterMoveY);
      }
      else
      {
        // if no last trial exists, draw the default image (blank if no default image)
        if (this.imDefault != null)
        {
          GameEngine.SetColor(1,1,1,1-a);
          GameDraw.DrawImage(this.imDefault, (GameEngine.GetWidth() - this.imDefault.w)/2, (GameEngine.GetWidth() - imDefault.h)/2 + this.letterMoveY);
        }
      }

      GameEngine.SetColor(1,1,1,a);
      GameDraw.DrawImage(this.image, (GameEngine.GetWidth() - this.image.w)/2, (GameEngine.GetWidth() - this.image.h)/2 + this.letterMoveY);

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

      GameDraw.DrawImage(imFeedback, imFeedback.GetCenterX(), (GameEngine.GetWidth() - this.image.h)/2 +  this.image.h + this.letterMoveY + 10);

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


 OnClickDown(x,y,clickTime)
{
  this.CallEndTrial();

 
}

OnClickUp(x,y,clickTime)
{

}

OnClickMove(x,y,clickTime)
{

}


 


ExportData()
{
   
          //  AddResult("trial_type", "" + strType);
 
}

}