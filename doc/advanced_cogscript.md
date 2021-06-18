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

Example:

    function GenerateTrialSet()
    {
        var trialSetParam = CopyParams(); // copy the current parameters to read from

        var trialNum = trialSetParam.GetInt("TrialNum", 0); // Get Integer from parameters

        for (var i = 0; i < trialNum; i++)
        {
            AddTrial(new MyTrial(trialSetParam, i)); // create trialNum Trials and pass the parameters to the Trial constructor
        }
    }

CopyParams() must be used to get an instance of the GameParams object for the current Trial Set. See "game_parameters.md" for more information about GameParams.

## Trial class

This is a class that you must extend to create a custom Trial for your cognitive task. All of the functions given below go inside of this class.

Here is how you define it:

    class MyTrial extends Trial
    {   
        // all of the remaining functions given below go inside of this function
    }

### Constructor

The constructor is the function that is used to create a new instance of your Trial. You can define whatever parameters are needed here to pass into the trial to use during the life of the trial. The only requirement is an instance of GameParams which you will pass to the super class with the "super()" call. You must start variable names with "this." in order to use them within the custom Trial class.

    constructor(params, myvalue)
    {
        // required
       super(params);
       this.params = params; 

      // all other values and setting values here is optional
       this.myvalue = myvalue;
    }

### LoadImages()

This function is called during initialization for each Trial. This is where you load images which are used for the current Trial only. For example, if you have text which is only displayed in one trial.

    LoadImages()
    {
      this.imText = GImage_Create.CreateTextImage("This is trial number " + trialNumber,32, true);
    }

### Start()

This is the function that is run when the trial first starts. All initial values and starting logic should be done here.

    Start()
    {
      this.startTime = KTime.GetMilliTime();

      this.ent = new Entity(imApple, 50, 50);
      this.AddEnt(ent);

      this.phase = 0;
    }

### Update()

This function is called once per cycle. This is where the core update logic for the trial should be. Things like entity movement and handling state/phase of a trial are found here.

### Draw()

This is where all the drawing for a trial should be. All of the draw commands for the trial go here.

### OnClickDown(), OnClickUp(), OnClickMove()

These functions handle the click/touches of the trial. There are 3 different events, click down, click up, and click move. The x,y coordinates give the location and the "clickInfo" object gives some extra information such as when the event occurred in milliseconds. This is where the trial handles touches, button presses, and other interactions. Response times can be calculated from the recorded time value in this function.

Example:

    OnClickDown(x,y,clickInfo)
    {
        this.responseTime = clickInfo.GetTime() - this.holdTime;
    }

### ExportData()

This is where all the data for a trial is recorded. Use the function AddResult() to add one key/value pair to the results.

Example:

    AddResult("responseTime", "" + this.responseTime);


# Functions to call within the Trial class

### this.CallEndTrial()

Call this to end the current trial. The ExportData() function will then be called automatically and the next trial will begin. If this is the final trial, the cogtask will end.

### AddResult()

Call this function in the ExportData() function. This adds one key value pair to the trial's results.

    AddResult("responseTime", "" + this.responseTime);