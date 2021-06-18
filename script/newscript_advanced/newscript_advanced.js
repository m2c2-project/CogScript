
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

  trialNum = GetParam("TrialNum", 0);

  for (var i = 0; i < trialNum; i++)
  {
    AddTrial(new MyTrial(trialSetParm, i));
  }
}

// --------------------------------
// Individual Trial
// --------------------------------

class MyTrial extends Trial
{   
  
    constructor(params, displayNumber)
    {
         super(params);
        this.params = params; 

        this.displayText = params.GetString("displayText", "no text");

        this.displayNumber = displayNumber;
    
    }

    LoadImages()
    {
      imText = 
    }

    Start()
    {
        this.color = new GColor(1,0,0);
        if (this.testVal == 1)
        {
                this.color = new GColor(0,1,0);
        }

        this.x = 0;

    }

     
    Update()
    {
        this.x++;

    }

    Draw()
    {
       GameEngine.SetColor(1,0,0);
       GameDraw.DrawBox(this.x,50,200,250);


       GameDraw.DrawText("trial count:" + trialList.GetSize(), 300, 100);

       GameEngine.SetColor(this.color);
       GameDraw.DrawText("test val:" + this.testVal, 300, 150);
       GameDraw.DrawText("trial num:" + this.trial_num, 300, 200);


       GameEngine.ResetColor();
       GameDraw.DrawImage(imFace1, 100, 100);
   
    }

    OnClickDown(x,y,clickTime)
    {
      this.CallTrialEnd();
    }


}