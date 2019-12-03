
Include("Tools.js");
Include("KTime.js");
Include("ErrorMan.js");







class GameEngine
{
  
  static SetColor(r,g,b,a = 1)
  {

   // so we can pass the first parameter as a GColor
   if (r instanceof GColor)
   {
      GameEngine.SetColor(r.r,r.g,r.b,r.a);
      return;
   }

   //GameEngine_SetColor(r,g,b,a);

   var command = new GList();
   command.Add("GameEngine_SetColor");
   command.AddArray([r,g,b,a]);
   drawCommands.Add(command);
  }

  static SetAlpha(a)
  {
    //GameEngine_SetAlpha(a);

    var command = new GList();
    command.Add("GameEngine_SetAlpha");
    command.AddArray(arguments);
    drawCommands.Add(command);
  }
  
  
  static ResetColor()
  {
   //GameEngine_ResetColor();

   var command = new GList();
   command.Add("GameEngine_ResetColor");
   command.AddArray(arguments);
   drawCommands.Add(command);
  }
  
  static GetWidth()
  {
     return 480;
  // return GameEngine_GetWidth();
  }
  
  static GetHeight()
  {
      return 800;
   //return GameEngine_GetHeight();
  }
  
  static GetFPS()
  {
   return GameEngine_GetFPS();
  }


  static MessageBox(text)
  {
    GameEngine_MessageBox(text);
  }

  static CloseMessageBox()
  {
    GameEngine_CloseMessageBox();
  }


  static GetMilliTime()
  {
    return KTime.GetMilliTime();
  }


  static RandomFull()
  {
   return Math.floor(Math.random()*2147483647);
  }

  static Random(low, hi)
    {
        // hi not included
        return Math.floor(low + Math.random()*(hi-low));
    }


    static Vibrate(time)
    {

    }

}



drawCommands = new GList();

/*function GetNextDrawCommand()
{
 if (drawCommands.GetSize() == 0)
 {
   return ["end"];
 }
 return drawCommands.PopFirst().arr;
}*/

function GetDrawCommands()
{
  var commands = [];
  for (var i = 0; i < drawCommands.GetSize(); i++)
  {
    commands[i] = drawCommands.Get(i).arr;
  }

  return commands;
}

class GameDraw
{

   // get an array of the parameters and send with the command. in the game draw array.

  static DrawLine(x1,y1,x2,y2,thickness=1)
  {
    
   //  GameDraw_DrawLine(ToInt(x1), ToInt(y1), ToInt(x2), ToInt(y2), ToInt(thickness));

     var command = new GList();
     command.Add("GameDraw_DrawLine");
     command.AddArray([x1,y1,x2,y2,thickness]);
     drawCommands.Add(command);
  }

  static DrawBox(x, y, w, h, rot = 0, scale = 1)
  {
    if (x + w < 0 || x > GameEngine.GetWidth() || y + h < 0 || y > GameEngine.GetHeight()){return;}
    // GameDraw_DrawBox(ToInt(x),ToInt(y),ToInt(w),ToInt(h), ToInt(rot), ToFloat(scale));


     var command = new GList();


     command.Add("GameDraw_DrawBox");
     command.AddArray([x,y,w,h,rot,scale]);
     drawCommands.Add(command);

   //  LogMan.Log("DOLPH_SCRIPT", "arg:"  +  arguments.length);



  }

  static DrawRoundLineBox(x, y, w, h)
  {
    //if (x + w < 0 || x > GameEngine.GetWidth() || y + h < 0 || y > GameEngine.GetHeight()){return;}
  // GameDraw_DrawRoundLineBox(ToInt(x),ToInt(y),ToInt(w),ToInt(h), ToInt(0), ToFloat(1.0));

  var command = new GList();
  command.Add("GameDraw_DrawRoundLineBox");
  command.AddArray([x,y,w,h, 0, 1]);
  drawCommands.Add(command);
  }

  static DrawRoundBox(x, y, w, h)
  {
   // if (x + w < 0 || x > GameEngine.GetWidth() || y + h < 0 || y > GameEngine.GetHeight()){return;}
  // GameDraw_DrawRoundBox(ToInt(x),ToInt(y),ToInt(w),ToInt(h), ToInt(0), ToFloat(1.0));

   var command = new GList();
   command.Add("GameDraw_DrawRoundBox");
   command.AddArray([x,y,w,h, 0 ,1]);
   drawCommands.Add(command);
  }
  
  static DrawCircleCenter(x, y, w, h)
  {
    if (x + w < 0 || x > GameEngine.GetWidth() || y + h < 0 || y > GameEngine.GetHeight()){return;}
  // GameDraw_DrawCircleCenter(ToInt(x),ToInt(y),ToInt(w),ToInt(h));

   var command = new GList();
   command.Add("GameDraw_DrawCircleCenter");
   command.AddArray(arguments);
   drawCommands.Add(command);
  }
  
  static DrawText(str, x, y)
  {
  // GameDraw_DrawText(str, x, y);

    var command = new GList();
    command.Add("GameDraw_DrawText");
    command.AddArray(arguments);
    drawCommands.Add(command);
  }
  
  
  static DrawImage(im, x, y)
  {
    if (x + im.w < 0 || x > GameEngine.GetWidth() || y + im.h < 0 || y > GameEngine.GetHeight()){return;}

   //GameDraw_DrawImage(im.GetImageIndex(), x, y);

   var command = new GList();
   command.Add("GameDraw_DrawImage");
   command.AddArray([im.GetImageIndex(), x, y]);
   drawCommands.Add(command);
  }
  
  static DrawImagePart(im, x, y, sx, sy, sw, sh, rot = 0, scaleX = 1, scaleY = 1, rx = -1, ry = -1, posX = 1)
  {
    if (x + sw*scaleX < 0 || x > GameEngine.GetWidth() || y + sh*scaleY < 0 || y > GameEngine.GetHeight()){return;}

   //GameDraw_DrawImagePart(im.GetImageIndex(), x, y, sx, sy, sw, sh, rot, scaleX, scaleY, rx, ry, posX);

   var command = new GList();
   command.Add("GameDraw_DrawImagePart");
   command.AddArray([im.GetImageIndex(), x, y, sx, sy, sw, sh, rot, scaleX, scaleY, rx, ry, posX]);
   drawCommands.Add(command);
  }




}



    class ClickInfo
    {
        constructor(x, y, time, touchNum)
        {
         this.x = x;
         this.y = y;
         this.time = time;

         this.touchNum = touchNum;
        }

        GetTime(){return this.time;}
    }



