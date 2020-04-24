
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("colordots_dot.js");


// --------------------------------
// Global Cog Task Functions
// --------------------------------

function Init()
{
  SetName(GetName());
 // SetUpdateLastTrial(true);

// splitLineY = (GameEngine.GetHeight()*3.0/5);
colorBkg = new GColor(1,1,1);

}

function GetName()
{
    return "Color Dots";
}

function GetInstructions()
{
 // return array of strings for the instructions
 //return ["instructions here"];
  return [["You will be presented with 3 dots.", "img:colordots1.png", "Press [b]Next[/b] to continue."],

          ["You will be asked to report the color of a dot at a marked location.", "img:colordots2.png", "Press [b]Next[/b] to continue."],

          ["Then, you will be asked to place a colored dot to its original location.", "img:colordots3.png", "Press [b]Next[/b] to continue."],

          ["You may tap a different portion of the screen to place a colored dot elsewhere, or tap and a hold a colored for to drag it elsewhere.", 
          "img:colordots4.png", "Press [b]Next[/b] to continue."],

          ["If a response is not provided after 20 seconds, the next trial will begin automatically.",  "Press [b]Start[/b] to begin."]];
       
}




// -c-END_INTRO--



// create/load images
function LoadImages()
{
/*
        imageSymbol = new GImage();
        imageSymbol.LoadImage("symbols.png");
        //imTestText = GImage.CreateTextImage(new String[]{"test text", "line2","and this is what is on line 3"},32, true);
        imMatchText = GImage_Create.CreateTextImage("Which of these matches\na pair above?",32, true);
        imOrText = GImage_Create.CreateTextImage("or",32, true);

        imFixation  = GImage_Create.CreateTextImage("+",32, true);;*/



        imTextReady = GImage_Create.CreateTextImage("Ready",32, true);
        imTextPlus = GImage_Create.CreateTextImage("+",32, true);
        imTextRemember = GImage_Create.CreateTextImage("Remember the dots",32, true);
        imTextWhatColor = GImage_Create.CreateTextImage("What color was this dot?",32, true);
        imTextWhereDot = GImage_Create.CreateTextImage("Where was this dot?",32, true);
        imTextTouchScreen = GImage_Create.CreateTextImage("Touch screen to move the dot.",32, true);
        imDone = GImage_Create.CreateButtonSet("DONE", 32, true, 442, 110, new GColor(107,107,107), new GColor(107,107,107), new GColor(1,1,1), new GColor(0,0,0));



}




// generates trials for an entire TrialSet
// if this function is not declared, it will use the default method (each trial has all the trial set params)
/*function GenerateTrialSet()
{
    

}*/

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
/*
    GameEngine.SetColor(0,0,0);
    GameDraw.DrawImage(imFixation, (GameEngine.GetWidth()-imFixation.GetWidth())/2, (splitLineY-imFixation.GetHeight())/2);
    GameEngine.ResetColor();*/

}

// --------------------------------
// Individual Trial Functions
// --------------------------------


// run at the start of each trial
function Start()
{
   
            

           

         TrialNum = GetParamInt("TrialNum", 2);
         FixationTime = GetParamInt("FixationTime", 1000);
         StudyTime = GetParamInt("StudyTime", 3000);
         DelayTime = GetParamInt("DelayTime", 750);

         DotRadius = GetParamInt("DotRadius", 25);

         DotNum = GetParamInt("DotNum", 3);

         if (DotNum < 3){DotNum = 3;}

         Test1Mode = GetParamInt("Test1Mode", 1);
         Test1DisplayHold = GetParamInt("Test1DisplayHold", 1000);



         boxW = 450;
         boxH = 450;
         boxX = (GameEngine.GetWidth() - boxW)/2;
         boxY = (GameEngine.GetHeight() - boxH)/2-60;
         boxThickness = 4;

         boxDotBorder = DotRadius*2;

         minDotDist = Math.floor(DotRadius*2*3); // minimum dot separating distance is 2.5x the diameter

         colorBox = new GColor(0,0,0);


       //  startWaitTime = 1000;






      phase = 0;

     

      dotList = new GList(); //dot
      dotBankList = new GList(); // int

      var colorSelectList = new GList(); // int

      panel = new DotPanel(boxX + boxW/2, boxY + boxH + DotRadius*2.5, DotRadius);

      for (var i = 0; i < TOTAL_COLORS; i++)
      {
       colorSelectList.Add(i);
      }

      for (var i = 0; i < DotNum; i++)
      {

       // keep trying a random location until one at a suitable distance is found
       var passLoc = false;
       var maxTries = 100;


       var setColor = colorSelectList.PopRandom();

       for (var a = 0; a < maxTries && !passLoc; a++)
       {
           passLoc = true;
           dotList.Add(new Dot(setColor, DotRadius));
           dotList.GetLast().x = GameEngine.Random(boxDotBorder, boxW - boxDotBorder);
           dotList.GetLast().y = GameEngine.Random(boxDotBorder, boxH - boxDotBorder);

           // check other remaining dots for minimum range
           for (var j = 0; j < dotList.GetSize()-1; j++)
           {
             var xDist = dotList.GetLast().x - dotList.Get(j).x;
             var yDist = dotList.GetLast().y - dotList.Get(j).y;
             var distTo = Math.sqrt(xDist*xDist + yDist*yDist);
             if (distTo < minDotDist)
             {
              passLoc = false;
              break;
             }
           }

           if (!passLoc && a < maxTries-1){dotList.RemoveLast();}

       }

       dotBankList.Add(i);
      }


      colorProbeDot = GameEngine.RandomFull()%DotNum;
      dotBankList.Remove(colorProbeDot);

      probeDot = new Dot(-1, DotRadius);
      probeDot.x = dotList.Get(colorProbeDot).x;
      probeDot.y = dotList.Get(colorProbeDot).y;


      locationSetDot = -1; // will be set after the color probe selection is made
      locDot = new Dot(-1, DotRadius);


      test2touchdown = false;






  
}





