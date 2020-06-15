
Include("Tools.js");

class GMap
{
    constructor()
    {
        this.keyList = new GList();
        this.valList = new GList();
    }

    Get(key)
    {
        for (var i = 0; i < this.keyList.GetSize(); i++)
        {
            if (this.keyList.Get(i) == key)
            {
                return this.valList.Get(i);
            }
        }

        return null;
    }

    Put(key, val)
    {
      
            for (var i = 0; i < this.keyList.GetSize(); i++)
            {
                if (this.keyList.Get(i) == key)
                {
                    // if the key already exists, update the value
                    this.valList.Set(i, val);
                    return;
                }

            }
            
        // if the key wasn't found, add a new one
         this.keyList.Add(key);
         this.valList.Add(val);
        
    }

    Contains(key)
    {
        for (var i = 0; i < this.keyList.GetSize(); i++)
        {
            if (this.keyList.Get(i) == key)
            {
                return true;
            }
        }

        return false;
    }



    CreateJSMap()
    {
      var ret = [];

      for (var i = 0; i < this.keyList.GetSize(); i++)
      {
        ret[this.keyList.Get(i)] = this.valList.Get(i);
      }

      return ret;

    }




    static CreateMap(keyArr, valArr)
    {
       // must be same size arrays

       var map = new GMap();

        // copy all the params to the map
            for (var i = 0; i < keyArr.length; i++)
            {
              map.Put(keyArr[i], valArr[i]);
            }


       return map;

    }

   


}