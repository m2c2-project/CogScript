Include("Entity.js");
Include("Tools.js");
Include("GButton.js");
Include("GImage_Create.js");

// --------------------------------
// Global Cog Task Functions
// --------------------------------

function Init()
{ 
 

  // global cogtask variables
  SetName(GetName());

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


   // LoadAllParamImages(gameParams, "CueScreenInstructions", 25);
  //  LoadAllParamImages(gameParams, "ResponseScreenInstructions", 25);



    imCueText = GImage_Create.CreateTextImage(cueText, 25, true);//GImage_Create.CreateKTextImage(surveyData, gameScreen, cueText, 25, true);
    imResponseText = GImage_Create.CreateTextImage(responseText, 25, true); //GImage_Create.CreateKTextImage(surveyData, gameScreen, responseText, 25, true);

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
      
    boxH = GetParam("frameHeight", defaultBoxH);

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

    trackingItems = GetParam("targetStimCount", 3);
    distractorItems = GetParam("distractorStimCount", 4);

    cueBeforeTime = GetParam("cueBeforeTime", 200);
    cueBlinkTime =  GetParam("cueBlinkTime", 500);
    cueShowTime =  GetParam("cueShowTime", 1000);
    cueAfterTime =  GetParam("cueAfterTime", 200);


    movementTime =  GetParam("movementTime", 5000);



    responseTimeoutTime =  GetParam("responseTimeout", -1);


    feedbackTime =  GetParam("feedbackTime", 1000);

    showAllFeedbackValues = GetParam("showAllFeedbackStim", false);

    minResponseCount =  GetParam("minResponseCount", 0); //-1 - sets to targetStimCount
    maxResponseCount =  GetParam("maxResponseCount", -1); //-1 - sets to targetStimCount, 0 = infinite

    if (maxResponseCount < 0){maxResponseCount = trackingItems;}
    if (minResponseCount < 0){minResponseCount = trackingItems;}

    stimR =  GetParam("stimradius", 25);
    stimRepulseFactor =  GetParam("stimrepulsefactor", 2);

    stimTouchFactor = GetParam("stimtouchfactor", 1.3);
    LogMan.Log("DOLPH_MOT", "stim touch factor: " + stimTouchFactor);
    stimSpeed =  GetParam("stimspeed", 3.0);



     targetStimColor = GetParamColor("targetStimColor", "0,176,80");
   wrongFeedbackStimColor = GetParamColor("incorrectColor", "255,0,0");
   inactiveColor = GetParamColor("standardStimColor", "127,127,127");



   stimSelectColor = GetParamColor("selectedColor", "91,155,213");

   feedbackOutlineColor = GetParamColor("feedbackOutlineColor", stimSelectColor.GetColorStr());





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





function Update()
{
         


}

function Draw()
{


        
}


function OnClickDown(x,y,clickTime)
{
  
   CallEndTrial();
}

function OnClickUp(x,y,clickTime)
{
 
}

function OnClickMove(x,y,clickTime)
{
  
}





function ExportData()
{
 
          
}