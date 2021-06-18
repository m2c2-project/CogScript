
# Tools/Utility functions for CogScripts

### KTime.GetMilliTime() and GameEngine.GetMilliTime()

Returns the current time in milliseconds. Used for timing operations.

### AddEnt()

Adds an entity to the trial's update and draw list. An entity added here will automatically be updated and drawn to the screen.

Example: 

        ent = new Entity(imApple, 50, 50);
        AddEnt(ent);

### CreateTrigger()

This function is used to create an instance of the KTrigger type. This object is used to handle timing. For example, if an image is to be displayed on the screen for 1000 milliseconds.

See KTrigger.md

Example:

    displayTrigger = CreateTrigger(1000);

    displayTrigger.Start(); // starts the trigger timer

    if (displayTrigger.Check())
    {
        // trigger timer was reached
    }

### GameEngine.GetAcc()

Returns an array of 3 values for the x,y, and z values from the accelerometer.

Example:

     var acc = GameEngine.GetAcc();

     GameDraw.DrawText("x:" + acc[0] + "y:" + acc[1] + "z:" + acc[2], 10, 100);