function Update()
{
           
      // screen 1 ( fixation delay) "ready" screen
      if (phase == 0)
      {
         timeHold = KTime.GetMilliTime();
         phase = 1;
      }
      else if (phase == 1)
      {
        if (KTime.GetMilliTime() - timeHold > FixationTime)
        {
         phase = 10;
        }

      }


      // screen 2 (dot display) "remember the dots"

      else if (phase == 10)
      {
       timeHold = KTime.GetMilliTime();
       phase = 11;
      }
      else if (phase == 11)
      {
       if (KTime.GetMilliTime() - timeHold > StudyTime)
       {
          phase = 20;
       }
      }

      // screen 3 (delay screen) blank
      else if (phase == 20)
      {
          timeHold = KTime.GetMilliTime();
          phase = 21;

      }
      else if (phase == 21)
      {
          if (KTime.GetMilliTime() - timeHold > DelayTime)
          {
              phase = 30;
              responseTimeHold = KTime.GetMilliTime();
          }
      }

      // screen 4 "what color was this dot" (test 1)
      else if (phase == 30)
      {
       panel.Update();
       if (panel.GetSelected() != -1) // only change the color in test 1 mode 1
       {
          probeDot.color = panel.GetSelected();
       }

      }

      else if (phase == 31) // delay between mode 1 to show color
      {
        timeHold = KTime.GetMilliTime();
        phase = 32;
      }

      else if (phase == 32)
      {
       if (KTime.GetMilliTime() - timeHold >= Test1DisplayHold)
       {
        phase = 33;
       }
      }

      else if (phase == 33)
      {
       // select value for test 2
       phase = 34;
       locationSetDot = dotBankList.PopRandom(); // get a dot from the remaining 2 non tested dots
       if (dotList.Get(locationSetDot).color == panel.GetSelected()  // dot used for test 2 cannot be the user selected dot color from test 1
              || dotList.Get(locationSetDot).color == dotList.Get(colorProbeDot).color) // and it cannot be the true value of the dot from test 1
       {
        // if either of these conditions are met, use the last dot instead
        locationSetDot = dotBankList.PopRandom();

       }

       locDot.color = dotList.Get(locationSetDot).color;
       locDot.lockBox = false;
       locDot.x = boxX + imTextWhereDot.w + locDot.r*2;
       locDot.y = boxY - imTextWhereDot.h + locDot.r*0;
      }

      else if (phase == 34)
      {
       responseTimeHold = KTime.GetMilliTime();
       phase = 40;
      }



      // screen 5 (test 2)

      else if (phase == 40)
      {
       // "where was this dot?"



      }


      else if (phase == 41)
      {
       ExportData();
       CallEndTrial();
       phase = 42;
      }







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



       if (phase == 1) // screen 1 / "ready"
       {
        GameEngine.SetColor(0,0,0);

        GameDraw.DrawImage(imTextReady, GameEngine.GetWidth()/2 - imTextReady.w/2, boxY - imTextReady.h*1.5);

        GameDraw.DrawImage(imTextPlus, boxX + boxW/2 - imTextPlus.w/2, boxY + boxH/2 - imTextPlus.h/2);

        GameEngine.ResetColor();
       }
       else if (phase >= 10 && phase < 20)
       {
        for (var i = 0; i < dotList.GetSize(); i++)
        {
         dotList.Get(i).Draw();
        }
       }
       else if (phase >= 30 && phase < 40)
       {
        GameEngine.SetColor(0,0,0);
        GameDraw.DrawImage(imTextWhatColor, boxX + (boxW - imTextWhatColor.w)/2, boxY - imTextWhatColor.h*1.5);
        GameEngine.ResetColor();

        probeDot.Draw();
        //dotList.Get(colorProbeDot).Draw(false);

        panel.Draw();

        if (Test1Mode == 1 && panel.GetSelected() != -1)
        {
         GameEngine.ResetColor();
         GameDraw.DrawImage(imDone.Get(0), (GameEngine.GetWidth() - imDone.Get(0).w)/2, GameEngine.GetHeight() - imDone.Get(0).h - 5);
        }
       }
       else if (phase >= 40)
       {
        GameEngine.SetColor(0,0,0);
        GameDraw.DrawImage(imTextWhereDot, boxX, boxY - imTextWhereDot.h*1.5);
        GameDraw.DrawImage(imTextTouchScreen, boxX + boxW/2 - imTextTouchScreen.w/2, boxY + boxH);
        GameEngine.ResetColor();

        probeDot.Draw();

        locDot.Draw();


        if (InBox(locDot.x, locDot.y , locDot.r))
        {
            GameEngine.ResetColor();
            GameDraw.DrawImage(imDone.Get(0), (GameEngine.GetWidth() - imDone.Get(0).w)/2, GameEngine.GetHeight() - imDone.Get(0).h - 5);
        }





       }
}


