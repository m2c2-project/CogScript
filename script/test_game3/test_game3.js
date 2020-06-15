
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
 textEvenOrOdd = GImage_Create.CreateTextImage("is this\n even or odd?", 32, true);

 buttonImageList = new GList();
 buttonImageList.Add(GImage_Create.CreateTextImage("button text", 32, true));
 buttonImageList.Add(GImage_Create.CreateTextImage("button text2", 32, true));

 buttonImageList2 = GImage_Create.CreateButtonSet("button", 32, true, 200, 100);


 buttonImage = GImage_Create.CreateButtonImage("the button", 32, true, 200, 50);





 imApple = new GImage();
 imApple.LoadImage("apple.png");
}




// run at the start of each trial
function Start()
{
   
  button = new GButton(buttonImageList2, 100, 150, 200);

  color = new GColor(0,0,1);


  trigger = CreateTrigger(3000);
 
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

 
 button.Update();
}

function Draw()
{
  GameEngine.ResetColor();
   GameEngine_SetColor2(color.GetIntColor());
  // GameEngine.SetColor(0,1,0);
 GameDraw.DrawBox(100,50,100,100);


 GameEngine.SetColor(0,1,0);
 GameDraw.DrawBox(x1,50,100,100);




 GameDraw.DrawImage(textEvenOrOdd, 50, 50);

 GameEngine.ResetColor();
 GameDraw.DrawImage(buttonImage, 200, 200);


 button.Draw();

  GameEngine.SetColor(1,0,0);

 GameDraw.DrawText("hi" + KTime.GetMilliTime(), 5, 5);
 GameDraw.DrawText("trigger start:" + trigger.start, 5, 25);
 GameDraw.DrawText("trigger start:" + trigger.end, 5, 45);

 //GameDraw.DrawImage(imApple, 50, 250);

 //	GameDraw.DrawImagePart(imApple, 50,50, 0, 0, 256, 256, 0, 1, 1,-1,-1,1);




}


function OnClickDown(x,y,clickTime)
{


  if (button.CheckPressed(x,y))
  {

    x1 = 0;
  }
}

function OnClickUp(x,y,clickTime)
{

}

function OnClickMove(x,y,clickTime)
{
//x1 = x
}