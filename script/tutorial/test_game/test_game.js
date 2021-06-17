
Include("Entity.js");
Include("ball.js");



function Init()
{

}




var ballList = new GList(); 

//var image = new GImage();

function Start()
{
 LogMan.Log("DOLPH_INSCRIPT", "starT");
 ballList = new GList();
 ballList.Add(new Ball(50, 50, 40));
 ballList.Add(new Ball(200, 50, 40)); 
 
  ballList.Add(new Ball(50, 150, 40));
 ballList.Add(new Ball(200, 150, 40)); 
 ballList.Get(1).velX = -3;
 ballList.Get(1).g = 1;


 for (i = 0; i < 30; i++)
 {
  ballList.Add(new Ball(Math.random()*GameEngine.GetWidth(), Math.random()*GameEngine.GetHeight(), 30));
  ballList.Get(ballList.GetSize()-1).velY = -3 + Math.random()*6;
  ballList.Get(ballList.GetSize()-1).velX = -3 + Math.random()*6;
 }
 
 
 sprite = new Sprite(image, 150, 150, 256/2, 256/2);
 
 sprite.StartAnimation(new AnimationData(0,0,1,0,5));
 //sprite.curFrame = 1;


 entity = new Entity(image, 100, 100);
 
 image2 = image;
}



function LoadImages()
{
	image = new GImage();
 image.LoadImage("apple.png");

}


var irot = 0;

function Update()
{
 
 irot++;
 
 for (var i = 0; i < ballList.GetSize(); i++)
 {
  ballList.Get(i).Update();
  
  for (var j = i+1; j < ballList.GetSize(); j++)
  {
   if (i != j)
   {
    if (ballList.Get(i).IsCollide(ballList.Get(j)))
    {
      ballList.Get(i).OnCollide(ballList.Get(j));
    }
   }
  }

 }
 
 sprite.Update();

 entity.Update();
 

}

var cdX = -1;
var cdY = -1;

function OnClickDown(x,y,clickTime)
{
 cdX = x;
 cdY = y;
 ballList.Get(0).x = x;
 ballList.Get(0).y = y;

 entity.position.SetTarget(x,y);
 entity.alpha.SetTarget(0);


 if (y < 20)
 {
  CallEndTrial();
 }

}

function OnClickUp(x,y,clickTime)
{
 //ballList[0].x = x;
 //ballList[0].y = y;
 entity.alpha.SetTarget(1);
}

function OnClickMove(x,y,clickTime)
{
 ballList.Get(0).velX = -1*(ballList.Get(0).x - x)/5;
 ballList.Get(0).velY = -1*(ballList.Get(0).y - y)/5;
 ballList.Get(0).x = x;
 ballList.Get(0).y = y;
}

function Draw() 
{
  
   for (i = 0; i < ballList.GetSize(); i++)
	 {
	  ballList.Get(i).Draw();
	 }
	 
	 
	 GameEngine.SetColor(0,0,0);
	GameDraw.DrawText(ballList.GetSize().toString(), 20, 20);
	GameDraw.DrawText(GameEngine.GetFPS().toString(), 20, 40);
	
	
	/*GameEngine.SetColor(200,0,0);
	GameDraw.DrawBox(50,50,250,250);
    GameEngine.ResetColor()
	GameDraw.DrawBox(100,100,50,50);
	GameEngine.ResetColor();
	GameEngine.ResetColor();
	GameDraw.DrawImagePart(image, 50,50, 10, 10, 150, 150, irot, 1, 1,-1,-1,1);*/


	
	
  sprite.Draw();
  
  entity.rot = irot;
  entity.Draw();
}


				
