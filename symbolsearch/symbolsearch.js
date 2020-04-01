
Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");
Include("symbolsearch_symbol.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

function Init()
{
  SetName(GetName());
 // SetUpdateLastTrial(true);

 splitLineY = (GameEngine.GetHeight()*3.0/5);
}

function GetName()
{
    return "Symbol Search";
}

function GetInstructions()
{
 // return array of strings for the instructions

 matchPairsTop = GetParamInt("MatchPairsTop", 4);

 //return ["--You will see " + matchPairsTop + " pairs of symbols on the top of the screen and 2 pairs of symbols on the bottom of the screen.", "--As quickly and as accurately as you can, please touch the pair on the bottom that exactly matches one of the pairs on top."];
 /*
return [ "You will see a series of tiles at the top and bottom of the screen.", "",
    "As quickly and as accurately as you can, please touch the title on the bottom of the screen that exactly matches one of the tiles at the top of the screen."
        ];
        */


       return [ [ "You will see a series of symbol tiles. Select the symbol tile from the bottom of the screen that matches a symbol tile on the top.",
                  "img:symbol2.png", "Press [b]Next[/b] to continue."],
                 ["Here is an example of a correct response.", "img:symbol3.png", "Press [b]Start[/b] to begin."]];

}




// -c-END_INTRO--



// create/load images
function LoadImages()
{

        imageSymbol = new GImage();
        imageSymbol.LoadImage("symbols.png");
        //imTestText = GImage.CreateTextImage(new String[]{"test text", "line2","and this is what is on line 3"},32, true);
        imMatchText = GImage_Create.CreateTextImage("Which of these matches\na pair above?",32, true);
        imOrText = GImage_Create.CreateTextImage("or",32, true);

        imFixation  = GImage_Create.CreateTextImage("+",32, true);;



}

let REGULAR = 0;
let LURE = 1;


// generates trials for an entire TrialSet
// if this function is not declared, it will use the default method (each trial has all the trial set params)
function GenerateTrialSet()
{
      // values obtained from TrialSet

       trialNum = GetParamInt("TrialNum", 0);
       lurePerc = GetParamInt("LurePerc", 50);
       leftCorrectPerc = GetParamInt("LeftCorrectPerc", 50);

       correctList = new GList(); // list of correct values
       trialTypeList = new GList(); // type of trials

            lureNum = Math.floor(trialNum*lurePerc*1.0/100);
            leftCorrectNum = Math.floor(trialNum*leftCorrectPerc*1.0/100);
            for (var i = 0; i < trialNum; i++)
            {
                if (i < lureNum){trialTypeList.Add(LURE);}
                else {trialTypeList.Add(REGULAR);}

                if (i < leftCorrectNum){correctList.Add(0);}
                else {correctList.Add(1);}
            }

        // create a list of trial params to send to native app to create trials with
        generateTrialParamList = new GList();
        
      

            for (var i = 0; i < trialNum; i++)
            {
                    params = CopyParams(); // copys and creates a new instance of the TrialSet params
                   
                    params.Put("leftCorrect",""+correctList.PopRandom());
                    if (!HasParam("lure")){params.Put("lure",""+trialTypeList.PopRandom());}
                    generateTrialParamList.Add(params);
            }

      

}

function DrawBlockTransition()
{
    GameEngine.SetColor(169,201, 219);
    //  GameEngine.SetColor(164,176,182);

    GameDraw.DrawBox(0,0,GameEngine.GetWidth(), splitLineY);

    GameEngine.SetColor(164,176,182);

    // GameEngine.ResetColor();

    GameDraw.DrawBox(0,splitLineY,GameEngine.GetWidth(), GameEngine.GetHeight()-splitLineY);

    GameEngine.SetColor(c,c,c);
    GameDraw.DrawBox(0,splitLineY, GameEngine.GetWidth(), 5);
    GameEngine.ResetColor();

    GameEngine.SetColor(108,138,153);
    GameDraw.DrawBox(0,splitLineY+5, GameEngine.GetWidth(), 5);
    GameEngine.ResetColor();


    GameEngine.SetColor(0,0,0);
    GameDraw.DrawImage(imFixation, (GameEngine.GetWidth()-imFixation.GetWidth())/2, (splitLineY-imFixation.GetHeight())/2);
    GameEngine.ResetColor();

}

// --------------------------------
// Individual Trial Functions
// --------------------------------


// run at the start of each trial
function Start()
{
   
            

            lurePerc = GetParamInt("LurePerc", 50);
            leftCorrectPerc = GetParamInt("LeftCorrectPerc", 50);
            feedbackDelay = GetParamInt("FeedbackDelay", 500); //ms
            startDelay = GetParamInt("StartDelay", 1000);
            matchPairsTop = GetParamInt("MatchPairsTop", 4);
            matchPairsBottom = GetParamInt("MatchPairsBottom", 2);
            if (matchPairsTop < 1){matchPairsTop = 1;}
            else if (matchPairsTop > 4){matchPairsTop = 4;}

            phase = 0;

            type = Symbol.REGULAR; // set this as type lure or not

            if (GameEngine.Random(0,100) < lurePerc)
            {

                type = Symbol.LURE;
            }
            
            correct = 1; // set this as correct left or right

            if (GameEngine.Random(0,100) >= leftCorrectPerc)
            {

                correct = 0;
            }

            // if the exact type is given, use it isn't of the randomized value
            if (HasParam("lure"))
            {
                
                type = GetParamInt("lure", 0);

            }
            if (HasParam("leftCorrect"))
            {
                correct = GetParamInt("leftCorrect", 0);
                
            }



         

            symbolList = new GList(); // symbolPair list

            correctTop = GameEngine.RandomFull()%matchPairsTop;
           

            textFade = 0.0;


            getFeedback = GetParamInt("Feedback", 0);
            feedbackOn = getFeedback == 1;






          
            symbolList = new GList();
            symbolListTop = new GList();
            symbolListBottom = new GList();

            selectedSymbol = null;

            selected = -1;


          //  GameEngine.SetFont(doubleFont);




            symbolList.RemoveAll();

            symbolBank = new GList();
            for (i = 0; i < Symbol.MaxType; i++)
            {
             symbolBank.Add(i);
            }

            correctSymbolA = symbolBank.PopRandom();
            correctSymbolB = symbolBank.PopRandom();

            symbolPairCorrectTop = new SymbolPair(imageSymbol, correctSymbolA, correctSymbolB, feedbackOn);
            symbolPairCorrectBottom = new SymbolPair(imageSymbol, correctSymbolA, correctSymbolB, feedbackOn);

            // add all symbols
            // add top
            for (i = 0; i < matchPairsTop; i++)
            {
                if (i == correctTop) // if it is the index of the correct pair then use the correct symbol pair
                {
                 symbolList.Add(symbolPairCorrectTop);
                }
                else
                {
                 symbolList.Add(new SymbolPair(imageSymbol, symbolBank.PopRandom(), symbolBank.PopRandom(), feedbackOn));
                }
                symbolListTop.Add(symbolList.GetLast());
            }
            // add bottom
            for (i = 0; i < matchPairsBottom; i++)
            {
                if (i == correct) // if it is the index of the correct pair then use the correct symbol pair
                {
                    symbolList.Add(symbolPairCorrectBottom);
                }
                else
                {
                    symbolList.Add(new SymbolPair(imageSymbol, symbolBank.PopRandom(), symbolBank.PopRandom(), feedbackOn));
                }
                symbolListBottom.Add(symbolList.GetLast());
            }

            // handle lure trial
            if (this.type == Symbol.LURE)
            {
                pairBank = new GList();
                for (i = 0; i < matchPairsTop; i++)
                {
                 if (i != correctTop)
                 {
                  pairBank.Add(i);
                 }
                }

                // make non correct pairs have 1 match
                for (i = 0; i < symbolListBottom.GetSize(); i++)
                {
                  if (i != correct && pairBank.GetSize() > 0)
                  {
                   h = pairBank.PopRandom();
                   symbolListBottom.Get(i).CopyOne(symbolListTop.Get(h));
                  }
                }

            }



            startLineY = 0;

            if (matchPairsTop == 1)
            {
                symbolList.Get(0).SetTarget(GameEngine.GetWidth()/2, startLineY+(splitLineY-startLineY)/2);


            }
            else if (matchPairsTop == 4)
            {
                symbolListTop.Get(0).SetTarget(GameEngine.GetWidth()/4, startLineY+(splitLineY-startLineY)/4);
                symbolListTop.Get(1).SetTarget(GameEngine.GetWidth()*3.0/4, startLineY+(splitLineY-startLineY)/4);
                symbolListTop.Get(2).SetTarget(GameEngine.GetWidth()/4, startLineY+(splitLineY-startLineY)*3.0/4);
                symbolListTop.Get(3).SetTarget(GameEngine.GetWidth()*3.0/4, startLineY+(splitLineY-startLineY)*3.0/4);
            }
            else if (matchPairsTop == 3)
            {
                symbolListTop.Get(0).SetTarget(GameEngine.GetWidth()/4 - symbolListTop.Get(2).GetWidth()/2, startLineY+(splitLineY-startLineY)/2);
                symbolListTop.Get(1).SetTarget(GameEngine.GetWidth()*2.0/4, startLineY+(splitLineY-startLineY)/2);
                symbolListTop.Get(2).SetTarget(GameEngine.GetWidth()*3.0/4 + symbolListTop.Get(2).GetWidth()/2, startLineY+(splitLineY-startLineY)/2);
            }
            else if (matchPairsTop == 2)
            {
                symbolListTop.Get(0).SetTarget(GameEngine.GetWidth()/4, startLineY+(splitLineY-startLineY)/2);
                symbolListTop.Get(1).SetTarget(GameEngine.GetWidth()*3.0/4, startLineY+(splitLineY-startLineY)/2);

            }

            if (matchPairsBottom == 2)
            {
                bottomSplitLineHeight = GameEngine.GetHeight()-(startLineY+splitLineY );
                symbolListBottom.Get(0).SetTarget(GameEngine.GetWidth()/4, GameEngine.GetHeight() - symbolListBottom.Get(0).GetHeight()/2 - 30);
                symbolListBottom.Get(1).SetTarget(GameEngine.GetWidth()*3.0/4, GameEngine.GetHeight() - symbolListBottom.Get(0).GetHeight()/2 - 30);
            }


            // set to starting position to slide in
            for (i = 0; i < symbolList.GetSize(); i++)
            {
                symbolList.Get(i).SetAtTarget();
                symbolList.Get(i).Shift(GameEngine.GetWidth(), 0);
            }


  
}





function Update()
{
            for (i = 0; i < symbolList.GetSize(); i++)
            {
                symbolList.Get(i).Update();
            }

            if (phase == 0)
            {
                if (AllSymbolsAtTarget())
                {
                    phase = 1;
                    responseTimeHold = GameEngine.GetMilliTime();
                }

            }
            else if (phase == 1) // wait for selection
            {
              if (textFade < 1){textFade = textFade + .2;}
              if (textFade > 1){textFade = 1;}
            }
            else if (phase == 2) // wait for feedback delay
            {
              if (!feedbackOn || GameEngine.GetMilliTime() - feedbackDelayHold >= feedbackDelay)
              {
              //  ExportData();
                CallEndTrial();
                phase = 3;
              }
            }
            else if (phase == 3) // move off screen
            {
                for (i = 0; i < symbolList.GetSize(); i++)
                {
                    symbolList.Get(i).SetTarget(symbolList.Get(i).GetX() - GameEngine.GetWidth(), symbolList.Get(i).GetY() + symbolList.Get(i).GetHeight()/2);
                }
                phase = 4;
            }



}

function Draw()
{
 
// draw background
            c = 0.0;

            //if (curTrial == this) // only draw background if this is the current trial
            if (true)
            {

                GameEngine.SetColor(169,201, 219);
                //  GameEngine.SetColor(164,176,182);
            
                GameDraw.DrawBox(0,0,GameEngine.GetWidth(), splitLineY);
            
                GameEngine.SetColor(164,176,182);
            
                // GameEngine.ResetColor();
            
                GameDraw.DrawBox(0,splitLineY,GameEngine.GetWidth(), GameEngine.GetHeight()-splitLineY);
            
                GameEngine.SetColor(c,c,c);
                GameDraw.DrawBox(0,splitLineY, GameEngine.GetWidth(), 5);
                GameEngine.ResetColor();
            
                GameEngine.SetColor(108,138,153);
                GameDraw.DrawBox(0,splitLineY+5, GameEngine.GetWidth(), 5);
                GameEngine.ResetColor();
            }





            for (i = 0; i < symbolList.GetSize(); i++)
            {
                symbolList.Get(i).Draw(0,0);
            }

            if (phase == 1) // wait for selection
            {
                centerX = (symbolListBottom.Get(0).GetX() + symbolListBottom.Get(1).GetX() + symbolListBottom.Get(1).GetWidth())/2;
                GameEngine.SetColor(0,0,0,textFade);
                //GameDraw.DrawText("Which of these matches", centerX, symbolListBottom.Get(0).GetY() - GameEngine.GetTextSize()*3f+5, true);
                   // GameDraw.DrawText("a pair above?", centerX, symbolListBottom.Get(0).GetY() - GameEngine.GetTextSize()*2f+5, true);
                GameDraw.DrawImage(imMatchText, centerX - imMatchText.w/2, splitLineY + (symbolListBottom.Get(0).GetY() - splitLineY)/2 - imMatchText.h/2);

               // GameDraw.DrawText("or", centerX, symbolListBottom.Get(0).GetY() + symbolListBottom.Get(0).GetHeight()/4, true);
               GameDraw.DrawImage(imOrText, centerX - imOrText.w/2, symbolListBottom.Get(0).GetY() + symbolListBottom.Get(0).GetHeight()/4);

               GameEngine.ResetColor();

            }


/*
           GameEngine.SetColor(1,0,0);
            GameDraw.DrawText("phase:" + phase, 50,50);
            GameDraw.DrawText("symbolList size:" + symbolList.GetSize(), 50,70);
            GameDraw.DrawText("symbolListTop size:" + symbolListTop.GetSize(), 50,90);

            GameDraw.DrawText("pos:" + symbolList.Get(0).position.x + " " + symbolList.Get(0).position.y , 50,110);
             GameDraw.DrawText("posType:" + symbolList.Get(0).position.type, 50,130);

             GameDraw.DrawText("correct:" + correct, 50,150);
             GameDraw.DrawText("lure:" + type, 50,170);*/
        
}


function OnClickDown(x,y,clickInfo)
{
    var tx = x;
    var ty = y;
   if (phase == 1)
            {
                for (i = 0; i < symbolListBottom.GetSize(); i++)
                {
                    if (symbolListBottom.Get(i).PointCollide(tx, ty))
                    {
                        responseTime_old = GameEngine.GetMilliTime() - responseTimeHold;

                        responseTime = clickInfo.GetTime() - responseTimeHold;


                   //    LogMan.Log("DOLPH_TIME_TEST", ""+GameEngine.GetMilliTime() + " " + click.GetTime());

                        phase = 2;
                        selected = i;
                        selectedSymbol = symbolListBottom.Get(i);
                        if (i == correct){selectedSymbol.SetSelectState(2);}
                        else {selectedSymbol.SetSelectState(3);}
                        feedbackDelayHold = clickInfo.GetTime();

                    }
                }
            }

 
}

function OnClickUp(x,y,clickInfo)
{

}

function OnClickMove(x,y,clickInfo)
{

}


 function AllSymbolsAtTarget()
        {

            for (i = 0; i < symbolList.GetSize(); i++)
            {
                if (!symbolList.Get(i).AtTarget())
                {
                    return false;
                }
            }

            return true;
        }



function ExportData()
{
      // trial num, block num, etc included by default
      // AddResult("trial_num", "" + (num+1));

            var strType = "NORMAL";
            if (type == 1){strType = "LURE";}

            AddResult("trial_type", "" + strType);
            AddResult("response_time", "" + responseTime);
            AddResult("response_time_OLD", "" + responseTime_old);
            AddResult("user_response", "" + selected);
            AddResult("correct_response", "" + correct);

}


function GetExportIDList()
{
   return ["trial_type", "response_time", "response_time_OLD", "user_response", "correct_response"];
}