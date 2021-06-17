



// to be created. only run once at the very start of the cog task
function Init()
{
 

}

function LoadImages()
{

}




// run at the start of each trial
function Start()
{
 

}


var x1 = 0;
function Update()
{
 x1 = x1 + 1;

}

function Draw()
{
 GameEngine.SetColor(0,1,0);
 GameDraw.DrawBox(x1,50,100,100);




}


function OnClickDown(x,y,clickTime)
{
  x1 = x;
}

function OnClickUp(x,y,clickTime)
{

}

function OnClickMove(x,y,clickTime)
{
 x1 = x
}