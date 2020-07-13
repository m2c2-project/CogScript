Include("KTrigger.js");
Include("GMap.js");
Include("GameParams.js");
Include("Trial.js");




// There are two types of scripts
// Simple Script: the trials are hidden from the script creator. functions like Start(), Update(), Draw() are overwritten.
// Trial Based Script: the script creator generates a class that extends Trial and all its methods.

function GameRunner_Init(paramKeyList, paramValList)
{
  usedParams = new GList();

  curTrial = null;

  trialList = new GList();

   trialEntList = new GList();

   curParams = LoadParams(paramKeyList, paramValList);


    Init();


}

function AddTrial(trial)
{
  trialList.Add(trial);
}

function GameRunner_GenerateTrialSet(paramKeyList, paramValList)
{
  // this function handles two styles of trial generation for a script cog task
  // basic: 1. all trial functions are handled by global functions (ie Start(), Update(), Draw(), OnClickDown(), ...)
  //        2. this is the default style that will be used
  //        3. no information can be passed between trials. 
  //        4. GenerateTrialSet is called and the resulting parameters for each trial are held 
  //            in the native code and re sent to the script as the trial starts in "Start()"
  // advanced: 1. trials are handled within a class inherited from Trial
  //           2. this style will be used if any trials are added to "trialList".
  //           3. use this style if information must be passed or remembered between trials
  //           4. each Trial class in the script saves its own parameters and holds them in the script
  //           5. blocks and trial sets are handled by the native. all trials are save in "trialList" in the order they will be used.


   // do not run this function if GenerateTrialSet() is not defined
  if (typeof(GenerateTrialSet) === 'undefined')
  {
    return [];
  }

  // map of trial params for this trial set
  curParams = LoadParams(paramKeyList, paramValList);

 // the list of trial param maps to send back to the native app to generate one TrialSet
 generateTrialParamList = new GList();

 // hold the starting trial list size for calulating the added new trials
 var startingTrialListSize = trialList.GetSize();

 GenerateTrialSet();

 // returns the list of trial set maps in v8 format
 var retList = [];

  // go through each value to send back and add to v8 array
 for (var i = 0; i < generateTrialParamList.GetSize(); i++)
 {
   retList.push(generateTrialParamList.Get(i).varMap.CreateJSMap());
 }

 // if no parameters were added, go through the trial list and add all parameters
 if (retList.length == 0 && trialList.GetSize() > startingTrialListSize)
 {
   for (var i = startingTrialListSize; i < trialList.GetSize(); i++)
   {
     retList.push(trialList.Get(i).params.varMap.CreateJSMap());
   }
 }

 return retList;
}


function LoadParams(paramKeyList, paramValList)
{
  if (typeof(paramKeyList) === 'undefined')
  {
    return new GameParams();
  }

   // map of trial params for this trial 
   var trialParams = new GameParams(GMap.CreateMap(paramKeyList, paramValList));

   return trialParams;
}

function LoadCurParams(paramKeyList, paramValList)
{
  curParams = LoadParams(paramKeyList, paramValList);
}

// called at the start of each trial
function GameRunner_Start(paramKeyList, paramValList)
{
  
  curParams = LoadParams(paramKeyList, paramValList);
   
   // list of used params to send back to native task to determine if any params were unused
   //usedParams = new GList();

    // create empty lists for the export values
    gameResultKey = new GList();
    gameResultVal = new GList();

   // create entity list
   trialEntList = new GList();

   // load images
    GImage.ReloadImages();
    
    // Call Trial Start
    if (trialList.GetSize() > 0)
    {
      curTrial = trialList.PopFirst();
      curTrial.Start();
    }
    else
    {
     Start();
    }
}

function GameRunner_LoadImages()
{
    if (trialList.GetSize() > 0)
    {
       // load images for each trial object
      for (var i = 0; i < trialList.GetSize(); i++)
      {
          trialList.Get(i).LoadImages();
      }
    }

    if (typeof(LoadImages) !== 'undefined')
    {
      LoadImages();
    }

}


