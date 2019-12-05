
// NOT FINISHED. DOES NOT CONNECT TO A REAL KTRIGGER.
Include("KTime.js");

class KTrigger
{
    constructor(delay)
    {
     this.delay = delay;
     this.start = -1;
     this.end = -1;
    }

    


    // starts only if the trigger has never been started
    TriggerStart()
    {
      if (this.start < 0)
      {
        this.start = KTime.GetMilliTime();
      }
    }



    Start()
    {
      this.start = KTime.GetMilliTime();
    }

    End()
    {
     this.end = KTime.GetMilliTime();
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
      if (this.end < 0){this.end = holdTime;}
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

     return this.end-this.start;
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