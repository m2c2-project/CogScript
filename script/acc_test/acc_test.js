
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
    return "Acc Test";
}

function GetInstructions()
{
 // return array of strings for the instructions

 

 return ["--Thse are the instructions", "--Follow them."];
 
}



// create/load images
function LoadImages()
{

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
      x = 10;
      y = 50;
      velX = 0; 
      velY = 0;

      w = 50;
      h = 50;
}





function Update()
{
           x = x + velX;
           y = y + velY;

          if (x > GameEngine.GetWidth() - w)
          {
            x = GameEngine.GetWidth() - w;
            velX = 0;
          }
          else if (x < 0){x = 0; velX = 0;}

          if (y > GameEngine.GetHeight() - h)
          {
            y = GameEngine.GetHeight() - h;
            velY = 0;
          }
          else if (y < 0){y = 0; velY = 0;}

          var acc = GameEngine.GetAcc();
          velX = velX - .5*acc[0];
          velY = velY + .5*acc[1];

}

function Draw()
{
 
   GameEngine.SetColor(1,0,0);
   GameDraw.DrawBox(x,y,50,50);

   var acc = GameEngine.GetAcc();
   GameDraw.DrawText("x:" + acc[0], 10,10);
   GameDraw.DrawText("y:" + acc[1], 10,30); 
   GameDraw.DrawText("z:" + acc[2], 10,50);
}


function OnClickDown(x,y,clickTime)
{
  
   CallEndTrial();
}

function OnClickUp(x,y,clickTime)
{
 
}

function OnClickMove(x,y,clickTime)
{
  
}





function ExportData()
{
 
          
}