Include("Entity.js");
Include("memorybinding_shape.js");
Include("GImage_Create.js");
Include("Tools.js");
Include("GButton.js");



function Init()
{
  SetName(GetName());
}


function GetName()
{
    return "MemoryBinding";
}

function GetInstructions()
{
 // return array of strings for the instructions

 //matchPairsTop = GetParam("MatchPairsTop", 4);

 return ["test1","test2"];

 
}


function LoadImages()
{
    imTextPlus = GImage_Create.CreateTextImage("+",32, true);

    imSame = GImage_Create.CreateButtonSet("SAME", 32, true, 200, 100, new GColor(54,123,186), new GColor(11,60,106), new GColor(1,1,1), new GColor(0,0,0));//new GImage(GameEngine.r.getDrawable(R.drawable.same_button));
    imDiff = GImage_Create.CreateButtonSet("DIFFERENT", 32, true, 200, 100, new GColor(54,123,186), new GColor(11,60,106), new GColor(1,1,1), new GColor(0,0,0));

    imShapes = new GImage();
    imShapes.LoadImage("membinding.png");
}


/*
function GenerateTrialSet()
{

        trialNum = trialSetParam.GetInt("TrialNum", 2);

        shapeCount = trialSetParam.GetInt( "ShapeCount", 2);
        diffTrialPerc = trialSetParam.GetInt("DiffTrialPerc", 50);
        diffTrialCount = trialSetParam.GetInt( "DiffTrialCount", -1);
        gridW = trialSetParam.GetInt("GridW", 3);
        gridH = trialSetParam.GetInt("GridH", 3);



        //diffTrialCount = -1;

       // -----------------------

        var swapCountPerc = [];
        var swapCount = [];

        // set diffTrialCount by taking from "diffTrialPerc" if "diffTrialCount" was not set
        if (diffTrialCount == -1)// no diff trial count set
        {
            // use diffTrialPerc
            diffTrialCount = Math.floor(trialNum*diffTrialPerc*1.0/100+.5);
        }

        LogMan.Log("DOLPH_BIND", "trialnum:" + trialNum);
        LogMan.Log("DOLPH_BIND", "shapecount:" + shapeCount);
        LogMan.Log("DOLPH_BIND", "diffTrialCount:" + diffTrialCount);


        // read response display count
        var dispCount = [];
        var totalDispTrials = 0;
        for (var i = 1; i <= shapeCount; i++)
        {
            dispCount[i] = trialSetParam.GetInt("ResponseDisp"+i+"Count", 0);
            totalDispTrials = totalDispTrials + dispCount[i];
        }

        if (totalDispTrials < trialNum)
        {
            dispCount[shapeCount] = dispCount[shapeCount] + (trialNum-totalDispTrials);
        }



        // get swap counts
        // use "swap perc" values if "swap count" values were not set
        for (int i = 2; i <= shapeCount; i++)
        {
            swapCountPerc[i] = trialSetParam.GetInt("Swap"+i+"Perc", 0);

            swapCount[i] = trialSetParam.GetInt("Swap"+i+"Count", -1);
            if (swapCount[i] == -1) // if no swapCount for this number is given
            {
                // use the perc value
                swapCount[i] = (int)(diffTrialCount*swapCountPerc[i]*1.0f/100);
            }
        }


        // make sure the swap counts add up to equal the number of diff trials
        int totalSwapCount = 0;
        for (int i = 2; i <= shapeCount; i++)
        {
            totalSwapCount = totalSwapCount + swapCount[i];
        }
        // if the total is less than the number of diff trials, add it to the swapCount2
        if (totalSwapCount < diffTrialCount)
        {
            swapCount[2] = swapCount[2] + (diffTrialCount-totalSwapCount);
        }



        if (shapeCount >= (gridW*gridH)-1)
        {
            shapeCount = (gridW*gridH)-1;
        }

        if (shapeCount < 2)
        {
            shapeCount = 2;
        }



        // ----------------



        boxW = 450;
        boxH = 450;
        boxX = (GameEngine.SCREEN_W - boxW)/2;
        boxY = (GameEngine.SCREEN_H - boxH)/2-60;
        boxThickness = 4;

        gridBoxW = boxW/gridW;
        gridBoxH = boxH/gridH;

        colorBox = new GColor(0,0,0);


        trialList = new GList<Trial>();

        GList<Integer> trialTypeBank = new GList<Integer>();

        GList<Integer> dispCountBank = new GList<Integer>();

        for (int i = 0; i < trialNum; i++)
        {
            if (i < diffTrialCount)
            {
                trialTypeBank.Add(new Integer(1));
            }
            else
            {
                trialTypeBank.Add(new Integer(0));
            }

            for (int j = 0; j < dispCount[i]; j++)
            {
                dispCountBank.Add(new Integer(i));
            }
        }


        LogMan.Log("DOLPH_BIND", "difftrials:" + diffTrialCount);

        LogMan.Log("DOLPH_BIND", "swapcount:");

        for (int i = 0; i <= shapeCount; i++)
        {
            LogMan.Log("DOLPH_BIND", "" + swapCount[i]);
        }


        GList<Integer> swapCountBank = new GList<Integer>();
        // go through with the number of "different" trials we have
        // get the percentage of each number of swap for each "different" trial

        for (int i = 2; i <= shapeCount; i++)
        {
            for (int j = 0; j < swapCount[i]; j++)
            {
                swapCountBank.Add(new Integer(i));


            }

        }


        // if there are any remaining spaces, fill them up with swap count of 2
        while (swapCountBank.GetSize() < diffTrialCount)
        {
            swapCountBank.Add(new Integer(2));
        }

        LogMan.Log("DOLPH_BIND", "swapcountbank:");

        for (int i = 0; i < swapCountBank.GetSize(); i++)
        {
            LogMan.Log("DOLPH_BIND", "" + swapCountBank.Get(i));
        }

        LogMan.Log("DOLPH_BIND", "dispcountbank:");
        for (int i = 0; i < dispCountBank.GetSize(); i++)
        {
            LogMan.Log("DOLPH_BIND", "" + dispCountBank.Get(i));
        }


        for (int i = 0; i < trialNum; i++)
        {
            GameParams trialParams = new GameParams();
            trialParams.AddAllParentParams(trialSetParam);

            int trialType = trialTypeBank.PopRandom();
            int swapCountB = 0;

            int trialDispCount = shapeCount;

            if (dispCountBank.GetSize() > 0){trialDispCount = dispCountBank.PopRandom();}



            if (trialType == 1)
            {
                // different trial
                swapCountB = 2;
                if (swapCountBank.GetSize() > 0){swapCountB = swapCountBank.PopRandom();}
            }

            trialParams.Add("trialType", ""+trialType);
            trialParams.Add("swapCount", ""+swapCountB);
            trialParams.Add("dispCount", ""+trialDispCount);

            AddTrial(trialParams, overallTrialNum+i, trialSetID);

        }





      

    }*/





