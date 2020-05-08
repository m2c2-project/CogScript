
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("ZipReader.js");
Include("dotmemory_GLStim.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

function Init()
{ 
  trialNum = 0;

  // global cogtask variables
  SetName(GetName());


  //Game_SetShowDebug(true);


    

       // SetName("Dot Memory");



        efZip = GetParam(["efzip","InterferenceZip"], "dotmemory.zip");




        efText = GetParam(["eftext","InterferenceText"], "Touch the F's!");

        zipReader = null;

        if (efZip != "")
        {
            // check to make sure exists
              zipReader =  new ZipReader(efZip);
         


            /*
                if (zipFile.exists())
                {
                imageLoader = new ImageLoader(zipFile.getAbsolutePath(), "dotmem", 50, 50);
                imageLoader.LoadImages(false);

                if (imageLoader.GetImage("distractor.png") == null )
                {
                    ErrorMan.AddError("Dot Memory", "interference zip file does not contain \"distractor.png\"!");
                }

                    if (imageLoader.GetImage("target.png") == null)
                    {
                        ErrorMan.AddError("Dot Memory", "interference zip file does not contain \"target.png\"!");
                    }

                }
                else
                {
                    ErrorMan.AddError("Dot Memory", "cannot find interference Zip file:" + efZip);
                }*/
        }
/*
        instructions = new String[] {


                "--You will see 3 dots appear briefly on a grid.",
                "--Try to remember the location of these dots, because they will soon disappear.",
                "--Next you will see a screen full of E’s and F’s. Please tap all the F’s that you see.",
                "--When you see the empty grid, tap the locations where you recall having seen the dots."




        };*/

         //zipReader =  new ZipReader("test.zip");
       // zipReader = new ZipReader("test.zip");  


       // zipReader = null;//null;//new ZipReader("test.zip");


        colorBkg = new GColor(1,1,1);//new GColor(164,176,182);
        colorText = new GColor(0,0,0);

}

function GetName()
{
    return "Dot Memory";
}

function GetInstructions()
{
 // return array of strings for the instructions

 
 var getDots =  GetParamInt("DotCount", 3);

/*
 return [


    "--You will see " + getDots + " dots appear briefly on a grid.",
    "--Try to remember the location of these dots, because they will soon disappear.",
    "--Next you will see a screen full of E’s and F’s. Please tap all the F’s that you see.",
    "--When you see the empty grid, tap the locations where you recall having seen the dots." ]*/


    return [["In this exercise you will try to remember the locations of 3 red dots.",

"img:dotmem1_grid.png",

"Touch [b]NEXT[/b] for instructions."],

["This exercise begins by displaying 3 red dots randomly placed on a grid, just like the example below.",

"img:dotmem1_grid.png",

"You will have a few seconds to try to remember the locations of the dots.",

"Press [b]Next[/b] to continue"],

["Then the dots and grid will be replaced by rows of the letters E and F, like the example below." ,

"img:dotmem2_fs.png",

"You should try to touch as many Fs as you can!",

"Press [b]Next[/b] to continue"],

["Next, you will be shown an empty grid. You should touch the locations where you saw the red dots. A red dot will appear in each location you touch.",

"img:dotmem3_fgrid.png",

"After you have placed 3 dots on the grid, press DONE. Hint: You can move a red dot you’ve placed by touching it.",

"Press [b]Start[/b] to begin."]];
             
   
 
}



// create/load images
function LoadImages()
{
  usingCustomEFImages = false;
    
    

    imGL_E = GImage_Create.CreateTextImage("E", 42, true, -2, -2);//new OpenGLEngine.GImage(GameEngine.r.getDrawable(R.drawable.e));
    imGL_F = GImage_Create.CreateTextImage("F", 42, true, -2, -2);//new OpenGLEngine.GImage(GameEngine.r.getDrawable(R.drawable.f));

    if (zipReader != null)
    {

        zipReader.Open();
     
     imGL_E = zipReader.GetImage("distractor.png");
     imGL_F = zipReader.GetImage("target.png");

     zipReader.Close();

     usingCustomEFImages = true;
    }



    imGL_Done = GImage_Create.CreateButtonSet("DONE", 32, true, 350, 100);



    imTextReady = GImage_Create.CreateTextImage("Get Ready",32, true);
    imTextWhereDots = GImage_Create.CreateTextImage("Where were the dots?",32, true);
    imTextRemember = GImage_Create.CreateTextImage(["Remember the dot", "locations!"],32, true);
    imTextEF = GImage_Create.CreateTextImage(efText,32, true);



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
    var params = curParams;


    var getFeedback = params.GetInt("Feedback", 0);
    feedbackOn = (getFeedback == 1);

    dotCount = params.GetInt("DotCount", 3);
    dotPresentTime = params.GetInt("DotPresentTime", 3000);
    EFTime = params.GetInt(["EFTime","InterferenceTime"], 8000);
    EFRatio = params.GetInt(["EFRatio","InterferenceRatio"], 5);
    efSize = params.GetInt(["EFSize","InterferenceSize"], 80);
    readyTime = params.GetInt("ReadyTime", 1000);
    showDelayTime = params.GetInt( "ShowDelayTime", 1000);
    showFeedbackTime = params.GetInt("ShowFeedbackTime", 1000);
    gridW = params.GetInt("GridSize", 5);
    gridH = gridW;
    transitionSpeed = params.GetInt("TransitionSpeed", 20); // transition speed (will be divided by 100) higher is faster

    if (transitionSpeed <= 0){transitionSpeed = 1.0;}


    TOUCH_BOX_SIZE = (GameEngine.GetWidth()-50)/gridW;


    efGridW = 5;
    efGridH = 8;


   





    // ---------------------
   // Start()


   phase = -1;

   holdResponseTime = 0;

   buttonY = GameEngine.GetWidth() - GameEngine.GetHeight() / 8;


  

   // stem up main grid
   var boxSize = TOUCH_BOX_SIZE;
   var gridX = (GameEngine.GetWidth() - (gridW * boxSize)) / 2;
   var gridY = (GameEngine.GetHeight() - (gridH * boxSize)) / 2;// + MainFile.SCREEN_H / 16 + 20;

   stim = [[],[]];
  

   for (var sx = 0; sx < gridW; sx++)
   {
         stim[sx] = [];
       for (var sy = 0; sy < gridH; sy++)
       {
  
           stim[sx][sy] = new GLStimuli(imGL_E, gridX + sx * boxSize, gridY + sy * boxSize, GLStimuli.Type_DOT);
           stim[sx][sy].kpos.speed = transitionSpeed;
           stim[sx][sy].kpos.x = gridX + sx * boxSize;
           stim[sx][sy].kpos.y = gridY + sy * boxSize;
           stim[sx][sy].w = boxSize;
           stim[sx][sy].h = boxSize;
           stim[sx][sy].SetHitBox(0,0,boxSize, boxSize);
           stim[sx][sy].SetColor(colorText, colorBkg);
       }
   }

   // set up EF grid
   boxSize = 80;
   gridX = (GameEngine.GetWidth() - (efGridW * boxSize)) / 2;
   gridY = (GameEngine.GetHeight() - (efGridH * boxSize)) / 2 + GameEngine.GetHeight() / 16 + 20;

   stimEF =  [[],[]];
   correctEF =  [[],[]];
   for (var sx = 0; sx < efGridW; sx++)
   {
       stimEF[sx] = [];
       correctEF[sx] = [];
       for (var sy = 0; sy < efGridH; sy++)
       {
           stimEF[sx][sy] = new GLStimuli(imGL_E,
                   gridX + boxSize / 2 + sx * boxSize + GameEngine.GetWidth(), gridY + boxSize / 2 + sy * boxSize,
                   GLStimuli.Type_IMAGE);
           stimEF[sx][sy].kpos.speed = transitionSpeed;
           stimEF[sx][sy].kpos.smooth = false;
           stimEF[sx][sy].w = efSize;
           stimEF[sx][sy].h = efSize;
           stimEF[sx][sy].Activate();
           stimEF[sx][sy].hideBackground = true;

           correctEF[sx][sy] = false;
           if (!usingCustomEFImages)
           {
            // only set the color to black if we are using the default EF images
              stimEF[sx][sy].SetColor(colorText, colorBkg);
           }
           var bonusHitW = 5;

           stimEF[sx][sy].SetHitBox(-bonusHitW ,-bonusHitW , boxSize + bonusHitW*2 , boxSize + bonusHitW*2 );
       }
   }

   findFCount = Math.floor((efGridW * efGridH) / (1 + EFRatio));

/*  if (tutorial != 0)
{
   ShowTutorialText();
}*/
   var endGridY = gridY + (gridH+1) * boxSize;//stim[0][gridH-1].kpos.y + boxSize;
   doneButton = new GButton(imGL_Done, imGL_Done.Get(0).GetCenterX(), endGridY + ((GameEngine.GetHeight()-endGridY) - imGL_Done.Get(0).h)/2);

   touchCount = 0;

   holdResponseTime = 0;
   responseTime = 0;

   EFScreen = 0;


   memLocations = new GList();
   userLocations = new GList();
   efTouchLocations = new GList();


   for (var sx = 0; sx < gridW; sx++)
   {
       for (var sy = 0; sy < gridH; sy++)
       {
           stim[sx][sy].Deactivate();
           stim[sx][sy].SetState(GLStimuli.State_NONE);
       }
   }


   efFindCount = 0;
   phase = 0;



   taskStarted = true;


}





function Update()
{
         
    if (!taskStarted){return;}
    if (phase == 0)
    {
        holdTime = GameEngine.GetMilliTime();
        phase = 1;
    }
    else if (phase == 1) // show "ready" text
    {
        if (GameEngine.GetMilliTime() - holdTime >= readyTime)
        {
            phase = 2;
        }
    }
    else if (phase == 2) // Get Dot Positions
    {
        GetMemoryLocations();
        phase = 3;
    }
    else if (phase == 3)
    {
        holdTime = GameEngine.GetMilliTime();
        phase = 4;
    }
    else if (phase == 4)
    {
        if (GameEngine.GetMilliTime() - holdTime >= showDelayTime)
        {
            phase = 5;
        }
    }
    else if (phase == 5)
    {
        for (var i = 0; i < memLocations.GetSize(); i++)
        {
            stim[memLocations.Get(i).x][memLocations.Get(i).y].Activate();
        }
        phase = 6;
        holdTime = GameEngine.GetMilliTime();
    }
    else if (phase == 6) // wait for the dots to be presented
    {
        if (GameEngine.GetMilliTime() - holdTime >= dotPresentTime)
        {
            phase = 7;
        }
    }
    else if (phase == 7) // set targets for stimuli to move off screen
    {
        for (var sx = 0; sx < gridW; sx++)
        {
            for (var sy = 0; sy < gridH; sy++)
            {
                stim[sx][sy].Deactivate();
                stim[sx][sy].SetTarget(stim[sx][sy].kpos.x - GameEngine.GetWidth(), stim[sx][sy].kpos.y);
            }
        }

        SetUpEFGrid();

        phase = 8;
    }
    else if (phase == 8)
    {
       /* if (stimEF[0][0].kpos.x < GameEngine.GetWidth()/2)
        {
            return;
        }*/

        if (stimEF[efGridW - 1][efGridH - 1].AtTarget())
        {
            phase = 10;
        }
    }

    else if (phase == 10) // start E's
    {
        holdTime = GameEngine.GetMilliTime();
        efHoldTime = holdTime;
        phase = 11;
    }
    else if (phase == 11) // wait to touch E's
    {
        // if all F's are found
        var fCount = findFCount;
        if (efFindCount >= fCount)
        {
            efFindCount = 0;
            // send grid EF elements out of screen
            for (var sx = 0; sx < efGridW; sx++)
            {
                for (var sy = 0; sy < efGridH; sy++)
                {
                    stimEF[sx][sy].SetTarget(stimEF[sx][sy].kpos.x, GameEngine.GetHeight() + 50);
                    phase = 12;
                }
            }
        }

        if (GameEngine.GetMilliTime() - holdTime >= EFTime)
        {
            phase = 20;
        }

    }
    else if (phase == 12) // set up next grid
    {
        if (stimEF[0][0].AtTarget())
        {
            EFScreen++;
            SetUpEFGrid();
            phase = 11;
        }
    }

    else if (phase == 20) // move back to main grid for user input
    {
        ExportEFData();
        // move ef grid out
        for (var sx = 0; sx < efGridW; sx++)
        {
            for (var sy = 0; sy < efGridH; sy++)
            {
                stimEF[sx][sy].SetTarget(stimEF[sx][sy].kpos.x + GameEngine.GetWidth(), stimEF[sx][sy].kpos.y);
            }
        }
        // move main grid back
        for (var sx = 0; sx < gridW; sx++)
        {
            for (var sy = 0; sy < gridH; sy++)
            {

                var boxSize = TOUCH_BOX_SIZE;
                var gridX = (GameEngine.GetWidth() - (gridW * boxSize)) / 2;
                var gridY = (GameEngine.GetHeight() - (gridH * boxSize)) / 2;// + MainFile.SCREEN_H / 16 + 20;

                stim[sx][sy].SetTarget(gridX + sx * boxSize, gridY + boxSize / 2 + sy
                        * boxSize - 125 / 2);

                stim[sx][sy].Deactivate();
            }
        }
        phase = 21;
    }
    else if (phase == 21) // wait for main grid to be in place
    {
        if (stim[0][0].AtTarget())
        {
            phase = 22;
            holdResponseTime = GameEngine.GetMilliTime();
        }
    }
    else if (phase == 22) // wait for user to press the continue button
    {

    }
    else if (phase == 23)
    {
        // find the user selected location
        for (var sx = 0; sx < gridW; sx++)
        {
            for (var sy = 0; sy < gridH; sy++)
            {
                if (stim[sx][sy].isOn())
                {
                    userLocations.Add(new Pair(sx, sy));
                }
            }
        }

        if (!feedbackOn)
        {
            phase = 30;
        }
        else
        {
            phase = 24;
        }
    }
    else if (phase == 24)
    {
        // show feedback
        for (var i = 0; i < memLocations.GetSize(); i++)
        {
            if (stim[memLocations.Get(i).x][memLocations.Get(i).y].isOn())
            {
                stim[memLocations.Get(i).x][memLocations.Get(i).y].SetState(GLStimuli.State_CORRECT);
            }
            else
            {
                stim[memLocations.Get(i).x][memLocations.Get(i).y].SetState(GLStimuli.State_WRONG);
                stim[memLocations.Get(i).x][memLocations.Get(i).y].Activate();
            }
        }
        phase = 25;
        holdTime = GameEngine.GetMilliTime();
    }
    else if (phase == 25)
    {
        if (GameEngine.GetMilliTime() - holdTime >= showFeedbackTime)
        {
            phase = 30;
        }
    }

    else if (phase == 30)
    {
        ExportData();
       complete = true;
       CallEndTrial();
    }

    // Draw Stim
    for (var sx = 0; sx < gridW; sx++)
    {
        for (var sy = 0; sy < gridH; sy++)
        {
            stim[sx][sy].Update();
        }
    }

    for (var sx = 0; sx < efGridW; sx++)
    {
        for (var sy = 0; sy < efGridH; sy++)
        {
            stimEF[sx][sy].Update();
        }

    }

    doneButton.Update();


}

function Draw()
{
    var topTextY = 64; // 32
    // draw black background
    GameEngine.SetColor(colorBkg);
    GameDraw.DrawBox(0,0,GameEngine.GetWidth(), GameEngine.GetHeight());
    GameEngine.ResetColor();
    if (phase > 2 && phase < 99)
    {
        GameEngine.SetColor(194,206,212);
        GameDraw.DrawBox(stim[0][0].kpos.x,stim[0][0].kpos.y, stim[0][0].w*gridW, stim[0][0].h*gridH);
        GameEngine.ResetColor();
    }
/*
GameEngine.SetColor(1,0,0);
GameDraw.DrawCircle(100,100,100,100, 0, 1, false);

if (true)

return;*/



    if (phase == 1)
    {
        GameEngine.SetColor(colorText);
        //GameEngine.SetTextLocation(GameEngine.TEXTLOC.CENTER);
        // GameEngine.SetTextSize(40);
        //GameDraw.DrawText("Get Ready!", GameEngine.GetWidth() / 2, GameEngine.GetHeight() / 2 - GameEngine.GetTextSize(), true);

        GameDraw.DrawImage(imTextReady, (GameEngine.GetWidth()- imTextReady.w)/2, (GameEngine.GetHeight() - imTextReady.h)/2);
        //GameEngine.ResetTextLocation();
    }
    else if (phase >= 2 && phase < 10 || phase >= 20)
    {
        for (var sx = 0; sx < gridW; sx++)
        {
            for (var sy = 0; sy < gridH; sy++)
            {
                stim[sx][sy].Draw();
            }
        }
    }

    if (phase >= 7 && phase < 22)
    {
        if (phase == 11 || phase == 12)
        {
            // GameEngine.SetTextLocation(GameEngine.TEXTLOC.CENTER);
            //    GameEngine.SetTextSize(40);
            GameEngine.SetColor(colorText);
            //GameDraw.DrawText("Touch the F's!", GameEngine.GetWidth() / 2, GameEngine.GetTextSize() * 1f, true);
            GameDraw.DrawImage(imTextEF, GameEngine.GetWidth()/2 - imTextEF.w/2, topTextY);
            GameEngine.ResetColor();
            // GameEngine.ResetTextLocation();
        }


       
        for (var sx = 0; sx < efGridW; sx++)
        {
            for (var sy = 0; sy < efGridH; sy++)
            {
                stimEF[sx][sy].Draw();
            }
        }
    }

    if (phase >= 2 && phase < 7)
    {
        //    GameEngine.SetTextLocation(GameEngine.TEXTLOC.CENTER);
        GameEngine.SetColor(colorText);
        //     GameEngine.SetTextSize(32);
        //   GameDraw.DrawText("Remember the dot ", GameEngine.GetWidth() / 2, GameEngine
        //         .GetTextSize() * .5f, true);

//                GameDraw.DrawText("locations!", GameEngine.GetWidth() / 2, GameEngine
        //                      .GetTextSize() * 1.5f, true);

        GameDraw.DrawImage(imTextRemember, GameEngine.GetWidth()/2 - imTextRemember.w/2, topTextY );


        GameEngine.ResetColor();
        //GameEngine.ResetTextLocation();

    }


    if (phase == 22)
    {/*
    GameEngine.SetColor(0, 255, 0);
    GameEngine.DrawBox(0, buttonY, MainFile.SCREEN_W, MainFile.SCREEN_H - buttonY);
    GameEngine.SetColor(0, 0, 0);
    GameEngine.SetTextLocation(GameEngine.TEXTLOC.CENTER);
    GameEngine.SetTextSize((MainFile.SCREEN_H - buttonY) / 2);
    GameEngine.drawText("DONE", MainFile.SCREEN_W / 2, buttonY + (int)(GameEngine.GetTextSize()*1.0f/4)
            + GameEngine.GetTextSize());*/
        buttonY = GameEngine.GetHeight() - imGL_Done.h;
        GameEngine.ResetColor();
        //      GameEngine.SetTextLocation(GameEngine.TEXTLOC.CENTER);
        //GameEngine.SetColor(11, 142, 104);
        //GameEngine.SetColor(0, 1, 0);
       
        //GameDraw.DrawImage(imGL_Done, (GameEngine.GetWidth() - imGL_Done.w)/2, endGridY + ((GameEngine.GetHeight()-endGridY) - imGL_Done.h)/2);

        doneButton.Draw();

        //GameDraw.DrawRoundBox((GameEngine.GetWidth() - imGL_Done.w)/2, (GameEngine.GetHeight() - imGL_Done.h)/2, imGL_Done.w, imGL_Done.h, 0);

        GameEngine.ResetColor();
        //   GameEngine.SetTextSize(32);
        GameEngine.SetColor(colorText);
        //  GameDraw.DrawText("Where were the dots?", GameEngine.GetWidth() / 2, GameEngine
        //     .GetTextSize() * 1, true);
        GameDraw.DrawImage(imTextWhereDots, (GameEngine.GetWidth()-imTextWhereDots.w)/2, topTextY);
        GameEngine.ResetColor();

        //  GameEngine.ResetTextLocation();

    }

    // GameEngine.SetColor(1,0,0);
    // GameDraw.DrawText("fps: " + GameEngine.FPS, 10,10);
    // GameEngine.ResetColor();



        
}


function OnClickDown(x,y,click)

{
    var tx = x;
    var ty = y;
    //LogMan.Log("DOLPHIN_LOG_GAME", "ON CLICK: " + tx + " " + ty);
    if (phase == 99)
    {
        // LogMan.Log("DOLPHIN_LOG_GAME", "PHASE 99");
        CallEnd();
        return;
    }

    if (phase == 11)
    { // EF Grid
       var hit = false;
        for (var sx = 0; sx < efGridW; sx++)
        {
            for (var sy = 0; sy < efGridH; sy++)
            {
                if (stimEF[sx][sy].pointCollide(tx, ty))
                {
                    hit = true;
                    var correctTap = 0;
                    if (correctEF[sx][sy] && stimEF[sx][sy].isOn())
                    {
                        stimEF[sx][sy].Deactivate();
                        // old version
                        //  efTouchLocations.Add(new Integer(sx + sy * efGridW + efGridW*efGridH*EFScreen));
                        correctTap = 1;
                        efFindCount++;

                    }


                    efTouchLocations.Add("" + (click.GetTime()-efHoldTime) + "_" + EFScreen + "_" + sx + "_" + sy + "_" + correctTap + "_" + Math.floor(tx) + "_" + Math.floor(ty));


                }
            }
        }

        if (!hit)
        {
         // missed all Es and F's
         // add a touch showing the miss
            efTouchLocations.Add("" + (click.GetTime()-efHoldTime) + "_" + EFScreen + "_" + -1 + "_" + -1 + "_" + -1 + "_" + Math.floor(tx) + "_" + Math.floor(ty));

        }

    }
    else if (phase == 22)
    {
        // touch dots
        for (var sx = 0; sx < gridW; sx++)
        {
            for (var sy = 0; sy < gridH; sy++)
            {
                if (stim[sx][sy].pointCollide(tx, ty))
                {

                    if (stim[sx][sy].isOn())
                    {
                        stim[sx][sy].Deactivate();
                        touchCount--;
                    }
                    else
                    {
                        if (touchCount < dotCount)
                        {
                            stim[sx][sy].Activate();
                            touchCount++;
                        }
                        else
                        {
                            GameEngine.Vibrate(100);
                            //com.engine.cog.GameEngine.Vibrate(100);
                        }
                    }
                    return; // only allow one box to be touched
                }
            }
        }



        if (doneButton.CheckPressed(tx,ty))
        {
            if (touchCount == dotCount)
            {
                phase = 23;
                responseTime = click.GetTime() - holdResponseTime;
            }
            else
            {

                GameEngine.Vibrate(100);
                GameEngine.MessageBox("You must select all " + dotCount + " locations!");
            }
        }

    }
}

function OnClickUp(x,y,clickTime)
{
 
}

function OnClickMove(x,y,clickTime)
{
  
}


        function  GetMemoryLocations()
        {
            var redo = true;
            while (redo)
            {
                redo = false;
                // create a new list of memory locations
                memLocations = new GList();

                var cornerCount = 0; // number of dots in corner
                var cornerMax = 1; // number of dots allowed in the corners

                for (var i = 0; i < dotCount; i++)
                {
                    var check = true;
                    var rCheckX = 0;
                    var rCheckY = 0;



                    while (check)
                    {
                        rCheckX =  GameEngine.RandomInt(0, gridW);
                        rCheckY =  GameEngine.RandomInt(0, gridH);
                        check = false;

                        if (InCorner(rCheckX, rCheckY) && cornerCount >= cornerMax) // corner check

                        {
                            check = true;
                            continue;
                        }

                        for (var x = 0; x < memLocations.GetSize(); x++)
                        {
                            if (memLocations.Get(x).x == rCheckX && memLocations.Get(x).y == rCheckY || // spot already taken
                                    InLine(memLocations.Get(x), rCheckX, rCheckY))  // in same line
                            {
                                check = true;
                                break;
                            }
                        }

                    }
                    if (InCorner(rCheckX, rCheckY)){cornerCount++;}
                    memLocations.Add(new Pair(rCheckX, rCheckY));
                }
                // make sure there is no case where one dot is touching more than 1 other dots

                for (var i = 0; i < memLocations.GetSize(); i++)
                {
                    var touching = 0;
                    for (var j = 0; j < memLocations.GetSize(); j++)
                    {
                        if (i != j)
                        {
                            if (IsTouching(memLocations.Get(i), memLocations.Get(j)))
                            {
                                touching++;
                            }
                        }
                    }
                    if (touching > 1){redo = true; break;}
                }
            }
        }

        function InCorner(tX, tY)
        {
            if (tX == 0 && tY == 0 || tX == 0 && tY == gridH-1 || tX == gridW-1 && tY == 0 || tX == gridW-1 && tY == gridH-1)
            {
                    return true;
            }

            return false;
        }

        function  InLine(loc, tX, tY)
        {
            if (loc.x == tX || loc.y == tY){return true;} // straight lines

            return false;
        }

        function  IsTouching(locA, locB)
        {
            return Math.abs(locA.x - locB.x) == 1 && Math.abs(locA.y - locB.y) == 0 ||
                    Math.abs(locA.x - locB.x) == 0 && Math.abs(locA.y - locB.y) == 1 ||
                    Math.abs(locA.x - locB.x) == 1 && Math.abs(locA.y - locB.y) == 1;
        }

        function  SetUpEFGrid()
        {
            boxSize = 80;
            gridX = (GameEngine.GetWidth() - (efGridW * boxSize)) / 2;
            gridY = (GameEngine.GetHeight() - (efGridH * boxSize)) / 2 + GameEngine.GetHeight() / 16 + 20;

            // move EF grid on screen
            for (var sx = 0; sx < efGridW; sx++)
            {
                for (var sy = 0; sy < efGridH; sy++)
                {
                    stimEF[sx][sy].kpos.x = gridX + boxSize / 2 + sx * boxSize + GameEngine.GetWidth();
                    stimEF[sx][sy].kpos.y = gridY + boxSize / 2 + sy * boxSize - 125 / 2;
                    stimEF[sx][sy].SetTarget(gridX + sx * boxSize - boxSize / 4, stimEF[sx][sy].kpos.y);
                    stimEF[sx][sy].SetImage(imGL_E);
                    correctEF[sx][sy] = false;
                    stimEF[sx][sy].Activate();
                }
            }

            // set the F's
            var fCount = findFCount;
            for (var i = 0; i < fCount; i++)
            {
                var checkX = -1;
                var checkY = -1;
                while (checkX == -1 || correctEF[checkX][checkY] == true)
                {
                    checkX = GameEngine.RandomInt(0, efGridW);
                    checkY = GameEngine.RandomInt(0, efGridH);
                }
                correctEF[checkX][checkY] = true;
                stimEF[checkX][checkY].SetImage(imGL_F);
            }

        }







        function ExportEFData()
        {

        }
            



function ExportData()
{
    

    //String outputFilename = getSessionId() + "_" + getTaskName() + "_" + getParticipantId();

   


    AddResult("interference_zip", efZip);
 //   results.AddResult("time_stamp", "" + KTime.GetDate() + " " + KTime.GetTime());



    // get the locations of the correct dots
    var dotLocations = "";
    for (var i = 0; i < memLocations.GetSize(); i++)
    {
        // must convert to 1D coordinates
        // old version
       // int location = (memLocations.Get(i).x + memLocations.Get(i).y*gridH);
        var location = memLocations.Get(i).x + "_" + memLocations.Get(i).y;
        dotLocations = dotLocations + " " + location;
    }

    // get the locations of t he user's answers
    var userAnswers = "";
    for (var i = 0; i < userLocations.GetSize(); i++)
    {
        // must convert to 1D coordinates
         // old version
       // int location = (userLocations.Get(i).x + userLocations.Get(i).y*gridH);
        var location = userLocations.Get(i).x + "_" + userLocations.Get(i).y;
        userAnswers = userAnswers + " " + location;
    }

   // results.AddResult("trial_time", Tools.KTime.GetTime());



    // results.NextTrial() called in ExportEFData() which is called before
    //AddResult("trial_num", "" + (num+1));
    AddResult("dot_locations", "" + dotLocations);

    AddResult("user_answers", "" + userAnswers);

    AddResult("response_time", "" + responseTime);

    AddResult("interference_ratio", "" + EFRatio);
    AddResult("interference_time", "" + EFTime);
    AddResult("interference_text", "" + efText);
    AddResult("interference_size", "" + efSize);

    AddResult("show_delay_time", "" + showDelayTime);
    AddResult("interference_page_targets", "" + findFCount);


    efTouch = "";
    for (var i = 0; i < efTouchLocations.GetSize(); i++)
    {
        if (i > 0) {efTouch = efTouch + " ";}
        efTouch = efTouch + efTouchLocations.Get(i);
    }

    AddResult("interference_locations", efTouch);


}




function GetExportIDList()
{
  return ["interference_zip", "dot_locations", "user_answers", "response_time",
  "interference_ratio", "interference_time", "interference_text", "interference_size", 
  "show_delay_time", "interference_page_targets", "interference_locations"];


}