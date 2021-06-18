# CogScript Overview

Cognitive Task scripting language for the M2C2 Cog Engine on Android and iOS.

TODO
-explain how a cogtask is programmed by writing the login for 1 trial
-brief about block/trialsets/params

# Sample Cog Task

See script/newscript/newscript.js for a blank cognitive task script. Copy this file for a starting point.

# Directory structure

For a cognitive task to be read by the engine, it must be in a directory "script/COGTASK_NAME/COGTASK_NAME.js".

If a file "script/COGTASK_NAME/COGTASK_NAME.json" is included, it will be read in as the resource.

# Functions to implement in a script file

## Functions called once when cognitive task is started

The following are the functions that are called exactly once at the beginning of the cog task.

### Init()

This function is where all the initial setup for the entire cognitive task should be. It should initialize global variables for the cogtask. These are variables that will persist between trials.

Example:

    function Init()
    { 

        SetName(GetName());
    }

### GetName()

This function should return the string name of the cognitive task.

Example:

    function GetName()
    { 
        return "CogTask-Demo";
    }

### GetInstructions()

This function should return a string array with the instructions where each entry is one line of instructions OR a 2d string array where each entry in the array is one page.

Example:

    function GetInstructions()
    {
    return [ "These are the instructions", "Follow them."];
    }

### LoadImages()

This function should contain the loading functions for all images that are used in this cognitive task.

Example:

    function LoadImages()
    {
        imText = GImage_Create.CreateTextImage("Hello this a demo.", 32, true);
    }

### DrawBlockTransition() - optional

This function should contain the draw commands for what is displayed on the screen during a block transition. Not including this function will use the default block transition screen.

Example:

    function DrawBlockTransition()
    {
        GameEngine.ResetColor();
        GameDraw.DrawBox(0,0,GameEngine.GetWidth(), GameEngine.GetHeight());
        GameEngine.SetColor(1,0,0);
        GameDraw.DrawBox(50,50,50,50);
    }

### GenerateTrialSet() - optional

This function is used if specific instructions are needed for generating each trial set. 

It should only be used if parameters need to be added to each individual trial during generation. This would be required if the generation of an individual trial depends on the generation of all the trials. For example, if a cognitive task requires exactly one half of the trials are type A and one half are type B. Cognitive tasks with trials that are completely independent from the other trials should omit this function.

## Functions called every trial


### Start()

This function is called at the beginning of each trial. This is where all the initial values for an individual trial should be set. Create all variables and objects needed for the trial here.

This is where most of the parameters for the trial should be handled. Use functions such as GetParamInt() and GetParamString() to use the values for this specific trial.

### Update()

This function is called once per cycle. This is where the core update logic for the trial should be. Things like entity movement and handling state/phase of a trial are found here.

### Draw()

This is where all the drawing for a trial should be. All of the draw commands for the trial go here.

### OnClickDown(), OnClickUp(), OnClickMove()

These functions handle the click/touches of the trial. There are 3 different events, click down, click up, and click move. The x,y coordinates give the location and the "clickInfo" object gives some extra information such as when the event occurred in milliseconds. This is where the trial handles touches, button presses, and other interactions. Response times can be calculated from the recorded time value in this function.

Example:

    function OnClickDown(x,y,clickInfo)
    {
        responseTime = clickInfo.GetTime() - holdTime;
    }

### ExportData()

This is where all the data for a trial is recorded. Use the function AddResult() to add one key/value pair to the results.

Example:

    AddResult("responseTime", "" + responseTime);

# Key functions to use in a script file

### CallEndTrial()

Call this to end the current trial. The ExportData() function will then be called automatically and the next trial will begin. If this is the final trial, the cogtask will end.

### GetParamInt(), GetParamString(), GetParamBool(), GetParamColor()

These functions get a parameter for the current trial. The first argument is the name of the parameter to find. The second argument is the default value to use if the parameter is not found.

Example:

    upperBounds = GetParamInt("upperbounds", 100);
    lowerBounds = GetParamInt("lowerbounds", 0);
    displayText = GetParamString("displaytext", "choose a number between the bounds");

### GImage_Create.CreateTextImage(), GImage_Create.CreateButtonSet()

These functions are used to create image sets to use in the cogtask. They should all be called in the LoadImages() function. 

Example:
    imTextEvenOrOdd = GImage_Create.CreateTextImage("is this number\n even or odd?", 32, true);
    imSetButtonEven = GImage_Create.CreateButtonSet("even", 32, true, 150, 100);
    imSetButtonOdd = GImage_Create.CreateButtonSet("odd", 32, true, 150, 100);

### CreateTrigger()

This function is used to create an instance of the KTrigger type. This object is used to handle timing. For example, if an image is to be displayed on the screen for 1000 milliseconds.

Example:

    displayTrigger = CreateTrigger(1000);

    displayTrigger.Start(); // starts the trigger timer

    if (displayTrigger.Check())
    {
        // trigger timer was reached
    }

### KTime.GetMilliTime()

Returns the current time in milliseconds.

### AddEnt()

Adds an entity to the trial's update and draw list. An entity added here will automatically be updated and drawn to the screen.







