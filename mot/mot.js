package Game.MultipleObjectTracking;


import Game.Tools.Entity;
import Game.Tools.GButton;
import Game.Tools.KPosition;
import Game.Tools.KTrigger;
import Game.TrialBasedGame;
import Log.ErrorMan;
import Log.LogMan;
import OpenGLEngine.GBox;
import OpenGLEngine.GColor;
import OpenGLEngine.GImage;
import OpenGLEngine.GImage_Create;
import OpenGLEngine.GameDraw;
import OpenGLEngine.GameEngine;
import Survey.Screen.GameScreen;
import Survey.SurveyData;
import Survey.SurveySettings;
import Tools.GList;
import Tools.KTime;



public class GameMultipleObjectTracking extends TrialBasedGame
{


    public GameMultipleObjectTracking(SurveyData sD, GameParams params, GameScreen gS, SurveySettings setSettings)
    {
        super(sD, params, gS, setSettings);

        // ReadyTime = GVars.ReadMapInt(varMap, "ReadyTime", 1000);



        instructions = new String[] { "-You will be shown items to follow.",
                "-Then all objects will turn to the same color and move around the screen.",
                "-At the end of each trial, report the objects initially shown to you."};

        SetName("Multiple Object Tracking");


        cueText = params.GetString("CueScreenInstructions", "Follow these dots.");
        responseText = params.GetString("ResponseScreenInstructions", "Where are all the GREEN items?");



        // create trials
        AddAllTrials();
    }







    void AddAllTrials()
    {
       int overallTrialNum = 0;

        // go through list of all blocks
        GList<GameParams> blockParamList = gameParams.GetSubParamList("block");
        for (int i = 0; i < blockParamList.GetSize(); i++)
        {
            NewBlock();
            GameParams blockParam = blockParamList.Get(i);
            GList<GameParams> trialSetList = blockParam.GetSubParamList("trialset");

            // go through list of all trial sets
            for (int j = 0; j < trialSetList.GetSize(); j++)
            {
                GameParams trialSetParam = trialSetList.Get(j);


                int trialCount = trialSetParam.GetInt("trialnum", 0);
                // go through and add one trial corresponding to "TrialNum" in the trial set
                for (int k = 0; k < trialCount; k++)
                {
                    // create the parameters for use in the actual trial


                    // use the params in this trialset for the trials
                    AddTrial(new Trial(trialSetParam, overallTrialNum), j);
                    overallTrialNum++;

                    if (ErrorMan.IsError()){break;}
                }

                if (trialSetParam.GetBool("randomizetrialsets", false))
                {
                    RandomizeTrialsInBlock();
                }

            }

            if (blockParam.GetBool("randomizeblocks", false))
            {
                RandomizeBlocks();
            }


        }

        UpdateTrialNumOrder();
    }



    GImage[] imSubmitButton;

    GImage imCueText;
    GImage imResponseText;

    String cueText = "Follow the GREEN items.";
    String responseText = "Where are all the GREEN items?";




    @Override
    public void LoadImages()
    {
        super.LoadImages();

        GColor bkg = new GColor(0, 176, 80);
        GColor text = new GColor(1,1,1);
        GColor border = bkg;
        imSubmitButton = GImage_Create.CreateButtonSet("SUBMIT", 40, true, 450, 70, bkg, bkg, text, border);

        LogMan.Log("DOLPH_MOT", "start load images");


        LoadAllParamImages(gameParams, "CueScreenInstructions", 25);
        LoadAllParamImages(gameParams, "ResponseScreenInstructions", 25);


        imCueText = GImage_Create.CreateKTextImage(surveyData, gameScreen, cueText, 25, true);
        imResponseText = GImage_Create.CreateKTextImage(surveyData, gameScreen, responseText, 25, true);
    }




    @Override
    public void Start()
    {
        super.Start();

        this.SetBlockTransition(new BlockTransition(blockTransitionTime, imFixation));

    }



