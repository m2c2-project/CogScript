
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
  this.Remove(this.GetSize()-1);
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


}