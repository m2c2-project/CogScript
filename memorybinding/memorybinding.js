Include("Entity.js");
Include("memorybinding_shape.js");
Include("memorybinding_generatetrialset.js");
Include("GImage_Create.js");
Include("Tools.js");
Include("GButton.js");




function Init()
{
  SetName(GetName());
}


function GetName()
{
    return "Color Shapes";
}

function GetInstructions()
{
 // return array of strings for the instructions

 //matchPairsTop = GetParam("MatchPairsTop", 4);

 return [
 "--Colored shapes will appear briefly on the screen.",
 "--Try to remember the shapes and their colors, because they will soon disappear.",
 "--Next, you will see the same shapes reappear.",
 "--Please answer whether the shapes have the SAME or DIFFERENT colors as they had before."
  ];

 
}


function LoadImages()
{
    imTextPlus = GImage_Create.CreateTextImage("+",32, true);

    imSame = GImage_Create.CreateButtonSet("SAME", 32, true, 200, 100, new GColor(54,123,186), new GColor(11,60,106), new GColor(1,1,1), new GColor(0,0,0));//new GImage(GameEngine.r.getDrawable(R.drawable.same_button));
    imDiff = GImage_Create.CreateButtonSet("DIFFERENT", 32, true, 200, 100, new GColor(54,123,186), new GColor(11,60,106), new GColor(1,1,1), new GColor(0,0,0));

    imShapes = new GImage();
    imShapes.LoadImage("membinding.png");
}


function DrawBlockTransition()
{
    GameEngine.SetColor(colorBkg);
    GameDraw.DrawBox(0,0,GameEngine.GetWidth(), GameEngine.GetHeight());
    GameEngine.ResetColor();

    GameEngine.SetColor(colorBox);
    GameDraw.DrawBox(boxX, boxY, boxW, boxThickness);
    GameDraw.DrawBox(boxX, boxY, boxThickness, boxH);
    GameDraw.DrawBox(boxX, boxY + boxH - boxThickness, boxW, boxThickness);
    GameDraw.DrawBox(boxX + boxW - boxThickness, boxY, boxThickness, boxH);


    GameDraw.DrawImage(imTextPlus, boxX + (boxW-imTextPlus.GetWidth())/2, boxY + (boxW-imTextPlus.GetHeight())/2);

}







function Start()
{
    type = GetParam("trialType", 0);
    trialNum = -1; //tNum
    swapCount = GetParam("swapCount", 1);
    dispCount = GetParam("dispCount", 0);

    gridW = GetParam("GridW", 3);
    gridH = GetParam("GridH", 3);

    fixationTime = GetParam( "FixationTime", 500);
    studyTime = GetParam( "StudyTime", 2000);
    delayTime = GetParam( "DelayTime", 900);


    shapeCount = GetParam( "ShapeCount", 2);


    if (dispCount <= 0){dispCount = shapeCount;}

    
    colorBkg = new GColor(1,1,1);
    colorText = new GColor(0,0,0);
    colorBox = new GColor(0,0,0);

    boxW = 450;
    boxH = 450;
    boxX = (GameEngine.GetWidth() - boxW)/2;
    boxY = (GameEngine.GetHeight() - boxH)/2-60;
    boxThickness = 4;

    gridBoxW = boxW/gridW;
    gridBoxH = boxH/gridH;
    
    if (swapCount > shapeCount){swapCount = shapeCount;}


    var shapeBank = new GList();
    //shapeBank.AddAll(shapeBankList);

    for (var i = 0; i < 8; i++)
    {
      shapeBank.Add(i);
    }

    var colorBank = new GList();
    for (var i = 0; i < Color.length; i++)
    {
        colorBank.Add(i);
    }

    var locBank = new GList();
    for (var i = 0; i < gridW; i++)
    {
        for (var j = 0; j < gridH; j++)
        {
            locBank.Add(new Location(i,j));
        }
    }




    shapeList = new GList();
    LogMan.Log("DOLPH_BIND", "shapecount:" + shapeCount);
    for (var i = 0; i < shapeCount; i++)
    {
        LogMan.Log("DOLPH_BIND", "addshape " + i);
        var loc = locBank.PopRandom();
        var shapeI = GameEngine.RandomFull()%shapeBank.GetSize();
        //shapeList.Add(new Shape(shapeI, shapeBank.Get(shapeI).GetLabel(), colorBank.GetRandom(), loc.x, loc.y));

        var shape = shapeBank.Get(shapeI);

        shapeList.Add(new Shape(shape, shape+1, colorBank.PopRandom(), loc.x, loc.y));
        shapeBank.Remove(shapeI);

    }


    shapeList2 = new GList();

    for (var i = 0; i < shapeCount; i++)
    {
        if (locBank.GetSize() <= 0)
        {
            // if we run out of locations to use, add all the original shape locations for use again.
            for (var j = 0; j < shapeList.GetSize(); j++)
            {
                locBank.Add(new Location(shapeList.Get(j).locX, shapeList.Get(j).locY));
            }
        }
        // copy shapes to another list (for the test screen)
        // and get a new location for each
        var loc = locBank.PopRandom();

        shapeList2.Add(Shape.CopyShape(shapeList.Get(i), loc.x, loc.y));
      

    }


    if (type == 1) // "different trial"
    {
        // if it is a different trial, swap one the number of colors according to swapCount

        // cycle colors
        for (var i = 0; i < swapCount; i++)
        {
            shapeList2.Get(i).color = shapeList.Get( (i+1)%swapCount ).color;
        }


    }


    // remove from the response display list the shapes that should not be displayed
    for (var i = dispCount; i < shapeCount; i++)
    {
        shapeList2.RemoveLast();
    }


    // shuffle
    // shapeList2.Shuffle();

    buttonPressed = -1;

    responseTime = -1;




   // create buttons
    var buttonSameX = boxX;
    var buttonSameY = boxY + boxH + (GameEngine.GetHeight() - boxY - boxH)/2 - imSame.Get(0).h/2;

    var buttonDiffX = boxX + boxW - imDiff.Get(0).w;
    var buttonDiffY = buttonSameY;
    buttonSame = new GButton(imSame, buttonSameX, buttonSameY);
     buttonDiff = new GButton(imDiff, buttonDiffX, buttonDiffY);





            phase = 0;

            timeHold = KTime.GetMilliTime();


}







