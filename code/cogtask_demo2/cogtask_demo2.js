
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


  startingSpeed = 5;

}

function GetName()
{
    return "CogTask-Demo2";
}

function GetInstructions()
{
 // return array of strings for the instructions

 var boxCount = GetParam("BoxCount", 4);

 return ["--You will see " + boxCount + "boxes.",
         "--Find the correct box."];
 
}



// create/load images
function LoadImages()
{

        imApple = new GImage();
        imApple.LoadImage("apple.png");
      
        imFixation  = GImage_Create.CreateTextImage("+",32, true);



}



function DrawBlockTransition()
{
   GameEngine.ResetColor();
   GameDraw.DrawBox(0,0,GameEngine.GetWidth, GameEngine.GetHeight());


    GameEngine.SetColor(0,0,0);
    GameDraw.DrawImage(imFixation, (GameEngine.GetWidth()-imFixation.GetWidth())/2, (GameEngine.GetHeight()-imFixation.GetHeight())/2);
    GameEngine.ResetColor();

}

// --------------------------------
// Individual Trial Functions
// --------------------------------


// run at the start of each trial
function Start()
{
           startTime = KTime.GetMilliTime();

           apple = new Entity(imApple, 50, 50);
            

         
           showNumber = GetParam("usenumber", 0);


           responseTime = -2;


           x = 0;
           y = GameEngine.GetHeight()/2 - 10;


           touchCount = 0;
}





function Update()
{
          x = x + 3;
          if (x > GameEngine.GetWidth())
          {
            x = 0;
          }


          apple.Update();

          apple.rot++;

       


}

function Draw()
{
   GameEngine.ResetColor();
   GameDraw.DrawBox(0,0,GameEngine.GetWidth(), GameEngine.GetHeight(), 2, 45);

   GameEngine.SetColor(1,0,0,.5);
   GameDraw.DrawText("" + showNumber, x, y);




   apple.Draw();

   GameDraw.DrawText("" + touchCount, 10, 10);



        
}


function OnClickDown(x,y,clickTime)
{
    responseTime = clickTime - startTime;


    if (apple.PointCollide(x,y))
    {
        touchCount++;
    }


    //apple.position.SetTarget(x,y);



  

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
     

    AddResult("response_time", "" + responseTime);
    AddResult("test_val", "" + 5);

    AddResult("test_val2", "" + GameEngine.Random(0,100));
          
}