    public class Trial extends TrialBasedGame.Trial
    {
        public Trial(GameParams trialParams, int snum)
        {
            super (snum);

            this.trialParams = trialParams;


            boxH = trialParams.GetInt("frameHeight", defaultBoxH);

            if (boxH < 400)
            {
              boxH = 400;
                ErrorMan.ErrorMon err = new ErrorMan.ErrorMon("Error in multiple object tracking.", "FrameHeight cannot be less than 400!");
                ErrorMan.AddError(err);
            }
            if (boxH > 600)
            {
              boxH = 600;
                ErrorMan.ErrorMon err = new ErrorMan.ErrorMon("Error in multiple object tracking.", "FrameHeight cannot be greater than 600!");
                ErrorMan.AddError(err);
             }

            trackingItems = trialParams.GetInt("targetStimCount", 3);
            distractorItems = trialParams.GetInt("distractorStimCount", 4);

            cueBeforeTime = trialParams.GetInt("cueBeforeTime", 200);
            cueBlinkTime =  trialParams.GetInt("cueBlinkTime", 500);
            cueShowTime =  trialParams.GetInt("cueShowTime", 1000);
            cueAfterTime =  trialParams.GetInt("cueAfterTime", 200);


            movementTime =  trialParams.GetInt("movementTime", 5000);



            responseTimeoutTime =  trialParams.GetInt("responseTimeout", -1);


            feedbackTime =  trialParams.GetInt("feedbackTime", 1000);

            showAllFeedbackValues = trialParams.GetBool("showAllFeedbackStim", false);

            minResponseCount =  trialParams.GetInt("minResponseCount", 0); //-1 - sets to targetStimCount
            maxResponseCount =  trialParams.GetInt("maxResponseCount", -1); //-1 - sets to targetStimCount, 0 = infinite

            if (maxResponseCount < 0){maxResponseCount = trackingItems;}
            if (minResponseCount < 0){minResponseCount = trackingItems;}

            stimR =  trialParams.GetInt("stimradius", 25);
            stimRepulseFactor =  trialParams.GetFloat("stimrepulsefactor", 2);

            stimTouchFactor =  trialParams.GetFloat("stimtouchfactor", 1.3f);
            LogMan.Log("DOLPH_MOT", "stim touch factor: " + stimTouchFactor);
            stimSpeed =  trialParams.GetFloat("stimspeed", 3.0f);



             targetStimColor = trialParams.GetColor("targetStimColor", "0,176,80");
           wrongFeedbackStimColor = trialParams.GetColor("incorrectColor", "255,0,0");
           inactiveColor = trialParams.GetColor("standardStimColor", "127,127,127");



           stimSelectColor = trialParams.GetColor("selectedColor", "91,155,213");

           feedbackOutlineColor = trialParams.GetColor("feedbackOutlineColor", stimSelectColor.GetColorStr());





           trialCueText = trialParams.GetString("CueScreenInstructions", cueText);
            trialResponseText = trialParams.GetString("ResponseScreenInstructions", responseText);


            debug_showRepulseFactor = trialParams.GetBool("debug_showrepulsefactor", false);


            maxResponseInfoText = VarSubParam(trialParams,trialParams.GetString("maxResponseInfoText", "You cannot select any more options!"));




            genGridSize = (int)(stimR*stimRepulseFactor*2)+5;
            genGridW = boxW/genGridSize;
            genGridH = boxH/genGridSize;

            if ((genGridW)*(genGridH) < trackingItems + distractorItems)
            {
                // not enough grid locations
                ErrorMan.ErrorMon err = new ErrorMan.ErrorMon("Error in multiple object tracking.", "StimR and StimRepulseFactor too high for creating stimuli! All stimuli cannot fit on screen! stimR:" + stimR +" StimRepulseFactor:" + stimRepulseFactor +
                ". Lower these values or reduce stim count.");
                ErrorMan.AddError(err);
            }


        }

        boolean debug_showRepulseFactor = false;

        GameParams trialParams;

        int genGridSize;
        int genGridW;
        int genGridH;



        int trackingItems = 3;
        int distractorItems = 4;

        int stimR = 20;
        float stimRepulseFactor;
        float stimSpeed;
        float stimTouchFactor;

        int boxW = 450;
        int boxH = 600;
        final int defaultBoxH = 450;
        int boxX = (GameEngine.SCREEN_W - boxW)/2;
        int boxY = (GameEngine.SCREEN_H - defaultBoxH)/2-60;
        int boxThickness = 4;
        GColor colorBox = new GColor(0,0,0);

        String maxResponseInfoText = "You cannot select any more options!";


        GList<Stim> targetStimList;
        GList<Stim> distractorStimList;

        GList<Stim> allStimList;


        GButton submitButton;


        Entity entCueText;
        Entity entResponseText;


        String trialCueText;
        String trialResponseText;


        String startingStimExpString = "";


        GList<String> touchList;


        boolean showAllFeedbackValues = false;


