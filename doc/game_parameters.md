# Game Parameters

The Game Parameters are handled by the GameParams class in GameParams.js.

## Game Parameters overview

Game parameters are setup as a set of nested parameters. There are 3 different levels of parameters:

1. Global Parameters
2. Block Parameters
3. Trial Set Parameters

The parameters are inherited from its parent parameter. If there is a conflict (aka a parameter is redefined) the child's parameter is used. For example, if a block defines the parameter "upperBounds"="100" and the trial set within it defines the parameter "upperBounds"="90", the trial set will get the parameter "upperBounds"="90".

If blocks and trial sets are not defined, every trial will use the Global Parameters.

The parameters will be automatically given to the script by the Game Engine. These will be handled by the app that is running the cognitive task. Each trial only needs to know how to handle its own parameters.

All parameter keys are case insensitive.

## Restricted parameters

There are some parameter key names which are restricted because they have values which are already defined:

- "TrialNum"-the number of trials
- "RandomizeBlocks"- true or false. when true, the blocks in the cogtask are randomized. Otherwise, they are presented in order.
- "RandomizeTrialSets"- true or false. when true, the trialsets in this block are randomized. Otherwise, they are presented in order.
- "type" - type of cogtask being run
- "script" - script type to run
- "scriptDir" - location of script files
- "debug" - true or false, sets debug mode on or off
- "displayName" - name to display to the user
- "exportName" - name used in the export data
- "instructions" - true or false. sets instruction screen on or off.

## Simple CogTasks

To get the parameters for the current trial, use the GetParamString(), GetParamInt(), GetParamBool(), and GetParamColor() functions.

The first argument is a string for the name of the parameter, the second argument is the default value if that parameter is not found.

Example:

    var number = GetParamInt("mynumber", 0); // gets integer value of "mynumber". If it does not exist, it returns 0.
    var name = GetParamString("myname", "john doe"); // gets string value of "myname". If it does not exist, it returns "john doe".
    var useImages = GetParamBool("useImages", false); // gets boolean value of "useImages". If it does not exist, it returns false.
    var backgroundColor = GetParamColor("backgroundColor", new GColor(1,1,1)); // gets color value of "backgroundColor". If it does not exist it returns white. This function handles colors in this format "R,G,B" and only integers are accepted!

## Advanced CogTasks

Advanced cogtasks should use the GameParams object for the trial. Simple cogtasks can also use these if needed.

To get the GameParams object for the current trial:

    var trialSetParams = CopyParams();

You typically will use this value within the GenerateTrialSet() function. See "advanced_cogscript.md".

### GameParams Functions

The functions for the GameParams object are similar to the Simple Cogtask parameter functions except you call them from the object. These functions are GetInt(), GetString(), GetBool(), and GetColor().

    var number = trialSetParams.GetInt("mynumber", 0); // gets integer value of "mynumber". If it does not exist, it returns 0.
    var name = trialSetParams.GetString("myname", "john doe"); // gets string value of "myname". If it does not exist, it returns "john doe".
    var useImages = trialSetParams.GetBool("useImages", false); // gets boolean value of "useImages". If it does not exist, it returns false.
    var backgroundColor = trialSetParams.GetColor("backgroundColor", new GColor(1,1,1)); // gets color value of "backgroundColor". If it does not exist it returns white. This function handles colors in this format "R,G,B" and only integers are accepted!

This class contains other functions:

#### Has(key: String)

This function returns true if the GameParams object contains a key value pair with the given key. Returns false otherwise.

#### CopyParams()

Returns an object that is an exact copy of these params. Useful if you are modifying the given parameters.

#### Put(key:String, val:String)

Puts a key value pair in the GameParams object. Useful if you want to dynamically set parameters that were not originally set.

#### GetUsedParams()

Returns an array of all the params that were used in these GameParams. Useful for error handling parameters that were set but not used in the trial.


