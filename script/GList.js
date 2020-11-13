
class GList
{
 constructor()
 {
  this.arr = [];
 }
 
 Add(val)
 {
  this.arr.push(val);
 }

 AddArray(arr)
 {
   for (var i = 0; i < arr.length; i++)
   {
    this.arr.push(arr[i]);
   }
 }

 AddAll(oList)
 {
  for (var i = 0; i < oList.GetSize(); i++)
  {
    this.Add(oList.Get(i));
  }
 }

 Set(index, val)
 {
  this.arr[index] = val;

 }
 
 Get(i)
 {
  return this.arr[i];
 }
 
 GetSize()
 {
  return this.arr.length;
 }

 PopFirst()
 {
   var ret = this.arr[0];
   this.Remove(0);

   return ret;
 }

 GetLast()
 {
  if (this.GetSize() <= 0){return null;}
  return this.Get(this.GetSize()-1);
 }

 RemoveLast()
 {
  if (this.GetSize() > 0)
  {
   this.Remove(this.GetSize()-1);
  }
 }

 Remove(i)
 {
   this.arr.splice(i,1);
 }





 

 RemoveAll()
 {
  this.arr = [];
 }

 PopRandom()
 {
   var i = Math.floor(Math.random()*this.arr.length);
   var ret = this.Get(i);


   this.Remove(i);
   


   return ret;
 }

 GetRandom()
 {
  var i = Math.floor(Math.random()*this.arr.length);
   var ret = this.Get(i);

   return ret;
 }

 Randomize()
 {
  var holdList = new GList();
  holdList.AddAll(this);

  this.RemoveAll();
  while (holdList.GetSize() > 0)
  {
   this.Add(holdList.PopRandom());
  }
 }




 FindElement(e)
 {
   // finds an element and returns the index

   for (var i = 0; i < this.GetSize(); i++)
   {
    if (this.Get(i) == e)
    {
        return i;
    } 
   }


   return -1;


 }


}