        @Override
        public void Start()
        {
          touchList = new GList<String>();

          phase = 10;

          cueBeforeTrigger = CreateTrigger(cueBeforeTime);
          cueBlinkTrigger = CreateTrigger(cueBlinkTime);
          cueShowTrigger = CreateTrigger(cueShowTime);
          cueAfterTrigger = CreateTrigger(cueAfterTime);

          movementTrigger = CreateTrigger(movementTime);

          responseTimeoutTrigger = CreateTrigger(responseTimeoutTime);

          feedbackTrigger = CreateTrigger(feedbackTime);


          targetStimList = new GList<Stim>();
          distractorStimList = new GList<Stim>();
          allStimList = new GList<Stim>();


          // create gen grid. each gen grid square will be the size of stimR * stimRepulseFactor, plus a bit of a border




          // list of the open gen grid positions
          GList<Integer> openGridLoc = new GList<Integer>();

          for (int i = 0; i < genGridW; i++)
          {
           for (int j = 0; j < genGridH; j++)
           {
            openGridLoc.Add(i + j*genGridW);
           }
          }





            for (int i = 0; i < trackingItems; i++)
            {
                Stim cStim = GenStim(1, openGridLoc);

                targetStimList.Add(cStim);

                AddEnt(targetStimList.GetLast());


                allStimList.Add(targetStimList.GetLast());




            }

          for (int i = 0; i < distractorItems; i++)
          {
              Stim cStim = GenStim(0, openGridLoc);



              distractorStimList.Add(cStim);
              AddEnt(distractorStimList.GetLast());


              allStimList.Add(distractorStimList.GetLast());
          }

          // move all stim for 300 frames
          for (int k = 0; k < 300; k++)
          {
              for (int i = 0; i < allStimList.GetSize(); i++)
              {
                allStimList.Get(i).Move(allStimList);
              }
          }


            submitButton = new GButton(imSubmitButton, boxX + boxW/2 - imSubmitButton[0].w/2, GameEngine.GetHeight() - imSubmitButton[0].h - 10);
            submitButton.alpha.Set(0);
            submitButton.alpha.SetSpeed(.2f);

            GImage imCueText = ReadParamImage(trialParams, trialCueText);
            entCueText = new Entity(imCueText, imCueText.GetCenterX(), boxY - imCueText.h - 5);
            entCueText.alpha.Set(0);
            entCueText.alpha.SetSpeed(.2f);
            entCueText.SetColor(new GColor(0,0,0));
            GImage imResponseText = ReadParamImage(trialParams, trialResponseText);
            entResponseText = new Entity(imResponseText, imResponseText.GetCenterX(), boxY - imResponseText.h - 5);
            entResponseText.alpha.Set(0);
            entResponseText.alpha.SetSpeed(.2f);
            entResponseText.SetColor(new GColor(0,0,0));

            AddEnt(entCueText);
            AddEnt(entResponseText);


            // create the string for export that shows the starting positions of the stim

            startingStimExpString = ExportStimList(allStimList);

        }

        // generate stim based on open grid positions
        public Stim GenStim(int targetStim, GList<Integer> openGridLoc)
        {
            Stim cStim = null;
            cStim = new Stim(this, targetStim);

            int gridLoc = openGridLoc.PopRandom();

            // get 2d coordinates from 1d open grid loc
            int createX = gridLoc%genGridW;
            int createY = gridLoc/genGridW;

            cStim.position.Set(boxX + createX*genGridSize + stimR, boxY + createY*genGridSize + stimR);

            return cStim;
        }

        // generate stim based on locations of other stim
        @Deprecated
        public Stim GenStim(int targetStim)
        {
            Stim cStim = null;

            int a = 0;
            while (a < 100)
            {
                a++;
                // get random location
                float createX = GameEngine.Random(boxX + stimR, boxX+boxW-stimR*2);
                float createY = GameEngine.Random(boxY + stimR, boxY+boxH-stimR*2);

                // create stim
                cStim = new Stim(this, targetStim);
                cStim.position.Set(createX, createY);

                // make sure we aren't in the repulsion zone of another stim
                boolean clear = true;
                for (int j = 0; j < allStimList.GetSize(); j++)
                {
                    if (cStim.InRepulsionZone(allStimList.Get(j)))
                    {
                        clear = false;
                    }
                }

                if (clear)
                {
                  // if the stim is clear of all other stims, then keep this one
                    break;
                }

            }

            return cStim;

        }




        GColor targetStimColor = new GColor(0,1,0);
        GColor wrongFeedbackStimColor = new GColor(1,0,0);
        GColor inactiveColor = new GColor(.5f,.5f,.5f);

