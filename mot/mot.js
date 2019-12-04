Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("mot_stim.js");
Include("GImage_Create.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

function Init()
{ 
 

  // global cogtask variables
  SetName(GetName());

  defaultBoxH = 450;

}

function GetName()
{
    return "Multiple Object Tracking";
}

function GetInstructions()
{
 // return array of strings for the instructions

 

 return ["--Thse are the instructions", "--Follow them."];
 
}





// create/load images
function LoadImages()
{

    cueText = GetParam("CueScreenInstructions", "Follow these dots.");
    responseText = GetParam("ResponseScreenInstructions", "Where are all the GREEN items?");


    
    var bkg = new GColor(0, 176, 80);
    var text = new GColor(1,1,1);
    var border = bkg;
    imSubmitButton = GImage_Create.CreateButtonSet("SUBMIT", 40, true, 450, 70, bkg, bkg, text, border);

    LogMan.Log("DOLPH_MOT", "start load images");

   
    LoadAllParamImages("CueScreenInstructions", 25);
    LoadAllParamImages("ResponseScreenInstructions", 25);



    imCueTextDefault = GImage_Create.CreateTextImage(cueText, 25, true);//GImage_Create.CreateKTextImage(surveyData, gameScreen, cueText, 25, true);
    imResponseTextDefault = GImage_Create.CreateTextImage(responseText, 25, true); //GImage_Create.CreateKTextImage(surveyData, gameScreen, responseText, 25, true);

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
    responseTimeHold = -1
    toggleFrame = 0;

    boxW = 450;
    boxH = GetParamInt("frameHeight", defaultBoxH);

   
  

    boxX = (GameEngine.GetWidth() - boxW)/2;
    boxY = (GameEngine.GetHeight() - defaultBoxH)/2-60;
    boxThickness = 4;
    colorBox = new GColor(0,0,0);

    if (boxH < 400)
    {
      boxH = 400;
      ErrorMan.AddError("Error in multiple object tracking.", "FrameHeight cannot be less than 400!");
     
    }
    if (boxH > 600)
    {
      boxH = 600;
      ErrorMan.AddError("Error in multiple object tracking.", "FrameHeight cannot be greater than 600!");

     }

    trackingItems = GetParamInt("targetStimCount", 3);
    distractorItems = GetParamInt("distractorStimCount", 4);

    cueBeforeTime = GetParamInt("cueBeforeTime", 200);
    cueBlinkTime =  GetParamInt("cueBlinkTime", 500);
    cueShowTime =  GetParamInt("cueShowTime", 1000);
    cueAfterTime =  GetParamInt("cueAfterTime", 200);


    movementTime =  GetParamInt("movementTime", 5000);



    responseTimeoutTime =  GetParamInt("responseTimeout", -1);


    feedbackTime =  GetParamInt("feedbackTime", 1000);

    showAllFeedbackValues = GetParamInt("showAllFeedbackStim", false);

    minResponseCount =  GetParamInt("minResponseCount", 1); //-1 - sets to targetStimCount
    maxResponseCount =  GetParamInt("maxResponseCount", -1); //-1 - sets to targetStimCount, 0 = infinite

    if (maxResponseCount < 0){maxResponseCount = trackingItems;}
    if (minResponseCount < 0){minResponseCount = trackingItems;}

    stimR =  GetParamInt("stimradius", 25);
    stimRepulseFactor =  GetParamInt("stimrepulsefactor", 2);

    stimTouchFactor = GetParamInt("stimtouchfactor", 1.3);
    LogMan.Log("DOLPH_MOT", "stim touch factor: " + stimTouchFactor);
    stimSpeed =  GetParamInt("stimspeed", 3.0);



     targetStimColor = GetParamColor("targetStimColor", "0,176,80");
   wrongFeedbackStimColor = GetParamColor("incorrectColor", "255,0,0");
   inactiveColor = GetParamColor("standardStimColor", "127,127,127");



   stimSelectColor = GetParamColor("selectedColor", "91,155,213");

   feedbackOutlineColor = GetParamColor("feedbackOutlineColor", stimSelectColor.GetColorStr());





   trialCueText = GetParam("CueScreenInstructions", cueText);
    trialResponseText = GetParam("ResponseScreenInstructions", responseText);


    debug_showRepulseFactor = GetParamBool("debug_showrepulsefactor", false);


    maxResponseInfoText = VarSubParam(GetParamString("maxResponseInfoText", "You cannot select any more options!"));
     //maxResponseInfoText = "You cannot select any more options!";



    genGridSize = Math.floor(stimR*stimRepulseFactor*2)+5;
    genGridW = Math.floor(boxW/genGridSize);
    genGridH = Math.floor(boxH/genGridSize);

    if ((genGridW)*(genGridH) < trackingItems + distractorItems)
    {
        // not enough grid locations
        ErrorMan.AddError("Error in multiple object tracking.", "StimR and StimRepulseFactor too high for creating stimuli! All stimuli cannot fit on screen! stimR:" + stimR +" StimRepulseFactor:" + stimRepulseFactor +
        ". Lower these values or reduce stim count.");
      
    }



    // --------------------
    // from native Start()
    // ---------------------
    touchList = new GList();

          phase = 10;

          cueBeforeTrigger = CreateTrigger(cueBeforeTime);
          cueBlinkTrigger = CreateTrigger(cueBlinkTime);
          cueShowTrigger = CreateTrigger(cueShowTime);
          cueAfterTrigger = CreateTrigger(cueAfterTime);

          movementTrigger = CreateTrigger(movementTime);

          responseTimeoutTrigger = CreateTrigger(responseTimeoutTime);

          feedbackTrigger = CreateTrigger(feedbackTime);


          targetStimList = new GList();
          distractorStimList = new GList();
          allStimList = new GList();


          // create gen grid. each gen grid square will be the size of stimR * stimRepulseFactor, plus a bit of a border




          // list of the open gen grid positions
          var openGridLoc = new GList();

          for (var i = 0; i < genGridW; i++)
          {
           for (var j = 0; j < genGridH; j++)
           {
            openGridLoc.Add(i + j*genGridW);
           }
          }





            for (var i = 0; i < trackingItems; i++)
            {
                var cStim = GenStim(1, openGridLoc);

                targetStimList.Add(cStim);

                AddEnt(targetStimList.GetLast());


                allStimList.Add(targetStimList.GetLast());




            }

          for (var i = 0; i < distractorItems; i++)
          {
              var cStim = GenStim(0, openGridLoc);



              distractorStimList.Add(cStim);
              AddEnt(distractorStimList.GetLast());


              allStimList.Add(distractorStimList.GetLast());
          }

          // move all stim for 300 frames
          for (var k = 0; k < 300; k++)
          {
              for (var i = 0; i < allStimList.GetSize(); i++)
              {
                allStimList.Get(i).Move(allStimList);
              }
          }

     


            submitButton = new GButton(imSubmitButton, boxX + boxW/2 - imSubmitButton.Get(0).w/2, GameEngine.GetHeight() - imSubmitButton.Get(0).h - 10);
            submitButton.alpha.Set(0);
            submitButton.alpha.SetSpeed(.2);

            var imCueText = ReadParamImage(trialCueText, imCueTextDefault);
            entCueText = new Entity(imCueText, imCueText.GetCenterX(), boxY - imCueText.h - 5);
            entCueText.alpha.Set(0);
            entCueText.alpha.SetSpeed(.2);
            entCueText.SetColor(new GColor(0,0,0));
            var imResponseText = ReadParamImage(trialResponseText, imResponseTextDefault);
            entResponseText = new Entity(imResponseText, imResponseText.GetCenterX(), boxY - imResponseText.h - 5);
            entResponseText.alpha.Set(0);
            entResponseText.alpha.SetSpeed(.2);
            entResponseText.SetColor(new GColor(0,0,0));

            AddEnt(entCueText);
            AddEnt(entResponseText);


            // create the string for export that shows the starting positions of the stim

            startingStimExpString = ExportStimList(allStimList);


}


   // generate stim based on open grid positions
   function GenStim(targetStim, openGridLoc)
   {
       var cStim = null;
       cStim = new Stim(this, targetStim);

       var gridLoc = openGridLoc.PopRandom();

       // get 2d coordinates from 1d open grid loc
       var createX = gridLoc%genGridW;
       var createY = gridLoc/genGridW;

       cStim.position.Set(boxX + createX*genGridSize + stimR, boxY + createY*genGridSize + stimR);

       return cStim;
   }





function Update()
{
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
              for (var i = 0; i < targetStimList.GetSize(); i++)
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
              for (var i = 0; i < targetStimList.GetSize(); i++)
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
              for (var i = 0; i < targetStimList.GetSize(); i++)
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


              for (var i = 0; i < allStimList.GetSize(); i++)
              {
                  allStimList.Get(i).StartMovement();
              }



          }
          else if (phase == 21)
          {



              for (var i = 0; i < allStimList.GetSize(); i++)
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

                  for (var i = 0; i < allStimList.GetSize(); i++)
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
              var selectedCount = CountSelected();

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
              for (var i = 0; i < allStimList.GetSize(); i++)
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
           CallEndTrial();
          }

          submitButton.Update();


}

