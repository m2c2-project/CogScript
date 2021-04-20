
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

    GoPress(trial)
    {
        this.touchReady = 0;
        LogMan.Log("DOLPH_COGTEST", "pressed");
        GameTest_CreateTouch( trial.tapButton.kpos.x + 50, trial.tapButton.kpos.y + 50);
    }

    Update(trial)
    {

        // go trial
        if (trial.num == 1 && trial.fadeTrigger.GetTimePerc() >= .85 && this.touchReady == 1)
        {
           this.GoPress(trial);
        }
        // go trial
        if (trial.num == 3 && trial.fadeTrigger.GetTimePerc() >= .15 && this.touchReady == 1)
        {
            this.GoPress(trial);
        }
        // go trial
        if (trial.num == 5 && trial.fadeTrigger.GetTimePerc() >= .8 && this.touchReady == 1)
        {
            this.GoPress(trial);
        }
        // RA: 1
        if (trial.num == 6 && trial.fadeTrigger.GetTimePerc() >= .5 && this.touchReady == 1)
        {
            this.GoPress(trial);
        }

        //RA: 4b, trial 8 , previous trial should be type 0 untouched
        if (trial.num == 8 && trial.fadeTrigger.GetTimePerc() >= .5 && this.touchReady == 1)
        {
            this.GoPress(trial);
            this.touchReady = 2;
        }
        // RA: 2, trial 7
        if (trial.num == 8 && trial.fadeTrigger.GetTimePerc() >= .75 && this.touchReady == 2)
        {
            this.GoPress(trial);
        }

        // RA: 4a, trial 10, previous trial should be type 1 untouched
        if (trial.num == 10 && trial.fadeTrigger.GetTimePerc() >= .5 && this.touchReady == 1)
        {
            this.GoPress(trial);
        }
        // RA: 4c1, trial 12
        if (trial.num == 12 && trial.fadeTrigger.GetTimePerc() >= .65 && this.touchReady == 1)
        {
            this.GoPress(trial);
        }
        // RA: 4c2, trial 13
        if (trial.num == 14 && trial.fadeTrigger.GetTimePerc() >= .45 && this.touchReady == 1)
        {
            this.GoPress(trial);
        }
      
       // LogMan.Log("DOLPH_COGTEST", "update");
       
       // pulse one touch
    /*   if (trial.num < 5 && this.touchReady == 1)
       {
        if (trial.num % 2 == 0)
        {

            
            if (trial.fadeTrigger.GetTimePerc() >= .5)
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

      }*/



      
        return null;
    }
    
    EndTrial(trial)
    {
        return null;
    }



}