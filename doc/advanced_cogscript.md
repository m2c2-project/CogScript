# Simple Cog Task Script

The following is a description of the "advanced" version of writing a cognitive task script. This is the version that should be used if the trials are dependent on each other. For a more simple version see the "simple" cogscript documentation.

# Sample Cog Task

See script/newscript_advanced/newscript_advanced.js for a blank cognitive task script. Copy this file for a starting point.


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

This function should return a string array with the instructions where each entry is one line of instructions OR a 2d string array where each entry in the array is one page. If the instructions are given in the resource json, this function should be omitted. 

Example:

    function GetInstructions()
    {
    return [ "These are the instructions", "Follow them."];
    }

### LoadImages()

This function should contain the loading functions for all images that are used in this cognitive task. Each individual trial may also load images. To do this, include the LoadImages() function in the trial code.

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


### GenerateTrialSet()

This function is used to generate all the trials in a trial set. This is where all the trial parameters should be read and interpreted into the trials.

