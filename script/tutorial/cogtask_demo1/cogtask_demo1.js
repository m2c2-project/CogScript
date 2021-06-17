
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

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
      cTrial = cTrial + 1;
}





function Update()
{
         


}

function Draw()
{
   GameEngine.SetColor(1,0,0);
   GameDraw.DrawText("trial:" + cTrial, 50 ,50);

        
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