
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
        this.touchReady = 1;
        return null;
    }

    Update(trial)
    {
       
       // LogMan.Log("DOLPH_COGTEST", "update");
       
       // pulse one touch
       if (trial.num < 5 && this.touchReady == 0)
       {
        if (trial.num % 2 == 0)
        {

            
            if (trial.fadeTrigger.GetTime() > 400)
            {
                this.touchReady = 0;
                LogMan.Log("DOLPH_COGTEST", "pressed");
                    GameTest_CreateTouch( trial.tapButton.kpos.x + 50, trial.tapButton.kpos.y + 50);
            }

        }
      }

     // hold down, continuous touches
      if (trial.num >= 5)
      {
        if (trial.num % 2 == 0)
        {

            
            if (trial.fadeTrigger.GetTime() > 400)
            {
                
                LogMan.Log("DOLPH_COGTEST", "pressed");
                    GameTest_CreateTouch( trial.tapButton.kpos.x + 50, trial.tapButton.kpos.y + 50);
            }

        }

      }



      
        return null;
    }
    
    EndTrial(trial)
    {
        return null;
    }



}