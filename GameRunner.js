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

   // do not run this function if GenerateTrialSet() is not defined
  if (typeof(GenerateTrialSet) === 'undefined')
  {
    return [];
  }

  // map of trial params for this trial set
  curParams = LoadParams(paramKeyList, paramValList);

 // the list of trial param maps to send back to the native app to generate one TrialSet
 generateTrialParamList = new GList();

 GenerateTrialSet();

 // returns the list of trial set maps in v8 format
 var retList = [];

  // go through each value to send back and add to v8 array
 for (var i = 0; i < generateTrialParamList.GetSize(); i++)
 {
   retList.push(generateTrialParamList.Get(i).varMap.CreateJSMap());
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


function CreateTrigger(delay)
{
 // will add connection to outer engine later
 
 var trigger = new KTrigger(delay);

 return trigger;
 

}

function AddEnt(entity)
{
 
 trialEntList.Add(entity);

}




function CallEndTrial()
{
 //call trial ExportData()
 if (typeof(ExportData) !== 'undefined')
 {
  ExportData();
 }


 // create arrays to send as exported data for trial
 var keyArr = [];
 var valArr = [];

 for (var i = 0; i < gameResultKey.GetSize(); i++)
 {
   keyArr.push(gameResultKey.Get(i));
   valArr.push(gameResultVal.Get(i));
 } 

 // call native Export Data
 Game_ExportData(keyArr, valArr);

 // Call Native End Trial
 Game_EndTrial();
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