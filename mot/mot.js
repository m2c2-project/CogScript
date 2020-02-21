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

/*
 return ["Colored shapes will appear briefly on the screen.", "", "", "Try to remember the shapes and their colors, because they will soon disappear.",
          "", "", "Next, you will see the same shapes reappear.", "", "", "Please answer whether the shapes have the SAME or DIFFERENT colors as they had before."];
 */

  var targetCount = GetParamInt("targetStimCount", 3);
  var responseTimeoutTime =  GetParamInt("responseTimeout", 20000)/1000;

 return ["Keep track and follow the green dots that will flash briefly at the start of each trial to the best of your ability.", "",
        "You will be asked to report their location at the end of each trial.", "",
        "When selecting your responses, selected circles will highlight in blue.", "",
        "After submitting your response, correctly recalled circles will highlight in green and incorrectly recalled circles will highlight in red.", "",
        "If a response is not provided after " + responseTimeoutTime + " seconds, the next trial will begin automatically."];
 
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

    totalResponseTime = -1;
  

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


        //touchList.Add(new String("%d_down_%d_%d_%d_%d", Math.floor(click.GetTime()-responseTimeHold), Math.floor(tx),Math.floor(ty), stimHit, isOn));


        var addStr = "" + Math.floor(click.GetTime()-responseTimeHold) + "_down_" + Math.floor(tx) + "_" + Math.floor(ty) + "_" + stimHit + "_" + isOn;
        touchList.Add(addStr);
        

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
   

         


            AddResult("movement_algorithm", "TMB_1.04");

            AddResult("target_num", trackingItems);
            AddResult("distractor_num", distractorItems);

            AddResult("min_response_count", minResponseCount);
            AddResult("max_response_count", maxResponseCount);

            AddResult("stim_radius", stimR);
            AddResult("stim_speed", ""+stimSpeed);
            AddResult("stim_repulse_factor", ""+stimRepulseFactor);
            AddResult("stim_touch_factor", ""+stimTouchFactor);

            AddResult("target_stim_color", targetStimColor.GetColorStr());
            AddResult("standard_stim_color", inactiveColor.GetColorStr());
            AddResult("selected_color", stimSelectColor.GetColorStr());
            AddResult("feedback_outline_color", feedbackOutlineColor.GetColorStr());
            AddResult("incorrect_color", wrongFeedbackStimColor.GetColorStr());


            AddResult("t_cueBeforeTime", cueBeforeTime);
            AddResult("a_cueBeforeTime", ""+cueBeforeTrigger.GetActualDisplayTime());

            AddResult("t_cueBlinkTime", cueBlinkTime);
            AddResult("a_cueBlinkTime", ""+cueBlinkTrigger.GetActualDisplayTime());

            AddResult("t_cueShowTime", cueShowTime);
            AddResult("a_cueShowTime", ""+cueShowTrigger.GetActualDisplayTime());

           


            AddResult("t_cueAfterTime", cueAfterTime);
            AddResult("a_cueAfterTime", ""+cueAfterTrigger.GetActualDisplayTime());

            AddResult("t_movementTime", movementTime);
            AddResult("a_movementTime", ""+movementTrigger.GetActualDisplayTime());

            AddResult("t_feedbackTime", feedbackTime);
            AddResult("a_feedbackTime", ""+feedbackTrigger.GetActualDisplayTime());

            AddResult("t_responseTimeout", responseTimeoutTime);
            AddResult("a_responseTimeout", ""+responseTimeoutTrigger.GetActualDisplayTime());

            AddResult("totalResponseTime", "" + totalResponseTime);


           // export stim lists
            var endingStimExpString = ExportStimList(allStimList);

            AddResult("starting_stim_list", startingStimExpString);
            AddResult("ending_stim_list", endingStimExpString);

            var stimSelectList = new GList();
            for (var i = 0; i < allStimList.GetSize(); i++)
            {
             if (allStimList.Get(i).IsSelected())
             {
              stimSelectList.Add(allStimList.Get(i));
             }
            }

            var selectedStimExpString = ExportStimList(stimSelectList);

            AddResult("selected_stim_list", selectedStimExpString);

          


            var touchListString = "";
            for (var i = 0; i < touchList.GetSize(); i++)
            {
             touchListString = touchListString + touchList.Get(i);
             if (i < touchList.GetSize() - 1){touchListString = touchListString + " ";}
            }

            AddResult("touch_list", touchListString);

         



          
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




            function GetExportIDList()
            {
               return  ["movement_algorithm", "target_num", "distractor_num", "min_response_count", "max_response_count", "stim_radius",
               "stim_speed", "stim_repulse_factor", "stim_touch_factor", "target_stim_color", "standard_stim_color", "selected_color",
               "feedback_outline_color", "incorrect_color", "t_cueBeforeTime", "a_cueBeforeTime", "t_cueBlinkTime", "a_cueBlinkTime",
               "t_cueShowTime","a_cueShowTime", "t_cueAfterTime", "a_cueAfterTime", "t_movementTime", "a_movementTime", "t_feedbackTime",
               "a_feedbackTime", "t_responseTimeout", "a_responseTimeout", "totalResponseTime",  "starting_stim_list",  "ending_stim_list",
               "selected_stim_list", "touch_list"];
            }