        GColor stimSelectColor = new GColor(0,0,1);

        GColor feedbackOutlineColor = new GColor(0,0,1);


        int cueBeforeTime = 200; // time to show all stim before the target stim are given
        int cueBlinkTime = 500; // time to blink in the target stim
        int cueShowTime = 1000; // time to show the target stim
        int cueAfterTime = 200;  // time to show all stim after the cue

        KTrigger cueBeforeTrigger;
        KTrigger cueBlinkTrigger;
        KTrigger cueShowTrigger;
        KTrigger cueAfterTrigger;

        int movementTime = 5000; // time for the stim to move
        KTrigger movementTrigger;


        int responseTimeoutTime = -1; // time until timeout in response (-1 is infinite)
        KTrigger responseTimeoutTrigger;

        int feedbackTime = 1000; // time to show the feedback screen
        KTrigger feedbackTrigger;

        int minResponseCount = 0; // minimum number of stim that needs to be selected to show the "submit" button.
        int maxResponseCount; // max number of stim that can be selected.


        long responseTimeHold = -1;
        long totalResponseTime; // time when the user pressed the submit button

        // flow

        // cue phase - shows stim to be followed (turns color). ends with stim all the same color again.
        // movement phase - stim move around on screen.
        // response phase - waits for user to choose all stim
        // feedback phase - show correct or not

        int toggleFrame = 0;

        @Override
        public void Update()
        {
            super.Update();
            // cue phase

            // before cue time
            if (phase == 10)
            {
                entCueText.alpha.SetTarget(1);
                cueBeforeTrigger.TriggerStart();

                if (cueBeforeTrigger.Check())
                {
                  phase = 11;
                }


            }
            // cue blink time
            else if (phase == 11)
            {

               toggleFrame++;
               if (toggleFrame%8 == 0)
               {
                for (int i = 0; i < targetStimList.GetSize(); i++)
                {
                    targetStimList.Get(i).ToggleActive();
                }
               }

                cueBlinkTrigger.TriggerStart();
                if (cueBlinkTrigger.Check())
                {
                    phase = 12;
                }
            }
            // cue show time
            else if (phase == 12)
            {
                for (int i = 0; i < targetStimList.GetSize(); i++)
                {
                 targetStimList.Get(i).SetActive(true);
                }


                cueShowTrigger.TriggerStart();
                if (cueShowTrigger.Check())
                {
                    phase = 13;
                }
            }
            // cue after time
            else if (phase == 13)
            {
                entCueText.alpha.SetTarget(0);
                for (int i = 0; i < targetStimList.GetSize(); i++)
                {
                    targetStimList.Get(i).SetActive(false);
                }

                cueAfterTrigger.TriggerStart();
                if (cueAfterTrigger.Check())
                {
                    phase = 20;
                }
            }
            // -------------------------
            // movement phase
            // -------------------------
            else if (phase == 20)
            {
                movementTrigger.TriggerStart();
                phase = 21;


                for (int i = 0; i < allStimList.GetSize(); i++)
                {
                    allStimList.Get(i).StartMovement();
                }



            }
            else if (phase == 21)
            {



                for (int i = 0; i < allStimList.GetSize(); i++)
                {
                    allStimList.Get(i).Move(allStimList);

                  /*  for (int j = i+1; j < allStimList.GetSize(); j++)
                    {
                        if (allStimList.Get(i).IsCollide(allStimList.Get(j)))
                        {
                            allStimList.Get(i).OnCollide(allStimList.Get(j));
                        }
                    }*/

                }


                if (movementTrigger.Check())
                {

                    for (int i = 0; i < allStimList.GetSize(); i++)
                    {
                        allStimList.Get(i).EndMovement();
                    }
                    phase = 30;
                }

            }

            // --------------------------
            // ---------------------------

            // ----------------------
            // response phase
            // ----------------------
            else if (phase == 30)
            {
                if (responseTimeHold < 0)
                {
                 responseTimeHold = KTime.GetMilliTime();
                }

                entResponseText.alpha.SetTarget(1);
                int selectedCount = CountSelected();

                if (selectedCount >= minResponseCount)
                {
                 submitButton.alpha.SetTarget(1);
                }
                else
                {
                    submitButton.alpha.SetTarget(0);
                }
                // waits for response or timeout
                responseTimeoutTrigger.TriggerStart();
                if (responseTimeoutTrigger.Check())
                {
                  // timed out
                  phase = 31;
                }

            }
            else if (phase == 31)
            {
               GameEngine.CloseMessageBox();
                entResponseText.alpha.SetTarget(0);
                submitButton.alpha.SetTarget(0);
               // response was given
               phase = 40;
            }


            // feedback phase

            else if (phase == 40)
            {
                for (int i = 0; i < allStimList.GetSize(); i++)
                {
                 if (allStimList.Get(i).IsSelected() || allStimList.Get(i).IsTarget() && showAllFeedbackValues)
                 {
                  // set active all seleted stim.
                  // this shows their true values
                  allStimList.Get(i).SetActive(true);
                 }
                }

                feedbackTrigger.TriggerStart();
                if (feedbackTrigger.Check())
                {
                 phase = 50;
                }

            }

            else if (phase == 50)
            {
             ExportData();
             phase = 51;
            }
            else if (phase == 51)
            {
             complete = true;
            }

            submitButton.Update();
        }

