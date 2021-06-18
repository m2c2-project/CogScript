
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("Trial.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

// one time initialization of cogtask run
function Init()
{ 
  // global cogtask variables
  SetName(GetName());
}


function GetName()
{
    return "Cog Task Name";
}

// returns the instructions in a 1D or 2D array.
// do not define to use the resource.json instructions.
/*function GetInstructions()
{
  return [ "These are the instructions", "Follow them."];
}*/

// create/load images
function LoadImages()
{
  // load images here for global images

  // for images specific to a trial, use Trial.LoadImages()
} 


// draw commands for a block transition, do not define to use the default
/*function DrawBlockTransition()
{

}*/


// this is where all trial generation should go
// all the parameters to generate a trial should be handled here
function GenerateTrialSet()
{
  var trialSetParam = CopyParams();

  var trialNum = trialSetParam.GetInt("TrialNum", 0);

  var lastTrial = null;

  for (var i = 0; i < trialNum; i++)
  {
    var trial = new MyTrial(trialSetParam, i, lastTrial);
    AddTrial(trial);
    lastTrial = trial;
  }
}

// --------------------------------
// Individual Trial
// --------------------------------

class MyTrial extends Trial
{   
  
    constructor(params, displayNumber, lastTrial)
    {
       super(params);
        this.params = params; 

        this.displayText = params.GetString("displayText", "default text");
        this.displayNumber = displayNumber;

        this.responseTime = -1;
        this.startTime = -1;

        this.lastTrial = lastTrial;
    
    }

    LoadImages()
    {
      this.imText = GImage_Create.CreateTextImage(this.displayText + ":" + this.displayNumber,32, true);
    }

    Start()
    {
        
      this.startTime = KTime.GetMilliTime();
    }

     
    Update()
    {
        

    }

    Draw()
    {
       GameEngine.SetColor(1,0,0);
       GameDraw.DrawImage(this.imText, 10, 10);

       GameEngine.ResetColor();
    }

    OnClickDown(x,y,clickTime)
    {
     
      this.responseTime = clickTime.GetTime() - this.startTime;
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
        AddResult("displayNumber", this.displayNumber);
        AddResult("responseTime", this.responseTime);

        if (this.lastTrial != null)
        {
          AddResult("lastTrialResponse", this.lastTrial.responseTime);
        }
        else
        {
          AddResult("lastTrialResponse", "NA");
        }
    }


}