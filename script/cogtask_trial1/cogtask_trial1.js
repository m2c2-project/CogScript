Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("Trial.js");
Include("ZipReader.js");

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
    return "CogTask-Trial1";
}

function GetInstructions()
{
 // return array of strings for the instructions

 

 return ["--Thse are the instructions", "--Follow them."];
 
}

// NOT CURRENTLY WORKING WITH GETPARAM()!
function GenerateTrialSet()
{
      // values obtained from TrialSet

       trialNum = GetParam("TrialNum", 0);

       var params = CopyParams();


       for (var i = 0; i < trialNum; i++)
       {
     //   params.varMap.Put("testval", "900");
        AddTrial(new TrialTask1(params));
       }
      

}



// create/load images
function LoadImages()
{

    zipReader = new ZipReader("test.zip");
        zipReader.Open();

        imApple = new GImage();
        imApple.LoadImage("apple.png");

        imFace1 = new GImage();
        //imFace1.LoadImage(zipReader.Get("face1.png"));
        imFace1 = zipReader.GetImage("face1.png");

        zipReader.Close();
}



class TrialTask1 extends Trial
{   
    // figure out how to call super class constructors
    constructor(params)
    {
         super();
        this.params = params; 

        this.testVal = params.GetInt(["testvalx", "testval"], 300);

        
        this.trial_num = params.GetInt("trialnum", 200);

    
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