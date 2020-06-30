
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("ball.js");

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
    return "Acc Test 2";
}


/*
function GetInstructions()
{
 // return array of strings for the instructions


 var instructions = cog_resource["instructions"];



 ReplaceParamInStrArray(instructions);


 

 return instructions;
 
}
*/


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
      y = 50;
      velX = 0; 
      velY = 0;

      w = 50;
      h = 50;

    var r = 30;
    ballList = new GList();
    for (i = 0; i < 25; i++)
    {
     ballList.Add(new Ball(Math.random()*GameEngine.GetWidth(), Math.random()*GameEngine.GetHeight(), r));
    // ballList.Get(ballList.GetSize()-1).velY = -3 + Math.random()*6;
   //  ballList.Get(ballList.GetSize()-1).velX = -3 + Math.random()*6;
    }

    // remove any balls that start inside eachother
     for (var i = 0; i < ballList.GetSize(); i++)
     {

            for (var j = i+1; j < ballList.GetSize(); j++)
            {
                if (i != j)
                {
                  if (ballList.Get(i).IsCollide(ballList.Get(j)))
                  {
                    ballList.Remove(j);
                    j--;
                  }
                }
             
            }

    }
  


}





function Update()
{
           x = x + velX;
           y = y + velY;

          if (x > GameEngine.GetWidth() - w)
          {
            x = GameEngine.GetWidth() - w;
            velX = 0;
          }
          else if (x < 0){x = 0; velX = 0;}

          if (y > GameEngine.GetHeight() - h)
          {
            y = GameEngine.GetHeight() - h;
            velY = 0;
          }
          else if (y < 0){y = 0; velY = 0;}


          var gravX = .2;
          var gravY = .2;

          var acc = GameEngine.GetAcc();
          velX = velX - gravX*acc[0];
          velY = velY + gravY*acc[1];



          for (var i = 0; i < ballList.GetSize(); i++)
          {
           ballList.Get(i).Update();
           ballList.Get(i).velX = ballList.Get(i).velX - gravX*acc[0]; 
           ballList.Get(i).velY = ballList.Get(i).velY + gravY*acc[1];
           
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


}

function Draw()
{
 
   GameEngine.SetColor(1,0,0);
   GameDraw.DrawBox(x,y,50,50);

   var acc = GameEngine.GetAcc();
   GameDraw.DrawText("x:" + acc[0], 10,10);
   GameDraw.DrawText("y:" + acc[1], 10,30); 
   GameDraw.DrawText("z:" + acc[2], 10,50);


   for (i = 0; i < ballList.GetSize(); i++)
	 {
	  ballList.Get(i).Draw();
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