        @Override
        public void Draw()
        {
            super.Draw();

         // draw background box
            GameEngine.SetColor(colorBox);
            GameDraw.DrawBox(boxX, boxY, boxW, boxThickness);
            GameDraw.DrawBox(boxX, boxY, boxThickness, boxH);
            GameDraw.DrawBox(boxX, boxY + boxH - boxThickness, boxW, boxThickness);
            GameDraw.DrawBox(boxX + boxW - boxThickness, boxY, boxThickness, boxH);



            submitButton.Draw();

          //  GameEngine.SetColor(1,0,0);
          //  GameDraw.DrawText("trial:" + num, 50, 50);
        }

        public int CountSelected()
        {
            int selectedCount = 0;
            for (int i = 0; i < allStimList.GetSize(); i++)
            {
                if (allStimList.Get(i).IsSelected())
                {
                    selectedCount++;
                }
            }

            return selectedCount;
        }

        @Override
        public void OnClickDown(float tx, float ty, GameEngine.ClickInfo click)
        {
            if (phase == 30)
            {
               int isOn = -1;
               int stimHit = -1;

                int selectedCount = CountSelected();

               if (submitButton.CheckPressed(tx,ty) && selectedCount > 0)
               {
                totalResponseTime = click.GetTime() - responseTimeHold;
                phase = 31;
                return;
               }


               Stim colStim = null;


               // check pressed stim
               for (int i = 0; i < allStimList.GetSize(); i++)
               {
                if (allStimList.Get(i).PointCollide(tx,ty))
                {
                    // each touch can only toggle one stim.
                    // find the closest stim that collides with the touch
                    if (colStim == null || allStimList.Get(i).position.DistTo(tx,ty) < colStim.position.DistTo(tx,ty))
                    {
                     colStim = allStimList.Get(i);
                    }
                }
               }

               if (colStim != null)
               {
                   if (selectedCount < maxResponseCount || maxResponseCount == 0 || colStim.IsSelected()) // always able to deselect
                   {
                       colStim.ToggleSelected();
                       isOn = 0;
                       if (colStim.IsSelected()){isOn = 1;}
                   }
                   else
                   {
                       GameEngine.MessageBox(maxResponseInfoText);
                   }


                   stimHit = allStimList.FindElement(colStim);
               }


                touchList.Add(String.format("%d_down_%d_%d_%d_%d", (int)(click.GetTime()-responseTimeHold), (int)tx,(int)ty, stimHit, isOn));


            }
        }

        @Override
        public void OnClickUp(float tx, float ty, GameEngine.ClickInfo click)
        {


        }