function Update()
{
   // fixation screen
   if (phase == 0)
   {
       if (KTime.GetMilliTime() - timeHold >= fixationTime)
       {
           phase = 10;
       }
   }

   // study screen
   else if (phase == 10)
   {
       timeHold = KTime.GetMilliTime();
       phase = 11;

   }
   else if (phase == 11)
   {
       if (KTime.GetMilliTime() - timeHold >= studyTime)
       {
           phase = 20;
       }

   }

   // delay screen
   else if (phase == 20)
   {
       timeHold = KTime.GetMilliTime();
       phase = 21;

   }
   else if (phase == 21)
   {
       if (KTime.GetMilliTime() - timeHold >= delayTime)
       {
           phase = 30;
           responseTimeHold = KTime.GetMilliTime();
       }

   }



   // test screen

   else if (phase == 30)
   {
       // wait for a button to be pressed

   }

   else if (phase == 31)
   {
       timeHold = KTime.GetMilliTime();
       phase = 32;
   }

   else if (phase == 32)
   {
       if (KTime.GetMilliTime() - timeHold > 300)
       {
           ExportData();
           phase = 39;
       }
   }
   else if (phase == 39)
   {
    CallEndTrial();
   }

   buttonSame.Update();
   buttonDiff.Update();

}

function Draw() 
{
    GameEngine.SetColor(colorBkg);
    GameDraw.DrawBox(0,0,GameEngine.GetWidth(), GameEngine.GetHeight());
    GameEngine.ResetColor();

    GameEngine.SetColor(colorBox);
    GameDraw.DrawBox(boxX, boxY, boxW, boxThickness);
    GameDraw.DrawBox(boxX, boxY, boxThickness, boxH);
    GameDraw.DrawBox(boxX, boxY + boxH - boxThickness, boxW, boxThickness);
    GameDraw.DrawBox(boxX + boxW - boxThickness, boxY, boxThickness, boxH);


    // fixation screen
    if (phase >= 0 && phase < 10)
    {
        GameEngine.SetColor(0,0,0);
        GameDraw.DrawImage(imTextPlus, boxX + (boxW - imTextPlus.w)/2, boxY + (boxH - imTextPlus.h)/2);
        GameEngine.ResetColor();
    }
    // study screen
    else if (phase >= 10 && phase < 20)
    {
        for (var i = 0; i < shapeList.GetSize(); i++)
        {
            shapeList.Get(i).Draw();
        }

    }
    // delay screen
    else if (phase >= 20 && phase < 30)
    {

    }
    // test screen
    else if (phase >= 30 && phase <= 40)
    {
        for (var i = 0; i < shapeList2.GetSize(); i++)
        {
            shapeList2.Get(i).Draw();
        }

        var selectedColor = new GColor(25,194,131);
        var pressedX = 3;
        var selectedBorder = 5;
 

        buttonSame.Draw();


        buttonDiff.Draw();

    }


  
}


function OnClickDown(x,y,click)
{
      var tx = x;
      var ty = y;
    // test
    if (phase == 30)
    {
       // if (tx > buttonSameX && tx < buttonSameX + imSame.w && ty > buttonSameY && ty < buttonSameY + imSame.h)
        if (buttonSame.CheckPressed(tx,ty))
        {
            buttonPressed = 0;
            phase = 31;
            responseTime = click.GetTime() - responseTimeHold;
        }
        else if (buttonDiff.CheckPressed(tx,ty))
        {
            buttonPressed = 1;
            phase = 31;
            responseTime = click.GetTime() - responseTimeHold;
        }
    }

}

function OnClickUp(x,y,click)
{

}

function OnClickMove(x,y,click)
{
 
}

function ExportData()
{
    AddResult("trial_type", "" + (type));
    AddResult("shape_count", "" + (shapeCount));
    AddResult("response_display_count", "" + (dispCount));
    AddResult("swap_count", "" + (swapCount));
    AddResult("response_time", "" + responseTime);
    AddResult("button_pressed", "" + buttonPressed); // 0 = same, 1 = different
    // before shapes
    for (var i = 0; i < shapeList.GetSize(); i++)
    {
        AddResult("before_shape" + (i+1), "" + (shapeList.Get(i).shapeNum+1));
        AddResult("before_shape" + (i+1) + "color", "" + (shapeList.Get(i).color+1));
        AddResult("before_shape" + (i+1) + "x", "" + (shapeList.Get(i).locX));
        AddResult("before_shape" + (i+1) + "y", "" + (shapeList.Get(i).locY));
    }

    for (var i = 0; i < shapeList2.GetSize(); i++)
    {
        AddResult("after_shape" + (i+1), "" + (shapeList2.Get(i).shapeNum+1));
        AddResult("after_shape" + (i+1) + "color", "" + (shapeList2.Get(i).color+1));
        AddResult("after_shape" + (i+1) + "x", "" + (shapeList2.Get(i).locX));
        AddResult("after_shape" + (i+1) + "y", "" + (shapeList2.Get(i).locY));
    }
}

