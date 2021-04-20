
Include("Trial.js");

class GNGTestFade extends TrialTest
{
  

    constructor()
    {  
        super();
    
    }
    
    Init()
    {

      //  ErrorMan.AddError("test error");
      //ErrorMan.AddError("DOLPH_COGTEST", "test error");
      LogMan.Log("DOLPH_COGTEST", "init");
      return null;
    }



    StartTrial(trial)
    {
        return null;
    }

    Update(trial)
    {
       // LogMan.Log("DOLPH_COGTEST", "update");

       if (trial.num % 2 == 0)
       {

        
        if (trial.fadeTrigger.GetTime() > 400)
        {
            LogMan.Log("DOLPH_COGTEST", "pressed");
                GameTest_CreateTouch( trial.tapButton.kpos.x + 50, trial.tapButton.kpos.y + 50);
        }

       }
        return null;
    }
    
    EndTrial(trial)
    {
        return null;
    }



}