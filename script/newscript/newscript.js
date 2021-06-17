
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

function Init()
{ 
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


// this is where all the trials should be created
function GenerateTrialSet()
{
  trialNum = GetParamInt("TrialNum", 0);
  

  // create a list of trial params to send to native app to create trials with
  generateTrialParamList = new GList();

  for (var i = 0; i < trialNum; i++)
  {
    
    generateTrialParamList.Add(params);
  }
}



// --------------------------------
// Individual Trial Functions
// --------------------------------


// run at the start of each trial
function Start()
{
      
}





function Update()
{
         


}

function Draw()
{


        
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