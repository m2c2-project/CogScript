
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
    return "Shopping List";
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

}





function Update()
{
           x++; 
           if (x > 400){x = 0;}

}

function Draw()
{
     GameEngine.SetColor(1,0,0);
    GameDraw.DrawBox(x,50,50,50);
   
}


function OnClickDown(x,y,clickTime)
{
  

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