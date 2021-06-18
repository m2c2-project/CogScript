# Game Parameters

The Game Parameters are handled by the GameParams class in GameParams.js.

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


