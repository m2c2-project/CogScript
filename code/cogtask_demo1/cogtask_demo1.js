
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

function Init()
{ 
  trialNum = 0;

  // global cogtask variables
  SetName(GetName());

}

function GetName()
{
    return "CogTask-Demo1";
}

function GetInstructions()
{
 // return array of strings for the instructions

 

 return ["--Thse are the instructions", "--Follow them."];
 
}



// create/load images
function LoadImages()
{
        imApple = new GImage();
        imApple.LoadImage("apple.png");
}


function DrawBlockTransition()
{

}

// --------------------------------
// Individual Trial Functions
// --------------------------------






// run at the start of each trial
function Start()
{
        dx = 50;

        showNumber = GetParamInt("showNumber", -1);


       mycolor = GetParamColor("mycolor", "0,1,0");


       entApple = new Entity(imApple, 50,50);

       touchCount = 0;

}





function Update()
{
         
  dx++;
  if (dx > GameEngine.GetWidth())
  {
    dx = 0;
  }


  entApple.Update();

}

function Draw()
{
 GameEngine.SetColor(1,0,0);
 GameDraw.DrawLine(50,50, 100,250);


 GameEngine.SetColor(0,0,1);

 GameDraw.DrawText("number:" + (showNumber + 1), 200,200);


 GameEngine.SetColor(mycolor);



 GameDraw.DrawBox(200,200,200,200);


 entApple.Draw();


 GameEngine.SetColor(0,0,0);

 GameDraw.DrawText("text:" + touchCount, 50, 300);


        
}


function OnClickDown(x,y,clickTime)
{
   dx = x;
   CallEndTrial();

  if (entApple.PointCollide(x,y))
  {
   touchCount++;
  }
}

function OnClickUp(x,y,clickTime)
{
 
}

function OnClickMove(x,y,clickTime)
{
    dx = x;
}





function ExportData()
{
 
          
}