
// NOT FINISHED. DOES NOT CONNECT TO A REAL KTRIGGER.
Include("KTime.js");

class KTrigger
{
    constructor(delay, index)
    {
     this.delay = delay;
     this.start = -1;
     this.end = -1;

     this.index = index; // index of the trigger in the native code
    }
    // native trigger only used for actual display time.
    


    // starts only if the trigger has never been started
    TriggerStart()
    {
      if (this.start < 0)
      {
        //this.start = KTime.GetMilliTime();
        this.Start();
      }
    }


    Reset()
    {
        this.start = -1;
        this.end = -1;
    }



    Start()
    {
      if (this.start < 0)
      {
       this.start = KTime.GetMilliTime();
       TriggerStart(this.index); // this is the Global TriggerStart function that calls the native Trigger_Start function
      }
    }

    End()
    {
     this.end = KTime.GetMilliTime();
     TriggerEnd(this.index);
    }

    GetTime()
    {
      if (this.start < 0){return -1;}
      // returns elapsed time since start
      return KTime.GetMilliTime() - this.start;
      
    }

    GetTimePerc()
    {
        if (this.start < 0){return -1;}

        var get = KTime.GetMilliTime() - this.start;
        
        return get*1.0/this.delay;
    }

    Check()
    {
    // a delay less than zero always returns false
     if (this.delay < 0){return false;}



     // returns true when the delay time is finished
     var holdTime = KTime.GetMilliTime();
     var  diffTime = holdTime - this.start;
     if (diffTime >= this.delay)
     {
      if (this.end < 0)
      {
           this.end = holdTime;
           TriggerEnd(this.index);
     }
      return true;
     }

     return false;
    }

    // make a list of frames to capture in a row in case they were thrown out by the game engine
    WatchDraw()
    {
     // should be run in the Game's draw method to capture the first frame after the trigger was started
/*
         if (start > 0 && startFrameList.GetSize() < maxFrameHold) // has the trigger started
         {
             startFrameList.Add(GameDraw.GetCurrentDrawCommandFrame());
         }

        if (end > 0 && endFrameList.GetSize() < maxFrameHold) // has the trigger ended
        {
            endFrameList.Add(GameDraw.GetCurrentDrawCommandFrame());
        }*/


    }

    GetActualDisplayTime()
    {
        /*
        GameDraw.DrawCommandFrame startFrame = null;
        GameDraw.DrawCommandFrame endFrame = null;

        for (int i = 0; i < startFrameList.GetSize(); i++)
        {
          if (startFrameList.Get(i).drawn)
          {
           startFrame = startFrameList.Get(i);
          }
        }

        for (int i = 0; i < endFrameList.GetSize(); i++)
        {
            if (endFrameList.Get(i).drawn)
            {
                endFrame = endFrameList.Get(i);
            }
        }


     if (endFrame == null || startFrame == null){return -1;}
     return endFrame.endTime - startFrame.endTime;*/
     //if (this.end == -1 || this.start == -1){return -1;}
    // return this.end-this.start;

     return TriggerGetActualDisplayTime(this.index);
    }

    GetTargetTime()
    {
        return this.GetDelay();
    }

    GetDelay()
    {
     return this.delay;
    }

    GetActual()
    {
     return this.end-this.start;
    }

    GetStartTime()
    {
        return this.start;
    }

    GetEndTime()
    {
        return this.end;
    }



    





/*
    int maxFrameHold = 5; // number of frames to hold. multiple may be needed because the GameEngine occasionally throws out a frame if it is not needed.
    GList<GameDraw.DrawCommandFrame> startFrameList = new GList<GameDraw.DrawCommandFrame>();
    GList<GameDraw.DrawCommandFrame> endFrameList = new GList<GameDraw.DrawCommandFrame>();

    long delay;

    long start = -1;
    long end = -1;
*/

  

}