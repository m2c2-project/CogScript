

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



  GetUsedParams()
  {
    var usedArr = [];
    for (var i = 0; i < usedParams.GetSize(); i++)
    {
      usedArr.push(usedParams.Get(i));
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