# CogScript Overview

Cognitive Task scripting language for the M2C2 Cog Engine on Android and iOS.

# Sample Cog Task

See script/newscript/newscript.js for a blank cognitive task script. Copy this file for a starting point.

# Directory structure

For a cognitive task to be read by the engine, it must be in a directory "script/COGTASK_NAME/COGTASK_NAME.js".

If a file "script/COGTASK_NAME/COGTASK_NAME.json" is included, it will be read in as the resource.

# Default functions in a script file

## Functions read in once upon cogtask start

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

It should only be used if parameters need to be added to each individual trial during generation. This would be required if the generation of an individual trial depends on the generation of all the trials. For example, if a cognitive task requires that exactly one half of the trials are type A and one half are type B.



