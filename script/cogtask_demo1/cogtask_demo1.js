
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("ZipReader.js");
Include("GImage_Create.js");

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
  var text = GetParamString("testtext", "none");
  imText = GImage_Create.CreateTextImage("Hello this a demo:" + text, 32, true);

  imApple = new GImage();
  imApple.LoadImage("apple.png");


     zipReader =  new ZipReader( GetParamString("filename", "faces.zip") );

     zipReader.Open();

     imApple = zipReader.GetImage("human1.png");

     zipReader.Close();
  

}


// draw commands for a block transition, do not define to use the default
function DrawBlockTransition()
{
   GameEngine.ResetColor();
   GameDraw.DrawBox(0,0,GameEngine.GetWidth(), GameEngine.GetHeight());
   GameEngine.SetColor(1,0,0);
   GameDraw.DrawBox(50,50,50,50);
}

// --------------------------------
// Individual Trial Functions
// --------------------------------


// run at the start of each trial
function Start()
{
      cTrial = cTrial + 1;

      
   
      xpos = GetParamInt("displayNumber", -50);

      ypos = 100;

      ent = new Entity(imApple, 50, 50);
      ent.position.SetTarget(300, 300);


      phase = 0;


      rot = 0;

      holdTime = KTime.GetMilliTime();
      responseTime = -1;

}




// Update loop, called once a cycle
function Update()
{
       rot++;
       ent.rot = rot;

       if (phase == 0) // wait for apple to get to target
       {
          if (ent.position.AtTarget())
          {
            ent.position.SetTarget(0,0);

            phase = 1;
          }

       }
       else if (phase == 1)
       {
         if (ent.position.AtTarget())
         {
           ent.position.SetTarget(300,300);

           phase = 0;
         }

       }
      /*   xpos = xpos + 2;
         if (xpos > GameEngine.GetWidth())
         {
            xpos = 0;
         }*/

         ent.Update();
}

// Draw commands, called once every time the screen is refreshed
function Draw()
{
   GameEngine.SetColor(1,0,0);
   GameDraw.DrawText("trial:" + cTrial, 50 ,50);

   GameEngine.SetColor(0,1,0);
   GameDraw.DrawBox(xpos,ypos, 50, 100);

   GameEngine.SetColor(0,0,0);
   GameDraw.DrawImage(imText, 0,0);

   GameEngine.ResetColor();
  // GameDraw.DrawImage(imApple, 200,300);

   ent.Draw();
}


function OnClickDown(x,y,clickInfo)
{
   xpos = x;
   ypos = y;
   //ent.position.SetTarget(x,y);

   if (ent.PointCollide(x,y))
   {
     responseTime = KTime.GetMilliTime() - holdTime;
     CallEndTrial();
   }
}

function OnClickUp(x,y,clickInfo)
{
 
}

function OnClickMove(x,y,clickInfo)
{
   xpos = x;
   ypos = y;
}





function ExportData()
{
   AddResult("trial_number", "" + cTrial);

   AddResult("responseTime", "" + responseTime);
}