function Start()
{
    type = GetParam("trialType", 0);
    trialNum = -1; //tNum
    swapCount = GetParam("swapCount", 0);
    dispCount = GetParam("dispCount", 0);

    gridW = GetParam("GridW", 3);
    gridH = GetParam("GridH", 3);

    fixationTime = GetParam( "FixationTime", 500);
    studyTime = GetParam( "StudyTime", 2000);
    delayTime = GetParam( "DelayTime", 900);


    shapeCount = GetParam( "ShapeCount", 2);

    
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




   // create buttons
    var buttonSameX = boxX;
    var buttonSameY = boxY + boxH + (GameEngine.GetWidth() - boxY - boxH)/2 - imSame.Get(0).h/2;

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
    complete = true;
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


function OnClickDown(x,y,clickTime)
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

function OnClickUp(x,y,clickTime)
{

}

function OnClickMove(x,y,clickTime)
{
 
}

function ExportData()
{
    AddResult("trial_type", "" + (type));
   /* results.AddResult("shape_count", "" + (shapeCount));
    results.AddResult("response_display_count", "" + (dispCount));
    results.AddResult("swap_count", "" + (swapCount));
    results.AddResult("response_time", "" + responseTime);
    results.AddResult("button_pressed", "" + buttonPressed); // 0 = same, 1 = different
    // before shapes
    for (int i = 0; i < shapeList.GetSize(); i++)
    {
        results.AddResult("before_shape" + (i+1), "" + (shapeList.Get(i).shapeNum+1));
        results.AddResult("before_shape" + (i+1) + "color", "" + (shapeList.Get(i).color+1));
        results.AddResult("before_shape" + (i+1) + "x", "" + (shapeList.Get(i).locX));
        results.AddResult("before_shape" + (i+1) + "y", "" + (shapeList.Get(i).locY));
    }

    for (int i = 0; i < shapeList2.GetSize(); i++)
    {
        results.AddResult("after_shape" + (i+1), "" + (shapeList2.Get(i).shapeNum+1));
        results.AddResult("after_shape" + (i+1) + "color", "" + (shapeList2.Get(i).color+1));
        results.AddResult("after_shape" + (i+1) + "x", "" + (shapeList2.Get(i).locX));
        results.AddResult("after_shape" + (i+1) + "y", "" + (shapeList2.Get(i).locY));
    }*/

}