function Draw()
{

    GameEngine.SetColor(colorBox);
    GameDraw.DrawBox(boxX, boxY, boxW, boxThickness);
    GameDraw.DrawBox(boxX, boxY, boxThickness, boxH);
    GameDraw.DrawBox(boxX, boxY + boxH - boxThickness, boxW, boxThickness);
    GameDraw.DrawBox(boxX + boxW - boxThickness, boxY, boxThickness, boxH);



    submitButton.Draw();

        
}

function CountSelected()
        {
            var selectedCount = 0;
            for (var i = 0; i < allStimList.GetSize(); i++)
            {
                if (allStimList.Get(i).IsSelected())
                {
                    selectedCount++;
                }
            }

            return selectedCount;
        }

function OnClickDown(tx,ty,click)
{
    
    if (phase == 30)
    {
       var isOn = -1;
       var stimHit = -1;

        var selectedCount = CountSelected();

       if (submitButton.CheckPressed(tx,ty) && selectedCount >= minResponseCount)
       {
        totalResponseTime = click.GetTime() - responseTimeHold;
        phase = 31;
        return;
       }


       var colStim = null;


       // check pressed stim
       for (var i = 0; i < allStimList.GetSize(); i++)
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


        touchList.Add(new String("%d_down_%d_%d_%d_%d", Math.floor(click.GetTime()-responseTimeHold), Math.floor(tx),Math.floor(ty), stimHit, isOn));

        

    }
}

function OnClickUp(tx,ty,click)
{
 
}

function OnClickMove(tx,ty,click)
{
  
}





function ExportData()
{
    /*results.NextTrial();

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

            results.AddResult("touch_list", touchListString);*/

         



          
}

   function ExportStimList(stimList)
            {
                var expString = "";
                for (var  i = 0; i < stimList.GetSize(); i++)
                {
                    expString = expString + stimList.Get(i).ExportData(i);
                    if (i < stimList.GetSize()-1){expString = expString + " ";}
                }
                return expString;
            }