        @Override
        public void ExportData()
        {
            results.NextTrial();

            ExportHeaderData(GetTrialUUID());

            ExportTrialHeader(results);

            results.AddResult("movement_algorithm", "TMB_1.04");

            results.AddResult("target_num", trackingItems);
            results.AddResult("distractor_num", distractorItems);

            results.AddResult("min_response_count", minResponseCount);
            results.AddResult("max_response_count", maxResponseCount);

            results.AddResult("stim_radius", stimR);
            results.AddResult("stim_speed", ""+stimSpeed);
            results.AddResult("stim_repulse_factor", ""+stimRepulseFactor);
            results.AddResult("stim_touch_factor", ""+stimTouchFactor);

            results.AddResult("target_stim_color", targetStimColor.GetColorStr());
            results.AddResult("standard_stim_color", inactiveColor.GetColorStr());
            results.AddResult("selected_color", stimSelectColor.GetColorStr());
            results.AddResult("feedback_outline_color", feedbackOutlineColor.GetColorStr());
            results.AddResult("incorrect_color", wrongFeedbackStimColor.GetColorStr());


            results.AddResult("t_cueBeforeTime", cueBeforeTime);
            results.AddResult("a_cueBeforeTime", ""+cueBeforeTrigger.GetActualDisplayTime());

            results.AddResult("t_cueBlinkTime", cueBlinkTime);
            results.AddResult("a_cueBlinkTime", ""+cueBlinkTrigger.GetActualDisplayTime());

            results.AddResult("t_cueShowTime", cueShowTime);
            results.AddResult("a_cueShowTime", ""+cueShowTrigger.GetActualDisplayTime());

            results.AddResult("t_cueAfterTime", cueAfterTime);
            results.AddResult("a_cueAfterTime", ""+cueAfterTrigger.GetActualDisplayTime());

            results.AddResult("t_movementTime", movementTime);
            results.AddResult("a_movementTime", ""+movementTrigger.GetActualDisplayTime());

            results.AddResult("stim_speed",""+stimSpeed);
            results.AddResult("stim_repulse",""+stimRepulseFactor);

            results.AddResult("t_feedbackTime", feedbackTime);
            results.AddResult("a_feedbackTime", ""+feedbackTrigger.GetActualDisplayTime());

            results.AddResult("t_responseTimeout", responseTimeoutTime);
            results.AddResult("a_responseTimeout", ""+responseTimeoutTrigger.GetActualDisplayTime());

            results.AddResult("totalResponseTime", "" + totalResponseTime);


           // export stim lists
            String endingStimExpString = ExportStimList(allStimList);

            results.AddResult("starting_stim_list", startingStimExpString);
            results.AddResult("ending_stim_list", endingStimExpString);

            GList<Stim> stimSelectList = new GList<Stim>();
            for (int i = 0; i < allStimList.GetSize(); i++)
            {
             if (allStimList.Get(i).IsSelected())
             {
              stimSelectList.Add(allStimList.Get(i));
             }
            }

            String selectedStimExpString = ExportStimList(stimSelectList);

            results.AddResult("selected_stim_list", selectedStimExpString);


            String touchListString = "";
            for (int i = 0; i < touchList.GetSize(); i++)
            {
             touchListString = touchListString + touchList.Get(i);
             if (i < touchList.GetSize() - 1){touchListString = touchListString + " ";}
            }

            results.AddResult("touch_list", touchListString);



        }





    }

    static public String ExportStimList(GList<Stim> stimList)
    {
        String expString = "";
        for (int i = 0; i < stimList.GetSize(); i++)
        {
            expString = expString + stimList.Get(i).ExportData(i);
            if (i < stimList.GetSize()-1){expString = expString + " ";}
        }
        return expString;
    }





    





    class BlockTransition extends TrialBasedGame.BlockTransition
    {

        public BlockTransition( long dispTime, GImage imFix)
        {
            super(null, dispTime);
            this.imFix = imFix;

        }

        @Override
        public void ModifyTransition(TrialBasedGame.Trial lastTrial, TrialBasedGame.Trial nextTrial)
        {
          if (nextTrial instanceof Trial)
          {
            Trial trial = (Trial)nextTrial;
            boxX = trial.boxX;
            boxY = trial.boxY;
            boxW = trial.boxW;
            boxH = trial.boxH;
          }

        }

        GColor colorBox = new GColor(0,0,0);
        GImage imFix;

        int boxW = 450;
        int boxH = 450;
        int boxX = (GameEngine.SCREEN_W - boxW)/2;
        int boxY = (GameEngine.SCREEN_H - boxH)/2-60;
        int boxThickness = 4;


        @Override
        public void Draw()
        {
            GameEngine.SetColor(colorBkg);
            GameDraw.DrawBox(0,0,GameEngine.GetWidth(), GameEngine.GetHeight());
            GameEngine.ResetColor();



            // draw box

            GameEngine.SetColor(colorBox);
            GameDraw.DrawBox(boxX, boxY, boxW, boxThickness);
            GameDraw.DrawBox(boxX, boxY, boxThickness, boxH);
            GameDraw.DrawBox(boxX, boxY + boxH - boxThickness, boxW, boxThickness);
            GameDraw.DrawBox(boxX + boxW - boxThickness, boxY, boxThickness, boxH);

            if (useFixationImage == 1)
            {
                GameDraw.DrawImage(imFix, boxX + (boxW-imFix.w)/2,  boxY + (boxH-imFix.h)/2);
            }

        }
    }
}