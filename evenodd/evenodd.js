
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");


// to be created. only run once at the very start of the cog task
function Init()
{
  SetName("evenodd_script");

}

var numberList = new GList(); 

// create/load images
function LoadImages()
{
 imTextEvenOrOdd = GImage_Create.CreateTextImage("le français is this number\n even or odd?", 32, true);

 imSetButtonEven = GImage_Create.CreateButtonSet("even", 32, true, 150, 100);
 imSetButtonOdd = GImage_Create.CreateButtonSet("odd", 32, true, 150, 100);

 imFix = GImage_Create.CreateTextImage("+", 32, true);


 for (var i = 0; i < 10; i++)
 {
  numberList.Add(GImage_Create.CreateTextImage("" + i, 64, true));
 }

}




// run at the start of each trial
function Start()
{
   


 selection = -1;
 responseTime = -1;
  showNumber = GetParam("useNumber", GameEngine.Random(1,10));//GameEngine.Random(0,10);

  fixTrigger = CreateTrigger(1000);
  studyTrigger = CreateTrigger(1000);
  responseTrigger = CreateTrigger(5000);
 
  // create text entities
  entTextEvenOdd = new Entity(imTextEvenOrOdd, imTextEvenOrOdd.GetCenterX(), 200);
  entTextEvenOdd.SetColor(new GColor(0,0,0));
  entTextEvenOdd.alpha.Set(0,0,.2);
  entFix = new Entity(imFix, imFix.GetCenterX(), imFix.GetCenterY());
  entFix.SetColor(new GColor(0,0,0));
  entFix.alpha.Set(1,1,1);

  // create number entity
  entNumber = new Entity(numberList.Get(showNumber), numberList.Get(0).GetCenterX(), numberList.Get(showNumber).GetCenterY());
  entNumber.SetColor(new GColor(0,0,0));
  entNumber.alpha.Set(0,0,.2);

  // create buttons 

  var buttonSpacing = (GameEngine.GetWidth() - (imSetButtonEven.Get(0).w + imSetButtonOdd.Get(0).w))/3;
  
  buttonEven = new GButton(imSetButtonEven, buttonSpacing, 600, 200);
  buttonEven.alpha.Set(0,0,.2);
  
  buttonOdd = new GButton(imSetButtonOdd, buttonSpacing*2 + imSetButtonEven.Get(0).w, 600, 200);
  buttonOdd.alpha.Set(0,0,.2);

  phase = 0;

  
}




var x1 = 50;
function Update()
{
  // fixation phase
  if (phase == 0)
  {
    fixTrigger.TriggerStart();
    if (fixTrigger.Check())
      {
        phase = 10;
        entFix.alpha.Set(0);
      }
   
  }
  // show the numbers (study time)
  else if (phase == 10)
  {
    studyTrigger.TriggerStart();
    entNumber.alpha.SetTarget(1);
    if (studyTrigger.Check())
    {
      phase = 20;
      entNumber.alpha.SetTarget(0);
      entTextEvenOdd.alpha.SetTarget(1);
    }
  }

  else if (phase == 20)
  {
    // response phase
    buttonEven.alpha.SetTarget(1);
    buttonOdd.alpha.SetTarget(1);

    responseTrigger.TriggerStart();

  }

  else if (phase == 30)
  {
    
    CallEndTrial();

  }

 
 buttonEven.Update();
 buttonOdd.Update();

 entNumber.Update();
 entFix.Update();
 entTextEvenOdd.Update();

}

function Draw()
{
 entTextEvenOdd.Draw();

 if (phase == 0)
 {
  entFix.Draw();
 }
 
 entNumber.Draw();

 buttonOdd.Draw();
 buttonEven.Draw();


 GameEngine.SetColor(1,0,0);

 GameDraw.DrawText("" + phase, 5, 5);



 




}


function OnClickDown(x,y,clickInfo)
{
  if (phase == 20)
  {
   if (buttonEven.CheckPressed(x,y))
   {
    selection = 0;
     phase = 30;
     responseTime = clickInfo.GetTime() - responseTrigger.GetStartTime();
   }

   if (buttonOdd.CheckPressed(x,y))
   {
      selection = 1;
     phase = 30;
      responseTime = clickInfo.GetTime() - responseTrigger.GetStartTime();
   }

  }

 
}

function OnClickUp(x,y,clickInfo)
{

}

function OnClickMove(x,y,clickInfo)
{

}




function ExportData()
{

  
  AddResult("aFixTime", fixTrigger.GetActual());
  AddResult("tFixTime", fixTrigger.GetDelay());
  AddResult("aStudyTime", studyTrigger.GetActual());
  AddResult("tStudyTime", studyTrigger.GetDelay());
  AddResult("selection", selection);
  AddResult("study_number", showNumber);
  AddResult("response_time", responseTime);
}