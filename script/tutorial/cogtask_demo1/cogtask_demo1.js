
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
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

}


// draw commands for a block transition, do not define to use the default
/*function DrawBlockTransition()
{

}*/

// --------------------------------
// Individual Trial Functions
// --------------------------------


// run at the start of each trial
function Start()
{
      cTrial = cTrial + 1;
}




// Update loop, called once a cycle
function Update()
{
         


}

// Draw commands, called once every time the screen is refreshed
function Draw()
{
   GameEngine.SetColor(1,0,0);
   GameDraw.DrawText("trial:" + cTrial, 50 ,50);
}


function OnClickDown(x,y,clickInfo)
{
  
   CallEndTrial();
}

function OnClickUp(x,y,clickInfo)
{
 
}

function OnClickMove(x,y,clickInfo)
{
  
}





function ExportData()
{
   AddResult("trial_number", "" + cTrial);
}