function GameRunner_Update()
{
  if (curTrial != null)
  {

    if (curTrial.complete)
    {
      CallEndTrial();
    }
    else
    {
     curTrial.Update();
    }
  }
  else
  {
    // non class based trial
   
    // update all entities before the main update
    for (var i = 0; i < trialEntList.GetSize(); i++)
    {
      trialEntList.Get(i).Update();
    }

    // main update
     Update();
  }


}

function GameRunner_Draw()
{
  drawCommands = new GList();

  if (curTrial != null){curTrial.Draw();}
  else
  {
    // non class based trial
    Draw();

    for (var i = 0; i < trialEntList.GetSize(); i++)
    {
      trialEntList.Get(i).Draw();
    }
  }

  GameEngine.SetColor(0,0,1);
  GameDraw.DrawText("trialList size:" + trialList.GetSize(), 0, 0);
  GameEngine.ResetColor();


  



}

function GameRunner_ClearDrawCommands()
{
  drawCommands = new GList();
}

function GameRunner_DrawBlockTransition()
{
  drawCommands = new GList();
  
  if (typeof(DrawBlockTransition) === 'undefined')
  {
    return false;
  }

  DrawBlockTransition();

  return true;
}


function GameRunner_OnClickDown(x,y,clickTime)
{
  if (curTrial != null){curTrial.OnClickDown(x,y,new ClickInfo(x,y,clickTime, 0));}
  else
  {
   OnClickDown(x,y,new ClickInfo(x,y,clickTime, 0));
  }
}

function GameRunner_OnClickUp(x,y,clickTime)
{
  if (curTrial != null){curTrial.OnClickUp(x,y,new ClickInfo(x,y,clickTime, 0));}
  else
  {
    OnClickUp(x,y,new ClickInfo(x,y,clickTime, 0));
  }
}

function GameRunner_OnClickMove(x,y,clickTime)
{
  if (curTrial != null){curTrial.OnClickMove(x,y,new ClickInfo(x,y,clickTime, 0));}
  else
  {
    OnClickMove(x,y,new ClickInfo(x,y,clickTime, 0));
  }
}

function GameRunner_GetExportIDList()
{
  if (typeof(GetExportIDList) === 'undefined')
  {
    return [];
  }


  return GetExportIDList();

}

function GameRunner_GetInstructions()
{
  if (typeof(GetInstructions)  === 'undefined')
  {
   // no instructions defined
   if (typeof(cog_resource)  !== 'undefined')
   {
     // cog_resource is defined
     
      var instructions = cog_resource["instructions"];
      ReplaceParamInStrArray(instructions);
       return instructions;
   }
    
  }
  else
  {
   return GetInstructions();
  }


  return ["Enter instructions for cog task."];
 
}


function CreateTrigger(delay)
{

 var index = Trigger_CreateTrigger(delay);
 
 var trigger = new KTrigger(delay, index);

 return trigger;
 

}

function TriggerStart(index)
{
  Trigger_Start(index);
}

function TriggerEnd(index)
{
    Trigger_End(index);
}

function TriggerGetActualDisplayTime(index)
{
 return Trigger_GetActualDisplayTime(index);
}


function AddEnt(entity)
{
 
 trialEntList.Add(entity);

}




function CallEndTrial()
{
 //call trial ExportData()
 if (curTrial != null)
 {
    curTrial.ExportData();
 }
 else if (typeof(ExportData) !== 'undefined')
 {
  ExportData();
 }

 // push to native
 PushExportData();

 // Call Native End Trial
 Game_EndTrial();
}

function PushExportData()
{
  keyList = gameResultKey;
  valList = gameResultVal;

   // create arrays to send as exported data for trial
 var keyArr = [];
 var valArr = [];

 for (var i = 0; i < keyList.GetSize(); i++)
 {
   keyArr.push(keyList.Get(i));
   valArr.push(valList.Get(i));
 } 

 // call native Export Data
 Game_ExportData(keyArr, valArr);


 // clear lists
 keyList.RemoveAll();
 valList.RemoveAll();
}

function SetUpdateLastTrial(b)
{

 Game_SetUpdateLastTrial(b);
}

function AddResult(key, val)
{
 gameResultKey.Add(key);
 gameResultVal.Add(""+val);
}





function AddError(str1)
{
 ErrorMan_AddError("in cog task", str1);
}