function OnClickDown(x,y,clickInfo)
{
    var tx = x;
    var ty = y;


    if (phase == 30) // test 1
       {
        panel.OnTouch(tx,ty);

        if (Test1Mode == 1)
        {
         if (ty >= GameEngine.GetHeight() - imDone.Get(0).h - 5 && (panel.GetSelected() != -1))
         {
          phase = 33;
          responseTimeTest1 = clickInfo.GetTime() - responseTimeHold;
         }
        }
        else if (Test1Mode == 0)
        {
         if (panel.GetSelected() != -1)
         {
          phase = 31;
          probeDot.color = panel.GetSelected();
          responseTimeTest1 = clickInfo.GetTime() - responseTimeHold;
         }
        }


       }
       else if (phase == 40) // test 2
       {
        if (InBox(tx,ty, locDot.r))
        {
            test2touchdown = true;
            locDot.x = tx;
            locDot.y = ty;
        }

        else if (InBox(locDot.x, locDot.y , locDot.r) && ty >= GameEngine.GetHeight() - imDone.Get(0).h - 5)
        {
         phase = 41;
         responseTimeTest2 = clickInfo.GetTime() - responseTimeHold;
        }

       }

 
}

function OnClickUp(x,y,clickInfo)
{

    var tx = x;
    var ty = y;

      if (test2touchdown)
      {
        if (InBox(tx,ty, locDot.r))
        {
          locDot.x = tx;
          locDot.y = ty;
        }
          test2touchdown = false;
      }
}

function OnClickMove(x,y,clickInfo)
{

     var tx = x;
     var ty = y;

        if (test2touchdown)
         {
             if (InBox(tx,ty, locDot.r))
             {
              locDot.x = tx;
              locDot.y = ty;
             }
         }
}






        function InBox(tx, ty, r)
        {
            if (tx - r >= boxX && tx + r  <= boxX + boxW && ty - r >= boxY && ty + r <= boxY + boxH)
            {
                return true;
            }

            return false;
        }




function ExportData()
{
    

          

            
            for (var i = 0; i < dotList.GetSize(); i++)
            {
             AddResult("Loc" + (i+1), "" + dotList.Get(i).x + " " + dotList.Get(i).y);
             AddResult("Col" + (i+1), "" + (dotList.Get(i).color+1));
            }

            // colors export at (color+1) because we want colors to be 1-6

            // test 1
            AddResult("ProbedLocation", "" + Math.floor(probeDot.x) + " " + Math.floor(probeDot.y));
            AddResult("ColorChoice", "" + Math.floor(panel.GetSelected()+1));
            AddResult("ColorRT", "" + responseTimeTest1);
            AddResult("TotalColorPicks", "" + panel.totalPicks);

            // test 2
            AddResult("ProbedColor", "" + (locDot.color+1));
            AddResult("FinalLocation", "" + Math.floor(locDot.x - boxX) + " " + Math.floor(locDot.y - boxY));
            AddResult("LocRT", "" + responseTimeTest2);
}


function GetExportIDList()
{
   var ret = [];


    for (var i = 0; i < 6; i++)
    {
        ret.push("Loc" + (i+1));
        ret.push("Col" + (i+1));
    }


  ret.push("ProbedLocation", "ColorChoice", "ColorRT", "TotalColorPicks", "ProbedColor", "FinalLocation", "LocRT");


  return ret;

}