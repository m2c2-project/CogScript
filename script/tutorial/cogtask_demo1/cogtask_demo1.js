
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("ZipReader.js");
// --------------------------------
// Global Cog Task Functions
// --------------------------------

// one time initialization of cogtask run
function Init()
{ 
  cTrial = 0;

  // global cogtask variables
  SetName(GetName());
}


function GetName()
{
    return "CogTask-Demo1";
}

// returns the instructions in a 1D or 2D array.
// do not define to use the resource.json instructions.
function GetInstructions()
{
  return [ "These are the instructions", "Follow them."];
}

// create/load images
function LoadImages()
{
     var text = GetParamString("testtext", "no value");

     imDisplayText = GImage_Create.CreateTextImage("Hello:" + text, 32, true);

     imApple = new GImage();
     imApple.LoadImage("apple.png");


     zipReader =  new ZipReader("faces.zip");

     zipReader.Open();

     imApple = zipReader.GetImage("human2.png");

     zipReader.Close();


}


// draw commands for a block transition, do not define to use the default
/*function DrawBlockTransition()
{
  GameEngine.SetColor(1,0,0);
  GameDraw.DrawBox(50,50,50,50);
}*/

// --------------------------------
// Individual Trial Functions
// --------------------------------


// run at the start of each trial
function Start()
{
      dx = 70;
      dy = 200;
      cTrial = cTrial + 1;

      ent = new Entity(imApple, 50, 50);

      //ent.position.SetTarget(200, 500);
      
      AddEnt(ent);

      phase = 0;


      startTrigger = CreateTrigger(1000);
      holdTime = -1;
      responseTime = -1;
}




// Update loop, called once a cycle
function Update()
{
        // dx = dx + 5;
         if (dx > GameEngine.GetWidth()) {dx = 0;}

         ent.rot = ent.rot + 2;

      if (phase == 0)
      {
        startTrigger.Start();

         if (startTrigger.Check())
         {
            holdTime = KTime.GetMilliTime();
            phase = 1;
         }

      }
      else if (phase == 1)
      {
         if (ent.position.AtTarget())
         {
            //ent.position.SetTarget(300,600);
            //phase = 2;
         }

      }


}

// Draw commands, called once every time the screen is refreshed
function Draw()
{
   GameEngine.SetColor(1,0,0);
   GameDraw.DrawText("trial:" + cTrial, 50 ,50);

   GameEngine.SetColor(0,1,0);

   GameDraw.DrawBox(dx, dy, 100, 100);


   GameEngine.SetColor(0,0,0);
   GameDraw.DrawImage(imDisplayText, 0,0);


   
}


function OnClickDown(x,y,clickInfo)
{
     dx = x;
     dy = y;
  // CallEndTrial();

  ent.position.SetTarget(x,y);


  if (phase == 1)
  {
    responseTime = KTime.GetMilliTime() - holdTime;
    CallEndTrial();
  }
    
 /*   if ( ent.PointCollide(x,y) )
    {
      ent.position.SetTarget(x,y);
     
    }*/
}

function OnClickUp(x,y,clickInfo)
{
 
}

function OnClickMove(x,y,clickInfo)
{
   dx = x;
     dy = y;

     ent.position.SetTarget(x,y);
}





function ExportData()
{
   AddResult("trial_number", "" + cTrial);
   AddResult("response_time", "" + responseTime);
}