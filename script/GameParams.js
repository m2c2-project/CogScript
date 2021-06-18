

Include("Tools.js");
Include("GColor.js");

// goal: create GameParam class and still have functions that can be called from Simple Script

class GameParams
{
 constructor(varMap = new GMap())
 {
   this.usedParams = new GList(); // list to keep track of the parameters that have actually been read (used to track parameters that are not actually read from script.)
   this.varMap = varMap;
 }



  // used by a trial to get the params for this individual trial
  Get(key, defaultValue)
  {
    
    // handle the possiblilty of an array of keys (allows multiple key values to be used for the same param)
   if ( Array.isArray(key))
   {
     for (var i = 0; i < key.length; i++)
     {
        if (this.Has(key[i]))
        {
          return this.Get(key[i], defaultValue);
        }
     }

     return defaultValue;
   }


  // add to used value
  this.usedParams.Add(key);


    var r = this.varMap.Get(key.toLowerCase());
    if (r == null){return defaultValue;}


    return r;
  }

  GetString(key, defaultValue)
  {
    return this.Get(key, defaultValue);
  }

  GetInt(key, defaultValue)
  {

  // handle the possiblilty of an array of keys (allows multiple key values to be used for the same param)
  if ( Array.isArray(key))
  {
    for (var i = 0; i < key.length; i++)
    {
       if (this.Has(key[i]))
       {
         return this.GetInt(key[i], defaultValue);
       }
    }

    return defaultValue;
  }

  // add to used value
  this.usedParams.Add(key);

    var r = this.varMap.Get(key.toLowerCase());
    if (r == null){return defaultValue;}


    return ToInt(r);
  }

  GetBool(key, defaultValue)
  {

  // handle the possiblilty of an array of keys (allows multiple key values to be used for the same param)
  if ( Array.isArray(key))
  {
    for (var i = 0; i < key.length; i++)
    {
       if (this.Has(key[i]))
       {
         return this.GetBool(key[i], defaultValue);
       }
    }

    return defaultValue;
  }

  // add to used value
  this.usedParams.Add(key);

    var r = this.varMap.Get(key.toLowerCase());
    if (r == null){return defaultValue;}


    return ToBool(r);
  }

  GetColor(key, defaultValue)
  {
    this.usedParams.Add(key);

    var r = this.varMap.Get(key.toLowerCase());
    if (r == null && defaultValue instanceof GColor){return defaultValue;}
    
    if (r == null)
    {
      r = defaultValue;
    }
    

          var split = r.split(",");
          
          if (split.length < 3)
          {
              split = r.split("_"); // if the commas didn't work, try underscores
              if (split.length < 3)
              {
              //ErrorMan.AddError("", String.format("In attribute \"%s\", did not find color values! Must have r,g,b value for color! Found: %s",varName, val));
              return defaultValue;
              }
          }



          var color = new GColor(ToInt(split[0]), ToInt(split[1]), ToInt(split[2]));

          return color;



  }

  Has(key)
  {
    if (this.varMap.Contains(key.toLowerCase())){return true;}

    return false;
  }

  // copy instance of current parameters
  CopyParamsMap()
  {
  var copyParams = new GMap();
  for (var i = 0; i < this.varMap.keyList.GetSize(); i++)
  {
    copyParams.Put(""+this.varMap.keyList.Get(i), ""+this.varMap.valList.Get(i));
  }

  return copyParams;
  }

  CopyParams()
  {
   // returns a copy of the params
   return new GameParams(this.CopyParamsMap());
  }



  GetUsedParams()
  {
    var usedArr = [];
    for (var i = 0; i < this.usedParams.GetSize(); i++)
    {
      usedArr.push(this.usedParams.Get(i));
    }
    return usedArr;
  }


  Put(key, val)
  {
    this.varMap.Put(key.toLowerCase(), val);
  }



}








/////////////////////////
// Simple Script functions
//////////////////////////




curParams = new GameParams();

// used by a trial to get the params for this individual trial
function GetParam(key, defaultValue)
{
  return curParams.Get(key, defaultValue);
}

function GetParamString(key, defaultValue)
{
  return curParams.Get(key, defaultValue);
}

function GetParamInt(key, defaultValue)
{
  return curParams.GetInt(key, defaultValue);
}

function GetParamBool(key, defaultValue)
{
  return curParams.GetBool(key, defaultValue);
}

function GetParamColor(key, defaultValue)
{
  return curParams.GetColor(key, defaultValue);


}

function HasParam(key)
{
  if (curParams.Has(key.toLowerCase())){return true;}

  return false;
}

// copy instance of current parameters
function CopyParams()
{
 return new GameParams(curParams.CopyParamsMap());
}


// called by native app to get the used params
function GetUsedParams()
{
   return curParams.GetUsedParams();
}




function VarSubParam(text)
{
 // takes in a string and returns a string with all variables subbed in

 return Game_VarSubParam(text);

}

function LoadAllParamImages(paramValue, size)
{
   // loads all images within param and sub params for the particular paramValue
   // example: paramValue="InstructionText" loads text for each instance of "InstructionText" for all sub params
   Game_LoadAllParamImages(paramValue, size);
}

function ReadParamImage(text, defaultImage)
{
 // returns the image associated with the "text"
 // if it is not found, return the default image

 var ret = Game_ReadParamImage(text);

 if (ret == -1){return defaultImage;}


 var image = new GImage();

 image.SetImage(ret);

 return image;



}


// reads a string array and replaces all instances of curly braces with the correct parameter
function ReplaceParamInStrArray(inArr)
{
  for (var i = 0; i < inArr.length; i++)
  {
   if (Array.isArray(inArr[i]))
   {
    // if inArr[i] is an array, replace all elements of the array
     ReplaceParamInStrArray(inArr[i]);
   }
   else
   {
    // inArr[i] is a string, substitute params.
    var matches = inArr[i].match("{[A-Za-z]+}");
    if (matches != null)
    {
      
      for (var j = 0; j < matches.length; j++)
      {
    
        while (true)
        {  
           // ex: {TrialNum}
          var newline = inArr[i].replace(matches[j], GetParam(matches[j].replace("{","").replace("}","")));
          if (newline === inArr[i]){break;} // continue to replace until all replacements are made.
          inArr[i] = newline; 
        }
      
      }
    }
   }
 
  }

  return inArr;
}