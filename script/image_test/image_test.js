
Include("GImage_Create.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

function Init()
{ 
  trialNum = 0;

  pageSize = 30;

  // global cogtask variables
  SetName(GetName());

}

function GetName()
{
    return "Image Test";
}




// create/load images
function LoadImages()
{
   imageList = new GList();
   

   for (var i = 0; i < 110; i++)
   {
     for (var j = 0; j < pageSize; j++)
     {
      var im = new GImage();
      im = GImage_Create.CreateTextImage("This is page:" + i + "; line:" + j,20, true);

      imageList.Add(im);

     }
   
   }
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
      trialNum++;

      

}





function Update()
{
           

}

function Draw()
{
  GameEngine.SetColor(1,0,0);

 // GameDraw.DrawText("trial:" + trialNum, 50, 50);
   
  for (var i = 0; i < pageSize; i++)
  {
    GameDraw.DrawImage(imageList.Get(trialNum*pageSize + i), 50, 0+20*i);
  }

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