
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");


// to be created. only run once at the very start of the cog task
function Init()
{
 

}

var numberList = new GList(); 

function LoadImages()
{
 imApple = new GImage();
 imApple.LoadImage("apple.png");
}




// run at the start of each trial
function Start()
{
   
  color = new GColor(0,0,1);


  trigger = CreateTrigger(1000);
 
//entity = new Entity(image, 100, 100);
 phase = 0;
}




var x1 = 50;
function Update()
{
  if (phase == 0)
  {
   trigger.Start();
   phase = 1;
  
  }
  else if (phase == 1)
  {
     x1 = x1 + 1;
    if (trigger.Check())
    {
       x1 = 0;
      phase = 2;
    }
  }

 
 //button.Update();
}

function Draw()
{
  if (phase == 1)
  {
    GameEngine.ResetColor();
    
    GameEngine.SetColor(0,1,0);
    GameDraw.DrawBox(100,50,100,100);
  }
  else
  {


        GameEngine.SetColor(1,0,0);

        GameDraw.DrawText("hi" + KTime.GetMilliTime(), 5, 5);
        GameDraw.DrawText("trigger start:" + trigger.start, 5, 25);
        GameDraw.DrawText("trigger start:" + trigger.end, 5, 45);

        GameDraw.DrawText("trigger actual:" + trigger.GetActual(), 5, 65);
        GameDraw.DrawText("trigger disp actual:" + trigger.GetActualDisplayTime(), 5, 85);
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
//x1 = x
}