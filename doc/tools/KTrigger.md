# KTrigger class

Used for timing. Sets a target value to wait for, and records when if it has been reached.

### To construct use CreateTrigger()

You must use the CreateTrigger() global function to create a KTrigger.

CreateTrigger(delay:Int)

delay - target amount of time in milliseconds this trigger is set for.

    startTimer = CreateTrigger(1000)

### Start()

Start the trigger. Can only be called once unless Reset() is called.

### End()

Ends the trigger and marks the ending time. This typically is not used, instead use Check()

### Check()

Checks to see if the trigger has reached its time target yet. When it does reach its time target, it records the time that the trigger reached it.

returns true if it has reached its target. returns false otherwise.

    if (startTimer.Check())
    {
        // start timer ended!
        phase = 2;
    }

### GetActual()

returns the actual ms time that the trigger was running (it doesn't match up exactly to the target because of game cycle timing)

### GetActualDisplayTime()

returns the actual time in ms between the first frame was drawn after it started and the last frame that was drawn after it ended. This can be used to export in the data to get information about how long an image was actually seen on screen.

